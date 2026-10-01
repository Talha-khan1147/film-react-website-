import React, { useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: theme.borderRadius['2xl'],
          borderTopRightRadius: theme.borderRadius['2xl'],
          border: `1px solid ${theme.colors.border}`,
          borderBottom: 'none',
          boxShadow: theme.shadows.xl,
          padding: '12px 20px 28px 20px',
          boxSizing: 'border-box',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.border,
            margin: '0 auto 16px auto',
          }}
        />

        {title && (
          <h4
            style={{
              margin: '0 0 16px 0',
              fontSize: 16,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text,
              textAlign: 'center',
            }}
          >
            {title}
          </h4>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};
