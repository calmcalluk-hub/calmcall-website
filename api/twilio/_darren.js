import { put, head } from '@vercel/blob';
import crypto from 'crypto';

export const BASE_URL = process.env.CALMCALL_VOICE_BASE_URL || 'https://www.calmcall.co.uk/api/twilio/voice';

export const TRADE_INFO = {
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

export function matchTrade(text = '') {
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

export function encryptSession(session) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decryptSession(payload) {
  const raw = Buffer.from(payload, 'base64url');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8'));
}

export function sessionId() { return crypto.randomUUID(); }

function sessionPath(id) { return `twilio-sessions/${id}.json`; }

export async function saveSession(id, session) {
  return (await put(sessionPath(id), Buffer.from(encryptSession(session)), { access:'public', contentType:'text/plain', allowOverwrite:true })).url;
}

export async function loadSession(id) {
  const meta = await head(sessionPath(id));
  const response = await fetch(meta.url);
  if (!response.ok) throw new Error(`Session read failed: ${response.status}`);
  return decryptSession(await response.text());
}

export function cleanText(text, max = 1200) { return String(text || '').replace(/\s+/g, ' ').trim().slice(0, max); }
export function escapeXml(str) { return String(str).replace(/[<>&'\"]/g, (c) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c])); }
export function normalizeSpeech(text) { return cleanText(text, 1000); }
export function addHistory(session, role, text) { session.history = [...(session.history || []), { role, text: cleanText(text, 900), at:new Date().toISOString() }].slice(-12); }

const INDUSTRY_HINTS = Object.values(TRADE_INFO).map((x) => x.label).join(', ');
function businessContext(lead) {
  if (!lead.trade && !lead.industry) return `The caller has not yet clearly identified their industry. Common industries include ${INDUSTRY_HINTS}.`;
  const key = lead.trade || Object.keys(TRADE_INFO).find((k) => String(lead.industry || '').toLowerCase().includes(k));
  const info = key ? TRADE_INFO[key] : null;
  return info ? `The caller appears to run ${info.label}. A typical missed opportunity could be ${info.typicalJob}, with an indicative value of about £${info.value}. Never present that value as a guaranteed fact; use it only as context.` : '';
}

export async function askDarren(session, callerSpeech) {
  const history = (session.history || []).slice(-8).map((m) => `${m.role === 'caller' ? 'Caller' : 'Darren'}: ${m.text}`).join('\n');
  const lead = session.lead || {};
  const prompt = `You are Darren, the friendly Yorkshire-voiced phone receptionist and lead qualification agent for CalmCall, a UK missed-call recovery and lead-management service for trades and service businesses.

Your job is to have a genuinely natural conversation, understand why the caller is calling, gather useful lead information without interrogating them, and arrange an appropriate next step. You are not a rigid questionnaire.

VOICE STYLE:
- Warm, calm, concise, natural British English.
- Light Yorkshire character, but never caricatured.
- Use contractions and occasional natural phrases such as "got you", "no worries", "fair enough", "right".
- One or two short sentences at a time. Ask at most one main question in a turn.
- Never say you are an AI unless directly asked. If asked, be honest that you're CalmCall's automated phone assistant.
- Do not invent company facts, prices, availability, appointments, customer records or guarantees.
- Do not claim something is booked unless the system explicitly confirms it.
- If the caller needs something that requires a human, offer a callback or human handoff rather than bluffing.
- If the caller says they are not interested, politely finish without pressure.
- If they provide multiple answers at once, acknowledge and use all useful information. Do not ask for information they already gave.
- If they interrupt or correct themselves, adapt.

WHAT TO LEARN WHEN NATURAL:
name, company, industry, location, team size, reason for call, missed call frequency, current problem, typical customer/job value, urgency, decision-maker status, preferred callback time, email if voluntarily provided.

LEAD SCORING:
Start around 30. Increase for clear business fit, meaningful missed-call volume, high-value jobs, decision-maker status, and buying intent. Decrease for spam, irrelevant callers, or explicit disinterest. Return a score 0-100 and temperature cold/warm/hot.

SAFE NEXT ACTIONS:
- continue: keep talking and ask the next useful question.
- callback_requested: caller wants a callback. Do not claim it has been booked.
- human_handoff: the issue needs a person.
- end_call: caller is done, uninterested, spam, or the conversation is complete.

${businessContext(lead)}

CURRENT LEAD DATA:
${JSON.stringify(lead)}

RECENT CONVERSATION:
${history || '(none)'}

CALLER'S LATEST WORDS:
${callerSpeech}

Return ONLY valid JSON matching the supplied schema. The reply must sound like something Darren would actually say aloud. Keep it under 45 words unless a safety or clarification reason genuinely requires more.`;

  const response = await withTimeout((signal) => fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST', signal,
    headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
    body:JSON.stringify({
      model:process.env.CALMCALL_OPENAI_MODEL || 'gpt-5-mini',
      messages:[{role:'system',content:'You are a production voice-agent decision engine. Output only JSON.'},{role:'user',content:prompt}],
      max_completion_tokens:900,
      reasoning_effort:'low',
      response_format:{type:'json_schema',json_schema:{name:'darren_turn',strict:true,schema:{type:'object',additionalProperties:false,properties:{
        reply:{type:'string'},
        intent:{type:'string',enum:['information','demo_interest','callback','booking','support','complaint','spam','not_interested','unknown']},
        action:{type:'string',enum:['continue','callback_requested','human_handoff','end_call']},
        lead:{type:'object',additionalProperties:false,properties:{
          name:{type:'string'},company:{type:'string'},industry:{type:'string'},location:{type:'string'},teamSize:{type:'string'},reason:{type:'string'},missedCalls:{type:'string'},jobValue:{type:'string'},urgency:{type:'string'},decisionMaker:{type:'boolean'},callbackTime:{type:'string'},email:{type:'string'},interest:{type:'string'},notes:{type:'string'},score:{type:'integer',minimum:0,maximum:100},temperature:{type:'string',enum:['cold','warm','hot']}
        },required:['name','company','industry','location','teamSize','reason','missedCalls','jobValue','urgency','decisionMaker','callbackTime','email','interest','notes','score','temperature']}
      },required:['reply','intent','action','lead']}}}}
    }),
  }),9000);
  if (!response.ok) { const body=await response.text().catch(()=> ''); throw new Error(`OpenAI ${response.status}: ${body.slice(0,500)}`); }
  const data=await response.json();
  const text=data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI returned no content');
  return JSON.parse(text);
}

export async function withTimeout(fn, ms) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),ms);
  try{return await fn(controller.signal);} finally{clearTimeout(timer);}
}

export async function synthesizeSpeech(text) {
  const voiceId=process.env.ELEVENLABS_VOICE_ID;
  if(!voiceId || !process.env.ELEVENLABS_API_KEY) throw new Error('ElevenLabs environment variables are missing');
  const response=await withTimeout((signal)=>fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`,{
    method:'POST',signal,headers:{'Content-Type':'application/json','xi-api-key':process.env.ELEVENLABS_API_KEY},
    body:JSON.stringify({text:cleanText(text,1200),model_id:process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5',voice_settings:{stability:0.42,similarity_boost:0.82,style:0.15,use_speaker_boost:true}})
  }),7000);
  if(!response.ok) throw new Error(`ElevenLabs ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function audioUrlFor(text, cacheKey) {
  const path=`twilio-pitches/${cacheKey}.mp3`;
  try{return (await head(path)).url;}catch(_){}
  return (await put(path,await synthesizeSpeech(text),{access:'public',contentType:'audio/mpeg',allowOverwrite:true})).url;
}
export async function createDynamicAudio(text){const hash=crypto.createHash('sha256').update(text).digest('hex').slice(0,32);return audioUrlFor(text,`darren-${hash}`);}

export function twimlForTurn({text,audioUrl,actionUrl,hangup=false,handoffNumber=''}){
  const voice=audioUrl?`<Play>${escapeXml(audioUrl)}</Play>`:`<Say voice="Polly.Amy">${escapeXml(text)}</Say>`;
  if(handoffNumber)return `<?xml version="1.0" encoding="UTF-8"?><Response>${voice}<Dial timeout="20" answerOnBridge="true"><Number>${escapeXml(handoffNumber)}</Number></Dial></Response>`;
  if(hangup)return `<?xml version="1.0" encoding="UTF-8"?><Response>${voice}<Hangup/></Response>`;
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="speech" action="${escapeXml(actionUrl)}" method="POST" speechTimeout="auto" timeout="6" actionOnEmptyResult="true" language="en-GB" speechModel="phone_call">${voice}</Gather><Say voice="Polly.Amy">Sorry, I didn't catch that. Could you say that again?</Say></Response>`;
}

export function initialSession(callSid,from,to){return{version:2,callSid,from,to,createdAt:new Date().toISOString(),turns:0,history:[],lead:{name:'',company:'',industry:'',location:'',teamSize:'',reason:'',missedCalls:'',jobValue:'',urgency:'',decisionMaker:false,callbackTime:'',email:'',interest:'',notes:'',score:30,temperature:'cold'}};}

export async function emitLead(session,reason='turn'){
  const payload={event:'voice_lead_update',reason,timestamp:new Date().toISOString(),callSid:session.callSid,from:session.from,to:session.to,createdAt:session.createdAt,turns:session.turns,lead:session.lead,history:session.history};
  const webhook=process.env.CALMCALL_CRM_WEBHOOK_URL;
  if(webhook){try{await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json','x-calmcall-event':'voice_lead_update'},body:JSON.stringify(payload)});}catch(err){console.error('CRM webhook failed:',err);}}
  try{await put(`twilio-leads/${session.callSid || crypto.randomUUID()}.json`,Buffer.from(encryptSession(payload)),{access:'public',contentType:'text/plain',allowOverwrite:true});}catch(err){console.error('Lead archive failed:',err);}
}

export function validateTwilioRequest(req){
  const token=process.env.TWILIO_AUTH_TOKEN;
  if(!token || process.env.TWILIO_VALIDATE_SIGNATURE==='false')return true;
  const signature=req.headers?.['x-twilio-signature']; if(!signature)return false;
  const proto=req.headers?.['x-forwarded-proto'] || 'https'; const host=req.headers?.host; if(!host)return false;
  const url=`${proto}://${host}${req.url || ''}`; const params=req.body || {};
  const data=Object.keys(params).sort().reduce((out,key)=>out+key+params[key],url);
  const expected=crypto.createHmac('sha1',token).update(data).digest('base64');
  if(signature.length!==expected.length)return false;
  return crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected));
}

export async function sendSms(to,body){
  if(!to||!process.env.TWILIO_ACCOUNT_SID||!process.env.TWILIO_AUTH_TOKEN||!process.env.TWILIO_PHONE_NUMBER)return false;
  const auth=Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const params=new URLSearchParams({To:to,From:process.env.TWILIO_PHONE_NUMBER,Body:body.slice(0,1500)});
  const response=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/x-www-form-urlencoded'},body:params});
  if(!response.ok)throw new Error(`Twilio SMS ${response.status}`); return true;
}
