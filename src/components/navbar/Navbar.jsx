import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, UserCheck, LogIn } from 'lucide-react';
import DNSVRoundedLogo from '../common/DNSVRoundedLogo.jsx';
import { NAV_LINKS } from '../../constants/brand.js';
import { INITIAL_PRODUCTS } from '../../constants/productSeedData.js';
import { INITIAL_SERVICES } from '../../constants/serviceSeedData.js';
import { apiService } from '../../services/api.js';
import { useUserAuth } from '../../context/UserAuthContext.jsx';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [servicesList, setServicesList] = useState(INITIAL_SERVICES);
  const location = useLocation();
  const { user, isAuthenticated, openLoginBox } = useUserAuth();

  useEffect(() => {
    let active = true;
    const syncCatalog = () => {
      apiService
        .getProducts()
        .then((res) => {
          if (active && Array.isArray(res?.data)) {
            setProductsList(res.data);
          }
        })
        .catch(() => {});

      apiService
        .getServices()
        .then((res) => {
          if (active && Array.isArray(res?.data)) {
            setServicesList(res.data);
          }
        })
        .catch(() => {});
    };

    syncCatalog();
    window.addEventListener('dnsv:catalog-updated', syncCatalog);
    return () => {
      active = false;
      window.removeEventListener('dnsv:catalog-updated', syncCatalog);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setServicesDropdown(false);
        setProductsDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setProductsDropdown(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 py-3 shadow-sm shadow-blue-500/5'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo Zone */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <DNSVRoundedLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200 drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]" />
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-lg tracking-tight text-[#0F172A]">
                  DNSV
                </span>
                <span className="font-bold text-[#0284C7] text-[11px] tracking-widest uppercase">Tech</span>
              </div>
              <span className="text-[9px] tracking-wider uppercase font-semibold hidden sm:inline text-slate-500">
                Digital Nexus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors whitespace-nowrap ${
                isActive('/')
                  ? 'text-[#0284C7] font-bold'
                  : 'text-slate-700 hover:text-[#0284C7]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`transition-colors whitespace-nowrap ${
                isActive('/about')
                  ? 'text-[#0284C7] font-bold'
                  : 'text-slate-700 hover:text-[#0284C7]'
              }`}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <Link
                to="/services"
                aria-expanded={servicesDropdown}
                aria-haspopup="true"
                onFocus={() => setServicesDropdown(true)}
                className={`flex items-center gap-1 transition-colors whitespace-nowrap ${
                  isActive('/services')
                    ? 'text-[#0284C7] font-bold'
                    : 'text-slate-700 hover:text-[#0284C7]'
                }`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-[#0284C7]' : ''}`} />
              </Link>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-72 rounded-xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 border bg-white/95 border-slate-200 text-[#0F172A]">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#0284C7] px-3 py-1.5 border-b border-sky-500/20 mb-1">
                    IT Solutions & Services
                  </div>
                  {servicesList.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      No active services listed.
                    </div>
                  ) : (
                    servicesList.map((svc) => (
                      <Link
                        key={svc.slug}
                        to={`/services/${svc.slug}`}
                        className="block px-3 py-2 rounded-lg text-xs transition-colors hover:bg-sky-50 text-slate-800"
                      >
                        <div className="font-semibold">{svc.title}</div>
                        <div className="text-[11px] mt-0.5 text-slate-500 truncate">
                          {svc.dropdownDesc || svc.category || svc.summary}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Products Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setProductsDropdown(true)}
              onMouseLeave={() => setProductsDropdown(false)}
            >
              <Link
                to="/products"
                aria-expanded={productsDropdown}
                aria-haspopup="true"
                onFocus={() => setProductsDropdown(true)}
                className={`flex items-center gap-1 transition-colors whitespace-nowrap ${
                  isActive('/products')
                    ? 'text-[#0284C7] font-bold'
                    : 'text-slate-700 hover:text-[#0284C7]'
                }`}
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsDropdown ? 'rotate-180 text-[#0284C7]' : ''}`} />
              </Link>

              {productsDropdown && (
                <div className="absolute top-full left-0 w-64 rounded-xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 border bg-white/95 border-slate-200 text-[#0F172A]">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#0284C7] px-3 py-1.5 border-b border-sky-500/20 mb-1">
                    Proprietary SaaS
                  </div>
                  {productsList.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      No active products listed.
                    </div>
                  ) : (
                    productsList.map((prod) => {
                      const isLive =
                        prod.isHighlighted ||
                        String(prod.statusBadge || '').toLowerCase().includes('live');
                      return (
                        <Link
                          key={prod.slug}
                          to={`/products/${prod.slug}`}
                          className="block px-3 py-2 rounded-lg text-xs transition-colors hover:bg-sky-50 text-slate-800"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold truncate">{prod.name}</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono shrink-0 ${
                                isLive
                                  ? 'text-[#0284C7] border border-[#0284C7]/40 font-bold'
                                  : 'opacity-60'
                              }`}
                            >
                              {prod.statusBadge || 'SaaS'}
                            </span>
                          </div>
                          <div className="text-[11px] mt-0.5 text-slate-500 truncate">
                            {prod.categoryLabel || prod.tagline}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              className={`transition-colors whitespace-nowrap ${
                isActive('/pricing')
                  ? 'text-[#0284C7] font-bold'
                  : 'text-slate-700 hover:text-[#0284C7]'
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/careers"
              className={`transition-colors whitespace-nowrap ${
                isActive('/careers')
                  ? 'text-[#0284C7] font-bold'
                  : 'text-slate-700 hover:text-[#0284C7]'
              }`}
            >
              Careers
            </Link>

            <Link
              to="/contact"
              className={`transition-colors whitespace-nowrap ${
                isActive('/contact')
                  ? 'text-[#0284C7] font-bold'
                  : 'text-slate-700 hover:text-[#0284C7]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action Zone: Client Auth / Portal & Get a Quote CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAuthenticated ? (
              <Link
                to="/portal"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0284C7] bg-white/90 hover:bg-sky-50 border border-sky-200 rounded-lg transition-all shadow-sm whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline max-w-[110px] truncate">{user?.fullName?.split(' ')[0] || 'Portal'}</span>
                <span className="sm:hidden">Portal</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openLoginBox('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0F172A] bg-white/90 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-200 rounded-lg transition-all shadow-sm whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Login/Register</span>
              </button>
            )}

            <Link
              to="/request-quote"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:from-[#0EA5E9] hover:to-[#2563EB] rounded-lg transition-all shadow-md shadow-sky-500/25 active:scale-95 whitespace-nowrap"
            >
              Get a Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg transition-colors border bg-white text-[#0F172A] border-slate-200 hover:text-[#0284C7]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] border-b px-6 py-6 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-4 duration-200 bg-[#F7F7F2]/98 backdrop-blur-xl border-[#17213A]/15 text-[#111111]">
          <div className="flex flex-col gap-3 text-sm">
            <Link
              to="/"
              className={`py-2 px-3 rounded-lg ${
                isActive('/')
                  ? 'bg-[#2563EB] text-[#F7F7F2] font-bold'
                  : 'text-[#111111] hover:bg-[#FFFFFF]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`py-2 px-3 rounded-lg ${
                isActive('/about')
                  ? 'bg-[#2563EB] text-[#F7F7F2] font-bold'
                  : 'text-[#111111] hover:bg-[#FFFFFF]'
              }`}
            >
              About DNSV
            </Link>
            
            {/* Mobile Services */}
            <div className="py-2.5 px-3 rounded-lg border bg-[#FFFFFF] border-[#17213A]/15">
              <Link to="/services" className="font-bold text-[#2563EB] block mb-2">
                Services
              </Link>
              <div className="flex flex-col gap-2 pl-2 text-xs">
                {servicesList.map((svc) => (
                  <Link
                    key={svc.slug}
                    to={`/services/${svc.slug}`}
                    className="hover:text-[#2563EB]"
                  >
                    {svc.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Products */}
            <div className="py-2.5 px-3 rounded-lg border bg-[#FFFFFF] border-[#17213A]/15">
              <Link to="/products" className="font-bold text-[#2563EB] block mb-2">
                Products
              </Link>
              <div className="flex flex-col gap-2 pl-2 text-xs">
                {productsList.map((prod) => {
                  const isLive =
                    prod.isHighlighted ||
                    String(prod.statusBadge || '').toLowerCase().includes('live');
                  return (
                    <Link
                      key={prod.slug}
                      to={`/products/${prod.slug}`}
                      className="hover:text-[#2563EB] flex items-center justify-between"
                    >
                      <span>{prod.name}</span>
                      <span
                        className={`text-[10px] ${
                          isLive ? 'text-[#2563EB] font-bold' : 'opacity-60'
                        }`}
                      >
                        {prod.statusBadge || 'SaaS'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              to="/pricing"
              className={`py-2 px-3 rounded-lg ${
                isActive('/pricing')
                  ? 'bg-[#2563EB] text-[#F7F7F2] font-bold'
                  : 'text-[#111111] hover:bg-[#FFFFFF]'
              }`}
            >
              Pricing Plans
            </Link>
            <Link
              to="/faq"
              className={`py-2 px-3 rounded-lg ${
                isActive('/faq')
                  ? 'bg-[#2563EB] text-[#F7F7F2] font-bold'
                  : 'text-[#111111] hover:bg-[#FFFFFF]'
              }`}
            >
              Frequently Asked Questions
            </Link>
            <Link
              to="/careers"
              className={`py-2 px-3 rounded-lg ${
                isActive('/careers')
                  ? 'bg-[#2563EB] text-[#F7F7F2] font-bold'
                  : 'text-[#111111] hover:bg-[#FFFFFF]'
              }`}
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className={`py-2 px-3 rounded-lg ${
                isActive('/contact')
                  ? 'bg-[#2563EB] text-[#F7F7F2] font-bold'
                  : 'text-[#111111] hover:bg-[#FFFFFF]'
              }`}
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t border-[#17213A]/20 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/portal"
                  className="w-full text-center py-2.5 px-4 bg-white border border-sky-200 text-[#0284C7] font-bold text-xs rounded-lg shadow-sm"
                >
                  Open My Client Portal ({user?.fullName?.split(' ')[0]})
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginBox('login');
                  }}
                  className="w-full text-center py-2.5 px-4 bg-white border border-slate-300 text-[#0F172A] font-bold text-xs rounded-lg shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Login/Register</span>
                </button>
              )}

              <Link
                to="/request-quote"
                className="w-full text-center py-2.5 px-4 bg-[#2563EB] text-[#F7F7F2] font-semibold text-xs rounded-lg shadow-md hover:bg-[#2563EB]/90"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
