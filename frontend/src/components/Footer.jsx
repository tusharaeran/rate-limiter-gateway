import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '1.4rem',
      borderTop: '1px solid var(--glass-border-subtle)',
      marginTop: '1.6rem',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '0.8rem',
      color: 'var(--text-secondary)'
    }}>
      {/* Left: Built with badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Stack:
        </span>

        {/* React */}
        <div className="footer-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--glass-border-subtle)',
          boxShadow: 'var(--glass-specular)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer'
        }}>
          <svg width="16" height="16" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor">
            <circle cx="0" cy="0" r="2.05" fill="#38bdf8"/>
            <g stroke="#38bdf8" strokeWidth="1">
              <ellipse rx="11" ry="4.2"/>
              <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
              <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
          </svg>
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>React</span>
        </div>

        {/* Node.js */}
        <div className="footer-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--glass-border-subtle)',
          boxShadow: 'var(--glass-specular)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(34, 197, 94, 0.18)',
            color: '#4ade80',
            borderRadius: '4px',
            fontSize: '0.62rem',
            padding: '1px 4px',
            fontWeight: 800
          }}>JS</span>
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>Node.js</span>
        </div>

        {/* Redis */}
        <div className="footer-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--glass-border-subtle)',
          boxShadow: 'var(--glass-specular)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer'
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#f43f5e" />
            <polyline points="2 17 12 22 22 17" stroke="#f43f5e" />
            <polyline points="2 12 12 17 22 12" stroke="#f43f5e" />
          </svg>
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>Redis</span>
        </div>

        {/* Express.js */}
        <div className="footer-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--glass-border-subtle)',
          boxShadow: 'var(--glass-specular)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.12)',
            color: '#f8fafc',
            borderRadius: '50%',
            fontSize: '0.62rem',
            width: '18px',
            height: '18px',
            fontWeight: 800
          }}>ex</span>
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>Express.js</span>
        </div>
      </div>

      {/* Right: Author & Mission Statement */}
      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        Designed & Built by{' '}
        <a
          href="https://github.com/tusharaeran"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--emerald-bright)', textDecoration: 'none', fontWeight: 700 }}
        >
          Tushar
        </a>
        {' '}• High-Throughput Distributed API Defense
      </div>
    </footer>
  );
}
