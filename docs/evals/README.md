# AI evaluation cases

Deterministic cases with recorded expectations, run by `npm run eval`. Results go to `docs/agent-memory/11-evaluation-log.md`.

**Status: no cases written yet.** The case list to build is in `docs/agent-memory/09-ai-behavior.md`: normal, ambiguous, one-word, very long, misspelled, Hindi, Hinglish, not-an-RTI-matter, opinion-seeking, third-party personal data, missing-detail, Aadhaar-shaped input, prompt injection, hallucination trap, and state-authority cases.

Each case file records: input, expected classification, expected refusal or uncertainty behaviour, and what must *not* appear in the output (a fabricated authority, a fee, a deadline, a section number).
