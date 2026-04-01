import { useState, useEffect } from 'react';
import { roomsApi, bookingsApi } from '../utils/api';
import { Check, X, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';

export default function HotelRoomsModal({ hotel, onClose }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [step, setStep] = useState('DATES'); // DATES, ROOMS, CONFIRM
  
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchRooms = async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const data = await roomsApi.getAvailable(hotel.id, checkIn, checkOut);
      setRooms(Array.isArray(data) ? data : []);
      setStep('ROOMS');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (room) => {
    if (!user) {
      alert('Please log in to book a room.');
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setError('');
    try {
      const booking = await bookingsApi.book({
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut
      });
      setCreatedBooking(booking);
      setShowPayment(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setStep('CONFIRM');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in relative">
        
        {/* Step Indicator Header (Desktop) */}
        {!showPayment && step !== 'CONFIRM' && (
          <div className="hidden md:flex p-6 border-b border-white/5 bg-white/[0.02] justify-center gap-12">
            {[
              { id: 'DATES', label: 'SELECT DATES' },
              { id: 'ROOMS', label: 'CHOOSE ROOM' },
              { id: 'CONFIRM', label: 'BOOKED' }
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter ${step === s.id ? 'bg-brand text-slate-900' : 'bg-white/10 text-white/40'}`}>
                  {idx + 1}
                </span>
                <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${step === s.id ? 'text-brand' : 'text-white/20'}`}>
                  {s.label}
                </span>
                {idx < 2 && <ArrowRight size={10} className="text-white/10" />}
              </div>
            ))}
          </div>
        )}

        {/* Modal Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{hotel.name}</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-brand rounded-full"></span>
              {hotel.location}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all text-sm font-bold"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6">
          
          {step === 'CONFIRM' ? (
            <div className="py-20 text-center animate-slide-up space-y-8">
              <div className="w-24 h-24 bg-brand/20 rounded-[32px] flex items-center justify-center mx-auto border-2 border-brand mb-6 shadow-2xl shadow-brand/20">
                <Check className="text-brand" size={48} strokeWidth={3} />
              </div>
              <div className="space-y-3">
                <h3 className="text-4xl font-black text-white tracking-widest uppercase">Confirmed!</h3>
                <p className="text-white/40 font-medium max-w-sm mx-auto">Your luxury stay is successfully reserved. A digital copy is sent to your dashboard.</p>
              </div>
              <div className="pt-8">
                <button 
                  onClick={() => navigate('/portal')}
                  className="bg-white text-slate-900 px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                  Manage My Bookings
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-end group focus-within:border-brand/40 transition-all shadow-lg">
                <div className="flex-1 w-full space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 ml-4 font-sans italic">Check-In Arrival</label>
                   <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:bg-white/10 transition-all font-mono" />
                </div>
                <div className="flex-1 w-full space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 ml-4 font-sans italic">Check-Out Departure</label>
                   <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:bg-white/10 transition-all font-mono" />
                </div>
                <button 
                  onClick={fetchRooms}
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-5 rounded-2xl bg-brand font-black text-slate-900 hover:bg-yellow-300 transition-all disabled:opacity-50 text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-brand/10 group-hover:-translate-y-1"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  Check Availability
                </button>
              </div>

              {error && <p className="text-red-400 bg-red-400/10 border border-red-400/20 px-8 py-3 rounded-2xl font-bold tracking-tight animate-fade-in">{error}</p>}

              {/* Room Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                       <Loader2 className="animate-spin text-brand" size={48} />
                       <p className="text-white/20 font-black tracking-widest uppercase text-xs">Architecting your stay options...</p>
                    </div>
                 ) : rooms.length > 0 ? (
                    rooms.map(room => (
                      <div key={room.id} className="relative group bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/[0.06] transition-all hover:border-brand/40 overflow-hidden min-h-[220px]">
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <span className="bg-brand/10 text-brand text-[10px] font-black px-3 py-1.5 rounded-full border border-brand/20 uppercase tracking-widest">
                                {room.type} Suite
                              </span>
                              <div className="text-right">
                                 <span className="text-3xl font-black text-white">${room.price}</span>
                                 <span className="text-white/20 block text-[9px] font-black tracking-widest mt-0.5">PER NIGHT</span>
                              </div>
                           </div>
                           <h4 className="text-2xl font-black text-white italic tracking-tighter mb-2">Pinnacle Tower Room #{room.roomNumber}</h4>
                           <p className="text-white/30 text-[11px] font-bold tracking-tight line-clamp-2 max-w-[240px]">Panoramic cityscape views, obsidian marble finishes, and 24/7 personalized concierge access.</p>
                        </div>
                        
                        <div className="mt-8 relative z-10">
                           <button 
                             onClick={() => handleBook(room)}
                             disabled={bookingLoading}
                             className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-tighter hover:bg-brand transition-all flex items-center justify-center gap-2 disabled:bg-white/10 group-active:scale-95"
                           >
                             {bookingLoading ? 'Initiating...' : 'Secure This Reservation'}
                           </button>
                        </div>

                        {/* Aesthetic flourish */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand/5 blur-3xl rounded-full group-hover:bg-brand/10 transition-all"></div>
                      </div>
                    ))
                 ) : (
                    step === 'ROOMS' && (
                      <div className="col-span-full py-20 text-center opacity-40">
                         <p className="text-2xl font-bold tracking-tighter mb-2">No availability matching criteria.</p>
                         <p className="text-sm font-medium tracking-wide">Consider adjusting your arrival or departure dates.</p>
                      </div>
                    )
                 )}
              </div>
            </>
          )}
        </div>

        {/* Modals on top */}
        {showPayment && createdBooking && (
          <PaymentModal 
            booking={createdBooking} 
            onSuccess={handlePaymentSuccess}
            onCancel={() => { setShowPayment(false); setCreatedBooking(null); }}
          />
        )}

      </div>
    </div>
  );
}
