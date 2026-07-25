import { type Model } from 'mongoose';
/**
 * Doctor entity — a bookable clinician in the Arogya provider directory.
 *
 * `specialtySlug` is the normalised, lowercase form used for matching
 * free-text user queries ("cardiologist", "heart doctor") against the
 * directory. `imageUrl` is required because every doctor is rendered as an
 * image card in the `doctors` widget.
 */
export interface DoctorEntity {
    /** Stable public identifier (used by every tool + widget). */
    doctorId: string;
    name: string;
    /** Display specialty, e.g. "Cardiologist". */
    specialty: string;
    /** Normalised specialty key, e.g. "cardiology". */
    specialtySlug: string;
    /** Alternate spellings/synonyms accepted from user queries. */
    specialtyAliases: string[];
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
    /** HTTPS portrait used by the doctors widget. */
    imageUrl: string;
    bio: string;
    /** Whether the doctor accepts insurance */
    acceptsInsurance: boolean;
    /** Distance in km from the patient (or static for MVP) */
    distance: number;
    /** Estimated waiting time in minutes at the clinic */
    estimatedWaitingTime: number;
}
export declare const DoctorModel: Model<DoctorEntity>;
//# sourceMappingURL=doctor.schema.d.ts.map