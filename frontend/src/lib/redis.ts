import { Redis } from '@upstash/redis';

// Note: Ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set in .env.local
// For local PWA development without the env, we fallback dynamically to prevent crashes.

export const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

/**
 * Helper to gracefully fetch from cache or execute fallback
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  if (!redis) return fetchFn(); // Fallback if upstash isn't configured

  try {
    const cached = await redis.get<T>(key);
    if (cached) {
      console.log(`[Cache Hit] ${key}`);
      return cached;
    }
    
    console.log(`[Cache Miss] ${key} - Fetching Engine`);
    const data = await fetchFn();
    await redis.set(key, data, { ex: ttlSeconds });
    return data;
  } catch (error) {
    console.error("Redis fetch failed, falling back to DB", error);
    return fetchFn();
  }
}
