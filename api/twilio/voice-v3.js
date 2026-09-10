const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID || 'proj_zJO9c3hazOg8RnLAimXDhrud';
const OPENAI_SIP_HOST = process.env.OPENAI_SIP_HOST || 'sip.api.openai.com';

export const config = { api: { bodyParser: false } };

function xmlEscape(value) {
  return String(value).replace(/[<>&'\"]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c]));
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  if (req.method !== 'POST') {
    return res.status(405).send('<?xml version="1.0"?><Response><Say>Method not allowed.</Say><Hangup/></Response>');
  }

  if (!OPENAI_PROJECT_ID) {
    console.error('Darren V3 missing OPENAI_PROJECT_ID');
    return res.status(200).send('<?xml version="1.0"?><Response><Say>Sorry, we are having trouble connecting you. Please try again shortly.</Say><Hangup/></Response>');
  }

  const sipUri = `sip:${OPENAI_PROJECT_ID}@${OPENAI_SIP_HOST};transport=tls`;
  const body = `<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Sip>${xmlEscape(sipUri)}</Sip></Dial></Response>`;
  return res.status(200).send(body);
}
