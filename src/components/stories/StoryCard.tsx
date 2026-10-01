import React from 'react';
import { Story } from '../../types/story';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../common/Avatar';
import { getRelativeTime } from '../../utils/dateUtils';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const { theme } = useTheme();
  const latestSlide = story.slides[0];

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        height: 180,
        backgroundColor: latestSlide?.backgroundColor || theme.colors.surfaceElevated,
        cursor: 'pointer',
        boxShadow: theme.shadows.md,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Background Image if available */}
      {latestSlide?.mediaType === 'image' && latestSlide.mediaUrl && (
        <img
          src={latestSlide.mediaUrl}
          alt={story.user.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Dark overlay for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Top User Info */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          zIndex: 2,
        }}
      >
        <Avatar
          src={story.user.avatar}
          name={story.user.name}
          size="sm"
          hasStory
          hasUnseenStory={story.hasUnseen}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {story.user.name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>
            {getRelativeTime(story.updatedAt)}
          </div>
        </div>
      </div>

      {/* Caption or Quote preview at bottom */}
      {latestSlide?.caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            fontSize: 12,
            color: '#FFFFFF',
            fontWeight: 500,
            lineHeight: 1.3,
            maxHeight: 46,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 2,
          }}
        >
          {latestSlide.caption}
        </div>
      )}
    </div>
  );
};
