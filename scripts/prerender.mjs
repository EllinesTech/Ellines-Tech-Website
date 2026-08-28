/**
 * Prerender script — generates static HTML snapshots for key pages at build time.
 * Cloudflare Pages serves these directly; Googlebot reads real content immediately
 * without needing to execute JavaScript.
 *
 * Run via: node scripts/prerender.mjs  (called from postbuild in package.json)
 */

import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = 'https://tech.ellines.co.ke'
const DIST = 'dist'

// Read the built index.html as the shell template
const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

/**
 * Each entry defines a page to prerender.
 * - path: URL path (used for canonical + output file)
 * - title: <title> tag content
 * - description: meta description
 * - h1: visible heading Google reads as primary topic signal
 * - body: paragraph text injected as noscript content
 * - keywords: comma-separated keywords for meta keywords tag
 * - jsonLd: extra JSON-LD for this specific page
 */
const pages = [
  {
    path: '/',
    title: 'Ellines Tech | IT Company Kenya — Web Design, Software, AI & Consulting',
    description:
      'Ellines Tech is a Kenya IT company offering web design, software development, AI, IT consulting, digital marketing, and career documents. Offices in Nyeri & Nairobi. Get a free quote today.',
    keywords:
      'Ellines Tech, EllinesTech, IT company Kenya, web design Kenya, software development Kenya, AI Kenya, IT consulting Nyeri, IT consulting Nairobi, digital marketing Kenya, web development Nairobi, app development Kenya',
    h1: 'Ellines Tech — IT Company in Kenya',
    body: 'Ellines Tech is a Kenya-based IT company offering web design, software development, mobile apps, AI automation, IT consulting, digital marketing, cyber security, and career documents. Serving businesses in Nyeri, Nairobi, and across Africa. Get a free quote — projects start this week.',
    breadcrumbs: null,
    jsonLd: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: 'Ellines Tech — IT Company Kenya',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
      description:
        'Kenya IT company for web design, software development, AI, IT consulting, digital marketing, and career documents.',
    },
  },
  {
    path: '/services',
    title: 'IT & Digital Services in Kenya | Ellines Tech',
    description:
      'Web design, software development, AI automation, IT consulting, digital marketing, cyber security, logo design, and career documents — transparent pricing, fast turnaround. Nyeri & Nairobi.',
    keywords:
      'web design Kenya, software development Kenya, AI automation Kenya, IT consulting Kenya, digital marketing Kenya, cyber security Kenya, logo design Nairobi, CV writing Kenya, resume Kenya',
    h1: 'IT & Digital Services in Kenya',
    body: 'Ellines Tech provides professional IT and digital services in Kenya: web design, software development, mobile app development, AI and automation, IT consulting, digital marketing, cyber security, logo design, branding, career documents (CV, resume, LinkedIn), tax filing assistance, and merchandise printing. Serving Nyeri, Nairobi, and clients across Africa.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ],
    jsonLd: {
      '@type': 'WebPage',
      name: 'IT & Digital Services in Kenya — Ellines Tech',
      url: `${BASE_URL}/services`,
      description: 'Full catalogue of IT and digital services from Ellines Tech Kenya.',
    },
  },
  {
    path: '/about',
    title: 'About Ellines Tech | Kenya IT Company — Nyeri & Nairobi',
    description:
      'Ellines Tech is a Kenya IT company founded by Elijah Mwangi M. Part of Ellines Group — software development, AI, and digital transformation for businesses across Africa.',
    keywords:
      'Ellines Tech about, Ellines Tech Kenya, Elijah Mwangi, IT company Nyeri, IT company Nairobi, Ellines Group, Kenya tech startup',
    h1: 'About Ellines Tech',
    body: 'Ellines Tech is a Kenya-based IT company part of Ellines Group, founded by Elijah Mwangi M. We specialize in software development, web design, AI, IT consulting, digital marketing, and career documents. Offices in Nyeri (head office) and Nairobi. We have delivered over 50 projects for businesses across healthcare, education, finance, and services.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
    jsonLd: {
      '@type': 'AboutPage',
      name: 'About Ellines Tech',
      url: `${BASE_URL}/about`,
      description: 'About Ellines Tech — Kenya IT company, Ellines Group, founder Elijah Mwangi M.',
    },
  },
  {
    path: '/contact',
    title: 'Contact Ellines Tech | Nyeri & Nairobi, Kenya',
    description:
      'Contact Ellines Tech — WhatsApp +254 748 255 466, email info@ellines.co.ke, or fill our request form. Offices in Nyeri & Nairobi. We reply within a few hours, 24/7.',
    keywords:
      'contact Ellines Tech, Ellines Tech phone, Ellines Tech WhatsApp, IT company contact Kenya, web design quote Kenya, software development quote Kenya',
    h1: 'Contact Ellines Tech',
    body: 'Reach Ellines Tech by WhatsApp at +254 748 255 466, by email at info@ellines.co.ke or tech@ellines.co.ke, or by phone at +254 728 807 213. Head office: Square2 Street, Skt, Nyeri, Kenya. Nairobi presence available by appointment. We are available 24/7 and reply within a few hours.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
    jsonLd: {
      '@type': 'ContactPage',
      name: 'Contact Ellines Tech',
      url: `${BASE_URL}/contact`,
    },
  },
  {
    path: '/pricing',
    title: 'IT Service Pricing Kenya | Ellines Tech Packages',
    description:
      'Transparent IT service pricing from Ellines Tech Kenya — website packages, software development, AI, logo design, CV writing, and more. Fixed prices, M-Pesa & card accepted.',
    keywords:
      'IT service pricing Kenya, web design price Kenya, software development cost Kenya, logo design price Kenya, CV writing price Kenya, Ellines Tech pricing',
    h1: 'IT Service Pricing — Ellines Tech Kenya',
    body: 'Ellines Tech offers transparent fixed-price packages for IT services in Kenya. Packages include: starter websites from KES 15,000, business web apps, AI automation tools, logo and branding kits, CV and resume writing from KES 1,000, digital marketing campaigns, and IT consulting sessions. Pay via M-Pesa or card. Projects start the same week.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Pricing', path: '/pricing' },
    ],
    jsonLd: null,
  },
  {
    path: '/portfolio',
    title: 'Portfolio — Projects & Case Studies | Ellines Tech Kenya',
    description:
      'Portfolio of web design, software development, AI, and branding projects delivered by Ellines Tech for clients across Kenya and Africa.',
    keywords:
      'Ellines Tech portfolio, web design portfolio Kenya, software development portfolio, IT projects Kenya, AfyaVox, MedFlow, RV22, Juno4',
    h1: 'Ellines Tech Portfolio — Projects & Case Studies',
    body: 'Browse Ellines Tech project portfolio: healthcare systems (AfyaVox, MedFlow), AI assistants (RV22, Juno4), business websites, mobile apps, brand identity systems, and digital marketing campaigns for clients across Kenya and Africa.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Portfolio', path: '/portfolio' },
    ],
    jsonLd: null,
  },
  {
    path: '/industries',
    title: 'Industries We Serve | Ellines Tech Kenya',
    description:
      'Ellines Tech serves healthcare, education, finance, hospitality, NGOs, SACCOs, retail, and more across Kenya. Industry-specific software, AI, and digital solutions.',
    keywords:
      'IT solutions healthcare Kenya, school management system Kenya, SACCO software Kenya, hotel management Kenya, hospital system Kenya, NGO software Kenya',
    h1: 'Industries Served by Ellines Tech',
    body: 'Ellines Tech provides technology solutions across 12+ industries in Kenya: healthcare (hospitals, clinics, pharmacies), education (schools, universities), finance (SACCOs, banks, microfinance), hospitality (hotels, restaurants), NGOs, retail, real estate, logistics, government, and more.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries' },
    ],
    jsonLd: null,
  },
  // High-value service pages
  {
    path: '/services/web-development',
    title: 'Web Development Services Kenya | Ellines Tech',
    description:
      'Professional web development in Kenya — business websites, web apps, e-commerce, and portals. Fast delivery, transparent pricing. Nyeri & Nairobi.',
    keywords:
      'web development Kenya, web developer Nairobi, web developer Nyeri, business website Kenya, web app development Kenya, e-commerce website Kenya',
    h1: 'Web Development Services in Kenya',
    body: 'Ellines Tech offers full-stack web development for businesses in Kenya — from landing pages and business websites to complex web applications, e-commerce platforms, and client portals. Technologies: React, Python, Node.js, PostgreSQL, Cloudflare. Serving Nyeri, Nairobi, and clients across Africa.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Web Development', path: '/services/web-development' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Web Development',
      serviceType: 'Web Development',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      description: 'Full-stack web development for businesses in Kenya.',
      url: `${BASE_URL}/services/web-development`,
    },
  },
  {
    path: '/services/software-development',
    title: 'Software Development Kenya | Custom Apps | Ellines Tech',
    description:
      'Custom software development in Kenya — business systems, mobile apps, APIs, and enterprise software. Ellines Tech, Nyeri & Nairobi.',
    keywords:
      'software development Kenya, custom software Kenya, app development Kenya, mobile app developer Kenya, enterprise software Kenya, software company Nairobi',
    h1: 'Custom Software Development in Kenya',
    body: 'Ellines Tech builds custom software for businesses in Kenya — ERP systems, mobile apps (Flutter), business management platforms, REST APIs, automation tools, and enterprise applications. Based in Nyeri with Nairobi presence.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Software Development', path: '/services/software-development' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Software Development',
      serviceType: 'Custom Software Development',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/software-development`,
    },
  },
  {
    path: '/services/ai-development-automation',
    title: 'AI Development & Automation Kenya | Ellines Tech',
    description:
      'AI development and business automation in Kenya — chatbots, intelligent assistants, workflow automation, and AI integration. Ellines Tech.',
    keywords:
      'AI development Kenya, AI automation Kenya, chatbot Kenya, business automation Kenya, artificial intelligence Kenya, AI company Kenya',
    h1: 'AI Development & Automation in Kenya',
    body: 'Ellines Tech builds AI solutions for Kenyan businesses: custom AI chatbots, intelligent document processing, workflow automation, predictive analytics, voice AI, and AI-powered business tools. Projects include AfyaVox (clinical AI) and RV22/Juno4 (AI platforms).',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'AI Development', path: '/services/ai-development-automation' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'AI Development & Automation',
      serviceType: 'AI Development',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/ai-development-automation`,
    },
  },
  {
    path: '/services/logo-design',
    title: 'Logo Design Kenya | Professional Logo & Branding | Ellines Tech',
    description:
      'Professional logo design and brand identity in Kenya. Custom logos, brand guidelines, and design packages. Ellines Tech — Nyeri & Nairobi.',
    keywords:
      'logo design Kenya, logo designer Nairobi, brand identity Kenya, graphic designer Kenya, logo design Nyeri, company logo Kenya',
    h1: 'Logo Design & Brand Identity in Kenya',
    body: 'Ellines Tech creates professional logos and brand identity systems for businesses in Kenya. Services include custom logo design, brand guidelines, multiple format delivery, and full brand identity packages. Affordable pricing starting from KES 3,000.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Logo Design', path: '/services/logo-design' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Logo Design',
      serviceType: 'Logo & Brand Identity Design',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/logo-design`,
    },
  },
  {
    path: '/services/digital-marketing',
    title: 'Digital Marketing Services Kenya | Ellines Tech',
    description:
      'Digital marketing in Kenya — SEO, social media, paid ads, and content marketing. Grow your business online with Ellines Tech.',
    keywords:
      'digital marketing Kenya, SEO Kenya, social media marketing Kenya, online marketing Kenya, paid ads Kenya, content marketing Kenya',
    h1: 'Digital Marketing Services in Kenya',
    body: 'Ellines Tech offers comprehensive digital marketing services in Kenya: SEO and content marketing, social media management, paid advertising (Google, Meta), email marketing, analytics, and campaign reporting. Serving businesses in Nairobi, Nyeri, and across Kenya.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Digital Marketing', path: '/services/digital-marketing' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Digital Marketing',
      serviceType: 'Digital Marketing',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/digital-marketing`,
    },
  },
  {
    path: '/services/it-consulting',
    title: 'IT Consulting Kenya | Technology Advisory | Ellines Tech',
    description:
      'IT consulting and technology advisory for businesses in Kenya — systems review, architecture guidance, digital transformation, and vendor selection. Ellines Tech.',
    keywords:
      'IT consulting Kenya, IT consultant Nairobi, technology advisor Kenya, digital transformation Kenya, IT strategy Kenya, IT consultant Nyeri',
    h1: 'IT Consulting Services in Kenya',
    body: 'Ellines Tech provides independent IT consulting for Kenyan businesses: technology assessment, systems architecture advice, vendor selection, cloud migration planning, digital transformation roadmaps, and IT strategy for growth-stage companies and enterprises.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'IT Consulting', path: '/services/it-consulting' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'IT Consulting',
      serviceType: 'IT Consulting',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/it-consulting`,
    },
  },
  {
    path: '/services/resume-building',
    title: 'CV & Resume Writing Kenya | ATS-Friendly | Ellines Tech',
    description:
      'Professional CV and resume writing in Kenya — ATS-friendly formats, job-targeted keywords, from KES 1,000. Ellines Tech career documents.',
    keywords:
      'CV writing Kenya, resume writing Kenya, ATS resume Kenya, professional CV Kenya, resume builder Kenya, cover letter Kenya, LinkedIn optimisation Kenya',
    h1: 'Professional CV & Resume Writing in Kenya',
    body: 'Ellines Tech offers affordable CV and resume writing services in Kenya: ATS-optimised resumes from scratch, CV revamps, cover letter writing, LinkedIn profile optimisation. Suitable for students, graduates, mid-level, senior, and executive professionals. Prices from KES 1,000.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Resume Building', path: '/services/resume-building' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Resume Building',
      serviceType: 'Career Document Services',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE'],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'KES',
        price: 1000,
        availability: 'https://schema.org/InStock',
      },
      url: `${BASE_URL}/services/resume-building`,
    },
  },
  {
    path: '/services/web-design',
    title: 'Web Design Kenya | Professional Website Design | Ellines Tech',
    description:
      'Professional web design in Kenya — responsive, fast, and conversion-focused websites for businesses. Nyeri & Nairobi. Get a free quote from Ellines Tech.',
    keywords:
      'web design Kenya, website design Nairobi, website design Nyeri, professional web designer Kenya, responsive web design Kenya, business website design Kenya',
    h1: 'Professional Web Design in Kenya',
    body: 'Ellines Tech designs professional, mobile-responsive websites for businesses in Kenya. Services include landing pages, multi-page business sites, e-commerce design, UI/UX, and brand-aligned web design. Based in Nyeri, serving Nairobi and all of Kenya.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Web Design', path: '/services/web-design' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Web Design',
      serviceType: 'Web Design',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/web-design`,
    },
  },
  {
    path: '/services/cyber-security',
    title: 'Cyber Security Services Kenya | Ellines Tech',
    description:
      'Cyber security services in Kenya — security assessments, vulnerability remediation, hardening, and secure architecture. Protect your business with Ellines Tech.',
    keywords:
      'cyber security Kenya, cyber security Nairobi, security assessment Kenya, IT security Kenya, vulnerability testing Kenya, data security Kenya',
    h1: 'Cyber Security Services in Kenya',
    body: 'Ellines Tech provides cyber security services for Kenyan businesses: security assessments, vulnerability testing and remediation, system hardening, security monitoring, and secure architecture design. Protecting websites, applications, and business data.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Cyber Security', path: '/services/cyber-security' },
    ],
    jsonLd: {
      '@type': 'Service',
      name: 'Cyber Security',
      serviceType: 'Cyber Security',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['KE', 'Africa'],
      url: `${BASE_URL}/services/cyber-security`,
    },
  },
  {
    path: '/faq',
    title: 'FAQ — Ellines Tech Kenya | Common Questions Answered',
    description:
      'Answers to common questions about Ellines Tech services — pricing, timelines, how to start, payment methods, and support. Kenya IT company.',
    keywords:
      'Ellines Tech FAQ, IT company Kenya questions, web design pricing Kenya, software development timeline Kenya, how to hire IT company Kenya',
    h1: 'Frequently Asked Questions — Ellines Tech',
    body: 'Common questions about Ellines Tech: How fast can we start? Most projects begin within the week. What does it cost? Fixed-price packages from KES 1,000 for career documents to larger custom software builds. How do I pay? M-Pesa and card accepted. Do you offer support after launch? Yes — 24/7 availability for demos, fixes, and follow-up work.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'FAQ', path: '/faq' },
    ],
    jsonLd: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How fast can Ellines Tech start my project?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most service requests get a scoped reply within a few hours. Smaller deliverables can begin the same week; larger builds get a written plan first.',
          },
        },
        {
          '@type': 'Question',
          name: 'What payment methods does Ellines Tech accept?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We accept M-Pesa, card payments via Paystack, and bank transfer. Fixed-price packages can be paid directly online.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Ellines Tech offer support after project delivery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — we stay available 24/7 for demos, fixes, and follow-up work. Support is part of how we ship, not an afterthought.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is Ellines Tech located?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ellines Tech is based in Nyeri, Kenya (head office) with a Nairobi presence for client meetings. We serve clients across Kenya and Africa remotely.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does a website cost at Ellines Tech?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Starter business websites begin from KES 15,000. E-commerce, web apps, and custom platforms are priced based on scope. Get a free quote at tech.ellines.co.ke/request.',
          },
        },
      ],
    },
  },
  {
    path: '/solutions',
    title: 'IT Solutions for Kenyan Businesses | Ellines Tech',
    description:
      'End-to-end technology solutions for startups, SMEs, healthcare, education, and enterprises in Kenya. Software, AI, cloud, and digital transformation from Ellines Tech.',
    keywords:
      'IT solutions Kenya, technology solutions Kenya, startup IT solutions Kenya, SME software Kenya, digital transformation solutions Kenya, business technology Kenya',
    h1: 'Technology Solutions for Kenyan Businesses',
    body: 'Ellines Tech delivers end-to-end technology solutions for Kenyan businesses across every growth stage: startup IT packages, SME software systems, healthcare platforms, school management, SACCO systems, AI automation, and full digital transformation. From Nyeri and Nairobi, serving all of Kenya and Africa.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Solutions', path: '/solutions' },
    ],
    jsonLd: null,
  },
]

/**
 * Build the full HTML for a prerendered page.
 * We inject:
 *  1. Correct <title>, <meta description>, <meta keywords>, <link canonical>
 *  2. A <noscript> block with real visible text — Googlebot reads this
 *  3. Page-specific JSON-LD
 *  4. OG/Twitter tags updated per-page
 */
function buildHtml(page) {
  let html = shell

  const url = `${BASE_URL}${page.path}`
  const ogImage = `${BASE_URL}/logos/logo-full-bg.png`

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(page.description)}" />`,
  )

  // Replace meta keywords
  html = html.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
    `<meta name="keywords" content="${esc(page.keywords)}" />`,
  )

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
  )

  // Replace OG tags
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,  `$1${esc(page.title)}$2`)
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,  `$1${esc(page.description)}$2`)
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,  `$1${url}$2`)

  // Replace Twitter tags
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,  `$1${esc(page.title)}$2`)
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,  `$1${esc(page.description)}$2`)

  // Build breadcrumb JSON-LD
  let breadcrumbLd = ''
  if (page.breadcrumbs?.length) {
    const ldObj = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: page.breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: `${BASE_URL}${crumb.path}`,
      })),
    }
    breadcrumbLd = `<script type="application/ld+json">${JSON.stringify(ldObj)}</script>\n`
  }

  // Page-specific JSON-LD
  let pageLd = ''
  if (page.jsonLd) {
    const ldObj = { '@context': 'https://schema.org', ...page.jsonLd }
    pageLd = `<script type="application/ld+json">${JSON.stringify(ldObj)}</script>\n`
  }

  // Inject additional LD + noscript visible text before </head>
  const noscript = `<noscript>
  <article>
    <h1>${esc(page.h1)}</h1>
    <p>${esc(page.body)}</p>
    ${page.breadcrumbs ? `<nav aria-label="Breadcrumb"><ol>${page.breadcrumbs.map((b, i) => `<li><a href="${BASE_URL}${b.path}">${esc(b.name)}</a></li>`).join('')}</ol></nav>` : ''}
  </article>
</noscript>\n`

  html = html.replace('</head>', `${breadcrumbLd}${pageLd}${noscript}</head>`)

  return html
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

// Generate all pages
let count = 0
for (const page of pages) {
  const outPath =
    page.path === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, page.path.replace(/^\//, ''), 'index.html')

  writeFile(outPath, buildHtml(page))
  count++
}

console.log(`Prerendered ${count} pages to ${DIST}/`)
