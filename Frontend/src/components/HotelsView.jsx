import React, { useState, useEffect } from 'react';
import { Heart, Star, Plus, Trash2 } from 'lucide-react';
import { hotelsApi } from '../utils/api';

export default function HotelsView() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form state — matches HotelDto: name, location, description, rating
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('4.5');

  useEffect(() => {
    hotelsApi.getAll(0, 50)
      .then(data => {
        // Backend returns Page<HotelDto> → { content: [...] }
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setHotels(list);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const resetForm = () => {
    setName(''); setLocation(''); setDescription(''); setRating('4.5');
    setFormError('');
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const saved = await hotelsApi.add({
        name,
        location,
        description,
        rating: parseFloat(rating),
      });
      setHotels([saved, ...hotels]);
      setShowModal(false);
      resetForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this hotel?')) return;
    try {
      await hotelsApi.delete(id);
      setHotels(hotels.filter(h => h.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400 font-semibold">Loading hotels…</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-accent-dark transition-colors"
        >
          <Plus size={18} /> Add New Listing
        </button>
      </div>

      {hotels.length === 0 && (
        <p className="text-center text-gray-400 py-16">No hotels found. Add your first listing!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="relative group bg-slate-200 overflow-hidden rounded-[24px] h-[300px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Placeholder image using hotel id as seed */}
            <img
              src={`https://picsum.photos/seed/hotel${hotel.id}/800/600`}
              alt={hotel.name}
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Hotel'; }}
            />

            {/* Favourite */}
            <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
              <Heart size={16} className="text-gray-600 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(hotel.id)}
              className="absolute top-4 left-4 z-20 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/90"
            >
              <Trash2 size={14} className="text-white" />
            </button>

            {/* Gradient */}
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

            {/* Content */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1">
              <h3 className="text-[20px] font-bold text-white leading-tight">{hotel.name}</h3>
              <p className="text-[15px] text-white/85">{hotel.location}</p>
              {hotel.description && (
                <p className="text-[12px] text-white/60 line-clamp-1">{hotel.description}</p>
              )}
              <div className="flex items-center justify-end gap-1 mt-1 text-[14px] font-medium text-white/90">
                <Star size={13} fill="white" className="stroke-0" />
                {hotel.rating?.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Hotel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold tracking-tight text-primary">Add Property</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddHotel} className="px-8 py-6 space-y-4">
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div>
                <label className="block text-[14px] font-semibold text-primary mb-1">Hotel Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-[15px]"
                  placeholder="e.g. Grand Aurora Resort" />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-primary mb-1">Location</label>
                <input type="text" required value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-[15px]"
                  placeholder="e.g. New York, USA" />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-primary mb-1">Description</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-[15px] resize-none"
                  placeholder="Short description…" />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-primary mb-1">Rating (1–5)</label>
                <input type="number" step="0.1" min="1" max="5" required value={rating} onChange={e => setRating(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-[15px]" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2.5 text-[15px] font-semibold text-gray-500 hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-primary text-white font-bold text-[15px] rounded-full hover:bg-gray-800 transition-all disabled:opacity-50">
                  {saving ? 'Saving…' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
