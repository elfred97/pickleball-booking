import mongoose, { Schema, Document } from 'mongoose';

export interface ICourt extends Document {
  name: string;
  number: number;
  isActive: boolean;
}

const courtSchema = new Schema<ICourt>(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Court = mongoose.model<ICourt>('Court', courtSchema);
