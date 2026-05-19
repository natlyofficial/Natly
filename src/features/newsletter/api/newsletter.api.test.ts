// ═══════════════════════════════════════════════════════════════
// NEWSLETTER API CLIENT TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { newsletterApi } from './newsletter.api';
import { NewsletterError, ERROR_CODES } from '@/lib/errors/NewsletterError';

// ───────────────────────────────────────────────────────────────
// MOCKS
// ───────────────────────────────────────────────────────────────

vi.mock('@/config/env', () => ({
  ENV: {
    API_URL: 'https://test-api.netlify.app',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    RECAPTCHA_SITE_KEY: 'test-recaptcha',
    isDevelopment: true,
    isProduction: false,
  }
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as any;

// ───────────────────────────────────────────────────────────────
// SETUP
// ───────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetch.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ───────────────────────────────────────────────────────────────
// HELPER TESTS
// ───────────────────────────────────────────────────────────────

describe('fetchApi helper', () => {
  it('makes successful API call with correct headers', async () => {
    const mockData = { success: true, message: 'OK' };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await newsletterApi.subscribe({
      email: 'test@example.com',
      language: 'en',
      honeypot: '',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/.netlify/functions/newsletter'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('throws NewsletterError on server error (4xx/5xx)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Invalid email',
        code: ERROR_CODES.VALIDATION_ERROR,
      }),
    });

    await expect(
      newsletterApi.subscribe({
        email: 'invalid',
        language: 'en',
        honeypot: '',
      })
    ).rejects.toThrow(NewsletterError);
  });

  it('throws NewsletterError with NETWORK_ERROR on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    await expect(
      newsletterApi.subscribe({
        email: 'test@example.com',
        language: 'en',
        honeypot: '',
      })
    ).rejects.toThrow('Network error');
  });

  it('preserves NewsletterError when thrown', async () => {
    const customError = new NewsletterError(
      'Custom error',
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      429
    );

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: 'Custom error',
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      }),
    });

    try {
      await newsletterApi.subscribe({
        email: 'test@example.com',
        language: 'en',
        honeypot: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NewsletterError);
      expect((error as NewsletterError).code).toBe(ERROR_CODES.RATE_LIMIT_EXCEEDED);
      expect((error as NewsletterError).statusCode).toBe(429);
    }
  });

  it('handles response without error details', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    try {
      await newsletterApi.subscribe({
        email: 'test@example.com',
        language: 'en',
        honeypot: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NewsletterError);
      expect((error as NewsletterError).message).toBe('Request failed');
      expect((error as NewsletterError).code).toBe(ERROR_CODES.SERVER_ERROR);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// SUBSCRIBE TESTS
// ───────────────────────────────────────────────────────────────

describe('newsletterApi.subscribe', () => {
  it('calls newsletter endpoint with correct data', async () => {
    const requestData = {
      email: 'test@natly.org',
      language: 'es' as const,
      honeypot: '',
    };

    const responseData = {
      success: true,
      message: 'Check your email',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const result = await newsletterApi.subscribe(requestData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/newsletter'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestData),
      })
    );

    expect(result).toEqual(responseData);
  });

  it('returns success response on valid subscription', async () => {
    const responseData = {
      success: true,
      message: 'Subscription successful',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const result = await newsletterApi.subscribe({
      email: 'user@example.com',
      language: 'en',
      honeypot: '',
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it('handles validation errors from API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Email already subscribed',
        code: ERROR_CODES.ALREADY_SUBSCRIBED,
      }),
    });

    await expect(
      newsletterApi.subscribe({
        email: 'existing@example.com',
        language: 'en',
        honeypot: '',
      })
    ).rejects.toThrow('Email already subscribed');
  });
});

// ───────────────────────────────────────────────────────────────
// CONFIRM TESTS
// ───────────────────────────────────────────────────────────────

describe('newsletterApi.confirm', () => {
  it('calls confirm endpoint with JWT token', async () => {
    const requestData = {
      token: 'valid.jwt.token',
    };

    const responseData = {
      success: true,
      message: 'Subscription confirmed',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const result = await newsletterApi.confirm(requestData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/confirm'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestData),
      })
    );

    expect(result).toEqual(responseData);
  });

  it('handles invalid token errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Invalid or expired token',
        code: ERROR_CODES.INVALID_TOKEN,
      }),
    });

    await expect(
      newsletterApi.confirm({ token: 'invalid.token' })
    ).rejects.toThrow('Invalid or expired token');
  });

  it('handles already confirmed subscriptions', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Subscription already confirmed',
        code: ERROR_CODES.ALREADY_CONFIRMED,
      }),
    });

    await expect(
      newsletterApi.confirm({ token: 'valid.jwt.token' })
    ).rejects.toThrow('Subscription already confirmed');
  });
});

// ───────────────────────────────────────────────────────────────
// UNSUBSCRIBE TESTS
// ───────────────────────────────────────────────────────────────

describe('newsletterApi.unsubscribe', () => {
  it('calls unsubscribe endpoint with JWT token', async () => {
    const requestData = {
      token: 'valid.jwt.token',
    };

    const responseData = {
      success: true,
      message: 'Successfully unsubscribed',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const result = await newsletterApi.unsubscribe(requestData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/unsubscribe'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestData),
      })
    );

    expect(result).toEqual(responseData);
  });

  it('handles unsubscribe errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        error: 'Subscription not found',
        code: ERROR_CODES.NOT_FOUND,
      }),
    });

    await expect(
      newsletterApi.unsubscribe({ token: 'nonexistent.token' })
    ).rejects.toThrow('Subscription not found');
  });
});

// ───────────────────────────────────────────────────────────────
// EDGE CASES & INTEGRATION
// ───────────────────────────────────────────────────────────────

describe('API Client - Edge Cases', () => {
  it('handles malformed JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(
      newsletterApi.subscribe({
        email: 'test@example.com',
        language: 'en',
        honeypot: '',
      })
    ).rejects.toThrow();
  });

  it('handles network timeout', async () => {
    mockFetch.mockImplementationOnce(
      () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 100)
      )
    );

    await expect(
      newsletterApi.subscribe({
        email: 'test@example.com',
        language: 'en',
        honeypot: '',
      })
    ).rejects.toThrow('Network error');
  });

  it('preserves error details from API', async () => {
    const errorDetails = {
      field: 'email',
      reason: 'Invalid format',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        code: ERROR_CODES.VALIDATION_ERROR,
        details: errorDetails,
      }),
    });

    try {
      await newsletterApi.subscribe({
        email: 'invalid',
        language: 'en',
        honeypot: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NewsletterError);
      expect((error as NewsletterError).message).toBe('Validation failed');
    }
  });
});