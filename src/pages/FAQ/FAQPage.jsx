import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/MotionComponents.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const FAQ_SECTIONS = [
  {
    category: 'General Company Questions',
    items: [
      {
        q: 'What does DNSV Technologies stand for?',
        a: 'DNSV stands for Digital Nexus for Software & Ventures. We are an international multi-service IT company connecting ambitious ideas with dependable technology architectures.'
      },
      {
        q: 'Is DNSV Technologies strictly a website development agency?',
        a: 'No. While website design and engineering is one of our key pillars, DNSV is a multi-discipline technology company specializing in custom software, SaaS product engineering (such as Mailcurve), email deliverability infrastructure, API integrations, and maintenance retainers.'
      },
      {
        q: 'Where is DNSV Technologies based and whom do you serve?',
        a: 'We are headquartered in India and operate globally, delivering software solutions and SaaS infrastructure for commercial enterprises, emerging ventures, and growing brands worldwide.'
      }
    ]
  },
  {
    category: 'Website Development',
    items: [
      {
        q: 'What stack do you use for website development?',
        a: 'We build responsive, ultra-fast websites using modern React.js, Tailwind CSS, Vite, and Node.js backends. We do not use rigid proprietary site builders or bloated third-party template plugins.'
      },
      {
        q: 'Are DNSV websites search-engine optimized (SEO)?',
        a: 'Yes. Every website build includes semantic HTML hierarchy, dynamic OpenGraph social share cards, Twitter cards, XML sitemaps, robots.txt, and Schema.org structured data (JSON-LD).'
      },
      {
        q: 'How many revisions are included in website packages?',
        a: 'Our Starter Website package includes 1 revision cycle, the Business Website includes 2 revision cycles, and the Professional Website includes 3 revision cycles. Enterprise projects are structured around tailored milestone sign-offs.'
      }
    ]
  },
  {
    category: 'Email Marketing & Mailcurve',
    items: [
      {
        q: 'What is Mailcurve and what are its dispatch limits?',
        a: 'Mailcurve is our proprietary SaaS email marketing and automation platform. Plans are structured with defined daily and monthly capacity caps (e.g., Starter: 500/day, 15k/mo up to Pro: 10,000/day, 300k/mo, and customized Enterprise clusters).'
      },
      {
        q: 'Do your email plans guarantee 100% inbox delivery?',
        a: 'No reputable email engineer guarantees 100% inbox placement because delivery is ultimately determined by recipient mailbox providers (Google, Microsoft, Yahoo) based on domain reputation and content signals. We configure complete DNS authentication (SPF, DKIM, DMARC) and deliverability controls to maximize sender trust.'
      },
      {
        q: 'What sending provider approval and bounce policies apply?',
        a: 'Users must verify domain ownership via DNS records. Under our fair-use policy, lists must maintain a hard bounce rate below 3% and spam complaint rate below 0.1% to preserve infrastructure IP reputation.'
      }
    ]
  },
  {
    category: 'Pricing & Billing',
    items: [
      {
        q: 'How does DNSV distinguish one-time versus recurring charges?',
        a: 'Website development packages are strictly one-time charges with transparent milestone delivery. Mailcurve email marketing packages are monthly recurring subscriptions. Our Complete Combo packages combine one-time website development with the first month of email sending, with recurring email fees billed starting Month 2.'
      },
      {
        q: 'Are domain registration and web hosting fees included?',
        a: 'Domain names, cloud hosting servers, and paid external third-party API accounts are billed directly by their respective providers unless explicitly contracted as an ongoing managed retainer.'
      }
    ]
  },
  {
    category: 'Project Process & Support',
    items: [
      {
        q: 'How do project milestones and sign-offs work?',
        a: 'We operate in five disciplined phases: Discovery & Scope specification, UI/UX Wireframing, Full-Stack Engineering, Quality Assurance & Deliverability testing, followed by Production Deployment and SLA support.'
      },
      {
        q: 'What technical support retainers do you offer?',
        a: 'We provide ongoing server administration, database backup automation, security vulnerability patching, and bug resolution retainers with guaranteed SLA response times.'
      }
    ]
  }
];

export default function FAQPage() {
  const { isOffWhite } = useTheme();
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <PageWrapper className="pt-32 pb-24 space-y-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className={`inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 ${
            isOffWhite ? 'bg-[#FFFFFF] border-[#17213A]/15' : 'bg-[#17213A]/60 border-[#2563EB]/30'
          }`}>
            <span>Knowledge Base</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
            isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'
          }`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-base sm:text-lg mt-4 leading-relaxed ${
            isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'
          }`}>
            Detailed technical clarifications on our services, Mailcurve email SaaS, website packages, deliverability policies, and engagement models.
          </p>
        </FadeIn>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <StaggerContainer stagger={0.1} className="space-y-12">
          {FAQ_SECTIONS.map((section, catIdx) => (
            <StaggerItem key={catIdx} className="space-y-4">
              <h2 className={`text-lg font-bold flex items-center gap-2 border-b pb-2 ${
                isOffWhite ? 'text-[#111111] border-[#17213A]/15' : 'text-[#F7F7F2] border-[#17213A]'
              }`}>
                <span className="text-xs font-mono text-[#2563EB]">0{catIdx + 1}.</span>
                <span>{section.category}</span>
              </h2>

              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openItems[key];
                  const panelId = `faq-panel-${catIdx}-${itemIdx}`;

                  return (
                    <div
                      key={itemIdx}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        isOffWhite
                          ? 'bg-[#FFFFFF] border-[#17213A]/15 shadow-sm'
                          : 'bg-[#17213A]/25 border-[#17213A]'
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className={`w-full text-left px-5 py-4 flex items-center justify-between text-sm font-semibold transition-colors cursor-pointer ${
                          isOffWhite
                            ? 'text-[#111111] hover:text-[#2563EB]'
                            : 'text-[#F7F7F2] hover:text-[#2563EB]'
                        }`}
                        onClick={() => toggleItem(catIdx, itemIdx)}
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#2563EB] transition-transform duration-200 shrink-0 ml-4 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div
                          id={panelId}
                          role="region"
                          className={`px-5 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                            isOffWhite
                              ? 'text-[#17213A]/80 border-[#17213A]/10'
                              : 'text-[#F7F7F2]/75 border-[#17213A]/60'
                          }`}
                        >
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className={`p-8 sm:p-12 rounded-2xl border text-center ${
          isOffWhite ? 'bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm' : 'bg-[#17213A]/30 border-[#2563EB]/30'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${
            isOffWhite ? 'text-[#111111]' : 'text-[#F7F7F2]'
          }`}>
            Have a Specific Question Not Listed Here?
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed ${
            isOffWhite ? 'text-[#17213A]/80' : 'text-[#F7F7F2]/75'
          }`}>
            Reach out to our engineering team directly or request a consultation regarding your platform architecture.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              Contact Engineering Desk
            </Link>
            <Link
              to="/request-quote"
              className={`px-6 py-3 text-xs font-semibold rounded-lg border transition-all active:scale-95 ${
                isOffWhite
                  ? 'bg-[#F7F7F2] text-[#111111] border-[#17213A]/20 hover:bg-[#17213A]/5'
                  : 'bg-[#17213A] hover:bg-[#17213A]/80 text-[#F7F7F2] border-[#F7F7F2]/10'
              }`}
            >
              Request a Project Quote
            </Link>
          </div>
        </FadeIn>
      </section>
    </PageWrapper>
  );
}
