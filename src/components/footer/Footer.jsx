import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import DNSVHorizontalLogo from '../common/DNSVHorizontalLogo.jsx';
import { BRAND } from '../../constants/brand.js';
import { INITIAL_PRODUCTS } from '../../constants/productSeedData.js';
import { apiService } from '../../services/api.js';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, success: false, message: '' });
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);

  useEffect(() => {
    let active = true;
    const syncProducts = () => {
      apiService
        .getProducts()
        .then((res) => {
          if (active && Array.isArray(res?.data)) {
            setProductsList(res.data);
          }
        })
        .catch(() => {});
    };

    syncProducts();
    window.addEventListener('dnsv:catalog-updated', syncProducts);
    return () => {
      active = false;
      window.removeEventListener('dnsv:catalog-updated', syncProducts);
    };
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus({ loading: false, success: false, message: 'Please enter a valid email address.' });
      return;
    }

    setNewsletterStatus({ loading: true, success: false, message: '' });
    try {
      const res = await apiService.subscribeNewsletter(newsletterEmail);
      setNewsletterStatus({ loading: false, success: true, message: res.message || 'Subscribed successfully!' });
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus({ loading: false, success: false, message: err.message || 'Subscription failed.' });
    }
  };

  return (
    <footer className="pt-16 pb-12 transition-colors border-t border-[#00D2FF]/20 bg-gradient-to-b from-[#090D1A] via-[#0C1222] to-[#060810] text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column (Col Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link to="/">
              <DNSVHorizontalLogo size="large" showTagline={true} />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              Connecting Ideas with Technology. DNSV Technologies (Digital Nexus for Software & Ventures) engineers custom digital platforms, scalable web applications, and Mailcurve email automation infrastructure for modern businesses.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00D2FF] block mb-2">
                Stay Updated with Technical Insights
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-md gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter business email"
                  aria-label="Email address for technical insights newsletter"
                  className="text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00D2FF] w-full border bg-[#11182B] border-slate-700/80 text-white placeholder-slate-400"
                  disabled={newsletterStatus.loading}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus.loading}
                  aria-label="Subscribe to technical insights newsletter"
                  className="bg-gradient-to-r from-[#0284C7] to-[#2563EB] hover:from-[#00D2FF] hover:to-[#2563EB] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-sky-500/20"
                >
                  {newsletterStatus.loading ? '...' : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              {newsletterStatus.message && (
                <div className={`flex items-center gap-1.5 text-xs mt-2 ${newsletterStatus.success ? 'text-[#00D2FF]' : 'text-red-400'}`}>
                  {newsletterStatus.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{newsletterStatus.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D2FF]">Company</h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-[#00D2FF] transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="hover:text-[#00D2FF] transition-colors">Pricing Packages</Link></li>
              <li><Link to="/faq" className="hover:text-[#00D2FF] transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-[#00D2FF] transition-colors">Contact Information</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D2FF]">Solutions</h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><Link to="/services/web-development" className="hover:text-[#00D2FF] transition-colors">Website Development</Link></li>
              <li><Link to="/services/custom-software" className="hover:text-[#00D2FF] transition-colors">Custom Software & CRM</Link></li>
              <li><Link to="/services/email-marketing" className="hover:text-[#00D2FF] transition-colors">Email Automation (Mautic)</Link></li>
              <li><Link to="/services/api-development" className="hover:text-[#00D2FF] transition-colors">API & Gateway Integration</Link></li>
              <li><Link to="/services/technical-support" className="hover:text-[#00D2FF] transition-colors">Maintenance & Retainers</Link></li>
            </ul>
          </div>

          {/* Column 4: Products & Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D2FF]">Products & Inquiries</h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              {productsList.map((prod) => {
                const isLive =
                  prod.isHighlighted ||
                  String(prod.statusBadge || '').toLowerCase().includes('live');
                return (
                  <li key={prod.slug}>
                    <Link
                      to={`/products/${prod.slug}`}
                      className="hover:text-[#00D2FF] transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{prod.name}</span>
                      <span
                        className={`text-[10px] font-mono shrink-0 ${
                          isLive
                            ? 'text-[#00D2FF] border border-[#00D2FF]/40 px-1 rounded font-bold'
                            : 'opacity-60'
                        }`}
                      >
                        {prod.statusBadge || 'SaaS'}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2 text-xs">
                <span className="block font-semibold text-white">Business Inquiries:</span>
                <span className="text-[#00D2FF] font-medium">{BRAND.contact.email}</span>
              </li>
              <li className="text-xs">
                <span className="block font-semibold text-white">Support Desk:</span>
                <span>{BRAND.contact.supportEmail}</span>
              </li>
              <li className="text-[11px] text-slate-400">
                {BRAND.contact.businessHours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} DNSV Technologies (Digital Nexus for Software & Ventures). All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#00D2FF] transition-colors">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[#00D2FF] transition-colors">Terms of Service</Link>
            <span aria-hidden="true">·</span>
            <Link to="/request-quote" className="text-[#00D2FF] hover:underline">Request a Quote</Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-[#00D2FF] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
