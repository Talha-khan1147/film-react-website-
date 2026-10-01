import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from '../common/OfflineBanner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme, mode } = useTheme();

  // Track window width for real mobile screens
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 640 : false;
  });

  // Default to phone frame on desktop for authentic mobile chat aesthetic, but allow toggle
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Time for simulated mobile status bar
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // If on actual mobile screen, always render native full screen without outer frame
  const showChassis = useDeviceFrame && !isMobileScreen;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isMobileScreen
          ? theme.colors.background
          : mode === 'dark'
          ? '#060911'
          : '#E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.typography.fontFamily.sans,
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Device Frame Viewport Toggle for Desktop Reviewers only */}
      {!isMobileScreen && (
        <aside
          aria-label="Viewport Mode"
          style={{
            position: 'fixed',
            top: 14,
            right: 14,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.full,
            padding: '4px 8px',
            boxShadow: theme.shadows.md,
          }}
        >
          <button
            type="button"
            onClick={() => setUseDeviceFrame(true)}
            title="Mobile Phone Frame View"
            style={{
              background: useDeviceFrame ? theme.colors.primary : 'transparent',
              color: useDeviceFrame ? '#FFFFFF' : theme.colors.textMuted,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              padding: '5px 11px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease',
            }}
          >
            <Smartphone size={14} />
            <span>Phone</span>
          </button>

          <button
            type="button"
            onClick={() => setUseDeviceFrame(false)}
            title="Responsive Full Window View"
            style={{
              background: !useDeviceFrame ? theme.colors.primary : 'transparent',
              color: !useDeviceFrame ? '#FFFFFF' : theme.colors.textMuted,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              padding: '5px 11px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease',
            }}
          >
            <Monitor size={14} />
            <span>Full</span>
          </button>
        </aside>
      )}

      {/* Main Application Container */}
      <div
        style={{
          width: '100%',
          maxWidth: showChassis ? 430 : isMobileScreen ? '100%' : 760,
          height: showChassis ? '94vh' : '100vh',
          maxHeight: showChassis ? 890 : 'none',
          backgroundColor: theme.colors.background,
          borderRadius: showChassis ? 40 : 0,
          border: showChassis
            ? `10px solid ${mode === 'dark' ? '#1E293B' : '#CBD5E1'}`
            : 'none',
          boxShadow: showChassis
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.06)'
            : 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* Simulated Mobile Status Bar in Desktop Phone Frame mode */}
        {showChassis && (
          <div
            style={{
              height: 32,
              backgroundColor: theme.colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px',
              fontSize: 11,
              fontWeight: 600,
              color: theme.colors.text,
              flexShrink: 0,
              userSelect: 'none',
              zIndex: 60,
              borderBottom: `1px solid ${theme.colors.borderLight}`,
            }}
          >
            <span>{currentTime}</span>

            {/* Dynamic Island / Notch capsule */}
            <div
              style={{
                width: 96,
                height: 14,
                backgroundColor: '#000000',
                borderRadius: theme.borderRadius.full,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={13} />
            </div>
          </div>
        )}

        {/* Offline notification banner if network drops */}
        <OfflineBanner />

        {/* Route Screen Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
