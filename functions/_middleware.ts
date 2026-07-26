import { ALLOWED_HEADERS, corsHeaders, originAllowed } from './_shared/security'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/** Applied to every API response from Pages Functions. */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

/**
 * Central edge guard for all Pages Functions:
 *  - answers CORS preflight with a trusted-origin allowlist instead of `*`
 *  - rejects cross-origin state-changing calls (drive-by writes from other sites)
 *  - normalises the CORS + security headers each route returns
 *  - SPA fallback for extension-less 404s if Functions still intercept static routes
 */
function looksLikeSpaPath(pathname) {
  const last = pathname.split('/').pop() || ''
  return last === '' || !last.includes('.')
}

export async function onRequest(context) {
  const { request, next, env } = context
  const path = new URL(request.url).pathname
  // Static assets / SPA: keep `public/_headers` untouched. If Functions still
  // intercept (missing `_routes.json`), rewrite HTML 404s to the app shell.
  if (!path.startsWith('/api/') && !path.startsWith('/pay/')) {
    const response = await next()
    if (
      response.status === 404 &&
      SAFE_METHODS.has(request.method) &&
      looksLikeSpaPath(path) &&
      env?.ASSETS
    ) {
      return env.ASSETS.fetch(new URL('/', request.url))
    }
    return response
  }

  const cors = corsHeaders(request)

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...cors, 'Access-Control-Allow-Headers': ALLOWED_HEADERS },
    })
  }

  if (!SAFE_METHODS.has(request.method) && !originAllowed(request)) {
    return new Response(JSON.stringify({ error: 'origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...cors },
    })
  }

  const response = await next()
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries({ ...cors, ...SECURITY_HEADERS })) {
    headers.set(key, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
