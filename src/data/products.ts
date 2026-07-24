export type ProductCategory =
  | 'healthcare'
  | 'ai'
  | 'business'
  | 'digital'

export interface Product {
  slug: string
  name: string
  category: ProductCategory
  tagline: string
  description: string
  features: string[]
  highlights?: string[]
}

export const productCategories: Record<
  ProductCategory,
  { label: string; description: string }
> = {
  healthcare: {
    label: 'Healthcare',
    description: 'Hospital, clinic, and patient care management systems built for African healthcare.',
  },
  ai: {
    label: 'Artificial Intelligence',
    description: 'Intelligent assistants, voice AI, and predictive analytics for modern businesses.',
  },
  business: {
    label: 'Business Solutions',
    description: 'ERP, inventory, HR, and industry-specific management platforms.',
  },
  digital: {
    label: 'Digital Products',
    description: 'Websites, e-commerce, booking systems, and mobile applications.',
  },
}

export const products: Product[] = [
  {
    slug: 'medflow',
    name: 'MedFlow',
    category: 'healthcare',
    tagline: 'Complete Hospital Management System',
    description:
      'MedFlow streamlines patient registration, billing, pharmacy, laboratory, and clinical workflows for hospitals and clinics across Africa.',
    features: [
      'Patient registration & EMR',
      'Billing & insurance',
      'Pharmacy integration',
      'Lab & radiology modules',
      'Multi-branch support',
    ],
    highlights: ['Flagship Product', 'Healthcare'],
  },
  {
    slug: 'afyavox',
    name: 'AfyaVox AI',
    category: 'healthcare',
    tagline: 'AI Clinical Assistant',
    description:
      'AfyaVox assists clinicians with voice-powered documentation, clinical decision support, and patient communication.',
    features: [
      'Voice-to-text clinical notes',
      'Medical knowledge base',
      'Patient triage assistance',
      'Multi-language support',
    ],
  },
  {
    slug: 'pharmacy-management',
    name: 'Pharmacy Management System',
    category: 'healthcare',
    tagline: 'Smart Pharmacy Operations',
    description: 'Inventory, prescriptions, dispensing, and supplier management for pharmacies.',
    features: ['Stock management', 'Prescription tracking', 'Expiry alerts', 'Sales reporting'],
  },
  {
    slug: 'laboratory-management',
    name: 'Laboratory Management System',
    category: 'healthcare',
    tagline: 'Lab Workflow Automation',
    description: 'Sample tracking, results management, and integration with hospital systems.',
    features: ['Sample barcoding', 'Result delivery', 'Quality control', 'Equipment tracking'],
  },
  {
    slug: 'radiology-management',
    name: 'Radiology Management System',
    category: 'healthcare',
    tagline: 'Imaging & Radiology Suite',
    description: 'Appointment scheduling, imaging workflows, and report management for radiology departments.',
    features: ['DICOM integration', 'Report templates', 'Referral tracking', 'Billing linkage'],
  },
  {
    slug: 'home-care-management',
    name: 'Home Care Management System',
    category: 'healthcare',
    tagline: 'Community & Home-Based Care',
    description: 'Coordinate home visits, caregiver schedules, and patient monitoring for community health programs.',
    features: ['Visit scheduling', 'Care plans', 'Mobile caregiver app', 'Family portal'],
  },
  {
    slug: 'rv22',
    name: 'RV22 AI Assistant',
    category: 'ai',
    tagline: 'Enterprise AI Assistant',
    description:
      'RV22 is Ellines Tech\'s flagship AI assistant for businesses — automating support, workflows, and knowledge retrieval.',
    features: ['Natural language chat', 'Custom knowledge bases', 'API integrations', 'Multi-channel deployment'],
    highlights: ['Flagship Product', 'AI'],
  },
  {
    slug: 'ai-chatbots',
    name: 'AI Chatbots',
    category: 'ai',
    tagline: 'Intelligent Customer Engagement',
    description: 'Custom chatbots for websites, WhatsApp, and enterprise portals.',
    features: ['24/7 support', 'Lead qualification', 'CRM integration', 'Analytics dashboard'],
  },
  {
    slug: 'voice-ai',
    name: 'Voice AI Solutions',
    category: 'ai',
    tagline: 'Speech-Powered Automation',
    description: 'Voice recognition and synthesis for call centers, IVR, and accessibility.',
    features: ['Speech-to-text', 'Text-to-speech', 'IVR automation', 'Multilingual support'],
  },
  {
    slug: 'ocr-document-ai',
    name: 'OCR & Document AI',
    category: 'ai',
    tagline: 'Intelligent Document Processing',
    description: 'Extract, classify, and process documents with AI-powered OCR.',
    features: ['Invoice processing', 'ID verification', 'Form extraction', 'Batch processing'],
  },
  {
    slug: 'predictive-analytics',
    name: 'Predictive Analytics',
    category: 'ai',
    tagline: 'Data-Driven Decision Making',
    description: 'Machine learning models for forecasting, risk assessment, and business intelligence.',
    features: ['Demand forecasting', 'Churn prediction', 'Custom ML models', 'Dashboards'],
  },
  {
    slug: 'erp-systems',
    name: 'ERP Systems',
    category: 'business',
    tagline: 'Unified Business Management',
    description: 'Enterprise resource planning tailored for African SMEs and enterprises.',
    features: ['Finance & accounting', 'Procurement', 'Sales & CRM', 'Reporting'],
  },
  {
    slug: 'inventory-management',
    name: 'Inventory Management',
    category: 'business',
    tagline: 'Stock & Supply Chain Control',
    description: 'Real-time inventory tracking across warehouses and retail locations.',
    features: ['Multi-warehouse', 'Barcode scanning', 'Reorder alerts', 'Supplier management'],
  },
  {
    slug: 'hr-payroll',
    name: 'HR & Payroll',
    category: 'business',
    tagline: 'Workforce Management',
    description: 'Employee records, payroll processing, leave management, and compliance.',
    features: ['Payroll automation', 'Leave tracking', 'Performance reviews', 'Statutory compliance'],
  },
  {
    slug: 'pos-systems',
    name: 'POS Systems',
    category: 'business',
    tagline: 'Point of Sale Solutions',
    description: 'Fast, reliable POS for retail, restaurants, and service businesses.',
    features: ['Offline mode', 'Receipt printing', 'Inventory sync', 'Multi-outlet'],
  },
  {
    slug: 'sacco-management',
    name: 'SACCO Management',
    category: 'business',
    tagline: 'Cooperative Financial Platform',
    description: 'Member management, savings, loans, and dividends for SACCOs and cooperatives.',
    features: ['Member portal', 'Loan processing', 'Dividend calculation', 'Mobile money integration'],
  },
  {
    slug: 'school-management',
    name: 'School Management',
    category: 'business',
    tagline: 'Education Administration Platform',
    description: 'Complete school management from admissions to exams and fee collection.',
    features: ['Student records', 'Fee management', 'Timetabling', 'Parent portal'],
  },
  {
    slug: 'hotel-management',
    name: 'Hotel Management',
    category: 'business',
    tagline: 'Hospitality Operations Suite',
    description: 'Reservations, housekeeping, billing, and guest management for hotels.',
    features: ['Booking engine', 'Housekeeping', 'POS integration', 'Channel manager'],
  },
  {
    slug: 'property-management',
    name: 'Property Management',
    category: 'business',
    tagline: 'Real Estate & Rental Platform',
    description: 'Tenant management, rent collection, maintenance, and property listings.',
    features: ['Tenant portal', 'Rent reminders', 'Maintenance tickets', 'Lease tracking'],
  },
  {
    slug: 'ellines-haven',
    name: 'Ellines Haven',
    category: 'digital',
    tagline: 'Digital Community Platform',
    description: 'Ellines Tech\'s digital ecosystem connecting businesses, developers, and innovators.',
    features: ['Community forums', 'Resource library', 'Events', 'Partner network'],
    highlights: ['Brand Hub'],
  },
  {
    slug: 'business-websites',
    name: 'Business Websites',
    category: 'digital',
    tagline: 'Professional Web Presence',
    description: 'Modern, SEO-optimized websites for businesses of all sizes.',
    features: ['Responsive design', 'CMS integration', 'Analytics', 'Fast hosting'],
  },
  {
    slug: 'ecommerce-platforms',
    name: 'E-commerce Platforms',
    category: 'digital',
    tagline: 'Online Store Solutions',
    description: 'Full-featured online stores with payment integration and inventory sync.',
    features: ['Product catalog', 'Payment gateways', 'Order management', 'Mobile checkout'],
  },
  {
    slug: 'booking-systems',
    name: 'Booking Systems',
    category: 'digital',
    tagline: 'Appointment & Reservation Platform',
    description: 'Online booking for clinics, salons, hotels, and service businesses.',
    features: ['Calendar sync', 'SMS reminders', 'Online payments', 'Staff scheduling'],
  },
  {
    slug: 'mobile-applications',
    name: 'Mobile Applications',
    category: 'digital',
    tagline: 'Native & Cross-Platform Apps',
    description: 'Android, iOS, and Flutter applications for business and consumer markets.',
    features: ['Native performance', 'Offline support', 'Push notifications', 'App store deployment'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category)
}
