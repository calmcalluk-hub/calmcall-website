import { sendSms } from './_darren.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  const from = String(req.body?.From || '');
  const body = String(req.body?.Body || '').trim().toLowerCase();

  // Lightweight confirmation handling. The voice agent can ask callers to reply YES
  // after a callback request. Full two-way SMS automation can be layered on later.
  if (from && ['yes', 'y', 'confirm', 'confirmed'].includes(body)) {
    try {
      await sendSms(from, 'Thanks, got it. The CalmCall team has your confirmation and will follow up.');
    } catch (err) {
      console.error('Inbound SMS response failed:', err);
    }
  }

  return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
}
