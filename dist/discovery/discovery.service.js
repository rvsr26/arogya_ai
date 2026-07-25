var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { DatabaseService } from '../database/database.service.js';
/**
 * Read-side logic for doctor discovery and slot comparison.
 * Keeps Mongo queries and query-normalisation out of the tool controllers.
 */
let DiscoveryService = class DiscoveryService {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Normalise loose user input ("Cardiologist", "heart doctor", "CARDIO") into
     * a regex-safe token we can match against `specialtySlug`, `specialty` and
     * `specialtyAliases`.
     */
    normalise(value) {
        return value.trim().toLowerCase().replace(/\s+/g, ' ');
    }
    escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * Search the directory. Both filters are optional and both are fuzzy:
     * specialty matches display name / slug / aliases, city matches a prefix so
     * "pune" finds "Pune". Results are enriched with live slot availability.
     */
    async searchDoctors(params) {
        const doctorModel = await this.db.doctors();
        const filter = {};
        if (params.specialty) {
            const token = this.escapeRegex(this.normalise(params.specialty));
            // Strip a trailing "ist"/"y" so "cardiologist" also hits "cardiology".
            const stem = token.replace(/(ists?|ians?|y|ics?)$/u, '');
            const pattern = new RegExp(stem.length >= 4 ? stem : token, 'i');
            filter.$or = [
                { specialty: pattern },
                { specialtySlug: pattern },
                { specialtyAliases: pattern },
            ];
        }
        if (params.city) {
            filter.city = new RegExp(`^${this.escapeRegex(this.normalise(params.city))}`, 'i');
        }
        if (typeof params.maxFee === 'number') {
            filter.consultationFee = { $lte: params.maxFee };
        }
        if (typeof params.minRating === 'number') {
            filter.rating = { $gte: params.minRating };
        }
        if (typeof params.acceptsInsurance === 'boolean') {
            filter.acceptsInsurance = params.acceptsInsurance;
        }
        let sortQuery = { rating: -1, experienceYears: -1 };
        if (params.sortBy === 'distance') {
            sortQuery = { distance: 1 };
        }
        else if (params.sortBy === 'fee') {
            sortQuery = { consultationFee: 1 };
        }
        const docs = await doctorModel
            .find(filter)
            .sort(sortQuery)
            .limit(params.limit)
            .lean()
            .exec();
        let cards = await Promise.all(docs.map((doc) => this.toCard(doc)));
        // Filter by availability date if requested
        if (params.date) {
            cards = cards.filter((card) => card.nextAvailable?.startsWith(params.date));
        }
        if (params.sortBy === 'earliest') {
            cards.sort((a, b) => {
                if (!a.nextAvailable)
                    return 1;
                if (!b.nextAvailable)
                    return -1;
                return a.nextAvailable.localeCompare(b.nextAvailable);
            });
        }
        let recommendation = undefined;
        if (cards.length > 0) {
            const top = cards[0];
            recommendation = `I recommend Dr. ${top.name} because:
• Highly rated (${top.rating}★)
• Consultation fee is ₹${top.consultationFee}
• Only ${top.distance} km away
• ${top.acceptsInsurance ? 'Accepts your insurance' : 'Does not accept insurance'}`;
        }
        return {
            doctors: cards,
            matchedSpecialty: docs[0]?.specialty ?? null,
            matchedCity: docs[0]?.city ?? null,
            recommendation,
        };
    }
    /** Attach live availability figures to a directory row. */
    async toCard(doc) {
        const slotModel = await this.db.slots();
        const open = await slotModel
            .find({ doctorId: doc.doctorId, status: 'available' })
            .sort({ date: 1, startTime: 1 })
            .lean()
            .exec();
        const first = open[0];
        return {
            doctorId: doc.doctorId,
            name: doc.name,
            specialty: doc.specialty,
            city: doc.city,
            hospital: doc.hospital,
            address: doc.address,
            qualifications: doc.qualifications,
            experienceYears: doc.experienceYears,
            languages: doc.languages ?? [],
            consultationFee: doc.consultationFee,
            currency: doc.currency ?? 'INR',
            rating: doc.rating,
            reviewCount: doc.reviewCount,
            imageUrl: doc.imageUrl,
            bio: doc.bio ?? '',
            acceptsInsurance: doc.acceptsInsurance ?? false,
            distance: doc.distance ?? 0,
            estimatedWaitingTime: doc.estimatedWaitingTime ?? 15,
            openSlotCount: open.length,
            nextAvailable: first ? `${first.date} ${first.startTime}` : null,
        };
    }
    /**
     * Build one comparison column per requested doctor for a single date.
     * Unknown doctor ids are reported back rather than silently dropped so the
     * model can correct itself.
     */
    async compareSlots(params) {
        const doctorModel = await this.db.doctors();
        const slotModel = await this.db.slots();
        const docs = await doctorModel
            .find({ doctorId: { $in: params.doctorIds } })
            .lean()
            .exec();
        const byId = new Map(docs.map((doc) => [doc.doctorId, doc]));
        const unknownDoctorIds = params.doctorIds.filter((id) => !byId.has(id));
        const columns = [];
        // Preserve the caller's ordering so "first two cardiologists" stays stable.
        for (const doctorId of params.doctorIds) {
            const doc = byId.get(doctorId);
            if (!doc)
                continue;
            const slotFilter = { doctorId, date: params.date };
            if (params.mode)
                slotFilter.mode = params.mode;
            const slots = await slotModel
                .find(slotFilter)
                .sort({ startTime: 1 })
                .lean()
                .exec();
            const available = slots.filter((slot) => slot.status === 'available');
            columns.push({
                doctorId: doc.doctorId,
                name: doc.name,
                specialty: doc.specialty,
                hospital: doc.hospital,
                city: doc.city,
                imageUrl: doc.imageUrl,
                consultationFee: doc.consultationFee,
                currency: doc.currency ?? 'INR',
                rating: doc.rating,
                availableCount: available.length,
                bookedCount: slots.length - available.length,
                earliest: available[0]?.startTime ?? null,
                latest: available[available.length - 1]?.startTime ?? null,
                slots: available.map((slot) => ({
                    slotId: slot.slotId,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    mode: slot.mode,
                    fee: slot.fee,
                })),
            });
        }
        let recommendedSlot = null;
        let recommendedReason = null;
        if (columns.length > 0) {
            // Find doctor with highest rating and earliest availability
            const bestCol = [...columns].sort((a, b) => {
                if (a.rating !== b.rating)
                    return b.rating - a.rating;
                return (a.earliest ?? '23:59').localeCompare(b.earliest ?? '23:59');
            })[0];
            if (bestCol && bestCol.slots.length > 0) {
                const slot = bestCol.slots[0];
                recommendedSlot = { doctorId: bestCol.doctorId, slotId: slot.slotId };
                recommendedReason = `I recommend ${bestCol.name} at ${slot.startTime} because they have the highest rating (${bestCol.rating}★) and the earliest availability.`;
            }
        }
        return { columns, unknownDoctorIds, recommendedSlot, recommendedReason };
    }
};
DiscoveryService = __decorate([
    Injectable({ deps: [DatabaseService] }),
    __metadata("design:paramtypes", [DatabaseService])
], DiscoveryService);
export { DiscoveryService };
//# sourceMappingURL=discovery.service.js.map