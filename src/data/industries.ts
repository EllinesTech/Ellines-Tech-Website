export interface Industry {
  slug: string
  name: string
  description: string
  solutions: string[]
}

export const industries: Industry[] = [
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description: 'Hospital management, clinical AI, pharmacy, and home care solutions for African healthcare providers.',
    solutions: ['MedFlow HMS', 'AfyaVox AI', 'Pharmacy & Lab Systems', 'Home Care Platform'],
  },
  {
    slug: 'education',
    name: 'Education',
    description: 'School management, learning platforms, and administrative tools for educational institutions.',
    solutions: ['School Management', 'Student Portals', 'Fee Management', 'Exam Systems'],
  },
  {
    slug: 'government',
    name: 'Government',
    description: 'Secure, scalable systems for public sector digitization and citizen services.',
    solutions: ['Citizen Portals', 'Document Management', 'Workflow Automation', 'Data Analytics'],
  },
  {
    slug: 'ngos',
    name: 'NGOs',
    description: 'Program management, donor reporting, and field operations for non-profit organizations.',
    solutions: ['Program Tracking', 'Donor Management', 'Field Data Collection', 'Impact Reporting'],
  },
  {
    slug: 'financial-institutions',
    name: 'Financial Institutions',
    description: 'Core banking integrations, SACCO management, and fintech solutions.',
    solutions: ['SACCO Management', 'Loan Processing', 'Mobile Money Integration', 'Compliance Tools'],
  },
  {
    slug: 'retail',
    name: 'Retail',
    description: 'POS, inventory, e-commerce, and customer engagement for retail businesses.',
    solutions: ['POS Systems', 'Inventory Management', 'E-commerce', 'Loyalty Programs'],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production tracking, supply chain, and quality management for manufacturers.',
    solutions: ['ERP Integration', 'Inventory Control', 'Quality Management', 'Supply Chain'],
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    description: 'Hotel management, booking systems, and guest experience platforms.',
    solutions: ['Hotel Management', 'Booking Engine', 'POS Integration', 'Guest Portal'],
  },
  {
    slug: 'logistics',
    name: 'Logistics',
    description: 'Fleet management, route optimization, and delivery tracking systems.',
    solutions: ['Fleet Tracking', 'Route Optimization', 'Delivery Management', 'Warehouse Systems'],
  },
  {
    slug: 'agriculture',
    name: 'Agriculture',
    description: 'Farm management, supply chain, and market linkage platforms for agribusiness.',
    solutions: ['Farm Management', 'Supply Chain', 'Market Linkage', 'Weather Analytics'],
  },
  {
    slug: 'smes',
    name: 'SMEs',
    description: 'Affordable, scalable technology solutions for small and medium enterprises.',
    solutions: ['ERP Lite', 'POS & Inventory', 'Business Websites', 'Cloud Hosting'],
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    description: 'Practice management, client portals, and billing for professional firms.',
    solutions: ['Client Portals', 'Billing & Invoicing', 'Document Management', 'Scheduling'],
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}
