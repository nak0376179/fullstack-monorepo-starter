import "@testing-library/jest-dom/vitest";

// jsdom には ResizeObserver がないため、Vuetify の v-textarea(auto-grow)用にスタブする
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
