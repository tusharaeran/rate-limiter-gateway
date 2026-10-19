/**
 * Sliding Window Log Rate Limiting Algorithm
 * Uses Redis Sorted Sets (ZADD, ZREMRANGEBYSCORE, ZCARD) to maintain continuous rate control.
 */

const { v4: uuidv4 } = require('uuid');
const { redisClient } = require('../config/redisClient');
const { resolveClientIp } = require('../utils/requestLogger');

async function slidingWindowRateLimiter(req, res, next, configuredLimit = 10, windowSeconds = 60) {
  const ip = resolveClientIp(req);
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;
  const key = `ratelimit:sliding:${ip}`;

  try {
    // 1. Purge all timestamps older than (now - windowMs)
    await redisClient.zremrangebyscore(key, 0, windowStart);

    // 2. Count remaining timestamps in current sliding window
    const currentCount = await redisClient.zcard(key);

    res.setHeader('X-RateLimit-Limit', configuredLimit);

    if (currentCount >= configuredLimit) {
      // Find oldest timestamp in current window to calculate precise retry-after
      const oldestEntries = await redisClient.zrangebyscore(key, windowStart, '+inf');
      let retryAfter = 1;
      if (oldestEntries && oldestEntries.length > 0) {
        const oldestParts = oldestEntries[0].split(':');
        const oldestTs = parseInt(oldestParts[0], 10);
        if (!isNaN(oldestTs)) {
          const expiresAt = oldestTs + windowMs;
          retryAfter = Math.max(1, Math.ceil((expiresAt - now) / 1000));
        }
      }

      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + retryAfter * 1000) / 1000));

      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: `Sliding Window rate limit exceeded (${configuredLimit} req/min). Try again in ${retryAfter}s.`,
        retryAfter,
        algorithm: 'sliding-window'
      });
    }

    // 3. Request is allowed - add current timestamp to sorted set
    const memberId = `${now}:${uuidv4().substring(0, 8)}`;
    await redisClient.zadd(key, now, memberId);
    await redisClient.expire(key, windowSeconds + 10);

    const remaining = Math.max(0, configuredLimit - (currentCount + 1));
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    next();
  } catch (err) {
    console.error('[SlidingWindow] Error executing rate limit check:', err.message);
    next();
  }
}

module.exports = {
  slidingWindowRateLimiter
};
