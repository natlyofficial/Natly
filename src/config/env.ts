// ═══════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════

interface EnvironmentConfig {
  API_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  RECAPTCHA_SITE_KEY: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] || fallback;
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

export const ENV: EnvironmentConfig = {
  API_URL: getEnvVar(
    'VITE_API_URL', 
    'https://api-natly.netlify.app'
  ),
  SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  RECAPTCHA_SITE_KEY: getEnvVar('VITE_RECAPTCHA_SITE_KEY'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validate on module load
if (ENV.isProduction) {
  console.log('✅ Environment validated');
}