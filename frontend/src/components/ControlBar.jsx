import React, { useState } from 'react';
import { Zap, ShieldCheck, ShieldAlert, RotateCcw } from 'lucide-react';

const LIMIT_PRESETS = [10, 50, 100, 500, 1000];

export default function ControlBar({
  rateLimitingEnabled,
  onToggleRateLimiting,
  algorithm,
  onChangeAlgorithm,
  limit,
  onChangeLimit,
  onTriggerBurst,
  isBursting,
  onResetDemo
}) {
  const [rippleTrigger, setRippleTrigger] = useState(false);

  const handleBurstClick = () => {
    onTriggerBurst();
  };

  const handleToggleClick = () => {
    setRippleTrigger(true);
    setTimeout(() => setRippleTrigger(false), 600);
    onToggleRateLimiting();
  };

  const limitIndex = LIMIT_PRESETS.indexOf(limit) !== -1 ? LIMIT_PRESETS.indexOf(limit) : 0;
  const sliderPercent = (limitIndex / (LIMIT_PRESETS.length - 1)) * 100;

  return (
    <div className="card-terminal" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.5rem',
      alignItems: 'center',
      padding: '1.15rem 1.4rem',
      margin: '1.4rem 0',
      borderRadius: '22px'
    }}>
      {/* 1. Fluid Living Flow Rate Limiting Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: '1rem',
        borderRight: '1px solid var(--glass-border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-white)' }}>
              Rate Limiter Gateway
            </span>
            {rateLimitingEnabled ? (
              <ShieldCheck size={16} color="var(--emerald-bright)" />
            ) : (
              <ShieldAlert size={16} color="var(--rose-bright)" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '4px' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: rateLimitingEnabled ? 'var(--emerald-glass)' : 'var(--rose-glass)',
              border: `1px solid ${rateLimitingEnabled ? 'var(--emerald-glass-border)' : 'var(--rose-glass-border)'}`,
              color: rateLimitingEnabled ? 'var(--emerald-bright)' : 'var(--rose-bright)',
              boxShadow: 'var(--glass-specular)',
              letterSpacing: '0.04em'
            }}>
              {rateLimitingEnabled ? 'LIVING FLOW ACTIVE' : 'BYPASS INACTIVE'}
            </span>
          </div>
        </div>

        {/* ColorOS 17 Living Flow Toggle Switch */}
        <button
          onClick={handleToggleClick}
          className={`living-flow-toggle ${rateLimitingEnabled ? 'active' : ''}`}
          aria-label="Toggle Rate Limiting"
          title={rateLimitingEnabled ? 'Living Flow Active - Click to bypass' : 'Living Flow Disabled - Click to activate'}
        >
          <div className={`living-toggle-ripple ${rippleTrigger ? 'trigger' : ''}`} />
          <div className="living-flow-thumb">
            <div className="living-thumb-core" />
          </div>
        </button>
      </div>

      {/* 2. Fluid Algorithm Segmented Glass Pill */}
      <div style={{
        paddingRight: '1rem',
        borderRight: '1px solid var(--glass-border-subtle)'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.5rem' }}>
          Enforcement Algorithm
        </div>
        <div className="living-segmented-pill">
          <button
            type="button"
            onClick={() => onChangeAlgorithm('fixed-window')}
            className={`living-segment-btn ${algorithm === 'fixed-window' ? 'active' : ''}`}
          >
            Fixed Window
          </button>
          <button
            type="button"
            onClick={() => onChangeAlgorithm('sliding-window')}
            className={`living-segment-btn ${algorithm === 'sliding-window' ? 'active' : ''}`}
          >
            Sliding Window
          </button>
        </div>
      </div>

      {/* 3. Fluid Quota Slider with Dynamic Emerald Track & Specular Readout */}
      <div style={{
        paddingRight: '1rem',
        borderRight: '1px solid var(--glass-border-subtle)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-white)' }}>
            Quota Ceiling <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(req/min)</span>
          </span>
          <div style={{
            border: '1px solid var(--emerald-glass-border)',
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--emerald-bright)',
            background: 'var(--emerald-glass)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--glass-specular), 0 0 12px var(--emerald-glow)',
            fontFamily: 'var(--font-mono)'
          }}>
            {limit}
          </div>
        </div>

        {/* Living Flow Liquid Range Slider */}
        <input
          type="range"
          min="0"
          max={LIMIT_PRESETS.length - 1}
          step="1"
          value={limitIndex}
          onChange={(e) => onChangeLimit(LIMIT_PRESETS[Number(e.target.value)])}
          className="living-slider"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #34d399 ${sliderPercent}%, rgba(255, 255, 255, 0.08) ${sliderPercent}%, rgba(255, 255, 255, 0.08) 100%)`
          }}
          aria-label="Quota Ceiling Slider"
        />

        {/* Clickable Preset Steps with Active Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          marginTop: '4px'
        }}>
          {LIMIT_PRESETS.map((p) => {
            const isSelected = p === limit;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onChangeLimit(p)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px 4px',
                  borderRadius: '6px',
                  color: isSelected ? 'var(--emerald-bright)' : 'var(--text-muted)',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  transition: 'color 0.2s ease'
                }}
                title={`Set quota to ${p} req/min`}
              >
                {isSelected && (
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--emerald-bright)',
                    boxShadow: '0 0 6px var(--emerald-bright)'
                  }} />
                )}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Action Controls: Burst & Reset */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', width: '100%' }}>
        <button
          onClick={handleBurstClick}
          disabled={isBursting}
          className="btn-burst"
          style={{
            flex: 1,
            padding: '0.62rem 1.15rem',
            fontSize: '0.82rem',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap'
          }}
          title="Fires 20 simultaneous requests to demonstrate rate limiting"
        >
          <Zap size={15} fill="currentColor" />
          <span>{isBursting ? 'Bursting...' : 'Send 20-Req Burst'}</span>
        </button>

        {onResetDemo && (
          <button
            onClick={onResetDemo}
            disabled={isBursting}
            className="btn-terminal"
            style={{
              padding: '0.62rem 0.85rem',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap'
            }}
            title="Reset metrics to 0 (Clean Slate for fresh test)"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
