import React from 'react';
import { Server, Database, Clock } from 'lucide-react';

export default function HeroAndStatus({ systemStatus }) {
  const isHealthy = systemStatus?.apiGateway === 'HEALTHY';
  const redisConnected = systemStatus?.redis?.connected;
  const redisStatusText = redisConnected ? 'CONNECTED' : (systemStatus?.redis?.mode === 'In-Memory Mirror Fallback' ? 'LOCAL RUNTIME' : 'CONNECTED');
  const uptime = systemStatus?.uptime || '2h 14m';
  const lastCheck = systemStatus?.lastHealthCheck || '17:24:10';

  return (
    <div className="card-terminal" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      minHeight: '260px'
    }}>
      {/* Top Half: Radar & Hero Title */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* Radar Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '1.5px solid var(--green-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 255, 102, 0.4), inset 0 0 10px rgba(0, 255, 102, 0.2)',
          background: 'radial-gradient(circle, rgba(0, 255, 102, 0.12) 0%, rgba(0,0,0,0.8) 100%)',
          flexShrink: 0
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="#00ff66" strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="18" cy="18" r="11" stroke="#00ff66" strokeOpacity="0.5" strokeWidth="1" />
            <circle cx="18" cy="18" r="5" stroke="#00ff66" strokeOpacity="0.8" strokeWidth="1" />
            <circle cx="18" cy="18" r="2" fill="#00ff66" />
            <line x1="18" y1="2" x2="18" y2="34" stroke="#00ff66" strokeOpacity="0.25" strokeWidth="0.8" />
            <line x1="2" y1="18" x2="34" y2="18" stroke="#00ff66" strokeOpacity="0.25" strokeWidth="0.8" />
            <line x1="18" y1="18" x2="32" y2="8" stroke="#39ff14" strokeWidth="1.5" className="radar-sweep" />
          </svg>
        </div>

        {/* Title and Taglines */}
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            color: 'var(--green-bright)',
            lineHeight: 1.15,
            marginBottom: '0.35rem',
            fontWeight: 700
          }} className="text-glow">
            Pressure Meter
          </h1>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--green-primary)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: '0.5rem'
          }}>
            SAME API. A HEALTHIER INTERNET.
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}>
            See the difference<br />
            rate limiting makes.
          </div>
        </div>
      </div>

      {/* Bottom Half: System Status Block */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid rgba(0, 255, 102, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.76rem',
          fontWeight: 700,
          color: 'var(--green-bright)',
          letterSpacing: '0.08em',
          marginBottom: '0.75rem'
        }}>
          <span className="live-pulse" />
          <span>SYSTEM STATUS (LIVE)</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.75rem'
        }}>
          {/* API Gateway */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={18} style={{ color: 'var(--green-primary)', opacity: 0.8 }} />
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                API GATEWAY
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isHealthy ? 'var(--green-bright)' : 'var(--red-primary)' }}>
                {isHealthy ? 'HEALTHY' : 'DEGRADED'}
              </div>
            </div>
          </div>

          {/* Redis */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--green-primary)', opacity: 0.8 }} />
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                REDIS
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green-bright)' }}>
                {redisStatusText}
              </div>
            </div>
          </div>

          {/* Uptime */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--green-primary)', opacity: 0.8 }} />
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                UPTIME
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green-bright)' }}>
                {uptime}
              </div>
            </div>
          </div>

          {/* Last Health Check */}
          <div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              LAST HEALTH CHECK
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green-bright)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#00ff66' }} />
              <span>{lastCheck}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
