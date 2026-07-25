import mongoose, { Schema } from 'mongoose';
const appointmentSchema = new Schema({
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
}, { collection: 'appointments', versionKey: false });
export const AppointmentModel = mongoose.models.Appointment ??
    mongoose.model('Appointment', appointmentSchema);
//# sourceMappingURL=appointment.schema.js.map