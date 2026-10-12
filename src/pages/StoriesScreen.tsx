import React from 'react';
import { Plus, Sparkles, CheckCheck } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useStories } from '../hooks/useStories';
import { useAuth } from '../hooks/useAuth';
import { AppHeader } from '../components/common/AppHeader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { StoryCard } from '../components/stories/StoryCard';
import { StoryViewer } from '../components/stories/StoryViewer';
import { StoryCreatorModal } from '../components/stories/StoryCreatorModal';
import { Avatar } from '../components/common/Avatar';
import { EmptyState } from '../components/common/EmptyState';

export const StoriesScreen: React.FC = () => {
  const { theme } = useTheme();
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    isCreatorOpen,
    setIsCreatorOpen,
    markSlideViewed,
    createStory,
  } = useStories();

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const userStory = stories.find((s) => s.userId === user.id);
  const otherStories = stories.filter((s) => s.userId !== user.id);

  const recentUnseenStories = otherStories.filter((s) => s.hasUnseen);
  const viewedStories = otherStories.filter((s) => !s.hasUnseen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppHeader
        title="Status"
        subtitle="Updates disappear after 24 hours"
        rightActions={
          <PrimaryButton
            label="Add Status"
            icon={<Plus size={16} />}
            onClick={() => setIsCreatorOpen(true)}
            size="sm"
          />
        }
      />

      <ScreenContainer scrollable style={{ padding: '16px 16px 80px 16px' }}>
        {/* My Status Card Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar
              src={user.avatar}
              name={user.name}
              size="lg"
              hasStory={!!userStory}
              hasUnseenStory={false}
              onClick={() => {
                if (userStory) {
                  const idx = stories.findIndex((s) => s.id === userStory.id);
                  setActiveStoryIndex(idx);
                } else {
                  setIsCreatorOpen(true);
                }
              }}
            />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text }}>
                My Status
              </div>
              <div style={{ fontSize: 12.5, color: theme.colors.textMuted, marginTop: 2 }}>
                {userStory
                  ? `${userStory.slides.length} active ${userStory.slides.length === 1 ? 'update' : 'updates'}`
                  : 'Tap to share a photo, video or text'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatorOpen(true)}
            aria-label="Add new status"
            style={{
              width: 36,
              height: 36,
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primaryLight,
              color: theme.colors.primary,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Recent Updates (Unseen) */}
        {recentUnseenStories.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: theme.colors.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 12,
              }}
            >
              <Sparkles size={14} />
              <span>Recent Updates ({recentUnseenStories.length})</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
              }}
            >
              {recentUnseenStories.map((story) => {
                const globalIndex = stories.findIndex((s) => s.id === story.id);
                return (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => setActiveStoryIndex(globalIndex)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Viewed Updates */}
        {viewedStories.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: theme.colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 12,
              }}
            >
              <CheckCheck size={14} />
              <span>Viewed Updates ({viewedStories.length})</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
              }}
            >
              {viewedStories.map((story) => {
                const globalIndex = stories.findIndex((s) => s.id === story.id);
                return (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => setActiveStoryIndex(globalIndex)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state when no contact stories exist */}
        {otherStories.length === 0 && !userStory && (
          <EmptyState
            icon={<Sparkles size={36} />}
            title="No status updates yet"
            description="Share moments with your contacts! Photos, videos, and thoughts disappear after 24 hours."
            actionLabel="Post a Status"
            onAction={() => setIsCreatorOpen(true)}
          />
        )}
      </ScreenContainer>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onMarkSlideViewed={markSlideViewed}
        />
      )}

      {/* Story Creator Modal */}
      <StoryCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onPostStory={createStory}
      />
    </div>
  );
};
