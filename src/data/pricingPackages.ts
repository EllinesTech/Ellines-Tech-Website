/** Starter IT product pricing — Super Admin can edit/add via Product Pricing */
export type PricingPackage = {
  id: string
  name: string
  price: number
  currency: string
  category: string
  description: string
  status: 'draft' | 'published'
}

export const starterPricingPackages: PricingPackage[] = [
  {
    id: 'shop_starter_web',
    name: 'Business Website Starter',
    price: 45000,
    currency: 'KES',
    category: 'Web',
    description: 'One-page to multi-page business website — design, build, and launch.',
    status: 'published',
  },
  {
    id: 'shop_business_web',
    name: 'Business Website Pro',
    price: 85000,
    currency: 'KES',
    category: 'Web',
    description: 'Multi-page site with CMS-ready structure, contact flows, and SEO basics.',
    status: 'published',
  },
  {
    id: 'shop_ecommerce',
    name: 'E-commerce Starter',
    price: 150000,
    currency: 'KES',
    category: 'Web',
    description: 'Online storefront for products, carts, and order enquiries.',
    status: 'published',
  },
  {
    id: 'shop_logo_pack',
    name: 'Logo Identity Pack',
    price: 15000,
    currency: 'KES',
    category: 'Design',
    description: 'Logo concepts, revisions, and delivery formats for brand launch.',
    status: 'published',
  },
  {
    id: 'shop_brand_kit',
    name: 'Brand Identity Kit',
    price: 35000,
    currency: 'KES',
    category: 'Design',
    description: 'Logo, colour system, typography, and basic brand guidelines.',
    status: 'published',
  },
  {
    id: 'shop_uiux',
    name: 'UI/UX Design Package',
    price: 60000,
    currency: 'KES',
    category: 'Design',
    description: 'Wireframes and high-fidelity screens for web or mobile products.',
    status: 'published',
  },
  {
    id: 'shop_mobile_app',
    name: 'Mobile App MVP',
    price: 250000,
    currency: 'KES',
    category: 'Software',
    description: 'Cross-platform MVP app scope — core screens, auth, and API wiring.',
    status: 'published',
  },
  {
    id: 'shop_custom_software',
    name: 'Custom Software Starter',
    price: 180000,
    currency: 'KES',
    category: 'Software',
    description: 'Scoped business system or internal tool with discovery and first release.',
    status: 'published',
  },
  {
    id: 'shop_ai_automation',
    name: 'AI Automation Starter',
    price: 120000,
    currency: 'KES',
    category: 'AI',
    description: 'Chatbot or workflow automation tailored to your operations.',
    status: 'published',
  },
  {
    id: 'shop_digital_marketing',
    name: 'Digital Marketing Starter',
    price: 40000,
    currency: 'KES',
    category: 'Marketing',
    description: 'Campaign setup, social assets, and performance tracking kickoff.',
    status: 'published',
  },
  {
    id: 'shop_cyber_audit',
    name: 'Cyber Security Review',
    price: 55000,
    currency: 'KES',
    category: 'Security',
    description: 'Baseline security review for websites and apps with actionable fixes.',
    status: 'published',
  },
  {
    id: 'shop_hosting_care',
    name: 'Hosting & Care Plan (monthly)',
    price: 8000,
    currency: 'KES',
    category: 'Support',
    description: 'Hosting support, updates, and monitoring for your live site.',
    status: 'published',
  },
]
