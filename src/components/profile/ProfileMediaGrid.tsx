import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

const DEMO_MEDIA = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80',
];

export const ProfileMediaGrid: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text,
          }}
        >
          Shared Media & Files
        </span>
        <span style={{ fontSize: 12, color: theme.colors.primary, cursor: 'pointer' }}>
          See all ({DEMO_MEDIA.length})
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        {DEMO_MEDIA.map((src, idx) => (
          <div
            key={idx}
            style={{
              aspectRatio: '1 / 1',
              borderRadius: theme.borderRadius.md,
              overflow: 'hidden',
              backgroundColor: theme.colors.surfaceElevated,
              cursor: 'pointer',
            }}
          >
            <img
              src={src}
              alt={`Media ${idx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
