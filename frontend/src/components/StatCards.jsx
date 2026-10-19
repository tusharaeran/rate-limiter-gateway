import React from 'react';

function BarSparkline({ data = [], color = '#10b981', height = 28 }) {
  const points = data.length > 0 ? data : [6, 12, 8, 15, 10, 22, 14, 18, 9, 25, 16, 20];
  const maxVal = Math.max(...points, 1);
  const barWidth = 4;
  const gap = 3;
  const totalWidth = points.length * (barWidth + gap);

  return (
    <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`} style={{ overflow: 'visible' }}>
      {points.map((val, idx) => {
        const barHeight = Math.max(3, Math.round((val / maxVal) * (height - 2)));
        const x = idx * (barWidth + gap);
        const y = height - barHeight;

        return (
          <rect
            key={idx}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={color}
            opacity={0.88}
            rx={2}
          />
        );
      })}
    </svg>
  );
}

export default function StatCards({ stats }) {
  const total = stats?.total_requests ?? 0;
  const blocked = stats?.blocked_requests ?? 0;
  const success = stats?.successful_requests ?? 0;
  const avgLatency = stats?.avg_response_time ?? 24;

  const sparklines = stats?.sparklines || {};

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.4rem'
    }}>
      {/* 1. Total Requests */}
      <div className="card-terminal" style={{
        padding: '1.25rem 1.35rem',
        background: 'radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.2) 0%, rgba(255, 255, 255, 0.04) 100%)',
        cursor: 'default'
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 800 }}>
          Total Requests
        </div>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'var(--text-white)',
          lineHeight: 1.1,
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          {total}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.total} color="var(--cyan-bright)" />
        </div>
      </div>

      {/* 2. Blocked Requests */}
      <div className="card-terminal" style={{
        padding: '1.25rem 1.35rem',
        background: 'radial-gradient(circle at 90% 10%, rgba(244, 63, 94, 0.22) 0%, rgba(255, 255, 255, 0.04) 100%)',
        border: blocked > 0 ? '1px solid var(--rose-glass-border)' : '1px solid var(--glass-border)',
        boxShadow: blocked > 0 ? 'var(--glass-specular), 0 12px 30px var(--rose-glow)' : 'var(--glass-shadow)',
        cursor: 'default'
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--rose-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 800 }}>
          Blocked Requests (429)
        </div>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'var(--rose-bright)',
          lineHeight: 1.1,
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          {blocked}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.blocked} color="var(--rose-primary)" />
        </div>
      </div>

      {/* 3. Successful Requests */}
      <div className="card-terminal" style={{
        padding: '1.25rem 1.35rem',
        background: 'radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.22) 0%, rgba(255, 255, 255, 0.04) 100%)',
        cursor: 'default'
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--emerald-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 800 }}>
          Successful (200 OK)
        </div>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'var(--emerald-bright)',
          lineHeight: 1.1,
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          {success}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.success} color="var(--emerald-bright)" />
        </div>
      </div>

      {/* 4. Avg Response Time */}
      <div className="card-terminal" style={{
        padding: '1.25rem 1.35rem',
        background: 'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.2) 0%, rgba(255, 255, 255, 0.04) 100%)',
        cursor: 'default'
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--indigo-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 800 }}>
          Avg Latency (P99)
        </div>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'var(--text-white)',
          lineHeight: 1.1,
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          {avgLatency}ms
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.latency} color="var(--indigo-bright)" />
        </div>
      </div>
    </div>
  );
}
