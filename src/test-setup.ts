/**
 * Test environment setup for Angular + Vitest.
 *
 * jsdom omits some browser APIs that components rely on. Provide minimal mocks
 * so components can initialize:
 * - ResizeObserver: used by PrimeNG components (e.g., p-tabs).
 * - matchMedia: used to honour the "reduce motion" setting (e.g., the hero).
 */

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

// Report "reduce motion" so components that gate animations on it take the
// static path in tests, rather than starting a requestAnimationFrame loop.
globalThis.matchMedia = ((query: string) => ({
  matches: /prefers-reduced-motion/.test(query),
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof matchMedia;
