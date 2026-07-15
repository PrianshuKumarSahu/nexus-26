

type ViewType = 'home' | 'chat' | 'map' | 'schedule' | 'transport' | 'staff' | 'accessibility';

interface HeroProps {
  onNavigate: (view: ViewType) => void;
}

/**
 * Hero landing section with animated stadium visuals, stat counters, and feature cards.
 */
export default function HeroSection({ onNavigate }: HeroProps) {
  const features: { icon: string; title: string; desc: string; view: ViewType; color: string }[] = [
    { icon: '🤖', title: 'AI Assistant',    desc: 'Multilingual GenAI chatbot for fans — navigation, food, transport, and more.',          view: 'chat',          color: 'var(--primary)' },
    { icon: '🗺️', title: 'Stadium Map',     desc: 'Live crowd density heatmap with real-time gate congestion alerts.',                      view: 'map',           color: 'var(--cyan)'    },
    { icon: '⚽', title: 'Match Schedule',  desc: 'Live match info, scores, lineups and group standings for FIFA WC 2026.',                 view: 'schedule',      color: 'var(--gold)'    },
    { icon: '🚌', title: 'Transport Hub',   desc: 'AI-powered transport planner with shuttle timings, metro routes, and parking.',          view: 'transport',     color: '#a78bfa'        },
    { icon: '♿', title: 'Accessibility',   desc: 'Dedicated accessible routes, companion assist, and sensory-friendly info.',               view: 'accessibility', color: '#f472b6'        },
    { icon: '📊', title: 'Staff Dashboard', desc: 'Operational intelligence center — crowd control, incident response, and analytics.',     view: 'staff',         color: '#fb923c'        },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '96px', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,230,118,0.12) 0%, transparent 70%)', top: '-100px', left: '-200px' }} />
      <div className="hero-orb" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', top: '100px', right: '-100px', animationDelay: '3s' }} />
      <div className="hero-orb" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)', bottom: '200px', left: '30%', animationDelay: '5s' }} />

      {/* Stadium silhouette */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '120%',
        height: '50vh',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 100%,
            rgba(0,230,118,0.04) 0%,
            rgba(0,230,118,0.02) 40%,
            transparent 70%
          )
        `,
        pointerEvents: 'none',
      }} />

      {/* Stadium arch lines */}
      <svg
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', opacity: 0.07, pointerEvents: 'none' }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        {[0.55, 0.65, 0.75, 0.85].map((scale, i) => (
          <ellipse
            key={i}
            cx="600" cy="400"
            rx={600 * scale}
            ry={200 * scale}
            fill="none"
            stroke={i % 2 === 0 ? '#00e676' : '#00d4ff'}
            strokeWidth="1"
          />
        ))}
        <line x1="0" y1="400" x2="1200" y2="400" stroke="#00e676" strokeWidth="1" />
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={600} y1={400} x2={i * 80} y2={0} stroke="#00e676" strokeWidth="0.5" strokeDasharray="4 6" />
        ))}
      </svg>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Hero headline */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-eyebrow animate-fadein" style={{ justifyContent: 'center', marginBottom: '20px' }}>
            ⚽ FIFA World Cup 2026 · Powered by GenAI
          </div>

          <h1
            className="animate-fadeinup"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: 'clamp(36px, 7vw, 88px)',
              lineHeight: 1.05,
              marginBottom: '24px',
              letterSpacing: '-1px',
            }}
          >
            <span className="gradient-text-green">SMART</span>{' '}
            <span className="gradient-text-white">ASSIST</span>
          </h1>

          <p
            className="animate-fadeinup delay-200"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 'clamp(16px, 2.5vw, 22px)',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
              letterSpacing: '0.3px',
            }}
          >
            Your AI-powered companion for the biggest football tournament on Earth.
            Navigate stadiums, manage crowds, get real-time intel — in any language.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fadeinup delay-300" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }} onClick={() => onNavigate('chat')}>
              🤖 Launch AI Assistant
            </button>
            <button className="btn-glass" style={{ fontSize: '16px', padding: '14px 32px' }} onClick={() => onNavigate('map')}>
              🗺️ View Stadium Map
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="glass-card animate-fadeinup delay-400 stat-row-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0',
            marginBottom: '80px',
            padding: '0',
            overflow: 'hidden',
          }}
        >
          {[
            { display: '16',    label: 'Host Cities'    },
            { display: '48',    label: 'Teams'          },
            { display: '104',   label: 'Matches'        },
            { display: '5.6M+', label: 'Expected Fans'  },
            { display: '45+',   label: 'AI Languages'   },
            { display: '98%',   label: 'Eco Score'      },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: '28px 8px',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
                borderRight: i < 5 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 0, overflow: 'hidden',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 'clamp(18px, 2vw, 34px)',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  lineHeight: 1,
                  textShadow: '0 0 20px var(--primary-glow)',
                  whiteSpace: 'nowrap',
                }}>
                  {s.display}
                </div>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                  whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Feature Cards */}
        <div style={{ marginBottom: '80px' }}>
          <div className="section-eyebrow animate-fadein" style={{ marginBottom: '32px' }}>
            All Features
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card animate-fadeinup delay-${(i + 1) * 100}`}
                onClick={() => onNavigate(f.view)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${f.color}22, ${f.color}11)`,
                  border: `1px solid ${f.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700, fontSize: '20px',
                  color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.5px',
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
                <div style={{
                  marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', fontWeight: 600, fontFamily: "'Rajdhani', sans-serif",
                  color: f.color, letterSpacing: '0.5px',
                }}>
                  Explore <span style={{ fontSize: '16px' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom banner */}
        <div
          className="glass-card animate-fadein"
          style={{
            padding: '40px',
            marginBottom: '60px',
            background: 'linear-gradient(135deg, rgba(0,230,118,0.05), rgba(0,212,255,0.03))',
            borderColor: 'rgba(0,230,118,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '24px',
          }}
        >
          <div>
            <div className="status-live" style={{ marginBottom: '8px' }}>Live & Operational</div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: '24px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              GenAI Ready for Match Day
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '500px' }}>
              Our AI assistant handles 50,000+ fan queries per hour — across 45 languages,
              with zero wait time and 99.9% uptime.
            </p>
          </div>
          <button className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }} onClick={() => onNavigate('chat')}>
            Start a Conversation →
          </button>
        </div>
      </div>
    </div>
  );
}
