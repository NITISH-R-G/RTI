import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReasoningResult } from '../reasoning/pipeline';

/**
 * Journey state.
 *
 * Two hard rules, both traceable to observed failures:
 *  - ED-008: going back must never destroy work, so state lives above the router
 *    and survives navigation and reload within the session.
 *  - ED-014 / PD-009: nothing leaves the browser. localStorage only, and every
 *    access is wrapped because it throws in private windows and blocked contexts.
 */

export interface JourneyState {
  problem: string;
  answers: Record<string, string>;
  result: ReasoningResult | null;
  infoTypes: string[];
  draft: string;
  draftEdited: boolean;
  authority: { name: string; reason: string } | null;
  bpl: 'yes' | 'no' | null;
  filedRef: string | null;
  filedAt: string | null;
}

export const EMPTY: JourneyState = {
  problem: '',
  answers: {},
  result: null,
  infoTypes: [],
  draft: '',
  draftEdited: false,
  authority: null,
  bpl: null,
  filedRef: null,
  filedAt: null,
};

const KEY = 'rti-sarathi:journey:v1';

function load(): JourneyState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<JourneyState>) };
  } catch {
    // Private window, blocked site data, or corrupt value. Start clean, do not crash.
    return EMPTY;
  }
}

function save(state: JourneyState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable — the journey still works for this page session (T-09).
  }
}

interface Ctx {
  state: JourneyState;
  update: (patch: Partial<JourneyState>) => void;
  reset: () => void;
}

const JourneyContext = createContext<Ctx | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(() => load());

  useEffect(() => {
    save(state);
  }, [state]);

  const update = useCallback((patch: Partial<JourneyState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* nothing to clean up */
    }
  }, []);

  const value = useMemo(() => ({ state, update, reset }), [state, update, reset]);
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used inside JourneyProvider');
  return ctx;
}
