import fs from 'node:fs'

const servicesSrc = fs.readFileSync('src/data/services.ts', 'utf8')
const productsSrc = fs.readFileSync('src/data/products.ts', 'utf8')
const knowledgeSrc = fs.readFileSync('src/data/knowledge.ts', 'utf8')
const svc = [...servicesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
const prod = [...productsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
const resources = [...knowledgeSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
const today = new Date().toISOString().slice(0, 10)
const base = 'https://tech.ellines.co.ke'
const pages = [
  ['/', 1.0, 'weekly'],
  ['/about', 0.9, 'weekly'],
  ['/services', 0.9, 'weekly'],
  ['/products', 0.9, 'weekly'],
  ['/pricing', 0.9, 'weekly'],
  ['/request', 0.7, 'weekly'],
  ['/solutions', 0.7, 'weekly'],
  ['/industries', 0.7, 'weekly'],
  ['/portfolio', 0.7, 'weekly'],
  ['/clients', 0.7, 'weekly'],
  ['/success-stories', 0.7, 'weekly'],
  ['/resources', 0.7, 'weekly'],
  ['/careers', 0.7, 'weekly'],
  ['/contact', 0.9, 'weekly'],
  ['/faq', 0.7, 'weekly'],
  ['/privacy', 0.4, 'monthly'],
  ['/cookies', 0.3, 'monthly'],
  ['/terms', 0.4, 'monthly'],
  ['/shop', 0.7, 'weekly'],
]

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for (const [path, pri, freq] of pages) {
  xml += `  <url><loc>${base}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>\n`
}
for (const s of svc) {
  xml += `  <url><loc>${base}/services/${s}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`
}
for (const p of prod) {
  xml += `  <url><loc>${base}/products/${p}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>\n`
}
for (const slug of resources) {
  xml += `  <url><loc>${base}/resources/${slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.65</priority></url>\n`
}
xml += '</urlset>\n'
fs.writeFileSync('public/sitemap.xml', xml)
console.log(
  `Wrote sitemap: ${pages.length} pages, ${svc.length} services, ${prod.length} products, ${resources.length} resources`,
)
