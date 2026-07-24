export const siteConfig = {
  name: 'Ellines Tech',
  tagline: 'Technology Solutions for the Future',
  motto: 'Your Idea. Our Code.',
  description:
    'Ellines Tech, based in Kenya, leads the IT industry with innovative solutions for global enterprises. Our expert team combines technical skill and creativity for top-tier software development, mobile apps, and digital transformation.',
  url: 'https://tech.ellines.co.ke',
  email: 'info@tech.ellines.co.ke',
  emails: ['info@ellines.co.ke', 'info@tech.ellines.co.ke'] as const,
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
  /** Full Ellines Group businesses — equal weight, not footnotes */
  groupBrands: [
    {
      id: 'tech',
      name: 'Ellines Tech',
      role: 'Technology',
      description:
        'Software development, AI, cloud, and digital transformation — the flagship technology company of Ellines Group.',
      url: 'https://tech.ellines.co.ke',
      status: 'live' as const,
      statusLabel: 'Live',
      image: '/founder/elijah-3.jpg',
      accent: 'from-cyan-500/30 via-sky-700/10 to-transparent',
      mark: '/logos/logo-mark-nav.png',
    },
    {
      id: 'haven',
      name: 'Ellines Haven',
      role: 'Publishing',
      description:
        'Online books and novels platform — stories by Elijah Mwangi M. Read, discover, and get inspired.',
      url: 'https://haven.ellines.co.ke/',
      status: 'live' as const,
      statusLabel: 'Live',
      image: '/founder/elijah-1.jpg',
      accent: 'from-amber-500/25 via-orange-900/10 to-transparent',
      mark: '/media/logos/mark-nobg.png',
    },
    {
      id: 'rattan',
      name: 'Ellines Rattan Furniture',
      role: 'Commerce',
      description:
        'An established Ellines Group furniture business crafting quality rattan pieces for homes and commercial spaces across Kenya. Digital storefront in progress.',
      url: undefined,
      status: 'operating' as const,
      statusLabel: 'Operating',
      image: '/founder/elijah-2.jpg',
      accent: 'from-emerald-600/25 via-teal-900/10 to-transparent',
      mark: '/media/logos/square.png',
    },
  ],
  media: {
    rebrandPoster: '/media/posters/ellines-rebranding.png',
    markAccent: '/media/logos/mark-nobg.png',
  },
  social: {
    facebook: 'https://www.facebook.com/ellines.tech/',
    twitter: 'https://x.com/EllinesTech',
    instagram: 'https://www.instagram.com/ellines.tech/',
    linkedin: 'https://www.linkedin.com/in/ellines-tech-8a3788310/',
    youtube: 'https://www.youtube.com/@EllinesTech',
    github: 'https://github.com/EllinesTech',
  },
  logos: {
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
