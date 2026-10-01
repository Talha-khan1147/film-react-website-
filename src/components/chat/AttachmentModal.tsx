import React, { useRef, useState } from 'react';
import { Image, Video, FileText, Camera, Music, Loader2, CloudUpload } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { Attachment } from '../../types/message';
import { generateId } from '../../utils/formatters';
import { uploadToGoogleDrive } from '../../services/driveStorageService';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttachment: (attachment: Attachment) => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  onAddAttachment,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptType, setAcceptType] = useState<string>('*/*');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const triggerFileSelect = (accept: string) => {
    setAcceptType(accept);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name} to 5TB Google Drive...`);

    try {
      const result = await uploadToGoogleDrive(file, file.name);

      const attachment: Attachment = {
        id: generateId('att'),
        type: result.type,
        url: result.url,
        name: result.name,
        size: result.size,
      };

      onAddAttachment(attachment);
      onClose();
    } catch (err) {
      console.error('Failed to upload file to Google Drive:', err);
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const options = [
    {
      id: 'photos',
      label: 'Photos',
      icon: <Image size={24} color="#6366F1" />,
      bg: '#EEF2FF',
      onClick: () => triggerFileSelect('image/*'),
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: <Video size={24} color="#8B5CF6" />,
      bg: '#F5F3FF',
      onClick: () => triggerFileSelect('video/*'),
    },
    {
      id: 'camera',
      label: 'Camera',
      icon: <Camera size={24} color="#EC4899" />,
      bg: '#FDF2F8',
      onClick: () => triggerFileSelect('image/*'),
    },
    {
      id: 'document',
      label: 'Document',
      icon: <FileText size={24} color="#10B981" />,
      bg: '#ECFDF5',
      onClick: () => triggerFileSelect('.pdf,.doc,.docx,.txt,.zip,.rar'),
    },
    {
      id: 'audio',
      label: 'Audio Note',
      icon: <Music size={24} color="#F59E0B" />,
      bg: '#FFFBEB',
      onClick: () => triggerFileSelect('audio/*'),
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Share Media & Files">
      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptType}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {isUploading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 16px',
            gap: 12,
          }}
        >
          <Loader2 size={32} color="#6366F1" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#6366F1' }}>
            Uploading to 5TB Google Drive...
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
            {uploadStatus}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Google Drive Status Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 12px',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderRadius: 12,
              fontSize: 11.5,
              color: '#6366F1',
              fontWeight: 500,
            }}
          >
            <CloudUpload size={14} />
            <span>Files store directly to your 5TB Google Drive (aura chats)</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              padding: '4px 0 16px 0',
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={opt.onClick}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: opt.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {opt.icon}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'inherit',
                    textAlign: 'center',
                  }}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </BottomSheet>
  );
};
