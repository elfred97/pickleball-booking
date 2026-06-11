import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Court } from '../models/Court.js';
import { Settings } from '../models/Settings.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAdmin, async (_req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const [totalCourts, activeCourts, todayBookings, upcomingBookings, totalRevenue, recentBookings] =
    await Promise.all([
      Court.countDocuments(),
      Court.countDocuments({ isActive: true }),
      Booking.countDocuments({ date: today, status: 'confirmed' }),
      Booking.countDocuments({ date: { $gte: today }, status: 'confirmed' }),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalCost' } } },
      ]),
      Booking.find({ status: 'confirmed' })
        .populate('court')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

  const settings = await Settings.findOne();

  res.json({
    stats: {
      totalCourts,
      activeCourts,
      todayBookings,
      upcomingBookings,
      totalRevenue: totalRevenue[0]?.total ?? 0,
      hourlyRate: settings?.hourlyRate ?? 300,
    },
    recentBookings,
  });
});

router.get('/bookings', requireAdmin, async (req, res) => {
  const { date, status } = req.query;
  const filter: Record<string, unknown> = {};
  if (date) filter.date = date;
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate('court')
    .sort({ date: -1, startTime: -1 });
  res.json(bookings);
});

router.get('/settings', requireAdmin, async (_req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ hourlyRate: 300 });
  }
  res.json(settings);
});

router.patch('/settings', requireAdmin, async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json(settings);
});

export default router;
