import { DatabaseService } from '../database/database.service.js';
/** A doctor card as rendered by the `doctors` widget. */
export interface DoctorCard {
    doctorId: string;
    name: string;
    specialty: string;
    city: string;
    hospital: string;
    address: string;
    qualifications: string;
    experienceYears: number;
    languages: string[];
    consultationFee: number;
    currency: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    bio: string;
    /** Count of still-open slots across the published calendar. */
    openSlotCount: number;
    /** Soonest open slot, e.g. "2026-07-28 09:30". */
    nextAvailable: string | null;
    acceptsInsurance: boolean;
    distance: number;
    estimatedWaitingTime: number;
}
/** One open slot option in a comparison column. */
export interface SlotOption {
    slotId: string;
    startTime: string;
    endTime: string;
    mode: string;
    fee: number;
}
/** A single doctor's column in the side-by-side comparison. */
export interface SlotComparisonColumn {
    doctorId: string;
    name: string;
    specialty: string;
    hospital: string;
    city: string;
    imageUrl: string;
    consultationFee: number;
    currency: string;
    rating: number;
    availableCount: number;
    bookedCount: number;
    earliest: string | null;
    latest: string | null;
    slots: SlotOption[];
}
/**
 * Read-side logic for doctor discovery and slot comparison.
 * Keeps Mongo queries and query-normalisation out of the tool controllers.
 */
export declare class DiscoveryService {
    private readonly db;
    constructor(db: DatabaseService);
    /**
     * Normalise loose user input ("Cardiologist", "heart doctor", "CARDIO") into
     * a regex-safe token we can match against `specialtySlug`, `specialty` and
     * `specialtyAliases`.
     */
    private normalise;
    private escapeRegex;
    /**
     * Search the directory. Both filters are optional and both are fuzzy:
     * specialty matches display name / slug / aliases, city matches a prefix so
     * "pune" finds "Pune". Results are enriched with live slot availability.
     */
    searchDoctors(params: {
        specialty?: string;
        city?: string;
        maxFee?: number;
        minRating?: number;
        acceptsInsurance?: boolean;
        date?: string;
        sortBy?: 'rating' | 'distance' | 'fee' | 'earliest';
        limit: number;
    }): Promise<{
        doctors: DoctorCard[];
        matchedSpecialty: string | null;
        matchedCity: string | null;
        recommendation?: string;
    }>;
    /** Attach live availability figures to a directory row. */
    private toCard;
    /**
     * Build one comparison column per requested doctor for a single date.
     * Unknown doctor ids are reported back rather than silently dropped so the
     * model can correct itself.
     */
    compareSlots(params: {
        doctorIds: string[];
        date: string;
        mode?: 'in-person' | 'video';
    }): Promise<{
        columns: SlotComparisonColumn[];
        unknownDoctorIds: string[];
        recommendedSlot?: {
            doctorId: string;
            slotId: string;
        } | null;
        recommendedReason?: string | null;
    }>;
}
//# sourceMappingURL=discovery.service.d.ts.map