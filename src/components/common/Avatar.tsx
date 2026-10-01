import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { UserStatus } from '../../types/user';
import { getInitials } from '../../utils/formatters';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  status?: UserStatus;
  showStatus?: boolean;
  hasStory?: boolean;
  hasUnseenStory?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  showStatus = false,
  hasStory = false,
  hasUnseenStory = false,
  onClick,
}) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const dimension = theme.avatarSize[size];

  // Status dot size
  const statusSize = Math.max(8, Math.round(dimension * 0.26));

  const getStatusColor = (userStatus?: UserStatus) => {
    switch (userStatus) {
      case 'online':
        return theme.colors.online;
      case 'away':
        return theme.colors.away;
      case 'offline':
      default:
        return theme.colors.offline;
    }
  };

  const getStoryBorder = () => {
    if (!hasStory) return 'none';
    if (hasUnseenStory) {
      return `2.5px solid ${theme.colors.accent}`;
    }
    return `2px solid ${theme.colors.border}`;
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        userSelect: 'none',
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={name}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: theme.borderRadius.full,
          overflow: 'hidden',
          backgroundColor: theme.colors.primaryLight,
          color: theme.colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dimension * 0.4,
          fontWeight: theme.typography.fontWeight.semibold,
          border: getStoryBorder(),
          boxSizing: 'border-box',
          transition: 'transform 0.15s ease, border-color 0.2s ease',
        }}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {showStatus && status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: statusSize,
            height: statusSize,
            borderRadius: theme.borderRadius.full,
            backgroundColor: getStatusColor(status),
            border: `2px solid ${theme.colors.surface}`,
            boxSizing: 'content-box',
            boxShadow: theme.shadows.sm,
          }}
          title={`${name} is ${status}`}
        />
      )}
    </div>
  );
};
