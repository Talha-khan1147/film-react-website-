import { useState, useEffect, useCallback } from 'react';
import { movieService } from '../services/movieService';

/**
 * Hook for browsing and categorizing movies with pagination.
 *
 * @param {string} category 
 * @param {Object} filters
 * @param {number} pageSize
 */
export function useMovies(category = 'all', filters = {}, pageSize = 12) {
  const [movies, setMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data = [];
      switch (category) {
        case 'featured':
          data = movieService.getFeaturedMovies();
          break;
        case 'recent':
          data = movieService.getRecentlyAdded();
          break;
        case 'popular':
          data = movieService.getPopularMovies();
          break;
        case 'classics':
          data = movieService.getPublicDomainClassics();
          break;
        case 'open':
          data = movieService.getOpenlyLicensedFilms();
          break;
        default:
          data = await movieService.searchMovies('', filters);
          break;
      }

      // Apply any extra filters passed
      const filtered = movieService.applyFilters(data, filters);
      setMovies(filtered);
      setDisplayedMovies(filtered.slice(0, pageSize));
      setHasMore(filtered.length > pageSize);
      setPage(1);
    } catch (err) {
      console.error('[useMovies] Error loading movies:', err);
      setError('Unable to load movies. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [category, JSON.stringify(filters), pageSize]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextBatch = movies.slice(0, nextPage * pageSize);
    setDisplayedMovies(nextBatch);
    setPage(nextPage);
    setHasMore(nextBatch.length < movies.length);
  }, [movies, page, pageSize]);

  return {
    movies: displayedMovies,
    totalCount: movies.length,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch: fetchMovies
  };
}

export default useMovies;
