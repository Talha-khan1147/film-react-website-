import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, MessageSquare, History, X } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../hooks/useSearch';
import { useChats } from '../hooks/useChats';
import { chatService } from '../services/chatService';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { SearchBar } from '../components/common/SearchBar';
import { UserListItem } from '../components/common/UserListItem';
import { ChatListItem } from '../components/chat/ChatListItem';
import { EmptyState } from '../components/common/EmptyState';
import { getChatRoute } from '../constants/routes';
import { User } from '../types/user';

export const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { filteredChats: allChats } = useChats();

  const {
    query,
    setQuery,
    debouncedQuery,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    filteredChats,
    filteredContacts,
    isSearching,
  } = useSearch(allChats);

  const handleSelectContact = async (contactUser: User) => {
    if (!currentUser) return;
    addRecentSearch(contactUser.name);

    // Check if a chat already exists with this user from the loaded chats
    const existing = allChats.find((c) =>
      c.participants.some((p) => p.id === contactUser.id)
    );

    if (existing) {
      navigate(getChatRoute(existing.id));
    } else {
      // Create a new chat in Firestore
      try {
        const newChatId = await chatService.createDirectChat(currentUser, contactUser);
        navigate(getChatRoute(newChatId));
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
  };

  const handleSelectChat = (chatId: string, name: string) => {
    addRecentSearch(name);
    navigate(getChatRoute(chatId));
  };

  const hasResults = filteredChats.length > 0 || filteredContacts.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppHeader title="Search" subtitle="Find people, messages, and groups" />

      <ScreenContainer scrollable noPadding style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Search Input Box */}
        <div style={{ padding: '12px 16px 8px 16px' }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search people, conversations..."
            autoFocus
          />
        </div>

        {/* Recent Searches Pills when not actively querying */}
        {!isSearching && recentSearches.length > 0 && (
          <div style={{ padding: '12px 16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: theme.colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <History size={13} />
                <span>Recent Searches</span>
              </div>
              <button
                type="button"
                onClick={clearRecentSearches}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 12,
                  color: theme.colors.primary,
                  cursor: 'pointer',
                }}
              >
                Clear all
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: theme.colors.surfaceElevated,
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: 13,
                    color: theme.colors.text,
                    cursor: 'pointer',
                  }}
                >
                  <span>{term}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(term);
                    }}
                    aria-label={`Remove ${term}`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: theme.colors.textMuted,
                      display: 'flex',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div style={{ padding: '8px 12px 80px 12px', flex: 1 }}>
          {isSearching ? (
            hasResults ? (
              <>
                {/* Contacts Section */}
                {filteredContacts.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: theme.colors.primary,
                        textTransform: 'uppercase',
                        padding: '0 8px 6px 8px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <Users size={13} />
                      <span>People ({filteredContacts.length})</span>
                    </div>

                    {filteredContacts.map((contact) => (
                      <UserListItem
                        key={contact.id}
                        user={contact}
                        onClick={() => handleSelectContact(contact)}
                      />
                    ))}
                  </div>
                )}

                {/* Chats Section */}
                {filteredChats.length > 0 && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: theme.colors.primary,
                        textTransform: 'uppercase',
                        padding: '0 8px 6px 8px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <MessageSquare size={13} />
                      <span>Conversations ({filteredChats.length})</span>
                    </div>

                    {filteredChats.map((chat) => (
                      <ChatListItem
                        key={chat.id}
                        chat={chat}
                        onClick={() => handleSelectChat(chat.id, chat.name)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={<SearchIcon size={32} />}
                title="No results found"
                description={`We couldn't find any contacts or conversations matching "${debouncedQuery}".`}
                actionLabel="Clear Search"
                onAction={() => setQuery('')}
              />
            )
          ) : (
            /* Suggested People when idle */
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.textMuted,
                  textTransform: 'uppercase',
                  padding: '8px 8px 6px 8px',
                  letterSpacing: '0.04em',
                }}
              >
                Suggested Contacts
              </div>

              {filteredContacts.slice(0, 5).map((contact) => (
                <UserListItem
                  key={contact.id}
                  user={contact}
                  onClick={() => handleSelectContact(contact)}
                />
              ))}
            </div>
          )}
        </div>
      </ScreenContainer>
    </div>
  );
};
