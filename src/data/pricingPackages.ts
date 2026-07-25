/** Starter product pricing — Super Admin can edit/add via Product Pricing */
export type PricingPackage = {
  id: string
  name: string
  price: number
  currency: string
  category: string
  description: string
  status: 'draft' | 'published'
}

/** IDs retired from the catalogue (e.g. services we no longer offer) */
export const retiredPricingIds = ['shop_hosting_care'] as const

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
    id: 'career_resume_revamp',
    name: 'Resume / CV Revamp',
    price: 3500,
    currency: 'KES',
    category: 'Career',
    description:
      'Refresh your existing CV into a clean, ATS-friendly format — Kenya market rates for graduates and early professionals.',
    status: 'published',
  },
  {
    id: 'career_resume_build',
    name: 'Resume Building (ATS CV)',
    price: 5000,
    currency: 'KES',
    category: 'Career',
    description:
      'Full professional resume built from scratch — structure, achievements, and keywords for Kenyan and remote roles.',
    status: 'published',
  },
  {
    id: 'career_resume_mid',
    name: 'Mid-Career Resume Package',
    price: 6500,
    currency: 'KES',
    category: 'Career',
    description:
      'Role-targeted CV for 3–9 years’ experience — impact bullets, skills mapping, and role keywords.',
    status: 'published',
  },
  {
    id: 'career_resume_senior',
    name: 'Senior Resume Package',
    price: 9000,
    currency: 'KES',
    category: 'Career',
    description:
      'Leadership-focused CV for managers and senior specialists — aligned with Kenya mid-to-senior market pricing.',
    status: 'published',
  },
  {
    id: 'career_resume_executive',
    name: 'Executive Resume Package',
    price: 14000,
    currency: 'KES',
    category: 'Career',
    description:
      'Executive / C-suite CV with career narrative and achievement framing — Kenya executive writing range.',
    status: 'published',
  },
  {
    id: 'career_cover_letter',
    name: 'Cover Letter',
    price: 1500,
    currency: 'KES',
    category: 'Career',
    description: 'Tailored cover letter matched to your CV and target role.',
    status: 'published',
  },
  {
    id: 'career_linkedin',
    name: 'LinkedIn Profile Optimisation',
    price: 3500,
    currency: 'KES',
    category: 'Career',
    description: 'Headline, about, and experience rewrite so recruiters find you faster.',
    status: 'published',
  },
  {
    id: 'career_docs_bundle',
    name: 'Career Docs Bundle',
    price: 8500,
    currency: 'KES',
    category: 'Career',
    description: 'Resume build or revamp + cover letter + LinkedIn optimisation in one package.',
    status: 'published',
  },
]
