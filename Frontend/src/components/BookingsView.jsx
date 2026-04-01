import React, { useEffect, useState } from 'react';
import { bookingsApi } from '../utils/api';
import { Calendar, Hash, CreditCard, XCircle, CheckCircle, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    BOOKED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  const icons = {
    PENDING: <Clock size={12} />,
    BOOKED: <CheckCircle size={12} />,
    CANCELLED: <XCircle size={12} />,
    COMPLETED: <CheckCircle size={12} />,
  };

  const currentStyle = styles[status] || styles.PENDING;
  const currentIcon = icons[status] || icons.PENDING;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentStyle}`}>
      {currentIcon}
      {status}
    </span>
  );
};

export default function BookingsView({ isAdmin }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    bookingsApi.myBookings()
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to request a cancellation for this reservation?')) return;
    try {
      await bookingsApi.cancel(id);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
        <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Accessing Reservation Ledger...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tighter">
             {isAdmin ? 'System-Wide Ledger' : 'My Reservations'}
           </h2>
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1 italic">
             {bookings.length} Registered Records Found
           </p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[32px] text-center space-y-4">
           <AlertCircle className="text-red-500 mx-auto" size={48} />
           <p className="text-red-400 font-bold">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-20 rounded-[40px] text-center space-y-6">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
              <Calendar className="text-white/10" size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No Active Reservations</h3>
              <p className="text-white/40 text-sm max-w-xs mx-auto font-medium">Your itinerary is currently empty. Explore our selection of premium properties to start your journey.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="group relative bg-slate-900 border border-white/10 p-8 rounded-[40px] hover:bg-slate-800 transition-all duration-500 flex flex-col md:flex-row gap-8 shadow-2xl">
              {/* Left Side: IDs & Status */}
              <div className="flex flex-col justify-between items-start space-y-6 shrink-0 md:border-r md:border-white/5 md:pr-8">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/20">
                       <Hash size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">RECORD_ID</span>
                    </div>
                    <div className="text-2xl font-black text-blue-400 tracking-tighter">#{booking.id}</div>
                 </div>
                 <StatusBadge status={booking.status} />
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <div className="text-white/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <MapPin size={10} /> ROOM_LOCATION
                       </div>
                       <div className="text-white font-bold text-lg italic tracking-tight">
                         Suite #{booking.room?.roomNumber || booking.roomId || 'N/A'}
                       </div>
                       <div className="text-white/40 text-[10px] font-medium leading-tight">
                         {booking.room?.hotel?.name || 'Grand Hyatt Premium'}
                       </div>
                    </div>
                    <div className="space-y-1 text-right">
                       <div className="text-white/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 justify-end">
                          <CreditCard size={10} /> TOTAL_INVESTMENT
                       </div>
                       <div className="text-3xl font-black text-white tracking-tighter">
                         ${Number(booking.totalPrice || 0).toLocaleString()}
                       </div>
                       <div className="text-emerald-500/60 text-[9px] font-black uppercase tracking-widest">
                         SECURE TRANSACTION
                       </div>
                    </div>
                 </div>

                 <div className="h-px bg-white/5 w-full" />

                 <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                       <div className="space-y-1">
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">CHECK_IN</span>
                          <span className="text-sm font-bold text-white font-mono">{booking.checkInDate}</span>
                       </div>
                       <ArrowDivider />
                       <div className="space-y-1">
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">CHECK_OUT</span>
                          <span className="text-sm font-bold text-white font-mono">{booking.checkOutDate}</span>
                       </div>
                    </div>
                    
                    {!isAdmin && booking.status !== 'CANCELLED' && (
                       <button
                         onClick={() => handleCancel(booking.id)}
                         className="px-6 py-2 rounded-2xl bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                       >
                         CANCEL
                       </button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowDivider() {
  return (
    <div className="flex items-center gap-1 opacity-20">
       <div className="w-1 h-1 bg-white rounded-full"></div>
       <div className="w-1 h-1 bg-white rounded-full"></div>
       <div className="w-4 h-[1px] bg-white"></div>
    </div>
  );
}
