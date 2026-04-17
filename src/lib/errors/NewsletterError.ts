// ═══════════════════════════════════════════════════════════════
// NEWSLETTER ERROR CLASS
// ═══════════════════════════════════════════════════════════════

export class NewsletterError extends Error {
  public code: string;
  public statusCode: number;
  public details?: unknown;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message);
    this.name = 'NewsletterError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, NewsletterError);
    }
  }
}

// Error codes
export const ERROR_CODES = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
  NOT_FOUND: 'NOT_FOUND',
};