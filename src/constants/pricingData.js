/**
 * DNSV Technologies - Centralized Pricing Configurations
 * Strict four-colour compliance, full transparent disclosure, no hidden terms
 */

export const PRICING_CATEGORIES = {
  EMAIL_MARKETING: 'email-marketing',
  WEBSITE_DEVELOPMENT: 'website-development',
  COMBINED_PACKAGES: 'combined-packages'
};

export const EMAIL_MARKETING_PLANS = [
  {
    id: 'email-starter',
    category: PRICING_CATEGORIES.EMAIL_MARKETING,
    name: 'Starter',
    subtitle: 'Entry-level volume for small outreach campaigns',
    price: 799,
    currency: 'INR',
    billingPeriod: 'monthly',
    dailyLimit: 500,
    monthlyLimit: 15000,
    isPopular: false,
    order: 1,
    features: [
      '500 emails per day',
      '15,000 emails per month',
      'Basic campaign management',
      'Subscriber management',
      'Email scheduling',
      'Basic technical support',
      'Mailcurve platform access',
      'Standard SMTP configuration'
    ],
    technicalNotes: 'Sending limit quotas. Requires sender domain DNS verification (SPF/DKIM). Fair-use bounce rate <3% required.'
  },
  {
    id: 'email-basic',
    category: PRICING_CATEGORIES.EMAIL_MARKETING,
    name: 'Basic',
    subtitle: 'Steadily growing brands & targeted broadcasts',
    price: 1499,
    currency: 'INR',
    billingPeriod: 'monthly',
    dailyLimit: 1000,
    monthlyLimit: 30000,
    isPopular: false,
    order: 2,
    features: [
      '1,000 emails per day',
      '30,000 emails per month',
      'Campaign scheduling',
      'Subscriber segmentation',
      'Basic analytics & open tracking',
      'Standard technical support',
      'Custom unsubscribe handling',
      'Domain warm-up assistance guidance'
    ],
    technicalNotes: 'Sending capacity quota. Sender reputation monitoring required. Complaint rate must remain below 0.1%.'
  },
  {
    id: 'email-growth',
    category: PRICING_CATEGORIES.EMAIL_MARKETING,
    name: 'Growth',
    subtitle: 'High-performing automated workflow campaigns',
    price: 2999,
    currency: 'INR',
    billingPeriod: 'monthly',
    dailyLimit: 2500,
    monthlyLimit: 75000,
    isPopular: true,
    popularBadge: 'Most Popular',
    order: 3,
    features: [
      '2,500 emails per day',
      '75,000 emails per month',
      'Automation workflows & triggers',
      'Advanced behavioral segmentation',
      'Campaign analytics & click heatmaps',
      'Priority technical support',
      'Multi-list management',
      'REST API access for webhook integrations'
    ],
    technicalNotes: 'Includes automation triggers. Sending infrastructure approval required before scaling.'
  }
];

export const WEBSITE_DEVELOPMENT_PLANS = [
  {
    id: 'web-starter',
    category: PRICING_CATEGORIES.WEBSITE_DEVELOPMENT,
    name: 'Starter Website',
    subtitle: 'Clean, modern web presence for startups & professionals',
    price: 9999,
    currency: 'INR',
    billingPeriod: 'one-time',
    pageLimit: 'Up to 5 Pages',
    revisionCycles: 1,
    isPopular: false,
    features: [
      'Up to 5 responsive pages',
      'Modern, mobile-first UI layout',
      'Interactive contact & enquiry form',
      'Basic on-page SEO meta tags',
      'Basic deployment support',
      '1 structured revision cycle',
      'Cross-browser compatibility testing',
      'SSL and security configuration support'
    ],
    technicalNotes: 'One-time development fee. Domain registration, hosting infrastructure, and paid assets are excluded unless requested.'
  },
  {
    id: 'web-business',
    category: PRICING_CATEGORIES.WEBSITE_DEVELOPMENT,
    name: 'Business Website',
    subtitle: 'Robust digital showcase for commercial companies',
    price: 19999,
    currency: 'INR',
    billingPeriod: 'one-time',
    pageLimit: 'Up to 10 Pages',
    revisionCycles: 2,
    isPopular: true,
    popularBadge: 'Recommended',
    features: [
      'Up to 10 custom pages',
      'Custom UI/UX brand design',
      'Responsive full-stack development',
      'Interactive enquiry & quotation forms',
      'Comprehensive SEO setup & schema markup',
      'Performance optimization (<1.5s load)',
      '2 structured revision cycles',
      'Google Analytics & Search Console setup'
    ],
    technicalNotes: 'One-time development fee. Third-party API charges, payment gateway merchant fees, and hosting accounts billed directly.'
  },
  {
    id: 'web-professional',
    category: PRICING_CATEGORIES.WEBSITE_DEVELOPMENT,
    name: 'Professional Website',
    subtitle: 'Feature-rich digital platform with dynamic integration',
    price: 39999,
    currency: 'INR',
    billingPeriod: 'one-time',
    pageLimit: 'Up to 20 Pages',
    revisionCycles: 3,
    isPopular: false,
    features: [
      'Up to 20 comprehensive pages',
      'Premium custom UI/UX design system',
      'Advanced interactive web features',
      'Backend integration & database models',
      'Dynamic content sections & filtering',
      'Advanced technical SEO & OpenGraph',
      'High-performance asset optimization',
      '3 structured revision cycles'
    ],
    technicalNotes: 'One-time development fee. Advanced custom third-party integrations quoted based on API specifications.'
  },
  {
    id: 'web-enterprise',
    category: PRICING_CATEGORIES.WEBSITE_DEVELOPMENT,
    name: 'Enterprise Website',
    subtitle: 'Custom web application, portal, or multi-site solution',
    price: null,
    priceLabel: 'Custom Quotation',
    currency: 'INR',
    billingPeriod: 'one-time',
    pageLimit: 'Unlimited / Custom',
    revisionCycles: 'Tailored Scope',
    isPopular: false,
    features: [
      'Custom architecture (SPA / SSR / Portal)',
      'Complex database schema & REST APIs',
      'Custom role workflows & system integrations',
      'Custom animations & micro-interactions',
      'Security audit & penetration test readiness',
      'Milestone-based delivery & project manager'
    ],
    technicalNotes: 'Detailed scope specification and architectural design document generated prior to development.'
  }
];

export const COMBINED_PACKAGES = [
  {
    id: 'combo-launch',
    category: PRICING_CATEGORIES.COMBINED_PACKAGES,
    name: 'Launch Combo',
    subtitle: 'Launch a professional website with an integrated email engine',
    price: 12499,
    currency: 'INR',
    billingPeriod: 'combo',
    oneTimeFee: 12499,
    recurringFee: 799,
    recurringBillingPeriod: 'monthly (after Month 1)',
    isPopular: false,
    features: [
      'Website: Up to 5 custom responsive pages',
      'Website: Contact form with email alert',
      'Website: Basic on-page SEO setup',
      'Email: Mailcurve Starter Plan included for 1st month',
      'Email: 500 emails/day (15,000 emails/month)',
      'Email: Subscriber list & campaign setup',
      'One-time website development fee',
      'Email subscription: ₹799/month after the first month'
    ],
    technicalNotes: 'Website development charge is strictly one-time (₹12,499). The included Mailcurve Starter email subscription is valid for 30 days from project sign-off, continuing at ₹799/month thereafter.'
  },
  {
    id: 'combo-business',
    category: PRICING_CATEGORIES.COMBINED_PACKAGES,
    name: 'Business Combo',
    subtitle: 'High-growth company website combined with active outreach',
    price: 22499,
    currency: 'INR',
    billingPeriod: 'combo',
    oneTimeFee: 22499,
    recurringFee: 1499,
    recurringBillingPeriod: 'monthly (after Month 1)',
    isPopular: true,
    popularBadge: 'Best Value',
    features: [
      'Website: Up to 10 responsive pages with custom UI',
      'Website: Enquiry and service request forms',
      'Website: Comprehensive SEO & performance optimization',
      'Email: Mailcurve Basic Plan included for 1st month',
      'Email: 1,000 emails/day (30,000 emails/month)',
      'Email: Audience segmentation & campaign scheduling',
      'One-time website development fee',
      'Email subscription: ₹1,499/month after the first month'
    ],
    technicalNotes: 'Website development charge is strictly one-time (₹22,499). The included Mailcurve Basic email subscription is valid for 30 days, continuing at ₹1,499/month thereafter. Domain and external hosting are separate.'
  },
  {
    id: 'combo-growth',
    category: PRICING_CATEGORIES.COMBINED_PACKAGES,
    name: 'Growth Combo',
    subtitle: 'Advanced 20-page web presence and high-volume automated marketing',
    price: 44999,
    currency: 'INR',
    billingPeriod: 'combo',
    oneTimeFee: 44999,
    recurringFee: 2999,
    recurringBillingPeriod: 'monthly (after Month 1)',
    isPopular: false,
    features: [
      'Website: Up to 20 pages with premium UI/UX design',
      'Website: Dynamic sections, backend integration & SEO',
      'Website: 3 structured revision cycles',
      'Email: Mailcurve Growth Plan included for 1st month',
      'Email: 2,500 emails/day (75,000 emails/month)',
      'Email: Automation workflows & behavioral segmentation',
      'One-time website development fee',
      'Email subscription: ₹2,999/month after the first month'
    ],
    technicalNotes: 'Website development charge is strictly one-time (₹44,999). Mailcurve Growth email subscription continues at ₹2,999/month after Month 1. Includes automated campaign workflow setup.'
  },
  {
    id: 'combo-enterprise',
    category: PRICING_CATEGORIES.COMBINED_PACKAGES,
    name: 'Enterprise Combo',
    subtitle: 'Custom full-stack web application with dedicated email infrastructure',
    price: null,
    priceLabel: 'Custom Quotation',
    currency: 'INR',
    billingPeriod: 'combo',
    oneTimeFee: null,
    recurringFee: null,
    recurringBillingPeriod: 'tailored',
    isPopular: false,
    features: [
      'Custom website & software architecture',
      'High-volume dedicated email cluster deployment',
      'Custom CRM / API integrations',
      'Dedicated deliverability engineering & SLA',
      'Tailored one-time development and monthly infrastructure pricing'
    ],
    technicalNotes: 'Contract-based architecture. Transparent line-item quotation for development milestones and cloud infrastructure.'
  }
];
