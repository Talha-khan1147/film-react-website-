import { useState, useEffect, useRef, useCallback } from 'react';
import { movieService } from '../services/movieService';

/**
 * Custom hook for debounced, abortable searching across legal sources.
 *
 * @param {string} initialQuery
 * @param {number} debounceMs
 * @param {Object} filters
 */
export function useSearch(initialQuery = '', debounceMs = 350, filters = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const abortControllerRef = useRef(null);

  // Debounce the raw query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  // Execute search when debounced query or filters change
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    movieService
      .searchMovies(debouncedQuery, filters, controller.signal)
      .then((data) => {
        setResults(data);
        setHasSearched(true);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('[useSearch] Search failure:', err);
        setError('Unable to complete search at this moment.');
        setIsLoading(false);
        setHasSearched(true);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, JSON.stringify(filters)]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    isLoading,
    error,
    hasSearched,
    clearSearch
  };
}

export default useSearch;
