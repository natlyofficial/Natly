// ═══════════════════════════════════════════════════════════════
// NEWSLETTER FUNCTION TYPES
// ═══════════════════════════════════════════════════════════════

export interface NewsletterRequestBody {
  email: string;
  language: string;
  honeypot?: string;
}

export interface EmailTemplateData {
  confirmUrl: string;
  language: 'en' | 'es';
}

export interface RateLimitEntry {
  timestamps: number[];
}

export type EmailType = 'confirmation' | 'welcome' | 'unsubscribe';