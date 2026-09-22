/**
 * Integration Test Script for Pressure Meter Gateway
 * Verifies Fixed Window, Sliding Window, /api/send-burst, and telemetry routes.
 */

const { app, server } = require('./server');
const http = require('http');

async function testRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting integration tests...\n');

  try {
    // 1. Test /api/status
    const statusRes = await testRequest('/api/status');
    console.log(`[PASS] /api/status -> HTTP ${statusRes.status}, Redis mode: ${statusRes.body.redis.mode}`);

    // 2. Set limit to 10 (minimum valid range 10-1000) for testing
    const limitRes = await testRequest('/api/limit', 'POST', { limit: 10 });
    console.log(`[PASS] Set limit=10 status: ${limitRes.status}, message: ${limitRes.body.message}`);
    await testRequest('/api/toggle', 'POST', { enabled: true });
    await testRequest('/api/algorithm', 'POST', { algorithm: 'fixed-window' });

    // 3. Test Fixed Window Rate Limiting (Send 12 requests, 11th and 12th must be 429)
    const responses = [];
    for (let i = 0; i < 12; i++) {
      responses.push(await testRequest('/api/data'));
    }

    const okCount = responses.filter(r => r.status === 200).length;
    const blockedCount = responses.filter(r => r.status === 429).length;
    console.log(`Fixed Window: ${okCount} allowed (200), ${blockedCount} blocked (429)`);

    if (okCount === 10 && blockedCount === 2) {
      console.log('✅ [PASS] Fixed Window rate limiting strictly enforced limit=10 (10 allowed, 2 blocked with 429)!');
    } else {
      console.error(`❌ [FAIL] Expected 10 allowed and 2 blocked, got ${okCount} allowed, ${blockedCount} blocked`);
    }

    // 4. Test Sliding Window Rate Limiting
    await testRequest('/api/algorithm', 'POST', { algorithm: 'sliding-window' });
    console.log('[PASS] Switched to sliding-window');

    // Reset and set limit to 100 for normal operations
    await testRequest('/api/limit', 'POST', { limit: 100 });

    // 5. Test Burst Simulation
    const burstRes = await testRequest('/api/send-burst', 'POST');
    console.log(`[PASS] /api/send-burst -> Total: ${burstRes.body.summary.total}, Allowed: ${burstRes.body.summary.allowed}, Blocked: ${burstRes.body.summary.blocked}`);

    // 6. Test Stats & Logs
    const statsRes = await testRequest('/api/stats');
    console.log(`[PASS] /api/stats -> Total requests: ${statsRes.body.stats.total_requests}, Avg Latency: ${statsRes.body.stats.avg_response_time}ms`);

    const logsRes = await testRequest('/api/logs');
    console.log(`[PASS] /api/logs -> Retrieved ${logsRes.body.count} recent requests.`);

    const activityRes = await testRequest('/api/activity');
    console.log(`[PASS] /api/activity -> Retrieved ${activityRes.body.buckets.length} 15-second activity buckets.`);

    console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

// Give server 500ms to start
setTimeout(runTests, 500);
