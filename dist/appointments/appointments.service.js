var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nitrostack/core';
import { DatabaseService } from '../database/database.service.js';
export class BookingError extends Error {
}
/**
 * Write-side logic for appointments: reserve a slot atomically, then read the
 * confirmation back. Slot reservation uses a conditional update so two
 * concurrent bookings can never claim the same window.
 */
let AppointmentsService = class AppointmentsService {
    db;
    constructor(db) {
        this.db = db;
    }
    /** `booking_` + short random suffix; readable enough to say out loud. */
    newBookingId() {
        return `booking_${randomBytes(4).toString('hex')}`;
    }
    /**
     * Accept "17:00", "5 PM", "5:00 PM", "1700" and normalise to `HH:mm`.
     * Returns null when the input cannot be understood.
     */
    normaliseTime(raw) {
        const value = raw.trim().toLowerCase().replace(/\s+/g, '');
        const match = value.match(/^(\d{1,2})(?::?(\d{2}))?(am|pm)?$/);
        if (!match)
            return null;
        let hours = Number(match[1]);
        const minutes = match[2] ? Number(match[2]) : 0;
        const meridiem = match[3];
        if (Number.isNaN(hours) || Number.isNaN(minutes))
            return null;
        if (minutes > 59)
            return null;
        if (meridiem === 'pm' && hours < 12)
            hours += 12;
        if (meridiem === 'am' && hours === 12)
            hours = 0;
        if (hours > 23)
            return null;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    /** "2026-07-28" + "17:00" → "Tue, 28 Jul 2026 · 5:00 PM". */
    formatSlotLabel(date, startTime) {
        const parsed = new Date(`${date}T${startTime}:00Z`);
        if (Number.isNaN(parsed.getTime()))
            return `${date} ${startTime}`;
        const day = parsed.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
        });
        const time = parsed.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        });
        return `${day} · ${time}`;
    }
    /**
     * Book a slot.
     *
     * Resolution order: explicit `slotId` wins; otherwise the slot is located by
     * `doctorId` + `date` + normalised `startTime`. The reservation is an atomic
     * `findOneAndUpdate` filtered on `status: 'available'`, so a losing racer gets
     * a clear "already booked" error instead of a double booking.
     */
    async bookAppointment(params) {
        const doctorModel = await this.db.doctors();
        const slotModel = await this.db.slots();
        const appointmentModel = await this.db.appointments();
        const doctor = await doctorModel
            .findOne({ doctorId: params.doctorId })
            .lean()
            .exec();
        if (!doctor) {
            throw new BookingError(`Unknown doctorId "${params.doctorId}". Call search-doctors first and use a doctorId from its results.`);
        }
        // Locate the slot the patient asked for.
        const slotFilter = { status: 'available' };
        if (params.slotId) {
            slotFilter.slotId = params.slotId;
        }
        else {
            const startTime = params.startTime
                ? this.normaliseTime(params.startTime)
                : null;
            if (!startTime) {
                throw new BookingError('Provide either a slotId or a slot start time (e.g. "17:00" or "5:00 PM").');
            }
            slotFilter.doctorId = params.doctorId;
            slotFilter.date = params.date;
            slotFilter.startTime = startTime;
        }
        const bookingId = this.newBookingId();
        const slot = await slotModel
            .findOneAndUpdate(slotFilter, { $set: { status: 'booked', bookingId } }, { new: true })
            .lean()
            .exec();
        if (!slot) {
            // Distinguish "does not exist" from "already taken" for a useful message.
            const existing = await slotModel
                .findOne(params.slotId
                ? { slotId: params.slotId }
                : {
                    doctorId: params.doctorId,
                    date: params.date,
                    startTime: params.startTime
                        ? this.normaliseTime(params.startTime)
                        : undefined,
                })
                .lean()
                .exec();
            if (existing) {
                throw new BookingError(`That slot (${existing.date} ${existing.startTime}) with ${doctor.name} is already booked. Call compare-slots for ${existing.date} to pick another time.`);
            }
            throw new BookingError(`No slot found for ${doctor.name} on ${params.date}${params.startTime ? ` at ${params.startTime}` : ''}. Call compare-slots to see the open windows.`);
        }
        const appointment = {
            bookingId,
            status: 'confirmed',
            doctorId: doctor.doctorId,
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            doctorImageUrl: doctor.imageUrl,
            hospital: doctor.hospital,
            address: doctor.address,
            city: doctor.city,
            slotId: slot.slotId,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            mode: slot.mode,
            patientName: params.patientName,
            patientPhone: params.patientPhone,
            patientAge: params.patientAge ?? null,
            reason: params.reason ?? null,
            fee: slot.fee,
            currency: doctor.currency ?? 'INR',
            createdAt: new Date(),
        };
        try {
            await appointmentModel.create(appointment);
        }
        catch (error) {
            // Release the slot so a failed write never strands inventory.
            await slotModel
                .updateOne({ slotId: slot.slotId, bookingId }, { $set: { status: 'available', bookingId: null } })
                .exec();
            throw error;
        }
        return this.toView(appointment);
    }
    /** Read a confirmation back by booking id. */
    async getAppointment(bookingId) {
        const appointmentModel = await this.db.appointments();
        const appointment = await appointmentModel
            .findOne({ bookingId: bookingId.trim() })
            .lean()
            .exec();
        return appointment ? this.toView(appointment) : null;
    }
    /** Map a stored appointment to the widget-facing view model. */
    toView(appointment) {
        return {
            bookingId: appointment.bookingId,
            status: appointment.status,
            doctor: {
                doctorId: appointment.doctorId,
                name: appointment.doctorName,
                specialty: appointment.doctorSpecialty,
                imageUrl: appointment.doctorImageUrl,
            },
            hospital: appointment.hospital,
            address: appointment.address,
            city: appointment.city,
            slot: {
                slotId: appointment.slotId,
                date: appointment.date,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                mode: appointment.mode,
                label: this.formatSlotLabel(appointment.date, appointment.startTime),
            },
            patient: {
                name: appointment.patientName,
                phone: appointment.patientPhone,
                age: appointment.patientAge ?? null,
            },
            reason: appointment.reason ?? null,
            fee: appointment.fee,
            currency: appointment.currency ?? 'INR',
            bookedAt: (appointment.createdAt ?? new Date()).toISOString(),
        };
    }
};
AppointmentsService = __decorate([
    Injectable({ deps: [DatabaseService] }),
    __metadata("design:paramtypes", [DatabaseService])
], AppointmentsService);
export { AppointmentsService };
//# sourceMappingURL=appointments.service.js.map