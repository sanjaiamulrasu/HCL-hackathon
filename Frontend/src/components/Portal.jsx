import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, LogOut, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function Portal() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Decode role from JWT payload (base64 middle section)
  const getRole = () => {
    if (!user?.token) return null;
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      // Spring Security stores authorities as a list
      const authorities = payload.authorities || payload.roles || [];
      if (authorities.includes('ADMIN')) return 'ADMIN';
      if (authorities.includes('HOTEL_MANAGER')) return 'HOTEL_MANAGER';
      return 'USER';
    } catch {
      return null;
    }
  };

  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="pill-card p-12">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <h1 className="text-3xl font-extrabold text-primary mb-3">QuickStay</h1>
            <p className="text-gray-500 mb-8">Please log in to access your dashboard.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-gray-800 transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFC] font-sans flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in text-primary">
          <div className="w-16 h-16 rounded-xl mx-auto mb-6 bg-primary flex items-center justify-center shadow-lg">
            <div className="flex gap-2">
              <div className="w-2.5 h-6 bg-white rounded-sm"></div>
              <div className="w-2.5 h-8 bg-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-3">QuickStay Access Portal</h1>
          <p className="text-gray-500 font-medium">
            Logged in as <span className="font-bold text-primary">{user.email}</span>
            {role && <span className="ml-2 px-2 py-0.5 bg-accent/20 text-primary rounded-full text-sm font-bold">{role}</span>}
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Role-based cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">

          {/* Hotel Manager card — shown to MANAGER and ADMIN */}
          {(role === 'HOTEL_MANAGER' || role === 'ADMIN') && (
            <div
              onClick={() => navigate('/manager')}
              className="group pill-card p-10 cursor-pointer hover:border-accent hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-accent/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserRound size={36} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">Hotel Manager</h2>
              <p className="text-gray-500 font-medium mb-8">
                Manage your properties, handle room inventory, and track live bookings.
              </p>
              <button className="flex items-center gap-3 text-lg font-bold text-primary group-hover:text-accent-dark">
                Access Dashboard <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Admin card — shown only to ADMIN */}
          {role === 'ADMIN' && (
            <div
              onClick={() => navigate('/admin')}
              className="group pill-card p-10 cursor-pointer hover:border-primary hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={36} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">System Admin</h2>
              <p className="text-gray-500 font-medium mb-8">
                Manage all hotels, rooms, and platform-wide bookings.
              </p>
              <button className="flex items-center gap-3 text-lg font-bold text-primary group-hover:text-gray-600">
                Access Console <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Regular USER card */}
          {role === 'USER' && (
            <div className="pill-card p-10 text-center flex flex-col items-center col-span-full max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-6">
                <User size={36} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">Welcome, {user.email}</h2>
              <p className="text-gray-500 font-medium mb-8">
                Browse hotels and make bookings from the landing page.
              </p>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 text-lg font-bold text-primary hover:text-accent-dark"
              >
                Browse Hotels <ArrowRight size={20} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
