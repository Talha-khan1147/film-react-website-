import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Friendly error message banner / box.
 */
export function ErrorMessage({
  title = 'Something went wrong',
  message = 'Some movie sources are temporarily unavailable or experienced a delay.',
  onRetry = null,
  compact = false
}) {
  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        color: '#fca5a5',
        fontSize: '0.875rem',
        margin: '0.75rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{message}</span>
        </div>
        {onRetry && (
          <Button size="sm" variant="ghost" onClick={onRetry} icon={RefreshCw}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2.5rem 1.5rem',
      backgroundColor: 'rgba(17, 24, 39, 0.7)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: '12px',
      margin: '2rem 0',
      maxWidth: '560px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f87171',
        marginBottom: '1rem'
      }}>
        <AlertCircle size={26} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#f8fafc' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
