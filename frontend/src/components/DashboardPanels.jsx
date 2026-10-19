import React from 'react';

export default function DashboardPanels({ logs = [], activityBuckets = [] }) {
  // Chart dimensions & scaling
  const maxScale = 100;
  const yTicks = [100, 75, 50, 25, 0];

  // Fallback activity buckets if empty
  const buckets = activityBuckets.length > 0 ? activityBuckets : [
    { time: '17:20', allowed: 10, blocked: 5 },
    { time: '17:21', allowed: 18, blocked: 8 },
    { time: '17:22', allowed: 35, blocked: 12 },
    { time: '17:23', allowed: 25, blocked: 9 },
    { time: '17:24', allowed: 58, blocked: 32 }
  ];

  // Pick 5 evenly spaced labels for X axis
  const xLabels = [];
  if (buckets.length > 0) {
    const step = Math.max(1, Math.floor(buckets.length / 5));
    for (let i = 0; i < buckets.length; i += step) {
      if (xLabels.length < 5) {
        xLabels.push({ index: i, label: buckets[i].time?.substring(0, 5) || '17:24' });
      }
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.5rem'
    }}>
      {/* 1. Left Panel: Recent Request Logs */}
      <div className="card-terminal" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--glass-border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-white)' }}>
              Recent Request Stream
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Real-time HTTP traffic through Redis rate limiter
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.72rem',
            color: 'var(--emerald-bright)',
            padding: '3px 12px',
            borderRadius: '9999px',
            background: 'var(--emerald-glass)',
            border: '1px solid var(--emerald-glass-border)',
            fontWeight: 800,
            backdropFilter: 'blur(12px)',
            boxShadow: 'var(--glass-specular), 0 0 14px var(--emerald-glow)',
            animation: 'living-droplet-pulse 3s ease-in-out infinite'
          }}>
            <span className="live-pulse" />
            <span>LIVING STREAM</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.76rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border-subtle)' }}>
                <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>TIMESTAMP</th>
                <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>METHOD</th>
                <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>ENDPOINT</th>
                <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>CLIENT IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.slice(0, 8).map((log, idx) => {
                  const isBlocked = log.status === 429;
                  const isPost = log.method === 'POST';

                  return (
                    <tr
                      key={log.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'all 0.25s var(--spring-bounce)',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '0.5rem 0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {log.time}
                      </td>
                      <td style={{ padding: '0.5rem 0.65rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          background: isPost ? 'rgba(99, 102, 241, 0.18)' : 'rgba(56, 189, 248, 0.18)',
                          border: `1px solid ${isPost ? 'rgba(99, 102, 241, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`,
                          color: isPost ? '#c7d2fe' : '#bae6fd',
                          boxShadow: 'var(--glass-specular)'
                        }}>
                          {log.method}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem 0.65rem', color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                        {log.endpoint}
                      </td>
                      <td style={{ padding: '0.5rem 0.65rem' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-mono)',
                          background: isBlocked ? 'var(--rose-glass)' : 'var(--emerald-glass)',
                          border: `1px solid ${isBlocked ? 'var(--rose-glass-border)' : 'var(--emerald-glass-border)'}`,
                          color: isBlocked ? 'var(--rose-bright)' : 'var(--emerald-bright)',
                          boxShadow: 'var(--glass-specular)'
                        }}>
                          {isBlocked ? '429 Blocked' : '200 OK'}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem 0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {log.ip}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent traffic recorded. Click "Send 20-Request Burst" to observe live throughput.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Right Panel: Request Activity Histogram */}
      <div className="card-terminal" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--glass-border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-white)' }}>
              Throughput & Throttling Histogram
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              15-second stacked distribution (Past 5 minutes)
            </div>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '3px', background: 'var(--emerald-bright)', boxShadow: '0 0 6px var(--emerald-glow)' }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Allowed (200)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '3px', background: 'var(--rose-primary)', boxShadow: '0 0 6px var(--rose-glow)' }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Throttled (429)</span>
            </div>
          </div>
        </div>

        {/* Stacked Bar Chart Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '0.5rem' }}>
          {/* Chart Graphic */}
          <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: '190px' }}>
            {/* Y Axis Labels */}
            <div style={{
              width: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              textAlign: 'right',
              paddingRight: '6px',
              fontFamily: 'var(--font-mono)'
            }}>
              {yTicks.map(tick => (
                <span key={tick}>{tick}</span>
              ))}
            </div>

            {/* Grid & Bars Container */}
            <div style={{
              flex: 1,
              position: 'relative',
              borderLeft: '1px solid var(--glass-border-subtle)',
              borderBottom: '1px solid var(--glass-border-subtle)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 4px'
            }}>
              {/* Horizontal Gridlines */}
              {yTicks.map((tick, i) => (
                <div
                  key={tick}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${(i / (yTicks.length - 1)) * 100}%`,
                    borderTop: '1px dashed rgba(255, 255, 255, 0.06)',
                    pointerEvents: 'none'
                  }}
                />
              ))}

              {/* Stacked Vertical Bars */}
              {buckets.map((b, idx) => {
                const total = Math.max(0, (b.allowed || 0) + (b.blocked || 0));
                const totalPct = Math.min(100, Math.max(4, (total / maxScale) * 100));
                const blockedRatio = total > 0 ? (b.blocked || 0) / total : 0;
                const allowedRatio = total > 0 ? (b.allowed || 0) / total : 0;

                const blockedHeightPct = totalPct * blockedRatio;
                const allowedHeightPct = totalPct * allowedRatio;

                return (
                  <div
                    key={idx}
                    title={`${b.time}: Allowed=${b.allowed || 0}, Blocked=${b.blocked || 0}`}
                    style={{
                      flex: 1,
                      margin: '0 2px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      height: '100%',
                      zIndex: 2,
                      cursor: 'pointer',
                      transition: 'transform 0.2s var(--spring-bounce)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                  >
                    {/* Allowed Segment (Top / Emerald) */}
                    {allowedHeightPct > 0 && (
                      <div style={{
                        height: `${allowedHeightPct}%`,
                        background: 'linear-gradient(180deg, #34d399 0%, #10b981 100%)',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        boxShadow: '0 0 8px rgba(52, 211, 153, 0.35)',
                        opacity: 0.95
                      }} />
                    )}

                    {/* Blocked Segment (Bottom / Rose) */}
                    {blockedHeightPct > 0 && (
                      <div style={{
                        height: `${blockedHeightPct}%`,
                        background: 'linear-gradient(180deg, #fb7185 0%, #f43f5e 100%)',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        boxShadow: '0 0 8px rgba(251, 113, 133, 0.35)',
                        opacity: 0.95
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* X Axis Time Labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '32px',
            paddingRight: '6px',
            paddingTop: '6px',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            {xLabels.map((xl, i) => (
              <span key={i}>{xl.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
