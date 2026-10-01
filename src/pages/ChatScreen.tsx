import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Video, Search, ShieldCheck } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { useChatInput } from '../hooks/useChatInput';
import { chatService } from '../services/chatService';
import { Chat } from '../types/chat';
import { User } from '../types/user';
import { AppHeader } from '../components/common/AppHeader';
import { Avatar } from '../components/common/Avatar';
import { IconButton } from '../components/common/IconButton';
import { MessageBubble } from '../components/chat/MessageBubble';
import { MessageInput } from '../components/chat/MessageInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { DateSeparator } from '../components/chat/DateSeparator';
import { AttachmentModal } from '../components/chat/AttachmentModal';
import { ReplyPreviewInfo, Attachment } from '../types/message';
import { LoadingState } from '../components/common/LoadingState';

export const ChatScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const chatId = id || '';
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(true);

  // Fetch chat from Firestore
  useEffect(() => {
    if (!chatId) {
      setIsLoadingChat(false);
      return;
    }
    setIsLoadingChat(true);
    chatService.getChatById(chatId).then((c) => {
      setChat(c);
      setIsLoadingChat(false);
    }).catch(() => {
      setIsLoadingChat(false);
    });
  }, [chatId]);

  const { messages, sendMessage, toggleReaction, isCounterpartTyping } = useMessages(chatId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearchInsideChat, setShowSearchInsideChat] = useState(false);
  const [searchWord, setSearchWord] = useState('');

  const {
    text,
    setText,
    replyTo,
    setReplyTo,
    cancelReply,
    attachments,
    addAttachment,
    removeAttachment,
    isEmojiPickerOpen,
    setIsEmojiPickerOpen,
    isAttachmentMenuOpen,
    setIsAttachmentMenuOpen,
    handleSend,
    addEmoji,
  } = useChatInput((msgText, reply, atts) => {
    sendMessage(msgText, reply, atts);
  });

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isCounterpartTyping]);

  if (isLoadingChat) {
    return <LoadingState message="Loading conversation..." rows={5} />;
  }

  if (!chat || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.colors.textMuted }}>
        <p>Conversation not found.</p>
      </div>
    );
  }

  const counterpart: User = chat.participants.find((p) => p.id !== user.id) || chat.participants[0];

  // Group messages by date
  let lastDateKey = '';

  const filteredMessages = searchWord.trim()
    ? messages.filter((m) => m.text.toLowerCase().includes(searchWord.toLowerCase()))
    : messages;

  // Helper to find sender info from participants
  const getSender = (senderId: string): User => {
    return chat.participants.find((p) => p.id === senderId) || counterpart;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: theme.colors.background,
        position: 'relative',
      }}
    >
      {/* Header */}
      <AppHeader
        showBack
        onBack={() => navigate('/')}
        avatar={
          <div
            onClick={() => navigate(`/profile`)}
            style={{ cursor: 'pointer' }}
          >
            <Avatar
              src={chat.type === 'direct' ? counterpart.avatar : (chat.avatar || counterpart.avatar)}
              name={chat.type === 'direct' ? counterpart.name : chat.name}
              size="md"
              status={counterpart.status}
              showStatus={chat.type === 'direct'}
            />
          </div>
        }
        title={chat.type === 'direct' ? counterpart.name : chat.name}
        subtitle={
          isCounterpartTyping ? (
            <span style={{ color: theme.colors.primary, fontWeight: 500 }}>typing...</span>
          ) : chat.type === 'direct' ? (
            counterpart.status === 'online' ? (
              <span style={{ color: theme.colors.online }}>Online</span>
            ) : (
              'Last seen recently'
            )
          ) : (
            `${chat.participants.length} members`
          )
        }
        rightActions={
          <>
            <IconButton
              icon={<Search size={19} />}
              onClick={() => setShowSearchInsideChat((p) => !p)}
              title="Search messages"
              size="sm"
            />
            <IconButton
              icon={<Phone size={19} />}
              onClick={() => alert(`Calling ${chat.name}...`)}
              title="Voice call"
              size="sm"
            />
            <IconButton
              icon={<Video size={19} />}
              onClick={() => alert(`Starting video call with ${chat.name}...`)}
              title="Video call"
              size="sm"
            />
          </>
        }
      />

      {/* Optional Search in Conversation banner */}
      {showSearchInsideChat && (
        <div
          style={{
            padding: '8px 14px',
            backgroundColor: theme.colors.surfaceElevated,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Search size={16} color={theme.colors.textMuted} />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Search this conversation..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 13,
              color: theme.colors.text,
            }}
          />
          {searchWord && (
            <span style={{ fontSize: 11, color: theme.colors.textMuted }}>
              {filteredMessages.length} results
            </span>
          )}
        </div>
      )}

      {/* Messages Stream Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Encryption notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '6px 14px',
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: theme.borderRadius.full,
            margin: '0 auto 12px auto',
            fontSize: 11,
            color: theme.colors.textMuted,
            maxWidth: 320,
            textAlign: 'center',
            border: `1px solid ${theme.colors.borderLight}`,
          }}
        >
          <ShieldCheck size={13} color={theme.colors.primary} style={{ flexShrink: 0 }} />
          <span>Messages and calls are end-to-end encrypted.</span>
        </div>

        {/* Message Items with Date Separators */}
        {filteredMessages.map((message) => {
          const showDateSep = message.dateKey !== lastDateKey;
          lastDateKey = message.dateKey;
          const isOutgoing = message.senderId === user.id;
          const sender = getSender(message.senderId);

          return (
            <React.Fragment key={message.id}>
              {showDateSep && <DateSeparator dateKey={message.dateKey} />}
              <MessageBubble
                message={message}
                sender={sender}
                isOutgoing={isOutgoing}
                onReply={(info) => setReplyTo(info)}
                onToggleReaction={toggleReaction}
              />
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {isCounterpartTyping && (
          <TypingIndicator userName={counterpart.name.split(' ')[0]} />
        )}

        {/* Anchor to scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Input */}
      <MessageInput
        value={text}
        onChange={setText}
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={cancelReply}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        onOpenAttachments={() => setIsAttachmentMenuOpen(true)}
        onToggleEmojiPicker={() => setIsEmojiPickerOpen((p) => !p)}
        isEmojiPickerOpen={isEmojiPickerOpen}
        onSelectEmoji={addEmoji}
      />

      {/* Attachment Selector BottomSheet */}
      <AttachmentModal
        isOpen={isAttachmentMenuOpen}
        onClose={() => setIsAttachmentMenuOpen(false)}
        onAddAttachment={addAttachment}
      />
    </div>
  );
};
