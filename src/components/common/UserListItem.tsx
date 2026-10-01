import React, { useState } from 'react';
import { User } from '../../types/user';
import { Avatar } from './Avatar';
import { useTheme } from '../../theme/ThemeProvider';

interface UserListItemProps {
  user: User;
  onClick?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onClick,
  rightAction,
  subtitle,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: theme.borderRadius.xl,
        backgroundColor: isHovered ? theme.colors.surfaceHover : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
        <Avatar src={user.avatar} name={user.name} status={user.status} showStatus size="md" />

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.name}
          </div>

          <div
            style={{
              fontSize: 13,
              color: theme.colors.textMuted,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: 2,
            }}
          >
            {subtitle || user.statusMessage || `@${user.username}`}
          </div>
        </div>
      </div>

      {rightAction && <div style={{ flexShrink: 0, marginLeft: 12 }}>{rightAction}</div>}
    </div>
  );
};
