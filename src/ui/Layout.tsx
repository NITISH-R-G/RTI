import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

/** The six steps of the citizen journey, for the progress indicator. */
export const STEPS = [
  { path: '/', label: 'What happened' },
  { path: '/clarify', label: 'A few questions' },
  { path: '/request', label: 'Your request' },
  { path: '/authority', label: 'Where it goes' },
  { path: '/review', label: 'Review' },
  { path: '/filed', label: 'Done' },
] as const;

function stepIndex(pathname: string) {
  if (pathname.startsWith('/filed')) return 5;
  const i = STEPS.findIndex((s) => s.path === pathname);
  return i;
}

function Progress({ pathname }: { pathname: string }) {
  const current = stepIndex(pathname);
  if (current < 0) return null;

  return (
    <nav aria-label="Progress" className="mb-6">
      <p className="text-sm text-ink-500">
        Step {current + 1} of {STEPS.length}
        <span aria-hidden="true"> · </span>
        <span className="sr-only">: </span>
        <span className="text-ink-700">{STEPS[current].label}</span>
      </p>
      <ol className="mt-2 flex gap-1.5" role="list">
        {STEPS.map((s, i) => (
          <li key={s.path} className="h-1.5 flex-1 rounded-full bg-paper-200">
            <span
              className={`block h-full rounded-full ${i <= current ? 'bg-brand-700' : ''}`}
              style={{ width: i <= current ? '100%' : 0 }}
            />
            <span className="sr-only">
              {s.label}
              {i < current ? ' (done)' : i === current ? ' (current)' : ''}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Persistent, non-dismissible disclosure (competition rule R13).
 * It must be impossible to mistake this prototype for a government service.
 */
function PrototypeBanner() {
  return (
    <div className="bg-ink-900 text-paper-50">
      <p className="mx-auto max-w-3xl px-4 py-2 text-center text-sm">
        Independent prototype — <strong className="font-semibold">not a government service</strong>. It
        cannot file a real RTI.{' '}
        <Link to="/about" className="underline underline-offset-2">
          What&apos;s real and what&apos;s simulated
        </Link>
      </p>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper-0 focus:px-4 focus:py-3 focus:ring-2 focus:ring-brand-700"
      >
        Skip to main content
      </a>

      <PrototypeBanner />

      <header className="border-b border-paper-200 bg-paper-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="tap flex items-center font-semibold tracking-tight text-ink-900">
            RTI&nbsp;Sarathi
          </Link>
          <Link to="/about" className="tap flex items-center text-sm text-brand-700 underline underline-offset-4">
            About
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <Progress pathname={pathname} />
        {children}
      </main>

      <footer className="mt-12 border-t border-paper-200 bg-paper-0">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-ink-500">
          <p>
            A prototype for the Build What Moves India hackathon. Not affiliated with, endorsed by, or
            connected to the Government of India or rtionline.gov.in.
          </p>
          <p className="mt-2">
            Guidance is produced by deterministic logic running in your browser. There is no language
            model, and nothing you type is sent anywhere.
          </p>
        </div>
      </footer>
    </>
  );
}
