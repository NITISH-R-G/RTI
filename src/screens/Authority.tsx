import { useId, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageTitle, Button, Card, Notice } from '../ui/primitives';
import { useJourney } from '../state/journey';
import { search, reasonsFor, contextFor, looksStateOrUt } from '../authorities';
import { optionsFor } from '../draft/compose';

/**
 * The heart of the product.
 *
 * The recommendation is DERIVED from what the citizen told us and what they asked
 * for — it is not a guess made before the request existed, which is the ordering
 * that produces the observed dead end (ED-001, ED-002).
 *
 * It is never framed as "AI recommends". There is no runtime model. The reasoning
 * is inspectable, the uncertainty is in words, and the citizen can always override.
 */
export function Authority() {
  const { state, update } = useJourney();
  const navigate = useNavigate();
  const id = useId();

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [chosen, setChosen] = useState<{ name: string; reason: string } | null>(state.authority);

  const result = state.result;
  const candidates = result?.candidate_authorities ?? [];
  const top = candidates[0] ?? null;
  const alternatives = candidates.slice(1);

  const infoTypeLabels = useMemo(() => {
    const opts = optionsFor(result?.domain ?? null);
    return state.infoTypes
      .map((sid) => opts.find((o) => o.id === sid)?.label)
      .filter(Boolean) as string[];
  }, [result?.domain, state.infoTypes]);

  const hits = useMemo(() => (query.trim() ? search(query, 12) : []), [query]);

  if (!result) return <Navigate to="/" replace />;

  const selected = chosen ?? (top ? { name: top.name, reason: top.reason } : null);

  const reasons = top
    ? reasonsFor({ result, answers: state.answers, infoTypeLabels, authorityReason: top.reason })
    : [];

  function pick(name: string, reason: string) {
    setChosen({ name, reason });
  }

  function onContinue() {
    if (!selected) return;
    update({ authority: selected });
    navigate('/review');
  }

  const searchId = `${id}-search`;

  return (
    <>
      <PageTitle lede="Worked out from what you told us and what you are asking for — not from a list you had to know your way around.">
        Where this should go
      </PageTitle>

      {/* No central office to propose — the expensive-mistake branch. */}
      {result.warnings.length > 0 && (
        <div className="mb-4">
          <Notice tone="warn" title="This may not belong to the central RTI portal">
            {result.warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </Notice>
        </div>
      )}

      {!top && (
        <Card className="mb-4">
          <h2 className="font-semibold">We do not have a confident match for this</h2>
          <p className="mt-2 text-ink-700">{result.reasoning}</p>
          <p className="mt-2 text-ink-700">
            You can still search all {new Intl.NumberFormat('en-IN').format(2904)} public authorities
            below, or go back and add a little more detail.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setShowSearch(true)}>
              Search authorities
            </Button>
            <Button variant="secondary" onClick={() => navigate('/clarify')}>
              Back
            </Button>
          </div>
        </Card>
      )}

      {top && (
        <Card className="mb-4">
          <p className="text-sm text-ink-500">Based on what you told us</p>
          <h2 className="mt-1 text-xl font-semibold text-ink-900">{selected?.name ?? top.name}</h2>

          {looksStateOrUt(selected?.name ?? top.name) && (
            <div className="mt-3">
              <Notice tone="warn" title="Check before you file">
                <p>
                  This looks like a Union Territory or state body. The central RTI portal returns
                  applications meant for state public authorities, and the fee is not refunded.
                </p>
              </Notice>
            </div>
          )}

          <h3 className="mt-5 font-medium">Why this may be the right place</h3>
          <ul className="mt-2 grid gap-2 text-ink-700">
            {reasons.map((r) => (
              <li key={r} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-700" />
                <span>{r}</span>
              </li>
            ))}
          </ul>

          {result.confidence_band !== 'high' && (
            <p className="mt-4 rounded-xl bg-paper-100 p-3 text-sm text-ink-700">
              This is the most likely match based on what you told us — not a certainty. Have a look
              at the alternatives before you decide.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onContinue}>Continue with this office</Button>
            {alternatives.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => setShowAlternatives((v) => !v)}
                aria-expanded={showAlternatives}
              >
                {showAlternatives ? 'Hide other options' : 'See other possible offices'}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowSearch((v) => !v)}
              aria-expanded={showSearch}
            >
              Search manually
            </Button>
          </div>
        </Card>
      )}

      {showAlternatives && alternatives.length > 0 && (
        <Card className="mb-4">
          <h2 className="font-semibold">Other offices that may hold these records</h2>
          <ul className="mt-3 grid gap-2">
            {alternatives.map((a) => (
              <li key={a.name}>
                <button
                  type="button"
                  onClick={() => pick(a.name, a.reason)}
                  aria-pressed={selected?.name === a.name}
                  className={`tap w-full rounded-xl px-4 py-3 text-left ring-1 ${
                    selected?.name === a.name
                      ? 'bg-brand-50 ring-brand-700'
                      : 'bg-paper-0 ring-paper-200 hover:bg-brand-50'
                  }`}
                >
                  <span className="block font-medium text-ink-900">{a.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-500">{a.reason}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {showSearch && (
        <Card className="mb-4">
          <label htmlFor={searchId} className="font-semibold">
            Search all public authorities
          </label>
          <p className="mt-1 text-sm text-ink-500">
            This searches the <strong>names</strong> of the 2,904 offices listed on the RTI portal, so
            type a word from the office name — for example <em>provident</em> or <em>railway</em>.
            Describing your problem here will not work, which is exactly the trap on the real portal.
          </p>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="tap mt-3 w-full rounded-xl border border-paper-200 bg-paper-0 p-3"
            placeholder="provident, passport, railway, revenue..."
          />

          <div aria-live="polite" className="mt-3">
            {query.trim() && hits.length === 0 && (
              <div className="rounded-xl bg-paper-100 p-4 text-ink-700">
                <p className="font-medium">No office name matches that.</p>
                <p className="mt-1 text-sm">
                  Try a single word from the office name rather than a description of your problem.
                  If you are not sure, go back and add more detail and we will narrow it for you.
                </p>
              </div>
            )}
            {hits.length > 0 && (
              <ul className="grid gap-2">
                {hits.map((h) => (
                  <li key={h.name}>
                    <button
                      type="button"
                      onClick={() => pick(h.name, contextFor(h.name).text)}
                      aria-pressed={selected?.name === h.name}
                      className={`tap w-full rounded-xl px-4 py-3 text-left ring-1 ${
                        selected?.name === h.name
                          ? 'bg-brand-50 ring-brand-700'
                          : 'bg-paper-0 ring-paper-200 hover:bg-brand-50'
                      }`}
                    >
                      <span className="block font-medium text-ink-900">{h.name}</span>
                      <span className="mt-0.5 block text-sm text-ink-500">{h.context}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}

      {selected && (
        <Card>
          <p className="text-sm text-ink-500">Your request will be addressed to</p>
          <p className="mt-1 font-semibold text-ink-900">{selected.name}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={onContinue}>Continue to review</Button>
            <Button variant="secondary" onClick={() => navigate('/request')}>
              Back to your request
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
