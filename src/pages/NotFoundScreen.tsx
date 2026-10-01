import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareOff } from 'lucide-react';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { EmptyState } from '../components/common/EmptyState';

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppHeader title="Page Not Found" showBack onBack={() => navigate('/')} />
      <ScreenContainer scrollable>
        <EmptyState
          icon={<MessageSquareOff size={36} />}
          title="Conversation or screen not found"
          description="The conversation or page you requested may have been removed or does not exist."
          actionLabel="Go to Chats"
          onAction={() => navigate('/')}
        />
      </ScreenContainer>
    </div>
  );
};
