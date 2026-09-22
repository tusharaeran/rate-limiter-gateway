import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function TopBar({ onTriggerBurst, isBursting }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: "Tue Sep 16 17:24:12"
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
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(0, 255, 102, 0.2)',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '0.75rem'
    }}>
      {/* Left: Radar + Monospace Prompt */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid var(--green-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(0, 255, 102, 0.3)',
          background: 'rgba(0, 255, 102, 0.05)'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" stroke="#00ff66" strokeOpacity="0.4" />
            <circle cx="12" cy="12" r="6" stroke="#00ff66" strokeOpacity="0.7" />
            <circle cx="12" cy="12" r="2" fill="#00ff66" />
            <line x1="12" y1="2" x2="12" y2="12" stroke="#00ff66" className="radar-sweep" />
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem' }}>
          <span style={{ color: 'var(--green-bright)', fontWeight: '700' }}>~/pressure-meter $</span>
          <span style={{ color: 'var(--text-secondary)' }}>API Rate Limiting Demo</span>
        </div>
      </div>

      {/* Right: GitHub + Run Demo + Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="btn-terminal"
          style={{ padding: '0.35rem 0.75rem' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>

        <button
          onClick={onTriggerBurst}
          disabled={isBursting}
          className="btn-terminal"
          style={{
            borderColor: 'var(--green-primary)',
            background: isBursting ? 'rgba(0, 255, 102, 0.2)' : 'rgba(0, 255, 102, 0.06)',
            padding: '0.35rem 0.85rem'
          }}
          title="Simulate 20 concurrent requests against protected API"
        >
          <Play size={12} fill="#00ff66" />
          <span>[ {isBursting ? 'firing --burst...' : 'run --live-demo'} ]</span>
        </button>

        <div style={{
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em'
        }}>
          {currentTime || 'Loading clock...'}
        </div>
      </div>
    </header>
  );
}
