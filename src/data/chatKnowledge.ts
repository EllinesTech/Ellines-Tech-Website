export interface ChatFaq {
  id: string
  questions: string[]
  answer: string
  links?: { label: string; href: string }[]
}

/** Default engagement knowledge — editable from Admin chat settings */
export const defaultChatFaqs: ChatFaq[] = [
  {
    id: 'hello',
    questions: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer:
      'Hello — I’m Ellenia, the Ellines Tech assistant. I can help with products, services, pricing, and technical questions, or connect you to a human. What do you need?',
  },
  {
    id: 'ellenia',
    questions: ['who are you', 'your name', 'ellenia', 'are you a bot', 'what are you'],
    answer:
      'I’m Ellenia — the AI assistant built into the Ellines Tech website. I answer product, service, pricing, and technical questions, and I can hand you to a human agent or WhatsApp any time.',
  },
  {
    id: 'what-you-do',
    questions: ['what do you do', 'who are you', 'about ellines', 'services', 'what services'],
    answer:
      'Ellines Tech builds software, AI, websites, brand identity, IT consulting, and digital systems for businesses across Africa. Flagship work includes AfyaVox, RV22, Juno4, MedFlow, and custom enterprise platforms.',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'IT Consulting', href: '/services/it-consulting' },
      { label: 'Products', href: '/products' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    id: 'ellines-group',
    questions: [
      'ellines group',
      'sister companies',
      'sister brands',
      'ellines haven',
      'ellines rattan',
      'parent company',
      'group companies',
    ],
    answer:
      'Ellines Tech is part of Ellines Group — the parent company of Ellines Tech (technology), Ellines Haven (publishing), and Ellines Rattan (furniture).',
    links: [{ label: 'About Ellines Group', href: '/about' }],
  },
  {
    id: 'consulting',
    questions: ['consulting', 'it consulting', 'advisor', 'advisory', 'roadmap', 'digital transformation'],
    answer:
      'We offer IT consulting, digital transformation advisory, and cloud/infrastructure consulting — from half-day sessions to multi-week technology roadmaps.',
    links: [
      { label: 'IT Consulting', href: '/services/it-consulting' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Request', href: '/request' },
    ],
  },
  {
    id: 'products',
    questions: ['products', 'afyavox', 'rv22', 'juno4', 'medflow', 'software products'],
    answer:
      'Our product ecosystem includes AfyaVox AI (clinical assistant), RV22 AI Assistant, Juno4 AI platform, MedFlow hospital systems, plus ERP, POS, and digital products.',
    links: [{ label: 'View products', href: '/products' }],
  },
  {
    id: 'pricing',
    questions: ['price', 'pricing', 'cost', 'how much', 'quote', 'budget'],
    answer:
      'Pricing depends on scope. Share your goals and we’ll send a tailored quote — usually within a day. You can also request a quote online anytime.',
    links: [{ label: 'Request a quote', href: '/contact#quote' }],
  },
  {
    id: 'hours',
    questions: ['hours', 'open', 'available', 'when are you open', '24/7', 'weekend'],
    answer:
      'We’re always open — 24/7 for demos, support, and project inquiries. Chat here or WhatsApp a human anytime.',
  },
  {
    id: 'location',
    questions: ['where', 'location', 'address', 'nyeri', 'nairobi', 'kenya', 'office', 'offices'],
    answer:
      'We have two locations in Kenya — our head office at Square2 Street, Skt, Nyeri, and a Nairobi presence for client meetings and on-site work. We serve clients across Africa and globally.',
    links: [{ label: 'Contact', href: '/contact' }],
  },
  {
    id: 'contact',
    questions: ['contact', 'phone', 'email', 'whatsapp', 'call', 'reach'],
    answer:
      'Reach us on WhatsApp +254 748 255 466, call +254 728 807 213, or email info@ellines.co.ke (general) / tech@ellines.co.ke (orders & projects).',
    links: [{ label: 'Contact page', href: '/contact' }],
  },
  {
    id: 'human',
    questions: ['human', 'agent', 'person', 'talk to someone', 'support agent', 'real person'],
    answer:
      'Absolutely — I can connect you to a human on WhatsApp right away. Tap “Talk to a human” below.',
  },
  {
    id: 'careers',
    questions: ['job', 'career', 'hiring', 'internship', 'work with you'],
    answer:
      'We’re always interested in sharp builders. Check Careers or email us with your CV.',
    links: [{ label: 'Careers', href: '/careers' }],
  },
  {
    id: 'security',
    questions: ['security', 'secure', 'data protection', 'privacy', 'compliance'],
    answer:
      'Security is built into how we design and ship. Read our Privacy Policy for how we handle data, or ask a human for a security discussion.',
    links: [{ label: 'Privacy', href: '/privacy' }],
  },
  {
    id: 'payments',
    questions: [
      'm-pesa',
      'mpesa',
      'm pesa',
      'paystack',
      'stripe',
      'paypal',
      'payment',
      'payments',
      'mobile money',
      'paybill',
      'till number',
      'integrate m-pesa',
      'integrate paystack',
      'payment gateway',
      'checkout',
      'can you integrate m-pesa and paystack',
    ],
    answer:
      'Yes — we regularly integrate M-Pesa (STK Push, Paybill, Till) and Paystack (card, mobile money, deposits) into websites, apps, e-commerce, and invoicing. Typical scope covers checkout UX, webhooks, reconciliation, and receipting. Whether you need one gateway or both, we design around your stack and compliance needs. Cost and timeline depend on existing systems and edge cases (refunds, partial payments, multi-currency). Share a short brief on /request and we’ll propose a clear integration plan.',
    links: [
      { label: 'Request a quote', href: '/request' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    id: 'integrations',
    questions: [
      'integrate',
      'integration',
      'integrations',
      'api',
      'apis',
      'webhook',
      'webhooks',
      'third party',
      'crm',
      'erp',
      'sms gateway',
      'connect to',
    ],
    answer:
      'Yes — integrations are core to how we ship. We connect payment gateways, CRMs, ERPs, SMS/WhatsApp channels, hospital and SACCO systems, and custom APIs into websites, mobile apps, and back-office tools. We map auth, data flows, webhooks, error handling, and go-live cutover as part of delivery. Tell me which systems you need linked, or send a brief via /request.',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Request a quote', href: '/request' },
    ],
  },
  {
    id: 'timeline',
    questions: [
      'mvp',
      'timeline',
      'how fast',
      'how long',
      'how soon',
      'turnaround',
      'delivery time',
      'ship an mvp',
      'when can you start',
      'how fast can you ship',
    ],
    answer:
      'Speed depends on scope. A focused website or landing build can move in weeks; a Mobile App MVP or payment-ready storefront is often a few weeks to a couple of months once requirements are clear; larger hospital, AI, or multi-module systems are phased. We start with a written plan — deliverables, timeline, and investment — before build. Share your target launch date on /request and we’ll say what’s realistic.',
    links: [
      { label: 'Request a quote', href: '/request' },
      { label: 'Pricing packages', href: '/pricing' },
    ],
  },
  {
    id: 'custom-software',
    questions: [
      'custom software',
      'custom app',
      'build an app',
      'build a system',
      'booking system',
      'custom booking',
      'web app',
      'mobile app',
    ],
    answer:
      'We design and build custom software — web apps, mobile MVPs, booking systems, ERP/POS modules, and industry platforms (healthcare, finance, hospitality). Engagements usually run discovery → written proposal → staged delivery with demos. Package starting points are on /pricing; bespoke work is quoted after a short brief.',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Request', href: '/request' },
    ],
  },
]

export const chatQuickReplies = [
  'What services do you offer?',
  'Tell me about your products',
  'Request a quote',
  'Talk to a human',
] as const
