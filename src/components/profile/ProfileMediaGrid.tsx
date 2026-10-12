import React, { useState } from 'react';
import { Image, ExternalLink, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { useChats } from '../../hooks/useChats';

export const ProfileMediaGrid: React.FC = () => {
  const { theme } = useTheme();
  const { chats } = useChats();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Collect real media attachments from all existing chats
  const mediaItems: { url: string; name?: string }[] = [];
  chats.forEach((chat) => {
    if (chat.lastMessage?.attachments) {
      chat.lastMessage.attachments.forEach((att) => {
        if (att.type === 'image' && att.url) {
          mediaItems.push({ url: att.url, name: att.name });
        }
      });
    }
  });

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
        {mediaItems.length > 0 && (
          <span style={{ fontSize: 12, color: theme.colors.primary, cursor: 'pointer' }}>
            {mediaItems.length} items
          </span>
        )}
      </div>

      {mediaItems.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}
        >
          {mediaItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item.url)}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: theme.borderRadius.md,
                overflow: 'hidden',
                backgroundColor: theme.colors.surfaceElevated,
                cursor: 'pointer',
              }}
            >
              <img
                src={item.url}
                alt={item.name || `Media ${idx + 1}`}
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
      ) : (
        <div
          style={{
            padding: '24px 16px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: theme.colors.surfaceElevated,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.textMuted,
            }}
          >
            <Image size={20} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>
            No shared media yet
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textMuted, maxWidth: 240 }}>
            Photos and documents shared in conversations will appear here.
          </div>
        </div>
      )}

      {/* Lightbox preview */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>
          <img
            src={selectedImage}
            alt="Shared Media"
            style={{
              maxWidth: '92%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
        </div>
      )}
    </div>
  );
};
