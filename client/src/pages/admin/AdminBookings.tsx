import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import type { Booking, Court } from '../../types';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  function loadBookings() {
    api
      .getAdminBookings({
        ...(filterDate && { date: filterDate }),
        ...(filterStatus && { status: filterStatus }),
      })
      .then(setBookings)
      .catch(console.error);
  }

  useEffect(() => {
    loadBookings();
  }, [filterDate, filterStatus]);

  async function handleCancel(id: string) {
    if (!confirm('Cancel this booking?')) return;
    await api.cancelBooking(id);
    loadBookings();
  }

  function getCourtName(court: Court | string): string {
    return typeof court === 'object' ? court.name : 'Unknown';
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Court</th>
              <th className="px-4 py-3 font-medium">Date & Time</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{b.customerName}</p>
                  <p className="text-gray-400 text-xs">{b.customerEmail}</p>
                </td>
                <td className="px-4 py-3">{getCourtName(b.court)}</td>
                <td className="px-4 py-3">
                  {b.date}<br />
                  <span className="text-gray-400">{b.startTime} – {b.endTime}</span>
                </td>
                <td className="px-4 py-3 font-medium">₱{b.totalCost.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      b.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="px-4 py-8 text-gray-500 text-center">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
