import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { CurrentUserProfile, UserStatus } from '../types/user';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { IconButton } from '../components/common/IconButton';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileMediaGrid } from '../components/profile/ProfileMediaGrid';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { Modal } from '../components/common/Modal';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { ROUTES } from '../constants/routes';

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user: profile, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!profile) {
    return null;
  }

  const handleSaveProfile = (updated: Partial<CurrentUserProfile>) => {
    updateUser(updated);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const statusOptions: { id: UserStatus; label: string; color: string }[] = [
    { id: 'online', label: 'Online', color: theme.colors.online },
    { id: 'away', label: 'Away', color: theme.colors.away },
    { id: 'offline', label: 'Invisible', color: theme.colors.offline },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppHeader
        title="Profile"
        rightActions={
          <>
            <IconButton
              icon={<LogOut size={18} color={theme.colors.error} />}
              onClick={() => setShowLogoutModal(true)}
              title="Log Out"
              size="sm"
            />
            <IconButton
              icon={<Settings size={20} />}
              onClick={() => navigate('/settings')}
              title="Settings"
              size="sm"
            />
          </>
        }
      />

      <ScreenContainer scrollable style={{ padding: '16px 16px 80px 16px' }}>
        {/* Profile Card */}
        <ProfileHeader
          user={profile}
          isCurrentUser
          onEditProfile={() => setIsEditModalOpen(true)}
        />

        {/* Presence status selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border}`,
            padding: 4,
            marginTop: 16,
          }}
        >
          {statusOptions.map((opt) => {
            const isSelected = profile.status === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateUser({ status: opt.id })}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  borderRadius: theme.borderRadius.lg,
                  border: 'none',
                  backgroundColor: isSelected ? theme.colors.surfaceElevated : 'transparent',
                  color: isSelected ? theme.colors.text : theme.colors.textMuted,
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  boxShadow: isSelected ? theme.shadows.sm : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: opt.color,
                  }}
                />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Account Details Box */}
        <div
          style={{
            marginTop: 16,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border}`,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: theme.colors.textMuted }}>Email</span>
            <span style={{ color: theme.colors.text, fontWeight: 500 }}>{profile.email || 'None'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: theme.colors.textMuted }}>Username</span>
            <span style={{ color: theme.colors.text, fontWeight: 500 }}>@{profile.username}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: theme.colors.textMuted }}>Encryption Key</span>
            <span style={{ color: theme.colors.primary, fontFamily: 'monospace', fontSize: 12 }}>
              AURA-4892-SEC
            </span>
          </div>
        </div>

        {/* Shared Media Grid */}
        <ProfileMediaGrid />
      </ScreenContainer>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={profile}
        onSave={handleSaveProfile}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log Out Confirmation"
        maxWidth={380}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 1.5 }}>
            Are you sure you want to log out of AuraChat?
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <SecondaryButton label="Cancel" onClick={() => setShowLogoutModal(false)} />
            <button
              type="button"
              onClick={handleConfirmLogout}
              style={{
                padding: '10px 18px',
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.error,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
