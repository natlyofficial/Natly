import { Handler, HandlerEvent } from '@netlify/functions';

// Mailchimp config
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

// Security
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
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
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Too many requests. Please try again in a minute.' 
        }),
      };
    }

    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body required' }),
      };
    }

    const { email, honeypot, language } = JSON.parse(body);

    // Honeypot check
    if (honeypot) {
      console.log('Bot detected:', clientIP);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    // Email validation
    if (!email || typeof email !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    if (!EMAIL_REGEX.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    if (email.length > 254) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email too long' }),
      };
    }

    // Validate environment variables
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_AUDIENCE_ID) {
      console.error('Missing Mailchimp configuration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Determine tag and merge field based on language
    const languageTag = language === 'es' ? 'Spanish' : 'English';

    // Mailchimp API call
    const mailchimpUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    
    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status: 'pending',
        tags: [languageTag],
        merge_fields: {
          LANGUAGE: languageTag
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mailchimp error:', data);

      if (data.title === 'Member Exists') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'This email is already subscribed' 
          }),
        };
      }

      if (data.title === 'Invalid Resource') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid email address' 
          }),
        };
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to process subscription. Please try again.' 
        }),
      };
    }

    // Success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed! Check your email to confirm.'
      }),
    };

  } catch (error) {
    console.error('Newsletter function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error. Please try again later.' 
      }),
    };
  }
};