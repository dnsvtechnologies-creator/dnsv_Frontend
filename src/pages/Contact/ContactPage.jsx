import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../../services/api.js';
import { BRAND } from '../../constants/brand.js';
import { PageWrapper, FadeIn } from '../../components/animations/MotionComponents.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function ContactPage() {
  const { isOffWhite } = useTheme();
  const { user, isAuthenticated, needsPhoneRegistration } = useUserAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get('draftId') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceRequired: searchParams.get('service') || 'Website Design & Development',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    isDraft: false,
    error: '',
    referenceId: '',
    message: ''
  });

  // Auto-bind verified Google email & genuine registered mobile number
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: user.email || '',
        phone: user.registeredPhone || '',
        companyName: prev.companyName || user.companyName || ''
      }));
    }
  }, [user]);

  // Load existing draft if ?draftId=... is passed from User Portal
  useEffect(() => {
    if (!draftId || !isAuthenticated) return;
    let active = true;
    (async () => {
      try {
        const res = await apiService.getUserPortal();
        const found = (res?.data?.submissions || []).find(
          (s) => s._id === draftId && s.kind === 'contact' && s.status === 'draft'
        );
        if (found && active) {
          setFormData((prev) => ({
            ...prev,
            fullName: found.record?.fullName || prev.fullName,
            companyName: found.record?.companyName || prev.companyName,
            serviceRequired: found.record?.serviceRequired || prev.serviceRequired,
            message: found.record?.message || ''
          }));
        }
      } catch {
        // Ignore if draft cannot be loaded
      }
    })();
    return () => {
      active = false;
    };
  }, [draftId, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'phone') return; // Strictly locked to verified values
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmission = async (targetStatus) => {
    setStatus({
      loading: true,
      success: false,
      isDraft: targetStatus === 'draft',
      error: '',
      referenceId: '',
      message: ''
    });

    try {
      const payload = {
        ...formData,
        email: user.email,
        phone: user.registeredPhone,
        status: targetStatus
      };

      const response = draftId
        ? await apiService.updateUserDraft('contact', draftId, payload)
        : await apiService.submitContact(payload);

      setStatus({
        loading: false,
        success: true,
        isDraft: targetStatus === 'draft',
        error: '',
        referenceId: response.referenceId || response.data?._id || '',
        message: response.message || 'Submitted successfully.'
      });

      if (targetStatus !== 'draft') {
        setFormData((prev) => ({
          ...prev,
          serviceRequired: 'Website Design & Development',
          message: ''
        }));
        if (draftId) {
          navigate('/contact', { replace: true });
        }
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        isDraft: false,
        error: err.message || 'Failed to submit contact message. Please try again.',
        referenceId: '',
        message: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmission('pending');
  };

  const inputClass = isOffWhite
    ? 'w-full bg-[#FFFFFF] border border-[#17213A]/20 text-xs text-[#111111] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#2563EB] placeholder:text-[#17213A]/40'
    : 'w-full bg-[#111111] border border-[#F7F7F2]/15 text-xs text-[#F7F7F2] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#2563EB] placeholder:text-[#F7F7F2]/40';

  const lockedInputClass =
    'w-full bg-slate-100 border border-slate-200 text-xs text-slate-700 px-3.5 py-2.5 rounded-lg cursor-not-allowed';

  const labelClass = 'block text-xs font-semibold mb-1.5 text-[#111111]';

  return (
    <PageWrapper className="pt-32 pb-24 space-y-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            Contact DNSV Technologies
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            Have an enquiry regarding website development, custom software, Mailcurve email marketing, or technical infrastructure? Sign in with Google to submit a tracked enquiry with your registered mobile number.
          </p>
        </FadeIn>
      </section>

      {/* Main Grid: Form & Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Contact Information */}
          <FadeIn direction="right" className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl border space-y-6 bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
              <h2 className="text-xl font-bold text-[#111111]">Communication Channels</h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs block text-[#17213A]/60">Business Inquiries:</span>
                  <a href={`mailto:${BRAND.contact.email}`} className="text-sm font-semibold text-[#2563EB] hover:underline">
                    {BRAND.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs block text-[#17213A]/60">Support Desk:</span>
                  <span className="text-sm font-medium text-[#111111]">{BRAND.contact.supportEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs block text-[#17213A]/60">Operating Hours:</span>
                  <span className="text-sm font-medium text-[#111111]">{BRAND.contact.businessHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs block text-[#17213A]/60">Service Reach:</span>
                  <span className="text-sm font-medium text-[#111111]">{BRAND.contact.location}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border text-xs space-y-2 bg-[#FFFFFF] border-[#2563EB]/30 text-[#17213A]/80 shadow-sm">
              <strong className="block font-semibold text-[#111111]">
                Need a Formal Statement of Work?
              </strong>
              <p>
                If you have an existing RFP or detailed project scope, use our structured quotation form to submit timeline and budget requirements.
              </p>
              <div className="pt-2">
                <Link to="/request-quote" className="text-[#2563EB] font-bold hover:underline">
                  Go to Request a Quote →
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* RIGHT: Auth Gate or Verified Contact Form */}
          <FadeIn direction="left" className="lg:col-span-7">
            {!isAuthenticated || needsPhoneRegistration ? (
              <LoginRequiredGate
                title="Sign In to Send a Contact Message"
                description="To prevent spam and fake submissions, Contact forms require a verified Google account and your registered genuine mobile number."
              />
            ) : (
              <div className="p-8 sm:p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                    {draftId ? 'Resume Draft Contact Message' : 'Send Us a Direct Message'}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified User Session
                  </span>
                </div>
                <p className="text-xs sm:text-sm mb-6 text-[#17213A]/70">
                  Submissions automatically bind to your Google-verified email and registered mobile number and can be tracked in your{' '}
                  <Link to="/portal" className="text-[#0284C7] font-semibold underline">
                    Client Portal
                  </Link>
                  .
                </p>

                {status.success && (
                  <div className="mb-6 p-4 rounded-xl border border-[#2563EB] bg-sky-50/70 text-[#111111] text-xs space-y-2">
                    <div className="flex items-center gap-2 text-[#2563EB] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{status.isDraft ? 'Saved as Draft' : 'Message Sent Successfully'}</span>
                    </div>
                    <p>{status.message}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {status.referenceId && (
                        <span className="text-[11px] font-mono text-slate-600">
                          Reference ID: {status.referenceId}
                        </span>
                      )}
                      <Link to="/portal" className="font-bold text-[#0284C7] underline">
                        View Status in Client Portal →
                      </Link>
                    </div>
                  </div>
                )}

                {status.error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{status.error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Full Name <span className="text-[#2563EB]">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Verified Google Email (Locked)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className={lockedInputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#111111]">
                          Registered Mobile (Locked)
                        </label>
                        <Link to="/portal" className="text-[11px] font-semibold text-[#0284C7] hover:underline">
                          Change in Portal
                        </Link>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        readOnly
                        className={lockedInputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Company / Venture Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Optional"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Service Required <span className="text-[#2563EB]">*</span>
                    </label>
                    <select
                      name="serviceRequired"
                      value={formData.serviceRequired}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Website Design & Development">Website Design & Development</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Email Marketing & Automation">Email Marketing & Automation (Mailcurve / Mautic)</option>
                      <option value="Email Validation Solutions">Email Validation Solutions</option>
                      <option value="API Development & Integration">API Development & Integration</option>
                      <option value="Technical Support & Maintenance">Technical Support & Maintenance</option>
                      <option value="Other Business Enquiry">Other Business Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Message Details <span className="text-[#2563EB]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Describe your requirements, goals, or existing infrastructure..."
                      className={inputClass}
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={status.loading}
                      className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {status.loading && !status.isDraft ? 'Sending Message...' : 'Submit Contact Message'}
                    </button>

                    <button
                      type="button"
                      disabled={status.loading}
                      onClick={() => handleSubmission('draft')}
                      className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] text-xs font-semibold rounded-lg transition-all disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-[#0284C7]" />
                      {status.loading && status.isDraft ? 'Saving Draft...' : 'Save as Draft'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
