// Central API utility — attaches JWT token to every authenticated request

const BASE = '';

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body) => request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

// ── Hotels ────────────────────────────────────────────
export const hotelsApi = {
  getAll: (page = 0, size = 20) => request(`/api/hotels?page=${page}&size=${size}`),
  getById: (id) => request(`/api/hotels/${id}`),
  search: (location, checkIn, checkOut) => {
    const params = new URLSearchParams({ location });
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    return request(`/api/hotels/search?${params}`);
  },
  add: (body) => request('/api/hotels', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/hotels/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/api/hotels/${id}`, { method: 'DELETE' }),
};

// ── Rooms ─────────────────────────────────────────────
export const roomsApi = {
  getByHotel: (hotelId) => request(`/api/rooms/hotel/${hotelId}`),
  getAvailable: (hotelId, checkIn, checkOut) =>
    request(`/api/rooms/available?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`),
  getById: (id) => request(`/api/rooms/${id}`),
  add: (body) => request('/api/rooms', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/api/rooms/${id}`, { method: 'DELETE' }),
};

// ── Bookings ──────────────────────────────────────────
export const bookingsApi = {
  book: (body) => request('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id) => request(`/api/bookings/${id}/cancel`, { method: 'POST' }),
  getById: (id) => request(`/api/bookings/${id}`),
  myBookings: () => request('/api/bookings/my-bookings'),
  verifyOtp: (id, otp) => request(`/api/bookings/${id}/verify-otp`, { method: 'POST', body: JSON.stringify({ otp }) }),
};

// ── Admin Users Management ──────────────────────────
export const adminApi = {
  getUsers: () => request('/api/admin/users'),
  deleteUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),
  updateRole: (id, role) => request(`/api/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
};

// ── Payments ──────────────────────────────────────────
export const paymentsApi = {
  process: (body) => request('/api/payments', { method: 'POST', body: JSON.stringify(body) }),
  getByBooking: (bookingId) => request(`/api/payments/booking/${bookingId}`),
};
