/** Company materials — files live in public/downloads/; metadata also CMS-backed (cms:downloads). */

export type DownloadResource = {
  id: string
  title: string
  description: string
  fileUrl: string
  htmlUrl?: string
  category: string
  status: 'draft' | 'published'
  updatedAt: string
  createdAt: string
}

const stamp = '2026-07-26T12:00:00.000Z'

export const defaultDownloads: DownloadResource[] = [
  {
    id: 'dl_company_profile',
    title: 'Company Profile',
    description:
      'Multi-page overview of Ellines Tech, products, services, locations, and Ellines Group.',
    fileUrl: '/downloads/ellines-tech-company-profile.pdf',
    htmlUrl: '/downloads/ellines-tech-company-profile.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'dl_pricing_rate_card',
    title: 'Pricing & Rate Card',
    description:
      'Published KES starter packages for web, software, design, consulting, and Kenya enablement.',
    fileUrl: '/downloads/ellines-tech-pricing-rate-card.pdf',
    htmlUrl: '/downloads/ellines-tech-pricing-rate-card.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'dl_capabilities',
    title: 'Capabilities One-Pager',
    description: 'One-page snapshot of engineering, AI, healthcare, design, and ops capabilities.',
    fileUrl: '/downloads/ellines-tech-capabilities.pdf',
    htmlUrl: '/downloads/ellines-tech-capabilities.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'dl_service_catalogue',
    title: 'Service Catalogue Summary',
    description: 'Stakeholder- and tender-ready summary of delivery areas and engagement path.',
    fileUrl: '/downloads/ellines-tech-service-catalogue.pdf',
    htmlUrl: '/downloads/ellines-tech-service-catalogue.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'dl_company_brochure',
    title: 'Company Brochure',
    description:
      'Sales brochure — problem, solution, products, Kenya presence, Ellines Group, and CTA.',
    fileUrl: '/downloads/ellines-tech-company-brochure.pdf',
    htmlUrl: '/downloads/ellines-tech-company-brochure.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'dl_engagement_guide',
    title: 'Client Engagement Guide',
    description: 'How discovery, proposal, build, launch, and care work with Ellines Tech.',
    fileUrl: '/downloads/ellines-tech-engagement-guide.pdf',
    htmlUrl: '/downloads/ellines-tech-engagement-guide.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'dl_intro_flyer',
    title: 'Intro Flyer',
    description: 'One-page intro with motto, services snapshot, locations, and contact CTAs.',
    fileUrl: '/downloads/ellines-tech-intro-flyer.pdf',
    htmlUrl: '/downloads/ellines-tech-intro-flyer.html',
    category: 'company',
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
]

export const leadStatusOptions = [
  'new',
  'purchase_request',
  'contacted',
  'qualified',
  'in_progress',
  'won',
  'lost',
  'closed',
] as const

export type LeadStatus = (typeof leadStatusOptions)[number]
