import '@testing-library/jest-dom/vitest';

/**
 * jsdom does not implement IntersectionObserver, which motion's useInView
 * (used by AnimatedContent) needs. Stub it so component tests can render
 * without needing a real viewport; the callback is never invoked, so
 * AnimatedContent stays in its initial (opacity: 0) state during tests,
 * which is fine since these tests assert content, not animation.
 */
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;
