# Pickleball Court Booking

A full-stack MERN application for booking pickleball courts with separate **User** and **Admin** portals.

## Features

### User Portal
- Browse courts and book online
- Select date, time, and court
- View booking history by email
- Receive email confirmation after booking

### Admin Portal
- Dashboard with stats (courts, bookings, revenue)
- Manual court booking on behalf of customers
- Manage all bookings (view, filter, cancel)
- Add/deactivate courts for future expansion
- Configurable hourly rate (default: ₱300/hour)

## Tech Stack

- **MongoDB** — database
- **Express.js** — REST API
- **React** — frontend (TypeScript + Tailwind CSS)
- **Node.js** — runtime
- **Nodemailer** — email notifications

## Prerequisites

- Node.js 18+
- **Docker Desktop** (recommended) or a local MongoDB / [MongoDB Atlas](https://www.mongodb.com/atlas) instance
- SMTP credentials for email (Gmail app password works)

## Setup

1. **Clone and install dependencies**

```bash
cd pickleball-booking
npm run install:all
```

2. **Configure environment**

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pickleball-booking
JWT_SECRET=your-secure-random-string
ADMIN_EMAIL=admin@pickleball.local
ADMIN_PASSWORD=admin123

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=Pickleball Courts <your-email@gmail.com>

HOURLY_RATE=300
```

3. **Start MongoDB** (Docker — recommended)

Make sure **Docker Desktop is running**, then:

```bash
npm run db:up
```

Or start everything in one command:

```bash
npm run dev:all
```

4. **Run the app** (if MongoDB is already running)

```bash
npm run dev
```

- User site: http://localhost:5173
- API: http://localhost:5000/api

## Default Admin Login

| Field    | Value                    |
|----------|--------------------------|
| Email    | `admin@pickleball.local` |
| Password | `admin123`               |

Change these in `server/.env` before deploying.

## API Endpoints

| Method | Endpoint                    | Auth  | Description              |
|--------|-----------------------------|-------|--------------------------|
| GET    | `/api/courts`               | —     | List active courts       |
| POST   | `/api/bookings`             | —     | Create user booking      |
| GET    | `/api/bookings/my?email=`   | —     | User's bookings          |
| POST   | `/api/auth/login`           | —     | Admin login              |
| GET    | `/api/admin/dashboard`      | Admin | Dashboard stats          |
| POST   | `/api/bookings/admin`       | Admin | Manual booking           |
| POST   | `/api/courts`               | Admin | Add new court            |

## Production Build

```bash
npm run build
npm start
```

The Express server serves the built React app from `client/dist`.

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use that password as `SMTP_PASS` in `.env`

Without SMTP configured, bookings still work — emails are simply skipped with a console warning.
