import type { ReasoningResult, Question } from './pipeline';

export declare function refine(
  result: ReasoningResult,
  answers: Record<string, string>,
): ReasoningResult;

export declare function pendingQuestions(
  result: ReasoningResult,
  answers: Record<string, string>,
): Question[];
