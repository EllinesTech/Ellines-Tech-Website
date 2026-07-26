import { starterPricingPackages } from '../src/data/pricingPackages.ts'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
}))
const out = join(__dirname, '_shop-seed.json')
writeFileSync(out, JSON.stringify(body, null, 2))
console.log('wrote', body.length, 'to', out)
