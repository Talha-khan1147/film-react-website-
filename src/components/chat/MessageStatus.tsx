import React from 'react';
import { Clock, Check, CheckCheck } from 'lucide-react';
import { MessageStatus as StatusType } from '../../types/message';
import { useTheme } from '../../theme/ThemeProvider';

interface MessageStatusProps {
  status: StatusType;
  size?: number;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({ status, size = 14 }) => {
  const { theme } = useTheme();

  switch (status) {
    case 'sending':
      return <Clock size={size} color={theme.colors.statusSent} />;
    case 'sent':
      return <Check size={size} color={theme.colors.statusSent} />;
    case 'delivered':
      return <CheckCheck size={size} color={theme.colors.statusDelivered} />;
    case 'read':
      return <CheckCheck size={size} color={theme.colors.statusRead} />;
    default:
      return null;
  }
};
