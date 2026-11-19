import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  CheckCircle2,
  ChevronDown,
  Shield,
  Zap,
  Clock,
  Server
} from 'lucide-react';
import Hero3DRotatingLogo from '../../components/animations/Hero3DRotatingLogo.jsx';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';
import { INITIAL_PRODUCTS } from '../../constants/productSeedData.js';
import { INITIAL_SERVICES } from '../../constants/serviceSeedData.js';
import { apiService } from '../../services/api.js';
import { getProductIcon } from '../../utils/productIcons.js';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);
  const { isAuthenticated } = useUserAuth();
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [servicesList, setServicesList] = useState(INITIAL_SERVICES);

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

  const homeFaqs = [
    {
      q: 'What types of software services does DNSV Technologies provide?',
      a: 'DNSV Technologies provides end-to-end digital solutions including custom website design and development, bespoke software and CRM systems, high-volume email marketing and Mautic automation workflows, API development, payment gateway integrations, and ongoing technical maintenance retainers.'
    },
    {
      q: 'What is Mailcurve and how does it relate to DNSV Technologies?',
      a: 'Mailcurve is our proprietary SaaS email marketing and automation platform developed by DNSV Technologies. It enables businesses to manage subscribers, build automated drip campaigns, and dispatch high-volume broadcasts with rigorous deliverability controls.'
    },
    {
      q: 'How does DNSV Technologies ensure transparent pricing for websites and email plans?',
      a: 'We provide structured pricing across three clear categories: monthly subscriptions for Mailcurve email sending, one-time development fees for website projects with specified page and revision limits, and combined combo packages where one-time development and ongoing monthly email charges are explicitly separated before engagement.'
    },
    {
      q: 'What is the typical timeline for custom software or website delivery?',
      a: 'Starter website projects are typically delivered in 7–14 business days, whereas comprehensive business websites or custom software platforms range between 3 to 8 weeks depending on database schemas, third-party integrations, and testing cycles.'
    }
  ];

  return (
    <PageWrapper className="space-y-24 sm:space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] blur-3xl pointer-events-none -z-10 bg-gradient-to-b from-[#00D2FF]/20 via-[#2563EB]/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              <FadeIn delay={0.05}>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0284C7] tracking-wide uppercase px-3.5 py-1.5 rounded-full border shadow-sm bg-white/80 border-sky-200/70">
                  <span>DNSV Technologies</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-700">Digital Nexus for Software & Ventures</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance text-[#0F172A]">
                  Building Digital Solutions for the Next Generation of Business.
                </h1>
              </FadeIn>

              <FadeIn delay={0.25}>
                <p className="text-base sm:text-lg leading-relaxed max-w-2xl text-slate-600">
                  From powerful websites and custom software to SaaS platforms and intelligent email automation, DNSV Technologies helps businesses turn ideas into scalable digital solutions.
                </p>
              </FadeIn>

              <FadeIn delay={0.35}>
                <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                  <Link
                    to="/services"
                    className="w-full sm:w-auto text-center px-6 py-3.5 bg-gradient-to-r from-[#0284C7] via-[#2563EB] to-[#1D4ED8] hover:from-[#0EA5E9] hover:to-[#2563EB] text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-sky-500/25 active:scale-95 hover:-translate-y-0.5"
                  >
                    Explore Our Services
                  </Link>
                  <Link
                    to={isAuthenticated ? '/portal' : '/request-quote'}
                    className="w-full sm:w-auto text-center px-6 py-3.5 font-semibold text-sm rounded-lg border transition-all active:scale-95 hover:-translate-y-0.5 bg-white/80 backdrop-blur-md text-[#0F172A] border-slate-200/80 hover:border-[#0284C7] shadow-sm"
                  >
                    {isAuthenticated ? 'Open Client Portal' : 'Start a Project'}
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.45} className="w-full">
                <div className="pt-6 border-t w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs border-[#17213A]/15 text-[#17213A]/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Full-Stack MERN Architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>High-Volume Email Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Production SLA Support</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* RIGHT SIDE: 3D ROTATING LOGO COIN */}
            <FadeIn delay={0.2} direction="left" className="lg:col-span-5 flex items-center justify-center relative">
              <Hero3DRotatingLogo />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. BASIC COMPANY OVERVIEW (Publicly Visible) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-8 sm:p-12 rounded-2xl border relative overflow-hidden bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                  About the Company
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                  Digital Nexus for Software & Ventures
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-4 text-sm sm:text-base leading-relaxed text-[#17213A]/85">
                <p>
                  DNSV Technologies operates as a comprehensive technology partner. We architect cohesive digital ecosystems encompassing cloud software, automated communications, robust database models, and high-performance web frontends.
                </p>
                <div className="pt-2">
                  <Link to="/about" className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:underline">
                    Read our overview and philosophy
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. CORE SERVICES OVERVIEW (Basic Summary Publicly Visible) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                Comprehensive Technology Services
              </h2>
            </div>
            <p className="text-sm max-w-md mt-4 md:mt-0 text-[#17213A]/75">
              Core engineering pillars across MERN software, automation, and cloud infrastructure.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((svc, idx) => {
            const Icon = getProductIcon(svc.iconKey, Code2);
            const isLastOdd = idx === servicesList.length - 1 && servicesList.length % 3 === 2;
            return (
              <StaggerItem key={svc.slug || idx} className={isLastOdd ? 'md:col-span-2 lg:col-span-2' : ''}>
                <HoverCard className="p-6 rounded-xl border transition-all h-full flex flex-col justify-between bg-[#FFFFFF] border-[#17213A]/15 hover:border-[#2563EB]/50 shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-[#111111]">{svc.title}</h3>
                    <p className="text-xs leading-relaxed mb-4 text-[#17213A]/75">{svc.summary}</p>
                  </div>
                  <Link to={`/services/${svc.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline">
                    Explore Service <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* LOGIN GATE FOR DEEP PLATFORM INFORMATION WHEN LOGGED OUT */}
      {!isAuthenticated ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google to Unlock Complete DNSV Specs"
            description="Only basic overview content is displayed publicly. Login or Register with an active verified inbox email (Gmail, Yahoo, Outlook, or business domain), or Sign Up with Google to inspect Mailcurve architecture, interactive Email Validator demo, pricing breakdowns, and portal tracking."
          />
        </section>
      ) : (
        <>
          {/* 4. WHY CHOOSE DNSV TECHNOLOGIES */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                  Value Proposition
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                  Why Businesses Choose DNSV
                </h2>
                <p className="text-sm mt-3 text-[#17213A]/75">
                  Engineered with clear architectural discipline, zero hidden fees, and transparent engineering processes.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Architectural Rigor', desc: 'Every system is engineered from the ground up using real MongoDB schemas, clean Express APIs, and modern React components.' },
                { icon: Zap, title: 'Multi-Service Mastery', desc: 'Single-point delivery for frontend UI, custom software, Mailcurve email marketing infrastructure, and REST API pipelines.' },
                { icon: Clock, title: 'Transparent Quotas', desc: 'Transparent email sending quotas, one-time website development milestones, and exact revision cycle parameters.' },
                { icon: Server, title: 'Infrastructure Know-How', desc: 'Deep expertise in SMTP deliverability, DNS record alignment, server security hardening, and database optimization.' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="p-6 rounded-xl border h-full bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold mb-2 text-[#111111]">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-[#17213A]/75">{item.desc}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>

          {/* 5. FEATURED PRODUCTS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                    SaaS Solutions
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                    Featured DNSV Products
                  </h2>
                </div>
                <Link to="/products" className="text-xs font-semibold text-[#2563EB] hover:underline mt-4 md:mt-0 flex items-center gap-1">
                  View All Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {productsList.map((prod, idx) => {
                const isHighlighted = Boolean(prod.isHighlighted);
                return (
                  <FadeIn key={prod._id || prod.id || prod.slug} delay={0.1 * (idx + 1)}>
                    <div
                      className={`p-8 rounded-2xl border relative overflow-hidden flex flex-col justify-between h-full bg-[#FFFFFF] ${
                        isHighlighted
                          ? 'border-[#2563EB]/40 shadow-md'
                          : 'border-[#17213A]/15 shadow-sm'
                      }`}
                    >
                      <div className="absolute top-4 right-4">
                        <span
                          className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-1 rounded ${
                            isHighlighted
                              ? 'text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/30'
                              : 'border bg-[#F7F7F2] text-[#17213A]/70 border-[#17213A]/20'
                          }`}
                        >
                          {prod.statusBadge || 'SaaS'}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                            isHighlighted ? 'text-[#2563EB]' : 'text-[#17213A]/60'
                          }`}
                        >
                          {prod.categoryLabel}
                        </span>
                        <h3 className="text-2xl font-bold mb-3 text-[#111111]">{prod.name}</h3>
                        <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#17213A]/80">
                          {prod.shortOverview}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#17213A]/15">
                        <Link
                          to={`/products/${prod.slug}`}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            isHighlighted
                              ? 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90'
                              : 'border bg-[#F7F7F2] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]'
                          }`}
                        >
                          {prod.ctaLabel || `Learn More About ${prod.name}`}
                        </Link>
                        {prod.pricingHint && (
                          <Link
                            to={prod.ctaLink || '/pricing'}
                            className="text-xs font-medium hover:underline text-[#17213A]"
                          >
                            {prod.pricingHint}
                          </Link>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </section>

          {/* 6. HOW WE WORK */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                  Methodology
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                  How We Deliver Digital Solutions
                </h2>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Discovery & Scope', desc: 'Understanding functional requirements, user stories, and architectural specifications.' },
                { step: '02', title: 'System Design', desc: 'Designing responsive UI wireframes, component layouts, and database schemas.' },
                { step: '03', title: 'Full-Stack Build', desc: 'Implementing clean Express APIs, React interfaces, and email service workflows.' },
                { step: '04', title: 'Testing & QA', desc: 'Validating responsiveness, API security, deliverability, and cross-browser consistency.' },
                { step: '05', title: 'Deployment & SLA', desc: 'Production release, server configuration, DNS alignment, and ongoing support retainers.' }
              ].map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className="p-5 rounded-xl border flex flex-col justify-between h-full bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                    <div>
                      <span className="font-mono text-xl font-extrabold text-[#2563EB] block mb-2">{item.step}</span>
                      <h3 className="text-sm font-bold mb-2 text-[#111111]">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-[#17213A]/70">{item.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>

          {/* 7. CUSTOMER FAQS */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                  Answers & Clarifications
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                  Frequently Asked Questions
                </h2>
              </div>
            </FadeIn>

            <div className="space-y-3">
              {homeFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                const panelId = `home-faq-panel-${idx}`;
                return (
                  <FadeIn key={idx} delay={idx * 0.05}>
                    <div className="rounded-xl border overflow-hidden transition-colors bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-semibold transition-colors text-[#111111] hover:text-[#2563EB] cursor-pointer"
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#2563EB] transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div
                          id={panelId}
                          role="region"
                          className="px-5 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 border-[#17213A]/10 text-[#17213A]/80"
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* CONTACT CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-8 sm:p-14 rounded-3xl border text-center relative overflow-hidden bg-gradient-to-r from-[#FFFFFF] via-[#F7F7F2] to-[#FFFFFF] border-[#2563EB]/40 shadow-md">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                Start Your Project
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
                Ready to Connect Your Ideas with Technology?
              </h2>
              <p className="text-xs sm:text-base leading-relaxed text-[#17213A]/80">
                Sign in with Google and track your quotes, messages, drafts, and deliveries directly inside your DNSV Client Portal.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/request-quote"
                  className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-[#2563EB]/25 hover:-translate-y-0.5"
                >
                  Request a Detailed Quotation
                </Link>
                <Link
                  to={isAuthenticated ? '/portal' : '/contact'}
                  className="px-6 py-3.5 font-semibold text-xs rounded-lg border transition-all hover:-translate-y-0.5 bg-[#FFFFFF] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]"
                >
                  {isAuthenticated ? 'Open My Client Portal' : 'Send Us a Message'}
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </PageWrapper>
  );
}
