import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageTitle, Button, Card, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { optionsFor } from '../draft/compose';
import { reasonsFor } from '../authorities';
import { feeFor, appealAvailableFrom, formatDate, mockReference } from '../rules';

function Section({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="tap inline-flex items-center text-sm text-brand-700 underline underline-offset-4"
        >
          {editLabel}
        </button>
      </div>
      <div className="mt-2">{children}</div>
    </Card>
  );
}

export function Review() {
  const { state, update } = useJourney();
  const navigate = useNavigate();
  const [bpl, setBpl] = useState<'yes' | 'no' | null>(state.bpl);
  const [touched, setTouched] = useState(false);

  const infoLabels = useMemo(() => {
    const opts = optionsFor(state.result?.domain ?? null);
    return state.infoTypes.map((id) => opts.find((o) => o.id === id)?.noun).filter(Boolean) as string[];
  }, [state.result?.domain, state.infoTypes]);

  if (!state.result || !state.authority) return <Navigate to="/" replace />;

  const reasons = reasonsFor({
    result: state.result,
    answers: state.answers,
    infoTypeLabels: infoLabels,
    authorityReason: state.authority.reason,
  });

  const fee = bpl ? feeFor({ bpl: bpl === 'yes' }) : null;
  const today = new Date();
  const appealDate = appealAvailableFrom(today);

  function file() {
    setTouched(true);
    if (!bpl) return;
    const ref = mockReference(state.draft.length * 7 + state.problem.length);
    const filedAt = new Date().toISOString();
    update({ bpl, filedRef: ref, filedAt });
    navigate(`/filed/${encodeURIComponent(ref)}`);
  }

  return (
    <>
      <PageTitle lede="Everything that would be filed, in one place. Change anything before you continue.">
        Check before you finish
      </PageTitle>

      <Section title="What happened" editLabel="Change" onEdit={() => navigate('/')}>
        <p className="text-ink-900">{state.problem}</p>
      </Section>

      <Section
        title="What you are asking for"
        editLabel="Change what you ask"
        onEdit={() => navigate('/request')}
      >
        {infoLabels.length ? (
          <ul className="grid gap-1 text-ink-700">
            {infoLabels.map((l) => (
              <li key={l} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-700" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-500">You wrote your request yourself.</p>
        )}
        <details className="mt-4">
          <summary className="tap inline-flex cursor-pointer items-center text-sm text-brand-700 underline underline-offset-4">
            Read the full request text
          </summary>
          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-paper-100 p-3 font-mono text-sm text-ink-900">
            {state.draft}
          </pre>
        </details>
      </Section>

      <Section
        title="Where it would go"
        editLabel="Choose a different office"
        onEdit={() => navigate('/authority')}
      >
        <p className="font-medium text-ink-900">{state.authority.name}</p>
        <h3 className="mt-3 text-sm font-medium text-ink-500">Why this office was suggested</h3>
        <ul className="mt-1 grid gap-1 text-ink-700">
          {reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-700" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Card className="mb-4">
        <fieldset>
          <legend className="font-semibold">Would you pay the fee, or are you exempt?</legend>
          <p className="mt-1 text-sm text-ink-500">
            This changes the fee only. We ask because the real portal hides it until you answer.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              [
                ['no', 'I would pay the fee'],
                ['yes', 'I have a Below Poverty Line certificate'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={bpl === value}
                onClick={() => setBpl(value)}
                className={`tap rounded-xl px-4 py-3 text-left ring-1 ${
                  bpl === value ? 'bg-brand-50 ring-brand-700' : 'bg-paper-0 ring-paper-200 hover:bg-brand-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-3" aria-live="polite">
          {fee !== null && (
            <p className="text-ink-900">
              Fee on the real portal: <strong>₹{fee}</strong>
              {fee === 0 && ' — you would attach a copy of your BPL certificate.'}
            </p>
          )}
          {touched && !bpl && (
            <p className="font-medium text-danger-700">
              Choose one so we can show you the fee that would apply.
            </p>
          )}
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold">What happens after a real filing</h2>
        <dl className="mt-3 grid gap-3">
          <div>
            <dt className="text-sm text-ink-500">The office must reply within</dt>
            <dd className="text-ink-900">30 days</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-500">You could ask for a free review from</dt>
            <dd className="text-ink-900">{formatDate(appealDate)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-ink-500">
          The 30-day limit and the ₹10 fee are real rules of the RTI Act and Rules. The date above is
          calculated from today.
        </p>
      </Card>

      <div className="mb-4">
        <Notice tone="warn" title="Before you press the button">
          <p>
            <strong>Nothing here is sent to the government.</strong> This prototype cannot file an
            RTI. Pressing the button creates a demonstration record in your browser and gives you the
            exact text to file yourself on the real portal.
          </p>
          <p className="mt-2">No payment is taken. No account is created. No details are stored.</p>
        </Notice>
      </div>

      <Card>
        <h2 className="font-semibold">What the real portal will also ask you for</h2>
        <p className="mt-1 text-sm text-ink-500">
          We deliberately do not collect any of this — it never leaves your hands.
        </p>
        <ul className="mt-3 grid gap-1 text-ink-700">
          {['Your name', 'Your address and pin code', 'Your email and mobile number', 'Gender, rural or urban, and education level', 'A security code (CAPTCHA), twice'].map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-300" />
              <span>{x}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={file}>Finish and get my request</Button>
          <Button variant="secondary" onClick={() => navigate('/authority')}>
            Back
          </Button>
        </div>
      </Card>
    </>
  );
}
