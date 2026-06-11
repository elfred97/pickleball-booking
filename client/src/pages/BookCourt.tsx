import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import BookingForm from '../components/BookingForm';
import type { Court } from '../types';

export default function BookCourt() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCourts().then(setCourts).catch(console.error);
  }, []);

  async function handleSubmit(data: Record<string, string>) {
    await api.createBooking(data);
    setSuccess(true);
    setTimeout(() => navigate('/my-bookings?email=' + encodeURIComponent(data.customerEmail)), 3000);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-xl bg-court-50 border border-court-200 p-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-court-700 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">A confirmation email has been sent to your inbox.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Book a Court</h1>
      <p className="text-gray-600 mb-8">Select your court, date, and time. Rate: ₱300/hour.</p>
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <BookingForm courts={courts} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
