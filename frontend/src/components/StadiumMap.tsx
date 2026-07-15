import { useState, useMemo } from 'react';

interface Zone {
  id: string;
  name: string;
  density: number; // 0-100
  status: 'clear' | 'moderate' | 'congested';
  capacity: number;
  gate: string;
  x: number; // SVG coordinate (0-500)
  y: number; // SVG coordinate (0-400)
}

/* Zones mapped to SVG viewBox 500x400 — positions around a football pitch ellipse */
const ZONES: Zone[] = [
  { id: 'A', name: 'North Stand — Gate A',   density: 38, status: 'clear',     capacity: 12500, gate: 'A', x: 250, y: 30  },
  { id: 'G', name: 'NE Corner — Gate G',     density: 48, status: 'moderate',  capacity: 6000,  gate: 'G', x: 400, y: 70  },
  { id: 'B', name: 'East Stand — Gate B',    density: 54, status: 'moderate',  capacity: 15000, gate: 'B', x: 460, y: 195 },
  { id: 'E', name: 'East VIP — Gate E',      density: 61, status: 'moderate',  capacity: 5000,  gate: 'E', x: 410, y: 320 },
  { id: 'C', name: 'South Stand — Gate C',   density: 85, status: 'congested', capacity: 18000, gate: 'C', x: 250, y: 370 },
  { id: 'F', name: 'West VIP — Gate F',      density: 29, status: 'clear',     capacity: 4500,  gate: 'F', x: 90,  y: 320 },
  { id: 'D', name: 'West Stand — Gate D',    density: 42, status: 'clear',     capacity: 14000, gate: 'D', x: 40,  y: 195 },
  { id: 'H', name: 'NW Corner — Gate H',     density: 33, status: 'clear',     capacity: 6000,  gate: 'H', x: 100, y: 70  },
];

const STATUS_COLOR: Record<string, string> = {
  clear:     '#00e676',
  moderate:  '#ffbe0b',
  congested: '#ff4757',
};
const STATUS_BG: Record<string, string> = {
  clear:     'rgba(0,230,118,0.08)',
  moderate:  'rgba(255,190,11,0.08)',
  congested: 'rgba(255,71,87,0.08)',
};

/**
 * Interactive stadium crowd density map.
 * Zone circles are sized for clear readability of % labels.
 */
export default function StadiumMap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [filter, setFilter] = useState<'all' | 'clear' | 'moderate' | 'congested'>('all');

  const filtered = useMemo(() => ZONES.filter(z => filter === 'all' || z.status === filter), [filter]);
  const avgDensity = useMemo(() => Math.round(ZONES.reduce((s, z) => s + z.density, 0) / ZONES.length), []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fadeinup" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-eyebrow">Live Crowd Intelligence</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
            STADIUM <span className="gradient-text-green">MAP</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Real-time crowd density · Click any zone for routing
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {(['all', 'clear', 'moderate', 'congested'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={f === filter ? 'btn-primary' : 'btn-glass'}
              style={{ padding: '8px 16px', fontSize: '12px', textTransform: 'capitalize', borderRadius: '8px' }}
            >
              {f === 'clear' ? '🟢' : f === 'moderate' ? '🟡' : f === 'congested' ? '🔴' : '📋'} {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="animate-fadeinup delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Avg Density',  value: `${avgDensity}%`, color: avgDensity > 70 ? 'var(--red)' : avgDensity > 50 ? '#ffbe0b' : 'var(--primary)' },
          { label: 'Clear Gates',  value: `${ZONES.filter(z => z.status === 'clear').length}`,     color: 'var(--primary)' },
          { label: 'Congested',    value: `${ZONES.filter(z => z.status === 'congested').length}`, color: 'var(--red)'     },
          { label: 'Total Capacity', value: '81K',                                                 color: 'var(--cyan)'    },
        ].map((k, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '32px', color: k.color, marginBottom: '6px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        {/* SVG Map */}
        <div className="glass-card animate-fadeinup delay-200" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '84%' }}>
            <svg
              viewBox="0 0 500 420"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              role="img"
              aria-label="Stadium crowd density map"
            >
              {/* ── Stand fill (outer ellipse) ── */}
              <ellipse cx="250" cy="205" rx="240" ry="195" fill="rgba(0,230,118,0.03)" stroke="rgba(0,230,118,0.12)" strokeWidth="1" />

              {/* ── Pitch background ── */}
              <ellipse cx="250" cy="205" rx="185" ry="155" fill="#061a0f" stroke="rgba(0,230,118,0.18)" strokeWidth="1.5" />

              {/* ── Grass stripes ── */}
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x="70" y={88 + i * 20} width="360" height="10" fill={i % 2 === 0 ? 'rgba(0,230,118,0.03)' : 'rgba(0,230,118,0.06)'} />
              ))}

              {/* ── Pitch markings ── */}
              <rect x="68" y="86" width="364" height="238" rx="4" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
              <circle cx="250" cy="205" r="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
              <line x1="250" y1="86" x2="250" y2="324" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Penalty boxes */}
              <rect x="68" y="148" width="72" height="114" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <rect x="360" y="148" width="72" height="114" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Goal boxes */}
              <rect x="68" y="172" width="30" height="66" rx="1" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <rect x="402" y="172" width="30" height="66" rx="1" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              {/* Centre dot */}
              <circle cx="250" cy="205" r="3" fill="rgba(255,255,255,0.18)" />

              {/* ── Stadium text ── */}
              <text x="250" y="199" textAnchor="middle" fill="rgba(255,255,255,0.14)" fontSize="14" fontFamily="'Orbitron',monospace" fontWeight="700">FIFA WC 2026</text>
              <text x="250" y="218" textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="10" fontFamily="'Rajdhani',sans-serif" fontWeight="600">SoFi Stadium · Los Angeles</text>

              {/* ── Zone dots ── */}
              {ZONES.map(zone => {
                const isVisible = filter === 'all' || zone.status === filter;
                if (!isVisible) return null;
                const col = STATUS_COLOR[zone.status]!;
                const isSelected = selectedZone?.id === zone.id;
                /* Larger radius for selected zone */
                const R = isSelected ? 26 : 22;

                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(prev => prev?.id === zone.id ? null : zone)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={`Gate ${zone.gate} — ${zone.density}% capacity`}
                  >
                    {/* Outer pulse ring */}
                    <circle
                      cx={zone.x} cy={zone.y}
                      r={R + 10}
                      fill={col + '18'}
                      stroke={col + '50'}
                      strokeWidth="1"
                      style={{ animation: 'ping-slow 2.5s ease-in-out infinite' }}
                    />
                    {/* Main filled circle */}
                    <circle
                      cx={zone.x} cy={zone.y}
                      r={R}
                      fill={col}
                      opacity={isSelected ? 1 : 0.88}
                      stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.3)'}
                      strokeWidth={isSelected ? 2.5 : 1}
                    />
                    {/* Density % — large, white, bold, centered */}
                    <text
                      x={zone.x} y={zone.y - 3}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="#000" fontSize="11" fontWeight="900"
                      fontFamily="'Orbitron', monospace"
                    >
                      {zone.density}%
                    </text>
                    {/* Gate letter below percentage */}
                    <text
                      x={zone.x} y={zone.y + 10}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="rgba(0,0,0,0.65)" fontSize="9" fontWeight="700"
                      fontFamily="'Rajdhani', sans-serif"
                    >
                      Gate {zone.gate}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Clear (< 60%)',     color: '#00e676' },
              { label: 'Moderate (60–80%)', color: '#ffbe0b' },
              { label: 'Congested (> 80%)', color: '#ff4757' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Zone Detail Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedZone ? (
            <div
              className="glass-card animate-fadeinup"
              style={{ padding: '24px', borderColor: STATUS_COLOR[selectedZone.status] + '50', background: STATUS_BG[selectedZone.status] }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge" style={{
                  background: STATUS_BG[selectedZone.status],
                  color: STATUS_COLOR[selectedZone.status]!,
                  border: `1px solid ${STATUS_COLOR[selectedZone.status]}40`,
                }}>
                  {selectedZone.status === 'clear' ? '🟢' : selectedZone.status === 'moderate' ? '🟡' : '🔴'} {selectedZone.status.toUpperCase()}
                </span>
                <button aria-label="Close zone details" onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>✕</button>
              </div>

              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '22px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Gate {selectedZone.gate}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>{selectedZone.name}</p>

              {/* Density bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>Crowd Density</span>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '16px', color: STATUS_COLOR[selectedZone.status]! }}>
                    {selectedZone.density}%
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px',
                    width: `${selectedZone.density}%`,
                    background: `linear-gradient(90deg, ${STATUS_COLOR[selectedZone.status]}, ${selectedZone.density > 70 ? '#ff4757' : '#ffbe0b'})`,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>

              {[
                { label: 'Capacity',         value: selectedZone.capacity.toLocaleString() + ' seats' },
                { label: 'Currently Inside', value: Math.round(selectedZone.capacity * selectedZone.density / 100).toLocaleString() + ' fans' },
                { label: 'Est. Wait Time',   value: selectedZone.status === 'congested' ? '12–18 min' : selectedZone.status === 'moderate' ? '4–7 min' : '< 2 min' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{d.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}</span>
                </div>
              ))}

              {selectedZone.status === 'congested' && (
                <div style={{ marginTop: '16px', background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '6px' }}>🤖 AI SUGGESTION</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Redirect to <strong style={{ color: 'var(--primary)' }}>Gate D</strong> — 42% capacity, &lt; 2 min wait.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Click any zone on the map to see live crowd data and AI routing suggestions.
              </p>
            </div>
          )}

          {/* All Gates List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '0.5px' }}>
              All Gates Overview
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(zone => {
                const col = STATUS_COLOR[zone.status]!;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    style={{
                      background: selectedZone?.id === zone.id ? STATUS_BG[zone.status] : 'transparent',
                      border: `1px solid ${selectedZone?.id === zone.id ? col + '40' : 'transparent'}`,
                      borderRadius: '10px', padding: '10px 12px',
                      cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                        Gate {zone.gate}
                      </span>
                      <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', fontWeight: 700, color: col }}>{zone.density}%</span>
                    </div>
                    {/* Progress bar — rendered inline so the transition fires immediately */}
                    <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '99px', width: `${zone.density}%`, background: col, transition: 'width 0.8s ease' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
