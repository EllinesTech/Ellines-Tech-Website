/** Category → fallback poster when a package id is unknown */
export const categoryPosterMap: Record<string, string> = {
  Web: '/media/posters/packages/shop_starter_web.jpg',
  Design: '/media/posters/packages/shop_brand_kit.jpg',
  Software: '/media/posters/packages/shop_custom_software.jpg',
  AI: '/media/posters/packages/shop_ai_automation.jpg',
  Marketing: '/media/posters/packages/shop_digital_marketing.jpg',
  Security: '/media/posters/packages/shop_cyber_audit.jpg',
  Consulting: '/media/posters/packages/consult_it_halfday.jpg',
  Career: '/media/posters/packages/career_resume_build.jpg',
  'Career Documents': '/media/posters/packages/career_resume_build.jpg',
  'Tax & Compliance': '/media/posters/packages/tax_kenya_return.jpg',
  'Tech Support': '/media/posters/packages/tech_os_install.jpg',
  'QA & Testing': '/media/posters/packages/tech_app_testing.jpg',
  Branding: '/media/posters/packages/brand_full_kit.jpg',
  Merchandise: '/media/posters/packages/merch_tshirt.jpg',
  Graphics: '/media/posters/packages/design_graphics_pack.jpg',
  Stationery: '/media/posters/packages/stationery_full_pack.jpg',
}

/** Service slug → poster for Services / detail pages (distinct per service) */
export const servicePosterMap: Record<string, string> = {
  'logo-design': '/media/posters/packages/shop_logo_pack.jpg',
  'web-design': '/media/posters/packages/shop_starter_web.jpg',
  'ui-ux-designing': '/media/posters/packages/shop_uiux.jpg',
  'product-design': '/media/posters/packages/shop_uiux.jpg',
  'resume-cv-design-revamping': '/media/posters/packages/career_resume_revamp.jpg',
  'resume-building': '/media/posters/packages/career_resume_build.jpg',
  'cover-letter-writing': '/media/posters/packages/career_cover_letter.jpg',
  'linkedin-optimisation': '/media/posters/packages/career_linkedin.jpg',
  'software-development': '/media/posters/packages/shop_custom_software.jpg',
  'web-development': '/media/posters/packages/shop_business_web.jpg',
  'ai-development-automation': '/media/posters/packages/shop_ai_automation.jpg',
  'marketing-strategy': '/media/posters/packages/shop_digital_marketing.jpg',
  'digital-marketing': '/media/posters/packages/shop_digital_marketing.jpg',
  'cyber-security': '/media/posters/packages/shop_cyber_audit.jpg',
  'it-consulting': '/media/posters/packages/consult_it_halfday.jpg',
  'digital-transformation-consulting': '/media/posters/packages/consult_digital_transform.jpg',
  'cloud-infrastructure-consulting': '/media/posters/packages/consult_tech_roadmap.jpg',
  'kenya-tax-return': '/media/posters/packages/tax_kenya_return.jpg',
  'os-installation': '/media/posters/packages/tech_os_install.jpg',
  'app-testing': '/media/posters/packages/tech_app_testing.jpg',
  'branding-services': '/media/posters/packages/brand_full_kit.jpg',
  'graphics-design': '/media/posters/packages/design_graphics_pack.jpg',
  'campaign-posters': '/media/posters/packages/design_campaign_poster.jpg',
  'apparel-branding': '/media/posters/packages/merch_tshirt.jpg',
  'phone-case-decoration': '/media/posters/packages/merch_phone_case.jpg',
  'business-cards': '/media/posters/packages/design_business_cards.jpg',
  'stationery-rebrand': '/media/posters/packages/stationery_letterhead.jpg',
  'business-rebrand-kit': '/media/posters/packages/brand_rebrand.jpg',
}

/**
 * Unique real photo per pricing package id (stored locally under public/media/posters/packages).
 */
export const packagePosterMap: Record<string, string> = {
  shop_starter_web: '/media/posters/packages/shop_starter_web.jpg',
  shop_business_web: '/media/posters/packages/shop_business_web.jpg',
  shop_ecommerce: '/media/posters/packages/shop_ecommerce.jpg',
  shop_logo_pack: '/media/posters/packages/shop_logo_pack.jpg',
  shop_brand_kit: '/media/posters/packages/shop_brand_kit.jpg',
  shop_uiux: '/media/posters/packages/shop_uiux.jpg',
  shop_mobile_app: '/media/posters/packages/shop_mobile_app.jpg',
  shop_custom_software: '/media/posters/packages/shop_custom_software.jpg',
  shop_ai_automation: '/media/posters/packages/shop_ai_automation.jpg',
  shop_digital_marketing: '/media/posters/packages/shop_digital_marketing.jpg',
  shop_digital_marketing_growth: '/media/posters/packages/shop_digital_marketing_growth.jpg',
  shop_cyber_audit: '/media/posters/packages/shop_cyber_audit.jpg',
  shop_cyber_audit_enterprise: '/media/posters/packages/shop_cyber_audit_enterprise.jpg',
  consult_it_halfday: '/media/posters/packages/consult_it_halfday.jpg',
  consult_it_fullday: '/media/posters/packages/consult_it_fullday.jpg',
  consult_tech_roadmap: '/media/posters/packages/consult_tech_roadmap.jpg',
  consult_digital_transform: '/media/posters/packages/consult_digital_transform.jpg',
  career_resume_student: '/media/posters/packages/career_resume_student.jpg',
  career_resume_student_plus: '/media/posters/packages/career_resume_student_plus.jpg',
  career_resume_revamp: '/media/posters/packages/career_resume_revamp.jpg',
  career_resume_build: '/media/posters/packages/career_resume_build.jpg',
  career_resume_mid: '/media/posters/packages/career_resume_mid.jpg',
  career_resume_senior: '/media/posters/packages/career_resume_senior.jpg',
  career_resume_executive: '/media/posters/packages/career_resume_executive.jpg',
  career_cover_student: '/media/posters/packages/career_cover_student.jpg',
  career_cover_letter: '/media/posters/packages/career_cover_letter.jpg',
  career_cover_senior: '/media/posters/packages/career_cover_senior.jpg',
  career_cover_executive: '/media/posters/packages/career_cover_executive.jpg',
  career_linkedin: '/media/posters/packages/career_linkedin.jpg',
  career_linkedin_exec: '/media/posters/packages/career_linkedin_exec.jpg',
  career_docs_bundle: '/media/posters/packages/career_docs_bundle.jpg',
  career_docs_bundle_pro: '/media/posters/packages/career_docs_bundle_pro.jpg',
  career_docs_bundle_exec: '/media/posters/packages/career_docs_bundle_exec.jpg',
  tax_kenya_return: '/media/posters/packages/tax_kenya_return.jpg',
  tax_kenya_pin_assist: '/media/posters/packages/tax_kenya_pin_assist.jpg',
  tax_kenya_sme: '/media/posters/packages/tax_kenya_sme.jpg',
  tech_os_install: '/media/posters/packages/tech_os_install.jpg',
  tech_os_install_office: '/media/posters/packages/tech_os_install_office.jpg',
  tech_app_testing: '/media/posters/packages/tech_app_testing.jpg',
  tech_app_testing_full: '/media/posters/packages/tech_app_testing_full.jpg',
  brand_identity_session: '/media/posters/packages/brand_identity_session.jpg',
  brand_full_kit: '/media/posters/packages/brand_full_kit.jpg',
  brand_rebrand: '/media/posters/packages/brand_rebrand.jpg',
  merch_tshirt: '/media/posters/packages/merch_tshirt.jpg',
  merch_cap: '/media/posters/packages/merch_cap.jpg',
  merch_hoodie: '/media/posters/packages/merch_hoodie.jpg',
  merch_clothing_custom: '/media/posters/packages/merch_clothing_custom.jpg',
  merch_phone_case: '/media/posters/packages/merch_phone_case.jpg',
  design_graphics_pack: '/media/posters/packages/design_graphics_pack.jpg',
  design_campaign_poster: '/media/posters/packages/design_campaign_poster.jpg',
  design_poster_set: '/media/posters/packages/design_poster_set.jpg',
  design_flyer: '/media/posters/packages/design_flyer.jpg',
  design_business_cards: '/media/posters/packages/design_business_cards.jpg',
  stationery_letterhead: '/media/posters/packages/stationery_letterhead.jpg',
  stationery_envelopes: '/media/posters/packages/stationery_envelopes.jpg',
  stationery_comp_slips: '/media/posters/packages/stationery_comp_slips.jpg',
  stationery_stamp_seal: '/media/posters/packages/stationery_stamp_seal.jpg',
  stationery_full_pack: '/media/posters/packages/stationery_full_pack.jpg',
}

export function posterForCategory(category: string): string {
  return categoryPosterMap[category] || '/media/posters/packages/design_campaign_poster.jpg'
}

/** Shared marketing poster — only valid for Graphics packages */
const GRAPHICS_POSTER = '/media/posters/packages/design_graphics_pack.jpg'

function isSharedGraphicsArt(image: string): boolean {
  return (
    image === GRAPHICS_POSTER ||
    image.includes('poster-graphics') ||
    image.includes('design_graphics_pack')
  )
}

function isLegacyPosterArt(image: string): boolean {
  return (
    !image ||
    image.endsWith('.svg') ||
    /\/media\/posters\/poster-/.test(image) ||
    /\/media\/scenes\//.test(image)
  )
}

export function posterForPackage(pkg: {
  id?: string
  name?: string
  category?: string
  image?: string
}): string {
  // Package id map always wins — unique JPG per product
  if (pkg.id && packagePosterMap[pkg.id]) return packagePosterMap[pkg.id]

  const image = pkg.image || ''
  const category = pkg.category || ''
  const rejectSharedGraphics = isSharedGraphicsArt(image) && category !== 'Graphics'

  // Never reuse Graphics Design / legacy campaign PNGs on Web or other categories
  if (image && !rejectSharedGraphics && !isLegacyPosterArt(image)) {
    return image
  }

  return posterForCategory(category)
}
