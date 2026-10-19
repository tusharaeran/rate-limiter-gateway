import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function TopBar({ onTriggerBurst, isBursting, onResetDemo }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dayNum = String(now.getDate()).padStart(2, '0');
      const timeStr = now.toTimeString().split(' ')[0];
      setCurrentTime(`${dayName} ${monthName} ${dayNum} ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '1.2rem',
      borderBottom: '1px solid var(--glass-border-subtle)',
      marginBottom: '1.4rem',
      flexWrap: 'wrap',
      gap: '0.85rem'
    }}>
      {/* Left: Fluid Brand Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          border: '1px solid var(--emerald-glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'var(--glass-specular), 0 0 16px var(--emerald-glow)'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" stroke="#10b981" strokeOpacity="0.3" />
            <circle cx="12" cy="12" r="6" stroke="#10b981" strokeOpacity="0.7" />
            <circle cx="12" cy="12" r="2.5" fill="#34d399" />
            <line x1="12" y1="2" x2="12" y2="12" stroke="#34d399" className="radar-sweep" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: 'var(--text-white)', fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Pressure Meter
            </span>
            <span style={{
              fontSize: '0.68rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: 'var(--cyan-bright)',
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
              boxShadow: 'var(--glass-specular)'
            }}>
              COLOROS FLUID
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Cloudflare-Resilient Rate Limiting & Telemetry Gateway
          </div>
        </div>
      </div>

      {/* Right: Glass Interactive Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="btn-terminal"
          style={{
            padding: '0.45rem 0.95rem',
            fontSize: '0.78rem'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>Repository</span>
        </a>

        <button
          onClick={onTriggerBurst}
          disabled={isBursting}
          className="btn-burst"
          style={{
            padding: '0.45rem 1.15rem',
            fontSize: '0.78rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: isBursting ? 'not-allowed' : 'pointer'
          }}
          title="Simulate 20 concurrent requests against protected API"
        >
          <Play size={13} fill="currentColor" />
          <span>{isBursting ? 'Simulating...' : 'Run Burst Demo'}</span>
        </button>

        {onResetDemo && (
          <button
            onClick={onResetDemo}
            disabled={isBursting}
            className="btn-terminal"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: isBursting ? 'not-allowed' : 'pointer'
            }}
            title="Reset telemetry counters and logs to 0 for a fresh test"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
        )}

        {/* Fluid Glass Time Pill with Living Pulse */}
        <div style={{
          fontSize: '0.76rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          padding: '0.45rem 0.95rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border-subtle)',
          borderRadius: '9999px',
          boxShadow: 'var(--glass-specular)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--emerald-bright)',
            boxShadow: '0 0 8px var(--emerald-bright)'
          }} />
          <span>{currentTime || 'Syncing...'}</span>
        </div>
      </div>
    </header>
  );
}
