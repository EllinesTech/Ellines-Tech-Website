const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}

export async function onRequestGet(context) {
  const { env } = context
  if (!env.ET_STORE) return json({ site: null, source: 'unbound' })
  const raw = await env.ET_STORE.get('cms:site')
  return json({ site: raw ? JSON.parse(raw) : null, source: 'kv' })
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const key = request.headers.get('X-Admin-Key') || ''
  const expected = env.ADMIN_API_KEY || 'EllinesGodMode2026'
  if (key !== expected) return json({ error: 'unauthorized' }, 401)
  const body = await request.json().catch(() => ({}))
  await env.ET_STORE.put('cms:site', JSON.stringify(body.site || body))
  return json({ ok: true })
}
