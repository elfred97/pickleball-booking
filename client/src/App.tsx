import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import BookCourt from './pages/BookCourt';
import MyBookings from './pages/MyBookings';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManualBooking from './pages/admin/ManualBooking';
import AdminBookings from './pages/admin/AdminBookings';
import Courts from './pages/admin/Courts';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      <Route
        path="/book"
        element={
          <>
            <Navbar />
            <BookCourt />
          </>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <>
            <Navbar />
            <MyBookings />
          </>
        }
      />

      <Route path="/admin" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/manual-booking" element={<ManualBooking />} />
          <Route path="/admin/courts" element={<Courts />} />
        </Route>
      </Route>
    </Routes>
  );
}
