import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { loginWithGoogle, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    try {
      await loginWithGoogle();
      navigate(ROUTES.HOME);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in with Google.');
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
            margin: '0 0 8px 0',
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
            margin: '0 0 32px 0',
            textAlign: 'center',
            opacity: 0.7,
          }}
        >
          Sign in with your Google account to get started
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

        {/* Footer info */}
        <p
          style={{
            marginTop: 32,
            fontSize: 11.5,
            color: theme.colors.textMuted,
            textAlign: 'center',
            opacity: 0.6,
            lineHeight: 1.5,
          }}
        >
          By signing in, you agree to AuraChat's Terms of Service.
          <br />
          Your messages are end-to-end encrypted.
        </p>
      </div>
    </div>
  );
};
