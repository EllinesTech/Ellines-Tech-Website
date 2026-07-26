import {
  cors,
  getJson,
  hubOrigin,
  id,
  INSTANT_CHECKOUT_CATEGORIES,
  json,
  loadPaymentMethods,
  normalizeBrand,
  normalizeCurrency,
  putJson,
  resolvePaystackSecret,
  toSubunits,
  paystackFetch,
  PAYSTACK_PUBLIC_KEY_DEFAULT,
} from '../../_shared/paystack'

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}

/** Public Paystack readiness (no secrets). */
export async function onRequestGet(context) {
  const { env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const cfg = await loadPaymentMethods(env)
  const secret = await resolvePaystackSecret(env)
  return json({
    currency: cfg.currency || 'KES',
    mode: cfg.mode || 'live',
    merchantEmail: cfg.merchantEmail || cfg.paystack?.merchantEmail || '',
    paystack: {
      enabled: Boolean(cfg.paystack?.enabled),
      publicKey: String(cfg.paystack?.publicKey || PAYSTACK_PUBLIC_KEY_DEFAULT).trim(),
      merchantEmail: cfg.paystack?.merchantEmail || '',
      ready: Boolean(cfg.paystack?.enabled && secret),
      secretMissing: !secret,
    },
    instantCheckoutCategories: [...INSTANT_CHECKOUT_CATEGORIES],
  })
}

async function findShopPackage(env, packageId) {
  const products = await getJson(env, 'cms:shop-products', [])
  const list = Array.isArray(products) ? products : []
  return list.find((p) => p.id === packageId && p.status === 'published') || null
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)

  const cfg = await loadPaymentMethods(env)
  if (!cfg.paystack?.enabled) {
    return json(
      {
        error:
          'Paystack is disabled. Enable it in Admin → Payment methods, or set PAYSTACK_SECRET_KEY.',
      },
      400,
    )
  }

  const secret = await resolvePaystackSecret(env)
  if (!secret) {
    return json(
      {
        error:
          'Paystack secret key is not configured. Add PAYSTACK_SECRET_KEY in Cloudflare Pages secrets, or paste the secret in Admin → Payment methods.',
        code: 'secret_missing',
      },
      503,
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid JSON' }, 400)
  }

  const type = String(body.type || 'invoice').toLowerCase()
  const email = String(body.email || '').trim().toLowerCase()
  const brand = normalizeBrand(body.brand || 'tech')
  const currency = normalizeCurrency(body.currency || cfg.currency || 'KES')
  const name = String(body.name || '').trim().slice(0, 120)

  if (!email || !email.includes('@')) {
    return json({ error: 'valid email required' }, 400)
  }

  let amountMajor = Number(body.amount)
  let invoiceId = String(body.invoiceId || '').trim()
  let publicToken = String(body.publicToken || '').trim()
  let packageId = String(body.packageId || '').trim()
  let description = String(body.description || '').trim().slice(0, 200)
  let invoice = null

  const invoices = await getJson(env, 'cms:invoices', [])

  if (type === 'checkout') {
    if (!packageId) return json({ error: 'packageId required for checkout' }, 400)
    let pkg = await findShopPackage(env, packageId)
    // Fallback: accept client-supplied snapshot only if amount matches a known shape
    if (!pkg && body.packageSnapshot) {
      const snap = body.packageSnapshot
      if (
        snap.id === packageId &&
        INSTANT_CHECKOUT_CATEGORIES.has(String(snap.category || '')) &&
        Number(snap.price) > 0
      ) {
        pkg = snap
      }
    }
    if (!pkg) return json({ error: 'package not found or not published' }, 404)
    if (!INSTANT_CHECKOUT_CATEGORIES.has(String(pkg.category || ''))) {
      return json(
        {
          error:
            'This package uses custom scoping — please submit a request for an invoice instead of instant checkout.',
          code: 'not_instant_checkout',
        },
        400,
      )
    }
    amountMajor = Number(pkg.price)
    const chargeCurrency = normalizeCurrency(body.currency || pkg.currency || currency)
    description = description || String(pkg.name || 'Package checkout')

    invoice = {
      id: id('inv'),
      number: `ET-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
      publicToken: id('tok').replace('tok_', ''),
      clientName: name || email.split('@')[0],
      clientEmail: email,
      clientPhone: String(body.phone || '').trim().slice(0, 40),
      clientCompany: String(body.company || '').trim().slice(0, 120),
      items: [
        {
          description: `${pkg.name || description} (${pkg.category})`,
          qty: 1,
          unitPrice: amountMajor,
        },
      ],
      currency: chargeCurrency,
      subtotal: amountMajor,
      tax: 0,
      total: amountMajor,
      amountPaid: 0,
      status: 'sent',
      notes: 'Paystack instant checkout',
      dueDate: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: null,
      paymentMethod: '',
      paymentRef: '',
      receiptNumber: null,
      packageId,
      source: 'paystack_checkout',
    }
    invoices.unshift(invoice)
    await putJson(env, 'cms:invoices', invoices)
    invoiceId = invoice.id
    publicToken = invoice.publicToken
  } else if (type === 'invoice' || type === 'deposit') {
    if (!invoiceId) return json({ error: 'invoiceId required' }, 400)
    invoice = invoices.find((i) => i.id === invoiceId) || null
    if (!invoice) return json({ error: 'invoice not found' }, 404)
    if (publicToken && invoice.publicToken !== publicToken) {
      return json({ error: 'invalid invoice token' }, 403)
    }
    if (invoice.status === 'paid') {
      return json({ error: 'invoice already paid' }, 400)
    }
    if (invoice.status === 'cancelled') {
      return json({ error: 'invoice cancelled' }, 400)
    }
    const remaining = Math.max(0, Number(invoice.total || 0) - Number(invoice.amountPaid || 0))
    if (remaining <= 0) return json({ error: 'nothing left to pay' }, 400)

    if (type === 'deposit') {
      const requested = Number(body.amount)
      const defaultDeposit = Math.round(remaining * 0.5 * 100) / 100
      amountMajor =
        Number.isFinite(requested) && requested > 0
          ? Math.min(requested, remaining)
          : defaultDeposit
      if (amountMajor < 1) return json({ error: 'deposit amount too small' }, 400)
      description = description || `Deposit for invoice ${invoice.number}`
    } else {
      amountMajor = remaining
      description = description || `Invoice ${invoice.number}`
    }
  } else {
    return json({ error: 'type must be checkout, invoice, or deposit' }, 400)
  }

  const amountSub = toSubunits(amountMajor, currency)
  if (amountSub < 100) {
    return json({ error: 'amount too small for Paystack' }, 400)
  }

  const reference = `et_${brand}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const callbackBase = hubOrigin(env, request)
  const callback_url = `${callbackBase}/pay/return`

  const metadata = {
    brand,
    type,
    invoiceId: invoiceId || '',
    packageId: packageId || '',
    publicToken: publicToken || invoice?.publicToken || '',
    custom_fields: [
      { display_name: 'Brand', variable_name: 'brand', value: brand },
      { display_name: 'Type', variable_name: 'type', value: type },
      ...(invoice?.number
        ? [{ display_name: 'Invoice', variable_name: 'invoice', value: invoice.number }]
        : []),
    ],
  }

  const initPayload = {
    email,
    amount: amountSub,
    currency: normalizeCurrency(invoice?.currency || currency),
    reference,
    callback_url,
    metadata,
  }

  const { ok, data } = await paystackFetch('/transaction/initialize', secret, {
    method: 'POST',
    body: JSON.stringify(initPayload),
  })

  if (!ok || !data?.status) {
    return json(
      {
        error: data?.message || 'Paystack initialize failed',
        details: data,
      },
      502,
    )
  }

  const pending = {
    reference,
    brand,
    type,
    invoiceId: invoiceId || null,
    packageId: packageId || null,
    email,
    amount: amountMajor,
    currency: initPayload.currency,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  await putJson(env, `cms:paystack-pending:${reference}`, pending)

  return json({
    ok: true,
    authorization_url: data.data.authorization_url,
    access_code: data.data.access_code,
    reference: data.data.reference || reference,
    publicKey: String(cfg.paystack?.publicKey || PAYSTACK_PUBLIC_KEY_DEFAULT).trim(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          publicToken: invoice.publicToken,
          total: invoice.total,
          currency: invoice.currency,
        }
      : null,
    amount: amountMajor,
    currency: initPayload.currency,
    callback_url,
  })
}
