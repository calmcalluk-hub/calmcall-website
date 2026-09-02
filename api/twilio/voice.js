import { put, head } from '@vercel/blob';

const TRADE_INFO = {
  plumber: { label: 'plumbers', example: 'a burst pipe callout', value: 220 },
  plumbing: { label: 'plumbers', example: 'a burst pipe callout', value: 220 },
  mechanic: { label: 'mechanics', example: 'a brake job', value: 280 },
  garage: { label: 'mechanics', example: 'a brake job', value: 280 },
  electrician: { label: 'electricians', example: 'a fault call-out', value: 210 },
  locksmith: { label: 'locksmiths', example: 'a lockout', value: 120 },
  jeweller: { label: 'jewellers', example: 'a repair or valuation', value: 150 },
  jewellery: { label: 'jewellers', example: 'a repair or valuation', value: 150 },
  beauty: { label: 'beauty salons', example: 'a treatment booking', value: 65 },
  salon: { label: 'salons', example: 'a treatment booking', value: 65 },
  beautician: { label: 'beauticians', example: 'a treatment booking', value: 65 },
  surveyor: { label: 'surveyors', example: 'a property survey', value: 350 },
  barber: { label: 'barbers', example: 'a haircut booking', value: 35 },
  hairdresser: { label: 'hairdressers', example: 'a haircut booking', value: 45 },
  dentist: { label: 'dentists', example: 'a check-up', value: 150 },
  veterinary: { label: 'vets', example: 'a pet consultation', value: 90 },
  accountant: { label: 'accountants', example: 'a tax return', value: 220 },
  solicitor: { label: 'solicitors', example: 'a legal consultation', value: 300 },
  roofer: { label: 'roofers', example: 'a roof repair', value: 350 },
  builder: { label: 'builders', example: 'a renovation quote', value: 450 },
  decorator: { label: 'painters and decorators', example: 'a room repaint', value: 180 },
  cleaner: { label: 'cleaning companies', example: 'a deep clean booking', value: 80 },
  gardener: { label: 'gardeners', example: 'a garden clearance', value: 120 },
  landscaper: { label: 'landscapers', example: 'a garden project', value: 300 },
};

function matchTrade(speech) {
  if (!speech) return null;
  const text = speech.toLowerCase();
  for (const keyword of Object.keys(TRADE_INFO)) {
    if (text.includes(keyword)) return TRADE_INFO[keyword];
  }
  return null;
}

function tradeKeyFor(trade) {
  if (!trade) return 'generic';
  return Object.keys(TRADE_INFO).find((k) => TRADE_INFO[k] === trade) || 'generic';
}

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[c]));
}

async function withTimeout(fn, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function synthesizeSpeech(text) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const response = await withTimeout((signal) => fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  }), 8000);

  if (!response.ok) throw new Error(`ElevenLabs error ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadAudio(buffer, fixedPath) {
  const filename = fixedPath || `twilio-pitches/${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`;
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: 'audio/mpeg',
    addRandomSuffix: !fixedPath,
    allowOverwrite: !!fixedPath,
  });
  return blob.url;
}

async function getCachedAudioUrl(cacheKey, text) {
  const path = `twilio-pitches/${cacheKey}.mp3`;
  try {
    const existing = await head(path);
    return existing.url;
  } catch (err) {
    // Not cached yet - fall through and generate it below.
  }
  const buffer = await synthesizeSpeech(text);
  return uploadAudio(buffer, path);
}

const BASE_URL = 'https://www.calmcall.co.uk/api/twilio/voice';
const GREETING_TEXT = "Welcome to CalmCall. Please specify what business you're calling from.";
const COMPANY_PROMPT = "Thank you. Could you tell me whether you're an independent business, or if you have multiple staff?";
const SIZE_PROMPT = "Great, thank you. CalmCall gives you 24 hour lead generation, along with callback time management. Someone from CalmCall can call you back any time between 9 and 8. What time would suit you?";
const RETRY_PROMPT = "Sorry, let's start again. What business are you calling from?";

function lossLine(trade) {
  if (!trade) {
    return "Missed calls like this cost businesses money every single day. Can I take the name of your company?";
  }
  const label = trade.label.charAt(0).toUpperCase() + trade.label.slice(1);
  return `${label} like yours typically lose around £${trade.value} every time a call like ${trade.example} goes unanswered. Can I take the name of your company?`;
}

function gatherTwiml(sayText, audioUrl, nextAction) {
  const voicePart = audioUrl
    ? `<Play>${escapeXml(audioUrl)}</Play>`
    : `<Say voice="Polly.Amy">${escapeXml(sayText)}</Say>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${escapeXml(nextAction)}" method="POST" speechTimeout="auto" language="en-GB">
    ${voicePart}
  </Gather>
  <Say voice="Polly.Amy">Sorry, we didn't catch that. Give us a call back any time.</Say>
</Response>`;
}

function finalTwiml(sayText, audioUrl) {
  const voicePart = audioUrl
    ? `<Play>${escapeXml(audioUrl)}</Play>`
    : `<Say voice="Polly.Amy">${escapeXml(sayText)}</Say>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${voicePart}
  <Hangup/>
</Response>`;
}

async function cachedOrNull(cacheKey, text) {
  try {
    return await getCachedAudioUrl(cacheKey, text);
  } catch (err) {
    console.error(`AI voice failed for "${cacheKey}", falling back to canned message:`, err);
    return null;
  }
}

export default async function handler(req, res) {
  const speech = req.body && req.body.SpeechResult;
  const step = (req.query && req.query.step) || '';
  res.setHeader('Content-Type', 'text/xml');

  try {
    if (!speech) {
      const audioUrl = await cachedOrNull('greeting', GREETING_TEXT);
      const nextAction = `${BASE_URL}?step=trade`;
      return res.status(200).send(gatherTwiml(GREETING_TEXT, audioUrl, nextAction));
    }

    if (step === 'trade') {
      const trade = matchTrade(speech);
      const tradeKey = tradeKeyFor(trade);
      const text = lossLine(trade);
      const audioUrl = await cachedOrNull(`loss-${tradeKey}`, text);
      const nextAction = `${BASE_URL}?step=company&trade=${encodeURIComponent(tradeKey)}`;
      return res.status(200).send(gatherTwiml(text, audioUrl, nextAction));
    }

    if (step === 'company') {
      const companyName = speech.trim();
      const trade = (req.query && req.query.trade) || 'generic';
      const audioUrl = await cachedOrNull('company-prompt', COMPANY_PROMPT);
      const nextAction = `${BASE_URL}?step=size&trade=${encodeURIComponent(trade)}&company=${encodeURIComponent(companyName)}`;
      return res.status(200).send(gatherTwiml(COMPANY_PROMPT, audioUrl, nextAction));
    }

    if (step === 'size') {
      const sizeAnswer = speech.trim();
      const trade = (req.query && req.query.trade) || 'generic';
      const company = (req.query && req.query.company) || '';
      const audioUrl = await cachedOrNull('size-prompt', SIZE_PROMPT);
      const nextAction = `${BASE_URL}?step=time&trade=${encodeURIComponent(trade)}&company=${encodeURIComponent(company)}&size=${encodeURIComponent(sizeAnswer)}`;
      return res.status(200).send(gatherTwiml(SIZE_PROMPT, audioUrl, nextAction));
    }

    if (step === 'time') {
      const callbackTime = speech.trim();
      const text = `Great, I've got your callback booked for ${callbackTime}. Thanks for calling CalmCall - head to calmcall dot co dot uk to find out more.`;
      let audioUrl = null;
      try {
        const buffer = await synthesizeSpeech(text);
        audioUrl = await uploadAudio(buffer);
      } catch (err) {
        console.error('Booking-confirmation AI voice failed, falling back to canned message:', err);
      }
      return res.status(200).send(finalTwiml(text, audioUrl));
    }

    const nextAction = `${BASE_URL}?step=trade`;
    return res.status(200).send(gatherTwiml(RETRY_PROMPT, null, nextAction));
  } catch (err) {
    console.error('Voice webhook failed entirely, falling back to canned message:', err);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy">Sorry, something went wrong. Please give us a call back any time.</Say>
</Response>`;
    return res.status(200).send(twiml);
  }
}
