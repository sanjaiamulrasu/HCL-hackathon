import React, { useState, useEffect } from 'react';
import { Check, X, Trash2, Edit3, Star, MapPin, Loader2, AlertCircle, Info, LayoutGrid } from 'lucide-react';
import { hotelsApi } from '../utils/api';

export default function AdminHotelsView() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit State
  const [editingHotel, setEditingHotel] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = () => {
    hotelsApi.getAll(0, 100)
      .then(data => {
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setHotels(list);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently decommission this property from the global index?')) return;
    try {
      await hotelsApi.delete(id);
      setHotels(hotels.filter(h => h.id !== id));
    } catch (err) {
      alert('Deactivation failed: ' + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const updated = await hotelsApi.update(editingHotel.id, editingHotel);
      setHotels(hotels.map(h => h.id === editingHotel.id ? updated : h));
      setEditingHotel(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="text-brand animate-spin" size={48} />
        <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Property Records...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end px-2">
         <div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic">Property Authorization</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Active Listings in Ledger: <span className="text-brand">{hotels.length}</span></p>
         </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[32px] text-center space-y-4">
           <AlertCircle className="text-red-500 mx-auto" size={48} />
           <p className="text-red-400 font-bold">{error}</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-20 rounded-[40px] text-center space-y-6">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 italic font-black text-white/10 uppercase tracking-tighter text-xs">Empty</div>
           <p className="text-white/40 text-sm font-medium italic">No properties registered under existing authorities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="group relative bg-slate-900 border border-white/10 p-6 rounded-[40px] hover:bg-slate-800 transition-all duration-500 flex gap-6 shadow-2xl overflow-hidden">
              <div className="w-32 h-44 rounded-3xl overflow-hidden shrink-0 border border-white/10 relative">
                <img
                  src={`https://picsum.photos/seed/hotel${hotel.id}/400/600`}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black backdrop-blur-md bg-black/40 text-brand border border-brand/20 flex items-center gap-1">
                    <Star size={8} fill="#eab308" className="stroke-0" /> {hotel.rating?.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">AUTHORIZED_ID</span>
                     <span className="text-[10px] font-black text-brand tracking-tighter">#{hotel.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-none truncate decoration-brand/20 group-hover:decoration-brand transition-all decoration-1 underline underline-offset-4">{hotel.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/40 font-bold text-xs">
                    <MapPin size={10} className="text-brand" /> {hotel.location}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingHotel({...hotel})}
                    className="flex-1 bg-white/5 hover:bg-brand hover:text-slate-900 border border-white/10 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={12} /> MODIFY_RECORD
                  </button>
                  <button 
                    onClick={() => handleDelete(hotel.id)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500/40 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL - EDIT PROPERTY */}
      {editingHotel && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-[60px] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-[600px] overflow-hidden">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
               <div className="space-y-1">
                 <h3 className="text-3xl font-black text-white tracking-tighter italic">Property Metadata Refresh</h3>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Record Reference: <span className="text-brand">AJX-{editingHotel.id}</span></p>
               </div>
               <button 
                 onClick={() => setEditingHotel(null)}
                 className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5"
               >
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 space-y-6">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-shake">
                   <AlertCircle size={16} /> {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 italic ml-2">
                       <Info size={10} /> Property Legal Name
                    </label>
                    <input 
                      type="text" required 
                      value={editingHotel.name} 
                      onChange={e => setEditingHotel({...editingHotel, name: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:border-brand/40 text-white font-bold tracking-tight text-sm placeholder:text-white/10 transition-all"
                      placeholder="e.g. Royal Windsor" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 italic ml-2">
                       <MapPin size={10} /> Geospatial Coordinates
                    </label>
                    <input 
                      type="text" required 
                      value={editingHotel.location} 
                      onChange={e => setEditingHotel({...editingHotel, location: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:border-brand/40 text-white font-bold tracking-tight text-sm placeholder:text-white/10 transition-all"
                      placeholder="City, Country" 
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 italic ml-2">
                    <LayoutGrid size={10} /> Narrative / Description
                 </label>
                 <textarea 
                   rows={3} 
                   value={editingHotel.description} 
                   onChange={e => setEditingHotel({...editingHotel, description: e.target.value})}
                   className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:border-brand/40 text-white font-bold tracking-tight text-sm placeholder:text-white/10 transition-all resize-none"
                   placeholder="Detailed property highlights..." 
                 />
              </div>

              <div className="space-y-2">
                 <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 italic ml-2">
                    <Star size={10} /> Appraisal Rating (1.0 - 5.0)
                 </label>
                 <div className="flex items-center gap-4">
                    <input 
                      type="range" min="1" max="5" step="0.1"
                      value={editingHotel.rating} 
                      onChange={e => setEditingHotel({...editingHotel, rating: parseFloat(e.target.value)})}
                      className="flex-1 accent-brand h-2 bg-white/5 rounded-full appearance-none cursor-pointer border border-white/10"
                    />
                    <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand text-slate-900 font-black text-sm">
                       {editingHotel.rating?.toFixed(1)}
                    </span>
                 </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setEditingHotel(null)}
                  className="flex-1 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all bg-white/5 rounded-full"
                >
                  DEFER CHANGES
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-[2] py-5 bg-brand text-slate-900 font-black text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-yellow-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(234,179,8,0.2)]"
                >
                  {saving ? (
                     <>
                        <Loader2 size={16} className="animate-spin" />
                        UPDATING_LEDGER...
                     </>
                  ) : (
                    <>
                       <Check size={16} strokeWidth={3} /> EXECUTE_UPDATE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
