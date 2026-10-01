import {
  doc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Message, ReplyPreviewInfo, Attachment, Reaction } from '../types/message';
import { generateId } from '../utils/formatters';
import { chatService } from './chatService';

const CHATS_COLLECTION = 'chats';
const MESSAGES_SUBCOLLECTION = 'messages';

export const messageService = {
  /**
   * Subscribe to messages in a chat in real-time.
   */
  subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Message),
        id: docSnap.id,
      }));
      callback(messages);
    }, (error) => {
      console.error('Error subscribing to messages:', error);
    });
  },

  /**
   * Send a new message to a chat.
   */
  async sendMessage(params: {
    chatId: string;
    senderId: string;
    senderName: string;
    text: string;
    replyTo?: ReplyPreviewInfo;
    attachments?: Attachment[];
  }): Promise<void> {
    const now = new Date();
    const messageId = generateId('msg');

    const newMessage: Message = {
      id: messageId,
      chatId: params.chatId,
      senderId: params.senderId,
      text: params.text,
      type: params.attachments && params.attachments.length > 0 ? params.attachments[0].type : 'text',
      status: 'sent',
      timestamp: now.toISOString(),
      dateKey: now.toISOString().split('T')[0],
      reactions: [],
      replyTo: params.replyTo,
      attachments: params.attachments,
    };

    // Write message to subcollection
    await setDoc(
      doc(db, CHATS_COLLECTION, params.chatId, MESSAGES_SUBCOLLECTION, messageId),
      newMessage
    );

    // Update parent chat's lastMessage and timestamp
    await chatService.updateChatLastMessage(params.chatId, {
      id: messageId,
      chatId: params.chatId,
      senderId: params.senderId,
      text: params.text,
      type: newMessage.type,
      status: 'sent',
      timestamp: now.toISOString(),
      dateKey: newMessage.dateKey,
      reactions: [],
    });
  },

  /**
   * Toggle a reaction on a message.
   */
  async toggleReaction(
    chatId: string,
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    const msgRef = doc(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION, messageId);
    const msgSnap = await getDoc(msgRef);

    if (!msgSnap.exists()) return;

    const message = msgSnap.data() as Message;
    const reactions = [...(message.reactions || [])];
    const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

    if (existingIdx >= 0) {
      const reaction = reactions[existingIdx];
      const hasReacted = reaction.users.includes(userId);

      if (hasReacted) {
        // Remove user's reaction
        const newUsers = reaction.users.filter((u) => u !== userId);
        if (newUsers.length === 0) {
          reactions.splice(existingIdx, 1);
        } else {
          reactions[existingIdx] = {
            emoji,
            count: newUsers.length,
            users: newUsers,
            hasReacted: false,
          };
        }
      } else {
        // Add user's reaction
        reactions[existingIdx] = {
          emoji,
          count: reaction.count + 1,
          users: [...reaction.users, userId],
          hasReacted: true,
        };
      }
    } else {
      // New reaction
      reactions.push({
        emoji,
        count: 1,
        users: [userId],
        hasReacted: true,
      });
    }

    await updateDoc(msgRef, { reactions });
  },
};
