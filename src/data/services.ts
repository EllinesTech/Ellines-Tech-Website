export type ServiceCategory =
  | 'design'
  | 'development'
  | 'ai'
  | 'marketing'
  | 'security'
  | 'career'
  | 'consulting'
  | 'support'
  | 'compliance'
  | 'merch'

export interface Service {
  slug: string
  name: string
  category: ServiceCategory
  description: string
  offerings: string[]
}

export const serviceCategories: Record<
  ServiceCategory,
  { label: string; description: string; icon: string }
> = {
  design: {
    label: 'Design',
    description: 'Logo, web, UI/UX, and product design that builds brand identity.',
    icon: 'Palette',
  },
  development: {
    label: 'Development',
    description: 'Software development, DevOps, and web development from concept to deployment.',
    icon: 'Code2',
  },
  ai: {
    label: 'AI Development',
    description: 'AI development and automation that drives digital transformation.',
    icon: 'Brain',
  },
  marketing: {
    label: 'Marketing',
    description: 'Marketing strategy and digital marketing to grow visibility and leads.',
    icon: 'Megaphone',
  },
  security: {
    label: 'Cyber Security',
    description: 'Security services that protect applications, data, and infrastructure.',
    icon: 'Shield',
  },
  career: {
    label: 'Career Documents',
    description: 'Resume building, CV revamp, cover letters, and LinkedIn — priced for Kenya.',
    icon: 'FileText',
  },
  consulting: {
    label: 'IT Consulting',
    description: 'Strategy, architecture, and technology advisory for ambitious teams.',
    icon: 'Briefcase',
  },
  support: {
    label: 'Tech Support & QA',
    description: 'OS setup, app testing, and hands-on technical support.',
    icon: 'Wrench',
  },
  compliance: {
    label: 'Tax & Compliance',
    description: 'Kenya tax return filing and KRA iTax assistance.',
    icon: 'FileCheck',
  },
  merch: {
    label: 'Merchandise & Print',
    description: 'Apparel branding, phone cases, and campaign print design.',
    icon: 'Shirt',
  },
}

/** Synced from live offerings at https://ellinestech.co.ke/ (Our Services menu + home service cards). */
export const services: Service[] = [
  {
    slug: 'logo-design',
    name: 'Logo Design',
    category: 'design',
    description:
      'A well-designed logo is crucial for establishing your brand identity and making a lasting first impression.',
    offerings: [
      'Brand identity marks',
      'Logo concepts & revisions',
      'Multiple format delivery',
      'Brand guidelines basics',
    ],
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    category: 'design',
    description:
      'At Ellines Tech, we specialize in crafting visually stunning and intuitive website designs that engage visitors.',
    offerings: [
      'Responsive layouts',
      'Brand-aligned visuals',
      'Landing pages',
      'Design systems',
    ],
  },
  {
    slug: 'ui-ux-designing',
    name: 'UI/UX Designing',
    category: 'design',
    description:
      'We believe that great design is essential for the success of digital products — usable, accessible interfaces people love.',
    offerings: [
      'User research',
      'Wireframes & prototypes',
      'Interface design',
      'Usability testing',
    ],
  },
  {
    slug: 'product-design',
    name: 'Product Design',
    category: 'design',
    description:
      'End-to-end product design for digital products — from concept and flows to polished, shippable experiences.',
    offerings: [
      'Product discovery',
      'Information architecture',
      'Interaction design',
      'Design handoff',
    ],
  },
  {
    slug: 'resume-cv-design-revamping',
    name: 'Resume / CV Revamp',
    category: 'career',
    description:
      'Refresh your existing CV into a clean, ATS-friendly format that stands out to Kenyan and global recruiters.',
    offerings: [
      'CV redesign & structure',
      'ATS-friendly layouts',
      'Achievement rewriting',
      'Personal branding polish',
    ],
  },
  {
    slug: 'resume-building',
    name: 'Resume Building',
    category: 'career',
    description:
      'Full professional resume built from scratch — structure, keywords, and impact bullets for your target roles.',
    offerings: [
      'From-scratch ATS CV',
      'Role-targeted keywords',
      'Impact-focused bullets',
      'Delivery in editable formats',
    ],
  },
  {
    slug: 'cover-letter-writing',
    name: 'Cover Letter Writing',
    category: 'career',
    description:
      'Tailored cover letters matched to your CV and the role you’re applying for.',
    offerings: [
      'Role-specific letter',
      'Tone matched to industry',
      'One revision round',
      'PDF & Word delivery',
    ],
  },
  {
    slug: 'linkedin-optimisation',
    name: 'LinkedIn Optimisation',
    category: 'career',
    description:
      'Headline, About, and experience rewrite so recruiters find you faster on LinkedIn.',
    offerings: [
      'Headline & About rewrite',
      'Experience optimisation',
      'Keywords for search',
      'Profile checklist',
    ],
  },
  {
    slug: 'software-development',
    name: 'Software Development',
    category: 'development',
    description:
      'At Ellines Tech, we specialize in delivering high-quality software development services tailored to your business — including DevOps delivery practices.',
    offerings: [
      'Custom applications',
      'Enterprise systems',
      'DevOps & CI/CD',
      'Maintenance & support',
    ],
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    category: 'development',
    description:
      'Full-stack web development for company sites, portals, and web applications built to perform and scale.',
    offerings: [
      'Front-end development',
      'Back-end systems',
      'CMS & portals',
      'Performance optimization',
    ],
  },
  {
    slug: 'ai-development-automation',
    name: 'AI Development & Automation',
    category: 'ai',
    description:
      'We are committed to driving digital transformation through AI and automation that optimize how you operate.',
    offerings: [
      'Custom AI solutions',
      'Process automation',
      'Intelligent assistants',
      'Workflow integration',
    ],
  },
  {
    slug: 'marketing-strategy',
    name: 'Marketing Strategy',
    category: 'marketing',
    description:
      'We specialize in crafting effective marketing strategies that align with your business goals and audience.',
    offerings: [
      'Go-to-market planning',
      'Brand positioning',
      'Campaign strategy',
      'Growth roadmaps',
    ],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    category: 'marketing',
    description:
      'At Ellines Tech, we offer comprehensive digital marketing services designed to grow reach, engagement, and conversions.',
    offerings: [
      'SEO & content',
      'Social campaigns',
      'Paid acquisition',
      'Analytics & reporting',
    ],
  },
  {
    slug: 'cyber-security',
    name: 'Cyber Security',
    category: 'security',
    description:
      'Cyber security services to protect your applications, data, and infrastructure against evolving threats.',
    offerings: [
      'Security assessments',
      'Hardening & monitoring',
      'Vulnerability remediation',
      'Secure architecture',
    ],
  },
  {
    slug: 'it-consulting',
    name: 'IT Consulting',
    category: 'consulting',
    description:
      'Independent technology advisory — systems review, architecture guidance, vendor selection, and delivery roadmaps for Kenyan and regional businesses.',
    offerings: [
      'Technology assessment',
      'Architecture & stack advisory',
      'Vendor & build decisions',
      'Delivery roadmap',
    ],
  },
  {
    slug: 'digital-transformation-consulting',
    name: 'Digital Transformation Consulting',
    category: 'consulting',
    description:
      'End-to-end digital transformation consulting — process digitisation, product strategy, and change-ready implementation plans.',
    offerings: [
      'Current-state audit',
      'Target operating model',
      'Prioritised initiative backlog',
      'Change & adoption guidance',
    ],
  },
  {
    slug: 'cloud-infrastructure-consulting',
    name: 'Cloud & Infrastructure Consulting',
    category: 'consulting',
    description:
      'Cloud readiness, migration planning, and infrastructure cost/performance advisory for growing products and internal systems.',
    offerings: [
      'Cloud readiness review',
      'Migration planning',
      'Cost & performance tuning',
      'Reliability & backup strategy',
    ],
  },
  {
    slug: 'kenya-tax-return',
    name: 'Kenya Tax Return Filing',
    category: 'compliance',
    description:
      'Affordable Kenya tax return filing assistance via KRA iTax — from KES 200 for individual returns.',
    offerings: [
      'iTax filing support',
      'Return review',
      'Submission guidance',
      'Confirmation follow-up',
    ],
  },
  {
    slug: 'os-installation',
    name: 'OS Installation',
    category: 'support',
    description:
      'Professional Windows or Linux installation and setup with drivers and essential updates.',
    offerings: [
      'Clean OS install',
      'Drivers & updates',
      'Basic optimisation',
      'Data backup advice',
    ],
  },
  {
    slug: 'app-testing',
    name: 'App Testing',
    category: 'support',
    description:
      'Manual QA for web and mobile apps — structured test runs with clear, prioritised bug reports.',
    offerings: [
      'Test plan',
      'Functional checks',
      'UI review',
      'Bug report delivery',
    ],
  },
  {
    slug: 'branding-services',
    name: 'Branding Services',
    category: 'design',
    description:
      'Brand identity work — discovery, visual systems, and assets ready for digital and print.',
    offerings: [
      'Brand discovery',
      'Visual identity',
      'Brand board',
      'Asset handoff',
    ],
  },
  {
    slug: 'graphics-design',
    name: 'Graphics Design',
    category: 'design',
    description:
      'Social graphics, marketing creatives, and brand-aligned visual packs for campaigns.',
    offerings: [
      'Social post sets',
      'Story frames',
      'Ad creatives',
      'Brand-consistent layouts',
    ],
  },
  {
    slug: 'campaign-posters',
    name: 'Campaign Posters',
    category: 'merch',
    description:
      'Original campaign poster design for events, launches, and ads — print and digital ready.',
    offerings: [
      'Poster concepts',
      'Print-ready files',
      'Digital variants',
      'Revision rounds',
    ],
  },
  {
    slug: 'apparel-branding',
    name: 'Apparel Branding',
    category: 'merch',
    description:
      'Company logo branding on t-shirts, caps, hoodies, and other clothing for teams and events.',
    offerings: [
      'T-shirt branding',
      'Caps & hoodies',
      'Artwork setup',
      'Bulk order quotes',
    ],
  },
  {
    slug: 'phone-case-decoration',
    name: 'Phone Case Decoration',
    category: 'merch',
    description:
      'Custom phone case artwork and logo decoration tailored to your device model.',
    offerings: [
      'Custom artwork',
      'Logo placement',
      'Model-specific fit',
      'Production coordination',
    ],
  },
  {
    slug: 'business-cards',
    name: 'Business Cards',
    category: 'merch',
    description:
      'Print-ready business card design — front and back layouts aligned to your brand.',
    offerings: [
      'Front & back design',
      'Print-ready files',
      'Brand colour matching',
      'Revision rounds',
    ],
  },
  {
    slug: 'stationery-rebrand',
    name: 'Stationery Rebrand',
    category: 'merch',
    description:
      'Letterheads, envelopes, complimentary slips, and stamp designs for a cohesive stationery system.',
    offerings: [
      'Letterhead templates',
      'Envelope artwork',
      'Complimentary slips',
      'Stamp / seal design',
    ],
  },
  {
    slug: 'business-rebrand-kit',
    name: 'Business Rebrand Kit',
    category: 'design',
    description:
      'Full identity refresh — logo system, stationery pack, and rollout assets for existing businesses.',
    offerings: [
      'Identity refresh',
      'Stationery pack',
      'Brand board',
      'Asset handoff',
    ],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
