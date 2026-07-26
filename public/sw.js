/* Ellines Tech — lightweight PWA service worker (network-first navigations). */
const CACHE = 'ellines-tech-shell-v1'
const PRECACHE = ['/', '/manifest.webmanifest', '/logos/logo-square.png', '/logos/logo-mark-nav.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

function shouldBypass(url) {
  return (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/pay') ||
    url.searchParams.has('no-sw')
  )
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin || shouldBypass(url)) return

  // Navigations: network-first so Cloudflare Pages / Vite deploys stay fresh.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful shells — a transient 5xx must not poison offline fallback.
          if (response.ok) {
            const copy = response.clone()
            void caches.open(CACHE).then((cache) => cache.put('/', copy)).catch(() => undefined)
          }
          return response
        })
        .catch(() => caches.match('/') || caches.match(request)),
    )
    return
  }

  // Static assets: stale-while-revalidate for snappy repeat visits.
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/logos/') ||
    url.pathname.startsWith('/media/') ||
    url.pathname.endsWith('.webmanifest')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone()
              void caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined)
            }
            return response
          })
          .catch(() => cached)
        return cached || network
      }),
    )
  }
})
