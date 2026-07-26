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

/** Start Paystack redirect checkout; throws on config/API errors. */
export async function startPaystackCheckout(input: InitializePaymentInput) {
  const res = await initializePaystackPayment(input)
  if (!res.authorization_url) {
    throw new Error('Paystack did not return a checkout URL')
  }
  window.location.href = res.authorization_url
  return res
}
