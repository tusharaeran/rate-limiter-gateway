/**
 * Redis Client Configuration & Resilient Fallback Engine
 * Provides transparent failover between live Redis (ioredis) and an in-memory Redis mirror.
 */

const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

class MemoryRedisStore {
  constructor() {
    this.strings = new Map();
    this.sortedSets = new Map(); // key -> Array<{ score: number, member: string }>
    this.lists = new Map();      // key -> Array<string>
    this.hashes = new Map();     // key -> Map<field, value>
    this.ttls = new Map();       // key -> expireAtMs
  }

  _isExpired(key) {
    const expireAt = this.ttls.get(key);
    if (expireAt && Date.now() > expireAt) {
      this.strings.delete(key);
      this.sortedSets.delete(key);
      this.lists.delete(key);
      this.hashes.delete(key);
      this.ttls.delete(key);
      return true;
    }
    return false;
  }

  async get(key) {
    if (this._isExpired(key)) return null;
    return this.strings.has(key) ? String(this.strings.get(key)) : null;
  }

  async set(key, value) {
    this.strings.set(key, String(value));
    return 'OK';
  }

  async incr(key) {
    return this.incrby(key, 1);
  }

  async incrby(key, increment) {
    if (this._isExpired(key)) {
      this.strings.delete(key);
    }
    const current = parseInt(this.strings.get(key) || '0', 10);
    const next = current + parseInt(increment, 10);
    this.strings.set(key, String(next));
    return next;
  }

  async expire(key, seconds) {
    this.ttls.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  async ttl(key) {
    const expireAt = this.ttls.get(key);
    if (!expireAt) return -1;
    const remaining = Math.ceil((expireAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async zadd(key, score, member) {
    if (this._isExpired(key)) {
      this.sortedSets.delete(key);
    }
    let list = this.sortedSets.get(key);
    if (!list) {
      list = [];
      this.sortedSets.set(key, list);
    }
    const numScore = parseFloat(score);
    // Remove if member already exists
    const existingIndex = list.findIndex(item => item.member === member);
    if (existingIndex !== -1) {
      list.splice(existingIndex, 1);
    }
    list.push({ score: numScore, member: String(member) });
    list.sort((a, b) => a.score - b.score);
    return 1;
  }

  async zremrangebyscore(key, min, max) {
    if (this._isExpired(key)) return 0;
    const list = this.sortedSets.get(key);
    if (!list) return 0;
    const minVal = min === '-inf' ? -Infinity : parseFloat(min);
    const maxVal = max === '+inf' ? Infinity : parseFloat(max);
    const initialLength = list.length;
    const filtered = list.filter(item => item.score < minVal || item.score > maxVal);
    this.sortedSets.set(key, filtered);
    return initialLength - filtered.length;
  }

  async zcard(key) {
    if (this._isExpired(key)) return 0;
    const list = this.sortedSets.get(key);
    return list ? list.length : 0;
  }

  async zrangebyscore(key, min, max) {
    if (this._isExpired(key)) return [];
    const list = this.sortedSets.get(key);
    if (!list) return [];
    const minVal = min === '-inf' ? -Infinity : parseFloat(min);
    const maxVal = max === '+inf' ? Infinity : parseFloat(max);
    return list
      .filter(item => item.score >= minVal && item.score <= maxVal)
      .map(item => item.member);
  }

  async lpush(key, ...values) {
    if (this._isExpired(key)) {
      this.lists.delete(key);
    }
    let list = this.lists.get(key);
    if (!list) {
      list = [];
      this.lists.set(key, list);
    }
    for (const val of values) {
      list.unshift(String(val));
    }
    return list.length;
  }

  async ltrim(key, start, stop) {
    const list = this.lists.get(key);
    if (!list) return 'OK';
    const s = start < 0 ? Math.max(0, list.length + start) : start;
    const e = stop < 0 ? Math.max(0, list.length + stop) : stop;
    const trimmed = list.slice(s, e + 1);
    this.lists.set(key, trimmed);
    return 'OK';
  }

  async lrange(key, start, stop) {
    if (this._isExpired(key)) return [];
    const list = this.lists.get(key);
    if (!list) return [];
    const s = start < 0 ? Math.max(0, list.length + start) : start;
    const e = stop < 0 ? list.length - 1 : Math.min(list.length - 1, stop);
    if (s > e) return [];
    return list.slice(s, e + 1);
  }

  async hincrby(key, field, increment) {
    if (this._isExpired(key)) {
      this.hashes.delete(key);
    }
    let hash = this.hashes.get(key);
    if (!hash) {
      hash = new Map();
      this.hashes.set(key, hash);
    }
    const current = parseInt(hash.get(field) || '0', 10);
    const next = current + parseInt(increment, 10);
    hash.set(field, String(next));
    return next;
  }

  async hgetall(key) {
    if (this._isExpired(key)) return {};
    const hash = this.hashes.get(key);
    if (!hash) return {};
    const result = {};
    for (const [k, v] of hash.entries()) {
      result[k] = v;
    }
    return result;
  }

  async del(key) {
    this.strings.delete(key);
    this.sortedSets.delete(key);
    this.lists.delete(key);
    this.hashes.delete(key);
    this.ttls.delete(key);
    return 1;
  }

  async ping() {
    return 'PONG';
  }

  async flushall() {
    this.strings.clear();
    this.sortedSets.clear();
    this.lists.clear();
    this.hashes.clear();
    this.ttls.clear();
    return 'OK';
  }
}

// In-Memory fallback instance
const memoryStore = new MemoryRedisStore();

// Live Redis Client
let liveClient = null;
let isConnected = false;
let connectionAttempted = false;

try {
  liveClient = new Redis(REDIS_URL, {
    lazyConnect: true,
    connectTimeout: 2000,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop reconnect spam if offline
      }
      return Math.min(times * 1000, 3000);
    },
    enableOfflineQueue: false,
  });

  liveClient.on('connect', () => {
    isConnected = true;
    console.log(`[Redis] Connected successfully to ${REDIS_URL.replace(/:[^:]*@/, ':****@')}`);
  });

  liveClient.on('ready', () => {
    isConnected = true;
  });

  liveClient.on('error', (err) => {
    if (isConnected) {
      console.warn(`[Redis] Connection lost: ${err.message}. Engaging in-memory fallback.`);
    }
    isConnected = false;
  });

  liveClient.on('close', () => {
    isConnected = false;
  });

  // Attempt initial connect asynchronously
  liveClient.connect().catch((err) => {
    connectionAttempted = true;
    isConnected = false;
    console.log(`[Redis] Live instance unreachable (${err.message}). Using in-memory Redis fallback engine.`);
  });
} catch (err) {
  console.warn(`[Redis] Could not initialize ioredis: ${err.message}. Using in-memory fallback.`);
  isConnected = false;
}

// Unified Proxy Client
const redisClient = new Proxy({}, {
  get(target, prop) {
    // Methods routing
    if (isConnected && liveClient && typeof liveClient[prop] === 'function') {
      return async (...args) => {
        try {
          return await liveClient[prop](...args);
        } catch (err) {
          console.warn(`[Redis Proxy] Live client error during '${String(prop)}': ${err.message}. Falling back to memory.`);
          isConnected = false;
          if (typeof memoryStore[prop] === 'function') {
            return await memoryStore[prop](...args);
          }
          throw err;
        }
      };
    }

    if (typeof memoryStore[prop] === 'function') {
      return async (...args) => {
        return await memoryStore[prop](...args);
      };
    }

    return undefined;
  }
});

async function getHealthStatus() {
  const start = Date.now();
  let latencyMs = 0;
  let status = 'LOCAL_FALLBACK';

  try {
    if (isConnected && liveClient) {
      await liveClient.ping();
      latencyMs = Date.now() - start;
      status = 'CONNECTED';
    } else {
      await memoryStore.ping();
      latencyMs = Math.max(1, Date.now() - start);
      status = 'LOCAL_FALLBACK';
    }
  } catch (err) {
    status = 'DISCONNECTED';
  }

  return {
    status,
    isConnected,
    latencyMs,
    mode: isConnected ? 'Remote/Local Redis' : 'In-Memory Mirror Fallback'
  };
}

module.exports = {
  redisClient,
  getHealthStatus,
  memoryStore
};
