import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Heart, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { getMovieDetailsRoute, getWatchRoute } from '../../constants/routes';
import { useFavorites } from '../../hooks/useFavorites';
import placeholderPoster from '../../assets/images/poster-placeholder.svg';
import DownloadButton from './DownloadButton';
import Button from '../common/Button';

export function MovieCard({ movie, compact = false }) {
  const [imgSrc, setImgSrc] = useState(movie?.posterUrl || placeholderPoster);
  const [imgError, setImgError] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  if (!movie) return null;

  const favorited = isFavorite(movie.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(placeholderPoster);
    }
  };

  const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : null;

  return (
    <article
      className="freeflix-movie-card"
      style={{
        backgroundColor: '#111827',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
      }}
    >
      {/* Poster Media Box */}
      <div style={{ position: 'relative', aspectRatio: '2/3', width: '100%', overflow: 'hidden', backgroundColor: '#070a10' }}>
        <Link to={getMovieDetailsRoute(movie.id)} tabIndex={-1} aria-label={`View details for ${movie.title}`}>
          <img
            src={imgSrc}
            alt={movie.title ? `${movie.title} poster` : 'Film poster'}
            loading="lazy"
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1.0)';
            }}
          />
        </Link>

        {/* Floating Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          aria-label={favorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: favorited ? '#f43f5e' : 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            transition: 'transform 0.15s ease, background-color 0.2s ease',
            zIndex: 2
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Heart size={16} fill={favorited ? '#ffffff' : 'none'} strokeWidth={2.2} />
        </button>

        {/* Source Badge overlay */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: 'rgba(11, 15, 23, 0.85)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          borderRadius: '4px',
          padding: '2px 6px',
          fontSize: '0.675rem',
          fontWeight: '700',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          letterSpacing: '0.02em',
          zIndex: 2
        }}>
          {movie.source || 'Public Archive'}
        </div>

        {/* License Pill */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          backdropFilter: 'blur(4px)',
          borderRadius: '4px',
          padding: '2px 6px',
          fontSize: '0.65rem',
          fontWeight: '700',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          zIndex: 2
        }}>
          {movie.license?.includes('Creative') ? 'CC-BY' : 'Public Domain'}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div style={{
        padding: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '0.4rem',
        backgroundColor: '#111827'
      }}>
        {/* Title */}
        <h3 style={{
          fontSize: '0.975rem',
          fontWeight: '700',
          lineHeight: '1.3',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.6em'
        }}>
          <Link
            to={getMovieDetailsRoute(movie.id)}
            style={{ color: '#f8fafc' }}
            title={movie.title}
          >
            {movie.title}
          </Link>
        </h3>

        {/* Year, Genre, and Duration Info Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          flexWrap: 'wrap'
        }}>
          {movie.year && <span>{movie.year}</span>}
          {movie.year && primaryGenre && <span>•</span>}
          {primaryGenre && <span>{primaryGenre}</span>}
          {movie.duration && <span>•</span>}
          {movie.duration && <span>{movie.duration}</span>}
        </div>

        {/* Actions Row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Watch Online Button */}
          <Button
            size="sm"
            variant="primary"
            icon={Play}
            onClick={() => navigate(getWatchRoute(movie.id))}
            style={{ width: '100%' }}
          >
            Watch Online
          </Button>

          {/* Download Button - STRICTLY GATED TO downloadable === true AND legalDownloadUrl */}
          {movie.downloadable && movie.legalDownloadUrl && (
            <DownloadButton
              movie={movie}
              size="sm"
              variant="secondary"
              style={{ width: '100%', fontSize: '0.8rem' }}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
