/** Types for the frozen deterministic reasoning engine (Phase 2.5). */

export type Classification = 'supported' | 'ambiguous' | 'unsupported' | 'not_rti';
export type NextAction = 'continue' | 'clarify' | 'explain_limit';
export type ConfidenceBand = 'high' | 'medium' | 'low';

export interface AuthorityCandidate {
  name: string;
  reason: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface ReasoningResult {
  classification: Classification;
  domain: string | null;
  confidence: number;
  confidence_band: ConfidenceBand;
  next_action: NextAction;
  candidate_authorities: AuthorityCandidate[];
  reasoning: string;
  required_questions: Question[];
  information_types: string[];
  warnings: string[];
  trace: {
    normalised?: string;
    stages: string[];
    scores?: { id: string; score: number; distinctive: number }[];
  };
}

export declare const MAX_INPUT: number;
export declare function run(rawInput: string): ReasoningResult;
export declare function normalise(raw: string): { text: string; tokens: string[]; original: string };
export declare function band(confidence: number): ConfidenceBand;
