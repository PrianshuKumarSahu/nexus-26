import React, { useState, useCallback, useMemo } from 'react';
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
 *
 * @returns The full application layout including navbar, ticker, and active view.
 */
function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [role, setRole] = useState<'fan' | 'staff'>('fan');

  /**
   * Navigates to the specified view and updates the role context accordingly.
   * Staff view sets role to 'staff'; all other views set role to 'fan'.
   *
   * @param view - The target view to navigate to.
   */
  const navigateTo = useCallback((view: ViewType): void => {
    setActiveView(view);
    if (view === 'staff') setRole('staff');
    else setRole('fan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Renders the component for the currently active view.
   * Memoised to prevent unnecessary re-renders when unrelated state changes.
   */
  const renderedView = useMemo((): React.JSX.Element => {
    switch (activeView) {
      case 'home':          return <HeroSection onNavigate={navigateTo} />;
      case 'chat':          return <ChatInterface role={role} />;
      case 'map':           return <StadiumMap />;
      case 'schedule':      return <MatchSchedule />;
      case 'transport':     return <TransportHub />;
      case 'staff':         return <StaffDashboard />;
      case 'accessibility': return <AccessibilityPanel />;
      default:              return <HeroSection onNavigate={navigateTo} />;
    }
  }, [activeView, role, navigateTo]);

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
        {renderedView}
      </main>
    </div>
  );
}

export default App;
