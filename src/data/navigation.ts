import type { SiteFeatureSettings } from '@/lib/siteFeatures'
import { isPathEnabled } from '@/lib/siteFeatures'

export interface NavLink {
  label: string
  href: string
  description?: string
}

export interface NavGroup {
  label: string
  items: NavLink[]
}

export interface NavItem {
  label: string
  href: string
  /** Flat dropdown (e.g. Products) */
  children?: NavLink[]
  /** Grouped mega-menu (e.g. Services) */
  groups?: NavGroup[]
}

/** Flatten groups or children for consumers that need a single list */
export function getNavLinks(item: NavItem): NavLink[] {
  if (item.groups?.length) return item.groups.flatMap((g) => g.items)
  return item.children ?? []
}

/** Primary desktop nav — keep short to avoid logo collision */
export const primaryNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    groups: [
      {
        label: 'Design',
        items: [
          { label: 'Logo Design', href: '/services/logo-design' },
          { label: 'Web Design', href: '/services/web-design' },
          { label: 'UI/UX Designing', href: '/services/ui-ux-designing' },
          { label: 'Branding', href: '/services/branding-services' },
        ],
      },
      {
        label: 'Career',
        items: [
          { label: 'Resume Building', href: '/services/resume-building' },
          { label: 'Resume / CV Revamp', href: '/services/resume-cv-design-revamping' },
          { label: 'Cover Letter', href: '/services/cover-letter-writing' },
          { label: 'LinkedIn Optimisation', href: '/services/linkedin-optimisation' },
        ],
      },
      {
        label: 'Development',
        items: [
          { label: 'Web Development', href: '/services/web-development' },
          { label: 'Software Development', href: '/services/software-development' },
          { label: 'AI Development', href: '/services/ai-development-automation' },
        ],
      },
      {
        label: 'Consulting',
        items: [
          { label: 'IT Consulting', href: '/services/it-consulting' },
          { label: 'Digital Transformation', href: '/services/digital-transformation-consulting' },
          { label: 'Cloud Consulting', href: '/services/cloud-infrastructure-consulting' },
        ],
      },
      {
        label: 'Growth & Security',
        items: [
          { label: 'Digital Marketing', href: '/services/digital-marketing' },
          { label: 'Cyber Security', href: '/services/cyber-security' },
          { label: 'App Testing', href: '/services/app-testing' },
        ],
      },
      {
        label: 'Support & Print',
        items: [
          { label: 'OS Installation', href: '/services/os-installation' },
          { label: 'Kenya Tax Returns', href: '/services/kenya-tax-return' },
          { label: 'Apparel Branding', href: '/services/apparel-branding' },
          { label: 'Business Cards', href: '/services/business-cards' },
          { label: 'Stationery Rebrand', href: '/services/stationery-rebrand' },
          { label: 'Business Rebrand Kit', href: '/services/business-rebrand-kit' },
        ],
      },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Healthcare', href: '/products#healthcare', description: 'MedFlow, AfyaVox & more' },
      { label: 'Artificial Intelligence', href: '/products#ai', description: 'RV22, Juno4, AfyaVox & more' },
      { label: 'Business Solutions', href: '/products#business', description: 'ERP, POS & SACCO' },
      { label: 'Digital Products', href: '/products#digital', description: 'Websites, apps & e-commerce' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Request', href: '/request' },
]

/** Secondary items — shown under “More” on desktop */
export const moreNavigation: NavItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
  { label: 'Clients', href: '/clients' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Client account', href: '/account' },
  { label: 'Staff login', href: '/staff/login' },
  { label: 'Contact', href: '/contact' },
]

/** Full list for mobile drawer */
export const mainNavigation: NavItem[] = [...primaryNavigation, ...moreNavigation]

export const footerNavigation = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Clients', href: '/clients' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Request a service', href: '/request' },
    { label: 'Contact', href: '/contact' },
  ],
  products: [
    { label: 'MedFlow', href: '/products/medflow' },
    { label: 'AfyaVox AI', href: '/products/afyavox' },
    { label: 'Juno4', href: '/products/juno4' },
    { label: 'RV22 AI', href: '/products/rv22' },
    { label: 'All Products', href: '/products' },
  ],
  services: [
    { label: 'IT Consulting', href: '/services/it-consulting' },
    { label: 'Kenya Tax Returns', href: '/services/kenya-tax-return' },
    { label: 'Apparel Branding', href: '/services/apparel-branding' },
    { label: 'Business Cards', href: '/services/business-cards' },
    { label: 'Stationery Rebrand', href: '/services/stationery-rebrand' },
    { label: 'All Services', href: '/services' },
  ],
  group: [
    { label: 'Ellines Tech', href: 'https://tech.ellines.co.ke' },
    { label: 'Ellines Haven', href: 'https://haven.ellines.co.ke/' },
    { label: 'Ellines Rattan (Furniture)', href: 'https://rattan.ellines.co.ke' },
  ],
  resources: [
    { label: 'Articles', href: '/resources#articles' },
    { label: 'Case Studies', href: '/resources#case-studies' },
    { label: 'Product Pricing', href: '/pricing' },
    { label: 'Client account', href: '/account' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Terms', href: '/terms' },
  ],
}

/** Human-readable footer column titles — never rely on raw object keys */
export const footerSectionLabels: Record<keyof typeof footerNavigation, string> = {
  company: 'Company',
  products: 'Products',
  services: 'Services',
  group: 'Ellines Group',
  resources: 'Resources',
}

function linkAllowed(href: string, settings: SiteFeatureSettings) {
  if (href.startsWith('http')) return true
  return isPathEnabled(href.split('#')[0] || href, settings)
}

export function filterNavItems(items: NavItem[], settings: SiteFeatureSettings): NavItem[] {
  return items
    .filter((item) => linkAllowed(item.href, settings))
    .map((item) => {
      if (item.groups) {
        return {
          ...item,
          groups: item.groups
            .map((g) => ({
              ...g,
              items: g.items.filter((l) => linkAllowed(l.href, settings)),
            }))
            .filter((g) => g.items.length > 0),
        }
      }
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((l) => linkAllowed(l.href, settings)),
        }
      }
      return item
    })
}

export function filterFooterNavigation(
  settings: SiteFeatureSettings,
): typeof footerNavigation {
  const next = { ...footerNavigation }
  ;(Object.keys(next) as (keyof typeof footerNavigation)[]).forEach((key) => {
    next[key] = footerNavigation[key].filter((l) => linkAllowed(l.href, settings))
  })
  return next
}
