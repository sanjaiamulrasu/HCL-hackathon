import { useState } from 'react';
import { Star, Search } from 'lucide-react';
import { hotelsApi } from '../utils/api';
import HotelRoomsModal from './HotelRoomsModal';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    setSearchError('');
    setResults(null);
    try {
      const data = await hotelsApi.search(location);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="mt-10">
      <form
        className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/15 p-4 shadow-xl backdrop-blur-md max-w-xl mx-auto"
        onSubmit={handleSearch}
      >
        <label className="flex flex-1 flex-col text-left text-sm text-stone-100">
          <span className="mb-1 text-xs uppercase tracking-widest px-1">Where to</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, country…"
            className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/60 outline-none transition focus:border-brand text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 disabled:opacity-60 mt-5 shrink-0"
        >
          <Search size={16} />
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {/* Error */}
      {searchError && (
        <p className="mt-4 text-center text-red-400 font-medium">{searchError}</p>
      )}

      {/* Results */}
      {results !== null && (
        <div className="mt-8">
          {results.length === 0 ? (
            <p className="text-center text-white/70 font-medium">No hotels found for "{location}".</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map(hotel => (
                <div 
                  key={hotel.id} 
                  onClick={() => handleHotelClick(hotel)}
                  className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur border border-white/20 shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <img
                    src={`https://picsum.photos/seed/hotel${hotel.id}/600/400`}
                    alt={hotel.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Hotel'; }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg leading-tight mb-1">{hotel.name}</h3>
                    <p className="text-white/70 text-sm mb-2 font-medium">{hotel.location}</p>
                    {hotel.description && <p className="text-white/40 text-xs line-clamp-2 mb-3 leading-relaxed">{hotel.description}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white/80 text-sm font-black italic">
                         <Star size={14} fill="currentColor" className="text-brand border-0 stroke-0" /> {hotel.rating?.toFixed(1) || '0.0'}
                      </div>
                      <span className="text-brand text-xs font-bold uppercase tracking-widest border border-brand/50 px-2 py-0.5 rounded-full group-hover:bg-brand group-hover:text-slate-900 transition-all">View Rooms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Room Selection Modal */}
      {selectedHotel && (
        <HotelRoomsModal 
          hotel={selectedHotel} 
          onClose={() => setSelectedHotel(null)} 
        />
      )}
    </div>
  );
}

