import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import HeroAndStatus from './components/HeroAndStatus';
import ComparisonPanels from './components/ComparisonPanels';
import ControlBar from './components/ControlBar';
import StatCards from './components/StatCards';
import DashboardPanels from './components/DashboardPanels';
import Footer from './components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Generates an isolated session token so concurrent recruiters never block each other
const getSessionId = () => {
  let sid = sessionStorage.getItem('rate_limiter_session_id');
  if (!sid) {
    sid = 'recruiter-' + Math.random().toString(36).substring(2, 7);
    sessionStorage.setItem('rate_limiter_session_id', sid);
  }
  return sid;
};

export default function App() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activityBuckets, setActivityBuckets] = useState([]);

  // Controls state
  const [rateLimitingEnabled, setRateLimitingEnabled] = useState(true);
  const [algorithm, setAlgorithm] = useState('fixed-window');
  const [limit, setLimit] = useState(10);
  const [isBursting, setIsBursting] = useState(false);
  const [lastBurstSummary, setLastBurstSummary] = useState(null);

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
      const sid = getSessionId();
      const res = await fetch(`${API_BASE}/api/send-burst`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: sid })
      });
      const data = await res.json();
      if (data?.success && data?.summary) {
        setLastBurstSummary(data.summary);
      }
      // Immediately refresh telemetry
      await fetchDashboardData();
    } catch (err) {
      console.error('Burst failed:', err);
    } finally {
      setTimeout(() => setIsBursting(false), 500);
    }
  };

  const handleResetDemo = async () => {
    try {
      await fetch(`${API_BASE}/api/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setLastBurstSummary(null);
      await fetchDashboardData();
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  return (
    <div className="living-flow-container">
      {/* Living Flow Ambient Drifting Orbs */}
      <div className="living-orb orb-1" />
      <div className="living-orb orb-2" />
      <div className="living-orb orb-3" />
      <div className="living-orb orb-4" />

      <div className="terminal-window">
        {/* 1. Top Bar */}
        <TopBar
          onTriggerBurst={handleTriggerBurst}
          isBursting={isBursting}
          onResetDemo={handleResetDemo}
        />

        {/* 2. Top Section: Hero/Status (Left) & Side-by-Side Comparison (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.05fr) minmax(480px, 2fr)',
          gap: '1.25rem',
          marginBottom: '1.25rem'
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
          onResetDemo={handleResetDemo}
        />

        {/* Instant Recruiter Burst Outcome Banner */}
        {lastBurstSummary && (
          <div style={{
            margin: '-0.4rem 0 1.25rem',
            padding: '0.75rem 1.2rem',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border-active)',
            boxShadow: 'var(--glass-specular), 0 8px 24px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                Latest 20-Request Run:
              </span>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 9px',
                borderRadius: '9999px',
                background: 'var(--emerald-glass)',
                border: '1px solid var(--emerald-glass-border)',
                color: 'var(--emerald-bright)'
              }}>
                ✓ {lastBurstSummary.allowed} ALLOWED (200 OK)
              </span>
              {lastBurstSummary.blocked > 0 ? (
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '2px 9px',
                  borderRadius: '9999px',
                  background: 'var(--rose-glass)',
                  border: '1px solid var(--rose-glass-border)',
                  color: 'var(--rose-bright)'
                }}>
                  ✕ {lastBurstSummary.blocked} BLOCKED (429)
                </span>
              ) : (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}>
                  (0 Blocked • Within Quota)
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Ceiling: <strong>{lastBurstSummary.limit} req/min</strong> • Mode: <strong>{lastBurstSummary.algorithm}</strong>
            </div>
          </div>
        )}

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
    </div>
  );
}
