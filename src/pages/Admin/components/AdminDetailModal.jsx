import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building2, Calendar, Trash2, ShieldCheck, MessageSquare, Send } from 'lucide-react';

const formatDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

export default function AdminDetailModal({
  item,
  onClose,
  onUpdateStatus,
  onDelete
}) {
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [adminNote, setAdminNote] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item?.data) {
      setSelectedStatus(item.data.status || 'pending');
      setAdminNote(item.data.adminNote || '');
      setReplyMessage('');
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const { kind, data } = item;

  const renderField = (label, value, isMono = false) => (
    <div className="py-2.5 border-b border-slate-100 last:border-b-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
      <span className="text-xs font-medium text-slate-500 shrink-0">{label}</span>
      <span className={`text-xs font-semibold text-[#0F172A] sm:text-right break-words ${isMono ? 'font-mono tabular-nums' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );

  const statusOptionsByKind = {
    quote: ['draft', 'pending', 'in_process', 'fulfilled', 'completed', 'rejected', 'quoted', 'in_discussion', 'accepted', 'declined'],
    contact: ['draft', 'pending', 'in_process', 'fulfilled', 'completed', 'rejected', 'new', 'in_review', 'responded', 'archived'],
    enquiry: ['draft', 'pending', 'in_process', 'fulfilled', 'completed', 'rejected', 'new', 'contacted', 'closed']
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!onUpdateStatus || saving) return;
    setSaving(true);
    try {
      await onUpdateStatus(kind, data._id, {
        status: selectedStatus,
        adminNote: adminNote.trim(),
        replyMessage: replyMessage.trim()
      });
      setReplyMessage('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-detail-heading"
        className="relative z-10 w-full max-w-xl h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0284C7] block">
              {kind === 'quote' && 'Quote Request Details'}
              {kind === 'contact' && 'Contact Message Details'}
              {kind === 'enquiry' && 'Plan Enquiry Details'}
              {kind === 'user' && 'User Profile & Form History'}
            </span>
            <h2 id="admin-detail-heading" className="text-lg font-bold text-[#0F172A] truncate mt-0.5">
              {data.fullName || data.email}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            aria-label="Close detail view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Primary Contact Info */}
          <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2 text-slate-700">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span className="font-medium break-all">{data.email}</span>
              </div>
              {(data.emailVerified || data.googleVerified) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  {data.googleVerified ? 'Google Verified' : 'Inbox Verified'}
                </span>
              )}
            </div>
            {(data.registeredPhone || data.phone) && (
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span className="font-mono tabular-nums">{data.registeredPhone || data.phone}</span>
              </div>
            )}
            {data.companyName && (
              <div className="flex items-center gap-2 text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span>{data.companyName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="tabular-nums">
                {formatDateTime(data.createdAt || data.latestActivityAt)}
              </span>
            </div>
          </div>

          {/* Quote Fields */}
          {kind === 'quote' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-1 bg-white">
                {renderField('Reference ID', data._id, true)}
                {renderField('Project Type', data.projectType)}
                {renderField('Selected Plan', data.selectedPricingPlan)}
                {renderField('Pricing Category', data.pricingCategory)}
                {renderField('Budget Range', data.budgetRange)}
                {renderField('Expected Timeline', data.expectedTimeline)}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Project Specifications</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {data.projectDescription || 'No description provided.'}
                </div>
              </div>
            </div>
          )}

          {/* Contact Message Fields */}
          {kind === 'contact' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-1 bg-white">
                {renderField('Reference ID', data._id, true)}
                {renderField('Service Required', data.serviceRequired)}
                {renderField('IP Address', data.ipAddress, true)}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Message Content</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {data.message || 'No message body.'}
                </div>
              </div>
            </div>
          )}

          {/* Plan Enquiry Fields */}
          {kind === 'enquiry' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-1 bg-white">
                {renderField('Reference ID', data._id, true)}
                {renderField('Plan Name', data.planName)}
                {renderField('Plan ID', data.planId, true)}
                {renderField('Category', data.category)}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Enquiry Message</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {data.message || 'No additional notes provided.'}
                </div>
              </div>
            </div>
          )}

          {/* Unified User Directory History */}
          {kind === 'user' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-1 bg-white">
                {renderField(
                  'Account Verification',
                  data.googleVerified
                    ? 'Google Account Verified'
                    : data.emailVerified
                    ? 'Email Inbox Verified'
                    : 'Form Visitor'
                )}
                {renderField('Registered Mobile', data.registeredPhone || data.phone, true)}
                {renderField('Registered On', formatDateTime(data.registeredAt))}
                {renderField('Last Sign-In', formatDateTime(data.lastLoginAt))}
                {renderField('Portal Bookmarks', data.savedItemsCount ?? 0, true)}
                {renderField('Total Forms Submitted', data.totalSubmissions, true)}
                {renderField('Quote Requests', data.quotesCount, true)}
                {renderField('Contact Messages', data.contactsCount, true)}
                {renderField('Plan Enquiries', data.enquiriesCount, true)}
                {renderField('Newsletter Status', data.isNewsletterSubscribed ? 'Subscribed' : 'Not Subscribed')}
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-700 block">All Submitted Forms</span>
                {(!data.submissions || data.submissions.length === 0) ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                    Registered user has not submitted any forms yet.
                  </div>
                ) : (
                  data.submissions.map((sub, idx) => (
                    <div
                      key={`${sub.id}-${idx}`}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-[#0284C7]">{sub.type}</span>
                        <span className="text-slate-500 font-mono tabular-nums text-[11px]">
                          {formatDateTime(sub.createdAt)}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#0F172A]">
                        {sub.subject}
                      </div>
                      {(sub.record?.projectDescription || sub.record?.message) && (
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pt-1 border-t border-slate-100">
                          {sub.record.projectDescription || sub.record.message}
                        </p>
                      )}
                      <div className="text-[11px] text-slate-500">
                        Status: <span className="font-semibold text-slate-800 capitalize">{String(sub.status || '').replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Client & Admin Conversation Thread */}
          {kind !== 'user' && Array.isArray(data.replies) && data.replies.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <MessageSquare className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Client Portal Thread ({data.replies.length})</span>
              </div>
              <div className="space-y-2">
                {data.replies.map((rep, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs ${
                      rep.sender === 'admin'
                        ? 'bg-sky-50/70 border-sky-200 text-[#0F172A]'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
                      <span className="font-bold">
                        {rep.sender === 'admin' ? (rep.senderName || 'DNSV Admin Team') : (rep.senderName || 'Client')}
                      </span>
                      <span className="font-mono tabular-nums text-slate-500">
                        {formatDateTime(rep.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update, Admin Note & Reply Controls */}
          {statusOptionsByKind[kind] && onUpdateStatus && (
            <form onSubmit={handleSaveUpdate} className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label htmlFor="detail-status-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Workflow Status
                </label>
                <select
                  id="detail-status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                >
                  {statusOptionsByKind[kind].map((st) => (
                    <option key={st} value={st}>
                      {st.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="detail-admin-note" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Note Visible to Client in Portal
                </label>
                <textarea
                  id="detail-admin-note"
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Optional milestone note or rejection reason visible on client status card..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label htmlFor="detail-admin-reply" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Send Reply Message to Client Thread
                </label>
                <textarea
                  id="detail-admin-reply"
                  rows={2}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write an engineering update or follow-up response to appear in the client's portal thread..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving Workflow Update...' : 'Save Status, Note & Reply'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Action */}
        {kind !== 'user' && onDelete && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
            <span className="text-[11px] text-slate-500 font-mono truncate">ID: {data._id}</span>
            <button
              type="button"
              onClick={() => onDelete(kind, data._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

