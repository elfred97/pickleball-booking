import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <nav className="bg-court-700 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">Elfred's</span>
          Pickleball Courts
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-court-100 transition-colors">
            Home
          </Link>
          <Link to="/book" className="hover:text-court-100 transition-colors">
            Book a Court
          </Link>
          <Link
            to="/my-bookings"
            className="hover:text-court-100 transition-colors"
          >
            My Bookings
          </Link>
          <Link
            to="/admin"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
