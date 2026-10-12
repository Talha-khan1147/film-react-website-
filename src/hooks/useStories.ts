import { useState, useCallback, useEffect } from 'react';
import { Story } from '../types/story';
import { useAuth } from './useAuth';
import { storyService } from '../services/storyService';

export function useStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Subscribe to real-time stories from Firestore
  useEffect(() => {
    const currentUserId = user?.id || 'guest';
    const unsubscribe = storyService.subscribeToStories(currentUserId, (loadedStories) => {
      setStories(loadedStories);
    });

    return () => unsubscribe();
  }, [user]);

  // Mark a slide as viewed in Firestore
  const markSlideViewed = useCallback(
    (storyId: string, slideId: string) => {
      if (!user) return;
      storyService.markSlideViewed(storyId, slideId, {
        id: user.id,
        name: user.name,
      });
    },
    [user]
  );

  // Post a new story slide to Firestore
  const createStory = useCallback(
    async (params: {
      mediaUrl?: string;
      mediaType: 'image' | 'video' | 'text-card';
      backgroundColor?: string;
      caption?: string;
      durationMs?: number;
    }) => {
      if (!user) return;

      try {
        await storyService.postStory({
          user,
          mediaUrl: params.mediaUrl,
          mediaType: params.mediaType,
          backgroundColor: params.backgroundColor,
          caption: params.caption,
          durationMs: params.durationMs,
        });
      } catch (err) {
        console.error('Failed to post story to Firestore:', err);
      } finally {
        setIsCreatorOpen(false);
      }
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
