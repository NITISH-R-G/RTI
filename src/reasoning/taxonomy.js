// Domain taxonomy — DATA, not logic.
// Frozen at five domains: docs/design/mvp-spec.md v1.0.
// Authority names must exist VERBATIM in docs/research/rti-online/public-authorities.json.

/** Words that indicate the citizen wants ACTION or REDRESS rather than records. */
export const ACTION_SIGNALS = [
  'release my', 'give me my money', 'pay me', 'immediately', 'take action', 'punish',
  'arrest', 'compensate', 'refund me now', 'do something', 'help me get',
];

/**
 * Speculation about a decision that has not been taken yet. RTI obtains records
 * that already exist, so no record can answer these.
 * Guarded by FIRST_PERSON_CASE below: "when will MY pension be credited" asks for
 * a date already on a file and is perfectly legitimate.
 */
export const SPECULATION_SIGNALS = [
  'government will', 'will the government', 'will they increase', 'will increase',
  'going to increase', 'in the future', 'next year', 'will there be', 'are they going to',
  'do you think', 'is it likely',
];

/** If the citizen is asking about their own case, it is not policy speculation. */
export const FIRST_PERSON_CASE = ['my ', 'mine', 'i applied', 'i filed', 'i submitted', 'our '];

/** Words that indicate an OPINION is being sought rather than a record. */
export const OPINION_SIGNALS = [
  'what do you think', 'your opinion', 'is it fair', 'should the government', 'do you agree',
];

/** Words that indicate a third party's personal information. */
export const THIRD_PARTY_SIGNALS = [
  'my neighbour', 'my neighbor', 'someone else', 'another person', 'my colleague',
];

/** Words indicating a private dispute or an allegation, not a records request. */
export const GRIEVANCE_SIGNALS = [
  'complain about', 'complaint about', 'rude', 'takes bribe', 'bribes', 'bribe',
  'stole', 'cheated me', 'harassed', 'fraud by',
];

/** Subjects that are STATE responsibilities. The central portal returns these WITHOUT REFUND. */
export const STATE_SIGNALS = [
  'old age pension', 'old age', 'social pension', 'widow pension', 'disability pension',
  'vridha', 'nsap',
  'road', 'street', 'municipal', 'municipality', 'panchayat', 'ration card', 'ration',
  'electricity', 'power cut', 'water supply', 'sewage', 'drainage', 'garbage',
  'police', 'fir', 'land record', 'patta', 'mutation', 'revenue record',
  'school admission', 'school', 'college admission', 'state transport', 'bus',
  'birth certificate', 'death certificate', 'caste certificate', 'domicile',
];

/**
 * Signals that the citizen is describing a PROBLEM or asking about a case.
 * A domain keyword alone ("pensioner association meeting minutes") tells us the topic
 * but not what the citizen wants, so we ask rather than route.
 */
export const PROBLEM_SIGNALS = [
  'not paid', 'not been paid', 'not received', 'not come', 'not arrived', 'not credited',
  'not issued', 'not done', 'never came', 'did not', 'has not', 'have not', 'stopped',
  'delay', 'delayed', 'pending', 'stuck', 'rejected', 'refused', 'denied', 'missing',
  'status', 'why', 'when will', 'how long', 'still', 'wrong', 'issue', 'problem',
  'lost', 'cancelled', 'result', 'update', 'reason',
];

export const DOMAINS = [
  {
    id: 'pension',
    label: 'Pension',
    // strong = distinctive to this domain; weak = supporting context
    strong: ['pension', 'pensioner', 'ppo', 'superannuation', 'retirement benefit', 'gratuity', 'commutation'],
    weak: ['retired', 'retirement', 'family pension', 'credited', 'arrears'],
    // typo-tolerant vocabulary (fuzzy-matched at token level)
    fuzzy: ['pension', 'pensioner', 'superannuation', 'retirement'],
    // signals that pull AWAY from this domain
    negative: ['provident', 'epf', 'pf ', 'passport', 'train', 'railway', 'tax'],
    authorities: [
      { name: 'Department of Pensions & Pensioners Welfare', reason: 'It holds policy and case records for central government pensioners.' },
      { name: 'Central Pension Accounting Office', reason: 'It holds the authorisation and disbursement records for central civil pensions.' },
    ],
    infoTypes: [
      'Current status of the pension payment',
      'Reason recorded on file for the delay',
      'Processing and approval history',
      'Expected date of payment as recorded',
    ],
    questions: [
      {
        id: 'pension_type',
        text: 'Which kind of pension is this?',
        options: [
          { value: 'central', label: 'A central government service pension' },
          { value: 'eps', label: 'An EPS / EPFO pension from private employment' },
          { value: 'social', label: 'An old-age or social welfare pension' },
          { value: 'unknown', label: 'I am not sure' },
        ],
      },
    ],
  },
  {
    id: 'provident_fund',
    label: 'Provident fund',
    strong: ['provident fund', 'epf', 'epfo', 'pf', 'uan', 'eps'],
    weak: ['withdrawal', 'claim', 'balance', 'transfer', 'employer', 'contribution'],
    fuzzy: ['provident', 'withdrawal'],
    negative: ['passport', 'train', 'railway', 'income tax'],
    authorities: [
      { name: 'Employees Provident Fund Organisation', reason: 'It holds provident fund account, claim and settlement records.' },
    ],
    infoTypes: [
      'Current status of the claim',
      'Dates on which the claim was received and processed',
      'Reason recorded for rejection or delay',
      'Employer contribution records held on file',
    ],
    questions: [
      {
        id: 'pf_issue',
        text: 'What is the issue?',
        options: [
          { value: 'withdrawal', label: 'A withdrawal or claim is stuck' },
          { value: 'transfer', label: 'A transfer between employers' },
          { value: 'balance', label: 'The balance looks wrong' },
          { value: 'unknown', label: 'I am not sure' },
        ],
      },
    ],
  },
  {
    id: 'passport',
    label: 'Passport',
    strong: ['passport', 'psprt', 'visa', 'psk', 'passport seva'],
    weak: ['renewal', 'police verification', 'dispatch', 'under review', 'tatkal', 'appointment'],
    fuzzy: ['passport', 'renewal', 'verification'],
    negative: ['pension', 'provident', 'train', 'railway', 'income tax'],
    authorities: [
      { name: 'MEA - Consular, Passport & Visa Division (CPV)', reason: 'It holds passport application, verification and dispatch records.' },
    ],
    infoTypes: [
      'Current status of the application',
      'Date police verification was received',
      'Reason recorded for the delay or rejection',
      'Expected dispatch date as recorded',
    ],
    questions: [
      {
        id: 'passport_stage',
        text: 'Where did it get stuck?',
        options: [
          { value: 'verification', label: 'Police verification' },
          { value: 'review', label: 'Still under review' },
          { value: 'dispatch', label: 'Printed but not dispatched' },
          { value: 'rejected', label: 'It was rejected' },
          { value: 'unknown', label: 'I am not sure' },
        ],
      },
    ],
  },
  {
    id: 'railways',
    label: 'Railways',
    strong: ['train', 'railway', 'rail', 'irctc', 'pnr', 'tatkal ticket', 'ticket'],
    weak: ['refund', 'cancelled', 'cancellation', 'luggage', 'coach', 'platform', 'recruitment', 'rrb'],
    fuzzy: ['railway', 'cancellation', 'luggage'],
    negative: ['pension', 'passport', 'income tax', 'provident'],
    authorities: [
      { name: 'Ministry of Railways', reason: 'It is the parent authority; the request is routed to the relevant railway body.' },
      { name: 'Indian Railway Catering & Tourism Corpn .Ltd.', reason: 'It holds online booking, cancellation and refund records.' },
    ],
    infoTypes: [
      'Current status of the refund',
      'Date the cancellation was recorded',
      'Reason recorded for the delay',
      'Records of the amount sanctioned',
    ],
    questions: [
      {
        id: 'rail_issue',
        text: 'What is this about?',
        options: [
          { value: 'refund', label: 'A ticket refund' },
          { value: 'luggage', label: 'Lost or damaged luggage' },
          { value: 'recruitment', label: 'A railway recruitment or exam' },
          { value: 'unknown', label: 'I am not sure' },
        ],
      },
    ],
  },
  {
    id: 'income_tax',
    label: 'Income tax',
    strong: ['income tax', 'itr', 'tds', 'assessment year', 'pan card refund', 'tax refund'],
    weak: ['refund', 'return', 'filed', 'credited', 'assessment', 'demand'],
    fuzzy: ['income', 'assessment'],   // 'refund' removed: cross-domain, must not anchor a domain
    negative: ['pension', 'passport', 'train', 'railway', 'provident'],
    authorities: [
      { name: 'Central Board of Direct Taxes', reason: 'It holds income tax assessment and refund processing records.' },
      { name: 'Department of Revenue', reason: 'It is the parent department for direct tax administration.' },
    ],
    infoTypes: [
      'Current status of the refund',
      'Date the return was processed',
      'Reason recorded for withholding or adjusting the refund',
      'Records of any outstanding demand adjusted against it',
    ],
    questions: [
      {
        id: 'tax_issue',
        text: 'What is this about?',
        options: [
          { value: 'refund', label: 'A refund that has not arrived' },
          { value: 'processing', label: 'A return that has not been processed' },
          { value: 'demand', label: 'A tax demand I do not understand' },
          { value: 'unknown', label: 'I am not sure' },
        ],
      },
    ],
  },
];

/** Ambiguous words that appear across several supported domains and must never decide a domain alone. */
export const CROSS_DOMAIN_WORDS = [
  'refund', 'status', 'delayed', 'pending', 'money', 'claim', 'not received',
  'transfer', // file transfer, job transfer, train transfer - cannot establish a domain alone
];

/** Abbreviation and shorthand expansion, applied during normalisation. */
export const EXPANSIONS = {
  pf: 'provident fund',
  epf: 'provident fund',
  epfo: 'provident fund',
  eps: 'eps pension provident fund',
  itr: 'income tax return',
  tds: 'income tax tds',
  irctc: 'railway irctc',
  psprt: 'passport',
  nt: 'not',
  recvd: 'received',
  recieved: 'received',
  refnd: 'refund',
  incom: 'income',
  pention: 'pension',
  sinc: 'since',
  marchh: 'march',
  fir: 'police fir',
  isro: 'isro space',
};
