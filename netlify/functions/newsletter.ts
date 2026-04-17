// ═══════════════════════════════════════════════════════════════
//  NEWSLETTER SUBSCRIPTION - Guarda en Supabase y envía email
// ═══════════════════════════════════════════════════════════════

import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ───────────────────────────────────────────────────────────────
// CLOUDINARY ASSETS
// ───────────────────────────────────────────────────────────────

const LOGO_LIGHT = "https://res.cloudinary.com/dxtaji00x/image/upload/natly-logo_gnuy2h.png";
const LOGO_DARK = "https://res.cloudinary.com/dxtaji00x/image/upload/v1772844721/natly-logo-dark_ddgjfu.png";
const WAVE = "https://res.cloudinary.com/dxtaji00x/image/upload/wave-footer_vmjxqu.png";

// ───────────────────────────────────────────────────────────────
// INITIALIZE CLIENTS
// ───────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// ───────────────────────────────────────────────────────────────
// RATE LIMITING (in-memory, per IP)
// ───────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // 3 signups per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

// ───────────────────────────────────────────────────────────────
// TOKEN GENERATION
// ───────────────────────────────────────────────────────────────

function generateDbToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateJWT(email: string, dbToken: string, type: 'confirmation' | 'unsubscribe'): string {
  return jwt.sign(
    { email, dbToken, type },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

// ───────────────────────────────────────────────────────────────
// SEND CONFIRMATION EMAIL
// ───────────────────────────────────────────────────────────────

async function sendConfirmationEmail(
  email: string,
  language: string,
  jwtToken: string
): Promise<void> {
  const isSpanish = language === 'es';
  const confirmUrl = `https://natly.org/confirm?token=${jwtToken}`;

  const subject = isSpanish
    ? '✉️ Confirma tu suscripción a Natly'
    : '✉️ Confirm your Natly subscription';

  const html = isSpanish
    ? getSpanishConfirmationEmail(confirmUrl)
    : getEnglishConfirmationEmail(confirmUrl);

  await resend.emails.send({
    from: 'Natly <newsletter@mail.natly.org>',
    to: email,
    subject,
    html,
    replyTo: 'contact@natly.org',
  });
}

// ───────────────────────────────────────────────────────────────
// EMAIL TEMPLATES - CONFIRMATION (simple, con botón)
// ───────────────────────────────────────────────────────────────

function getSpanishConfirmationEmail(confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Confirma tu suscripción - Natly</title>
<style>
body,td{font-family:Verdana,Geneva,Arial,sans-serif;font-size:12px;}
p{line-height:18px;}
.small{font-size:11px;line-height:16px;color:#667085;}
@media only screen and (max-width:600px){
.container{width:100%!important;}
.pad{padding-left:20px!important;padding-right:20px!important;}
.title{font-size:24px!important;line-height:30px!important;}
.text{font-size:14px!important;line-height:22px!important;}
.logo{width:200px!important;height:auto!important;}
}
.dark-logo{display:none;max-height:0;overflow:hidden;opacity:0;}
.light-logo{display:block;}
@media (prefers-color-scheme:dark){
  .light-logo{display:none!important;max-height:0!important;overflow:hidden!important;opacity:0!important;}
  .dark-logo{display:block!important;max-height:none!important;overflow:visible!important;opacity:1!important;}
}
</style>
</head>
<body bgcolor="#f5f7fa" style="margin:0;padding:0;background:#f5f7fa;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7fa" style="background:#f5f7fa;">
<tr>
<td align="center" style="padding:24px 12px;">

<table width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(5,40,89,0.10);">

<tr>
<td align="center" style="padding:28px 24px 10px;">
<img src="${LOGO_LIGHT}" width="240" class="logo light-logo" alt="Natly" style="border:0;outline:none;text-decoration:none;">
<div class="dark-logo" style="display:none;">
  <img src="${LOGO_DARK}" width="240" class="logo" alt="Natly" style="display:block;border:0;outline:none;text-decoration:none;">
</div>
</td>
</tr>

<tr>
<td align="center" class="pad" style="padding:0 24px 6px;">
<div class="title" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:28px;line-height:34px;font-weight:bold;color:#052859;">
Confirma tu suscripción
</div>
</td>
</tr>

<tr>
<td align="center" class="pad" style="padding:0 24px 14px;">
<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;">
Hola, por favor confirma tu correo para completar tu suscripción a Natly. 
Esto nos ayuda a proteger tu correo y evitar spam.
</div>

<div style="width:100%;height:3px;background:linear-gradient(to right,rgba(244,176,0,0) 0%,#F4B000 25%,#F4B000 75%,rgba(244,176,0,0) 100%);margin:18px 0;"></div>

<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#052859;font-weight:bold;">
Haz clic para confirmar:
</div>
</td>
</tr>

<tr>
<td align="center" style="padding:6px 24px 22px;">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td bgcolor="#0A3A78" style="background:#0A3A78;border-radius:999px;">
<a href="${confirmUrl}" style="display:inline-block;padding:14px 18px;text-decoration:none;border-radius:999px;font-family:Verdana,Geneva,Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;">
Confirmar mi suscripción &nbsp;→
</a>
</td>
</tr>
<tr>
<td height="10" style="height:10px;line-height:10px;font-size:0;"></td>
</tr>
<tr>
<td align="center" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:11px;color:#667085;">
Si no das clic, no quedarás suscrito.
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td align="center" class="pad" style="padding:0 28px 14px;">
<p class="small" style="margin:0 0 10px;">
Si recibiste este correo por error, ignóralo o elimínalo. Tu suscripción solo se activará si confirmas.
</p>
<p class="small" style="margin:0;">
¿Preguntas? Escríbenos a:<br>
<a href="mailto:contact@natly.org" style="color:#0A3A78;text-decoration:underline;">contact@natly.org</a>
</p>
</td>
</tr>

<tr>
<td style="padding:0;margin:0;line-height:0;font-size:0;">
<img src="${WAVE}" width="600" alt="" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;outline:none;text-decoration:none;">
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
  `;
}

function getEnglishConfirmationEmail(confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Confirm your subscription - Natly</title>
<style>
body,td{font-family:Verdana,Geneva,Arial,sans-serif;font-size:12px;}
p{line-height:18px;}
.small{font-size:11px;line-height:16px;color:#667085;}
@media only screen and (max-width:600px){
.container{width:100%!important;}
.pad{padding-left:20px!important;padding-right:20px!important;}
.title{font-size:24px!important;line-height:30px!important;}
.text{font-size:14px!important;line-height:22px!important;}
.logo{width:200px!important;height:auto!important;}
}
.dark-logo{display:none;max-height:0;overflow:hidden;opacity:0;}
.light-logo{display:block;}
@media (prefers-color-scheme:dark){
  .light-logo{display:none!important;max-height:0!important;overflow:hidden!important;opacity:0!important;}
  .dark-logo{display:block!important;max-height:none!important;overflow:visible!important;opacity:1!important;}
}
</style>
</head>
<body bgcolor="#f5f7fa" style="margin:0;padding:0;background:#f5f7fa;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7fa" style="background:#f5f7fa;">
<tr>
<td align="center" style="padding:24px 12px;">

<table width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(5,40,89,0.10);">

<tr>
<td align="center" style="padding:28px 24px 10px;">
<img src="${LOGO_LIGHT}" width="240" class="logo light-logo" alt="Natly" style="border:0;outline:none;text-decoration:none;">
<div class="dark-logo" style="display:none;">
  <img src="${LOGO_DARK}" width="240" class="logo" alt="Natly" style="display:block;border:0;outline:none;text-decoration:none;">
</div>
</td>
</tr>

<tr>
<td align="center" class="pad" style="padding:0 24px 6px;">
<div class="title" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:28px;line-height:34px;font-weight:bold;color:#052859;">
Confirm your subscription
</div>
</td>
</tr>

<tr>
<td align="center" class="pad" style="padding:0 24px 14px;">
<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;">
Hi, please confirm your email to complete your Natly subscription. 
This helps protect your inbox and prevent spam.
</div>

<div style="width:100%;height:3px;background:linear-gradient(to right,rgba(244,176,0,0) 0%,#F4B000 25%,#F4B000 75%,rgba(244,176,0,0) 100%);margin:18px 0;"></div>

<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#052859;font-weight:bold;">
Click to confirm:
</div>
</td>
</tr>

<tr>
<td align="center" style="padding:6px 24px 22px;">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td bgcolor="#0A3A78" style="background:#0A3A78;border-radius:999px;">
<a href="${confirmUrl}" style="display:inline-block;padding:14px 18px;text-decoration:none;border-radius:999px;font-family:Verdana,Geneva,Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;">
Confirm my subscription &nbsp;→
</a>
</td>
</tr>
<tr>
<td height="10" style="height:10px;line-height:10px;font-size:0;"></td>
</tr>
<tr>
<td align="center" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:11px;color:#667085;">
You won't be subscribed unless you confirm.
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td align="center" class="pad" style="padding:0 28px 14px;">
<p class="small" style="margin:0 0 10px;">
If you received this email by mistake, ignore or delete it. You won't be subscribed unless you confirm.
</p>
<p class="small" style="margin:0;">
Questions? Contact:<br>
<a href="mailto:contact@natly.org" style="color:#0A3A78;text-decoration:underline;">contact@natly.org</a>
</p>
</td>
</tr>

<tr>
<td style="padding:0;margin:0;line-height:0;font-size:0;">
<img src="${WAVE}" width="600" alt="" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;outline:none;text-decoration:none;">
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
  `;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN HANDLER
// ═══════════════════════════════════════════════════════════════

export const handler: Handler = async (event) => {
  const allowedOrigins = [
    "https://natly.org",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ];

  const origin = event.headers.origin || "";
  const headers = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) 
      ? origin 
      : "https://natly.org",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, honeypot, language } = JSON.parse(event.body || '{}');

    // Honeypot check
    if (honeypot) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Subscription successful' }),
      };
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Rate limiting
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    if (!checkRateLimit(ip)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      };
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'confirmed') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Already subscribed' }),
        };
      }
    }

    // Generate tokens
    const dbToken = generateDbToken();
    const jwtToken = generateJWT(email, dbToken, 'confirmation');

    // Insert or update subscriber
    const { error: upsertError } = await supabase
      .from('subscribers')
      .upsert({
        email,
        language: language || 'en',
        status: 'pending',
        confirmation_token: dbToken,
        unsubscribe_token: generateDbToken(),
        ip_address: ip,
        source: 'footer',
      }, {
        onConflict: 'email'
      });

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save subscription' }),
      };
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, language || 'en', jwtToken);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send confirmation email' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Confirmation email sent' }),
    };

  } catch (error) {
    console.error('Newsletter error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};