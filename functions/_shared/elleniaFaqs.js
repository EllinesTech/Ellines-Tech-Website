/**
 * Shipped Ellenia FAQ seed + merge helper.
 * Keeps Workers AI grounding and CMS chat-faqs in sync with core capabilities
 * (payments, integrations, timelines) even when KV holds an older short list.
 */

export function defaultElleniaFaqs() {
  return [
    {
      id: 'welcome',
      questions: ['hi', 'hello', 'hey'],
      answer:
        'Hello — I’m Ellenia, the Ellines Tech assistant. I can help with products, services, pricing, and technical questions, or connect you to a human agent or WhatsApp.',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      id: 'pricing',
      questions: ['pricing', 'how much', 'cost', 'price', 'quote', 'budget'],
      answer:
        'Transparent package pricing is on our Pricing page. Custom projects are quoted after a short brief — usually within a day.',
      links: [
        { label: 'View pricing', href: '/pricing' },
        { label: 'Request a quote', href: '/request' },
      ],
    },
    {
      id: 'payments',
      questions: [
        'm-pesa',
        'mpesa',
        'paystack',
        'payment',
        'payments',
        'mobile money',
        'integrate m-pesa',
        'integrate paystack',
        'payment gateway',
        'can you integrate m-pesa and paystack',
      ],
      answer:
        'Yes — we regularly integrate M-Pesa (STK Push, Paybill, Till) and Paystack (card, mobile money, deposits) into websites, apps, e-commerce, and invoicing. Typical scope covers checkout UX, webhooks, reconciliation, and receipting. Cost and timeline depend on your stack — share a brief on /request for a clear plan.',
      links: [
        { label: 'Request a quote', href: '/request' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      id: 'integrations',
      questions: ['integrate', 'integration', 'integrations', 'api', 'webhook', 'crm', 'erp'],
      answer:
        'Yes — integrations are core to how we ship. We connect payment gateways, CRMs, ERPs, SMS/WhatsApp channels, hospital and SACCO systems, and custom APIs. Tell us which systems to link via /request.',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Request a quote', href: '/request' },
      ],
    },
    {
      id: 'timeline',
      questions: ['mvp', 'timeline', 'how fast', 'how long', 'ship an mvp', 'turnaround'],
      answer:
        'Speed depends on scope. Focused websites can move in weeks; a Mobile App MVP or payment-ready storefront is often a few weeks to a couple of months once requirements are clear; larger systems are phased. We start with a written plan before build — share your target date on /request.',
      links: [
        { label: 'Request a quote', href: '/request' },
        { label: 'Pricing packages', href: '/pricing' },
      ],
    },
  ]
}

/** Seed first, then overlay stored rows so custom CMS edits win per id. */
export function mergeElleniaFaqs(stored) {
  const seed = defaultElleniaFaqs()
  const byId = new Map()
  for (const faq of seed) byId.set(faq.id, faq)
  if (Array.isArray(stored)) {
    for (const faq of stored) {
      if (faq?.id) byId.set(faq.id, faq)
    }
  }
  return [...byId.values()]
}
