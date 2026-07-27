const SENTRY_DSN = String(import.meta.env.VITE_SENTRY_DSN || '').trim()

/** Optional Sentry browser SDK via CDN — only loads when VITE_SENTRY_DSN is set. */
export function initMonitoring() {
  if (!SENTRY_DSN || typeof window === 'undefined') return
  if (document.getElementById('et-sentry')) return

  const loader = document.createElement('script')
  loader.id = 'et-sentry'
  loader.src = 'https://browser.sentry-cdn.com/8.47.0/bundle.tracing.min.js'
  loader.crossOrigin = 'anonymous'
  loader.onload = () => {
    const Sentry = (window as unknown as { Sentry?: { init: (opts: Record<string, unknown>) => void } })
      .Sentry
    Sentry?.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
    })
  }
  document.head.appendChild(loader)
}

export function monitoringConfigured() {
  return Boolean(SENTRY_DSN)
}
