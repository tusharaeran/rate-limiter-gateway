/**
 * Protected Dummy Routes
 * Simulated realistic application endpoints protected by the rate limiter.
 */

const express = require('express');
const router = express.Router();

// GET /api/data
router.get('/data', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Data successfully retrieved from protected gateway.',
    payload: {
      sensors: [
        { id: 'node-alpha', metric: 'temperature', value: 42.8, unit: 'C' },
        { id: 'node-beta', metric: 'pressure', value: 101.3, unit: 'kPa' },
        { id: 'node-gamma', metric: 'bandwidth', value: 850.4, unit: 'MB/s' }
      ],
      timestamp: new Date().toISOString()
    }
  });
});

// POST /api/login
router.post('/login', (req, res) => {
  const username = req.body?.username || 'developer';
  res.status(200).json({
    success: true,
    message: 'Authentication successful.',
    session: {
      user: username,
      role: 'admin',
      token: 'jwt_mock_' + Math.random().toString(36).substring(2, 12),
      expiresIn: 3600
    }
  });
});

// POST /api/upload
router.post('/upload', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Upload payload processed successfully.',
    receipt: {
      fileId: 'f_' + Math.random().toString(36).substring(2, 8),
      sizeBytes: Math.floor(Math.random() * 50000) + 1024,
      checksum: 'sha256_mock_' + Math.random().toString(36).substring(2, 10),
      status: 'VERIFIED'
    }
  });
});

// GET /api/profile
router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: 'usr_98124',
      name: 'Terminal Operator',
      tier: 'Pro',
      requestsQuota: 'Dynamic',
      created: '2026-01-15'
    }
  });
});

module.exports = router;
