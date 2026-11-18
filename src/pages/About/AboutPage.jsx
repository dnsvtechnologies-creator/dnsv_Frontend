import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Compass, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import DNSVHorizontalLogo from '../../components/common/DNSVHorizontalLogo.jsx';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { BRAND } from '../../constants/brand.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function AboutPage() {
  const { isOffWhite } = useTheme();

  const coreValues = [
    {
      title: 'Technical Integrity',
      desc: 'We build real full-stack systems using sound architectural patterns, clean databases, and tested APIs—never superficial shortcuts.'
    },
    {
      title: 'Radical Transparency',
      desc: 'No hidden charges, no ambiguous sending quotas, and no exaggerated claims. Our clients always know exact deliverables and revision terms.'
    },
    {
      title: 'Scalable Engineering',
      desc: 'From starter websites to multi-tenant SaaS engines like Mailcurve, code is structured for maintainability, security, and throughput.'
    },
    {
      title: 'Outcome Alignment',
      desc: 'We measure success by business outcomes: conversion rates, mailbox inbox placement, operational efficiency, and platform stability.'
    }
  ];

  const teamRoles = [
    {
      role: 'Principal Solutions Architect',
      focus: 'Enterprise Systems & Cloud Infrastructure',
      note: 'Oversees scalable backend design, MongoDB data models, and high-volume SMTP cluster configurations.'
    },
    {
      role: 'Lead Full-Stack Engineer',
      focus: 'React SPA & Express API Integrations',
      note: 'Directs responsive component systems, RESTful API integrations, and client deliverable lifecycles.'
    },
    {
      role: 'Deliverability & Email Specialist',
      focus: 'Mailcurve Infrastructure & Compliance',
      note: 'Manages SPF/DKIM/DMARC alignment, IP warm-up protocols, and mailbox provider compliance workflows.'
    },
    {
      role: 'UI/UX & Frontend Designer',
      focus: 'Design Systems & Motion Performance',
      note: 'Crafts accessible, high-contrast digital experiences adhering to strict brand palettes and clean typography.'
    }
  ];

  return (
    <PageWrapper className="pt-32 pb-24 space-y-24">
      {/* 1. Hero / Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className={`inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 ${
            isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15' : 'bg-[#17213A]/60 border-[#2563EB]/30'
          }`}>
            <span>About DNSV Technologies</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
            isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'
          }`}>
            Connecting Ideas with Technology.
          </h1>
          <p className={`text-base sm:text-lg mt-4 leading-relaxed ${
            isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'
          }`}>
            DNSV Technologies (Digital Nexus for Software & Ventures) is a modern multi-service IT company dedicated to designing, developing, and deploying mission-critical software, custom websites, and email automation SaaS.
          </p>
        </FadeIn>
      </section>

      {/* 2. Official Brand Presentation & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className={`p-8 sm:p-12 rounded-2xl border ${
            isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15 shadow-sm' : 'bg-[#17213A]/30 border-[#17213A]'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <DNSVHorizontalLogo size="large" showTagline={true} />
                <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isOffWhite ? 'bg-[#F7F7F2] border-[#17213A]/15 text-[#17213A]/80' : 'bg-[#111111]/60 border-[#17213A] text-[#F7F7F2]/70'
                }`}>
                  <div><strong className={isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}>Legal Identity:</strong> DNSV Technologies</div>
                  <div><strong className={isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}>Full Form:</strong> Digital Nexus for Software & Ventures</div>
                  <div><strong className={isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}>Industry:</strong> Custom Software, SaaS & IT Infrastructure</div>
                  <div><strong className={isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}>Headquarters:</strong> India (Serving Global & Regional Clients)</div>
                </div>
              </div>

              <div className={`lg:col-span-7 text-xs sm:text-sm space-y-4 leading-relaxed ${
                isOffWhite ? 'text-[#17213A]/85' : 'text-[#F7F7F2]/80'
              }`}>
                <h2 className={`text-xl sm:text-2xl font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
                  Our Origin & Purpose
                </h2>
                <p>
                  DNSV Technologies was established to bridge the divide between ambitious business concepts and battle-tested digital execution. In an industry crowded with superficial templates and disconnected agencies, DNSV was founded on a unified full-stack model: building clean software, robust databases, dependable email deliverability, and responsive user interfaces under one coherent engineering philosophy.
                </p>
                <p>
                  We do not treat website development as an isolated design task, nor do we treat email marketing as a separate broadcast silo. We engineer interconnected platforms where customer actions trigger real backend workflows, transactional notifications deliver with mathematical precision, and user interfaces delight customers on every screen.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeIn delay={0.1}>
            <div className={`p-8 rounded-2xl border relative h-full ${
              isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15 shadow-sm' : 'bg-[#17213A]/25 border-[#17213A]'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>Our Mission</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'}`}>
                To empower modern businesses and tech ventures with scalable full-stack applications, transparent pricing models, and world-class email automation infrastructure that eliminate technical bottlenecks and accelerate sustainable growth.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className={`p-8 rounded-2xl border relative h-full ${
              isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15 shadow-sm' : 'bg-[#17213A]/25 border-[#17213A]'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>Our Vision</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'}`}>
                To become a globally respected digital nexus recognized for technical clarity, resilient software products like Mailcurve, and uncompromising standards of customer transparency and reliability.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
              Guiding Principles
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
              Our Core Values
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((v, i) => (
            <StaggerItem key={i}>
              <HoverCard className={`p-6 rounded-xl border h-full ${
                isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15 shadow-sm' : 'bg-[#17213A]/20 border-[#17213A]'
              }`}>
                <div className="w-8 h-8 rounded-md bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-3 text-xs font-mono font-bold">
                  0{i + 1}
                </div>
                <h3 className={`text-sm font-bold mb-2 ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>{v.title}</h3>
                <p className={`text-xs leading-relaxed ${isOffWhite ? 'text-[#17213A]/75' : 'text-[#F7F7F2]/70'}`}>{v.desc}</p>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 5. Technology Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className={`p-8 sm:p-12 rounded-2xl border ${
            isOffWhite ? 'bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm' : 'bg-[#17213A]/30 border-[#2563EB]/30'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                  Engineering Philosophy
                </span>
                <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
                  Architectural Discipline Over Fleeting Trends
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'}`}>
                  We believe that great software stands on three pillars: clean modularity, resilient database architecture, and absolute clarity of requirements.
                </p>
                <div className={`space-y-2 pt-2 text-xs ${isOffWhite ? 'text-[#17213A]/75' : 'text-[#F7F7F2]/70'}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Strict MERN stack implementation with real document schemas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Standardized REST APIs with rate limiting & data sanitization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>High-performance CSS & responsive layouts with zero layout shifts</span>
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-6 p-6 rounded-xl border space-y-3 ${
                isOffWhite ? 'bg-[#F7F7F2] border-[#17213A]/15' : 'bg-[#111111]/80 border-[#17213A]'
              }`}>
                <h3 className={`text-sm font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
                  Why Work with DNSV Technologies?
                </h3>
                <ul className={`text-xs space-y-2 leading-relaxed ${isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'}`}>
                  <li>• <strong>No Subcontracting Hand-offs:</strong> Direct collaboration with dedicated engineers and solution architects.</li>
                  <li>• <strong>Contractual Quota Clarity:</strong> Email limits and revision cycles are explicit in every agreement.</li>
                  <li>• <strong>Production-Tested SaaS Experience:</strong> We operate our own software products (Mailcurve), giving us hands-on mastery over real user demands.</li>
                  <li>• <strong>Long-Term Maintenance Commitment:</strong> We offer continuous server monitoring, security patching, and SLA retainers.</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 6. Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
              Engineering Roster
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
              Our Engineering Disciplines
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isOffWhite ? 'text-[#17213A]/75' : 'text-[#F7F7F2]/70'}`}>
              A cohesive squad of specialized engineering and delivery roles supporting your projects.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamRoles.map((member, idx) => (
            <StaggerItem key={idx}>
              <HoverCard className={`p-6 rounded-xl border flex flex-col justify-between h-full ${
                isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15 shadow-sm' : 'bg-[#17213A]/25 border-[#17213A]'
              }`}>
                <div>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-[#2563EB] mb-4 ${
                    isOffWhite ? 'bg-[#F7F7F2] border-[#2563EB]/40' : 'bg-[#111111] border-[#2563EB]/40'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>{member.role}</h3>
                  <span className="text-[11px] text-[#2563EB] font-medium block mb-3">{member.focus}</span>
                  <p className={`text-xs leading-relaxed ${isOffWhite ? 'text-[#17213A]/70' : 'text-[#F7F7F2]/65'}`}>{member.note}</p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 7. CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className={`p-8 sm:p-12 rounded-2xl border text-center ${
            isOffWhite
              ? 'bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm'
              : 'bg-[#17213A]/30 border-[#2563EB]/30'
          }`}>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
              Partner with DNSV Technologies
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed ${
              isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'
            }`}>
              Have a project or platform requirement? Let us analyze your scope and provide a structured technical proposal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/request-quote"
                className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
              >
                Request a Project Quotation
              </Link>
              <Link
                to="/contact"
                className={`px-6 py-3 text-xs font-semibold rounded-lg border transition-all hover:-translate-y-0.5 ${
                  isOffWhite
                    ? 'bg-[#F7F7F2] text-[#17213A] border-[#17213A]/20 hover:border-[#2563EB]'
                    : 'bg-[#17213A] text-[#F7F7F2] border-[#F7F7F2]/10 hover:bg-[#17213A]/80'
                }`}
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </PageWrapper>
  );
}
