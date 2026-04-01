import React, { useEffect, useState } from 'react';
import { bookingsApi } from '../utils/api';

export default function BookingsView({ isAdmin }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Admin: no dedicated admin-all endpoint yet, fallback to my-bookings
    // USER/MANAGER: /api/bookings/my-bookings
    bookingsApi.myBookings()
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) {
      alert('Cancel failed: ' + err.message);
    }
  };

  const statusStyle = (status) => {
    if (status === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    if (status === 'BOOKED') return 'bg-accent/20 text-primary border border-accent/40';
    return 'bg-red-50 text-red-700 border border-red-100';
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-6 px-2">
        <h2 className="text-xl font-bold tracking-tight text-primary">
          {isAdmin ? 'System Reservations' : 'My Reservations'}
        </h2>
      </div>

      <div className="pill-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-12 text-gray-400">Loading bookings…</p>
          ) : error ? (
            <p className="text-center py-12 text-red-500">{error}</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-5 pl-8">ID</th>
                  <th className="p-5">Room</th>
                  <th className="p-5">Check-In</th>
                  <th className="p-5">Check-Out</th>
                  <th className="p-5 text-right">Total (₹)</th>
                  <th className="p-5 text-center">Status</th>
                  {!isAdmin && <th className="p-5 text-right pr-8">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60 text-[15px] text-gray-700">
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">No bookings found.</td>
                  </tr>
                )}
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 pl-8 font-mono text-[14px] text-primary font-extrabold">#{booking.id}</td>
                    <td className="p-5 text-gray-600">Room #{booking.roomId ?? booking.room?.id ?? '—'}</td>
                    <td className="p-5 font-semibold">{booking.checkInDate}</td>
                    <td className="p-5 font-semibold">{booking.checkOutDate}</td>
                    <td className="p-5 text-right font-extrabold text-primary">
                      ${booking.totalPrice != null ? Number(booking.totalPrice).toFixed(2) : '—'}
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${statusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    {!isAdmin && (
                      <td className="p-5 pr-8 text-right">
                        {booking.status === 'BOOKED' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-[14px] font-bold text-red-400 hover:text-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
