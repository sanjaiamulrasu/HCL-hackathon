import { useState } from 'react';
import { paymentsApi } from '../utils/api';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentModal({ booking, onSuccess, onCancel }) {
  const [method, setMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await paymentsApi.process({
        bookingId: booking.id,
        method: method,
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-8 text-center bg-white/5 border-b border-white/5">
          <div className="w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand/20">
            <CreditCard className="text-brand" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Finalize Payment</h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Booking #{booking.id}</p>
        </div>

        {/* Content */}
        <form onSubmit={handlePayment} className="p-8 space-y-6">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
            <span className="text-white/60 font-medium">Total Amount Due</span>
            <span className="text-white text-2xl font-black text-brand">${booking.totalPrice?.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
             <label className="text-xs uppercase tracking-widest text-white/40 font-bold px-1">Select Payment Method</label>
             <div className="grid grid-cols-2 gap-3">
               {['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING'].map(m => (
                 <button
                   key={m}
                   type="button"
                   onClick={() => setMethod(m)}
                   className={`px-4 py-3 rounded-xl border text-xs font-black transition-all ${method === m ? 'bg-brand text-slate-900 border-brand' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'}`}
                 >
                   {m.replace('_', ' ')}
                 </button>
               ))}
             </div>
          </div>

          {error && <p className="text-red-400 text-sm font-bold text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

          <div className="pt-4 flex flex-col gap-3">
            <button
              disabled={loading}
              className="w-full bg-brand text-slate-900 font-black py-4 rounded-2xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} />
              {loading ? 'Processing...' : 'Pay & Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-white/40 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em]"
            >
              Cancel Payment
            </button>
          </div>
        </form>

        <div className="p-6 bg-white/[0.02] text-center">
           <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">AES-256 Bit Encrypted Security</p>
        </div>
      </div>
    </div>
  );
}
