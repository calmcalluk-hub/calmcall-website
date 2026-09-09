import {
  BASE_URL,
  addHistory,
  askDarren,
  createDynamicAudio,
  emitLead,
  ensureParsedBody,
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

// Signature validation needs req.body to be exactly the bytes Twilio sent. Disable Vercel's
// automatic body parsing here so we can read and parse the raw body ourselves (ensureParsedBody)
// before validateTwilioRequest runs, instead of trusting the platform's implicit parsing.
export const config = { api: { bodyParser: false } };

const GREETING = "Hi, you're through to Darren V2 at CalmCall. This is the new test line. What can I help you with?";
const RETRY = "Sorry mate, I didn't quite catch that. Could you say that again?";
const FALLBACK = "Sorry mate, I'm having a bit of trouble at the minute. I'll get someone from CalmCall to give you a ring back.";

// Twilio hard-caps voice webhook requests at 15s (see Twilio's Webhooks Connection Overrides
// docs) and will fall back to the production number if we blow past that. WEBHOOK_BUDGET_MS is
// the slice of that 15s we're willing to spend in total before we must have replied; the ~3s
// gap below 15000 covers network transit and response write time we don't directly control.
// Every turn computes how much of that budget is already gone (GPT's own call can take up to
// 9s) and only attempts ElevenLabs with whatever's left, capped at MAX_TTS_TIMEOUT_MS so one
// turn can't hog the whole budget. Below MIN_TTS_BUDGET_MS remaining, we skip the attempt
// entirely and go straight to the Polly fallback rather than risk the timeout - this is the
// "redesign, don't just raise the timeout" approach.
const WEBHOOK_BUDGET_MS = 12000;
const MIN_TTS_BUDGET_MS = 1500;
const MAX_TTS_TIMEOUT_MS = 6000;
const TTS_SAFETY_MARGIN_MS = 300;

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

async function makeTurnResponse(res, req, sessionIdValue, session, reply, action, requestStartedAt) {
  const safeReply = String(reply || RETRY).trim().slice(0, 1200);
  const shouldEnd = action === 'end_call';
  const handoffNumber = action === 'human_handoff' ? String(process.env.CALMCALL_HANDOFF_NUMBER || '') : '';
  const actionUrl = callbackActionUrl(req, sessionIdValue);

  // Darren speaks in his ElevenLabs voice whenever enough of the Twilio timeout budget remains
  // to generate (or fetch a cached copy of) the audio; otherwise this falls straight back to
  // Polly instead of risking Twilio timing the call out. audioUrlFor() already caches by a hash
  // of the text in Vercel Blob, so the constant GREETING/RETRY strings are a fast head() hit
  // after the very first call ever makes them, not a fresh ElevenLabs request each time.
  let audioUrl = null;
  const remaining = WEBHOOK_BUDGET_MS - (Date.now() - requestStartedAt);
  if (remaining >= MIN_TTS_BUDGET_MS) {
    const ttsTimeout = Math.min(MAX_TTS_TIMEOUT_MS, remaining - TTS_SAFETY_MARGIN_MS);
    try {
      audioUrl = await Promise.race([
        createDynamicAudio(safeReply, ttsTimeout),
        new Promise((resolve) => setTimeout(() => resolve(null), ttsTimeout + 500)),
      ]);
    } catch (err) {
      console.error('Darren ElevenLabs synthesis failed, using Polly fallback:', err);
      audioUrl = null;
    }
  }

  let twiml = twimlForTurn({ text: safeReply, audioUrl, actionUrl, hangup: shouldEnd, handoffNumber });
  let twimlBytes = Buffer.byteLength(twiml, 'utf8');
  if (twimlBytes > 60000) {
    // Defensive: a <Play> response is inherently tiny, but keep the size guard from the
    // original implementation in case audioUrl or actionUrl are ever unexpectedly huge.
    console.error('[DARREN_V2] TwiML exceeded safety threshold, forcing Polly fallback', { twimlBytes });
    audioUrl = null;
    twiml = twimlForTurn({ text: safeReply, audioUrl: null, actionUrl, hangup: shouldEnd, handoffNumber });
    twimlBytes = Buffer.byteLength(twiml, 'utf8');
  }
  console.log('[DARREN_V2]', JSON.stringify({ version: 'v2-voice', voice: audioUrl ? 'elevenlabs' : 'polly', replyLength: safeReply.length, twimlBytes, actionUrl }));
  return res.status(200).send(twiml);
}

export default async function handler(req, res) {
  const requestStartedAt = Date.now();
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">Method not allowed.</Say><Hangup/></Response>');
  }

  try {
    await ensureParsedBody(req);
  } catch (err) {
    console.error('Failed to read Twilio request body:', err);
    return res.status(400).send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">Bad request.</Say><Hangup/></Response>');
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
        return makeTurnResponse(res, req, id, session, GREETING, 'continue', requestStartedAt);
      }
      return makeTurnResponse(res, req, id, session, RETRY, 'continue', requestStartedAt);
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
    return makeTurnResponse(res, req, id, session, result.reply, result.action, requestStartedAt);
  } catch (err) {
    console.error('Darren voice webhook failed:', err);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">${escapeXml(FALLBACK)}</Say><Hangup/></Response>`;
    return res.status(200).send(fallback);
  }
}
