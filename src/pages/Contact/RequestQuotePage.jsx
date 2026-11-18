import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, FileText, Save, ShieldCheck } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { PageWrapper, FadeIn } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function RequestQuotePage() {
  const { user, isAuthenticated, needsPhoneRegistration } = useUserAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefilledPlan = searchParams.get('plan') || '';
  const prefilledCategory = searchParams.get('category') || '';
  const draftId = searchParams.get('draftId') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: 'Website Development',
    selectedPricingPlan: prefilledPlan || 'Custom Consultation',
    pricingCategory: prefilledCategory || 'General Inquiry',
    budgetRange: '₹15,000 - ₹35,000',
    expectedTimeline: '1 Month',
    projectDescription: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    isDraft: false,
    error: '',
    referenceId: '',
    message: ''
  });

  useEffect(() => {
    if (prefilledPlan) {
      setFormData((prev) => ({
        ...prev,
        selectedPricingPlan: prefilledPlan,
        pricingCategory: prefilledCategory || prev.pricingCategory
      }));
    }
  }, [prefilledPlan, prefilledCategory]);

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

  // Load existing draft if ?draftId=...
  useEffect(() => {
    if (!draftId || !isAuthenticated) return;
    let active = true;
    (async () => {
      try {
        const res = await apiService.getUserPortal();
        const found = (res?.data?.submissions || []).find(
          (s) => s._id === draftId && s.kind === 'quote' && s.status === 'draft'
        );
        if (found && active && found.record) {
          setFormData((prev) => ({
            ...prev,
            fullName: found.record.fullName || prev.fullName,
            companyName: found.record.companyName || prev.companyName,
            projectType: found.record.projectType || prev.projectType,
            selectedPricingPlan: found.record.selectedPricingPlan || prev.selectedPricingPlan,
            pricingCategory: found.record.pricingCategory || prev.pricingCategory,
            budgetRange: found.record.budgetRange || prev.budgetRange,
            expectedTimeline: found.record.expectedTimeline || prev.expectedTimeline,
            projectDescription: found.record.projectDescription || ''
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
    if (name === 'email' || name === 'phone') return; // Locked to verified account email & registered mobile
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
        ? await apiService.updateUserDraft('quote', draftId, payload)
        : await apiService.submitQuote(payload);

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
          projectDescription: ''
        }));
        if (draftId) {
          navigate('/request-quote', { replace: true });
        }
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        isDraft: false,
        error: err.message || 'Submission failed. Please verify required fields.',
        referenceId: '',
        message: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmission('pending');
  };

  const inputClass =
    'w-full bg-[#FFFFFF] border border-[#17213A]/20 text-xs text-[#111111] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#2563EB] placeholder:text-[#17213A]/40';
  const lockedInputClass =
    'w-full bg-slate-100 border border-slate-200 text-xs text-slate-700 px-3.5 py-2.5 rounded-lg cursor-not-allowed';
  const labelClass = 'block text-xs font-semibold mb-1.5 text-[#111111]';
  const sectionDividerClass =
    'text-sm font-bold uppercase tracking-wider text-[#2563EB] border-b pb-2 border-[#17213A]/15';

  return (
    <PageWrapper className="pt-32 pb-24 space-y-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>Project Estimation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            Request a Project Quotation
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            Provide your project specifications, target timeline, and preferred plan. Signed-in clients can save drafts, submit requests using their registered mobile number, and track live status updates in the Client Portal.
          </p>
        </FadeIn>
      </section>

      {/* Main Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAuthenticated || needsPhoneRegistration ? (
          <LoginRequiredGate
            title="Login Required to Submit a Quote Request"
            description="Sign in with your Google-verified account and register a genuine mobile number to save quotation drafts or submit official project proposals."
          />
        ) : (
          <FadeIn className="p-8 sm:p-12 rounded-3xl border relative bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>{draftId ? 'Editing Saved Quote Draft' : 'Verified Client Quote Builder'}</span>
              </div>
              <Link to="/portal" className="text-xs font-semibold text-[#0284C7] hover:underline">
                View My Quotes & Drafts →
              </Link>
            </div>

            {prefilledPlan && (
              <div className="mb-8 p-4 rounded-xl border flex items-center justify-between text-xs bg-[#F7F7F2] border-[#2563EB]/40">
                <div className="flex items-center gap-2 text-[#111111]">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>
                    Selected Package: <strong className="text-[#2563EB]">{prefilledPlan}</strong> ({prefilledCategory})
                  </span>
                </div>
                <Link to="/pricing" className="text-[11px] underline text-[#17213A]/70 hover:text-[#111111]">
                  Change Plan
                </Link>
              </div>
            )}

            {status.success && (
              <div className="mb-8 p-6 rounded-2xl border-2 border-[#2563EB] text-xs space-y-2 bg-sky-50/70 text-[#111111]">
                <div className="flex items-center gap-2 text-[#2563EB] text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{status.isDraft ? 'Quotation Saved as Draft' : 'Quotation Request Received'}</span>
                </div>
                <p className="leading-relaxed text-[#17213A]/85">{status.message}</p>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  {status.referenceId && (
                    <span className="font-mono text-[11px] text-[#2563EB]">
                      Tracking Reference ID: {status.referenceId}
                    </span>
                  )}
                  <Link to="/portal" className="font-bold text-[#0284C7] underline">
                    Track Live Status in Portal →
                  </Link>
                </div>
              </div>
            )}

            {status.error && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Verified Contact Info */}
              <div className="space-y-4">
                <h3 className={sectionDividerClass}>1. Verified Contact & Organization Details</h3>

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
                    <label className={labelClass}>Verified Google Email (Locked)</label>
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
                        Registered Mobile Number (Locked) <span className="text-[#2563EB]">*</span>
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
                    <label className={labelClass}>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Nexus Innovations Pvt Ltd"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Project Specifications */}
              <div className="space-y-4 pt-4">
                <h3 className={sectionDividerClass}>2. Project Parameters & Budget</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Project Type <span className="text-[#2563EB]">*</span>
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Email Marketing (Mailcurve)">Email Marketing (Mailcurve SaaS)</option>
                      <option value="Email Validation Platform">Email Validation Platform</option>
                      <option value="API Development & Integration">API Development & Integration</option>
                      <option value="Combined Website + Email Package">Combined Website + Email Package</option>
                      <option value="Technical Support & Retainer">Technical Support & Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Selected Pricing Plan</label>
                    <input
                      type="text"
                      name="selectedPricingPlan"
                      value={formData.selectedPricingPlan}
                      onChange={handleChange}
                      placeholder="e.g. Business Website (₹19,999) or Custom"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Budget Range <span className="text-[#2563EB]">*</span>
                    </label>
                    <select
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Under ₹15,000">Under ₹15,000 (Starter Website or Email)</option>
                      <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000 (Business Website / Combo)</option>
                      <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000 (Professional Platform)</option>
                      <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000 (Custom Enterprise Software)</option>
                      <option value="Above ₹1,50,000">Above ₹1,50,000 (Large Scale Architecture)</option>
                      <option value="Monthly Subscription / SaaS">Monthly Subscription / SaaS</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Expected Timeline <span className="text-[#2563EB]">*</span>
                    </label>
                    <select
                      name="expectedTimeline"
                      value={formData.expectedTimeline}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Immediate (Within 1-2 weeks)">Immediate (Within 1-2 weeks)</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2-3 Months">2-3 Months</option>
                      <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Project Description & Requirements <span className="text-[#2563EB]">*</span>
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Outline your target features, user stories, current database or API integrations, and desired launch goals..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="px-7 py-3.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {status.loading && !status.isDraft ? 'Submitting Specification...' : 'Submit Quotation Request'}
                  </button>

                  <button
                    type="button"
                    disabled={status.loading}
                    onClick={() => handleSubmission('draft')}
                    className="px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] text-xs font-semibold rounded-lg transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#0284C7]" />
                    {status.loading && status.isDraft ? 'Saving Draft...' : 'Save as Draft'}
                  </button>
                </div>
                <div className="text-[11px] text-center sm:text-right text-[#17213A]/60">
                  All requests reviewed under confidential engineering NDA.
                </div>
              </div>
            </form>
          </FadeIn>
        )}
      </section>
    </PageWrapper>
  );
}
