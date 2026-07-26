export type PaystackPublicConfig = {
  currency: string
  mode: string
  merchantEmail: string
  paystack: {
    enabled: boolean
    publicKey: string
    merchantEmail: string
    ready: boolean
    secretMissing: boolean
  }
  instantCheckoutCategories: string[]
}

export type InitializePaymentInput = {
  type: 'checkout' | 'invoice' | 'deposit'
  email: string
  name?: string
  phone?: string
  company?: string
  amount?: number
  currency?: 'KES' | 'USD' | string
  brand?: 'tech' | 'haven' | 'rattan'
  packageId?: string
  packageSnapshot?: {
    id: string
    name: string
    price: number
    currency: string
    category: string
  }
  invoiceId?: string
  publicToken?: string
  description?: string
}

export type InitializePaymentResult = {
  ok: boolean
  authorization_url: string
  access_code: string
  reference: string
  publicKey: string
  amount: number
  currency: string
  callback_url?: string
  invoice: {
    id: string
    number: string
    publicToken: string
    total: number
    currency: string
  } | null
  error?: string
  code?: string
}

type PaystackPopupHandler = {
  openIframe: () => void
}

type PaystackPopApi = {
  setup: (options: Record<string, unknown>) => PaystackPopupHandler
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopApi
  }
}

const PAYSTACK_INLINE_SRC = 'https://js.paystack.co/v1/inline.js'

let inlineScriptPromise: Promise<PaystackPopApi> | null = null

async function paystackFetch(path: string, init?: RequestInit) {
  let res: Response
  try {
    res = await fetch(path, init)
  } catch {
    throw new Error(
      'Payments API unreachable. Run `npm run preview:full` (or `npm run dev:api`) so Pages Functions are available.',
    )
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Payment request failed')
  }
  return data
}

export async function fetchPaystackConfig(): Promise<PaystackPublicConfig> {
  return paystackFetch('/api/paystack/initialize') as Promise<PaystackPublicConfig>
}

export async function initializePaystackPayment(
  input: InitializePaymentInput,
): Promise<InitializePaymentResult> {
  return paystackFetch('/api/paystack/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand: 'tech', ...input }),
  }) as Promise<InitializePaymentResult>
}

function loadPaystackInline(): Promise<PaystackPopApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Paystack popup requires a browser'))
  }
  if (window.PaystackPop?.setup) {
    return Promise.resolve(window.PaystackPop)
  }
  if (inlineScriptPromise) return inlineScriptPromise

  const pending = new Promise<PaystackPopApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_INLINE_SRC}"]`,
    )
    const onReady = () => {
      if (window.PaystackPop?.setup) resolve(window.PaystackPop)
      else reject(new Error('Paystack Inline failed to load'))
    }
    if (existing) {
      if (window.PaystackPop?.setup) onReady()
      else existing.addEventListener('load', onReady, { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Paystack Inline script error')),
        { once: true },
      )
      return
    }
    const script = document.createElement('script')
    script.src = PAYSTACK_INLINE_SRC
    script.async = true
    script.onload = onReady
    script.onerror = () => reject(new Error('Paystack Inline script error'))
    document.head.appendChild(script)
  })

  inlineScriptPromise = pending
  void pending.catch(() => {
    inlineScriptPromise = null
  })
  return pending
}

function returnUrlFor(res: InitializePaymentResult) {
  const base = (res.callback_url || `${window.location.origin}/pay/return`).replace(/\/$/, '')
  const url = new URL(base, window.location.origin)
  url.searchParams.set('reference', res.reference)
  url.searchParams.set('trxref', res.reference)
  return url.toString()
}

function openPaystackPopup(res: InitializePaymentResult): Promise<void> {
  return new Promise((resolve, reject) => {
    void loadPaystackInline()
      .then((PaystackPop) => {
        const handler = PaystackPop.setup({
          key: res.publicKey,
          access_code: res.access_code,
          callback: (response: { reference?: string }) => {
            const ref = String(response?.reference || res.reference || '').trim()
            const dest = returnUrlFor({ ...res, reference: ref || res.reference })
            window.location.href = dest
            resolve()
          },
          onClose: () => {
            reject(new Error('Payment window closed before completion'))
          },
        })
        handler.openIframe()
      })
      .catch(reject)
  })
}

export type StartCheckoutOptions = {
  /** Prefer on-site popup; falls back to hosted redirect if Inline fails. Default: popup. */
  preferPopup?: boolean
}

/** Start Paystack checkout via Inline popup when possible; otherwise redirect. */
export async function startPaystackCheckout(
  input: InitializePaymentInput,
  options: StartCheckoutOptions = {},
) {
  const preferPopup = options.preferPopup !== false
  const res = await initializePaystackPayment(input)
  if (!res.authorization_url && !res.access_code) {
    throw new Error('Paystack did not return a checkout session')
  }

  if (preferPopup && res.access_code && res.publicKey) {
    try {
      await openPaystackPopup(res)
      return res
    } catch (err) {
      const closed =
        err instanceof Error && err.message.toLowerCase().includes('closed before completion')
      if (closed) throw err
      // Popup blocked / script failed — fall through to hosted page
    }
  }

  if (!res.authorization_url) {
    throw new Error('Paystack did not return a checkout URL')
  }
  window.location.href = res.authorization_url
  return res
}
