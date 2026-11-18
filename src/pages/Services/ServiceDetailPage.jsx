import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Bookmark
} from 'lucide-react';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';
import { apiService } from '../../services/api.js';

const SERVICES_DATA = {
  'web-development': {
    title: 'Website Design & Development',
    category: 'Digital Web Presence',
    headline: 'High-Performance, Responsive Websites Tailored for Modern Business Growth.',
    overview: 'DNSV Technologies designs and develops bespoke web experiences that combine aesthetic discipline, fast loading speeds, mobile-first responsiveness, and structured search engine optimization. We build on modern React frameworks with modular component architectures.',
    features: [
      { title: 'Custom UI/UX Design Systems', desc: 'Crafted from the ground up to reflect brand identity using clean typographic hierarchy and consistent visual systems.' },
      { title: 'Full-Stack React Implementation', desc: 'Single-page applications and multi-page corporate websites with instant page transitions and zero layout shifts.' },
      { title: 'Technical On-Page SEO', desc: 'Semantic HTML5, dynamic OpenGraph cards, Twitter cards, XML sitemaps, and Schema.org structured data built in.' },
      { title: 'Responsive Across All Viewports', desc: 'Tested across 320px mobile screens, tablets, standard laptops, and 1920px widescreen desktop monitors.' },
      { title: 'Speed & Asset Optimization', desc: 'Sub-1.5 second loading performance via modern asset bundling, lazy loading, and optimized web font loading.' },
      { title: 'Enquiry & Form Automation', desc: 'Integrated contact and quote capture connected directly to backend validation and real-time email alerts.' }
    ],
    benefits: [
      'Elevated brand perception among prospective enterprise clients',
      'Higher organic search snippet visibility with structured data',
      'Maximized conversion rates through clean layout flows and clear CTAs',
      'Ownership of pristine, maintainable code without proprietary lock-in'
    ],
    process: [
      'Requirements Analysis & Content Architecture',
      'Wireframing & Visual Component Design',
      'React & Tailwind CSS Frontend Development',
      'Backend API & Form Handling Integration',
      'Cross-Browser QA, SEO Audit & Production Launch'
    ],
    technologies: ['React.js', 'Tailwind CSS', 'Vite', 'Express.js', 'Node.js', 'Schema.org JSON-LD'],
    faqs: [
      { q: 'What is included in DNSV website development plans?', a: 'All our website plans include custom responsive UI design, mobile optimization, interactive forms, on-page SEO setup, and structured revision cycles.' },
      { q: 'Do you use page builders like WordPress or Wix?', a: 'No. We develop clean codebases using React, Tailwind CSS, and Node.js for superior speed, security, and scalability.' }
    ],
    related: [
      { title: 'Email Marketing & Automation', slug: '/services/email-marketing' },
      { title: 'Custom Software Development', slug: '/services/custom-software' }
    ]
  },
  'custom-software': {
    title: 'Custom Software Development',
    category: 'Enterprise Applications',
    headline: 'Tailored Business Software, Operational Dashboards & SaaS Architectures.',
    overview: 'When off-the-shelf software falls short, DNSV Technologies engineers custom business applications tailored specifically to your operational workflows. We build administrative dashboards, CRM tools, inventory tracking systems, and multi-tenant SaaS foundations with clean Express APIs and MongoDB databases.',
    features: [
      { title: 'Bespoke CRM & Pipeline Systems', desc: 'Consolidate lead tracking, customer interactions, quotation histories, and operational notes into a single secure interface.' },
      { title: 'Administrative & Analytics Dashboards', desc: 'Real-time metrics, automated status reporting, data filtering, and CSV export capabilities.' },
      { title: 'Multi-Tenant SaaS Foundation', desc: 'Scalable data isolation, subscription management hooks, and user account permission roles.' },
      { title: 'Business Workflow Automation', desc: 'Automate manual handoffs, status triggers, invoice generation, and internal notification dispatches.' },
      { title: 'Granular Access Control (RBAC)', desc: 'Role-based access permissions ensuring staff only access authorized data tiers.' },
      { title: 'Robust Document Databases', desc: 'Optimized MongoDB schema designs with indexing strategies designed for high query performance.' }
    ],
    benefits: [
      'Elimination of repetitive manual spreadsheet workflows',
      'Centralized business intelligence and auditability',
      'Total control over software features without recurring per-seat licensing penalties',
      'Scalable architecture ready for enterprise workload expansion'
    ],
    process: [
      'Business Process Discovery & Data Flow Mapping',
      'Database Schema & REST API Architecture Specification',
      'Modular Full-Stack Development (React + Node.js + MongoDB)',
      'Security Hardening, Rate Limiting & User Acceptance Testing',
      'Production Deployment, Data Migration & SLA Maintenance'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'React', 'Tailwind CSS'],
    faqs: [
      { q: 'Can you integrate our custom software with third-party tools?', a: 'Yes. We build custom API connectors for CRMs, payment processors, email services, and cloud storage.' },
      { q: 'Do we own the intellectual property of the custom software?', a: 'Yes. Upon project completion and sign-off, all custom codebase IP belongs entirely to your business.' }
    ],
    related: [
      { title: 'API Development & Integration', slug: '/services/api-development' },
      { title: 'Website Design & Development', slug: '/services/web-development' }
    ]
  },
  'email-marketing': {
    title: 'Email Marketing & Automation',
    category: 'Outreach & Infrastructure',
    headline: 'High-Volume Email Delivery, Mautic Deployments & Automated Workflows.',
    overview: 'DNSV Technologies provides end-to-end email marketing engineering. We deploy and tune open-source marketing automation systems (such as Mautic), configure high-reputation SMTP dispatch clusters, and build automated behavioral nurture sequences. We also operate our proprietary Mailcurve SaaS platform.',
    features: [
      { title: 'Mautic Deployment & Hardening', desc: 'Full installation, database optimization, cron task configuration, and security tuning of self-hosted Mautic servers.' },
      { title: 'SMTP Node & IP Clustering', desc: 'Integration with enterprise delivery backends, IP pool warming, and throttling controls.' },
      { title: 'Cryptographic Authentication Alignment', desc: 'Complete DNS records configuration: SPF, DKIM, DMARC, MX, and BIMI protocols for inbox trust.' },
      { title: 'Behavioral Automated Workflows', desc: 'Drip campaigns triggered by website actions, user status updates, or date-based milestones.' },
      { title: 'Audience Segmentation & Hygiene', desc: 'Dynamic filtering by engagement score, geography, and bounce risk classification.' },
      { title: 'Mailcurve Platform Access', desc: 'Turnkey access to our proprietary email marketing SaaS with predictable daily and monthly send quotas.' }
    ],
    benefits: [
      'Maximized primary inbox placement rate through strict DNS compliance',
      'Reduced cost per thousand emails sent compared to legacy marketing clouds',
      'Continuous automated lead nurturing that operates 24/7',
      'Protection of domain sender reputation with built-in bounce controls'
    ],
    process: [
      'Domain Reputation & DNS Audit (SPF / DKIM / DMARC)',
      'Server & Mautic / Mailcurve Infrastructure Setup',
      'List Cleaning, Validation & Initial IP Warm-Up Protocol',
      'Campaign & Automation Sequence Build',
      'Deliverability Monitoring & Sender Score Maintenance'
    ],
    technologies: ['Mailcurve SaaS', 'Mautic', 'Postfix / SMTP', 'DNS (SPF, DKIM, DMARC)', 'REST Webhooks'],
    faqs: [
      { q: 'Do you guarantee 100% inbox placement?', a: 'No ethical email engineer guarantees 100% inboxing because final filtering depends on recipient mail servers and engagement. We provide the highest possible technical foundation: verified DNS, warm IPs, and clean list hygiene.' },
      { q: 'What are the email sending limits?', a: 'Our Mailcurve plans clearly define daily and monthly sending caps (e.g., 500/day to 10,000/day). Enterprise clusters support customized throughput.' }
    ],
    related: [
      { title: 'Mailcurve Product Details', slug: '/products/mailcurve' },
      { title: 'Email Validator Engine', slug: '/products/email-validator' }
    ]
  },
  'api-development': {
    title: 'API Development & Integration',
    category: 'Backend Architecture',
    headline: 'Secure RESTful APIs, Webhook Pipelines & Payment Gateway Integrations.',
    overview: 'Modern businesses depend on fluid data exchange between internal platforms and third-party SaaS ecosystems. DNSV Technologies engineers secure, well-documented REST APIs, webhook ingestion engines, and payment processor integrations designed for high concurrency and data consistency.',
    features: [
      { title: 'RESTful API Architecture', desc: 'Clean resource-oriented routing with consistent JSON payloads, HTTP status codes, and error semantics.' },
      { title: 'Payment Gateway Integration', desc: 'Seamless integration with Razorpay, Stripe, and PayPal with webhook signature verification.' },
      { title: 'Idempotent Webhook Handlers', desc: 'Resilient event processing that gracefully absorbs network blips and prevents duplicate executions.' },
      { title: 'Rate Limiting & Threat Shielding', desc: 'IP-based throttling, request validation, and helmet header protection against automated abuse.' },
      { title: 'CRM & Cloud Tool Connectors', desc: 'Bidirectional data sync between websites, Mailcurve, Google Workspace, and operational databases.' },
      { title: 'Interactive Documentation', desc: 'Clear endpoint specifications with example request/response schemas for effortless developer onboarding.' }
    ],
    benefits: [
      'Seamless automation between disparate software tools',
      'Rock-solid transaction security with cryptographically verified callbacks',
      'Consistent API performance under high request concurrency',
      'Reduced integration friction for future third-party software additions'
    ],
    process: [
      'Data Contract & Endpoint Specification',
      'Middleware Development (Authentication & Rate Limiting)',
      'Controller & Service Layer Implementation',
      'Integration Testing with Sandbox Environments',
      'Production Deployment with Real-Time Logging'
    ],
    technologies: ['Express.js', 'Node.js', 'MongoDB', 'HMAC SHA256', 'Axios', 'CORS & Helmet'],
    faqs: [
      { q: 'Can you integrate payment gateways for one-time and recurring subscriptions?', a: 'Yes. We implement both one-time checkout flows and automated recurring subscription webhook listeners.' }
    ],
    related: [
      { title: 'Custom Software Development', slug: '/services/custom-software' },
      { title: 'Technical Support & Maintenance', slug: '/services/technical-support' }
    ]
  },
  'technical-support': {
    title: 'Technical Support & Maintenance',
    category: 'DevOps & Reliability',
    headline: 'Proactive Linux Server Administration, Security Patching & SLA Retainers.',
    overview: 'Deploying software is only half the journey. DNSV Technologies provides comprehensive technical maintenance, server hardening, database monitoring, automated backups, and guaranteed SLA bug resolution to keep your digital assets operational around the clock.',
    features: [
      { title: 'Linux Cloud Server Administration', desc: 'Ubuntu/Debian VPS configuration, Nginx reverse proxy management, and memory/CPU resource optimization.' },
      { title: 'Automated Database Backups', desc: 'Scheduled MongoDB snapshot exports and encrypted off-site storage to protect against accidental data loss.' },
      { title: 'Security Audits & Patching', desc: 'Proactive operating system security updates, package vulnerability patching, and firewall hardening.' },
      { title: 'Query & Index Optimization', desc: 'Analyzing slow database queries, compound indexing, and reducing API response latency.' },
      { title: 'Rapid Bug Resolution', desc: 'Dedicated engineering support with guaranteed response times for unexpected application errors.' },
      { title: 'SSL & Domain Maintenance', desc: 'Automated Let’s Encrypt certificate renewals, DNS records maintenance, and health monitoring.' }
    ],
    benefits: [
      'Peace of mind knowing your servers and software are monitored continuously',
      'Near-zero downtime through proactive bottleneck identification',
      'Protection against security vulnerabilities and data loss',
      'Predictable monthly maintenance costs without sudden emergency fees'
    ],
    process: [
      'Infrastructure Audit & Health Baseline Inspection',
      'Automated Monitoring & Snapshot Backup Configuration',
      'Security Hardening & Access Control Enforcement',
      'Ongoing Monthly Maintenance & Performance Tuning',
      'Quarterly Architectural Review & Capacity Planning'
    ],
    technologies: ['Ubuntu / Linux', 'Nginx', 'MongoDB Ops', 'Bash Automation', 'SSL / TLS', 'Node.js Diagnostics'],
    faqs: [
      { q: 'What is the response time under a maintenance retainer?', a: 'We offer standard and priority SLAs ranging from 2 hours for critical production blockers to 24 hours for routine feature adjustments.' }
    ],
    related: [
      { title: 'Website Design & Development', slug: '/services/web-development' },
      { title: 'Custom Software Development', slug: '/services/custom-software' }
    ]
  }
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const resolvedSlug = SERVICES_DATA[slug] ? slug : 'web-development';
  const service = SERVICES_DATA[resolvedSlug];
  const { user, isAuthenticated, openLoginBox, updateSessionUser } = useUserAuth();

  const isSaved = Boolean(
    user?.savedItems?.some((i) => i.itemType === 'service' && i.itemId === resolvedSlug)
  );

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    try {
      const res = await apiService.toggleSavedItem({
        itemType: 'service',
        itemId: resolvedSlug,
        title: service.title,
        category: service.category,
        url: `/services/${resolvedSlug}`
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
      {/* 1. Detail Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border bg-[#FFFFFF] border-[#17213A]/15">
            <span>{service.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-[#17213A]/85">
            {service.headline}
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
                Login / Register to Unlock Specs & Enquire
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
          <FadeIn className={isAuthenticated ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <div className="p-8 rounded-2xl border space-y-4 bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
              <h2 className="text-xl font-bold text-[#111111]">Service Overview</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#17213A]/80">
                {service.overview}
              </p>
              {isAuthenticated && (
                <div className="pt-4 border-t border-[#17213A]/15">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-3">Core Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((t, idx) => (
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

          {isAuthenticated && (
            <FadeIn delay={0.15} className="lg:col-span-5">
              <div className="p-8 rounded-2xl border space-y-4 bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
                <h3 className="text-base font-bold flex items-center gap-2 text-[#111111]">
                  <Shield className="w-4 h-4 text-[#2563EB]" />
                  Direct Business Outcomes
                </h3>
                <ul className="space-y-3 text-xs leading-relaxed text-[#17213A]/80">
                  {service.benefits.map((benefit, idx) => (
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
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] block mb-2">
                  Scope & Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                  Key Technical Features
                </h2>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feat, idx) => (
                <StaggerItem key={idx}>
                  <HoverCard className="p-6 rounded-xl border h-full bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                    <span className="font-mono text-xs text-[#2563EB] font-bold block mb-2">0{idx + 1}</span>
                    <h3 className="text-sm font-bold mb-2 text-[#111111]">{feat.title}</h3>
                    <p className="text-xs leading-relaxed text-[#17213A]/75">{feat.desc}</p>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>

          {/* 4. Development Process */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="p-8 sm:p-12 rounded-2xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold mb-8 text-[#111111]">
                  Execution Lifecycle for {service.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {service.process.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl border flex flex-col justify-between bg-[#F7F7F2] border-[#17213A]/15">
                      <span className="font-mono text-lg font-extrabold text-[#2563EB] mb-2">Phase 0{idx + 1}</span>
                      <p className="text-xs font-medium leading-relaxed text-[#17213A]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </section>

          {/* 5. FAQs & Related Services */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <FadeIn className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-[#111111]">Service Questions</h3>
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                    <h4 className="text-xs font-bold text-[#2563EB] mb-1">{faq.q}</h4>
                    <p className="text-xs leading-relaxed text-[#17213A]/80">{faq.a}</p>
                  </div>
                ))}
              </FadeIn>

              <FadeIn delay={0.1} className="lg:col-span-5">
                <div className="p-6 rounded-xl border bg-[#FFFFFF] border-[#17213A]/15 shadow-sm">
                  <h3 className="text-sm font-bold mb-4 text-[#111111]">Complementary Services</h3>
                  <div className="flex flex-col gap-3">
                    {service.related.map((rel, idx) => (
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
            </div>
          </section>

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

