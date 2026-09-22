/**
 * Control Routes
 * Manages rate limiter dynamic configuration, algorithm switching, and burst traffic simulation.
 */

const express = require('express');
const router = express.Router();
const { redisClient } = require('../config/redisClient');
const { getConfig } = require('../middleware/rateLimiterDispatcher');
const { recordRequestMetric, resolveClientIp } = require('../utils/requestLogger');

// POST /api/toggle - Turns rate limiting ON/OFF
router.post('/toggle', async (req, res) => {
  try {
    let newStatus;
    if (typeof req.body?.enabled === 'boolean') {
      newStatus = req.body.enabled;
    } else {
      const current = await getConfig();
      newStatus = !current.enabled;
    }

    await redisClient.set('ratelimit:config:enabled', newStatus ? 'true' : 'false');

    return res.status(200).json({
      success: true,
      enabled: newStatus,
      message: `Rate limiting has been turned ${newStatus ? 'ON' : 'OFF'}.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/algorithm - Switches between fixed-window and sliding-window
router.post('/algorithm', async (req, res) => {
  const { algorithm } = req.body || {};
  const validAlgorithms = ['fixed-window', 'sliding-window'];

  if (!algorithm || !validAlgorithms.includes(algorithm)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid algorithm',
      message: `Algorithm must be one of: ${validAlgorithms.join(', ')}`
    });
  }

  try {
    await redisClient.set('ratelimit:config:algorithm', algorithm);

    return res.status(200).json({
      success: true,
      algorithm,
      message: `Algorithm switched to ${algorithm}.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/limit - Configures request limit (10 - 1000)
router.post('/limit', async (req, res) => {
  const limit = parseInt(req.body?.limit, 10);

  if (isNaN(limit) || limit < 10 || limit > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Invalid limit',
      message: 'Request limit must be an integer between 10 and 1,000 requests per minute.'
    });
  }

  try {
    await redisClient.set('ratelimit:config:limit', String(limit));

    return res.status(200).json({
      success: true,
      limit,
      message: `Request limit updated to ${limit} req/min.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/send-burst - Fires 20 requests server-side against dummy routes to simulate a burst
router.post('/send-burst', async (req, res) => {
  const callerIp = resolveClientIp(req);
  const totalRequests = 20;
  const config = await getConfig();
  const endpoints = ['/api/data', '/api/login', '/api/upload', '/api/profile'];
  const methods = ['GET', 'POST', 'POST', 'GET'];

  const results = [];
  const burstStartTime = Date.now();

  // Simulated client IP pool (mostly caller's IP, with realistic subnet variations)
  const ipPool = [
    callerIp,
    callerIp,
    callerIp,
    callerIp,
    '192.168.1.4',
    '192.168.1.8',
    '192.168.1.12',
    '192.168.1.6',
    '192.168.1.3'
  ];

  // Execute 20 simulated requests through the rate limiter logic
  for (let i = 0; i < totalRequests; i++) {
    const endpointIndex = i % endpoints.length;
    const endpoint = endpoints[endpointIndex];
    const method = methods[endpointIndex];
    const clientIp = (i < 12) ? callerIp : ipPool[i % ipPool.length];
    const latency = Math.floor(Math.random() * 25) + 8; // 8 - 33ms realistic latency

    let isBlocked = false;
    let statusCode = 200;

    if (config.enabled) {
      if (config.algorithm === 'fixed-window') {
        const windowMs = config.windowSeconds * 1000;
        const currentWindowIndex = Math.floor(Date.now() / windowMs);
        const windowKey = `ratelimit:fixed:${clientIp}:${currentWindowIndex}`;
        const count = await redisClient.incr(windowKey);
        if (count === 1) {
          await redisClient.expire(windowKey, config.windowSeconds + 5);
        }
        if (count > config.limit) {
          isBlocked = true;
          statusCode = 429;
        }
      } else {
        // Sliding Window
        const now = Date.now();
        const windowMs = config.windowSeconds * 1000;
        const key = `ratelimit:sliding:${clientIp}`;
        await redisClient.zremrangebyscore(key, 0, now - windowMs);
        const count = await redisClient.zcard(key);
        if (count >= config.limit) {
          isBlocked = true;
          statusCode = 429;
        } else {
          await redisClient.zadd(key, now, `${now}:${i}-${Math.random().toString(36).substring(2, 6)}`);
          await redisClient.expire(key, config.windowSeconds + 10);
        }
      }
    }

    // Record each request into the live metrics & logs
    await recordRequestMetric({
      req: { method, url: endpoint },
      status: statusCode,
      latencyMs: latency,
      blocked: isBlocked,
      endpointOverride: endpoint,
      ipOverride: clientIp
    });

    results.push({
      requestIndex: i + 1,
      method,
      endpoint,
      status: statusCode,
      ip: clientIp,
      latencyMs: latency
    });
  }

  const allowedCount = results.filter(r => r.status === 200).length;
  const blockedCount = results.filter(r => r.status === 429).length;

  return res.status(200).json({
    success: true,
    message: `Burst of ${totalRequests} requests executed in ${Date.now() - burstStartTime}ms.`,
    summary: {
      total: totalRequests,
      allowed: allowedCount,
      blocked: blockedCount,
      rateLimiterActive: config.enabled,
      algorithm: config.algorithm,
      limit: config.limit
    },
    results
  });
});

// POST /api/reset - Clears demo logs and counters
router.post('/reset', async (req, res) => {
  try {
    await Promise.all([
      redisClient.del('ratelimit:logs'),
      redisClient.del('ratelimit:stats:total'),
      redisClient.del('ratelimit:stats:blocked'),
      redisClient.del('ratelimit:stats:success'),
      redisClient.del('ratelimit:stats:latency_sum'),
      redisClient.del('ratelimit:active_buckets')
    ]);

    return res.status(200).json({
      success: true,
      message: 'Telemetry metrics and logs successfully reset.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
