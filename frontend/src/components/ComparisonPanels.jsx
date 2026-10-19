import React from 'react';
import { Flame, ShieldCheck, CheckCircle2, XCircle, Activity, ServerCrash, Cpu } from 'lucide-react';

export default function ComparisonPanels() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1rem',
      height: '100%'
    }}>
      {/* Left Panel: UNCONTROLLED TRAFFIC (Chaos / Downtime) */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(244, 63, 94, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
        backdropFilter: 'blur(24px) saturate(175%)',
        WebkitBackdropFilter: 'blur(24px) saturate(175%)',
        border: '1px solid var(--rose-glass-border)',
        boxShadow: 'var(--glass-specular), 0 16px 36px -10px rgba(244, 63, 94, 0.25)',
        borderRadius: '22px',
        padding: '1.45rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
        animation: 'living-heat-pulse 4.5s ease-in-out infinite',
        transition: 'transform 0.35s var(--spring-elastic)'
      }}>
        {/* Header */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              color: 'var(--rose-bright)',
              fontSize: '0.88rem',
              fontWeight: 800,
              letterSpacing: '0.03em'
            }}>
              <Flame size={18} />
              <span>WITHOUT RATE LIMITING</span>
            </div>
            <span style={{
              fontSize: '0.68rem',
              padding: '3px 10px',
              borderRadius: '9999px',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: 'var(--rose-bright)',
              fontWeight: 700,
              boxShadow: 'var(--glass-specular)'
            }}>
              SYSTEM OVERLOAD RISK
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1.1rem' }}>
            Uncontrolled traffic bursts exhaust upstream connection pools, triggering cascading timeouts and server crashes.
          </p>

          {/* Failure Metrics Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(244, 63, 94, 0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(244, 63, 94, 0.22)',
                boxShadow: 'var(--glass-specular)',
                padding: '0.6rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--rose-primary)' }}>
                <ServerCrash size={15} />
                <span style={{ fontWeight: 600 }}>Service Availability</span>
              </div>
              <span style={{ color: 'var(--rose-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>503 Unavailable</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(244, 63, 94, 0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(244, 63, 94, 0.22)',
                boxShadow: 'var(--glass-specular)',
                padding: '0.6rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--rose-primary)' }}>
                <Cpu size={15} />
                <span style={{ fontWeight: 600 }}>CPU / Pool Saturation</span>
              </div>
              <span style={{ color: 'var(--rose-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>100% Core Lockup</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(244, 63, 94, 0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(244, 63, 94, 0.22)',
                boxShadow: 'var(--glass-specular)',
                padding: '0.6rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--rose-primary)' }}>
                <XCircle size={15} />
                <span style={{ fontWeight: 600 }}>Volumetric Abuse Shield</span>
              </div>
              <span style={{ color: 'var(--rose-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>None (Vulnerable)</span>
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div style={{
          marginTop: '1.2rem',
          padding: '0.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--rose-bright)',
          fontSize: '0.74rem',
          fontWeight: 700,
          background: 'rgba(244, 63, 94, 0.14)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          boxShadow: 'var(--glass-specular)'
        }}>
          Uncontrolled Surges → Cascading Outages & High Cloud Invoices
        </div>
      </div>

      {/* Right Panel: RATE-LIMITED ARCHITECTURE (Resilience & Order) */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
        backdropFilter: 'blur(24px) saturate(175%)',
        WebkitBackdropFilter: 'blur(24px) saturate(175%)',
        border: '1px solid var(--emerald-glass-border)',
        boxShadow: 'var(--glass-specular), 0 16px 36px -10px rgba(16, 185, 129, 0.25)',
        borderRadius: '22px',
        padding: '1.45rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
        animation: 'living-shield-pulse 4.5s ease-in-out infinite',
        transition: 'transform 0.35s var(--spring-elastic)'
      }}>
        {/* Header */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              color: 'var(--emerald-bright)',
              fontSize: '0.88rem',
              fontWeight: 800,
              letterSpacing: '0.03em'
            }}>
              <ShieldCheck size={18} />
              <span>WITH RATE LIMITING</span>
            </div>
            <span style={{
              fontSize: '0.68rem',
              padding: '3px 10px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: 'var(--emerald-bright)',
              fontWeight: 700,
              boxShadow: 'var(--glass-specular)'
            }}>
              PRODUCTION DEFENSE
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1.1rem' }}>
            Adaptive token quotas throttle surges at the edge, guaranteeing predictable latency and 99.99% service availability.
          </p>

          {/* Healthy Metrics Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(16, 185, 129, 0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16, 185, 129, 0.22)',
                boxShadow: 'var(--glass-specular)',
                padding: '0.6rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--emerald-primary)' }}>
                <CheckCircle2 size={15} />
                <span style={{ fontWeight: 600 }}>Legitimate Throughput</span>
              </div>
              <span style={{ color: 'var(--emerald-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>200 OK Allowed</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(16, 185, 129, 0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16, 185, 129, 0.22)',
                boxShadow: 'var(--glass-specular)',
                padding: '0.6rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--emerald-primary)' }}>
                <ShieldCheck size={15} />
                <span style={{ fontWeight: 600 }}>Over-Quota Throttling</span>
              </div>
              <span style={{ color: 'var(--emerald-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>429 Too Many Req</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(16, 185, 129, 0.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16, 185, 129, 0.22)',
                boxShadow: 'var(--glass-specular)',
                padding: '0.6rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--emerald-primary)' }}>
                <Activity size={15} />
                <span style={{ fontWeight: 600 }}>Bounded P99 Latency</span>
              </div>
              <span style={{ color: 'var(--emerald-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>&lt; 25ms Deterministic</span>
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div style={{
          marginTop: '1.2rem',
          padding: '0.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--emerald-bright)',
          fontSize: '0.74rem',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.14)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: 'var(--glass-specular)'
        }}>
          Quota Enforced → Bounded Latency & 99.99% High Availability
        </div>
      </div>
    </div>
  );
}
