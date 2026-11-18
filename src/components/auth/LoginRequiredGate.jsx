import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext.jsx';

function GoogleColorIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export default function LoginRequiredGate({
  title = 'Login, Register, or Sign Up with Google to Unlock Full Access',
  description = 'Basic overview information is visible publicly. Login or Register using a real verified email on your device, or Sign Up with Google directly to view complete specs, tools, and submit forms.',
  highlights = [
    'Verified inbox authentication across Gmail, Yahoo, Outlook & Google (zero fake emails)',
    'Live tracking for Draft, Pending, In Process, Fulfilled & Completed forms',
    'Direct engineering reply threads & saved plan bookmarks'
  ]
}) {
  const { openLoginBox, directGoogleSignUp, isAuthenticated, needsPhoneRegistration } = useUserAuth();
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleError, setGoogleError] = useState('');

  if (isAuthenticated && !needsPhoneRegistration) return null;

  const isMissingPhone = isAuthenticated && needsPhoneRegistration;

  const handleDirectGoogle = async () => {
    setGoogleError('');
    setGoogleBusy(true);
    const res = await directGoogleSignUp();
    if (!res.success && res.error) {
      setGoogleError(res.error);
    }
    setGoogleBusy(false);
  };

  return (
    <div className="p-8 sm:p-10 rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-200/80 shadow-lg shadow-sky-900/5 text-center max-w-3xl mx-auto space-y-5">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7]/15 to-[#2563EB]/15 border border-[#0284C7]/25 flex items-center justify-center text-[#0284C7] mx-auto">
        {isMissingPhone ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7] block">
          {isMissingPhone ? 'Mobile Verification Required' : 'Verified Client Access Mandatory'}
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
          {isMissingPhone ? 'Register Your Genuine Mobile Number to Continue' : title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {isMissingPhone
            ? 'Your email account is verified. Complete one-time mobile number registration to unlock all interactive forms and full platform facilities.'
            : description}
        </p>
      </div>

      {!isMissingPhone && highlights?.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs text-slate-700 pt-1">
          {highlights.map((item, idx) => (
            <li key={idx} className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 font-medium leading-snug">
              {item}
            </li>
          ))}
        </ul>
      )}

      {googleError && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{googleError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {isMissingPhone ? (
          <button
            type="button"
            onClick={() => openLoginBox('phone')}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Register Mobile Number Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => openLoginBox('login')}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openLoginBox('register')}
              className="px-6 py-3 rounded-xl text-xs font-bold text-[#0284C7] bg-sky-50 border border-sky-200 hover:bg-sky-100/80 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={handleDirectGoogle}
              disabled={googleBusy}
              className="px-6 py-3 rounded-xl text-xs font-bold text-[#0F172A] bg-white border border-slate-300 hover:border-[#0284C7] hover:text-[#0284C7] flex items-center gap-2 transition-all disabled:opacity-60"
            >
              <GoogleColorIcon />
              <span>{googleBusy ? 'Connecting Google...' : 'Sign Up with Google'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
