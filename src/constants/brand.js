/**
 * DNSV Technologies - Brand Constants
 * Strict 4-Color Palette:
 * Off White: #F7F7F2
 * Primary Blue: #2563EB
 * Black: #111111
 * Dark Navy: #17213A
 */

export const BRAND = {
  name: 'DNSV Technologies',
  shortName: 'DNSV',
  fullForm: 'Digital Nexus for Software & Ventures',
  tagline: 'Connecting Ideas with Technology.',
  colors: {
    offWhite: '#F7F7F2',
    primaryBlue: '#2563EB',
    black: '#111111',
    darkNavy: '#17213A'
  },
  contact: {
    email: 'contact.dnsvtechnologies@gmail.com',
    supportEmail: 'support.dnsvtechnologies@gmail.com',
    phone: '+91 8866234169',
    businessHours: 'Monday - Friday: 09:30 AM - 06:30 PM IST',
    location: 'India (Serving Global & Regional Clients)'
  }
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services',
    path: '/services',
    children: [
      { label: 'Website Design & Development', path: '/services/web-development', desc: 'Custom, responsive websites & landing pages' },
      { label: 'Custom Software Development', path: '/services/custom-software', desc: 'Bespoke CRM, ERP & SaaS architectures' },
      { label: 'Email Marketing & Automation', path: '/services/email-marketing', desc: 'Mautic, SMTP workflows & high deliverability' },
      { label: 'API Development & Integration', path: '/services/api-development', desc: 'REST APIs, webhooks & payment gateways' },
      { label: 'Technical Support & Maintenance', path: '/services/technical-support', desc: 'Server tuning, security & 24/7 retainers' }
    ]
  },
  {
    label: 'Products',
    path: '/products',
    children: [
      { label: 'Mailcurve', path: '/products/mailcurve', desc: 'Email marketing & automation SaaS platform', status: 'Live' },
      { label: 'Email Validator', path: '/products/email-validator', desc: 'Bulk verification & hygiene engine', status: 'In Development' }
    ]
  },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Careers', path: '/careers' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' }
];
