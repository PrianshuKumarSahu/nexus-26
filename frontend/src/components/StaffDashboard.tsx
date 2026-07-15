import { useState, useEffect } from 'react';

interface CrowdBar { gate: string; density: number; trend: '↑' | '↓' | '→' }
interface Alert    { id: string; level: 'critical' | 'warning' | 'info'; message: string; time: string }

const CROWD_DATA: CrowdBar[] = [
  { gate: 'Gate A', density: 38, trend: '↓' },
  { gate: 'Gate B', density: 54, trend: '→' },
  { gate: 'Gate C', density: 85, trend: '↑' },
  { gate: 'Gate D', density: 42, trend: '↓' },
  { gate: 'Gate E', density: 61, trend: '↑' },
  { gate: 'Gate F', density: 29, trend: '↓' },
];

const ALERTS: Alert[] = [
  { id: '1', level: 'critical', message: 'Gate C approaching critical capacity (85%). Redirect fans to Gate D immediately.', time: '2 min ago' },
  { id: '2', level: 'warning',  message: 'Spill reported at Restroom Block 4, West Wing — Janitorial dispatched.',           time: '7 min ago' },
  { id: '3', level: 'info',     message: 'Shuttle #7 delayed 8 minutes — notifying 320 fans via app.',                       time: '12 min ago' },
  { id: '4', level: 'info',     message: 'VIP Section E concierge requests additional staff for Gate F checkpoint.',          time: '18 min ago' },
];

const ALERT_COLORS: Record<string, string> = {
  critical: 'var(--red)',
  warning:  '#ffbe0b',
  info:     'var(--cyan)',
};

/**
 * Premium staff operations dashboard with real-time KPIs, animated crowd bars,
 * incident alerts, and GenAI operational intelligence.
 */
export default function StaffDashboard() {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Trigger bar animation after mount so transition fires from 0 → target
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  const getInsight = async (query: string) => {
    setLoadingInsight(true);
    setAiInsight('');
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, role: 'staff', language: 'en' }),
      });
      const data = await res.json();
      setAiInsight(data.response);
    } catch {
      setAiInsight('Unable to connect to operational AI. Please check network connectivity.');
    } finally {
      setLoadingInsight(false);
    }
  };

  const activeAlerts = ALERTS.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fadeinup" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-eyebrow">Operational Command Center</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
            OPERATIONS <span style={{ background: 'linear-gradient(135deg, var(--cyan), #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HQ</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Real-time stadium intelligence · FIFA WC 2026 · SoFi Stadium
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="status-live">System Online</div>
          <span className="badge badge-cyan">Match Day 38</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="animate-fadeinup delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Attendance', value: '68,402',   sub: '↑ 12% vs target',  color: 'var(--primary)', icon: '👥' },
          { label: 'Active Incidents', value: '3',         sub: '2 minor, 1 medium', color: '#ffbe0b',        icon: '⚠️' },
          { label: 'Avg Gate Wait',    value: '4.2 min',   sub: '↓ from 6.1 min',   color: 'var(--cyan)',    icon: '⏱️' },
          { label: 'Staff Deployed',   value: '1,240',     sub: '98% coverage',      color: '#a78bfa',        icon: '🛡️' },
          { label: 'Food Stalls Open', value: '148 / 156', sub: '5 under restocking',color: 'var(--gold)',    icon: '🍔' },
          { label: 'Eco Score',        value: '94%',       sub: '↑ waste recycled',  color: 'var(--primary)', icon: '♻️' },
        ].map((k, i) => (
          <div key={i} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{k.icon}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '26px', color: k.color, marginBottom: '4px', lineHeight: 1 }}>
              {k.value}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'Rajdhani', sans-serif", marginBottom: '6px' }}>
              {k.label}
            </div>
            <div style={{ fontSize: '12px', color: k.color, fontWeight: 600 }}>{k.sub}</div>
            {/* Shimmer on first load */}
            <div className="animate-shimmer" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius)', opacity: 0.3, pointerEvents: 'none' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Crowd Density bars */}
          <div className="glass-card animate-fadeinup delay-200" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.5px' }}>
              📊 Gate Crowd Density — Live
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {CROWD_DATA.map(bar => {
                const color = bar.density > 75 ? 'var(--red)' : bar.density > 55 ? '#ffbe0b' : 'var(--primary)';
                return (
                  <div key={bar.gate}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{bar.gate}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '14px', color }}>{bar.density}%</span>
                        <span style={{ fontSize: '14px', color: bar.trend === '↑' ? 'var(--red)' : bar.trend === '↓' ? 'var(--primary)' : '#ffbe0b' }}>{bar.trend}</span>
                      </div>
                    </div>
                    <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        borderRadius: '99px',
                        width: mounted ? `${bar.density}%` : '0%',
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                        boxShadow: `0 0 8px ${color}60`,
                        transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GenAI Operations Panel */}
          <div className="glass-card animate-fadeinup delay-300" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(59,130,246,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>🤖</div>
              <div>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  GenAI Operational Intelligence
                </h3>
                <div className="status-live" style={{ fontSize: '11px' }}>AI Analysis Engine Active</div>
              </div>
            </div>

            {/* AI Query Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: '📊 Crowd Analysis',    query: 'Analyze current crowd density and suggest routing decisions' },
                { label: '📋 Incident Summary',  query: 'Summarize all active incident reports and priority actions' },
                { label: '🚦 Traffic Flow',      query: 'Evaluate current gate traffic flow and bottleneck risks' },
                { label: '🍔 Food Court Load',   query: 'Assess food court congestion and staff allocation needs' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => getInsight(btn.query)}
                  className="btn-glass"
                  style={{ padding: '12px 10px', textAlign: 'left', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* AI Output */}
            {loadingInsight ? (
              <div style={{
                background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <div className="loading-dot" style={{ background: 'var(--cyan)' }} />
                <div className="loading-dot" style={{ background: 'var(--cyan)', animationDelay: '-0.16s' }} />
                <div className="loading-dot" style={{ background: 'var(--cyan)', animationDelay: '0s' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Analyzing operational data...</span>
              </div>
            ) : aiInsight ? (
              <div style={{
                background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '12px', padding: '20px', position: 'relative',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
                  ⚡ AI OPERATIONAL INSIGHT
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{aiInsight}</p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)',
                borderRadius: '12px', padding: '24px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Click any query above to generate an AI operational insight
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column — Alerts */}
        <div>
          <div className="glass-card animate-fadeinup delay-200" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                🚨 Active Alerts
              </h3>
              <span className="badge badge-red">{activeAlerts.length} Active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeAlerts.map(alert => (
                <div key={alert.id} style={{
                  background: `${ALERT_COLORS[alert.level]}08`,
                  border: `1px solid ${ALERT_COLORS[alert.level]}30`,
                  borderRadius: '12px', padding: '14px 16px',
                  borderLeft: `3px solid ${ALERT_COLORS[alert.level]}`,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span className="badge" style={{
                      background: `${ALERT_COLORS[alert.level]}15`,
                      color: ALERT_COLORS[alert.level]!,
                      border: `1px solid ${ALERT_COLORS[alert.level]}30`,
                      fontSize: '10px',
                    }}>
                      {alert.level.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setDismissedAlerts(p => [...p, alert.id])}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '6px' }}>{alert.message}</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                    🕐 {alert.time}
                  </span>
                </div>
              ))}
              {activeAlerts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  ✅ All alerts cleared
                </div>
              )}
            </div>
          </div>

          {/* Sustainability Tracker */}
          <div className="glass-card animate-fadeinup delay-400" style={{ padding: '24px', marginTop: '16px' }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              ♻️ Sustainability Metrics
            </h3>
            {[
              { label: 'Waste Recycled',   value: 94, color: 'var(--primary)' },
              { label: 'Renewable Energy', value: 78, color: 'var(--cyan)'    },
              { label: 'Water Saved',      value: 62, color: '#3b82f6'        },
              { label: 'Carbon Offset',    value: 51, color: '#a78bfa'        },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{m.label}</span>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', fontWeight: 700, color: m.color }}>{m.value}%</span>
                </div>
                <div style={{ height: '7px', borderRadius: '99px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px',
                    width: mounted ? `${m.value}%` : '0%',
                    background: m.color,
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
