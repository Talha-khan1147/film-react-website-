import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { loginWithGoogle, loginQuickTest, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [customName, setCustomName] = useState('');

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    try {
      const profile = await loginWithGoogle();
      if (profile && profile.isProfileComplete === false) {
        navigate(ROUTES.SETUP_PROFILE, { replace: true });
      } else if (profile) {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in with Google.');
    }
  };

  const handleQuickLogin = async () => {
    setErrorMessage('');
    try {
      const profile = await loginQuickTest(customName.trim() || undefined);
      if (profile && profile.isProfileComplete === false) {
        navigate(ROUTES.SETUP_PROFILE, { replace: true });
      } else if (profile) {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start session.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        width: '100%',
        padding: '24px 20px 40px 20px',
        backgroundColor: theme.colors.background,
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo & Heading */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: theme.colors.primaryGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 12px 30px rgba(99, 102, 241, 0.45)',
            marginBottom: 24,
          }}
        >
          <MessageSquare size={40} />
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
            margin: '0 0 8px 0',
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome to AuraChat
        </h1>

        <p
          style={{
            fontSize: 14,
            color: theme.colors.textMuted,
            margin: '0 0 6px 0',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Fast, beautiful, and secure real-time messaging
        </p>

        <p
          style={{
            fontSize: 12.5,
            color: theme.colors.textMuted,
            margin: '0 0 28px 0',
            textAlign: 'center',
            opacity: 0.7,
          }}
        >
          Connect with Google or start an instant chat session
        </p>

        {/* Error Alert Box */}
        {errorMessage && (
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: `${theme.colors.error}18`,
              border: `1px solid ${theme.colors.error}40`,
              borderRadius: theme.borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: theme.colors.error,
              fontSize: 13,
              marginBottom: 20,
              boxSizing: 'border-box',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            height: 52,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.surfaceElevated,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text,
            fontSize: 15,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            opacity: isLoading ? 0.7 : 1,
            marginBottom: 14,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.surfaceElevated;
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: '8px 0 14px 0',
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
          <span style={{ fontSize: 12, color: theme.colors.textMuted }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
        </div>

        {/* Quick Instant Session / Mobile Direct Sign-in */}
        {!showQuickInput ? (
          <button
            type="button"
            onClick={() => setShowQuickInput(true)}
            disabled={isLoading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.primary}50`,
              color: theme.colors.primary,
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Zap size={17} />
            <span>Instant Test / Mobile Sign In</span>
          </button>
        ) : (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 14,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <input
              type="text"
              placeholder="Enter your name (e.g. John)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickLogin()}
              style={{
                width: '100%',
                height: 42,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.surfaceElevated,
                color: theme.colors.text,
                padding: '0 12px',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                height: 42,
                borderRadius: theme.borderRadius.md,
                background: theme.colors.primaryGradient,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Zap size={16} />
              <span>{isLoading ? 'Creating Session...' : 'Continue to AuraChat'}</span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <p
          style={{
            marginTop: 28,
            fontSize: 11.5,
            color: theme.colors.textMuted,
            textAlign: 'center',
            opacity: 0.7,
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={14} color={theme.colors.primary} />
          <span>End-to-end encrypted • Zero static data</span>
        </p>
      </div>
    </div>
  );
};
