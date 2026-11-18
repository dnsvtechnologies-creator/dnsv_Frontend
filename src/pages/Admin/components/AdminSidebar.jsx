import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  MessageSquare,
  Layers,
  Mail,
  BookOpen,
  Tag,
  Package,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import DNSVRoundedLogo from '../../../components/common/DNSVRoundedLogo.jsx';

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  counts = {},
  adminInfo = {},
  onLogout,
  mobileOpen,
  onCloseMobile
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'users', label: 'Users & Leads', icon: Users, count: counts.uniqueUsers ?? 0 },
    { id: 'quotes', label: 'Quote Requests', icon: FileSpreadsheet, count: counts.totalQuotes ?? 0 },
    { id: 'contacts', label: 'Contact Forms', icon: MessageSquare, count: counts.totalContacts ?? 0 },
    { id: 'enquiries', label: 'Plan Enquiries', icon: Layers, count: counts.totalEnquiries ?? 0 },
    { id: 'newsletter', label: 'Newsletter List', icon: Mail, count: counts.totalSubscribers ?? 0 },
    { id: 'pricing', label: 'Pricing Plans', icon: Tag, count: counts.totalPricingPlans ?? 0 },
    { id: 'products', label: 'Products Catalog', icon: Package, count: counts.totalProducts ?? 0 },
    { id: 'cms', label: 'Blog & Portfolio', icon: BookOpen, count: (counts.totalBlogs ?? 0) + (counts.totalPortfolio ?? 0) },
    { id: 'settings', label: 'Site Settings', icon: Settings, count: null }
  ];

  const handleSelect = (id) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-white/65 via-sky-50/45 to-cyan-100/35 backdrop-blur-2xl backdrop-saturate-150 border-r border-white/80 shadow-[8px_0_36px_rgba(2,132,199,0.12),inset_1px_0_0_rgba(255,255,255,0.9),inset_-1px_0_0_rgba(0,210,255,0.22)]">
      {/* Subtle glass-water refractive surface sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.75)_0%,rgba(0,210,255,0.08)_42%,rgba(37,99,235,0.05)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 w-48 h-48 rounded-full bg-[#00D2FF]/15 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 -left-16 w-44 h-44 rounded-full bg-[#2563EB]/12 blur-2xl"
      />

      {/* Top Zone: Brand + Navigation */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-900/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <DNSVRoundedLogo className="w-10 h-10 shrink-0 drop-shadow-[0_2px_10px_rgba(0,210,255,0.35)]" />
            <div className="flex flex-col leading-tight min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-base tracking-tight text-[#0F172A]">DNSV</span>
                <span className="font-bold text-[#0284C7] text-[10px] tracking-widest uppercase">Admin</span>
              </div>
              <span className="text-[11px] text-slate-600 truncate">Control Console</span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#0F172A] hover:bg-white/60 transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-white/85 text-[#0284C7] shadow-sm shadow-sky-500/15 border border-white ring-1 ring-[#00D2FF]/35'
                    : 'text-slate-700 hover:bg-white/55 hover:text-[#0F172A] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0284C7]' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.count !== null && (
                  <span className={`font-mono tabular-nums text-[11px] ${isActive ? 'text-[#0284C7] font-bold' : 'text-slate-500'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Zone: Admin Identity + Logout (Sidebar Only) */}
      <div className="relative z-10 p-4 border-t border-slate-900/10 bg-white/35 backdrop-blur-md space-y-3">

        <div className="px-2 py-1">
          <div className="text-xs font-bold text-[#0F172A] truncate">
            {adminInfo.name || 'DNSV Administrator'}
          </div>
          <div className="text-[11px] text-slate-600 truncate">
            {adminInfo.id || 'admin@dnsvtechnologies.com'}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-red-600 hover:to-red-700 shadow-sm transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Glass-Water Sidebar */}
      <aside className="hidden lg:block w-[272px] shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Glass-Water Sidebar Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-[272px] max-w-[85vw] h-full z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
