import { useState, useCallback, useEffect } from 'react';
import { Message, ReplyPreviewInfo, Attachment } from '../types/message';
import { useAuth } from './useAuth';
import { messageService } from '../services/messageService';

export function useMessages(chatId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCounterpartTyping, setIsCounterpartTyping] = useState(false);

  // Subscribe to messages from Firestore in real-time
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const unsubscribe = messageService.subscribeToMessages(chatId, (firestoreMessages) => {
      setMessages(firestoreMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Send new message to Firestore
  const sendMessage = useCallback(
    async (text: string, replyTo?: ReplyPreviewInfo, attachments?: Attachment[]) => {
      if (!user) return;

      try {
        await messageService.sendMessage({
          chatId,
          senderId: user.id,
          senderName: user.name,
          text,
          replyTo,
          attachments,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [chatId, user]
  );

  // Toggle reaction on a message in Firestore
  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!user) return;

      try {
        await messageService.toggleReaction(chatId, messageId, user.id, emoji);
      } catch (error) {
        console.error('Error toggling reaction:', error);
      }
    },
    [chatId, user]
  );

  return {
    messages,
    sendMessage,
    toggleReaction,
    isCounterpartTyping,
  };
}
