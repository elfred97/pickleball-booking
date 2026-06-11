import { Router } from 'express';
import { Court } from '../models/Court.js';
import { Booking } from '../models/Booking.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const courts = await Court.find({ isActive: true }).sort({ number: 1 });
  res.json(courts);
});

router.get('/all', requireAdmin, async (_req, res) => {
  const courts = await Court.find().sort({ number: 1 });
  res.json(courts);
});

router.post('/', requireAdmin, async (req: AuthRequest, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ message: 'Name and number are required' });
  }

  const existing = await Court.findOne({ number });
  if (existing) {
    return res.status(409).json({ message: 'Court number already exists' });
  }

  const court = await Court.create({ name, number, isActive: true });
  res.status(201).json(court);
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const court = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!court) return res.status(404).json({ message: 'Court not found' });
  res.json(court);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const activeBookings = await Booking.countDocuments({
    court: req.params.id,
    status: 'confirmed',
    date: { $gte: new Date().toISOString().split('T')[0] },
  });

  if (activeBookings > 0) {
    return res.status(400).json({ message: 'Cannot delete court with upcoming bookings' });
  }

  const court = await Court.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!court) return res.status(404).json({ message: 'Court not found' });
  res.json(court);
});

export default router;
