import { useState, useCallback, useMemo, useEffect } from 'react';
import { Chat, ChatFilter } from '../types/chat';
import { useAuth } from './useAuth';
import { chatService } from '../services/chatService';

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');

  // Subscribe to user's chats from Firestore in real-time
  useEffect(() => {
    if (!user?.id) {
      setChats([]);
      return;
    }

    const unsubscribe = chatService.subscribeToUserChats(user.id, (firestoreChats) => {
      setChats(firestoreChats);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const totalUnreadCount = useMemo(() => {
    return chats.reduce((sum, c) => sum + c.unreadCount, 0);
  }, [chats]);

  const togglePin = useCallback((chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      chatService.togglePinChat(chatId, !chat.isPinned).catch(console.error);
    }
  }, [chats]);

  const toggleMute = useCallback((chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      chatService.toggleMuteChat(chatId, !chat.isMuted).catch(console.error);
    }
  }, [chats]);

  const markChatAsRead = useCallback((chatId: string) => {
    chatService.markChatRead(chatId).catch(console.error);
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    chatService.deleteChat(chatId).catch(console.error);
  }, []);

  const filteredChats = useMemo(() => {
    let result = [...chats];

    if (activeFilter === 'unread') {
      result = result.filter((c) => c.unreadCount > 0);
    } else if (activeFilter === 'groups') {
      result = result.filter((c) => c.type === 'group');
    } else if (activeFilter === 'pinned') {
      result = result.filter((c) => c.isPinned);
    }

    // Sort: pinned first, then by updatedAt descending
    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [chats, activeFilter]);

  return {
    chats,
    setChats,
    filteredChats,
    activeFilter,
    setActiveFilter,
    totalUnreadCount,
    togglePin,
    toggleMute,
    markChatAsRead,
    deleteChat,
  };
}
