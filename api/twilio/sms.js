export default function handler(req, res) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml);
}
