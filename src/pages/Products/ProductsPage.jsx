import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Lock, Package } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { getProductIcon } from '../../utils/productIcons.js';
import { PageWrapper, FadeIn, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function ProductsPage() {
  const { isAuthenticated, openLoginBox } = useUserAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const res = await apiService.getProducts();
        if (active && Array.isArray(res?.data)) {
          setProducts(res.data);
        }
      } catch {
        // Handled cleanly via apiService fallback
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>Proprietary SaaS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            DNSV Software Products
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            In addition to custom client engineering, DNSV Technologies actively develops proprietary SaaS software platforms focused on email communications, list hygiene, and automated business workflows.
          </p>
        </FadeIn>
      </section>

      {/* Dynamic Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((skeleton) => (
              <div
                key={skeleton}
                className="p-8 sm:p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-[#17213A]/60"
              >
                Loading software product...
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0284C7]">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">No Software Products Listed Yet</h2>
            <p className="text-xs text-[#17213A]/70 max-w-md mx-auto">
              Products managed from the DNSV catalog will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((prod, idx) => {
              const Icon = getProductIcon(prod.iconKey);
              const isHighlighted = Boolean(prod.isHighlighted);
              const isLive =
                isHighlighted ||
                String(prod.statusBadge || '').toLowerCase().includes('live');

              return (
                <FadeIn key={prod._id || prod.id || prod.slug} delay={0.08 * (idx + 1)}>
                  <HoverCard
                    className={`p-8 sm:p-10 rounded-2xl border flex flex-col justify-between relative overflow-hidden h-full bg-[#FFFFFF] ${
                      isHighlighted
                        ? 'border-[#2563EB]/50 shadow-md'
                        : 'border-[#17213A]/15 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center text-[#2563EB] ${
                            isHighlighted
                              ? 'bg-[#2563EB]/15 border-[#2563EB]/30'
                              : 'bg-[#F7F7F2] border-[#17213A]/15'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span
                          className={`text-xs uppercase font-mono font-bold tracking-wider px-3 py-1 rounded ${
                            isLive
                              ? 'text-[#2563EB] bg-[#2563EB]/15 border border-[#2563EB]/40'
                              : 'border bg-[#F7F7F2] text-[#17213A]/70 border-[#17213A]/20'
                          }`}
                        >
                          {prod.statusBadge || 'SaaS'}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                          isHighlighted ? 'text-[#2563EB]' : 'text-[#17213A]/60'
                        }`}
                      >
                        {prod.categoryLabel}
                      </span>

                      <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#111111]">
                        {prod.name}
                      </h2>

                      <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#17213A]/80">
                        {prod.shortOverview}
                      </p>

                      {isAuthenticated ? (
                        <div className="space-y-2.5 text-xs mb-8 text-[#17213A]/80">
                          {(prod.summaryBullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-8 p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center gap-2.5 text-xs text-slate-700">
                          <Lock className="w-4 h-4 text-[#0284C7] shrink-0" />
                          <span>
                            Login or Register to inspect {prod.name} capabilities, architecture &amp; specs.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t flex flex-wrap items-center gap-4 border-[#17213A]/15">
                      {isAuthenticated || isHighlighted ? (
                        <Link
                          to={`/products/${prod.slug}`}
                          className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all active:scale-95 flex items-center gap-2 ${
                            isHighlighted
                              ? 'bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] shadow-md'
                              : 'border bg-[#F7F7F2] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]'
                          }`}
                        >
                          <span>{prod.ctaLabel || `Explore ${prod.name}`}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openLoginBox('login')}
                          className="px-5 py-2.5 text-xs font-semibold rounded-lg text-white bg-[#0284C7] hover:bg-[#0369A1] transition-all flex items-center gap-2"
                        >
                          <span>Login to Inspect {prod.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {prod.pricingHint && (
                        <Link
                          to={prod.ctaLink || '/pricing'}
                          className="text-xs font-semibold hover:underline text-[#17213A]"
                        >
                          {prod.pricingHint}
                        </Link>
                      )}
                    </div>
                  </HoverCard>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>

      {/* Enterprise Reliability Notice or Login Gate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google for Full Product Specs"
            description="Public visitors can view basic product summaries. Login or Register with a verified inbox email (Gmail, Yahoo, Outlook, or business domain), or Sign Up with Google to inspect full SaaS architecture specs and interactive demos."
          />
        ) : (
          <FadeIn>
            <div className="p-8 rounded-2xl border text-xs leading-relaxed bg-[#FFFFFF] border-[#17213A]/15 text-[#17213A]/75 shadow-sm">
              <strong className="block text-sm mb-1 text-[#111111]">Product Status Disclosure:</strong>
              DNSV Technologies clearly denotes active production SaaS platforms vs. products undergoing internal staging and development. Currently active catalog:{' '}
              {products.length > 0
                ? products.map((p) => `${p.name} (${p.statusBadge || 'SaaS'})`).join(' · ')
                : 'No active listings.'}
            </div>
          </FadeIn>
        )}
      </section>
    </PageWrapper>
  );
}
