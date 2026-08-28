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
export default function handler(req, res) {
  const speech = req.body && req.body.SpeechResult;
  res.setHeader('Content-Type', 'text/xml');
  if (!speech) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://www.calmcall.co.uk/api/twilio/voice" method="POST" speechTimeout="auto" language="en-GB">
    <Say voice="Polly.Amy">Welcome to CalmCall. Please specify what business you're calling from.</Say>
  </Gather>
  <Say voice="Polly.Amy">Sorry, we didn't catch that. Give us a call back any time.</Say>
</Response>`;
    return res.status(200).send(twiml);
  }
  const trade = matchTrade(speech);
  const message = trade
    ? `Perfect. CalmCall can help you save money by making sure calls like this never go unanswered. ${trade.label} typically lose around ${trade.value} pounds every time a job like ${trade.example} slips through. We'd have answered instantly, captured the details, and got it booked back in, automatically. Head to calmcall dot co dot uk to book a demo. Thanks for calling.`
    : `Perfect. CalmCall can help you save money by making sure calls like this never go unanswered. Every trade and service business loses jobs to missed calls. We'd have answered instantly, captured the details, and got it booked back in, automatically. Head to calmcall dot co dot uk to book a demo. Thanks for calling.`;
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy">${escapeXml(message)}</Say>
</Response>`;
  res.status(200).send(twiml);
}
