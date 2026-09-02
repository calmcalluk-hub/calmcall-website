import {
  BASE_URL,
  addHistory,
  askDarren,
  createDynamicAudio,
  emitLead,
  escapeXml,
  initialSession,
  loadSession,
  matchTrade,
  normalizeSpeech,
  saveSession,
  sendSms,
  sessionId,
  twimlForTurn,
  validateTwilioRequest,
} from './_darren.js';

const GREETING = "Hi, Darren here from CalmCall. Who've I got the pleasure of speaking with?";
const RETRY = "Sorry mate, I didn't quite catch that. Could you say that again?";
const FALLBACK = "No worries. I'm having a bit of trouble with my brain at the minute. Could I take your name and get someone from CalmCall to give you a ring back?";

function query(req, key) { return req.query && req.query[key] ? String(req.query[key]) : ''; }
function callbackActionUrl(id) { return `${BASE_URL}?session=${encodeURIComponent(id)}`; }

async function makeTurnResponse(res, sessionIdValue, session, reply, action) {
  const safeReply = String(reply || RETRY).trim().slice(0, 1200);
  let audioUrl = null;
  try { audioUrl = await createDynamicAudio(safeReply); } catch (err) { console.error('Darren TTS failed, using Polly fallback:', err); }

  const shouldEnd = action === 'end_call';
  if (shouldEnd) await emitLead(session, 'call_end');

  const handoffNumber = action === 'human_handoff' ? String(process.env.CALMCALL_HANDOFF_NUMBER || '') : '';
  const twiml = twimlForTurn({
    text: safeReply,
    audioUrl,
    actionUrl: callbackActionUrl(sessionIdValue),
    hangup: shouldEnd,
    handoffNumber,
  });
  return res.status(200).send(twiml);
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Amy">Method not allowed.</Say><Hangup/></Response>');
  }

  if (!validateTwilioRequest(req)) {
    return res.status(403).send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Amy">Request not authorised.</Say><Hangup/></Response>');
  }

  const callSid = String(req.body?.CallSid || '');
  const from = String(req.body?.From || '');
  const to = String(req.body?.To || '');
  const speech = normalizeSpeech(req.body?.SpeechResult || '');
  let id = query(req, 'session');
  let session;

  try {
    if (id) {
      session = await loadSession(id);
    } else {
      id = sessionId();
      session = initialSession(callSid, from, to);
      await saveSession(id, session);
    }

    if (!speech) {
      if (session.turns === 0 && session.history.length === 0) {
        addHistory(session, 'darren', GREETING);
        await saveSession(id, session);
        return makeTurnResponse(res, id, session, GREETING, 'continue');
      }
      return makeTurnResponse(res, id, session, RETRY, 'continue');
    }

    session.turns += 1;
    addHistory(session, 'caller', speech);

    const obviousTrade = matchTrade(speech);
    if (!session.lead.industry && obviousTrade) session.lead.industry = obviousTrade.label;

    let result;
    try {
      result = await askDarren(session, speech);
    } catch (err) {
      console.error('Darren AI decision failed:', err);
      result = {
        reply: FALLBACK,
        intent: 'unknown',
        action: 'continue',
        lead: { ...session.lead, score: session.lead.score || 30, temperature: session.lead.temperature || 'cold' },
      };
    }

    session.lead = { ...session.lead, ...result.lead };
    addHistory(session, 'darren', result.reply);

    if (result.action === 'callback_requested') {
      const callbackTime = String(session.lead.callbackTime || '').trim();
      if (callbackTime) {
        const sms = `Hi${session.lead.name ? ` ${session.lead.name}` : ''}, Darren from CalmCall here. We've noted your request for a callback around ${callbackTime}. The team will follow up. Reply to this message if anything changes.`;
        try { await sendSms(from, sms); } catch (err) { console.error('Callback SMS failed:', err); }
      }
    }

    await saveSession(id, session);
    await emitLead(session, result.action === 'end_call' ? 'call_end' : 'turn');
    return makeTurnResponse(res, id, session, result.reply, result.action);
  } catch (err) {
    console.error('Darren voice webhook failed:', err);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Amy">${escapeXml(FALLBACK)}</Say><Hangup/></Response>`;
    return res.status(200).send(fallback);
  }
}
