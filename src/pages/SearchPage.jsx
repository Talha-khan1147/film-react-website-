import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Film, X } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import SearchFilters from '../components/search/SearchFilters';
import MovieGrid from '../components/movies/MovieGrid';
import { movieService } from '../services/movieService';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const genreParam = searchParams.get('genre') || 'All';
  const licenseParam = searchParams.get('license') || 'All';
  const sourceParam = searchParams.get('source') || 'All';
  const downloadableParam = searchParams.get('downloadable') === 'true';
  const watchOnlineParam = searchParams.get('watchOnline') === 'true';

  const [filters, setFilters] = useState({
    genre: genreParam,
    license: licenseParam,
    source: sourceParam,
    downloadableOnly: downloadableParam,
    watchOnlineOnly: watchOnlineParam
  });

  const [movies, setMovies] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    setFilters({
      genre: searchParams.get('genre') || 'All',
      license: searchParams.get('license') || 'All',
      source: searchParams.get('source') || 'All',
      downloadableOnly: searchParams.get('downloadable') === 'true',
      watchOnlineOnly: searchParams.get('watchOnline') === 'true'
    });
  }, [searchParams]);

  // Fetch movies when query or filters change
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    setIsLoading(true);

    movieService.searchMovies(queryParam, filters, controller.signal)
      .then((results) => {
        if (isMounted) {
          setMovies(results);
          setDisplayedCount(12);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('[SearchPage] Fetch error:', err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [queryParam, JSON.stringify(filters)]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (queryParam) params.set('q', queryParam);
    if (newFilters.genre && newFilters.genre !== 'All') params.set('genre', newFilters.genre);
    if (newFilters.license && newFilters.license !== 'All') params.set('license', newFilters.license);
    if (newFilters.source && newFilters.source !== 'All') params.set('source', newFilters.source);
    if (newFilters.downloadableOnly) params.set('downloadable', 'true');
    if (newFilters.watchOnlineOnly) params.set('watchOnline', 'true');
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      genre: 'All',
      license: 'All',
      source: 'All',
      downloadableOnly: false,
      watchOnlineOnly: false
    };
    handleFilterChange(defaultFilters);
  };

  const handleSearchSubmit = (newQuery) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery.trim()) {
      params.set('q', newQuery.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const visibleMovies = movies.slice(0, displayedCount);
  const hasMore = displayedCount < movies.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 12);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', color: '#f8fafc' }}>
          Browse & Search Movies
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Discover public-domain cinema and openly licensed films from authorized digital archives.
        </p>
        <SearchBar
          initialValue={queryParam}
          onSearchSubmit={handleSearchSubmit}
          showDropdown={false}
        />
      </div>

      {/* Main Filter & Results Layout */}
      <div>
        <SearchFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Results Info Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Showing <strong style={{ color: '#f8fafc' }}>{visibleMovies.length}</strong> of{' '}
            <strong style={{ color: '#f8fafc' }}>{movies.length}</strong> verified legal films
            {queryParam && (
              <span> for query "<span style={{ color: '#f59e0b' }}>{queryParam}</span>"</span>
            )}
          </div>
        </div>

        {/* Movie Grid */}
        <MovieGrid
          movies={visibleMovies}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          emptyTitle="No movies found"
          emptyDescription={
            queryParam
              ? `No legal films matching "${queryParam}" were found with the selected filters. Try broadening your criteria.`
              : 'No movies match your selected filter criteria. Try resetting the filters.'
          }
          emptyActionText="Reset All Filters"
          onEmptyAction={handleResetFilters}
        />
      </div>
    </div>
  );
}

export default SearchPage;
