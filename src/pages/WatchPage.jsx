import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Download, Heart, ExternalLink, Info } from 'lucide-react';
import { movieService } from '../services/movieService';
import MoviePlayer from '../components/movies/MoviePlayer';
import DownloadButton from '../components/movies/DownloadButton';
import MovieMeta from '../components/movies/MovieMeta';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useFavorites } from '../hooks/useFavorites';
import { ROUTES, getMovieDetailsRoute } from '../constants/routes';

export function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    window.scrollTo(0, 0);

    movieService.getMovieById(id)
      .then((data) => {
        if (!isMounted) return;
        setMovie(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[WatchPage] Load error:', err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <Loader type="fullscreen" text="Preparing legal streaming player..." />;
  }

  if (!movie) {
    return (
      <EmptyState
        title="Streaming unavailable"
        description="The requested film could not be located in our verified legal archives."
        iconType="movie"
        actionText="Back to Home"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  const favorited = isFavorite(movie.id);

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Navigation Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <Link
          to={getMovieDetailsRoute(movie.id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} />
          <span>Film Details</span>
        </Link>

        {/* Legal Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          color: '#34d399',
          fontSize: '0.78rem',
          fontWeight: '700'
        }}>
          <ShieldCheck size={14} />
          <span>Official Legal Stream</span>
        </div>
      </div>

      {/* Video Player */}
      <MoviePlayer movie={movie} />

      {/* Under-Player Metadata and Actions */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        backgroundColor: '#111827',
        padding: '1.75rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.35rem' }}>
              {movie.title} {movie.year && `(${movie.year})`}
            </h1>
            <MovieMeta movie={movie} size="sm" />
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant={favorited ? 'danger' : 'secondary'}
              icon={Heart}
              onClick={handleToggleFavorite}
            >
              {favorited ? 'In Favorites' : 'Add to Favorites'}
            </Button>

            {movie.downloadable && movie.legalDownloadUrl && (
              <DownloadButton
                movie={movie}
                variant="primary"
                showUnavailableText={false}
              />
            )}
          </div>
        </div>

        {/* Synopsis & Legal Details */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1rem',
          color: '#94a3b8',
          lineHeight: '1.6',
          fontSize: '0.925rem'
        }}>
          <p style={{ marginBottom: '1rem' }}>{movie.description}</p>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Preserved by <strong>{movie.source}</strong> under license: <strong>{movie.license}</strong>.
            {movie.sourceUrl && (
              <a
                href={movie.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '0.5rem', color: '#38bdf8', textDecoration: 'underline' }}
              >
                Official archive catalogue entry
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchPage;
