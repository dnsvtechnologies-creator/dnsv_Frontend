import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ArrowRight,
  CheckCircle2,
  Lock,
  Bookmark,
  Layers
} from 'lucide-react';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';
import { apiService } from '../../services/api.js';
import { getProductIcon } from '../../utils/productIcons.js';
import {
  INITIAL_SERVICES,
  INITIAL_SERVICES_PAGE_CONFIG
} from '../../constants/serviceSeedData.js';

export default function ServicesPage() {
  const { user, isAuthenticated, openLoginBox, updateSessionUser } = useUserAuth();
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [pageConfig, setPageConfig] = useState(INITIAL_SERVICES_PAGE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const syncServices = async () => {
      try {
        const res = await apiService.getServices();
        if (active) {
          if (Array.isArray(res?.data)) setServices(res.data);
          if (res?.pageConfig) setPageConfig(res.pageConfig);
        }
      } catch {
        // Fallback already seeded in state
      } finally {
        if (active) setLoading(false);
      }
    };

    syncServices();
    window.addEventListener('dnsv:catalog-updated', syncServices);
    return () => {
      active = false;
      window.removeEventListener('dnsv:catalog-updated', syncServices);
    };
  }, []);

  const isServiceSaved = (id) =>
    Boolean(user?.savedItems?.some((i) => i.itemType === 'service' && i.itemId === id));

  const handleToggleBookmark = async (svc) => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    const svcId = svc.slug || svc.id;
    try {
      const res = await apiService.toggleSavedItem({
        itemType: 'service',
        itemId: svcId,
        title: svc.title,
        category: svc.category || 'Engineering Service',
        url: `/services/${svc.slug}`
      });
      if (res?.data) {
        updateSessionUser({ ...user, savedItems: res.data });
      }
    } catch {
      // Ignore error
    }
  };

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>{pageConfig.heroBadge || 'Engineering Capabilities'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            {pageConfig.heroTitle || 'Comprehensive Digital Services & Software Engineering'}
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            {pageConfig.heroSubtitle ||
              'DNSV Technologies combines modern web frontends, backend APIs, scalable MongoDB databases, and high-throughput email automation into cohesive, reliable solutions for commercial businesses.'}
          </p>
        </FadeIn>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && services.length === 0 ? (
          <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-[#17213A]/60">
            Loading services catalog...
          </div>
        ) : services.length === 0 ? (
          <div className="p-10 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0284C7]">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">No Engineering Services Listed Yet</h2>
            <p className="text-xs text-[#17213A]/70 max-w-md mx-auto">
              Services managed from the DNSV admin console will appear here automatically.
            </p>
          </div>
        ) : (
          <StaggerContainer className="space-y-12">
            {services.map((service, index) => {
              const Icon = getProductIcon(service.iconKey, Code2);
              const svcKey = service.slug || service.id || service._id;
              const saved = isServiceSaved(svcKey);
              const offerings = Array.isArray(service.offerings) ? service.offerings : [];

              return (
                <StaggerItem key={svcKey}>
                  <div className="p-8 sm:p-10 rounded-2xl border transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FFFFFF] border-[#17213A]/15 hover:border-[#2563EB]/50 shadow-sm">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB]">
                          <Icon className="w-6 h-6" />
                        </div>
                        {isAuthenticated && (
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(service)}
                            className={`p-2 rounded-lg border transition-colors ${
                              saved
                                ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-[#0284C7]'
                            }`}
                            title={saved ? 'Remove from Saved Services' : 'Bookmark Service in Portal'}
                          >
                            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
                          </button>
                        )}
                      </div>
                      <div>
                        <span className="font-mono text-xs text-[#2563EB] font-bold">
                          Category 0{index + 1}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold mt-1 text-[#111111]">
                          {service.title}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#17213A]/75">
                        {service.summary}
                      </p>
                      <div className="pt-2">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg transition-all shadow-md active:scale-95 hover:-translate-y-0.5"
                        >
                          View Service Details &amp; Process
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-7 p-6 rounded-xl border bg-[#F7F7F2] border-[#17213A]/15">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-4">
                        Key Deliverables &amp; Capabilities
                      </h3>
                      {isAuthenticated ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#17213A]/85">
                          {offerings.map((offering, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                              <span>{offering}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-2.5 text-xs text-slate-600">
                            <Lock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                            <span>
                              {offerings.length} technical deliverables &amp; architecture specifications unlock after verifying your account.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openLoginBox('login')}
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shrink-0"
                          >
                            Login / Register to Unlock
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </section>

      {/* Bottom CTA or Login Gate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google to Unlock Deliverables"
            description="Public visitors can review service summaries. Verify via Gmail, Yahoo, Outlook, business email, or Sign Up with Google to view technical specs, architecture blueprints, and request customized quotations."
          />
        ) : (
          <FadeIn>
            <div className="p-8 sm:p-12 rounded-2xl border text-center bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#111111]">
                {pageConfig.ctaTitle || 'Need a Customized Solution Across Multiple Services?'}
              </h2>
              <p className="text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed text-[#17213A]/80">
                {pageConfig.ctaDescription ||
                  'Combine website development with Mailcurve email marketing automation or custom API integrations with tailored pricing.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={pageConfig.ctaPrimaryLink || '/request-quote'}
                  className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {pageConfig.ctaPrimaryLabel || 'Request a Project Quotation'}
                </Link>
                <Link
                  to={pageConfig.ctaSecondaryLink || '/pricing'}
                  className="px-6 py-3 text-xs font-semibold rounded-lg border transition-all hover:-translate-y-0.5 bg-[#F7F7F2] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]"
                >
                  {pageConfig.ctaSecondaryLabel || 'View Standard Packages'}
                </Link>
              </div>
            </div>
          </FadeIn>
        )}
      </section>
    </PageWrapper>
  );
}
