import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  ShieldCheck,
  PlusCircle,
  SlidersHorizontal
} from 'lucide-react';
import { INITIAL_SERVICES_PAGE_CONFIG } from '../../../constants/serviceSeedData.js';

const SERVICE_ICON_OPTIONS = [
  { value: 'code2', label: 'Code / Web Design & Development' },
  { value: 'cpu', label: 'CPU / Custom Software & SaaS' },
  { value: 'mail', label: 'Mail / Email Marketing & Automation' },
  { value: 'layers', label: 'Layers / API & Integrations' },
  { value: 'wrench', label: 'Wrench / Support & DevOps Maintenance' },
  { value: 'globe', label: 'Globe / Cloud & Global Web' },
  { value: 'shieldCheck', label: 'Shield / Security & Compliance' },
  { value: 'database', label: 'Database / Data & Storage' },
  { value: 'terminal', label: 'Terminal / CLI & Developer Tools' },
  { value: 'barChart', label: 'BarChart / Analytics & Growth' },
  { value: 'zap', label: 'Zap / Performance & Speed' },
  { value: 'settings', label: 'Settings / Systems & Config' }
];

const createEmptyServiceForm = () => ({
  title: '',
  slug: '',
  shortLabel: '',
  dropdownDesc: '',
  iconKey: 'code2',
  category: 'Engineering Service',
  headline: '',
  summary: '',
  overview: '',
  order: '',
  offeringsText: '',
  technologiesText: '',
  benefitsText: '',
  processText: '',
  features: [
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ],
  faqs: [{ q: '', a: '' }],
  related: [{ title: '', slug: '/services/' }]
});

export default function AdminServicesPanel({
  services = [],
  servicePageConfig,
  onCreateService,
  onUpdateService,
  onDeleteService,
  onSavePageConfig
}) {
  const [showForm, setShowForm] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyServiceForm);
  const [configForm, setConfigForm] = useState({ ...INITIAL_SERVICES_PAGE_CONFIG });
  const [saving, setSaving] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (servicePageConfig) {
      setConfigForm({
        heroBadge: servicePageConfig.heroBadge || INITIAL_SERVICES_PAGE_CONFIG.heroBadge,
        heroTitle: servicePageConfig.heroTitle || INITIAL_SERVICES_PAGE_CONFIG.heroTitle,
        heroSubtitle: servicePageConfig.heroSubtitle || INITIAL_SERVICES_PAGE_CONFIG.heroSubtitle,
        ctaTitle: servicePageConfig.ctaTitle || INITIAL_SERVICES_PAGE_CONFIG.ctaTitle,
        ctaDescription:
          servicePageConfig.ctaDescription || INITIAL_SERVICES_PAGE_CONFIG.ctaDescription,
        ctaPrimaryLabel:
          servicePageConfig.ctaPrimaryLabel || INITIAL_SERVICES_PAGE_CONFIG.ctaPrimaryLabel,
        ctaPrimaryLink:
          servicePageConfig.ctaPrimaryLink || INITIAL_SERVICES_PAGE_CONFIG.ctaPrimaryLink,
        ctaSecondaryLabel:
          servicePageConfig.ctaSecondaryLabel || INITIAL_SERVICES_PAGE_CONFIG.ctaSecondaryLabel,
        ctaSecondaryLink:
          servicePageConfig.ctaSecondaryLink || INITIAL_SERVICES_PAGE_CONFIG.ctaSecondaryLink
      });
    }
  }, [servicePageConfig]);

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)),
    [services]
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(createEmptyServiceForm());
    setShowForm(true);
    setFeedback({ type: '', message: '' });
  };

  const openEditForm = (svc) => {
    setEditingId(svc._id || svc.id || svc.slug);
    setForm({
      title: svc.title || '',
      slug: svc.slug || '',
      shortLabel: svc.shortLabel || svc.title || '',
      dropdownDesc: svc.dropdownDesc || '',
      iconKey: svc.iconKey || 'code2',
      category: svc.category || 'Engineering Service',
      headline: svc.headline || '',
      summary: svc.summary || '',
      overview: svc.overview || '',
      order: svc.order !== undefined && svc.order !== null ? String(svc.order) : '',
      offeringsText: Array.isArray(svc.offerings) ? svc.offerings.join('\n') : '',
      technologiesText: Array.isArray(svc.technologies) ? svc.technologies.join('\n') : '',
      benefitsText: Array.isArray(svc.benefits) ? svc.benefits.join('\n') : '',
      processText: Array.isArray(svc.process) ? svc.process.join('\n') : '',
      features:
        Array.isArray(svc.features) && svc.features.length > 0
          ? svc.features.map((f) => ({ title: f.title || '', desc: f.desc || '' }))
          : [{ title: '', desc: '' }],
      faqs:
        Array.isArray(svc.faqs) && svc.faqs.length > 0
          ? svc.faqs.map((fq) => ({ q: fq.q || '', a: fq.a || '' }))
          : [{ q: '', a: '' }],
      related:
        Array.isArray(svc.related) && svc.related.length > 0
          ? svc.related.map((r) => ({ title: r.title || '', slug: r.slug || '' }))
          : [{ title: '', slug: '/services/' }]
    });
    setShowForm(true);
    setFeedback({ type: '', message: '' });
  };

  const handleFeatureChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const addFeatureRow = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', desc: '' }]
    }));
  };

  const removeFeatureRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleFaqChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    }));
  };

  const addFaqRow = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { q: '', a: '' }]
    }));
  };

  const removeFaqRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx)
    }));
  };

  const handleRelatedChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      related: prev.related.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    }));
  };

  const addRelatedRow = () => {
    setForm((prev) => ({
      ...prev,
      related: [...prev.related, { title: '', slug: '/services/' }]
    }));
  };

  const removeRelatedRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      related: prev.related.filter((_, i) => i !== idx)
    }));
  };

  const splitLines = (text) =>
    String(text || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      shortLabel: form.shortLabel.trim() || form.title.trim(),
      dropdownDesc: form.dropdownDesc.trim(),
      iconKey: form.iconKey,
      category: form.category.trim() || 'Engineering Service',
      headline: form.headline.trim(),
      summary: form.summary.trim(),
      overview: form.overview.trim() || form.summary.trim(),
      order: form.order !== '' ? Number(form.order) : undefined,
      offerings: splitLines(form.offeringsText),
      technologies: splitLines(form.technologiesText),
      benefits: splitLines(form.benefitsText),
      process: splitLines(form.processText),
      features: form.features
        .map((f) => ({ title: f.title.trim(), desc: f.desc.trim() }))
        .filter((f) => f.title),
      faqs: form.faqs
        .map((fq) => ({ q: fq.q.trim(), a: fq.a.trim() }))
        .filter((fq) => fq.q),
      related: form.related
        .map((r) => ({ title: r.title.trim(), slug: r.slug.trim() }))
        .filter((r) => r.title && r.slug && r.slug !== '/services/')
    };

    try {
      if (editingId) {
        await onUpdateService(editingId, payload);
        setFeedback({ type: 'success', message: `Service "${payload.title}" updated cleanly.` });
      } else {
        await onCreateService(payload);
        setFeedback({
          type: 'success',
          message: `Service "${payload.title}" added across Services, Navbar, Footer & Home.`
        });
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save service.' });
    } finally {
      setSaving(false);
    }
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    setFeedback({ type: '', message: '' });
    try {
      await onSavePageConfig(configForm);
      setFeedback({
        type: 'success',
        message: 'Services page hero header and bottom CTA copy updated.'
      });
      setShowConfigForm(false);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save page settings.' });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDelete = async (svc) => {
    setFeedback({ type: '', message: '' });
    try {
      await onDeleteService(svc._id || svc.id || svc.slug);
      if (editingId && [svc._id, svc.id, svc.slug].includes(editingId)) {
        setShowForm(false);
        setEditingId(null);
      }
      setFeedback({
        type: 'success',
        message: `Removed "${svc.title}" from Services, Home, Navbar, and Footer.`
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to remove service.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">
            DNSV Engineering Services Catalog ({sortedServices.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all services, deliverables, process steps, FAQs, navbar dropdowns, and Services page hero &amp; CTA copy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowConfigForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0F172A] bg-slate-100 hover:bg-slate-200 border border-slate-200 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{showConfigForm ? 'Close Header & CTA Editor' : 'Page Header & CTA'}</span>
          </button>

          <button
            type="button"
            onClick={() => (showForm ? setShowForm(false) : openAddForm())}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm hover:opacity-95 whitespace-nowrap"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showForm ? 'Close Service Editor' : 'Add New Service'}</span>
          </button>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Services Page Hero & Bottom CTA Settings Editor */}
      {showConfigForm && (
        <form
          onSubmit={handleConfigSubmit}
          className="p-6 rounded-2xl bg-white/95 border border-sky-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                User-Side Services Page Hero &amp; Bottom CTA Copy
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Updates the top headline banner and post-login bottom call-to-action card on /services.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConfigForm(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Hero Eyebrow Badge
              </label>
              <input
                type="text"
                value={configForm.heroBadge}
                onChange={(e) => setConfigForm({ ...configForm, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Hero Title
              </label>
              <input
                type="text"
                required
                value={configForm.heroTitle}
                onChange={(e) => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Hero Subtitle Paragraph
            </label>
            <textarea
              rows={2}
              value={configForm.heroSubtitle}
              onChange={(e) => setConfigForm({ ...configForm, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bottom CTA Heading
              </label>
              <input
                type="text"
                value={configForm.ctaTitle}
                onChange={(e) => setConfigForm({ ...configForm, ctaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bottom CTA Description
              </label>
              <input
                type="text"
                value={configForm.ctaDescription}
                onChange={(e) => setConfigForm({ ...configForm, ctaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={configForm.ctaPrimaryLabel}
                onChange={(e) => setConfigForm({ ...configForm, ctaPrimaryLabel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={configForm.ctaSecondaryLabel}
                onChange={(e) => setConfigForm({ ...configForm, ctaSecondaryLabel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowConfigForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingConfig}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingConfig ? 'Saving...' : 'Save Page Header & CTA'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Add / Edit Service Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-white/95 border border-sky-200 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {editingId ? `Edit Service: ${form.title}` : 'Create New Engineering Service'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Public visitors see Title, Category &amp; Summary. Deliverables, Technical Features, Lifecycle Phases &amp; FAQs unlock after login.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Public Card & Hero Details */}
          <div className="space-y-4 p-4 rounded-xl bg-sky-50/40 border border-sky-100">
            <div className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              1. Public Card, Navigation &amp; Detail Hero (Visible Before &amp; After Login)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Cloud DevOps & Automation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  URL Slug (auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. cloud-devops"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Category Badge
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Digital Web Presence"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Card Icon
                </label>
                <select
                  value={form.iconKey}
                  onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                >
                  {SERVICE_ICON_OPTIONS.map((ic) => (
                    <option key={ic.value} value={ic.value}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Short Footer Label
                </label>
                <input
                  type="text"
                  value={form.shortLabel}
                  onChange={(e) => setForm({ ...form, shortLabel: e.target.value })}
                  placeholder="e.g. Website Development"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  placeholder="Auto"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Navbar Dropdown Subtitle
                </label>
                <input
                  type="text"
                  value={form.dropdownDesc}
                  onChange={(e) => setForm({ ...form, dropdownDesc: e.target.value })}
                  placeholder="e.g. Custom, responsive websites & landing pages"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Detail Page Hero Headline
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="e.g. High-Performance, Responsive Websites Tailored for Growth."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Public Card Summary (Shown on /services &amp; Home page) *
              </label>
              <textarea
                rows={2}
                required
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Brief public summary shown on the Services listing and Home page..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Detailed Service Overview (Shown on /services/:slug)
              </label>
              <textarea
                rows={3}
                value={form.overview}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
                placeholder="Extended architectural overview displayed on the service detail page..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          {/* Section 2: Gated Deliverables & Full Detail Page Specs */}
          <div className="space-y-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              2. Full Deliverables, Architecture &amp; FAQs (Unlocked Only After User Login)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Key Deliverables &amp; Capabilities (One per line — shown on /services)
                </label>
                <textarea
                  rows={5}
                  value={form.offeringsText}
                  onChange={(e) => setForm({ ...form, offeringsText: e.target.value })}
                  placeholder={`Corporate & Business Websites\nHigh-Converting Landing Pages\nTechnical On-Page SEO`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Direct Business Outcomes (One per line — shown on /services/:slug)
                </label>
                <textarea
                  rows={5}
                  value={form.benefitsText}
                  onChange={(e) => setForm({ ...form, benefitsText: e.target.value })}
                  placeholder={`Elevated brand perception\nHigher organic search visibility\nFull ownership of clean codebase`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Core Technologies Stack (One per line — monospace badges)
                </label>
                <textarea
                  rows={4}
                  value={form.technologiesText}
                  onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                  placeholder={`React.js\nTailwind CSS\nNode.js\nMongoDB`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Execution Lifecycle Phases (One per line — Phase 01..N cards)
                </label>
                <textarea
                  rows={4}
                  value={form.processText}
                  onChange={(e) => setForm({ ...form, processText: e.target.value })}
                  placeholder={`Requirements Analysis\nUI/UX Wireframing\nFull-Stack Build\nQA & Production Launch`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            {/* Key Technical Features */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Key Technical Features (Detail Page Bento Grid Cards)
                </span>
                <button
                  type="button"
                  onClick={addFeatureRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Feature Card</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {form.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-3 rounded-xl bg-white border border-slate-200 items-start"
                  >
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      placeholder={`Feature ${idx + 1} Title`}
                      className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <input
                      type="text"
                      value={feat.desc}
                      onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                      placeholder="Feature technical description..."
                      className="md:col-span-7 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureRow(idx)}
                      className="md:col-span-1 p-2 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                      title="Remove Feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service FAQs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Service Questions (FAQs on /services/:slug)
                </span>
                <button
                  type="button"
                  onClick={addFaqRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {form.faqs.map((fq, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-3 rounded-xl bg-white border border-slate-200 items-start"
                  >
                    <input
                      type="text"
                      value={fq.q}
                      onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                      placeholder="Question..."
                      className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <input
                      type="text"
                      value={fq.a}
                      onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                      placeholder="Answer..."
                      className="md:col-span-7 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaqRow(idx)}
                      className="md:col-span-1 p-2 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Complementary Services */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Complementary Links (Related Services sidebar on /services/:slug)
                </span>
                <button
                  type="button"
                  onClick={addRelatedRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Related Link</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {form.related.map((rel, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-3 rounded-xl bg-white border border-slate-200 items-start"
                  >
                    <input
                      type="text"
                      value={rel.title}
                      onChange={(e) => handleRelatedChange(idx, 'title', e.target.value)}
                      placeholder="Display Title (e.g. Custom Software Development)"
                      className="md:col-span-6 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <input
                      type="text"
                      value={rel.slug}
                      onChange={(e) => handleRelatedChange(idx, 'slug', e.target.value)}
                      placeholder="/services/custom-software"
                      className="md:col-span-5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeRelatedRow(idx)}
                      className="md:col-span-1 p-2 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                      title="Remove Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {saving
                  ? 'Saving Service...'
                  : editingId
                  ? 'Save Service Changes'
                  : 'Publish Service'}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Services Grid */}
      {sortedServices.length === 0 ? (
        <div className="bg-white/95 rounded-2xl border border-slate-200 p-10 text-center space-y-2">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-[#0F172A]">No Engineering Services Published</p>
          <p className="text-xs text-slate-500">
            Click &ldquo;Add New Service&rdquo; above to add a service to the user-facing catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedServices.map((svc, idx) => {
            const svcId = svc._id || svc.id || svc.slug;
            return (
              <div
                key={svcId}
                className="p-6 rounded-2xl bg-white/95 border border-slate-200 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0284C7]">
                        {svc.category || 'Engineering Service'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[#0284C7] font-bold">
                        Order #{svc.order ?? idx + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mt-1">{svc.title}</h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Route: /services/{svc.slug}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{svc.summary}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex flex-wrap items-center gap-3">
                    <span>
                      <strong className="text-[#0F172A]">{svc.offerings?.length || 0}</strong>{' '}
                      deliverables
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#0F172A]">{svc.features?.length || 0}</strong>{' '}
                      features
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#0F172A]">{svc.process?.length || 0}</strong>{' '}
                      phases
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#0F172A]">{svc.faqs?.length || 0}</strong> FAQs
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Pre-login &amp; Post-login Gated
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(svc)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(svc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
