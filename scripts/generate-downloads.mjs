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
  founderAlt: '/founder/elijah-1.jpg',
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
  bannerHome: '/media/banners/home-craft.png',
  bannerAbout: '/media/banners/about-hero.png',
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

/** Shared print design system — boardroom / tender materials */
function sharedCss() {
  return `
    @page { size: A4; margin: 0; }
    :root {
      --ink: #0b1220;
      --slate: #0f172a;
      --slate-2: #1e293b;
      --muted: #475569;
      --soft: #64748b;
      --line: #cbd5e1;
      --line-soft: #e2e8f0;
      --paper: #ffffff;
      --wash: #f8fafc;
      --brand: #0891b2;
      --brand-bright: #22d3ee;
      --brand-deep: #0e7490;
      --cyan-dim: #a5f3fc;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Outfit", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      color: var(--ink);
      background: #e2e8f0;
      line-height: 1.45;
      font-weight: 400;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-feature-settings: "kern" 1, "liga" 1;
    }
    img { max-width: 100%; display: block; }
    a { color: var(--brand-deep); text-decoration: none; }
    .doc { max-width: 820px; margin: 0 auto; }
    .page {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: var(--paper);
      margin: 0 auto 28px;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .page:last-child { page-break-after: auto; break-after: auto; margin-bottom: 0; }
    .page.auto-h { height: auto; min-height: 297mm; }

    /* ── Cover ── */
    .cover {
      background:
        linear-gradient(115deg, rgba(15,23,42,.97) 0%, rgba(15,23,42,.82) 42%, rgba(8,145,178,.55) 100%),
        var(--cover-img, none) center/cover no-repeat;
      color: #fff;
      display: flex;
      flex-direction: column;
    }
    .cover-rail {
      position: absolute; left: 0; top: 0; bottom: 0; width: 8px;
      background: linear-gradient(180deg, var(--brand-bright), var(--brand) 45%, #155e75);
    }
    .cover-top {
      padding: 16mm 18mm 0 20mm;
      display: flex; justify-content: space-between; align-items: flex-start;
    }
    .cover-top img.logo { height: 40px; width: auto; filter: brightness(0) invert(1); }
    .cover-meta {
      text-align: right; font-size: 9.5px; letter-spacing: .14em;
      text-transform: uppercase; color: rgba(165,243,252,.85); line-height: 1.55;
    }
    .cover-body {
      flex: 1; display: flex; flex-direction: column; justify-content: flex-end;
      padding: 0 18mm 18mm 20mm;
    }
    .cover .doc-type {
      font-size: 11px; font-weight: 600; letter-spacing: .22em;
      text-transform: uppercase; color: var(--brand-bright); margin: 0 0 14px;
    }
    .cover h1 {
      margin: 0 0 14px; font-size: 38px; line-height: 1.08;
      letter-spacing: -0.035em; font-weight: 700; max-width: 16ch;
    }
    .cover .lede {
      margin: 0; font-size: 15px; font-weight: 400; line-height: 1.5;
      color: rgba(255,255,255,.88); max-width: 42ch;
    }
    .cover .motto {
      margin: 22px 0 0; font-size: 12px; font-weight: 600;
      letter-spacing: .16em; text-transform: uppercase; color: var(--cyan-dim);
    }
    .cover-foot {
      margin-top: 28px; padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,.18);
      display: flex; flex-wrap: wrap; gap: 8px 22px;
      font-size: 11px; color: rgba(255,255,255,.72); letter-spacing: .04em;
    }
    .cover-foot strong { color: #fff; font-weight: 600; }

    /* ── Inner chrome ── */
    .page-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10mm 16mm 0; gap: 12px;
    }
    .page-head .brand {
      display: flex; align-items: center; gap: 10px;
    }
    .page-head .brand img { height: 26px; width: auto; }
    .page-head .doc-label {
      font-size: 9px; font-weight: 600; letter-spacing: .16em;
      text-transform: uppercase; color: var(--soft);
      border-left: 2px solid var(--brand); padding-left: 10px;
    }
    .pad { padding: 8mm 16mm 18mm; }
    .pad-tight { padding: 6mm 14mm 16mm; }
    .pad-full { padding: 0 16mm 18mm; }

    .eyebrow {
      font-size: 10px; font-weight: 700; letter-spacing: .18em;
      text-transform: uppercase; color: var(--brand); margin: 0 0 6px;
    }
    h1 {
      margin: 0 0 10px; font-size: 28px; line-height: 1.12;
      letter-spacing: -0.03em; font-weight: 700; color: var(--slate);
    }
    h2 {
      margin: 0 0 8px; font-size: 20px; letter-spacing: -0.025em;
      font-weight: 700; color: var(--slate); line-height: 1.2;
    }
    h3 {
      margin: 0 0 5px; font-size: 13px; font-weight: 700;
      color: var(--slate); letter-spacing: -0.01em;
    }
    p { margin: 0 0 9px; font-size: 12.5px; color: #1e293b; }
    .lede { margin: 0 0 12px; font-size: 13.5px; color: var(--muted); max-width: 54ch; line-height: 1.5; }
    .muted { color: var(--muted); }
    .rule {
      height: 2px; width: 40px; border: 0; margin: 0 0 14px;
      background: linear-gradient(90deg, var(--brand), var(--brand-bright));
    }
    .section { margin-bottom: 16px; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; }
    .grid-12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 12px; }
    .span-5 { grid-column: span 5; }
    .span-6 { grid-column: span 6; }
    .span-7 { grid-column: span 7; }

    /* Panels — not soft “AI cards” */
    .panel {
      border: 1px solid var(--line-soft);
      border-left: 3px solid var(--brand);
      background: var(--wash);
      padding: 12px 14px;
    }
    .panel.plain {
      border-left-color: var(--line);
      background: #fff;
    }
    .panel.dark {
      background: var(--slate);
      border: 1px solid var(--slate-2);
      border-left: 3px solid var(--brand-bright);
      color: #fff;
    }
    .panel.dark h3 { color: #fff; }
    .panel.dark p, .panel.dark li { color: rgba(255,255,255,.82); }
    .panel p:last-child, .panel ul:last-child { margin-bottom: 0; }

    .media {
      overflow: hidden; background: var(--slate);
      border: 1px solid var(--line-soft);
    }
    .media img { width: 100%; height: 150px; object-fit: cover; }
    .media.tall img { height: 210px; }
    .media.short img { height: 110px; }
    .media.hero-band img { height: 120px; }
    .media.contain {
      background: #fff; display: flex; align-items: center; justify-content: center;
      padding: 14px; min-height: 88px;
    }
    .media.contain img { height: 64px; width: auto; max-width: 100%; object-fit: contain; }

    ul.clean { margin: 0; padding: 0; list-style: none; }
    ul.clean li {
      position: relative; padding-left: 14px; margin-bottom: 5px;
      font-size: 12px; color: #334155; line-height: 1.4;
    }
    ul.clean li::before {
      content: ""; position: absolute; left: 0; top: 6px;
      width: 6px; height: 6px; background: var(--brand);
    }

    table.rates {
      width: 100%; border-collapse: collapse; font-size: 11.5px; margin-top: 4px;
    }
    table.rates thead th {
      background: var(--slate); color: #e2e8f0; font-size: 9.5px;
      font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
      padding: 8px 10px; text-align: left; border: 0;
    }
    table.rates thead th:last-child { text-align: right; }
    table.rates tbody td {
      padding: 7px 10px; border-bottom: 1px solid var(--line-soft);
      vertical-align: top; color: #1e293b;
    }
    table.rates tbody tr:nth-child(even) td { background: var(--wash); }
    table.rates td.price {
      font-weight: 700; color: var(--slate); white-space: nowrap;
      text-align: right; font-variant-numeric: tabular-nums;
    }
    table.rates .note { display: block; font-size: 10.5px; color: var(--soft); font-weight: 400; margin-top: 1px; }

    .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin: 12px 0 16px; border: 1px solid var(--line-soft); }
    .stat {
      padding: 12px 10px; background: var(--slate); color: #fff;
      border-right: 1px solid rgba(255,255,255,.08);
    }
    .stat:last-child { border-right: 0; }
    .stat strong { display: block; font-size: 13px; letter-spacing: -0.02em; font-weight: 700; }
    .stat span { font-size: 10px; color: #94a3b8; letter-spacing: .04em; text-transform: uppercase; }

    .split { display: grid; grid-template-columns: 1.15fr .85fr; gap: 16px; align-items: start; }

    .footer-bar {
      position: absolute; left: 0; right: 0; bottom: 0;
      padding: 7px 16mm;
      font-size: 9px; color: var(--soft); letter-spacing: .04em;
      border-top: 1px solid var(--line-soft); background: #fff;
      display: flex; justify-content: space-between; gap: 12px; align-items: center;
    }
    .footer-bar .mark { height: 14px; width: auto; opacity: .55; }

    .cta-band {
      margin-top: 14px; padding: 14px 16px;
      background: var(--slate); color: #fff;
      display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px; align-items: center;
    }
    .cta-band h3 { color: #fff; font-size: 14px; margin: 0 0 4px; }
    .cta-band p { color: rgba(255,255,255,.78); margin: 0; font-size: 11.5px; }
    .cta-band .links { color: var(--brand-bright); font-size: 11.5px; font-weight: 500; line-height: 1.55; }

    .step { display: grid; grid-template-columns: 32px 1fr; gap: 10px; margin-bottom: 11px; }
    .step .n {
      width: 32px; height: 32px; background: var(--slate); color: var(--brand-bright);
      font-weight: 700; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
    }
    .step h3 { margin-bottom: 2px; }
    .step p { margin: 0; font-size: 12px; color: var(--muted); }

    .cap-rail {
      display: grid; grid-template-columns: 72px 1fr; min-height: 297mm;
    }
    .cap-rail .side {
      background: var(--slate);
      padding: 14mm 8px 16mm;
      writing-mode: vertical-rl; transform: rotate(180deg);
      display: flex; align-items: center; justify-content: space-between;
      color: rgba(255,255,255,.55); font-size: 10px; letter-spacing: .2em;
      text-transform: uppercase; font-weight: 600;
    }
    .cap-rail .side .side-brand { color: var(--brand-bright); }
    .cap-main { padding: 12mm 12mm 14mm 10mm; display: flex; flex-direction: column; }

    .flyer {
      display: grid; grid-template-rows: 1.2fr 1fr; min-height: 297mm; height: 297mm;
    }
    .flyer-top {
      position: relative; color: #fff; padding: 16mm 16mm 14mm;
      background:
        linear-gradient(155deg, rgba(15,23,42,.96) 0%, rgba(15,23,42,.75) 50%, rgba(8,145,178,.5) 100%),
        var(--cover-img) center/cover no-repeat;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .flyer-top .logo { height: 42px; filter: brightness(0) invert(1); }
    .flyer-top h1 {
      color: #fff; font-size: 44px; max-width: 11ch; margin: 10px 0 12px;
    }
    .flyer-top .lede { color: rgba(255,255,255,.88); font-size: 15px; max-width: 36ch; }
    .flyer-bottom { padding: 12mm 16mm 16mm; background: #fff; }
    .kicker {
      font-size: 11px; font-weight: 700; color: var(--brand-bright);
      letter-spacing: .18em; text-transform: uppercase; margin: 0;
    }

    .tag-row { display: flex; flex-wrap: wrap; gap: 6px 8px; margin-top: 10px; }
    .tag {
      font-size: 10px; font-weight: 600; letter-spacing: .06em;
      text-transform: uppercase; color: var(--slate-2);
      border: 1px solid var(--line); padding: 4px 8px; background: #fff;
    }
    .tag.on-dark {
      color: rgba(255,255,255,.9); border-color: rgba(255,255,255,.28); background: transparent;
    }

    .prod-row {
      display: grid; grid-template-columns: 76px 1fr; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid var(--line-soft); align-items: center;
    }
    .prod-row:last-child { border-bottom: 0; }

    .actions.no-print { margin: 16px 0 0; }
    .actions.no-print a {
      display: inline-block; margin-right: 8px; padding: 9px 16px;
      background: var(--brand); color: #fff; text-decoration: none;
      font-size: 12px; font-weight: 650; letter-spacing: .02em;
    }
    .actions.no-print a.secondary { background: var(--slate); }

    @media print {
      body { background: #fff; }
      .doc { max-width: none; }
      .page { margin: 0; width: auto; height: 100vh; min-height: 100vh; box-shadow: none; }
      .page.auto-h { height: auto; min-height: 100vh; }
      .no-print { display: none !important; }
    }
    @media screen {
      body { padding: 28px 12px 56px; }
      .page { box-shadow: 0 22px 60px rgba(15,23,42,.14); }
    }
  `
}

function pageHead(a, docTitle) {
  return `<header class="page-head">
    <div class="brand"><img src="${a(ASSETS.logo)}" alt="Ellines Tech" /></div>
    <div class="doc-label">${escapeHtml(docTitle)}</div>
  </header>`
}

function pageFooter(docTitle, pageLabel, a) {
  const mark = a ? `<img class="mark" src="${a(ASSETS.mark)}" alt="" />` : ''
  return `<footer class="footer-bar">
    <span>${mark} ${escapeHtml(CONTACT.name)} · ${escapeHtml(docTitle)} · ${escapeHtml(stamp)}</span>
    <span>${escapeHtml(CONTACT.url)} · ${escapeHtml(pageLabel)}</span>
  </footer>`
}

function coverShell(a, { image, docType, title, lede, motto, footItems }) {
  return `<section class="page cover" style="--cover-img:url('${a(image)}')">
    <div class="cover-rail"></div>
    <div class="cover-top">
      <img class="logo" src="${a(ASSETS.logo)}" alt="Ellines Tech" />
      <div class="cover-meta">
        ${escapeHtml(CONTACT.group)}<br/>
        ${escapeHtml(CONTACT.cities)}<br/>
        ${escapeHtml(stamp)}
      </div>
    </div>
    <div class="cover-body">
      <p class="doc-type">${escapeHtml(docType)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="lede">${escapeHtml(lede)}</p>
      ${motto ? `<p class="motto">${escapeHtml(motto)}</p>` : ''}
      <div class="cover-foot">
        ${(footItems || [])
          .map((t) => `<span><strong>${escapeHtml(t.label)}</strong> ${escapeHtml(t.value)}</span>`)
          .join('')}
      </div>
    </div>
  </section>`
}

function shell(doc, bodyHtml) {
  const pdfName = `${doc.filename}.pdf`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(doc.title)} · ${escapeHtml(CONTACT.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
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
  ${coverShell(a, {
    image: ASSETS.hero,
    docType: `Company profile · ${stamp}`,
    title: 'Technology that ships for African businesses',
    lede: 'Ellines Tech builds software, AI, cloud, design, and digital operations from Nyeri and Nairobi — the technology arm of Ellines Group.',
    motto: CONTACT.motto,
    footItems: [
      { label: 'HQ', value: 'Nyeri' },
      { label: 'Presence', value: 'Nairobi' },
      { label: 'Focus', value: 'Products + services' },
      { label: 'Clients', value: 'Enterprise & SME' },
    ],
  })}

  <section class="page">
    ${pageHead(a, 'Company Profile')}
    <div class="pad">
      <p class="eyebrow">01 · Who we are</p>
      <h2>Product engineering with client delivery</h2>
      <div class="rule"></div>
      <div class="split">
        <div>
          <p>Ellines Tech is a Kenya-based technology company delivering software development, AI, web &amp; mobile, cloud, cybersecurity hardening, branding, and digital transformation for enterprises, SMEs, clinics, and institutions across Africa and beyond.</p>
          <p>Founded by <strong>${escapeHtml(CONTACT.founder)}</strong> (${escapeHtml(CONTACT.founderRole)}), we combine flagship platforms with scoped client work — clear deliverables, timelines, and payment stages before build starts.</p>
          <ul class="clean">
            <li>${escapeHtml(CONTACT.nyeri)}</li>
            <li>${escapeHtml(CONTACT.nairobi)}</li>
            <li>Always open for demos, support, and project inquiries</li>
          </ul>
        </div>
        <div class="media tall"><img src="${a(ASSETS.founder)}" alt="${escapeHtml(CONTACT.founder)}" /></div>
      </div>
      <div class="stat-row">
        <div class="stat"><strong>Nyeri</strong><span>Build HQ</span></div>
        <div class="stat"><strong>Nairobi</strong><span>Client presence</span></div>
        <div class="stat"><strong>Products</strong><span>MedFlow · RV22 · more</span></div>
        <div class="stat"><strong>Group</strong><span>Tech · Haven · Rattan</span></div>
      </div>
      <div class="grid-2">
        <div class="panel">
          <h3>How we engage</h3>
          <p class="muted">Discovery → scoped proposal → design &amp; build → QA → launch → care. We map work to your workflows — not generic slide decks.</p>
        </div>
        <div class="panel plain">
          <h3>Commercial clarity</h3>
          <p class="muted">Published starter packages on /pricing, milestone projects, product licensing, and post-launch retainers. Enterprise modules quoted after discovery.</p>
        </div>
      </div>
    </div>
    ${pageFooter('Company Profile', '02 / 04', a)}
  </section>

  <section class="page">
    ${pageHead(a, 'Company Profile')}
    <div class="pad">
      <p class="eyebrow">02 · Products</p>
      <h2>Platforms we build and operate</h2>
      <div class="rule"></div>
      <div class="prod-row">
        <div class="media contain"><img src="${a(ASSETS.rv22)}" alt="RV22" /></div>
        <div>
          <h3>RV22 AI Assistant</h3>
          <p class="muted" style="margin:0">Enterprise AI for support, workflows, and knowledge retrieval — natural language chat, custom knowledge bases, API integrations, multi-channel deployment.</p>
        </div>
      </div>
      <div class="prod-row">
        <div class="media contain"><img src="${a(ASSETS.afyavox)}" alt="AfyaVox" /></div>
        <div>
          <h3>AfyaVox AI</h3>
          <p class="muted" style="margin:0">Clinical AI assistant for voice-powered documentation, decision support, triage assistance, and multi-language patient communication.</p>
        </div>
      </div>
      <div class="prod-row">
        <div class="media contain" style="background:var(--wash)"><img src="${a(ASSETS.square)}" alt="MedFlow" style="height:48px;opacity:.9" /></div>
        <div>
          <h3>MedFlow</h3>
          <p class="muted" style="margin:0">Hospital &amp; clinic operations — registration, EMR, billing &amp; insurance, pharmacy, lab &amp; radiology, multi-branch reporting. Modular rollout by department for African healthcare workflows.</p>
        </div>
      </div>
      <div class="prod-row">
        <div class="media contain"><img src="${a(ASSETS.juno4)}" alt="Juno4" /></div>
        <div>
          <h3>Juno4 · Lmar · custom builds</h3>
          <p class="muted" style="margin:0">Juno4 AI platform, Lmar brand systems, ERPs, e-commerce, booking apps, and bespoke enterprise software — React, Flutter, Python, cloud-hosted.</p>
        </div>
      </div>
      <div class="media hero-band" style="margin-top:14px"><img src="${a(ASSETS.brandWork)}" alt="Brand and product work" /></div>
    </div>
    ${pageFooter('Company Profile', '03 / 04', a)}
  </section>

  <section class="page">
    ${pageHead(a, 'Company Profile')}
    <div class="pad">
      <p class="eyebrow">03 · Services &amp; group</p>
      <h2>Full-stack digital capability</h2>
      <div class="rule"></div>
      <div class="grid-3" style="margin-bottom:16px">
        <div class="panel"><h3>Software &amp; platforms</h3><p>Web apps, portals, mobile/PWA, APIs, integrations, data migration.</p></div>
        <div class="panel"><h3>AI &amp; automation</h3><p>Assistants, chatbots, WhatsApp-ready flows, OCR, predictive analytics.</p></div>
        <div class="panel"><h3>Design &amp; brand</h3><p>Logo systems, UI/UX, product design, campaign print, merch artwork.</p></div>
        <div class="panel plain"><h3>Cloud &amp; security</h3><p>Architecture, deployment, hardening, MFA guidance, backup discipline.</p></div>
        <div class="panel plain"><h3>Consulting</h3><p>IT advisory, roadmaps, digital transformation, cloud readiness.</p></div>
        <div class="panel plain"><h3>Kenya enablement</h3><p>Career docs, selected tax-assist packages, OS setup, app testing.</p></div>
      </div>
      <p class="eyebrow">Ellines Group</p>
      <h2>One founder vision across three brands</h2>
      <div class="rule"></div>
      <p class="muted">Technology, publishing, and commerce under one vision — durable brands for real markets.</p>
      <div class="grid-3">
        <div class="panel plain" style="text-align:center">
          <div class="media contain"><img src="${a(ASSETS.square)}" alt="Ellines Tech" /></div>
          <h3 style="margin-top:8px">Ellines Tech</h3>
          <p class="muted" style="font-size:11px;margin:0">Software, AI, cloud · tech.ellines.co.ke</p>
        </div>
        <div class="panel plain" style="text-align:center">
          <div class="media contain"><img src="${a(ASSETS.haven)}" alt="Ellines Haven" /></div>
          <h3 style="margin-top:8px">Ellines Haven</h3>
          <p class="muted" style="font-size:11px;margin:0">Books &amp; novels · haven.ellines.co.ke</p>
        </div>
        <div class="panel plain" style="text-align:center">
          <div class="media contain"><img src="${a(ASSETS.rattan)}" alt="Ellines Rattan" /></div>
          <h3 style="margin-top:8px">Ellines Rattan</h3>
          <p class="muted" style="font-size:11px;margin:0">Rattan furniture · rattan.ellines.co.ke</p>
        </div>
      </div>
      <div class="cta-band">
        <div>
          <h3>Start a conversation</h3>
          <p>Browse packages, request a quote, or book a demo for MedFlow / RV22.</p>
        </div>
        <div class="links">${escapeHtml(CONTACT.url)}/pricing<br/>${escapeHtml(CONTACT.email)}<br/>${escapeHtml(CONTACT.phones)}</div>
      </div>
    </div>
    ${pageFooter('Company Profile', '04 / 04', a)}
  </section>`
}

function pricingBody(a) {
  const rows = (items) =>
    items
      .map(
        ([name, price, note]) =>
          `<tr><td><strong>${escapeHtml(name)}</strong><span class="note">${escapeHtml(note)}</span></td><td class="price">${escapeHtml(price)}</td></tr>`,
      )
      .join('')

  return `
  ${coverShell(a, {
    image: ASSETS.posterConsult,
    docType: `Pricing & rate card · ${stamp}`,
    title: 'Published starter packages',
    lede: 'Fixed starting points for websites, software, design, consulting, and Kenya enablement. Enterprise products are quoted after discovery. Currency: KES.',
    footItems: [
      { label: 'Catalogue', value: '/pricing' },
      { label: 'Request', value: '/request' },
      { label: 'Valid', value: stamp },
      { label: 'Currency', value: 'KES' },
    ],
  })}

  <section class="page">
    ${pageHead(a, 'Pricing & Rate Card')}
    <div class="pad-tight">
      <p class="eyebrow">01 · Commercial model</p>
      <h2>Project-based clarity</h2>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:12px">
        <div class="panel">
          <h3>Starter packages</h3>
          <p class="muted" style="margin:0">Published “from” prices on tech.ellines.co.ke/pricing. Scope, revisions, and timelines confirmed in writing before work starts.</p>
        </div>
        <div class="panel plain">
          <h3>Enterprise &amp; products</h3>
          <p class="muted" style="margin:0">MedFlow, RV22, multi-branch platforms, and complex integrations are estimated after discovery — modules vary by workflow.</p>
        </div>
      </div>
      <div class="grid-2">
        <div>
          <h3 style="margin-bottom:6px">Web &amp; software</h3>
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
          <h3 style="margin-bottom:6px">Design, brand &amp; marketing</h3>
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
    ${pageFooter('Pricing & Rate Card', '02 / 03', a)}
  </section>

  <section class="page">
    ${pageHead(a, 'Pricing & Rate Card')}
    <div class="pad-tight">
      <div class="grid-2">
        <div>
          <h3 style="margin-bottom:6px">Consulting, cloud &amp; security</h3>
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
          <h3 style="margin-bottom:6px">Career, tax &amp; tech support</h3>
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
          <p class="muted" style="margin-top:8px;font-size:10.5px">Tax packages are scoped operational assistance — not a substitute for licensed accounting advice. Full tiers live on /pricing.</p>
        </div>
      </div>
      <div class="grid-2" style="margin-top:12px">
        <div class="media short"><img src="${a(ASSETS.posterWeb)}" alt="Web packages" /></div>
        <div class="media short"><img src="${a(ASSETS.posterBrand)}" alt="Brand packages" /></div>
      </div>
      <div class="cta-band">
        <div>
          <h3>Confirm live prices &amp; request work</h3>
          <p>Catalogue may update — always verify on the website before invoicing. All services customised by scope and volume.</p>
        </div>
        <div class="links">${escapeHtml(CONTACT.url)}/pricing<br/>${escapeHtml(CONTACT.url)}/request<br/>${escapeHtml(CONTACT.phones)}</div>
      </div>
    </div>
    ${pageFooter('Pricing & Rate Card', '03 / 03', a)}
  </section>`
}

function capabilitiesBody(a) {
  return `
  <section class="page">
    <div class="cap-rail">
      <div class="side">
        <span class="side-brand">Ellines Tech</span>
        <span>Capabilities · ${escapeHtml(stamp)}</span>
      </div>
      <div class="cap-main">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px">
          <img src="${a(ASSETS.logo)}" alt="Ellines Tech" style="height:28px" />
          <span style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);font-weight:600;text-align:right">One-pager<br/>${escapeHtml(CONTACT.cities)}</span>
        </div>
        <p class="eyebrow">Capabilities</p>
        <h1 style="font-size:26px;max-width:22ch;margin-bottom:6px">What Ellines Tech delivers</h1>
        <p class="lede" style="margin-bottom:10px">Software, AI, healthcare tech, design, and digital ops — from Nyeri &amp; Nairobi for African teams that need shipped systems, not slideware.</p>
        <div class="grid-2" style="margin-bottom:10px">
          <div class="media short"><img src="${a(ASSETS.ai)}" alt="AI systems" /></div>
          <div class="media short"><img src="${a(ASSETS.web)}" alt="Web platforms" /></div>
        </div>
        <div class="grid-3" style="margin-bottom:10px">
          <div class="panel"><h3>Software engineering</h3><p>Web, mobile, APIs, integrations, cloud-hosted systems (React, Flutter, Python, PostgreSQL, Docker, Cloudflare).</p></div>
          <div class="panel"><h3>AI &amp; automation</h3><p>RV22, AfyaVox, chatbots, WhatsApp-ready flows, OCR, knowledge-backed assistants.</p></div>
          <div class="panel"><h3>Healthcare tech</h3><p>MedFlow modules: registration, billing, pharmacy, lab, outpatient, multi-branch reporting.</p></div>
          <div class="panel plain"><h3>Design systems</h3><p>Product UI, brand identity, campaign graphics, print-ready and merch artwork.</p></div>
          <div class="panel plain"><h3>Digital ops</h3><p>Hosting handoff, security baselines, SEO foundations, care plans &amp; retainers.</p></div>
          <div class="panel plain"><h3>Consulting</h3><p>Roadmaps, cloud readiness, transformation framing, and hands-on IT advisory.</p></div>
        </div>
        <div class="grid-2" style="flex:1">
          <div class="panel plain">
            <h3>Industries</h3>
            <ul class="clean">
              <li>Healthcare &amp; clinics</li>
              <li>SMEs &amp; retail</li>
              <li>Professional services</li>
              <li>Publishing &amp; creative brands</li>
            </ul>
          </div>
          <div class="panel dark">
            <h3>Why teams choose us</h3>
            <ul class="clean">
              <li>African-market context, global engineering standards</li>
              <li>Product + agency hybrid — packages or platforms</li>
              <li>Clear commercials: packages, invoices, client tracking</li>
            </ul>
          </div>
        </div>
        <div class="cta-band" style="margin-top:10px;grid-template-columns:1fr">
          <div>
            <h3>${escapeHtml(CONTACT.name)} · ${escapeHtml(CONTACT.cities)}</h3>
            <p class="links" style="margin-top:4px">${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)} · ${escapeHtml(CONTACT.url)}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

function catalogueBody(a) {
  return `
  ${coverShell(a, {
    image: ASSETS.strategy,
    docType: `Service catalogue · ${stamp}`,
    title: 'Services for stakeholders & tenders',
    lede: 'Attach this summary with the Company Profile PDF. For current package prices, use the Pricing Rate Card or visit /pricing.',
    footItems: [
      { label: 'Areas', value: 'Software · Cloud · Design · Enablement' },
      { label: 'Use', value: 'RFP / stakeholder packs' },
    ],
  })}

  <section class="page">
    ${pageHead(a, 'Service Catalogue')}
    <div class="pad">
      <p class="eyebrow">01 · Delivery areas</p>
      <h2>What we provide</h2>
      <div class="rule"></div>
      <div class="grid-2">
        <div class="panel">
          <h3>Software &amp; platforms</h3>
          <ul class="clean">
            <li>Custom web applications, portals, and dashboards</li>
            <li>Mobile apps and progressive web apps</li>
            <li>API design, third-party integrations, data migration</li>
            <li>Product implementation: MedFlow, RV22, AfyaVox, bespoke builds</li>
          </ul>
        </div>
        <div class="panel">
          <h3>Cloud, security &amp; care</h3>
          <ul class="clean">
            <li>Cloud architecture, deployment, monitoring handoff</li>
            <li>Security hardening (MFA guidance, least privilege, backups)</li>
            <li>Post-launch retainers: fixes, dependency updates, content help</li>
          </ul>
        </div>
        <div class="panel plain">
          <h3>Design &amp; marketing production</h3>
          <ul class="clean">
            <li>Brand identity, logo systems, web &amp; product design</li>
            <li>Campaign posters, flyers, stationery, merchandise artwork</li>
            <li>Marketing strategy and digital campaign packages</li>
          </ul>
        </div>
        <div class="panel plain">
          <h3>Business enablement (Kenya)</h3>
          <ul class="clean">
            <li>OS installation, app testing packages</li>
            <li>Selected tax-assist services (see Rate Card)</li>
            <li>Career document packages for job seekers &amp; executives</li>
          </ul>
        </div>
      </div>
      <div class="media hero-band" style="margin:14px 0 12px"><img src="${a(ASSETS.solutions)}" alt="Solutions delivery" /></div>
      <div class="cta-band">
        <div>
          <h3>Engagement for RFPs</h3>
          <p>Email sector, deadline, and scope notes. Start at /pricing or /request for commercial packages.</p>
        </div>
        <div class="links">${escapeHtml(CONTACT.email)}<br/>${escapeHtml(CONTACT.phones)}<br/>${escapeHtml(CONTACT.url)}</div>
      </div>
    </div>
    ${pageFooter('Service Catalogue', '02 / 02', a)}
  </section>`
}

function brochureBody(a) {
  return `
  ${coverShell(a, {
    image: ASSETS.growth,
    docType: `Company brochure · ${stamp}`,
    title: 'Ship the system your market actually needs',
    lede: 'A sales-ready overview of Ellines Tech — problem, solution, products, proof of presence, and how to start.',
    motto: CONTACT.motto,
    footItems: [
      { label: 'Audience', value: 'B2B technology' },
      { label: 'Locations', value: CONTACT.cities },
      { label: 'Parent', value: CONTACT.group },
    ],
  })}

  <section class="page">
    ${pageHead(a, 'Company Brochure')}
    <div class="pad">
      <p class="eyebrow">01 · The problem</p>
      <h2>Digital work stalls when tools don’t match the workflow</h2>
      <div class="rule"></div>
      <div class="split">
        <div>
          <p>Teams juggle paper processes, fragmented apps, and agencies that disappear after launch. Healthcare needs reliable clinical ops. SMEs need sites and software that convert. Leaders need AI that plugs into real channels — not demos that die in a deck.</p>
          <p><strong>Ellines Tech exists to close that gap:</strong> scoped delivery, African-market context, and products you can grow into.</p>
          <ul class="clean">
            <li>Unclear scope → written milestones before build</li>
            <li>Generic templates → workflow-mapped systems</li>
            <li>One-off launches → optional care retainers</li>
          </ul>
        </div>
        <div class="media tall"><img src="${a(ASSETS.workspace)}" alt="Delivery workspace" /></div>
      </div>
      <div class="grid-3" style="margin-top:14px">
        <div class="panel"><h3>For clinics &amp; hospitals</h3><p>Registration, billing, pharmacy, lab — MedFlow and AfyaVox.</p></div>
        <div class="panel"><h3>For growing SMEs</h3><p>Websites, e-commerce, brand, custom software, marketing packs.</p></div>
        <div class="panel"><h3>For operators</h3><p>RV22 assistants, cloud, security reviews, transformation roadmaps.</p></div>
      </div>
    </div>
    ${pageFooter('Company Brochure', '02 / 04', a)}
  </section>

  <section class="page">
    ${pageHead(a, 'Company Brochure')}
    <div class="pad">
      <p class="eyebrow">02 · The solution</p>
      <h2>One team for products, packages, and platforms</h2>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:12px">
        <div class="panel plain">
          <div class="media contain"><img src="${a(ASSETS.rv22)}" alt="RV22" /></div>
          <h3 style="margin-top:10px">Flagship AI — RV22</h3>
          <p class="muted" style="margin:0">Automate support and knowledge work with integrations your team already uses.</p>
        </div>
        <div class="panel plain">
          <div class="media contain"><img src="${a(ASSETS.afyavox)}" alt="AfyaVox" /></div>
          <h3 style="margin-top:10px">Healthcare AI — AfyaVox</h3>
          <p class="muted" style="margin:0">Voice and clinical assistance designed for real care settings.</p>
        </div>
      </div>
      <div class="grid-2">
        <div class="panel">
          <h3 style="margin-bottom:10px">How it works</h3>
          <div class="step"><div class="n">1</div><div><h3>Discover</h3><p>Goals, constraints, systems, success metrics.</p></div></div>
          <div class="step"><div class="n">2</div><div><h3>Propose</h3><p>Scope, timeline, price stages — in writing.</p></div></div>
          <div class="step"><div class="n">3</div><div><h3>Build &amp; launch</h3><p>Design, engineering, QA, go-live.</p></div></div>
          <div class="step"><div class="n">4</div><div><h3>Care</h3><p>Optional retainer for fixes and evolution.</p></div></div>
        </div>
        <div>
          <div class="media tall"><img src="${a(ASSETS.posterAi)}" alt="AI delivery" /></div>
          <div class="panel dark" style="margin-top:10px">
            <h3>Stack signals</h3>
            <p style="margin:0;font-size:11.5px">Python · React · Flutter · TypeScript · PostgreSQL · MySQL · Docker · Cloudflare · Firebase · Supabase · AI/ML · REST APIs</p>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter('Company Brochure', '03 / 04', a)}
  </section>

  <section class="page">
    ${pageHead(a, 'Company Brochure')}
    <div class="pad">
      <p class="eyebrow">03 · Presence &amp; proof</p>
      <h2>Built in Kenya. Ready for your market.</h2>
      <div class="rule"></div>
      <div class="grid-2" style="margin-bottom:12px">
        <div class="panel">
          <h3>Nyeri — Head office</h3>
          <p>${escapeHtml(CONTACT.nyeri)}</p>
          <p class="muted" style="margin:0">Where the team builds day to day — walk-ins, workshops, and delivery.</p>
        </div>
        <div class="panel plain">
          <h3>Nairobi — Presence</h3>
          <p>${escapeHtml(CONTACT.nairobi)}</p>
          <p class="muted" style="margin:0">Pitches and on-site sessions across Nairobi by appointment.</p>
        </div>
      </div>
      <div class="media hero-band" style="margin-bottom:12px"><img src="${a(ASSETS.about)}" alt="Ellines Tech presence" /></div>
      <p class="eyebrow">Ellines Group</p>
      <h3>Technology, publishing, and furniture under one vision</h3>
      <div class="grid-3" style="margin-top:10px">
        <div class="panel plain" style="text-align:center"><div class="media contain"><img src="${a(ASSETS.square)}" alt="Tech" /></div><h3 style="margin-top:8px">Ellines Tech</h3></div>
        <div class="panel plain" style="text-align:center"><div class="media contain"><img src="${a(ASSETS.haven)}" alt="Haven" /></div><h3 style="margin-top:8px">Ellines Haven</h3></div>
        <div class="panel plain" style="text-align:center"><div class="media contain"><img src="${a(ASSETS.rattan)}" alt="Rattan" /></div><h3 style="margin-top:8px">Ellines Rattan</h3></div>
      </div>
      <div class="cta-band">
        <div>
          <h3>Request a demo or package</h3>
          <p>Tell us your sector and timeline — we’ll map the next step. ${escapeHtml(CONTACT.motto)}</p>
        </div>
        <div class="links">${escapeHtml(CONTACT.url)}/request<br/>${escapeHtml(CONTACT.email)}<br/>${escapeHtml(CONTACT.phones)}</div>
      </div>
    </div>
    ${pageFooter('Company Brochure', '04 / 04', a)}
  </section>`
}

function engagementBody(a) {
  return `
  ${coverShell(a, {
    image: ASSETS.strategy,
    docType: `Client engagement guide · ${stamp}`,
    title: 'How we work with you',
    lede: 'A practical guide for sponsors and project leads — what happens from first call to care plan.',
    footItems: [
      { label: 'Path', value: 'Discovery → Care' },
      { label: 'Rule', value: 'Written scope first' },
      { label: 'Locations', value: CONTACT.cities },
    ],
  })}

  <section class="page">
    ${pageHead(a, 'Engagement Guide')}
    <div class="pad">
      <p class="eyebrow">01 · Process</p>
      <h2>Five stages, no surprises</h2>
      <div class="rule"></div>
      <div class="step"><div class="n">1</div><div><h3>Inquiry &amp; discovery</h3><p>Share goals, users, systems, constraints, and deadline. We may schedule a short call or Nairobi/Nyeri meeting. Outcome: shared understanding of the problem.</p></div></div>
      <div class="step"><div class="n">2</div><div><h3>Proposal &amp; commercial</h3><p>You receive scope, deliverables, timeline, and payment stages. Starter work may map to a published /pricing package; enterprise work is custom-quoted.</p></div></div>
      <div class="step"><div class="n">3</div><div><h3>Design &amp; build</h3><p>UX/visual direction (when in scope), engineering, integrations, and content handoff points. You review milestones — not a black box.</p></div></div>
      <div class="step"><div class="n">4</div><div><h3>QA &amp; launch</h3><p>Testing against agreed acceptance notes, go-live support, and credentials/hosting handoff as specified.</p></div></div>
      <div class="step"><div class="n">5</div><div><h3>Care (optional)</h3><p>Retainer for bug fixes, dependency updates, small enhancements, and content help.</p></div></div>
      <div class="grid-2" style="margin-top:8px">
        <div class="panel">
          <h3>What we need from you</h3>
          <ul class="clean">
            <li>A decision-maker or clear approver</li>
            <li>Brand assets / content (or a plan to create them)</li>
            <li>Access to systems for integrations</li>
            <li>Timely feedback on milestones</li>
          </ul>
        </div>
        <div class="panel dark">
          <h3>What you can expect from us</h3>
          <ul class="clean">
            <li>Written scope before major build</li>
            <li>Named commercial path (package or estimate)</li>
            <li>Practical demos for product work</li>
            <li>Contact via email, phone, or WhatsApp</li>
          </ul>
        </div>
      </div>
      <div class="media short" style="margin-top:12px"><img src="${a(ASSETS.bannerHome)}" alt="Delivery craft" /></div>
      <div class="cta-band" style="margin-top:12px">
        <div>
          <h3>Ready to begin?</h3>
          <p>Open a request or browse published packages.</p>
        </div>
        <div class="links">${escapeHtml(CONTACT.url)}/request<br/>${escapeHtml(CONTACT.url)}/pricing<br/>${escapeHtml(CONTACT.email)} · ${escapeHtml(CONTACT.phones)}</div>
      </div>
    </div>
    ${pageFooter('Engagement Guide', '02 / 02', a)}
  </section>`
}

function flyerBody(a) {
  return `
  <section class="page flyer" style="--cover-img:url('${a(ASSETS.hero)}')">
    <div class="flyer-top">
      <div>
        <img class="logo" src="${a(ASSETS.logo)}" alt="Ellines Tech" />
        <p class="kicker" style="margin-top:18px">Intro flyer · ${stamp}</p>
        <h1>Your Idea. Our Code.</h1>
        <p class="lede">Software · AI · Web · Design · Cloud — Ellines Tech in Nyeri &amp; Nairobi.</p>
        <div class="tag-row">
          <span class="tag on-dark">tech.ellines.co.ke</span>
          <span class="tag on-dark">Part of Ellines Group</span>
        </div>
      </div>
      <div style="font-size:11px;color:rgba(255,255,255,.7);letter-spacing:.04em">
        Founded by ${escapeHtml(CONTACT.founder)} · ${escapeHtml(CONTACT.founderRole)}
      </div>
    </div>
    <div class="flyer-bottom">
      <div class="grid-2">
        <div>
          <h3>What we do</h3>
          <ul class="clean">
            <li>MedFlow · RV22 · AfyaVox · custom platforms</li>
            <li>Websites, apps, brand &amp; campaign design</li>
            <li>Consulting, cloud, security, care plans</li>
          </ul>
          <h3 style="margin-top:12px">Visit or call</h3>
          <p style="font-size:11.5px;margin-bottom:4px">${escapeHtml(CONTACT.nyeri)}</p>
          <p style="font-size:11.5px;margin-bottom:8px">${escapeHtml(CONTACT.nairobi)}</p>
          <p style="font-size:12px;margin:0"><strong>${escapeHtml(CONTACT.phones)}</strong><br/>${escapeHtml(CONTACT.email)}</p>
        </div>
        <div>
          <div class="media"><img src="${a(ASSETS.founder)}" alt="${escapeHtml(CONTACT.founder)}" style="height:140px;object-fit:cover" /></div>
          <div class="cta-band" style="margin-top:10px;grid-template-columns:1fr;padding:12px">
            <div>
              <h3>Next step</h3>
              <p class="links" style="margin-top:4px">${escapeHtml(CONTACT.url)}/request<br/>${escapeHtml(CONTACT.url)}/pricing</p>
            </div>
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
  const body = doc.body((src) => {
    if (mode === 'print') {
      const abs = path.join(publicDir, src.replace(/^\//, ''))
      if (!fs.existsSync(abs)) {
        const fallback = path.join(publicDir, 'media/scenes/ai.png')
        return pathToFileURL(fallback).href
      }
    }
    return a(src)
  })
  return shell(doc, body)
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
      '--virtual-time-budget=20000',
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
  console.log(
    `Quality gate: min ${MIN_PDF_BYTES} bytes, Chromium/Skia producer, >=${MIN_EMBEDDED_IMAGES} image(s)`,
  )

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
    console.log(`  OK ${row.file}: ${(row.size / 1024).toFixed(0)} KB, ${row.imageCount} images`)
  }
}

try {
  main()
} catch (err) {
  console.error('FATAL:', err.message || err)
  process.exit(1)
}
