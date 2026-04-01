import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { authApi } from '../utils/api';
import { User, Building2, ShieldCheck, Mail, Lock, UserCircle } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // 'USER' or 'HOTEL_MANAGER'
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authApi.register({ name, email, password, role });
      alert(data.message || 'OTP sent successfully!');
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login({ email, password });
      login({ email, token: data.token });
      
      // Decode role from JWT payload (middle part)
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const authorities = payload.authorities || payload.roles || [];
        
        if (authorities.includes('ADMIN')) {
          navigate('/admin');
        } else if (authorities.includes('HOTEL_MANAGER')) {
          navigate('/manager');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.warn('Could not decode token, staying on home:', err);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (mode === 'register') {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError('');
    try {
      const data = await authApi.verifyOtp({ email, otp });
      alert(data.message || 'Verification successful! Please login.');
      setMode('login');
      setStep('form');
      setOtp('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(55,114,255,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl backdrop-blur-xl relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-600/20">
             <div className="flex gap-1.5 items-end">
                <div className="w-2 h-5 bg-blue-500 rounded-sm"></div>
                <div className="w-2 h-8 bg-blue-500 rounded-sm"></div>
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter">QUICKSTAY</h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] mt-1">
            {step === 'otp' ? 'Verification' : mode === 'login' ? 'Welcome Back' : 'Join the Network'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 animate-slide-up">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        {step === 'form' ? (
          <>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-4">
                  {/* Role Selector */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${role === 'USER' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40 hover:border-white/10'}`}
                    >
                      <User size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Traveler</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('HOTEL_MANAGER')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${role === 'HOTEL_MANAGER' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40 hover:border-white/10'}`}
                    >
                      <Building2 size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Manager</span>
                    </button>
                  </div>

                  <div className="relative group">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm font-bold outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm font-bold outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm font-bold outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-blue-400 transition-colors"
              >
                {mode === 'login' ? 'New here? Register now' : 'Have an account? Sign in'}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
               <h3 className="text-xl font-bold">One Last Step</h3>
               <p className="text-white/40 text-xs font-medium">Enter the 6-digit verification code sent to your inbox.</p>
            </div>
            
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-4 py-8 text-white text-center text-5xl font-black outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all font-mono tracking-[0.4em]"
                placeholder="000000"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/20"
              >
                {loading ? 'Verifying...' : 'Complete Registration'}
              </button>
            </form>

            <button
              onClick={() => setStep('form')}
              className="w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors"
            >
              Back to form
            </button>
          </div>
        )}
      </div>

      {/* Footer info */}
      <p className="absolute bottom-10 text-[10px] font-bold text-white/10 tracking-[0.4em] uppercase">
        QuickStay Cloud Security &bull; Protected by JWT
      </p>
    </div>
  );
}