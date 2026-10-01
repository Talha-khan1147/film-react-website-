import React, { useState } from 'react';
import { Image, Type, Check, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { useTheme } from '../../theme/ThemeProvider';

interface StoryCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostStory: (params: {
    mediaUrl?: string;
    mediaType: 'image' | 'video' | 'text-card';
    backgroundColor?: string;
    caption?: string;
  }) => void;
}

const COLOR_PRESETS = [
  '#6366F1',
  '#EC4899',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#0F172A',
  'linear-gradient(135deg, #6366F1, #EC4899)',
  'linear-gradient(135deg, #3B82F6, #10B981)',
];

const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
];

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({
  isOpen,
  onClose,
  onPostStory,
}) => {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'text' | 'photo'>('text');
  const [caption, setCaption] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(PHOTO_PRESETS[0]);

  const handlePost = () => {
    if (tab === 'text') {
      if (!caption.trim()) return;
      onPostStory({
        mediaType: 'text-card',
        backgroundColor: selectedColor,
        caption: caption.trim(),
      });
    } else {
      onPostStory({
        mediaType: 'image',
        mediaUrl: selectedPhoto,
        caption: caption.trim() || undefined,
      });
    }
    setCaption('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Story" maxWidth={420}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Tab switcher: Text vs Photo */}
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.colors.surfaceHover,
            padding: 4,
            borderRadius: theme.borderRadius.lg,
          }}
        >
          <button
            type="button"
            onClick={() => setTab('text')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              backgroundColor: tab === 'text' ? theme.colors.surface : 'transparent',
              color: tab === 'text' ? theme.colors.text : theme.colors.textMuted,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: tab === 'text' ? theme.shadows.sm : 'none',
            }}
          >
            <Type size={16} />
            <span>Text Card</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('photo')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              backgroundColor: tab === 'photo' ? theme.colors.surface : 'transparent',
              color: tab === 'photo' ? theme.colors.text : theme.colors.textMuted,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: tab === 'photo' ? theme.shadows.sm : 'none',
            }}
          >
            <Image size={16} />
            <span>Photo Story</span>
          </button>
        </div>

        {/* Live Preview Box */}
        <div
          style={{
            height: 200,
            borderRadius: theme.borderRadius.xl,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: tab === 'text' ? selectedColor : '#111827',
            boxShadow: theme.shadows.md,
          }}
        >
          {tab === 'photo' && (
            <img
              src={selectedPhoto}
              alt="Story preview"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Dark gradient in photo mode */}
          {tab === 'photo' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)',
              }}
            />
          )}

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              color: '#FFFFFF',
              fontSize: tab === 'text' ? 18 : 14,
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.4,
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              maxWidth: '90%',
            }}
          >
            {caption || (tab === 'text' ? 'Type your thought or quote below...' : 'Add a caption...')}
          </div>
        </div>

        {/* Style selection */}
        {tab === 'text' ? (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: theme.colors.textMuted,
                marginBottom: 8,
              }}
            >
              Background Style
            </label>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {COLOR_PRESETS.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: col,
                    border:
                      selectedColor === col ? `2px solid #FFFFFF` : '1px solid rgba(0,0,0,0.1)',
                    outline: selectedColor === col ? `2px solid ${theme.colors.primary}` : 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedColor === col && <Check size={14} color="#FFFFFF" />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: theme.colors.textMuted,
                marginBottom: 8,
              }}
            >
              Choose Photo
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {PHOTO_PRESETS.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  style={{
                    flex: 1,
                    height: 54,
                    borderRadius: theme.borderRadius.md,
                    overflow: 'hidden',
                    border:
                      selectedPhoto === photo
                        ? `2px solid ${theme.colors.primary}`
                        : `1px solid ${theme.colors.border}`,
                    cursor: 'pointer',
                    padding: 0,
                    position: 'relative',
                  }}
                >
                  <img
                    src={photo}
                    alt={`Preset ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {selectedPhoto === photo && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(99, 102, 241, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Caption Input */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: theme.colors.textMuted,
              marginBottom: 6,
            }}
          >
            {tab === 'text' ? 'Your Message / Quote' : 'Add Caption (Optional)'}
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={
              tab === 'text'
                ? 'Share what is inspiring you today...'
                : 'Say something about this moment...'
            }
            rows={3}
            style={{
              width: '100%',
              backgroundColor: theme.colors.surfaceElevated,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.lg,
              padding: '10px 12px',
              color: theme.colors.text,
              fontSize: 14,
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <SecondaryButton label="Cancel" onClick={onClose} />
          <PrimaryButton
            label="Share to Story"
            icon={<Sparkles size={16} />}
            onClick={handlePost}
            disabled={tab === 'text' && !caption.trim()}
          />
        </div>
      </div>
    </Modal>
  );
};
