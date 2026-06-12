import { useState, useEffect, FormEvent } from "react";
import { api } from "../api/client";
import type { Court, TimeSlot } from "../types";

interface BookingFormProps {
  courts: Court[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitLabel?: string;
  defaultValues?: Partial<Record<string, string>>;
}

const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function BookingForm({
  courts,
  onSubmit,
  submitLabel = "Book Court",
  defaultValues = {},
}: BookingFormProps) {
  const [courtId, setCourtId] = useState(defaultValues.courtId || "");
  const [date, setDate] = useState(defaultValues.date || "");
  const [startTime, setStartTime] = useState(
    defaultValues.startTime || "08:00",
  );
  const [endTime, setEndTime] = useState(defaultValues.endTime || "09:00");
  const [customerName, setCustomerName] = useState(
    defaultValues.customerName || "",
  );
  const [customerEmail, setCustomerEmail] = useState(
    defaultValues.customerEmail || "",
  );
  const [customerPhone, setCustomerPhone] = useState(
    defaultValues.customerPhone || "",
  );
  const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startHour = parseInt(startTime.split(":")[0], 10);
  const endHour = parseInt(endTime.split(":")[0], 10);
  const hours = Math.max(0, endHour - startHour);
  const totalCost = hours * 300;

  const handleSelect = (field: string, value: string) => {
    if (field === "startTime") {
      setStartTime(value);
      if (value >= endTime) {
        setEndTime(TIME_OPTIONS.find((t) => t > value) || value);
      }
    } else {
      setEndTime(value);
    }
  };

  useEffect(() => {
    if (!courtId || !date) return;
    api
      .getAvailability(date, courtId)
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]));
  }, [courtId, date]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({
        courtId,
        date,
        startTime,
        endTime,
        customerName,
        customerEmail,
        customerPhone,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Court
          </label>
          <select
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          >
            <option value="">Select a court</option>
            {courts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <select
            value={startTime}
            onChange={(e) => handleSelect("startTime", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            End Time
          </label>
          <select
            value={endTime}
            onChange={(e) => handleSelect("endTime", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          >
            {TIME_OPTIONS.filter((t) => t > startTime).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone (optional)
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-court-500 focus:ring-1 focus:ring-court-500 outline-none"
          />
        </div>
      </div>

      {bookedSlots.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <p className="font-medium mb-1">Already booked on this date:</p>
          <ul className="list-disc list-inside">
            {bookedSlots.map((s, i) => (
              <li key={i}>
                {s.startTime} – {s.endTime}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-court-50 border border-court-200 px-4 py-3 flex justify-between items-center">
        <span className="text-court-800 font-medium">Estimated Total</span>
        <span className="text-2xl font-bold text-court-700">
          ₱{totalCost.toLocaleString()}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-court-600 px-6 py-3 font-semibold text-white hover:bg-court-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Processing..." : submitLabel}
      </button>
    </form>
  );
}
