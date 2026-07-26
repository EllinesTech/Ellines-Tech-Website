import { ALLOWED_HEADERS, corsHeaders, originAllowed } from './_shared/security'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/** Applied to every response, including static assets served by Pages. */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
}

/**
 * Central edge guard for all Pages Functions:
 *  - answers CORS preflight with a trusted-origin allowlist instead of `*`
 *  - rejects cross-origin state-changing calls (drive-by writes from other sites)
 *  - normalises the CORS + security headers each route returns
 */
export async function onRequest(context) {
  const { request, next } = context
  const path = new URL(request.url).pathname
  // Static assets keep their `public/_headers` rules untouched.
  if (!path.startsWith('/api/')) return next()

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
