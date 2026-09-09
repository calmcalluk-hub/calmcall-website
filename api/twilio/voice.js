import {
  BASE_URL,
  addHistory,
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
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { askDarrenFast } = require('./_darren_fast.js');

export const config = { api: { bodyParser: false } };

const GREETING = "Hi, you're through to Darren V2 at CalmCall. What can I help you with?";
const RETRY = "Sorry mate, I didn't quite catch that. Could you say that again?";
const FALLBACK = "Sorry mate, I'm having a bit of trouble at the minute. I'll get someone from CalmCall to give you a ring back.";

const WEBHOOK_BUDGET_MS = 12000;
const MIN_TTS_BUDGET_MS = 1200;
const MAX_TTS_TIMEOUT_MS = 3500;
const TTS_SAFETY_MARGIN_MS = 200;

function query(req, key) { return req.query && req.query[key] ? String(req.query[key]) : ''; }

function callbackActionUrl(req, id) {
  const proto = String(req.headers?.['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = req.headers?.host;
  const path = String(req.url || '/api/twilio/voice').split('?')[0];
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const bypassParams = bypassSecret ? `&x-vercel-protection-bypass=${encodeURIComponent(bypassSecret)}` : '';
  if (host) return `${proto}://${host}${path}?session=${encodeURIComponent(id)}${bypassParams}`;
  return `${BASE_URL}?session=${encodeURIComponent(id)}${bypassParams}`;
}

async function makeTurnResponse(res, req, id, session, reply, action, startedAt, savePromise) {
  const safeReply = String(reply || RETRY).trim().slice(0, 700);
  const actionUrl = callbackActionUrl(req, id);
  const remaining = WEBHOOK_BUDGET_MS - (Date.now() - startedAt);
  let audioPromise = Promise.resolve(null);
  if (remaining >= MIN_TTS_BUDGET_MS) {
    const timeout = Math.min(MAX_TTS_TIMEOUT_MS, remaining - TTS_SAFETY_MARGIN_MS);
    audioPromise = Promise.race([
      createDynamicAudio(safeReply, timeout),
      new Promise(resolve => setTimeout(() => resolve(null), timeout + 150)),
    ]).catch(err => {
      console.error('ElevenLabs failed, using Polly:', err);
      return null;
    });
  }
  const [audioUrl] = await Promise.all([audioPromise, savePromise || Promise.resolve()]);
  return res.status(200).send(twimlForTurn({
    text: safeReply,
    audioUrl,
    actionUrl,
    hangup: action === 'end_call',
    handoffNumber: action === 'human_handoff' ? String(process.env.CALMCALL_HANDOFF_NUMBER || '') : '',
  }));
}

export default async function handler(req, res) {
  const startedAt = Date.now();
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).send('<?xml version="1.0"?><Response><Say voice="Polly.Brian-Neural">Method not allowed.</Say><Hangup/></Response>');

  try { await ensureParsedBody(req); }
  catch (err) { console.error('Body read failed:', err); return res.status(400).send('<?xml version="1.0"?><Response><Say voice="Polly.Brian-Neural">Bad request.</Say><Hangup/></Response>'); }

  if (!validateTwilioRequest(req)) return res.status(403).send('<?xml version="1.0"?><Response><Say voice="Polly.Brian-Neural">Request not authorised.</Say><Hangup/></Response>');

  try {
    const callSid = String(req.body?.CallSid || '');
    const from = String(req.body?.From || '');
    const to = String(req.body?.To || '');
    const speech = normalizeSpeech(req.body?.SpeechResult || '');
    let id = query(req, 'session');
    let session;

    if (id) session = await loadSession(id);
    else {
      id = sessionId();
      session = initialSession(callSid, from, to);
      await saveSession(id, session);
    }

    if (!speech) {
      if (session.turns === 0 && session.history.length === 0) {
        addHistory(session, 'darren', GREETING);
        return makeTurnResponse(res, req, id, session, GREETING, 'continue', startedAt, saveSession(id, session));
      }
      return makeTurnResponse(res, req, id, session, RETRY, 'continue', startedAt);
    }

    session.turns += 1;
    addHistory(session, 'caller', speech);
    const obviousTrade = matchTrade(speech);
    if (!session.lead.industry && obviousTrade) session.lead.industry = obviousTrade.label;

    let result;
    try {
      result = await askDarrenFast(session, speech);
    } catch (err) {
      console.error('Darren fast AI decision failed:', err);
      result = { reply: FALLBACK, intent: 'unknown', action: 'continue', lead: session.lead };
    }

    session.lead = { ...session.lead, ...(result.lead || {}) };
    addHistory(session, 'darren', result.reply);

    if (result.action === 'callback_requested') {
      const callbackTime = String(session.lead.callbackTime || '').trim();
      if (callbackTime) {
        const sms = `Hi${session.lead.name ? ` ${session.lead.name}` : ''}, Darren from CalmCall here. We've noted your request for a callback around ${callbackTime}. The team will follow up.`;
        void sendSms(from, sms).catch(err => console.error('SMS failed:', err));
      }
    }

    const savePromise = saveSession(id, session);
    void emitLead(session, result.action === 'end_call' ? 'call_end' : 'turn').catch(err => console.error('Lead emit failed:', err));
    return makeTurnResponse(res, req, id, session, result.reply, result.action, startedAt, savePromise);
  } catch (err) {
    console.error('Darren voice webhook failed:', err);
    return res.status(200).send(`<?xml version="1.0"?><Response><Say voice="Polly.Brian-Neural" language="en-GB">${escapeXml(FALLBACK)}</Say><Hangup/></Response>`);
  }
}
