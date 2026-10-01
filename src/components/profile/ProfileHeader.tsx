import React from 'react';
import { ShieldCheck, MessageCircle, Phone, Video, Edit3 } from 'lucide-react';
import { User } from '../../types/user';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../common/Avatar';
import { IconButton } from '../common/IconButton';
import { PrimaryButton } from '../common/PrimaryButton';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onStartChat?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser = false,
  onEditProfile,
  onStartChat,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius['2xl'],
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,
        textAlign: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Large Avatar with Status */}
      <div style={{ marginBottom: 14 }}>
        <Avatar
          src={user.avatar}
          name={user.name}
          size="2xl"
          status={user.status}
          showStatus
        />
      </div>

      {/* Name and verification badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
          }}
        >
          {user.name}
        </h2>
        {user.isVerified && <ShieldCheck size={18} color={theme.colors.primary} />}
      </div>

      {/* Handle */}
      <div
        style={{
          fontSize: 13,
          color: theme.colors.textMuted,
          marginBottom: 10,
        }}
      >
        @{user.username}
      </div>

      {/* Status Bio */}
      {user.statusMessage && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.surfaceElevated,
            fontSize: 12.5,
            color: theme.colors.textSecondary,
            marginBottom: 14,
            border: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          {user.statusMessage}
        </div>
      )}

      {/* Bio */}
      {user.bio && (
        <p
          style={{
            fontSize: 13.5,
            color: theme.colors.text,
            lineHeight: 1.5,
            maxWidth: 360,
            margin: '0 0 20px 0',
          }}
        >
          {user.bio}
        </p>
      )}

      {/* Actions */}
      {isCurrentUser ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryButton
            label="Edit Profile"
            icon={<Edit3 size={15} />}
            onClick={onEditProfile}
            size="sm"
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onStartChat && (
            <PrimaryButton
              label="Message"
              icon={<MessageCircle size={16} />}
              onClick={onStartChat}
              size="sm"
            />
          )}
          <IconButton
            icon={<Phone size={18} />}
            onClick={() => alert(`Calling ${user.name}...`)}
            ariaLabel="Voice call"
            variant="filled"
            size="md"
          />
          <IconButton
            icon={<Video size={18} />}
            onClick={() => alert(`Starting video call with ${user.name}...`)}
            ariaLabel="Video call"
            variant="filled"
            size="md"
          />
        </div>
      )}
    </div>
  );
};
