export interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}

/** Primary desktop nav — keep short to avoid logo collision */
export const primaryNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Software Development', href: '/services#software', description: 'Custom software & enterprise systems' },
      { label: 'Web Development', href: '/services#web', description: 'Websites, e-commerce & CMS' },
      { label: 'Mobile Development', href: '/services#mobile', description: 'Android, iOS & Flutter apps' },
      { label: 'AI Services', href: '/services#ai', description: 'Assistants, ML & automation' },
      { label: 'Cloud Solutions', href: '/services#cloud', description: 'Migration, AWS & Cloudflare' },
      { label: 'Cybersecurity', href: '/services#security', description: 'Audits & penetration testing' },
      { label: 'IT Consulting', href: '/services#consulting', description: 'Digital transformation' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Healthcare', href: '/products#healthcare', description: 'MedFlow, AfyaVox & more' },
      { label: 'Artificial Intelligence', href: '/products#ai', description: 'RV22, chatbots & voice AI' },
      { label: 'Business Solutions', href: '/products#business', description: 'ERP, POS & SACCO' },
      { label: 'Digital Products', href: '/products#digital', description: 'Websites, apps & e-commerce' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
]

/** Secondary items — shown under “More” on desktop */
export const moreNavigation: NavItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/resources' },
  { label: 'Careers', href: '/careers' },
  { label: 'Clients', href: '/clients' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Contact', href: '/contact' },
]

/** Full list for mobile drawer */
export const mainNavigation: NavItem[] = [...primaryNavigation, ...moreNavigation]

export const footerNavigation = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Clients', href: '/clients' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Contact', href: '/contact' },
  ],
  products: [
    { label: 'MedFlow', href: '/products/medflow' },
    { label: 'AfyaVox AI', href: '/products/afyavox' },
    { label: 'RV22 AI', href: '/products/rv22' },
    { label: 'All Products', href: '/products' },
  ],
  services: [
    { label: 'Software Development', href: '/services#software' },
    { label: 'AI Services', href: '/services#ai' },
    { label: 'Cloud Solutions', href: '/services#cloud' },
    { label: 'All Services', href: '/services' },
  ],
  resources: [
    { label: 'Articles', href: '/resources#articles' },
    { label: 'Case Studies', href: '/resources#case-studies' },
    { label: 'Documentation', href: '/resources#documentation' },
    { label: 'FAQs', href: '/resources#faqs' },
  ],
}
