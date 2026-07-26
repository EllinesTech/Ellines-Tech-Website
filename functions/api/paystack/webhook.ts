import {
  applySuccessfulPayment,
  cors,
  json,
  verifyWebhookSignature,
} from '../../_shared/paystack'

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)

  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature') || ''

  // Verify when a secret is available; reject if signature present but invalid.
  const verified = await verifyWebhookSignature(env, rawBody, signature)
  if (!verified.ok) {
    if (verified.reason === 'missing_secret') {
      // No secret configured — still accept in degraded mode but log via response note
      // Prefer failing closed when signature header is sent without a matching secret path.
      return json(
        {
          error:
            'Webhook secret / PAYSTACK_SECRET_KEY not configured. Cannot verify Paystack events.',
          code: 'secret_missing',
        },
        503,
      )
    }
    if (verified.reason === 'missing_signature') {
      return json({ error: 'missing x-paystack-signature' }, 401)
    }
    return json({ error: 'invalid signature' }, 401)
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return json({ error: 'invalid JSON' }, 400)
  }

  const eventName = String(event.event || '')
  if (eventName !== 'charge.success' && eventName !== 'paymentrequest.success') {
    return json({ ok: true, ignored: eventName || 'unknown' })
  }

  const tx = event.data
  if (!tx || String(tx.status || '').toLowerCase() !== 'success') {
    return json({ ok: true, ignored: 'not_success' })
  }

  const origin = new URL(request.url).origin
  const applied = await applySuccessfulPayment(env, tx, origin)
  if (!applied.ok) {
    return json({ error: applied.error || 'apply failed' }, 500)
  }

  return json({ ok: true, result: applied.result, idempotent: Boolean(applied.idempotent) })
}

/** Health / docs */
export async function onRequestGet() {
  return json({
    ok: true,
    endpoint: '/api/paystack/webhook',
    expects: 'POST from Paystack with x-paystack-signature',
  })
}
