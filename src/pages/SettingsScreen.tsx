import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Eye,
  CheckCircle,
  Database,
  Smartphone,
  Shield,
  Volume2,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { SectionHeader } from '../components/settings/SectionHeader';
import { SettingItem } from '../components/settings/SettingItem';
import { Modal } from '../components/common/Modal';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { ROUTES } from '../constants/routes';

export const SettingsScreen: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [activeStatus, setActiveStatus] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppHeader title="Settings" subtitle="Preferences & App Configuration" />

      <ScreenContainer scrollable noPadding style={{ paddingBottom: 90 }}>
        {/* Appearance Section */}
        <SectionHeader title="Appearance" />
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <SettingItem
            icon={mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            title="Dark Theme"
            subtitle={mode === 'dark' ? 'Deep slate palette active' : 'Clean ceramic light active'}
            isToggle
            toggleValue={mode === 'dark'}
            onToggleChange={toggleTheme}
          />
        </div>

        {/* Notifications Section */}
        <SectionHeader title="Notifications & Sounds" />
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <SettingItem
            icon={<Bell size={18} />}
            title="Push Notifications"
            subtitle="Show alerts for incoming direct messages"
            isToggle
            toggleValue={notifications}
            onToggleChange={setNotifications}
          />
          <SettingItem
            icon={<Volume2 size={18} />}
            title="In-App Sounds"
            subtitle="Play sound for sent & received messages"
            isToggle
            toggleValue={soundEnabled}
            onToggleChange={setSoundEnabled}
          />
        </div>

        {/* Privacy & Security Section */}
        <SectionHeader title="Privacy & Security" />
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <SettingItem
            icon={<CheckCircle size={18} />}
            title="Read Receipts"
            subtitle="Show double checkmarks when messages are read"
            isToggle
            toggleValue={readReceipts}
            onToggleChange={setReadReceipts}
          />
          <SettingItem
            icon={<Eye size={18} />}
            title="Online Status"
            subtitle="Allow contacts to see when you're active"
            isToggle
            toggleValue={activeStatus}
            onToggleChange={setActiveStatus}
          />
          <SettingItem
            icon={<Lock size={18} />}
            title="End-to-End Encryption"
            subtitle="Signal Protocol cryptographic keys active"
            rightValue="Verified"
            onClick={() => alert('Encryption keys verified for all chats.')}
          />
        </div>

        {/* Storage Section */}
        <SectionHeader title="Data & Cache" />
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <SettingItem
            icon={<Database size={18} />}
            title="Storage Usage"
            subtitle="Media and local cache: 14.8 MB"
            onClick={() => alert('Local cache cleared!')}
          />
        </div>

        {/* Account & Session */}
        <SectionHeader title="Account" />
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <div
            onClick={() => setShowLogoutModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              cursor: 'pointer',
              color: theme.colors.error,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${theme.colors.error}10`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: theme.borderRadius.md,
                backgroundColor: `${theme.colors.error}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={18} color={theme.colors.error} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>Log Out</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>
                Sign out of {user?.name || 'AuraChat'}
              </div>
            </div>
          </div>
        </div>

        {/* About App */}
        <SectionHeader title="About AuraChat" />
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            borderBottom: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <SettingItem
            icon={<Smartphone size={18} />}
            title="App Version"
            rightValue="v2.4.0-pro"
          />
          <SettingItem
            icon={<Shield size={18} />}
            title="Terms & Privacy Policy"
            onClick={() => alert('AuraChat strictly protects your personal data.')}
          />
        </div>
      </ScreenContainer>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log Out Confirmation"
        maxWidth={380}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 1.5 }}>
            Are you sure you want to log out of AuraChat? You will need to sign in again to access your messages.
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
              Yes, Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
