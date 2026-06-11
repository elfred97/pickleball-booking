import bcrypt from 'bcryptjs';
import { Court } from '../models/Court.js';
import { User } from '../models/User.js';
import { Settings } from '../models/Settings.js';

export async function seedDatabase() {
  const courtCount = await Court.countDocuments();
  if (courtCount === 0) {
    const courts = Array.from({ length: 4 }, (_, i) => ({
      name: `Court ${i + 1}`,
      number: i + 1,
      isActive: true,
    }));
    await Court.insertMany(courts);
    console.log('Seeded 4 default courts');
  }

  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      hourlyRate: Number(process.env.HOURLY_RATE) || 300,
      openTime: '06:00',
      closeTime: '22:00',
    });
    console.log('Seeded default settings');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pickleball.local';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      email: adminEmail,
      password: hashed,
      name: 'Admin',
      role: 'admin',
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  }
}
