import { useState, useEffect } from 'react';

type ViewType = 'home' | 'chat' | 'map' | 'schedule' | 'transport' | 'staff' | 'accessibility';

interface NavbarProps {
  activeView: ViewType;
  role: 'fan' | 'staff';
  onNavigate: (view: ViewType) => void;
  onRoleChange: (role: 'fan' | 'staff') => void;
}

/**
 * Sticky top navigation bar with animated logo, main nav links, and role switcher.
 */
export default function Navbar({ activeView, role, onNavigate, onRoleChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const fanLinks: { id: ViewType; label: string; icon: string }[] = [
    { id: 'home',          label: 'Home',         icon: '🏟️' },
    { id: 'chat',          label: 'AI Assistant',  icon: '🤖' },
    { id: 'map',           label: 'Stadium Map',   icon: '🗺️' },
    { id: 'schedule',      label: 'Matches',       icon: '⚽' },
    { id: 'transport',     label: 'Transport',     icon: '🚌' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
  ];

  const staffLinks: { id: ViewType; label: string; icon: string }[] = [
    { id: 'home',  label: 'Home',       icon: '🏟️' },
    { id: 'staff', label: 'Operations', icon: '📊' },
    { id: 'map',   label: 'Crowd Map',  icon: '🗺️' },
  ];

  const links = role === 'fan' ? fanLinks : staffLinks;

  return (
    <nav
      style={{
        position: 'fixed',
        top: '32px', // below ticker
        left: 0, right: 0,
        zIndex: 90,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(4, 13, 26, 0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate('home')}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'none', border: 'none', cursor: 'pointer',
          textDecoration: 'none', flexShrink: 0,
        }}
      >
        <div style={{
          width: '38px', height: '38px',
          background: 'linear-gradient(135deg, var(--primary), #00b4d8)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 0 20px var(--primary-glow)',
        }}>⚽</div>
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: 900,
            fontSize: '14px',
            color: 'var(--primary)',
            letterSpacing: '1px',
          }}>SMART ASSIST</div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '2px',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>FIFA World Cup 2026</div>
        </div>
      </button>

      {/* Desktop Nav Links */}
      <div
        className="hide-mobile"
        style={{ display: 'flex', gap: '4px', alignItems: 'center', flex: 1, justifyContent: 'center' }}
      >
        {links.map(link => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              transition: 'all 0.25s',
              background: activeView === link.id ? 'rgba(0,230,118,0.12)' : 'transparent',
              color: activeView === link.id ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeView === link.id ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: '14px' }}>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </div>

      {/* Role Switcher + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div className="nav-pill hide-mobile">
          <button
            className={`nav-pill-item ${role === 'fan' ? 'active' : ''}`}
            onClick={() => { onRoleChange('fan'); onNavigate('home'); }}
          >
            👤 Fan
          </button>
          <button
            className={`nav-pill-item ${role === 'staff' ? 'active-cyan' : ''}`}
            onClick={() => { onRoleChange('staff'); onNavigate('staff'); }}
          >
            🛡️ Staff
          </button>
        </div>

        <button
          onClick={() => onNavigate('chat')}
          className="btn-primary hide-mobile"
          style={{ padding: '9px 20px', fontSize: '13px' }}
        >
          🤖 Ask AI
        </button>

        {/* Mobile hamburger — display controlled by .show-mobile CSS class */}
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="show-mobile"
          aria-label="Toggle menu"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontSize: '18px',
            lineHeight: 1,
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(4,13,26,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                background: activeView === link.id ? 'rgba(0,230,118,0.1)' : 'transparent',
                color: activeView === link.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '15px',
              }}
            >
              {link.icon} {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
