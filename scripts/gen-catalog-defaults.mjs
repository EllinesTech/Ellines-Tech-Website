import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function extractArray(src, name) {
  const marker = `export const ${name}`
  const start = src.indexOf(marker)
  if (start < 0) throw new Error(`missing ${name}`)
  const eq = src.indexOf('=', start)
  const bracket = src.indexOf('[', eq)
  let depth = 0
  let end = -1
  for (let i = bracket; i < src.length; i++) {
    const ch = src[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  if (end < 0) throw new Error(`unclosed ${name}`)
  // Evaluate as JS expression (data files only use string/array literals)
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${src.slice(bracket, end)});`)()
}

const products = extractArray(readFileSync(join(root, 'src/data/products.ts'), 'utf8'), 'products')
const portfolioProjects = extractArray(
  readFileSync(join(root, 'src/data/portfolio.ts'), 'utf8'),
  'portfolioProjects',
)

const productsOut = products.map((p) => ({
  id: 'prod_' + String(p.slug).replace(/-/g, '_'),
  slug: p.slug,
  name: p.name,
  category: p.category,
  tagline: p.tagline,
  description: p.description,
  features: p.features,
  highlights: p.highlights || [],
  image: p.image || '',
  imageFit: p.imageFit || 'cover',
  status: 'published',
}))

const portfolioOut = portfolioProjects.map((p) => ({
  id: 'pf_' + String(p.slug).replace(/-/g, '_'),
  slug: p.slug,
  name: p.name,
  category: p.category,
  client: p.client || '',
  description: p.description,
  technologies: p.technologies,
  results: p.results || [],
  logo: p.logo || '',
  image: p.image || '',
  status: 'published',
}))

writeFileSync(
  join(root, 'functions/api/productsDefaults.js'),
  `/** Seed catalogue for CMS products */\nexport function defaultProducts() {\n  return ${JSON.stringify(productsOut, null, 2)};\n}\n`,
)
writeFileSync(
  join(root, 'functions/api/portfolioDefaults.js'),
  `/** Seed catalogue for CMS portfolio */\nexport function defaultPortfolio() {\n  return ${JSON.stringify(portfolioOut, null, 2)};\n}\n`,
)

console.log('ok', productsOut.length, portfolioOut.length)
