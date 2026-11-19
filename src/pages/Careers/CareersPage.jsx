import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  Users,
  ShieldCheck,
  Mail,
  Sparkles
} from 'lucide-react';
import {
  PageWrapper,
  FadeIn,
  StaggerContainer,
  StaggerItem
} from '../../components/animations/MotionComponents.jsx';
import { apiService } from '../../services/api.js';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import {
  INITIAL_CAREER_JOBS,
  INITIAL_CAREER_CONFIG
} from '../../constants/careerSeedData.js';

const createEmptyApplicationForm = (user = null) => ({
  fullName: user?.fullName || '',
  email: user?.email || '',
  phone: user?.registeredPhone || user?.phone || '',
  currentLocation: '',
  experienceYears: '',
  portfolioUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
  coverLetter: ''
});

export default function CareersPage() {
  const { user, isAuthenticated } = useUserAuth();
  const [jobs, setJobs] = useState(INITIAL_CAREER_JOBS);
  const [pageConfig, setPageConfig] = useState(INITIAL_CAREER_CONFIG);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [workModeFilter, setWorkModeFilter] = useState('all');
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Application Modal State
  const [applyingTarget, setApplyingTarget] = useState(null); // null | { isSpontaneous: boolean, job?: object }
  const [appForm, setAppForm] = useState(() => createEmptyApplicationForm(null));
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({ type: '', message: '' });

  useEffect(() => {
    let active = true;
    const syncCareers = async () => {
      try {
        const res = await apiService.getCareers();
        if (active && res?.data) {
          if (Array.isArray(res.data.jobs)) {
            setJobs(res.data.jobs);
          }
          if (res.data.pageConfig) {
            setPageConfig(res.data.pageConfig);
          }
        }
      } catch {
        // Seed fallback already in initial state
      } finally {
        if (active) setLoading(false);
      }
    };

    syncCareers();
    window.addEventListener('dnsv:catalog-updated', syncCareers);
    return () => {
      active = false;
      window.removeEventListener('dnsv:catalog-updated', syncCareers);
    };
  }, []);

  const departments = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return ['all', ...Array.from(set)];
  }, [jobs]);

  const workModes = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.workMode) set.add(j.workMode);
    });
    return ['all', ...Array.from(set)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      if (departmentFilter !== 'all' && job.department !== departmentFilter) return false;
      if (workModeFilter !== 'all' && job.workMode !== workModeFilter) return false;
      if (q) {
        const haystack = [
          job.title,
          job.department,
          job.workMode,
          job.location,
          job.summary,
          job.description,
          ...(Array.isArray(job.skills) ? job.skills : [])
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [jobs, searchQuery, departmentFilter, workModeFilter]);

  const openRoleCount = useMemo(
    () => jobs.filter((j) => j.status === 'open').length,
    [jobs]
  );

  const openApplyModal = (job = null) => {
    setSubmitResult({ type: '', message: '' });
    setAppForm(createEmptyApplicationForm(isAuthenticated ? user : null));
    if (job) {
      setApplyingTarget({ isSpontaneous: false, job });
    } else {
      setApplyingTarget({ isSpontaneous: true, job: null });
    }
  };

  const closeApplyModal = () => {
    setApplyingTarget(null);
    setSubmitResult({ type: '', message: '' });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult({ type: '', message: '' });

    try {
      const payload = {
        ...appForm,
        isSpontaneous: Boolean(applyingTarget?.isSpontaneous),
        jobId: applyingTarget?.job ? applyingTarget.job.id || applyingTarget.job._id : 'spontaneous',
        jobSlug: applyingTarget?.job ? applyingTarget.job.slug : 'general-application',
        jobTitle: applyingTarget?.job
          ? applyingTarget.job.title
          : 'General / Spontaneous Application',
        department: applyingTarget?.job ? applyingTarget.job.department : 'General Talent'
      };
      const res = await apiService.submitCareerApplication(payload);
      setSubmitResult({
        type: 'success',
        message:
          res.message ||
          'Application received. Our hiring team will review your profile shortly.'
      });
      setAppForm(createEmptyApplicationForm(isAuthenticated ? user : null));
    } catch (err) {
      setSubmitResult({
        type: 'error',
        message: err.message || 'Unable to submit application. Please check your details.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const perksList = Array.isArray(pageConfig?.perks) ? pageConfig.perks : [];

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{pageConfig.heroBadge || 'Careers at DNSV Technologies'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {openRoleCount} Open {openRoleCount === 1 ? 'Role' : 'Roles'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            {pageConfig.heroTitle ||
              'Build High-Reliability Software, SaaS & Email Systems With Us'}
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            {pageConfig.heroSubtitle || INITIAL_CAREER_CONFIG.heroSubtitle}
          </p>
          <div className="pt-5 flex flex-wrap items-center gap-3">
            <a
              href="#open-positions"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg transition-all shadow-md active:scale-95"
            >
              <span>Browse Open Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            {pageConfig.allowSpontaneousApplications !== false && (
              <button
                type="button"
                onClick={() => openApplyModal(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-sky-50 text-[#111111] border border-[#17213A]/20 text-xs font-semibold rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{pageConfig.ctaButtonLabel || 'Send General Application'}</span>
              </button>
            )}
          </div>
        </FadeIn>

        {/* Admin-Controlled Hiring Notice Banner */}
        {pageConfig.hiringBannerEnabled && pageConfig.hiringBannerText && (
          <FadeIn delay={0.05}>
            <div className="p-4 sm:p-5 rounded-2xl border border-sky-200 bg-sky-50/75 text-xs sm:text-sm text-[#0F172A] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[#17213A]/85">{pageConfig.hiringBannerText}</p>
            </div>
          </FadeIn>
        )}
      </section>

      {/* Team Culture & Engineering Perks */}
      {perksList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <FadeIn className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
              {pageConfig.cultureTitle || INITIAL_CAREER_CONFIG.cultureTitle}
            </h2>
            {pageConfig.cultureSubtitle && (
              <p className="text-sm text-[#17213A]/75 leading-relaxed">
                {pageConfig.cultureSubtitle}
              </p>
            )}
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {perksList.map((perk, idx) => (
              <StaggerItem key={`${perk.title}-${idx}`}>
                <div className="h-full p-6 rounded-2xl border border-[#17213A]/15 bg-white space-y-2 hover:border-[#2563EB]/45 transition-colors">
                  <div className="text-xs font-mono font-bold text-[#0284C7]">
                    0{idx + 1}.
                  </div>
                  <h3 className="text-sm font-bold text-[#111111]">{perk.title}</h3>
                  <p className="text-xs leading-relaxed text-[#17213A]/75">{perk.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Open Positions Catalog (Public Access — With or Without Login) */}
      <section
        id="open-positions"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-28"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#17213A]/15 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
              Open Positions
            </h2>
            <p className="text-xs sm:text-sm text-[#17213A]/75 mt-1">
              Inspect complete role scopes, requirements, and apply directly — accessible to all visitors without signing in.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-[#0284C7] font-semibold">
            Showing {filteredJobs.length} of {jobs.length} listed {jobs.length === 1 ? 'role' : 'roles'}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-[#17213A]/15 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, skill, or location..."
              aria-label="Search open career roles"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#111111] placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    departmentFilter === dept
                      ? 'bg-white text-[#0284C7] font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-[#111111]'
                  }`}
                >
                  {dept === 'all' ? 'All Teams' : dept}
                </button>
              ))}
            </div>

            {workModes.length > 2 && (
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
                aria-label="Filter by work mode"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#2563EB]"
              >
                {workModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === 'all' ? 'All Work Modes' : mode}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Job Cards */}
        {loading && jobs.length === 0 ? (
          <div className="p-10 rounded-2xl border border-[#17213A]/15 bg-white text-xs text-[#17213A]/60">
            Loading open positions...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-10 rounded-2xl border border-[#17213A]/15 bg-white text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0284C7]">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">
              {jobs.length === 0
                ? 'No Active Job Openings Listed Right Now'
                : 'No Roles Match Your Current Filter'}
            </h3>
            <p className="text-xs text-[#17213A]/70 max-w-md mx-auto leading-relaxed">
              {jobs.length === 0
                ? 'Our team updates open engineering and growth positions regularly from the admin console. You can still send us a general application below.'
                : 'Try clearing your search keyword or switching team filters.'}
            </p>
            {jobs.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDepartmentFilter('all');
                  setWorkModeFilter('all');
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-[#0284C7] hover:bg-sky-50"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const jobKey = job.id || job._id || job.slug;
              const isExpanded = expandedJobId === jobKey;
              const isPaused = job.status === 'paused';

              return (
                <article
                  key={jobKey}
                  className="rounded-2xl border border-[#17213A]/15 bg-white hover:border-[#2563EB]/45 transition-all shadow-sm overflow-hidden"
                >
                  <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 flex-1 min-w-0">
                      {/* Clean unboxed typographic metadata (Zero-pill discipline) */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#17213A]/70">
                        <span className="text-[#0284C7] font-semibold">
                          {job.department}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{job.employmentType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.workMode}
                        </span>
                        {job.experience && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {job.experience}
                            </span>
                          </>
                        )}
                        {job.isFeatured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#2563EB] font-semibold">
                              <Sparkles className="w-3 h-3" />
                              Priority Role
                            </span>
                          </>
                        )}
                        {isPaused && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-semibold">
                              Applications Temporarily Paused
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] tracking-tight">
                        {job.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#17213A]/75 leading-relaxed max-w-3xl">
                        {job.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#17213A]/65">
                        {job.location && <span>Location: {job.location}</span>}
                        {job.compensation && (
                          <span>
                            Compensation:{' '}
                            <strong className="text-[#111111] font-semibold">
                              {job.compensation}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpandedJobId(isExpanded ? null : jobKey)}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#17213A]/20 text-xs font-semibold text-[#111111] hover:bg-slate-50 transition-colors whitespace-nowrap"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Full Role Details'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isPaused}
                        onClick={() => openApplyModal(job)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          isPaused
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] shadow-md active:scale-95'
                        }`}
                      >
                        <span>{isPaused ? 'Hiring Paused' : 'Apply Now'}</span>
                        {!isPaused && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Full Specification */}
                  {isExpanded && (
                    <div className="px-6 sm:px-8 pb-8 pt-6 border-t border-slate-100 bg-[#F8FAFD] space-y-6">
                      {job.description && (
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                            Role Context &amp; Mission
                          </h4>
                          <p className="text-xs sm:text-sm text-[#17213A]/85 leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                              Key Responsibilities
                            </h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-[#17213A]/80 leading-relaxed"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                              Core Requirements
                            </h4>
                            <ul className="space-y-2">
                              {job.requirements.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-[#17213A]/80 leading-relaxed"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {Array.isArray(job.niceToHave) && job.niceToHave.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                            Bonus / Preferred Experience
                          </h4>
                          <ul className="space-y-1.5">
                            {job.niceToHave.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-[#17213A]/75 leading-relaxed"
                              >
                                <span className="text-[#0284C7] font-bold">·</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(job.skills) && job.skills.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                          <div className="text-xs text-[#17213A]/75">
                            <span className="font-semibold text-[#111111]">Core Stack: </span>
                            <span>{job.skills.join(' · ')}</span>
                          </div>
                          {!isPaused && (
                            <button
                              type="button"
                              onClick={() => openApplyModal(job)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-semibold transition-all"
                            >
                              <span>Apply for {job.title}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Spontaneous / General Application Banner & Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="p-8 sm:p-10 rounded-2xl border border-[#17213A]/15 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
              <Users className="w-4 h-4" />
              <span>Talent &amp; Hiring Desk</span>
              {pageConfig.hrEmail && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {pageConfig.hrEmail}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
              {pageConfig.allowSpontaneousApplications !== false
                ? pageConfig.spontaneousTitle || INITIAL_CAREER_CONFIG.spontaneousTitle
                : pageConfig.ctaTitle || INITIAL_CAREER_CONFIG.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#17213A]/75 leading-relaxed">
              {pageConfig.allowSpontaneousApplications !== false
                ? pageConfig.spontaneousDescription ||
                  INITIAL_CAREER_CONFIG.spontaneousDescription
                : pageConfig.ctaDescription || INITIAL_CAREER_CONFIG.ctaDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {pageConfig.allowSpontaneousApplications !== false ? (
              <button
                type="button"
                onClick={() => openApplyModal(null)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{pageConfig.ctaButtonLabel || 'Send General Application'}</span>
              </button>
            ) : pageConfig.hrEmail ? (
              <a
                href={`mailto:${pageConfig.hrEmail}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-md whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email {pageConfig.hrEmail}</span>
              </a>
            ) : null}
          </div>
        </FadeIn>
      </section>

      {/* Candidate Application Modal (Works With or Without Login) */}
      {applyingTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="career-apply-modal-title"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl my-8 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-[#F8FAFD]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0284C7]">
                  {applyingTarget.isSpontaneous
                    ? 'General Talent Application'
                    : `${applyingTarget.job?.department || 'Engineering'} · ${
                        applyingTarget.job?.workMode || ''
                      }`}
                </div>
                <h2
                  id="career-apply-modal-title"
                  className="text-lg font-extrabold text-[#0F172A] mt-0.5"
                >
                  {applyingTarget.isSpontaneous
                    ? 'Submit General Application'
                    : `Apply: ${applyingTarget.job?.title}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeApplyModal}
                aria-label="Close application modal"
                className="p-2 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {submitResult.message && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    submitResult.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {submitResult.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{submitResult.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.fullName}
                    onChange={(e) => setAppForm((p) => ({ ...p, fullName: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={appForm.email}
                    onChange={(e) => setAppForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={appForm.phone}
                    onChange={(e) => setAppForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Current City / Country
                  </label>
                  <input
                    type="text"
                    value={appForm.currentLocation}
                    onChange={(e) =>
                      setAppForm((p) => ({ ...p, currentLocation: e.target.value }))
                    }
                    placeholder="e.g. Ahmedabad, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={appForm.experienceYears}
                    onChange={(e) =>
                      setAppForm((p) => ({ ...p, experienceYears: e.target.value }))
                    }
                    placeholder="e.g. 3 Years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Resume / CV Link
                  </label>
                  <input
                    type="url"
                    value={appForm.resumeUrl}
                    onChange={(e) => setAppForm((p) => ({ ...p, resumeUrl: e.target.value }))}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Portfolio / GitHub URL
                  </label>
                  <input
                    type="url"
                    value={appForm.portfolioUrl}
                    onChange={(e) =>
                      setAppForm((p) => ({ ...p, portfolioUrl: e.target.value }))
                    }
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={appForm.linkedinUrl}
                    onChange={(e) =>
                      setAppForm((p) => ({ ...p, linkedinUrl: e.target.value }))
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Why You Fit &amp; Relevant Work Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={appForm.coverLetter}
                  onChange={(e) => setAppForm((p) => ({ ...p, coverLetter: e.target.value }))}
                  placeholder="Briefly share projects you have shipped, key technical strengths, and notice period / availability..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeApplyModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] text-white text-xs font-bold shadow-md disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
