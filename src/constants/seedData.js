/**
 * Seed data for DNSV Technologies
 * Clean realistic engineering and technical editorial content
 */

export const INITIAL_BLOG_POSTS = [
  {
    title: 'Architecting Scalable SaaS Platforms with Express & MongoDB',
    slug: 'architecting-scalable-saas-platforms',
    category: 'Architecture',
    excerpt: 'Key design patterns for building resilient multi-tenant SaaS backends with robust data partitioning, rate limiting, and event-driven notifications.',
    author: 'DNSV Engineering Team',
    publishedAt: '2026-09-15',
    readTime: '6 min read',
    tags: ['Architecture', 'SaaS', 'Node.js', 'MongoDB'],
    content: `Building scalable SaaS applications requires upfront deliberation on tenancy models, data partitioning, connection pooling, and resilient message delivery. 

### 1. Multi-Tenant Data Modeling
In enterprise MongoDB deployments, choosing between document-level tenant keys and distinct collections determines indexing strategy and query latency. For high-volume services like Mailcurve, combining compound indices with mandatory tenant predicates prevents tenant data leakage and maximizes memory buffer utilization.

### 2. Backpressure and Ingestion Queues
When handling high volumes of inbound webhook events or email dispatch queues, buffering requests through an asynchronous event stream prevents memory exhaustion in the primary API process.

### 3. Graceful Degradation & Resilience
Ensuring that database connection drops trigger retry loops with exponential backoff guarantees high availability even during maintenance intervals.`
  },
  {
    title: 'Email Deliverability in 2026: DKIM, SPF, DMARC and Sender Reputation',
    slug: 'email-deliverability-dkim-spf-dmarc',
    category: 'Email Marketing',
    excerpt: 'An engineering overview of modern inbox delivery mechanics, mailbox provider authentication policies, and list hygiene best practices.',
    author: 'DNSV Deliverability Labs',
    publishedAt: '2026-10-02',
    readTime: '8 min read',
    tags: ['Deliverability', 'Mailcurve', 'SMTP', 'Security'],
    content: `Email delivery is an infrastructure discipline governed by cryptographic domain validation, behavioral sender signals, and mailbox provider compliance.

### The Foundation: SPF, DKIM, and Strict DMARC
Modern receiving servers at Google Workspace, Microsoft 365, and Yahoo require rigorous alignment. An SPF record declares authoritative sender IPs, while DKIM signs message headers with asymmetric public-key cryptography.

### The Role of Email Validation
Using real-time email verification before queuing outbound broadcasts slashes hard bounces, eliminating spam-trap hits and preserving IP reputation across Mailcurve outbound nodes.`
  },
  {
    title: 'Building Modern Responsive Interfaces with Zero-Pill Design Discipline',
    slug: 'modern-responsive-interfaces-design-discipline',
    category: 'Web Development',
    excerpt: 'How restrained color palettes, intentional typography, and micro-interactions create premium international digital experiences.',
    author: 'DNSV Design Studio',
    publishedAt: '2026-10-24',
    readTime: '5 min read',
    tags: ['UI/UX', 'Tailwind', 'Performance', 'Design'],
    content: `Modern software interfaces distinguish themselves through typographic hierarchy, purposeful whitespace, and restrained color allocation rather than decorative clutter.

### The 60-30-10 Color Allocation
By anchoring 60% of the canvas in high-contrast neutral backgrounds, 30% in structural panels, and strictly 10% in high-intent brand accent actions, the user's attention is guided directly to key decision points.`
  }
];

export const INITIAL_PORTFOLIO_PROJECTS = [
  {
    id: 'portfolio-mailcurve',
    title: 'Mailcurve — Email Automation SaaS Platform',
    category: 'SaaS Development',
    tags: ['SaaS', 'Node.js', 'React', 'MongoDB', 'SMTP'],
    badge: 'Sample Work / Internal Product',
    summary: 'A proprietary email marketing, campaign scheduling, and workflow automation platform engineered for high-throughput deliverability.',
    challenge: 'High-volume scheduled broadcasts required horizontal queuing architecture with real-time analytics and bounce classification.',
    solution: 'Designed an asynchronous queue processing system integrated with MongoDB aggregation pipelines and modular SMTP dispatch nodes.',
    results: 'Sub-second event ingestion, comprehensive campaign reporting, and automated deliverability threshold enforcement.',
    technologies: ['React', 'Express.js', 'MongoDB', 'Mautic Integration', 'Tailwind CSS']
  },
  {
    id: 'portfolio-email-validator',
    title: 'Email Validator Engine & API',
    category: 'API & Validation',
    tags: ['Validation', 'API', 'SMTP Handshake', 'DNS Lookup'],
    badge: 'Sample Work / Internal Product',
    summary: 'A multi-layer email verification tool providing single and bulk CSV analysis across syntax, MX records, and SMTP ping checks.',
    challenge: 'Validating lists of 50,000+ emails without triggering graylisting or blacklisting on target mailbox servers.',
    solution: 'Implemented intelligent rate-controlled MX probe workers with DNS caching and risk scoring algorithms.',
    results: 'High classification accuracy across Valid, Risky, Invalid, and Disposable addresses with downloadable CSV reports.',
    technologies: ['Node.js', 'Express', 'DNS Protocol', 'Mongoose', 'React']
  },
  {
    id: 'portfolio-nexus-portal',
    title: 'Enterprise Customer Operations Portal',
    category: 'Custom Software',
    tags: ['Custom Software', 'CRM', 'Dashboard', 'Workflow Automation'],
    badge: 'Sample Work / Demonstration Prototype',
    summary: 'Centralized operations hub combining quotation workflows, project tracking, and client communication channels.',
    challenge: 'Scattered communication across email and spreadsheets resulted in delayed quote approvals and tracking friction.',
    solution: 'Engineered a unified role-based customer operations portal with automated email notifications and progress tracking.',
    results: 'Streamlined quote-to-onboarding timeline with real-time audit trails and structured file tracking.',
    technologies: ['React', 'Tailwind CSS', 'Express', 'MongoDB']
  },
  {
    id: 'portfolio-fintech-gateway',
    title: 'Payment & Billing Webhook Integration Engine',
    category: 'API Development',
    tags: ['API Integration', 'Webhooks', 'Security', 'Express'],
    badge: 'Sample Work / Demonstration Prototype',
    summary: 'Resilient middleware handling multi-gateway payment callbacks, invoice reconciliation, and subscription lifecycles.',
    challenge: 'Intermittent network failures during webhook delivery caused duplicate reconciliation events.',
    solution: 'Engineered idempotent webhook processing with cryptographic signature verification and exponential backoff retry queues.',
    results: 'Zero duplicate billing entries and 99.99% transaction reconciliation reliability.',
    technologies: ['Express.js', 'HMAC Verification', 'MongoDB', 'Nodemailer']
  }
];

export const INITIAL_SITE_SETTINGS = {
  companyName: 'DNSV Technologies',
  fullForm: 'Digital Nexus for Software & Ventures',
  tagline: 'Connecting Ideas with Technology.',
  brandColors: {
    offWhite: '#F7F7F2',
    primaryBlue: '#2563EB',
    black: '#111111',
    darkNavy: '#17213A'
  },
  contact: {
    email: 'contact@dnsvtechnologies.com',
    phone: '+91 (Available upon enquiry)',
    supportEmail: 'support@dnsvtechnologies.com',
    businessHours: 'Monday - Saturday: 09:30 AM - 06:30 PM IST',
    location: 'India (Serving Global & Regional Clients)'
  }
};
