import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Story, StorySlide } from '../types/story';
import { User } from '../types/user';
import { generateId } from '../utils/formatters';

const STORIES_COLLECTION = 'stories';
const STORY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const storyService = {
  /**
   * Real-time subscription to stories from all users with 24-hour expiration filter
   */
  subscribeToStories(
    currentUserId: string,
    callback: (stories: Story[]) => void
  ): Unsubscribe {
    const q = query(collection(db, STORIES_COLLECTION));

    return onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        const validStories: Story[] = [];

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data || !data.slides || !Array.isArray(data.slides)) return;

          // Filter out slides older than 24 hours
          const activeSlides: StorySlide[] = data.slides
            .filter((slide: StorySlide) => {
              const createdTime = new Date(slide.createdAt).getTime();
              return now - createdTime < STORY_EXPIRY_MS;
            })
            .map((slide: StorySlide) => {
              const hasCurrentUserViewed =
                slide.viewers?.some((v) => v.userId === currentUserId) || false;
              return {
                ...slide,
                isViewed: hasCurrentUserViewed,
              };
            });

          // Only keep stories that have at least 1 active slide
          if (activeSlides.length > 0) {
            const hasUnseen = activeSlides.some((s) => !s.isViewed);
            validStories.push({
              id: docSnap.id,
              userId: data.userId,
              user: data.user,
              slides: activeSlides,
              hasUnseen,
              updatedAt: data.updatedAt || new Date().toISOString(),
            });
          }
        });

        // Sort: Stories with unseen updates first, then by updatedAt desc
        validStories.sort((a, b) => {
          if (a.userId === currentUserId) return -1;
          if (b.userId === currentUserId) return 1;
          if (a.hasUnseen && !b.hasUnseen) return -1;
          if (!a.hasUnseen && b.hasUnseen) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        callback(validStories);
      },
      (err) => {
        console.warn('Error subscribing to stories:', err);
      }
    );
  },

  /**
   * Post a new story slide to Firestore
   */
  async postStory(params: {
    user: User;
    mediaUrl?: string;
    mediaType: 'image' | 'video' | 'text-card';
    backgroundColor?: string;
    caption?: string;
    durationMs?: number;
  }): Promise<void> {
    const now = new Date();
    const storyDocId = `story_${params.user.id}`;
    const storyRef = doc(db, STORIES_COLLECTION, storyDocId);

    const newSlide: StorySlide = {
      id: generateId('slide'),
      mediaUrl: params.mediaUrl || '',
      mediaType: params.mediaType,
      backgroundColor: params.backgroundColor || '#6366F1',
      caption: params.caption,
      createdAt: now.toISOString(),
      durationMs: params.durationMs || 5000,
      isViewed: false,
      viewers: [],
    };

    const existingSnap = await getDoc(storyRef);

    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      const currentSlides: StorySlide[] = existingData.slides || [];

      // Filter out already expired slides before adding new one
      const nowMs = now.getTime();
      const nonExpiredSlides = currentSlides.filter(
        (s) => nowMs - new Date(s.createdAt).getTime() < STORY_EXPIRY_MS
      );

      await updateDoc(storyRef, {
        slides: [newSlide, ...nonExpiredSlides],
        updatedAt: now.toISOString(),
        user: {
          id: params.user.id,
          name: params.user.name,
          username: params.user.username,
          avatar: params.user.avatar,
        },
      });
    } else {
      await setDoc(storyRef, {
        id: storyDocId,
        userId: params.user.id,
        user: {
          id: params.user.id,
          name: params.user.name,
          username: params.user.username,
          avatar: params.user.avatar,
        },
        slides: [newSlide],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }
  },

  /**
   * Mark a slide as viewed by the current user
   */
  async markSlideViewed(
    storyId: string,
    slideId: string,
    viewer: { id: string; name: string }
  ): Promise<void> {
    try {
      const storyRef = doc(db, STORIES_COLLECTION, storyId);
      const snap = await getDoc(storyRef);
      if (!snap.exists()) return;

      const data = snap.data();
      const slides: StorySlide[] = data.slides || [];

      let hasChanged = false;
      const updatedSlides = slides.map((slide) => {
        if (slide.id === slideId) {
          const viewers = slide.viewers || [];
          if (!viewers.some((v) => v.userId === viewer.id)) {
            hasChanged = true;
            return {
              ...slide,
              viewers: [
                ...viewers,
                {
                  userId: viewer.id,
                  userName: viewer.name,
                  viewedAt: new Date().toISOString(),
                },
              ],
            };
          }
        }
        return slide;
      });

      if (hasChanged) {
        await updateDoc(storyRef, { slides: updatedSlides });
      }
    } catch (e) {
      console.warn('Error marking story slide viewed in Firestore:', e);
    }
  },
};
