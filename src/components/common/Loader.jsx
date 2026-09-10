import React from 'react';

/**
 * Reusable Loader component supporting spinner and skeleton layouts.
 */
export function Loader({
  type = 'spinner', // 'spinner' | 'skeleton-grid' | 'fullscreen'
  count = 8,
  text = 'Loading legal movies...'
}) {
  if (type === 'fullscreen') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(245, 158, 11, 0.2)',
          borderTopColor: '#f59e0b',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite'
        }} />
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>{text}</p>
      </div>
    );
  }

  if (type === 'skeleton-grid') {
    return (
      <div className="movie-grid">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#111827',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              aspectRatio: '2/3',
              position: 'relative'
            }}
          >
            <div style={{
              flex: 1,
              backgroundColor: '#1f2937',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ height: '14px', width: '80%', backgroundColor: '#374151', borderRadius: '4px' }} />
              <div style={{ height: '10px', width: '40%', backgroundColor: '#2d3748', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      color: '#94a3b8'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '3px solid rgba(245, 158, 11, 0.2)',
        borderTopColor: '#f59e0b',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.875rem' }}>{text}</span>
    </div>
  );
}

export default Loader;
