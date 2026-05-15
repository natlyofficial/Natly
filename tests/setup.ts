// ═══════════════════════════════════════════════════════════════
// VITEST SETUP FILE
// ═══════════════════════════════════════════════════════════════

import { afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers'; 

expect.extend(matchers);

// ───────────────────────────────────────────────────────────────
// CLEANUP AFTER EACH TEST
// ───────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ───────────────────────────────────────────────────────────────
// MOCK ENVIRONMENT VARIABLES
// ───────────────────────────────────────────────────────────────

beforeAll(() => {
  // Mock import.meta.env for Vite
  vi.stubGlobal('import', {
    meta: {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
        VITE_API_URL: 'https://test-api.netlify.app',
        VITE_RECAPTCHA_SITE_KEY: 'test-recaptcha-key',
      }
    }
  });
});

// ───────────────────────────────────────────────────────────────
// MOCK WINDOW.MATCHMEDIA (for responsive tests)
// ───────────────────────────────────────────────────────────────

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});