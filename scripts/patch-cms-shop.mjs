/**
 * Regenerates functions/api/cms.ts defaultShop() from src/data/pricingPackages.ts
 * and writes scripts/_shop-seed.json for inspection.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { starterPricingPackages } from '../src/data/pricingPackages.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const body = starterPricingPackages.map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  currency: p.currency,
  category: p.category,
  level: p.level,
  description: p.description,
  status: p.status,
  image: p.image,
  groupId: p.groupId,
  groupName: p.groupName,
  tierLabel: p.tierLabel,
  experienceBand: p.experienceBand,
}))

const seedPath = join(__dirname, '_shop-seed.json')
writeFileSync(seedPath, JSON.stringify(body, null, 2))
console.log('wrote', body.length, 'products to', seedPath)

const cmsPath = join(root, 'functions/api/cms.ts')
let cms = readFileSync(cmsPath, 'utf8')
const start = cms.indexOf('function defaultShop() {')
if (start < 0) throw new Error('defaultShop() not found')
const brace = cms.indexOf('{', start)
let depth = 0
let end = -1
for (let i = brace; i < cms.length; i++) {
  const ch = cms[i]
  if (ch === '{') depth++
  else if (ch === '}') {
    depth--
    if (depth === 0) {
      end = i + 1
      break
    }
  }
}
if (end < 0) throw new Error('could not find end of defaultShop')

const json = JSON.stringify(body, null, 2)
  .split('\n')
  .map((line, idx) => (idx === 0 ? line : `  ${line}`))
  .join('\n')

const replacement = `function defaultShop() {\n  return ${json}\n}`
cms = cms.slice(0, start) + replacement + cms.slice(end)
writeFileSync(cmsPath, cms)
console.log('patched defaultShop() in functions/api/cms.ts')
