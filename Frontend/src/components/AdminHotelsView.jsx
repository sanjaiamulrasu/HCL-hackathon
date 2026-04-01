import React, { useState, useEffect } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { hotelsApi } from '../utils/api';

export default function AdminHotelsView() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    hotelsApi.getAll(0, 100)
      .then(data => {
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setHotels(list);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this hotel?')) return;
    try {
      await hotelsApi.delete(id);
      setHotels(hotels.filter(h => h.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400 font-semibold">Loading…</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex justify-between items-end mb-6 px-2">
        <h2 className="text-xl font-bold tracking-tight text-primary">All Hotels</h2>
        <span className="text-sm text-gray-400">{hotels.length} total</span>
      </div>

      {hotels.length === 0 && (
        <p className="text-center text-gray-400 py-16">No hotels registered yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="relative group bg-slate-200 overflow-hidden rounded-[24px] h-[300px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={`https://picsum.photos/seed/hotel${hotel.id}/800/600`}
              alt={hotel.name}
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Hotel'; }}
            />

            {/* Delete button */}
            <button
              onClick={() => handleDelete(hotel.id)}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/90"
            >
              <Trash2 size={14} className="text-white" />
            </button>

            {/* Rating badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1.5 rounded-full text-[13px] font-bold backdrop-blur-md bg-primary/70 text-white flex items-center gap-1">
                ★ {hotel.rating?.toFixed(1)}
              </span>
            </div>

            {/* Gradient */}
            <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />

            {/* Content */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1">
              <h3 className="text-[20px] font-bold text-white leading-tight">{hotel.name}</h3>
              <p className="text-[15px] font-semibold text-white/85">{hotel.location}</p>
              {hotel.description && (
                <p className="text-[12px] text-white/60 line-clamp-1">{hotel.description}</p>
              )}

              {/* Admin action buttons */}
              <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => alert(`Edit hotel ${hotel.id} — coming soon`)}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-2 rounded-full text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check size={14} strokeWidth={3} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel.id)}
                  className="flex-1 bg-white/10 hover:bg-red-500 backdrop-blur-md text-white font-bold py-2 rounded-full text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X size={14} strokeWidth={3} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
