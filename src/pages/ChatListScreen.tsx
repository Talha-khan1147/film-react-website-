import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, MessageSquare } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useChats } from '../hooks/useChats';
import { useStories } from '../hooks/useStories';
import { useAuth } from '../hooks/useAuth';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { SearchBar } from '../components/common/SearchBar';
import { IconButton } from '../components/common/IconButton';
import { EmptyState } from '../components/common/EmptyState';
import { StoryBar } from '../components/stories/StoryBar';
import { StoryViewer } from '../components/stories/StoryViewer';
import { StoryCreatorModal } from '../components/stories/StoryCreatorModal';
import { ChatListItem } from '../components/chat/ChatListItem';
import { getChatRoute } from '../constants/routes';
import { ChatFilter } from '../types/chat';

export const ChatListScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const {
    filteredChats,
    activeFilter,
    setActiveFilter,
    totalUnreadCount,
    togglePin,
    toggleMute,
    deleteChat,
    markChatAsRead,
  } = useChats();

  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    isCreatorOpen,
    setIsCreatorOpen,
    markSlideViewed,
    createStory,
  } = useStories();

  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats by both activeFilter and search query
  const displayedChats = filteredChats.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.lastMessage?.text.toLowerCase().includes(q)
    );
  });

  const filterTabs: { id: ChatFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: displayedChats.length },
    { id: 'unread', label: 'Unread', count: totalUnreadCount },
    { id: 'groups', label: 'Groups' },
    { id: 'pinned', label: 'Pinned' },
  ];

  const handleChatClick = (chatId: string) => {
    markChatAsRead(chatId);
    navigate(getChatRoute(chatId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* App Header */}
      <AppHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: theme.typography.fontWeight.bold,
                background: theme.colors.primaryGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              AuraChat
            </span>
          </div>
        }
        subtitle="Connected • End-to-end encrypted"
        rightActions={
          <>
            <IconButton
              icon={<MessageSquarePlus size={20} />}
              onClick={() => {
                navigate('/search');
              }}
              title="New conversation"
              size="sm"
            />
          </>
        }
      />

      <ScreenContainer noPadding scrollable>
        {/* Horizontal Story Bar */}
        {user && (
          <StoryBar
            stories={stories}
            currentUser={user}
            onOpenStory={(index) => setActiveStoryIndex(index)}
            onOpenCreator={() => setIsCreatorOpen(true)}
          />
        )}

        {/* Search Bar container */}
        <div style={{ padding: '12px 16px 8px 16px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search conversations..."
          />
        </div>

        {/* Filter Tabs Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 16px 10px 16px',
            overflowX: 'auto',
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: theme.borderRadius.full,
                  border: 'none',
                  backgroundColor: isActive
                    ? theme.colors.primary
                    : theme.colors.surfaceElevated,
                  color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                  fontSize: 12.5,
                  fontWeight: isActive
                    ? theme.typography.fontWeight.semibold
                    : theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  outline: 'none',
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : theme.colors.surfaceHover,
                      color: isActive ? '#FFFFFF' : theme.colors.primary,
                      padding: '1px 5px',
                      borderRadius: theme.borderRadius.full,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Chat List or Empty State */}
        <div style={{ padding: '0 8px 80px 8px' }}>
          {displayedChats.length > 0 ? (
            displayedChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                onClick={() => handleChatClick(chat.id)}
                onTogglePin={togglePin}
                onToggleMute={toggleMute}
                onDelete={deleteChat}
              />
            ))
          ) : (
            <EmptyState
              icon={<MessageSquare size={32} />}
              title="No conversations yet"
              description={
                searchQuery
                  ? `No chats matching "${searchQuery}". Try a different name or message text.`
                  : activeFilter === 'unread'
                  ? 'All caught up! No unread messages at the moment.'
                  : 'Start a new conversation by searching for people.'
              }
              actionLabel={searchQuery ? 'Clear Search' : 'Find People'}
              onAction={() => {
                if (searchQuery) setSearchQuery('');
                else navigate('/search');
              }}
            />
          )}
        </div>
      </ScreenContainer>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onMarkSlideViewed={markSlideViewed}
          onSendStoryReply={(userId, text) => {
            const matchingChat = filteredChats.find((c) =>
              c.participants.some((p) => p.id === userId)
            );
            if (matchingChat) {
              navigate(getChatRoute(matchingChat.id));
            }
          }}
        />
      )}

      {/* Floating Action Button (FAB) for New Chat */}
      <button
        type="button"
        onClick={() => navigate('/search')}
        aria-label="New conversation"
        style={{
          position: 'absolute',
          bottom: 74,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: theme.borderRadius.full,
          background: theme.colors.primaryGradient,
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 45,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(99, 102, 241, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.45)';
        }}
      >
        <MessageSquarePlus size={24} />
      </button>

      {/* Story Creator Modal */}
      <StoryCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onPostStory={createStory}
      />
    </div>
  );
};
