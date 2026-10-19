/**
 * Pressure Meter - API Gateway & Rate Limiter Server
 * Built with Express, Redis (ioredis), Helmet, and CORS.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { requestTrackingMiddleware } = require('./utils/requestLogger');
const { rateLimiterDispatcher } = require('./middleware/rateLimiterDispatcher');
const dummyRoutes = require('./routes/dummyRoutes');
const controlRoutes = require('./routes/controlRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Trust first reverse proxy (Render, Cloudflare, NGINX)
app.set('trust proxy', 1);

// 2. HTTP Security Headers (OWASP Compliance)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  frameguard: { action: 'deny' }, // Anti-clickjacking
  hidePoweredBy: true            // Remove X-Powered-By header
}));

// 3. CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, internal server requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Cross-Origin Request Blocked by CORS Security Policy.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-session-id', 'X-Session-ID', 'Accept']
}));

// 4. Request Body Parser with Payload Limit (Anti-Memory Exhaustion)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Real-Time Telemetry Tracking Middleware
app.use(requestTrackingMiddleware);

// 6. Root & Health route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Pressure Meter API Gateway',
    version: '1.0.0',
    status: 'OPERATIONAL',
    docs: '/api/status'
  });
});

// 7. Mount Unthrottled Telemetry & Control Routes
app.use('/api', metricsRoutes);
app.use('/api', controlRoutes);

// 8. Mount Protected Dummy Routes with Rate Limiter Dispatcher
app.use('/api', rateLimiterDispatcher, dummyRoutes);

// 9. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// 10. Centralized Error Handler (Masks stack traces in production)
app.use((err, req, res, next) => {
  console.error('[Gateway Error]', err);
  const isDev = NODE_ENV === 'development';

  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: isDev ? err.message : 'An unexpected security or processing error occurred.',
    ...(isDev && { stack: err.stack })
  });
});

// 11. Start Server
const server = app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Pressure Meter Gateway listening on port ${PORT}`);
  console.log(`🛡️  Environment: ${NODE_ENV}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/status`);
  console.log(`=================================================\n`);
});

module.exports = { app, server };
