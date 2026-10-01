import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Chat } from '../types/chat';
import { User } from '../types/user';
import { generateId } from '../utils/formatters';

const CHATS_COLLECTION = 'chats';

export const chatService = {
  /**
   * Subscribe to chats where the given userId is a participant.
   * Uses real-time Firestore listener.
   */
  subscribeToUserChats(
    userId: string,
    callback: (chats: Chat[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, CHATS_COLLECTION),
      where('participantIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats: Chat[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Chat),
        id: doc.id,
      }));
      callback(chats);
    }, (error) => {
      console.error('Error subscribing to chats:', error);
    });
  },

  /**
   * Create a new direct chat between two users.
   * Returns the chatId (reuses existing chat if found).
   */
  async createDirectChat(currentUser: User, otherUser: User): Promise<string> {
    // Check if a direct chat already exists between these two users
    // We'll use a deterministic ID so we don't create duplicates
    const sortedIds = [currentUser.id, otherUser.id].sort();
    const chatId = `dm_${sortedIds[0]}_${sortedIds[1]}`;

    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    const existing = await getDoc(chatRef);

    if (existing.exists()) {
      return chatId;
    }

    const newChat: Record<string, any> = {
      type: 'direct',
      name: otherUser.name || 'Chat',
      avatar: otherUser.avatar || '',
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name || '',
          username: currentUser.username || '',
          avatar: currentUser.avatar || '',
          status: currentUser.status || 'offline',
          bio: currentUser.bio || '',
        },
        {
          id: otherUser.id,
          name: otherUser.name || '',
          username: otherUser.username || '',
          avatar: otherUser.avatar || '',
          status: otherUser.status || 'offline',
          bio: otherUser.bio || '',
        },
      ],
      participantIds: [currentUser.id, otherUser.id],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(chatRef, newChat);
    return chatId;
  },

  /**
   * Get a single chat by ID.
   */
  async getChatById(chatId: string): Promise<Chat | null> {
    const chatDoc = await getDoc(doc(db, CHATS_COLLECTION, chatId));
    if (!chatDoc.exists()) return null;
    return { ...(chatDoc.data() as Chat), id: chatDoc.id };
  },

  /**
   * Delete a chat.
   */
  async deleteChat(chatId: string): Promise<void> {
    await deleteDoc(doc(db, CHATS_COLLECTION, chatId));
  },

  /**
   * Toggle pin on a chat.
   */
  async togglePinChat(chatId: string, isPinned: boolean): Promise<void> {
    await updateDoc(doc(db, CHATS_COLLECTION, chatId), { isPinned });
  },

  /**
   * Toggle mute on a chat.
   */
  async toggleMuteChat(chatId: string, isMuted: boolean): Promise<void> {
    await updateDoc(doc(db, CHATS_COLLECTION, chatId), { isMuted });
  },

  /**
   * Mark chat as read (reset unread count).
   */
  async markChatRead(chatId: string): Promise<void> {
    await updateDoc(doc(db, CHATS_COLLECTION, chatId), { unreadCount: 0 });
  },

  /**
   * Update the last message and timestamp on a chat.
   */
  async updateChatLastMessage(
    chatId: string,
    lastMessage: Record<string, any>
  ): Promise<void> {
    await updateDoc(doc(db, CHATS_COLLECTION, chatId), {
      lastMessage,
      updatedAt: new Date().toISOString(),
    });
  },
};
