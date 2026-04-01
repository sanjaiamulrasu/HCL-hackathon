import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { LayoutDashboard, BookOpen, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const auths = user.authorities || [];
    if (auths.includes('ROLE_ADMIN') || auths.includes('ADMIN')) return '/admin';
    if (auths.includes('ROLE_HOTEL_MANAGER') || auths.includes('HOTEL_MANAGER')) return '/manager';
    return '/bookings';
  };

  return (
    <header className="relative z-50 flex flex-wrap items-center justify-between gap-4 px-8 py-6 text-white max-w-7xl mx-auto w-full">
      <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 group">
        <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-slate-900 group-hover:rotate-12 transition-transform duration-500">
           QS
        </div>
        QuickStay<span className="text-brand">.</span>
      </Link>

      <nav className="flex items-center gap-8">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="group flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-5 py-3 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs border border-blue-400/20 group-hover:scale-110 transition-transform">
                {user?.name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div className="flex flex-col items-start">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1 italic">Welcome back</span>
                 <span className="text-sm font-black tracking-tight leading-none">{user?.name || user?.email || 'User'}</span>
              </div>
              <ChevronDown size={14} className={`text-white/20 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-4 w-60 rounded-3xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl animate-fade-in divide-y divide-white/5 overflow-hidden">
                <div className="pb-3 px-2">
                   <Link 
                     to={getDashboardPath()}
                     onClick={() => setShowUserMenu(false)}
                     className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                   >
                     <LayoutDashboard size={18} className="text-brand" />
                     {user.authorities?.some(a => a.includes('MANAGER') || a.includes('ADMIN')) ? 'Dashboard' : 'My Bookings'}
                   </Link>
                </div>
                <div className="pt-3 px-2">
                   <button
                     onClick={handleLogout}
                     className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                   >
                     <LogOut size={18} />
                     Sign Out Securely
                   </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="group rounded-2xl bg-white text-slate-900 px-8 py-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-brand transition-all flex items-center gap-3 shadow-xl active:scale-95"
          >
            Authenticate
            <BookOpen size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </nav>
    </header>
  );
}
