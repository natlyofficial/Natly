// ═══════════════════════════════════════════════════════════════
// TOKEN GENERATION TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';
import { generateDbToken, generateJWT, verifyJWT } from './tokenGen';

// ───────────────────────────────────────────────────────────────
// SETUP
// ───────────────────────────────────────────────────────────────

beforeEach(() => {
  // Mock JWT_SECRET for tests
  process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
});

// ───────────────────────────────────────────────────────────────
// DB TOKEN GENERATION TESTS
// ───────────────────────────────────────────────────────────────

describe('generateDbToken', () => {
  it('generates a 32-character hexadecimal token', () => {
    const token = generateDbToken();
    
    expect(token).toBeDefined();
    expect(token.length).toBe(32);
    expect(token).toMatch(/^[a-f0-9]{32}$/);
  });

  it('generates unique tokens on each call', () => {
    const token1 = generateDbToken();
    const token2 = generateDbToken();
    const token3 = generateDbToken();
    
    expect(token1).not.toBe(token2);
    expect(token2).not.toBe(token3);
    expect(token1).not.toBe(token3);
  });

  it('generates tokens suitable for CHAR(32) database column', () => {
    const token = generateDbToken();
    
    // After padding with spaces, should be exactly 32 chars
    const paddedToken = token.padEnd(32, ' ');
    expect(paddedToken.length).toBe(32);
  });
});

// ───────────────────────────────────────────────────────────────
// JWT GENERATION TESTS
// ───────────────────────────────────────────────────────────────

describe('generateJWT', () => {
  it('generates a valid JWT token', () => {
    const email = 'test@example.com';
    const dbToken = generateDbToken();
    const type = 'confirmation';

    const jwt = generateJWT(email, dbToken, type);

    expect(jwt).toBeDefined();
    expect(typeof jwt).toBe('string');
    expect(jwt.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('includes correct payload data', () => {
    const email = 'user@test.com';
    const dbToken = 'abc123';
    const type = 'confirmation';

    const jwt = generateJWT(email, dbToken, type);
    const decoded = verifyJWT(jwt);

    expect(decoded.email).toBe(email);
    expect(decoded.dbToken).toBe(dbToken);
    expect(decoded.type).toBe(type);
  });

  it('generates different tokens for different inputs', () => {
    const dbToken = generateDbToken();
    
    const jwt1 = generateJWT('user1@test.com', dbToken, 'confirmation');
    const jwt2 = generateJWT('user2@test.com', dbToken, 'confirmation');

    expect(jwt1).not.toBe(jwt2);
  });

  it('generates tokens for different types', () => {
    const email = 'test@example.com';
    const dbToken = generateDbToken();

    const confirmJwt = generateJWT(email, dbToken, 'confirmation');
    const unsubJwt = generateJWT(email, dbToken, 'unsubscribe');

    const confirmDecoded = verifyJWT(confirmJwt);
    const unsubDecoded = verifyJWT(unsubJwt);

    expect(confirmDecoded.type).toBe('confirmation');
    expect(unsubDecoded.type).toBe('unsubscribe');
  });

  it('throws error when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;

    expect(() => {
      generateJWT('test@example.com', 'token123', 'confirmation');
    }).toThrow('JWT_SECRET not configured');
  });
});

// ───────────────────────────────────────────────────────────────
// JWT VERIFICATION TESTS
// ───────────────────────────────────────────────────────────────

describe('verifyJWT', () => {
  it('successfully verifies valid JWT', () => {
    const email = 'test@example.com';
    const dbToken = generateDbToken();
    const type = 'confirmation';

    const jwt = generateJWT(email, dbToken, type);
    const decoded = verifyJWT(jwt);

    expect(decoded).toBeDefined();
    expect(decoded.email).toBe(email);
    expect(decoded.dbToken).toBe(dbToken);
    expect(decoded.type).toBe(type);
  });

  it('throws error for invalid JWT', () => {
    const invalidJwt = 'invalid.jwt.token';

    expect(() => {
      verifyJWT(invalidJwt);
    }).toThrow();
  });

  it('throws error for tampered JWT', () => {
    const jwt = generateJWT('test@example.com', 'token123', 'confirmation');
    const tamperedJwt = jwt.slice(0, -5) + 'XXXXX'; // Tamper with signature

    expect(() => {
      verifyJWT(tamperedJwt);
    }).toThrow();
  });

  it('throws error when JWT_SECRET is missing', () => {
    const jwt = generateJWT('test@example.com', 'token123', 'confirmation');
    
    delete process.env.JWT_SECRET;

    expect(() => {
      verifyJWT(jwt);
    }).toThrow('JWT_SECRET not configured');
  });

  it('verifies JWT created with same secret', () => {
    const email = 'verify@test.com';
    const dbToken = 'testtoken';
    const type = 'unsubscribe';

    const jwt = generateJWT(email, dbToken, type);
    
    // Verify immediately (no expiration issue)
    const decoded = verifyJWT(jwt);
    
    expect(decoded.email).toBe(email);
    expect(decoded.dbToken).toBe(dbToken);
    expect(decoded.type).toBe(type);
  });
});

// ───────────────────────────────────────────────────────────────
// INTEGRATION TESTS
// ───────────────────────────────────────────────────────────────

describe('Token Generation Integration', () => {
  it('complete flow: generate DB token → create JWT → verify JWT', () => {
    const email = 'integration@test.com';
    const dbToken = generateDbToken();
    const type = 'confirmation';

    // Step 1: Generate JWT
    const jwt = generateJWT(email, dbToken, type);
    expect(jwt).toBeDefined();

    // Step 2: Verify JWT
    const decoded = verifyJWT(jwt);
    expect(decoded.email).toBe(email);
    expect(decoded.dbToken).toBe(dbToken);
    expect(decoded.type).toBe(type);

    // Step 3: DB token should be valid for CHAR(32)
    const paddedDbToken = dbToken.padEnd(32, ' ');
    expect(paddedDbToken.length).toBe(32);
  });

  it('handles full newsletter subscription flow tokens', () => {
    const email = 'subscriber@natly.org';
    
    // Generate tokens as in production
    const confirmationToken = generateDbToken();
    const unsubscribeToken = generateDbToken();
    
    const confirmJwt = generateJWT(email, confirmationToken, 'confirmation');
    const unsubJwt = generateJWT(email, unsubscribeToken, 'unsubscribe');

    // Verify both tokens work independently
    const confirmDecoded = verifyJWT(confirmJwt);
    const unsubDecoded = verifyJWT(unsubJwt);

    expect(confirmDecoded.email).toBe(email);
    expect(confirmDecoded.type).toBe('confirmation');
    
    expect(unsubDecoded.email).toBe(email);
    expect(unsubDecoded.type).toBe('unsubscribe');
    
    // Tokens should be different
    expect(confirmationToken).not.toBe(unsubscribeToken);
    expect(confirmJwt).not.toBe(unsubJwt);
  });
});