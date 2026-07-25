/** Category → campaign poster for pictured pricing / service cards */
export const categoryPosterMap: Record<string, string> = {
  Web: '/media/posters/poster-graphics.png',
  Design: '/media/posters/poster-branding.png',
  Software: '/media/posters/poster-app-testing.png',
  AI: '/media/posters/poster-graphics.png',
  Marketing: '/media/posters/poster-campaign.png',
  Security: '/media/posters/poster-os-install.png',
  Consulting: '/media/posters/poster-branding.png',
  Career: '/media/posters/poster-letterhead.png',
  'Tax & Compliance': '/media/posters/poster-tax-returns.png',
  'Tech Support': '/media/posters/poster-os-install.png',
  'QA & Testing': '/media/posters/poster-app-testing.png',
  Branding: '/media/posters/poster-branding.png',
  Merchandise: '/media/posters/poster-apparel.png',
  Graphics: '/media/posters/poster-graphics.png',
  Stationery: '/media/posters/poster-letterhead.png',
}

/** Service slug → poster for Services / detail pages */
export const servicePosterMap: Record<string, string> = {
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
  'logo-design': '/media/posters/poster-branding.png',
}

export function posterForCategory(category: string): string {
  return categoryPosterMap[category] || '/media/posters/poster-campaign.png'
}

export function posterForPackage(pkg: {
  id?: string
  category?: string
  image?: string
}): string {
  if (pkg.image) return pkg.image
  const byId: Record<string, string> = {
    tax_kenya_return: '/media/posters/poster-tax-returns.png',
    tax_kenya_pin_assist: '/media/posters/poster-tax-returns.png',
    tech_os_install: '/media/posters/poster-os-install.png',
    tech_os_install_office: '/media/posters/poster-os-install.png',
    tech_app_testing: '/media/posters/poster-app-testing.png',
    tech_app_testing_full: '/media/posters/poster-app-testing.png',
    brand_identity_session: '/media/posters/poster-branding.png',
    brand_full_kit: '/media/posters/poster-branding.png',
    brand_rebrand: '/media/posters/poster-rebrand-kit.png',
    merch_tshirt: '/media/posters/poster-apparel.png',
    merch_cap: '/media/posters/poster-apparel.png',
    merch_hoodie: '/media/posters/poster-apparel.png',
    merch_clothing_custom: '/media/posters/poster-apparel.png',
    merch_phone_case: '/media/posters/poster-phone-case.png',
    design_graphics_pack: '/media/posters/poster-graphics.png',
    design_campaign_poster: '/media/posters/poster-campaign.png',
    design_poster_set: '/media/posters/poster-campaign.png',
    design_flyer: '/media/posters/poster-graphics.png',
    design_business_cards: '/media/posters/poster-business-card.png',
    stationery_letterhead: '/media/posters/poster-letterhead.png',
    stationery_envelopes: '/media/posters/poster-letterhead.png',
    stationery_comp_slips: '/media/posters/poster-letterhead.png',
    stationery_stamp_seal: '/media/posters/poster-rebrand-kit.png',
    stationery_full_pack: '/media/posters/poster-rebrand-kit.png',
  }
  if (pkg.id && byId[pkg.id]) return byId[pkg.id]
  return posterForCategory(pkg.category || '')
}
