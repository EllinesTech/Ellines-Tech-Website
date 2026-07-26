/**
 * Shared auth, abuse-control, and visitor-context helpers for Ellines Tech
 * Pages Functions. Everything here is server-only — never import from `src/`.
 *
 * Access lanes:
 *   god   — platform owner. Raw ADMIN_API_KEY, a server-issued admin session
 *           token, or a signed-in user whose CMS role is `super_admin`.
 *   staff — signed-in CMS user with role `staff` or `admin`.
 */

/**
 * Fallback owner key used only when ADMIN_API_KEY is unset in local Wrangler.
 * Never accepted on Cloudflare Pages (CF_PAGES=1) — a missing production secret
 * must fail closed instead of unlocking with a known source-committed string.
 */
const DEV_ADMIN_KEY = 'EllinesGodMode2026'

const STAFF_ROLES = new Set(['staff', 'admin', 'super_admin'])
const GOD_ROLES = new Set(['super_admin'])
/** Roles allowed to see unmasked visitor IPs. */
const PII_ROLES = new Set(['owner', 'super_admin', 'admin'])

const GOD_SESSION_TTL_SECONDS = 12 * 60 * 60
const USER_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60

const ALLOWED_ORIGIN_SUFFIXES = ['.ellines.co.ke', '.pages.dev']
const ALLOWED_ORIGINS = new Set([
  'https://ellines.co.ke',
  'https://tech.ellines.co.ke',
  'https://haven.ellines.co.ke',
  'https://rattan.ellines.co.ke',
])

export const ALLOWED_HEADERS = 'Content-Type, X-Admin-Key, X-User-Token'

async function kvGetJson(env, key, fallback) {
  try {
    const raw = await env.ET_STORE.get(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function kvPutJson(env, key, value, options) {
  await env.ET_STORE.put(key, JSON.stringify(value), options)
}

export function token(prefix = 'tok') {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${prefix}_${hex}`
}

/** Length-independent comparison so a wrong key can't be probed byte by byte. */
export function timingSafeEqual(a, b) {
  const left = String(a ?? '')
  const right = String(b ?? '')
  const length = Math.max(left.length, right.length)
  let diff = left.length ^ right.length
  for (let i = 0; i < length; i += 1) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0)
  }
  return diff === 0
}

export function resolveAdminKey(env) {
  const configured = String(env?.ADMIN_API_KEY ?? '').trim()
  if (configured) return configured
  // Cloudflare Pages injects CF_PAGES=1 at runtime.
  if (String(env?.CF_PAGES ?? '') === '1') return ''
  return DEV_ADMIN_KEY
}

/* ------------------------------------------------------------------ *
 * CORS / origin
 * ------------------------------------------------------------------ */

function isAllowedOrigin(origin, request) {
  if (!origin) return false
  let parsed
  try {
    parsed = new URL(origin)
  } catch {
    return false
  }
  try {
    if (parsed.origin === new URL(request.url).origin) return true
  } catch {
    /* ignore */
  }
  if (ALLOWED_ORIGINS.has(parsed.origin)) return true
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true
  return ALLOWED_ORIGIN_SUFFIXES.some((suffix) => parsed.hostname.endsWith(suffix))
}

/**
 * Reflects only trusted origins instead of `*`, so a hostile page cannot read
 * authenticated responses even if a browser ever forwards our headers.
 */
export function corsHeaders(request) {
  const origin = request?.headers?.get?.('Origin') || ''
  const allowed = isAllowedOrigin(origin, request)
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': ALLOWED_HEADERS,
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

/**
 * Cross-site POSTs from a browser always carry an Origin header, so rejecting
 * unknown origins blocks drive-by writes while leaving server-to-server and
 * same-origin traffic (no Origin header) working.
 */
export function originAllowed(request) {
  const origin = request?.headers?.get?.('Origin') || ''
  if (!origin) return true
  return isAllowedOrigin(origin, request)
}

/* ------------------------------------------------------------------ *
 * Rate limiting
 * ------------------------------------------------------------------ */

export function clientIp(request) {
  const headers = request?.headers
  if (!headers) return ''
  return (
    headers.get('CF-Connecting-IP') ||
    (headers.get('X-Forwarded-For') || '').split(',')[0].trim() ||
    headers.get('X-Real-IP') ||
    ''
  )
}

function windowKey(bucket, windowSeconds) {
  const window = Math.max(60, Math.floor(windowSeconds))
  return { key: `rl:${bucket}:${Math.floor(Date.now() / (window * 1000))}`, window }
}

/**
 * Fixed-window counter in KV. Windows are at least 60s because that is the
 * minimum TTL Workers KV accepts. Checks and consumes in one call.
 */
export async function rateLimit(env, bucket, { limit = 20, windowSeconds = 300 } = {}) {
  if (!env?.ET_STORE) return { ok: true, remaining: limit }
  const { key, window } = windowKey(bucket, windowSeconds)
  try {
    const current = Number((await env.ET_STORE.get(key)) || 0)
    if (current >= limit) return { ok: false, remaining: 0, retryAfter: window }
    await env.ET_STORE.put(key, String(current + 1), { expirationTtl: window + 60 })
    return { ok: true, remaining: Math.max(0, limit - current - 1) }
  } catch {
    // Never let a storage hiccup take the endpoint down.
    return { ok: true, remaining: limit }
  }
}

/** Read the counter without consuming — pair with `rateLimitBump` on failure. */
export async function rateLimitPeek(env, bucket, { limit = 20, windowSeconds = 300 } = {}) {
  if (!env?.ET_STORE) return { ok: true, remaining: limit }
  const { key, window } = windowKey(bucket, windowSeconds)
  try {
    const current = Number((await env.ET_STORE.get(key)) || 0)
    if (current >= limit) return { ok: false, remaining: 0, retryAfter: window }
    return { ok: true, remaining: limit - current }
  } catch {
    return { ok: true, remaining: limit }
  }
}

export async function rateLimitBump(env, bucket, { windowSeconds = 300 } = {}) {
  if (!env?.ET_STORE) return
  const { key, window } = windowKey(bucket, windowSeconds)
  try {
    const current = Number((await env.ET_STORE.get(key)) || 0)
    await env.ET_STORE.put(key, String(current + 1), { expirationTtl: window + 60 })
  } catch {
    /* ignore */
  }
}

/** Rate limit keyed on caller IP (falls back to a shared bucket behind proxies). */
export function rateLimitByIp(env, request, name, options) {
  const ip = clientIp(request) || 'unknown'
  return rateLimit(env, `${name}:${ip}`, options)
}

/**
 * Sign-in limiter: only failed attempts burn the budget, so a legitimate owner
 * signing in repeatedly is never locked out while brute force still caps out.
 */
export function authAttemptBucket(request, name) {
  return `${name}:${clientIp(request) || 'unknown'}`
}

/* ------------------------------------------------------------------ *
 * Visitor context
 * ------------------------------------------------------------------ */

const BROWSER_RULES = [
  [/Edg[eA]?\/([\d.]+)/, 'Edge'],
  [/OPR\/([\d.]+)/, 'Opera'],
  [/SamsungBrowser\/([\d.]+)/, 'Samsung Internet'],
  [/Firefox\/([\d.]+)/, 'Firefox'],
  [/CriOS\/([\d.]+)/, 'Chrome (iOS)'],
  [/Chrome\/([\d.]+)/, 'Chrome'],
  [/Version\/([\d.]+).*Safari/, 'Safari'],
  [/Safari\/([\d.]+)/, 'Safari'],
]

const OS_RULES = [
  [/Windows NT 10\.0/, 'Windows 10/11'],
  [/Windows NT ([\d.]+)/, 'Windows'],
  [/Android ([\d.]+)/, 'Android'],
  [/iPhone OS ([\d_]+)/, 'iOS'],
  [/iPad;.*OS ([\d_]+)/, 'iPadOS'],
  [/Mac OS X ([\d_.]+)/, 'macOS'],
  [/CrOS/, 'ChromeOS'],
  [/Linux/, 'Linux'],
]

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|headless|curl|wget|python-requests|axios|postman/i

export function parseUserAgent(rawUa) {
  const ua = String(rawUa || '')
  if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown', bot: false }

  let browser = 'Unknown'
  for (const [pattern, name] of BROWSER_RULES) {
    const match = ua.match(pattern)
    if (match) {
      browser = match[1] ? `${name} ${match[1].split('.')[0]}` : name
      break
    }
  }

  let os = 'Unknown'
  for (const [pattern, name] of OS_RULES) {
    const match = ua.match(pattern)
    if (match) {
      os = match[1] ? `${name} ${match[1].replace(/_/g, '.').split('.').slice(0, 2).join('.')}` : name
      break
    }
  }

  const isTablet = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))
  const isMobile = /Mobi|iPhone|Android/i.test(ua)
  const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop'

  return { browser, os, device, bot: BOT_PATTERN.test(ua) }
}

/** IPv4 keeps three octets, IPv6 keeps the routing prefix. */
export function maskIp(ip) {
  const value = String(ip || '').trim()
  if (!value) return ''
  if (value.includes(':')) {
    const parts = value.split(':').filter(Boolean)
    return `${parts.slice(0, 3).join(':')}::…`
  }
  const octets = value.split('.')
  if (octets.length !== 4) return '…'
  return `${octets[0]}.${octets[1]}.${octets[2]}.x`
}

/**
 * Everything we know about the caller from Cloudflare edge metadata. Stored
 * against presence / chat records so admins get context without extra lookups.
 */
export function visitorContext(request) {
  const cf = request?.cf || {}
  const ua = request?.headers?.get?.('User-Agent') || ''
  const parsed = parseUserAgent(ua)
  const referrer = request?.headers?.get?.('Referer') || ''
  return {
    ip: clientIp(request),
    country: String(cf.country || ''),
    countryName: String(cf.country || ''),
    region: String(cf.region || cf.regionCode || ''),
    city: String(cf.city || ''),
    postalCode: String(cf.postalCode || ''),
    timezone: String(cf.timezone || ''),
    network: String(cf.asOrganization || ''),
    asn: cf.asn ? String(cf.asn) : '',
    colo: String(cf.colo || ''),
    browser: parsed.browser,
    os: parsed.os,
    device: parsed.device,
    bot: parsed.bot,
    userAgent: ua.slice(0, 300),
    referrer: referrer.slice(0, 300),
    language: (request?.headers?.get?.('Accept-Language') || '').split(',')[0].slice(0, 20),
  }
}

/** Strip or mask fields a given actor should not see. */
export function redactVisitor(visitor, actor) {
  if (!visitor || typeof visitor !== 'object') return visitor
  const canSeeIp = PII_ROLES.has(actor?.role || '')
  return {
    ...visitor,
    ip: canSeeIp ? visitor.ip || '' : '',
    ipMasked: maskIp(visitor.ip),
    userAgent: canSeeIp ? visitor.userAgent || '' : '',
  }
}

/** Human-readable "Nyeri, Kenya" style label. */
export function locationLabel(visitor) {
  if (!visitor) return ''
  return [visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ')
}

/* ------------------------------------------------------------------ *
 * Actors / sessions
 * ------------------------------------------------------------------ */

export async function createGodSession(env, meta = {}) {
  const value = token('god')
  await kvPutJson(
    env,
    `cms:god-session:${value}`,
    { ...meta, at: new Date().toISOString() },
    { expirationTtl: GOD_SESSION_TTL_SECONDS },
  )
  return { token: value, expiresIn: GOD_SESSION_TTL_SECONDS }
}

export async function revokeGodSession(env, value) {
  const key = String(value || '').trim()
  if (!key.startsWith('god_')) return
  try {
    await env.ET_STORE.delete(`cms:god-session:${key}`)
  } catch {
    /* ignore */
  }
}

export async function createUserSession(env, user) {
  const value = token('tok')
  await kvPutJson(
    env,
    `cms:session:${value}`,
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      /** Bumped on password change/reset so older tokens die immediately. */
      passwordVersion: user.passwordVersion || 0,
      at: new Date().toISOString(),
      expiresAt: new Date(Date.now() + USER_SESSION_TTL_SECONDS * 1000).toISOString(),
    },
    { expirationTtl: USER_SESSION_TTL_SECONDS },
  )
  return value
}

export async function resolveUserSession(request, env) {
  const value = (request.headers.get('X-User-Token') || '').trim()
  if (!value) return null
  const session = await kvGetJson(env, `cms:session:${value}`, null)
  if (!session?.userId) return null
  if (session.expiresAt && Date.parse(session.expiresAt) < Date.now()) return null
  const users = await kvGetJson(env, 'cms:users', [])
  const user = users.find((u) => u.id === session.userId)
  if (!user || user.active === false) return null
  if ((session.passwordVersion || 0) !== (user.passwordVersion || 0)) return null
  return user
}

/**
 * Resolve who is calling, in order of privilege. Returns `null` when the caller
 * has no elevated access at all.
 *
 * `kind` is 'god' | 'staff'; `role` is the finer-grained label used for PII
 * gating ('owner' means the raw owner key / admin panel session).
 */
export async function resolveActor(request, env) {
  const adminHeader = (request.headers.get('X-Admin-Key') || '').trim()

  if (adminHeader) {
    const expectedKey = resolveAdminKey(env)
    if (expectedKey && timingSafeEqual(adminHeader, expectedKey)) {
      return { kind: 'god', role: 'owner', name: 'Owner', user: null, via: 'owner_key' }
    }
    if (adminHeader.startsWith('god_')) {
      const session = await kvGetJson(env, `cms:god-session:${adminHeader}`, null)
      if (session) {
        return {
          kind: 'god',
          role: 'owner',
          name: session.name || 'Owner',
          user: null,
          via: 'admin_session',
        }
      }
    }
  }

  const user = await resolveUserSession(request, env)
  if (user && GOD_ROLES.has(user.role)) {
    return {
      kind: 'god',
      role: 'super_admin',
      name: user.name || 'Super Admin',
      user,
      via: 'super_admin_session',
    }
  }
  if (user && STAFF_ROLES.has(user.role)) {
    return { kind: 'staff', role: user.role, name: user.name || 'Staff', user, via: 'user_session' }
  }
  return null
}

export async function isGod(request, env) {
  const actor = await resolveActor(request, env)
  return actor?.kind === 'god'
}

export function canSeeVisitorPii(actor) {
  return PII_ROLES.has(actor?.role || '')
}

/* ------------------------------------------------------------------ *
 * Input hygiene
 * ------------------------------------------------------------------ */

/** Trim, cap length, and drop control characters from free-text input. */
export function cleanText(value, max = 500) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max)
}

/** Plain-text field that must never carry markup (names, subjects, slugs). */
export function cleanPlain(value, max = 200) {
  return cleanText(value, max).replace(/[<>]/g, '')
}

export function cleanEmail(value) {
  const email = cleanPlain(value, 160).toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : ''
}

/** E.164-ish phone for SMS delivery; empty string when unusable. */
export function cleanPhone(value) {
  let digits = String(value || '').replace(/[^\d+]/g, '')
  if (!digits) return ''
  if (digits.startsWith('+')) digits = digits.slice(1)
  if (digits.startsWith('0') && digits.length === 10) digits = `254${digits.slice(1)}`
  if (digits.startsWith('7') && digits.length === 9) digits = `254${digits}`
  if (digits.length < 10 || digits.length > 15) return ''
  return `+${digits}`
}

/** Shared password rules for register / change / reset. */
export function validatePassword(password) {
  const value = String(password || '')
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (value.length > 128) return 'Password is too long'
  return ''
}

const BLOCKED_HTML =
  /<\s*\/?\s*(script|iframe|object|embed|link|style|meta|base|form|svg)\b[^>]*>|javascript:|data:text\/html|on[a-z]+\s*=/gi

/** Keep basic authoring markup while removing script vectors from CMS bodies. */
export function sanitizeRichText(value, max = 60000) {
  return cleanText(value, max).replace(BLOCKED_HTML, '')
}

/** Common bot trap: a hidden field real users never fill in. */
export function honeypotTripped(body) {
  return Boolean(
    cleanPlain(body?.website, 200) || cleanPlain(body?.hp, 200) || cleanPlain(body?.fax, 200),
  )
}
