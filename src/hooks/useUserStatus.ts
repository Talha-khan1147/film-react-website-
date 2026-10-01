import { useState, useCallback } from 'react';
import { UserStatus } from '../types/user';
import { currentUser } from '../data/users';

export function useUserStatus() {
  const [status, setStatus] = useState<UserStatus>(currentUser.status);
  const [statusMessage, setStatusMessage] = useState<string>(currentUser.statusMessage || '');

  const updateStatus = useCallback((newStatus: UserStatus, message?: string) => {
    setStatus(newStatus);
    if (message !== undefined) {
      setStatusMessage(message);
    }
  }, []);

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
