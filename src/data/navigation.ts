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
      { label: 'Logo Design', href: '/services#design', description: 'Brand identity & logo design' },
      { label: 'Web Design', href: '/services#design', description: 'Visual website design' },
      { label: 'UI/UX Designing', href: '/services#design', description: 'Interfaces & product UX' },
      { label: 'Software Development', href: '/services#development', description: 'Custom software & DevOps' },
      { label: 'Web Development', href: '/services#development', description: 'Full-stack web apps' },
      { label: 'AI Development', href: '/services#ai', description: 'AI & automation' },
      { label: 'Digital Marketing', href: '/services#marketing', description: 'Strategy & growth' },
      { label: 'Cyber Security', href: '/services#security', description: 'Protect apps & data' },
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
    { label: 'Juno4', href: '/products/juno4' },
    { label: 'RV22 AI', href: '/products/rv22' },
    { label: 'All Products', href: '/products' },
  ],
  services: [
    { label: 'Design', href: '/services#design' },
    { label: 'Development', href: '/services#development' },
    { label: 'AI Development', href: '/services#ai' },
    { label: 'Marketing', href: '/services#marketing' },
    { label: 'Cyber Security', href: '/services#security' },
    { label: 'All Services', href: '/services' },
  ],
  group: [
    { label: 'Ellines Tech', href: 'https://tech.ellines.co.ke' },
    { label: 'Ellines Haven', href: 'https://haven.ellines.co.ke/' },
    { label: 'Ellines Rattan', href: 'https://rattan.ellines.co.ke' },
  ],
  resources: [
    { label: 'Articles', href: '/resources#articles' },
    { label: 'Case Studies', href: '/resources#case-studies' },
    { label: 'Documentation', href: '/resources#documentation' },
    { label: 'FAQs', href: '/resources#faqs' },
  ],
}
