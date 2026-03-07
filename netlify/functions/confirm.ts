// ═══════════════════════════════════════════════════════════════
//  CONFIRM SUBSCRIPTION - Verifica JWT y confirma subscriber
// ═══════════════════════════════════════════════════════════════

import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

// ───────────────────────────────────────────────────────────────
// CLOUDINARY ASSETS
// ───────────────────────────────────────────────────────────────

const LOGO_LIGHT = "https://res.cloudinary.com/dxtaji00x/image/upload/natly-logo_gnuy2h.png";
const LOGO_DARK = "https://res.cloudinary.com/dxtaji00x/image/upload/v1772844721/natly-logo-dark_ddgjfu.png";
const WAVE = "https://res.cloudinary.com/dxtaji00x/image/upload/wave-footer_vmjxqu.png";
const ICON_NEWS = "https://res.cloudinary.com/dxtaji00x/image/upload/news-icon_uzk1cq.png";
const ICON_RESOURCES = "https://res.cloudinary.com/dxtaji00x/image/upload/resource-icon_bdcmjx.png";
const ICON_UPDATES = "https://res.cloudinary.com/dxtaji00x/image/upload/updates-icon_gxy68s.png";
const ICON_ADVICE = "https://res.cloudinary.com/dxtaji00x/image/upload/advice-icon_eknboq.png";

// ───────────────────────────────────────────────────────────────
// INITIALIZE CLIENTS
// ───────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// ───────────────────────────────────────────────────────────────
// SEND WELCOME EMAIL
// ───────────────────────────────────────────────────────────────

async function sendWelcomeEmail(email: string, language: string): Promise<void> {
  const isSpanish = language === 'es';

  const subject = isSpanish
    ? '🎉 ¡Bienvenido a Natly!'
    : '🎉 Welcome to Natly!';

  const html = isSpanish
    ? getSpanishWelcomeEmail()
    : getEnglishWelcomeEmail();

  await resend.emails.send({
    from: 'Natly <hello@mail.natly.org>',
    to: email,
    subject,
    html,
    replyTo: 'contact@natly.org',
  });
}

// ───────────────────────────────────────────────────────────────
// WELCOME EMAIL - SPANISH
// ───────────────────────────────────────────────────────────────

function getSpanishWelcomeEmail(): string {
  return `
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Suscripción confirmada - Natly</title>
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark;}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:#f5f7fa;color:#052859;}
.wrapper{padding:30px 14px;}
.card{max-width:640px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(5,40,89,0.12);}
.content{padding:30px 26px 18px;text-align:center;}
.logo{width:240px;max-width:75vw;display:block;margin:auto;}
h1{margin:14px 0 6px;font-size:30px;line-height:36px;font-weight:900;color:#052859;}
.subtitle{margin:0;font-size:16px;line-height:24px;color:#2b3648;}
.divider{height:3px;width:100%;margin:18px 0;background:linear-gradient(to right,rgba(244,176,0,0) 0%,#F4B000 25%,#F4B000 75%,rgba(244,176,0,0) 100%);}
.section-title{margin:12px 0 8px;font-size:17px;line-height:24px;font-weight:900;color:#052859;}
.list{margin:10px auto 6px;padding:0;list-style:none;max-width:520px;text-align:left;}
.item{padding:12px 14px;border-top:1px solid #eef2f7;font-size:15px;line-height:22px;color:#052859;}
.item:last-child{border-bottom:1px solid #eef2f7;}
.item b{font-weight:900;}
.icon{width:22px;height:22px;display:block;}
.btn{display:inline-flex;align-items:center;gap:12px;background:#0A3A78;color:#ffffff;text-decoration:none;font-weight:900;font-size:17px;padding:14px 20px;border-radius:999px;box-shadow:0 10px 0 #F4B000,0 18px 26px rgba(10,58,120,0.25);margin-top:14px;}
.btn-circle{width:34px;height:34px;border-radius:999px;background:#F4B000;display:flex;align-items:center;justify-content:center;font-weight:900;color:#052859;}
.small{font-size:13px;color:#667085;margin:14px 0 0;}
.help{margin-top:16px;font-size:13px;line-height:20px;color:#2b3648;}
.help a{color:#0A3A78;font-weight:800;text-decoration:underline;}
.footer-links{margin-top:14px;font-size:12px;color:#667085;}
.footer-links a{color:#0A3A78;font-weight:800;text-decoration:underline;}
.wave{width:100%;display:block;height:auto;}
@media (prefers-color-scheme:dark){
body{background:#1a1a1a!important;color:#ffffff!important;}
.card{background:#2d2d2d!important;}
h1{color:#ffffff!important;}
.section-title{color:#ffffff!important;}
.subtitle{color:#e8eaed!important;}
.item{border-color:#3f3f3f!important;color:#e8eaed!important;}
.small,.footer-links{color:#c5c7ca!important;}
.help{color:#e8eaed!important;}
.help a,.footer-links a{color:#FFD700!important;}
.btn{background:#F4B000!important;color:#052859!important;box-shadow:0 10px 0 rgba(255,255,255,0.12),0 18px 26px rgba(0,0,0,0.25)!important;}
.btn-circle{background:#052859!important;color:#ffffff!important;}
}
@media(max-width:480px){
.content{padding:24px 18px 16px;}
h1{font-size:26px;line-height:32px;}
.btn{width:100%;justify-content:center;}
}
.dark-logo{display:none;max-height:0;overflow:hidden;opacity:0;}
.light-logo{display:block;}
@media (prefers-color-scheme:dark){
  .light-logo{display:none!important;max-height:0!important;overflow:hidden!important;opacity:0!important;}
  .dark-logo{display:block!important;max-height:none!important;overflow:visible!important;opacity:1!important;}
}
</style>
</head>
<body>
<div class="wrapper">
<div class="card">
<div class="content">

<img src="${LOGO_LIGHT}" width="240" class="logo light-logo" alt="Natly" style="border:0;outline:none;text-decoration:none;">
<div class="dark-logo" style="display:none;">
  <img src="${LOGO_DARK}" width="240" class="logo" alt="Natly" style="display:block;border:0;outline:none;text-decoration:none;">
</div>

<h1>Suscripción confirmada</h1>
<p class="subtitle">Tu suscripción a nuestra lista ha sido confirmada.</p>

<div class="divider"></div>

<p class="section-title">Estás a un paso de formar parte de <b>Natly</b>.</p>
<p class="subtitle">A partir de ahora podrás recibir:</p>

<ul class="list">
<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_NEWS}">
</td>
<td style="vertical-align:middle;">
<b>Noticias importantes</b> sobre ciudadanía
</td>
</tr>
</table>
</li>

<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_RESOURCES}">
</td>
<td style="vertical-align:middle;">
Recursos de estudio <b>fáciles de entender</b>
</td>
</tr>
</table>
</li>

<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_UPDATES}">
</td>
<td style="vertical-align:middle;">
Novedades y <b>mejoras</b> de la plataforma
</td>
</tr>
</table>
</li>

<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_ADVICE}">
</td>
<td style="vertical-align:middle;">
Consejos útiles para tu <b>proceso de ciudadanía</b>
</td>
</tr>
</table>
</li>
</ul>

<a class="btn" href="https://natly.org/flashcard">
Practicar con flashcards
<span class="btn-circle">→</span>
</a>

<p class="small">Tip: guarda Natly en tus favoritos para practicar cuando quieras.</p>

<p class="help">
¿Necesitas ayuda? Escríbenos a
<a href="mailto:contact@natly.org">contact@natly.org</a>
</p>

<div class="footer-links">
<a href="https://natly.org/unsubscribe">Darse de baja</a>
</div>

</div>
<img class="wave" src="${WAVE}" alt="">
</div>
</div>
</body>
</html>
  `;
}

// ───────────────────────────────────────────────────────────────
// WELCOME EMAIL - ENGLISH
// ───────────────────────────────────────────────────────────────

function getEnglishWelcomeEmail(): string {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Subscription confirmed - Natly</title>
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark;}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:#f5f7fa;color:#052859;}
.wrapper{padding:30px 14px;}
.card{max-width:640px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(5,40,89,0.12);}
.content{padding:30px 26px 18px;text-align:center;}
.logo{width:240px;max-width:75vw;display:block;margin:auto;}
h1{margin:14px 0 6px;font-size:30px;line-height:36px;font-weight:900;color:#052859;}
.subtitle{margin:0;font-size:16px;line-height:24px;color:#2b3648;}
.divider{height:3px;width:100%;margin:18px 0;background:linear-gradient(to right,rgba(244,176,0,0) 0%,#F4B000 25%,#F4B000 75%,rgba(244,176,0,0) 100%);}
.section-title{margin:12px 0 8px;font-size:17px;line-height:24px;font-weight:900;color:#052859;}
.list{margin:10px auto 6px;padding:0;list-style:none;max-width:520px;text-align:left;}
.item{padding:12px 14px;border-top:1px solid #eef2f7;font-size:15px;line-height:22px;color:#052859;}
.item:last-child{border-bottom:1px solid #eef2f7;}
.item b{font-weight:900;}
.icon{width:22px;height:22px;display:block;}
.btn{display:inline-flex;align-items:center;gap:12px;background:#0A3A78;color:#ffffff;text-decoration:none;font-weight:900;font-size:17px;padding:14px 20px;border-radius:999px;box-shadow:0 10px 0 #F4B000,0 18px 26px rgba(10,58,120,0.25);margin-top:14px;}
.btn-circle{width:34px;height:34px;border-radius:999px;background:#F4B000;display:flex;align-items:center;justify-content:center;font-weight:900;color:#052859;}
.small{font-size:13px;color:#667085;margin:14px 0 0;}
.help{margin-top:16px;font-size:13px;line-height:20px;color:#2b3648;}
.help a{color:#0A3A78;font-weight:800;text-decoration:underline;}
.footer-links{margin-top:14px;font-size:12px;color:#667085;}
.footer-links a{color:#0A3A78;font-weight:800;text-decoration:underline;}
.wave{width:100%;display:block;height:auto;}
@media (prefers-color-scheme:dark){
body{background:#1a1a1a!important;color:#ffffff!important;}
.card{background:#2d2d2d!important;}
h1{color:#ffffff!important;}
.section-title{color:#ffffff!important;}
.subtitle{color:#e8eaed!important;}
.item{border-color:#3f3f3f!important;color:#e8eaed!important;}
.small,.footer-links{color:#c5c7ca!important;}
.help{color:#e8eaed!important;}
.help a,.footer-links a{color:#FFD700!important;}
.btn{background:#F4B000!important;color:#052859!important;box-shadow:0 10px 0 rgba(255,255,255,0.12),0 18px 26px rgba(0,0,0,0.25)!important;}
.btn-circle{background:#052859!important;color:#ffffff!important;}
}
@media(max-width:480px){
.content{padding:24px 18px 16px;}
h1{font-size:26px;line-height:32px;}
.btn{width:100%;justify-content:center;}
}
.dark-logo{display:none;max-height:0;overflow:hidden;opacity:0;}
.light-logo{display:block;}
@media (prefers-color-scheme:dark){
  .light-logo{display:none!important;max-height:0!important;overflow:hidden!important;opacity:0!important;}
  .dark-logo{display:block!important;max-height:none!important;overflow:visible!important;opacity:1!important;}
}
</style>
</head>
<body>
<div class="wrapper">
<div class="card">
<div class="content">

<img src="${LOGO_LIGHT}" width="240" class="logo light-logo" alt="Natly" style="border:0;outline:none;text-decoration:none;">
<div class="dark-logo" style="display:none;">
  <img src="${LOGO_DARK}" width="240" class="logo" alt="Natly" style="display:block;border:0;outline:none;text-decoration:none;">
</div>

<h1>Subscription confirmed</h1>
<p class="subtitle">Your subscription to our list has been confirmed.</p>

<div class="divider"></div>

<p class="section-title">You are one step away from being part of <b>Natly</b>.</p>
<p class="subtitle">From now on, you can receive:</p>

<ul class="list">
<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_NEWS}">
</td>
<td style="vertical-align:middle;">
<b>Important citizenship news</b>
</td>
</tr>
</table>
</li>

<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_RESOURCES}">
</td>
<td style="vertical-align:middle;">
Study resources that are <b>easy to understand</b>
</td>
</tr>
</table>
</li>

<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_UPDATES}">
</td>
<td style="vertical-align:middle;">
Platform updates and <b>improvements</b>
</td>
</tr>
</table>
</li>

<li class="item">
<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td width="28" style="vertical-align:middle;padding-right:10px;">
<img class="icon" alt="" src="${ICON_ADVICE}">
</td>
<td style="vertical-align:middle;">
Helpful tips for your <b>citizenship process</b>
</td>
</tr>
</table>
</li>
</ul>

<a class="btn" href="https://natly.org/flashcard">
Practice with flashcards
<span class="btn-circle">→</span>
</a>

<p class="small">Tip: bookmark Natly so you can practice anytime.</p>

<p class="help">
Need help? Email us at
<a href="mailto:contact@natly.org">contact@natly.org</a>
</p>

<div class="footer-links">
<a href="https://natly.org/unsubscribe">Unsubscribe</a>
</div>

</div>
<img class="wave" src="${WAVE}" alt="">
</div>
</div>
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
    const { token } = JSON.parse(event.body || '{}');

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Token is required' }),
      };
    }

    // 1. Verify JWT
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

    // 2. Validate token type
    if (decoded.type !== 'confirmation') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid token type' }),
      };
    }

    // 3. Find subscriber in DB
    const { data: subscriber, error: selectError } = await supabase
      .from('subscribers')
      .select('id, email, language, status, confirmation_token')
      .eq('email', decoded.email)
      .eq('confirmation_token', decoded.dbToken)
      .single();

    if (selectError || !subscriber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid token or already used' }),
      };
    }

    // 4. Check if already confirmed
    if (subscriber.status === 'confirmed') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Email already confirmed',
          alreadyConfirmed: true
        }),
      };
    }

    // 5. Confirm subscriber
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to confirm subscription' }),
      };
    }

    // 6. Send welcome email
    try {
      await sendWelcomeEmail(subscriber.email, subscriber.language);
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
    }

    // 7. Success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Subscription confirmed successfully'
      }),
    };

  } catch (error) {
    console.error('Confirmation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};