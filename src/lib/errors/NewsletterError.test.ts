// ═══════════════════════════════════════════════════════════════
// NEWSLETTER ERROR TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { NewsletterError, ERROR_CODES } from './NewsletterError';

describe('NewsletterError', () => {
  it('creates error with message, code, and statusCode', () => {
    const error = new NewsletterError(
      'Invalid email format',
      ERROR_CODES.INVALID_EMAIL,
      400
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NewsletterError);
    expect(error.message).toBe('Invalid email format');
    expect(error.code).toBe(ERROR_CODES.INVALID_EMAIL);
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('NewsletterError');
  });

  it('uses default statusCode 500 when not provided', () => {
    const error = new NewsletterError(
      'Something went wrong',
      ERROR_CODES.SERVER_ERROR
    );

    expect(error.statusCode).toBe(500);
  });

  it('includes details when provided', () => {
    const details = { field: 'email', reason: 'malformed' };
    const error = new NewsletterError(
      'Validation failed',
      ERROR_CODES.INVALID_EMAIL,
      400,
      details
    );

    expect(error.details).toEqual(details);
  });

  it('works without details', () => {
    const error = new NewsletterError(
      'Too many requests',
      ERROR_CODES.RATE_LIMIT,
      429
    );

    expect(error.details).toBeUndefined();
  });

  it('has correct error codes', () => {
    expect(ERROR_CODES).toEqual({
      INVALID_EMAIL: 'INVALID_EMAIL',
      VALIDATION_ERROR: 'VALIDATION_ERROR',
      RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
      RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
      NETWORK_ERROR: 'NETWORK_ERROR',
      SERVER_ERROR: 'SERVER_ERROR',
      INVALID_TOKEN: 'INVALID_TOKEN',
      ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
      ALREADY_CONFIRMED: 'ALREADY_CONFIRMED',
      NOT_FOUND: 'NOT_FOUND',
    });
  });

  it('maintains proper stack trace', () => {
    const error = new NewsletterError(
      'Test error',
      ERROR_CODES.SERVER_ERROR
    );

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('NewsletterError');
  });
});