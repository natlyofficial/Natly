// ═══════════════════════════════════════════════════════════════
// RATE LIMIT TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, cleanupOldEntries } from './rateLimit';

// ───────────────────────────────────────────────────────────────
// SETUP
// ───────────────────────────────────────────────────────────────

beforeEach(() => {
  // Clear rate limit map before each test
  // This ensures tests don't interfere with each other
  vi.clearAllMocks();
});

// ───────────────────────────────────────────────────────────────
// BASIC RATE LIMIT TESTS
// ───────────────────────────────────────────────────────────────

describe('checkRateLimit - Basic Functionality', () => {
  it('allows first request from new IP', () => {
    const result = checkRateLimit('192.168.1.1');
    expect(result).toBe(true);
  });

  it('allows up to 3 requests within limit', () => {
    const ip = '192.168.1.2';
    
    expect(checkRateLimit(ip)).toBe(true);  // Request 1
    expect(checkRateLimit(ip)).toBe(true);  // Request 2
    expect(checkRateLimit(ip)).toBe(true);  // Request 3
  });

  it('blocks 4th request from same IP', () => {
    const ip = '192.168.1.3';
    
    checkRateLimit(ip);  // Request 1
    checkRateLimit(ip);  // Request 2
    checkRateLimit(ip);  // Request 3
    
    const result = checkRateLimit(ip);  // Request 4 - should be blocked
    expect(result).toBe(false);
  });

  it('handles multiple different IPs independently', () => {
    const ip1 = '192.168.1.10';
    const ip2 = '192.168.1.20';
    const ip3 = '192.168.1.30';
    
    // Each IP gets 3 requests
    expect(checkRateLimit(ip1)).toBe(true);
    expect(checkRateLimit(ip2)).toBe(true);
    expect(checkRateLimit(ip3)).toBe(true);
    
    expect(checkRateLimit(ip1)).toBe(true);
    expect(checkRateLimit(ip2)).toBe(true);
    expect(checkRateLimit(ip3)).toBe(true);
    
    expect(checkRateLimit(ip1)).toBe(true);
    expect(checkRateLimit(ip2)).toBe(true);
    expect(checkRateLimit(ip3)).toBe(true);
    
    // 4th request blocked for each
    expect(checkRateLimit(ip1)).toBe(false);
    expect(checkRateLimit(ip2)).toBe(false);
    expect(checkRateLimit(ip3)).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────
// TIME WINDOW TESTS
// ───────────────────────────────────────────────────────────────

describe('checkRateLimit - Time Window', () => {
  it('resets limit after time window expires', () => {
    const ip = '192.168.1.100';
    
    // Mock Date.now() to control time
    const mockNow = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Use up limit
    checkRateLimit(ip);
    checkRateLimit(ip);
    checkRateLimit(ip);
    expect(checkRateLimit(ip)).toBe(false);  // Blocked
    
    // Move time forward 1 hour + 1 second
    const oneHourLater = mockNow + (60 * 60 * 1000) + 1000;
    vi.spyOn(Date, 'now').mockReturnValue(oneHourLater);
    
    // Should allow requests again
    expect(checkRateLimit(ip)).toBe(true);
  });

  it('keeps blocking if time window has not expired', () => {
    const ip = '192.168.1.101';
    
    const mockNow = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Use up limit
    checkRateLimit(ip);
    checkRateLimit(ip);
    checkRateLimit(ip);
    expect(checkRateLimit(ip)).toBe(false);
    
    // Move time forward 30 minutes (half the window)
    const thirtyMinLater = mockNow + (30 * 60 * 1000);
    vi.spyOn(Date, 'now').mockReturnValue(thirtyMinLater);
    
    // Still blocked
    expect(checkRateLimit(ip)).toBe(false);
  });

  it('allows partial reset as old timestamps expire', () => {
    const ip = '192.168.1.102';
    
    const mockNow = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // First request
    checkRateLimit(ip);
    
    // Move forward 1 hour + 1 second
    const oneHourLater = mockNow + (60 * 60 * 1000) + 1000;
    vi.spyOn(Date, 'now').mockReturnValue(oneHourLater);
    
    // Next 3 requests (first one expired, so we have room)
    expect(checkRateLimit(ip)).toBe(true);
    expect(checkRateLimit(ip)).toBe(true);
    expect(checkRateLimit(ip)).toBe(true);
    
    // 4th should be blocked
    expect(checkRateLimit(ip)).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────
// EDGE CASES
// ───────────────────────────────────────────────────────────────

describe('checkRateLimit - Edge Cases', () => {
  it('handles empty IP string', () => {
    const result = checkRateLimit('');
    expect(result).toBe(true);  // First request allowed
  });

  it('handles special IP addresses', () => {
    expect(checkRateLimit('127.0.0.1')).toBe(true);
    expect(checkRateLimit('::1')).toBe(true);
    expect(checkRateLimit('unknown')).toBe(true);
  });

  it('handles IPv6 addresses', () => {
    const ipv6 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    
    expect(checkRateLimit(ipv6)).toBe(true);
    expect(checkRateLimit(ipv6)).toBe(true);
    expect(checkRateLimit(ipv6)).toBe(true);
    expect(checkRateLimit(ipv6)).toBe(false);
  });

  it('treats similar IPs as different', () => {
    const ip1 = '192.168.1.1';
    const ip2 = '192.168.1.2';
    
    checkRateLimit(ip1);
    checkRateLimit(ip1);
    checkRateLimit(ip1);
    
    // ip1 is blocked, but ip2 should still work
    expect(checkRateLimit(ip1)).toBe(false);
    expect(checkRateLimit(ip2)).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// CLEANUP TESTS
// ───────────────────────────────────────────────────────────────

describe('cleanupOldEntries', () => {
  it('removes entries with no recent timestamps', () => {
    const ip = '192.168.1.200';
    
    const mockNow = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Create entry
    checkRateLimit(ip);
    
    // Move time forward past window
    const twoHoursLater = mockNow + (2 * 60 * 60 * 1000);
    vi.spyOn(Date, 'now').mockReturnValue(twoHoursLater);
    
    // Cleanup
    cleanupOldEntries();
    
    // Should be able to make requests again (entry was cleaned)
    expect(checkRateLimit(ip)).toBe(true);
    expect(checkRateLimit(ip)).toBe(true);
    expect(checkRateLimit(ip)).toBe(true);
  });

  it('keeps entries with recent timestamps', () => {
    const ip = '192.168.1.201';
    
    const mockNow = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Use up limit
    checkRateLimit(ip);
    checkRateLimit(ip);
    checkRateLimit(ip);
    
    // Move time forward slightly (10 minutes)
    const tenMinLater = mockNow + (10 * 60 * 1000);
    vi.spyOn(Date, 'now').mockReturnValue(tenMinLater);
    
    // Cleanup
    cleanupOldEntries();
    
    // Should still be blocked (entries not cleaned)
    expect(checkRateLimit(ip)).toBe(false);
  });

  it('handles cleanup with multiple IPs', () => {
    const oldIp = '192.168.1.250';
    const recentIp = '192.168.1.251';
    
    const mockNow = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Old IP makes requests
    checkRateLimit(oldIp);
    checkRateLimit(oldIp);
    checkRateLimit(oldIp);
    
    // Move time forward
    const twoHoursLater = mockNow + (2 * 60 * 60 * 1000);
    vi.spyOn(Date, 'now').mockReturnValue(twoHoursLater);
    
    // Recent IP makes requests
    checkRateLimit(recentIp);
    checkRateLimit(recentIp);
    
    // Cleanup
    cleanupOldEntries();
    
    // Old IP should be cleaned (can make new requests)
    expect(checkRateLimit(oldIp)).toBe(true);
    
    // Recent IP should still be tracked (only 1 more request allowed)
    expect(checkRateLimit(recentIp)).toBe(true);
    expect(checkRateLimit(recentIp)).toBe(false);  // 4th request blocked
  });
});

// ───────────────────────────────────────────────────────────────
// INTEGRATION / STRESS TESTS
// ───────────────────────────────────────────────────────────────

describe('Rate Limit Integration', () => {
  it('simulates realistic usage pattern', () => {
    const ip = '192.168.1.300';
    
    // User makes 2 requests quickly
    expect(checkRateLimit(ip)).toBe(true);
    expect(checkRateLimit(ip)).toBe(true);
    
    // Wait and make another
    expect(checkRateLimit(ip)).toBe(true);
    
    // Try to spam (blocked)
    expect(checkRateLimit(ip)).toBe(false);
    expect(checkRateLimit(ip)).toBe(false);
    expect(checkRateLimit(ip)).toBe(false);
  });

  it('handles high volume of different IPs', () => {
    const ips = Array.from({ length: 100 }, (_, i) => `192.168.2.${i}`);
    
    // Each IP should get 3 requests
    ips.forEach(ip => {
      expect(checkRateLimit(ip)).toBe(true);
      expect(checkRateLimit(ip)).toBe(true);
      expect(checkRateLimit(ip)).toBe(true);
      expect(checkRateLimit(ip)).toBe(false);
    });
  });
});