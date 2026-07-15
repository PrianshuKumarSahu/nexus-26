/**
 * LiveTicker - Scrolling live updates bar shown at the top of every page.
 * Displays real-time stadium stats, alerts, and match info.
 */
export default function LiveTicker() {
  const items = [
    '🟢 GATE A — Normal Flow — 45% Capacity',
    '🟡 GATE C — Moderate Congestion — 72% Capacity',
    '⚽ ARG vs FRA — KICKOFF in 2h 15min',
    '🚌 Shuttle Bus #7 — Next departure: 14:45 from South Plaza',
    '🌡️ Stadium Temperature: 24°C | Humidity: 60%',
    '♿ Accessible Route: Level 2 West Ramp is Clear',
    '🍔 Food Court B — 8 min avg wait time',
    '🟢 GATE B — Normal Flow — 38% Capacity',
    '🌍 Multilingual Assistance: AI Chat Available in 45+ Languages',
    '♻️ Sustainability: 92% of Waste Recycled Today',
    '⚽ BRA vs ENG — Full Time: 2 — 1',
    '🚨 Medical Station 3 — Level 1 East — Open 24/7',
  ];

  const doubledItems = [...items, ...items];

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #071224 0%, #0d2040 50%, #071224 100%)',
        borderBottom: '1px solid rgba(0,230,118,0.2)',
        padding: '8px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Green accent line */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--primary)' }} />

      <div className="ticker-wrap">
        <div className="ticker-track">
          {doubledItems.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: '12px',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                color: 'rgba(232, 244, 255, 0.75)',
                letterSpacing: '0.5px',
              }}
            >
              {item}
              <span style={{ marginLeft: '60px', color: 'var(--primary)', opacity: 0.5 }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* LIVE badge */}
      <div
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'var(--primary)',
          color: '#000',
          fontSize: '10px',
          fontWeight: 900,
          fontFamily: "'Orbitron', monospace",
          padding: '3px 8px',
          borderRadius: '4px',
          letterSpacing: '1px',
          zIndex: 10,
        }}
      >
        LIVE
      </div>
    </div>
  );
}
