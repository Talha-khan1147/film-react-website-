import React from 'react';
import { User } from '../../types/user';
import { Avatar, AvatarSize } from './Avatar';
import { useTheme } from '../../theme/ThemeProvider';

interface AvatarGroupProps {
  users: User[];
  maxVisible?: number;
  size?: AvatarSize;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  maxVisible = 3,
  size = 'sm',
}) => {
  const { theme } = useTheme();
  const visibleUsers = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;
  const dimension = theme.avatarSize[size];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {visibleUsers.map((user, idx) => (
        <div
          key={user.id}
          style={{
            marginLeft: idx === 0 ? 0 : -dimension * 0.35,
            border: `2px solid ${theme.colors.surface}`,
            borderRadius: theme.borderRadius.full,
            zIndex: visibleUsers.length - idx,
          }}
        >
          <Avatar src={user.avatar} name={user.name} size={size} />
        </div>
      ))}

      {remaining > 0 && (
        <div
          style={{
            marginLeft: -dimension * 0.35,
            width: dimension,
            height: dimension,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.surfaceElevated,
            border: `2px solid ${theme.colors.surface}`,
            color: theme.colors.textMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dimension * 0.35,
            fontWeight: theme.typography.fontWeight.semibold,
            zIndex: 0,
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
