// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // 3 requests per hour

// ───────────────────────────────────────────────────────────────
// IN-MEMORY STORE (resets on function cold start)
// ───────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, number[]>();

// ───────────────────────────────────────────────────────────────
// RATE LIMIT CHECK
// ───────────────────────────────────────────────────────────────

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside the window
  const recentTimestamps = timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  
  // Check if limit exceeded
  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false; // Rate limit exceeded
  }
  
  // Add current timestamp and update map
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  
  return true; // Within rate limit
}

// ───────────────────────────────────────────────────────────────
// CLEANUP (optional - for memory management)
// ───────────────────────────────────────────────────────────────

export function cleanupOldEntries(): void {
  const now = Date.now();
  
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recentTimestamps = timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW
    );
    
    if (recentTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recentTimestamps);
    }
  }
}