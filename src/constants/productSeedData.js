export const INITIAL_PRODUCTS = [
  {
    id: 'product-mailcurve',
    slug: 'mailcurve',
    name: 'Mailcurve',
    tagline: 'Email Marketing & Automation SaaS Platform',
    categoryLabel: 'Email Automation Platform',
    statusBadge: 'Live SaaS',
    shortOverview:
      'Mailcurve is an email marketing and automation platform designed to schedule campaigns, manage dynamic audience segments, and monitor delivery analytics with granular volume control.',
    iconKey: 'mail',
    isHighlighted: true,
    hasInteractiveValidator: false,
    ctaLabel: 'Explore Mailcurve Platform',
    ctaLink: '/pricing',
    pricingHint: 'View Plans (From ₹799/mo)',
    summaryBullets: [
      'Campaign scheduling & automated drip sequences',
      'Dynamic subscriber segmentation with behavioral tags',
      'Transparent daily and monthly sending quotas',
      'Real-time delivery, bounce, and open rate tracking'
    ],
    capabilitiesSectionTag: 'Engineered for Deliverability',
    capabilitiesSectionTitle: 'Core Mailcurve Features',
    capabilities: [
      {
        iconKey: 'send',
        title: 'Campaign Management',
        desc: 'Create, draft, preview, and dispatch responsive email broadcasts across targeted audience lists with automated unsubscribe handling.'
      },
      {
        iconKey: 'users',
        title: 'Subscriber Management',
        desc: 'Import contacts via CSV or API, organize into custom lists, enrich contact profiles with custom metadata fields, and manage opt-out states.'
      },
      {
        iconKey: 'clock',
        title: 'Email Scheduling',
        desc: 'Set campaigns to dispatch at optimal local recipient hours, throttle sending rates per hour, and manage multi-stage broadcast calendars.'
      },
      {
        iconKey: 'layers',
        title: 'Automation Workflows',
        desc: 'Visual workflow sequences that trigger multi-step drip emails based on signup dates, link clicks, status changes, or webhooks.'
      },
      {
        iconKey: 'barChart',
        title: 'Audience Segmentation',
        desc: 'Filter subscribers by engagement activity, domain type, opening frequency, or geography for targeted, high-relevance messaging.'
      },
      {
        iconKey: 'server',
        title: 'Campaign Analytics',
        desc: 'Track delivery percentages, unique open rates, link click-through heatmaps, unsubscribe counts, and bounce classifications in real time.'
      }
    ],
    policyTag: 'Infrastructure & Deliverability Policies',
    policyTitle: 'Honest Deliverability: Sending Limits vs. Inbox Guarantees',
    policySummary:
      'Mailcurve plans provide clearly defined sending limits across Starter, Basic, and Growth monthly tiers (or custom quotas configured by administration). We do not advertise misleading "unlimited sending" or false "100% inbox guarantees", because mailbox providers (Gmail, Microsoft, Yahoo) decide inbox placement based on sender authentication and domain reputation.',
    highlights: [
      {
        title: 'DNS Record Verification',
        desc: 'Requires authenticating your domain via SPF, DKIM, and DMARC records.'
      },
      {
        title: 'Fair-Use Hygiene',
        desc: 'Hard bounce rates must stay below 3% and complaint rates below 0.1%.'
      },
      {
        title: 'Opt-In Policy',
        desc: 'Recipient consent required; bought or scraped spam lists are prohibited.'
      }
    ],
    bottomCtaTitle: 'Start Scaling Your Email Operations with Mailcurve',
    bottomCtaDesc:
      'Choose from transparent Starter (₹799/mo), Basic (₹1,499/mo), or Growth (₹2,999/mo) monthly plans tailored for predictable sending.',
    bottomCtaButtonText: 'Review Mailcurve Pricing Plans',
    bottomCtaButtonLink: '/pricing',
    order: 1
  },
  {
    id: 'product-email-validator',
    slug: 'email-validator',
    name: 'Email Validator',
    tagline: 'High-Precision List Hygiene & Verification Engine',
    categoryLabel: 'List Hygiene & Deliverability',
    statusBadge: 'In Development',
    shortOverview:
      'An intelligent multi-layer verification engine that analyzes email lists to eliminate invalid mailboxes, prevent hard bounces, and safeguard domain reputation prior to dispatch.',
    iconKey: 'shieldCheck',
    isHighlighted: false,
    hasInteractiveValidator: true,
    ctaLabel: 'View Architecture & Demo',
    ctaLink: '/contact?service=Email%20Validation%20Solutions',
    pricingHint: 'Interactive Prototype Included',
    summaryBullets: [
      'Single email lookup & bulk CSV batch processing',
      'Valid, Invalid, Risky, and Unknown status classification',
      'Disposable mailbox and spam trap detection',
      'Downloadable scrubbed CSV reports & REST API'
    ],
    capabilitiesSectionTag: 'Verification Specifications',
    capabilitiesSectionTitle: 'Comprehensive Verification Layers',
    capabilities: [
      {
        iconKey: 'fileSpreadsheet',
        title: 'Bulk CSV Validation',
        desc: 'Upload lists containing up to 100,000 addresses. Asynchronous background workers analyze lists without timeout interruptions.'
      },
      {
        iconKey: 'shieldCheck',
        title: 'Four-Tier Classification',
        desc: 'Every address is classified as Valid (safe to send), Invalid (hard bounce), Risky (disposable / accept-all), or Unknown.'
      },
      {
        iconKey: 'terminal',
        title: 'REST API Integration',
        desc: 'Verify leads synchronously at form submission using lightweight REST API endpoints, blocking fake emails before database entry.'
      }
    ],
    policyTag: 'List Hygiene Standards',
    policyTitle: 'Proactive Bounce Protection Before Campaign Dispatch',
    policySummary:
      'Running recipient lists through syntax parsing, disposable-domain blacklists, role-address detection, and MX handshake checks significantly lowers hard bounces before your domain reputation is impacted.',
    highlights: [
      {
        title: 'Syntax & Format Audit',
        desc: 'Strict RFC address syntax validation and typo detection at ingestion.'
      },
      {
        title: 'MX & Handshake Probe',
        desc: 'Live domain MX record verification and SMTP handshake status classification.'
      },
      {
        title: 'Disposable Guard',
        desc: 'Flags temporary throwaway domains and high-risk role accounts automatically.'
      }
    ],
    bottomCtaTitle: 'Interested in Early Validator Integration?',
    bottomCtaDesc:
      'Our engineering team can deploy standalone validation microservices or integrate direct verification APIs into your custom web applications.',
    bottomCtaButtonText: 'Enquire About Email Validation',
    bottomCtaButtonLink: '/contact?service=Email%20Validation%20Solutions',
    order: 2
  }
];
