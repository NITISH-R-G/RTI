// Deterministic reasoning pipeline. Pure functions only.
// No network, no LLM, no global mutable state, no UI imports.
// Every stage is inspectable: run() returns a `trace` describing how it decided.

import {
  DOMAINS, STATE_SIGNALS, ACTION_SIGNALS, OPINION_SIGNALS,
  THIRD_PARTY_SIGNALS, GRIEVANCE_SIGNALS, CROSS_DOMAIN_WORDS, EXPANSIONS, PROBLEM_SIGNALS,
} from './taxonomy.js';

export const MAX_INPUT = 5000;

// ---------------------------------------------------------------- normalise

export function normalise(raw) {
  const clipped = String(raw ?? '').slice(0, MAX_INPUT);
  const lowered = clipped
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/n['’]t\b/g, ' not')          // hasn't -> has not
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = lowered.split(' ').filter(Boolean);
  const expanded = [];
  for (const t of tokens) {
    const bare = t.replace(/'/g, '');
    expanded.push(bare);
    if (EXPANSIONS[bare]) expanded.push(...EXPANSIONS[bare].split(' '));
  }
  return { text: expanded.join(' '), tokens: expanded, original: clipped };
}

// ---------------------------------------------------------------- fuzzy

/** Bounded Levenshtein: returns true when within `max` edits. */
export function withinEdits(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let best = cur[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return false;
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length] <= max;
}

function fuzzyHit(tokens, word) {
  const max = word.length >= 8 ? 2 : 1;
  return tokens.some((t) => t.length >= 4 && withinEdits(t, word, max));
}

// ---------------------------------------------------------------- signals

function phraseHits(text, phrases) {
  return phrases.filter((p) => text.includes(p));
}

// ---------------------------------------------------------------- scoring

const W = { strong: 5, weak: 2, fuzzy: 3, negative: -4, crossOnly: 0 };

export function scoreDomains(norm) {
  return DOMAINS.map((d) => {
    const hits = { strong: [], weak: [], fuzzy: [], negative: [] };
    let score = 0;

    for (const k of d.strong) {
      if (norm.text.includes(k)) { hits.strong.push(k); score += W.strong; }
    }
    for (const k of d.weak) {
      if (norm.text.includes(k)) { hits.weak.push(k); score += W.weak; }
    }
    // Fuzzy matching exists to rescue typos. If the domain already matched a keyword
    // exactly, fuzzy would double-count morphological variants of the same token
    // (e.g. token "pension" fuzzy-matching the keyword "pensioner"), so skip it.
    if (hits.strong.length === 0) {
      for (const k of d.fuzzy) {
        if (fuzzyHit(norm.tokens, k)) { hits.fuzzy.push(k); score += W.fuzzy; }
      }
    }
    for (const k of d.negative) {
      if (norm.text.includes(k)) { hits.negative.push(k); score += W.negative; }
    }

    // A domain claimed only by cross-domain words has no real evidence.
    const distinctive = hits.strong.length + hits.fuzzy.length;
    const onlyCross = distinctive === 0 &&
      hits.weak.every((w) => CROSS_DOMAIN_WORDS.includes(w));
    if (onlyCross) score = Math.min(score, 2);

    return { id: d.id, label: d.label, score: Math.max(0, score), hits, distinctive };
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

// ---------------------------------------------------------------- confidence

export function band(confidence) {
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
}

function confidenceFrom(top, second) {
  if (!top || top.score === 0) return 0;
  const strength = Math.min(1, top.score / 10);          // 10+ points saturates
  const margin = Math.min(1, (top.score - (second?.score ?? 0)) / 6);
  const raw = 0.35 * strength + 0.65 * margin;
  return Math.round(Math.min(1, Math.max(0, raw)) * 100) / 100;
}

// ---------------------------------------------------------------- result

function result(partial) {
  const r = {
    classification: 'unsupported',
    domain: null,
    confidence: 0,
    confidence_band: 'low',
    next_action: 'explain_limit',
    candidate_authorities: [],
    reasoning: '',
    required_questions: [],
    information_types: [],
    warnings: [],
    trace: {},
    ...partial,
  };
  r.confidence_band = band(r.confidence);
  return r;
}

function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}

function questionsFor(id) {
  const d = domainById(id);
  return d ? d.questions : [];
}

function disambiguationQuestion(candidates) {
  return {
    id: 'which_domain',
    text: 'Which of these is your situation about?',
    options: [
      ...candidates.map((c) => ({ value: c.id, label: domainById(c.id).label })),
      { value: 'none', label: 'None of these' },
    ],
  };
}

// ---------------------------------------------------------------- pipeline

export function run(rawInput) {
  const norm = normalise(rawInput);
  const trace = { normalised: norm.text.slice(0, 200), stages: [] };

  // 1 — no usable input
  if (norm.tokens.length === 0) {
    trace.stages.push('empty-input');
    return result({
      classification: 'unsupported',
      reasoning: 'Tell us what happened, in your own words, and we will take it from there.',
      next_action: 'explain_limit',
      trace,
    });
  }

  const scored = scoreDomains(norm);
  const top = scored[0];
  const second = scored[1];
  trace.stages.push('scored');
  trace.scores = scored.map((s) => ({ id: s.id, score: s.score, distinctive: s.distinctive }));

  // 2 — not an RTI matter (checked before domain routing, but domain is still reported)
  const opinion = phraseHits(norm.text, OPINION_SIGNALS);
  const thirdParty = phraseHits(norm.text, THIRD_PARTY_SIGNALS);
  const grievance = phraseHits(norm.text, GRIEVANCE_SIGNALS);
  const action = phraseHits(norm.text, ACTION_SIGNALS);
  const likelyDomain = top.score > 0 && top.distinctive > 0 ? top.id : null;

  if (opinion.length) {
    trace.stages.push('not-rti:opinion');
    return result({
      classification: 'not_rti', domain: likelyDomain, confidence: 0.8,
      reasoning: 'RTI gives you records the government already holds — it does not provide opinions or views. You can ask for the file notings or policy documents behind a decision instead.',
      next_action: 'explain_limit', trace,
    });
  }
  if (thirdParty.length) {
    trace.stages.push('not-rti:third-party');
    return result({
      classification: 'not_rti', domain: likelyDomain, confidence: 0.8,
      reasoning: 'This asks for another person’s personal information, which is normally exempt under the RTI Act. You can ask for records about your own case instead.',
      next_action: 'explain_limit', trace,
    });
  }
  if (grievance.length) {
    trace.stages.push('not-rti:grievance');
    return result({
      classification: 'not_rti', domain: likelyDomain, confidence: 0.75,
      reasoning: 'This reads as a complaint asking for action. RTI obtains records; it does not investigate or resolve. A public grievance channel is the better route — and you can still use RTI afterwards to ask what was done.',
      next_action: 'explain_limit', trace,
    });
  }
  if (action.length && !likelyDomain) {
    trace.stages.push('not-rti:action-no-domain');
    return result({
      classification: 'not_rti', domain: null, confidence: 0.6,
      reasoning: 'RTI lets you see the records behind a decision — it cannot compel an office to act or to penalise anyone. If you tell us what happened, we can help you ask for the file instead.',
      next_action: 'explain_limit', trace,
    });
  }
  if (action.length && likelyDomain) {
    trace.stages.push('not-rti:action-with-domain');
    const d = domainById(likelyDomain);
    return result({
      classification: 'not_rti', domain: likelyDomain, confidence: 0.6,
      reasoning: `RTI cannot make an office act — but it can make them show you the file. We can turn this into a request for the ${d.label.toLowerCase()} records instead.`,
      next_action: 'clarify',
      required_questions: questionsFor(likelyDomain),
      information_types: d.infoTypes,
      trace,
    });
  }

  // 3 — state subject: never route centrally, and warn about the fee
  const stateHits = phraseHits(norm.text, STATE_SIGNALS);
  if (stateHits.length && top.distinctive > 0) {
    trace.stages.push('state-signal-with-domain');
    const d = domainById(top.id);
    return result({
      classification: 'ambiguous', domain: top.id, confidence: 0.35,
      reasoning: `This may be a ${d.label.toLowerCase()} matter handled centrally, or one handled by your state government. We need to know which before pointing you anywhere.`,
      warnings: ['If this is a state matter, the central RTI portal returns the application and the fee is not refunded.'],
      next_action: 'clarify',
      required_questions: questionsFor(top.id),
      information_types: d.infoTypes,
      trace,
    });
  }
  if (stateHits.length && top.distinctive === 0) {
    trace.stages.push('state-subject');
    return result({
      classification: 'unsupported', domain: null, confidence: 0.7,
      reasoning: 'This looks like a matter handled by your state government, not by a central ministry.',
      warnings: ['The central RTI portal returns applications meant for state public authorities — and the fee is not refunded. File through your own state’s RTI route instead.'],
      next_action: 'explain_limit', trace,
    });
  }

  // 4 — no domain signal at all
  if (top.score === 0) {
    trace.stages.push('no-signal');
    return result({
      classification: 'unsupported', domain: null, confidence: 0,
      reasoning: 'We could not tell which government office this belongs to. This prototype covers pension, provident fund, passport, railways and income tax in depth — you can still search all public authorities yourself, and we will show you what a good request looks like.',
      next_action: 'explain_limit', trace,
    });
  }

  // 5 — weak or contested signal: ask, never guess
  const confidence = confidenceFrom(top, second);
  const contenders = scored.filter((s) => s.score > 0 && s.score >= top.score - 2 && s.distinctive > 0);
  const contested = contenders.length > 1;

  if (contested || confidence < 0.4 || top.distinctive === 0) {
    trace.stages.push(contested ? 'ambiguous:contested' : 'ambiguous:weak');
    const cands = (contested ? contenders : scored.filter((s) => s.score > 0)).slice(0, 3);
    const qs = contested
      ? [disambiguationQuestion(cands)]
      : (cands[0] ? questionsFor(cands[0].id) : []);
    return result({
      classification: 'ambiguous',
      // Report the leading candidate even while asking - the citizen deserves to see
      // what we think it might be, rather than a blank.
      domain: cands[0]?.id ?? null,
      confidence,
      reasoning: contested
        ? `This could be about ${cands.map((c) => domainById(c.id).label.toLowerCase()).join(' or ')}. One quick question and we can point you the right way.`
        : 'We have an idea what this is about, but not enough to be sure. One quick question will settle it.',
      next_action: 'clarify',
      required_questions: qs.length ? qs : [disambiguationQuestion(cands)],
      candidate_authorities: [],
      information_types: cands[0] ? domainById(cands[0].id).infoTypes : [],
      trace,
    });
  }

  // 6 — supported. If we know the topic but the citizen has not described a problem,
  // we know WHAT it is about but not WHAT THEY WANT — so ask instead of routing.
  const describesProblem = phraseHits(norm.text, PROBLEM_SIGNALS).length > 0;
  trace.stages.push(describesProblem ? 'supported' : 'supported:no-problem-signal');
  const d = domainById(top.id);
  return result({
    classification: 'supported',
    domain: top.id,
    confidence,
    reasoning: describesProblem
      ? `This looks like a ${d.label.toLowerCase()} matter. Based on what you described, the office below is likely to hold these records — you can change it if you know better.`
      : `This looks like it concerns ${d.label.toLowerCase()}, but we are not sure what you want to find out. Tell us a little more and we can point you the right way.`,
    next_action: (describesProblem && confidence >= 0.7) ? 'continue' : 'clarify',
    candidate_authorities: d.authorities,
    information_types: d.infoTypes,
    required_questions: d.questions,
    trace,
  });
}
