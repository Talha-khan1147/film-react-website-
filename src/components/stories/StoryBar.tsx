import React from 'react';
import { Story } from '../../types/story';
import { User } from '../../types/user';
import { StoryAvatar } from './StoryAvatar';
import { useTheme } from '../../theme/ThemeProvider';

interface StoryBarProps {
  stories: Story[];
  currentUser: User;
  onOpenStory: (storyIndex: number) => void;
  onOpenCreator: () => void;
}

export const StoryBar: React.FC<StoryBarProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onOpenCreator,
}) => {
  const { theme } = useTheme();

  // Find user's story or provide fallback
  const userStoryIndex = stories.findIndex((s) => s.userId === currentUser.id);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        overflowX: 'auto',
        padding: '12px 16px 14px 16px',
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        boxSizing: 'border-box',
        scrollbarWidth: 'none',
      }}
    >
      {/* Current User Story slot */}
      <StoryAvatar
        user={currentUser}
        isCurrentUser
        hasUnseen={userStoryIndex >= 0 ? stories[userStoryIndex].hasUnseen : false}
        onClick={() => {
          if (userStoryIndex >= 0) {
            onOpenStory(userStoryIndex);
          } else {
            onOpenCreator();
          }
        }}
        onAddStory={onOpenCreator}
        size={58}
      />

      {/* Other users' stories */}
      {stories
        .map((story, index) => ({ story, index }))
        .filter(({ story }) => story.userId !== currentUser.id)
        .map(({ story, index }) => (
          <StoryAvatar
            key={story.id}
            user={story.user}
            hasUnseen={story.hasUnseen}
            onClick={() => onOpenStory(index)}
            size={58}
          />
        ))}
    </div>
  );
};
