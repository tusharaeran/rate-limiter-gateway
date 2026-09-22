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
      {/* 1. Left Panel: recent_requests.log */}
      <div className="card-terminal" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(0, 255, 102, 0.15)'
        }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--green-bright)' }}>
            &gt; recent_requests.log
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--green-bright)' }}>
            <span className="live-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.78rem',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid rgba(0, 255, 102, 0.1)' }}>
                <th style={{ padding: '0.45rem 0.5rem', fontWeight: 500 }}>TIME</th>
                <th style={{ padding: '0.45rem 0.5rem', fontWeight: 500 }}>METHOD</th>
                <th style={{ padding: '0.45rem 0.5rem', fontWeight: 500 }}>ENDPOINT</th>
                <th style={{ padding: '0.45rem 0.5rem', fontWeight: 500 }}>STATUS</th>
                <th style={{ padding: '0.45rem 0.5rem', fontWeight: 500 }}>IP ADDRESS</th>
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
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      <td style={{ padding: '0.4rem 0.5rem', color: 'var(--text-secondary)' }}>
                        {log.time}
                      </td>
                      <td style={{
                        padding: '0.4rem 0.5rem',
                        fontWeight: 600,
                        color: isPost ? 'var(--red-primary)' : 'var(--green-bright)'
                      }}>
                        {log.method}
                      </td>
                      <td style={{ padding: '0.4rem 0.5rem', color: 'var(--text-white)' }}>
                        {log.endpoint}
                      </td>
                      <td style={{
                        padding: '0.4rem 0.5rem',
                        fontWeight: 700,
                        color: isBlocked ? 'var(--red-primary)' : 'var(--green-bright)'
                      }}>
                        {log.status}
                      </td>
                      <td style={{ padding: '0.4rem 0.5rem', color: 'var(--text-secondary)' }}>
                        {log.ip}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent traffic recorded yet. Fire a burst or send requests to see live logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Right Panel: request_activity (last 5 minutes) */}
      <div className="card-terminal" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(0, 255, 102, 0.15)'
        }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--green-bright)' }}>
            &gt; request_activity (last 5 minutes)
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--green-bright)' }} />
              <span style={{ color: 'var(--green-bright)' }}>= allowed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--red-primary)' }} />
              <span style={{ color: 'var(--red-primary)' }}>= blocked</span>
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
              paddingRight: '6px'
            }}>
              {yTicks.map(tick => (
                <span key={tick}>{tick}</span>
              ))}
            </div>

            {/* Grid & Bars Container */}
            <div style={{
              flex: 1,
              position: 'relative',
              borderLeft: '1px solid rgba(0, 255, 102, 0.2)',
              borderBottom: '1px solid rgba(0, 255, 102, 0.2)',
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
                    borderTop: '1px dashed rgba(0, 255, 102, 0.08)',
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
                      cursor: 'pointer'
                    }}
                  >
                    {/* Allowed Segment (Top / Green) */}
                    {allowedHeightPct > 0 && (
                      <div style={{
                        height: `${allowedHeightPct}%`,
                        background: 'var(--green-bright)',
                        boxShadow: '0 0 4px rgba(0, 255, 102, 0.4)',
                        borderTopLeftRadius: '2px',
                        borderTopRightRadius: '2px'
                      }} />
                    )}

                    {/* Blocked Segment (Bottom / Red) */}
                    {blockedHeightPct > 0 && (
                      <div style={{
                        height: `${blockedHeightPct}%`,
                        background: 'var(--red-primary)',
                        boxShadow: '0 0 4px rgba(255, 51, 102, 0.4)'
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
            color: 'var(--text-muted)'
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
