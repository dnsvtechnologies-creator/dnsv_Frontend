export const INITIAL_SERVICES_PAGE_CONFIG = {
  key: 'services_page_config',
  heroBadge: 'Engineering Capabilities',
  heroTitle: 'Comprehensive Digital Services & Software Engineering',
  heroSubtitle:
    'DNSV Technologies combines modern web frontends, backend APIs, scalable MongoDB databases, and high-throughput email automation into cohesive, reliable solutions for commercial businesses.',
  ctaTitle: 'Need a Customized Solution Across Multiple Services?',
  ctaDescription:
    'Combine website development with Mailcurve email marketing automation or custom API integrations with tailored pricing.',
  ctaPrimaryLabel: 'Request a Project Quotation',
  ctaPrimaryLink: '/request-quote',
  ctaSecondaryLabel: 'View Standard Packages',
  ctaSecondaryLink: '/pricing'
};

export const INITIAL_SERVICES = [
  {
    id: 'web-development',
    slug: 'web-development',
    title: 'Website Design & Development',
    shortLabel: 'Website Development',
    dropdownDesc: 'Custom, responsive websites & landing pages',
    iconKey: 'code2',
    category: 'Digital Web Presence',
    headline: 'High-Performance, Responsive Websites Tailored for Modern Business Growth.',
    summary:
      'Custom business websites, high-converting landing pages, portfolio platforms, and dynamic web applications built with modern React and Tailwind CSS.',
    overview:
      'DNSV Technologies designs and develops bespoke web experiences that combine aesthetic discipline, fast loading speeds, mobile-first responsiveness, and structured search engine optimization. We build on modern React frameworks with modular component architectures.',
    offerings: [
      'Corporate & Business Websites',
      'Portfolio & Showcase Platforms',
      'High-Converting Landing Pages',
      'Responsive Full-Stack Web Applications',
      'Legacy Website Redesign & Modernization',
      'Technical On-Page SEO & Performance Tuning'
    ],
    features: [
      {
        title: 'Custom UI/UX Design Systems',
        desc: 'Crafted from the ground up to reflect brand identity using clean typographic hierarchy and consistent visual systems.'
      },
      {
        title: 'Full-Stack React Implementation',
        desc: 'Single-page applications and multi-page corporate websites with instant page transitions and zero layout shifts.'
      },
      {
        title: 'Technical On-Page SEO',
        desc: 'Semantic HTML5, dynamic OpenGraph cards, Twitter cards, XML sitemaps, and Schema.org structured data built in.'
      },
      {
        title: 'Responsive Across All Viewports',
        desc: 'Tested across 320px mobile screens, tablets, standard laptops, and 1920px widescreen desktop monitors.'
      },
      {
        title: 'Speed & Asset Optimization',
        desc: 'Sub-1.5 second loading performance via modern asset bundling, lazy loading, and optimized web font loading.'
      },
      {
        title: 'Enquiry & Form Automation',
        desc: 'Integrated contact and quote capture connected directly to backend validation and real-time email alerts.'
      }
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
      {
        q: 'What is included in DNSV website development plans?',
        a: 'All our website plans include custom responsive UI design, mobile optimization, interactive forms, on-page SEO setup, and structured revision cycles.'
      },
      {
        q: 'Do you use page builders like WordPress or Wix?',
        a: 'No. We develop clean codebases using React, Tailwind CSS, and Node.js for superior speed, security, and scalability.'
      }
    ],
    related: [
      { title: 'Email Marketing & Automation', slug: '/services/email-marketing' },
      { title: 'Custom Software Development', slug: '/services/custom-software' }
    ],
    order: 1
  },
  {
    id: 'custom-software',
    slug: 'custom-software',
    title: 'Custom Software Development',
    shortLabel: 'Custom Software & CRM',
    dropdownDesc: 'Bespoke CRM, ERP & SaaS architectures',
    iconKey: 'cpu',
    category: 'Enterprise Applications',
    headline: 'Tailored Business Software, Operational Dashboards & SaaS Architectures.',
    summary:
      'Tailored enterprise software, custom CRM portals, admin dashboards, inventory management systems, and multi-tenant SaaS application foundations.',
    overview:
      'When off-the-shelf software falls short, DNSV Technologies engineers custom business applications tailored specifically to your operational workflows. We build administrative dashboards, CRM tools, inventory tracking systems, and multi-tenant SaaS foundations with clean Express APIs and MongoDB databases.',
    offerings: [
      'Bespoke Business Process Software',
      'Custom CRM & Lead Portals',
      'Operations & Inventory Dashboards',
      'Multi-Tenant SaaS Architectures',
      'Client & Partner Self-Service Portals',
      'Workflow Automation & Event Processors'
    ],
    features: [
      {
        title: 'Bespoke CRM & Pipeline Systems',
        desc: 'Consolidate lead tracking, customer interactions, quotation histories, and operational notes into a single secure interface.'
      },
      {
        title: 'Administrative & Analytics Dashboards',
        desc: 'Real-time metrics, automated status reporting, data filtering, and CSV export capabilities.'
      },
      {
        title: 'Multi-Tenant SaaS Foundation',
        desc: 'Scalable data isolation, subscription management hooks, and user account permission roles.'
      },
      {
        title: 'Business Workflow Automation',
        desc: 'Automate manual handoffs, status triggers, invoice generation, and internal notification dispatches.'
      },
      {
        title: 'Granular Access Control (RBAC)',
        desc: 'Role-based access permissions ensuring staff only access authorized data tiers.'
      },
      {
        title: 'Robust Document Databases',
        desc: 'Optimized MongoDB schema designs with indexing strategies designed for high query performance.'
      }
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
      {
        q: 'Can you integrate our custom software with third-party tools?',
        a: 'Yes. We build custom API connectors for CRMs, payment processors, email services, and cloud storage.'
      },
      {
        q: 'Do we own the intellectual property of the custom software?',
        a: 'Yes. Upon project completion and sign-off, all custom codebase IP belongs entirely to your business.'
      }
    ],
    related: [
      { title: 'API Development & Integration', slug: '/services/api-development' },
      { title: 'Website Design & Development', slug: '/services/web-development' }
    ],
    order: 2
  },
  {
    id: 'email-marketing',
    slug: 'email-marketing',
    title: 'Email Marketing & Automation',
    shortLabel: 'Email Automation (Mautic)',
    dropdownDesc: 'Mautic, SMTP workflows & high deliverability',
    iconKey: 'mail',
    category: 'Outreach & Infrastructure',
    headline: 'High-Volume Email Delivery, Mautic Deployments & Automated Workflows.',
    summary:
      'Production email infrastructure, Mautic deployment and configuration, custom SMTP integrations, subscriber hygiene, and Mailcurve automation.',
    overview:
      'DNSV Technologies provides end-to-end email marketing engineering. We deploy and tune open-source marketing automation systems (such as Mautic), configure high-reputation SMTP dispatch clusters, and build automated behavioral nurture sequences. We also operate our proprietary Mailcurve SaaS platform.',
    offerings: [
      'Mautic Installation, Clustering & Hardening',
      'Custom SMTP Dispatch Node Configuration',
      'Automated Customer Journey Drip Campaigns',
      'Dynamic Behavioral Audience Segmentation',
      'Deliverability Audits (SPF, DKIM, DMARC, BIMI)',
      'Mailcurve SaaS Integration & Management'
    ],
    features: [
      {
        title: 'Mautic Deployment & Hardening',
        desc: 'Full installation, database optimization, cron task configuration, and security tuning of self-hosted Mautic servers.'
      },
      {
        title: 'SMTP Node & IP Clustering',
        desc: 'Integration with enterprise delivery backends, IP pool warming, and throttling controls.'
      },
      {
        title: 'Cryptographic Authentication Alignment',
        desc: 'Complete DNS records configuration: SPF, DKIM, DMARC, MX, and BIMI protocols for inbox trust.'
      },
      {
        title: 'Behavioral Automated Workflows',
        desc: 'Drip campaigns triggered by website actions, user status updates, or date-based milestones.'
      },
      {
        title: 'Audience Segmentation & Hygiene',
        desc: 'Dynamic filtering by engagement score, geography, and bounce risk classification.'
      },
      {
        title: 'Mailcurve Platform Access',
        desc: 'Turnkey access to our proprietary email marketing SaaS with predictable daily and monthly send quotas.'
      }
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
      {
        q: 'Do you guarantee 100% inbox placement?',
        a: 'No ethical email engineer guarantees 100% inboxing because final filtering depends on recipient mail servers and engagement. We provide the highest possible technical foundation: verified DNS, warm IPs, and clean list hygiene.'
      },
      {
        q: 'What are the email sending limits?',
        a: 'Our Mailcurve plans clearly define daily and monthly sending caps (e.g., 500/day to 10,000/day). Enterprise clusters support customized throughput.'
      }
    ],
    related: [
      { title: 'Mailcurve Product Details', slug: '/products/mailcurve' },
      { title: 'Email Validator Engine', slug: '/products/email-validator' }
    ],
    order: 3
  },
  {
    id: 'api-development',
    slug: 'api-development',
    title: 'API Development & Integration',
    shortLabel: 'API & Gateway Integration',
    dropdownDesc: 'REST APIs, webhooks & payment gateways',
    iconKey: 'layers',
    category: 'Backend Architecture',
    headline: 'Secure RESTful APIs, Webhook Pipelines & Payment Gateway Integrations.',
    summary:
      'Standardized REST API architectures, third-party software connectors, secure payment gateway integrations, and reliable webhook listeners.',
    overview:
      'Modern businesses depend on fluid data exchange between internal platforms and third-party SaaS ecosystems. DNSV Technologies engineers secure, well-documented REST APIs, webhook ingestion engines, and payment processor integrations designed for high concurrency and data consistency.',
    offerings: [
      'Custom RESTful API Architecture & Endpoints',
      'Payment Gateway Integration (Razorpay, Stripe)',
      'CRM & Marketing Tool Data Synchronization',
      'Cryptographically Signed Webhook Listeners',
      'Rate Limiting & Threat Mitigation Middlewares',
      'Third-Party Cloud API Connectors'
    ],
    features: [
      {
        title: 'RESTful API Architecture',
        desc: 'Clean resource-oriented routing with consistent JSON payloads, HTTP status codes, and error semantics.'
      },
      {
        title: 'Payment Gateway Integration',
        desc: 'Seamless integration with Razorpay, Stripe, and PayPal with webhook signature verification.'
      },
      {
        title: 'Idempotent Webhook Handlers',
        desc: 'Resilient event processing that gracefully absorbs network blips and prevents duplicate executions.'
      },
      {
        title: 'Rate Limiting & Threat Shielding',
        desc: 'IP-based throttling, request validation, and helmet header protection against automated abuse.'
      },
      {
        title: 'CRM & Cloud Tool Connectors',
        desc: 'Bidirectional data sync between websites, Mailcurve, Google Workspace, and operational databases.'
      },
      {
        title: 'Interactive Documentation',
        desc: 'Clear endpoint specifications with example request/response schemas for effortless developer onboarding.'
      }
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
      {
        q: 'Can you integrate payment gateways for one-time and recurring subscriptions?',
        a: 'Yes. We implement both one-time checkout flows and automated recurring subscription webhook listeners.'
      }
    ],
    related: [
      { title: 'Custom Software Development', slug: '/services/custom-software' },
      { title: 'Technical Support & Maintenance', slug: '/services/technical-support' }
    ],
    order: 4
  },
  {
    id: 'technical-support',
    slug: 'technical-support',
    title: 'Technical Support & Maintenance',
    shortLabel: 'Maintenance & Retainers',
    dropdownDesc: 'Server tuning, security & 24/7 retainers',
    iconKey: 'wrench',
    category: 'DevOps & Reliability',
    headline: 'Proactive Linux Server Administration, Security Patching & SLA Retainers.',
    summary:
      'Proactive Linux server management, scheduled database backups, security patches, bug fixes, performance monitoring, and SLA retainers.',
    overview:
      'Deploying software is only half the journey. DNSV Technologies provides comprehensive technical maintenance, server hardening, database monitoring, automated backups, and guaranteed SLA bug resolution to keep your digital assets operational around the clock.',
    offerings: [
      'Linux VPS & Cloud Server Configuration',
      'Automated MongoDB Snapshot Backups',
      'Security Vulnerability Audits & Patching',
      'Database Index Optimization & Query Tuning',
      'Bug Triage, Hotfixes & Feature Updates',
      'Guaranteed SLA Technical Support Retainers'
    ],
    features: [
      {
        title: 'Linux Cloud Server Administration',
        desc: 'Ubuntu/Debian VPS configuration, Nginx reverse proxy management, and memory/CPU resource optimization.'
      },
      {
        title: 'Automated Database Backups',
        desc: 'Scheduled MongoDB snapshot exports and encrypted off-site storage to protect against accidental data loss.'
      },
      {
        title: 'Security Audits & Patching',
        desc: 'Proactive operating system security updates, package vulnerability patching, and firewall hardening.'
      },
      {
        title: 'Query & Index Optimization',
        desc: 'Analyzing slow database queries, compound indexing, and reducing API response latency.'
      },
      {
        title: 'Rapid Bug Resolution',
        desc: 'Dedicated engineering support with guaranteed response times for unexpected application errors.'
      },
      {
        title: 'SSL & Domain Maintenance',
        desc: 'Automated Let’s Encrypt certificate renewals, DNS records maintenance, and health monitoring.'
      }
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
      {
        q: 'What is the response time under a maintenance retainer?',
        a: 'We offer standard and priority SLAs ranging from 2 hours for critical production blockers to 24 hours for routine feature adjustments.'
      }
    ],
    related: [
      { title: 'Website Design & Development', slug: '/services/web-development' },
      { title: 'Custom Software Development', slug: '/services/custom-software' }
    ],
    order: 5
  }
];
