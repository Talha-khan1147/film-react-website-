import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storage from '../utils/storage';
import { movieService } from '../services/movieService';

const MovieContext = createContext(null);
const FAVORITES_KEY = 'user_favorites';

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    return storage.get(FAVORITES_KEY, []);
  });
  const [sourceErrors, setSourceErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Sync favorites with storage
  useEffect(() => {
    storage.set(FAVORITES_KEY, favorites);
  }, [favorites]);

  // Periodic or trigger-based source error checks
  const checkSourceHealth = useCallback(() => {
    const errs = movieService.getSourceErrors();
    setSourceErrors(errs);
  }, []);

  const addFavorite = useCallback((movie) => {
    if (!movie || !movie.id) return;
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
    setToastMessage(`Added "${movie.title}" to your Favorites`);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const removeFavorite = useCallback((movieId) => {
    if (!movieId) return;
    setFavorites((prev) => {
      const target = prev.find((m) => m.id === movieId);
      if (target) {
        setToastMessage(`Removed "${target.title}" from Favorites`);
        setTimeout(() => setToastMessage(null), 3500);
      }
      return prev.filter((m) => m.id !== movieId);
    });
  }, []);

  const isFavorite = useCallback((movieId) => {
    if (!movieId) return false;
    return favorites.some((m) => m.id === movieId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setToastMessage('Cleared all favorites');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  return (
    <MovieContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        sourceErrors,
        checkSourceHealth,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <span>★</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}

export default MovieContext;
