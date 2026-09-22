import React from 'react';
import { Zap } from 'lucide-react';

export default function ControlBar({
  rateLimitingEnabled,
  onToggleRateLimiting,
  algorithm,
  onChangeAlgorithm,
  limit,
  onChangeLimit,
  onTriggerBurst,
  isBursting
}) {
  return (
    <div className="card-terminal" style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 1.4fr 2.2fr 1.4fr',
      gap: '1.5rem',
      alignItems: 'center',
      padding: '0.85rem 1.25rem',
      margin: '1.25rem 0',
      flexWrap: 'wrap'
    }}>
      {/* 1. Rate Limiting Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: '1rem',
        borderRight: '1px solid rgba(0, 255, 102, 0.15)'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--green-bright)' }}>
            Rate Limiting
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {rateLimitingEnabled ? 'Currently enforcing limits' : 'Currently allowing requests'}
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggleRateLimiting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.2rem 0.6rem',
            background: rateLimitingEnabled ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 51, 102, 0.1)',
            border: `1px solid ${rateLimitingEnabled ? 'var(--green-primary)' : 'var(--red-primary)'}`,
            borderRadius: '14px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            color: rateLimitingEnabled ? 'var(--green-bright)' : 'var(--red-primary)',
            boxShadow: rateLimitingEnabled ? '0 0 10px rgba(0, 255, 102, 0.3)' : 'none'
          }}
          title="Toggle rate limiting ON/OFF"
        >
          <span>[ {rateLimitingEnabled ? 'ON' : 'OFF'} ]</span>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: rateLimitingEnabled ? 'var(--green-bright)' : '#555',
            boxShadow: rateLimitingEnabled ? '0 0 8px var(--green-bright)' : 'none'
          }} />
        </button>
      </div>

      {/* 2. Algorithm Segmented Control */}
      <div style={{
        paddingRight: '1rem',
        borderRight: '1px solid rgba(0, 255, 102, 0.15)'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--green-bright)', marginBottom: '0.4rem' }}>
          Algorithm
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => onChangeAlgorithm('fixed-window')}
            className="btn-terminal"
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              background: algorithm === 'fixed-window' ? 'rgba(0, 255, 102, 0.2)' : 'transparent',
              borderColor: algorithm === 'fixed-window' ? 'var(--green-bright)' : 'rgba(0, 255, 102, 0.2)',
              color: algorithm === 'fixed-window' ? '#fff' : 'var(--text-secondary)',
              boxShadow: algorithm === 'fixed-window' ? '0 0 10px rgba(0, 255, 102, 0.3)' : 'none'
            }}
          >
            Fixed Window
          </button>

          <button
            onClick={() => onChangeAlgorithm('sliding-window')}
            className="btn-terminal"
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              background: algorithm === 'sliding-window' ? 'rgba(0, 255, 102, 0.2)' : 'transparent',
              borderColor: algorithm === 'sliding-window' ? 'var(--green-bright)' : 'rgba(0, 255, 102, 0.2)',
              color: algorithm === 'sliding-window' ? '#fff' : 'var(--text-secondary)',
              boxShadow: algorithm === 'sliding-window' ? '0 0 10px rgba(0, 255, 102, 0.3)' : 'none'
            }}
          >
            Sliding Window
          </button>
        </div>
      </div>

      {/* 3. Request Limit Slider */}
      <div style={{
        paddingRight: '1rem',
        borderRight: '1px solid rgba(0, 255, 102, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.35rem'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--green-bright)' }}>
            Request limit <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>(per minute)</span>
          </span>
          <div style={{
            border: '1px solid var(--border-green)',
            padding: '0.1rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: 'var(--green-bright)',
            background: 'rgba(0, 255, 102, 0.08)'
          }}>
            {limit}
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
        />

        {/* Range Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.64rem',
          color: 'var(--text-muted)',
          marginTop: '3px'
        }}>
          <span>10</span>
          <span>50</span>
          <span>100</span>
          <span>500</span>
          <span>1000</span>
        </div>
      </div>

      {/* 4. Send Burst Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onTriggerBurst}
          disabled={isBursting}
          className="btn-terminal btn-burst"
          style={{
            width: '100%',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.78rem'
          }}
          title="Fires 20 simultaneous requests to demonstrate rate limiting"
        >
          <Zap size={14} fill="#00ff66" />
          <span>{isBursting ? 'sending-burst...' : 'send-burst --requests=20'}</span>
        </button>
      </div>
    </div>
  );
}
