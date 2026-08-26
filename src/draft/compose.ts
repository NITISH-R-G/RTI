import { DOMAINS } from '../reasoning/taxonomy.js';
import { sanitiseRequestText, validateRequestText } from '../rules';

/**
 * Request composition.
 *
 * The request is built progressively from what the citizen selected, so they can
 * see exactly how their words became a request. There is no black box (PD-004).
 *
 * Every template is authored inside the portal's real allowed character set:
 * no apostrophes, no #, no ;, no quotes, no rupee sign. That is why the prose
 * reads "the applicant" rather than "I'm" — a constraint imposed by the observed
 * form, not a style choice (ED-004).
 */

export interface InfoOption {
  id: string;
  /** What the citizen sees — a question in their language. */
  label: string;
  /** The line that goes into the request — records language a CPIO can answer. */
  line: string;
  /**
   * A noun phrase for use inside prose. Splicing the question-form label into a
   * sentence produced "You are asking for when was my pension last paid", which
   * reads as machine-generated on the screen that most needs to feel trustworthy
   * (fresh-reviewer finding FR-2).
   */
  noun: string;
}

const GENERIC: InfoOption[] = [
  {
    id: 'status',
    label: 'What is the current status?',
    line: 'The current status of the matter described below, as recorded in your files.',
    noun: 'the current status',
  },
  {
    id: 'reason',
    label: 'Why has it been delayed?',
    line: 'The reason for the delay as recorded on the file, including any noting or remark made by the dealing officer.',
    noun: 'the reason for the delay',
  },
  {
    id: 'action',
    label: 'What action has been taken so far?',
    line: 'A list of the actions taken on this matter to date, with the date of each action.',
    noun: 'what has been done so far',
  },
  {
    id: 'documents',
    label: 'Which documents or records explain this?',
    line: 'Copies of the documents, file notings and correspondence relating to this matter.',
    noun: 'the documents on file',
  },
  {
    id: 'timeline',
    label: 'When can I expect it to be resolved?',
    line: 'The expected date of resolution or payment as recorded in your files, and the normal processing time prescribed for such cases.',
    noun: 'the expected date',
  },
  {
    id: 'rules',
    label: 'What rules or criteria were applied?',
    line: 'The rules, circulars or criteria applied while deciding this matter, with their reference numbers.',
    noun: 'the rules that were applied',
  },
];

/** Domain-specific options come first — they are the ones worth asking for. */
const DOMAIN_EXTRA: Record<string, InfoOption[]> = {
  pension: [
    {
      id: 'pension_last_paid',
      label: 'When was my pension last paid?',
      line: 'The date and amount of the last pension payment released in this case, and the mode of payment.',
      noun: 'the date of the last payment',
    },
    {
      id: 'pension_ppo',
      label: 'What does my pension file record?',
      line: 'The details recorded in the pension payment order relating to this case, and the date it was authorised.',
      noun: 'what the pension file records',
    },
  ],
  provident_fund: [
    {
      id: 'pf_claim_dates',
      label: 'When was my claim received and processed?',
      line: 'The date the claim was received, the dates of each stage of processing, and the officer who dealt with it.',
      noun: 'the claim processing dates',
    },
    {
      id: 'pf_employer',
      label: 'What has my employer deposited?',
      line: 'The contribution records held for this account, showing amounts received and the periods they relate to.',
      noun: 'the employer contribution records',
    },
  ],
  passport: [
    {
      id: 'passport_verification',
      label: 'What is the police verification status?',
      line: 'The date the police verification report was requested, the date it was received, and its recorded outcome.',
      noun: 'the police verification status',
    },
    {
      id: 'passport_dispatch',
      label: 'Has it been printed or dispatched?',
      line: 'The printing and dispatch status of the passport booklet, with dates and any despatch reference recorded.',
      noun: 'the printing and dispatch status',
    },
  ],
  railways: [
    {
      id: 'rail_refund_amount',
      label: 'What refund was sanctioned?',
      line: 'The amount of refund sanctioned in this case, the date it was sanctioned, and the date it was released.',
      noun: 'the refund sanctioned',
    },
    {
      id: 'rail_rules',
      label: 'What refund rules applied?',
      line: 'The refund rules applied to this class of ticket, with the circular reference under which they were applied.',
      noun: 'the refund rules applied',
    },
  ],
  income_tax: [
    {
      id: 'tax_processing',
      label: 'When was my return processed?',
      line: 'The date the return was processed, and the date any refund was determined and issued.',
      noun: 'when the return was processed',
    },
    {
      id: 'tax_adjustment',
      label: 'Was my refund adjusted against a demand?',
      line: 'Details of any outstanding demand adjusted against the refund, with the assessment year and the order under which it was raised.',
      noun: 'any demand adjusted against the refund',
    },
  ],
};

export function optionsFor(domain: string | null): InfoOption[] {
  const extra = domain ? (DOMAIN_EXTRA[domain] ?? []) : [];
  return [...extra, ...GENERIC];
}

/** Default selection — enough to be a useful request without overreaching. */
export function defaultSelection(domain: string | null): string[] {
  const opts = optionsFor(domain);
  const preferred = ['status', 'reason', 'timeline'];
  const domainFirst = opts.find((o) => !preferred.includes(o.id))?.id;
  return [domainFirst, 'status', 'reason'].filter(Boolean) as string[];
}

function domainLabel(domain: string | null): string {
  const d = DOMAINS.find((x) => x.id === domain);
  return d ? d.label.toLowerCase() : 'the matter';
}

/**
 * Builds the request. Deliberately concise — a short, specific request is answered;
 * a 3,000-character essay is not. We never pad toward the limit.
 */
export function compose(opts: {
  domain: string | null;
  selected: string[];
  problem: string;
}): string {
  const all = optionsFor(opts.domain);
  const chosen = all.filter((o) => opts.selected.includes(o.id));
  const summary = sanitiseRequestText(opts.problem.trim()).replace(/\s+/g, ' ').slice(0, 400);

  const lines: string[] = [];
  lines.push('To the Central Public Information Officer,');
  lines.push('');
  lines.push('Under the Right to Information Act, 2005, I request the following information.');
  lines.push('');
  lines.push('Background: ' + summary);
  lines.push('');

  if (chosen.length) {
    lines.push('Information sought:');
    chosen.forEach((o, i) => lines.push(`${i + 1}. ${o.line}`));
    lines.push('');
  }

  lines.push(
    'I am seeking records held by your office relating to ' +
      domainLabel(opts.domain) +
      '. I am not seeking opinions, advice or reasons that are not already recorded on file.',
  );
  lines.push('');
  lines.push('If any part of this request is held by another public authority, please transfer it under section 6(3) of the Act and inform me.');

  return sanitiseRequestText(lines.join('\n'));
}

/** A composed draft must always be valid against the real portal rules. */
export function composeIsValid(text: string): boolean {
  return validateRequestText(text).valid;
}
