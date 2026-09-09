# Darren V2 voice agent

This branch replaces the old fixed-step voice questionnaire with a conversational turn-based agent.

## Environment variables

Required:

- `OPENAI_API_KEY` - OpenAI API key used for conversation decisions.
- `ELEVENLABS_API_KEY` - ElevenLabs API key.
- `ELEVENLABS_VOICE_ID` - Darren's ElevenLabs voice ID.
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token, already required by the existing voice system.
- `CALMCALL_SESSION_SECRET` - long random secret used to encrypt call state before it is stored in Blob.

Recommended:

- `TWILIO_ACCOUNT_SID` - Twilio account SID for outbound SMS.
- `TWILIO_AUTH_TOKEN` - Twilio auth token.
- `TWILIO_PHONE_NUMBER` - CalmCall Twilio number used as the SMS sender.
- `CALMCALL_CRM_WEBHOOK_URL` - optional webhook receiving structured lead updates.
- `CALMCALL_HANDOFF_NUMBER` - optional human number Darren can transfer callers to when a human handoff is required.
- `CALMCALL_OPENAI_MODEL` - optional model override; defaults to `gpt-5-mini`.
- `ELEVENLABS_MODEL` - optional TTS model override; defaults to `eleven_flash_v2_5`.
- `CALMCALL_VOICE_BASE_URL` - optional public voice webhook URL override.
- `TWILIO_VALIDATE_SIGNATURE=false` - optional emergency switch to disable signature validation; leave unset in production.

## Twilio setup

Set the phone number's incoming voice webhook to:

`https://www.calmcall.co.uk/api/twilio/voice`

Use HTTP POST.

The voice handler creates a per-call session, asks OpenAI to decide the next conversational turn, generates Darren's reply with ElevenLabs, and returns TwiML to collect the next speech result.

If `CALMCALL_HANDOFF_NUMBER` is configured and Darren chooses `human_handoff`, the call is dialled to that number.

## CRM payload

When `CALMCALL_CRM_WEBHOOK_URL` is configured, CalmCall sends a `voice_lead_update` JSON payload containing the Twilio Call SID, caller number, conversation history and structured lead fields including score and temperature.

The lead is also archived in encrypted Vercel Blob storage.

## Important limitation

This is the production-friendly V2 turn-based architecture. It is intentionally separate from the main branch. It does not yet use a bidirectional Twilio Media Stream, so it should be tested before being promoted to `main`. A later V3 can move the same Darren brain and tools onto a realtime streaming transport for lower latency and interruption handling.
