import { useState, useCallback, useEffect } from 'react';
import { UserStatus } from '../types/user';
import { useAuth } from './useAuth';

export function useUserStatus() {
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState<UserStatus>(user?.status || 'online');
  const [statusMessage, setStatusMessage] = useState<string>(user?.statusMessage || '');

  useEffect(() => {
    if (user) {
      if (user.status) setStatus(user.status);
      if (user.statusMessage) setStatusMessage(user.statusMessage);
    }
  }, [user]);

  const updateStatus = useCallback((newStatus: UserStatus, message?: string) => {
    setStatus(newStatus);
    if (message !== undefined) {
      setStatusMessage(message);
    }
    updateUser({
      status: newStatus,
      ...(message !== undefined && { statusMessage: message }),
    });
  }, [updateUser]);

  const getStatusLabel = useCallback((userStatus: UserStatus) => {
    switch (userStatus) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return 'Offline';
    }
  }, []);

  return {
    status,
    statusMessage,
    updateStatus,
    getStatusLabel,
  };
}
