import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Trash2 } from 'lucide-react';
import { roomsApi, hotelsApi } from '../utils/api';

export default function RoomsView() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form — matches RoomDto: roomNumber, type, price, isAvailable, hotelId
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('STANDARD');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [formHotelId, setFormHotelId] = useState('');

  // Load hotels list for selectors
  useEffect(() => {
    hotelsApi.getAll(0, 100)
      .then(data => {
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setHotels(list);
        if (list.length > 0) {
          setSelectedHotelId(String(list[0].id));
          setFormHotelId(String(list[0].id));
        }
      })
      .catch(console.warn);
  }, []);

  // Load rooms when hotel selection changes
  useEffect(() => {
    if (!selectedHotelId) return;
    setIsLoading(true);
    roomsApi.getByHotel(selectedHotelId)
      .then(data => setRooms(Array.isArray(data) ? data : []))
      .catch(err => console.warn(err.message))
      .finally(() => setIsLoading(false));
  }, [selectedHotelId]);

  const resetForm = () => {
    setRoomNumber(''); setType('STANDARD'); setPrice(''); setIsAvailable(true);
    setFormError('');
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const saved = await roomsApi.add({
        roomNumber,
        type,
        price: parseFloat(price),
        isAvailable,
        hotelId: parseInt(formHotelId),
      });
      // Refresh list if the room belongs to currently viewed hotel
      if (String(saved.hotelId) === selectedHotelId) {
        setRooms([saved, ...rooms]);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    try {
      await roomsApi.delete(id);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const typeColor = (t) => {
    if (t === 'SUITE') return 'bg-purple-100 text-purple-700';
    if (t === 'DELUXE') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-[32px] shadow-sm border border-slate-100">
        <select
          value={selectedHotelId}
          onChange={e => setSelectedHotelId(e.target.value)}
          className="px-5 py-3 rounded-full border border-gray-200 text-[15px] font-medium text-primary bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none min-w-[220px]"
        >
          {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-full shadow-sm hover:scale-105 transition-transform"
        >
          <Plus size={18} strokeWidth={2.5} /> Add Room
        </button>
      </div>

      {/* Table */}
      <div className="pill-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-12 text-gray-400">Loading rooms…</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-5 pl-8">Room #</th>
                  <th className="p-5">Type</th>
                  <th className="p-5 text-right">Price/Night</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60 text-[15px] text-gray-700">
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">No rooms found for this hotel.</td>
                  </tr>
                )}
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 pl-8">
                      <span className="bg-gray-100 text-primary px-3 py-1 rounded-full font-mono text-[14px] font-bold border border-gray-200">
                        {room.roomNumber}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold tracking-wide ${typeColor(room.type)}`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="p-5 text-right font-bold text-primary">
                      ${room.price?.toFixed(2)}
                    </td>
                    <td className="p-5 text-center">
                      {room.available ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[13px] font-bold border border-emerald-100">
                          <Check size={14} strokeWidth={3} /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1 rounded-full text-[13px] font-bold border border-red-100">
                          <X size={14} strokeWidth={3} /> Booked
                        </span>
                      )}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[560px] overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-[20px] font-bold tracking-tight text-primary">Add Room</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddRoom} className="px-8 py-6 space-y-5">
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div>
                <label className="block text-[14px] font-bold text-primary mb-2">Assign to Hotel</label>
                <select
                  required value={formHotelId} onChange={e => setFormHotelId(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none font-medium text-[15px]"
                >
                  {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[14px] font-bold text-primary mb-2">Room Number</label>
                  <input
                    type="text" required value={roomNumber} onChange={e => setRoomNumber(e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-medium text-[15px]"
                    placeholder="e.g. 101A"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-primary mb-2">Type</label>
                  <select
                    required value={type} onChange={e => setType(e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none font-medium text-[15px]"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-bold text-primary mb-2">Price per Night ($)</label>
                <input
                  type="number" min="1" step="0.01" required value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-medium text-[15px]"
                  placeholder="150"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox" id="isAvail" className="w-5 h-5 accent-indigo-500"
                  checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)}
                />
                <label htmlFor="isAvail" className="text-[15px] font-bold text-primary cursor-pointer">
                  Available for booking
                </label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3 text-[15px] font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-colors">Discard</button>
                <button type="submit" disabled={saving}
                  className="px-8 py-3 bg-primary text-white font-bold text-[15px] rounded-full hover:bg-gray-800 transition-all disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
