import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Court } from '../models/Court.js';
import { Settings } from '../models/Settings.js';
import { requireAdmin } from '../middleware/auth.js';
import { calculateCost, calculateHours, timesOverlap } from '../utils/pricing.js';
import { sendBookingConfirmation } from '../utils/email.js';

const router = Router();

async function getHourlyRate(): Promise<number> {
  const settings = await Settings.findOne();
  return settings?.hourlyRate ?? (Number(process.env.HOURLY_RATE) || 300);
}

async function checkAvailability(
  courtId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
) {
  const query: Record<string, unknown> = {
    court: courtId,
    date,
    status: 'confirmed',
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const existing = await Booking.find(query);
  return !existing.some((b) => timesOverlap(startTime, endTime, b.startTime, b.endTime));
}

router.get('/availability', async (req, res) => {
  const { date, courtId } = req.query;
  if (!date || !courtId) {
    return res.status(400).json({ message: 'date and courtId are required' });
  }

  const bookings = await Booking.find({
    court: courtId,
    date,
    status: 'confirmed',
  }).select('startTime endTime');

  res.json(bookings);
});

router.get('/my', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'email is required' });

  const bookings = await Booking.find({ customerEmail: email })
    .populate('court')
    .sort({ date: -1, startTime: -1 });
  res.json(bookings);
});

router.post('/', async (req, res) => {
  const { courtId, customerName, customerEmail, customerPhone, date, startTime, endTime } =
    req.body;

  if (!courtId || !customerName || !customerEmail || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const court = await Court.findOne({ _id: courtId, isActive: true });
  if (!court) return res.status(404).json({ message: 'Court not found' });

  const hours = calculateHours(startTime, endTime);
  if (hours <= 0) return res.status(400).json({ message: 'End time must be after start time' });

  const available = await checkAvailability(courtId, date, startTime, endTime);
  if (!available) {
    return res.status(409).json({ message: 'Court is not available for the selected time slot' });
  }

  const hourlyRate = await getHourlyRate();
  const totalCost = calculateCost(hours, hourlyRate);

  const booking = await Booking.create({
    court: courtId,
    customerName,
    customerEmail,
    customerPhone,
    date,
    startTime,
    endTime,
    hours,
    totalCost,
    bookedBy: 'user',
  });

  try {
    await sendBookingConfirmation({ booking, court });
  } catch (err) {
    console.error('Failed to send confirmation email:', err);
  }

  const populated = await booking.populate('court');
  res.status(201).json(populated);
});

router.post('/admin', requireAdmin, async (req, res) => {
  const { courtId, customerName, customerEmail, customerPhone, date, startTime, endTime } =
    req.body;

  if (!courtId || !customerName || !customerEmail || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const court = await Court.findById(courtId);
  if (!court) return res.status(404).json({ message: 'Court not found' });

  const hours = calculateHours(startTime, endTime);
  if (hours <= 0) return res.status(400).json({ message: 'End time must be after start time' });

  const available = await checkAvailability(courtId, date, startTime, endTime);
  if (!available) {
    return res.status(409).json({ message: 'Court is not available for the selected time slot' });
  }

  const hourlyRate = await getHourlyRate();
  const totalCost = calculateCost(hours, hourlyRate);

  const booking = await Booking.create({
    court: courtId,
    customerName,
    customerEmail,
    customerPhone,
    date,
    startTime,
    endTime,
    hours,
    totalCost,
    bookedBy: 'admin',
  });

  try {
    await sendBookingConfirmation({ booking, court });
  } catch (err) {
    console.error('Failed to send confirmation email:', err);
  }

  const populated = await booking.populate('court');
  res.status(201).json(populated);
});

router.patch('/:id/cancel', requireAdmin, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  ).populate('court');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

export default router;
