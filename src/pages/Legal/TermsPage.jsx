import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '../../constants/brand.js';
import { PageWrapper, FadeIn } from '../../components/animations/MotionComponents.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function TermsPage() {
  const { isOffWhite } = useTheme();

  return (
    <PageWrapper className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <FadeIn>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
          Terms & Conditions of Service
        </h1>
        <p className={`text-xs mt-2 ${isOffWhite ? 'text-[#17213A]/60' : 'text-[#F7F7F2]/60'}`}>
          Effective Date: {new Date().getFullYear()} · DNSV Technologies (Digital Nexus for Software & Ventures)
        </p>
      </FadeIn>

      <FadeIn className={`space-y-6 text-xs sm:text-sm leading-relaxed border-t pt-6 ${
        isOffWhite ? 'text-[#17213A]/85 border-[#17213A]/15' : 'text-[#F7F7F2]/80 border-[#17213A]'
      }`}>
        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            1. Scope of Development Services
          </h2>
          <p>
            Website design and custom software development engagements are delivered in accordance with agreed milestone statements of work. Each package includes explicitly defined page limits and structured revision cycles. Revisions beyond contracted cycles or substantive changes to foundational database schemas are subject to separate estimation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            2. Email Marketing Quotas & Fair-Use Policy
          </h2>
          <p>
            Mailcurve subscription plans delineate dispatch capacity quotas (e.g. daily and monthly limits). Sending limits represent technical node capacity and do not constitute an inbox delivery guarantee. Users must maintain valid SPF, DKIM, and DMARC alignment, keep hard bounces below 3%, and comply with international anti-spam standards (CAN-SPAM, GDPR).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            3. Third-Party Costs & Infrastructure
          </h2>
          <p>
            Unless explicitly documented in an enterprise statement of work, domain registration fees, cloud hosting server invoices, paid third-party API keys, and payment gateway transaction fees are directly payable by the client to respective vendors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            4. Intellectual Property
          </h2>
          <p>
            Upon settlement of final development fees, bespoke client codebase IP is transferred to the client organization. DNSV Technologies retains proprietary rights to its underlying core libraries, Mailcurve SaaS engine, and internal scaffolding tools.
          </p>
        </section>
      </FadeIn>
    </PageWrapper>
  );
}
