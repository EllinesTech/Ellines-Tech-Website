export interface ChatFaq {
  id: string
  questions: string[]
  answer: string
  links?: { label: string; href: string }[]
}

/** Default engagement knowledge — editable from Admin God Mode */
export const defaultChatFaqs: ChatFaq[] = [
  {
    id: 'hello',
    questions: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer:
      'Hello — welcome to Ellines Tech. I can help with products, services, pricing, or connect you to a human on WhatsApp. What do you need?',
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
    questions: ['where', 'location', 'address', 'nairobi', 'kenya', 'office'],
    answer:
      'Ellines Tech is based in Nairobi, Kenya, and serves clients across Africa and globally.',
    links: [{ label: 'Contact', href: '/contact' }],
  },
  {
    id: 'contact',
    questions: ['contact', 'phone', 'email', 'whatsapp', 'call', 'reach'],
    answer:
      'Reach us on WhatsApp +254 748 255 466, call +254 728 807 213, or email info@tech.ellines.co.ke / info@ellines.co.ke.',
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
]

export const chatQuickReplies = [
  'What services do you offer?',
  'Tell me about your products',
  'Request a quote',
  'Talk to a human',
] as const
