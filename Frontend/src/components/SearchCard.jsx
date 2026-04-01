import GuestPicker from './GuestPicker';

export default function SearchCard({ checkIn, checkOut, setCheckIn, setCheckOut, adults, children, setAdults, setChildren }) {
  return (
    <form className="mt-10 flex flex-wrap items-end justify-center gap-4 rounded-2xl border border-white/30 bg-white/15 p-6 shadow-xl backdrop-blur-md sm:gap-3" onSubmit={(e) => e.preventDefault()}>
      <label className="flex w-72 flex-col text-left text-sm text-stone-100">
        <span className="mb-1 text-xs uppercase tracking-widest">Where to</span>
        <input
          type="text"
          placeholder="Milan, Italy"
          className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white placeholder:text-white/60 outline-none transition focus:border-brand"
        />
      </label>

      <div className="flex w-full gap-3 sm:w-auto">
        <label className="flex flex-1 flex-col text-sm text-stone-100">
          <span className="mb-1 text-xs uppercase tracking-widest">Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-brand"
          />
        </label>
        <label className="flex flex-1 flex-col text-sm text-stone-100">
          <span className="mb-1 text-xs uppercase tracking-widest">Check-out</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-brand"
          />
        </label>
      </div>

      <GuestPicker
        adults={adults}
        children={children}
        setAdults={setAdults}
        setChildren={setChildren}
      />

      <button
        type="submit"
        className="rounded-xl bg-brand px-8 py-2 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
      >
        Search
      </button>
    </form>
  );
}
