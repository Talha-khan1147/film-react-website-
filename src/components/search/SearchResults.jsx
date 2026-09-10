import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, ArrowRight, ShieldCheck, Download, Play } from 'lucide-react';
import { getMovieDetailsRoute, getWatchRoute } from '../../constants/routes';
import placeholderPoster from '../../assets/images/poster-placeholder.svg';
import Loader from '../common/Loader';

export function SearchResults({
  results = [],
  isLoading = false,
  query = '',
  hasSearched = false,
  onSelectMovie = null,
  onViewAll = null
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <Loader type="spinner" text={`Searching legal archives for "${query}"...`} />
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <Film size={32} color="#64748b" style={{ margin: '0 auto 0.75rem auto' }} />
        <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '0.25rem' }}>
          No movies found
        </h4>
        <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto' }}>
          No legal films matched "{query}". Try checking for alternative titles or spelling.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Display top 5 matches in dropdown preview
  const previewItems = results.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '0.6rem 1rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#94a3b8',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Matching Films ({results.length})</span>
        <span style={{ color: '#34d399' }}>Verified Legal</span>
      </div>

      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {previewItems.map((movie) => (
          <div
            key={movie.id}
            onClick={() => {
              if (onSelectMovie) onSelectMovie(movie);
              navigate(getMovieDetailsRoute(movie.id));
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            {/* Thumbnail */}
            <div style={{
              width: '44px',
              height: '62px',
              flexShrink: 0,
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#1f2937'
            }}>
              <img
                src={movie.posterUrl || placeholderPoster}
                alt={movie.title}
                onError={(e) => { e.currentTarget.src = placeholderPoster; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: '#f8fafc',
                fontWeight: '600',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {movie.title}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#94a3b8',
                marginTop: '2px'
              }}>
                {movie.year && <span>{movie.year}</span>}
                {movie.genres?.[0] && <span>• {movie.genres[0]}</span>}
                <span>• {movie.source}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '4px' }}>
                <span className="badge badge-public-domain" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                  {movie.license?.includes('Creative') ? 'CC-BY' : 'Public Domain'}
                </span>
                {movie.downloadable && movie.legalDownloadUrl && (
                  <span className="badge badge-downloadable" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                    Downloadable
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
              <Link
                to={getWatchRoute(movie.id)}
                title="Watch Online"
                style={{
                  padding: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Play size={14} fill="#f59e0b" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All CTA */}
      <button
        type="button"
        onClick={onViewAll}
        style={{
          width: '100%',
          padding: '0.85rem',
          backgroundColor: '#1f2937',
          color: '#f59e0b',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#283548'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1f2937'; }}
      >
        <span>View all {results.length} results</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default SearchResults;
