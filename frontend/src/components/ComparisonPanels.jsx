import React from 'react';

export default function ComparisonPanels() {
  const asciiBrain = `      _.-""""-._
    .'          \`.
  /   (09// /. )   \\
 | {               } |
 | {   (@@ (@) )   } |
 | { (           ) } |
  \\  \\ (  (==)  )  /
   \`._\`-'-----'-'_.'`;

  const asciiShield = `       /-----------\\
      /             \\
     |       /       |
     |      /        |
     |  \\  /         |
     |   \\/          |
      \\             /
       \\           /
        \\         /
         \\_______/`;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1rem',
      height: '100%'
    }}>
      {/* Left Panel: WITHOUT RATE LIMITING (Red / Chaos) */}
      <div style={{
        background: 'rgba(255, 51, 102, 0.03)',
        border: '1px dashed var(--border-red)',
        borderRadius: '6px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
        boxShadow: 'inset 0 0 15px rgba(255, 51, 102, 0.05)'
      }}>
        {/* Header */}
        <div style={{
          color: 'var(--red-primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          marginBottom: '0.85rem'
        }}>
          [ WITHOUT RATE LIMITING ]
        </div>

        {/* Middle: ASCII Brain + Error alert lines */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'space-between'
        }}>
          {/* ASCII Brain */}
          <pre style={{
            color: 'var(--red-primary)',
            fontSize: '0.64rem',
            lineHeight: '1.18',
            fontFamily: 'var(--font-mono)',
            textShadow: '0 0 8px rgba(255, 51, 102, 0.4)',
            userSelect: 'none'
          }}>
            {asciiBrain}
          </pre>

          {/* Error messages */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.74rem',
            color: 'var(--red-primary)',
            fontWeight: 500,
            textAlign: 'left'
          }}>
            <div>ERR: 503 Service Unavailable</div>
            <div>ERR: 503 Service Unavailable</div>
            <div>ERR: 503 Service Unavailable</div>
            <div>ERR: Server Overload</div>
            <div>ERR: High Infrastructure Cost</div>
            <div>ERR: No Control</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '0.85rem',
          border: '1px solid rgba(255, 51, 102, 0.35)',
          borderRadius: '4px',
          padding: '0.35rem 0.5rem',
          textAlign: 'center',
          color: 'var(--red-primary)',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          background: 'rgba(255, 51, 102, 0.06)'
        }}>
          &gt; UNCONTROLLED REQUESTS = CHAOS &lt;
        </div>
      </div>

      {/* Right Panel: WITH RATE LIMITING (Green / Order) */}
      <div style={{
        background: 'rgba(0, 255, 102, 0.03)',
        border: '1px dashed var(--border-green)',
        borderRadius: '6px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
        boxShadow: 'inset 0 0 15px rgba(0, 255, 102, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          color: 'var(--green-bright)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          marginBottom: '0.85rem'
        }}>
          [ WITH RATE LIMITING ]
        </div>

        {/* Middle: ASCII Shield + OK log lines */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'space-between'
        }}>
          {/* ASCII Shield */}
          <pre style={{
            color: 'var(--green-bright)',
            fontSize: '0.64rem',
            lineHeight: '1.18',
            fontFamily: 'var(--font-mono)',
            textShadow: '0 0 8px rgba(0, 255, 102, 0.4)',
            userSelect: 'none'
          }}>
            {asciiShield}
          </pre>

          {/* OK messages */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.74rem',
            color: 'var(--green-bright)',
            fontWeight: 500,
            textAlign: 'left'
          }}>
            <div>[OK] 200 Request Allowed</div>
            <div>[OK] 200 Request Allowed</div>
            <div>[OK] 200 Request Allowed</div>
            <div>[OK] 200 Request Allowed</div>
            <div>[OK] 200 Request Allowed</div>
            <div>[OK] 200 Request Allowed</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '0.85rem',
          border: '1px solid rgba(0, 255, 102, 0.35)',
          borderRadius: '4px',
          padding: '0.35rem 0.5rem',
          textAlign: 'center',
          color: 'var(--green-bright)',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          background: 'rgba(0, 255, 102, 0.06)'
        }}>
          &gt; CONTROLLED REQUESTS = A HEALTHIER INTERNET &lt;
        </div>
      </div>
    </div>
  );
}
