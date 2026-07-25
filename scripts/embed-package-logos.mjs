import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('public/media/posters/packages')
const logoPath = path.resolve('public/logos/logo-mark-nav.png')
const b64 = fs.readFileSync(logoPath).toString('base64')
const dataUri = `data:image/png;base64,${b64}`
const needle = 'href="/logos/logo-mark-nav.png"'

for (const file of ['shop_starter_web.svg', 'shop_business_web.svg', 'shop_ecommerce.svg']) {
  const full = path.join(root, file)
  let svg = fs.readFileSync(full, 'utf8')
  if (!svg.includes(needle)) {
    console.error('missing logo href in', file)
    process.exitCode = 1
    continue
  }
  svg = svg.split(needle).join(`href="${dataUri}"`)
  fs.writeFileSync(full, svg)
  console.log('embedded logo in', file, `(${fs.statSync(full).size} bytes)`)
}
