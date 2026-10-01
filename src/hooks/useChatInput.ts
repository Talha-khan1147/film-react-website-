import { useState, useCallback } from 'react';
import { ReplyPreviewInfo, Attachment } from '../types/message';

export function useChatInput(onSendMessage: (text: string, replyTo?: ReplyPreviewInfo, attachments?: Attachment[]) => void) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<ReplyPreviewInfo | undefined>(undefined);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    onSendMessage(trimmed, replyTo, attachments.length > 0 ? attachments : undefined);
    setText('');
    setReplyTo(undefined);
    setAttachments([]);
    setIsEmojiPickerOpen(false);
    setIsAttachmentMenuOpen(false);
  }, [text, attachments, replyTo, onSendMessage]);

  const addEmoji = useCallback((emoji: string) => {
    setText((prev) => prev + emoji);
  }, []);

  const addAttachment = useCallback((attachment: Attachment) => {
    setAttachments((prev) => [...prev, attachment]);
    setIsAttachmentMenuOpen(false);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const cancelReply = useCallback(() => {
    setReplyTo(undefined);
  }, []);

  return {
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
    canSend: text.trim().length > 0 || attachments.length > 0,
  };
}
