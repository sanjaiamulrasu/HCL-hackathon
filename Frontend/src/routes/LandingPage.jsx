import { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

export default function LandingPage() {
  const [checkIn, setCheckIn] = useState('2025-11-04');
  const [checkOut, setCheckOut] = useState('2025-12-04');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/assets/landingpage.png')] bg-cover bg-center opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40" />

      <Header />

      <main className="relative z-10 mx-auto mt-20 max-w-6xl px-6 text-center text-white sm:mt-28">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Unwind in Stunning Resorts, Stay in Elegant Hotels.
        </h1>
        <p className="mt-5 text-lg text-stone-200 sm:text-xl">
          Expert support for a smooth and hassle-free booking process
        </p>

        <SearchBar
          checkIn={checkIn}
          checkOut={checkOut}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          adults={adults}
          children={children}
          setAdults={setAdults}
          setChildren={setChildren}
        />

        
      </main>
    </div>
  );
}
