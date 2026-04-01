import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLoginClick = () => {
    setShowRolePicker(false);
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-white">
      <div className="text-2xl font-bold">QuickStay</div>
      <div className="relative flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20 transition"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{user.name}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/30 bg-slate-900/95 p-2 shadow-lg backdrop-blur">
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setShowRolePicker((prev) => !prev)}
              className="rounded-xl bg-brand px-4 py-2 font-semibold text-slate-900 hover:bg-yellow-400 transition"
            >
              Login
            </button>
            {showRolePicker && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/30 bg-slate-900/95 p-2 shadow-lg backdrop-blur">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                >
                  Hotel Manager
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
