import React from 'react';
import { useMovieContext } from '../../context/MovieContext';
import { AlertCircle } from 'lucide-react';

export function PageContainer({
  children,
  maxWidth = 'var(--container-max-width, 1440px)',
  className = '',
  style = {}
}) {
  const { sourceErrors } = useMovieContext();

  const hasAnyErrors = sourceErrors && Object.values(sourceErrors).some(Boolean);

  return (
    <main
      className={`freeflix-page-container ${className}`}
      style={{
        maxWidth,
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem 1.5rem',
        minHeight: 'calc(100vh - var(--navbar-height, 72px) - 260px)',
        width: '100%',
        ...style
      }}
    >
      {/* Graceful non-crashing banner when any external source has temporary issues */}
      {hasAnyErrors && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          color: '#fef08a',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span>
            <strong>Notice:</strong> Some external movie sources are temporarily slow or unavailable. Results from available public domain archives remain fully accessible.
          </span>
        </div>
      )}
      {children}
    </main>
  );
}

export default PageContainer;
