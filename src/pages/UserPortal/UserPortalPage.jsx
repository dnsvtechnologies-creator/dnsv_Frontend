import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Bookmark,
  UserCheck,
  ShieldCheck,
  Phone,
  Building2,
  Trash2,
  Edit3,
  MessageSquare,
  Plus,
  LogOut,
  AlertCircle,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import { apiService } from '../../services/api.js';
import { validateStrictMobileNumber } from '../../utils/validation.js';
import { PageWrapper, FadeIn } from '../../components/animations/MotionComponents.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

const STATUS_META = {
  draft: {
    label: 'Draft',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    stepIndex: 0
  },
  pending: {
    label: 'Pending',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    stepIndex: 1
  },
  in_process: {
    label: 'In Process',
    badgeClass: 'bg-sky-50 text-[#0284C7] border-sky-200',
    stepIndex: 2
  },
  fulfilled: {
    label: 'Fulfilled',
    badgeClass: 'bg-indigo-50 text-[#2563EB] border-indigo-200',
    stepIndex: 3
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    stepIndex: 4
  },
  rejected: {
    label: 'Rejected',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    stepIndex: -1
  }
};

const PIPELINE_STEPS = ['Draft', 'Pending', 'In Process', 'Fulfilled', 'Completed'];

const formatDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

export default function UserPortalPage() {
  const {
    user,
    authLoading,
    isAuthenticated,
    needsPhoneRegistration,
    updateSessionUser,
    logoutUser
  } = useUserAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'saved' | 'profile'
  const [statusFilter, setStatusFilter] = useState('all');
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reply thread input per submission id
  const [replyDrafts, setReplyDrafts] = useState({});
  const [submittingReplyId, setSubmittingReplyId] = useState('');

  // Profile update form
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    registeredPhone: '',
    companyName: '',
    newPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const loadPortal = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiService.getUserPortal();
      setPortalData(res.data);
      if (res.data?.user) {
        updateSessionUser(res.data.user);
        setProfileForm({
          fullName: res.data.user.fullName || '',
          registeredPhone: res.data.user.registeredPhone || '',
          companyName: res.data.user.companyName || '',
          newPassword: ''
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to fetch your portal records.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateSessionUser]);

  useEffect(() => {
    document.title = 'Client Portal — DNSV Technologies';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortal();
    }
  }, [isAuthenticated, loadPortal]);

  useEffect(() => {
    if (needsPhoneRegistration) {
      setActiveTab('profile');
    }
  }, [needsPhoneRegistration]);

  const submissions = portalData?.submissions || [];
  const counts = portalData?.counts || {
    total: 0,
    draft: 0,
    pending: 0,
    in_process: 0,
    fulfilled: 0,
    completed: 0,
    rejected: 0
  };
  const savedItems = portalData?.savedItems || user?.savedItems || [];

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') return submissions;
    return submissions.filter((s) => s.status === statusFilter);
  }, [submissions, statusFilter]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const phoneCheck = validateStrictMobileNumber(profileForm.registeredPhone);
    if (!phoneCheck.isValid) {
      setErrorMsg(phoneCheck.error);
      return;
    }

    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      setErrorMsg('Optional password must be at least 6 characters.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await apiService.updateUserProfile({
        fullName: profileForm.fullName,
        registeredPhone: profileForm.registeredPhone,
        companyName: profileForm.companyName,
        newPassword: profileForm.newPassword || undefined
      });
      if (res?.data?.user) {
        updateSessionUser(res.data.user);
      }
      setProfileForm((prev) => ({ ...prev, newPassword: '' }));
      setSuccessMsg('Your verified profile and registered mobile number have been updated.');
      await loadPortal();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitDraftNow = async (sub) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await apiService.updateUserDraft(sub.kind, sub._id, {
        status: 'pending',
        phone: user.registeredPhone
      });
      setSuccessMsg(`"${sub.title}" has been submitted and is now Pending review.`);
      await loadPortal();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit draft.');
    }
  };

  const handleDeleteDraft = async (sub) => {
    setErrorMsg('');
    try {
      await apiService.deleteUserDraft(sub.kind, sub._id);
      setSuccessMsg('Draft deleted.');
      await loadPortal();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete draft.');
    }
  };

  const handleSendReply = async (sub) => {
    const msg = (replyDrafts[sub._id] || '').trim();
    if (!msg) return;
    setSubmittingReplyId(sub._id);
    setErrorMsg('');
    try {
      await apiService.replyToSubmission(sub.kind, sub._id, msg);
      setReplyDrafts((prev) => ({ ...prev, [sub._id]: '' }));
      setSuccessMsg('Follow-up message sent to DNSV Engineering.');
      await loadPortal();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reply.');
    } finally {
      setSubmittingReplyId('');
    }
  };

  const handleRemoveSaved = async (item) => {
    try {
      await apiService.toggleSavedItem({
        itemType: item.itemType,
        itemId: item.itemId,
        title: item.title
      });
      await loadPortal();
    } catch (err) {
      setErrorMsg(err.message || 'Could not update saved items.');
    }
  };

  const handleSubscribeNewsletter = async () => {
    if (!user?.email) return;
    try {
      const res = await apiService.subscribeNewsletter(user.email);
      setSuccessMsg(res.message || 'Subscribed to DNSV updates.');
      await loadPortal();
    } catch (err) {
      setErrorMsg(err.message || 'Newsletter subscription failed.');
    }
  };

  if (authLoading) {
    return (
      <PageWrapper className="pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-600">
          Loading your verified workspace...
        </div>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper className="pt-36 pb-24 px-4">
        <LoginRequiredGate
          title="Access Your DNSV Client Portal"
          description="Login or Register using a real verified email (Gmail, Yahoo, Outlook, or business domain) or Sign Up with Google to track Quote Requests, Contact Forms, Drafts, Fulfilled deliveries, and manage your registered mobile number."
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="pt-32 pb-24 space-y-10">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-14 h-14 rounded-2xl border border-sky-200 object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#2563EB] text-white font-extrabold text-xl flex items-center justify-center shrink-0">
                {(user.fullName || 'U')[0].toUpperCase()}
              </div>
            )}

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] truncate">
                  {user.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[11px] font-bold text-[#0284C7]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user.googleVerified && !user.hasPassword ? 'Google Account Verified' : 'Verified Email Account'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0284C7]" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                  {user.registeredPhone ? `Registered: ${user.registeredPhone}` : 'Mobile not registered yet'}
                </span>
                {user.companyName && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                    {user.companyName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/request-quote"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Quote Request
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-white border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] inline-flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              New Contact Form
            </Link>
            <button
              type="button"
              onClick={logoutUser}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </FadeIn>
      </section>

      {/* Alerts */}
      {(errorMsg || successMsg || needsPhoneRegistration) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {needsPhoneRegistration && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Action Required:</strong> Please register your genuine mobile number below before creating Quote Requests or Contact Forms.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="font-bold underline shrink-0"
              >
                Register Mobile
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-[#0284C7] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </section>
      )}

      {/* Status KPI Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { key: 'all', label: 'All Forms', val: counts.total },
            { key: 'draft', label: 'Draft', val: counts.draft },
            { key: 'pending', label: 'Pending', val: counts.pending },
            { key: 'in_process', label: 'In Process', val: counts.in_process },
            { key: 'fulfilled', label: 'Fulfilled', val: counts.fulfilled },
            { key: 'completed', label: 'Completed', val: counts.completed },
            { key: 'rejected', label: 'Rejected', val: counts.rejected }
          ].map((stat) => (
            <button
              key={stat.key}
              type="button"
              onClick={() => {
                setActiveTab('submissions');
                setStatusFilter(stat.key);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === 'submissions' && statusFilter === stat.key
                  ? 'bg-white border-[#0284C7] ring-2 ring-[#00D2FF]/25 shadow-sm'
                  : 'bg-white/90 border-slate-200 hover:border-[#0284C7]/40'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-500 block">{stat.label}</span>
              <span className="text-2xl font-extrabold text-[#0F172A] font-mono tabular-nums mt-1 block">
                {stat.val}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Workspace Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              activeTab === 'submissions'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-[#0284C7]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Forms & Live Status ({counts.total})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              activeTab === 'saved'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-[#0284C7]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Plans & Services ({savedItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-[#0284C7]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile & Registered Mobile</span>
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS & LIVE LIFECYCLE TRACKER */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white/95 border border-slate-200 text-center space-y-3">
                <Clock className="w-8 h-8 text-[#0284C7] mx-auto" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  {statusFilter === 'all'
                    ? 'No Forms Submitted Yet'
                    : `No ${STATUS_META[statusFilter]?.label || statusFilter} Forms`}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Start a Quote Request, Contact Message, or Plan Enquiry. You can save forms as drafts or submit them directly and track every stage here.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/request-quote"
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
                  >
                    Create Quote Request
                  </Link>
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] text-xs font-bold"
                  >
                    Send Contact Message
                  </Link>
                </div>
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const meta = STATUS_META[sub.status] || STATUS_META.pending;
                const isDraft = sub.status === 'draft';
                const isRejected = sub.status === 'rejected';

                return (
                  <div
                    key={`${sub.kind}-${sub._id}`}
                    className="p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm space-y-5"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-[#0284C7]">{sub.typeLabel}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-mono text-[11px] text-slate-500">ID: {sub._id}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mt-1">
                          {sub.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {formatDateTime(sub.updatedAt || sub.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Pipeline Stepper */}
                    {isRejected ? (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-semibold">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>This submission was marked as Rejected. Check Admin Notes or send a follow-up message below.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-2">
                        {PIPELINE_STEPS.map((stepLabel, idx) => {
                          const completed = idx <= meta.stepIndex;
                          return (
                            <div key={stepLabel} className="space-y-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-colors ${
                                  completed ? 'bg-gradient-to-r from-[#0284C7] to-[#2563EB]' : 'bg-slate-200'
                                }`}
                              />
                              <span
                                className={`block text-[11px] font-semibold text-center ${
                                  completed ? 'text-[#0284C7]' : 'text-slate-400'
                                }`}
                              >
                                {stepLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Submission Content & Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      <div className="md:col-span-8 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Submitted Details
                        </span>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {sub.description || 'No description provided yet (Saved as Draft).'}
                        </p>
                      </div>

                      <div className="md:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Verified Metadata
                        </span>
                        <div className="space-y-1 text-slate-700">
                          <div>
                            Mobile: <strong className="font-mono tabular-nums">{sub.phoneUsed}</strong>
                          </div>
                          {sub.budgetRange && (
                            <div>
                              Budget: <strong>{sub.budgetRange}</strong>
                            </div>
                          )}
                          {sub.expectedTimeline && (
                            <div>
                              Timeline: <strong>{sub.expectedTimeline}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Response Note */}
                    {sub.adminNote && (
                      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-1">
                        <span className="font-bold text-[#0284C7] block">
                          DNSV Engineering Update Note:
                        </span>
                        <p className="text-slate-800 leading-relaxed">{sub.adminNote}</p>
                      </div>
                    )}

                    {/* Draft Actions */}
                    {isDraft && (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {(sub.kind === 'quote' || sub.kind === 'contact') && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                sub.kind === 'quote'
                                  ? `/request-quote?draftId=${sub._id}`
                                  : `/contact?draftId=${sub._id}`
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#0284C7] text-xs font-bold text-[#0F172A] inline-flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#0284C7]" />
                            Resume & Edit Draft
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSubmitDraftNow(sub)}
                          className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Submit Draft Now
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDraft(sub)}
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Draft
                        </button>
                      </div>
                    )}

                    {/* Communication Thread */}
                    {!isDraft && (
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        {sub.replies && sub.replies.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                              Conversation History
                            </span>
                            {sub.replies.map((rep, rIdx) => (
                              <div
                                key={rIdx}
                                className={`p-3 rounded-xl text-xs border ${
                                  rep.sender === 'admin'
                                    ? 'bg-sky-50/70 border-sky-200 text-slate-800'
                                    : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[11px] mb-1">
                                  <strong className={rep.sender === 'admin' ? 'text-[#0284C7]' : 'text-[#0F172A]'}>
                                    {rep.sender === 'admin' ? `${rep.senderName || 'DNSV Admin'} (Team)` : `${rep.senderName || 'You'}`}
                                  </strong>
                                  <span className="text-slate-400 font-mono tabular-nums">
                                    {formatDateTime(rep.createdAt)}
                                  </span>
                                </div>
                                <p className="leading-relaxed">{rep.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={replyDrafts[sub._id] || ''}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({ ...prev, [sub._id]: e.target.value }))
                            }
                            placeholder="Write a follow-up question or requirement update for DNSV team..."
                            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                          />
                          <button
                            type="button"
                            disabled={submittingReplyId === sub._id || !(replyDrafts[sub._id] || '').trim()}
                            onClick={() => handleSendReply(sub)}
                            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {submittingReplyId === sub._id ? 'Sending...' : 'Send Follow-up'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: SAVED PLANS & SERVICES */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedItems.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white/95 border border-slate-200 text-center space-y-3">
                <Bookmark className="w-8 h-8 text-[#0284C7] mx-auto" />
                <h3 className="text-base font-bold text-[#0F172A]">No Bookmarked Plans or Services</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Bookmark plans from the Pricing or Services pages to compare them later or request an instant quotation.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
                >
                  Browse Pricing Plans <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedItems.map((item) => (
                  <div
                    key={`${item.itemType}-${item.itemId}`}
                    className="p-6 rounded-2xl bg-white/95 border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">
                        {item.category || item.itemType}
                      </span>
                      <h4 className="text-base font-extrabold text-[#0F172A] mt-1">{item.title}</h4>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Saved on {formatDateTime(item.savedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <Link
                        to={item.url || `/request-quote?plan=${encodeURIComponent(item.title)}`}
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
                      >
                        Request Quote
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveSaved(item)}
                        className="p-2 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & REGISTERED MOBILE */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white/95 border border-slate-200 shadow-sm space-y-5"
            >
              <div>
                <h2 className="text-lg font-extrabold text-[#0F172A]">
                  Verified Account & Registered Mobile Settings
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  All forms (Quote Request, Contact, Plan Enquiry) automatically lock to your verified account email and genuine registered mobile number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Verified Account Email (Locked)
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-[#0284C7]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registered Genuine Mobile Number <span className="text-[#0284C7]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileForm.registeredPhone}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, registeredPhone: e.target.value }))
                    }
                    placeholder="+91 98254 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Fake, dummy, or sequential numbers (e.g. 9999999999) are blocked.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company / Business Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, companyName: e.target.value }))}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {user.hasPassword
                    ? 'Update Account Password (Leave blank to keep existing)'
                    : 'Set Account Password (Allows direct email + password Login anytime)'}
                </label>
                <input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] text-white text-xs font-bold shadow-md disabled:opacity-60"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile & Registered Mobile'}
              </button>
            </form>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-white/95 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-[#0F172A]">Security & Form Rules</h3>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li>• Only your verified account email ({user.email}) is permitted on submissions.</li>
                  <li>• Every form submission is validated against your registered mobile number.</li>
                  <li>• Any status change made by the DNSV team updates your portal in real time.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/95 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-[#0F172A]">Engineering Newsletter</h3>
                {portalData?.newsletter?.subscribed ? (
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Subscribed with {user.email}
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">
                      Receive architecture advisories and Mailcurve release notes on your verified email.
                    </p>
                    <button
                      type="button"
                      onClick={handleSubscribeNewsletter}
                      className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0284C7] text-xs font-bold"
                    >
                      Subscribe {user.email}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
