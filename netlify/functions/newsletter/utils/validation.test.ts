// ═══════════════════════════════════════════════════════════════
// VALIDATION UTILS TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  NewsletterRequestSchema,
  validateEmail,
  normalizeLanguage,
  isHoneypotFilled,
} from './validation';

// ───────────────────────────────────────────────────────────────
// SCHEMA VALIDATION TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterRequestSchema', () => {
  it('validates correct newsletter request', () => {
    const validRequest = {
      email: 'test@example.com',
      language: 'en',
      honeypot: '',
    };

    const result = NewsletterRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const invalidRequest = {
      email: 'not-an-email',
      language: 'en',
    };

    const result = NewsletterRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid email');
    }
  });

  it('rejects email over 255 characters', () => {
    const longEmail = 'a'.repeat(250) + '@test.com';
    const result = NewsletterRequestSchema.safeParse({
      email: longEmail,
      language: 'en',
    });

    expect(result.success).toBe(false);
  });

  it('uses default language "en" when not provided', () => {
    const request = { email: 'test@example.com' };
    const result = NewsletterRequestSchema.safeParse(request);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe('en');
    }
  });

  it('accepts optional honeypot field', () => {
    const request = {
      email: 'test@example.com',
      language: 'es',
      honeypot: 'bot-filled-this',
    };

    const result = NewsletterRequestSchema.safeParse(request);
    expect(result.success).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// EMAIL VALIDATION TESTS
// ───────────────────────────────────────────────────────────────

describe('validateEmail', () => {
  it('validates correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    expect(validateEmail('user_123@test-domain.com')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────
// LANGUAGE NORMALIZATION TESTS
// ───────────────────────────────────────────────────────────────

describe('normalizeLanguage', () => {
  it('extracts first 2 characters from language code', () => {
    expect(normalizeLanguage('en-US')).toBe('en');
    expect(normalizeLanguage('es-MX')).toBe('es');
    expect(normalizeLanguage('fr-FR')).toBe('fr');
  });

  it('pads to exactly 2 characters for CHAR(2) column', () => {
    const result = normalizeLanguage('en');
    expect(result.length).toBe(2);
    expect(result).toBe('en');
  });

  it('converts to lowercase', () => {
    expect(normalizeLanguage('EN-US')).toBe('en');
    expect(normalizeLanguage('ES')).toBe('es');
  });

  it('handles single character input', () => {
    const result = normalizeLanguage('e');
    expect(result.length).toBe(2);
    expect(result).toBe('e '); // Padded with space
  });
});

// ───────────────────────────────────────────────────────────────
// HONEYPOT DETECTION TESTS
// ───────────────────────────────────────────────────────────────

describe('isHoneypotFilled', () => {
  it('returns false for empty honeypot', () => {
    expect(isHoneypotFilled('')).toBe(false);
    expect(isHoneypotFilled(undefined)).toBe(false);
  });

  it('returns false for whitespace-only honeypot', () => {
    expect(isHoneypotFilled('   ')).toBe(false);
    expect(isHoneypotFilled('\t\n')).toBe(false);
  });

  it('returns true for filled honeypot (bot detected)', () => {
    expect(isHoneypotFilled('bot-value')).toBe(true);
    expect(isHoneypotFilled('spam')).toBe(true);
    expect(isHoneypotFilled('  filled  ')).toBe(true);
  });
});