import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '1.25rem',
      borderTop: '1px solid rgba(0, 255, 102, 0.15)',
      marginTop: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '0.8rem',
      color: 'var(--text-secondary)'
    }}>
      {/* Left: Built with badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)' }}>Built with:</span>

        {/* React */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--green-bright)' }}>
          <svg width="16" height="16" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor">
            <circle cx="0" cy="0" r="2.05" fill="#00ff66"/>
            <g stroke="#00ff66" strokeWidth="1">
              <ellipse rx="11" ry="4.2"/>
              <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
              <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
          </svg>
          <span>React</span>
        </div>

        {/* Node.js */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--green-bright)' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #00ff66',
            borderRadius: '3px',
            fontSize: '0.62rem',
            padding: '1px 3px',
            fontWeight: 700
          }}>JS</span>
          <span>Node.js</span>
        </div>

        {/* Redis */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--green-bright)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#00ff66" />
            <polyline points="2 17 12 22 22 17" stroke="#00ff66" />
            <polyline points="2 12 12 17 22 12" stroke="#00ff66" />
          </svg>
          <span>Redis</span>
        </div>

        {/* Express.js */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--green-bright)' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #00ff66',
            borderRadius: '50%',
            fontSize: '0.62rem',
            width: '18px',
            height: '18px',
            fontWeight: 700
          }}>ex</span>
          <span>Express.js</span>
        </div>
      </div>

      {/* Right: Tagline with blinking terminal cursor */}
      <div style={{ letterSpacing: '0.04em' }}>
        <span>A safer internet, one request at a time.</span>
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '14px',
          background: cursorVisible ? 'var(--green-bright)' : 'transparent',
          marginLeft: '4px',
          verticalAlign: 'middle'
        }} />
      </div>
    </footer>
  );
}
