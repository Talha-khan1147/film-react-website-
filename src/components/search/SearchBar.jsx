import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import SearchResults from './SearchResults';
import { ROUTES } from '../../constants/routes';

export function SearchBar({
  placeholder = 'Search legal movies by title, director, or genre (e.g. "charlie")...',
  initialValue = '',
  onSearchSubmit = null,
  showDropdown = true,
  autoFocus = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const {
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    clearSearch
  } = useSearch(initialValue, 350);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (showDropdown && val.trim().length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleViewAll();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto'
      }}
    >
      {/* Search Input Bar */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#111827',
        border: isOpen ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: isOpen && showDropdown && (isLoading || results.length > 0 || hasSearched) ? '12px 12px 0 0' : '12px',
        boxShadow: isOpen ? '0 0 20px rgba(245, 158, 11, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease',
        overflow: 'hidden'
      }}>
        <div style={{ paddingLeft: '1.25rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <Loader2 size={20} color="#f59e0b" style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <Search size={20} />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (showDropdown && query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            width: '100%',
            padding: '1rem 0.85rem',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontSize: '1rem',
          }}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              clearSearch();
              setIsOpen(false);
            }}
            aria-label="Clear search input"
            style={{
              padding: '0.5rem 1rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Results Overlay underneath Search Bar */}
      {showDropdown && isOpen && (query.trim().length > 0) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#111827',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          zIndex: 500,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease'
        }}>
          <SearchResults
            results={results}
            isLoading={isLoading}
            query={query}
            hasSearched={hasSearched}
            onSelectMovie={() => setIsOpen(false)}
            onViewAll={handleViewAll}
          />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
