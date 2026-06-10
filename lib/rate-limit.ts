/**
 * rate-limit.ts — Simple in-memory rate limiter for login protection.
 * Limits to MAX_ATTEMPTS failed attempts per IP per WINDOW_MS duration.
 * Note: Works for single-instance deployment. For multi-instance, use Redis (Upstash).
 */

const MAX_ATTEMPTS = 5;       // max failed attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
}

// In-memory store — cleared on server restart
const store = new Map<string, RateLimitEntry>();

/**
 * Check if the given key (IP address or email) is rate-limited.
 * @returns { limited: boolean, remaining: number, resetInMs: number }
 */
export function checkRateLimit(key: string): {
  limited: boolean;
  remaining: number;
  resetInMs: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    return { limited: false, remaining: MAX_ATTEMPTS - 1, resetInMs: 0 };
  }

  const elapsed = now - entry.firstAttemptAt;

  // Window expired — reset
  if (elapsed > WINDOW_MS) {
    store.delete(key);
    return { limited: false, remaining: MAX_ATTEMPTS - 1, resetInMs: 0 };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
  const resetInMs = WINDOW_MS - elapsed;

  if (entry.count >= MAX_ATTEMPTS) {
    return { limited: true, remaining: 0, resetInMs };
  }

  return { limited: false, remaining, resetInMs };
}

/**
 * Record a failed login attempt for the given key.
 */
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttemptAt: now });
  } else {
    entry.count += 1;
    store.set(key, entry);
  }
}

/**
 * Clear the rate limit record on successful login.
 */
export function clearRateLimit(key: string): void {
  store.delete(key);
}
