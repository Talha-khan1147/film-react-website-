import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Download, ExternalLink, ShieldCheck, Info, Share2, Film, Check } from 'lucide-react';
import { getWatchRoute } from '../../constants/routes';
import { useFavorites } from '../../hooks/useFavorites';
import MovieMeta from './MovieMeta';
import DownloadButton from './DownloadButton';
import Button from '../common/Button';
import placeholderPoster from '../../assets/images/poster-placeholder.svg';

export function MovieDetails({ movie }) {
  const [imgSrc, setImgSrc] = useState(movie?.posterUrl || placeholderPoster);
  const [copied, setCopied] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  if (!movie) return null;

  const favorited = isFavorite(movie.id);

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${movie.title} - FreeFlix Library`,
          text: `Watch ${movie.title} legally for free on FreeFlix Library!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore abort
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Top Presentation Block */}
      <div
        className="movie-details-header"
        style={{
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'flex-start',
          backgroundColor: '#111827',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Poster Column */}
        <div
          className="movie-details-poster-wrap"
          style={{
            width: '280px',
            flexShrink: 0,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#0a0e17',
            aspectRatio: '2/3'
          }}
        >
          <img
            src={imgSrc}
            alt={`${movie.title} poster`}
            onError={() => setImgSrc(placeholderPoster)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Content Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.5rem', color: '#f8fafc' }}>
              {movie.title}
            </h1>
            {movie.director && (
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                Directed by <strong style={{ color: '#e2e8f0' }}>{movie.director}</strong>
              </p>
            )}
          </div>

          {/* Metadata Chips */}
          <MovieMeta movie={movie} size="md" />

          {/* Genres Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.25rem 0' }}>
            {movie.genres?.map((genre, idx) => (
              <span key={idx} className="badge badge-genre">
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div style={{ margin: '0.75rem 0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.4rem' }}>
              Overview
            </h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {movie.description}
            </p>
          </div>

          {/* Legal Status Card */}
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: '700' }}>
              <ShieldCheck size={18} />
              <span>Verified Legal Distribution</span>
            </div>
            <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
              <strong>License:</strong> {movie.license}. Preserved in cultural repository: <strong>{movie.source}</strong>.
            </div>
            {movie.licenseUrl && (
              <a
                href={movie.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span>View License Details</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Main Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.875rem',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Watch Online Button */}
            <Button
              size="lg"
              variant="primary"
              icon={Play}
              onClick={() => navigate(getWatchRoute(movie.id))}
            >
              Watch Online
            </Button>

            {/* Download Button strictly with fallback text */}
            <DownloadButton
              movie={movie}
              size="lg"
              variant="secondary"
              showUnavailableText={true}
            />

            {/* Favorite Toggle */}
            <Button
              size="lg"
              variant={favorited ? 'danger' : 'ghost'}
              icon={Heart}
              onClick={handleToggleFavorite}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorited ? 'In Favorites' : 'Add to Favorites'}
            </Button>

            {/* Share */}
            <Button
              size="lg"
              variant="ghost"
              icon={copied ? Check : Share2}
              onClick={handleShare}
            >
              {copied ? 'Link Copied' : 'Share'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
