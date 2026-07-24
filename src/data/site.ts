export const siteConfig = {
  name: 'Ellines Tech',
  tagline: 'Software, AI & Digital Transformation for Africa',
  description:
    'Ellines Tech is a leading software development, AI, cloud, and digital transformation company in Africa. We build enterprise systems, healthcare platforms, and intelligent solutions.',
  url: 'https://tech.ellines.co.ke',
  email: 'info@ellinestech.co.ke',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  address: 'Nairobi, Kenya',
  founder: {
    name: 'Elijah Mwangi M',
    role: 'Founder, Ellines Group',
  },
  group: {
    name: 'Ellines Group',
    description:
      'Ellines Group is the parent ecosystem founded by Elijah Mwangi M — spanning technology, publishing, and commerce.',
  },
  sisterBrands: [
    {
      name: 'Ellines Haven',
      description: 'Online books and novels platform — stories by Elijah Mwangi M.',
      url: 'https://haven.ellines.co.ke/',
      status: 'live' as const,
    },
    {
      name: 'Rattan Furniture',
      description: 'Existing rattan furniture business — website coming soon.',
      url: undefined,
      status: 'coming-soon' as const,
    },
  ],
  social: {
    linkedin: 'https://linkedin.com/company/ellines-tech',
    twitter: 'https://twitter.com/ellinestech',
    github: 'https://github.com/EllinesTech',
  },
  logos: {
    mark: '/logos/logo-mark.png',
    full: '/logos/logo-full.png',
    hero: '/logos/logo-hero.png',
    square: '/logos/logo-square.png',
  },
} as const

export const technologies = [
  'Python',
  'React',
  'Flutter',
  'JavaScript',
  'TypeScript',
  'PostgreSQL',
  'MySQL',
  'Docker',
  'Cloudflare',
  'Firebase',
  'Supabase',
  'GitHub',
  'AI & ML',
  'REST APIs',
] as const
