import { useEffect, useId, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageTitle, Button, Choice, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { compose, defaultSelection, optionsFor } from '../draft/compose';
import { validateRequestText, sanitiseRequestText, MAX_REQUEST_CHARS } from '../rules';

/**
 * The citizen sees their request being built, not handed to them:
 *   what they told us  →  what they chose to ask for  →  the resulting request.
 * The draft is visible in full and editable in place. No black box (PD-004, ED-004/5).
 */
export function RequestDraft() {
  const { state, update } = useJourney();
  const navigate = useNavigate();
  const id = useId();

  const domain = state.result?.domain ?? null;
  const options = useMemo(() => optionsFor(domain), [domain]);

  const [selected, setSelected] = useState<string[]>(
    state.infoTypes.length ? state.infoTypes : defaultSelection(domain),
  );
  const [draft, setDraft] = useState<string>(state.draft);
  const [edited, setEdited] = useState<boolean>(state.draftEdited);
  const [touched, setTouched] = useState(false);

  // Regenerate only while the citizen has not taken the pen themselves.
  useEffect(() => {
    if (edited) return;
    setDraft(compose({ domain, selected, problem: state.problem }));
  }, [domain, selected, state.problem, edited]);

  if (!state.result) return <Navigate to="/" replace />;

  const v = validateRequestText(draft);
  // 40 characters, not 80: "Please provide the status of my pension file." is a perfectly
  // good RTI request, and we tell citizens to prefer concise ones. The threshold
  // exists to catch nonsense, not to push people toward padding.
  const tooShort = draft.trim().length > 0 && draft.trim().length < 40;
  const blocked = !v.valid || tooShort;

  function toggle(optId: string) {
    setSelected((prev) =>
      prev.includes(optId) ? prev.filter((x) => x !== optId) : [...prev, optId],
    );
  }

  function fixCharacters() {
    setDraft((d) => sanitiseRequestText(d));
    setEdited(true);
  }

  function resetDraft() {
    setDraft(compose({ domain, selected, problem: state.problem }));
    setEdited(false);
  }

  function onContinue() {
    setTouched(true);
    if (blocked) return;
    update({ infoTypes: selected, draft, draftEdited: edited });
    navigate('/authority');
  }

  const errorId = `${id}-err`;
  const countId = `${id}-count`;

  return (
    <>
      <PageTitle
        eyebrow="Your request"
        lede="Choose what you want to know. We turn it into a request the office is obliged to answer, and you can change every word of it."
      >
        Build your request
      </PageTitle>

      {/* 1: what they told us */}
      <div className="mb-8 border-b border-ink-900/10 pb-6">
        <h2 className="text-sm font-medium text-ink-500">What you told us</h2>
        <p className="mt-1 text-ink-900">{state.problem}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="tap mt-2 inline-flex items-center text-sm text-ink-700 underline underline-offset-4"
        >
          Change this
        </button>
      </div>

      {/* 2: what to ask for */}
      <fieldset className="mb-8">
        <legend className="text-lg font-semibold text-ink-900">
          What information do you want to get?
        </legend>
        <p className="mt-1 text-ink-500">
          Pick the ones that matter. Fewer, sharper questions get answered; you do not need to
          fill the page.
        </p>
        <div className="mt-4 grid gap-3">
          {options.map((opt) => (
            <Choice key={opt.id} as="checkbox" selected={selected.includes(opt.id)} onClick={() => toggle(opt.id)}>
              {opt.label}
            </Choice>
          ))}
        </div>
        {selected.length === 0 && (
          <p className="mt-3 text-sm text-warn-700">
            Nothing selected. Your request will only describe your situation; pick at least one
            question so the office knows what to answer.
          </p>
        )}
      </fieldset>

      {/* 3: the resulting request. The textarea already regenerates live as the
          questions above change, so it IS the live preview; it is styled as a
          readable document, not a code box, rather than gated behind a toggle. */}
      <div className="border-t border-ink-900/10 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-ink-900">
            <label htmlFor={`${id}-draft`}>Your request</label>
          </h2>
          <p className="text-sm text-ink-500">Edit any word directly below.</p>
        </div>

        {edited && (
          <p className="mt-2 text-sm text-ink-500">
            You have edited this. Changing the questions above will no longer rewrite it.{' '}
            <button type="button" onClick={resetDraft} className="underline underline-offset-4">
              Start again from our version
            </button>
          </p>
        )}

        <textarea
          id={`${id}-draft`}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setEdited(true);
          }}
          rows={10}
          aria-describedby={`${countId}${touched && blocked ? ` ${errorId}` : ''}`}
          aria-invalid={touched && blocked ? true : undefined}
          className={`mt-3 w-full rounded-xl border bg-paper-100 p-5 font-serif text-lg leading-relaxed text-ink-900 ${
            touched && blocked ? 'border-danger-700' : 'border-transparent'
          }`}
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p id={countId} className={v.overLimit ? 'font-medium text-danger-700' : 'text-ink-500'}>
            {v.length.toLocaleString('en-IN')} of {MAX_REQUEST_CHARS.toLocaleString('en-IN')}{' '}
            characters
            {!v.overLimit && `, ${v.remaining.toLocaleString('en-IN')} left`}
          </p>
        </div>

        <div className="mt-2" aria-live="polite">
          {v.disallowed.length > 0 && (
            <Notice tone="warn" title="Some characters are not accepted">
              <p>
                The RTI portal only accepts letters, numbers and{' '}
                <code className="font-mono">, . - _ ( ) / @ : &amp; ? \ %</code>. Your text contains{' '}
                {v.disallowed.map((c, i) => (
                  <span key={c}>
                    {i > 0 && ', '}
                    <code className="rounded bg-paper-0 px-1 font-mono">
                      {c === '\n' ? 'line break' : c}
                    </code>
                  </span>
                ))}
                .
              </p>
              <div className="mt-3">
                <Button variant="secondary" onClick={fixCharacters}>
                  Fix these for me
                </Button>
              </div>
            </Notice>
          )}
          {touched && blocked && (
            <p id={errorId} className="mt-2 font-medium text-danger-700">
              {v.overLimit
                ? `Your request is ${(v.length - MAX_REQUEST_CHARS).toLocaleString('en-IN')} characters over the limit. Shorten it before continuing.`
                : v.disallowed.length > 0
                  ? 'Remove or fix the characters listed above before continuing.'
                  : tooShort
                    ? 'This request is very short. Add a little more so the office knows what to look for.'
                    : 'Your request cannot be empty.'}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={onContinue}>Find where to send it</Button>
          <Button variant="secondary" onClick={() => navigate('/clarify')}>
            Back
          </Button>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-500">
        Nothing here is sent anywhere. The next step works out which office holds these records.
      </p>
    </>
  );
}
