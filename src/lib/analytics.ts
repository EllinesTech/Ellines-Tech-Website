import { hasAnalyticsConsent } from '@/lib/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Public GA4 measurement id — override at build with VITE_GA_MEASUREMENT_ID if needed. */
const GA_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-PZQ4SNSL56').trim()
const SITE_VERIFY = String(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim()

let gaReady = false

function ensureGtag() {
  if (!GA_ID || gaReady || typeof document === 'undefined') return
  if (document.getElementById('et-ga4')) {
    gaReady = true
    return
  }
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true, send_page_view: false })
  const script = document.createElement('script')
  script.id = 'et-ga4'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(script)
  gaReady = true
}

/** Inject Search Console verification meta when configured at build time. */
export function ensureSearchConsoleVerification() {
  if (!SITE_VERIFY || typeof document === 'undefined') return
  let el = document.querySelector('meta[name="google-site-verification"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'google-site-verification')
    document.head.appendChild(el)
  }
  el.setAttribute('content', SITE_VERIFY)
}

/** Load GA4 only after analytics consent. No-op without VITE_GA_MEASUREMENT_ID. */
export function initAnalytics() {
  ensureSearchConsoleVerification()
  if (!GA_ID || !hasAnalyticsConsent()) return
  ensureGtag()
}

export function trackPageView(path: string) {
  if (!GA_ID || !hasAnalyticsConsent()) return
  ensureGtag()
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  })
}

export function analyticsConfigured() {
  return Boolean(GA_ID)
}
