import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import DNSVRoundedLogo from '../../../components/common/DNSVRoundedLogo.jsx';
import AnimatedLogoBackground from '../../../components/common/AnimatedLogoBackground.jsx';
import { FadeIn } from '../../../components/animations/MotionComponents.jsx';

export default function AdminLoginView({ onLoginSuccess, loginFn }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !password) {
      setError('Please enter both Admin ID and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginFn({ adminId: adminId.trim(), password });
      if (res?.data?.token) {
        onLoginSuccess(res.data);
      } else {
        setError('Invalid authentication response from server.');
      }
    } catch (err) {
      setError(err.message || 'Invalid Admin ID or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 text-[#0F172A]">
      <AnimatedLogoBackground />

      <FadeIn className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-8 sm:p-10 space-y-7">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center space-y-3">
            <DNSVRoundedLogo className="w-16 h-16 drop-shadow-[0_4px_16px_rgba(0,210,255,0.35)]" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
                DNSV Admin Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Sign in to manage client submissions, quotes, contacts, and site content.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-id" className="block text-xs font-semibold text-slate-700">
                Admin ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-id"
                  type="text"
                  autoComplete="username"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter Admin ID"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#00D2FF]/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Admin Password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#00D2FF]/20 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:from-[#0EA5E9] hover:to-[#2563EB] shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Admin Panel'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}
