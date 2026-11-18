import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Mail,
  Lock,
  Phone,
  Building2,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import {
  signInWithGooglePopup,
  registerFirebaseEmailAccount,
  checkAndCompleteFirebaseEmailVerification,
  resendFirebaseVerificationEmail,
  formatFirebaseAuthError
} from '../../services/firebaseAuth.js';
import { apiService } from '../../services/api.js';
import {
  validateAuthenticEmailFormat,
  validateStrictMobileNumber,
  getEmailPlatformLabel
} from '../../utils/validation.js';
import DNSVRoundedLogo from '../common/DNSVRoundedLogo.jsx';

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

export default function AuthModal() {
  const {
    user,
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    completeAuthSession,
    updateSessionUser
  } = useUserAuth();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register (Gmail / Yahoo / Outlook / Business MX + Inbox Link Verification) State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [pendingInboxEmail, setPendingInboxEmail] = useState('');

  // Post-Google Mobile Registration State (used only after connecting Google if mobile not set yet)
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCompany, setSignupCompany] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    setError('');
    setInfoMessage('');
  }, [authModalOpen, authModalTab]);

  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  const isPhoneStep = authModalTab === 'phone' || (user && !user.registeredPhone);

  const finalizeVerifiedRegistration = useCallback(
    async (firebaseIdToken, googleAccessToken = '') => {
      const res = await apiService.registerVerifiedUser({
        fullName: regFullName.trim(),
        email: (pendingInboxEmail || regEmail).trim().toLowerCase(),
        password: regPassword,
        registeredPhone: regPhone.trim(),
        companyName: regCompany.trim(),
        firebaseIdToken,
        googleAccessToken
      });
      setPendingInboxEmail('');
      completeAuthSession(res.data);
    },
    [regFullName, pendingInboxEmail, regEmail, regPassword, regPhone, regCompany, completeAuthSession]
  );

  // Poll silently while awaiting real email link click on user's device
  useEffect(() => {
    if (!authModalOpen || authModalTab !== 'register' || !pendingInboxEmail) return;
    const interval = setInterval(async () => {
      try {
        const status = await checkAndCompleteFirebaseEmailVerification();
        if (status.emailVerified && status.firebaseIdToken) {
          clearInterval(interval);
          setLoading(true);
          try {
            await finalizeVerifiedRegistration(status.firebaseIdToken);
          } catch (err) {
            setError(err.message || 'Could not finalize verified account.');
          } finally {
            setLoading(false);
          }
        }
      } catch {
        // Ignore transient poll errors
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [authModalOpen, authModalTab, pendingInboxEmail, finalizeVerifiedRegistration]);

  if (!authModalOpen) return null;

  // Option 1: Login (Email + Password)
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    const emailCheck = validateAuthenticEmailFormat(loginEmail);
    if (!emailCheck.isValid) {
      setError(emailCheck.error);
      return;
    }
    if (!loginPassword) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.userPasswordLogin({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword
      });
      completeAuthSession(res.data);
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  // Option 2: Register (Any Real Platform Inbox Verification)
  const handleStartRegister = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (regFullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailCheck = validateAuthenticEmailFormat(regEmail);
    if (!emailCheck.isValid) {
      setError(emailCheck.error);
      return;
    }

    const phoneCheck = validateStrictMobileNumber(regPhone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error);
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const preCheck = await apiService.checkRegistrationEmail(emailCheck.clean);
      if (preCheck?.data?.alreadyRegistered) {
        setError('An account with this verified email is already registered. Please use the Login tab with your password.');
        setLoading(false);
        return;
      }

      const fbResult = await registerFirebaseEmailAccount({
        email: emailCheck.clean,
        password: regPassword,
        displayName: regFullName.trim(),
        preferGoogleOwnership: Boolean(preCheck?.data?.isGoogleHosted)
      });

      if (fbResult.emailVerified && (fbResult.firebaseIdToken || fbResult.googleAccessToken)) {
        await finalizeVerifiedRegistration(fbResult.firebaseIdToken, fbResult.googleAccessToken || '');
      } else {
        setPendingInboxEmail(fbResult.email || emailCheck.clean);
        setInfoMessage(
          `Verification link sent to ${fbResult.email || emailCheck.clean} (${getEmailPlatformLabel(
            emailCheck.clean
          )}). Open it on your device to confirm this email exists.`
        );
      }
    } catch (err) {
      setError(formatFirebaseAuthError(err, emailCheck.clean));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerificationNow = async () => {
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      const status = await checkAndCompleteFirebaseEmailVerification();
      if (!status.emailVerified || !status.firebaseIdToken) {
        setError(
          `Verification link has not been clicked yet for ${pendingInboxEmail}. Check your ${getEmailPlatformLabel(
            pendingInboxEmail
          )} inbox (and Spam folder). Non-existent addresses like fake@gmail.com cannot verify.`
        );
        return;
      }
      await finalizeVerifiedRegistration(status.firebaseIdToken);
    } catch (err) {
      setError(err.message || 'Verification check failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setInfoMessage('');
    setResending(true);
    try {
      const res = await resendFirebaseVerificationEmail();
      if (res.emailVerified && res.firebaseIdToken) {
        await finalizeVerifiedRegistration(res.firebaseIdToken);
      } else {
        setInfoMessage(`A fresh verification link was sent to ${pendingInboxEmail}.`);
      }
    } catch (err) {
      setError(err.message || 'Please wait a minute before requesting another email.');
    } finally {
      setResending(false);
    }
  };

  // Instant Sign Up with Google (no pre-fill fields required; connects Google directly and starts next step if new)
  const handleGoogleSignUp = async () => {
    setError('');
    setInfoMessage('');

    setGoogleLoading(true);
    try {
      const googleProof = await signInWithGooglePopup();
      const emailCheck = validateAuthenticEmailFormat(googleProof.profile.email);
      if (!emailCheck.isValid) {
        setError(emailCheck.error);
        setGoogleLoading(false);
        return;
      }

      const res = await apiService.googleAuthLogin({
        googleAccessToken: googleProof.googleAccessToken,
        firebaseIdToken: googleProof.firebaseIdToken
      });

      completeAuthSession(res.data);
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCompletePhoneRegistration = async (e) => {
    e.preventDefault();
    setError('');
    const phoneCheck = validateStrictMobileNumber(signupPhone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error);
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.updateUserProfile({
        registeredPhone: signupPhone.trim(),
        companyName: signupCompany.trim() || undefined
      });
      if (res?.data?.user) {
        updateSessionUser(res.data.user);
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Could not save mobile number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-heading"
        className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl shadow-sky-900/15 text-[#0F172A]"
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <DNSVRoundedLogo className="w-11 h-11 shrink-0 drop-shadow-[0_2px_10px_rgba(0,210,255,0.3)]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7] block">
                DNSV Verified Client Access
              </span>
              <h2 id="auth-modal-heading" className="text-lg font-extrabold tracking-tight text-[#0F172A]">
                {isPhoneStep
                  ? 'Register Mobile Number'
                  : authModalTab === 'register'
                  ? 'Register Verified Account'
                  : 'Login to DNSV Portal'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            aria-label="Close authentication box"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher: Login | Register (both include direct Sign Up with Google) */}
        {!isPhoneStep && (
          <div className="px-6 pt-4">
            <div
              role="tablist"
              aria-label="Client access mode"
              className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80"
            >
              <button
                type="button"
                role="tab"
                aria-selected={authModalTab === 'login'}
                onClick={() => {
                  setPendingInboxEmail('');
                  setAuthModalTab('login');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  authModalTab === 'login'
                    ? 'bg-white text-[#0284C7] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authModalTab === 'register'}
                onClick={() => setAuthModalTab('register')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  authModalTab === 'register'
                    ? 'bg-white text-[#0284C7] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div role="status" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-[#0284C7]">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {isPhoneStep ? (
            <form onSubmit={handleCompletePhoneRegistration} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0284C7]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Email: {user?.email}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Register your genuine mobile number once to unlock Quote Requests, Contact Forms, and live Portal tracking. Fake or repetitive numbers are automatically blocked.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Genuine Mobile Number <span className="text-[#0284C7]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98254 12345"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company / Business Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                    placeholder="e.g. Nexus Digital Pvt Ltd"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
              >
                <span>{loading ? 'Verifying & Saving...' : 'Save Mobile & Unlock Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : authModalTab === 'register' ? (
            pendingInboxEmail ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50/90 border border-sky-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#0284C7]">
                    <Inbox className="w-4 h-4 shrink-0" />
                    <span>Real Inbox Verification Required ({getEmailPlatformLabel(pendingInboxEmail)})</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    We sent a verification link to <strong className="text-[#0F172A]">{pendingInboxEmail}</strong>. Open that email on your phone or computer and click the confirmation link.
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Fake or non-existent addresses (like <code>datdsa@gmail.com</code>) cannot receive this link and cannot create an active account.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckVerificationNow}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Checking Verification Status...' : 'I Verified My Inbox — Complete Registration'}</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="text-xs font-semibold text-[#0284C7] hover:underline inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    <span>{resending ? 'Sending...' : 'Resend Verification Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingInboxEmail('')}
                    className="text-xs font-semibold text-slate-500 hover:text-[#0F172A]"
                  >
                    Use Different Email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStartRegister} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>
                    Verifies real email accounts present on your device: <strong>Gmail &amp; Google Workspace</strong> confirm ownership directly, and other platforms verify via inbox link. Fake addresses are blocked.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-[#0284C7]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Aarav Patel"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Genuine Mobile Number <span className="text-[#0284C7]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98254 12345"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Active Email Address (Gmail / Yahoo / Outlook / Business) <span className="text-[#0284C7]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@gmail.com or name@yahoo.com or name@outlook.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Create Password <span className="text-[#0284C7]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      placeholder="Venture / Org Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                >
                  <span>{loading ? 'Verifying Real Account...' : 'Verify Real Email & Register'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    OR
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={googleLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 shadow-sm text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-60"
                >
                  <GoogleColorIcon />
                  <span>{googleLoading ? 'Connecting Google Account...' : 'Sign Up with Google'}</span>
                </button>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span>
                  Sign in with your verified <strong>Gmail, Yahoo, Outlook, iCloud, or business email</strong> and password.
                </span>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@gmail.com / you@yahoo.com / you@outlook.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                >
                  <span>{loading ? 'Logging In...' : 'Login to My Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative flex items-center py-0.5">
                <div className="flex-grow border-t border-slate-200" />
                <span className="shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  OR
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 shadow-sm text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-60"
              >
                <GoogleColorIcon />
                <span>{googleLoading ? 'Connecting Google Account...' : 'Sign Up with Google'}</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>New to DNSV Technologies?</span>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('register')}
                  className="font-bold text-[#0284C7] hover:underline"
                >
                  Register Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
