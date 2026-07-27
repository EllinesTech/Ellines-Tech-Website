/**
 * Shared Paystack helpers for Ellines Group hub (Tech / Haven / Rattan).
 * Secret key: env PAYSTACK_SECRET_KEY preferred, else CMS payments config.
 */

export const PAYSTACK_PUBLIC_KEY_DEFAULT =
  'pk_live_081be2d1bdd05a16be4cc91b1267553a6444b463'

export const BRAND_ORIGINS = {
  haven: 'https://haven.ellines.co.ke',
  tech: 'https://tech.ellines.co.ke',
  rattan: 'https://rattanfurniture.ellines.co.ke',
}

export const INSTANT_CHECKOUT_CATEGORIES = new Set([
  'Career Documents',
  'Tax & Compliance',
  'Graphics',
  'Stationery',
  'Tech Support',
])

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-User-Token',
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

export function id(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export async function getJson(env, key, fallback) {
  const raw = await env.ET_STORE.get(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export async function putJson(env, key, value) {
  await env.ET_STORE.put(key, JSON.stringify(value))
}

export function defaultPaymentMethods() {
  return {
    currency: 'KES',
    merchantEmail: 'ellines.group@gmail.com',
    mode: 'live',
    mpesa: {
      enabled: false,
      paybill: '',
      accountName: '',
      tillNumber: '',
      consumerKey: '',
      consumerSecret: '',
      passkey: '',
      shortcode: '',
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      merchantEmail: 'ellines.group@gmail.com',
    },
    paystack: {
      enabled: true,
      publicKey: PAYSTACK_PUBLIC_KEY_DEFAULT,
      secretKey: '',
      webhookSecret: '',
      merchantEmail: 'ellines.group@gmail.com',
    },
    notes: '',
    updatedAt: '',
  }
}

export async function loadPaymentMethods(env) {
  const stored = await getJson(env, 'cms:payments', null)
  const base = defaultPaymentMethods()
  if (!stored || typeof stored !== 'object') return base
  return {
    ...base,
    ...stored,
    mpesa: { ...base.mpesa, ...(stored.mpesa || {}) },
    paypal: { ...base.paypal, ...(stored.paypal || {}) },
    paystack: { ...base.paystack, ...(stored.paystack || {}) },
  }
}

/** Prefer Cloudflare secret; fall back to CMS-stored secret. */
export async function resolvePaystackSecret(env) {
  const fromEnv = String(env.PAYSTACK_SECRET_KEY || '').trim()
  if (fromEnv) return fromEnv
  const cfg = await loadPaymentMethods(env)
  return String(cfg.paystack?.secretKey || '').trim()
}

export async function resolveWebhookSecret(env) {
  const fromEnv = String(env.PAYSTACK_WEBHOOK_SECRET || '').trim()
  if (fromEnv) return fromEnv
  const cfg = await loadPaymentMethods(env)
  const custom = String(cfg.paystack?.webhookSecret || '').trim()
  if (custom) return custom
  return resolvePaystackSecret(env)
}

export function normalizeCurrency(raw) {
  const c = String(raw || 'KES').trim().toUpperCase()
  if (c === 'USD') return 'USD'
  return 'KES'
}

/** Paystack expects amount in subunits (kobo / cents). */
export function toSubunits(amountMajor, currency) {
  const n = Number(amountMajor)
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.round(n * 100)
}

export function fromSubunits(amountSub, currency) {
  const n = Number(amountSub)
  if (!Number.isFinite(n)) return 0
  return n / 100
}

export function normalizeBrand(raw) {
  const b = String(raw || 'tech').trim().toLowerCase()
  if (b === 'haven' || b === 'rattan' || b === 'tech') return b
  return 'tech'
}

export function brandOrigin(brand) {
  return BRAND_ORIGINS[normalizeBrand(brand)] || BRAND_ORIGINS.tech
}

export function hubOrigin(env, request) {
  const fromEnv = String(env.PAYSTACK_HUB_ORIGIN || '').trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  try {
    return new URL(request.url).origin
  } catch {
    return 'https://ellines.co.ke'
  }
}

export async function paystackFetch(path, secret, init = {}) {
  const res = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

export async function verifyTransaction(secret, reference) {
  const ref = String(reference || '').trim()
  if (!ref) return { ok: false, error: 'reference required' }
  const { ok, data } = await paystackFetch(
    `/transaction/verify/${encodeURIComponent(ref)}`,
    secret,
  )
  if (!ok || !data?.status) {
    return { ok: false, error: data?.message || 'verification failed', data }
  }
  return { ok: true, data: data.data, message: data.message }
}

export async function hmacSha512Hex(secret, body) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyWebhookSignature(env, rawBody, signatureHeader) {
  const sig = String(signatureHeader || '').trim()
  if (!sig) return { ok: false, reason: 'missing_signature' }
  const secret = await resolveWebhookSecret(env)
  if (!secret) return { ok: false, reason: 'missing_secret' }
  const expected = await hmacSha512Hex(secret, rawBody)
  if (expected !== sig) return { ok: false, reason: 'bad_signature' }
  return { ok: true }
}

async function logActivity(env, entry) {
  const list = await getJson(env, 'cms:activity', [])
  list.unshift({
    id: id('act'),
    at: new Date().toISOString(),
    ...entry,
  })
  await putJson(env, 'cms:activity', list.slice(0, 200))
}

async function sendResendEmail(env, { to, subject, html }) {
  const key = env.RESEND_API_KEY
  if (!key) return { sent: false, reason: 'no_key' }
  try {
    const from = env.RESEND_FROM || 'Ellines Tech <onboarding@resend.dev>'
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    })
    if (!res.ok) return { sent: false, reason: `http_${res.status}` }
    return { sent: true }
  } catch {
    return { sent: false, reason: 'network' }
  }
}

/**
 * Idempotent apply of a successful Paystack charge to invoices / pending orders.
 */
export async function applySuccessfulPayment(env, tx, requestOrigin) {
  const reference = String(tx?.reference || '').trim()
  if (!reference) return { ok: false, error: 'no reference' }

  const processedKey = `cms:paystack-processed:${reference}`
  const already = await getJson(env, processedKey, null)
  if (already?.done) {
    return { ok: true, idempotent: true, result: already }
  }

  const meta = tx.metadata && typeof tx.metadata === 'object' ? tx.metadata : {}
  const brand = normalizeBrand(meta.brand || 'tech')
  const type = String(meta.type || 'invoice').toLowerCase()
  const invoiceId = String(meta.invoiceId || meta.invoice_id || '').trim()
  const currency = normalizeCurrency(tx.currency || meta.currency || 'KES')
  const paidMajor = fromSubunits(tx.amount, currency)

  let invoice = null
  const invoices = await getJson(env, 'cms:invoices', [])

  if (invoiceId) {
    const idx = invoices.findIndex((i) => i.id === invoiceId)
    if (idx >= 0) {
      const inv = invoices[idx]
      if (inv.status === 'paid' && inv.paymentRef === reference) {
        const result = { done: true, brand, type, invoiceId, status: 'paid', reference }
        await putJson(env, processedKey, result)
        return { ok: true, idempotent: true, result, invoice: inv }
      }

      const prevPaid = Number(inv.amountPaid || 0)
      const nextPaid = Math.min(
        Number(inv.total) || paidMajor + prevPaid,
        Math.round((prevPaid + paidMajor) * 100) / 100,
      )
      const fullyPaid = nextPaid + 0.001 >= Number(inv.total || 0)
      const receiptNumber =
        inv.receiptNumber ||
        (fullyPaid ? `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}` : null)

      invoices[idx] = {
        ...inv,
        amountPaid: nextPaid,
        status: fullyPaid ? 'paid' : inv.status === 'draft' ? 'sent' : inv.status,
        paidAt: fullyPaid ? new Date().toISOString() : inv.paidAt || null,
        paymentMethod: 'Paystack',
        paymentRef: reference,
        receiptNumber: fullyPaid ? receiptNumber : inv.receiptNumber || null,
        updatedAt: new Date().toISOString(),
        lastPaymentAt: new Date().toISOString(),
        lastPaymentType: type === 'deposit' ? 'deposit' : type,
      }
      invoice = invoices[idx]
      await putJson(env, 'cms:invoices', invoices)

      if (fullyPaid && invoice.clientEmail) {
        const origin = requestOrigin || brandOrigin(brand)
        const link = `${origin}/invoice/${invoice.id}?token=${invoice.publicToken}`
        await sendResendEmail(env, {
          to: invoice.clientEmail,
          subject: `Ellines Tech — receipt ${receiptNumber}`,
          html: `<p>Hi ${invoice.clientName || 'there'},</p>
<p>Payment received via Paystack. Receipt <strong>${receiptNumber}</strong> for invoice ${invoice.number}.</p>
<p>Total: ${invoice.currency} ${Number(invoice.total).toLocaleString()}</p>
<p><a href="${link}">View receipt</a></p>
<p>— Ellines Group</p>`,
        })
      }

      await logActivity(env, {
        type: 'paystack',
        message: fullyPaid
          ? `Paystack paid invoice ${invoice.number} (${reference})`
          : `Paystack deposit on ${invoice.number}: ${currency} ${paidMajor} (${reference})`,
      })
    }
  }

  // Pending checkout order bookkeeping
  const pending = await getJson(env, `cms:paystack-pending:${reference}`, null)
  if (pending) {
    pending.status = 'paid'
    pending.paidAt = new Date().toISOString()
    pending.paystack = { amount: paidMajor, currency, channel: tx.channel }
    await putJson(env, `cms:paystack-pending:${reference}`, pending)
  }

  const result = {
    done: true,
    brand,
    type,
    invoiceId: invoice?.id || invoiceId || null,
    invoiceNumber: invoice?.number || null,
    status: invoice?.status || 'recorded',
    amountPaid: paidMajor,
    currency,
    reference,
    publicToken: invoice?.publicToken || null,
  }
  await putJson(env, processedKey, result)
  return { ok: true, result, invoice }
}

export function publicPaymentsView(cfg) {
  const secretConfigured = Boolean(String(cfg.paystack?.secretKey || '').trim())
  return {
    currency: cfg.currency || 'KES',
    mode: cfg.mode || 'live',
    merchantEmail: cfg.merchantEmail || cfg.paystack?.merchantEmail || '',
    paystack: {
      enabled: Boolean(cfg.paystack?.enabled),
      publicKey: String(cfg.paystack?.publicKey || PAYSTACK_PUBLIC_KEY_DEFAULT).trim(),
      merchantEmail: cfg.paystack?.merchantEmail || '',
      /** Never expose secret; only whether runtime can charge */
      secretConfigured: false,
    },
    /** Client hint only — actual secret check is server-side */
    _hint: secretConfigured ? undefined : undefined,
  }
}
