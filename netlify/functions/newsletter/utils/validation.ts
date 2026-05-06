// ═══════════════════════════════════════════════════════════════
// VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';

// ───────────────────────────────────────────────────────────────
// ZOD SCHEMAS
// ───────────────────────────────────────────────────────────────

export const NewsletterRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long'),
  language: z
    .string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code too long')
    .default('en'),
  honeypot: z.string().optional(),
});

export type NewsletterRequest = z.infer<typeof NewsletterRequestSchema>;

// ───────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ───────────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return emailRegex.test(email);
}

export function normalizeLanguage(lang: string): string {
  // Extract first 2 chars and pad to exactly 2 chars for CHAR(2) column
  return lang.substring(0, 2).toLowerCase().padEnd(2, ' ');
}

export function isHoneypotFilled(honeypot?: string): boolean {
  return Boolean(honeypot && honeypot.trim().length > 0);
}