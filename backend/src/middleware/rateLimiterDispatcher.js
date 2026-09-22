/**
 * Rate Limiter Dispatcher Middleware
 * Centrally coordinates rate limiting status (ON/OFF), active algorithm, and limit configuration.
 */

const { redisClient } = require('../config/redisClient');
const { fixedWindowRateLimiter } = require('./fixedWindow');
const { slidingWindowRateLimiter } = require('./slidingWindow');

const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_LIMIT || '100', 10);
const DEFAULT_ALGORITHM = process.env.DEFAULT_ALGORITHM || 'fixed-window';
const WINDOW_SECONDS = parseInt(process.env.WINDOW_SIZE_SECONDS || '60', 10);

async function getConfig() {
  try {
    const [enabledVal, algoVal, limitVal] = await Promise.all([
      redisClient.get('ratelimit:config:enabled'),
      redisClient.get('ratelimit:config:algorithm'),
      redisClient.get('ratelimit:config:limit')
    ]);

    return {
      enabled: enabledVal !== null ? enabledVal === 'true' : true,
      algorithm: algoVal || DEFAULT_ALGORITHM,
      limit: limitVal !== null ? parseInt(limitVal, 10) : DEFAULT_LIMIT,
      windowSeconds: WINDOW_SECONDS
    };
  } catch (err) {
    return {
      enabled: true,
      algorithm: DEFAULT_ALGORITHM,
      limit: DEFAULT_LIMIT,
      windowSeconds: WINDOW_SECONDS
    };
  }
}

async function rateLimiterDispatcher(req, res, next) {
  const config = await getConfig();

  // If rate limiting is turned OFF globally
  if (!config.enabled) {
    res.setHeader('X-RateLimit-Status', 'DISABLED');
    return next();
  }

  res.setHeader('X-RateLimit-Status', 'ENABLED');
  res.setHeader('X-RateLimit-Algorithm', config.algorithm);

  if (config.algorithm === 'sliding-window') {
    return slidingWindowRateLimiter(req, res, next, config.limit, config.windowSeconds);
  }

  // Default: Fixed Window
  return fixedWindowRateLimiter(req, res, next, config.limit, config.windowSeconds);
}

module.exports = {
  rateLimiterDispatcher,
  getConfig
};
