import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

export const OfflineBanner: React.FC = () => {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '6px 12px',
        backgroundColor: theme.colors.warning,
        color: '#000000',
        fontSize: 12,
        fontWeight: 600,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <WifiOff size={14} />
      <span>You are currently offline. Messages will send once reconnected.</span>
    </div>
  );
};
