import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; resetIn: number }> {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore) {
      if (now > v.resetTime) rateLimitStore.delete(k);
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { success: true, remaining: config.maxAttempts - 1, resetIn: config.windowMs };
  }

  entry.count++;

  if (entry.count > config.maxAttempts) {
    const resetIn = entry.resetTime - now;
    return { success: false, remaining: 0, resetIn };
  }

  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetIn: entry.resetTime - now,
  };
}
