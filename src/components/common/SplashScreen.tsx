import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles, Shield, HardDrive, Zap, ChevronRight } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

interface SplashScreenProps {
  onFinish?: () => void;
  isLoading?: boolean;
  minDuration?: number; // Minimum display time in ms (default 2200ms)
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  isLoading = false,
  minDuration = 2200,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation states
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Initializing secure channels...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  // 3D tilt state based on mouse/touch movement
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Progress and loading simulation synced with actual auth state
  useEffect(() => {
    const startTime = Date.now();

    const statusSteps = [
      { at: 25, text: 'Connecting to Google Drive (5TB Cloud)...' },
      { at: 55, text: 'Verifying end-to-end security...' },
      { at: 80, text: 'Synchronizing real-time conversations...' },
      { at: 98, text: 'Welcome to AuraChat' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = Date.now() - startTime;
        const progressByTime = Math.min((elapsed / minDuration) * 100, 95);

        // Update status text based on progress
        const currentStep = [...statusSteps].reverse().find((s) => progressByTime >= s.at);
        if (currentStep) {
          setStatusText(currentStep.text);
        }

        // If auth finished loading and min duration has passed
        if (!isLoading && elapsed >= minDuration) {
          clearInterval(interval);
          setStatusText('Ready!');
          setProgress(100);
          setTimeout(() => {
            handleComplete();
          }, 450);
          return 100;
        }

        return Math.max(prev, Math.floor(progressByTime));
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isLoading, minDuration]);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish?.();
    }, 500);
  };

  // Interactive mouse move for 3D tilt & cursor glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setMousePos({ x: percentX, y: percentY });

    // Calculate subtle 3D tilt (-12deg to +12deg)
    const tiltX = ((y / rect.height) - 0.5) * -16;
    const tiltY = ((x / rect.width) - 0.5) * 16;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  // Interactive touch move for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const tiltX = ((y / rect.height) - 0.5) * -14;
    const tiltY = ((x / rect.width) - 0.5) * 14;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Trigger interactive aura pulse on click/tap
  const triggerAuraBurst = () => {
    setBurstActive(true);
    setBurstCount((prev) => prev + 1);
    setTimeout(() => setBurstActive(false), 700);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0B0F19',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        overflow: 'hidden',
        cursor: 'default',
        userSelect: 'none',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes auraFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes auraPulseRing {
          0% { transform: scale(0.92); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(0.92); opacity: 0.8; }
        }
        @keyframes auraSpinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmerGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes burstWave {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>

      {/* Ambient Radial Spotlight following cursor */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle 420px at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.18), transparent 75%)`,
          transition: 'background 0.15s ease-out',
        }}
      />

      {/* Decorative Background Aura Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '55vw',
          maxWidth: 550,
          height: '55vw',
          maxHeight: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(79, 70, 229, 0.05) 50%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-12%',
          right: '5%',
          width: '50vw',
          maxWidth: 500,
          height: '50vw',
          maxHeight: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)',
          filter: 'blur(65px)',
          pointerEvents: 'none',
        }}
      />

      {/* Central Interactive Content Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          maxWidth: 420,
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 10,
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.12s ease-out',
        }}
      >
        {/* INTERACTIVE GLOWING AURA ICON */}
        <div
          onClick={triggerAuraBurst}
          role="button"
          tabIndex={0}
          title="Click to pulse Aura!"
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            cursor: 'pointer',
            animation: 'auraFloat 4s ease-in-out infinite',
            outline: 'none',
          }}
        >
          {/* Animated Outermost Pulsating Aura Ring */}
          <div
            style={{
              position: 'absolute',
              width: 155,
              height: 155,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(236, 72, 153, 0.15) 60%, transparent 80%)',
              animation: 'auraPulseRing 3s ease-in-out infinite',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />

          {/* Rotating Dashed Aura Orbit */}
          <div
            style={{
              position: 'absolute',
              width: 132,
              height: 132,
              borderRadius: '50%',
              border: '2px dashed rgba(165, 180, 252, 0.35)',
              animation: 'auraSpinSlow 16s linear infinite',
              pointerEvents: 'none',
            }}
          />

          {/* Burst Wave when tapped/clicked */}
          {burstActive && (
            <div
              key={burstCount}
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '3px solid rgba(236, 72, 153, 0.85)',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.9)',
                animation: 'burstWave 0.65s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Central 3D Glassmorphic Icon Badge */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: burstActive
                ? '0 0 50px rgba(236, 72, 153, 0.8), 0 20px 45px rgba(99, 102, 241, 0.7)'
                : '0 16px 40px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.25) inset',
              transform: burstActive ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glossy top-light reflection */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, transparent 100%)',
                borderRadius: '28px 28px 80px 80px',
              }}
            />

            {/* Glowing Message Icon */}
            <MessageSquare size={44} strokeWidth={2.4} style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }} />

            {/* Sparkling Star Badge */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: '#FFFFFF',
                borderRadius: '50%',
                padding: 3,
                boxShadow: '0 0 12px #FFFFFF',
              }}
            >
              <Sparkles size={11} color="#EC4899" />
            </div>
          </div>
        </div>

        {/* Brand Name with Aura Gradient */}
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            margin: '0 0 6px 0',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #C7D2FE 70%, #F472B6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            textShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
          }}
        >
          AuraChat
        </h1>

        {/* Brand Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#818CF8',
              opacity: 0.95,
            }}
          >
            Encrypted
          </span>
          <span style={{ color: '#475569', fontSize: 11 }}>•</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#C084FC',
              opacity: 0.95,
            }}
          >
            Real-Time
          </span>
          <span style={{ color: '#475569', fontSize: 11 }}>•</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#F472B6',
              opacity: 0.95,
            }}
          >
            5TB Cloud
          </span>
        </div>

        {/* Interactive Feature Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              fontSize: 11.5,
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Shield size={12} color="#10B981" />
            <span>End-to-End Secure</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              fontSize: 11.5,
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
            }}
          >
            <HardDrive size={12} color="#38BDF8" />
            <span>5TB Drive Sync</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              fontSize: 11.5,
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Zap size={12} color="#F59E0B" />
            <span>Instant Delivery</span>
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 280,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              height: 4,
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)',
                borderRadius: 8,
                transition: 'width 0.25s ease-out',
                boxShadow: '0 0 12px rgba(236, 72, 153, 0.65)',
              }}
            />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <p
          style={{
            fontSize: 12,
            color: '#94A3B8',
            margin: '0 0 20px 0',
            textAlign: 'center',
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span>{statusText}</span>
        </p>

        {/* Touch prompt hint or Skip Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 6,
          }}
        >
          <button
            type="button"
            onClick={triggerAuraBurst}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: 11.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 16,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#A5B4FC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Sparkles size={12} />
            <span>Tap logo for Aura Pulse</span>
          </button>

          {!isLoading && (
            <button
              type="button"
              onClick={handleComplete}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#A5B4FC',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 14px',
                borderRadius: 20,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                e.currentTarget.style.color = '#A5B4FC';
              }}
            >
              <span>Continue</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          opacity: 0.65,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#64748B',
            letterSpacing: '0.04em',
          }}
        >
          AuraChat Ecosystem • v1.0.0
        </span>
      </div>
    </div>
  );
};
