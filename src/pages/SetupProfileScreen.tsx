import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  AtSign,
  Camera,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  LogOut,
  Upload,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { ROUTES } from '../constants/routes';

// Preset stylish avatars
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
];

const STATUS_PRESETS = [
  '💬 Available to chat',
  '🚀 Working on something cool',
  '🎧 Listening to music',
  '✨ Vibing on AuraChat',
  '✈️ Traveling',
];

export const SetupProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user, completeProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.statusMessage || 'Hey there! I am using AuraChat ✨');

  // Username validation & availability
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    valid: boolean;
    message?: string;
  }>({ valid: true });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state if user loads late
  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!username && user.username) setUsername(user.username);
      if (!avatar && user.avatar) setAvatar(user.avatar);
      if (user.statusMessage) setBio(user.statusMessage);
    }
  }, [user]);

  // Debounced username availability checker
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setUsernameStatus({ valid: false, message: 'Username is required' });
      return;
    }
    if (clean.length < 3) {
      setUsernameStatus({ valid: false, message: 'Must be at least 3 characters' });
      return;
    }
    if (clean.length > 20) {
      setUsernameStatus({ valid: false, message: 'Maximum 20 characters' });
      return;
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus({
        valid: false,
        message: 'Only lowercase letters, numbers, and underscores',
      });
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const result = await userService.checkUsernameAvailability(clean, user?.id);
        if (result.available) {
          setUsernameStatus({ valid: true, message: `@${clean} is available! 🎉` });
        } else {
          setUsernameStatus({ valid: false, message: result.error || 'Username is already taken' });
        }
      } catch (e) {
        setUsernameStatus({ valid: true });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, user?.id]);

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setGeneralError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        setShowAvatarPicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const trimmedName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!trimmedName || trimmedName.length < 2) {
      setGeneralError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!usernameStatus.valid || isCheckingUsername) {
      setGeneralError('Please choose a valid and available username.');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeProfile({
        name: trimmedName,
        username: cleanUsername,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=6366F1&color=fff&size=300`,
        bio: bio.trim(),
      });
      navigate(ROUTES.HOME, { replace: true });
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    name.trim().length >= 2 &&
    usernameStatus.valid &&
    !isCheckingUsername &&
    !isSubmitting;

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Step Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: `${theme.colors.primary}20`,
            border: `1px solid ${theme.colors.primary}40`,
            color: theme.colors.primary,
            padding: '4px 12px',
            borderRadius: theme.borderRadius.full,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <Sparkles size={14} />
          <span>Final Step • Account Setup</span>
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
            margin: '0 0 6px 0',
            textAlign: 'center',
          }}
        >
          Welcome to AuraChat
        </h1>

        <p
          style={{
            fontSize: 13,
            color: theme.colors.textMuted,
            margin: '0 0 24px 0',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Choose your public display name, unique handle, and avatar to start connecting.
        </p>

        {/* Error Alert Box */}
        {generalError && (
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: `${theme.colors.error}18`,
              border: `1px solid ${theme.colors.error}40`,
              borderRadius: theme.borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: theme.colors.error,
              fontSize: 13,
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          >
            <XCircle size={18} style={{ flexShrink: 0 }} />
            <span>{generalError}</span>
          </div>
        )}

        {/* Profile Avatar with Edit Overlay */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div
            onClick={() => setShowAvatarPicker(true)}
            style={{
              width: 96,
              height: 96,
              borderRadius: theme.borderRadius.full,
              overflow: 'hidden',
              cursor: 'pointer',
              border: `3px solid ${theme.colors.primary}`,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
              position: 'relative',
              backgroundColor: theme.colors.surfaceElevated,
            }}
          >
            <img
              src={
                avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=6366F1&color=fff&size=200`
              }
              alt="Avatar preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Camera Overlay on Hover/Tap */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Camera size={24} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAvatarPicker(true)}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: theme.colors.primary,
              border: `2px solid ${theme.colors.surface}`,
              borderRadius: theme.borderRadius.full,
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: theme.shadows.sm,
            }}
            title="Change Avatar"
          >
            <Camera size={15} />
          </button>
        </div>

        {/* Avatar Selection Drawer / Modal */}
        {showAvatarPicker && (
          <div
            style={{
              width: '100%',
              backgroundColor: theme.colors.surfaceElevated,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.xl,
              padding: 16,
              marginBottom: 20,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>
                Choose an Avatar
              </span>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.textMuted,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>

            {/* Presets Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 8,
                marginBottom: 14,
              }}
            >
              {PRESET_AVATARS.map((presetUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setAvatar(presetUrl);
                    setShowAvatarPicker(false);
                  }}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: theme.borderRadius.full,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border:
                      avatar === presetUrl
                        ? `2px solid ${theme.colors.primary}`
                        : `1px solid ${theme.colors.border}`,
                    transform: avatar === presetUrl ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <img
                    src={presetUrl}
                    alt={`Preset ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            {/* Upload Custom File button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.surface,
                border: `1px dashed ${theme.colors.border}`,
                color: theme.colors.text,
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <Upload size={15} />
              <span>Upload Custom Image</span>
            </button>
          </div>
        )}

        {/* Main Profile Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Full Name */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: theme.colors.textMuted,
                marginBottom: 6,
              }}
            >
              Full Name *
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.colors.surfaceElevated,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                padding: '0 12px',
              }}
            >
              <User size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                maxLength={50}
                style={{
                  flex: 1,
                  height: 46,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: theme.colors.text,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 4, display: 'block' }}>
              Your display name visible to other users.
            </span>
          </div>

          {/* Username (@handle) */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: theme.colors.textMuted,
                marginBottom: 6,
              }}
            >
              Username (@handle) *
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.colors.surfaceElevated,
                border: `1px solid ${
                  !usernameStatus.valid
                    ? theme.colors.error
                    : usernameStatus.message?.includes('available')
                    ? theme.colors.online
                    : theme.colors.border
                }`,
                borderRadius: theme.borderRadius.lg,
                padding: '0 12px',
                transition: 'border-color 0.2s ease',
              }}
            >
              <AtSign size={18} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, '')
                      .slice(0, 20)
                  )
                }
                placeholder="username"
                required
                autoCapitalize="none"
                autoCorrect="off"
                style={{
                  flex: 1,
                  height: 46,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: theme.colors.text,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
              {isCheckingUsername ? (
                <Loader2 size={16} color={theme.colors.primary} className="animate-spin" />
              ) : usernameStatus.valid && usernameStatus.message?.includes('available') ? (
                <CheckCircle2 size={18} color={theme.colors.online} />
              ) : !usernameStatus.valid ? (
                <XCircle size={18} color={theme.colors.error} />
              ) : null}
            </div>

            {/* Validation Feedback */}
            <div style={{ minHeight: 18, marginTop: 4 }}>
              {usernameStatus.message && (
                <span
                  style={{
                    fontSize: 11.5,
                    color: usernameStatus.valid ? theme.colors.online : theme.colors.error,
                    fontWeight: 500,
                  }}
                >
                  {usernameStatus.message}
                </span>
              )}
            </div>
          </div>

          {/* Bio / Status Message */}
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: theme.colors.textMuted,
                marginBottom: 6,
              }}
            >
              Bio / Status
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 120))}
              placeholder="What's on your mind?"
              rows={2}
              style={{
                width: '100%',
                backgroundColor: theme.colors.surfaceElevated,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                padding: '10px 12px',
                color: theme.colors.text,
                fontSize: 13.5,
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />

            {/* Quick status chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 8,
              }}
            >
              {STATUS_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBio(preset)}
                  style={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.borderLight}`,
                    borderRadius: theme.borderRadius.full,
                    padding: '4px 10px',
                    fontSize: 11,
                    color: theme.colors.textMuted,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              width: '100%',
              height: 50,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: isFormValid ? theme.colors.primary : theme.colors.surfaceElevated,
              border: 'none',
              color: isFormValid ? '#FFFFFF' : theme.colors.textMuted,
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              boxShadow: isFormValid ? '0 8px 20px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s ease',
              opacity: isFormValid ? 1 : 0.6,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Setup & Start Chatting</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Account Switch */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: theme.colors.textMuted,
          }}
        >
          <span>Signed in as {user?.email || 'User'}.</span>
          <button
            type="button"
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primary,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            <LogOut size={12} />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupProfileScreen;
