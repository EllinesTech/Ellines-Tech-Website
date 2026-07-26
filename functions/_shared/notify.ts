/**
 * Transactional email + SMS helpers for Ellines Tech Pages Functions.
 * Secrets stay server-side (Cloudflare Pages env) — never imported from `src/`.
 *
 * Email: Resend (`RESEND_API_KEY`, optional `RESEND_FROM`)
 * SMS: Africa's Talking (`AT_USERNAME`, `AT_API_KEY`, optional `AT_SENDER`)
 *      or Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`)
 */

export async function sendEmail(env, { to, subject, html, text }) {
  const key = String(env?.RESEND_API_KEY || '').trim()
  if (!key || !to) return { sent: false, channel: 'email', reason: 'no_key' }
  try {
    const from = String(env.RESEND_FROM || '').trim() || 'Ellines Tech <onboarding@resend.dev>'
    const payload = { from, to: [to], subject }
    if (html) payload.html = html
    if (text) payload.text = text
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.text().catch(() => '')
      return { sent: false, channel: 'email', reason: err || 'send_failed' }
    }
    return { sent: true, channel: 'email' }
  } catch (e) {
    return { sent: false, channel: 'email', reason: String(e) }
  }
}

/** Normalise Kenyan / E.164 numbers for SMS gateways. */
export function normalisePhone(raw) {
  let digits = String(raw || '').replace(/[^\d+]/g, '')
  if (!digits) return ''
  if (digits.startsWith('+')) digits = digits.slice(1)
  if (digits.startsWith('0') && digits.length === 10) digits = `254${digits.slice(1)}`
  if (digits.startsWith('7') && digits.length === 9) digits = `254${digits}`
  if (digits.length < 10 || digits.length > 15) return ''
  return `+${digits}`
}

async function sendViaAfricasTalking(env, to, message) {
  const username = String(env.AT_USERNAME || '').trim()
  const apiKey = String(env.AT_API_KEY || '').trim()
  if (!username || !apiKey) return { sent: false, channel: 'sms', reason: 'no_at_key' }
  const sender = String(env.AT_SENDER || '').trim()
  const body = new URLSearchParams({
    username,
    to: to.replace(/^\+/, ''),
    message,
  })
  if (sender) body.set('from', sender)
  const res = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      ApiKey: apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    return { sent: false, channel: 'sms', reason: err || 'at_failed', provider: 'africastalking' }
  }
  return { sent: true, channel: 'sms', provider: 'africastalking' }
}

async function sendViaTwilio(env, to, message) {
  const sid = String(env.TWILIO_ACCOUNT_SID || '').trim()
  const token = String(env.TWILIO_AUTH_TOKEN || '').trim()
  const from = String(env.TWILIO_FROM || '').trim()
  if (!sid || !token || !from) return { sent: false, channel: 'sms', reason: 'no_twilio_key' }
  const auth = btoa(`${sid}:${token}`)
  const body = new URLSearchParams({ To: to, From: from, Body: message })
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    return { sent: false, channel: 'sms', reason: err || 'twilio_failed', provider: 'twilio' }
  }
  return { sent: true, channel: 'sms', provider: 'twilio' }
}

/**
 * Prefer Africa's Talking (Kenya-first), fall back to Twilio. Returns a
 * structured result so callers can report which channel fired without leaking
 * provider secrets.
 */
export async function sendSms(env, { to, message }) {
  const phone = normalisePhone(to)
  if (!phone) return { sent: false, channel: 'sms', reason: 'bad_phone' }
  const text = String(message || '').slice(0, 320)
  if (!text) return { sent: false, channel: 'sms', reason: 'empty' }

  const at = await sendViaAfricasTalking(env, phone, text)
  if (at.sent || (at.reason !== 'no_at_key' && at.reason !== 'bad_phone')) return at
  return sendViaTwilio(env, phone, text)
}

/** Deliver a password-reset OTP over every channel we can reach for this user. */
export async function deliverResetCode(env, { email, phone, code, name }) {
  const who = name || 'there'
  const subject = 'Your Ellines Tech password reset code'
  const html = `
    <p>Hi ${who},</p>
    <p>Your Ellines Tech password reset code is:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
    <p>It expires in 15 minutes. If you did not request this, you can ignore this email.</p>
    <p>— Ellines Tech</p>
  `
  const text = `Hi ${who}, your Ellines Tech password reset code is ${code}. It expires in 15 minutes.`
  const smsBody = `Ellines Tech reset code: ${code}. Expires in 15 minutes. If you didn't request this, ignore.`

  const channels = []
  const emailResult = await sendEmail(env, { to: email, subject, html, text })
  channels.push(emailResult)
  if (phone) {
    const smsResult = await sendSms(env, { to: phone, message: smsBody })
    channels.push(smsResult)
  }
  return {
    emailed: Boolean(emailResult.sent),
    sms: Boolean(channels.find((c) => c.channel === 'sms' && c.sent)),
    channels,
  }
}
