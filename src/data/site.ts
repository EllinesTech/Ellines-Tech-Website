export const siteConfig = {
  name: 'Ellines Tech',
  tagline: 'Software, AI & Digital Transformation for Africa',
  motto: 'Your Idea. Our Code.',
  description:
    'Ellines Tech is a leading software development, AI, cloud, and digital transformation company in Africa. We build enterprise systems, healthcare platforms, and intelligent solutions.',
  url: 'https://tech.ellines.co.ke',
  email: 'info@ellinestech.co.ke',
  phones: ['+254 728 807 213', '+254 748 255 466'] as const,
  phone: '+254 728 807 213',
  whatsapp: '+254748255466',
  address: 'Nairobi, Kenya',
  founder: {
    name: 'Elijah Mwangi M',
    role: 'Founder, Ellines Group',
    bio: 'Founder of Ellines Group — building technology, publishing, and commerce ventures that serve African markets. Ellines Tech is the group\'s software, AI, and digital transformation company.',
    images: {
      primary: '/founder/elijah-3.jpg',
      portrait: '/founder/elijah-1.jpg',
      secondary: '/founder/elijah-2.jpg',
      gallery: [
        '/founder/elijah-3.jpg',
        '/founder/elijah-1.jpg',
        '/founder/elijah-2.jpg',
        '/founder/elijah-4.jpg',
        '/founder/elijah-5.jpg',
      ],
    },
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
    /** Retina-ready mark sized for header (160px source → crisp at ~40–48px) */
    markNav: '/logos/logo-mark-nav.png',
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
