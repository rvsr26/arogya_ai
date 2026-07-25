import mongoose, { Schema } from 'mongoose';
const slotSchema = new Schema({
    slotId: { type: String, required: true, unique: true, index: true },
    doctorId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    mode: { type: String, enum: ['in-person', 'video'], default: 'in-person' },
    status: { type: String, enum: ['available', 'booked'], default: 'available', index: true },
    fee: { type: Number, required: true },
    bookingId: { type: String, default: null },
}, { collection: 'slots', versionKey: false });
slotSchema.index({ doctorId: 1, date: 1, startTime: 1 });
export const SlotModel = mongoose.models.Slot ??
    mongoose.model('Slot', slotSchema);
//# sourceMappingURL=slot.schema.js.map