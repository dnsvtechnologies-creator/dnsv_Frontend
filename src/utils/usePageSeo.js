import { useEffect } from 'react';

const SITE_SUFFIX = 'DNSV Technologies';

const ROUTE_META = {
  '/': {
    title: 'DNSV Technologies — Digital Nexus for Software & Ventures',
    description:
      'Connecting Ideas with Technology. DNSV Technologies builds modern websites, custom software, Mailcurve email marketing automation SaaS, and scalable APIs.'
  },
  '/about': {
    title: `About Us — ${SITE_SUFFIX}`,
    description:
      'Learn about DNSV Technologies: our engineering standards, full-stack software capabilities, SaaS ventures, and mission to connect ideas with technology.'
  },
  '/services': {
    title: `Software & Web Engineering Services — ${SITE_SUFFIX}`,
    description:
      'Explore custom website development, SaaS software engineering, Mailcurve email automation, API integrations, and ongoing technical support.'
  },
  '/products': {
    title: `Proprietary SaaS Products — ${SITE_SUFFIX}`,
    description:
      'Discover DNSV proprietary software platforms including Mailcurve email automation SaaS and enterprise engineering tools.'
  },
  '/pricing': {
    title: `Transparent Plans & Pricing — ${SITE_SUFFIX}`,
    description:
      'Compare INR pricing plans for Mailcurve email marketing campaigns, custom website builds, and combined enterprise growth packages.'
  },
  '/portfolio': {
    title: `Case Studies & Portfolio — ${SITE_SUFFIX}`,
    description:
      'Explore shipped web platforms, SaaS dashboards, email infrastructure, and enterprise software systems engineered by DNSV Technologies.'
  },
  '/contact': {
    title: `Contact Us — ${SITE_SUFFIX}`,
    description:
      'Get in touch with the DNSV Technologies engineering team for project consultations, partnership enquiries, or support.'
  },
  '/request-quote': {
    title: `Request a Project Quote — ${SITE_SUFFIX}`,
    description:
      'Submit your project requirements, timeline, and budget range to receive a tailored engineering proposal from DNSV Technologies.'
  },
  '/faq': {
    title: `Frequently Asked Questions — ${SITE_SUFFIX}`,
    description:
      'Answers to common questions about DNSV custom web development, Mailcurve email marketing quotas, pricing, security, and support SLAs.'
  },
  '/blog': {
    title: `Engineering Insights & Blog — ${SITE_SUFFIX}`,
    description:
      'Technical articles and guides on email deliverability, scalable web architecture, REST APIs, and SaaS engineering from DNSV Technologies.'
  },
  '/privacy': {
    title: `Privacy Policy — ${SITE_SUFFIX}`,
    description:
      'Read how DNSV Technologies collects, verifies, protects, and manages client account and inquiry information.'
  },
  '/terms': {
    title: `Terms of Service — ${SITE_SUFFIX}`,
    description:
      'Review the terms of service governing DNSV Technologies software engineering deliverables, SaaS plans, and support policies.'
  },
  '/portal': {
    title: `Client Portal — ${SITE_SUFFIX}`,
    description: 'Track quote requests, contact forms, drafts, and account settings in your DNSV Client Portal.',
    robots: 'noindex, nofollow'
  },
  '/admin': {
    title: `Admin Console — ${SITE_SUFFIX}`,
    description: 'Restricted administration portal for DNSV Technologies.',
    robots: 'noindex, nofollow'
  }
};

function upsertMeta(attrName, attrValue, content) {
  let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function usePageSeo(pathname = '/') {
  useEffect(() => {
    const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    let meta = ROUTE_META[cleanPath];

    if (!meta) {
      if (cleanPath.startsWith('/services/')) {
        const label = cleanPath.split('/').pop().replace(/-/g, ' ');
        meta = {
          title: `${label.replace(/\b\w/g, (c) => c.toUpperCase())} Service — ${SITE_SUFFIX}`,
          description: `Detailed engineering capabilities, deliverables, and architecture for ${label} at DNSV Technologies.`
        };
      } else if (cleanPath.startsWith('/products/')) {
        const label = cleanPath.split('/').pop().replace(/-/g, ' ');
        meta = {
          title: `${label.replace(/\b\w/g, (c) => c.toUpperCase())} Platform — ${SITE_SUFFIX}`,
          description: `Explore features, technical policies, and onboarding details for ${label} by DNSV Technologies.`
        };
      } else if (cleanPath.startsWith('/blog/')) {
        const label = cleanPath.split('/').pop().replace(/-/g, ' ');
        meta = {
          title: `${label.replace(/\b\w/g, (c) => c.toUpperCase())} — ${SITE_SUFFIX} Blog`,
          description: `Read engineering insights on ${label} from DNSV Technologies.`
        };
      } else {
        meta = ROUTE_META['/'];
      }
    }

    const origin = window.location.origin;
    const canonicalUrl = `${origin}${cleanPath}`;

    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', meta.robots || 'index, follow');
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertLink('canonical', canonicalUrl);
  }, [pathname]);
}
