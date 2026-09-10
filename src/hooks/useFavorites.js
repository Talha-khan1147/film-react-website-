import { useMovieContext } from '../context/MovieContext';

/**
 * Hook for managing favorite movies using shared global context and persistent storage.
 */
export function useFavorites() {
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } = useMovieContext();

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites
  };
}

export default useFavorites;
