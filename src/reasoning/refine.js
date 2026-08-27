// Answer refinement. Pure functions.
//
// This module EXTENDS the frozen Phase 2.5 pipeline rather than modifying it:
// pipeline.js classifies raw text and is untouched. refine.js takes that result
// plus the citizen's clarification answers and produces the refined outcome.
//
// Kept separate so the frozen corpus keeps testing exactly what it tested before.

import { DOMAINS } from './taxonomy.js';

function domainById(id) {
  return DOMAINS.find((d) => d.id === id) ?? null;
}

/**
 * @param {import('./pipeline').ReasoningResult} result
 * @param {Record<string,string>} answers
 * @returns {import('./pipeline').ReasoningResult}
 */
export function refine(result, answers) {
  let out = { ...result, trace: { ...result.trace, stages: [...result.trace.stages, 'refined'] } };

  // Disambiguation between contested domains.
  const chosen = answers.which_domain;
  if (chosen) {
    if (chosen === 'none') {
      return {
        ...out,
        classification: 'unsupported',
        domain: null,
        confidence: 0,
        confidence_band: 'low',
        next_action: 'explain_limit',
        candidate_authorities: [],
        information_types: [],
        required_questions: [],
        reasoning:
          'This prototype covers pension, provident fund, passport, railways and income tax in depth. Yours is something else: you can still search every public authority yourself, and we will show you what a good request looks like.',
      };
    }
    const d = domainById(chosen);
    if (d) {
      out = {
        ...out,
        classification: 'supported',
        domain: d.id,
        confidence: 0.8,
        confidence_band: 'high',
        candidate_authorities: d.authorities,
        information_types: d.infoTypes,
        required_questions: d.questions,
        next_action: 'continue',
        reasoning: `Thanks: that makes it a ${d.label.toLowerCase()} matter. The office below is likely to hold these records.`,
      };
    }
  }

  // Pension has three genuinely different destinations, and one of them costs money
  // to get wrong (a state social pension filed centrally is returned without refund).
  const pensionType = answers.pension_type;
  if (pensionType) {
    if (pensionType === 'social') {
      return {
        ...out,
        classification: 'unsupported',
        domain: null,
        confidence: 0.75,
        confidence_band: 'high',
        candidate_authorities: [],
        required_questions: [],
        information_types: [],
        next_action: 'explain_limit',
        reasoning:
          'Old-age and social welfare pensions are almost always run by your state government, not by a central ministry.',
        warnings: [
          'If you file this on the central RTI portal it will be returned to you, and the fee is not refunded. Use your own state’s RTI route instead.',
        ],
      };
    }
    if (pensionType === 'eps') {
      const pf = domainById('provident_fund');
      out = {
        ...out,
        classification: 'supported',
        domain: 'provident_fund',
        confidence: 0.8,
        confidence_band: 'high',
        candidate_authorities: pf.authorities,
        information_types: pf.infoTypes,
        next_action: 'continue',
        reasoning:
          'An EPS pension is administered by the Employees Provident Fund Organisation, so that is where these records sit.',
      };
    }
    if (pensionType === 'central') {
      const pen = domainById('pension');
      out = {
        ...out,
        classification: 'supported',
        domain: 'pension',
        confidence: 0.85,
        confidence_band: 'high',
        candidate_authorities: pen.authorities,
        information_types: pen.infoTypes,
        next_action: 'continue',
        reasoning:
          'For a central government service pension, these records are held by the pension department and the accounting office that authorises payment.',
      };
    }
    if (pensionType === 'unknown') {
      out = {
        ...out,
        confidence: 0.45,
        confidence_band: 'medium',
        next_action: 'continue',
        reasoning:
          'We are not certain which kind of pension this is, so treat the office below as a best guess: check the alternatives before you file.',
      };
    }
  }

  // Remaining answers narrow which records to ask for, not where to send it.
  return { ...out, required_questions: [] };
}

/** Questions still to ask, given what has been answered. Never more than three. */
export function pendingQuestions(result, answers) {
  return (result.required_questions ?? []).filter((q) => !answers[q.id]).slice(0, 3);
}
