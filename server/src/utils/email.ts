import { createMailTransport } from '../config/mail.js';
import type { IBooking } from '../models/Booking.js';
import type { ICourt } from '../models/Court.js';

interface BookingEmailData {
  booking: IBooking;
  court: ICourt;
}

export async function sendBookingConfirmation({ booking, court }: BookingEmailData) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping confirmation email');
    return;
  }

  const transport = createMailTransport();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to: booking.customerEmail,
    subject: `Court Reservation Confirmed — ${court.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Reservation Confirmed</h2>
        <p>Hi ${booking.customerName},</p>
        <p>Your pickleball court reservation has been confirmed. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Court</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${court.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.date}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.startTime} – ${booking.endTime}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Duration</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.hours} hour(s)</td></tr>
          <tr><td style="padding: 8px;"><strong>Total Cost</strong></td><td style="padding: 8px;">₱${booking.totalCost.toLocaleString()}</td></tr>
        </table>
        <p>See you on the court!</p>
        <p style="color: #666; font-size: 12px;">Pickleball Court Booking System</p>
      </div>
    `,
  });
}
