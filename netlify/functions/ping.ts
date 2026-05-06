// ═══════════════════════════════════════════════════════════════
// SUPABASE KEEP-ALIVE PING
// Ejecutado por GitHub Actions cada 6 días para evitar pausa
// ═══════════════════════════════════════════════════════════════

import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// ───────────────────────────────────────────────────────────────
// CORS HEADERS
// ───────────────────────────────────────────────────────────────

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

// ───────────────────────────────────────────────────────────────
// HANDLER
// ───────────────────────────────────────────────────────────────

export const handler: Handler = async (event) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only GET allowed
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Verify authorization (simple secret check)
    const authHeader = event.headers.authorization || '';
    const expectedAuth = `Bearer ${process.env.PING_SECRET}`;

    if (authHeader !== expectedAuth) {
      console.log('[Ping] Unauthorized request');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Simple query to keep database active
    const { data, error } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);

    if (error) {
      console.error('[Ping] Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Database query failed',
          details: error.message,
        }),
      };
    }

    const timestamp = new Date().toISOString();
    console.log(`[Ping] Success at ${timestamp}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Supabase keep-alive ping successful',
        timestamp,
      }),
    };

  } catch (error) {
    console.error('[Ping] Unexpected error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
    };
  }
};