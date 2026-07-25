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
      { label: 'Logo Design', href: '/services/logo-design', description: 'Brand identity & logo design' },
      { label: 'Web Design', href: '/services/web-design', description: 'Visual website design' },
      { label: 'UI/UX Designing', href: '/services/ui-ux-designing', description: 'Interfaces & product UX' },
      { label: 'Resume / CV Revamp', href: '/services/resume-cv-design-revamping', description: 'ATS-friendly CV refresh' },
      { label: 'Resume Building', href: '/services/resume-building', description: 'Professional CV from scratch' },
      { label: 'Cover Letter', href: '/services/cover-letter-writing', description: 'Role-targeted cover letters' },
      { label: 'LinkedIn Optimisation', href: '/services/linkedin-optimisation', description: 'Profile rewrite for recruiters' },
      { label: 'Software Development', href: '/services/software-development', description: 'Custom software & DevOps' },
      { label: 'Web Development', href: '/services/web-development', description: 'Full-stack web apps' },
      { label: 'AI Development', href: '/services/ai-development-automation', description: 'AI & automation' },
      { label: 'IT Consulting', href: '/services/it-consulting', description: 'Strategy & architecture advisory' },
      { label: 'Digital Transformation', href: '/services/digital-transformation-consulting', description: 'Digitisation roadmaps' },
      { label: 'Cloud Consulting', href: '/services/cloud-infrastructure-consulting', description: 'Cloud & infrastructure advisory' },
      { label: 'Digital Marketing', href: '/services/digital-marketing', description: 'Strategy & growth' },
      { label: 'Cyber Security', href: '/services/cyber-security', description: 'Protect apps & data' },
      { label: 'Kenya Tax Returns', href: '/services/kenya-tax-return', description: 'From KES 200 via iTax' },
      { label: 'OS Installation', href: '/services/os-installation', description: 'Windows & Linux setup' },
      { label: 'App Testing', href: '/services/app-testing', description: 'Manual QA & bug reports' },
      { label: 'Branding', href: '/services/branding-services', description: 'Identity & brand systems' },
      { label: 'Apparel Branding', href: '/services/apparel-branding', description: 'Tees, caps & hoodies' },
      { label: 'Business Cards', href: '/services/business-cards', description: 'Print-ready card design' },
      { label: 'Stationery Rebrand', href: '/services/stationery-rebrand', description: 'Letterheads & envelopes' },
      { label: 'Business Rebrand Kit', href: '/services/business-rebrand-kit', description: 'Full identity refresh' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Healthcare', href: '/products#healthcare', description: 'MedFlow, AfyaVox & more' },
      { label: 'Artificial Intelligence', href: '/products#ai', description: 'RV22, Juno4, AfyaVox & more' },
      { label: 'Business Solutions', href: '/products#business', description: 'ERP, POS & SACCO' },
      { label: 'Digital Products', href: '/products#digital', description: 'Websites, apps & e-commerce' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Request', href: '/request' },
]

/** Secondary items — shown under “More” on desktop */
export const moreNavigation: NavItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
  { label: 'Clients', href: '/clients' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Client account', href: '/account' },
  { label: 'Staff login', href: '/staff/login' },
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
    { label: 'Request a service', href: '/request' },
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
    { label: 'IT Consulting', href: '/services/it-consulting' },
    { label: 'Kenya Tax Returns', href: '/services/kenya-tax-return' },
    { label: 'Apparel Branding', href: '/services/apparel-branding' },
    { label: 'Business Cards', href: '/services/business-cards' },
    { label: 'Stationery Rebrand', href: '/services/stationery-rebrand' },
    { label: 'All Services', href: '/services' },
  ],
  group: [
    { label: 'Ellines Tech', href: 'https://tech.ellines.co.ke' },
    { label: 'Ellines Haven', href: 'https://haven.ellines.co.ke/' },
    { label: 'Ellines Rattan (Furniture)', href: 'https://rattan.ellines.co.ke' },
  ],
  resources: [
    { label: 'Articles', href: '/resources#articles' },
    { label: 'Case Studies', href: '/resources#case-studies' },
    { label: 'Product Pricing', href: '/pricing' },
    { label: 'Client account', href: '/account' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
}

/** Human-readable footer column titles — never rely on raw object keys */
export const footerSectionLabels: Record<keyof typeof footerNavigation, string> = {
  company: 'Company',
  products: 'Products',
  services: 'Services',
  group: 'Ellines Group',
  resources: 'Resources',
}
