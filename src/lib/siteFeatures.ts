/** Site-wide feature toggles + engagement settings (KV-backed via CMS) */

export type SiteFeatureSettings = {
  careersEnabled: boolean
  requestEnabled: boolean
  chatEnabled: boolean
  pricingEnabled: boolean
  resourcesEnabled: boolean
  downloadsEnabled: boolean
  newsletterEnabled: boolean
  contactEnabled: boolean
  announcement: string
  alwaysOpen: boolean
}

export const defaultFeatureSettings: SiteFeatureSettings = {
  careersEnabled: true,
  requestEnabled: true,
  chatEnabled: true,
  pricingEnabled: true,
  resourcesEnabled: true,
  downloadsEnabled: true,
  newsletterEnabled: true,
  contactEnabled: true,
  announcement: '',
  alwaysOpen: true,
}

export type FeatureKey = keyof Omit<SiteFeatureSettings, 'announcement' | 'alwaysOpen'>

export const FEATURE_TOGGLE_META: {
  key: FeatureKey
  label: string
  description: string
  paths: string[]
}[] = [
  {
    key: 'careersEnabled',
    label: 'Careers',
    description: 'Hide careers from nav and block public applications.',
    paths: ['/careers'],
  },
  {
    key: 'requestEnabled',
    label: 'Request a service',
    description: 'Hide /request and block the service-request flow.',
    paths: ['/request'],
  },
  {
    key: 'chatEnabled',
    label: 'Live chat',
    description: 'Hide the customer chat widget site-wide.',
    paths: [],
  },
  {
    key: 'pricingEnabled',
    label: 'Pricing / shop',
    description: 'Hide pricing pages from navigation and public access.',
    paths: ['/pricing', '/shop'],
  },
  {
    key: 'resourcesEnabled',
    label: 'Resources',
    description: 'Hide the knowledge hub from nav and public routes.',
    paths: ['/resources'],
  },
  {
    key: 'downloadsEnabled',
    label: 'Company downloads',
    description: 'Hide downloadable company materials on public surfaces.',
    paths: [],
  },
  {
    key: 'newsletterEnabled',
    label: 'Newsletter',
    description: 'Block public newsletter signups.',
    paths: [],
  },
  {
    key: 'contactEnabled',
    label: 'Contact form',
    description: 'Hide contact from nav and block the contact form.',
    paths: ['/contact'],
  },
]

/** Map a public path to the feature flag that gates it (if any) */
export function featureKeyForPath(pathname: string): FeatureKey | null {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/careers' || path.startsWith('/careers/')) return 'careersEnabled'
  if (path === '/request' || path.startsWith('/request/')) return 'requestEnabled'
  if (path === '/pricing' || path === '/shop' || path.startsWith('/pricing/') || path.startsWith('/shop/'))
    return 'pricingEnabled'
  if (path === '/resources' || path.startsWith('/resources/')) return 'resourcesEnabled'
  if (path === '/contact' || path.startsWith('/contact/')) return 'contactEnabled'
  return null
}

export function isPathEnabled(pathname: string, settings: SiteFeatureSettings): boolean {
  const key = featureKeyForPath(pathname)
  if (!key) return true
  return Boolean(settings[key])
}
