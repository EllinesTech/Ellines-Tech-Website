import { locationLine, locations, primaryLocation } from './locations'

export const siteConfig = {
  name: 'Ellines Tech',
  tagline: 'IT, Web Design & Consulting in Kenya',
  motto: 'Your Idea. Our Code.',
  description:
    'Ellines Tech is a Kenya-based IT company offering software development, web design, AI, IT consulting, digital marketing, and career documents — with offices in Nyeri and Nairobi serving businesses across Africa.',
  url: 'https://tech.ellines.co.ke',
  email: 'info@tech.ellines.co.ke',
  emails: ['info@ellines.co.ke', 'info@tech.ellines.co.ke'] as const,
  phones: ['+254 728 807 213', '+254 748 255 466'] as const,
  phone: '+254 728 807 213',
  whatsapp: '+254748255466',
  /** Short two-city line — see src/data/locations.ts for the full address records. */
  address: locationLine,
  /** Full street address of the head office, for invoices and structured data. */
  headOfficeAddress: primaryLocation.address,
  locations,
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
      'Ellines Group is the parent company behind Ellines Tech, Ellines Haven, and Ellines Rattan — technology, publishing, and furniture under one vision.',
  },
  /** Full Ellines Group businesses — equal weight, not footnotes */
  groupBrands: [
    {
      id: 'tech',
      name: 'Ellines Tech',
      role: 'Technology',
      description:
        'Software development, AI, cloud, and digital transformation — the technology company of Ellines Group.',
      url: 'https://tech.ellines.co.ke',
      status: 'live' as const,
      statusLabel: 'Live',
      image: '/logos/logo-full-bg.png',
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
      image: '/business-logos/ellines-haven.png',
      accent: 'from-amber-500/25 via-orange-900/10 to-transparent',
      mark: '/business-logos/ellines-haven.png',
    },
    {
      id: 'rattan',
      name: 'Ellines Rattan',
      role: 'Furniture',
      description:
        'Quality rattan furniture for homes and commercial spaces across Kenya — the commerce brand of Ellines Group.',
      url: 'https://rattan.ellines.co.ke',
      status: 'operating' as const,
      statusLabel: 'Operating',
      image: '/business-logos/ellines-rattan.png',
      accent: 'from-emerald-600/25 via-teal-900/10 to-transparent',
      mark: '/business-logos/ellines-rattan.png',
    },
  ],
  media: {
    rebrandPoster: '/media/posters/ellines-rebranding.png',
    markAccent: '/media/logos/mark-nobg.png',
    techMark: '/logos/logo-mark.png',
    techSquare: '/logos/logo-square.png',
    techHero: '/logos/logo-hero.png',
    groupMark: '/business-logos/ellines-group.png',
    havenMark: '/business-logos/ellines-haven.png',
    rattanMark: '/business-logos/ellines-rattan.png',
    juno4: '/project-logos/juno4.png',
    rv22: '/project-logos/rv22-ai.png',
    afyavox: '/project-logos/afyavox.png',
    lmar: '/project-logos/lmar.png',
    brandWork: '/project-logos/brand-work-collection.png',
    scenes: {
      aboutTeam: '/media/scenes/about.png',
      heroTech: '/media/scenes/hero-tech.png',
      /** Services page hero — distinct from Home/Solutions */
      serviceTech: '/media/scenes/web.png',
      /** Startup / solutions atmosphere — must stay distinct from aiVisual */
      solutionsAi: '/media/scenes/hero-tech.png',
      uiDesign: '/media/scenes/strategy.png',
      webDesign: '/media/scenes/web.png',
      aiVisual: '/media/scenes/ai.png',
      workspace: '/media/scenes/workspace.png',
      contact: '/media/scenes/growth.png',
      /**
       * Industries + Knowledge Hub heroes use photography rather than the branded renders:
       * `about.png` carries burnt-in headline text and ghosts behind hero copy.
       */
      industriesHero: '/media/posters/packages/consult_digital_transform.jpg',
      resourcesHero: '/media/posters/packages/consult_tech_roadmap.jpg',
      portfolio: '/media/scenes/strategy.png',
      pricingHero: '/media/scenes/ai.png',
      faq: '/media/scenes/workspace.png',
      solutionsHero: '/media/scenes/solutions.png',
    },
    banners: {
      homeStory: '/media/banners/home-story.png',
      homeCraft: '/media/banners/home-craft.png',
      aboutHero: '/media/banners/about-hero.png',
      aboutStory: '/media/banners/about-story.png',
      execute: '/media/banners/execute.png',
    },
  },
  social: {
    facebook: 'https://www.facebook.com/ellines.tech/',
    twitter: 'https://x.com/EllinesTech',
    instagram: 'https://www.instagram.com/ellines.tech/',
    linkedin: 'https://www.linkedin.com/in/ellines-tech-8a3788310/',
    github: 'https://github.com/EllinesTech',
  },
  socialLinks: [
    { id: 'facebook', label: 'Facebook', handle: '@ellines.tech', href: 'https://www.facebook.com/ellines.tech/' },
    { id: 'twitter', label: 'X (Twitter)', handle: '@EllinesTech', href: 'https://x.com/EllinesTech' },
    { id: 'instagram', label: 'Instagram', handle: '@ellines.tech', href: 'https://www.instagram.com/ellines.tech/' },
    { id: 'linkedin', label: 'LinkedIn', handle: 'Ellines Tech', href: 'https://www.linkedin.com/in/ellines-tech-8a3788310/' },
    { id: 'github', label: 'GitHub', handle: 'EllinesTech', href: 'https://github.com/EllinesTech' },
  ],
  hours: {
    label: 'Always open',
    detail: '24/7 — demos, support, and project inquiries',
    alwaysOpen: true,
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
