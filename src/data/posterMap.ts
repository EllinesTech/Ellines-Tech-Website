/** Category → fallback poster when a package id is unknown */
export const categoryPosterMap: Record<string, string> = {
  Web: '/media/scenes/web.png',
  Design: '/media/posters/poster-branding.png',
  Software: '/media/scenes/hero-tech.png',
  AI: '/media/scenes/ai.png',
  Marketing: '/media/posters/poster-campaign.png',
  Security: '/media/posters/packages/shop_cyber_audit.jpg',
  Consulting: '/media/scenes/strategy.png',
  Career: '/media/posters/packages/career_resume_build.jpg',
  'Tax & Compliance': '/media/posters/poster-tax-returns.png',
  'Tech Support': '/media/posters/poster-os-install.png',
  'QA & Testing': '/media/posters/poster-app-testing.png',
  Branding: '/media/posters/poster-branding.png',
  Merchandise: '/media/posters/poster-apparel.png',
  Graphics: '/media/posters/poster-graphics.png',
  Stationery: '/media/posters/poster-letterhead.png',
}

/** Service slug → poster for Services / detail pages (distinct per service) */
export const servicePosterMap: Record<string, string> = {
  'logo-design': '/media/posters/ellines-rebranding.png',
  'web-design': '/media/scenes/web.png',
  'ui-ux-designing': '/media/scenes/solutions.png',
  'product-design': '/media/posters/packages/shop_uiux.jpg',
  'resume-cv-design-revamping': '/media/posters/packages/career_resume_revamp.jpg',
  'resume-building': '/media/posters/packages/career_resume_build.jpg',
  'cover-letter-writing': '/media/posters/packages/career_cover_letter.jpg',
  'linkedin-optimisation': '/media/posters/packages/career_linkedin.jpg',
  'software-development': '/media/scenes/hero-tech.png',
  'web-development': '/media/banners/about-hero.png',
  'ai-development-automation': '/media/scenes/ai.png',
  'marketing-strategy': '/media/scenes/strategy.png',
  'digital-marketing': '/media/scenes/growth.png',
  'cyber-security': '/media/posters/packages/shop_cyber_audit.jpg',
  'it-consulting': '/media/scenes/workspace.png',
  'digital-transformation-consulting': '/media/scenes/about.png',
  'cloud-infrastructure-consulting': '/media/posters/packages/consult_tech_roadmap.jpg',
  'kenya-tax-return': '/media/posters/poster-tax-returns.png',
  'os-installation': '/media/posters/poster-os-install.png',
  'app-testing': '/media/posters/poster-app-testing.png',
  'branding-services': '/media/posters/poster-branding.png',
  'graphics-design': '/media/posters/poster-graphics.png',
  'campaign-posters': '/media/posters/poster-campaign.png',
  'apparel-branding': '/media/posters/poster-apparel.png',
  'phone-case-decoration': '/media/posters/poster-phone-case.png',
  'business-cards': '/media/posters/poster-business-card.png',
  'stationery-rebrand': '/media/posters/poster-letterhead.png',
  'business-rebrand-kit': '/media/posters/poster-rebrand-kit.png',
}

/**
 * Unique photo per pricing package id — real product/context imagery for every card.
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
  shop_cyber_audit: '/media/posters/packages/shop_cyber_audit.jpg',
  consult_it_halfday: '/media/posters/packages/consult_it_halfday.jpg',
  consult_it_fullday: '/media/posters/packages/consult_it_fullday.jpg',
  consult_tech_roadmap: '/media/posters/packages/consult_tech_roadmap.jpg',
  consult_digital_transform: '/media/posters/packages/consult_digital_transform.jpg',
  career_resume_revamp: '/media/posters/packages/career_resume_revamp.jpg',
  career_resume_build: '/media/posters/packages/career_resume_build.jpg',
  career_resume_mid: '/media/posters/packages/career_resume_mid.jpg',
  career_resume_senior: '/media/posters/packages/career_resume_senior.jpg',
  career_resume_executive: '/media/posters/packages/career_resume_executive.jpg',
  career_cover_letter: '/media/posters/packages/career_cover_letter.jpg',
  career_linkedin: '/media/posters/packages/career_linkedin.jpg',
  career_docs_bundle: '/media/posters/packages/career_docs_bundle.jpg',
  tax_kenya_return: '/media/posters/packages/tax_kenya_return.jpg',
  tax_kenya_pin_assist: '/media/posters/packages/tax_kenya_pin_assist.jpg',
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
  return categoryPosterMap[category] || '/media/posters/poster-campaign.png'
}

/** Shared marketing poster — only valid for Graphics packages */
const GRAPHICS_POSTER = '/media/posters/poster-graphics.png'

export function posterForPackage(pkg: {
  id?: string
  name?: string
  category?: string
  image?: string
}): string {
  // Catalog id always wins — real JPG photos, never stale SVG illustrations
  if (pkg.id && packagePosterMap[pkg.id]) return packagePosterMap[pkg.id]

  let image = pkg.image || ''
  // If CMS still has an old packages/*.svg path, swap to the matching JPG
  if (image.includes('/media/posters/packages/') && image.endsWith('.svg')) {
    image = image.replace(/\.svg$/i, '.jpg')
  }

  const isGraphicsPoster = image === GRAPHICS_POSTER || image.includes('poster-graphics')
  const category = pkg.category || ''

  // Never reuse the Graphics Design poster on Web / other categories
  if (image && !(isGraphicsPoster && category !== 'Graphics')) {
    return image
  }

  return posterForCategory(category)
}
