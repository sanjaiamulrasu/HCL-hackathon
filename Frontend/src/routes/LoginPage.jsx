import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function LoginPage() {
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    // Generate random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
    alert(`OTP sent to ${email}: ${randomOtp}`); // For demo, show OTP
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      // Create user (simulate)
      const userData = { name, email };
      login(userData);
      console.log('User created:', { name, email, password });
      alert('User created successfully!');
      navigate('/');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/85 p-8 shadow-2xl backdrop-blur">
        {step === 'form' ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition"
              >
                Enter
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Enter OTP</h2>
            <p className="text-sm text-slate-400 mb-4">Enter the 6-digit OTP sent to your email.</p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white text-center text-2xl outline-none focus:border-blue-500"
                placeholder="000000"
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition"
              >
                Verify & Create User
              </button>
            </form>
            <button
              onClick={() => setStep('form')}
              className="mt-4 w-full rounded-lg bg-gray-600 py-2 font-semibold text-white hover:bg-gray-700 transition"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}