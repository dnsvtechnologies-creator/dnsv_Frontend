import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  SlidersHorizontal,
  Search,
  ExternalLink,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { INITIAL_CAREER_CONFIG } from '../../../constants/careerSeedData.js';

const createEmptyJobForm = () => ({
  title: '',
  slug: '',
  department: 'Engineering',
  employmentType: 'Full-Time',
  workMode: 'Hybrid / Remote (India)',
  location: 'India (Remote-Friendly)',
  experience: '',
  compensation: '',
  summary: '',
  description: '',
  responsibilitiesText: '',
  requirementsText: '',
  niceToHaveText: '',
  skillsText: '',
  status: 'open',
  isFeatured: false,
  order: ''
});

const APP_STATUS_CLASS = {
  new: 'text-[#0284C7] bg-sky-50 border-sky-200',
  shortlisted: 'text-[#2563EB] bg-blue-50 border-blue-200',
  interviewing: 'text-amber-700 bg-amber-50 border-amber-200',
  hired: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  rejected: 'text-red-700 bg-red-50 border-red-200'
};

const JOB_STATUS_CLASS = {
  open: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  paused: 'text-amber-700 bg-amber-50 border-amber-200',
  closed: 'text-slate-600 bg-slate-100 border-slate-200'
};

const formatDateShort = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function AdminCareersPanel({
  jobs = [],
  careerConfig,
  applications = [],
  onCreateJob,
  onUpdateJob,
  onDeleteJob,
  onSaveConfig,
  onUpdateApplication,
  onDeleteApplication
}) {
  const [subTab, setSubTab] = useState('jobs'); // 'jobs' | 'applications' | 'config'
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState(createEmptyJobForm);

  const [configForm, setConfigForm] = useState({ ...INITIAL_CAREER_CONFIG });
  const [saving, setSaving] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Candidate applications filter & inspector
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    if (careerConfig) {
      setConfigForm({
        heroBadge: careerConfig.heroBadge ?? INITIAL_CAREER_CONFIG.heroBadge,
        heroTitle: careerConfig.heroTitle ?? INITIAL_CAREER_CONFIG.heroTitle,
        heroSubtitle: careerConfig.heroSubtitle ?? INITIAL_CAREER_CONFIG.heroSubtitle,
        hiringBannerEnabled:
          careerConfig.hiringBannerEnabled !== undefined
            ? Boolean(careerConfig.hiringBannerEnabled)
            : INITIAL_CAREER_CONFIG.hiringBannerEnabled,
        hiringBannerText:
          careerConfig.hiringBannerText ?? INITIAL_CAREER_CONFIG.hiringBannerText,
        cultureTitle: careerConfig.cultureTitle ?? INITIAL_CAREER_CONFIG.cultureTitle,
        cultureSubtitle:
          careerConfig.cultureSubtitle ?? INITIAL_CAREER_CONFIG.cultureSubtitle,
        perks:
          Array.isArray(careerConfig.perks) && careerConfig.perks.length > 0
            ? careerConfig.perks.map((p) => ({ title: p.title || '', desc: p.desc || '' }))
            : INITIAL_CAREER_CONFIG.perks,
        allowSpontaneousApplications:
          careerConfig.allowSpontaneousApplications !== undefined
            ? Boolean(careerConfig.allowSpontaneousApplications)
            : INITIAL_CAREER_CONFIG.allowSpontaneousApplications,
        spontaneousTitle:
          careerConfig.spontaneousTitle ?? INITIAL_CAREER_CONFIG.spontaneousTitle,
        spontaneousDescription:
          careerConfig.spontaneousDescription ??
          INITIAL_CAREER_CONFIG.spontaneousDescription,
        hrEmail: careerConfig.hrEmail ?? INITIAL_CAREER_CONFIG.hrEmail,
        ctaTitle: careerConfig.ctaTitle ?? INITIAL_CAREER_CONFIG.ctaTitle,
        ctaDescription: careerConfig.ctaDescription ?? INITIAL_CAREER_CONFIG.ctaDescription,
        ctaButtonLabel: careerConfig.ctaButtonLabel ?? INITIAL_CAREER_CONFIG.ctaButtonLabel
      });
    }
  }, [careerConfig]);

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)),
    [jobs]
  );

  const filteredApplications = useMemo(() => {
    const q = appSearch.trim().toLowerCase();
    return applications.filter((app) => {
      if (appStatusFilter !== 'all' && app.status !== appStatusFilter) return false;
      if (q) {
        const hay = [
          app.fullName,
          app.email,
          app.phone,
          app.jobTitle,
          app.department,
          app.currentLocation
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [applications, appSearch, appStatusFilter]);

  const splitLines = (text) =>
    String(text || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  const openAddJob = () => {
    setEditingJobId(null);
    setJobForm(createEmptyJobForm());
    setShowJobForm(true);
    setSubTab('jobs');
    setFeedback({ type: '', message: '' });
  };

  const openEditJob = (job) => {
    setEditingJobId(job._id || job.id || job.slug);
    setJobForm({
      title: job.title || '',
      slug: job.slug || '',
      department: job.department || 'Engineering',
      employmentType: job.employmentType || 'Full-Time',
      workMode: job.workMode || 'Hybrid / Remote (India)',
      location: job.location || 'India',
      experience: job.experience || '',
      compensation: job.compensation || '',
      summary: job.summary || '',
      description: job.description || '',
      responsibilitiesText: Array.isArray(job.responsibilities)
        ? job.responsibilities.join('\n')
        : '',
      requirementsText: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      niceToHaveText: Array.isArray(job.niceToHave) ? job.niceToHave.join('\n') : '',
      skillsText: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      status: job.status || 'open',
      isFeatured: Boolean(job.isFeatured),
      order: job.order !== undefined && job.order !== null ? String(job.order) : ''
    });
    setShowJobForm(true);
    setSubTab('jobs');
    setFeedback({ type: '', message: '' });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    const payload = {
      title: jobForm.title.trim(),
      slug: jobForm.slug.trim(),
      department: jobForm.department.trim() || 'Engineering',
      employmentType: jobForm.employmentType.trim() || 'Full-Time',
      workMode: jobForm.workMode.trim() || 'Remote / Hybrid',
      location: jobForm.location.trim() || 'India',
      experience: jobForm.experience.trim(),
      compensation: jobForm.compensation.trim(),
      summary: jobForm.summary.trim(),
      description: jobForm.description.trim(),
      responsibilities: splitLines(jobForm.responsibilitiesText),
      requirements: splitLines(jobForm.requirementsText),
      niceToHave: splitLines(jobForm.niceToHaveText),
      skills: String(jobForm.skillsText || '')
        .split(/[\r\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      status: jobForm.status,
      isFeatured: Boolean(jobForm.isFeatured),
      order: jobForm.order === '' ? undefined : Number(jobForm.order)
    };

    try {
      if (editingJobId) {
        await onUpdateJob(editingJobId, payload);
        setFeedback({ type: 'success', message: `Job posting "${payload.title}" updated.` });
      } else {
        await onCreateJob(payload);
        setFeedback({ type: 'success', message: `Job posting "${payload.title}" published.` });
      }
      setShowJobForm(false);
      setEditingJobId(null);
      setJobForm(createEmptyJobForm());
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Unable to save job posting.' });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickJobStatus = async (job, nextStatus) => {
    setFeedback({ type: '', message: '' });
    try {
      await onUpdateJob(job._id || job.id || job.slug, { status: nextStatus });
      setFeedback({
        type: 'success',
        message: `"${job.title}" status updated to ${nextStatus}.`
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update job status.' });
    }
  };

  const handleDeleteJobClick = async (job) => {
    setFeedback({ type: '', message: '' });
    try {
      await onDeleteJob(job._id || job.id || job.slug);
      setFeedback({ type: 'success', message: `Removed job posting "${job.title}".` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete job posting.' });
    }
  };

  const handleSaveConfigSubmit = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    setFeedback({ type: '', message: '' });
    try {
      await onSaveConfig({
        ...configForm,
        perks: (configForm.perks || []).filter((p) => String(p.title || '').trim())
      });
      setFeedback({
        type: 'success',
        message: 'Public Careers page content & settings saved.'
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save Careers page configuration.'
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleApplicationStatusUpdate = async (appId, status, adminNote) => {
    setFeedback({ type: '', message: '' });
    try {
      const res = await onUpdateApplication(appId, { status, adminNote });
      if (selectedApplication && selectedApplication._id === appId) {
        setSelectedApplication(
          res?.data || { ...selectedApplication, status, adminNote }
        );
      }
      setFeedback({ type: 'success', message: `Candidate status set to ${status}.` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update candidate application.'
      });
    }
  };

  const handleDeleteApplicationClick = async (appId) => {
    setFeedback({ type: '', message: '' });
    try {
      await onDeleteApplication(appId);
      if (selectedApplication?._id === appId) setSelectedApplication(null);
      setFeedback({ type: 'success', message: 'Application deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to delete application.'
      });
    }
  };

  const openAppDetail = (app) => {
    setSelectedApplication(app);
    setNoteDraft(app.adminNote || '');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation & Primary Action Header */}
      <div className="bg-white/95 rounded-2xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={() => setSubTab('jobs')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'jobs'
                ? 'bg-white text-[#0284C7] shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Postings ({jobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('applications')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'applications'
                ? 'bg-white text-[#0284C7] shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Applications ({applications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('config')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'config'
                ? 'bg-white text-[#0284C7] shadow-sm'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Page Content &amp; Controls</span>
          </button>
        </div>

        <button
          type="button"
          onClick={openAddJob}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job Posting</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUB-TAB 1: JOB POSTINGS CRUD */}
      {subTab === 'jobs' && (
        <div className="space-y-6">
          {showJobForm && (
            <form
              onSubmit={handleJobSubmit}
              className="bg-white/95 rounded-2xl border border-[#0284C7]/35 p-6 space-y-5 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    {editingJobId ? 'Edit Job Posting' : 'Create New Job Posting'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Open jobs appear immediately on /careers for all public visitors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJobId(null);
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Close job form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Senior Backend Node.js Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={jobForm.slug}
                    onChange={(e) => setJobForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] font-mono focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={jobForm.department}
                    onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                    placeholder="Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={jobForm.employmentType}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, employmentType: e.target.value }))
                    }
                    placeholder="Full-Time / Contract"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Work Mode
                  </label>
                  <input
                    type="text"
                    value={jobForm.workMode}
                    onChange={(e) => setJobForm((p) => ({ ...p, workMode: e.target.value }))}
                    placeholder="Hybrid / Remote (India)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="India (Remote-Friendly)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Experience Required
                  </label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm((p) => ({ ...p, experience: e.target.value }))}
                    placeholder="e.g. 2–5 Years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Compensation Range
                  </label>
                  <input
                    type="text"
                    value={jobForm.compensation}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, compensation: e.target.value }))
                    }
                    placeholder="e.g. ₹8 LPA – ₹16 LPA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Listing Status
                  </label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] bg-white"
                  >
                    <option value="open">Open (Accepting Applications)</option>
                    <option value="paused">Paused (Visible, Applications Paused)</option>
                    <option value="closed">Closed (Hidden from Public Page)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={jobForm.order}
                    onChange={(e) => setJobForm((p) => ({ ...p, order: e.target.value }))}
                    placeholder="Auto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Short Public Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={jobForm.summary}
                  onChange={(e) => setJobForm((p) => ({ ...p, summary: e.target.value }))}
                  placeholder="1-2 sentence overview displayed directly on the job listing card..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Full Role Context / Description
                </label>
                <textarea
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed description visible when visitor expands Full Role Details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Responsibilities (1 per line)
                  </label>
                  <textarea
                    rows={5}
                    value={jobForm.responsibilitiesText}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, responsibilitiesText: e.target.value }))
                    }
                    placeholder="Ship full-stack React & Node features&#10;Collaborate on API architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Requirements (1 per line)
                  </label>
                  <textarea
                    rows={5}
                    value={jobForm.requirementsText}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, requirementsText: e.target.value }))
                    }
                    placeholder="2+ years production React & Node.js&#10;Strong MongoDB & REST API design"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Bonus / Nice-to-Have (1 per line)
                  </label>
                  <textarea
                    rows={5}
                    value={jobForm.niceToHaveText}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, niceToHaveText: e.target.value }))
                    }
                    placeholder="Experience with BullMQ / SMTP relays&#10;Linux server tuning"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Key Skills / Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={jobForm.skillsText}
                    onChange={(e) => setJobForm((p) => ({ ...p, skillsText: e.target.value }))}
                    placeholder="React, Node.js, MongoDB, Tailwind CSS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>

                <label className="flex items-center gap-2.5 pt-4 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobForm.isFeatured}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, isFeatured: e.target.checked }))
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#0284C7]"
                  />
                  <span className="text-xs font-semibold text-[#0F172A]">
                    Mark as Priority / Featured Role
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJobId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] text-white text-xs font-bold shadow-sm disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : editingJobId ? 'Save Role Changes' : 'Publish Role'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Jobs List Table */}
          {sortedJobs.length === 0 ? (
            <div className="bg-white/95 rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-[#0284C7] mx-auto" />
              <h3 className="text-sm font-bold text-[#0F172A]">No Job Postings Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click "Add Job Posting" above to publish your first open role on /careers.
              </p>
            </div>
          ) : (
            <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Order &amp; Role Title</th>
                      <th className="py-3.5 px-4">Team &amp; Mode</th>
                      <th className="py-3.5 px-4">Compensation</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {sortedJobs.map((job) => (
                      <tr key={job._id || job.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono tabular-nums text-[11px] text-slate-400">
                              #{job.order ?? '—'}
                            </span>
                            <span className="font-bold text-[#0F172A]">{job.title}</span>
                            {job.isFeatured && (
                              <Sparkles
                                className="w-3.5 h-3.5 text-[#2563EB] shrink-0"
                                title="Priority Role"
                              />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                            {job.summary}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-semibold text-[#0284C7]">{job.department}</div>
                          <div className="text-[11px]">
                            {job.employmentType} · {job.workMode}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div>{job.compensation || '—'}</div>
                          <div className="text-[11px] text-slate-500">
                            {job.experience || 'Any experience'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={job.status || 'open'}
                            onChange={(e) => handleQuickJobStatus(job, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold capitalize ${
                              JOB_STATUS_CLASS[job.status] || JOB_STATUS_CLASS.open
                            }`}
                          >
                            <option value="open">Open</option>
                            <option value="paused">Paused</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditJob(job)}
                              className="p-2 rounded-lg text-[#0284C7] hover:bg-sky-50 border border-slate-200"
                              title="Edit Job Posting"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteJobClick(job)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
                              title="Delete Job Posting"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CANDIDATE APPLICATIONS */}
      {subTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search candidates by name, email, role, or location..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100">
              {['all', 'new', 'shortlisted', 'interviewing', 'hired', 'rejected'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setAppStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                    appStatusFilter === st
                      ? 'bg-white text-[#0284C7] shadow-sm'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white/95 rounded-2xl border border-slate-200 p-10 text-center space-y-2">
              <Users className="w-7 h-7 text-[#0284C7] mx-auto" />
              <h3 className="text-sm font-bold text-[#0F172A]">
                {applications.length === 0
                  ? 'No Candidate Applications Yet'
                  : 'No Applications Match Current Filter'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Applications submitted on /careers (both role-specific and general applications) appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div
                className={`${
                  selectedApplication ? 'lg:col-span-7' : 'lg:col-span-12'
                } bg-white/95 rounded-2xl border border-slate-200 overflow-hidden`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Candidate</th>
                        <th className="py-3.5 px-4">Role Applied</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredApplications.map((app) => (
                        <tr
                          key={app._id}
                          onClick={() => openAppDetail(app)}
                          className={`cursor-pointer transition-colors ${
                            selectedApplication?._id === app._id
                              ? 'bg-sky-50/80'
                              : 'hover:bg-sky-50/40'
                          }`}
                        >
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-[#0F172A]">{app.fullName}</div>
                            <div className="text-[11px] text-[#0284C7]">{app.email}</div>
                            <div className="text-[11px] font-mono tabular-nums text-slate-500">
                              {app.phone}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#0F172A]">{app.jobTitle}</div>
                            <div className="text-[11px] text-slate-500">
                              {app.isSpontaneous ? 'General Application' : app.department}
                              {app.experienceYears ? ` · ${app.experienceYears}` : ''}
                            </div>
                          </td>
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={app.status || 'new'}
                              onChange={(e) =>
                                handleApplicationStatusUpdate(
                                  app._id,
                                  e.target.value,
                                  app.adminNote
                                )
                              }
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold capitalize ${
                                APP_STATUS_CLASS[app.status] || APP_STATUS_CLASS.new
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interviewing">Interviewing</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                            {formatDateShort(app.createdAt)}
                          </td>
                          <td
                            className="py-3.5 px-5 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleDeleteApplicationClick(app._id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedApplication && (
                <div className="lg:col-span-5 bg-white/95 rounded-2xl border border-slate-200 p-5 space-y-4 self-start sticky top-24">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0284C7]">
                        {selectedApplication.jobTitle}
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {selectedApplication.fullName}
                      </h3>
                      <div className="text-xs text-slate-500">
                        {selectedApplication.email} · {selectedApplication.phone}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedApplication(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Location</span>
                      <span className="font-semibold text-[#0F172A]">
                        {selectedApplication.currentLocation || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Experience</span>
                      <span className="font-semibold text-[#0F172A]">
                        {selectedApplication.experienceYears || '—'}
                      </span>
                    </div>
                  </div>

                  {(selectedApplication.resumeUrl ||
                    selectedApplication.portfolioUrl ||
                    selectedApplication.linkedinUrl) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedApplication.resumeUrl && (
                        <a
                          href={selectedApplication.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-[11px] font-semibold text-[#0284C7]"
                        >
                          <span>Resume / CV</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {selectedApplication.portfolioUrl && (
                        <a
                          href={selectedApplication.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-[#0F172A]"
                        >
                          <span>Portfolio / GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {selectedApplication.linkedinUrl && (
                        <a
                          href={selectedApplication.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-[#0F172A]"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Cover Letter / Relevant Work
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 rounded-xl p-3 border border-slate-100">
                      {selectedApplication.coverLetter || '—'}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Hiring Team Notes (Internal)
                    </label>
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Interview feedback, availability, screening score..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={selectedApplication.status || 'new'}
                        onChange={(e) =>
                          handleApplicationStatusUpdate(
                            selectedApplication._id,
                            e.target.value,
                            noteDraft
                          )
                        }
                        className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] bg-white"
                      >
                        <option value="new">New</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          handleApplicationStatusUpdate(
                            selectedApplication._id,
                            selectedApplication.status || 'new',
                            noteDraft
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PAGE CONTENT & CONTROLS */}
      {subTab === 'config' && (
        <form
          onSubmit={handleSaveConfigSubmit}
          className="bg-white/95 rounded-2xl border border-slate-200 p-6 space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-[#0F172A]">
              Careers Page Content, Banner &amp; Application Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize every section of the public /careers page including hero copy, hiring notices, benefits, and general applications.
            </p>
          </div>

          {/* Hero Section Controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
              Hero Section Copy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Hero Kicker Badge
                </label>
                <input
                  type="text"
                  value={configForm.heroBadge}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, heroBadge: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={configForm.heroTitle}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, heroTitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Hero Subtitle
              </label>
              <textarea
                rows={2}
                value={configForm.heroSubtitle}
                onChange={(e) =>
                  setConfigForm((p) => ({ ...p, heroSubtitle: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>
          </div>

          {/* Hiring Notice Banner */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                Hiring Notice Banner
              </h3>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={configForm.hiringBannerEnabled}
                  onChange={(e) =>
                    setConfigForm((p) => ({
                      ...p,
                      hiringBannerEnabled: e.target.checked
                    }))
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#0284C7]"
                />
                <span>Show Hiring Banner on /careers</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={configForm.hiringBannerText}
              onChange={(e) =>
                setConfigForm((p) => ({ ...p, hiringBannerText: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
            />
          </div>

          {/* Culture & Dynamic Perks Cards */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                Culture &amp; Team Perks Grid
              </h3>
              <button
                type="button"
                onClick={() =>
                  setConfigForm((p) => ({
                    ...p,
                    perks: [...(p.perks || []), { title: '', desc: '' }]
                  }))
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-[11px] font-semibold text-[#0284C7]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Perk Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Culture Section Title
                </label>
                <input
                  type="text"
                  value={configForm.cultureTitle}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, cultureTitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Culture Section Subtitle
                </label>
                <input
                  type="text"
                  value={configForm.cultureSubtitle}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, cultureSubtitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(configForm.perks || []).map((perk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#0284C7]">
                      Perk #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setConfigForm((p) => ({
                          ...p,
                          perks: p.perks.filter((_, i) => i !== idx)
                        }))
                      }
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={perk.title}
                    onChange={(e) =>
                      setConfigForm((p) => ({
                        ...p,
                        perks: p.perks.map((item, i) =>
                          i === idx ? { ...item, title: e.target.value } : item
                        )
                      }))
                    }
                    placeholder="Perk title"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0F172A]"
                  />
                  <textarea
                    rows={2}
                    value={perk.desc}
                    onChange={(e) =>
                      setConfigForm((p) => ({
                        ...p,
                        perks: p.perks.map((item, i) =>
                          i === idx ? { ...item, desc: e.target.value } : item
                        )
                      }))
                    }
                    placeholder="Short perk description"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-[#0F172A]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Spontaneous / General Application & Bottom CTA Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                General Applications, HR Contact &amp; Bottom CTA
              </h3>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={configForm.allowSpontaneousApplications}
                  onChange={(e) =>
                    setConfigForm((p) => ({
                      ...p,
                      allowSpontaneousApplications: e.target.checked
                    }))
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#0284C7]"
                />
                <span>Allow General / Spontaneous Applications</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  HR / Hiring Contact Email
                </label>
                <input
                  type="email"
                  value={configForm.hrEmail}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, hrEmail: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Spontaneous Box Title
                </label>
                <input
                  type="text"
                  value={configForm.spontaneousTitle}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, spontaneousTitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={configForm.ctaButtonLabel}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, ctaButtonLabel: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Spontaneous Box Description
                </label>
                <textarea
                  rows={2}
                  value={configForm.spontaneousDescription}
                  onChange={(e) =>
                    setConfigForm((p) => ({
                      ...p,
                      spontaneousDescription: e.target.value
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Fallback Bottom CTA Title (When General Applications Off)
                </label>
                <input
                  type="text"
                  value={configForm.ctaTitle}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, ctaTitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] mb-2"
                />
                <input
                  type="text"
                  value={configForm.ctaDescription}
                  onChange={(e) =>
                    setConfigForm((p) => ({ ...p, ctaDescription: e.target.value }))
                  }
                  placeholder="Fallback CTA description"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={savingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] text-white text-xs font-bold shadow-sm disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingConfig ? 'Saving...' : 'Save Careers Page Content'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
