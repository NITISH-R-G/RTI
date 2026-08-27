import { Navigate, useNavigate } from 'react-router-dom';
import { PageTitle, Button, Card, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';

/**
 * The screen that stops us repeating the original failure in a prettier interface.
 *
 * A citizen who lands here must never feel rejected. The observed portal answers
 * unrecognised input with "No such Public Authority available in this portal !"
 * and nothing else. This screen always says what we understood, why this route may
 * not fit, and what to do instead (ED-013).
 */
export function NotRti() {
  const { state } = useJourney();
  const navigate = useNavigate();

  if (!state.result) return <Navigate to="/" replace />;

  const r = state.result;
  const isStateMatter = r.warnings.length > 0;

  return (
    <>
      <PageTitle lede="You have not done anything wrong. This route may just not be the one that gets you an answer.">
        Let us point you somewhere better
      </PageTitle>

      <Card className="mb-4">
        <h2 className="text-sm font-medium text-ink-500">What we understood</h2>
        <p className="mt-1 text-ink-900">{state.problem}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="tap mt-2 inline-flex items-center text-sm text-brand-700 underline underline-offset-4"
        >
          That is not quite right, let me rewrite it
        </button>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold">Why this may not be the right RTI path</h2>
        <p className="mt-2 text-ink-700">{r.reasoning}</p>
      </Card>

      {isStateMatter && (
        <div className="mb-4">
          <Notice tone="warn" title="Central portal or state portal: this matters">
            {r.warnings.map((w) => (
              <p key={w} className="mb-2 last:mb-0">
                {w}
              </p>
            ))}
            <p className="mt-2">
              The RTI Act applies to state governments too. The difference is <em>which</em> portal:
              rtionline.gov.in covers central ministries and their offices only. Most states run their
              own RTI system, and some still take applications on paper.
            </p>
          </Notice>
        </div>
      )}

      <Card className="mb-4">
        <h2 className="font-semibold">What you may need instead</h2>
        <ul className="mt-3 grid gap-3 text-ink-700">
          {isStateMatter ? (
            <>
              <li>
                <strong className="text-ink-900">Your state&apos;s RTI route.</strong> Every state has
                one, but the address and the fee differ, so we are not going to guess yours. Searching
                for your state name together with the words &quot;RTI online&quot; is the reliable way
                to find it.
              </li>
              <li>
                <strong className="text-ink-900">The office that actually runs the scheme.</strong>{' '}
                For a social or old-age pension that is usually a district or block-level office, not
                a ministry in Delhi.
              </li>
            </>
          ) : (
            <>
              <li>
                <strong className="text-ink-900">A public grievance, if you want action.</strong> RTI
                gets you the records behind a decision. It cannot order anyone to act, pay you, or
                punish anyone. If what you want is for something to be <em>done</em>, a grievance
                channel is the right instrument.
              </li>
              <li>
                <strong className="text-ink-900">RTI afterwards, to see what happened.</strong> Once a
                grievance has been filed, an RTI asking for the file notings and the action taken on
                it is often the most effective follow-up.
              </li>
            </>
          )}
        </ul>
        <p className="mt-4 text-sm text-ink-500">
          We are not linking you to a specific service, because we have not verified one for your
          situation and we would rather say so than send you somewhere wrong.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold">What this prototype can and cannot help with</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-ink-500">It can help with</h3>
            <ul className="mt-1 grid gap-1 text-ink-700">
              {['Pensions paid by central government', 'Provident fund (EPFO)', 'Passports', 'Railways', 'Income tax refunds'].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink-500">It cannot help with</h3>
            <ul className="mt-1 grid gap-1 text-ink-700">
              {[
                'State and local matters',
                'Getting something done rather than getting records',
                'Personal information about another person',
                'Anything already before a court',
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">You can still carry on</h2>
        <p className="mt-2 text-ink-700">
          This is our reading of your situation, not a ruling. If you believe an RTI to a central
          office is right, continue and we will help you write it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => navigate('/request')}>Continue anyway</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Start again
          </Button>
        </div>
      </Card>
    </>
  );
}
