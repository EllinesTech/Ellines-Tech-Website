import fs from 'node:fs'
import path from 'node:path'

const root = 'B:\\Ellines Tech Website'
const src = path.join(root, 'Ellines businesses logos')
const dest = path.join(root, 'public', 'business-logos')
fs.mkdirSync(dest, { recursive: true })

const map = [
  ['Ellines Group logo.png', 'ellines-group.png'],
  ['Ellines Group logo big.png', 'ellines-group-big.png'],
  ['Ellines Haven logo.png', 'ellines-haven.png'],
  ['Ellines Rattan Logo.png', 'ellines-rattan.png'],
  ['ellinesrt_logo-.png', 'ellines-rattan-alt.png'],
  ['Juno4 Round Logo.png', 'juno4.png'],
  ['RV22 AI logo.png', 'rv22-ai.png'],
]

for (const [from, to] of map) {
  const a = path.join(src, from)
  const b = path.join(dest, to)
  fs.copyFileSync(a, b)
  console.log('copied', to, fs.statSync(b).size)
}
