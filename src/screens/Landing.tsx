import { useState, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { run } from '../reasoning/pipeline';
import { RTI_FEE_RUPEES } from '../rules';
import DecryptedText from '../vendor/reactbits/DecryptedText';
import { AnimatedContent } from '../vendor/reactbits/AnimatedContent';

const MIN_USEFUL = 15;
const SOFT_MAX = 5000;

const EXAMPLES = [
  'My pension has not been paid for three months.',
  'My PF withdrawal has been stuck since March and nobody replies.',
  'I applied for a passport two months ago and it still shows under review.',
];

export function Landing() {
  const { state, update } = useJourney();
  const navigate = useNavigate();
  const [text, setText] = useState(state.problem);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const tooLong = text.length > SOFT_MAX;

  function useExample(example: string) {
    setText(example);
    setError(null);
    setAdvice(null);
    const el = areaRef.current;
    if (el) {
      el.focus();
      requestAnimationFrame(() => el.setSelectionRange(example.length, example.length));
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();

    if (!value) {
      setError('Tell us what happened, in your own words. Even one sentence helps.');
      areaRef.current?.focus();
      return;
    }
    if (value.length < MIN_USEFUL && !advice) {
      setAdvice('That is quite short. A little more detail helps us point you the right way, or press Continue again to carry on.');
      return;
    }

    const result = run(value);
    update({ problem: value, result, baseResult: result, answers: {}, draft: '', draftEdited: false, authority: null });
    navigate(result.classification === 'not_rti' ? '/not-rti' : '/clarify');
  }

  return (
    <>
      {/* HERO: the citizen's sentence is the visual centre of gravity. */}
      <div data-testid="landing-hero" className="relative -mx-4 -mt-6 overflow-hidden bg-ink-900 px-4 pb-14 pt-16 text-paper-50 sm:-mt-10 sm:pt-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-100/70">
            Right to Information, in your own words
          </p>

          <h1 className="mt-4 text-[2.1rem] leading-[1.08] sm:text-[2.75rem]">
            What happened?
          </h1>

          <p className="mt-4 text-lg text-paper-50/75">
            <DecryptedText
              text="My pension has not been paid."
              animateOn="view"
              sequential
              speed={38}
              revealDirection="start"
              className="text-paper-50"
              encryptedClassName="text-paper-50/25"
            />
          </p>

          <p className="mt-4 max-w-xl text-lg text-paper-50/75">
            That sentence is enough here. You do not need to know which government office is
            responsible first.
          </p>
        </div>
      </div>

      {/* The evidence, staged as a real exchange rather than a paragraph. */}
      <div className="mt-8" data-evidence-quote="rtionline">
        <AnimatedContent delay={0.1}>
          <p className="text-sm font-medium text-ink-500">
            The official portal asked for the office name first. We typed the sentence above into
            its search.
          </p>
        </AnimatedContent>

        <AnimatedContent delay={0.28} className="mt-3">
          <div className="rounded-xl bg-danger-100 px-4 py-3 font-mono text-sm text-danger-700">
            No such Public Authority available in this portal !
          </div>
        </AnimatedContent>

        <AnimatedContent delay={0.46} className="mt-3">
          <p className="text-sm text-ink-500">
            The correct office, the Department of Pensions &amp; Pensioners Welfare, was listed on
            the same screen. Observed 26 August 2026.{' '}
            <a href="/about" className="text-brand-700 underline underline-offset-4">
              How we checked
            </a>
            .
          </p>
        </AnimatedContent>
      </div>

      {/* The actual interaction. */}
      <form onSubmit={onSubmit} noValidate className="mt-10">
        <Card>
          <label htmlFor={`${id}-problem`} className="block font-semibold text-ink-900">
            Tell us about your problem
          </label>
          <p id={helpId} className="mt-1 text-sm text-ink-500">
            Describe it the way you would tell a relative. We work out the rest.
          </p>

          <textarea
            id={`${id}-problem`}
            ref={areaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            rows={5}
            aria-describedby={error ? `${errorId} ${helpId}` : helpId}
            aria-invalid={error ? true : undefined}
            className={`mt-3 w-full rounded-xl border bg-paper-0 p-3 text-ink-900 placeholder:text-ink-300 ${
              error ? 'border-danger-700' : 'border-paper-200'
            }`}
            placeholder="My pension has not been paid for three months."
          />

          <div className="mt-2 min-h-6 text-sm" aria-live="polite">
            {error && (
              <p id={errorId} className="font-medium text-danger-700">
                {error}
              </p>
            )}
            {!error && advice && <p className="text-warn-700">{advice}</p>}
            {!error && !advice && tooLong && (
              <p className="text-warn-700">
                That is very long ({text.length.toLocaleString('en-IN')} characters). We will use
                the first part; nothing you typed is deleted.
              </p>
            )}
          </div>

          <div className="mt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Continue
            </Button>
          </div>
        </Card>

        <section className="mt-6" aria-labelledby={`${id}-examples`}>
          <h2 id={`${id}-examples`} className="text-sm font-medium text-ink-700">
            Or start from an example
          </h2>
          <ul className="mt-2 grid gap-2" role="list">
            {EXAMPLES.map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  onClick={() => useExample(ex)}
                  className="tap w-full rounded-xl bg-paper-0 px-4 py-3 text-left text-ink-700 ring-1 ring-paper-200 hover:bg-brand-50 hover:ring-brand-100"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </form>

      <div className="mt-8 grid gap-3">
        <Notice title="Before you start">
          <p>
            Filing a real RTI costs <strong>₹{RTI_FEE_RUPEES}</strong>. It is free if you hold a
            Below Poverty Line certificate. The office has 30 days to reply.
          </p>
        </Notice>
        <p className="text-sm text-ink-500">
          Nothing you type here leaves your browser, and this prototype cannot file anything with
          the government.
        </p>
      </div>
    </>
  );
}
