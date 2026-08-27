import { useEffect, useId, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageTitle, Button, Choice, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { refine, pendingQuestions } from '../reasoning/refine';

/**
 * At most three questions, and a question is only asked when its answer changes
 * the outcome: the verdict, the draft or the authority. The observed form asks
 * gender, rural/urban and education level, none of which change anything (ED-010).
 */
export function Clarify() {
  const { state, update } = useJourney();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>(state.answers);
  const [index, setIndex] = useState(0);
  const id = useId();

  useEffect(() => {
    setAnswers(state.answers);
  }, [state.answers]);

  if (!state.result) return <Navigate to="/" replace />;

  // Always ask from the ORIGINAL classification, so returning to this screen
  // re-offers the question with the previous answer selected instead of a summary.
  const source = state.baseResult ?? state.result;
  const queue = pendingQuestions(source, {});
  const question = queue[index];

  function choose(questionId: string, value: string) {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);

    const isLast = index >= queue.length - 1;
    if (!isLast) {
      setIndex(index + 1);
      return;
    }

    const refined = refine(source, next);
    update({ answers: next, result: refined });

    if (refined.classification === 'unsupported' || refined.classification === 'not_rti') {
      navigate('/not-rti');
    } else {
      navigate('/request');
    }
  }

  function back() {
    if (index > 0) setIndex(index - 1);
    else navigate('/');
  }

  // Nothing to ask: the engine was already confident enough.
  if (!question) {
    return (
      <>
        <PageTitle eyebrow="A few questions" lede="We have what we need from what you already told us.">
          You are ready to continue
        </PageTitle>
        <p className="text-ink-700">{state.result.reasoning}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => navigate('/request')}>Continue</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back
          </Button>
        </div>
      </>
    );
  }

  const legendId = `${id}-legend`;

  return (
    <>
      <PageTitle eyebrow={`Question ${index + 1} of ${queue.length}`}>{question.text}</PageTitle>
      <p className="-mt-4 mb-6 text-ink-500">This decides which office holds your records.</p>

      <fieldset>
        <legend id={legendId} className="sr-only">
          {question.text}
        </legend>
        <div className="grid gap-3" role="radiogroup" aria-labelledby={legendId}>
          {question.options.map((opt) => {
            const selected = answers[question.id] === opt.value;
            return (
              <Choice key={opt.value} selected={selected} onClick={() => choose(question.id, opt.value)}>
                {opt.label}
              </Choice>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <Button variant="secondary" onClick={back}>
          Back
        </Button>
      </div>

      <div className="mt-8">
        <Notice tone="warn" title="Why we are asking">
          <p>
            Choosing the wrong office is the most expensive mistake on the real portal. A central
            office will forward your request, but a <strong>state</strong> office returns it, and the
            fee is not refunded.
          </p>
        </Notice>
      </div>
    </>
  );
}
