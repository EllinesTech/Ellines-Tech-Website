/** Seed for cms:downloads — mirrored in src/data/downloads.ts */
export function defaultDownloads() {
  const stamp = '2026-07-25T10:00:00.000Z'
  return [
    {
      id: 'dl_company_profile',
      title: 'Company Profile',
      description:
        'Overview of Ellines Tech, Ellines Group, products, services, and how we engage clients.',
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
        'Starter package overview, engagement models, and how to request custom enterprise quotes.',
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
      description: 'Engineering, AI, healthcare tech, design, and digital ops at a glance.',
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
      description:
        'Stakeholder-ready summary of software, cloud, design, and Kenya enablement services.',
      fileUrl: '/downloads/ellines-tech-service-catalogue.pdf',
      htmlUrl: '/downloads/ellines-tech-service-catalogue.html',
      category: 'company',
      status: 'published',
      updatedAt: stamp,
      createdAt: stamp,
    },
  ]
}
