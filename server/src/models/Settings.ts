import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  hourlyRate: number;
  openTime: string;
  closeTime: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    hourlyRate: { type: Number, default: 300 },
    openTime: { type: String, default: '06:00' },
    closeTime: { type: String, default: '22:00' },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
