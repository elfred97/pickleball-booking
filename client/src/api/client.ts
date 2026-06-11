const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}

export const api = {
  getCourts: () => request<import('../types').Court[]>('/courts'),
  getAllCourts: () => request<import('../types').Court[]>('/courts/all'),
  createCourt: (body: { name: string; number: number }) =>
    request<import('../types').Court>('/courts', { method: 'POST', body: JSON.stringify(body) }),
  updateCourt: (id: string, body: Partial<import('../types').Court>) =>
    request<import('../types').Court>(`/courts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCourt: (id: string) =>
    request<import('../types').Court>(`/courts/${id}`, { method: 'DELETE' }),

  getAvailability: (date: string, courtId: string) =>
    request<import('../types').TimeSlot[]>(`/bookings/availability?date=${date}&courtId=${courtId}`),
  getMyBookings: (email: string) =>
    request<import('../types').Booking[]>(`/bookings/my?email=${encodeURIComponent(email)}`),
  createBooking: (body: Record<string, string>) =>
    request<import('../types').Booking>('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  createAdminBooking: (body: Record<string, string>) =>
    request<import('../types').Booking>('/bookings/admin', { method: 'POST', body: JSON.stringify(body) }),
  cancelBooking: (id: string) =>
    request<import('../types').Booking>(`/bookings/${id}/cancel`, { method: 'PATCH' }),

  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getDashboard: () =>
    request<{ stats: import('../types').DashboardStats; recentBookings: import('../types').Booking[] }>(
      '/admin/dashboard'
    ),
  getAdminBookings: (params?: { date?: string; status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<import('../types').Booking[]>(`/admin/bookings${query ? `?${query}` : ''}`);
  },
  getSettings: () => request<import('../types').Settings>('/admin/settings'),
  updateSettings: (body: Partial<import('../types').Settings>) =>
    request<import('../types').Settings>('/admin/settings', { method: 'PATCH', body: JSON.stringify(body) }),
};
