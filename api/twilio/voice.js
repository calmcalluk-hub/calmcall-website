import {
  BASE_URL,
  addHistory,
  askDarren,
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

const GREETING = "Hi, you're through to Darren V2 at CalmCall. This is the new test line. What can I help you with?";
const RETRY = "Sorry mate, I didn't quite catch that. Could you say that again?";
const FALLBACK = "Sorry mate, I'm having a bit of trouble at the minute. I'll get someone from CalmCall to give you a ring back.";

function query(req, key) { return req.query && req.query[key] ? String(req.query[key]) : ''; }

function callbackActionUrl(req, id) {
  const proto = String(req.headers?.['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = req.headers?.host;
  const path = String(req.url || '/api/twilio/voice').split('?')[0];
  // Preview deployments sit behind Vercel Authentication. Without this, Twilio's follow-up
  // <Gather> callback gets Vercel's login-challenge page instead of our TwiML, and Twilio
  // silently falls back to the production number. NOTE: do not add x-vercel-set-bypass-cookie
  // here - that flag makes Vercel respond with a redirect to vercel.com/login instead of the
  // bypassed content for a first-touch, non-browser client like Twilio (verified against the
  // live deployment). The bare bypass secret alone works and is all we need.
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const bypassParams = bypassSecret
    ? `&x-vercel-protection-bypass=${encodeURIComponent(bypassSecret)}`
    : '';
  if (host) return `${proto}://${host}${path}?session=${encodeURIComponent(id)}${bypassParams}`;
  return `${BASE_URL}?session=${encodeURIComponent(id)}${bypassParams}`;
}

async function makeTurnResponse(res, req, sessionIdValue, session, reply, action) {
  const safeReply = String(reply || RETRY).trim().slice(0, 1200);
  const shouldEnd = action === 'end_call';
  const handoffNumber = action === 'human_handoff' ? String(process.env.CALMCALL_HANDOFF_NUMBER || '') : '';
  const actionUrl = callbackActionUrl(req, sessionIdValue);

  // Keep the Twilio webhook fast. ElevenLabs audio belongs in the later streaming build.
  const twiml = twimlForTurn({ text: safeReply, audioUrl: null, actionUrl, hangup: shouldEnd, handoffNumber });
  console.log('[DARREN_V2]', JSON.stringify({ version: 'v2-fast-test', replyLength: safeReply.length, twimlBytes: Buffer.byteLength(twiml, 'utf8'), actionUrl }));
  return res.status(200).send(twiml);
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">Method not allowed.</Say><Hangup/></Response>');
  }

  if (!validateTwilioRequest(req)) {
    return res.status(403).send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">Request not authorised.</Say><Hangup/></Response>');
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
        return makeTurnResponse(res, req, id, session, GREETING, 'continue');
      }
      return makeTurnResponse(res, req, id, session, RETRY, 'continue');
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
    void emitLead(session, result.action === 'end_call' ? 'call_end' : 'turn').catch((err) => console.error('Lead emit failed:', err));
    return makeTurnResponse(res, req, id, session, result.reply, result.action);
  } catch (err) {
    console.error('Darren voice webhook failed:', err);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">${escapeXml(FALLBACK)}</Say><Hangup/></Response>`;
    return res.status(200).send(fallback);
  }
}
