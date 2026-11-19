export const INITIAL_CAREER_CONFIG = {
  key: 'careers_page_config',
  heroBadge: 'Careers at DNSV Technologies',
  heroTitle: 'Build High-Reliability Software, SaaS & Email Systems With Us',
  heroSubtitle:
    'Join a focused engineering and product team building Mailcurve email automation, custom web platforms, and scalable enterprise APIs for modern businesses.',
  hiringBannerEnabled: true,
  hiringBannerText:
    'Open Hiring Cycle: Remote-friendly engineering, DevOps deliverability, and B2B product roles are open. Everyone can browse full role specifications and apply directly — no account required.',
  cultureTitle: 'Why Engineers & Builders Choose DNSV',
  cultureSubtitle:
    'Small senior-led squads, direct product ownership, clean modern stacks, and measurable impact across every deployment.',
  perks: [
    {
      title: 'Direct Production Ownership',
      desc: 'Ship full features across React, Node.js, MongoDB, and Mailcurve infrastructure without layers of red tape.'
    },
    {
      title: 'Flexible Hybrid & Remote Options',
      desc: 'Work from India HQ or remotely with structured async collaboration and transparent sprint goals.'
    },
    {
      title: 'High-Scale Systems Experience',
      desc: 'Solve real deliverability, SMTP routing, queue throughput, and multi-tenant SaaS architecture challenges.'
    },
    {
      title: 'Performance-Linked Growth',
      desc: 'Clear compensation reviews, learning stipends for cloud certifications, and fast merit progression.'
    }
  ],
  allowSpontaneousApplications: true,
  spontaneousTitle: 'Don’t See Your Exact Role Listed?',
  spontaneousDescription:
    'We continuously review strong engineers, deliverability specialists, designers, and growth operators. Send a general application directly to our hiring desk.',
  hrEmail: 'careers@dnsvtechnologies.com',
  ctaTitle: 'Questions About Open Roles or Team Culture?',
  ctaDescription:
    'Browse open positions above, submit your application directly on this page, or reach out to our team with your portfolio and background.',
  ctaButtonLabel: 'Send General Application'
};

export const INITIAL_CAREER_JOBS = [
  {
    id: 'career-fullstack-mern',
    slug: 'senior-full-stack-mern-engineer',
    title: 'Full-Stack MERN Engineer (SaaS & APIs)',
    department: 'Engineering',
    employmentType: 'Full-Time',
    workMode: 'Hybrid / Remote (India)',
    location: 'India (Remote-Friendly)',
    experience: '2–5 Years',
    compensation: '₹8 LPA – ₹16 LPA (Commensurate with skill)',
    summary:
      'Architect and ship production web platforms, client dashboards, and multi-tenant SaaS modules using React, Node.js, Express, and MongoDB.',
    description:
      'You will lead feature development across DNSV client web builds and our internal SaaS suite including Mailcurve modules. You will design clean REST APIs, database schemas, and crisp responsive UIs.',
    responsibilities: [
      'Build modular React 19 interfaces with Tailwind CSS and accessible component architecture.',
      'Design scalable Express.js and MongoDB/Mongoose APIs with strict input validation and security.',
      'Collaborate directly with founders and product leads from specification to production deployment.',
      'Write maintainable code with strong error handling, caching, and performance discipline.'
    ],
    requirements: [
      '2+ years of hands-on production experience with React, Node.js, Express, and MongoDB.',
      'Solid grasp of REST API design, JWT authentication, and frontend state management.',
      'Ability to debug full-stack performance bottlenecks independently.',
      'Clear written communication for async technical specs.'
    ],
    niceToHave: [
      'Experience with background job queues (BullMQ/Redis) or high-volume transactional email APIs.',
      'Familiarity with VPS deployment, Nginx reverse proxies, and PM2/Docker workflows.'
    ],
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs'],
    status: 'open',
    isFeatured: true,
    order: 1
  },
  {
    id: 'career-devops-email-infra',
    slug: 'devops-and-email-deliverability-engineer',
    title: 'DevOps & Email Infrastructure Specialist',
    department: 'Infrastructure & Deliverability',
    employmentType: 'Full-Time',
    workMode: 'Remote (India)',
    location: 'Remote (IST Overlap)',
    experience: '2–4 Years',
    compensation: '₹7 LPA – ₹14 LPA',
    summary:
      'Manage Mailcurve SMTP relays, Mautic clusters, DNS authentication (SPF, DKIM, DMARC), IP warmup pipelines, and high-availability Linux servers.',
    description:
      'Core infrastructure role ensuring 99.9% uptime and high inbox placement across Mailcurve campaigns and dedicated client sending clusters.',
    responsibilities: [
      'Configure and monitor Postfix, PowerMTA/SMTP nodes, Mautic instances, and bounce processors.',
      'Audit and maintain SPF, DKIM, DMARC, rDNS, and feedback loop compliance across client domains.',
      'Automate server provisioning, TLS certificate renewals, backups, and health telemetry.',
      'Investigate blacklist events, ISP throttling, and queue latency spikes rapidly.'
    ],
    requirements: [
      'Strong Linux administration skills (Ubuntu/Debian), Nginx, and DNS record architecture.',
      'Practical knowledge of SPF, DKIM, DMARC alignment and SMTP protocol diagnostics.',
      'Experience monitoring server CPU, memory, disk I/O, and network reputation.'
    ],
    niceToHave: [
      'Hands-on Mautic, SES/Mailgun/Postal, or Redis queue tuning experience.',
      'Bash or Node.js scripting for operational automation.'
    ],
    skills: ['Linux', 'SMTP', 'SPF / DKIM / DMARC', 'Mautic', 'Nginx', 'Monitoring'],
    status: 'open',
    isFeatured: true,
    order: 2
  },
  {
    id: 'career-uiux-product-designer',
    slug: 'ui-ux-and-frontend-product-designer',
    title: 'UI/UX & Frontend Product Designer',
    department: 'Product & Design',
    employmentType: 'Full-Time / Contract',
    workMode: 'Hybrid / Remote',
    location: 'India (Remote-Friendly)',
    experience: '1–4 Years',
    compensation: '₹5 LPA – ₹10 LPA',
    summary:
      'Craft crisp corporate websites, SaaS workflows, and interactive dashboards with strong typography, conversion clarity, and responsive precision.',
    description:
      'Shape the visual language of client web builds and DNSV proprietary SaaS products from wireframe prototypes to polished design systems.',
    responsibilities: [
      'Design responsive Figma prototypes for SaaS dashboards, pricing matrices, and corporate websites.',
      'Establish reusable design tokens, typography scales, and accessibility-compliant contrast rules.',
      'Work closely with React engineers to verify pixel accuracy across desktop and mobile viewports.'
    ],
    requirements: [
      'Portfolio demonstrating real SaaS interfaces, B2B web apps, or responsive marketing sites.',
      'Fluency in Figma component systems, auto-layout, and design handoff.',
      'Understanding of HTML/CSS layout constraints and Tailwind design patterns.'
    ],
    niceToHave: [
      'Ability to refine React + Tailwind components directly in code.',
      'Experience designing conversion-focused onboarding funnels.'
    ],
    skills: ['Figma', 'UI Systems', 'UX Flows', 'Responsive Design', 'Tailwind CSS'],
    status: 'open',
    isFeatured: false,
    order: 3
  },
  {
    id: 'career-b2b-growth-specialist',
    slug: 'b2b-email-automation-and-growth-specialist',
    title: 'B2B Email Automation & Growth Specialist',
    department: 'Growth & Operations',
    employmentType: 'Full-Time',
    workMode: 'Remote / Hybrid',
    location: 'India',
    experience: '1–3 Years',
    compensation: '₹4.5 LPA – ₹8.5 LPA + Performance Bonus',
    summary:
      'Design multi-step client lifecycle campaigns, manage list hygiene, segment audiences, and optimize open/reply conversions inside Mailcurve.',
    description:
      'Bridge technical automation with commercial outreach performance for DNSV clients running Starter, Basic, and Growth Mailcurve plans.',
    responsibilities: [
      'Set up automated drip workflows, lead scoring triggers, and suppression lists in Mailcurve.',
      'Coordinate list validation hygiene and analyze campaign bounce, open, and click metrics.',
      'Onboard new clients onto Mailcurve quotas and provide monthly deliverability reports.'
    ],
    requirements: [
      '1+ year managing B2B email marketing, CRM automation, or lifecycle campaigns.',
      'Strong analytical mindset for A/B testing subject lines, timing, and segmentation.',
      'Clear client communication skills.'
    ],
    niceToHave: [
      'Hands-on Mautic, HubSpot, or Mailchimp workflow builder experience.',
      'Familiarity with email compliance standards and opt-in hygiene.'
    ],
    skills: ['Email Automation', 'CRM Workflows', 'Segmentation', 'Analytics', 'Client Success'],
    status: 'open',
    isFeatured: false,
    order: 4
  }
];
