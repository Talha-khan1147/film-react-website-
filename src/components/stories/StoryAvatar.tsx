import React from 'react';
import { Plus } from 'lucide-react';
import { StoryRing } from './StoryRing';
import { User } from '../../types/user';
import { useTheme } from '../../theme/ThemeProvider';

interface StoryAvatarProps {
  user: User;
  hasUnseen?: boolean;
  isCurrentUser?: boolean;
  onClick: () => void;
  onAddStory?: () => void;
  size?: number;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({
  user,
  hasUnseen = false,
  isCurrentUser = false,
  onClick,
  onAddStory,
  size = 60,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: size + 16,
        gap: 6,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div style={{ position: 'relative' }}>
        <StoryRing hasUnseen={hasUnseen} size={size} onClick={onClick}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </StoryRing>

        {isCurrentUser && onAddStory && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddStory();
            }}
            aria-label="Add new story"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: theme.borderRadius.full,
              background: theme.colors.primaryGradient,
              color: '#FFFFFF',
              border: `2px solid ${theme.colors.surface}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: theme.shadows.sm,
              padding: 0,
            }}
          >
            <Plus size={13} strokeWidth={3} />
          </button>
        )}
      </div>

      <span
        style={{
          fontSize: 11.5,
          fontWeight: hasUnseen
            ? theme.typography.fontWeight.semibold
            : theme.typography.fontWeight.medium,
          color: theme.colors.text,
          textAlign: 'center',
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isCurrentUser ? 'Your Story' : user.name.split(' ')[0]}
      </span>
    </div>
  );
};
