/**
 * RFC 6238 TOTP helpers for Cloudflare Workers (Web Crypto only).
 * Secrets are stored base32-encoded; codes are 6 digits / 30s period.
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function generateTotpSecret(byteLength = 20) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
  return base32Encode(bytes)
}

export function buildOtpauthUri({ secret, accountName, issuer = 'Ellines Tech' }) {
  const label = encodeURIComponent(`${issuer}:${accountName}`)
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30',
  })
  return `otpauth://totp/${label}?${params.toString()}`
}

export async function verifyTotpCode(secret, code, { window = 1, stepSeconds = 30 } = {}) {
  const cleaned = String(code || '').replace(/\s/g, '')
  if (!/^\d{6}$/.test(cleaned)) return false
  const key = base32Decode(secret)
  if (!key || key.length < 10) return false
  const counter = Math.floor(Date.now() / 1000 / stepSeconds)
  for (let offset = -window; offset <= window; offset += 1) {
    const expected = await hotp(key, counter + offset)
    if (timingSafeEqualDigits(expected, cleaned)) return true
  }
  return false
}

/** Cryptographically random recovery codes (shown once, stored hashed). */
export function generateRecoveryCodes(count = 8) {
  const codes = []
  for (let i = 0; i < count; i += 1) {
    const bytes = crypto.getRandomValues(new Uint8Array(5))
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
    codes.push(`${hex.slice(0, 5)}-${hex.slice(5)}`)
  }
  return codes
}

function base32Encode(bytes) {
  let bits = 0
  let value = 0
  let output = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  return output
}

function base32Decode(input) {
  const cleaned = String(input || '')
    .toUpperCase()
    .replace(/=+$/g, '')
    .replace(/[^A-Z2-7]/g, '')
  if (!cleaned) return null
  let bits = 0
  let value = 0
  const out = []
  for (const char of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(char)
    if (idx < 0) return null
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return new Uint8Array(out)
}

async function hotp(key, counter) {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  // HOTP counter is a big-endian 64-bit integer; JS safe for our 30s windows.
  view.setUint32(0, Math.floor(counter / 0x100000000), false)
  view.setUint32(4, counter >>> 0, false)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, buffer))
  const offset = signature[signature.length - 1] & 0x0f
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff)
  return String(binary % 1_000_000).padStart(6, '0')
}

function timingSafeEqualDigits(a, b) {
  const left = String(a)
  const right = String(b)
  if (left.length !== right.length) return false
  let diff = 0
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i)
  }
  return diff === 0
}
