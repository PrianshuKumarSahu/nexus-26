import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ChatInterface from './components/ChatInterface';
import StadiumMap from './components/StadiumMap';
import MatchSchedule from './components/MatchSchedule';
import TransportHub from './components/TransportHub';
import StaffDashboard from './components/StaffDashboard';
import AccessibilityPanel from './components/AccessibilityPanel';
import LiveTicker from './components/LiveTicker';

/** Application views */
type ViewType = 'home' | 'chat' | 'map' | 'schedule' | 'transport' | 'staff' | 'accessibility';

/**
 * Root application component.
 * Manages top-level view routing between fan and staff modes.
 */
function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [role, setRole] = useState<'fan' | 'staff'>('fan');

  /** Navigate to a view and update the role context if needed */
  const navigateTo = useCallback((view: ViewType) => {
    setActiveView(view);
    if (view === 'staff') setRole('staff');
    else setRole('fan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'home':         return <HeroSection onNavigate={navigateTo} />;
      case 'chat':         return <ChatInterface role={role} />;
      case 'map':          return <StadiumMap />;
      case 'schedule':     return <MatchSchedule />;
      case 'transport':    return <TransportHub />;
      case 'staff':        return <StaffDashboard />;
      case 'accessibility':return <AccessibilityPanel />;
      default:             return <HeroSection onNavigate={navigateTo} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <LiveTicker />
      <Navbar
        activeView={activeView}
        role={role}
        onNavigate={navigateTo}
        onRoleChange={setRole}
      />
      <main style={{ paddingTop: activeView === 'home' ? '0' : '80px' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
