/**
 * Fixed Window Counter Rate Limiting Algorithm
 * Uses Redis INCR + EXPIRE on discrete time-bucketed keys.
 */

const { redisClient } = require('../config/redisClient');
const { resolveClientIp } = require('../utils/requestLogger');

async function fixedWindowRateLimiter(req, res, next, configuredLimit = 100, windowSeconds = 60) {
  const ip = resolveClientIp(req);
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const currentWindowIndex = Math.floor(now / windowMs);
  const windowKey = `ratelimit:fixed:${ip}:${currentWindowIndex}`;
  const windowEndTimestamp = (currentWindowIndex + 1) * windowMs;
  const secondsRemaining = Math.max(1, Math.ceil((windowEndTimestamp - now) / 1000));

  try {
    const currentCount = await redisClient.incr(windowKey);

    // If key was just created, attach expiry with 5s grace period
    if (currentCount === 1) {
      await redisClient.expire(windowKey, windowSeconds + 5);
    }

    res.setHeader('X-RateLimit-Limit', configuredLimit);
    res.setHeader('X-RateLimit-Reset', Math.ceil(windowEndTimestamp / 1000));

    if (currentCount > configuredLimit) {
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('Retry-After', secondsRemaining);

      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: `Fixed Window rate limit exceeded (${configuredLimit} req/min). Try again in ${secondsRemaining}s.`,
        retryAfter: secondsRemaining,
        algorithm: 'fixed-window'
      });
    }

    const remaining = Math.max(0, configuredLimit - currentCount);
    res.setHeader('X-RateLimit-Remaining', remaining);
    next();
  } catch (err) {
    console.error('[FixedWindow] Error executing rate limit check:', err.message);
    // Fail-open for safety if an unexpected error occurs
    next();
  }
}

module.exports = {
  fixedWindowRateLimiter
};
