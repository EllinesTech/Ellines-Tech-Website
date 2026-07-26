import { packagePosterMap } from './posterMap'

/** Variant / SKU sold under a parent service card */
export type PricingPackage = {
  id: string
  name: string
  price: number
  currency: string
  category: string
  /** Client self-select band: Student → Executive / Enterprise */
  level?: string
  description: string
  status: 'draft' | 'published'
  image?: string
  /** Parent service card id — variants share one in-card tier selector */
  groupId: string
  /** Parent service card title shown on /pricing */
  groupName: string
  /** Short label inside the tier selector (e.g. Student, 1–2 years) */
  tierLabel: string
  /** Optional experience / pocket band shown under the tier label */
  experienceBand?: string
}

/** Grouped card used by PricingPage / Request flow */
export type PricingServiceGroup = {
  groupId: string
  groupName: string
  category: string
  variants: PricingPackage[]
  /** Lowest published price in the group */
  fromPrice: number
  currency: string
  image?: string
  description: string
}

/** Display order for level badges (lowest → highest) */
export const packageLevelOrder = [
  'Student',
  'Entry',
  'Starter',
  'Mid',
  'Business',
  'Senior',
  'Growth',
  'Professional',
  'Executive',
  'Enterprise',
] as const

export function levelSortIndex(level?: string): number {
  if (!level) return 50
  const i = packageLevelOrder.indexOf(level as (typeof packageLevelOrder)[number])
  return i === -1 ? 40 : i
}

/** Preferred category order on /pricing */
export const packageCategoryOrder = [
  'Career Documents',
  'Web',
  'Consulting',
  'Design',
  'Branding',
  'Graphics',
  'Stationery',
  'Software',
  'AI',
  'Marketing',
  'Security',
  'QA & Testing',
  'Tech Support',
  'Tax & Compliance',
  'Merchandise',
] as const

/** IDs retired from the catalogue (e.g. services we no longer offer) */
export const retiredPricingIds = ['shop_hosting_care'] as const

export { packagePosterMap }

export function packagePoster(id: string): string | undefined {
  return packagePosterMap[id]
}

function pkg(
  partial: Omit<PricingPackage, 'currency' | 'status'> &
    Partial<Pick<PricingPackage, 'currency' | 'status'>>,
): PricingPackage {
  return {
    currency: 'KES',
    status: 'published',
    ...partial,
  }
}

/**
 * Flatten catalogue: each row is a buyable variant.
 * Pricing UI groups rows that share `groupId` into one card with an in-card tier selector.
 */
export const starterPricingPackages: PricingPackage[] = [
  // ── Resume Writing ─────────────────────────────────────────────────────
  pkg({
    id: 'career_resume_student',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Student — education only',
    experienceBand: 'Students · no work history yet',
    name: 'Student Resume — Education Only',
    price: 1000,
    category: 'Career Documents',
    level: 'Student',
    description:
      'Clean ATS resume for students with education only — no work or volunteer history yet.',
    image: '/media/posters/packages/career_resume_student.jpg',
  }),
  pkg({
    id: 'career_resume_student_plus',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Student — with attachments',
    experienceBand: 'Campus roles · projects · volunteer',
    name: 'Student Resume — With Attachments',
    price: 1500,
    category: 'Career Documents',
    level: 'Student',
    description:
      'Student CV plus volunteer, attachments, campus roles, or projects — still accessible pricing.',
    image: '/media/posters/packages/career_resume_student_plus.jpg',
  }),
  pkg({
    id: 'career_resume_build',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Entry (≤2 years)',
    experienceBand: 'Graduates & early talent',
    name: 'Entry Career Resume (≤2 yrs)',
    price: 2500,
    category: 'Career Documents',
    level: 'Entry',
    description:
      'First professional resume for graduates and early talent — structure, keywords, and clear achievements.',
    image: '/media/posters/packages/career_resume_build.jpg',
  }),
  pkg({
    id: 'career_resume_revamp',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Revamp / refresh',
    experienceBand: 'Existing CV · needs polish',
    name: 'Resume Revamp / Refresh',
    price: 2000,
    category: 'Career Documents',
    level: 'Entry',
    description:
      'Polish an existing CV into a neat, ATS-friendly format — ideal when content exists but layout needs work.',
    image: '/media/posters/packages/career_resume_revamp.jpg',
  }),
  pkg({
    id: 'career_resume_mid',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Mid-career (3–7 years)',
    experienceBand: 'Established professionals',
    name: 'Mid-Career Resume (3–7 yrs)',
    price: 4500,
    category: 'Career Documents',
    level: 'Mid',
    description:
      'Role-targeted CV for established professionals — impact bullets, skills mapping, and role keywords.',
    image: '/media/posters/packages/career_resume_mid.jpg',
  }),
  pkg({
    id: 'career_resume_senior',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Senior (8–15 years)',
    experienceBand: 'Managers & senior ICs',
    name: 'Senior Resume (8–15 yrs)',
    price: 7500,
    category: 'Career Documents',
    level: 'Senior',
    description:
      'Leadership and specialist CV for managers and senior ICs — scope, outcomes, and market positioning.',
    image: '/media/posters/packages/career_resume_senior.jpg',
  }),
  pkg({
    id: 'career_resume_executive',
    groupId: 'career_resume',
    groupName: 'Resume Writing',
    tierLabel: 'Executive / C-level',
    experienceBand: 'Board & C-suite',
    name: 'Executive / C-Level Resume',
    price: 12000,
    category: 'Career Documents',
    level: 'Executive',
    description:
      'Board-ready executive CV with career narrative, strategic impact, and C-suite framing.',
    image: '/media/posters/packages/career_resume_executive.jpg',
  }),

  // ── Cover Letter (student 300 · experience bands 500–600 · exec modest step) ─
  pkg({
    id: 'career_cover_student',
    groupId: 'career_cover',
    groupName: 'Cover Letter',
    tierLabel: 'Student',
    experienceBand: 'Internships · attachments · first roles',
    name: 'Student Cover Letter',
    price: 300,
    category: 'Career Documents',
    level: 'Student',
    description: 'Short, confident cover letter for internships, attachments, and first roles.',
    image: '/media/posters/packages/career_cover_student.jpg',
  }),
  pkg({
    id: 'career_cover_letter',
    groupId: 'career_cover',
    groupName: 'Cover Letter',
    tierLabel: '1–2 years',
    experienceBand: 'Early professional experience',
    name: 'Cover Letter — 1–2 Years Experience',
    price: 500,
    category: 'Career Documents',
    level: 'Entry',
    description:
      'Tailored cover letter matched to your CV and target role — clear value in one page.',
    image: '/media/posters/packages/career_cover_letter.jpg',
  }),
  pkg({
    id: 'career_cover_mid',
    groupId: 'career_cover',
    groupName: 'Cover Letter',
    tierLabel: '3–5 years',
    experienceBand: 'Growing mid-level careers',
    name: 'Cover Letter — 3–5 Years Experience',
    price: 550,
    category: 'Career Documents',
    level: 'Mid',
    description:
      'Role-targeted letter for professionals with a few years of proven delivery — concise impact storytelling.',
    image: '/media/posters/packages/career_cover_letter.jpg',
  }),
  pkg({
    id: 'career_cover_senior',
    groupId: 'career_cover',
    groupName: 'Cover Letter',
    tierLabel: '5+ years',
    experienceBand: 'Senior & specialist applicants',
    name: 'Cover Letter — 5+ Years Experience',
    price: 600,
    category: 'Career Documents',
    level: 'Senior',
    description: 'Leadership-tone cover letter for senior and specialist applications.',
    image: '/media/posters/packages/career_cover_senior.jpg',
  }),
  pkg({
    id: 'career_cover_executive',
    groupId: 'career_cover',
    groupName: 'Cover Letter',
    tierLabel: 'Executive',
    experienceBand: 'C-level · board · senior leadership',
    name: 'Executive Cover Letter',
    price: 650,
    category: 'Career Documents',
    level: 'Executive',
    description: 'Executive briefing-style letter for C-level, board, and senior leadership openings.',
    image: '/media/posters/packages/career_cover_executive.jpg',
  }),

  // ── LinkedIn ───────────────────────────────────────────────────────────
  pkg({
    id: 'career_linkedin_entry',
    groupId: 'career_linkedin',
    groupName: 'LinkedIn Profile',
    tierLabel: 'Starter',
    experienceBand: 'Students & early career',
    name: 'LinkedIn Profile Starter',
    price: 2200,
    category: 'Career Documents',
    level: 'Entry',
    description: 'Headline, About, and photo guidance so recruiters can find you faster.',
    image: '/media/posters/packages/career_linkedin.jpg',
  }),
  pkg({
    id: 'career_linkedin',
    groupId: 'career_linkedin',
    groupName: 'LinkedIn Profile',
    tierLabel: 'Professional',
    experienceBand: 'Mid-career professionals',
    name: 'LinkedIn Profile Optimisation',
    price: 3500,
    category: 'Career Documents',
    level: 'Mid',
    description: 'Headline, About, and experience rewrite so recruiters find you faster.',
    image: '/media/posters/packages/career_linkedin.jpg',
  }),
  pkg({
    id: 'career_linkedin_exec',
    groupId: 'career_linkedin',
    groupName: 'LinkedIn Profile',
    tierLabel: 'Executive branding',
    experienceBand: 'Leaders & executives',
    name: 'Executive LinkedIn Branding',
    price: 6500,
    category: 'Career Documents',
    level: 'Executive',
    description:
      'Executive personal brand on LinkedIn — positioning, featured narrative, and thought-leadership framing.',
    image: '/media/posters/packages/career_linkedin_exec.jpg',
  }),

  // ── Career Docs Bundles ────────────────────────────────────────────────
  pkg({
    id: 'career_docs_bundle',
    groupId: 'career_bundle',
    groupName: 'Career Docs Bundle',
    tierLabel: 'Starter',
    experienceBand: 'Resume + cover letter',
    name: 'Starter Career Docs Bundle',
    price: 3500,
    category: 'Career Documents',
    level: 'Entry',
    description: 'Entry resume + cover letter together — save versus buying separately.',
    image: '/media/posters/packages/career_docs_bundle.jpg',
  }),
  pkg({
    id: 'career_docs_bundle_pro',
    groupId: 'career_bundle',
    groupName: 'Career Docs Bundle',
    tierLabel: 'Professional',
    experienceBand: 'Resume + letter + LinkedIn',
    name: 'Professional Career Docs Bundle',
    price: 8500,
    category: 'Career Documents',
    level: 'Mid',
    description: 'Mid-career resume + cover letter + LinkedIn optimisation in one package.',
    image: '/media/posters/packages/career_docs_bundle_pro.jpg',
  }),
  pkg({
    id: 'career_docs_bundle_exec',
    groupId: 'career_bundle',
    groupName: 'Career Docs Bundle',
    tierLabel: 'Executive',
    experienceBand: 'Full leadership pack',
    name: 'Executive Career Docs Bundle',
    price: 18000,
    category: 'Career Documents',
    level: 'Executive',
    description: 'Executive resume + executive cover letter + LinkedIn branding — full leadership pack.',
    image: '/media/posters/packages/career_docs_bundle_exec.jpg',
  }),

  // ── Web ────────────────────────────────────────────────────────────────
  pkg({
    id: 'shop_landing_web',
    groupId: 'web_site',
    groupName: 'Business Website',
    tierLabel: 'Landing page',
    experienceBand: 'Pocket · single-page launch',
    name: 'Landing Page Website',
    price: 15000,
    category: 'Web',
    level: 'Starter',
    description: 'Focused one-page site — hero, offers, and contact — ready to launch fast.',
    image: '/media/posters/packages/shop_starter_web.jpg',
  }),
  pkg({
    id: 'shop_starter_web',
    groupId: 'web_site',
    groupName: 'Business Website',
    tierLabel: 'Starter multi-page',
    experienceBand: 'Small business presence',
    name: 'Business Website Starter',
    price: 25000,
    category: 'Web',
    level: 'Starter',
    description: 'One-page to multi-page business website — design, build, and launch.',
    image: '/media/posters/packages/shop_starter_web.jpg',
  }),
  pkg({
    id: 'shop_business_web',
    groupId: 'web_site',
    groupName: 'Business Website',
    tierLabel: 'Business Pro',
    experienceBand: 'CMS-ready · SEO basics',
    name: 'Business Website Pro',
    price: 55000,
    category: 'Web',
    level: 'Business',
    description: 'Multi-page site with CMS-ready structure, contact flows, and SEO basics.',
    image: '/media/posters/packages/shop_business_web.jpg',
  }),
  pkg({
    id: 'shop_ecommerce',
    groupId: 'web_site',
    groupName: 'Business Website',
    tierLabel: 'E-commerce',
    experienceBand: 'Products · carts · payments',
    name: 'E-commerce Storefront',
    price: 95000,
    category: 'Web',
    level: 'Growth',
    description: 'Online storefront for products, carts, payments readiness, and order enquiries.',
    image: '/media/posters/packages/shop_ecommerce.jpg',
  }),

  // ── Logo Design ────────────────────────────────────────────────────────
  pkg({
    id: 'shop_logo_pack',
    groupId: 'design_logo',
    groupName: 'Logo Design',
    tierLabel: 'Starter pack',
    experienceBand: 'Concepts + delivery files',
    name: 'Logo Identity Pack',
    price: 8000,
    category: 'Design',
    level: 'Starter',
    description: 'Logo concepts, revisions, and delivery formats for brand launch.',
    image: '/media/posters/packages/shop_logo_pack.jpg',
  }),
  pkg({
    id: 'shop_logo_pro',
    groupId: 'design_logo',
    groupName: 'Logo Design',
    tierLabel: 'Pro system',
    experienceBand: 'Variations · lockups · usage',
    name: 'Logo System Pro',
    price: 14000,
    category: 'Design',
    level: 'Business',
    description: 'Expanded logo system — primary/secondary marks, lockups, and usage guidance.',
    image: '/media/posters/packages/shop_logo_pack.jpg',
  }),
  pkg({
    id: 'shop_logo_premium',
    groupId: 'design_logo',
    groupName: 'Logo Design',
    tierLabel: 'Premium identity',
    experienceBand: 'Full mark suite + guidelines',
    name: 'Premium Logo Identity',
    price: 20000,
    category: 'Design',
    level: 'Professional',
    description: 'Premium identity mark suite with mono/colour versions and concise brand notes.',
    image: '/media/posters/packages/shop_logo_pack.jpg',
  }),

  // ── Brand Kit ──────────────────────────────────────────────────────────
  pkg({
    id: 'shop_brand_kit',
    groupId: 'design_brand_kit',
    groupName: 'Brand Identity Kit',
    tierLabel: 'Essentials',
    experienceBand: 'Logo · colour · type',
    name: 'Brand Identity Kit',
    price: 22000,
    category: 'Design',
    level: 'Business',
    description: 'Logo, colour system, typography, and basic brand guidelines.',
    image: '/media/posters/packages/shop_brand_kit.jpg',
  }),
  pkg({
    id: 'shop_brand_kit_full',
    groupId: 'design_brand_kit',
    groupName: 'Brand Identity Kit',
    tierLabel: 'Full kit',
    experienceBand: 'Guidelines + asset library',
    name: 'Brand Identity Kit — Full',
    price: 38000,
    category: 'Design',
    level: 'Professional',
    description: 'Expanded brand kit with guidelines PDF, social templates, and asset library.',
    image: '/media/posters/packages/shop_brand_kit.jpg',
  }),

  // ── UI/UX ──────────────────────────────────────────────────────────────
  pkg({
    id: 'shop_uiux',
    groupId: 'design_uiux',
    groupName: 'UI/UX Design',
    tierLabel: 'Core screens',
    experienceBand: 'Wireframes + hi-fi',
    name: 'UI/UX Design Package',
    price: 45000,
    category: 'Design',
    level: 'Professional',
    description: 'Wireframes and high-fidelity screens for web or mobile products.',
    image: '/media/posters/packages/shop_uiux.jpg',
  }),
  pkg({
    id: 'shop_uiux_full',
    groupId: 'design_uiux',
    groupName: 'UI/UX Design',
    tierLabel: 'Product system',
    experienceBand: 'Flows · components · handoff',
    name: 'UI/UX Product System',
    price: 95000,
    category: 'Design',
    level: 'Enterprise',
    description: 'End-to-end product UI — key flows, component set, and developer handoff.',
    image: '/media/posters/packages/shop_uiux.jpg',
  }),

  // ── Software ───────────────────────────────────────────────────────────
  pkg({
    id: 'shop_custom_software',
    groupId: 'software_custom',
    groupName: 'Custom Software',
    tierLabel: 'Starter',
    experienceBand: 'Discovery + first release',
    name: 'Custom Software Starter',
    price: 95000,
    category: 'Software',
    level: 'Starter',
    description: 'Scoped business system or internal tool with discovery and first release.',
    image: '/media/posters/packages/shop_custom_software.jpg',
  }),
  pkg({
    id: 'shop_custom_software_growth',
    groupId: 'software_custom',
    groupName: 'Custom Software',
    tierLabel: 'Growth',
    experienceBand: 'Multi-module build',
    name: 'Custom Software Growth',
    price: 180000,
    category: 'Software',
    level: 'Growth',
    description: 'Multi-module business system with integrations and staged delivery.',
    image: '/media/posters/packages/shop_custom_software.jpg',
  }),
  pkg({
    id: 'shop_custom_software_enterprise',
    groupId: 'software_custom',
    groupName: 'Custom Software',
    tierLabel: 'Enterprise',
    experienceBand: 'Complex ops · scale',
    name: 'Custom Software Enterprise',
    price: 350000,
    category: 'Software',
    level: 'Enterprise',
    description: 'Enterprise-grade build — architecture, security posture, and multi-stakeholder delivery.',
    image: '/media/posters/packages/shop_custom_software.jpg',
  }),

  pkg({
    id: 'shop_mobile_app',
    groupId: 'software_mobile',
    groupName: 'Mobile App',
    tierLabel: 'MVP',
    experienceBand: 'Core screens · auth · API',
    name: 'Mobile App MVP',
    price: 180000,
    category: 'Software',
    level: 'Growth',
    description: 'Cross-platform MVP app scope — core screens, auth, and API wiring.',
    image: '/media/posters/packages/shop_mobile_app.jpg',
  }),
  pkg({
    id: 'shop_mobile_app_growth',
    groupId: 'software_mobile',
    groupName: 'Mobile App',
    tierLabel: 'Growth',
    experienceBand: 'Richer features · polish',
    name: 'Mobile App Growth',
    price: 320000,
    category: 'Software',
    level: 'Professional',
    description: 'Expanded mobile product — richer features, polish, and release readiness.',
    image: '/media/posters/packages/shop_mobile_app.jpg',
  }),

  // ── AI ─────────────────────────────────────────────────────────────────
  pkg({
    id: 'shop_ai_automation',
    groupId: 'ai_automation',
    groupName: 'AI Automation',
    tierLabel: 'Starter',
    experienceBand: 'Chatbot or workflow kickoff',
    name: 'AI Automation Starter',
    price: 65000,
    category: 'AI',
    level: 'Starter',
    description: 'Chatbot or workflow automation tailored to your operations.',
    image: '/media/posters/packages/shop_ai_automation.jpg',
  }),
  pkg({
    id: 'shop_ai_automation_growth',
    groupId: 'ai_automation',
    groupName: 'AI Automation',
    tierLabel: 'Growth',
    experienceBand: 'Multi-flow automation',
    name: 'AI Automation Growth',
    price: 120000,
    category: 'AI',
    level: 'Growth',
    description: 'Multi-flow automation with CRM/tools wiring and operator playbooks.',
    image: '/media/posters/packages/shop_ai_automation.jpg',
  }),
  pkg({
    id: 'shop_ai_automation_enterprise',
    groupId: 'ai_automation',
    groupName: 'AI Automation',
    tierLabel: 'Enterprise',
    experienceBand: 'Ops-wide AI programme',
    name: 'AI Automation Enterprise',
    price: 220000,
    category: 'AI',
    level: 'Enterprise',
    description: 'Organisation-wide AI automation programme with governance and staged rollout.',
    image: '/media/posters/packages/shop_ai_automation.jpg',
  }),

  // ── Marketing ──────────────────────────────────────────────────────────
  pkg({
    id: 'shop_digital_marketing',
    groupId: 'marketing_digital',
    groupName: 'Digital Marketing',
    tierLabel: 'Starter',
    experienceBand: 'Campaign kickoff month',
    name: 'Digital Marketing Starter',
    price: 25000,
    category: 'Marketing',
    level: 'Starter',
    description: 'Campaign setup, social assets, and performance tracking kickoff.',
    image: '/media/posters/packages/shop_digital_marketing.jpg',
  }),
  pkg({
    id: 'shop_digital_marketing_growth',
    groupId: 'marketing_digital',
    groupName: 'Digital Marketing',
    tierLabel: 'Growth',
    experienceBand: 'Multi-channel month',
    name: 'Digital Marketing Growth',
    price: 55000,
    category: 'Marketing',
    level: 'Growth',
    description:
      'Multi-channel campaign month — creatives, ads setup support, and weekly performance reviews.',
    image: '/media/posters/packages/shop_digital_marketing_growth.jpg',
  }),
  pkg({
    id: 'shop_digital_marketing_retainer',
    groupId: 'marketing_digital',
    groupName: 'Digital Marketing',
    tierLabel: 'Retainer',
    experienceBand: 'Ongoing growth partner',
    name: 'Digital Marketing Retainer',
    price: 95000,
    category: 'Marketing',
    level: 'Professional',
    description: 'Monthly growth retainer — creatives, campaigns, and reporting cadence.',
    image: '/media/posters/packages/shop_digital_marketing_growth.jpg',
  }),

  // ── Security ───────────────────────────────────────────────────────────
  pkg({
    id: 'shop_cyber_audit',
    groupId: 'security_audit',
    groupName: 'Cyber Security',
    tierLabel: 'Baseline review',
    experienceBand: 'Websites & apps',
    name: 'Cyber Security Review',
    price: 35000,
    category: 'Security',
    level: 'Business',
    description: 'Baseline security review for websites and apps with actionable fixes.',
    image: '/media/posters/packages/shop_cyber_audit.jpg',
  }),
  pkg({
    id: 'shop_cyber_audit_enterprise',
    groupId: 'security_audit',
    groupName: 'Cyber Security',
    tierLabel: 'Deep audit',
    experienceBand: 'Threat surface + briefing',
    name: 'Cyber Security Deep Audit',
    price: 85000,
    category: 'Security',
    level: 'Enterprise',
    description:
      'Expanded security assessment — threat surface review, prioritised remediation, and stakeholder briefing.',
    image: '/media/posters/packages/shop_cyber_audit_enterprise.jpg',
  }),
  pkg({
    id: 'shop_cyber_programme',
    groupId: 'security_audit',
    groupName: 'Cyber Security',
    tierLabel: 'Security programme',
    experienceBand: 'Ongoing hardening',
    name: 'Cyber Security Programme',
    price: 150000,
    category: 'Security',
    level: 'Enterprise',
    description: 'Multi-week security programme — hardening roadmap, checks, and executive updates.',
    image: '/media/posters/packages/shop_cyber_audit_enterprise.jpg',
  }),

  // ── Consulting ─────────────────────────────────────────────────────────
  pkg({
    id: 'consult_it_halfday',
    groupId: 'consulting_it',
    groupName: 'IT Consulting',
    tierLabel: 'Half day',
    experienceBand: 'Focused advisory session',
    name: 'IT Consulting (half day)',
    price: 25000,
    category: 'Consulting',
    level: 'Starter',
    description: 'Focused advisory session — systems review, decisions, and next steps.',
    image: '/media/posters/packages/consult_it_halfday.jpg',
  }),
  pkg({
    id: 'consult_it_fullday',
    groupId: 'consulting_it',
    groupName: 'IT Consulting',
    tierLabel: 'Full day',
    experienceBand: 'Stakeholder workshop',
    name: 'IT Consulting (full day)',
    price: 45000,
    category: 'Consulting',
    level: 'Business',
    description: 'Deep-dive workshop with stakeholders — architecture, priorities, and roadmap sketch.',
    image: '/media/posters/packages/consult_it_fullday.jpg',
  }),
  pkg({
    id: 'consult_tech_roadmap',
    groupId: 'consulting_it',
    groupName: 'IT Consulting',
    tierLabel: 'Technology roadmap',
    experienceBand: 'Multi-week advisory',
    name: 'Technology Roadmap Package',
    price: 120000,
    category: 'Consulting',
    level: 'Professional',
    description: 'Multi-week advisory: assessment, target architecture, and prioritised delivery plan.',
    image: '/media/posters/packages/consult_tech_roadmap.jpg',
  }),
  pkg({
    id: 'consult_digital_transform',
    groupId: 'consulting_it',
    groupName: 'IT Consulting',
    tierLabel: 'Digital transformation',
    experienceBand: 'Programme-level change',
    name: 'Digital Transformation Programme',
    price: 180000,
    category: 'Consulting',
    level: 'Enterprise',
    description: 'Current-state audit, initiative backlog, and change-ready transformation plan.',
    image: '/media/posters/packages/consult_digital_transform.jpg',
  }),

  // ── Tax ────────────────────────────────────────────────────────────────
  pkg({
    id: 'tax_kenya_return',
    groupId: 'tax_kenya',
    groupName: 'Kenya Tax & iTax',
    tierLabel: 'Individual return',
    experienceBand: 'Accessible filing assist',
    name: 'Kenya Tax Return Filing',
    price: 200,
    category: 'Tax & Compliance',
    level: 'Starter',
    description: 'Individual Kenya tax return filing assistance — KRA iTax support at an accessible rate.',
    image: '/media/posters/packages/tax_kenya_return.jpg',
  }),
  pkg({
    id: 'tax_kenya_pin_assist',
    groupId: 'tax_kenya',
    groupName: 'Kenya Tax & iTax',
    tierLabel: 'PIN / iTax setup',
    experienceBand: 'Account create or recover',
    name: 'KRA PIN / iTax Assist',
    price: 500,
    category: 'Tax & Compliance',
    level: 'Entry',
    description: 'Help creating or recovering KRA PIN and basic iTax account setup.',
    image: '/media/posters/packages/tax_kenya_pin_assist.jpg',
  }),
  pkg({
    id: 'tax_kenya_sme',
    groupId: 'tax_kenya',
    groupName: 'Kenya Tax & iTax',
    tierLabel: 'SME filing',
    experienceBand: 'Small-business returns',
    name: 'SME Tax Filing Assist',
    price: 3500,
    category: 'Tax & Compliance',
    level: 'Business',
    description: 'Small-business return support — books check, iTax filing guidance, and compliance notes.',
    image: '/media/posters/packages/tax_kenya_sme.jpg',
  }),

  // ── Tech Support ───────────────────────────────────────────────────────
  pkg({
    id: 'tech_os_install',
    groupId: 'tech_os',
    groupName: 'OS & Device Setup',
    tierLabel: 'OS install',
    experienceBand: 'Windows or Linux',
    name: 'OS Installation',
    price: 2500,
    category: 'Tech Support',
    level: 'Starter',
    description: 'Windows or Linux OS installation / reinstall with drivers and essential updates.',
    image: '/media/posters/packages/tech_os_install.jpg',
  }),
  pkg({
    id: 'tech_os_install_office',
    groupId: 'tech_os',
    groupName: 'OS & Device Setup',
    tierLabel: 'OS + Office',
    experienceBand: 'Productivity suite ready',
    name: 'OS Install + Office Setup',
    price: 4500,
    category: 'Tech Support',
    level: 'Business',
    description: 'OS installation plus productivity suite setup and basic optimisation.',
    image: '/media/posters/packages/tech_os_install_office.jpg',
  }),
  pkg({
    id: 'tech_os_tuneup',
    groupId: 'tech_os',
    groupName: 'OS & Device Setup',
    tierLabel: 'Full tune-up',
    experienceBand: 'Speed · cleanup · security basics',
    name: 'Device Full Tune-Up',
    price: 6500,
    category: 'Tech Support',
    level: 'Professional',
    description: 'Full device tune-up — cleanup, updates, performance, and basic security hygiene.',
    image: '/media/posters/packages/tech_os_install_office.jpg',
  }),

  // ── QA ─────────────────────────────────────────────────────────────────
  pkg({
    id: 'tech_app_testing',
    groupId: 'qa_testing',
    groupName: 'App Testing',
    tierLabel: 'Starter',
    experienceBand: 'Functional pass + bug report',
    name: 'App Testing (starter)',
    price: 15000,
    category: 'QA & Testing',
    level: 'Starter',
    description: 'Manual functional testing for web or mobile apps with a clear bug report.',
    image: '/media/posters/packages/tech_app_testing.jpg',
  }),
  pkg({
    id: 'tech_app_testing_full',
    groupId: 'qa_testing',
    groupName: 'App Testing',
    tierLabel: 'Full cycle',
    experienceBand: 'Functional · UI · regression',
    name: 'App Testing (full cycle)',
    price: 45000,
    category: 'QA & Testing',
    level: 'Professional',
    description: 'Broader test plan — functional, UI, and regression checks with prioritised findings.',
    image: '/media/posters/packages/tech_app_testing_full.jpg',
  }),
  pkg({
    id: 'tech_app_testing_enterprise',
    groupId: 'qa_testing',
    groupName: 'App Testing',
    tierLabel: 'Enterprise',
    experienceBand: 'Release gates · stakeholder report',
    name: 'App Testing (enterprise)',
    price: 85000,
    category: 'QA & Testing',
    level: 'Enterprise',
    description: 'Release-gate testing programme with severity matrix and stakeholder-ready report.',
    image: '/media/posters/packages/tech_app_testing_full.jpg',
  }),

  // ── Branding ───────────────────────────────────────────────────────────
  pkg({
    id: 'brand_identity_session',
    groupId: 'branding_biz',
    groupName: 'Business Branding',
    tierLabel: 'Identity session',
    experienceBand: 'Discovery workshop',
    name: 'Brand Identity Session',
    price: 20000,
    category: 'Branding',
    level: 'Starter',
    description: 'Brand discovery workshop — positioning, voice, and visual direction for your business.',
    image: '/media/posters/packages/brand_identity_session.jpg',
  }),
  pkg({
    id: 'brand_full_kit',
    groupId: 'branding_biz',
    groupName: 'Business Branding',
    tierLabel: 'Full branding kit',
    experienceBand: 'Logo system + board',
    name: 'Full Branding Kit',
    price: 55000,
    category: 'Branding',
    level: 'Business',
    description: 'Logo system, colours, typography, and brand board ready for print and digital.',
    image: '/media/posters/packages/brand_full_kit.jpg',
  }),
  pkg({
    id: 'brand_rebrand',
    groupId: 'branding_biz',
    groupName: 'Business Branding',
    tierLabel: 'Full rebrand',
    experienceBand: 'Existing business refresh',
    name: 'Business Rebrand Package',
    price: 95000,
    category: 'Branding',
    level: 'Enterprise',
    description:
      'Full rebrand — refreshed identity, messaging, and rollout assets for an existing business.',
    image: '/media/posters/packages/brand_rebrand.jpg',
  }),

  // ── Merchandise ────────────────────────────────────────────────────────
  pkg({
    id: 'merch_cap',
    groupId: 'merch_branded',
    groupName: 'Branded Merchandise',
    tierLabel: 'Cap',
    experienceBand: 'Per piece · embroidery/print',
    name: 'Branded Cap (per piece)',
    price: 800,
    category: 'Merchandise',
    level: 'Starter',
    description: 'Cap branding with your logo — embroidery or print options on request.',
    image: '/media/posters/packages/merch_cap.jpg',
  }),
  pkg({
    id: 'merch_phone_case',
    groupId: 'merch_branded',
    groupName: 'Branded Merchandise',
    tierLabel: 'Phone case',
    experienceBand: 'Model-specific decoration',
    name: 'Phone Case Decoration',
    price: 1000,
    category: 'Merchandise',
    level: 'Starter',
    description: 'Custom phone case artwork / logo decoration — model-specific production.',
    image: '/media/posters/packages/merch_phone_case.jpg',
  }),
  pkg({
    id: 'merch_tshirt',
    groupId: 'merch_branded',
    groupName: 'Branded Merchandise',
    tierLabel: 'T-shirt',
    experienceBand: 'Per piece · bulk quotes',
    name: 'Branded T-Shirt (per piece)',
    price: 1500,
    category: 'Merchandise',
    level: 'Entry',
    description: 'Company logo print on quality tee — artwork setup included. Bulk quotes available.',
    image: '/media/posters/packages/merch_tshirt.jpg',
  }),
  pkg({
    id: 'merch_clothing_custom',
    groupId: 'merch_branded',
    groupName: 'Branded Merchandise',
    tierLabel: 'Custom apparel',
    experienceBand: 'Client-supplied or sourced',
    name: 'Custom Clothing Branding',
    price: 2000,
    category: 'Merchandise',
    level: 'Mid',
    description: 'Logo branding on client-supplied or sourced apparel — priced from per piece.',
    image: '/media/posters/packages/merch_clothing_custom.jpg',
  }),
  pkg({
    id: 'merch_hoodie',
    groupId: 'merch_branded',
    groupName: 'Branded Merchandise',
    tierLabel: 'Hoodie',
    experienceBand: 'Teams & events',
    name: 'Branded Hoodie (per piece)',
    price: 3500,
    category: 'Merchandise',
    level: 'Business',
    description: 'Hoodie with company logo branding for teams and events.',
    image: '/media/posters/packages/merch_hoodie.jpg',
  }),

  // ── Graphics ───────────────────────────────────────────────────────────
  pkg({
    id: 'design_flyer',
    groupId: 'graphics_design',
    groupName: 'Graphics Design',
    tierLabel: 'Flyer / handbill',
    experienceBand: 'Print-ready single piece',
    name: 'Flyer / Handbill Design',
    price: 3500,
    category: 'Graphics',
    level: 'Starter',
    description: 'Print-ready flyer design with your brand message and call to action.',
    image: '/media/posters/packages/design_flyer.jpg',
  }),
  pkg({
    id: 'design_campaign_poster',
    groupId: 'graphics_design',
    groupName: 'Graphics Design',
    tierLabel: 'Campaign poster',
    experienceBand: 'One concept + revisions',
    name: 'Campaign Poster Design',
    price: 5000,
    category: 'Graphics',
    level: 'Entry',
    description: 'Original campaign poster design for print and digital — one concept + revisions.',
    image: '/media/posters/packages/design_campaign_poster.jpg',
  }),
  pkg({
    id: 'design_graphics_pack',
    groupId: 'graphics_design',
    groupName: 'Graphics Design',
    tierLabel: 'Social graphics pack',
    experienceBand: 'Posts · stories · frames',
    name: 'Graphics Design Pack',
    price: 10000,
    category: 'Graphics',
    level: 'Business',
    description: 'Social and marketing graphics pack — posts, story frames, and brand-aligned assets.',
    image: '/media/posters/packages/design_graphics_pack.jpg',
  }),
  pkg({
    id: 'design_poster_set',
    groupId: 'graphics_design',
    groupName: 'Graphics Design',
    tierLabel: 'Poster set (3)',
    experienceBand: 'Coordinated campaign set',
    name: 'Campaign Poster Set (3)',
    price: 14000,
    category: 'Graphics',
    level: 'Professional',
    description: 'Set of three coordinated campaign posters for events, launches, or ads.',
    image: '/media/posters/packages/design_poster_set.jpg',
  }),

  // ── Stationery ─────────────────────────────────────────────────────────
  pkg({
    id: 'stationery_stamp_seal',
    groupId: 'stationery_pack',
    groupName: 'Business Stationery',
    tierLabel: 'Stamp / seal',
    experienceBand: 'Rubber or digital seal',
    name: 'Stamp / Seal Design',
    price: 1500,
    category: 'Stationery',
    level: 'Starter',
    description: 'Company stamp or seal artwork for rubber stamp / digital seal use.',
    image: '/media/posters/packages/stationery_stamp_seal.jpg',
  }),
  pkg({
    id: 'stationery_comp_slips',
    groupId: 'stationery_pack',
    groupName: 'Business Stationery',
    tierLabel: 'Compliment slips',
    experienceBand: 'With-compliments design',
    name: 'Complimentary Slips',
    price: 2000,
    category: 'Stationery',
    level: 'Entry',
    description: 'With-compliments slip design matching your letterhead and brand colours.',
    image: '/media/posters/packages/stationery_comp_slips.jpg',
  }),
  pkg({
    id: 'design_business_cards',
    groupId: 'stationery_pack',
    groupName: 'Business Stationery',
    tierLabel: 'Business cards',
    experienceBand: 'Front/back print-ready',
    name: 'Business Cards Design',
    price: 2500,
    category: 'Stationery',
    level: 'Entry',
    description:
      'Print-ready business card design — front/back, brand-aligned, and print-file delivery.',
    image: '/media/posters/packages/design_business_cards.jpg',
  }),
  pkg({
    id: 'stationery_envelopes',
    groupId: 'stationery_pack',
    groupName: 'Business Stationery',
    tierLabel: 'Envelopes',
    experienceBand: 'DL / C5 branding',
    name: 'Envelope Design',
    price: 2500,
    category: 'Stationery',
    level: 'Mid',
    description: 'Branded envelope artwork for DL / C5 — return address and logo placement.',
    image: '/media/posters/packages/stationery_envelopes.jpg',
  }),
  pkg({
    id: 'stationery_letterhead',
    groupId: 'stationery_pack',
    groupName: 'Business Stationery',
    tierLabel: 'Letterhead',
    experienceBand: 'Word/PDF template',
    name: 'Letterhead Design',
    price: 3000,
    category: 'Stationery',
    level: 'Mid',
    description: 'Branded letterhead template for Word/PDF — logo, contact block, and print margins.',
    image: '/media/posters/packages/stationery_letterhead.jpg',
  }),
  pkg({
    id: 'stationery_full_pack',
    groupId: 'stationery_pack',
    groupName: 'Business Stationery',
    tierLabel: 'Full stationery pack',
    experienceBand: 'Coordinated brand set',
    name: 'Full Rebrand Stationery Pack',
    price: 18000,
    category: 'Stationery',
    level: 'Business',
    description:
      'Business cards, letterhead, envelopes, complimentary slips, and stamp design as one coordinated pack.',
    image: '/media/posters/packages/stationery_full_pack.jpg',
  }),
]

/** Sort variants within a service card (level, then price) */
export function sortVariants(list: PricingPackage[]): PricingPackage[] {
  return [...list].sort((a, b) => {
    const levelDiff = levelSortIndex(a.level) - levelSortIndex(b.level)
    if (levelDiff !== 0) return levelDiff
    return Number(a.price) - Number(b.price)
  })
}

/** Collapse flat catalogue into parent service cards with selectable tiers */
export function groupPricingPackages(list: PricingPackage[]): PricingServiceGroup[] {
  const map = new Map<string, PricingPackage[]>()
  for (const p of list) {
    const gid = p.groupId || p.id
    const arr = map.get(gid) || []
    arr.push(p)
    map.set(gid, arr)
  }
  const groups: PricingServiceGroup[] = []
  for (const [groupId, variantsRaw] of map) {
    const variants = sortVariants(variantsRaw)
    const first = variants[0]
    const fromPrice = Math.min(...variants.map((v) => Number(v.price)))
    groups.push({
      groupId,
      groupName: first.groupName || first.name,
      category: first.category,
      variants,
      fromPrice,
      currency: first.currency || 'KES',
      image: first.image,
      description:
        variants.length > 1
          ? `Choose the option that matches your experience, needs, and budget — ${variants.length} tiers.`
          : first.description,
    })
  }
  return groups.sort((a, b) => {
    const ca = packageCategoryOrder.indexOf(a.category as (typeof packageCategoryOrder)[number])
    const cb = packageCategoryOrder.indexOf(b.category as (typeof packageCategoryOrder)[number])
    const catDiff = (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb)
    if (catDiff !== 0) return catDiff
    return a.fromPrice - b.fromPrice
  })
}

export function orderedCategoriesFromGroups(groups: PricingServiceGroup[]): string[] {
  const present = new Set(groups.map((g) => g.category))
  const preferred = packageCategoryOrder.filter((c) => present.has(c))
  const rest = [...present].filter(
    (c) => !preferred.includes(c as (typeof packageCategoryOrder)[number]),
  )
  return [...preferred, ...rest]
}
