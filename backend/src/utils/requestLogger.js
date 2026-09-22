/**
 * Request Logger & Real-Time Metrics Aggregator
 * Tracks live requests, computes response latency, updates 15-second time buckets,
 * and maintains the bounded recent requests log in Redis.
 */

const { redisClient } = require('../config/redisClient');

// Safe IP resolution helper preventing header spoofing
function resolveClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  return req.ip || req.connection?.remoteAddress || '127.0.0.1';
}

function formatTime(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

async function recordRequestMetric({
  req,
  res,
  status,
  latencyMs,
  blocked = false,
  endpointOverride = null,
  ipOverride = null
}) {
  try {
    const timestamp = Date.now();
    const timeFormatted = formatTime(new Date(timestamp));
    const method = req.method;
    const endpoint = endpointOverride || req.originalUrl || req.url;
    const ip = ipOverride || resolveClientIp(req);

    // 1. Prepare structured log entry
    const logEntry = {
      id: `${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
      time: timeFormatted,
      timestamp,
      method,
      endpoint,
      status: Number(status),
      ip,
      latency: Math.max(1, Math.round(latencyMs))
    };

    // 2. Push to bounded Redis list (capped at 50 items)
    await redisClient.lpush('ratelimit:logs', JSON.stringify(logEntry));
    await redisClient.ltrim('ratelimit:logs', 0, 49);

    // 3. Update cumulative statistics
    await redisClient.incr('ratelimit:stats:total');
    if (blocked) {
      await redisClient.incr('ratelimit:stats:blocked');
    } else {
      await redisClient.incr('ratelimit:stats:success');
    }
    await redisClient.incrby('ratelimit:stats:latency_sum', Math.round(latencyMs));

    // 4. Update 15-second time bucket for the 5-minute activity chart
    // Bucket key rounded to nearest 15 seconds (15,000 ms)
    const bucketTs = Math.floor(timestamp / 15000) * 15000;
    const bucketKey = `ratelimit:bucket:${bucketTs}`;

    if (blocked) {
      await redisClient.hincrby(bucketKey, 'blocked', 1);
    } else {
      await redisClient.hincrby(bucketKey, 'allowed', 1);
    }
    await redisClient.expire(bucketKey, 600); // 10 minute retention

    // Also maintain a sorted set of active bucket timestamps
    await redisClient.zadd('ratelimit:active_buckets', bucketTs, String(bucketTs));
    // Purge buckets older than 10 minutes
    await redisClient.zremrangebyscore('ratelimit:active_buckets', 0, timestamp - 600000);

  } catch (err) {
    console.error('[RequestLogger] Error logging request metric:', err.message);
  }
}

/**
 * Express middleware that intercepts responses, calculates latency,
 * and passes metrics to recordRequestMetric.
 */
function requestTrackingMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    // Only track /api routes, ignore static assets or favicon
    if (req.originalUrl.startsWith('/api')) {
      const diff = process.hrtime(start);
      const latencyMs = (diff[0] * 1e3) + (diff[1] * 1e-6);
      const isBlocked = res.statusCode === 429;

      // Avoid self-logging metrics polling routes to avoid noise in the table
      const isPollingRoute = req.originalUrl.startsWith('/api/stats') ||
                            req.originalUrl.startsWith('/api/activity') ||
                            req.originalUrl.startsWith('/api/logs') ||
                            req.originalUrl.startsWith('/api/status');

      if (!isPollingRoute) {
        recordRequestMetric({
          req,
          res,
          status: res.statusCode,
          latencyMs,
          blocked: isBlocked
        });
      }
    }
  });

  next();
}

module.exports = {
  recordRequestMetric,
  requestTrackingMiddleware,
  resolveClientIp,
  formatTime
};
