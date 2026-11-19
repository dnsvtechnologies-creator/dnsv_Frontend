import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminSettingsPanel({ siteSettings, onSaveSettings }) {
  const [form, setForm] = useState({
    companyName: '',
    fullForm: '',
    tagline: '',
    email: '',
    supportEmail: '',
    phone: '',
    businessHours: '',
    location: ''
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (siteSettings) {
      const contact = siteSettings.contact || {};
      setForm({
        companyName: siteSettings.companyName || 'DNSV Technologies',
        fullForm: siteSettings.fullForm || 'Digital Nexus for Software & Ventures',
        tagline: siteSettings.tagline || 'Connecting Ideas with Technology.',
        email: contact.email || siteSettings.email || 'contact@dnsvtechnologies.com',
        supportEmail: contact.supportEmail || siteSettings.supportEmail || 'support@dnsvtechnologies.com',
        phone: contact.phone || siteSettings.phone || '+91 (Available upon enquiry)',
        businessHours: contact.businessHours || siteSettings.businessHours || 'Monday - Saturday: 09:30 AM - 06:30 PM IST',
        location: contact.location || 'India (Serving Global & Regional Clients)'
      });
    }
  }, [siteSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      await onSaveSettings({
        companyName: form.companyName,
        fullForm: form.fullForm,
        tagline: form.tagline,
        contact: {
          email: form.email,
          supportEmail: form.supportEmail,
          phone: form.phone,
          businessHours: form.businessHours,
          location: form.location
        }
      });
      setStatus({ type: 'success', message: 'Company settings saved successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-bold text-[#0F172A]">Brand & Public Contact Settings</h3>
        <p className="text-xs text-slate-600 mt-1">
          Configure DNSV Technologies corporate profile and public contact details returned by the API.
        </p>
      </div>

      {status.message && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs ${
            status.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Company Name</label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Full Form</label>
          <input
            type="text"
            value={form.fullForm}
            onChange={(e) => setForm({ ...form, fullForm: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">Tagline</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Business Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Support Email</label>
          <input
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Phone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">Business Hours</label>
          <input
            type="text"
            value={form.businessHours}
            onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm hover:opacity-95 disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </form>
  );
}
