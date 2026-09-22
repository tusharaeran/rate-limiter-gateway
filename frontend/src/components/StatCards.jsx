import React from 'react';

function BarSparkline({ data = [], color = '#00ff66', height = 26 }) {
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
            opacity={0.85}
            rx={1}
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
      marginBottom: '1.25rem'
    }}>
      {/* 1. Total Requests */}
      <div className="card-terminal" style={{ padding: '0.85rem 1.15rem' }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
          &gt; total_requests
        </div>
        <div style={{
          fontSize: '1.9rem',
          fontWeight: 700,
          color: 'var(--text-white)',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.1,
          marginBottom: '0.6rem'
        }}>
          {total}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.total} color="var(--green-bright)" />
        </div>
      </div>

      {/* 2. Blocked Requests */}
      <div className="card-terminal" style={{
        padding: '0.85rem 1.15rem',
        borderColor: blocked > 0 ? 'rgba(255, 51, 102, 0.4)' : 'var(--border-green)'
      }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--red-primary)', marginBottom: '0.35rem' }}>
          &gt; blocked_requests
        </div>
        <div style={{
          fontSize: '1.9rem',
          fontWeight: 700,
          color: 'var(--red-primary)',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.1,
          marginBottom: '0.6rem'
        }} className="text-glow-red">
          {blocked}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.blocked} color="var(--red-primary)" />
        </div>
      </div>

      {/* 3. Successful Requests */}
      <div className="card-terminal" style={{ padding: '0.85rem 1.15rem' }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--green-bright)', marginBottom: '0.35rem' }}>
          &gt; successful_requests
        </div>
        <div style={{
          fontSize: '1.9rem',
          fontWeight: 700,
          color: 'var(--green-bright)',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.1,
          marginBottom: '0.6rem'
        }} className="text-glow">
          {success}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.success} color="var(--green-bright)" />
        </div>
      </div>

      {/* 4. Avg Response Time */}
      <div className="card-terminal" style={{ padding: '0.85rem 1.15rem' }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
          &gt; avg_response_time
        </div>
        <div style={{
          fontSize: '1.9rem',
          fontWeight: 700,
          color: 'var(--text-white)',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.1,
          marginBottom: '0.6rem'
        }}>
          {avgLatency}ms
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BarSparkline data={sparklines.latency} color="var(--green-dim)" />
        </div>
      </div>
    </div>
  );
}
