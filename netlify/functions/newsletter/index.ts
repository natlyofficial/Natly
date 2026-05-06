// ═══════════════════════════════════════════════════════════════
// NEWSLETTER SUBSCRIPTION HANDLER - Clean & Modular
// ═══════════════════════════════════════════════════════════════

import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Utils
import { checkRateLimit } from './utils/rateLimit';
import { generateDbToken, generateJWT } from './utils/tokenGen';
import {
  NewsletterRequestSchema,
  normalizeLanguage,
  isHoneypotFilled,
} from './utils/validation';

// Templates
import { getConfirmationEmail } from './templates/confirmation';

// Types
import type { NewsletterRequestBody } from './types';

// ───────────────────────────────────────────────────────────────
// INITIALIZE CLIENTS
// ───────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// ───────────────────────────────────────────────────────────────
// CORS CONFIGURATION
// ───────────────────────────────────────────────────────────────

const allowedOrigins = [
  'https://natly.org',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8888',
  'http://127.0.0.1:8888',
];

function getCorsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
      ? origin
      : 'https://natly.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// ───────────────────────────────────────────────────────────────
// SEND CONFIRMATION EMAIL
// ───────────────────────────────────────────────────────────────

async function sendConfirmationEmail(
  email: string,
  language: 'en' | 'es',
  jwtToken: string
): Promise<void> {
  const confirmUrl = `https://natly.org/confirm?token=${jwtToken}`;
  
  const subject = language === 'es'
    ? '✉️ Confirma tu suscripción a Natly'
    : '✉️ Confirm your Natly subscription';

  const html = getConfirmationEmail(confirmUrl, language);

  await resend.emails.send({
    from: 'Natly <newsletter@mail.natly.org>',
    to: email,
    subject,
    html,
    replyTo: 'contact@natly.org',
  });
}

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════

export const handler: Handler = async (event) => {
  const origin = event.headers.origin || '';
  const headers = getCorsHeaders(origin);

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // ─────────────────────────────────────────────────────────
    // 1. PARSE AND VALIDATE REQUEST
    // ─────────────────────────────────────────────────────────

    const body: NewsletterRequestBody = JSON.parse(event.body || '{}');
    
    // Honeypot check (bot detection)
    if (isHoneypotFilled(body.honeypot)) {
      console.log('[Honeypot] Bot detected, returning fake success');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Subscription successful' 
        }),
      };
    }

    // Validate with Zod
    const validationResult = NewsletterRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request data',
          details: validationResult.error.issues,
        }),
      };
    }

    const { email, language } = validationResult.data;

    // ─────────────────────────────────────────────────────────
    // 2. RATE LIMITING
    // ─────────────────────────────────────────────────────────

    const ip = event.headers['x-forwarded-for'] || 
                event.headers['client-ip'] || 
                'unknown';

    if (!checkRateLimit(ip)) {
      console.log(`[Rate Limit] IP ${ip} exceeded limit`);
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Too many requests. Please try again later.' 
        }),
      };
    }

    // ─────────────────────────────────────────────────────────
    // 3. CHECK EXISTING SUBSCRIBER
    // ─────────────────────────────────────────────────────────

    const { data: existing } = await supabase
      .from('subscribers')
      .select('status')
      .eq('email', email)
      .single();

    if (existing?.status === 'confirmed') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Already subscribed' 
        }),
      };
    }

    // ─────────────────────────────────────────────────────────
    // 4. GENERATE TOKENS
    // ─────────────────────────────────────────────────────────

    const confirmationDbToken = generateDbToken();
    const unsubscribeDbToken = generateDbToken();
    const jwtToken = generateJWT(email, confirmationDbToken, 'confirmation');

    // ─────────────────────────────────────────────────────────
    // 5. SAVE TO DATABASE
    // ─────────────────────────────────────────────────────────

    const normalizedLanguage = normalizeLanguage(language);

    const { error: upsertError } = await supabase
      .from('subscribers')
      .upsert({
        email,
        language: normalizedLanguage,
        status: 'pending',
        confirmation_token: confirmationDbToken.padEnd(32, ' '),
        unsubscribe_token: unsubscribeDbToken.padEnd(32, ' '),
        ip_address: ip,
        source: 'footer',
      }, {
        onConflict: 'email',
      });

    if (upsertError) {
      console.error('[Supabase] Upsert error:', upsertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save subscription' }),
      };
    }

    // ─────────────────────────────────────────────────────────
    // 6. SEND CONFIRMATION EMAIL
    // ─────────────────────────────────────────────────────────

    try {
      const emailLanguage = normalizedLanguage.trim().substring(0, 2) as 'en' | 'es';
      await sendConfirmationEmail(email, emailLanguage, jwtToken);
    } catch (emailError) {
      console.error('[Resend] Email send error:', emailError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send confirmation email' }),
      };
    }

    // ─────────────────────────────────────────────────────────
    // 7. SUCCESS RESPONSE
    // ─────────────────────────────────────────────────────────

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent' 
      }),
    };

  } catch (error) {
    console.error('[Newsletter] Unexpected error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};