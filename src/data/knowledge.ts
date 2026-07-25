export type KnowledgeCategory =
  | 'articles'
  | 'tutorials'
  | 'case-studies'
  | 'white-papers'
  | 'documentation'
  | 'downloads'
  | 'faqs'

export type KnowledgeArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  category: KnowledgeCategory
  tags: string[]
  status: 'draft' | 'published'
  seoTitle?: string
  seoDescription?: string
  /** Direct file download (PDF) when category is downloads */
  downloadUrl?: string
  htmlUrl?: string
  updatedAt: string
  createdAt: string
}

export const knowledgeCategories: {
  id: KnowledgeCategory
  title: string
  description: string
}[] = [
  {
    id: 'articles',
    title: 'Articles',
    description: 'Insights on software development, AI, cloud, and digital transformation in Africa.',
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    description: 'Step-by-step guides for developers and IT professionals.',
  },
  {
    id: 'case-studies',
    title: 'Case Studies',
    description: 'In-depth looks at how we solved real business challenges.',
  },
  {
    id: 'white-papers',
    title: 'White Papers',
    description: 'Research and technical papers on industry trends.',
  },
  {
    id: 'documentation',
    title: 'Product Documentation',
    description: 'Technical documentation for Ellines Tech products.',
  },
  {
    id: 'downloads',
    title: 'Downloads',
    description: 'Brochures, product sheets, and media assets.',
  },
  {
    id: 'faqs',
    title: 'FAQs',
    description: 'Answers to common questions about our products and services.',
  },
]

const stamp = '2026-01-15T10:00:00.000Z'

/** Seed / offline fallback for Knowledge Hub — mirrored in CMS defaults */
export const defaultKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'kh_scalable_healthcare',
    slug: 'building-scalable-healthcare-systems-in-africa',
    title: 'Building Scalable Healthcare Systems in Africa',
    excerpt:
      'How hospitals and clinics can grow digital capacity without fragile, one-off custom builds.',
    body: `Africa’s healthcare providers face rising patient volumes, fragmented records, and limited IT budgets. Scalable systems start with clear clinical workflows — registration, billing, pharmacy, lab, and outpatient — then add modules as facilities expand.

Ellines Tech designs hospital platforms like MedFlow around modular services so a single clinic can start lean and later connect multi-branch inventory, reporting, and AI triage without rewriting the core.

Practical takeaways: digitize the busiest desks first, keep offline-tolerant flows for unreliable connectivity, and measure wait times and claim turnaround from day one.`,
    category: 'articles',
    tags: ['healthcare', 'africa', 'medflow'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_ai_smes',
    slug: 'ai-adoption-for-smes',
    title: 'AI Adoption for SMEs',
    excerpt: 'A practical path for small and mid-size businesses to use AI without a data science team.',
    body: `SMEs do not need a research lab to benefit from AI. Start with high-volume, repetitive work: customer questions, appointment booking, invoice follow-ups, and internal FAQs.

Tools like RV22 and AfyaVox show how domain assistants can sit on top of existing processes. Success depends on clean knowledge (policies, product sheets, SOPs) and a human escalation path — not on building models from scratch.

Begin with one channel (WhatsApp or web chat), measure deflection and response time, then expand.`,
    category: 'articles',
    tags: ['ai', 'sme', 'automation'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_cloud_migration',
    slug: 'cloud-migration-best-practices',
    title: 'Cloud Migration Best Practices',
    excerpt: 'Move workloads deliberately — inventory, secure, migrate, then optimize cost and reliability.',
    body: `Cloud migration fails when teams lift every server without classifying workloads. Inventory applications by criticality, data sensitivity, and dependency graph first.

Prefer phased cutovers: non-production, then low-risk production, then core systems. Enforce identity, backups, and monitoring before traffic moves. On Cloudflare and similar edges, static sites and APIs can move early while databases follow a controlled plan.

After go-live, right-size compute and set spending alerts — migration is not finished until cost and SLOs are stable.`,
    category: 'articles',
    tags: ['cloud', 'devops', 'infrastructure'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_medflow_api',
    slug: 'getting-started-with-medflow-api',
    title: 'Getting Started with MedFlow API',
    excerpt: 'Authenticate, create a patient record, and pull a visit summary in a few steps.',
    body: `MedFlow exposes REST endpoints for registration, encounters, billing, and inventory. Request API credentials from your Ellines Tech account manager, then store the key in a server-side secret — never in a public frontend.

Typical first call: create or look up a patient, open an encounter, and attach diagnoses or pharmacy orders. Use pagination on list endpoints and webhook hooks for billing events when available.

Need a sandbox? Contact Ellines Tech for a demo tenant and sample Postman collection.`,
    category: 'tutorials',
    tags: ['medflow', 'api', 'tutorial'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_cloudflare_pages',
    slug: 'deploying-on-cloudflare-pages',
    title: 'Deploying on Cloudflare Pages',
    excerpt: 'Ship a Vite/React site to Cloudflare Pages with preview deploys and a custom domain.',
    body: `Build your static assets with your usual \`npm run build\`, then connect the repo to Cloudflare Pages. Set the build command and output directory (for Vite, typically \`dist\`).

Add environment variables for public config only. Bind Workers/Pages Functions for APIs such as \`/api/cms\`. Attach your custom domain in Pages settings and confirm DNS.

Use preview deployments for pull requests, and keep production protected with the correct project and branch.`,
    category: 'tutorials',
    tags: ['cloudflare', 'deploy', 'vite'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_flutter_guide',
    slug: 'flutter-app-development-guide',
    title: 'Flutter App Development Guide',
    excerpt: 'Structure, state, and release basics Ellines Tech uses for client mobile apps.',
    body: `We structure Flutter apps by feature modules, keep networking behind repositories, and prefer clear loading/error empty states over silent failures.

Use flavor configs for staging and production API bases. Test critical flows on mid-range Android devices common in the markets we serve. For release, sign Android builds securely and follow App Store / Play Console checklists.

Ellines Tech can scaffold, build, or take over an existing Flutter codebase — reach out via Contact for a scoping call.`,
    category: 'tutorials',
    tags: ['flutter', 'mobile', 'tutorial'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_medflow_case',
    slug: 'medflow-40-percent-wait-time-reduction',
    title: 'MedFlow: 40% Wait Time Reduction',
    excerpt: 'Digitized queues and billing cut average outpatient wait times by about 40%.',
    body: `A multi-department facility struggled with paper cards, duplicate registrations, and pharmacy bottlenecks. We deployed MedFlow for registration, triage queues, and pharmacy fulfillment with role-based staff access.

Within the first quarter, average outpatient wait dropped roughly 40% as queues became visible and billing stopped blocking clinical flow. Leadership gained daily volume reports without spreadsheet reconciliation.

The same pattern applies to clinics ready to replace ad-hoc WhatsApp coordination with structured workflows.`,
    category: 'case-studies',
    tags: ['medflow', 'healthcare', 'case-study'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_rv22_case',
    slug: 'rv22-60-percent-support-ticket-reduction',
    title: 'RV22: 60% Support Ticket Reduction',
    excerpt: 'An AI assistant trained on product knowledge deflected the majority of repetitive tickets.',
    body: `A growing support desk spent most of its day answering the same password, pricing, and “how do I” questions. We deployed RV22 with a curated knowledge base and clear handoff to humans for billing disputes.

Repetitive ticket volume fell by about 60% while first-response time improved for complex issues. Agents used the same knowledge store, so answers stayed consistent across chat and email.

AI works best when knowledge is maintained — Ellines Tech includes update workflows as part of ongoing care.`,
    category: 'case-studies',
    tags: ['rv22', 'ai', 'support'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_school_case',
    slug: 'school-management-at-scale',
    title: 'School Management at Scale',
    excerpt: 'One platform for admissions, fees, and reporting across campuses.',
    body: `A school group needed unified student records, fee tracking, and parent communication without five disconnected tools. We delivered a management system with campus-level permissions and consolidated reporting.

Admissions and fee collections became auditable; leadership could compare campus performance from one dashboard. Staff training focused on the highest-volume desks first so adoption stuck.

Education systems succeed when they respect term calendars and offline-friendly capture for busy enrollment weeks.`,
    category: 'case-studies',
    tags: ['education', 'case-study'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_digital_health',
    slug: 'digital-health-in-east-africa',
    title: 'Digital Health in East Africa',
    excerpt: 'Trends shaping hospital software, interoperability, and patient experience in the region.',
    body: `East African providers are investing in EMR-lite systems, mobile payments for bills, and AI triage for high-volume OPDs. Interoperability remains a gap — many facilities still export CSVs between lab and pharmacy.

Policy pressure around data protection is rising. Vendors that offer clear consent, role-based access, and local hosting options win trust faster.

Ellines Tech builds with these constraints in mind: modular clinical modules, auditable access, and deployment models that fit hospital IT reality.`,
    category: 'white-papers',
    tags: ['healthcare', 'east-africa', 'research'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_ai_automation',
    slug: 'ai-for-business-automation',
    title: 'AI for Business Automation',
    excerpt: 'Where assistants, workflows, and integrations actually save money.',
    body: `Automation ROI is highest on predictable, document-heavy processes: lead qualification, appointment reminders, inventory alerts, and policy Q&A.

Pair an assistant with structured backends (CRM, ERP, hospital systems) instead of hoping chat alone runs the business. Keep humans in the loop for exceptions and regulated decisions.

Ellines Tech maps processes before recommending AI so pilots have measurable KPIs from week one.`,
    category: 'white-papers',
    tags: ['ai', 'automation', 'research'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_cyber_smes',
    slug: 'cybersecurity-for-smes',
    title: 'Cybersecurity for SMEs',
    excerpt: 'Baseline controls every small business should implement before the next breach headline.',
    body: `Most SME breaches exploit weak passwords, shared admin accounts, and unpatched endpoints — not nation-state malware. Enforce MFA, unique admin credentials, encrypted backups, and least-privilege access.

Train staff on phishing. Segment guest Wi-Fi. Review who can export customer data. If you take card or M-Pesa payments, separate those systems from general office PCs.

Ellines Tech can harden websites, apps, and hosting setups as part of delivery or a focused security review.`,
    category: 'white-papers',
    tags: ['security', 'sme'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_medflow_admin',
    slug: 'medflow-admin-guide',
    title: 'MedFlow Admin Guide',
    excerpt: 'Roles, departments, and day-one configuration for hospital administrators.',
    body: `Admins configure departments, user roles, service prices, and printer/station settings before go-live. Start with reception, cashier, pharmacy, and clinical roles — expand later.

Use the audit log to review sensitive changes. Schedule end-of-day cash and stock reconciliations. Keep a break-glass admin account offline in a sealed process.

For a full onboarding pack, request training from your Ellines Tech implementation lead.`,
    category: 'documentation',
    tags: ['medflow', 'docs'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_rv22_docs',
    slug: 'rv22-integration-docs',
    title: 'RV22 Integration Docs',
    excerpt: 'Connect RV22 to your website, WhatsApp, or internal tools.',
    body: `RV22 can be embedded as a web widget, connected to messaging channels, or called via API for custom UIs. Provide a knowledge base of FAQs, product sheets, and escalation rules.

Configure allowed domains for the widget and rotate API keys on a schedule. Log conversations for quality review under your privacy policy.

Contact Ellines Tech for channel-specific setup (WhatsApp Business API, Slack, or custom backends).`,
    category: 'documentation',
    tags: ['rv22', 'docs', 'integration'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_api_reference',
    slug: 'api-reference',
    title: 'API Reference',
    excerpt: 'Overview of Ellines Tech product APIs and how to request credentials.',
    body: `Product APIs (MedFlow, RV22, and custom builds) use HTTPS JSON endpoints with key or token authentication. Rate limits and sandbox URLs are issued per client.

Always call APIs from trusted servers when secrets are involved. Prefer idempotent writes for billing and inventory mutations.

Open a request via Contact or your project channel to receive OpenAPI specs for your tenant.`,
    category: 'documentation',
    tags: ['api', 'docs'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_company_profile',
    slug: 'company-profile-pdf',
    title: 'Company Profile PDF',
    excerpt: 'Overview of Ellines Tech capabilities, products, and engagement models.',
    body: `Download our company profile for stakeholder sharing. It covers Ellines Group context, flagship products (MedFlow, RV22, AfyaVox, Juno4), services, and how we engage from discovery to launch.

Use the PDF or printable HTML below. Looking for a tailored one-pager for a tender? Tell us the sector and deadline via Contact.`,
    category: 'downloads',
    tags: ['download', 'company'],
    status: 'published',
    downloadUrl: '/downloads/ellines-tech-company-profile.pdf',
    htmlUrl: '/downloads/ellines-tech-company-profile.html',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_pricing_rate_card',
    slug: 'pricing-rate-card',
    title: 'Pricing & Rate Card',
    excerpt: 'Starter packages, engagement models, and how enterprise quotes work.',
    body: `Download the Ellines Tech pricing rate card for a clear overview of published starter packages and how custom enterprise work is quoted.

Live catalogue prices may update on /pricing — this document is the stakeholder-ready summary.`,
    category: 'downloads',
    tags: ['download', 'pricing'],
    status: 'published',
    downloadUrl: '/downloads/ellines-tech-pricing-rate-card.pdf',
    htmlUrl: '/downloads/ellines-tech-pricing-rate-card.html',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_capabilities',
    slug: 'capabilities-one-pager',
    title: 'Capabilities One-Pager',
    excerpt: 'Engineering, AI, healthcare tech, design, and digital ops at a glance.',
    body: `A concise one-pager of Ellines Tech capabilities for introductions, partnerships, and internal stakeholder packs.

Download the PDF or open the printable HTML version.`,
    category: 'downloads',
    tags: ['download', 'capabilities'],
    status: 'published',
    downloadUrl: '/downloads/ellines-tech-capabilities.pdf',
    htmlUrl: '/downloads/ellines-tech-capabilities.html',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_service_catalogue',
    slug: 'service-catalogue-summary',
    title: 'Service Catalogue Summary',
    excerpt: 'Stakeholder-ready summary of software, cloud, design, and enablement services.',
    body: `Use this catalogue summary with tenders and RFPs alongside the Company Profile. For current package prices, also download the Pricing Rate Card or visit /pricing.`,
    category: 'downloads',
    tags: ['download', 'services'],
    status: 'published',
    downloadUrl: '/downloads/ellines-tech-service-catalogue.pdf',
    htmlUrl: '/downloads/ellines-tech-service-catalogue.html',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_medflow_sheet',
    slug: 'medflow-product-sheet',
    title: 'MedFlow Product Sheet',
    excerpt: 'Module list and outcomes summary for hospital decision-makers.',
    body: `The MedFlow product sheet summarizes clinical, billing, pharmacy, and reporting modules with typical deployment timelines.

For the full company pack, download the Company Profile and Capabilities one-pager. Book a live demo to see your workflows mapped on screen.`,
    category: 'downloads',
    tags: ['medflow', 'download'],
    status: 'published',
    downloadUrl: '/downloads/ellines-tech-capabilities.pdf',
    htmlUrl: '/downloads/ellines-tech-capabilities.html',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_brand_assets',
    slug: 'brand-assets',
    title: 'Brand Assets',
    excerpt: 'Logo usage and press assets for partners covering Ellines Tech.',
    body: `Partners and press can use materials from our Company Profile pack. Official logo files remain available on request for approved press use.

Primary digital assets: /logos/logo-mark-nav.png (nav icon), /logos/logo-full.png (horizontal lockup), /logos/logo-square.png (app tile), /logos/logo-hero.png (hero).

Do not stretch or recolor the mark outside approved guidelines. Submit intended use via Contact for a full brand pack.`,
    category: 'downloads',
    tags: ['brand', 'download'],
    status: 'published',
    downloadUrl: '/downloads/ellines-tech-company-profile.pdf',
    htmlUrl: '/downloads/ellines-tech-company-profile.html',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_faq_demo',
    slug: 'how-do-i-request-a-demo',
    title: 'How do I request a demo?',
    excerpt: 'Book a product or services demo in a few clicks.',
    body: `Use the Contact page, the on-site chat, or WhatsApp. Mention the product (for example MedFlow or RV22) and your preferred time.

We run demos around your workflows — not generic slide decks — so share a short note about your facility or business size if you can.

You can also start from /request with a package selected from Pricing.`,
    category: 'faqs',
    tags: ['faq', 'demo'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_faq_pricing',
    slug: 'what-is-your-pricing-model',
    title: 'What is your pricing model?',
    excerpt: 'Project-based delivery with clear packages on /pricing.',
    body: `Most work is scoped as fixed or milestone-based projects. Starter packages for websites and common services are listed on the Pricing page.

Enterprise products (hospital systems, AI assistants) are quoted after discovery because modules and integrations vary.

Ask for a written estimate — we will outline deliverables, timeline, and payment stages before build starts.`,
    category: 'faqs',
    tags: ['faq', 'pricing'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
  {
    id: 'kh_faq_support',
    slug: 'do-you-offer-support-maintenance',
    title: 'Do you offer support & maintenance?',
    excerpt: 'Yes — care plans cover updates, monitoring, and priority fixes.',
    body: `After launch we offer support and maintenance retainers covering bug fixes, dependency updates, content help, and monitoring.

Critical production issues get priority channels (WhatsApp / phone) as defined in your care agreement. Feature work is scheduled separately so support stays predictable.

Ask about care options when you request a quote or after go-live.`,
    category: 'faqs',
    tags: ['faq', 'support'],
    status: 'published',
    updatedAt: stamp,
    createdAt: stamp,
  },
]

export function getKnowledgeCategory(id: string) {
  return knowledgeCategories.find((c) => c.id === id)
}

export function getDefaultArticleBySlug(slug: string) {
  return defaultKnowledgeArticles.find((a) => a.slug === slug && a.status === 'published')
}
