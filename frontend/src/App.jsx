import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import HeroAndStatus from './components/HeroAndStatus';
import ComparisonPanels from './components/ComparisonPanels';
import ControlBar from './components/ControlBar';
import StatCards from './components/StatCards';
import DashboardPanels from './components/DashboardPanels';
import Footer from './components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activityBuckets, setActivityBuckets] = useState([]);

  // Controls state
  const [rateLimitingEnabled, setRateLimitingEnabled] = useState(true);
  const [algorithm, setAlgorithm] = useState('fixed-window');
  const [limit, setLimit] = useState(100);
  const [isBursting, setIsBursting] = useState(false);

  // Fetch all live dashboard telemetry
  const fetchDashboardData = useCallback(async () => {
    try {
      const [statusRes, statsRes, logsRes, activityRes] = await Promise.all([
        fetch(`${API_BASE}/api/status`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/api/stats`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/api/logs`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/api/activity`).then(r => r.ok ? r.json() : null)
      ]);

      if (statusRes?.success) {
        setSystemStatus(statusRes);
        if (statusRes.config) {
          setRateLimitingEnabled(statusRes.config.enabled);
          setAlgorithm(statusRes.config.algorithm);
          setLimit(statusRes.config.limit);
        }
      }

      if (statsRes?.success) {
        setStats(statsRes.stats);
      }

      if (logsRes?.success) {
        setLogs(logsRes.logs);
      }

      if (activityRes?.success) {
        setActivityBuckets(activityRes.buckets);
      }
    } catch (err) {
      console.warn('[Dashboard] Error polling live data:', err.message);
    }
  }, []);

  // Poll every 2.5 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 2500);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Handlers for interactive controls
  const handleToggleRateLimiting = async () => {
    const nextState = !rateLimitingEnabled;
    setRateLimitingEnabled(nextState); // Optimistic UI update

    try {
      const res = await fetch(`${API_BASE}/api/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to toggle rate limiting:', err);
    }
  };

  const handleChangeAlgorithm = async (newAlgo) => {
    if (newAlgo === algorithm) return;
    setAlgorithm(newAlgo); // Optimistic

    try {
      const res = await fetch(`${API_BASE}/api/algorithm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: newAlgo })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to change algorithm:', err);
    }
  };

  const handleChangeLimit = async (newLimit) => {
    setLimit(newLimit); // Optimistic

    try {
      await fetch(`${API_BASE}/api/limit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: newLimit })
      });
    } catch (err) {
      console.error('Failed to update limit:', err);
    }
  };

  const handleTriggerBurst = async () => {
    if (isBursting) return;
    setIsBursting(true);

    try {
      await fetch(`${API_BASE}/api/send-burst`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      // Immediately refresh telemetry
      await fetchDashboardData();
    } catch (err) {
      console.error('Burst failed:', err);
    } finally {
      setTimeout(() => setIsBursting(false), 600);
    }
  };

  return (
    <div className="terminal-window">
      {/* 1. Top Bar */}
      <TopBar
        onTriggerBurst={handleTriggerBurst}
        isBursting={isBursting}
      />

      {/* 2. Top Section: Hero/Status (Left) & Side-by-Side Comparison (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.05fr) minmax(480px, 2fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <HeroAndStatus systemStatus={systemStatus} />
        <ComparisonPanels />
      </div>

      {/* 3. Control Bar */}
      <ControlBar
        rateLimitingEnabled={rateLimitingEnabled}
        onToggleRateLimiting={handleToggleRateLimiting}
        algorithm={algorithm}
        onChangeAlgorithm={handleChangeAlgorithm}
        limit={limit}
        onChangeLimit={handleChangeLimit}
        onTriggerBurst={handleTriggerBurst}
        isBursting={isBursting}
      />

      {/* 4. Stat Cards (4 Cards in a Row) */}
      <StatCards stats={stats} />

      {/* 5. Operations Panels (Logs Table + 5-Min Stacked Activity Chart) */}
      <DashboardPanels
        logs={logs}
        activityBuckets={activityBuckets}
      />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
