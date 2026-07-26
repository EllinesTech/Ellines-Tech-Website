const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

const SYSTEM = `You are Ellines Assist for Ellines Tech — software, AI, websites, brand identity, and digital transformation.
Locations: head office at Square2 Street, Skt, Nyeri, Kenya, plus a Nairobi presence for client meetings and on-site work.
Products: AfyaVox AI, RV22 AI Assistant, Juno4 AI, MedFlow, ERP/POS, custom systems.
Motto: Your Idea. Our Code. Always open 24/7. WhatsApp +254748255466. Site tech.ellines.co.ke.
Be concise, helpful, professional. If unsure, say a human can help via Talk to a human.`

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}

export async function onRequestPost(context) {
  const { request, env } = context
  const body = await request.json().catch(() => ({}))
  const question = String(body.question || '').slice(0, 2000)
  const history = Array.isArray(body.history) ? body.history.slice(-8) : []
  if (!question) return json({ error: 'question required' }, 400)

  // Prefer Cloudflare Workers AI when bound
  if (env.AI) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM },
        ...history.map((h) => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: String(h.text || ''),
        })),
        { role: 'user', content: question },
      ]
      const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages,
        max_tokens: 500,
      })
      const answer =
        typeof result === 'string'
          ? result
          : result?.response || result?.result?.response || ''
      if (answer) return json({ answer, source: 'workers-ai' })
    } catch (err) {
      // fall through
    }
  }

  // Knowledge fallback for complex-ish matching when AI unavailable
  const q = question.toLowerCase()
  let answer =
    "I can help with Ellines Tech products, services, pricing, and support. For deeper custom architecture questions, tap Talk to a human so an engineer can continue live — or WhatsApp us anytime (we're 24/7)."
  if (q.includes('price') || q.includes('cost') || q.includes('quote')) {
    answer =
      'Pricing depends on scope (features, integrations, timeline). Share your goals and we’ll prepare a tailored quote — usually within a day. You can also use Request a Quote on the contact page.'
  } else if (q.includes('juno') || q.includes('rv22') || q.includes('afyavox') || q.includes('medflow')) {
    answer =
      'AfyaVox is clinical AI, RV22 is our enterprise AI assistant, Juno4 is an AI platform, and MedFlow covers hospital workflows. Tell me which one you want details on, or ask a human for a demo.'
  } else if (q.includes('security') || q.includes('privacy') || q.includes('data')) {
    answer =
      'We design with security in mind — access control, hardened delivery, and privacy-aware handling of inquiry data. For a formal security discussion, connect to a human agent.'
  }

  return json({ answer, source: 'fallback' })
}
