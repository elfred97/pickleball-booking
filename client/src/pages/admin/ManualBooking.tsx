import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import BookingForm from '../../components/BookingForm';
import type { Court } from '../../types';

export default function ManualBooking() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getAllCourts().then(setCourts).catch(console.error);
  }, []);

  async function handleSubmit(data: Record<string, string>) {
    await api.createAdminBooking(data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Manual Booking</h1>
      <p className="text-gray-600 mb-6">Book a court on behalf of a customer. They will receive a confirmation email.</p>

      {success && (
        <div className="mb-6 rounded-lg bg-court-50 border border-court-200 px-4 py-3 text-court-800">
          Booking created successfully. Confirmation email sent.
        </div>
      )}

      <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <BookingForm
          courts={courts.filter((c) => c.isActive)}
          onSubmit={handleSubmit}
          submitLabel="Create Booking"
        />
      </div>
    </div>
  );
}
