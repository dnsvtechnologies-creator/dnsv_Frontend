import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Menu,
  Download,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Inbox,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../../services/api.js';
import AnimatedLogoBackground from '../../components/common/AnimatedLogoBackground.jsx';
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/MotionComponents.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';
import AdminLoginView from './components/AdminLoginView.jsx';
import AdminDetailModal from './components/AdminDetailModal.jsx';
import { AdminSettingsPanel } from './components/AdminCmsAndSettings.jsx';
import AdminPricingPanel from './components/AdminPricingPanel.jsx';
import AdminProductsPanel from './components/AdminProductsPanel.jsx';
import AdminServicesPanel from './components/AdminServicesPanel.jsx';
import AdminCareersPanel from './components/AdminCareersPanel.jsx';

const TAB_TITLES = {
  overview: 'Overview',
  users: 'Users & Leads Directory',
  quotes: 'Quote Requests',
  contacts: 'Contact Form Submissions',
  enquiries: 'Plan Enquiries',
  newsletter: 'Newsletter Subscribers',
  pricing: 'Pricing Plans Management',
  products: 'Products Catalog Management',
  services: 'Services Catalog Management',
  careers: 'Careers & Hiring Management',
  settings: 'Site Settings'
};

const STATUS_TEXT_CLASS = {
  draft: 'text-slate-600',
  pending: 'text-amber-700',
  in_process: 'text-[#0284C7]',
  fulfilled: 'text-[#2563EB]',
  completed: 'text-emerald-700',
  rejected: 'text-red-700',
  new: 'text-[#0284C7]',
  in_review: 'text-amber-700',
  in_discussion: 'text-[#2563EB]',
  quoted: 'text-[#2563EB]',
  contacted: 'text-[#2563EB]',
  responded: 'text-emerald-700',
  accepted: 'text-emerald-700',
  active: 'text-emerald-700',
  closed: 'text-slate-600',
  archived: 'text-slate-500',
  inactive: 'text-slate-500',
  declined: 'text-red-700'
};

const formatDateShort = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const escapeCsv = (val) => {
  const s = String(val ?? '');
  return `"${s.replace(/"/g, '""')}"`;
};

export default function AdminPage() {
  const [authChecking, setAuthChecking] = useState(true);
  const [adminSession, setAdminSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoadingData(true);
    setErrorMsg('');
    try {
      const res = await apiService.getAdminDashboard();
      setDashboard(res.data);
    } catch (err) {
      if (err.message?.toLowerCase().includes('unauthorized')) {
        apiService.setAdminToken('');
        setAdminSession(null);
      } else {
        setErrorMsg(err.message || 'Failed to load admin data.');
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const verifyExistingSession = async () => {
      const token = apiService.getAdminToken();
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const res = await apiService.getAdminSession();
        setAdminSession(res.data.admin);
      } catch {
        apiService.setAdminToken('');
        setAdminSession(null);
      } finally {
        setAuthChecking(false);
      }
    };

    verifyExistingSession();
  }, []);

  useEffect(() => {
    let robotsTag = document.head.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', 'noindex, nofollow');

    if (!adminSession) {
      document.title = 'Admin Login — DNSV Technologies';
    } else {
      document.title = `${TAB_TITLES[activeTab] || 'Console'} — DNSV Admin Console`;
    }
  }, [adminSession, activeTab]);

  useEffect(() => {
    if (adminSession) {
      loadDashboard();
    }
  }, [adminSession, loadDashboard]);

  // Reset search & status filter when switching tabs
  useEffect(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, [activeTab]);

  const handleLoginSuccess = (sessionData) => {
    apiService.setAdminToken(sessionData.token);
    setAdminSession(sessionData.admin);
  };

  const handleLogout = () => {
    apiService.setAdminToken('');
    setAdminSession(null);
    setDashboard(null);
    setSelectedDetail(null);
  };

  const handleUpdateStatus = async (kind, id, statusOrPayload) => {
    try {
      let res = null;
      if (kind === 'quote') res = await apiService.updateAdminQuoteStatus(id, statusOrPayload);
      if (kind === 'contact') res = await apiService.updateAdminContactStatus(id, statusOrPayload);
      if (kind === 'enquiry') res = await apiService.updateAdminEnquiryStatus(id, statusOrPayload);

      const updatedRecord = res?.data;
      setSelectedDetail((prev) => {
        if (!prev || prev.data?._id !== id) return prev;
        if (updatedRecord) return { ...prev, data: updatedRecord };
        const fallbackPatch =
          typeof statusOrPayload === 'string' ? { status: statusOrPayload } : statusOrPayload;
        return { ...prev, data: { ...prev.data, ...fallbackPatch } };
      });
      await loadDashboard();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteRecord = async (kind, id) => {
    try {
      if (kind === 'quote') await apiService.deleteAdminQuote(id);
      if (kind === 'contact') await apiService.deleteAdminContact(id);
      if (kind === 'enquiry') await apiService.deleteAdminEnquiry(id);
      if (kind === 'subscriber') await apiService.deleteAdminSubscriber(id);

      if (selectedDetail?.data?._id === id) {
        setSelectedDetail(null);
      }
      await loadDashboard();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete record.');
    }
  };

  const handleToggleSubscriber = async (id) => {
    try {
      await apiService.toggleAdminSubscriber(id);
      await loadDashboard();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to toggle subscriber status.');
    }
  };

  const filteredQuotes = useMemo(() => {
    const items = dashboard?.quotes || [];
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesQuery =
        !q ||
        item.fullName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.companyName?.toLowerCase().includes(q) ||
        item.projectType?.toLowerCase().includes(q) ||
        item.selectedPricingPlan?.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [dashboard, searchQuery, statusFilter]);

  const filteredContacts = useMemo(() => {
    const items = dashboard?.contacts || [];
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesQuery =
        !q ||
        item.fullName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.companyName?.toLowerCase().includes(q) ||
        item.serviceRequired?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [dashboard, searchQuery, statusFilter]);

  const filteredEnquiries = useMemo(() => {
    const items = dashboard?.enquiries || [];
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesQuery =
        !q ||
        item.fullName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.planName?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [dashboard, searchQuery, statusFilter]);

  const filteredSubscribers = useMemo(() => {
    const items = dashboard?.subscribers || [];
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const isAct = item.isActive !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isAct) ||
        (statusFilter === 'inactive' && !isAct);
      const matchesQuery = !q || item.email?.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [dashboard, searchQuery, statusFilter]);

  const filteredUsers = useMemo(() => {
    const items = dashboard?.directory || [];
    const q = searchQuery.trim().toLowerCase();
    return items.filter(
      (u) =>
        !q ||
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.companyName?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }, [dashboard, searchQuery]);

  const handleExportCsv = () => {
    if (!dashboard) return;
    let headers = [];
    let rows = [];
    let filename = `dnsv-admin-${activeTab}.csv`;

    if (activeTab === 'quotes') {
      headers = ['ReferenceID', 'FullName', 'Email', 'Phone', 'Company', 'ProjectType', 'Plan', 'Budget', 'Timeline', 'Status', 'CreatedAt', 'Description'];
      rows = filteredQuotes.map((q) => [
        q._id, q.fullName, q.email, q.phone, q.companyName, q.projectType, q.selectedPricingPlan, q.budgetRange, q.expectedTimeline, q.status, q.createdAt, q.projectDescription
      ]);
    } else if (activeTab === 'contacts') {
      headers = ['ReferenceID', 'FullName', 'Email', 'Phone', 'Company', 'ServiceRequired', 'Status', 'CreatedAt', 'Message'];
      rows = filteredContacts.map((c) => [
        c._id, c.fullName, c.email, c.phone, c.companyName, c.serviceRequired, c.status, c.createdAt, c.message
      ]);
    } else if (activeTab === 'enquiries') {
      headers = ['ReferenceID', 'FullName', 'Email', 'Phone', 'PlanName', 'Category', 'Status', 'CreatedAt', 'Message'];
      rows = filteredEnquiries.map((e) => [
        e._id, e.fullName, e.email, e.phone, e.planName, e.category, e.status, e.createdAt, e.message
      ]);
    } else if (activeTab === 'newsletter') {
      headers = ['ID', 'Email', 'Source', 'Active', 'SubscribedAt'];
      rows = filteredSubscribers.map((s) => [s._id, s.email, s.source || 'website_footer', s.isActive !== false, s.createdAt]);
    } else {
      filename = 'dnsv-admin-all-users-leads.csv';
      headers = ['FullName', 'Email', 'Phone', 'Company', 'FormsSubmitted', 'Quotes', 'Contacts', 'Enquiries', 'Newsletter', 'LatestActivity'];
      rows = (dashboard.directory || []).map((u) => [
        u.fullName,
        u.email,
        u.phone,
        u.companyName,
        u.totalSubmissions,
        u.quotesCount,
        u.contactsCount,
        u.enquiriesCount,
        u.isNewsletterSubscribed ? 'Subscribed' : 'No',
        u.latestActivityAt
      ]);
    }

    const csv = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen relative flex items-center justify-center text-[#0F172A]">
        <AnimatedLogoBackground />
        <div className="relative z-10 text-sm font-medium text-slate-600">
          Verifying admin session...
        </div>
      </div>
    );
  }

  if (!adminSession) {
    return (
      <AdminLoginView
        onLoginSuccess={handleLoginSuccess}
        loginFn={(creds) => apiService.adminLogin(creds)}
      />
    );
  }

  const summary = dashboard?.summary || {};
  const dbInfo = dashboard?.database || {};

  const renderEmptyState = (title, description) => (
    <div className="bg-white/95 rounded-2xl border border-slate-200 p-10 text-center space-y-3">
      <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto text-[#0284C7]">
        <Inbox className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen relative flex text-[#0F172A] font-sans">

      {/* Client-side Matching Animated Light Logo Background */}
      <AnimatedLogoBackground />

      {/* Glass-Water Effect Sidebar with Blur Background (Logout button resides ONLY here) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={summary}
        adminInfo={adminSession}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        {/* Top Header Bar (Breadcrumbs + Export only; Logout stays strictly inside sidebar) */}
        <header className="sticky top-0 z-20 bg-white/75 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0284C7]"
                aria-label="Open sidebar navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
                <span className="font-semibold text-slate-500">DNSV Admin</span>
                <span className="text-slate-400" aria-hidden="true">/</span>
                <h1 className="font-bold text-[#0F172A] truncate">{TAB_TITLES[activeTab]}</h1>
              </div>
            </div>

            {['overview', 'users', 'quotes', 'contacts', 'enquiries', 'newsletter'].includes(activeTab) && (
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 shadow-sm whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto space-y-6">
          {errorMsg && (
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                className="font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StaggerItem>
                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    className="w-full text-left p-5 rounded-2xl bg-white/95 border border-slate-200 hover:border-[#0284C7]/50 transition-all space-y-1.5"
                  >
                    <span className="text-xs font-medium text-slate-500 block">Unique Users & Leads</span>
                    <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums">
                      {summary.uniqueUsers ?? 0}
                    </div>
                    <span className="text-xs text-[#0284C7] font-semibold block tabular-nums">
                      {summary.totalRegisteredUsers ?? 0} verified accounts · {summary.totalFormSubmissions ?? 0} submissions
                    </span>
                  </button>
                </StaggerItem>

                <StaggerItem>
                  <button
                    type="button"
                    onClick={() => setActiveTab('quotes')}
                    className="w-full text-left p-5 rounded-2xl bg-white/95 border border-slate-200 hover:border-[#0284C7]/50 transition-all space-y-1.5"
                  >
                    <span className="text-xs font-medium text-slate-500 block">Quote Requests</span>
                    <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums">
                      {summary.totalQuotes ?? 0}
                    </div>
                    <span className="text-xs text-amber-700 font-semibold block tabular-nums">
                      {summary.pendingQuotes ?? 0} pending review
                    </span>
                  </button>
                </StaggerItem>

                <StaggerItem>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contacts')}
                    className="w-full text-left p-5 rounded-2xl bg-white/95 border border-slate-200 hover:border-[#0284C7]/50 transition-all space-y-1.5"
                  >
                    <span className="text-xs font-medium text-slate-500 block">Contact Messages</span>
                    <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums">
                      {summary.totalContacts ?? 0}
                    </div>
                    <span className="text-xs text-[#0284C7] font-semibold block tabular-nums">
                      {summary.newContacts ?? 0} unread messages
                    </span>
                  </button>
                </StaggerItem>

                <StaggerItem>
                  <button
                    type="button"
                    onClick={() => setActiveTab('newsletter')}
                    className="w-full text-left p-5 rounded-2xl bg-white/95 border border-slate-200 hover:border-[#0284C7]/50 transition-all space-y-1.5"
                  >
                    <span className="text-xs font-medium text-slate-500 block">Newsletter & Enquiries</span>
                    <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums">
                      {(summary.totalSubscribers ?? 0) + (summary.totalEnquiries ?? 0)}
                    </div>
                    <span className="text-xs text-slate-600 font-medium block tabular-nums">
                      {summary.activeSubscribers ?? 0} subscribers · {summary.totalEnquiries ?? 0} plan enquiries
                    </span>
                  </button>
                </StaggerItem>
              </StaggerContainer>

              {/* Recent Submissions Table + Content Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <FadeIn className="lg:col-span-8 bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-bold text-[#0F172A]">Recent Form Submissions</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live feed across Request Quote, Contact, Plan Enquiry, and Newsletter forms.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('users')}
                      className="text-xs font-semibold text-[#0284C7] hover:underline whitespace-nowrap"
                    >
                      View All Users
                    </button>
                  </div>

                  {!dashboard?.recentActivity?.length ? (
                    <div className="p-10 text-center">
                      <p className="text-xs text-slate-600">
                        No user forms have been submitted yet. Any new Quote Request, Contact Message, Plan Enquiry, or Newsletter Subscription will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-5">User</th>
                            <th className="py-3 px-4">Form Type</th>
                            <th className="py-3 px-4">Summary</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-5 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {dashboard.recentActivity.map((act) => (
                            <tr
                              key={act.id}
                              onClick={() => {
                                if (act.section === 'quotes') setSelectedDetail({ kind: 'quote', data: act.record });
                                else if (act.section === 'contacts') setSelectedDetail({ kind: 'contact', data: act.record });
                                else if (act.section === 'enquiries') setSelectedDetail({ kind: 'enquiry', data: act.record });
                                else setActiveTab('newsletter');
                              }}
                              className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                            >
                              <td className="py-3 px-5">
                                <div className="font-semibold text-[#0F172A]">{act.name}</div>
                                <div className="text-[11px] text-slate-500">{act.email}</div>
                              </td>
                              <td className="py-3 px-4 font-medium text-[#0284C7] whitespace-nowrap">{act.type}</td>
                              <td className="py-3 px-4 text-slate-700 max-w-[220px] truncate">{act.summary}</td>
                              <td className={`py-3 px-4 font-semibold capitalize whitespace-nowrap ${STATUS_TEXT_CLASS[act.status] || 'text-slate-700'}`}>
                                {String(act.status || '').replace('_', ' ')}
                              </td>
                              <td className="py-3 px-5 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                                {formatDateShort(act.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </FadeIn>

                {/* System & Content Summary Column */}
                <FadeIn delay={0.08} className="lg:col-span-4 space-y-4">
                  <div className="p-6 rounded-2xl bg-white/95 border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-[#0F172A]">Platform & Content Summary</h3>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-600">Storage Backend</span>
                        <span className="font-semibold text-[#0F172A]">{dbInfo.mode || 'In-Memory Resilient Store'}</span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-600">Published Catalog &amp; Plans</span>
                        <span className="font-mono tabular-nums font-bold text-[#0F172A]">
                          {summary.totalServices ?? 0} services · {summary.totalProducts ?? 0} products · {summary.totalPricingPlans ?? 0} plans
                        </span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-600">Careers &amp; Applications</span>
                        <span className="font-mono tabular-nums font-bold text-[#0F172A]">
                          {summary.openCareerJobs ?? 0} open roles · {summary.totalCareerApplications ?? 0} candidates
                        </span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-slate-600">Primary Business Email</span>
                        <span className="font-medium text-[#0284C7] truncate max-w-[175px]">
                          {dashboard?.siteSettings?.contact?.email || dashboard?.siteSettings?.email || 'contact@dnsvtechnologies.com'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('pricing')}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition-colors"
                      >
                        Manage Pricing
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition-colors"
                      >
                        Manage Products
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('services')}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition-colors"
                      >
                        Manage Services
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('careers')}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition-colors"
                      >
                        Manage Careers
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className="col-span-2 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition-colors"
                      >
                        Edit Site Settings
                      </button>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          )}

          {/* SEARCH & FILTER BAR FOR DATA TABLES */}
          {['users', 'quotes', 'contacts', 'enquiries', 'newsletter'].includes(activeTab) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${TAB_TITLES[activeTab].toLowerCase()} by name, email, or details...`}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              {activeTab === 'quotes' && (
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100">
                  {['all', 'draft', 'pending', 'in_process', 'fulfilled', 'completed', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                        statusFilter === st ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100">
                  {['all', 'draft', 'pending', 'in_process', 'fulfilled', 'completed', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                        statusFilter === st ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'enquiries' && (
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100">
                  {['all', 'draft', 'pending', 'in_process', 'fulfilled', 'completed', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                        statusFilter === st ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'newsletter' && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
                  {['all', 'active', 'inactive'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                        statusFilter === st ? 'bg-white text-[#0284C7] shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS & LEADS DIRECTORY TAB */}
          {activeTab === 'users' && (
            filteredUsers.length === 0 ? (
              renderEmptyState(
                'No User Records Found',
                'Every visitor who fills out a Request Quote form, Contact form, Plan Enquiry, or subscribes to the Newsletter is automatically indexed here with their full submission history.'
              )
            ) : (
              <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">User / Contact</th>
                        <th className="py-3.5 px-4">Company & Phone</th>
                        <th className="py-3.5 px-4">Forms Submitted</th>
                        <th className="py-3.5 px-4 text-right">Count</th>
                        <th className="py-3.5 px-4 text-right">Latest Activity</th>
                        <th className="py-3.5 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredUsers.map((user) => (
                        <tr key={user.email} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#0F172A]">{user.fullName}</span>
                              {(user.emailVerified || user.googleVerified) && (
                                <ShieldCheck
                                  className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                                  title={user.googleVerified ? 'Google Verified Account' : 'Inbox Verified Account'}
                                />
                              )}
                            </div>
                            <div className="text-[11px] text-[#0284C7]">{user.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{user.companyName || '—'}</div>
                            <div className="text-[11px] font-mono tabular-nums text-slate-500">
                              {user.registeredPhone || user.phone || '—'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            {user.sources.join(' · ')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#0F172A]">
                            {user.totalSubmissions}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                            {formatDateShort(user.latestActivityAt)}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedDetail({ kind: 'user', data: user })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0284C7] hover:bg-sky-50 border border-sky-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View All</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* QUOTE REQUESTS TAB */}
          {activeTab === 'quotes' && (
            filteredQuotes.length === 0 ? (
              renderEmptyState(
                'No Quote Requests Yet',
                'Project quotation requests submitted by users will appear here with budget range, selected pricing plan, timeline, and full project specs.'
              )
            ) : (
              <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Client</th>
                        <th className="py-3.5 px-4">Project & Plan</th>
                        <th className="py-3.5 px-4">Budget & Timeline</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredQuotes.map((q) => (
                        <tr key={q._id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-[#0F172A]">{q.fullName}</div>
                            <div className="text-[11px] text-[#0284C7]">{q.email}</div>
                            <div className="text-[11px] font-mono tabular-nums text-slate-500">{q.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#0F172A]">{q.projectType}</div>
                            <div className="text-[11px] text-slate-500">{q.selectedPricingPlan || 'Custom Consultation'}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{q.budgetRange}</div>
                            <div className="text-[11px] text-slate-500">{q.expectedTimeline}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={q.status}
                              onChange={(e) => handleUpdateStatus('quote', q._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold capitalize ${STATUS_TEXT_CLASS[q.status] || 'text-slate-700'}`}
                            >
                              <option value="draft">Draft</option>
                              <option value="pending">Pending</option>
                              <option value="in_process">In Process</option>
                              <option value="fulfilled">Fulfilled</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                              <option value="quoted">Quoted</option>
                              <option value="in_discussion">In Discussion</option>
                              <option value="accepted">Accepted</option>
                              <option value="declined">Declined</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                            {formatDateShort(q.createdAt)}
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDetail({ kind: 'quote', data: q })}
                                className="p-2 rounded-lg text-[#0284C7] hover:bg-sky-50 border border-slate-200"
                                title="Inspect Quote Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord('quote', q._id)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
                                title="Delete Quote"
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
            )
          )}

          {/* CONTACT MESSAGES TAB */}
          {activeTab === 'contacts' && (
            filteredContacts.length === 0 ? (
              renderEmptyState(
                'No Contact Messages Yet',
                'Messages submitted via the Contact form will appear here with sender contact details, requested service, and full message text.'
              )
            ) : (
              <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Sender</th>
                        <th className="py-3.5 px-4">Service & Message</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredContacts.map((c) => (
                        <tr key={c._id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-[#0F172A]">{c.fullName}</div>
                            <div className="text-[11px] text-[#0284C7]">{c.email}</div>
                            {(c.phone || c.companyName) && (
                              <div className="text-[11px] text-slate-500">
                                {[c.companyName, c.phone].filter(Boolean).join(' · ')}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 max-w-md">
                            <div className="font-semibold text-[#0F172A]">{c.serviceRequired}</div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{c.message}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateStatus('contact', c._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold capitalize ${STATUS_TEXT_CLASS[c.status] || 'text-slate-700'}`}
                            >
                              <option value="draft">Draft</option>
                              <option value="pending">Pending</option>
                              <option value="in_process">In Process</option>
                              <option value="fulfilled">Fulfilled</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                              <option value="new">New</option>
                              <option value="in_review">In Review</option>
                              <option value="responded">Responded</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                            {formatDateShort(c.createdAt)}
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDetail({ kind: 'contact', data: c })}
                                className="p-2 rounded-lg text-[#0284C7] hover:bg-sky-50 border border-slate-200"
                                title="View Message Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord('contact', c._id)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
                                title="Delete Message"
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
            )
          )}

          {/* PLAN ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            filteredEnquiries.length === 0 ? (
              renderEmptyState(
                'No Plan Enquiries Yet',
                'Direct plan onboarding enquiries submitted by users will appear here.'
              )
            ) : (
              <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Lead</th>
                        <th className="py-3.5 px-4">Selected Plan</th>
                        <th className="py-3.5 px-4">Notes</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredEnquiries.map((enq) => (
                        <tr key={enq._id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-[#0F172A]">{enq.fullName}</div>
                            <div className="text-[11px] text-[#0284C7]">{enq.email}</div>
                            {enq.phone && <div className="text-[11px] font-mono tabular-nums text-slate-500">{enq.phone}</div>}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#0F172A]">{enq.planName || 'General Plan'}</div>
                            <div className="text-[11px] text-slate-500">{enq.category || '—'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{enq.message || '—'}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateStatus('enquiry', enq._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold capitalize ${STATUS_TEXT_CLASS[enq.status] || 'text-slate-700'}`}
                            >
                              <option value="draft">Draft</option>
                              <option value="pending">Pending</option>
                              <option value="in_process">In Process</option>
                              <option value="fulfilled">Fulfilled</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                            {formatDateShort(enq.createdAt)}
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDetail({ kind: 'enquiry', data: enq })}
                                aria-label={`Inspect enquiry from ${enq.fullName || enq.email}`}
                                title="Inspect Enquiry"
                                className="p-2 rounded-lg text-[#0284C7] hover:bg-sky-50 border border-slate-200"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord('enquiry', enq._id)}
                                aria-label={`Delete enquiry from ${enq.fullName || enq.email}`}
                                title="Delete Enquiry"
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
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
            )
          )}

          {/* NEWSLETTER SUBSCRIBERS TAB */}
          {activeTab === 'newsletter' && (
            filteredSubscribers.length === 0 ? (
              renderEmptyState(
                'No Newsletter Subscribers Yet',
                'Email addresses submitted through the newsletter signup form will appear here.'
              )
            ) : (
              <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Email Address</th>
                        <th className="py-3.5 px-4">Source</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Subscribed On</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredSubscribers.map((sub) => {
                        const isActive = sub.isActive !== false;
                        return (
                          <tr key={sub._id} className="hover:bg-sky-50/40 transition-colors">
                            <td className="py-3.5 px-5 font-semibold text-[#0F172A]">{sub.email}</td>
                            <td className="py-3.5 px-4 text-slate-600">{sub.source || 'website_footer'}</td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleSubscriber(sub._id)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                                  isActive
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isActive ? 'Active' : 'Paused'}</span>
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500">
                              {formatDateShort(sub.createdAt)}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord('subscriber', sub._id)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200"
                                title="Remove Subscriber"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* PRICING PLANS TAB */}
          {activeTab === 'pricing' && (
            <AdminPricingPanel
              pricingPlans={dashboard?.pricingPlans || []}
              onCreatePlan={async (payload) => {
                await apiService.createAdminPricingPlan(payload);
                await loadDashboard();
              }}
              onUpdatePlan={async (id, payload) => {
                await apiService.updateAdminPricingPlan(id, payload);
                await loadDashboard();
              }}
              onDeletePlan={async (id) => {
                await apiService.deleteAdminPricingPlan(id);
                await loadDashboard();
              }}
            />
          )}

          {/* PRODUCTS CATALOG TAB */}
          {activeTab === 'products' && (
            <AdminProductsPanel
              products={dashboard?.products || []}
              onCreateProduct={async (payload) => {
                await apiService.createAdminProduct(payload);
                await loadDashboard();
              }}
              onUpdateProduct={async (id, payload) => {
                await apiService.updateAdminProduct(id, payload);
                await loadDashboard();
              }}
              onDeleteProduct={async (id) => {
                await apiService.deleteAdminProduct(id);
                await loadDashboard();
              }}
            />
          )}

          {/* SERVICES CATALOG TAB */}
          {activeTab === 'services' && (
            <AdminServicesPanel
              services={dashboard?.services || []}
              servicePageConfig={dashboard?.servicePageConfig}
              onCreateService={async (payload) => {
                await apiService.createAdminService(payload);
                await loadDashboard();
              }}
              onUpdateService={async (id, payload) => {
                await apiService.updateAdminService(id, payload);
                await loadDashboard();
              }}
              onDeleteService={async (id) => {
                await apiService.deleteAdminService(id);
                await loadDashboard();
              }}
              onSavePageConfig={async (payload) => {
                await apiService.updateAdminServicePageConfig(payload);
                await loadDashboard();
              }}
            />
          )}

          {/* CAREERS & HIRING TAB */}
          {activeTab === 'careers' && (
            <AdminCareersPanel
              jobs={dashboard?.careerJobs || []}
              careerConfig={dashboard?.careerConfig}
              applications={dashboard?.careerApplications || []}
              onCreateJob={async (payload) => {
                await apiService.createAdminCareerJob(payload);
                await loadDashboard();
              }}
              onUpdateJob={async (id, payload) => {
                await apiService.updateAdminCareerJob(id, payload);
                await loadDashboard();
              }}
              onDeleteJob={async (id) => {
                await apiService.deleteAdminCareerJob(id);
                await loadDashboard();
              }}
              onSaveConfig={async (payload) => {
                await apiService.updateAdminCareerConfig(payload);
                await loadDashboard();
              }}
              onUpdateApplication={async (id, payload) => {
                const res = await apiService.updateAdminCareerApplicationStatus(id, payload);
                await loadDashboard();
                return res;
              }}
              onDeleteApplication={async (id) => {
                await apiService.deleteAdminCareerApplication(id);
                await loadDashboard();
              }}
            />
          )}

          {/* SITE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <AdminSettingsPanel
              siteSettings={dashboard?.siteSettings}
              onSaveSettings={async (payload) => {
                await apiService.updateAdminSiteSettings(payload);
                await loadDashboard();
              }}
            />
          )}
        </main>
      </div>

      {/* Record Inspection Drawer */}
      <AdminDetailModal
        item={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
}
