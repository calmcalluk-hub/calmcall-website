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
};

function matchTrade(speech) {
  if (!speech) return null;
  const text = speech.toLowerCase();
  for (const keyword of Object.keys(TRADE_INFO)) {
    if (text.includes(keyword)) return TRADE_INFO[keyword];
  }
  return null;
}

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[c]));
}

function fallbackMessage(trade) {
  return trade
    ? `Perfect. CalmCall can help you save money by making sure calls like this never go unanswered. ${trade.label} typically lose around ${trade.value} pounds every time a job like ${trade.example} slips through. We'd have answered instantly, captured the details, and got it booked back in, automatically. Head to calmcall dot co dot uk to book a demo. Thanks for calling.`
    : `Perfect. CalmCall can help you save money by making sure calls like this never go unanswered. Every trade and service business loses jobs to missed calls. We'd have answered instantly, captured the details, and got it booked back in, automatically. Head to calmcall dot co dot uk to book a demo. Thanks for calling.`;
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

async function generatePitchText(trade) {
  const context = trade
    ? `The caller said they run a ${trade.label} business. A typical missed job for them, like ${trade.example}, costs around £${trade.value}.`
    : `The caller didn't name a recognisable trade, so keep it general.`;

  const response = await withTimeout((signal) => fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: 'You write short, warm, spoken-word phone pitches for CalmCall, a UK service that answers missed calls for trade and service businesses. Reply with ONE short paragraph only, 3-4 sentences, no headings, no markdown, written to be read aloud by a text-to-speech voice. Always end by inviting the caller to visit calmcall dot co dot uk to book a demo, and thank them for calling.',
        },
        { role: 'user', content: context },
      ],
      max_completion_tokens: 220,
    }),
  }), 6000);

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`OpenAI error ${response.status}: ${errBody.slice(0, 300)}`);
  }
  const data = await response.json();
  const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
    ? data.choices[0].message.content.trim()
    : '';
  if (!text) throw new Error('OpenAI returned no text');
  return text;
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

async function uploadAudio(buffer) {
  const filename = `twilio-pitches/${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`;
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: 'audio/mpeg',
    addRandomSuffix: true,
  });
  return blob.url;
}

const GREETING_TEXT = "Welcome to CalmCall. Please specify what business you're calling from.";
const GREETING_BLOB_PATH = 'twilio-pitches/greeting.mp3';

async function getGreetingAudioUrl() {
  try {
    const existing = await head(GREETING_BLOB_PATH);
    return existing.url;
  } catch (err) {
    // Not cached yet - fall through and generate it below.
  }
  const audioBuffer = await synthesizeSpeech(GREETING_TEXT);
  const blob = await put(GREETING_BLOB_PATH, audioBuffer, {
    access: 'public',
    contentType: 'audio/mpeg',
    allowOverwrite: true,
  });
  return blob.url;
}

export default async function handler(req, res) {
  const speech = req.body && req.body.SpeechResult;
  res.setHeader('Content-Type', 'text/xml');

  if (!speech) {
    let greetingTwiml;
    try {
      const audioUrl = await getGreetingAudioUrl();
      greetingTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://www.calmcall.co.uk/api/twilio/voice" method="POST" speechTimeout="auto" language="en-GB">
    <Play>${escapeXml(audioUrl)}</Play>
  </Gather>
  <Say voice="Polly.Amy">Sorry, we didn't catch that. Give us a call back any time.</Say>
</Response>`;
    } catch (err) {
      console.error('Greeting AI voice failed, falling back to canned message:', err);
      greetingTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://www.calmcall.co.uk/api/twilio/voice" method="POST" speechTimeout="auto" language="en-GB">
    <Say voice="Polly.Amy">Welcome to CalmCall. Please specify what business you're calling from.</Say>
  </Gather>
  <Say voice="Polly.Amy">Sorry, we didn't catch that. Give us a call back any time.</Say>
</Response>`;
    }
    return res.status(200).send(greetingTwiml);
  }
  
  const trade = matchTrade(speech);

  try {
    const pitchText = await generatePitchText(trade);
    const audioBuffer = await synthesizeSpeech(pitchText);
    const audioUrl = await uploadAudio(audioBuffer);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${escapeXml(audioUrl)}</Play>
</Response>`;
    return res.status(200).send(twiml);
  } catch (err) {
    console.error('AI voice pipeline failed, falling back to canned message:', err);
    const message = fallbackMessage(trade);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy">${escapeXml(message)}</Say>
</Response>`;
    return res.status(200).send(twiml);
  }
}
