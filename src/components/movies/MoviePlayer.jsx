import React, { useState } from 'react';
import { Play, ExternalLink, ShieldCheck, Maximize2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import placeholderPoster from '../../assets/images/poster-placeholder.svg';

export function MoviePlayer({ movie }) {
  const [useDirectStream, setUseDirectStream] = useState(Boolean(movie?.directStreamUrl));
  const [videoError, setVideoError] = useState(false);

  if (!movie) return null;

  const hasEmbed = Boolean(movie.embedUrl);
  const hasDirectStream = Boolean(movie.directStreamUrl) && !videoError;
  const canPlay = hasDirectStream || hasEmbed;

  if (!canPlay) {
    return (
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <AlertCircle size={40} color="#f59e0b" />
        <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
          Online playback is not available.
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', lineHeight: '1.6' }}>
          This cultural title does not have an active browser embed stream available on our servers. You can view or check preservation files directly on the authorized archive.
        </p>
        {movie.sourceUrl && (
          <a href={movie.sourceUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" icon={ExternalLink}>
              Visit Official {movie.source} Page
            </Button>
          </a>
        )}
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#000000',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Video Container 16:9 */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        backgroundColor: '#05070d'
      }}>
        {/* Direct HTML5 Stream Player */}
        {hasDirectStream && useDirectStream ? (
          <video
            controls
            playsInline
            poster={movie.posterUrl || placeholderPoster}
            src={movie.directStreamUrl}
            onError={() => {
              console.warn('Direct stream failed; falling back to authorized embed player.');
              setVideoError(true);
              setUseDirectStream(false);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : hasEmbed ? (
          /* Official Archive / Source Embed */
          <iframe
            title={`${movie.title} player`}
            src={movie.embedUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : null}
      </div>

      {/* Stream Attribution & License Notice Bar */}
      <div style={{
        backgroundColor: '#0b0f17',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.8125rem',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>
            Streaming legally via <strong>{movie.source}</strong> ({movie.license})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {hasEmbed && hasDirectStream && (
            <button
              onClick={() => setUseDirectStream(!useDirectStream)}
              style={{ color: '#f59e0b', fontSize: '0.775rem', textDecoration: 'underline' }}
            >
              Switch to {useDirectStream ? 'Official Embed Player' : 'Direct HTML5 Player'}
            </button>
          )}

          {movie.sourceUrl && (
            <a
              href={movie.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8' }}
            >
              <span>Source Archive</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoviePlayer;
