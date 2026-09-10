import React from 'react';
import MovieCard from './MovieCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { ArrowDown } from 'lucide-react';

export function MovieGrid({
  movies = [],
  isLoading = false,
  hasMore = false,
  onLoadMore = null,
  emptyTitle = 'No movies found',
  emptyDescription = 'There are currently no legal free films matching this view.',
  emptyActionText = null,
  onEmptyAction = null,
  skeletonCount = 12
}) {
  if (isLoading && (!movies || movies.length === 0)) {
    return <Loader type="skeleton-grid" count={skeletonCount} />;
  }

  if (!isLoading && (!movies || movies.length === 0)) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination / Load More */}
      {hasMore && onLoadMore && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2.5rem',
          paddingBottom: '1rem'
        }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={onLoadMore}
            isLoading={isLoading}
            icon={ArrowDown}
            iconPosition="right"
          >
            Load More Films
          </Button>
        </div>
      )}
    </div>
  );
}

export default MovieGrid;
