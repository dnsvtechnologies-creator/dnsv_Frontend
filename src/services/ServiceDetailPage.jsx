import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Bookmark,
  Layers
} from 'lucide-react';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';
import { apiService } from '../../services/api.js';
import { INITIAL_SERVICES } from '../../constants/serviceSeedData.js';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(
    () => INITIAL_SERVICES.find((s) => s.slug === slug) || null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { user, isAuthenticated, openLoginBox, updateSessionUser } = useUserAuth();

  useEffect(() => {
    let active = true;
    async function loadService() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await apiService.getServiceBySlug(slug);
        if (active && res?.data) {
          setService(res.data);
          document.title = `${res.data.title} — DNSV Technologies`;
        }
      } catch {
        // Fallback check against seeded services only if API request errored offline
        const localFallback = INITIAL_SERVICES.find((s) => s.slug === slug);
        if (active) {
          if (localFallback && !navigator.onLine) {
            setService(localFallback);
          } else {
            setNotFound(true);
            setService(null);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadService();
    const handleCatalogUpdate = () => loadService();
    window.addEventListener('dnsv:catalog-updated', handleCatalogUpdate);
    return () => {
      active = false;
      window.removeEventListener('dnsv:catalog-updated', handleCatalogUpdate);
    };
  }, [slug]);

  const resolvedSlug = service?.slug || slug;

  const isSaved = Boolean(
    service &&
      user?.savedItems?.some((i) => i.itemType === 'service' && i.itemId === resolvedSlug)
  );

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    if (!service) return;
    try {
      const res = await apiService.toggleSavedItem({
        itemType: 'service',
        itemId: resolvedSlug,
        title: service.title,
        category: service.category || 'Engineering Service',
        url: `/services/${resolvedSlug}`
      });
      if (res?.data) {
        updateSessionUser({ ...user, savedItems: res.data });
      }
    } catch {
      // Ignore error
    }
  };

  if (loading && !service) {
    return (
      <PageWrapper className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-[#17213A]/60">
          Loading service details...
        </div>
      </PageWrapper>
    );
  }

  if (notFound || !service) {
    return (
      <PageWrapper className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0284C7]">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111]">Service Not Found</h1>
          <p className="text-xs sm:text-sm text-[#17213A]/75 max-w-md mx-auto">
            This engineering service may have been renamed or removed from the active catalog.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Services</span>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const features = Array.isArray(service.features) ? service.features : [];
  const benefits = Array.isArray(service.benefits) ? service.benefits : [];
  const processList = Array.isArray(service.process) ? service.process : [];
  const technologies = Array.isArray(service.technologies) ? service.technologies : [];
  const faqs = Array.isArray(service.faqs) ? service.faqs : [];
  const related = Array.isArray(service.related) ? service.related : [];

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* 1. Detail Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border bg-[#FFFFFF] border-[#17213A]/15">
            <span>{service.category || 'Engineering Service'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-[#17213A]/85">
            {service.headline || service.summary}
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/request-quote"
                  className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] font-semibold text-xs rounded-lg transition-all shadow-md active:scale-95 hover:-translate-y-0.5"
                >
                  Enquire About This Service
                </Link>
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`px-5 py-3.5 font-semibold text-xs rounded-lg border inline-flex items-center gap-2 transition-all ${
                    isSaved
                      ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                      : 'bg-white border-[#17213A]/20 text-[#17213A] hover:border-[#2563EB]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved in Portal' : 'Save Service'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openLoginBox('login')}
                className="px-6 py-3.5 bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] text-white font-semibold text-xs rounded-lg transition-all shadow-md active:scale-95"
              >
                Login / Register to Unlock Specs &amp; Enquire
              </button>
            )}
            <Link
              to="/pricing"
              className="px-6 py-3.5 font-semibold text-xs rounded-lg border transition-all hover:-translate-y-0.5 bg-[#FFFFFF] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]"
            >
              View Related Pricing Plans
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 2. Basic Overview (Public) + Outcomes (Authenticated) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <FadeIn className={isAuthenticated && benefits.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <div className="p-8 rounded-2xl border space-y-4 bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
              <h2 className="text-xl font-bold text-[#111111]">Service Overview</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#17213A]/80">
                {service.overview || service.summary}
              </p>
              {isAuthenticated && technologies.length > 0 && (
                <div className="pt-4 border-t border-[#17213A]/15">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3">
                    Core Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded border bg-[#F7F7F2] border-[#17213A]/20 text-[#17213A]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {isAuthenticated && benefits.length > 0 && (
            <FadeIn delay={0.15} className="lg:col-span-5">
              <div className="p-8 rounded-2xl border space-y-4 bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
                <h3 className="text-base font-bold flex items-center gap-2 text-[#111111]">
                  <Shield className="w-4 h-4 text-[#2563EB]" />
                  Direct Business Outcomes
                </h3>
                <ul className="space-y-3 text-xs leading-relaxed text-[#17213A]/80">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {!isAuthenticated ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginRequiredGate
            title={`Login, Register, or Sign Up with Google for Full ${service.title} Specs`}
            description="Only the basic service overview is visible publicly. Login or Register using a verified inbox email (Gmail, Yahoo, Outlook, or business domain), or Sign Up with Google to inspect technical features, architecture, and FAQs."
          />
        </section>
      ) : (
        <>
          {/* 3. Detailed Features Bento */}
          {features.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                    Scope &amp; Architecture
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                    Key Technical Features
                  </h2>
                </div>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feat, idx) => (
                  <StaggerItem key={idx}>
                    <HoverCard className="p-6 rounded-xl border h-full bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                      <span className="font-mono text-xs text-[#2563EB] font-bold block mb-2">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold mb-2 text-[#111111]">{feat.title}</h3>
                      <p className="text-xs leading-relaxed text-[#17213A]/75">{feat.desc}</p>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          )}

          {/* 4. Development Process */}
          {processList.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="p-8 sm:p-12 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold mb-8 text-[#111111]">
                    Execution Lifecycle for {service.title}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {processList.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border flex flex-col justify-between bg-[#F7F7F2] border-[#17213A]/15"
                      >
                        <span className="font-mono text-lg font-extrabold text-[#2563EB] mb-2">
                          Phase 0{idx + 1}
                        </span>
                        <p className="text-xs font-medium leading-relaxed text-[#17213A]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </section>
          )}

          {/* 5. FAQs & Related Services */}
          {(faqs.length > 0 || related.length > 0) && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {faqs.length > 0 && (
                  <FadeIn className={related.length > 0 ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
                    <h3 className="text-lg font-bold text-[#111111]">Service Questions</h3>
                    {faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm"
                      >
                        <h4 className="text-xs font-bold text-[#2563EB] mb-1">{faq.q}</h4>
                        <p className="text-xs leading-relaxed text-[#17213A]/80">{faq.a}</p>
                      </div>
                    ))}
                  </FadeIn>
                )}

                {related.length > 0 && (
                  <FadeIn delay={0.1} className={faqs.length > 0 ? 'lg:col-span-5' : 'lg:col-span-12'}>
                    <div className="p-6 rounded-xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                      <h3 className="text-sm font-bold mb-4 text-[#111111]">
                        Complementary Services
                      </h3>
                      <div className="flex flex-col gap-3">
                        {related.map((rel, idx) => (
                          <Link
                            key={idx}
                            to={rel.slug}
                            className="p-3.5 rounded-lg border transition-all flex items-center justify-between text-xs group bg-[#F7F7F2] border-[#17213A]/15 hover:border-[#2563EB] text-[#111111]"
                          >
                            <span className="font-semibold">{rel.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}
              </div>
            </section>
          )}

          {/* 6. Detail CTA */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="p-8 sm:p-12 rounded-2xl border text-center bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#111111]">
                  Ready to Begin with {service.title}?
                </h2>
                <p className="text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed text-[#17213A]/80">
                  Contact DNSV Technologies today. Our technical team will review your specifications and supply a transparent, line-item quotation.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/request-quote"
                    className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Request a Project Proposal
                  </Link>
                  <Link
                    to="/services"
                    className="px-6 py-3 text-xs font-semibold rounded-lg border transition-all hover:-translate-y-0.5 bg-[#F7F7F2] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]"
                  >
                    Explore Other Services
                  </Link>
                </div>
              </div>
            </FadeIn>
          </section>
        </>
      )}
    </PageWrapper>
  );
}
