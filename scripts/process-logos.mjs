/**
 * Build crisp web logos from WITH-BACKGROUND source files:
 * - Flood-fill white backgrounds → transparent
 * - Convert near-black type → light silver (readable on dark UI)
 * - Export retina-sized marks for sharp header rendering
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logoDir = path.join(root, 'Logo')
const founderSrc = path.join(root, 'Founder pictures')
const outLogos = path.join(root, 'public', 'logos')
const outFounder = path.join(root, 'public', 'founder')

fs.mkdirSync(outLogos, { recursive: true })
fs.mkdirSync(outFounder, { recursive: true })

const WHITE = 238
const BLACK_MAX = 48
const SILVER = { r: 232, g: 238, b: 246 }

function floodRemoveBackground(data, width, height, channels) {
  const key = (x, y) => y * width + x
  const visited = new Uint8Array(width * height)
  const queue = []

  const isBg = (i) => {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    return r >= WHITE && g >= WHITE && b >= WHITE
  }

  const seeds = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ]

  for (const [sx, sy] of seeds) {
    const si = (sy * width + sx) * channels
    if (isBg(si)) queue.push([sx, sy])
  }

  while (queue.length) {
    const [x, y] = queue.pop()
    const idx = key(x, y)
    if (visited[idx]) continue
    visited[idx] = 1
    const i = idx * channels
    if (!isBg(i)) continue
    data[i + 3] = 0
    if (x > 0) queue.push([x - 1, y])
    if (x < width - 1) queue.push([x + 1, y])
    if (y > 0) queue.push([x, y - 1])
    if (y < height - 1) queue.push([x, y + 1])
  }

  // Soft fringe cleanup near transparent edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (data[i + 3] === 0) continue
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // leftover near-white halo
      if (r > 220 && g > 220 && b > 220) {
        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ]
        const nearClear = neighbors.some(([nx, ny]) => {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) return true
          return data[(ny * width + nx) * channels + 3] === 0
        })
        if (nearClear) data[i + 3] = 0
      }
    }
  }
}

function lightenBlackType(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    if (data[i + 3] < 20) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r <= BLACK_MAX && g <= BLACK_MAX && b <= BLACK_MAX) {
      data[i] = SILVER.r
      data[i + 1] = SILVER.g
      data[i + 2] = SILVER.b
      data[i + 3] = 255
    }
  }
}

async function loadRaw(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

async function saveRaw(data, info, output, { width, height } = {}) {
  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  }).png({ compressionLevel: 9, quality: 100 })

  if (width || height) {
    pipeline = sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .resize({
        width,
        height,
        fit: 'inside',
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: false,
      })
      .png({ compressionLevel: 9, quality: 100 })
  }

  await pipeline.toFile(output)
  console.log('Wrote', path.basename(output))
}

async function processTransparent(inputName, { invertBlack = false } = {}) {
  const input = path.join(logoDir, inputName)
  const { data, info } = await loadRaw(input)
  floodRemoveBackground(data, info.width, info.height, info.channels)
  if (invertBlack) lightenBlackType(data, info.channels)
  // Trim empty edges
  const buf = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .trim({ threshold: 5 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return buf
}

// --- Logos ---
const mark = await processTransparent('Ellines tech logo alone.png', { invertBlack: false })
await saveRaw(mark.data, mark.info, path.join(outLogos, 'logo-mark.png'))
await saveRaw(mark.data, mark.info, path.join(outLogos, 'logo-mark@2x.png'), {
  width: 128,
  height: 128,
})
await saveRaw(mark.data, mark.info, path.join(outLogos, 'logo-mark-nav.png'), {
  width: 160,
  height: 160,
})

const full = await processTransparent('Ellines tech big logo.png', { invertBlack: true })
await saveRaw(full.data, full.info, path.join(outLogos, 'logo-full.png'))
await saveRaw(full.data, full.info, path.join(outLogos, 'logo-hero.png'), {
  width: 1200,
  height: 600,
})

const square = await processTransparent('Ellines tech square logo.png', { invertBlack: true })
await saveRaw(square.data, square.info, path.join(outLogos, 'logo-square.png'), {
  width: 512,
  height: 512,
})

// Keep solid white-bg masters for light contexts / favicon source
await sharp(path.join(logoDir, 'Ellines tech big logo.png'))
  .png()
  .toFile(path.join(outLogos, 'logo-full-bg.png'))
await sharp(path.join(logoDir, 'Ellines tech logo alone.png'))
  .resize(256, 256, { fit: 'inside', kernel: sharp.kernel.lanczos3 })
  .png()
  .toFile(path.join(outLogos, 'logo-mark-bg.png'))

// Favicon from mark
await sharp(mark.data, {
  raw: { width: mark.info.width, height: mark.info.height, channels: mark.info.channels },
})
  .resize(64, 64, { fit: 'contain', background: { r: 3, g: 7, b: 18, alpha: 1 } })
  .png()
  .toFile(path.join(outLogos, 'favicon-mark.png'))

// --- Founder portraits (web-optimized) ---
const founderMap = [
  ['Mwangi.png', 'elijah-1.jpg'],
  ['Mwangi2.png', 'elijah-2.jpg'],
  ['Mwangi3.png', 'elijah-3.jpg'],
  ['Mwangi4.png', 'elijah-4.jpg'],
  ['Mwangi5.png', 'elijah-5.jpg'],
]

for (const [src, dest] of founderMap) {
  await sharp(path.join(founderSrc, src))
    .rotate()
    .resize({ width: 1400, height: 1750, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(outFounder, dest))
  console.log('Wrote founder/' + dest)
}

console.log('Assets ready.')
