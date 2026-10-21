const { withTimeout } = require('./_darren.js');

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

Have a natural conversation. Understand why the caller called, answer what they ask, and only ask useful questions. You are not conducting a questionnaire.

RULES:
- React to the caller's latest meaning before moving on.
- One question at a time, only when useful.
- Never repeat information the caller already gave you.
- If they ask a question, answer it first.
- Follow their conversational thread instead of forcing a sales script.
- Usually 8-25 spoken words, maximum 40.
- Warm, calm, confident British English. Natural contractions.
- No corporate waffle, feature dumps or pressure.
- If interested, naturally explore the problem and suggest a demo or callback when appropriate.
- If not interested, respect it and finish.
- If asked whether you are AI, be honest.
- Never invent prices, appointments, messages, customers, integrations or guarantees.
- If speech is unclear, ask them to repeat naturally.

Known caller information: ${known || 'none'}

Recent conversation:
${history || '(none)'}

Latest caller words:
${callerSpeech}

Return valid JSON with exactly these keys: reply, intent, action.
intent must be one of: information, demo_interest, callback, booking, support, complaint, spam, not_interested, unknown.
action must be one of: continue, callback_requested, human_handoff, end_call.
The reply is spoken aloud, so output only the words Darren should say in reply.`;

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
        { role: 'system', content: 'You are a low-latency production phone conversation engine. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 220,
      response_format: { type: 'json_object' }
    })
  }), 5000);

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`OpenAI fast ${response.status}: ${body.slice(0, 400)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI fast returned no content');

  const result = JSON.parse(text);
  const allowedIntents = new Set(['information','demo_interest','callback','booking','support','complaint','spam','not_interested','unknown']);
  const allowedActions = new Set(['continue','callback_requested','human_handoff','end_call']);

  return {
    reply: String(result.reply || '').trim().slice(0, 500),
    intent: allowedIntents.has(result.intent) ? result.intent : 'unknown',
    action: allowedActions.has(result.action) ? result.action : 'continue',
    lead: session.lead || {}
  };
}

module.exports = { askDarrenFast };
