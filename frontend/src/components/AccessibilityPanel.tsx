import React, { memo } from 'react';

/**
 * Accessible route data for each stadium gate.
 * Hoisted outside the component to prevent re-creation on every render.
 */
const ACCESSIBLE_ROUTES = [
  { gate: 'Gate A', route: 'Level 1 West Ramp → Elevator B2 → Section 101–110', clear: true,  waitTime: '< 2 min' },
  { gate: 'Gate B', route: 'East Accessible Entrance → Lift L3 → Section 200–215',  clear: true,  waitTime: '3 min'   },
  { gate: 'Gate C', route: 'South Accessible Tunnel → Platform C → Section 300+',   clear: false, waitTime: '8 min'   },
  { gate: 'Gate D', route: 'West Entrance → Lift D1 → Section 400–420',             clear: true,  waitTime: '1 min'   },
] as const;

/**
 * Accessibility services available at the stadium.
 * Hoisted outside the component to prevent re-creation on every render.
 */
const ACCESSIBILITY_SERVICES = [
  { icon: '👁️',  title: 'Visual Assistance',     desc: 'Audio descriptions and tactile maps available at all info desks.' },
  { icon: '👂',  title: 'Hearing Support',         desc: 'Hearing loop available in all seating sections. Sign language interpreter on call.' },
  { icon: '🧠',  title: 'Sensory-Friendly Zones', desc: 'Quiet zones available on Level 2, East Wing. Low-stimulation areas marked on map.' },
  { icon: '🦽',  title: 'Wheelchair Assistance',  desc: 'Dedicated accessible seating in every section. Push-assist volunteers available.' },
  { icon: '🅿️',  title: 'Accessible Parking',    desc: 'Designated Blue Badge parking in Lots A1 and B2 — 200m from main entrance.' },
  { icon: '🆘',  title: 'Medical Support',         desc: 'Medical stations on every level. AED units placed every 150m. 24/7 emergency.' },
] as const;

/**
 * Accessibility helper panel — displays accessible gate routes,
 * stadium services, and emergency contact information.
 *
 * Wrapped in React.memo to prevent unnecessary re-renders when
 * parent state changes unrelated to this component.
 *
 * @returns The accessibility hub JSX panel.
 */
const AccessibilityPanel = memo(function AccessibilityPanel(): React.JSX.Element {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fadeinup" style={{ marginBottom: '32px' }}>
        <div className="section-eyebrow">Inclusive Stadium Experience</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
          ACCESSIBILITY <span style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HUB</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Dedicated routes, services, and AI assistance for all fans
        </p>
      </div>

      {/* Accessible Routes */}
      <section
        className="glass-card animate-fadeinup delay-100"
        aria-label="Accessible Gate Routes"
        style={{ padding: '28px', marginBottom: '24px' }}
      >
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.5px' }}>
          ♿ Accessible Gate Routes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ACCESSIBLE_ROUTES.map(r => (
            <div
              key={r.gate}
              role="listitem"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px',
                background: r.clear ? 'rgba(0,230,118,0.04)' : 'rgba(255,71,87,0.04)',
                border: `1px solid ${r.clear ? 'rgba(0,230,118,0.15)' : 'rgba(255,71,87,0.15)'}`,
                borderRadius: '12px', flexWrap: 'wrap',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: r.clear ? 'rgba(0,230,118,0.12)' : 'rgba(255,71,87,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '15px',
                  color: r.clear ? 'var(--primary)' : 'var(--red)', flexShrink: 0,
                }}
              >
                {r.gate.split(' ')[1]}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {r.gate}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.route}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <span className={r.clear ? 'badge badge-green' : 'badge badge-red'} aria-label={r.clear ? 'Route clear' : 'Route busy'}>
                  {r.clear ? '✅ Clear' : '⚠️ Busy'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wait: {r.waitTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section
        className="animate-fadeinup delay-200"
        aria-label="Accessibility Services"
        style={{ marginBottom: '24px' }}
      >
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.5px' }}>
          🤝 Accessibility Services
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {ACCESSIBILITY_SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="feature-card animate-fadeinup"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }} aria-hidden="true">{s.icon}</div>
              <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Banner */}
      <div
        className="glass-card animate-fadeinup delay-300"
        role="alert"
        aria-live="polite"
        style={{ padding: '24px 28px', background: 'rgba(255,71,87,0.05)', borderColor: 'rgba(255,71,87,0.2)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '36px' }} aria-hidden="true">🆘</div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--red)', marginBottom: '4px' }}>
              Emergency Assistance
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              For urgent assistance, contact a venue volunteer or dial the Stadium Emergency Line:&nbsp;
              <strong style={{ color: 'var(--text-primary)' }}>+1-800-FIFA-SOS</strong>
            </p>
          </div>
          <button
            className="btn-glass"
            aria-label="Call emergency line +1-800-FIFA-SOS"
            style={{ borderColor: 'rgba(255,71,87,0.3)', color: 'var(--red)' }}
          >
            📞 Call Now
          </button>
        </div>
      </div>
    </div>
  );
});

export default AccessibilityPanel;
