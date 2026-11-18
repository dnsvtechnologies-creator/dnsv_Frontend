import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminCmsPanel({
  blogs = [],
  portfolio = [],
  onCreateBlog,
  onDeleteBlog,
  onCreatePortfolio,
  onDeletePortfolio
}) {
  const [cmsTab, setCmsTab] = useState('blogs');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Architecture',
    author: 'DNSV Engineering Team',
    readTime: '5 min read',
    tags: '',
    excerpt: '',
    content: ''
  });

  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'SaaS Development',
    badge: 'Sample Work / Production Build',
    summary: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: '',
    tags: ''
  });

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });
    try {
      await onCreateBlog(blogForm);
      setBlogForm({
        title: '',
        category: 'Architecture',
        author: 'DNSV Engineering Team',
        readTime: '5 min read',
        tags: '',
        excerpt: '',
        content: ''
      });
      setShowBlogForm(false);
      setFeedback({ type: 'success', message: 'Blog article published successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish blog post.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });
    try {
      await onCreatePortfolio(portfolioForm);
      setPortfolioForm({
        title: '',
        category: 'SaaS Development',
        badge: 'Sample Work / Production Build',
        summary: '',
        challenge: '',
        solution: '',
        results: '',
        technologies: '',
        tags: ''
      });
      setShowPortfolioForm(false);
      setFeedback({ type: 'success', message: 'Portfolio project added successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add portfolio project.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200">
          <button
            type="button"
            onClick={() => setCmsTab('blogs')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              cmsTab === 'blogs' ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Blog Articles ({blogs.length})
          </button>
          <button
            type="button"
            onClick={() => setCmsTab('portfolio')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              cmsTab === 'portfolio' ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Portfolio Projects ({portfolio.length})
          </button>
        </div>

        {cmsTab === 'blogs' ? (
          <button
            type="button"
            onClick={() => setShowBlogForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm hover:opacity-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showBlogForm ? 'Cancel New Article' : 'New Blog Article'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowPortfolioForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] shadow-sm hover:opacity-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showPortfolioForm ? 'Cancel New Project' : 'New Portfolio Project'}</span>
          </button>
        )}
      </div>

      {feedback.message && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* New Blog Form */}
      {cmsTab === 'blogs' && showBlogForm && (
        <form onSubmit={handleBlogSubmit} className="p-6 rounded-2xl bg-white/95 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Publish New Engineering Article</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Article Title"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <input
              type="text"
              required
              placeholder="Category (e.g. Architecture, SaaS, Email Marketing)"
              value={blogForm.category}
              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <input
              type="text"
              placeholder="Author"
              value={blogForm.author}
              onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated, e.g. Node.js, MongoDB)"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
          </div>
          <input
            type="text"
            required
            placeholder="Short Excerpt"
            value={blogForm.excerpt}
            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
          <textarea
            rows={5}
            required
            placeholder="Full Markdown / Text Content"
            value={blogForm.content}
            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] to-[#2563EB] disabled:opacity-60"
            >
              {saving ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      )}

      {/* New Portfolio Form */}
      {cmsTab === 'portfolio' && showPortfolioForm && (
        <form onSubmit={handlePortfolioSubmit} className="p-6 rounded-2xl bg-white/95 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Add Portfolio Showcase Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Project Title"
              value={portfolioForm.title}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <input
              type="text"
              required
              placeholder="Category (e.g. SaaS Development, Custom Software)"
              value={portfolioForm.category}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={portfolioForm.technologies}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, technologies: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={portfolioForm.tags}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, tags: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
          </div>
          <textarea
            rows={2}
            required
            placeholder="Executive Summary"
            value={portfolioForm.summary}
            onChange={(e) => setPortfolioForm({ ...portfolioForm, summary: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <textarea
              rows={3}
              required
              placeholder="Challenge"
              value={portfolioForm.challenge}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, challenge: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <textarea
              rows={3}
              required
              placeholder="Solution"
              value={portfolioForm.solution}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, solution: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
            <textarea
              rows={3}
              required
              placeholder="Results"
              value={portfolioForm.results}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, results: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] to-[#2563EB] disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Portfolio Project'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {cmsTab === 'blogs' ? (
        <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {blogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No blog posts found.</div>
            ) : (
              blogs.map((post) => (
                <div key={post._id || post.slug} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-[#0284C7]">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.author || 'DNSV Team'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{post.publishedAt ? String(post.publishedAt).slice(0, 10) : 'Draft'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">{post.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteBlog(post._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 shrink-0 self-start sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {portfolio.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No portfolio projects found.</div>
            ) : (
              portfolio.map((proj) => (
                <div key={proj._id || proj.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-[#0284C7]">{proj.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.badge || 'Showcase'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">{proj.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{proj.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeletePortfolio(proj._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 shrink-0 self-start sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
