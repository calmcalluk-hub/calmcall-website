const { put, head } = require('@vercel/blob');
const crypto = require('crypto');

const BASE_URL = process.env.CALMCALL_VOICE_BASE_URL || 'https://www.calmcall.co.uk/api/twilio/voice';

const TRADE_INFO = {
  plumber: { label: 'plumbing', typicalJob: 'a plumbing callout', value: 220 },
  plumbing: { label: 'plumbing', typicalJob: 'a plumbing callout', value: 220 },
  mechanic: { label: 'a garage or mechanic', typicalJob: 'a repair or service booking', value: 280 },
  garage: { label: 'a garage or mechanic', typicalJob: 'a repair or service booking', value: 280 },
  electrician: { label: 'electrical', typicalJob: 'an electrical callout', value: 210 },
  locksmith: { label: 'locksmith', typicalJob: 'a lockout callout', value: 120 },
  jeweller: { label: 'jewellery', typicalJob: 'a repair or valuation', value: 150 },
  jewellery: { label: 'jewellery', typicalJob: 'a repair or valuation', value: 150 },
  beauty: { label: 'beauty', typicalJob: 'a treatment booking', value: 65 },
  salon: { label: 'a salon', typicalJob: 'a treatment booking', value: 65 },
  beautician: { label: 'beauty', typicalJob: 'a treatment booking', value: 65 },
  surveyor: { label: 'surveying', typicalJob: 'a property survey', value: 350 },
  barber: { label: 'barbering', typicalJob: 'a haircut booking', value: 35 },
  hairdresser: { label: 'hairdressing', typicalJob: 'a haircut booking', value: 45 },
  dentist: { label: 'dental', typicalJob: 'an appointment enquiry', value: 150 },
  veterinary: { label: 'veterinary', typicalJob: 'a pet consultation', value: 90 },
  accountant: { label: 'accounting', typicalJob: 'a tax or accounts enquiry', value: 220 },
  solicitor: { label: 'legal', typicalJob: 'a consultation enquiry', value: 300 },
  roofer: { label: 'roofing', typicalJob: 'a roof repair', value: 350 },
  builder: { label: 'building', typicalJob: 'a building or renovation quote', value: 450 },
  decorator: { label: 'painting and decorating', typicalJob: 'a decorating job', value: 180 },
  cleaner: { label: 'cleaning', typicalJob: 'a cleaning booking', value: 80 },
  gardener: { label: 'gardening', typicalJob: 'a garden clearance or maintenance job', value: 120 },
  landscaper: { label: 'landscaping', typicalJob: 'a landscaping project', value: 300 },
};

function matchTrade(text = '') {
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(TRADE_INFO)) {
    if (lower.includes(key)) return { key, ...value };
  }
  return null;
}

function keyMaterial() {
  const secret = process.env.CALMCALL_SESSION_SECRET || process.env.TWILIO_AUTH_TOKEN || process.env.OPENAI_API_KEY;
  if (!secret) throw new Error('Missing CALMCALL_SESSION_SECRET');
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptSession(session) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

function decryptSession(payload) {
  const raw = Buffer.from(payload, 'base64url');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8'));
}

function sessionId() { return crypto.randomUUID(); }
function sessionPath(id) { return `twilio-sessions/${id}.json`; }

async function saveSession(id, session) {
  return (await put(sessionPath(id), Buffer.from(encryptSession(session)), { access:'public', contentType:'text/plain', allowOverwrite:true })).url;
}

async function loadSession(id) {
  const meta = await head(sessionPath(id));
  const response = await fetch(meta.url);
  if (!response.ok) throw new Error(`Session read failed: ${response.status}`);
  return decryptSession(await response.text());
}

function cleanText(text, max = 1200) { return String(text || '').replace(/\s+/g, ' ').trim().slice(0, max); }
function escapeXml(str) { return String(str).replace(/[<>&'\"]/g, (c) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c])); }
function normalizeSpeech(text) { return cleanText(text, 1000); }
function addHistory(session, role, text) { session.history = [...(session.history || []), { role, text: cleanText(text, 900), at:new Date().toISOString() }].slice(-12); }

const INDUSTRY_HINTS = Object.values(TRADE_INFO).map((x) => x.label).join(', ');
function businessContext(lead) {
  if (!lead.trade && !lead.industry) return `The caller has not yet clearly identified their industry. Common industries include ${INDUSTRY_HINTS}.`;
  const key = lead.trade || Object.keys(TRADE_INFO).find((k) => String(lead.industry || '').toLowerCase().includes(k));
  const info = key ? TRADE_INFO[key] : null;
  return info ? `The caller appears to run ${info.label}. A typical missed opportunity could be ${info.typicalJob}, with an indicative value of about £${info.value}. Never present that value as a guaranteed fact; use it only as context.` : '';
}

async function askDarren(session, callerSpeech) {
  const history = (session.history || []).slice(-8).map((m) => `${m.role === 'caller' ? 'Caller' : 'Darren'}: ${m.text}`).join('\n');
  const lead = session.lead || {};
  const prompt = `You are Darren, the friendly Yorkshire-voiced phone receptionist and conversational lead agent for CalmCall, a UK missed-call recovery and lead-management service for trades and service businesses.

PRIMARY MISSION
Have a genuinely human-feeling phone conversation that helps the caller. Your priority order is:
1. Understand what the caller actually wants.
2. Make them feel heard and respond to what they just said.
3. Only gather useful business information when it naturally fits the conversation.
4. If there is a real problem CalmCall could solve, explore it briefly and clearly.
5. Move naturally toward the most appropriate next step, without forcing a sale.

You are NOT running a questionnaire. The caller should never feel like they are filling in a form over the phone.

CONVERSATION ENGINE
- React before you redirect. First acknowledge the meaning or emotion in what the caller said, then move the conversation forward if needed.
- Follow the caller's thread. If they mention several things, use the relevant ones rather than mechanically returning to your planned question.
- Ask only one meaningful question at a time.
- Do not ask a question just because a field is empty. Empty CRM fields are fine.
- Prefer open, natural questions early: "What made you give us a ring?", "How are you dealing with that at the minute?", "Is that happening fairly often?"
- Once you understand the situation, become more specific.
- If the caller gives a useful answer without being asked, acknowledge it and do not ask for the same information again.
- If the caller asks you a question, answer it first. Do not dodge the question just to continue qualification.
- If the caller is chatty, allow some conversation. If they are brief, keep Darren brief.
- If the caller sounds busy, frustrated, sceptical, confused or uninterested, adapt immediately.
- Never stack three or four questions together.
- Never repeat the same question in different words unless the speech recognition genuinely failed.
- Never use phrases like "just a few quick questions" or "I need to collect some information".

VOICE
- Warm, calm, confident British English.
- Light Yorkshire character, understated and believable, never a cartoon accent in wording.
- Natural contractions. Occasional phrases such as "got you", "fair enough", "no worries", "right", "yeah, that makes sense".
- Sound like a capable local person, not a call-centre script.
- Use short spoken sentences. Usually 1 to 3 sentences.
- Keep the spoken reply under 45 words. Most replies should be 8 to 25 words.
- Avoid corporate language, jargon, hype and cheesy sales lines.
- Do not overuse "right", "no worries" or "got you". Variety matters.
- Do not use emojis, bullet points or formatting in the spoken reply.

NATURAL SALES FLOW
Think in stages, but never announce the stages:
1. OPEN: understand why they called.
2. EXPLORE: understand the current situation and its impact.
3. QUANTIFY LIGHTLY: if relevant, learn frequency, missed opportunities, job value or urgency.
4. FIT: establish whether they are a plausible CalmCall customer and whether they influence the decision.
5. VALUE: only when earned, explain the relevant benefit in plain English.
6. NEXT STEP: suggest a sensible demo, callback or human conversation if there is genuine interest.

Do not pitch CalmCall immediately. A caller saying "I've got a garage" is not permission for a sales pitch. Find out why they called.

If they ask what CalmCall does, give a simple answer first, for example: "We help businesses catch calls they would otherwise miss and turn them into follow-up opportunities." Then ask what prompted their interest.

If they describe a painful missed-call problem, connect the benefit to their specific situation. Do not recite a feature list.

If they are clearly interested, you may suggest a demo or callback. Do not pressure them to buy on the call.

If they are not interested, respect it immediately and end politely.

DISCOVERY PRIORITIES
Learn these only when relevant and natural:
- name
- company
- industry
- location
- team size
- reason for calling
- missed-call frequency
- what happens when calls are missed
- current workaround or system
- typical customer/job value
- urgency
- whether they make the decision
- preferred callback time
- email, only if voluntarily provided or genuinely needed for the requested next step

The most valuable discovery is usually the caller's actual problem, not their demographic details.

OBJECTION HANDLING
- "I'm just looking": answer normally, remove pressure, then ask what they are looking for if useful.
- "How much is it?": do not evade. If you know an approved price from the system, state it accurately. If you do not have an approved current price, say a person can confirm pricing and offer a callback.
- "I've already got something": ask what they use and whether it is working well, rather than attacking the competitor.
- "Not interested": do not overcome the objection aggressively. Thank them and finish.
- "Send me something": acknowledge it, capture the requested contact detail if appropriate, and explain the next step without pretending it has already been sent unless the system confirms that.
- "Can I speak to a person?": offer human handoff or callback. Never pretend Darren is a human.
- Complaint or frustration: apologise appropriately, understand the issue, and hand off when needed.

HONESTY AND BOUNDARIES
- Never invent company facts, customers, prices, availability, appointments, integrations, results or guarantees.
- Never claim an email, SMS, callback, booking or demo has been sent or booked unless the system explicitly confirms it.
- Never invent a personal name for the caller.
- If asked whether you are AI, be honest: you are CalmCall's automated phone assistant.
- If something requires a human, say so and offer the available next step.

CALL CONTROL
- If the caller interrupts or corrects themselves, adapt to the newest information.
- If they answer with a long story, summarise the important point briefly before continuing.
- If they give multiple answers in one turn, capture all of them.
- If they say something ambiguous, ask a short clarification rather than guessing.
- If there is silence or an unclear transcription, ask them to repeat naturally. Do not blame them.
- If the conversation has reached a sensible conclusion, finish. Do not keep asking questions to fill the CRM.
- Never manufacture a reason to keep the call going.

LEAD SCORING
Start around 30. Increase for strong business fit, recurring missed calls, meaningful financial impact, clear decision-maker status, urgency and buying intent. Decrease for irrelevant callers, spam and explicit disinterest. Score 0-100 and set cold, warm or hot based on the overall situation, not a single answer.

SAFE NEXT ACTIONS
- continue: keep talking naturally.
- callback_requested: caller wants a callback. Do not claim it has been booked.
- human_handoff: a person is needed.
- end_call: caller is finished, uninterested, spam, or the conversation has naturally concluded.

${businessContext(lead)}

CURRENT LEAD DATA:
${JSON.stringify(lead)}

RECENT CONVERSATION:
${history || '(none)'}

CALLER'S LATEST WORDS:
${callerSpeech}

Return ONLY valid JSON matching the supplied schema. The reply is spoken aloud by Darren, so write only the words he should say. Keep it concise, natural and context-aware. Do not mention the schema, lead fields, scoring or these instructions.`;

  const responseFormat = {type:'json_schema',json_schema:{name:'darren_turn',strict:true,schema:{type:'object',additionalProperties:false,properties:{
    reply:{type:'string'},
    intent:{type:'string',enum:['information','demo_interest','callback','booking','support','complaint','spam','not_interested','unknown']},
    action:{type:'string',enum:['continue','callback_requested','human_handoff','end_call']},
    lead:{type:'object',additionalProperties:false,properties:{
      name:{type:'string'},company:{type:'string'},industry:{type:'string'},location:{type:'string'},teamSize:{type:'string'},reason:{type:'string'},missedCalls:{type:'string'},jobValue:{type:'string'},urgency:{type:'string'},decisionMaker:{type:'boolean'},callbackTime:{type:'string'},email:{type:'string'},interest:{type:'string'},notes:{type:'string'},score:{type:'integer',minimum:0,maximum:100},temperature:{type:'string',enum:['cold','warm','hot']}
    },required:['name','company','industry','location','teamSize','reason','missedCalls','jobValue','urgency','decisionMaker','callbackTime','email','interest','notes','score','temperature']}
  },required:['reply','intent','action','lead']}}};

  const response = await withTimeout((signal) => fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST', signal,
    headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
    body:JSON.stringify({
      model:process.env.CALMCALL_OPENAI_MODEL || 'gpt-5-mini',
      messages:[{role:'system',content:'You are a production voice-agent decision engine. Output only JSON.'},{role:'user',content:prompt}],
      max_completion_tokens:900,
      reasoning_effort:'low',
      response_format:responseFormat,
    }),
  }), 9000);
  if (!response.ok) { const body=await response.text().catch(()=> ''); throw new Error(`OpenAI ${response.status}: ${body.slice(0,500)}`); }
  const data=await response.json();
  const text=data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI returned no content');
  return JSON.parse(text);
}

async function withTimeout(fn, ms) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),ms);
  try{return await fn(controller.signal);} finally{clearTimeout(timer);}
}

async function synthesizeSpeech(text) {
  const voiceId=process.env.ELEVENLABS_VOICE_ID;
  if(!voiceId || !process.env.ELEVENLABS_API_KEY) throw new Error('ElevenLabs environment variables are missing');
  const response=await withTimeout((signal)=>fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`,{
    method:'POST',signal,headers:{'Content-Type':'application/json','xi-api-key':process.env.ELEVENLABS_API_KEY},
    body:JSON.stringify({text:cleanText(text,1200),model_id:process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5',voice_settings:{stability:0.42,similarity_boost:0.82,style:0.15,use_speaker_boost:true}})
  }),7000);
  if(!response.ok) throw new Error(`ElevenLabs ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function audioUrlFor(text, cacheKey) {
  const path=`twilio-pitches/${cacheKey}.mp3`;
  try{return (await head(path)).url;}catch(_){}
  return (await put(path,await synthesizeSpeech(text),{access:'public',contentType:'audio/mpeg',allowOverwrite:true})).url;
}
async function createDynamicAudio(text){const hash=crypto.createHash('sha256').update(text).digest('hex').slice(0,32);return audioUrlFor(text,`darren-${hash}`);}

function twimlForTurn({text,audioUrl,actionUrl,hangup=false,handoffNumber=''}){
  const voice=audioUrl?`<Play>${escapeXml(audioUrl)}</Play>`:`<Say voice="Polly.Amy">${escapeXml(text)}</Say>`;
  if(handoffNumber)return `<?xml version="1.0" encoding="UTF-8"?><Response>${voice}<Dial timeout="20" answerOnBridge="true"><Number>${escapeXml(handoffNumber)}</Number></Dial></Response>`;
  if(hangup)return `<?xml version="1.0" encoding="UTF-8"?><Response>${voice}<Hangup/></Response>`;
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="speech" action="${escapeXml(actionUrl)}" method="POST" speechTimeout="auto" timeout="6" actionOnEmptyResult="true" language="en-GB" speechModel="phone_call">${voice}</Gather><Say voice="Polly.Amy">Sorry, I didn't catch that. Could you say that again?</Say></Response>`;
}

function initialSession(callSid,from,to){return{version:2,callSid,from,to,createdAt:new Date().toISOString(),turns:0,history:[],lead:{name:'',company:'',industry:'',location:'',teamSize:'',reason:'',missedCalls:'',jobValue:'',urgency:'',decisionMaker:false,callbackTime:'',email:'',interest:'',notes:'',score:30,temperature:'cold'}};}

async function emitLead(session,reason='turn'){
  const payload={event:'voice_lead_update',reason,timestamp:new Date().toISOString(),callSid:session.callSid,from:session.from,to:session.to,createdAt:session.createdAt,turns:session.turns,lead:session.lead,history:session.history};
  const webhook=process.env.CALMCALL_CRM_WEBHOOK_URL;
  if(webhook){try{await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json','x-calmcall-event':'voice_lead_update'},body:JSON.stringify(payload)});}catch(err){console.error('CRM webhook failed:',err);}}
  try{await put(`twilio-leads/${session.callSid || crypto.randomUUID()}.json`,Buffer.from(encryptSession(payload)),{access:'public',contentType:'text/plain',allowOverwrite:true});}catch(err){console.error('Lead archive failed:',err);}
}

// Twilio's X-Twilio-Signature is an HMAC-SHA1 over the exact webhook URL plus the exact POST
// body Twilio sent (sorted param names, each followed immediately by its value, appended to the
// URL). Relying on the platform's automatic req.body parsing for that is what made validation on
// darren-v2 Preview unreliable: by the time our handler ran, req.body wasn't guaranteed to hold
// the same bytes Twilio's own signature was computed over. Root cause confirmed via temporary
// diagnostic logging: the reconstructed URL matched Twilio's request and Twilio's console
// configuration exactly (byte-for-byte), yet the computed signature still didn't match the
// received one - so the remaining variable was the POST parameters, not the URL. Reading and
// parsing the raw body ourselves (see api.bodyParser:false in voice.js) removes that variable:
// req.body is now built from exactly the bytes Twilio sent, nothing else.
function readRawBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function ensureParsedBody(req){
  // If some layer already parsed it into an object (e.g. bodyParser wasn't disabled for this
  // route), trust that rather than trying to re-read an already-consumed stream.
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  const raw = typeof req.body === 'string' ? req.body
    : Buffer.isBuffer(req.body) ? req.body.toString('utf8')
    : await readRawBody(req);
  const contentType = String(req.headers?.['content-type'] || '');
  const params = {};
  if (contentType.includes('application/json')) {
    try { Object.assign(params, JSON.parse(raw || '{}')); } catch (_) { /* leave params empty */ }
  } else {
    // Twilio sends application/x-www-form-urlencoded; treat that as the default.
    for (const [key, value] of new URLSearchParams(raw)) params[key] = value;
  }
  req.body = params;
  return params;
}

function validateTwilioRequest(req){
  // TWILIO_AUTH_TOKEN is stored in Vercel as a "Secret" env var, which cannot be read back and
  // diffed once saved. A stray trailing newline or space picked up when the value was copy-pasted
  // into the dashboard is invisible in the UI but silently changes the HMAC key, producing exactly
  // the symptom seen on darren-v2: a permanent signature mismatch despite a byte-identical URL and
  // a byte-identical, correctly-sorted parameter set (verified against a real failed call - Call
  // SID CA2260383aec8a02baad76ef22f0da6a82 - via the Twilio Request Inspector and Vercel Runtime
  // Logs). trim() removes that one hard-to-detect failure mode; it does not change the token for
  // any correctly-stored value.
  const token=String(process.env.TWILIO_AUTH_TOKEN||'').trim();
  if(!token || process.env.TWILIO_VALIDATE_SIGNATURE==='false')return true;
  const signature=String(req.headers?.['x-twilio-signature']||'').trim(); if(!signature)return false;
  const proto=req.headers?.['x-forwarded-proto'] || 'https'; const host=req.headers?.host; if(!host)return false;
  const url=`${proto}://${host}${req.url || ''}`; const params=req.body || {};
  const data=Object.keys(params).sort().reduce((out,key)=>out+key+params[key],url);
  const expected=crypto.createHmac('sha1',token).update(data).digest('base64');
  if(signature.length!==expected.length)return false;
  return crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected));
}

async function sendSms(to,body){
  if(!to||!process.env.TWILIO_ACCOUNT_SID||!process.env.TWILIO_AUTH_TOKEN||!process.env.TWILIO_PHONE_NUMBER)return false;
  const auth=Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const params=new URLSearchParams({To:to,From:process.env.TWILIO_PHONE_NUMBER,Body:body.slice(0,1500)});
  const response=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/x-www-form-urlencoded'},body:params});
  if(!response.ok)throw new Error(`Twilio SMS ${response.status}`); return true;
}

module.exports = {
  BASE_URL,
  TRADE_INFO,
  matchTrade,
  encryptSession,
  decryptSession,
  sessionId,
  saveSession,
  loadSession,
  cleanText,
  escapeXml,
  normalizeSpeech,
  addHistory,
  askDarren,
  withTimeout,
  synthesizeSpeech,
  audioUrlFor,
  createDynamicAudio,
  twimlForTurn,
  initialSession,
  emitLead,
  validateTwilioRequest,
  ensureParsedBody,
  sendSms,
};
