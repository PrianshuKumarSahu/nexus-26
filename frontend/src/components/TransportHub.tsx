import { useState } from 'react';

interface TransportOption {
  id: string;
  type: 'metro' | 'bus' | 'shuttle' | 'rideshare' | 'walk';
  name: string;
  duration: string;
  distance: string;
  departures: string[];
  crowdLevel: 'low' | 'moderate' | 'high';
  icon: string;
  color: string;
  eco: boolean;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    id: 'metro',   type: 'metro',     name: 'Metro Line 7 — Blue',
    duration: '22 min', distance: '14.2 km',
    departures: ['14:30', '14:45', '15:00', '15:15'],
    crowdLevel: 'moderate', icon: '🚇', color: '#3b82f6', eco: true,
  },
  {
    id: 'shuttle', type: 'shuttle',   name: 'Official FIFA Shuttle #7',
    duration: '18 min', distance: '12.8 km',
    departures: ['14:40', '15:10', '15:40', '16:10'],
    crowdLevel: 'low', icon: '🚌', color: 'var(--primary)', eco: true,
  },
  {
    id: 'bus',     type: 'bus',       name: 'City Express Bus 204',
    duration: '35 min', distance: '14.5 km',
    departures: ['14:25', '14:55', '15:25'],
    crowdLevel: 'low', icon: '🚎', color: '#a78bfa', eco: true,
  },
  {
    id: 'rideshare', type: 'rideshare', name: 'Ride Share Drop Zone',
    duration: '28 min', distance: '13.1 km',
    departures: ['On demand', '5–12 min wait'],
    crowdLevel: 'high', icon: '🚗', color: '#fb923c', eco: false,
  },
  {
    id: 'walk', type: 'walk',   name: 'Pedestrian Green Route',
    duration: '45 min', distance: '3.8 km',
    departures: ['Any time'],
    crowdLevel: 'low', icon: '🚶', color: 'var(--gold)', eco: true,
  },
];

const CROWD_COLOR: Record<string, string> = {
  low:      'var(--primary)',
  moderate: '#ffbe0b',
  high:     'var(--red)',
};

/**
 * AI-powered transport hub showing shuttle timings, metro routes, and eco-friendly options.
 */
export default function TransportHub() {
  const [selected, setSelected] = useState<TransportOption>(TRANSPORT_OPTIONS[1]!);
  const [from, setFrom] = useState('SoFi Stadium — South Exit');
  const [to, setTo] = useState('Downtown LA — 7th/Metro Center');
  const [aiTip, setAiTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  const getAITransportTip = async () => {
    setLoadingTip(true);
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Best transport from ${from} to ${to} after the match`, role: 'fan', language: 'en' }),
      });
      const data = await res.json();
      setAiTip(data.response);
    } catch {
      setAiTip('🚌 We recommend the Official FIFA Shuttle #7 — least congested right now with only a 4-minute wait from South Plaza.');
    } finally {
      setLoadingTip(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fadeinup" style={{ marginBottom: '32px' }}>
        <div className="section-eyebrow">AI Transport Planner</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: '8px' }}>
          TRANSPORT <span style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HUB</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Real-time routes with crowd levels and AI route suggestions
        </p>
      </div>

      {/* Route Planner */}
      <div className="glass-card animate-fadeinup delay-100" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '0.5px' }}>
          🗺️ Plan Your Route
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>From</label>
            <input className="input-field" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>To</label>
            <input className="input-field" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <button className="btn-primary" aria-label="Generate AI transport tip" onClick={getAITransportTip} disabled={loadingTip} style={{ padding: '12px 24px', whiteSpace: 'nowrap', opacity: loadingTip ? 0.6 : 1, flexShrink: 0 }}>
            {loadingTip ? '⏳ Loading...' : '🤖 AI Plan'}
          </button>
        </div>

        {/* AI Tip */}
        {aiTip && (
          <div aria-live="polite" style={{
            marginTop: '20px', background: 'rgba(0,230,118,0.06)',
            border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '8px' }}>🤖 AI RECOMMENDATION</div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{aiTip}</p>
          </div>
        )}
      </div>

      {/* Transport Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {TRANSPORT_OPTIONS.map((opt, i) => (
          <div
            key={opt.id}
            className={`feature-card animate-fadeinup delay-${(i + 1) * 100}`}
            onClick={() => setSelected(opt)}
            style={{
              borderColor: selected.id === opt.id ? opt.color + '60' : 'var(--border)',
              background: selected.id === opt.id ? `${opt.color}08` : 'var(--bg-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${opt.color}15`, border: `1px solid ${opt.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                }}>
                  {opt.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>{opt.name}</div>
                  <div style={{ fontSize: '12px', color: CROWD_COLOR[opt.crowdLevel]!, fontWeight: 600 }}>
                    ● {opt.crowdLevel.charAt(0).toUpperCase() + opt.crowdLevel.slice(1)} crowd
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                {opt.eco && <span className="badge badge-green">♻️ Eco</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '18px', color: opt.color }}>{opt.duration}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px' }}>Duration</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>{opt.distance}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px' }}>Distance</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {opt.departures.slice(0, 3).map(d => (
                <span key={d} className="badge" style={{ background: `${opt.color}12`, color: opt.color, border: `1px solid ${opt.color}25`, fontSize: '10px' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected route detail */}
      <div className="glass-card animate-fadein" style={{ padding: '28px', borderColor: `${selected.color}40` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{selected.icon}</span>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)' }}>{selected.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Next departure</div>
            </div>
          </div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '32px', color: selected.color }}>
            {selected.departures[0]}
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {selected.departures.map((d, i) => (
            <div key={i} style={{
              background: i === 0 ? `${selected.color}15` : 'var(--surface)',
              border: `1px solid ${i === 0 ? selected.color + '40' : 'var(--border)'}`,
              borderRadius: '10px', padding: '10px 16px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '16px', color: i === 0 ? selected.color : 'var(--text-primary)' }}>{d}</div>
              {i === 0 && <div style={{ fontSize: '10px', color: 'var(--primary)', marginTop: '2px', fontWeight: 600 }}>NEXT</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
