import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Package,
  ShieldCheck,
  Sparkles,
  PlusCircle
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'mail', label: 'Mail / Email Automation' },
  { value: 'shieldCheck', label: 'Shield / Verification & Security' },
  { value: 'package', label: 'Package / SaaS Module' },
  { value: 'cpu', label: 'CPU / AI & Processing Engine' },
  { value: 'database', label: 'Database / CRM & Storage' },
  { value: 'globe', label: 'Globe / Web & Cloud SaaS' },
  { value: 'terminal', label: 'Terminal / Developer API' },
  { value: 'barChart', label: 'Analytics / Reporting' }
];

const STATUS_PRESETS = ['Live SaaS', 'In Development', 'Live Beta', 'Upcoming'];

const createEmptyProductForm = () => ({
  name: '',
  slug: '',
  tagline: '',
  categoryLabel: 'Proprietary SaaS Platform',
  statusBadge: 'Live SaaS',
  shortOverview: '',
  iconKey: 'package',
  isHighlighted: false,
  hasInteractiveValidator: false,
  ctaLabel: '',
  ctaLink: '/pricing',
  pricingHint: '',
  order: '',
  summaryBulletsText: '',
  capabilitiesSectionTag: 'Platform Architecture',
  capabilitiesSectionTitle: '',
  capabilities: [
    { iconKey: 'layers', title: '', desc: '' },
    { iconKey: 'server', title: '', desc: '' },
    { iconKey: 'shieldCheck', title: '', desc: '' }
  ],
  policyTag: 'Infrastructure & Operational Policies',
  policyTitle: '',
  policySummary: '',
  highlights: [
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ],
  bottomCtaTitle: '',
  bottomCtaDesc: '',
  bottomCtaButtonText: 'Request a Custom Quote',
  bottomCtaButtonLink: '/request-quote'
});

export default function AdminProductsPanel({
  products = [],
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyProductForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)),
    [products]
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(createEmptyProductForm());
    setShowForm(true);
    setFeedback({ type: '', message: '' });
  };

  const openEditForm = (prod) => {
    setEditingId(prod._id || prod.id || prod.slug);
    setForm({
      name: prod.name || '',
      slug: prod.slug || '',
      tagline: prod.tagline || '',
      categoryLabel: prod.categoryLabel || 'Proprietary SaaS Platform',
      statusBadge: prod.statusBadge || 'Live SaaS',
      shortOverview: prod.shortOverview || '',
      iconKey: prod.iconKey || 'package',
      isHighlighted: Boolean(prod.isHighlighted),
      hasInteractiveValidator: Boolean(prod.hasInteractiveValidator),
      ctaLabel: prod.ctaLabel || '',
      ctaLink: prod.ctaLink || '/pricing',
      pricingHint: prod.pricingHint || '',
      order: prod.order !== undefined && prod.order !== null ? String(prod.order) : '',
      summaryBulletsText: Array.isArray(prod.summaryBullets) ? prod.summaryBullets.join('\n') : '',
      capabilitiesSectionTag: prod.capabilitiesSectionTag || 'Platform Architecture',
      capabilitiesSectionTitle: prod.capabilitiesSectionTitle || '',
      capabilities:
        Array.isArray(prod.capabilities) && prod.capabilities.length > 0
          ? prod.capabilities.map((c) => ({
              iconKey: c.iconKey || 'layers',
              title: c.title || '',
              desc: c.desc || ''
            }))
          : [{ iconKey: 'layers', title: '', desc: '' }],
      policyTag: prod.policyTag || 'Infrastructure & Operational Policies',
      policyTitle: prod.policyTitle || '',
      policySummary: prod.policySummary || '',
      highlights:
        Array.isArray(prod.highlights) && prod.highlights.length > 0
          ? prod.highlights.map((h) => ({ title: h.title || '', desc: h.desc || '' }))
          : [{ title: '', desc: '' }],
      bottomCtaTitle: prod.bottomCtaTitle || '',
      bottomCtaDesc: prod.bottomCtaDesc || '',
      bottomCtaButtonText: prod.bottomCtaButtonText || 'Request a Custom Quote',
      bottomCtaButtonLink: prod.bottomCtaButtonLink || '/request-quote'
    });
    setShowForm(true);
    setFeedback({ type: '', message: '' });
  };

  const handleCapabilityChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const addCapabilityRow = () => {
    setForm((prev) => ({
      ...prev,
      capabilities: [...prev.capabilities, { iconKey: 'layers', title: '', desc: '' }]
    }));
  };

  const removeCapabilityRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== idx)
    }));
  };

  const handleHighlightChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const addHighlightRow = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', desc: '' }]
    }));
  };

  const removeHighlightRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      tagline: form.tagline.trim(),
      categoryLabel: form.categoryLabel.trim(),
      statusBadge: form.statusBadge.trim(),
      shortOverview: form.shortOverview.trim(),
      iconKey: form.iconKey,
      isHighlighted: form.isHighlighted,
      hasInteractiveValidator: form.hasInteractiveValidator,
      ctaLabel: form.ctaLabel.trim() || `Explore ${form.name.trim()} Platform`,
      ctaLink: form.ctaLink.trim() || '/pricing',
      pricingHint: form.pricingHint.trim(),
      order: form.order !== '' ? Number(form.order) : undefined,
      summaryBullets: form.summaryBulletsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      capabilitiesSectionTag: form.capabilitiesSectionTag.trim(),
      capabilitiesSectionTitle:
        form.capabilitiesSectionTitle.trim() || `Core ${form.name.trim()} Features`,
      capabilities: form.capabilities
        .map((c) => ({
          iconKey: c.iconKey || 'layers',
          title: c.title.trim(),
          desc: c.desc.trim()
        }))
        .filter((c) => c.title),
      policyTag: form.policyTag.trim(),
      policyTitle: form.policyTitle.trim(),
      policySummary: form.policySummary.trim(),
      highlights: form.highlights
        .map((h) => ({ title: h.title.trim(), desc: h.desc.trim() }))
        .filter((h) => h.title),
      bottomCtaTitle: form.bottomCtaTitle.trim(),
      bottomCtaDesc: form.bottomCtaDesc.trim(),
      bottomCtaButtonText: form.bottomCtaButtonText.trim() || 'Request a Custom Quote',
      bottomCtaButtonLink: form.bottomCtaButtonLink.trim() || '/request-quote'
    };

    try {
      if (editingId) {
        await onUpdateProduct(editingId, payload);
        setFeedback({ type: 'success', message: `Product "${payload.name}" updated cleanly.` });
      } else {
        await onCreateProduct(payload);
        setFeedback({
          type: 'success',
          message: `Product "${payload.name}" created with auth-gated public & full UI views.`
        });
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save product.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (prod) => {
    setFeedback({ type: '', message: '' });
    try {
      await onDeleteProduct(prod._id || prod.id || prod.slug);
      if (editingId && [prod._id, prod.id, prod.slug].includes(editingId)) {
        setShowForm(false);
        setEditingId(null);
      }
      setFeedback({
        type: 'success',
        message: `Removed "${prod.name}" from user website navigation, Home, and Products pages.`
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to remove product.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">
            DNSV Software Products Catalog ({sortedProducts.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, or remove products. Every product renders automatically with identical light UI and pre-login / post-login gating.
          </p>
        </div>

        <button
          type="button"
          onClick={() => (showForm ? setShowForm(false) : openAddForm())}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm hover:opacity-95 whitespace-nowrap"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showForm ? 'Close Product Editor' : 'Add New Product'}</span>
        </button>
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

      {/* Add / Edit Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-white/95 border border-sky-200 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {editingId ? `Edit Product: ${form.name}` : 'Create New SaaS Product'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Public visitors only see the Public Overview card. Full deliverables, modules &amp; specs unlock after login.
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

          {/* Section A: Public Overview (Visible before login) */}
          <div className="space-y-4 p-4 rounded-xl bg-sky-50/40 border border-sky-100">
            <div className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              1. Public Overview Details (Visible Before &amp; After Login)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Nexus CRM"
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
                  placeholder="e.g. nexus-crm"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Category Label
                </label>
                <input
                  type="text"
                  value={form.categoryLabel}
                  onChange={(e) => setForm({ ...form, categoryLabel: e.target.value })}
                  placeholder="e.g. Revenue & Pipeline SaaS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. Unified Client & Workflow Automation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Status Badge
                </label>
                <select
                  value={STATUS_PRESETS.includes(form.statusBadge) ? form.statusBadge : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setForm({ ...form, statusBadge: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                >
                  {STATUS_PRESETS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                  {!STATUS_PRESETS.includes(form.statusBadge) && (
                    <option value="custom">{form.statusBadge}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Card Icon
                </label>
                <select
                  value={form.iconKey}
                  onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic.value} value={ic.value}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Public Short Description *
              </label>
              <textarea
                rows={2}
                required
                value={form.shortOverview}
                onChange={(e) => setForm({ ...form, shortOverview: e.target.value })}
                placeholder="Brief summary visible publicly before login..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pricing Hint Text
                </label>
                <input
                  type="text"
                  value={form.pricingHint}
                  onChange={(e) => setForm({ ...form, pricingHint: e.target.value })}
                  placeholder="e.g. View Plans (From ₹799/mo)"
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
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={form.isHighlighted}
                    onChange={(e) => setForm({ ...form, isHighlighted: e.target.checked })}
                    className="rounded border-slate-300 text-[#0284C7]"
                  />
                  <span>Primary Highlight Card</span>
                </label>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasInteractiveValidator}
                onChange={(e) =>
                  setForm({ ...form, hasInteractiveValidator: e.target.checked })
                }
                className="rounded border-slate-300 text-[#0284C7]"
              />
              <span>Include Interactive Email Validation Probe Demo (on product detail page)</span>
            </label>
          </div>

          {/* Section B: Post-Login Locked Specs */}
          <div className="space-y-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              2. Full Product Specs (Unlocked Only After User Login)
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Overview Card Bullet Highlights (One per line, shown on Products page after login)
              </label>
              <textarea
                rows={4}
                value={form.summaryBulletsText}
                onChange={(e) => setForm({ ...form, summaryBulletsText: e.target.value })}
                placeholder={`Automated multi-channel lead capture\nRole-based team pipelines\nWebhook & REST API sync\nExportable audit trails`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Capabilities Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={form.capabilitiesSectionTag}
                  onChange={(e) =>
                    setForm({ ...form, capabilitiesSectionTag: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Capabilities Heading
                </label>
                <input
                  type="text"
                  value={form.capabilitiesSectionTitle}
                  onChange={(e) =>
                    setForm({ ...form, capabilitiesSectionTitle: e.target.value })
                  }
                  placeholder={`Core ${form.name || 'Product'} Features`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
            </div>

            {/* Dynamic Capabilities Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Core Feature Modules (Bento Grid Cards)
                </span>
                <button
                  type="button"
                  onClick={addCapabilityRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Feature Card</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {form.capabilities.map((cap, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-3 rounded-xl bg-white border border-slate-200 items-start"
                  >
                    <input
                      type="text"
                      value={cap.title}
                      onChange={(e) => handleCapabilityChange(idx, 'title', e.target.value)}
                      placeholder={`Module ${idx + 1} Title`}
                      className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <input
                      type="text"
                      value={cap.desc}
                      onChange={(e) => handleCapabilityChange(idx, 'desc', e.target.value)}
                      placeholder="Module description..."
                      className="md:col-span-7 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeCapabilityRow(idx)}
                      className="md:col-span-1 p-2 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                      title="Remove Module"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture / Policy Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Architecture / Policy Heading
                </label>
                <input
                  type="text"
                  value={form.policyTitle}
                  onChange={(e) => setForm({ ...form, policyTitle: e.target.value })}
                  placeholder="Transparent Specifications & Reliability"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Policy Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={form.policyTag}
                  onChange={(e) => setForm({ ...form, policyTag: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Policy / Architecture Explanation
              </label>
              <textarea
                rows={2}
                value={form.policySummary}
                onChange={(e) => setForm({ ...form, policySummary: e.target.value })}
                placeholder="Explain delivery architecture, quotas, or SLA transparency..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
              />
            </div>

            {/* 3 Spec Highlights */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Policy Highlight Sub-Cards (3-Column Row)
                </span>
                <button
                  type="button"
                  onClick={addHighlightRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Sub-Card</span>
                </button>
              </div>
              {form.highlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-3 rounded-xl bg-white border border-slate-200 items-start"
                >
                  <input
                    type="text"
                    value={hl.title}
                    onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                    placeholder="Highlight Title"
                    className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                  />
                  <input
                    type="text"
                    value={hl.desc}
                    onChange={(e) => handleHighlightChange(idx, 'desc', e.target.value)}
                    placeholder="Highlight explanation..."
                    className="md:col-span-7 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#0F172A]"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlightRow(idx)}
                    className="md:col-span-1 p-2 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Bottom CTA Title
                </label>
                <input
                  type="text"
                  value={form.bottomCtaTitle}
                  onChange={(e) => setForm({ ...form, bottomCtaTitle: e.target.value })}
                  placeholder={`Start Scaling with ${form.name || 'This Product'}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Bottom CTA Description
                </label>
                <input
                  type="text"
                  value={form.bottomCtaDesc}
                  onChange={(e) => setForm({ ...form, bottomCtaDesc: e.target.value })}
                  placeholder="Explore transparent plans or request a custom walkthrough."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={form.bottomCtaButtonText}
                  onChange={(e) => setForm({ ...form, bottomCtaButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  CTA Target Route
                </label>
                <select
                  value={form.bottomCtaButtonLink}
                  onChange={(e) => setForm({ ...form, bottomCtaButtonLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A]"
                >
                  <option value="/pricing">/pricing (Pricing Plans Page)</option>
                  <option value="/request-quote">/request-quote (Request Quote Page)</option>
                  <option value="/contact">/contact (Contact Form Page)</option>
                </select>
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
              <span>{saving ? 'Saving Product...' : editingId ? 'Save Product Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white/95 rounded-2xl border border-slate-200 p-10 text-center space-y-2">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-[#0F172A]">No Products Published</p>
          <p className="text-xs text-slate-500">
            Click &ldquo;Add New Product&rdquo; above to add a SaaS product. It will render automatically with full auth-gated UI.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedProducts.map((prod) => {
            const prodId = prod._id || prod.id || prod.slug;
            return (
              <div
                key={prodId}
                className={`p-6 rounded-2xl bg-white/95 flex flex-col justify-between gap-4 shadow-sm ${
                  prod.isHighlighted ? 'border-2 border-[#2563EB]/60' : 'border border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0284C7]">
                          {prod.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[#0284C7] font-bold">
                          {prod.statusBadge}
                        </span>
                        {prod.hasInteractiveValidator && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                            <Sparkles className="w-2.5 h-2.5" /> Interactive Lab
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] mt-1">{prod.name}</h3>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Route: /products/{prod.slug}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{prod.shortOverview}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex flex-wrap items-center gap-4">
                    <span>
                      <strong className="text-[#0F172A]">{prod.summaryBullets?.length || 0}</strong> overview highlights
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#0F172A]">{prod.capabilities?.length || 0}</strong> feature modules (gated)
                    </span>
                    {prod.pricingHint && (
                      <>
                        <span>•</span>
                        <span className="text-[#0284C7] font-semibold">{prod.pricingHint}</span>
                      </>
                    )}
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
                      onClick={() => openEditForm(prod)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod)}
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
