export type ServiceCategory =
  | 'design'
  | 'development'
  | 'ai'
  | 'marketing'
  | 'security'
  | 'career'

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
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
