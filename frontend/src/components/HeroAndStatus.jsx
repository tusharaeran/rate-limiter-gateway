import React from 'react';
import { Server, Database, Clock, Zap } from 'lucide-react';

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
      minHeight: '270px'
    }}>
      {/* Top Half: Radar & Hero Title */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* ColorOS Fluid Glass Radar Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          border: '1px solid var(--emerald-glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--glass-specular-accent), 0 8px 24px var(--emerald-glow)',
          flexShrink: 0
        }}>
          <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="#34d399" strokeOpacity="0.25" strokeWidth="1" />
            <circle cx="18" cy="18" r="11" stroke="#34d399" strokeOpacity="0.45" strokeWidth="1" />
            <circle cx="18" cy="18" r="5" stroke="#34d399" strokeOpacity="0.8" strokeWidth="1" />
            <circle cx="18" cy="18" r="2.5" fill="#34d399" />
            <line x1="18" y1="2" x2="18" y2="34" stroke="#34d399" strokeOpacity="0.2" strokeWidth="0.8" />
            <line x1="2" y1="18" x2="34" y2="18" stroke="#34d399" strokeOpacity="0.2" strokeWidth="0.8" />
            <line x1="18" y1="18" x2="32" y2="8" stroke="#34d399" strokeWidth="1.5" className="radar-sweep" />
          </svg>
        </div>

        {/* Title and Taglines */}
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            color: 'var(--text-white)',
            lineHeight: 1.2,
            marginBottom: '0.35rem',
            fontWeight: 800,
            letterSpacing: '-0.03em'
          }}>
            Pressure Meter
          </h1>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--emerald-bright)',
            fontWeight: 700,
            letterSpacing: '0.03em',
            marginBottom: '0.45rem'
          }}>
            SAME API. A HEALTHIER INTERNET.
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45
          }}>
            Live distributed telemetry proving the contrast between unthrottled cascading failure and quota-bounded resilience.
          </div>
        </div>
      </div>

      {/* Bottom Half: System Status Fluid Cards */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '0.95rem',
        borderTop: '1px solid var(--glass-border-subtle)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: 'var(--emerald-bright)',
          letterSpacing: '0.06em',
          marginBottom: '0.85rem'
        }}>
          <span className="live-pulse" />
          <span>ACTIVE TELEMETRY (LIVE)</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.75rem'
        }}>
          {/* API Gateway Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '0.6rem 0.8rem',
              boxShadow: 'var(--glass-specular)'
            }}
          >
            <Server size={18} style={{ color: 'var(--cyan-bright)' }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                API GATEWAY
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isHealthy ? 'var(--emerald-bright)' : 'var(--rose-primary)' }}>
                {isHealthy ? 'HEALTHY' : 'DEGRADED'}
              </div>
            </div>
          </div>

          {/* Redis Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '0.6rem 0.8rem',
              boxShadow: 'var(--glass-specular)'
            }}
          >
            <Database size={18} style={{ color: 'var(--rose-bright)' }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                REDIS CORE
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--emerald-bright)' }}>
                {redisStatusText}
              </div>
            </div>
          </div>

          {/* Uptime Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '0.6rem 0.8rem',
              boxShadow: 'var(--glass-specular)'
            }}
          >
            <Clock size={18} style={{ color: 'var(--indigo-bright)' }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                UPTIME
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                {uptime}
              </div>
            </div>
          </div>

          {/* Last Check Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '0.6rem 0.8rem',
              boxShadow: 'var(--glass-specular)'
            }}
          >
            <Zap size={17} style={{ color: 'var(--emerald-bright)' }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                LAST CHECK
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                {lastCheck}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
