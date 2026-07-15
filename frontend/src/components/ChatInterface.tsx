import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  role: 'fan' | 'staff';
}

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
  { code: 'zh', label: '中文',        flag: '🇨🇳' },
];

const QUICK_QUERIES = [
  { label: '🚦 Avoid crowds',    text: 'Which gate has the least crowd right now?' },
  { label: '🍔 Find food',       text: 'Where can I find halal food near my section?' },
  { label: '⚽ Match time',      text: 'When does the next match kick off?' },
  { label: '🚌 Transport',       text: 'How do I get to the nearest metro station?' },
  { label: '♿ Accessibility',   text: 'What is the accessible route to Section 114?' },
  { label: '🆘 Emergency help',  text: 'Where is the nearest medical station?' },
];

/**
 * Fully redesigned AI chat interface with multilingual support, quick queries,
 * typing indicator, and smooth message animations.
 */
export default function ChatInterface({ role }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: role === 'fan'
        ? "👋 Welcome to **FIFA 26 Smart Assist**! I'm your AI guide for the World Cup experience.\n\nAsk me anything — stadium navigation, food locations, transport, accessibility routes, or match info. I speak 45+ languages! 🌍"
        : "🛡️ **Operational AI Online**\n\nI'm your real-time intelligence assistant. Ask me about crowd density, incident summaries, gate flow analysis, or resource deployment recommendations.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 500;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** Send message to backend and append AI response */
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setCharCount(0);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, role, language }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: data.response ?? 'An error occurred.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: '⚠️ Unable to reach the AI network. Please check your connection.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuery = (text: string) => {
    setInput(text);
    setCharCount(text.length);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedLang = LANGUAGE_OPTIONS.find(l => l.code === language) ?? LANGUAGE_OPTIONS[0]!;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="animate-fadeinup" style={{ marginBottom: '24px' }}>
        <div className="section-eyebrow">GenAI Multilingual Assistant</div>
        <h2 style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900,
          fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          AI <span className="gradient-text-green">ASSISTANT</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Ask anything in your language — powered by Generative AI
        </p>
      </div>

      {/* Language + Mode Row */}
      <div className="animate-fadeinup delay-100" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>LANGUAGE:</span>
          {LANGUAGE_OPTIONS.slice(0, 5).map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              style={{
                background: language === lang.code ? 'rgba(0,230,118,0.15)' : 'var(--surface)',
                border: language === lang.code ? '1px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s',
                lineHeight: 1,
              }}
              title={lang.label}
            >
              {lang.flag}
            </button>
          ))}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="select-field"
            style={{ padding: '7px 10px', fontSize: '13px' }}
          >
            {LANGUAGE_OPTIONS.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
            ))}
          </select>
        </div>

        <div className="status-live" style={{ marginLeft: 'auto' }}>
          {selectedLang.flag} {selectedLang.label} Active
        </div>
      </div>

      {/* Chat Window */}
      <div
        className="glass-card animate-fadeinup delay-200"
        style={{ height: '460px', display: 'flex', flexDirection: 'column', marginBottom: '16px' }}
      >
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 0 15px var(--primary-glow)',
            flexShrink: 0,
          }}>
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px' }}>
              MatchDay AI · FIFA 2026
            </div>
            <div className="status-live" style={{ fontSize: '11px' }}>Generative AI Online</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-green">GPT-4o Class</span>
          </div>
        </div>

        {/* Messages */}
        <div
          className="scroll-inner"
          style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          aria-live="polite"
        >
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.sender === 'ai' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', marginRight: '8px', alignSelf: 'flex-end',
                }}>🤖</div>
              )}
              <div>
                <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{msg.text}</p>
                </div>
                <div style={{
                  fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px',
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  fontFamily: "'Rajdhani', sans-serif",
                }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>🤖</div>
              <div className="chat-bubble-ai" style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); setCharCount(e.target.value.length); }}
                onKeyDown={handleKeyDown}
                placeholder={`Ask in ${selectedLang.label}... (Shift+Enter for new line)`}
                maxLength={MAX_CHARS}
                rows={1}
                className="input-field"
                style={{ resize: 'none', paddingRight: '70px', lineHeight: '1.5', minHeight: '44px', maxHeight: '120px' }}
              />
              <span style={{
                position: 'absolute', right: '10px', bottom: '10px',
                fontSize: '11px', color: charCount > MAX_CHARS * 0.9 ? 'var(--red)' : 'var(--text-muted)',
              }}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-primary"
              aria-label="Send message"
              style={{
                padding: '12px 20px',
                fontSize: '18px',
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Quick Queries */}
      <div className="animate-fadeinup delay-300">
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: "'Rajdhani', sans-serif" }}>
          Quick Queries
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {QUICK_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuery(q.text)}
              className="btn-glass"
              style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '10px' }}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
