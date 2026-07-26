/**
 * Generates unique on-brand SVG card posters for pricing packages
 * that would otherwise share the same photo.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/media/posters/packages')
mkdirSync(outDir, { recursive: true })

/** @typedef {{ id: string, label: string, hue: string, accent: string, motif: string }} Spec */

/** Motifs draw different compositions so cards never look identical */
const motifs = {
  browser(accent) {
    return `
      <rect x="140" y="110" width="520" height="300" rx="18" fill="#0b1526" stroke="${accent}" stroke-opacity="0.45" stroke-width="2"/>
      <rect x="140" y="110" width="520" height="42" rx="18" fill="#111c30"/>
      <circle cx="168" cy="131" r="6" fill="#f87171"/><circle cx="188" cy="131" r="6" fill="#fbbf24"/><circle cx="208" cy="131" r="6" fill="#34d399"/>
      <rect x="170" y="180" width="200" height="14" rx="4" fill="${accent}" fill-opacity="0.85"/>
      <rect x="170" y="210" width="280" height="10" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="170" y="232" width="240" height="10" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="480" y="180" width="140" height="160" rx="12" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.35"/>
    `
  },
  storefront(accent) {
    return `
      <rect x="180" y="130" width="440" height="260" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>
      <path d="M200 200h400M200 270h400M200 340h400M320 130v260M460 130v260" stroke="${accent}" stroke-opacity="0.25" stroke-width="2"/>
      <rect x="230" y="155" width="60" height="30" rx="6" fill="${accent}" fill-opacity="0.7"/>
      <rect x="370" y="225" width="60" height="30" rx="6" fill="${accent}" fill-opacity="0.45"/>
      <rect x="510" y="295" width="60" height="30" rx="6" fill="${accent}" fill-opacity="0.55"/>
    `
  },
  logoMark(accent) {
    return `
      <circle cx="400" cy="240" r="110" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.5"/>
      <circle cx="400" cy="240" r="70" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="2"/>
      <path d="M360 250c20-50 60-50 80 0" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="375" cy="215" r="8" fill="${accent}"/><circle cx="425" cy="215" r="8" fill="${accent}"/>
    `
  },
  palette(accent) {
    return `
      <circle cx="300" cy="200" r="55" fill="${accent}" fill-opacity="0.85"/>
      <circle cx="380" cy="170" r="45" fill="#38bdf8" fill-opacity="0.75"/>
      <circle cx="440" cy="220" r="50" fill="#2dd4bf" fill-opacity="0.7"/>
      <circle cx="360" cy="280" r="48" fill="#67e8f9" fill-opacity="0.55"/>
      <rect x="500" y="160" width="120" height="180" rx="14" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4"/>
      <rect x="520" y="185" width="80" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
      <rect x="520" y="210" width="60" height="10" rx="3" fill="${accent}" fill-opacity="0.6"/>
      <rect x="520" y="235" width="70" height="10" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
    `
  },
  wireframes(accent) {
    return `
      <rect x="150" y="130" width="220" height="260" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4"/>
      <rect x="170" y="155" width="180" height="40" rx="8" fill="${accent}" fill-opacity="0.2"/>
      <rect x="170" y="215" width="80" height="80" rx="8" fill="${accent}" fill-opacity="0.12"/>
      <rect x="270" y="215" width="80" height="80" rx="8" fill="${accent}" fill-opacity="0.12"/>
      <rect x="170" y="315" width="180" height="40" rx="8" fill="#94a3b8" fill-opacity="0.15"/>
      <rect x="420" y="150" width="230" height="220" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.35"/>
      <rect x="445" y="180" width="180" height="12" rx="4" fill="${accent}" fill-opacity="0.7"/>
      <rect x="445" y="210" width="140" height="10" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="445" y="235" width="160" height="10" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
    `
  },
  phone(accent) {
    return `
      <rect x="310" y="90" width="180" height="320" rx="28" fill="#0b1526" stroke="${accent}" stroke-opacity="0.55" stroke-width="3"/>
      <rect x="328" y="120" width="144" height="240" rx="8" fill="${accent}" fill-opacity="0.1"/>
      <rect x="350" y="150" width="100" height="12" rx="4" fill="${accent}" fill-opacity="0.75"/>
      <rect x="340" y="180" width="120" height="80" rx="10" fill="${accent}" fill-opacity="0.2"/>
      <rect x="350" y="280" width="100" height="36" rx="10" fill="${accent}" fill-opacity="0.55"/>
      <rect x="375" y="380" width="50" height="6" rx="3" fill="#64748b"/>
    `
  },
  dashboard(accent) {
    return `
      <rect x="130" y="120" width="540" height="280" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.35"/>
      <rect x="130" y="120" width="120" height="280" fill="#111c30"/>
      <rect x="150" y="150" width="80" height="10" rx="3" fill="${accent}" fill-opacity="0.7"/>
      <rect x="150" y="180" width="70" height="8" rx="3" fill="#64748b"/>
      <rect x="150" y="205" width="70" height="8" rx="3" fill="#64748b"/>
      <rect x="280" y="150" width="160" height="90" rx="12" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-opacity="0.35"/>
      <rect x="460" y="150" width="180" height="90" rx="12" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-opacity="0.3"/>
      <path d="M290 320l50-40 40 20 70-55 60 30" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    `
  },
  nodes(accent) {
    return `
      <circle cx="250" cy="200" r="28" fill="${accent}" fill-opacity="0.8"/>
      <circle cx="400" cy="160" r="34" fill="#38bdf8" fill-opacity="0.7"/>
      <circle cx="520" cy="230" r="30" fill="#2dd4bf" fill-opacity="0.75"/>
      <circle cx="360" cy="320" r="26" fill="${accent}" fill-opacity="0.55"/>
      <path d="M275 210 L370 175 M430 175 L495 220 M400 194 L370 295 M500 245 L385 310" stroke="${accent}" stroke-opacity="0.45" stroke-width="2"/>
    `
  },
  megaphone(accent) {
    return `
      <path d="M220 240 L360 180 L360 300 Z" fill="${accent}" fill-opacity="0.75"/>
      <rect x="360" y="210" width="90" height="60" rx="10" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <path d="M470 170c50 40 50 120 0 160M510 140c80 60 80 180 0 240" fill="none" stroke="${accent}" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round"/>
      <circle cx="250" cy="320" r="18" fill="#38bdf8" fill-opacity="0.6"/>
    `
  },
  shield(accent) {
    return `
      <path d="M400 100 L520 150 V250 C520 330 400 380 400 380 C400 380 280 330 280 250 V150 Z" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="3"/>
      <path d="M355 240 L390 275 L455 200" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  briefcase(accent) {
    return `
      <rect x="240" y="180" width="320" height="180" rx="20" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" stroke-width="3"/>
      <rect x="340" y="140" width="120" height="50" rx="12" fill="#111c30" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>
      <rect x="360" y="250" width="80" height="16" rx="6" fill="${accent}" fill-opacity="0.7"/>
      <line x1="240" y1="230" x2="560" y2="230" stroke="${accent}" stroke-opacity="0.3" stroke-width="2"/>
    `
  },
  roadmap(accent) {
    return `
      <circle cx="200" cy="280" r="18" fill="${accent}"/>
      <circle cx="340" cy="180" r="18" fill="#38bdf8"/>
      <circle cx="480" cy="240" r="18" fill="#2dd4bf"/>
      <circle cx="600" cy="150" r="18" fill="#67e8f9"/>
      <path d="M218 270 L322 190 M358 185 L462 230 M498 230 L582 160" stroke="${accent}" stroke-opacity="0.5" stroke-width="3" stroke-dasharray="8 6"/>
      <rect x="170" y="310" width="60" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
      <rect x="310" y="210" width="60" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
      <rect x="450" y="270" width="60" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
    `
  },
  document(accent) {
    return `
      <rect x="280" y="100" width="240" height="300" rx="14" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" stroke-width="2"/>
      <rect x="310" y="140" width="140" height="14" rx="4" fill="${accent}" fill-opacity="0.8"/>
      <rect x="310" y="175" width="180" height="8" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="310" y="195" width="170" height="8" rx="3" fill="#94a3b8" fill-opacity="0.28"/>
      <rect x="310" y="215" width="160" height="8" rx="3" fill="#94a3b8" fill-opacity="0.22"/>
      <rect x="310" y="250" width="100" height="8" rx="3" fill="${accent}" fill-opacity="0.4"/>
      <rect x="310" y="270" width="150" height="8" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="310" y="290" width="140" height="8" rx="3" fill="#94a3b8" fill-opacity="0.2"/>
    `
  },
  envelope(accent) {
    return `
      <rect x="180" y="160" width="440" height="220" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" stroke-width="3"/>
      <path d="M180 180 L400 300 L620 180" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.7"/>
      <path d="M180 360 L340 260 M620 360 L460 260" fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.35"/>
    `
  },
  linkedin(accent) {
    return `
      <rect x="260" y="120" width="280" height="280" rx="24" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" stroke-width="3"/>
      <circle cx="340" cy="220" r="36" fill="${accent}" fill-opacity="0.75"/>
      <rect x="390" y="195" width="110" height="14" rx="4" fill="${accent}" fill-opacity="0.7"/>
      <rect x="390" y="220" width="90" height="10" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="300" y="290" width="200" height="10" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="300" y="315" width="160" height="10" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
    `
  },
  taxForm(accent) {
    return `
      <rect x="220" y="110" width="360" height="280" rx="14" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" stroke-width="2"/>
      <rect x="250" y="140" width="120" height="16" rx="4" fill="${accent}" fill-opacity="0.75"/>
      <rect x="250" y="180" width="300" height="36" rx="8" fill="#111c30" stroke="${accent}" stroke-opacity="0.25"/>
      <rect x="250" y="235" width="300" height="36" rx="8" fill="#111c30" stroke="${accent}" stroke-opacity="0.25"/>
      <rect x="250" y="290" width="180" height="36" rx="8" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-opacity="0.4"/>
      <text x="520" y="165" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="28" font-weight="700">KRA</text>
    `
  },
  pinKey(accent) {
    return `
      <circle cx="340" cy="220" r="70" fill="none" stroke="${accent}" stroke-width="10"/>
      <circle cx="340" cy="220" r="28" fill="${accent}" fill-opacity="0.7"/>
      <rect x="400" y="205" width="160" height="30" rx="8" fill="${accent}" fill-opacity="0.65"/>
      <rect x="520" y="205" width="18" height="50" rx="4" fill="${accent}" fill-opacity="0.55"/>
      <rect x="550" y="205" width="18" height="40" rx="4" fill="${accent}" fill-opacity="0.45"/>
    `
  },
  osDisk(accent) {
    return `
      <circle cx="400" cy="240" r="120" fill="#0b1526" stroke="${accent}" stroke-width="4" stroke-opacity="0.55"/>
      <circle cx="400" cy="240" r="70" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.35"/>
      <circle cx="400" cy="240" r="22" fill="${accent}" fill-opacity="0.8"/>
      <path d="M400 120 A120 120 0 0 1 520 240" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
    `
  },
  officeApps(accent) {
    return `
      <rect x="180" y="150" width="120" height="120" rx="18" fill="${accent}" fill-opacity="0.75"/>
      <rect x="330" y="150" width="120" height="120" rx="18" fill="#38bdf8" fill-opacity="0.65"/>
      <rect x="480" y="150" width="120" height="120" rx="18" fill="#2dd4bf" fill-opacity="0.6"/>
      <rect x="255" y="300" width="290" height="50" rx="12" fill="#0b1526" stroke="${accent}" stroke-opacity="0.45"/>
      <text x="400" y="332" text-anchor="middle" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="18" font-weight="600">Office ready</text>
    `
  },
  bugReport(accent) {
    return `
      <rect x="200" y="130" width="400" height="260" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4"/>
      <circle cx="260" cy="200" r="16" fill="#f87171"/>
      <rect x="300" y="192" width="220" height="14" rx="4" fill="#94a3b8" fill-opacity="0.4"/>
      <circle cx="260" cy="250" r="16" fill="#fbbf24"/>
      <rect x="300" y="242" width="180" height="14" rx="4" fill="#94a3b8" fill-opacity="0.35"/>
      <circle cx="260" cy="300" r="16" fill="#34d399"/>
      <rect x="300" y="292" width="200" height="14" rx="4" fill="#94a3b8" fill-opacity="0.3"/>
    `
  },
  testCycle(accent) {
    return `
      <circle cx="400" cy="240" r="100" fill="none" stroke="${accent}" stroke-width="6" stroke-dasharray="28 14"/>
      <path d="M400 140 L420 165 L380 165 Z" fill="${accent}"/>
      <rect x="340" y="210" width="120" height="60" rx="10" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-opacity="0.5"/>
      <text x="400" y="247" text-anchor="middle" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="16" font-weight="700">QA</text>
    `
  },
  brandSession(accent) {
    return `
      <rect x="160" y="140" width="200" height="240" rx="14" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4"/>
      <rect x="190" y="180" width="140" height="14" rx="4" fill="${accent}" fill-opacity="0.7"/>
      <rect x="190" y="215" width="100" height="10" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <circle cx="520" cy="240" r="90" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="3"/>
      <text x="520" y="250" text-anchor="middle" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="36" font-weight="700">Aa</text>
    `
  },
  brandKit(accent) {
    return `
      <rect x="150" y="140" width="150" height="200" rx="12" fill="${accent}" fill-opacity="0.7"/>
      <rect x="325" y="140" width="150" height="200" rx="12" fill="#38bdf8" fill-opacity="0.55"/>
      <rect x="500" y="140" width="150" height="200" rx="12" fill="#2dd4bf" fill-opacity="0.45"/>
      <text x="225" y="250" text-anchor="middle" fill="#041018" font-family="Outfit, system-ui, sans-serif" font-size="42" font-weight="800">A</text>
      <text x="400" y="250" text-anchor="middle" fill="#041018" font-family="Outfit, system-ui, sans-serif" font-size="28" font-weight="700">12</text>
      <text x="575" y="250" text-anchor="middle" fill="#041018" font-family="Outfit, system-ui, sans-serif" font-size="22" font-weight="700">Aa</text>
    `
  },
  rebrand(accent) {
    return `
      <path d="M250 280c0-80 60-140 150-140s150 60 150 140" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round" opacity="0.45"/>
      <path d="M280 300c20-90 80-140 120-140 50 0 110 55 140 140" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="400" cy="160" r="24" fill="${accent}"/>
      <text x="400" y="350" text-anchor="middle" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="20" font-weight="600">Refresh</text>
    `
  },
  tshirt(accent) {
    return `
      <path d="M300 150 L360 120 L400 160 L440 120 L500 150 L470 190 L470 340 L330 340 L330 190 Z" fill="#0b1526" stroke="${accent}" stroke-width="3" stroke-opacity="0.6"/>
      <circle cx="400" cy="240" r="28" fill="${accent}" fill-opacity="0.7"/>
      <text x="400" y="248" text-anchor="middle" fill="#041018" font-family="Outfit, system-ui, sans-serif" font-size="18" font-weight="800">ET</text>
    `
  },
  cap(accent) {
    return `
      <ellipse cx="400" cy="220" rx="140" ry="50" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <path d="M280 220 Q400 80 520 220" fill="${accent}" fill-opacity="0.55"/>
      <ellipse cx="470" cy="250" rx="90" ry="22" fill="#111c30" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>
      <circle cx="400" cy="180" r="16" fill="#0b1526"/>
    `
  },
  hoodie(accent) {
    return `
      <path d="M310 160 L360 130 Q400 170 440 130 L490 160 L470 200 L470 360 L330 360 L330 200 Z" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <path d="M360 130 Q400 90 440 130" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.6"/>
      <path d="M370 220 Q400 250 430 220" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="400" cy="290" r="22" fill="${accent}" fill-opacity="0.65"/>
    `
  },
  clothing(accent) {
    return `
      <rect x="220" y="150" width="140" height="200" rx="14" fill="#0b1526" stroke="${accent}" stroke-opacity="0.45"/>
      <rect x="390" y="150" width="140" height="200" rx="14" fill="#0b1526" stroke="#38bdf8" stroke-opacity="0.45"/>
      <circle cx="290" cy="220" r="20" fill="${accent}" fill-opacity="0.7"/>
      <circle cx="460" cy="220" r="20" fill="#38bdf8" fill-opacity="0.7"/>
      <path d="M560 180 L620 240 L560 300" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
    `
  },
  phoneCase(accent) {
    return `
      <rect x="300" y="90" width="200" height="340" rx="32" fill="#0b1526" stroke="${accent}" stroke-width="4"/>
      <rect x="320" y="120" width="160" height="260" rx="12" fill="url(#g)" opacity="0.9"/>
      <circle cx="400" cy="400" r="10" fill="${accent}" fill-opacity="0.6"/>
    `
  },
  socialGrid(accent) {
    return `
      <rect x="170" y="130" width="130" height="130" rx="16" fill="${accent}" fill-opacity="0.7"/>
      <rect x="320" y="130" width="130" height="130" rx="16" fill="#38bdf8" fill-opacity="0.55"/>
      <rect x="470" y="130" width="130" height="130" rx="16" fill="#2dd4bf" fill-opacity="0.5"/>
      <rect x="170" y="280" width="130" height="100" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4"/>
      <rect x="320" y="280" width="130" height="100" rx="16" fill="#0b1526" stroke="#38bdf8" stroke-opacity="0.4"/>
      <rect x="470" y="280" width="130" height="100" rx="16" fill="#0b1526" stroke="#2dd4bf" stroke-opacity="0.4"/>
    `
  },
  posterOne(accent) {
    return `
      <rect x="260" y="90" width="280" height="340" rx="12" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <rect x="290" y="130" width="220" height="120" rx="8" fill="${accent}" fill-opacity="0.55"/>
      <rect x="290" y="280" width="160" height="14" rx="4" fill="#f8fafc" fill-opacity="0.85"/>
      <rect x="290" y="310" width="120" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
      <rect x="290" y="360" width="90" height="28" rx="8" fill="${accent}"/>
    `
  },
  posterSet(accent) {
    return `
      <rect x="150" y="130" width="160" height="240" rx="10" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" transform="rotate(-6 230 250)"/>
      <rect x="320" y="110" width="160" height="260" rx="10" fill="#0b1526" stroke="#38bdf8" stroke-opacity="0.55"/>
      <rect x="490" y="130" width="160" height="240" rx="10" fill="#0b1526" stroke="#2dd4bf" stroke-opacity="0.5" transform="rotate(6 570 250)"/>
      <rect x="345" y="150" width="110" height="70" rx="6" fill="#38bdf8" fill-opacity="0.5"/>
    `
  },
  flyer(accent) {
    return `
      <rect x="250" y="100" width="300" height="320" rx="10" fill="#0b1526" stroke="${accent}" stroke-width="2"/>
      <rect x="275" y="130" width="250" height="90" rx="8" fill="${accent}" fill-opacity="0.45"/>
      <rect x="275" y="250" width="180" height="12" rx="4" fill="#f8fafc" fill-opacity="0.8"/>
      <rect x="275" y="280" width="220" height="8" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="275" y="300" width="200" height="8" rx="3" fill="#94a3b8" fill-opacity="0.28"/>
      <circle cx="480" cy="360" r="24" fill="${accent}" fill-opacity="0.7"/>
    `
  },
  businessCard(accent) {
    return `
      <rect x="170" y="160" width="460" height="220" rx="16" fill="#0b1526" stroke="${accent}" stroke-opacity="0.55" stroke-width="3"/>
      <circle cx="250" cy="270" r="36" fill="${accent}" fill-opacity="0.75"/>
      <rect x="320" y="230" width="180" height="16" rx="4" fill="${accent}" fill-opacity="0.8"/>
      <rect x="320" y="265" width="140" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
      <rect x="320" y="290" width="120" height="10" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
    `
  },
  letterhead(accent) {
    return `
      <rect x="220" y="90" width="360" height="340" rx="8" fill="#0b1526" stroke="${accent}" stroke-opacity="0.4"/>
      <rect x="250" y="120" width="80" height="28" rx="4" fill="${accent}" fill-opacity="0.8"/>
      <rect x="250" y="180" width="280" height="8" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="250" y="205" width="260" height="8" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="250" y="230" width="240" height="8" rx="3" fill="#94a3b8" fill-opacity="0.2"/>
      <rect x="250" y="380" width="120" height="8" rx="3" fill="${accent}" fill-opacity="0.45"/>
    `
  },
  envelopeBrand(accent) {
    return `
      <rect x="160" y="170" width="480" height="200" rx="12" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <path d="M160 180 L400 310 L640 180" fill="none" stroke="${accent}" stroke-width="3"/>
      <circle cx="220" cy="230" r="22" fill="${accent}" fill-opacity="0.7"/>
      <rect x="260" y="220" width="100" height="10" rx="3" fill="#94a3b8" fill-opacity="0.4"/>
    `
  },
  compliment(accent) {
    return `
      <rect x="200" y="150" width="400" height="220" rx="14" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" stroke-width="2"/>
      <rect x="240" y="190" width="70" height="24" rx="4" fill="${accent}" fill-opacity="0.75"/>
      <text x="400" y="280" text-anchor="middle" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="22" font-weight="600" font-style="italic">With compliments</text>
      <rect x="300" y="310" width="200" height="6" rx="2" fill="#94a3b8" fill-opacity="0.3"/>
    `
  },
  stamp(accent) {
    return `
      <circle cx="400" cy="240" r="110" fill="none" stroke="${accent}" stroke-width="8" stroke-dasharray="18 10"/>
      <circle cx="400" cy="240" r="80" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.5"/>
      <text x="400" y="235" text-anchor="middle" fill="${accent}" font-family="Outfit, system-ui, sans-serif" font-size="22" font-weight="800">SEAL</text>
      <text x="400" y="265" text-anchor="middle" fill="#94a3b8" font-family="Outfit, system-ui, sans-serif" font-size="12" letter-spacing="3">OFFICIAL</text>
    `
  },
  stationeryPack(accent) {
    return `
      <rect x="150" y="140" width="180" height="120" rx="10" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5" transform="rotate(-8 240 200)"/>
      <rect x="310" y="120" width="200" height="260" rx="10" fill="#0b1526" stroke="#38bdf8" stroke-opacity="0.5"/>
      <rect x="480" y="180" width="180" height="100" rx="10" fill="#0b1526" stroke="#2dd4bf" stroke-opacity="0.5" transform="rotate(8 570 230)"/>
      <circle cx="620" cy="320" r="40" fill="none" stroke="${accent}" stroke-width="4"/>
    `
  },
  transform(accent) {
    return `
      <rect x="160" y="160" width="200" height="200" rx="16" fill="#0b1526" stroke="#64748b" stroke-opacity="0.5" stroke-width="2"/>
      <path d="M380 260 L430 260" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
      <path d="M415 240 L445 260 L415 280" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="460" y="160" width="200" height="200" rx="16" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="3"/>
      <circle cx="560" cy="260" r="36" fill="${accent}" fill-opacity="0.7"/>
    `
  },
  coverLetter(accent) {
    return `
      <rect x="240" y="100" width="320" height="320" rx="12" fill="#0b1526" stroke="${accent}" stroke-opacity="0.45"/>
      <rect x="280" y="150" width="160" height="12" rx="4" fill="${accent}" fill-opacity="0.7"/>
      <rect x="280" y="190" width="240" height="8" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="280" y="215" width="220" height="8" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="280" y="240" width="230" height="8" rx="3" fill="#94a3b8" fill-opacity="0.22"/>
      <rect x="280" y="265" width="200" height="8" rx="3" fill="#94a3b8" fill-opacity="0.2"/>
      <rect x="280" y="320" width="100" height="10" rx="3" fill="${accent}" fill-opacity="0.5"/>
    `
  },
  careerBundle(accent) {
    return `
      <rect x="150" y="140" width="150" height="200" rx="12" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5"/>
      <rect x="325" y="160" width="150" height="200" rx="12" fill="#0b1526" stroke="#38bdf8" stroke-opacity="0.5"/>
      <rect x="500" y="180" width="150" height="200" rx="12" fill="#0b1526" stroke="#2dd4bf" stroke-opacity="0.5"/>
      <rect x="175" y="175" width="100" height="10" rx="3" fill="${accent}" fill-opacity="0.7"/>
      <rect x="350" y="195" width="100" height="10" rx="3" fill="#38bdf8" fill-opacity="0.7"/>
      <rect x="525" y="215" width="100" height="10" rx="3" fill="#2dd4bf" fill-opacity="0.7"/>
    `
  },
  seniorDoc(accent) {
    return `
      <rect x="260" y="100" width="280" height="320" rx="12" fill="#0b1526" stroke="${accent}" stroke-width="2"/>
      <rect x="290" y="130" width="80" height="80" rx="40" fill="${accent}" fill-opacity="0.7"/>
      <rect x="390" y="150" width="120" height="12" rx="4" fill="${accent}" fill-opacity="0.8"/>
      <rect x="390" y="175" width="90" height="8" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="290" y="240" width="220" height="8" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="290" y="265" width="200" height="8" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="290" y="290" width="180" height="8" rx="3" fill="#94a3b8" fill-opacity="0.2"/>
    `
  },
  execDoc(accent) {
    return `
      <rect x="240" y="100" width="320" height="320" rx="12" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <rect x="240" y="100" width="320" height="48" fill="${accent}" fill-opacity="0.75"/>
      <text x="400" y="132" text-anchor="middle" fill="#041018" font-family="Outfit, system-ui, sans-serif" font-size="18" font-weight="800">EXECUTIVE</text>
      <rect x="280" y="180" width="240" height="12" rx="4" fill="#f8fafc" fill-opacity="0.7"/>
      <rect x="280" y="215" width="200" height="8" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="280" y="245" width="220" height="8" rx="3" fill="#94a3b8" fill-opacity="0.28"/>
      <rect x="280" y="275" width="180" height="8" rx="3" fill="#94a3b8" fill-opacity="0.22"/>
    `
  },
  midDoc(accent) {
    return `
      <rect x="250" y="110" width="300" height="300" rx="12" fill="#0b1526" stroke="${accent}" stroke-opacity="0.5"/>
      <rect x="280" y="150" width="120" height="14" rx="4" fill="${accent}" fill-opacity="0.75"/>
      <rect x="280" y="190" width="60" height="24" rx="6" fill="${accent}" fill-opacity="0.25"/>
      <rect x="355" y="190" width="60" height="24" rx="6" fill="#38bdf8" fill-opacity="0.25"/>
      <rect x="430" y="190" width="60" height="24" rx="6" fill="#2dd4bf" fill-opacity="0.25"/>
      <rect x="280" y="250" width="220" height="8" rx="3" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="280" y="280" width="200" height="8" rx="3" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="280" y="310" width="180" height="8" rx="3" fill="#94a3b8" fill-opacity="0.2"/>
    `
  },
  resumeBuild(accent) {
    return `
      <rect x="270" y="100" width="260" height="320" rx="12" fill="#0b1526" stroke="${accent}" stroke-width="2"/>
      <rect x="300" y="130" width="100" height="12" rx="4" fill="${accent}"/>
      <rect x="300" y="165" width="200" height="6" rx="2" fill="#94a3b8" fill-opacity="0.35"/>
      <rect x="300" y="185" width="180" height="6" rx="2" fill="#94a3b8" fill-opacity="0.28"/>
      <rect x="300" y="230" width="80" height="8" rx="3" fill="${accent}" fill-opacity="0.6"/>
      <rect x="300" y="255" width="190" height="6" rx="2" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="300" y="275" width="170" height="6" rx="2" fill="#94a3b8" fill-opacity="0.25"/>
      <path d="M560 180l40 40-40 40" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
    `
  },
  resumeRevamp(accent) {
    return `
      <rect x="180" y="130" width="200" height="260" rx="10" fill="#0b1526" stroke="#64748b" stroke-opacity="0.45" opacity="0.7"/>
      <path d="M400 260 L450 260" stroke="${accent}" stroke-width="4"/>
      <path d="M435 240 L465 260 L435 280" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
      <rect x="480" y="130" width="200" height="260" rx="10" fill="#0b1526" stroke="${accent}" stroke-width="3"/>
      <rect x="510" y="170" width="120" height="12" rx="4" fill="${accent}" fill-opacity="0.8"/>
      <rect x="510" y="210" width="140" height="8" rx="3" fill="#94a3b8" fill-opacity="0.35"/>
    `
  },
  webPro(accent) {
    return `
      <rect x="120" y="120" width="560" height="280" rx="18" fill="#0b1526" stroke="${accent}" stroke-opacity="0.45" stroke-width="2"/>
      <rect x="120" y="120" width="560" height="48" fill="#111c30"/>
      <circle cx="150" cy="144" r="6" fill="#f87171"/><circle cx="170" cy="144" r="6" fill="#fbbf24"/><circle cx="190" cy="144" r="6" fill="#34d399"/>
      <rect x="150" y="200" width="160" height="160" rx="12" fill="${accent}" fill-opacity="0.15"/>
      <rect x="340" y="200" width="300" height="20" rx="6" fill="${accent}" fill-opacity="0.75"/>
      <rect x="340" y="240" width="260" height="12" rx="4" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="340" y="270" width="220" height="12" rx="4" fill="#94a3b8" fill-opacity="0.25"/>
      <rect x="340" y="310" width="100" height="36" rx="10" fill="${accent}"/>
    `
  },
}

/** @type {Spec[]} */
const specs = [
  { id: 'shop_starter_web', label: 'Website Starter', hue: '#042f2e', accent: '#2dd4bf', motif: 'browser' },
  { id: 'shop_business_web', label: 'Website Pro', hue: '#0c4a6e', accent: '#38bdf8', motif: 'webPro' },
  { id: 'shop_ecommerce', label: 'E-commerce', hue: '#134e4a', accent: '#5eead4', motif: 'storefront' },
  { id: 'shop_logo_pack', label: 'Logo Pack', hue: '#164e63', accent: '#22d3ee', motif: 'logoMark' },
  { id: 'shop_brand_kit', label: 'Brand Kit', hue: '#0e7490', accent: '#67e8f9', motif: 'palette' },
  { id: 'shop_uiux', label: 'UI / UX', hue: '#1e3a5f', accent: '#7dd3fc', motif: 'wireframes' },
  { id: 'design_web_landing', label: 'Web Design', hue: '#042f2e', accent: '#2dd4bf', motif: 'browser' },
  { id: 'design_web_multipage', label: 'Multi-Page Design', hue: '#0c4a6e', accent: '#38bdf8', motif: 'webPro' },
  { id: 'design_web_system', label: 'Design System', hue: '#164e63', accent: '#67e8f9', motif: 'wireframes' },
  { id: 'design_product_discovery', label: 'Product Discovery', hue: '#0f172a', accent: '#22d3ee', motif: 'wireframes' },
  { id: 'design_product_core', label: 'Product Design', hue: '#1e3a5f', accent: '#7dd3fc', motif: 'palette' },
  { id: 'design_product_full', label: 'Full Product Design', hue: '#083344', accent: '#2dd4bf', motif: 'dashboard' },
  { id: 'shop_mobile_app', label: 'Mobile MVP', hue: '#0f172a', accent: '#22d3ee', motif: 'phone' },
  { id: 'shop_custom_software', label: 'Custom Software', hue: '#0b2447', accent: '#38bdf8', motif: 'dashboard' },
  { id: 'shop_ai_automation', label: 'AI Automation', hue: '#083344', accent: '#22d3ee', motif: 'nodes' },
  { id: 'shop_digital_marketing', label: 'Marketing', hue: '#1c1917', accent: '#38bdf8', motif: 'megaphone' },
  { id: 'marketing_strategy_session', label: 'Strategy Session', hue: '#1c1917', accent: '#67e8f9', motif: 'briefcase' },
  { id: 'marketing_strategy_gtm', label: 'Go-to-Market', hue: '#0c4a6e', accent: '#38bdf8', motif: 'megaphone' },
  { id: 'marketing_strategy_roadmap', label: 'Growth Roadmap', hue: '#083344', accent: '#22d3ee', motif: 'roadmap' },
  { id: 'shop_cyber_audit', label: 'Cyber Review', hue: '#0f172a', accent: '#2dd4bf', motif: 'shield' },
  { id: 'consult_it_halfday', label: 'IT Half Day', hue: '#111827', accent: '#67e8f9', motif: 'briefcase' },
  { id: 'consult_it_fullday', label: 'IT Full Day', hue: '#0f172a', accent: '#22d3ee', motif: 'dashboard' },
  { id: 'consult_tech_roadmap', label: 'Tech Roadmap', hue: '#082f49', accent: '#38bdf8', motif: 'roadmap' },
  { id: 'consult_digital_transform', label: 'Transformation', hue: '#042f2e', accent: '#2dd4bf', motif: 'transform' },
  { id: 'consult_cloud_readiness', label: 'Cloud Readiness', hue: '#082f49', accent: '#38bdf8', motif: 'nodes' },
  { id: 'consult_cloud_migration', label: 'Cloud Migration', hue: '#0c4a6e', accent: '#67e8f9', motif: 'roadmap' },
  { id: 'consult_cloud_programme', label: 'Infra Programme', hue: '#0f172a', accent: '#22d3ee', motif: 'dashboard' },
  { id: 'career_resume_revamp', label: 'CV Revamp', hue: '#0f172a', accent: '#67e8f9', motif: 'resumeRevamp' },
  { id: 'career_resume_build', label: 'ATS Resume', hue: '#0c4a6e', accent: '#38bdf8', motif: 'resumeBuild' },
  { id: 'career_resume_mid', label: 'Mid-Career CV', hue: '#164e63', accent: '#22d3ee', motif: 'midDoc' },
  { id: 'career_resume_senior', label: 'Senior CV', hue: '#1e3a5f', accent: '#7dd3fc', motif: 'seniorDoc' },
  { id: 'career_resume_executive', label: 'Executive CV', hue: '#0f172a', accent: '#e2e8f0', motif: 'execDoc' },
  { id: 'career_cover_letter', label: 'Cover Letter', hue: '#111827', accent: '#67e8f9', motif: 'coverLetter' },
  { id: 'career_linkedin', label: 'LinkedIn', hue: '#0c4a6e', accent: '#38bdf8', motif: 'linkedin' },
  { id: 'career_docs_bundle', label: 'Career Bundle', hue: '#083344', accent: '#22d3ee', motif: 'careerBundle' },
  { id: 'tax_kenya_return', label: 'Tax Return', hue: '#14532d', accent: '#4ade80', motif: 'taxForm' },
  { id: 'tax_kenya_pin_assist', label: 'KRA PIN Assist', hue: '#064e3b', accent: '#34d399', motif: 'pinKey' },
  { id: 'tech_os_install', label: 'OS Install', hue: '#1e3a8a', accent: '#60a5fa', motif: 'osDisk' },
  { id: 'tech_os_install_office', label: 'OS + Office', hue: '#1e40af', accent: '#93c5fd', motif: 'officeApps' },
  { id: 'tech_app_testing', label: 'App Testing', hue: '#7c2d12', accent: '#fb923c', motif: 'bugReport' },
  { id: 'tech_app_testing_full', label: 'Full QA Cycle', hue: '#9a3412', accent: '#fdba74', motif: 'testCycle' },
  { id: 'brand_identity_session', label: 'Brand Session', hue: '#164e63', accent: '#22d3ee', motif: 'brandSession' },
  { id: 'brand_full_kit', label: 'Full Brand Kit', hue: '#0e7490', accent: '#67e8f9', motif: 'brandKit' },
  { id: 'brand_rebrand', label: 'Business Rebrand', hue: '#083344', accent: '#2dd4bf', motif: 'rebrand' },
  { id: 'merch_tshirt', label: 'Branded Tee', hue: '#0f172a', accent: '#22d3ee', motif: 'tshirt' },
  { id: 'merch_cap', label: 'Branded Cap', hue: '#111827', accent: '#38bdf8', motif: 'cap' },
  { id: 'merch_hoodie', label: 'Branded Hoodie', hue: '#0c4a6e', accent: '#67e8f9', motif: 'hoodie' },
  { id: 'merch_clothing_custom', label: 'Custom Apparel', hue: '#164e63', accent: '#2dd4bf', motif: 'clothing' },
  { id: 'merch_phone_case', label: 'Phone Case', hue: '#0f172a', accent: '#22d3ee', motif: 'phoneCase' },
  { id: 'design_graphics_pack', label: 'Graphics Pack', hue: '#083344', accent: '#22d3ee', motif: 'socialGrid' },
  { id: 'design_campaign_poster', label: 'Campaign Poster', hue: '#0c4a6e', accent: '#38bdf8', motif: 'posterOne' },
  { id: 'design_poster_set', label: 'Poster Set', hue: '#164e63', accent: '#67e8f9', motif: 'posterSet' },
  { id: 'design_flyer', label: 'Flyer Design', hue: '#134e4a', accent: '#5eead4', motif: 'flyer' },
  { id: 'design_business_cards', label: 'Business Cards', hue: '#0f172a', accent: '#22d3ee', motif: 'businessCard' },
  { id: 'stationery_letterhead', label: 'Letterhead', hue: '#111827', accent: '#38bdf8', motif: 'letterhead' },
  { id: 'stationery_envelopes', label: 'Envelopes', hue: '#0c4a6e', accent: '#67e8f9', motif: 'envelopeBrand' },
  { id: 'stationery_comp_slips', label: 'Compliment Slips', hue: '#164e63', accent: '#2dd4bf', motif: 'compliment' },
  { id: 'stationery_stamp_seal', label: 'Stamp / Seal', hue: '#083344', accent: '#22d3ee', motif: 'stamp' },
  { id: 'stationery_full_pack', label: 'Stationery Pack', hue: '#0f172a', accent: '#38bdf8', motif: 'stationeryPack' },
]

function svgFor(spec) {
  const draw = motifs[spec.motif]
  if (!draw) throw new Error(`Missing motif: ${spec.motif}`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" role="img" aria-label="${spec.label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.hue}"/>
      <stop offset="55%" stop-color="#070f1c"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.accent}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.35"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="20%" r="50%">
      <stop offset="0%" stop-color="${spec.accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${spec.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <rect width="800" height="500" fill="url(#glow)"/>
  <circle cx="80" cy="420" r="120" fill="${spec.accent}" fill-opacity="0.06"/>
  <circle cx="720" cy="60" r="90" fill="${spec.accent}" fill-opacity="0.08"/>
  ${draw(spec.accent)}
  <rect x="0" y="420" width="800" height="80" fill="#030712" fill-opacity="0.55"/>
  <text x="40" y="468" fill="${spec.accent}" font-family="Outfit, DM Sans, system-ui, sans-serif" font-size="22" font-weight="700" letter-spacing="0.04em">${spec.label}</text>
  <text x="760" y="468" text-anchor="end" fill="#94a3b8" font-family="Outfit, system-ui, sans-serif" font-size="13" font-weight="500">Ellines Tech</text>
</svg>
`
}

let written = 0
for (const spec of specs) {
  const file = join(outDir, `${spec.id}.svg`)
  writeFileSync(file, svgFor(spec), 'utf8')
  written++
}

console.log(`Wrote ${written} package posters to ${outDir}`)
