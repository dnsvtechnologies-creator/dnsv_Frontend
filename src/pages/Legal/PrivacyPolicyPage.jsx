import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '../../constants/brand.js';
import { PageWrapper, FadeIn } from '../../components/animations/MotionComponents.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function PrivacyPolicyPage() {
  const { isOffWhite } = useTheme();

  return (
    <PageWrapper className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <FadeIn>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
          Privacy Policy
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
            1. Information Collection & Usage
          </h2>
          <p>
            DNSV Technologies collects contact details (name, business email, phone number, and organization name) solely to respond to project enquiries, deliver contracted software and website development services, and provision Mailcurve email platform accounts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            2. Data Storage & MongoDB Security
          </h2>
          <p>
            All submitted enquiries and customer communications are stored in isolated MongoDB document databases protected by encrypted connections and server-side rate-limiting middlewares. We do not sell, rent, or lease prospective client information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            3. Mailcurve SaaS Data Privacy
          </h2>
          <p>
            When utilizing Mailcurve email marketing services, subscriber lists and campaign content remain the exclusive property of the client account. List hygiene and verification tools access address strings solely for deliverability computation and DNS handshake verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className={`text-base font-bold ${isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'}`}>
            4. Contact & Inquiries
          </h2>
          <p>
            For privacy inquiries or data removal requests, please contact our compliance desk at{' '}
            <a href={`mailto:${BRAND.contact.email}`} className="text-[#2563EB] font-semibold hover:underline">
              {BRAND.contact.email}
            </a>.
          </p>
        </section>
      </FadeIn>
    </PageWrapper>
  );
}
