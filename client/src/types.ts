export interface Court {
  _id: string;
  name: string;
  number: number;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  court: Court | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalCost: number;
  status: 'confirmed' | 'cancelled';
  bookedBy: 'user' | 'admin';
  createdAt?: string;
}

export interface DashboardStats {
  totalCourts: number;
  activeCourts: number;
  todayBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  hourlyRate: number;
}

export interface Settings {
  hourlyRate: number;
  openTime: string;
  closeTime: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}
