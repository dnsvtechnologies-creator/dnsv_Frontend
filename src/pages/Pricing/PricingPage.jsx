import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Globe,
  Layers,
  Bookmark,
  Lock
} from 'lucide-react';
import { apiService } from '../../services/api.js';
import {
  EMAIL_MARKETING_PLANS,
  WEBSITE_DEVELOPMENT_PLANS,
  COMBINED_PACKAGES
} from '../../constants/pricingData.js';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('email-marketing');
  const [plansData, setPlansData] = useState({
    emailMarketing: EMAIL_MARKETING_PLANS,
    websiteDevelopment: WEBSITE_DEVELOPMENT_PLANS,
    combinedPackages: COMBINED_PACKAGES
  });
  const navigate = useNavigate();
  const { user, isAuthenticated, openLoginBox, updateSessionUser } = useUserAuth();

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await apiService.getPricingPlans();
        if (data) setPlansData(data);
      } catch {
        // Use local fallback
      }
    }
    loadPlans();
  }, []);

  const isPlanSaved = (planId) =>
    Boolean(user?.savedItems?.some((i) => i.itemType === 'plan' && i.itemId === planId));

  const handleToggleBookmark = async (plan, categoryName) => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    try {
      const encodedPlan = encodeURIComponent(plan.name);
      const encodedCategory = encodeURIComponent(categoryName);
      const res = await apiService.toggleSavedItem({
        itemType: 'plan',
        itemId: plan.id,
        title: plan.name,
        category: categoryName,
        url: `/request-quote?plan=${encodedPlan}&category=${encodedCategory}`
      });
      if (res?.data) {
        updateSessionUser({ ...user, savedItems: res.data });
      }
    } catch {
      // Ignore bookmark error
    }
  };

  const handleSelectPlan = (plan, categoryName) => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    const encodedPlan = encodeURIComponent(plan.name);
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/request-quote?plan=${encodedPlan}&category=${encodedCategory}`);
  };

  const renderPlanCard = (plan, categoryName, type) => {
    const saved = isPlanSaved(plan.id);
    return (
      <HoverCard
        className={`p-6 rounded-2xl flex flex-col justify-between h-full transition-all duration-200 relative ${
          plan.isPopular
            ? 'bg-[#FFFFFF] border-2 border-[#2563EB] shadow-lg shadow-[#2563EB]/15'
            : 'bg-[#FFFFFF] border border-[#17213A]/15 hover:border-[#2563EB]/50 shadow-sm'
        }`}
      >
        {plan.isPopular && (
          <div className="absolute -top-3 left-6">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#F7F7F2] bg-[#2563EB] px-3 py-0.5 rounded-full shadow-sm">
              {plan.popularBadge || 'Popular'}
            </span>
          </div>
        )}

        <div>
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">{plan.name}</h3>
              <p className="text-xs mt-1 text-[#17213A]/60">{plan.subtitle}</p>
            </div>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => handleToggleBookmark(plan, categoryName)}
                className={`p-2 rounded-lg border transition-colors shrink-0 ${
                  saved
                    ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-[#0284C7]'
                }`}
                title={saved ? 'Remove from Portal Bookmarks' : 'Save Plan to Client Portal'}
                aria-label={saved ? `Remove ${plan.name} from bookmarks` : `Save ${plan.name} to bookmarks`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          <div className="mb-6 pb-6 border-b border-[#17213A]/15">
            {plan.price !== null && plan.price !== undefined ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#111111]">
                    ₹{Number(plan.price).toLocaleString('en-IN')}
                  </span>
                  {type === 'email' && <span className="text-xs font-medium text-[#17213A]/60">/ month</span>}
                </div>
                {type === 'website' && (
                  <span className="text-xs text-[#2563EB] font-bold block uppercase tracking-wider mt-1">
                    One-Time Fee
                  </span>
                )}
                {type === 'combo' && (
                  <>
                    <span className="text-[11px] font-semibold text-[#2563EB] block mt-1">
                      Website Development (One-Time)
                    </span>
                    {plan.recurringFee !== null && plan.recurringFee !== undefined && (
                      <div className="text-[11px] mt-1 font-mono text-[#17213A]/70">
                        + ₹{Number(plan.recurringFee).toLocaleString('en-IN')}/mo email (Month 2+)
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-xl font-bold text-[#2563EB] font-mono">
                {plan.priceLabel || 'Custom Scope'}
              </div>
            )}

            {/* Quota Strip unlocked only after login */}
            {isAuthenticated && type === 'email' && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg border bg-[#F7F7F2] border-[#17213A]/15">
                <div>
                  <span className="block text-[#17213A]/60">Daily Limit:</span>
                  <strong className="font-mono text-[#111111]">
                    {typeof plan.dailyLimit === 'number' ? plan.dailyLimit.toLocaleString('en-IN') : plan.dailyLimit}
                  </strong>
                </div>
                <div>
                  <span className="block text-[#17213A]/60">Monthly Limit:</span>
                  <strong className="text-[#2563EB] font-mono">
                    {typeof plan.monthlyLimit === 'number' ? plan.monthlyLimit.toLocaleString('en-IN') : plan.monthlyLimit}
                  </strong>
                </div>
              </div>
            )}

            {isAuthenticated && type === 'website' && (
              <div className="mt-3 p-2 rounded-lg border flex items-center justify-between text-[11px] bg-[#F7F7F2] border-[#17213A]/15">
                <span className="text-[#17213A]/60">Scope:</span>
                <strong className="text-[#111111]">{plan.pageLimit}</strong>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <ul className="space-y-2.5 text-xs mb-6 text-[#17213A]/80">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-slate-600 mb-6 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
              <span>
                Includes {plan.features.length} technical deliverables & quota specifications. Login or Register to inspect full scope.
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-[#17213A]/15">
          <button
            type="button"
            onClick={() => handleSelectPlan(plan, categoryName)}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 ${
              plan.isPopular
                ? 'bg-[#2563EB] hover:bg-[#2563EB]/90 text-white shadow-md'
                : 'bg-[#F7F7F2] hover:bg-[#2563EB] hover:text-white text-[#111111] border border-[#17213A]/20'
            }`}
          >
            <span>{isAuthenticated ? `Enquire About ${plan.name}` : 'Login / Register to Enquire'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {isAuthenticated && (
            <p className="text-[10px] leading-tight text-[#17213A]/60">{plan.technicalNotes}</p>
          )}
        </div>
      </HoverCard>
    );
  };

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>DNSV Transparent Pricing System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            Predictable Pricing. No Hidden Surprises.
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            Browse base investment tiers below. Login or Register with a verified email account (Gmail, Yahoo, Outlook, or business domain), or Sign Up with Google to unlock deliverables, quotas, bookmarking, and direct quotation requests.
          </p>

          <div
            role="tablist"
            aria-label="Pricing categories"
            className="mt-10 inline-flex p-1.5 rounded-xl border max-w-full overflow-x-auto bg-[#FFFFFF] border-[#17213A]/15 shadow-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'email-marketing'}
              onClick={() => setActiveTab('email-marketing')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'email-marketing'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/30'
                  : 'text-[#17213A]/70 hover:text-[#111111]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              1. Email Marketing Plans
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'website-development'}
              onClick={() => setActiveTab('website-development')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'website-development'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/30'
                  : 'text-[#17213A]/70 hover:text-[#111111]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              2. Website Development Plans
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'combined-packages'}
              onClick={() => setActiveTab('combined-packages')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'combined-packages'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/30'
                  : 'text-[#17213A]/70 hover:text-[#111111]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              3. Complete Website + Email Combos
            </button>
          </div>
        </FadeIn>
      </section>

      {activeTab === 'email-marketing' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#111111]">Email Marketing Plans (Mailcurve)</h2>
            <p className="text-xs sm:text-sm mt-1 text-[#17213A]/75">
              Monthly recurring subscriptions for Mailcurve email marketing.
            </p>
          </FadeIn>

          {plansData.emailMarketing.length === 0 ? (
            <div className="p-8 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-center text-[#17213A]/70">
              No email marketing plans are currently published. Contact our team for a tailored quotation.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plansData.emailMarketing.map((plan) => (
                <StaggerItem key={plan.id || plan._id}>
                  {renderPlanCard(plan, 'Email Marketing Plans', 'email')}
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      )}

      {activeTab === 'website-development' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#111111]">Website Development Plans</h2>
            <p className="text-xs sm:text-sm mt-1 text-[#17213A]/75">
              One-time website engineering charges with defined page counts and revision cycles.
            </p>
          </FadeIn>

          {plansData.websiteDevelopment.length === 0 ? (
            <div className="p-8 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-center text-[#17213A]/70">
              No website development plans are currently published. Contact our team for a custom quotation.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plansData.websiteDevelopment.map((plan) => (
                <StaggerItem key={plan.id || plan._id}>
                  {renderPlanCard(plan, 'Website Development Plans', 'website')}
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      )}

      {activeTab === 'combined-packages' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#111111]">Complete Website + Email Packages</h2>
            <p className="text-xs sm:text-sm mt-1 text-[#17213A]/75">
              Bundled solutions combining one-time website development with Mailcurve email marketing subscriptions.
            </p>
          </FadeIn>

          {plansData.combinedPackages.length === 0 ? (
            <div className="p-8 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 text-xs text-center text-[#17213A]/70">
              No combined packages are currently published. Request a tailored bundle quote below.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plansData.combinedPackages.map((combo) => (
                <StaggerItem key={combo.id || combo._id}>
                  {renderPlanCard(combo, 'Complete Website + Email Packages', 'combo')}
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      )}

      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google to Unlock Full Plan Specs"
            description="Public visitors can view basic tier pricing. Login or Register with an active verified inbox, or Sign Up with Google to inspect every deliverable line item, sending quota, and bookmark plans."
          />
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-8 sm:p-12 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
                Need a Custom Enterprise Scope or Non-Standard Volume?
              </h3>
              <p className="text-xs sm:text-sm mt-1 max-w-xl text-[#17213A]/80">
                We engineer custom software architectures, multi-server sending clusters, and dedicated SLA agreements tailored to your operations.
              </p>
            </div>
            <Link
              to="/request-quote"
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-semibold rounded-lg shrink-0 shadow-md hover:-translate-y-0.5 transition-all"
            >
              Request a Custom Quotation
            </Link>
          </div>
        </FadeIn>
      </section>
    </PageWrapper>
  );
}
