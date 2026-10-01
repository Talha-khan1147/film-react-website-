import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { Story } from '../../types/story';
import { Avatar } from '../common/Avatar';
import { getRelativeTime } from '../../utils/dateUtils';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onMarkSlideViewed: (storyId: string, slideId: string) => void;
  onSendStoryReply?: (storyUserId: string, text: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  onMarkSlideViewed,
  onSendStoryReply,
}) => {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const currentStory = stories[currentStoryIdx];
  const currentSlide = currentStory?.slides[currentSlideIdx];

  const durationMs = currentSlide?.durationMs || 5000;
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  // Mark current slide as viewed
  useEffect(() => {
    if (currentStory && currentSlide) {
      onMarkSlideViewed(currentStory.id, currentSlide.id);
    }
  }, [currentStory, currentSlide, onMarkSlideViewed]);

  // Navigate to Next slide or Next story
  const goToNext = useCallback(() => {
    if (!currentStory) return;
    if (currentSlideIdx < currentStory.slides.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
      setProgress(0);
      elapsedRef.current = 0;
    } else if (currentStoryIdx < stories.length - 1) {
      setCurrentStoryIdx((prev) => prev + 1);
      setCurrentSlideIdx(0);
      setProgress(0);
      elapsedRef.current = 0;
    } else {
      onClose();
    }
  }, [currentSlideIdx, currentStory, currentStoryIdx, stories.length, onClose]);

  // Navigate to Previous slide or Previous story
  const goToPrev = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((prev) => prev - 1);
      setProgress(0);
      elapsedRef.current = 0;
    } else if (currentStoryIdx > 0) {
      setCurrentStoryIdx((prev) => prev - 1);
      const prevStory = stories[currentStoryIdx - 1];
      setCurrentSlideIdx(prevStory.slides.length - 1);
      setProgress(0);
      elapsedRef.current = 0;
    }
  }, [currentSlideIdx, currentStoryIdx, stories]);

  // Progress animation loop
  useEffect(() => {
    if (isPaused || !currentSlide) return;

    startTimeRef.current = Date.now() - elapsedRef.current;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const currentPct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(currentPct);

      if (currentPct >= 100) {
        clearInterval(interval);
        goToNext();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentSlide, durationMs, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === ' ') setIsPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNext, goToPrev]);

  if (!currentStory || !currentSlide) return null;

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    if (onSendStoryReply) {
      onSendStoryReply(currentStory.userId, replyText);
    }
    setReplyText('');
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1200);
  };

  const handleSendQuickReaction = (emoji: string) => {
    if (onSendStoryReply) {
      onSendStoryReply(currentStory.userId, `Reacted ${emoji} to your story`);
    }
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Story Stage Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          height: '100%',
          maxHeight: 900,
          backgroundColor: currentSlide.backgroundColor || '#111827',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {/* Media Background */}
        {currentSlide.mediaType === 'image' && currentSlide.mediaUrl && (
          <img
            src={currentSlide.mediaUrl}
            alt="Story content"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Text-card presentation */}
        {currentSlide.mediaType === 'text-card' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              background: currentSlide.backgroundColor || 'linear-gradient(135deg, #6366F1, #EC4899)',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            {currentSlide.caption}
          </div>
        )}

        {/* Top Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 140,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Segmented Progress Bars */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '14px 12px 6px 12px',
          }}
        >
          {currentStory.slides.map((slide, idx) => {
            let widthPct = 0;
            if (idx < currentSlideIdx) widthPct = 100;
            else if (idx === currentSlideIdx) widthPct = progress;

            return (
              <div
                key={slide.id}
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Header: User Info & Close */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 16px 10px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar src={currentStory.user.avatar} name={currentStory.user.name} size="sm" />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>
                {currentStory.user.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
                {getRelativeTime(currentSlide.createdAt)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close stories"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Middle Tap Zones for Navigating (Left 35%, Right 65%) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            top: 70,
            bottom: 80,
            display: 'flex',
            zIndex: 5,
          }}
        >
          <div
            style={{ width: '35%', height: '100%', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
          />
          <div
            style={{ width: '65%', height: '100%', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          />
        </div>

        {/* Floating Heart animation on quick reaction */}
        {showHeartAnimation && (
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
              animation: 'heartPop 1s ease-out forwards',
              fontSize: 64,
            }}
          >
            ❤️
          </div>
        )}

        {/* Bottom Area: Caption & Story Reply Composer */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            padding: '16px 16px 20px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Caption */}
          {currentSlide.mediaType === 'image' && currentSlide.caption && (
            <p
              style={{
                fontSize: 14,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.4,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {currentSlide.caption}
            </p>
          )}

          {/* Quick Reaction Emojis */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {['❤️', '🔥', '😂', '👏', '😮'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSendQuickReaction(emoji)}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(5px)',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReply();
              }}
              placeholder={`Reply to ${currentStory.user.name.split(' ')[0]}...`}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 20,
                padding: '8px 14px',
                color: '#FFFFFF',
                fontSize: 13.5,
                outline: 'none',
                backdropFilter: 'blur(5px)',
              }}
            />

            <button
              type="button"
              onClick={handleSendReply}
              aria-label="Send reply"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#6366F1',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
