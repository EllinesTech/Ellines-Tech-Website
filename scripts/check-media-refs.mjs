#!/usr/bin/env node
/**
 * Fails if any `/media`, `/logos`, `/project-logos`, `/client-logos`, `/business-logos`,
 * or `/founder` path referenced from src/ is missing from public/.
 * Broken art degrades a page far more visibly than a broken string, and TypeScript
 * cannot catch it.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const srcDir = join(root, 'src')
const publicDir = join(root, 'public')

const ASSET_RE =
  /['"`](\/(?:media|logos|project-logos|client-logos|business-logos|founder|downloads)\/[^'"`\s)]+)['"`]/g

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full)
  }
  return out
}

/** `photo('shop_uiux')` / `scene('growth')` helpers in src/data/imagery.ts */
const HELPER_RE = /\b(photo|scene)\('([a-z0-9_-]+)'\)/g
const helperPath = {
  photo: (name) => `/media/posters/packages/${name}.jpg`,
  scene: (name) => `/media/scenes/${name}.png`,
}

/** Skip globs and unresolved template placeholders — those are docs, not real refs. */
const isLiteralPath = (path) => !/[*${}…]/.test(path)

const refs = new Map()
function record(path, file) {
  if (!refs.has(path)) refs.set(path, new Set())
  refs.get(path).add(file.slice(root.length + 1))
}

for (const file of walk(srcDir)) {
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(ASSET_RE)) {
    if (isLiteralPath(match[1])) record(match[1], file)
  }
  for (const match of text.matchAll(HELPER_RE)) {
    record(helperPath[match[1]](match[2]), file)
  }
}

const missing = []
let totalBytes = 0
for (const [path, sources] of refs) {
  const onDisk = join(publicDir, path)
  if (!existsSync(onDisk)) {
    missing.push({ path, sources: [...sources] })
    continue
  }
  totalBytes += statSync(onDisk).size
}

console.log(`Checked ${refs.size} asset references (${(totalBytes / 1e6).toFixed(1)} MB on disk).`)

if (missing.length) {
  console.error(`\n${missing.length} missing asset(s):`)
  for (const item of missing) {
    console.error(`  ${item.path}\n    referenced by ${item.sources.join(', ')}`)
  }
  process.exit(1)
}

console.log('All referenced assets exist.')
