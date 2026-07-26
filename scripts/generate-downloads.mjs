/**
 * Generates print-ready HTML + valid PDF company documents into public/downloads/.
 * No external deps — simple PDF text writer (Helvetica).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'downloads')

const CONTACT = {
  name: 'Ellines Tech',
  group: 'Ellines Group',
  url: 'https://tech.ellines.co.ke',
  email: 'info@tech.ellines.co.ke',
  phones: '+254 728 807 213 · +254 748 255 466',
  address: 'Square2 Street, Skt, Nyeri, Kenya · Nairobi, Kenya',
  founder: 'Elijah Mwangi M',
  motto: 'Your Idea. Our Code.',
}

const docs = [
  {
    slug: 'ellines-tech-company-profile',
    title: 'Company Profile',
    subtitle: 'Ellines Tech · Technology arm of Ellines Group',
    filename: 'ellines-tech-company-profile',
    sections: [
      {
        h: 'Who we are',
        p: [
          'Ellines Tech is a Kenya-based technology company delivering software, AI, cloud, and digital transformation for enterprises, SMEs, and institutions across Africa and beyond.',
          'We are the technology arm of Ellines Group — alongside Ellines Haven (publishing) and Ellines Rattan (furniture) — united under one founder vision: build durable brands that serve real markets.',
          `Founded by ${CONTACT.founder}, Ellines Tech combines product engineering with client delivery: flagship platforms, custom builds, design systems, and ongoing care.`,
        ],
      },
      {
        h: 'What we build',
        p: [
          'Products: MedFlow (hospital & clinic operations), RV22 (AI assistants), AfyaVox (health voice/AI), Juno4, and custom enterprise systems.',
          'Services: web & mobile apps, UI/UX, cloud & DevOps, cybersecurity hardening, branding & visual identity, tax & OS support packages for Kenyan businesses, and merch/print design.',
          'Engagement models: fixed-scope packages (see Pricing Rate Card), milestone projects, product licensing, and post-launch support retainers.',
        ],
      },
      {
        h: 'How we work',
        p: [
          'Discovery → scoped proposal → design & build → QA → launch → care. We map work to your workflows — not generic slide decks.',
          'Clients receive clear deliverables, timelines, and payment stages before build starts. Enterprise modules are quoted after discovery.',
          `Contact: ${CONTACT.email} · ${CONTACT.phones} · ${CONTACT.url}`,
        ],
      },
      {
        h: 'Ellines Group',
        p: [
          'Ellines Tech (technology) · Ellines Haven (books & novels) · Ellines Rattan (furniture commerce).',
          `${CONTACT.motto}`,
        ],
      },
    ],
  },
  {
    slug: 'ellines-tech-pricing-rate-card',
    title: 'Pricing & Rate Card',
    subtitle: 'Published starter packages · Custom quotes for enterprise',
    filename: 'ellines-tech-pricing-rate-card',
    sections: [
      {
        h: 'How pricing works',
        p: [
          'Most delivery is project-based (fixed or milestone). Starter packages below are published starting points on tech.ellines.co.ke/pricing — the live catalogue may update.',
          'Enterprise products (hospital systems, AI assistants, multi-branch platforms) are quoted after discovery because modules and integrations vary.',
          'Currency: Kenyan Shillings (KES) unless otherwise agreed. Taxes may apply per Kenyan law.',
        ],
      },
      {
        h: 'Web & software',
        p: [
          'Landing Page Website — from KES 15,000 · Business Website Starter — KES 25,000 · Business Website Pro — KES 55,000 · E-commerce Storefront — KES 95,000',
          'Mobile App MVP — KES 180,000 · Custom Software Starter — from KES 95,000 · AI Automation Starter — from KES 65,000',
        ],
      },
      {
        h: 'Design, brand & marketing',
        p: [
          'Logo Identity Pack — from KES 8,000 · Brand Identity Kit — from KES 22,000 · UI/UX Design — from KES 45,000',
          'Web Design (design-only) — from KES 12,000 · Product Design — from KES 35,000',
          'Digital Marketing Starter — from KES 25,000 · Marketing Strategy Session — from KES 15,000',
          'Campaign posters, flyers, stationery, and merch — see live /pricing for current tiers.',
        ],
      },
      {
        h: 'Consulting & security',
        p: [
          'IT Consulting (half day) — KES 25,000 · Full day — KES 45,000 · Technology Roadmap — KES 120,000 · Digital Transformation — KES 180,000',
          'Cloud Readiness Review — from KES 35,000 · Cloud Migration Plan — KES 75,000 · Infrastructure Programme — KES 150,000',
          'Cyber Security Review — from KES 35,000',
        ],
      },
      {
        h: 'Career, tax & tech support',
        p: [
          'Resume / CV packages from KES 1,000 (student) to KES 12,000 (executive); cover letter from KES 300; LinkedIn from KES 2,200; Career Docs Bundle from KES 3,500.',
          'Kenya Tax Return Filing — KES 200; KRA PIN / iTax Assist — KES 500; SME Tax Filing Assist — KES 3,500.',
          'OS Installation from KES 2,500; App Testing from KES 15,000 — full tiers on /pricing.',
          'MedFlow / RV22 / custom enterprise: request a written estimate via /request.',
        ],
      },
      {
        h: 'Next step',
        p: [
          `Browse live packages: ${CONTACT.url}/pricing`,
          `Request a package or quote: ${CONTACT.url}/request`,
          `WhatsApp / phone: ${CONTACT.phones}`,
        ],
      },
    ],
  },
  {
    slug: 'ellines-tech-capabilities',
    title: 'Capabilities One-Pager',
    subtitle: 'What Ellines Tech delivers',
    filename: 'ellines-tech-capabilities',
    sections: [
      {
        h: 'Core capabilities',
        p: [
          'Software engineering — web, mobile, APIs, integrations, and cloud-hosted systems.',
          'AI & automation — domain assistants, chat, WhatsApp-ready flows, knowledge-backed bots (RV22, AfyaVox).',
          'Healthcare tech — MedFlow modules for registration, billing, pharmacy, lab, outpatient, and reporting.',
          'Design — product UI, brand identity, campaign graphics, and print-ready assets.',
          'Digital ops — hosting handoff, security baselines, SEO foundations, and care plans.',
        ],
      },
      {
        h: 'Industries',
        p: [
          'Healthcare & clinics · SMEs & retail · Professional services · Publishing & creative · Public-facing brands needing reliable digital presence.',
        ],
      },
      {
        h: 'Why teams choose us',
        p: [
          'African-market context with global engineering standards.',
          'Product + agency hybrid: ship packages quickly or scale into enterprise platforms.',
          'Clear commercial process: packages, invoices, and client account tracking online.',
        ],
      },
      {
        h: 'Contact',
        p: [
          `${CONTACT.name} · ${CONTACT.address}`,
          `${CONTACT.email} · ${CONTACT.phones}`,
          CONTACT.url,
        ],
      },
    ],
  },
  {
    slug: 'ellines-tech-service-catalogue',
    title: 'Service Catalogue Summary',
    subtitle: 'Services overview for stakeholders & tenders',
    filename: 'ellines-tech-service-catalogue',
    sections: [
      {
        h: 'Software & platforms',
        p: [
          'Custom web applications, portals, and dashboards.',
          'Mobile apps and progressive web apps.',
          'API design, third-party integrations, and data migration.',
          'Product implementation: MedFlow, RV22, AfyaVox, and bespoke builds.',
        ],
      },
      {
        h: 'Cloud, security & care',
        p: [
          'Cloud architecture, deployment, and monitoring handoff.',
          'Security hardening for websites and apps (MFA guidance, least privilege, backup discipline).',
          'Post-launch support retainers: bug fixes, dependency updates, content help.',
        ],
      },
      {
        h: 'Design & marketing production',
        p: [
          'Brand identity, logo systems, web design, product design, and rebrand kits.',
          'Campaign posters, flyers, stationery, and merchandise artwork.',
          'UI/UX for products and marketing sites · Marketing strategy and digital campaign packages.',
        ],
      },
      {
        h: 'Business enablement (Kenya)',
        p: [
          'Published packages for OS installation, app testing, and selected tax-assist services — see Pricing Rate Card.',
          'Not a substitute for licensed accounting advice; scoped packages as listed online.',
        ],
      },
      {
        h: 'Engagement',
        p: [
          'Start at /pricing or /request. For tenders, attach this catalogue with the Company Profile PDF.',
          `Email ${CONTACT.email} with sector, deadline, and scope notes.`,
        ],
      },
    ],
  },
]

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderHtml(doc) {
  const sections = doc.sections
    .map(
      (s) => `
    <section>
      <h2>${escapeHtml(s.h)}</h2>
      ${s.p.map((para) => `<p>${escapeHtml(para)}</p>`).join('\n')}
    </section>`,
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(doc.title)} · ${escapeHtml(CONTACT.name)}</title>
  <style>
    :root { --ink:#0b1220; --muted:#475569; --brand:#0891b2; --line:#e2e8f0; --bg:#f8fafc; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color:var(--ink); background:var(--bg); line-height:1.55; }
    .sheet { max-width:820px; margin:0 auto; background:#fff; min-height:100vh; padding:48px 52px 64px; border-left:6px solid var(--brand); }
    header { border-bottom:1px solid var(--line); padding-bottom:24px; margin-bottom:28px; }
    .brand { font-size:13px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--brand); }
    h1 { margin:10px 0 6px; font-size:28px; letter-spacing:-.02em; }
    .sub { color:var(--muted); font-size:15px; margin:0; }
    h2 { margin:28px 0 10px; font-size:15px; text-transform:uppercase; letter-spacing:.08em; color:var(--brand); }
    p { margin:0 0 10px; color:#1e293b; font-size:14.5px; }
    footer { margin-top:40px; padding-top:18px; border-top:1px solid var(--line); font-size:12px; color:var(--muted); }
    @media print {
      body { background:#fff; }
      .sheet { border:none; padding:24px 28px; max-width:none; }
      .no-print { display:none !important; }
    }
    .actions { margin-top:18px; }
    .actions a { display:inline-block; margin-right:10px; padding:8px 14px; background:var(--brand); color:#fff; text-decoration:none; border-radius:8px; font-size:13px; font-weight:600; }
  </style>
</head>
<body>
  <article class="sheet">
    <header>
      <div class="brand">${escapeHtml(CONTACT.name)}</div>
      <h1>${escapeHtml(doc.title)}</h1>
      <p class="sub">${escapeHtml(doc.subtitle)}</p>
      <div class="actions no-print">
        <a href="./${doc.filename}.pdf">Download PDF</a>
        <a href="javascript:window.print()" style="background:#0f172a">Print / Save as PDF</a>
      </div>
    </header>
    ${sections}
    <footer>
      ${escapeHtml(CONTACT.name)} · Part of ${escapeHtml(CONTACT.group)} · ${escapeHtml(CONTACT.address)}<br/>
      ${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)} · ${escapeHtml(CONTACT.url)}<br/>
      Document generated for client distribution · ${new Date().toISOString().slice(0, 10)}
    </footer>
  </article>
</body>
</html>
`
}

/** Minimal multi-page PDF writer (Helvetica, ASCII-safe text). */
function pdfEscape(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function wrapLine(text, max = 88) {
  const words = String(text).split(/\s+/)
  const lines = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length > max) {
      if (cur) lines.push(cur)
      cur = w
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : ['']
}

function buildPdf(doc) {
  const pageWidth = 612
  const pageHeight = 792
  const margin = 54
  const contentWidth = pageWidth - margin * 2
  const maxChars = 86

  const flow = []
  flow.push({ type: 'brand', text: CONTACT.name.toUpperCase() })
  flow.push({ type: 'title', text: doc.title })
  flow.push({ type: 'sub', text: doc.subtitle })
  flow.push({ type: 'gap', h: 12 })
  for (const s of doc.sections) {
    flow.push({ type: 'h', text: s.h.toUpperCase() })
    for (const para of s.p) {
      for (const line of wrapLine(para, maxChars)) {
        flow.push({ type: 'p', text: line })
      }
      flow.push({ type: 'gap', h: 6 })
    }
    flow.push({ type: 'gap', h: 8 })
  }
  flow.push({ type: 'footer', text: `${CONTACT.email} · ${CONTACT.url}` })

  const lineHeights = { brand: 14, title: 22, sub: 14, h: 16, p: 13, gap: 0, footer: 12 }
  const pages = []
  let y = pageHeight - margin
  let pageItems = []

  function newPage() {
    if (pageItems.length) pages.push(pageItems)
    pageItems = []
    y = pageHeight - margin
  }

  newPage()
  for (const item of flow) {
    if (item.type === 'gap') {
      y -= item.h
      continue
    }
    const h = lineHeights[item.type] || 13
    if (y - h < margin + 40) newPage()
    pageItems.push({ ...item, y })
    y -= h + (item.type === 'title' ? 4 : item.type === 'h' ? 4 : 2)
  }
  if (pageItems.length) pages.push(pageItems)

  const objects = []
  const add = (str) => {
    objects.push(str)
    return objects.length
  }

  const fontId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  const fontBoldId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

  const pageIds = []
  const contentIds = []

  for (const items of pages) {
    const ops = ['BT']
    for (const it of items) {
      let size = 11
      let font = `/F1`
      if (it.type === 'brand') {
        size = 9
        font = '/F2'
      } else if (it.type === 'title') {
        size = 18
        font = '/F2'
      } else if (it.type === 'sub') {
        size = 10
        font = '/F1'
      } else if (it.type === 'h') {
        size = 11
        font = '/F2'
      } else if (it.type === 'footer') {
        size = 9
        font = '/F1'
      }
      const x = margin
      ops.push(`${font} ${size} Tf`)
      ops.push(`1 0 0 1 ${x} ${it.y.toFixed(1)} Tm`)
      ops.push(`(${pdfEscape(it.text)}) Tj`)
    }
    ops.push('ET')
    const stream = ops.join('\n')
    const contentId = add(`<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`)
    contentIds.push(contentId)
  }

  const kids = []
  for (let i = 0; i < pages.length; i++) {
    const pageId = add(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`,
    )
    pageIds.push(pageId)
    kids.push(`${pageId} 0 R`)
  }

  const pagesObjId = add(`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`)
  // Patch Parent refs — rewrite page objects with correct Pages id
  for (let i = 0; i < pageIds.length; i++) {
    const idx = pageIds[i] - 1
    objects[idx] =
      `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`
  }

  const catalogId = add(`<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`)

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'))
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
  }
  const xrefPos = Buffer.byteLength(pdf, 'utf8')
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`
  return Buffer.from(pdf, 'utf8')
}

fs.mkdirSync(outDir, { recursive: true })

const index = []
for (const doc of docs) {
  const html = renderHtml(doc)
  const pdf = buildPdf(doc)
  const htmlPath = path.join(outDir, `${doc.filename}.html`)
  const pdfPath = path.join(outDir, `${doc.filename}.pdf`)
  fs.writeFileSync(htmlPath, html, 'utf8')
  fs.writeFileSync(pdfPath, pdf)
  index.push({
    id: `dl_${doc.slug.replace(/-/g, '_')}`,
    title: doc.title,
    description: doc.subtitle,
    fileUrl: `/downloads/${doc.filename}.pdf`,
    htmlUrl: `/downloads/${doc.filename}.html`,
    category: 'company',
    status: 'published',
  })
  console.log('Wrote', doc.filename, `(${pdf.length} bytes PDF)`)
}

fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2), 'utf8')
console.log('Done —', index.length, 'documents')
