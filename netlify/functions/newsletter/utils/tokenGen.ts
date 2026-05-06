// ═══════════════════════════════════════════════════════════════
// TOKEN GENERATION UTILITIES
// ═══════════════════════════════════════════════════════════════

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// ───────────────────────────────────────────────────────────────
// DATABASE TOKEN (random hex for storing in DB)
// ───────────────────────────────────────────────────────────────

export function generateDbToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ───────────────────────────────────────────────────────────────
// JWT TOKEN (for email links)
// ───────────────────────────────────────────────────────────────

export function generateJWT(
  email: string,
  dbToken: string,
  type: 'confirmation' | 'unsubscribe'
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { email, dbToken, type },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// ───────────────────────────────────────────────────────────────
// VERIFY JWT TOKEN
// ───────────────────────────────────────────────────────────────

export function verifyJWT(token: string): {
  email: string;
  dbToken: string;
  type: string;
} {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.verify(token, process.env.JWT_SECRET) as {
    email: string;
    dbToken: string;
    type: string;
  };
}