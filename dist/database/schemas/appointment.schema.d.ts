import { type Model } from 'mongoose';
import type { ConsultationMode } from './slot.schema.js';
export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed';
/**
 * A booked consultation. Denormalises the doctor/hospital snapshot at booking
 * time so the confirmation widget can render without a second lookup and so
 * historical records survive directory edits.
 */
export interface AppointmentEntity {
    bookingId: string;
    status: AppointmentStatus;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorImageUrl: string;
    hospital: string;
    address: string;
    city: string;
    slotId: string;
    date: string;
    startTime: string;
    endTime: string;
    mode: ConsultationMode;
    patientName: string;
    patientPhone: string;
    patientAge?: number | null;
    reason?: string | null;
    fee: number;
    currency: string;
    createdAt: Date;
}
export declare const AppointmentModel: Model<AppointmentEntity>;
//# sourceMappingURL=appointment.schema.d.ts.map