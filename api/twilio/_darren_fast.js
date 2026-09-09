const { askDarren, withTimeout } = require('./_darren.js');

async function askDarrenFast(session, callerSpeech) {
  // Keep the same conversational brain, but avoid rebuilding the full discovery prompt/history
  // for every phone turn. This lightweight wrapper is intentionally conservative: it sends only
  // the latest few turns and the essential lead context.
  const original = session.history || [];
  const compactSession = {
    ...session,
    history: original.slice(-4),
    lead: {
      name: session.lead?.name || '',
      company: session.lead?.company || '',
      industry: session.lead?.industry || '',
      reason: session.lead?.reason || '',
      missedCalls: session.lead?.missedCalls || '',
      interest: session.lead?.interest || '',
      score: session.lead?.score || 30,
      temperature: session.lead?.temperature || 'cold',
    },
  };
  return askDarren(compactSession, callerSpeech);
}

module.exports = { askDarrenFast, withTimeout };
