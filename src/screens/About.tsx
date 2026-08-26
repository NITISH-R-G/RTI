import { PageTitle, Card, Notice } from '../ui/primitives';
import { ALL_AUTHORITIES, CAPTURED_ON } from '../authorities';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-paper-200 py-3 first:border-0 first:pt-0 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="text-ink-900">{value}</dd>
    </div>
  );
}

export function About() {
  const count = new Intl.NumberFormat('en-IN').format(ALL_AUTHORITIES.length);

  return (
    <>
      <PageTitle lede="What this is, how it works, and everything it does not do.">
        What is real and what is simulated
      </PageTitle>

      <div className="mb-4">
        <Notice tone="warn" title="Not a government service">
          <p>
            An independent prototype built for a hackathon. Not affiliated with, endorsed by, or
            connected to the Government of India, the Department of Personnel &amp; Training, or
            rtionline.gov.in. <strong>It cannot file a real RTI.</strong>
          </p>
        </Notice>
      </div>

      <Card className="mb-4">
        <h2 className="text-lg font-semibold">The problem we watched happen</h2>
        <p className="mt-3 text-ink-700">
          On the real RTI portal, we typed the sentence a citizen would actually say into the box
          that searches for the office to send a request to:
        </p>
        <p className="mt-3 rounded-xl bg-paper-100 p-3 font-mono text-sm text-ink-900">
          my pension has not been paid
        </p>
        <p className="mt-3 text-ink-700">It answered:</p>
        <p className="mt-3 rounded-xl bg-warn-100 p-3 font-mono text-sm text-warn-700">
          No such Public Authority available in this portal !
        </p>
        <p className="mt-3 text-ink-700">
          The office that holds those records — the Department of Pensions &amp; Pensioners Welfare —
          was listed in a dropdown on the same screen. The system had the answer and refused the
          question, because the citizen described a <em>problem</em> instead of naming an{' '}
          <em>institution</em>.
        </p>
        <p className="mt-3 text-ink-700">
          That is the whole reason this exists. Observed 26 August 2026, after a human completed the
          portal&apos;s own email and one-time-password checks. Nothing was ever submitted.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="text-lg font-semibold">The change we made</h2>
        <p className="mt-3 text-ink-700">
          The real portal asks <strong>which office?</strong> before it asks <strong>what do you
          want?</strong> We reversed that. You describe what happened; the office is worked out from
          your answers and from what you chose to ask for, and you can always overrule it.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="text-lg font-semibold">How it actually works</h2>
        <p className="mt-3 text-ink-700">
          There is <strong>no artificial intelligence running here</strong>. Every suggestion comes
          from rules and lists you could read yourself.
        </p>
        <dl className="mt-4">
          <Row
            label="Understanding your problem"
            value="A hand-written vocabulary of words, synonyms and common misspellings for five subjects, scored against what you typed. Where it is unsure, it asks instead of guessing."
          />
          <Row
            label="Choosing the office"
            value={`Selected from a list of ${count} real public authority names captured from the portal itself on ${CAPTURED_ON}. The product cannot invent an office, because it can only pick from that list.`}
          />
          <Row
            label="Writing the request"
            value="Templates we wrote by hand, filled in with your own words. You see all of it and can change every word."
          />
          <Row
            label="Fees and deadlines"
            value="Fixed constants from the RTI Act and Rules — ₹10, free with a BPL certificate, 30 days to reply. Never generated text."
          />
        </dl>
      </Card>

      <Card className="mb-4">
        <h2 className="text-lg font-semibold">What is simulated</h2>
        <ul className="mt-3 grid gap-2 text-ink-700">
          {[
            'Filing. Nothing is sent to any government system, ever.',
            'The reference number. Deliberately shaped so it cannot be mistaken for a real one.',
            'The progress timeline. It shows what a real filing would look like, not what is happening.',
            'Payment. No fee is taken and no payment screen exists.',
          ].map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-warn-500" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-4">
        <h2 className="text-lg font-semibold">Your privacy</h2>
        <ul className="mt-3 grid gap-2 text-ink-700">
          {[
            'Nothing you type leaves your browser. There is no server to send it to.',
            'We ask for no name, no address, no phone number, no email, no identity document.',
            'No account, no login, no one-time password, no security code.',
            'What you type is kept in your own browser so you can go back a step, and clearing it removes it.',
          ].map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-700" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-4">
        <h2 className="text-lg font-semibold">What it does not do</h2>
        <ul className="mt-3 grid gap-2 text-ink-700">
          {[
            'It covers five subjects in depth — central pensions, provident fund, passports, railways and income tax refunds. Everything else gets an honest answer, not a guess.',
            'It cannot help with state or local matters, and it says so rather than sending you somewhere that would return your application and keep the fee.',
            'It cannot make anyone act. RTI obtains records; grievances obtain action.',
            'It does not give legal advice.',
          ].map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-300" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">How we studied the portal</h2>
        <p className="mt-3 text-ink-700">
          Read-only. We never submitted an application, an appeal, a payment or a login. The one
          authenticated session was completed by a person using their own details, and we stopped
          before the payment step. We collected only public institutional names — never anyone&apos;s
          personal information.
        </p>
      </Card>
    </>
  );
}
