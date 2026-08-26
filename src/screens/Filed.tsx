import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageTitle, Button, Card, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { appealAvailableFrom, formatDate } from '../rules';

/**
 * Mock filing and tracking.
 *
 * Deliberately NOT fake government infrastructure. A deterministic four-stage
 * view is enough to show what better tracking would feel like, and every
 * boundary is labelled. The reference cannot be mistaken for the real
 * AAAAA/B/C/DD/EEEEE format (PD-003, R13).
 */
export function Filed() {
  const { state, reset } = useJourney();
  const navigate = useNavigate();
  const { ref } = useParams();
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');

  if (!state.filedRef || !state.authority) return <Navigate to="/" replace />;

  const filedAt = state.filedAt ? new Date(state.filedAt) : new Date();
  const replyDue = appealAvailableFrom(filedAt);

  const stages = [
    { label: 'Request prepared', detail: 'Your wording and chosen office are ready.', done: true },
    { label: 'Submitted in this demo', detail: `Demo record created ${formatDate(filedAt)}.`, done: true },
    { label: 'Under review by the office', detail: 'Would begin once you file it for real.', done: false },
    { label: 'Reply due', detail: `${formatDate(replyDue)} — 30 days from a real filing.`, done: false },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(state.draft);
      setCopied('done');
    } catch {
      setCopied('failed');
    }
  }

  function startAgain() {
    if (window.confirm('Start a new request? This clears what you entered.')) {
      reset();
      navigate('/');
    }
  }

  return (
    <>
      <PageTitle lede="Your request is written and aimed at the right office. Here is the text — file it yourself on the real portal.">
        Your request is ready
      </PageTitle>

      <div className="mb-4">
        <Notice tone="warn" title="Demo confirmation">
          <p>
            This prototype has <strong>not</strong> submitted anything to a government system. No fee
            was taken and no record exists outside this browser.
          </p>
        </Notice>
      </div>

      <Card className="mb-4">
        <p className="text-sm text-ink-500">Demonstration reference</p>
        <p className="mt-1 font-mono text-lg font-semibold text-ink-900">{ref ?? state.filedRef}</p>
        <p className="mt-2 text-sm text-ink-500">
          Made up for this demo. A real RTI reference looks nothing like this — it is issued by the
          portal in the form <span className="font-mono">AAAAA/R/E/26/12345</span>.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold">What would happen next</h2>
        <ol className="mt-3 grid gap-3">
          {stages.map((s) => (
            <li key={s.label} className="flex gap-3">
              <span
                aria-hidden="true"
                className={`mt-1.5 size-3 shrink-0 rounded-full ${s.done ? 'bg-brand-700' : 'bg-paper-200 ring-1 ring-ink-300'}`}
              />
              <span>
                <span className="block font-medium text-ink-900">
                  {s.label}
                  {!s.done && <span className="ml-2 text-xs font-normal text-ink-500">not started</span>}
                </span>
                <span className="block text-sm text-ink-500">{s.detail}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-ink-500">
          The last two stages are what a real filing would look like. They do not represent actual
          government processing, because nothing has been filed.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold">Your request text</h2>
        <p className="mt-1 text-sm text-ink-500">
          Addressed to <strong className="text-ink-900">{state.authority.name}</strong>. Copy this into
          the real portal.
        </p>
        <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-paper-100 p-3 font-mono text-sm text-ink-900">
          {state.draft}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={copy}>Copy the request</Button>
          <a
            href="https://rtionline.gov.in/"
            target="_blank"
            rel="noreferrer noopener"
            className="tap inline-flex items-center justify-center gap-2 rounded-xl bg-paper-0 px-5 py-3 font-medium text-ink-900 ring-1 ring-paper-200 hover:bg-paper-100"
          >
            Open the real RTI portal
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <p className="mt-2 text-sm" aria-live="polite">
          {copied === 'done' && <span className="text-brand-700">Copied to your clipboard.</span>}
          {copied === 'failed' && (
            <span className="text-warn-700">
              Your browser blocked copying. Select the text above and copy it manually.
            </span>
          )}
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold">If you do file it</h2>
        <p className="mt-2 text-ink-700">
          The office has 30 days to reply. If you get no answer by{' '}
          <strong>{formatDate(replyDue)}</strong>, you can ask for a free review — a first appeal — on
          the same portal. There is no fee for that.
        </p>
        <div className="mt-5">
          <Button variant="secondary" onClick={startAgain}>
            Start another request
          </Button>
        </div>
      </Card>
    </>
  );
}
