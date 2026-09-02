import { emitLead, loadSession } from './_darren.js';

export default async function handler(req, res) {
  res.statusCode = 204;
  if (req.method !== 'POST') return res.end();
  try {
    const id = req.query?.session ? String(req.query.session) : '';
    if (!id) return res.end();
    const session = await loadSession(id);
    session.callStatus = String(req.body?.CallStatus || '');
    session.duration = String(req.body?.CallDuration || '');
    session.endedAt = new Date().toISOString();
    await emitLead(session, `status:${session.callStatus || 'unknown'}`);
  } catch (err) {
    console.error('Call status webhook failed:', err);
  }
  return res.end();
}
