import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { PrimaryButton } from './PrimaryButton';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: theme.borderRadius.full,
          backgroundColor: `${theme.colors.error}1A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.error,
          marginBottom: 16,
        }}
      >
        <AlertCircle size={28} />
      </div>

      <h4
        style={{
          fontSize: 16,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text,
          margin: '0 0 8px 0',
        }}
      >
        Unable to load content
      </h4>

      <p
        style={{
          fontSize: 13,
          color: theme.colors.textMuted,
          maxWidth: 280,
          margin: '0 0 20px 0',
          lineHeight: 1.4,
        }}
      >
        {message}
      </p>

      {onRetry && <PrimaryButton label="Try Again" onClick={onRetry} size="sm" />}
    </div>
  );
};
