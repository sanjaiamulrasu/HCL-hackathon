export default function GuestPicker({ adults, children, setAdults, setChildren }) {
  return (
    <div className="flex w-72 flex-col gap-1 text-left text-sm text-stone-100">
      <span className="text-xs uppercase tracking-widest text-white/80">Guests</span>
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/30 bg-white/10 p-2">
        <div className="flex w-1/2 flex-col gap-1 rounded-lg bg-white/5 p-2">
          <span className="text-xs text-white/70">Adults</span>
          <div className="flex items-center justify-between rounded-lg border border-white/20 bg-black/30 px-2 py-1">
            <button
              type="button"
              onClick={() => setAdults((v) => v + 1)}
              className="h-6 w-6 rounded-full border border-white/40 text-white hover:bg-white/20"
            >
              ▲
            </button>
            <span className="text-sm font-semibold text-white">{adults}</span>
            <button
              type="button"
              onClick={() => setAdults((v) => Math.max(1, v - 1))}
              className="h-6 w-6 rounded-full border border-white/40 text-white hover:bg-white/20"
            >
              ▼
            </button>
          </div>
        </div>
        <div className="flex w-1/2 flex-col gap-1 rounded-lg bg-white/5 p-2">
          <span className="text-xs text-white/70">Children</span>
          <div className="flex items-center justify-between rounded-lg border border-white/20 bg-black/30 px-2 py-1">
            <button
              type="button"
              onClick={() => setChildren((v) => v + 1)}
              className="h-6 w-6 rounded-full border border-white/40 text-white hover:bg-white/20"
            >
              ▲
            </button>
            <span className="text-sm font-semibold text-white">{children}</span>
            <button
              type="button"
              onClick={() => setChildren((v) => Math.max(0, v - 1))}
              className="h-6 w-6 rounded-full border border-white/40 text-white hover:bg-white/20"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
