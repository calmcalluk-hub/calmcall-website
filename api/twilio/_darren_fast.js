const { withTimeout } = require('./_darren.js');

const FAST_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'darren_fast_turn',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        reply: { type: 'string' },
        intent: { type: 'string', enum: ['information','demo_interest','callback','booking','support','complaint','spam','not_interested','unknown'] },
        action: { type: 'string', enum: ['continue','callback_requested','human_handoff','end_call'] }
      },
      required: ['reply','intent','action']
    }
  }
};

async function askDarrenFast(session, callerSpeech) {
  const history = (session.history || []).slice(-4)
    .map(m => `${m.role === 'caller' ? 'Caller' : 'Darren'}: ${m.text}`)
    .join('\n');
  const lead = session.lead || {};
  const known = [
    lead.name && `name=${lead.name}`,
    lead.company && `company=${lead.company}`,
    lead.industry && `industry=${lead.industry}`,
    lead.location && `location=${lead.location}`,
    lead.reason && `reason=${lead.reason}`,
    lead.missedCalls && `missedCalls=${lead.missedCalls}`,
    lead.interest && `interest=${lead.interest}`
  ].filter(Boolean).join(', ');

  const prompt = `You are Darren, CalmCall's friendly automated phone assistant. Sound like a real, capable British person with a subtle Yorkshire character.

Your job is to have a natural conversation, understand why the caller called, answer what they ask, and only ask useful questions when needed. You are not conducting a questionnaire.

RULES:
- React to the caller's latest meaning before moving on.
- One question at a time, and only when useful.
- Never repeat information the caller already gave you.
- If they ask a question, answer it first.
- Follow their conversational thread instead of forcing a sales script.
- Be concise. Usually 8-25 spoken words, maximum 40.
- Warm, calm, confident British English. Natural contractions.
- No corporate waffle, feature dumps or pressure.
- If they are interested, naturally explore the problem and suggest a demo/callback when appropriate.
- If they are not interested, respect it and finish.
- If they ask whether you are AI, be honest.
- Never invent prices, appointments, messages, customers, integrations or guarantees.
- If speech is unclear, ask them to repeat naturally.

Known caller information: ${known || 'none'}

Recent conversation:
${history || '(none)'}

Latest caller words:
${callerSpeech}

Return only JSON. The reply is spoken aloud, so output only the words Darren should say in reply.`;

  const response = await withTimeout((signal) => fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.CALMCALL_OPENAI_FAST_MODEL || process.env.CALMCALL_OPENAI_MODEL || 'gpt-5-mini',
      messages: [
        { role: 'system', content: 'You are a low-latency production phone conversation engine. Return only JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 400,
      reasoning_effort: 'none',
      response_format: FAST_SCHEMA
    })
  }), 6000);

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`OpenAI fast ${response.status}: ${body.slice(0, 400)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI fast returned no content');
  const result = JSON.parse(text);

  return { ...result, lead: session.lead || {} };
}

module.exports = { askDarrenFast };
