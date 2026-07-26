/**
 * Generates rich company materials (HTML + PDF) into public/downloads/.
 *
 * HTML is designed for on-site “View”; PDFs are printed via Chrome/Edge headless
 * so covers, imagery, and layout survive in the downloadable files.
 *
 * NO TEXT-ONLY FALLBACK. If Chrome/Edge is missing or the PDF fails quality
 * gates (size / Skia producer / embedded images), generation exits fatally
 * instead of writing notepad-style Helvetica dumps.
 *
 * Usage: npm run generate:downloads
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')
const outDir = path.join(publicDir, 'downloads')
const stamp = new Date().toISOString().slice(0, 10)

const CONTACT = {
  name: 'Ellines Tech',
  group: 'Ellines Group',
  motto: 'Your Idea. Our Code.',
  tagline: 'IT, Web Design & Consulting in Kenya',
  url: 'https://tech.ellines.co.ke',
  email: 'info@tech.ellines.co.ke',
  emails: 'info@tech.ellines.co.ke · info@ellines.co.ke',
  phones: '+254 728 807 213 · +254 748 255 466',
  whatsapp: '+254 748 255 466',
  nyeri: 'Square2 Street, Skt, Nyeri, Kenya — Head office',
  nairobi: 'Nairobi, Kenya — Client meetings & on-site by appointment',
  cities: 'Nyeri & Nairobi, Kenya',
  founder: 'Elijah Mwangi M',
  founderRole: 'Founder, Ellines Group',
}

const ASSETS = {
  logo: '/logos/logo-full.png',
  mark: '/logos/logo-mark.png',
  square: '/logos/logo-square.png',
  hero: '/media/scenes/hero-tech.png',
  workspace: '/media/scenes/workspace.png',
  web: '/media/scenes/web.png',
  ai: '/media/scenes/ai.png',
  strategy: '/media/scenes/strategy.png',
  growth: '/media/scenes/growth.png',
  solutions: '/media/scenes/solutions.png',
  about: '/media/scenes/about.png',
  founder: '/founder/elijah-3.jpg',
  rv22: '/project-logos/rv22-ai.png',
  afyavox: '/project-logos/afyavox.png',
  juno4: '/project-logos/juno4.png',
  lmar: '/project-logos/lmar.png',
  brandWork: '/project-logos/brand-work-collection.png',
  group: '/business-logos/ellines-group.png',
  haven: '/business-logos/ellines-haven.png',
  rattan: '/business-logos/ellines-rattan.png',
  posterWeb: '/media/posters/packages/shop_business_web.jpg',
  posterAi: '/media/scenes/ai.png',
  posterConsult: '/media/posters/packages/consult_digital_transform.jpg',
  posterBrand: '/media/posters/packages/brand_identity_session.jpg',
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)
  return candidates.find((p) => fs.existsSync(p)) || null
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function asset(src, mode) {
  if (mode === 'print') {
    const abs = path.join(publicDir, src.replace(/^\//, ''))
    if (!fs.existsSync(abs)) {
      console.warn('Missing asset:', src)
      return ''
    }
    return pathToFileURL(abs).href
  }
  return src
}

function sharedCss() {
  return `
    @page { size: A4; margin: 0; }
    :root {
      --ink: #0b1220;
      --muted: #475569;
      --soft: #64748b;
      --line: #e2e8f0;
      --bg: #f1f5f9;
      --paper: #ffffff;
      --brand: #0891b2;
      --brand-bright: #06b6d4;
      --deep: #0f172a;
      --accent: #0e7490;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    img { max-width: 100%; display: block; }
    a { color: var(--brand); }
    .doc { max-width: 820px; margin: 0 auto; }
    .page {
      width: 210mm;
      min-height: 297mm;
      background: var(--paper);
      margin: 0 auto 24px;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .page:last-child { page-break-after: auto; break-after: auto; margin-bottom: 0; }
    .pad { padding: 18mm 16mm 20mm; }
    .pad-tight { padding: 14mm 14mm 16mm; }
    .cover {
      background:
        linear-gradient(145deg, rgba(8,145,178,.92) 0%, rgba(15,23,42,.88) 55%, rgba(15,23,42,.95) 100%),
        var(--cover-img, none) center/cover no-repeat;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .cover .inner { padding: 18mm 16mm 20mm; }
    .eyebrow {
      font-size: 11px; font-weight: 700; letter-spacing: .18em;
      text-transform: uppercase; color: var(--brand); margin: 0 0 8px;
    }
    .cover .eyebrow { color: #a5f3fc; }
    h1 {
      margin: 0 0 10px; font-size: 34px; line-height: 1.12;
      letter-spacing: -0.03em; font-weight: 750;
    }
    .cover h1 { font-size: 40px; max-width: 14ch; }
    .lede { margin: 0; font-size: 15px; color: var(--muted); max-width: 52ch; }
    .cover .lede { color: rgba(255,255,255,.88); font-size: 16px; max-width: 40ch; }
    .motto {
      margin-top: 22px; font-size: 13px; font-weight: 600;
      letter-spacing: .06em; text-transform: uppercase; color: #67e8f9;
    }
    .brand-row { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
    .brand-row img { height: 42px; width: auto; }
    .cover .brand-row img { height: 48px; filter: brightness(0) invert(1); }
    .meta-strip {
      display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 28px;
      font-size: 12px; color: rgba(255,255,255,.8);
    }
    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: 999px;
      border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.08);
    }
    h2 {
      margin: 0 0 10px; font-size: 20px; letter-spacing: -0.02em;
      color: var(--deep);
    }
    h3 {
      margin: 0 0 6px; font-size: 14px; font-weight: 700; color: var(--deep);
    }
    p { margin: 0 0 10px; font-size: 13.5px; color: #1e293b; }
    .muted { color: var(--muted); }
    .section { margin-bottom: 18px; }
    .rule {
      height: 3px; width: 48px; background: linear-gradient(90deg, var(--brand), var(--brand-bright));
      border: 0; margin: 0 0 14px;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }
    .card {
      border: 1px solid var(--line); border-radius: 14px; padding: 14px;
      background: linear-gradient(180deg, #fff, #f8fafc);
    }
    .card.accent {
      border-color: rgba(8,145,178,.25);
      background: linear-gradient(180deg, #ecfeff, #f8fafc);
    }
    .card p:last-child, .card ul:last-child { margin-bottom: 0; }
    .media {
      border-radius: 14px; overflow: hidden; border: 1px solid var(--line);
      background: #0f172a; min-height: 140px;
    }
    .media img { width: 100%; height: 160px; object-fit: cover; }
    .media.tall img { height: 220px; }
    .media.contain {
      background: #fff; display: flex; align-items: center; justify-content: center; padding: 16px;
    }
    .media.contain img { height: 88px; width: auto; max-width: 100%; object-fit: contain; }
    .product-card .media.contain img { height: 72px; }
    ul.clean { margin: 0; padding: 0; list-style: none; }
    ul.clean li {
      position: relative; padding-left: 16px; margin-bottom: 6px;
      font-size: 13px; color: #334155;
    }
    ul.clean li::before {
      content: ""; position: absolute; left: 0; top: 7px;
      width: 7px; height: 7px; border-radius: 50%; background: var(--brand);
    }
    table.rates {
      width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px;
    }
    table.rates th, table.rates td {
      border-bottom: 1px solid var(--line); padding: 8px 6px; text-align: left; vertical-align: top;
    }
    table.rates th {
      font-size: 11px; text-transform: uppercase; letter-spacing: .06em;
      color: var(--soft); font-weight: 700;
    }
    table.rates td.price { font-weight: 700; color: var(--deep); white-space: nowrap; }
    .banner {
      display: grid; grid-template-columns: 1.1fr .9fr; gap: 16px; align-items: center;
      margin: 8px 0 18px;
    }
    .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0 18px; }
    .stat {
      border-radius: 12px; padding: 12px; background: var(--deep); color: #fff;
    }
    .stat strong { display: block; font-size: 16px; letter-spacing: -0.02em; }
    .stat span { font-size: 11px; color: #94a3b8; }
    .footer-bar {
      position: absolute; left: 0; right: 0; bottom: 0;
      padding: 10px 16mm; font-size: 10px; color: var(--soft);
      border-top: 1px solid var(--line); background: #fff;
      display: flex; justify-content: space-between; gap: 12px;
    }
    .cta-box {
      margin-top: 16px; padding: 16px; border-radius: 16px;
      background: linear-gradient(120deg, #0f172a, #164e63);
      color: #fff;
    }
    .cta-box h3 { color: #fff; font-size: 16px; }
    .cta-box p { color: rgba(255,255,255,.85); margin-bottom: 8px; }
    .cta-box .links { font-size: 12.5px; color: #a5f3fc; }
    .step {
      display: grid; grid-template-columns: 36px 1fr; gap: 10px; margin-bottom: 12px;
    }
    .step .n {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--brand); color: #fff; font-weight: 750;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
    }
    .actions.no-print { margin: 16px 0 0; }
    .actions.no-print a {
      display: inline-block; margin-right: 8px; padding: 8px 14px;
      background: var(--brand); color: #fff; text-decoration: none;
      border-radius: 8px; font-size: 12px; font-weight: 650;
    }
    .actions.no-print a.secondary { background: var(--deep); }
    .flyer-hero {
      min-height: 297mm;
      display: grid; grid-template-rows: 1.15fr 1fr;
    }
    .flyer-top {
      background:
        linear-gradient(160deg, rgba(8,145,178,.9), rgba(15,23,42,.92)),
        var(--cover-img) center/cover no-repeat;
      color: #fff; padding: 18mm 16mm;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .flyer-bottom { padding: 14mm 16mm 18mm; }
    .kicker { font-size: 12px; font-weight: 700; color: #67e8f9; letter-spacing: .12em; text-transform: uppercase; }
    @media print {
      body { background: #fff; }
      .doc { max-width: none; }
      .page { margin: 0; width: auto; min-height: 100vh; box-shadow: none; }
      .no-print { display: none !important; }
    }
    @media screen {
      body { padding: 24px 12px 48px; }
      .page { box-shadow: 0 18px 50px rgba(15,23,42,.12); border-radius: 4px; }
    }
  `
}

function pageFooter(docTitle, pageLabel) {
  return `<div class="footer-bar">
    <span>${escapeHtml(CONTACT.name)} · ${escapeHtml(docTitle)}</span>
    <span>${escapeHtml(CONTACT.url)} · ${escapeHtml(pageLabel)}</span>
  </div>`
}

function shell(doc, bodyHtml, mode) {
  const pdfName = `${doc.filename}.pdf`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(doc.title)} · ${escapeHtml(CONTACT.name)}</title>
  <style>${sharedCss()}</style>
</head>
<body>
  <div class="doc">
    <div class="actions no-print" style="max-width:210mm;margin:0 auto 14px">
      <a href="./${pdfName}">Download PDF</a>
      <a class="secondary" href="javascript:window.print()">Print / Save as PDF</a>
    </div>
    ${bodyHtml}
  </div>
</body>
</html>`
}

/* ───────────────────────── Document bodies ───────────────────────── */

function companyProfileBody(a) {
  return `
  <section class="page cover" style="--cover-img:url('${a(ASSETS.hero)}')">
    <div class="inner">
      <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
      <p class="eyebrow">Company profile · ${stamp}</p>
      <h1>Technology that ships for African businesses</h1>
      <p class="lede">Ellines Tech builds software, AI, cloud, design, and digital operations from Nyeri and Nairobi — the technology arm of Ellines Group.</p>
      <p class="motto">${escapeHtml(CONTACT.motto)}</p>
      <div class="meta-strip">
        <span class="chip">Nyeri head office</span>
        <span class="chip">Nairobi presence</span>
        <span class="chip">Products + services</span>
        <span class="chip">Enterprise & SME</span>
      </div>
    </div>
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">Who we are</p>
      <h2>Product engineering with client delivery</h2>
      <div class="rule"></div>
      <div class="banner">
        <div>
          <p>Ellines Tech is a Kenya-based technology company delivering software development, AI, web & mobile, cloud, cybersecurity hardening, branding, and digital transformation for enterprises, SMEs, clinics, and institutions across Africa and beyond.</p>
          <p>Founded by <strong>${escapeHtml(CONTACT.founder)}</strong> (${escapeHtml(CONTACT.founderRole)}), we combine flagship platforms with scoped client work — clear deliverables, timelines, and payment stages before build starts.</p>
          <ul class="clean">
            <li>Head office: ${escapeHtml(CONTACT.nyeri)}</li>
            <li>Nairobi: ${escapeHtml(CONTACT.nairobi)}</li>
            <li>Always open for demos, support, and project inquiries</li>
          </ul>
        </div>
        <div class="media tall"><img src="${a(ASSETS.founder)}" alt="Founder" /></div>
      </div>
      <div class="stat-row">
        <div class="stat"><strong>Nyeri</strong><span>Build HQ</span></div>
        <div class="stat"><strong>Nairobi</strong><span>Client presence</span></div>
        <div class="stat"><strong>Products</strong><span>MedFlow · RV22 · more</span></div>
        <div class="stat"><strong>Group</strong><span>Tech · Haven · Rattan</span></div>
      </div>
      <div class="grid-2">
        <div class="card accent">
          <h3>How we engage</h3>
          <p class="muted">Discovery → scoped proposal → design & build → QA → launch → care. We map work to your workflows — not generic slide decks.</p>
        </div>
        <div class="card">
          <h3>Commercial clarity</h3>
          <p class="muted">Published starter packages on /pricing, milestone projects, product licensing, and post-launch retainers. Enterprise modules quoted after discovery.</p>
        </div>
      </div>
    </div>
    ${pageFooter('Company Profile', '02')}
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">Products</p>
      <h2>Platforms we build and operate</h2>
      <div class="rule"></div>
      <div class="grid-2">
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.rv22)}" alt="RV22" /></div>
          <h3 style="margin-top:10px">RV22 AI Assistant</h3>
          <p>Enterprise AI for support, workflows, and knowledge retrieval — natural language chat, custom knowledge bases, API integrations, multi-channel deployment.</p>
        </div>
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.afyavox)}" alt="AfyaVox" /></div>
          <h3 style="margin-top:10px">AfyaVox AI</h3>
          <p>Clinical AI assistant for voice-powered documentation, decision support, triage assistance, and multi-language patient communication.</p>
        </div>
        <div class="card">
          <h3>MedFlow</h3>
          <p>Hospital & clinic operations — registration, EMR, billing & insurance, pharmacy, lab & radiology, multi-branch reporting.</p>
          <ul class="clean">
            <li>Built for African healthcare workflows</li>
            <li>Modular rollout by department</li>
          </ul>
        </div>
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.juno4)}" alt="Juno4" /></div>
          <h3 style="margin-top:10px">Juno4 · Lmar · custom</h3>
          <p>Juno4 AI platform, Lmar brand systems, ERPs, e-commerce, booking apps, and bespoke enterprise software — React, Flutter, Python, cloud-hosted.</p>
        </div>
      </div>
      <div class="media" style="margin-top:14px"><img src="${a(ASSETS.brandWork)}" alt="Brand work" style="height:150px;object-fit:cover;width:100%" /></div>
    </div>
    ${pageFooter('Company Profile', '03')}
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">Services & group</p>
      <h2>Full-stack digital capability</h2>
      <div class="rule"></div>
      <div class="grid-3" style="margin-bottom:16px">
        <div class="card"><h3>Software & platforms</h3><p>Web apps, portals, mobile/PWA, APIs, integrations, data migration.</p></div>
        <div class="card"><h3>AI & automation</h3><p>Assistants, chatbots, WhatsApp-ready flows, OCR, predictive analytics.</p></div>
        <div class="card"><h3>Design & brand</h3><p>Logo systems, UI/UX, product design, campaign print, merch artwork.</p></div>
        <div class="card"><h3>Cloud & security</h3><p>Architecture, deployment, hardening, MFA guidance, backup discipline.</p></div>
        <div class="card"><h3>Consulting</h3><p>IT advisory, roadmaps, digital transformation, cloud readiness.</p></div>
        <div class="card"><h3>Kenya enablement</h3><p>Career docs, selected tax-assist packages, OS setup, app testing.</p></div>
      </div>
      <h2>Ellines Group</h2>
      <div class="rule"></div>
      <p class="muted">One founder vision across technology, publishing, and commerce.</p>
      <div class="grid-3">
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.square)}" alt="Ellines Tech" /></div>
          <h3 style="margin-top:8px">Ellines Tech</h3>
          <p>Software, AI, cloud, digital transformation · tech.ellines.co.ke</p>
        </div>
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.haven)}" alt="Ellines Haven" /></div>
          <h3 style="margin-top:8px">Ellines Haven</h3>
          <p>Books & novels platform · haven.ellines.co.ke</p>
        </div>
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.rattan)}" alt="Ellines Rattan" /></div>
          <h3 style="margin-top:8px">Ellines Rattan</h3>
          <p>Rattan furniture commerce · rattan.ellines.co.ke</p>
        </div>
      </div>
      <div class="cta-box">
        <h3>Start a conversation</h3>
        <p>Browse packages, request a quote, or book a demo for MedFlow / RV22.</p>
        <p class="links">${escapeHtml(CONTACT.url)}/pricing · ${escapeHtml(CONTACT.url)}/request<br/>
        ${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)}</p>
      </div>
    </div>
    ${pageFooter('Company Profile', '04')}
  </section>`
}

function pricingBody(a) {
  const rows = (items) =>
    items
      .map(
        ([name, price, note]) =>
          `<tr><td><strong>${escapeHtml(name)}</strong><br/><span class="muted">${escapeHtml(note)}</span></td><td class="price">${escapeHtml(price)}</td></tr>`,
      )
      .join('')

  return `
  <section class="page cover" style="--cover-img:url('${a(ASSETS.posterConsult)}')">
    <div class="inner">
      <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
      <p class="eyebrow">Pricing & rate card · ${stamp}</p>
      <h1>Published starter packages</h1>
      <p class="lede">Fixed starting points for websites, software, design, consulting, and Kenya enablement. Enterprise products are quoted after discovery. Currency: KES.</p>
      <div class="meta-strip">
        <span class="chip">Live catalogue: /pricing</span>
        <span class="chip">Request: /request</span>
        <span class="chip">${escapeHtml(CONTACT.cities)}</span>
      </div>
    </div>
  </section>

  <section class="page">
    <div class="pad-tight">
      <p class="eyebrow">How pricing works</p>
      <h2>Project-based clarity</h2>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:14px">
        <div class="card accent">
          <h3>Starter packages</h3>
          <p>Published “from” prices on tech.ellines.co.ke/pricing. Scope, revisions, and timelines confirmed in writing before work starts.</p>
        </div>
        <div class="card">
          <h3>Enterprise & products</h3>
          <p>MedFlow, RV22, multi-branch platforms, and complex integrations are estimated after discovery — modules vary by workflow.</p>
        </div>
      </div>
      <div class="grid-2">
        <div>
          <h3>Web & software</h3>
          <table class="rates">
            <thead><tr><th>Package</th><th>From</th></tr></thead>
            <tbody>
              ${rows([
                ['Landing Page Website', 'KES 15,000', 'Single-page launch'],
                ['Business Website Starter', 'KES 25,000', 'Small business presence'],
                ['Business Website Pro', 'KES 55,000', 'CMS-ready · SEO basics'],
                ['E-commerce Storefront', 'KES 95,000', 'Carts · payments readiness'],
                ['Mobile App MVP', 'KES 180,000', 'Scoped first release'],
                ['Custom Software Starter', 'KES 95,000', 'Workflow software'],
                ['AI Automation Starter', 'KES 65,000', 'Assistant / automation'],
              ])}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Design, brand & marketing</h3>
          <table class="rates">
            <thead><tr><th>Package</th><th>From</th></tr></thead>
            <tbody>
              ${rows([
                ['Logo Identity Pack', 'KES 8,000', 'Concepts + files'],
                ['Brand Identity Kit', 'KES 22,000', 'System + guidance'],
                ['UI/UX Design', 'KES 45,000', 'Product / marketing UI'],
                ['Web Design (design-only)', 'KES 12,000', 'Visual system'],
                ['Product Design', 'KES 35,000', 'Flows + screens'],
                ['Digital Marketing Starter', 'KES 25,000', 'Campaign kickoff'],
                ['Marketing Strategy Session', 'KES 15,000', 'Focused advisory'],
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ${pageFooter('Pricing & Rate Card', '02')}
  </section>

  <section class="page">
    <div class="pad-tight">
      <div class="grid-2">
        <div>
          <h3>Consulting, cloud & security</h3>
          <table class="rates">
            <thead><tr><th>Package</th><th>From</th></tr></thead>
            <tbody>
              ${rows([
                ['IT Consulting (half day)', 'KES 25,000', 'Focused session'],
                ['IT Consulting (full day)', 'KES 45,000', 'Deep-dive day'],
                ['Technology Roadmap', 'KES 120,000', 'Prioritised plan'],
                ['Digital Transformation', 'KES 180,000', 'Programme framing'],
                ['Cloud Readiness Review', 'KES 35,000', 'Assessment'],
                ['Cloud Migration Plan', 'KES 75,000', 'Migration design'],
                ['Infrastructure Programme', 'KES 150,000', 'Multi-workstream'],
                ['Cyber Security Review', 'KES 35,000', 'Hardening baseline'],
              ])}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Career, tax & tech support</h3>
          <table class="rates">
            <thead><tr><th>Package</th><th>From</th></tr></thead>
            <tbody>
              ${rows([
                ['Resume / CV packages', 'KES 1,000–12,000', 'Student → executive'],
                ['Cover letter', 'KES 300+', 'Role-targeted'],
                ['LinkedIn branding', 'KES 2,200+', 'Profile polish'],
                ['Career Docs Bundle', 'KES 3,500+', 'Resume + letter + more'],
                ['Kenya Tax Return Filing', 'KES 200', 'Assist package'],
                ['KRA PIN / iTax Assist', 'KES 500', 'Guided setup'],
                ['SME Tax Filing Assist', 'KES 3,500', 'Scoped help'],
                ['OS Installation', 'KES 2,500+', 'Workstation setup'],
                ['App Testing', 'KES 15,000+', 'QA packages'],
              ])}
            </tbody>
          </table>
          <p class="muted" style="margin-top:10px;font-size:12px">Tax packages are scoped operational assistance — not a substitute for licensed accounting advice. Full tiers and posters live on /pricing.</p>
        </div>
      </div>
      <div class="banner" style="margin-top:16px">
        <div class="media"><img src="${a(ASSETS.posterWeb)}" alt="Web packages" /></div>
        <div class="media"><img src="${a(ASSETS.posterBrand)}" alt="Brand packages" /></div>
      </div>
      <div class="cta-box">
        <h3>Confirm live prices & request work</h3>
        <p>Catalogue may update — always verify on the website before invoicing.</p>
        <p class="links">${escapeHtml(CONTACT.url)}/pricing · ${escapeHtml(CONTACT.url)}/request<br/>
        WhatsApp / phone: ${escapeHtml(CONTACT.phones)} · ${escapeHtml(CONTACT.email)}</p>
      </div>
    </div>
    ${pageFooter('Pricing & Rate Card', '03')}
  </section>`
}

function capabilitiesBody(a) {
  return `
  <section class="page">
    <div class="pad-tight">
      <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" style="height:36px" /></div>
      <p class="eyebrow">Capabilities one-pager · ${stamp}</p>
      <h1 style="font-size:28px;max-width:20ch">What Ellines Tech delivers</h1>
      <p class="lede">Software, AI, healthcare tech, design, and digital ops — from Nyeri & Nairobi for African teams that need shipped systems, not slideware.</p>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:12px">
        <div class="media" style="min-height:120px"><img src="${a(ASSETS.ai)}" alt="AI" style="height:130px;width:100%;object-fit:cover" /></div>
        <div class="media" style="min-height:120px"><img src="${a(ASSETS.web)}" alt="Web" style="height:130px;width:100%;object-fit:cover" /></div>
      </div>
      <div class="grid-3">
        <div class="card accent"><h3>Software engineering</h3><p>Web, mobile, APIs, integrations, cloud-hosted systems (React, Flutter, Python, PostgreSQL, Docker, Cloudflare).</p></div>
        <div class="card accent"><h3>AI & automation</h3><p>RV22, AfyaVox, chatbots, WhatsApp-ready flows, OCR, knowledge-backed assistants.</p></div>
        <div class="card accent"><h3>Healthcare tech</h3><p>MedFlow modules: registration, billing, pharmacy, lab, outpatient, multi-branch reporting.</p></div>
        <div class="card"><h3>Design systems</h3><p>Product UI, brand identity, campaign graphics, print-ready and merch artwork.</p></div>
        <div class="card"><h3>Digital ops</h3><p>Hosting handoff, security baselines, SEO foundations, care plans & retainers.</p></div>
        <div class="card"><h3>Consulting</h3><p>Roadmaps, cloud readiness, transformation framing, and hands-on IT advisory.</p></div>
      </div>
      <div class="grid-2" style="margin-top:12px">
        <div class="card">
          <h3>Industries</h3>
          <ul class="clean">
            <li>Healthcare & clinics</li>
            <li>SMEs & retail</li>
            <li>Professional services</li>
            <li>Publishing & creative brands</li>
          </ul>
        </div>
        <div class="card">
          <h3>Why teams choose us</h3>
          <ul class="clean">
            <li>African-market context, global engineering standards</li>
            <li>Product + agency hybrid — packages or platforms</li>
            <li>Clear commercials: packages, invoices, client tracking</li>
          </ul>
        </div>
      </div>
      <div class="cta-box" style="margin-top:12px">
        <h3>${escapeHtml(CONTACT.name)} · ${escapeHtml(CONTACT.cities)}</h3>
        <p class="links">${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)} · ${escapeHtml(CONTACT.url)}</p>
      </div>
    </div>
  </section>`
}

function catalogueBody(a) {
  return `
  <section class="page cover" style="--cover-img:url('${a(ASSETS.strategy)}')">
    <div class="inner">
      <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
      <p class="eyebrow">Service catalogue · ${stamp}</p>
      <h1>Services for stakeholders & tenders</h1>
      <p class="lede">Attach this summary with the Company Profile PDF. For current package prices, use the Pricing Rate Card or visit /pricing.</p>
      <div class="meta-strip">
        <span class="chip">Software</span>
        <span class="chip">Cloud & security</span>
        <span class="chip">Design</span>
        <span class="chip">Kenya enablement</span>
      </div>
    </div>
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">Catalogue</p>
      <h2>Delivery areas</h2>
      <div class="rule"></div>
      <div class="grid-2">
        <div class="card">
          <h3>Software & platforms</h3>
          <ul class="clean">
            <li>Custom web applications, portals, and dashboards</li>
            <li>Mobile apps and progressive web apps</li>
            <li>API design, third-party integrations, data migration</li>
            <li>Product implementation: MedFlow, RV22, AfyaVox, bespoke builds</li>
          </ul>
        </div>
        <div class="card">
          <h3>Cloud, security & care</h3>
          <ul class="clean">
            <li>Cloud architecture, deployment, monitoring handoff</li>
            <li>Security hardening (MFA guidance, least privilege, backups)</li>
            <li>Post-launch retainers: fixes, dependency updates, content help</li>
          </ul>
        </div>
        <div class="card">
          <h3>Design & marketing production</h3>
          <ul class="clean">
            <li>Brand identity, logo systems, web & product design</li>
            <li>Campaign posters, flyers, stationery, merchandise artwork</li>
            <li>Marketing strategy and digital campaign packages</li>
          </ul>
        </div>
        <div class="card">
          <h3>Business enablement (Kenya)</h3>
          <ul class="clean">
            <li>OS installation, app testing packages</li>
            <li>Selected tax-assist services (see Rate Card)</li>
            <li>Career document packages for job seekers & executives</li>
          </ul>
        </div>
      </div>
      <div class="media" style="margin:14px 0"><img src="${a(ASSETS.solutions)}" alt="Solutions" style="height:150px;width:100%;object-fit:cover" /></div>
      <div class="cta-box">
        <h3>Engagement for RFPs</h3>
        <p>Email sector, deadline, and scope notes. Start at /pricing or /request for commercial packages.</p>
        <p class="links">${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)} · ${escapeHtml(CONTACT.url)}</p>
      </div>
    </div>
    ${pageFooter('Service Catalogue', '02')}
  </section>`
}

function brochureBody(a) {
  return `
  <section class="page cover" style="--cover-img:url('${a(ASSETS.growth)}')">
    <div class="inner">
      <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
      <p class="eyebrow">Company brochure · ${stamp}</p>
      <h1>Ship the system your market actually needs</h1>
      <p class="lede">A sales-ready overview of Ellines Tech — problem, solution, products, proof of presence, and how to start.</p>
      <p class="motto">${escapeHtml(CONTACT.motto)}</p>
      <div class="meta-strip">
        <span class="chip">B2B technology</span>
        <span class="chip">${escapeHtml(CONTACT.cities)}</span>
        <span class="chip">Ellines Group</span>
      </div>
    </div>
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">The problem</p>
      <h2>Digital work stalls when tools don’t match the workflow</h2>
      <div class="rule"></div>
      <div class="banner">
        <div>
          <p>Teams juggle paper processes, fragmented apps, and agencies that disappear after launch. Healthcare needs reliable clinical ops. SMEs need sites and software that convert. Leaders need AI that plugs into real channels — not demos that die in a deck.</p>
          <p><strong>Ellines Tech exists to close that gap:</strong> scoped delivery, African-market context, and products you can grow into.</p>
          <ul class="clean">
            <li>Unclear scope → written milestones before build</li>
            <li>Generic templates → workflow-mapped systems</li>
            <li>One-off launches → optional care retainers</li>
          </ul>
        </div>
        <div class="media tall"><img src="${a(ASSETS.workspace)}" alt="Workspace" /></div>
      </div>
      <div class="grid-3">
        <div class="card accent"><h3>For clinics & hospitals</h3><p>Registration, billing, pharmacy, lab — MedFlow and AfyaVox.</p></div>
        <div class="card accent"><h3>For growing SMEs</h3><p>Websites, e-commerce, brand, custom software, marketing packs.</p></div>
        <div class="card accent"><h3>For operators</h3><p>RV22 assistants, cloud, security reviews, transformation roadmaps.</p></div>
      </div>
    </div>
    ${pageFooter('Company Brochure', '02')}
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">The solution</p>
      <h2>One team for products, packages, and platforms</h2>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:14px">
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.rv22)}" alt="RV22" /></div>
          <h3 style="margin-top:10px">Flagship AI — RV22</h3>
          <p>Automate support and knowledge work with integrations your team already uses.</p>
        </div>
        <div class="card product-card">
          <div class="media contain"><img src="${a(ASSETS.afyavox)}" alt="AfyaVox" /></div>
          <h3 style="margin-top:10px">Healthcare AI — AfyaVox</h3>
          <p>Voice and clinical assistance designed for real care settings.</p>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <h3>How it works</h3>
          <div class="step"><div class="n">1</div><div><h3>Discover</h3><p class="muted">Goals, constraints, systems, success metrics.</p></div></div>
          <div class="step"><div class="n">2</div><div><h3>Propose</h3><p class="muted">Scope, timeline, price stages — in writing.</p></div></div>
          <div class="step"><div class="n">3</div><div><h3>Build & launch</h3><p class="muted">Design, engineering, QA, go-live.</p></div></div>
          <div class="step"><div class="n">4</div><div><h3>Care</h3><p class="muted">Optional retainer for fixes and evolution.</p></div></div>
        </div>
        <div>
          <div class="media tall"><img src="${a(ASSETS.posterAi)}" alt="AI package" onerror="this.parentNode.style.display='none'" /></div>
          <div class="card" style="margin-top:12px">
            <h3>Stack signals</h3>
            <p class="muted">Python · React · Flutter · TypeScript · PostgreSQL · MySQL · Docker · Cloudflare · Firebase · Supabase · AI/ML · REST APIs</p>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter('Company Brochure', '03')}
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">Presence & proof</p>
      <h2>Built in Kenya. Ready for your market.</h2>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:14px">
        <div class="card">
          <h3>Nyeri — Head office</h3>
          <p>${escapeHtml(CONTACT.nyeri)}</p>
          <p class="muted">Where the team builds day to day — walk-ins, workshops, and delivery.</p>
        </div>
        <div class="card">
          <h3>Nairobi — Presence</h3>
          <p>${escapeHtml(CONTACT.nairobi)}</p>
          <p class="muted">Pitches and on-site sessions across Nairobi by appointment.</p>
        </div>
      </div>
      <div class="media" style="margin-bottom:14px"><img src="${a(ASSETS.about)}" alt="About" style="height:160px;width:100%;object-fit:cover" /></div>
      <h3>Ellines Group</h3>
      <p class="muted">Technology, publishing, and furniture under one vision — durable brands for real markets.</p>
      <div class="grid-3" style="margin-top:10px">
        <div class="card product-card"><div class="media contain"><img src="${a(ASSETS.square)}" alt="Tech" /></div><h3 style="margin-top:8px">Ellines Tech</h3></div>
        <div class="card product-card"><div class="media contain"><img src="${a(ASSETS.haven)}" alt="Haven" /></div><h3 style="margin-top:8px">Ellines Haven</h3></div>
        <div class="card product-card"><div class="media contain"><img src="${a(ASSETS.rattan)}" alt="Rattan" /></div><h3 style="margin-top:8px">Ellines Rattan</h3></div>
      </div>
      <div class="cta-box">
        <h3>Request a demo or package</h3>
        <p>Tell us your sector and timeline — we’ll map the next step.</p>
        <p class="links">${escapeHtml(CONTACT.url)}/request · ${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)}<br/>
        ${escapeHtml(CONTACT.motto)}</p>
      </div>
    </div>
    ${pageFooter('Company Brochure', '04')}
  </section>`
}

function engagementBody(a) {
  return `
  <section class="page cover" style="--cover-img:url('${a(ASSETS.strategy)}')">
    <div class="inner">
      <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
      <p class="eyebrow">Client engagement guide · ${stamp}</p>
      <h1>How we work with you</h1>
      <p class="lede">A practical guide for sponsors and project leads — what happens from first call to care plan.</p>
      <div class="meta-strip">
        <span class="chip">Discovery → Care</span>
        <span class="chip">Written scope</span>
        <span class="chip">${escapeHtml(CONTACT.cities)}</span>
      </div>
    </div>
  </section>

  <section class="page">
    <div class="pad">
      <p class="eyebrow">Process</p>
      <h2>Five stages, no surprises</h2>
      <div class="rule"></div>
      <div class="step"><div class="n">1</div><div><h3>Inquiry & discovery</h3><p>Share goals, users, systems, constraints, and deadline. We may schedule a short call or Nairobi/Nyeri meeting. Outcome: shared understanding of the problem.</p></div></div>
      <div class="step"><div class="n">2</div><div><h3>Proposal & commercial</h3><p>You receive scope, deliverables, timeline, and payment stages. Starter work may map to a published /pricing package; enterprise work is custom-quoted.</p></div></div>
      <div class="step"><div class="n">3</div><div><h3>Design & build</h3><p>UX/visual direction (when in scope), engineering, integrations, and content handoff points. You review milestones — not a black box.</p></div></div>
      <div class="step"><div class="n">4</div><div><h3>QA & launch</h3><p>Testing against agreed acceptance notes, go-live support, and credentials/hosting handoff as specified.</p></div></div>
      <div class="step"><div class="n">5</div><div><h3>Care (optional)</h3><p>Retainer for bug fixes, dependency updates, small enhancements, and content help.</p></div></div>
      <div class="grid-2" style="margin-top:10px">
        <div class="card accent">
          <h3>What we need from you</h3>
          <ul class="clean">
            <li>A decision-maker or clear approver</li>
            <li>Brand assets / content (or a plan to create them)</li>
            <li>Access to systems for integrations</li>
            <li>Timely feedback on milestones</li>
          </ul>
        </div>
        <div class="card">
          <h3>What you can expect from us</h3>
          <ul class="clean">
            <li>Written scope before major build</li>
            <li>Named commercial path (package or estimate)</li>
            <li>Practical demos for product work</li>
            <li>Contact via email, phone, or WhatsApp</li>
          </ul>
        </div>
      </div>
      <div class="cta-box">
        <h3>Ready to begin?</h3>
        <p class="links">${escapeHtml(CONTACT.url)}/request · ${escapeHtml(CONTACT.url)}/pricing<br/>
        ${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)}</p>
      </div>
    </div>
    ${pageFooter('Engagement Guide', '02')}
  </section>`
}

function flyerBody(a) {
  return `
  <section class="page flyer-hero" style="--cover-img:url('${a(ASSETS.hero)}')">
    <div class="flyer-top">
      <div>
        <div class="brand-row"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
        <p class="kicker">Intro flyer · ${stamp}</p>
        <h1 style="font-size:42px;max-width:12ch;margin-top:12px">Your Idea. Our Code.</h1>
        <p class="lede" style="margin-top:12px">Software · AI · Web · Design · Cloud — Ellines Tech in Nyeri & Nairobi.</p>
      </div>
      <div class="meta-strip">
        <span class="chip">tech.ellines.co.ke</span>
        <span class="chip">Part of Ellines Group</span>
      </div>
    </div>
    <div class="flyer-bottom">
      <div class="grid-2">
        <div>
          <h3>What we do</h3>
          <ul class="clean">
            <li>MedFlow · RV22 · AfyaVox · custom platforms</li>
            <li>Websites, apps, brand & campaign design</li>
            <li>Consulting, cloud, security, care plans</li>
          </ul>
          <h3 style="margin-top:14px">Visit or call</h3>
          <p style="font-size:12.5px">${escapeHtml(CONTACT.nyeri)}<br/>${escapeHtml(CONTACT.nairobi)}</p>
          <p style="font-size:12.5px"><strong>${escapeHtml(CONTACT.phones)}</strong><br/>${escapeHtml(CONTACT.email)}</p>
        </div>
        <div>
          <div class="media"><img src="${a(ASSETS.founder)}" alt="Founder" style="height:150px;object-fit:cover" /></div>
          <div class="cta-box" style="margin-top:12px;padding:12px">
            <h3>Next step</h3>
            <p class="links" style="margin:0">${escapeHtml(CONTACT.url)}/request<br/>${escapeHtml(CONTACT.url)}/pricing</p>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

const DOCS = [
  {
    filename: 'ellines-tech-company-profile',
    title: 'Company Profile',
    description:
      'Multi-page overview of Ellines Tech, products, services, locations, and Ellines Group.',
    category: 'company',
    id: 'dl_company_profile',
    body: companyProfileBody,
  },
  {
    filename: 'ellines-tech-pricing-rate-card',
    title: 'Pricing & Rate Card',
    description:
      'Published KES starter packages for web, software, design, consulting, and Kenya enablement.',
    category: 'company',
    id: 'dl_pricing_rate_card',
    body: pricingBody,
  },
  {
    filename: 'ellines-tech-capabilities',
    title: 'Capabilities One-Pager',
    description: 'One-page snapshot of engineering, AI, healthcare, design, and ops capabilities.',
    category: 'company',
    id: 'dl_capabilities',
    body: capabilitiesBody,
  },
  {
    filename: 'ellines-tech-service-catalogue',
    title: 'Service Catalogue Summary',
    description: 'Stakeholder- and tender-ready summary of delivery areas and engagement path.',
    category: 'company',
    id: 'dl_service_catalogue',
    body: catalogueBody,
  },
  {
    filename: 'ellines-tech-company-brochure',
    title: 'Company Brochure',
    description:
      'Sales brochure — problem, solution, products, Kenya presence, Ellines Group, and CTA.',
    category: 'company',
    id: 'dl_company_brochure',
    body: brochureBody,
  },
  {
    filename: 'ellines-tech-engagement-guide',
    title: 'Client Engagement Guide',
    description: 'How discovery, proposal, build, launch, and care work with Ellines Tech.',
    category: 'company',
    id: 'dl_engagement_guide',
    body: engagementBody,
  },
  {
    filename: 'ellines-tech-intro-flyer',
    title: 'Intro Flyer',
    description: 'One-page intro with motto, services snapshot, locations, and contact CTAs.',
    category: 'company',
    id: 'dl_intro_flyer',
    body: flyerBody,
  },
]

function htmlFor(doc, mode) {
  const a = (src) => asset(src, mode)
  // Fix optional poster that may not exist
  const body = doc.body((src) => {
    if (mode === 'print') {
      const abs = path.join(publicDir, src.replace(/^\//, ''))
      if (!fs.existsSync(abs)) {
        // fallback scenes
        const fallback = path.join(publicDir, 'media/scenes/ai.png')
        return pathToFileURL(fallback).href
      }
    }
    return a(src)
  })
  return shell(doc, body, mode)
}

/** Reject notepad-style Helvetica dumps (historically 2–4KB). */
const MIN_PDF_BYTES = 50_000
const MIN_EMBEDDED_IMAGES = 1

function assertRequiredAssets() {
  const missing = Object.values(ASSETS)
    .map((src) => path.join(publicDir, src.replace(/^\//, '')))
    .filter((abs) => !fs.existsSync(abs))
  if (missing.length) {
    throw new Error(
      `Missing brand/media assets required for professional PDFs:\n${missing.map((m) => `  - ${m}`).join('\n')}`,
    )
  }
}

function assertProfessionalPdf(pdfPath) {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF missing after print: ${pdfPath}`)
  }
  const size = fs.statSync(pdfPath).size
  if (size < MIN_PDF_BYTES) {
    try {
      fs.unlinkSync(pdfPath)
    } catch {
      /* ignore */
    }
    throw new Error(
      `Refusing notepad-style PDF (${size} bytes < ${MIN_PDF_BYTES}). ` +
        `Chrome headless print did not produce a rich document: ${path.basename(pdfPath)}`,
    )
  }

  const buf = fs.readFileSync(pdfPath)
  // Latin1 preserves raw bytes so PDF operators remain searchable as ASCII.
  const raw = buf.toString('latin1')
  const producer = (raw.match(/\/Producer\s*\(([^)\\]*(?:\\.[^)\\]*)*)\)/) || [])[1] || ''
  const isChromePrint = /Skia|Chromium|Chrome/i.test(producer) || /Skia\/PDF/i.test(raw)
  if (!isChromePrint) {
    try {
      fs.unlinkSync(pdfPath)
    } catch {
      /* ignore */
    }
    throw new Error(
      `Refusing non-Chrome PDF (Producer="${producer || 'unknown'}"). ` +
        `Only headless Chrome/Edge print output is allowed: ${path.basename(pdfPath)}`,
    )
  }
  if (/BaseFont\s*\/Helvetica\b/.test(raw) && !/\/Subtype\s*\/Image/.test(raw)) {
    try {
      fs.unlinkSync(pdfPath)
    } catch {
      /* ignore */
    }
    throw new Error(
      `Refusing Helvetica text-only PDF (no embedded images): ${path.basename(pdfPath)}`,
    )
  }
  const imageCount = (raw.match(/\/Subtype\s*\/Image/g) || []).length
  if (imageCount < MIN_EMBEDDED_IMAGES) {
    try {
      fs.unlinkSync(pdfPath)
    } catch {
      /* ignore */
    }
    throw new Error(
      `Refusing image-less PDF (${imageCount} images). Brand imagery required: ${path.basename(pdfPath)}`,
    )
  }
  return { size, producer: producer.replace(/\\/g, ''), imageCount }
}

function printPdf(chromePath, htmlPath, pdfPath) {
  // Never leave a previous tiny/amateur file in place if print fails.
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath)

  const fileUrl = pathToFileURL(htmlPath).href
  const result = spawnSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--disable-extensions',
      '--no-first-run',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=15000',
      `--print-to-pdf=${pdfPath}`,
      fileUrl,
    ],
    { encoding: 'utf8', timeout: 180000 },
  )
  if (result.error) {
    throw new Error(`Chrome spawn failed for ${path.basename(pdfPath)}: ${result.error.message}`)
  }
  if (result.status !== 0) {
    throw new Error(
      `Chrome PDF failed for ${path.basename(pdfPath)} (exit ${result.status}): ${
        result.stderr || result.stdout || 'no output'
      }`,
    )
  }
  return assertProfessionalPdf(pdfPath)
}

function main() {
  fs.mkdirSync(outDir, { recursive: true })
  assertRequiredAssets()

  const chrome = findChrome()
  if (!chrome) {
    console.error(
      'FATAL: Chrome/Edge not found. Set CHROME_PATH or install Chrome/Edge. ' +
        'Will NOT fall back to text-only PDFs.',
    )
    process.exit(1)
  }
  console.log('Using browser:', chrome)
  console.log(`Quality gate: min ${MIN_PDF_BYTES} bytes, Chromium/Skia producer, >=${MIN_EMBEDDED_IMAGES} image(s)`)

  const tmpDir = path.join(outDir, '.print-tmp')
  fs.mkdirSync(tmpDir, { recursive: true })

  const index = []
  const report = []
  try {
    for (const doc of DOCS) {
      const viewHtml = htmlFor(doc, 'view')
      const printHtml = htmlFor(doc, 'print')
      const htmlPath = path.join(outDir, `${doc.filename}.html`)
      const pdfPath = path.join(outDir, `${doc.filename}.pdf`)
      const printPath = path.join(tmpDir, `${doc.filename}.html`)

      fs.writeFileSync(htmlPath, viewHtml, 'utf8')
      fs.writeFileSync(printPath, printHtml, 'utf8')
      const meta = printPdf(chrome, printPath, pdfPath)

      console.log(
        'Wrote',
        doc.filename,
        `(${meta.size} bytes, ${meta.imageCount} images, ${meta.producer || 'Skia'})`,
      )
      report.push({ file: `${doc.filename}.pdf`, ...meta })

      index.push({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        fileUrl: `/downloads/${doc.filename}.pdf`,
        htmlUrl: `/downloads/${doc.filename}.html`,
        category: doc.category,
        status: 'published',
        updatedAt: `${stamp}T12:00:00.000Z`,
        createdAt: `${stamp}T12:00:00.000Z`,
      })
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }

  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2), 'utf8')

  console.log('Done —', index.length, 'documents')
  for (const row of report) {
    console.log(
      `  OK ${row.file}: ${(row.size / 1024).toFixed(0)} KB, ${row.imageCount} images`,
    )
  }
}

try {
  main()
} catch (err) {
  console.error('FATAL:', err.message || err)
  process.exit(1)
}
