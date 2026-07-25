import mongoose, { Schema, type Model } from 'mongoose';
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

const appointmentSchema = new Schema<AppointmentEntity>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    doctorImageUrl: { type: String, required: true },
    hospital: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    slotId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    mode: { type: String, enum: ['in-person', 'video'], default: 'in-person' },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientAge: { type: Number, default: null },
    reason: { type: String, default: null },
    fee: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: 'appointments', versionKey: false },
);

export const AppointmentModel: Model<AppointmentEntity> =
  (mongoose.models.Appointment as Model<AppointmentEntity> | undefined) ??
  mongoose.model<AppointmentEntity>('Appointment', appointmentSchema);
