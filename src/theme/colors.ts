export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGradient: string;
  accent: string;
  accentGradient: string;
  secondary: string;

  background: string;
  surface: string;
  surfaceHover: string;
  surfaceElevated: string;
  card: string;

  text: string;
  textMuted: string;
  textSecondary: string;
  textInverse: string;

  border: string;
  borderLight: string;

  // Semantic
  online: string;
  offline: string;
  away: string;
  success: string;
  warning: string;
  error: string;
  info: string;

  // Chat specific
  bubbleIncoming: string;
  bubbleIncomingText: string;
  bubbleOutgoing: string;
  bubbleOutgoingText: string;
  bubbleOutgoingGradient: string;
  statusRead: string;
  statusDelivered: string;
  statusSent: string;

  // Story specific
  storyGradient: string;
  storyRingUnseen: string;
  storyRingSeen: string;
}

export const lightColors: ColorPalette = {
  primary: '#5046E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  accent: '#EC4899',
  accentGradient: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
  secondary: '#64748B',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',

  text: '#0F172A',
  textMuted: '#94A3B8',
  textSecondary: '#64748B',
  textInverse: '#FFFFFF',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  online: '#10B981',
  offline: '#94A3B8',
  away: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  bubbleIncoming: '#FFFFFF',
  bubbleIncomingText: '#0F172A',
  bubbleOutgoing: '#5046E5',
  bubbleOutgoingText: '#FFFFFF',
  bubbleOutgoingGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  statusRead: '#0284C7',
  statusDelivered: '#94A3B8',
  statusSent: '#CBD5E1',

  storyGradient: 'linear-gradient(45deg, #F43F5E, #EC4899, #8B5CF6)',
  storyRingUnseen: '#EC4899',
  storyRingSeen: '#CBD5E1',
};

export const darkColors: ColorPalette = {
  primary: '#6366F1',
  primaryLight: '#1E1B4B',
  primaryDark: '#4338CA',
  primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  accent: '#F43F5E',
  accentGradient: 'linear-gradient(135deg, #FB7185 0%, #E11D48 100%)',
  secondary: '#94A3B8',

  background: '#0B0F19',
  surface: '#131B2E',
  surfaceHover: '#1E293B',
  surfaceElevated: '#182238',
  card: '#131B2E',

  text: '#F8FAFC',
  textMuted: '#64748B',
  textSecondary: '#94A3B8',
  textInverse: '#0B0F19',

  border: '#1E293B',
  borderLight: '#172133',

  online: '#10B981',
  offline: '#64748B',
  away: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#38BDF8',

  bubbleIncoming: '#1A2338',
  bubbleIncomingText: '#F8FAFC',
  bubbleOutgoing: '#4F46E5',
  bubbleOutgoingText: '#FFFFFF',
  bubbleOutgoingGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  statusRead: '#38BDF8',
  statusDelivered: '#64748B',
  statusSent: '#475569',

  storyGradient: 'linear-gradient(45deg, #F43F5E, #EC4899, #8B5CF6)',
  storyRingUnseen: '#F43F5E',
  storyRingSeen: '#334155',
};
