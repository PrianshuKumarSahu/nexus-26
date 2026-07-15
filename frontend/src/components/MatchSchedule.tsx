import { useState, useMemo } from 'react';

interface Match {
  id: string;
  team1: { name: string; flag: string; code: string };
  team2: { name: string; flag: string; code: string };
  stage: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: 'live' | 'upcoming' | 'finished';
  score?: { t1: number; t2: number };
}

const MATCHES: Match[] = [
  {
    id: '1',
    team1: { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
    team2: { name: 'France',    flag: '🇫🇷', code: 'FRA' },
    stage: 'Final', date: 'July 19, 2026', time: '20:00',
    venue: 'MetLife Stadium', city: 'New York', status: 'live', score: { t1: 2, t2: 1 },
  },
  {
    id: '2',
    team1: { name: 'Brazil',  flag: '🇧🇷', code: 'BRA' },
    team2: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
    stage: 'Semi-Final', date: 'July 15, 2026', time: '17:00',
    venue: 'SoFi Stadium', city: 'Los Angeles', status: 'finished', score: { t1: 2, t2: 1 },
  },
  {
    id: '3',
    team1: { name: 'Spain',   flag: '🇪🇸', code: 'ESP' },
    team2: { name: 'Germany', flag: '🇩🇪', code: 'GER' },
    stage: '3rd Place', date: 'July 18, 2026', time: '15:00',
    venue: 'AT&T Stadium', city: 'Dallas', status: 'upcoming',
  },
  {
    id: '4',
    team1: { name: 'Morocco', flag: '🇲🇦', code: 'MAR' },
    team2: { name: 'USA',     flag: '🇺🇸', code: 'USA' },
    stage: 'Quarter-Final', date: 'July 11, 2026', time: '18:00',
    venue: 'Rose Bowl',    city: 'Los Angeles', status: 'finished', score: { t1: 1, t2: 3 },
  },
  {
    id: '5',
    team1: { name: 'Japan',   flag: '🇯🇵', code: 'JPN' },
    team2: { name: 'Nigeria', flag: '🇳🇬', code: 'NGA' },
    stage: 'Group A', date: 'June 28, 2026', time: '14:00',
    venue: 'Levi\'s Stadium', city: 'San Francisco', status: 'finished', score: { t1: 3, t2: 0 },
  },
];

/**
 * Match schedule component with live score display, tournament stage pills,
 * and venue information cards.
 */
export default function MatchSchedule() {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');

  const filtered = useMemo(() => MATCHES.filter(m => filter === 'all' || m.status === filter), [filter]);

  const statusColor: Record<string, string> = {
    live:     'var(--red)',
    upcoming: 'var(--cyan)',
    finished: 'var(--text-muted)',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div className="animate-fadeinup" style={{ marginBottom: '32px' }}>
        <div className="section-eyebrow">FIFA World Cup 2026</div>
        <h2 style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900,
          fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: '8px',
        }}>
          MATCH <span className="gradient-text-gold">SCHEDULE</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Live scores, upcoming fixtures, and match results
        </p>
      </div>

      {/* Filter */}
      <div className="animate-fadeinup delay-100" style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {(['all', 'live', 'upcoming', 'finished'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={f === filter ? 'btn-primary' : 'btn-glass'}
            style={{ padding: '8px 18px', fontSize: '13px', textTransform: 'capitalize', borderRadius: '8px' }}
          >
            {f === 'live' ? '🔴 Live' : f === 'upcoming' ? '🔵 Upcoming' : f === 'finished' ? '✅ Finished' : '📋 All Matches'}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((match, i) => (
          <div
            key={match.id}
            className={`glass-card animate-fadeinup delay-${(i + 1) * 100}`}
            style={{
              padding: '28px 32px',
              borderColor: match.status === 'live' ? 'rgba(255,71,87,0.3)' : 'var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Live pulse bar */}
            {match.status === 'live' && (
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: 'var(--red)', animation: 'pulse-glow 2s infinite',
              }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className="badge" style={{
                background: match.status === 'live' ? 'rgba(255,71,87,0.15)' :
                  match.status === 'upcoming' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                color: statusColor[match.status]!,
                border: `1px solid ${statusColor[match.status]!}40`,
              }}>
                {match.status === 'live' ? '🔴 LIVE' : match.status === 'upcoming' ? '⏳ UPCOMING' : '✅ FINAL'}
              </span>
              <span className="badge badge-gold">{match.stage}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                📅 {match.date} · ⏰ {match.time} local
              </span>
            </div>

            {/* Scoreboard */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              {/* Team 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '120px' }}>
                <span style={{ fontSize: '48px', lineHeight: 1 }}>{match.team1.flag}</span>
                <div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)' }}>{match.team1.code}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{match.team1.name}</div>
                </div>
              </div>

              {/* Score / VS */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                {match.score ? (
                  <div style={{
                    fontFamily: "'Orbitron', monospace", fontWeight: 900,
                    fontSize: '40px',
                    color: match.status === 'live' ? 'var(--gold)' : 'var(--text-primary)',
                    letterSpacing: '4px',
                    textShadow: match.status === 'live' ? '0 0 20px var(--gold-glow)' : 'none',
                  }}>
                    {match.score.t1} : {match.score.t2}
                  </div>
                ) : (
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', color: 'var(--text-muted)', letterSpacing: '4px' }}>VS</div>
                )}
                {match.status === 'live' && (
                  <div style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', marginTop: '4px' }}>
                    🔴 68' — 2nd HALF
                  </div>
                )}
              </div>

              {/* Team 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, justifyContent: 'flex-end', minWidth: '120px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)' }}>{match.team2.code}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{match.team2.name}</div>
                </div>
                <span style={{ fontSize: '48px', lineHeight: 1 }}>{match.team2.flag}</span>
              </div>
            </div>

            {/* Venue */}
            <div className="divider" style={{ margin: '20px 0 14px' }} />
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>🏟️ {match.venue}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📍 {match.city}</span>
              {match.status === 'upcoming' && (
                <span className="badge badge-cyan" style={{ marginLeft: 'auto' }}>🎟 Get Directions</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
