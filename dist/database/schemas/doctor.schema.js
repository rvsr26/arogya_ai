import mongoose, { Schema } from 'mongoose';
const doctorSchema = new Schema({
    doctorId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    specialtySlug: { type: String, required: true, index: true },
    specialtyAliases: { type: [String], default: [] },
    city: { type: String, required: true, index: true },
    hospital: { type: String, required: true },
    address: { type: String, required: true },
    qualifications: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    languages: { type: [String], default: [] },
    consultationFee: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    bio: { type: String, default: '' },
    acceptsInsurance: { type: Boolean, default: false },
    distance: { type: Number, default: 0 },
    estimatedWaitingTime: { type: Number, default: 15 },
}, { collection: 'doctors', versionKey: false });
export const DoctorModel = mongoose.models.Doctor ??
    mongoose.model('Doctor', doctorSchema);
//# sourceMappingURL=doctor.schema.js.map