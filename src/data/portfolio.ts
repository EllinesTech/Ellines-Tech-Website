export type PortfolioCategory = 'healthcare' | 'education' | 'business' | 'ai' | 'web' | 'brand'

export interface PortfolioProject {
  slug: string
  name: string
  category: PortfolioCategory
  client?: string
  description: string
  technologies: string[]
  results?: string[]
  logo?: string
  image?: string
}

export const portfolioCategories: Record<PortfolioCategory, string> = {
  healthcare: 'Healthcare',
  education: 'Education',
  business: 'Business',
  ai: 'AI',
  web: 'Web',
  brand: 'Brand',
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'rv22-enterprise',
    name: 'RV22 AI Assistant',
    category: 'ai',
    description:
      'Enterprise AI assistant deployed for customer support and internal knowledge management.',
    technologies: ['Python', 'OpenAI', 'React', 'Vector DB'],
    results: ['60% reduction in support tickets', '24/7 automated responses'],
    logo: '/project-logos/rv22-ai.png',
  },
  {
    slug: 'afyavox-clinical',
    name: 'AfyaVox Clinical AI',
    category: 'ai',
    description: 'Voice-powered clinical documentation assistant for healthcare providers.',
    technologies: ['Python', 'Speech AI', 'React', 'PostgreSQL'],
    results: ['50% faster clinical documentation', 'Multi-language support'],
    logo: '/project-logos/afyavox.png',
  },
  {
    slug: 'juno4-platform',
    name: 'Juno4',
    category: 'ai',
    description:
      'AI platform for modern African businesses — intelligent automation, workflows, and decision support.',
    technologies: ['Python', 'AI / ML', 'React', 'APIs'],
    results: ['AI-powered operations', 'Intelligent automation at scale'],
    logo: '/project-logos/juno4.png',
  },
  {
    slug: 'lmar-brand',
    name: 'Lmar',
    category: 'brand',
    client: 'Lmar',
    description:
      'Complete brand identity with slogan lockup — logo system designed and delivered by Ellines Tech.',
    technologies: ['Logo Design', 'Brand Guidelines'],
    results: ['Professional brand mark', 'Slogan-integrated lockup'],
    logo: '/project-logos/lmar.png',
  },
  {
    slug: 'medflow-deployment',
    name: 'MedFlow Hospital Management',
    category: 'healthcare',
    description:
      'End-to-end hospital management system deployed across multiple healthcare facilities.',
    technologies: ['Python', 'React', 'PostgreSQL', 'Docker'],
    results: ['40% reduction in patient wait times', 'Unified billing across departments'],
    image: '/media/posters/packages/shop_custom_software.jpg',
  },
  {
    slug: 'eliprime-home-wellness',
    name: 'Eliprime Home Wellness Clinic',
    category: 'healthcare',
    client: 'Eliprime',
    description:
      'Home-based wellness clinic platform with caregiver scheduling and patient monitoring — plus brand identity.',
    technologies: ['Flutter', 'Firebase', 'Node.js', 'Logo Design'],
    results: ['500+ home visits coordinated monthly', 'Real-time caregiver tracking'],
    logo: '/client-logos/eliprime.webp',
  },
  {
    slug: 'eventra-fest-identity',
    name: 'Eventra Fest Brand Identity',
    category: 'brand',
    client: 'Eventra Fest',
    description:
      'Official square logo and event brand system for Eventra Fest.',
    technologies: ['Logo Design', 'Brand Identity'],
    results: ['Launch-ready event brand', 'Consistent visual system'],
    logo: '/client-logos/eventra-fest.png',
  },
  {
    slug: 'school-management-kenya',
    name: 'School Management Systems',
    category: 'education',
    description:
      'Multi-school management platform with fee collection, timetabling, and parent portals.',
    technologies: ['React', 'PostgreSQL', 'M-Pesa Integration'],
    results: ['15+ schools onboarded', '90% fee collection rate improvement'],
    image: '/media/posters/packages/shop_starter_web.jpg',
  },
  {
    slug: 'erp-manufacturing',
    name: 'ERP for Manufacturing',
    category: 'business',
    description:
      'Custom ERP system for a manufacturing company with inventory and production tracking.',
    technologies: ['Python', 'React', 'MySQL'],
    results: ['30% inventory cost reduction', 'Real-time production visibility'],
    image: '/media/posters/packages/consult_it_fullday.jpg',
  },
  {
    slug: 'inventory-retail-chain',
    name: 'Inventory Systems',
    category: 'business',
    description: 'Multi-outlet inventory management for a retail chain across East Africa.',
    technologies: ['React', 'PostgreSQL', 'REST APIs'],
    results: ['20 outlets connected', 'Automated reorder workflows'],
    image: '/media/posters/packages/shop_ecommerce.jpg',
  },
  {
    slug: 'corporate-websites',
    name: 'Corporate Websites & Brand Marks',
    category: 'web',
    description:
      'Modern corporate websites and logo systems for hospitality, services, and professional brands — including Black Sauce, Delightful Staycation, and Eli’s Xpress Errands.',
    technologies: ['React', 'Tailwind CSS', 'Logo Design', 'Cloudflare Pages'],
    results: ['SEO-optimized', 'Sub-second load times', 'Distinct brand identities'],
    image: '/project-logos/brand-work-collection.png',
  },
  {
    slug: 'ecommerce-platforms',
    name: 'E-commerce Platforms',
    category: 'web',
    description:
      'Full-featured online stores with payment integration and mobile-first design.',
    technologies: ['React', 'Node.js', 'Stripe', 'M-Pesa'],
    results: ['Mobile-first checkout', 'Integrated payment gateways'],
    image: '/media/posters/packages/shop_business_web.jpg',
  },
]

export function getPortfolioBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug)
}
