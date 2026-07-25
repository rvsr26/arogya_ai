import mongoose, { Schema, type Model } from 'mongoose';

export interface LabTestEntity {
  testId: string;
  name: string;
  price: number;
  collectionStatus: 'Pending' | 'Collected' | 'In-Progress' | 'Completed';
  reportStatus: 'Pending' | 'Ready' | 'Delivered';
  expectedDelivery: Date;
}

const labTestSchema = new Schema<LabTestEntity>(
  {
    testId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    collectionStatus: { type: String, enum: ['Pending', 'Collected', 'In-Progress', 'Completed'], default: 'Pending' },
    reportStatus: { type: String, enum: ['Pending', 'Ready', 'Delivered'], default: 'Pending' },
    expectedDelivery: { type: Date },
  },
  { collection: 'lab_tests', versionKey: false },
);

export const LabTestModel: Model<LabTestEntity> =
  (mongoose.models.LabTest as Model<LabTestEntity> | undefined) ??
  mongoose.model<LabTestEntity>('LabTest', labTestSchema);
