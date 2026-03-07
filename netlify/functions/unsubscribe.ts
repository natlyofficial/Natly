// ═══════════════════════════════════════════════════════════════
//  UNSUBSCRIBE - Cancela suscripción con JWT
// ═══════════════════════════════════════════════════════════════

import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

// ───────────────────────────────────────────────────────────────
// CLOUDINARY ASSETS
// ───────────────────────────────────────────────────────────────

const LOGO = "https://res.cloudinary.com/dxtaji00x/image/upload/natly-logo_gnuy2h.png";
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
// SEND GOODBYE EMAIL
// ───────────────────────────────────────────────────────────────

async function sendGoodbyeEmail(
  email: string,
  language: string,
  reason?: string
): Promise<void> {
  const isSpanish = language === 'es';

  const subject = isSpanish
    ? '👋 Te extrañaremos - Natly'
    : '👋 We\'ll miss you - Natly';

  const html = isSpanish
    ? getSpanishGoodbyeEmail(reason)
    : getEnglishGoodbyeEmail(reason);

  await resend.emails.send({
    from: 'Natly <hello@mail.natly.org>',
    to: email,
    subject,
    html,
    replyTo: 'contact@natly.org',
  });
}

// ───────────────────────────────────────────────────────────────
// GOODBYE EMAIL - SPANISH
// ───────────────────────────────────────────────────────────────

function getSpanishGoodbyeEmail(reason?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Has sido dado de baja - Natly</title>
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
</style>
</head>
<body bgcolor="#f5f7fa" style="margin:0;padding:0;background:#f5f7fa;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7fa" style="background:#f5f7fa;">
<tr>
<td align="center" style="padding:24px 12px;">

<table width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(5,40,89,0.10);">

<!-- Logo -->
<tr>
<td align="center" style="padding:28px 24px 10px;">
<img src="${LOGO}" width="240" class="logo" alt="Natly" style="border:0;outline:none;text-decoration:none;">
</td>
</tr>

<!-- Title -->
<tr>
<td align="center" class="pad" style="padding:0 24px 6px;">
<div class="title" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:28px;line-height:34px;font-weight:bold;color:#052859;">
Has sido dado de baja
</div>
</td>
</tr>

<!-- Message -->
<tr>
<td align="center" class="pad" style="padding:0 24px 14px;">
<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;">
Tu suscripción al newsletter de Natly ha sido cancelada exitosamente.
</div>

<div style="width:100%;height:3px;background:linear-gradient(to right,rgba(244,176,0,0) 0%,#F4B000 25%,#F4B000 75%,rgba(244,176,0,0) 100%);margin:18px 0;"></div>

<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;">
Ya no recibirás más emails de nuestra parte. Sin embargo, siempre puedes volver a suscribirte cuando quieras en <a href="https://natly.org" style="color:#0A3A78;text-decoration:underline;">natly.org</a>
</div>

${reason ? `
<div style="margin:20px 0;padding:16px;background:#f5f7fa;border-radius:8px;border-left:4px solid #F4B000;">
<p style="margin:0;font-family:Verdana,Geneva,Arial,sans-serif;font-size:12px;line-height:18px;color:#052859;">
<strong>Razón:</strong> ${reason}
</p>
</div>
` : ''}

<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;margin-top:20px;">
Recuerda que <strong>Natly siempre estará aquí para ayudarte</strong> en tu camino hacia la ciudadanía estadounidense. Puedes seguir usando la plataforma cuando quieras.
</div>
</td>
</tr>

<!-- Button -->
<tr>
<td align="center" style="padding:6px 24px 22px;">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td bgcolor="#0A3A78" style="background:#0A3A78;border-radius:999px;">
<a href="https://natly.org/flashcard" style="display:inline-block;padding:14px 18px;text-decoration:none;border-radius:999px;font-family:Verdana,Geneva,Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;">
Seguir practicando &nbsp;→
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Help -->
<tr>
<td align="center" class="pad" style="padding:0 28px 14px;">
<p class="small" style="margin:0 0 10px;">
Si te diste de baja por error, puedes volver a suscribirte en cualquier momento desde nuestro sitio web.
</p>
<p class="small" style="margin:0;">
¿Tienes comentarios o sugerencias? Escríbenos a:<br>
<a href="mailto:contact@natly.org" style="color:#0A3A78;text-decoration:underline;">contact@natly.org</a>
</p>
</td>
</tr>

<!-- Wave -->
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

// ───────────────────────────────────────────────────────────────
// GOODBYE EMAIL - ENGLISH
// ───────────────────────────────────────────────────────────────

function getEnglishGoodbyeEmail(reason?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>You've been unsubscribed - Natly</title>
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
</style>
</head>
<body bgcolor="#f5f7fa" style="margin:0;padding:0;background:#f5f7fa;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7fa" style="background:#f5f7fa;">
<tr>
<td align="center" style="padding:24px 12px;">

<table width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(5,40,89,0.10);">

<!-- Logo -->
<tr>
<td align="center" style="padding:28px 24px 10px;">
<img src="${LOGO}" width="240" class="logo" alt="Natly" style="border:0;outline:none;text-decoration:none;">
</td>
</tr>

<!-- Title -->
<tr>
<td align="center" class="pad" style="padding:0 24px 6px;">
<div class="title" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:28px;line-height:34px;font-weight:bold;color:#052859;">
You've been unsubscribed
</div>
</td>
</tr>

<!-- Message -->
<tr>
<td align="center" class="pad" style="padding:0 24px 14px;">
<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;">
Your subscription to Natly's newsletter has been successfully canceled.
</div>

<div style="width:100%;height:3px;background:linear-gradient(to right,rgba(244,176,0,0) 0%,#F4B000 25%,#F4B000 75%,rgba(244,176,0,0) 100%);margin:18px 0;"></div>

<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;">
You won't receive any more emails from us. However, you can always resubscribe anytime at <a href="https://natly.org" style="color:#0A3A78;text-decoration:underline;">natly.org</a>
</div>

${reason ? `
<div style="margin:20px 0;padding:16px;background:#f5f7fa;border-radius:8px;border-left:4px solid #F4B000;">
<p style="margin:0;font-family:Verdana,Geneva,Arial,sans-serif;font-size:12px;line-height:18px;color:#052859;">
<strong>Reason:</strong> ${reason}
</p>
</div>
` : ''}

<div class="text" style="font-family:Verdana,Geneva,Arial,sans-serif;font-size:14px;line-height:22px;color:#2b3648;margin-top:20px;">
Remember that <strong>Natly will always be here to help you</strong> on your journey to U.S. citizenship. You can continue using the platform anytime.
</div>
</td>
</tr>

<!-- Button -->
<tr>
<td align="center" style="padding:6px 24px 22px;">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td bgcolor="#0A3A78" style="background:#0A3A78;border-radius:999px;">
<a href="https://natly.org/flashcard" style="display:inline-block;padding:14px 18px;text-decoration:none;border-radius:999px;font-family:Verdana,Geneva,Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;">
Keep practicing &nbsp;→
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Help -->
<tr>
<td align="center" class="pad" style="padding:0 28px 14px;">
<p class="small" style="margin:0 0 10px;">
If you unsubscribed by mistake, you can resubscribe anytime from our website.
</p>
<p class="small" style="margin:0;">
Have feedback or suggestions? Email us at:<br>
<a href="mailto:contact@natly.org" style="color:#0A3A78;text-decoration:underline;">contact@natly.org</a>
</p>
</td>
</tr>

<!-- Wave -->
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
  const headers = {
    'Access-Control-Allow-Origin': 'https://natly.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
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
    const { token, reason } = JSON.parse(event.body || '{}');

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Token is required' }),
      };
    }

    // 1. Verify JWT (can be confirmation or unsubscribe token)
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid or expired token' }),
      };
    }

    // 2. Find subscriber in DB
    const { data: subscriber, error: selectError } = await supabase
      .from('subscribers')
      .select('id, email, language, status, unsubscribe_token')
      .eq('email', decoded.email)
      .single();

    if (selectError || !subscriber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Subscriber not found' }),
      };
    }

    // 3. Check if already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Already unsubscribed',
          alreadyUnsubscribed: true
        }),
      };
    }

    // 4. Unsubscribe
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason: reason || null,
        unsubscribe_token: null,
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to unsubscribe' }),
      };
    }

    // 5. Send goodbye email
    try {
      await sendGoodbyeEmail(subscriber.email, subscriber.language, reason);
    } catch (emailError) {
      console.error('Goodbye email error:', emailError);
    }

    // 6. Success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Successfully unsubscribed'
      }),
    };

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};