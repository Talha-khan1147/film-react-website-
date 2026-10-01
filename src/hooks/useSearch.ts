import { useState, useEffect, useMemo } from 'react';
import { Chat } from '../types/chat';
import { User } from '../types/user';
import { useAuth } from './useAuth';
import { useDebounce } from './useDebounce';
import { userService } from '../services/userService';

const RECENT_SEARCHES_KEY = 'aurachat_recent_searches';
const MAX_RECENT = 8;

export function useSearch(chats: Chat[]) {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Subscribe to all Firestore users
  useEffect(() => {
    const unsubscribe = userService.subscribeToUsers((users) => {
      setAllUsers(users);
    });
    return () => unsubscribe();
  }, []);

  // Contacts = all users except current user
  const contacts = useMemo(() => {
    if (!currentUser) return allUsers;
    return allUsers.filter((u) => u.id !== currentUser.id);
  }, [allUsers, currentUser]);

  const isSearching = debouncedQuery.trim().length > 0;

  const filteredContacts = useMemo(() => {
    if (!isSearching) return contacts;
    const q = debouncedQuery.toLowerCase().trim();
    return contacts.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.username && c.username.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [contacts, debouncedQuery, isSearching]);

  const filteredChats = useMemo(() => {
    if (!isSearching) return [];
    const q = debouncedQuery.toLowerCase();
    return chats.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage?.text.toLowerCase().includes(q)
    );
  }, [chats, debouncedQuery, isSearching]);

  const persistRecent = (updated: string[]) => {
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const addRecentSearch = (term: string) => {
    const filtered = recentSearches.filter((s) => s !== term);
    const updated = [term, ...filtered].slice(0, MAX_RECENT);
    persistRecent(updated);
  };

  const removeRecentSearch = (term: string) => {
    persistRecent(recentSearches.filter((s) => s !== term));
  };

  const clearRecentSearches = () => {
    persistRecent([]);
  };

  return {
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
  };
}
