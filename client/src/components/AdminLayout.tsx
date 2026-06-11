import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/bookings', label: 'All Bookings' },
  { to: '/admin/manual-booking', label: 'Manual Booking' },
  { to: '/admin/courts', label: 'Manage Courts' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="relative flex w-64 flex-col bg-court-800 text-white">
        <div className="border-b border-court-700 p-6">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-sm text-court-100">Pickleball Courts</p>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`mb-1 block rounded-lg px-4 py-2.5 transition-colors ${
                location.pathname === item.to
                  ? 'bg-court-600 font-medium'
                  : 'hover:bg-court-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-court-700 p-4">
          <Link to="/" className="mb-2 block text-sm text-court-100 hover:text-white">
            ← Back to site
          </Link>
          <button
            onClick={logout}
            className="w-full rounded-lg bg-court-700 px-4 py-2 text-sm hover:bg-court-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
