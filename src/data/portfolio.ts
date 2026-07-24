export type PortfolioCategory = 'healthcare' | 'education' | 'business' | 'ai' | 'web'

export interface PortfolioProject {
  slug: string
  name: string
  category: PortfolioCategory
  client?: string
  description: string
  technologies: string[]
  results?: string[]
}

export const portfolioCategories: Record<PortfolioCategory, string> = {
  healthcare: 'Healthcare',
  education: 'Education',
  business: 'Business',
  ai: 'AI',
  web: 'Web',
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'medflow-deployment',
    name: 'MedFlow Hospital Management',
    category: 'healthcare',
    description: 'End-to-end hospital management system deployed across multiple healthcare facilities.',
    technologies: ['Python', 'React', 'PostgreSQL', 'Docker'],
    results: ['40% reduction in patient wait times', 'Unified billing across departments'],
  },
  {
    slug: 'eliprime-home-wellness',
    name: 'Eliprime Home Wellness Clinic',
    category: 'healthcare',
    client: 'Eliprime',
    description: 'Home-based wellness clinic platform with caregiver scheduling and patient monitoring.',
    technologies: ['Flutter', 'Firebase', 'Node.js'],
    results: ['500+ home visits coordinated monthly', 'Real-time caregiver tracking'],
  },
  {
    slug: 'school-management-kenya',
    name: 'School Management Systems',
    category: 'education',
    description: 'Multi-school management platform with fee collection, timetabling, and parent portals.',
    technologies: ['React', 'PostgreSQL', 'M-Pesa Integration'],
    results: ['15+ schools onboarded', '90% fee collection rate improvement'],
  },
  {
    slug: 'erp-manufacturing',
    name: 'ERP for Manufacturing',
    category: 'business',
    description: 'Custom ERP system for a manufacturing company with inventory and production tracking.',
    technologies: ['Python', 'React', 'MySQL'],
    results: ['30% inventory cost reduction', 'Real-time production visibility'],
  },
  {
    slug: 'inventory-retail-chain',
    name: 'Inventory Systems',
    category: 'business',
    description: 'Multi-outlet inventory management for a retail chain across East Africa.',
    technologies: ['React', 'PostgreSQL', 'REST APIs'],
    results: ['20 outlets connected', 'Automated reorder workflows'],
  },
  {
    slug: 'rv22-enterprise',
    name: 'RV22 AI Assistant',
    category: 'ai',
    description: 'Enterprise AI assistant deployed for customer support and internal knowledge management.',
    technologies: ['Python', 'OpenAI', 'React', 'Vector DB'],
    results: ['60% reduction in support tickets', '24/7 automated responses'],
  },
  {
    slug: 'afyavox-clinical',
    name: 'AfyaVox Clinical AI',
    category: 'ai',
    description: 'Voice-powered clinical documentation assistant for healthcare providers.',
    technologies: ['Python', 'Speech AI', 'React', 'PostgreSQL'],
    results: ['50% faster clinical documentation', 'Multi-language support'],
  },
  {
    slug: 'corporate-websites',
    name: 'Corporate Websites',
    category: 'web',
    description: 'Modern corporate websites for businesses across finance, healthcare, and professional services.',
    technologies: ['React', 'Tailwind CSS', 'Cloudflare Pages'],
    results: ['SEO-optimized', 'Sub-second load times'],
  },
  {
    slug: 'ecommerce-platforms',
    name: 'E-commerce Platforms',
    category: 'web',
    description: 'Full-featured online stores with payment integration and mobile-first design.',
    technologies: ['React', 'Node.js', 'Stripe', 'M-Pesa'],
    results: ['Mobile-first checkout', 'Integrated payment gateways'],
  },
]

export function getPortfolioBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug)
}
