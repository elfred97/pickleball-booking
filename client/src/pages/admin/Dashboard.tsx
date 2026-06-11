import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import type { Booking, DashboardStats, Court } from '../../types';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1 text-court-700">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.getDashboard().then((data) => {
      setStats(data.stats);
      setRecentBookings(data.recentBookings);
    }).catch(console.error);
  }, []);

  function getCourtName(court: Court | string): string {
    return typeof court === 'object' ? court.name : 'Unknown';
  }

  if (!stats) return <p className="text-gray-500">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Active Courts" value={stats.activeCourts} sub={`${stats.totalCourts} total`} />
        <StatCard label="Today's Bookings" value={stats.todayBookings} />
        <StatCard label="Upcoming Bookings" value={stats.upcomingBookings} />
        <StatCard
          label="Total Revenue"
          value={`₱${stats.totalRevenue.toLocaleString()}`}
          sub={`₱${stats.hourlyRate}/hr rate`}
        />
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {recentBookings.length === 0 && (
            <p className="px-6 py-8 text-gray-500 text-sm">No bookings yet.</p>
          )}
          {recentBookings.map((b) => (
            <div key={b._id} className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{b.customerName}</p>
                <p className="text-sm text-gray-500">
                  {getCourtName(b.court)} · {b.date} · {b.startTime}–{b.endTime}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-court-700">₱{b.totalCost.toLocaleString()}</p>
                <span className="text-xs text-gray-400">{b.bookedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
