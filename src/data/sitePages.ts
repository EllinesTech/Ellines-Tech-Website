export type SitePageGroup = 'Core' | 'Company' | 'Commerce' | 'Support' | 'Legal'

export type SitePageEntry = {
  /** Public route as rendered by the router. */
  path: string
  label: string
  group: SitePageGroup
  description: string
  /**
   * Sections of `cms:site-copy` that already drive this route's hero.
   * Present here so the editor can point admins at the right tool.
   */
  coreCopySection?: 'home' | 'about' | 'contact' | 'solutions'
}

/**
 * Every public route a Super Admin can attach CMS content to.
 * Routes listed here are editable even before a `cms:pages` record exists —
 * the editor creates the record on first save.
 */
export const sitePages: SitePageEntry[] = [
  {
    path: '/',
    label: 'Home',
    group: 'Core',
    description: 'Landing page — hero, group story, services, and testimonials.',
    coreCopySection: 'home',
  },
  {
    path: '/about',
    label: 'About',
    group: 'Core',
    description: 'Company story, founder, and group profile.',
    coreCopySection: 'about',
  },
  {
    path: '/services',
    label: 'Services',
    group: 'Core',
    description: 'Service catalogue grid — items are managed under Services.',
  },
  {
    path: '/products',
    label: 'Products',
    group: 'Core',
    description: 'Product catalogue — items are managed under Products.',
  },
  {
    path: '/solutions',
    label: 'Solutions',
    group: 'Core',
    description: 'Integrated solutions overview.',
    coreCopySection: 'solutions',
  },
  {
    path: '/industries',
    label: 'Industries',
    group: 'Company',
    description: 'Sectors served — healthcare, education, finance, retail.',
  },
  {
    path: '/portfolio',
    label: 'Portfolio',
    group: 'Company',
    description: 'Project showcase — items are managed under Portfolio.',
  },
  {
    path: '/clients',
    label: 'Clients',
    group: 'Company',
    description: 'Client roster and featured brand marks.',
  },
  {
    path: '/success-stories',
    label: 'Success Stories',
    group: 'Company',
    description: 'Case studies and outcome highlights.',
  },
  {
    path: '/careers',
    label: 'Careers',
    group: 'Company',
    description: 'Open roles and culture — postings are managed under Careers.',
  },
  {
    path: '/pricing',
    label: 'Pricing',
    group: 'Commerce',
    description: 'Package pricing — tiers are managed under Product Pricing.',
  },
  {
    path: '/request',
    label: 'Request a service',
    group: 'Commerce',
    description: 'Guided request flow that feeds the Leads inbox.',
  },
  {
    path: '/account',
    label: 'Client account',
    group: 'Commerce',
    description: 'Customer login, requests, and invoices.',
  },
  {
    path: '/contact',
    label: 'Contact',
    group: 'Support',
    description: 'Contact details and enquiry form.',
    coreCopySection: 'contact',
  },
  {
    path: '/resources',
    label: 'Resources',
    group: 'Support',
    description: 'Knowledge hub index — articles are managed under Resources.',
  },
  {
    path: '/faq',
    label: 'FAQ',
    group: 'Support',
    description: 'Frequently asked questions — entries live in FAQ Manager.',
  },
  {
    path: '/privacy',
    label: 'Privacy Policy',
    group: 'Legal',
    description: 'Data protection and privacy statement.',
  },
  {
    path: '/terms',
    label: 'Terms of Service',
    group: 'Legal',
    description: 'Engagement terms and conditions.',
  },
  {
    path: '/cookies',
    label: 'Cookie Policy',
    group: 'Legal',
    description: 'Cookie and tracking disclosure.',
  },
]

export const sitePageGroups: SitePageGroup[] = [
  'Core',
  'Company',
  'Commerce',
  'Support',
  'Legal',
]

/** Matches the server's `normalizeRoutePath` so lookups agree on both sides. */
export function normalizeRoutePath(value: string | undefined | null): string {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const noQuery = raw.split(/[?#]/)[0]
  const withSlash = noQuery.startsWith('/') ? noQuery : `/${noQuery}`
  const trimmed = withSlash.replace(/\/+$/, '')
  return trimmed || '/'
}