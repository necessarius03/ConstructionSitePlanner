// Polyfill for Three.js devtools
if (typeof window !== 'undefined') {
  (window as any).__THREE_DEVTOOLS__ = {
    dispatchEvent: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
} 