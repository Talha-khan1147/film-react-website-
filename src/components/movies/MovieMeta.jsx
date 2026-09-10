import React from 'react';
import { Calendar, Clock, ShieldCheck, Database, Video } from 'lucide-react';

/**
 * Reusable metadata chip group for movies.
 */
export function MovieMeta({ movie, size = 'md' }) {
  if (!movie) return null;

  const isPublicDomain = movie.license?.toLowerCase().includes('public domain');
  const chipFontSize = size === 'sm' ? '0.75rem' : '0.8125rem';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      alignItems: 'center',
      margin: '0.5rem 0'
    }}>
      {/* License Badge */}
      <span
        className={isPublicDomain ? 'badge badge-public-domain' : 'badge badge-creative-commons'}
        style={{ fontSize: chipFontSize }}
        title={`Legal Status: ${movie.license}`}
      >
        <ShieldCheck size={iconSize} />
        {movie.license || 'Public Domain'}
      </span>

      {/* Year */}
      {movie.year && (
        <span
          className="badge"
          style={{
            fontSize: chipFontSize,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#cbd5e1'
          }}
        >
          <Calendar size={iconSize} />
          {movie.year}
        </span>
      )}

      {/* Duration */}
      {movie.duration && (
        <span
          className="badge"
          style={{
            fontSize: chipFontSize,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#cbd5e1'
          }}
        >
          <Clock size={iconSize} />
          {movie.duration}
        </span>
      )}

      {/* Source */}
      {movie.source && (
        <span
          className="badge badge-source"
          style={{ fontSize: chipFontSize }}
          title={`Preserved by: ${movie.source}`}
        >
          <Database size={iconSize} />
          {movie.source}
        </span>
      )}

      {/* Quality / Resolution */}
      {movie.quality && (
        <span
          className="badge"
          style={{
            fontSize: chipFontSize,
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            color: '#38bdf8',
            border: '1px solid rgba(6, 182, 212, 0.25)'
          }}
        >
          <Video size={iconSize} />
          {movie.quality}
        </span>
      )}
    </div>
  );
}

export default MovieMeta;
