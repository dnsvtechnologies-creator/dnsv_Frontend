import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Search,
  Bookmark,
  Package
} from 'lucide-react';
import { apiService } from '../../services/api.js';
import { getProductIcon } from '../../utils/productIcons.js';
import {
  PageWrapper,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard
} from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Interactive email validator state (shown only when product.hasInteractiveValidator is enabled)
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, isAuthenticated, needsPhoneRegistration, openLoginBox, updateSessionUser } =
    useUserAuth();
  const canUseInteractiveTools = isAuthenticated && !needsPhoneRegistration;

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      setLoading(true);
      setNotFound(false);
      setTestResult(null);
      try {
        const res = await apiService.getProductBySlug(slug);
        if (active && res?.data) {
          setProduct(res.data);
          document.title = `${res.data.name} — DNSV Technologies`;
        }
      } catch {
        if (active) {
          setNotFound(true);
          setProduct(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  const isSaved = Boolean(
    product &&
      user?.savedItems?.some(
        (i) => i.itemType === 'product' && (i.itemId === product.slug || i.itemId === product.id)
      )
  );

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    if (!product) return;
    try {
      const res = await apiService.toggleSavedItem({
        itemType: 'product',
        itemId: product.slug,
        title: product.name,
        category: product.categoryLabel || 'Proprietary SaaS',
        url: `/products/${product.slug}`
      });
      if (res?.data) {
        updateSessionUser({ ...user, savedItems: res.data });
      }
    } catch {
      // Ignore bookmark error
    }
  };

  const handleSimulateCheck = (e) => {
    e.preventDefault();
    if (!canUseInteractiveTools || !testEmail || !testEmail.includes('@')) return;

    setIsVerifying(true);
    setTestResult(null);

    setTimeout(() => {
      const parts = testEmail.split('@');
      const domain = parts[1] ? parts[1].toLowerCase() : '';
      const localPart = parts[0] ? parts[0].toLowerCase() : '';

      let status = 'valid';
      const details = {
        syntaxValid: true,
        mxRecordsFound: true,
        smtpPing: 'Connected (250 OK)',
        isDisposable: false,
        isRoleAccount: false,
        score: 95
      };

      if (
        ['tempmail.com', '10minutemail.com', 'throwaway.email', 'mailinator.com', 'yopmail.com'].includes(
          domain
        )
      ) {
        status = 'risky';
        details.isDisposable = true;
        details.score = 25;
      } else if (['admin', 'support', 'info', 'billing', 'sales', 'contact'].includes(localPart)) {
        status = 'risky';
        details.isRoleAccount = true;
        details.score = 65;
      } else if (!domain.includes('.') || domain.length < 4) {
        status = 'invalid';
        details.mxRecordsFound = false;
        details.score = 0;
      }

      setTestResult({
        email: testEmail,
        status,
        details
      });
      setIsVerifying(false);
    }, 550);
  };

  if (loading) {
    return (
      <PageWrapper className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-[#17213A]/70 text-center">
            Loading product specifications...
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (notFound || !product) {
    return (
      <PageWrapper className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0284C7]">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#111111]">Product Not Found</h1>
            <p className="text-xs sm:text-sm text-[#17213A]/75 max-w-md mx-auto">
              This software product has been removed or its URL has changed in the DNSV catalog.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#2563EB]/90"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to DNSV Products</span>
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const isLive =
    String(product.statusBadge || '').toLowerCase().includes('live') || product.isHighlighted;
  const PrimaryButtonText = product.ctaLabel || `Explore ${product.name}`;

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* 1. Public Overview Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl space-y-4">
          <div
            className={`inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full border bg-[#FFFFFF] border-[#17213A]/15 ${
              isLive ? 'text-[#2563EB]' : 'text-[#17213A]/70'
            }`}
          >
            <span>DNSV Proprietary SaaS</span>
            <span aria-hidden="true" className="text-[#17213A]/30">·</span>
            <span className={isLive ? 'text-[#2563EB]' : 'font-mono'}>
              {product.statusBadge || 'SaaS'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            {product.name}
            {product.tagline ? ` — ${product.tagline}` : ''}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-[#17213A]/80">
            {product.shortOverview}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={product.ctaLink || '/pricing'}
                  className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] font-semibold text-xs rounded-lg transition-all shadow-md active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <span>{product.pricingHint || PrimaryButtonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/request-quote?plan=${encodeURIComponent(product.name)}`}
                  className="px-6 py-3.5 font-semibold text-xs rounded-lg border transition-all hover:-translate-y-0.5 bg-[#FFFFFF] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]"
                >
                  Request Custom Quote
                </Link>
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`px-4 py-3.5 font-semibold text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                      : 'bg-[#FFFFFF] border-slate-200 text-slate-600 hover:border-[#0284C7]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved in Portal' : 'Save'}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] font-semibold text-xs rounded-lg transition-all shadow-md active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <span>{product.pricingHint || 'View Pricing Plans'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openLoginBox('login')}
                  className="px-6 py-3.5 font-semibold text-xs rounded-lg border transition-all bg-[#FFFFFF] text-[#0284C7] border-[#0284C7]/35 hover:bg-sky-50"
                >
                  Login / Register for Full Specs
                </button>
              </>
            )}
          </div>
        </FadeIn>
      </section>

      {/* Pre-Login Gating vs Full Authenticated Details */}
      {!isAuthenticated ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginRequiredGate
            title={`Login, Register, or Sign Up with Google for ${product.name} Specs`}
            description={`Only a basic overview for ${product.name} is shown publicly. Verify your active email account (Gmail, Yahoo, Outlook, or business domain) or Sign Up with Google to unlock all feature modules, architecture policies, and quotation actions.`}
          />
        </section>
      ) : (
        <>
          {/* Optional Interactive Email Validation Lab */}
          {product.hasInteractiveValidator && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {!canUseInteractiveTools ? (
                <LoginRequiredGate
                  title={`Complete Mobile Verification to Run Live ${product.name} Probes`}
                  description="Register your genuine mobile number in your User Portal profile to unlock interactive single-email verification simulations."
                />
              ) : (
                <FadeIn>
                  <div className="p-8 sm:p-10 rounded-2xl border bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
                    <div className="max-w-2xl">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
                        Interactive Prototype Demo
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#111111]">
                        Test Single Email Verification
                      </h2>
                      <p className="text-xs sm:text-sm mb-6 text-[#17213A]/75">
                        Enter an email address to observe multi-layer syntax parsing, disposable domain checks, and MX handshake simulation.
                      </p>

                      <form onSubmit={handleSimulateCheck} className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="e.g. contact@business.com or user@mailinator.com"
                          className="border text-xs px-4 py-3 rounded-lg focus:outline-none focus:border-[#2563EB] flex-1 bg-[#F7F7F2] border-[#17213A]/20 text-[#111111]"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
                        >
                          {isVerifying ? (
                            'Analyzing Probe...'
                          ) : (
                            <>
                              <Search className="w-3.5 h-3.5" />
                              Verify Email
                            </>
                          )}
                        </button>
                      </form>

                      {testResult && (
                        <div className="mt-6 p-5 rounded-xl border space-y-3 bg-[#F7F7F2] border-[#17213A]/15">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-[#111111]">
                              {testResult.email}
                            </span>
                            <span
                              className={`text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                                testResult.status === 'valid'
                                  ? 'bg-sky-50 text-[#0284C7] border-[#0284C7]/40'
                                  : testResult.status === 'risky'
                                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                                  : 'bg-red-50 text-red-700 border-red-300'
                              }`}
                            >
                              {testResult.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-[#17213A]/15 text-[#17213A]/75">
                            <div>
                              Syntax:{' '}
                              <strong className="text-[#111111]">
                                {testResult.details.syntaxValid ? 'Passed' : 'Failed'}
                              </strong>
                            </div>
                            <div>
                              MX Record:{' '}
                              <strong className="text-[#111111]">
                                {testResult.details.mxRecordsFound ? 'Found' : 'Missing'}
                              </strong>
                            </div>
                            <div>
                              Disposable:{' '}
                              <strong className="text-[#111111]">
                                {testResult.details.isDisposable ? 'Yes (Risky)' : 'No'}
                              </strong>
                            </div>
                            <div>
                              Role Account:{' '}
                              <strong className="text-[#111111]">
                                {testResult.details.isRoleAccount ? 'Yes' : 'No'}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              )}
            </section>
          )}

          {/* 2. Core Platform Capabilities Bento Grid */}
          {Array.isArray(product.capabilities) && product.capabilities.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                    {product.capabilitiesSectionTag || 'Platform Architecture'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                    {product.capabilitiesSectionTitle || `Core ${product.name} Features`}
                  </h2>
                </div>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.capabilities.map((feat, idx) => {
                  const Icon = getProductIcon(feat.iconKey || product.iconKey);
                  return (
                    <StaggerItem key={idx}>
                      <HoverCard className="p-6 rounded-xl border flex flex-col justify-between h-full bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                        <div>
                          <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] mb-4">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-base font-bold mb-2 text-[#111111]">{feat.title}</h3>
                          <p className="text-xs leading-relaxed text-[#17213A]/75">{feat.desc}</p>
                        </div>
                      </HoverCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </section>
          )}

          {/* 3. Infrastructure & Compliance Note */}
          {(product.policySummary || (product.highlights && product.highlights.length > 0)) && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="p-8 rounded-2xl border space-y-4 bg-[#FFFFFF] border-[#2563EB]/30 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    <ShieldAlert className="w-4 h-4 text-[#2563EB]" />
                    <span>{product.policyTag || 'Infrastructure & Operational Policies'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111111]">
                    {product.policyTitle || 'Transparent Specifications & Reliability'}
                  </h3>
                  {product.policySummary && (
                    <p className="text-xs sm:text-sm leading-relaxed text-[#17213A]/80">
                      {product.policySummary}
                    </p>
                  )}
                  {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                      {product.highlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border bg-[#F7F7F2] border-[#17213A]/15 text-[#17213A]"
                        >
                          <strong className="block mb-1 text-[#111111]">{hl.title}</strong>
                          <span>{hl.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            </section>
          )}

          {/* 4. Bottom CTA Card */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="p-8 sm:p-12 rounded-2xl border text-center bg-[#FFFFFF] border-[#2563EB]/30 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#111111]">
                  {product.bottomCtaTitle || `Get Started with ${product.name}`}
                </h2>
                <p className="text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed text-[#17213A]/80">
                  {product.bottomCtaDesc ||
                    'Explore transparent DNSV pricing or contact our engineering team to configure a tailored deployment.'}
                </p>
                <Link
                  to={product.bottomCtaButtonLink || '/request-quote'}
                  className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg shadow-md inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                >
                  <span>{product.bottomCtaButtonText || 'Request a Custom Quote'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>
          </section>
        </>
      )}
    </PageWrapper>
  );
}
