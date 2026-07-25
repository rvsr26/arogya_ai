import mongoose, { Schema, type Model } from 'mongoose';

export interface MedicineEntity {
  medicineId: string;
  name: string;
  stock: number;
  expiryDate: Date;
  availability: boolean;
  alternativeMedicines: string[];
}

const medicineSchema = new Schema<MedicineEntity>(
  {
    medicineId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    stock: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    availability: { type: Boolean, required: true },
    alternativeMedicines: { type: [String], default: [] },
  },
  { collection: 'medicines', versionKey: false },
);

export const MedicineModel: Model<MedicineEntity> =
  (mongoose.models.Medicine as Model<MedicineEntity> | undefined) ??
  mongoose.model<MedicineEntity>('Medicine', medicineSchema);
