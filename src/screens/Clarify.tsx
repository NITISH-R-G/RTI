import { useEffect, useId, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageTitle, Button, Card, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { refine, pendingQuestions } from '../reasoning/refine';

/**
 * At most three questions, and a question is only asked when its answer changes
 * the outcome — the verdict, the draft or the authority. The observed form asks
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

  const queue = pendingQuestions(state.result, {});
  const question = queue[index];

  function choose(questionId: string, value: string) {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);

    const isLast = index >= queue.length - 1;
    if (!isLast) {
      setIndex(index + 1);
      return;
    }

    const refined = refine(state.result!, next);
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

  // Nothing to ask — the engine was already confident enough.
  if (!question) {
    return (
      <>
        <PageTitle lede="We have what we need from what you already told us.">
          A few questions
        </PageTitle>
        <Card>
          <p className="text-ink-700">{state.result.reasoning}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/request')}>Continue</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back
            </Button>
          </div>
        </Card>
      </>
    );
  }

  const legendId = `${id}-legend`;

  return (
    <>
      <PageTitle lede="Only the questions whose answers change where your request should go. Nothing about your gender, income or education.">
        A few questions
      </PageTitle>

      <Card>
        <fieldset>
          <legend id={legendId} className="text-lg font-semibold">
            {question.text}
          </legend>
          <p className="mt-1 text-sm text-ink-500">
            Question {index + 1} of {queue.length} — this decides which office holds your records.
          </p>

          <div className="mt-4 grid gap-2" role="radiogroup" aria-labelledby={legendId}>
            {question.options.map((opt) => {
              const selected = answers[question.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose(question.id, opt.value)}
                  className={`tap w-full rounded-xl px-4 py-3 text-left ring-1 transition-colors ${
                    selected
                      ? 'bg-brand-50 text-ink-900 ring-brand-700'
                      : 'bg-paper-0 text-ink-900 ring-paper-200 hover:bg-brand-50 hover:ring-brand-100'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5">
          <Button variant="secondary" onClick={back}>
            Back
          </Button>
        </div>
      </Card>

      <div className="mt-6">
        <Notice title="Why we are asking">
          <p>
            Choosing the wrong office is the most expensive mistake on the real portal. A central
            office will forward your request, but a <strong>state</strong> office returns it — and the
            fee is not refunded.
          </p>
        </Notice>
      </div>
    </>
  );
}
