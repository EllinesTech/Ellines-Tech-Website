import {
  applySuccessfulPayment,
  brandOrigin,
  cors,
  normalizeBrand,
  resolvePaystackSecret,
  verifyTransaction,
} from '../_shared/paystack'

function htmlPage(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b1220; color: #e2e8f0; margin: 0; min-height: 100vh; display: grid; place-items: center; }
    .card { max-width: 28rem; padding: 2rem; border: 1px solid rgba(255,255,255,.1); border-radius: 1rem; background: rgba(255,255,255,.04); text-align: center; }
    a { color: #67e8f9; }
    p { line-height: 1.5; color: #94a3b8; }
  </style>
</head>
<body><div class="card">${body}</div></body>
</html>`
}

function redirect(url, status = 302) {
  return new Response(null, {
    status,
    headers: { Location: url, ...cors },
  })
}

async function handleReturn(context) {
  const { request, env } = context
  const url = new URL(request.url)
  let reference = url.searchParams.get('reference') || url.searchParams.get('trxref') || ''

  if (request.method === 'POST') {
    try {
      const ct = request.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const body = await request.json()
        reference = reference || body.reference || body.trxref || ''
      } else {
        const form = await request.formData()
        reference = reference || String(form.get('reference') || form.get('trxref') || '')
      }
    } catch {
      /* ignore */
    }
  }

  reference = String(reference || '').trim()
  if (!reference) {
    return new Response(
      htmlPage(
        'Payment return',
        '<h1>Missing reference</h1><p>No Paystack reference was provided. Return to your brand site and try again.</p>',
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8', ...cors } },
    )
  }

  if (!env.ET_STORE) {
    return new Response(
      htmlPage('Payment return', '<h1>Service unavailable</h1><p>Storage is not configured.</p>'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8', ...cors } },
    )
  }

  const secret = await resolvePaystackSecret(env)
  if (!secret) {
    return new Response(
      htmlPage(
        'Payment return',
        '<h1>Payments not configured</h1><p>Secret key missing. Ask an admin to set <code>PAYSTACK_SECRET_KEY</code> or Admin → Payment methods.</p>',
      ),
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', ...cors } },
    )
  }

  const verified = await verifyTransaction(secret, reference)
  if (!verified.ok || !verified.data) {
    const fallback = `${brandOrigin('tech')}/pay/result?status=failed&reference=${encodeURIComponent(reference)}`
    return redirect(fallback)
  }

  const tx = verified.data
  const success = String(tx.status || '').toLowerCase() === 'success'
  let brand = 'tech'
  let invoiceId = ''
  let publicToken = ''

  if (success) {
    const applied = await applySuccessfulPayment(env, tx, brandOrigin('tech'))
    const meta = tx.metadata && typeof tx.metadata === 'object' ? tx.metadata : {}
    brand = normalizeBrand(applied.result?.brand || meta.brand || 'tech')
    invoiceId = applied.result?.invoiceId || meta.invoiceId || ''
    publicToken = applied.result?.publicToken || meta.publicToken || ''
  } else {
    const meta = tx.metadata && typeof tx.metadata === 'object' ? tx.metadata : {}
    brand = normalizeBrand(meta.brand || 'tech')
    invoiceId = String(meta.invoiceId || '')
    publicToken = String(meta.publicToken || '')
  }

  const dest = new URL(`${brandOrigin(brand)}/pay/result`)
  dest.searchParams.set('status', success ? 'success' : 'failed')
  dest.searchParams.set('reference', reference)
  if (invoiceId) dest.searchParams.set('invoiceId', invoiceId)
  if (publicToken) dest.searchParams.set('token', publicToken)
  if (tx.amount != null) dest.searchParams.set('amount', String(tx.amount))
  if (tx.currency) dest.searchParams.set('currency', String(tx.currency))

  return redirect(dest.toString())
}

export async function onRequestGet(context) {
  return handleReturn(context)
}

export async function onRequestPost(context) {
  return handleReturn(context)
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}
