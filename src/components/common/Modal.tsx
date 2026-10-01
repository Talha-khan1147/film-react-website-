import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { IconButton } from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 440,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      if (typeof document !== 'undefined' && document?.body?.style) {
        document.body.style.overflow = 'hidden';
      }
      if (typeof window !== 'undefined' && window?.addEventListener) {
        window.addEventListener('keydown', handleKeyDown);
      }
    }
    return () => {
      if (typeof document !== 'undefined' && document?.body?.style) {
        document.body.style.overflow = '';
      }
      if (typeof window !== 'undefined' && window?.removeEventListener) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        boxSizing: 'border-box',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius['2xl'],
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.xl,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${theme.colors.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text,
              }}
            >
              {title}
            </h3>
            <IconButton
              icon={<X size={18} />}
              onClick={onClose}
              ariaLabel="Close modal"
              size="sm"
            />
          </div>
        )}

        <div style={{ padding: 20, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
};
