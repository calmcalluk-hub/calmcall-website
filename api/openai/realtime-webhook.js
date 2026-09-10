const crypto = require('crypto');

const INSTRUCTIONS = `You are Darren, CalmCall's friendly automated phone receptionist for UK trades and service businesses.

Speak naturally, warmly and concisely in British English with a subtle Yorkshire character. Sound like a capable local person, never like a call-centre script.

Your job is to understand why the caller has phoned, answer what they ask, and have a useful human-feeling conversation. Do not run a questionnaire.

Rules:
- React to what the caller just said before moving the conversation forward.
- Ask one useful question at a time, only when needed.
- Never repeat information the caller already gave you.
- If they ask a question, answer it first.
- Keep replies short, usually one or two sentences.
- Adapt to callers who are busy, chatty, sceptical, frustrated or brief.
- Do not pressure people into buying.
- If they ask what CalmCall does, explain simply that it helps businesses catch missed calls and turn them into follow-up opportunities.
- Never invent prices, appointments, customers, integrations, guarantees or actions that have not happened.
- If asked whether you are AI, be honest that you are CalmCall's automated phone assistant.
- If they want a human, offer a callback or handoff when available.
- If they are not interested, respect it and finish politely.
- Never use bullet points, emojis or corporate waffle in speech.

CalmCall helps service businesses manage missed calls, capture caller details, follow up leads and reduce lost opportunities.`;

function timingSafeEqualBase64(a, b) {
  try {
    const aa = Buffer.from(a, 'base64');
    const bb = Buffer.from(b, 'base64');
    return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
  } catch (_) {
    return false;
  }
}

function verifyWebhook(rawBody, req) {
  const secret = process.env.OPENAI_WEBHOOK_SECRET;
  if (!secret) return false;

  const signature = String(req.headers['webhook-signature'] || '');
  const timestamp = String(req.headers['webhook-timestamp'] || '');
  const id = String(req.headers['webhook-id'] || '');
  if (!signature || !timestamp || !id) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const signed = `${id}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secretBytes).update(signed).digest('base64');

  return signature.split(' ').some(value => {
    const parts = value.split(',');
    const version = parts[0];
    const candidate = parts.length > 1 ? parts[1] : parts[0];
    return (!version || version === 'v1') && timingSafeEqualBase64(candidate, expected);
  });
}

async function acceptCall(callId) {
  const response = await fetch(`https://api.openai.com/v1/realtime/calls/${encodeURIComponent(callId)}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      type: 'realtime',
      model: process.env.CALMCALL_REALTIME_MODEL || 'gpt-realtime-2.1-mini',
      output_modalities: ['audio'],
      max_output_tokens: 700,
      instructions: INSTRUCTIONS,
      audio: {
        input: {
          turn_detection: { type: 'semantic_vad', eagerness: 'high', create_response: true },
          transcription: { model: 'gpt-4o-mini-transcribe', language: 'en' },
        },
        output: { voice: process.env.CALMCALL_REALTIME_VOICE || 'cedar' },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Realtime accept ${response.status}: ${body.slice(0, 600)}`);
  }

  return response.json();
}

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const rawBody = Buffer.concat(chunks).toString('utf8');

    if (!verifyWebhook(rawBody, req)) return res.status(401).send('Invalid webhook signature');

    const event = JSON.parse(rawBody);
    if (event.type !== 'realtime.call.incoming') return res.status(200).send('ignored');

    const callId = event.data?.call_id || event.data?.id;
    if (!callId) return res.status(400).send('Missing call_id');

    await acceptCall(callId);
    console.log('Darren V3 accepted realtime SIP call', callId);
    return res.status(200).send('ok');
  } catch (err) {
    console.error('Darren V3 realtime webhook failed:', err);
    return res.status(500).send('Webhook handling failed');
  }
}
