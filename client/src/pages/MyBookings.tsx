import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Booking, Court } from '../types';

export default function MyBookings() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paramEmail = searchParams.get('email');
    if (paramEmail) {
      setEmail(paramEmail);
      fetchBookings(paramEmail);
    }
  }, [searchParams]);

  async function fetchBookings(emailToSearch: string) {
    setLoading(true);
    try {
      const data = await api.getMyBookings(emailToSearch);
      setBookings(data);
      setSearched(true);
    } catch {
      setBookings([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (email) fetchBookings(email);
  }

  function getCourtName(court: Court | string): string {
    return typeof court === 'object' ? court.name : 'Unknown Court';
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-gray-600 mb-8">Enter your email to view your reservations.</p>

      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-court-600 px-6 py-2 font-medium text-white hover:bg-court-700 transition-colors"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}

      {searched && !loading && bookings.length === 0 && (
        <p className="text-gray-500">No bookings found for this email.</p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-lg">{getCourtName(b.court)}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {b.date} · {b.startTime} – {b.endTime}
              </p>
              <p className="text-gray-500 text-sm">{b.hours} hour(s)</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-court-700">₱{b.totalCost.toLocaleString()}</p>
              <span
                className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  b.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
