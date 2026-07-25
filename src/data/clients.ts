export interface ClientBrand {
  id: string
  name: string
  logo: string
  category: 'hospitality' | 'healthcare' | 'retail' | 'events' | 'services' | 'group'
  work: string
}

/** Brands Ellines Tech created logos for and/or shipped software with */
export const clientBrands: ClientBrand[] = [
  {
    id: 'eliprime',
    name: 'Eliprime',
    logo: '/client-logos/eliprime.webp',
    category: 'healthcare',
    work: 'Brand identity & home wellness clinic platform',
  },
  {
    id: 'eventra-fest',
    name: 'Eventra Fest',
    logo: '/client-logos/eventra-fest.png',
    category: 'events',
    work: 'Official event brand identity',
  },
  {
    id: 'black-sauce',
    name: 'Black Sauce',
    logo: '/client-logos/black-sauce.png',
    category: 'hospitality',
    work: 'Logo design & brand system',
  },
  {
    id: 'delightful-staycation',
    name: 'Delightful Staycation',
    logo: '/client-logos/delightful-staycation.jpg',
    category: 'hospitality',
    work: 'Hospitality brand identity',
  },
  {
    id: 'elis-xpress',
    name: "Eli's Xpress Errands",
    logo: '/client-logos/elis-xpress-errands.png',
    category: 'services',
    work: 'Errands service brand identity',
  },
  {
    id: 'ellines-consultancy',
    name: 'Ellines Consultancy',
    logo: '/client-logos/ellines-consultancy.png',
    category: 'group',
    work: 'Consultancy brand identity',
  },
  {
    id: 'ellines-empire',
    name: 'Ellines Empire',
    logo: '/client-logos/ellines-empire.png',
    category: 'group',
    work: 'Group venture brand identity',
  },
]

export const clientSectors = [
  {
    name: 'Healthcare Providers',
    count: '10+',
    description: 'Hospitals and clinics using MedFlow and AfyaVox',
  },
  {
    name: 'Educational Institutions',
    count: '15+',
    description: 'Schools and universities with management systems',
  },
  {
    name: 'Financial Organizations',
    count: '8+',
    description: 'SACCOs and fintech platforms',
  },
  {
    name: 'Businesses & SMEs',
    count: '25+',
    description: 'ERP, POS, brand, and custom software clients',
  },
  {
    name: 'NGOs & Government',
    count: '5+',
    description: 'Program management and citizen services',
  },
] as const
