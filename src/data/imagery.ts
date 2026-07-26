import type { KnowledgeCategory } from './knowledge'
import type { PortfolioCategory } from './portfolio'

/**
 * Editorial imagery map for public pages.
 *
 * Two families of art live in the repo and they are not interchangeable:
 *  - `/media/posters/packages/*.jpg` — real photography (African business scenes, desks,
 *    documents). Use these wherever a card should feel human and specific.
 *  - `/media/scenes/*.png` — branded cyan renders. Use these for abstract subjects and heroes.
 *
 * `/media/scenes/about.png` and the `/media/banners/*` posters carry burnt-in headline text, so
 * they must stay full-bleed and are never used as cropped card art here.
 */

const photo = (name: string) => `/media/posters/packages/${name}.jpg`
const scene = (name: string) => `/media/scenes/${name}.png`

/** Industry slug → card art. Every entry is distinct so the grid never repeats itself. */
export const industryImages: Record<string, string> = {
  healthcare: photo('shop_ai_automation'),
  education: photo('shop_starter_web'),
  government: photo('consult_digital_transform'),
  ngos: photo('consult_tech_roadmap'),
  'financial-institutions': photo('shop_cyber_audit'),
  retail: photo('shop_ecommerce'),
  manufacturing: photo('shop_custom_software'),
  hospitality: photo('shop_mobile_app'),
  logistics: photo('tech_app_testing_full'),
  agriculture: scene('growth'),
  smes: photo('shop_business_web'),
  'professional-services': photo('consult_it_fullday'),
}

export function industryImage(slug: string): string {
  return industryImages[slug] || scene('solutions')
}

/**
 * Product slug → card art, so no product card ever renders as a bare text box.
 * Cards stay on the JPG photo set: the scene renders are ~1.9MB each and a grid of them
 * would cost more than the whole rest of the page.
 */
export const productImages: Record<string, string> = {
  medflow: photo('shop_custom_software'),
  'pharmacy-management': photo('shop_ecommerce'),
  'laboratory-management': photo('tech_app_testing_full'),
  'radiology-management': photo('tech_app_testing'),
  'home-care-management': photo('shop_mobile_app'),
  'ai-chatbots': photo('shop_digital_marketing'),
  'voice-ai': photo('shop_ai_automation'),
  'ocr-document-ai': photo('career_docs_bundle'),
  'predictive-analytics': photo('shop_digital_marketing_growth'),
  'erp-systems': photo('consult_it_fullday'),
  'inventory-management': photo('tech_os_install_office'),
  'hr-payroll': photo('tax_kenya_sme'),
  'pos-systems': photo('shop_ecommerce'),
  'sacco-management': photo('tax_kenya_return'),
  'school-management': photo('shop_starter_web'),
  'hotel-management': photo('consult_it_halfday'),
  'property-management': photo('shop_business_web'),
  'business-websites': photo('shop_uiux'),
  'ecommerce-platforms': photo('shop_ecommerce'),
  'booking-systems': photo('consult_tech_roadmap'),
  'mobile-applications': photo('shop_mobile_app'),
}

const productCategoryImages: Record<string, string> = {
  healthcare: photo('shop_custom_software'),
  ai: photo('shop_ai_automation'),
  business: photo('consult_it_fullday'),
  digital: photo('shop_starter_web'),
}

/** Portfolio category → art used when a project has no photo of its own. */
export const portfolioCategoryImages: Record<PortfolioCategory, string> = {
  healthcare: photo('shop_mobile_app'),
  education: photo('shop_starter_web'),
  business: photo('consult_it_fullday'),
  ai: photo('shop_ai_automation'),
  web: photo('shop_business_web'),
  brand: photo('brand_identity_session'),
}

/** Knowledge Hub section → art for the category cards. */
export const knowledgeCategoryImages: Record<KnowledgeCategory, string> = {
  articles: photo('shop_digital_marketing'),
  tutorials: photo('shop_uiux'),
  'case-studies': photo('consult_digital_transform'),
  'white-papers': photo('consult_tech_roadmap'),
  documentation: photo('tech_app_testing_full'),
  downloads: photo('career_docs_bundle'),
  faqs: photo('shop_ai_automation'),
}

export interface Visual {
  src: string
  fit: 'cover' | 'contain'
}

/**
 * Brand marks are transparent PNGs with generous padding — cropping them to a 16:9 frame
 * shears the logo. CMS records often omit `imageFit`, so infer it from the asset folder.
 */
function isMarkAsset(src: string): boolean {
  return /\/(project-logos|business-logos|client-logos|logos)\//.test(src)
}

/**
 * Resolve the media for a catalogue item.
 * A brand mark is padded on a dark stage; a photo fills the frame.
 */
export function productVisual(product: {
  slug: string
  category?: string
  image?: string
  imageFit?: 'cover' | 'contain'
}): Visual {
  if (product.image) {
    const fit = isMarkAsset(product.image) ? 'contain' : product.imageFit || 'cover'
    return { src: product.image, fit }
  }
  const mapped =
    productImages[product.slug] ||
    productCategoryImages[product.category || ''] ||
    scene('solutions')
  return { src: mapped, fit: 'cover' }
}

export function projectVisual(project: {
  category: string
  image?: string
  logo?: string
}): Visual {
  if (project.image) {
    return { src: project.image, fit: isMarkAsset(project.image) ? 'contain' : 'cover' }
  }
  if (project.logo) return { src: project.logo, fit: 'contain' }
  return {
    src:
      portfolioCategoryImages[project.category as PortfolioCategory] ||
      portfolioCategoryImages.business,
    fit: 'cover',
  }
}
