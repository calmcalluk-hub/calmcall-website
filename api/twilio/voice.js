export default function handler(req, res) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy">Thanks for calling CalmCall. Please hold while we connect you.</Say>
</Response>`;
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml);
}
