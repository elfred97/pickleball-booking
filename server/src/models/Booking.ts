import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  court: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalCost: number;
  status: 'confirmed' | 'cancelled';
  bookedBy: 'user' | 'admin';
}

const bookingSchema = new Schema<IBooking>(
  {
    court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    hours: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    bookedBy: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
