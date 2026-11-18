import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
  Mail,
  Globe,
  Layers
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'email-marketing', label: 'Email Marketing (Mailcurve)', short: 'Email Marketing', icon: Mail },
  { id: 'website-development', label: 'Website Development Plans', short: 'Website Dev', icon: Globe },
  { id: 'combined-packages', label: 'Website + Email Combos', short: 'Combo Packages', icon: Layers }
];

const EMPTY_FORM = {
  category: 'email-marketing',
  name: '',
  subtitle: '',
  isCustomPrice: false,
  price: '',
  priceLabel: 'Custom Quotation',
  billingPeriod: 'monthly',
  dailyLimit: '',
  monthlyLimit: '',
  pageLimit: '',
  revisionCycles: '',
  recurringFee: '',
  recurringBillingPeriod: 'monthly (after Month 1)',
  isPopular: false,
  popularBadge: 'Most Popular',
  featuresText: '',
  technicalNotes: '',
  order: ''
};

export default function AdminPricingPanel({
  pricingPlans = [],
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan
}) {
  const [selectedCategory, setSelectedCategory] = useState('email-marketing');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const filteredPlans = useMemo(() => {
    const sorted = [...pricingPlans].sort(
      (a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)
    );
    if (selectedCategory === 'all') return sorted;
    return sorted.filter((p) => p.category === selectedCategory);
  }, [pricingPlans, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = {
      'email-marketing': 0,
      'website-development': 0,
      'combined-packages': 0
    };
    pricingPlans.forEach((p) => {
      if (counts[p.category] !== undefined) counts[p.category] += 1;
    });
    return counts;
  }, [pricingPlans]);

  const openAddForm = () => {
    const targetCategory = selectedCategory === 'all' ? 'email-marketing' : selectedCategory;
    const defaultBilling =
      targetCategory === 'email-marketing'
        ? 'monthly'
        : targetCategory === 'website-development'
        ? 'one-time'
        : 'combo';
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      category: targetCategory,
      billingPeriod: defaultBilling
    });
    setShowForm(true);
    setFeedback({ type: '', message: '' });
  };

  const openEditForm = (plan) => {
    setEditingId(plan._id || plan.id);
    setForm({
      category: plan.category || 'email-marketing',
      name: plan.name || '',
      subtitle: plan.subtitle || '',
      isCustomPrice: plan.price === null || plan.price === undefined,
      price: plan.price !== null && plan.price !== undefined ? String(plan.price) : '',
      priceLabel: plan.priceLabel || 'Custom Quotation',
      billingPeriod: plan.billingPeriod || 'monthly',
      dailyLimit: plan.dailyLimit !== undefined && plan.dailyLimit !== null ? String(plan.dailyLimit) : '',
      monthlyLimit: plan.monthlyLimit !== undefined && plan.monthlyLimit !== null ? String(plan.monthlyLimit) : '',
      pageLimit: plan.pageLimit || '',
      revisionCycles:
        plan.revisionCycles !== undefined && plan.revisionCycles !== null
          ? String(plan.revisionCycles)
          : '',
      recurringFee:
        plan.recurringFee !== undefined && plan.recurringFee !== null
          ? String(plan.recurringFee)
          : '',
      recurringBillingPeriod: plan.recurringBillingPeriod || 'monthly (after Month 1)',
      isPopular: Boolean(plan.isPopular),
      popularBadge: plan.popularBadge || 'Most Popular',
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      technicalNotes: plan.technicalNotes || '',
      order: plan.order !== undefined && plan.order !== null ? String(plan.order) : ''
    });
    setShowForm(true);
    setFeedback({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    const payload = {
      category: form.category,
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      isCustomPrice: form.isCustomPrice,
      price: form.isCustomPrice || form.price === '' ? null : Number(form.price),
      priceLabel: form.isCustomPrice ? form.priceLabel.trim() || 'Custom Quotation' : '',
      billingPeriod: form.billingPeriod,
      dailyLimit: form.dailyLimit.trim(),
      monthlyLimit: form.monthlyLimit.trim(),
      pageLimit: form.pageLimit.trim(),
      revisionCycles: form.revisionCycles.trim(),
      recurringFee: form.recurringFee !== '' ? Number(form.recurringFee) : null,
      recurringBillingPeriod: form.recurringBillingPeriod.trim(),
      isPopular: form.isPopular,
      popularBadge: form.popularBadge.trim() || 'Most Popular',
      features: form.featuresText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      technicalNotes: form.technicalNotes.trim(),
      order: form.order !== '' ? Number(form.order) : undefined
    };

    try {
      if (editingId) {
        await onUpdatePlan(editingId, payload);
        setFeedback({ type: 'success', message: `Updated pricing plan "${payload.name}".` });
      } else {
        await onCreatePlan(payload);
        setFeedback({ type: 'success', message: `Added pricing plan "${payload.name}".` });
        setSelectedCategory(payload.category);
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save pricing plan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickTogglePopular = async (plan) => {
    setFeedback({ type: '', message: '' });
    try {
      await onUpdatePlan(plan._id || plan.id, {
        isPopular: !plan.isPopular,
        popularBadge: plan.popularBadge || 'Most Popular'
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update badge.' });
    }
  };

  const handleDelete = async (plan) => {
    setFeedback({ type: '', message: '' });
    try {
      await onDeletePlan(plan._id || plan.id);
      if (editingId === (plan._id || plan.id)) {
        setShowForm(false);
        setEditingId(null);
      }
      setFeedback({ type: 'success', message: `Removed pricing plan "${plan.name}".` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete pricing plan.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Category Filter & Add Plan CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200">
          {CATEGORY_OPTIONS.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  active ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.short}</span>
                <span className="font-mono text-[11px] opacity-75">({categoryCounts[cat.id]})</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'all' ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            All ({pricingPlans.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => (showForm ? setShowForm(false) : openAddForm())}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm hover:opacity-95 whitespace-nowrap"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showForm ? 'Close Editor' : 'Add Pricing Plan'}</span>
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

      {/* Add / Edit Pricing Plan Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-white/95 border border-sky-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {editingId ? `Edit Plan: ${form.name}` : 'Create New Pricing Plan'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Changes reflect immediately on the public Pricing page.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Pricing Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => {
                  const nextCat = e.target.value;
                  setForm({
                    ...form,
                    category: nextCat,
                    billingPeriod:
                      nextCat === 'email-marketing'
                        ? 'monthly'
                        : nextCat === 'website-development'
                        ? 'one-time'
                        : 'combo'
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Business or Pro"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Short Subtitle
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. High-performing automated workflow campaigns"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Price & Billing */}
          <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#0F172A]">Investment &amp; Billing</span>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isCustomPrice}
                  onChange={(e) => setForm({ ...form, isCustomPrice: e.target.checked })}
                  className="rounded border-slate-300 text-[#0284C7]"
                />
                <span>Use Custom Quotation (No Fixed ₹ Price)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {form.isCustomPrice ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Custom Price Label
                  </label>
                  <input
                    type="text"
                    value={form.priceLabel}
                    onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
                    placeholder="Custom Quotation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required={!form.isCustomPrice}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 5999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Billing Period
                </label>
                <select
                  value={form.billingPeriod}
                  onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="monthly">Monthly (/month)</option>
                  <option value="one-time">One-Time Fee</option>
                  <option value="combo">Website + Monthly Combo</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded border-slate-300 text-[#0284C7]"
                  />
                  <span>Highlight Plan</span>
                </label>
                {form.isPopular && (
                  <input
                    type="text"
                    value={form.popularBadge}
                    onChange={(e) => setForm({ ...form, popularBadge: e.target.value })}
                    placeholder="Badge label"
                    className="w-36 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A]"
                  />
                )}
              </div>
            </div>

            {/* Category-Specific Quotas */}
            {form.category === 'email-marketing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Daily Email Limit
                  </label>
                  <input
                    type="text"
                    value={form.dailyLimit}
                    onChange={(e) => setForm({ ...form, dailyLimit: e.target.value })}
                    placeholder="e.g. 5000 or Custom Quota"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Monthly Email Limit
                  </label>
                  <input
                    type="text"
                    value={form.monthlyLimit}
                    onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
                    placeholder="e.g. 150000 or Custom Quota"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>
            )}

            {form.category === 'website-development' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Page Scope
                  </label>
                  <input
                    type="text"
                    value={form.pageLimit}
                    onChange={(e) => setForm({ ...form, pageLimit: e.target.value })}
                    placeholder="e.g. Up to 10 Pages"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Revision Cycles
                  </label>
                  <input
                    type="text"
                    value={form.revisionCycles}
                    onChange={(e) => setForm({ ...form, revisionCycles: e.target.value })}
                    placeholder="e.g. 2 or Tailored Scope"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>
            )}

            {form.category === 'combined-packages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Monthly Email Subscription (Month 2+ in ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.recurringFee}
                    onChange={(e) => setForm({ ...form, recurringFee: e.target.value })}
                    placeholder="e.g. 1499"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Recurring Billing Note
                  </label>
                  <input
                    type="text"
                    value={form.recurringBillingPeriod}
                    onChange={(e) => setForm({ ...form, recurringBillingPeriod: e.target.value })}
                    placeholder="monthly (after Month 1)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Technical Deliverables (One bullet per line) *
              </label>
              <textarea
                rows={6}
                required
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                placeholder={`5,000 emails per day\n150,000 emails per month\nAutomation workflows & triggers`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Technical Notes / Terms (Shown after login)
              </label>
              <textarea
                rows={6}
                value={form.technicalNotes}
                onChange={(e) => setForm({ ...form, technicalNotes: e.target.value })}
                placeholder="Sending limit quotas. Requires sender domain DNS verification (SPF/DKIM)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#0284C7]"
              />
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
              <span>{saving ? 'Saving Plan...' : editingId ? 'Update Plan' : 'Publish Plan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Pricing Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white/95 rounded-2xl border border-slate-200 p-10 text-center space-y-2">
          <p className="text-sm font-bold text-[#0F172A]">No Plans in This Category</p>
          <p className="text-xs text-slate-500">
            Click &ldquo;Add Pricing Plan&rdquo; above to create a new pricing tier manually.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => {
            const planId = plan._id || plan.id;
            return (
              <div
                key={planId}
                className={`p-5 rounded-2xl bg-white/95 flex flex-col justify-between gap-4 shadow-sm transition-all ${
                  plan.isPopular ? 'border-2 border-[#2563EB]' : 'border border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block">
                        {CATEGORY_OPTIONS.find((c) => c.id === plan.category)?.short || plan.category}
                      </span>
                      <h4 className="text-base font-bold text-[#0F172A] mt-0.5">{plan.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.subtitle}</p>
                    </div>
                    {plan.isPopular && (
                      <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white shrink-0">
                        {plan.popularBadge || 'Popular'}
                      </span>
                    )}
                  </div>

                  <div className="py-3 border-y border-slate-100">
                    {plan.price !== null && plan.price !== undefined ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold font-mono text-[#0F172A]">
                          ₹{Number(plan.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500">
                          {plan.category === 'email-marketing'
                            ? '/ month'
                            : plan.category === 'website-development'
                            ? 'one-time'
                            : plan.recurringFee
                            ? `+ ₹${Number(plan.recurringFee).toLocaleString('en-IN')}/mo`
                            : 'combo'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-base font-bold font-mono text-[#2563EB]">
                        {plan.priceLabel || 'Custom Quotation'}
                      </div>
                    )}

                    {plan.category === 'email-marketing' && (plan.dailyLimit || plan.monthlyLimit) && (
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600 font-mono">
                        <span>Daily: {typeof plan.dailyLimit === 'number' ? plan.dailyLimit.toLocaleString('en-IN') : plan.dailyLimit || '—'}</span>
                        <span>·</span>
                        <span>Monthly: {typeof plan.monthlyLimit === 'number' ? plan.monthlyLimit.toLocaleString('en-IN') : plan.monthlyLimit || '—'}</span>
                      </div>
                    )}

                    {plan.category === 'website-development' && plan.pageLimit && (
                      <div className="mt-2 text-[11px] text-slate-600">
                        Scope: <strong className="text-[#0F172A]">{plan.pageLimit}</strong>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Deliverables ({plan.features?.length || 0})
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 max-h-28 overflow-y-auto pr-1">
                      {(plan.features || []).slice(0, 5).map((f, idx) => (
                        <li key={idx} className="truncate">
                          • {f}
                        </li>
                      ))}
                      {(plan.features?.length || 0) > 5 && (
                        <li className="text-[11px] text-[#0284C7] font-medium">
                          + {plan.features.length - 5} more deliverables
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickTogglePopular(plan)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                      plan.isPopular
                        ? 'bg-sky-50 border-sky-200 text-[#0284C7]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300'
                    }`}
                    title="Toggle Popular Badge"
                  >
                    <Star className="w-3 h-3" fill={plan.isPopular ? 'currentColor' : 'none'} />
                    <span>{plan.isPopular ? 'Featured' : 'Feature'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditForm(plan)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(plan)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
