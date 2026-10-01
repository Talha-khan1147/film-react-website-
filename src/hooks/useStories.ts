import { useState, useCallback } from 'react';
import { Story, StorySlide } from '../types/story';
import { useAuth } from './useAuth';
import { generateId } from '../utils/formatters';

export function useStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Mark a slide as viewed
  const markSlideViewed = useCallback((storyId: string, slideId: string) => {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id !== storyId) return story;
        const updatedSlides = story.slides.map((slide) =>
          slide.id === slideId ? { ...slide, isViewed: true } : slide
        );
        const hasUnseen = updatedSlides.some((s) => !s.isViewed);
        return {
          ...story,
          slides: updatedSlides,
          hasUnseen,
        };
      })
    );
  }, []);

  // Post a new story slide
  const createStory = useCallback(
    (params: {
      mediaUrl?: string;
      mediaType: 'image' | 'video' | 'text-card';
      backgroundColor?: string;
      caption?: string;
    }) => {
      if (!user) return;

      const newSlide: StorySlide = {
        id: generateId('slide'),
        mediaUrl: params.mediaUrl || '',
        mediaType: params.mediaType,
        backgroundColor: params.backgroundColor || '#6366F1',
        caption: params.caption,
        createdAt: new Date().toISOString(),
        durationMs: 5000,
        isViewed: false,
      };

      setStories((prev) => {
        const userStoryIndex = prev.findIndex((s) => s.userId === user.id);
        if (userStoryIndex >= 0) {
          const updated = [...prev];
          updated[userStoryIndex] = {
            ...updated[userStoryIndex],
            slides: [newSlide, ...updated[userStoryIndex].slides],
            updatedAt: new Date().toISOString(),
          };
          return updated;
        } else {
          const newUserStory: Story = {
            id: generateId('story'),
            userId: user.id,
            user: user,
            hasUnseen: false,
            updatedAt: new Date().toISOString(),
            slides: [newSlide],
          };
          return [newUserStory, ...prev];
        }
      });

      setIsCreatorOpen(false);
    },
    [user]
  );

  return {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    isCreatorOpen,
    setIsCreatorOpen,
    markSlideViewed,
    createStory,
    currentStory: activeStoryIndex !== null ? stories[activeStoryIndex] : null,
  };
}
