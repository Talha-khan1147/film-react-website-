import React, { useState, useRef } from 'react';
import { Image, Type, Check, Sparkles, UploadCloud, Loader2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import { uploadToGoogleDrive } from '../../services/driveStorageService';

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
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<'text' | 'photo'>('text');
  const [caption, setCaption] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(PHOTO_PRESETS[0]);
  const [isVideo, setIsVideo] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isVid = file.type.startsWith('video/');
    setIsVideo(isVid);
    setIsUploadingToDrive(true);
    setUploadStatus(`Uploading status to Google Drive (Users/${user?.name || 'User'}/Status)...`);

    try {
      const res = await uploadToGoogleDrive(file, {
        fileName: file.name,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'User',
        category: 'Status',
      });

      setSelectedPhoto(res.url);
      setTab('photo');
    } catch (err) {
      console.error('Error uploading story media to Drive:', err);
    } finally {
      setIsUploadingToDrive(false);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
        mediaType: isVideo ? 'video' : 'image',
        mediaUrl: selectedPhoto,
        caption: caption.trim() || undefined,
      });
    }
    setCaption('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create WhatsApp Status" maxWidth={420}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleCustomFileUpload}
        style={{ display: 'none' }}
      />

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
            <span>Text Status</span>
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
            <span>Media Status</span>
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
          {isUploadingToDrive ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                color: '#FFFFFF',
              }}
            >
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{uploadStatus}</span>
            </div>
          ) : (
            <>
              {tab === 'photo' &&
                (isVideo ? (
                  <video
                    src={selectedPhoto}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    autoPlay
                    loop
                    muted
                  />
                ) : (
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
                ))}

              {tab === 'photo' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)',
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
                {caption ||
                  (tab === 'text'
                    ? 'Type your thought or quote below...'
                    : 'Add a caption...')}
              </div>
            </>
          )}
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
              Background Color
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.textMuted,
                }}
              >
                Choose Photo / Video
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'transparent',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.primary,
                  cursor: 'pointer',
                }}
              >
                <UploadCloud size={14} />
                <span>Upload From Device</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {PHOTO_PRESETS.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setIsVideo(false);
                  }}
                  style={{
                    flex: 1,
                    height: 54,
                    borderRadius: theme.borderRadius.md,
                    overflow: 'hidden',
                    border:
                      selectedPhoto === photo && !isVideo
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
                  {selectedPhoto === photo && !isVideo && (
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
            {tab === 'text' ? 'Your Message / Status' : 'Add Caption (Optional)'}
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={
              tab === 'text'
                ? 'Type a status update...'
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
            label="Share to Status"
            icon={<Sparkles size={16} />}
            onClick={handlePost}
            disabled={
              (tab === 'text' && !caption.trim()) || isUploadingToDrive
            }
          />
        </div>
      </div>
    </Modal>
  );
};
