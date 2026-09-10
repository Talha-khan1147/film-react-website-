import React from 'react';
import { Filter, X, Check } from 'lucide-react';
import { GENRES } from '../../constants/sources';

export function SearchFilters({
  filters,
  onChange,
  onReset
}) {
  const handleGenreChange = (genre) => {
    onChange({ ...filters, genre });
  };

  const handleLicenseChange = (license) => {
    onChange({ ...filters, license });
  };

  const handleSourceChange = (source) => {
    onChange({ ...filters, source });
  };

  const toggleDownloadable = () => {
    onChange({ ...filters, downloadableOnly: !filters.downloadableOnly });
  };

  const toggleWatchOnline = () => {
    onChange({ ...filters, watchOnlineOnly: !filters.watchOnlineOnly });
  };

  const hasActiveFilters =
    (filters.genre && filters.genre !== 'All') ||
    (filters.license && filters.license !== 'All') ||
    (filters.source && filters.source !== 'All') ||
    filters.downloadableOnly ||
    filters.watchOnlineOnly;

  const pillStyle = (isActive) => ({
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(17, 24, 39, 0.6)',
    color: isActive ? '#f59e0b' : '#cbd5e1',
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem'
  });

  return (
    <div style={{
      backgroundColor: '#111827',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontWeight: '700', fontSize: '0.95rem' }}>
          <Filter size={16} color="#f59e0b" />
          <span>Filter Movie Archive</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <X size={14} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* License Filter */}
      <div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
          Legal License Status:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['All', 'Public Domain', 'Creative Commons'].map((lic) => (
            <button
              key={lic}
              type="button"
              onClick={() => handleLicenseChange(lic)}
              style={pillStyle((filters.license || 'All') === lic)}
            >
              {(filters.license || 'All') === lic && <Check size={12} />}
              {lic}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Flags */}
      <div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
          Playback & Download Eligibility:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={toggleDownloadable}
            style={pillStyle(Boolean(filters.downloadableOnly))}
          >
            {filters.downloadableOnly && <Check size={12} />}
            Downloadable Legally
          </button>
          <button
            type="button"
            onClick={toggleWatchOnline}
            style={pillStyle(Boolean(filters.watchOnlineOnly))}
          >
            {filters.watchOnlineOnly && <Check size={12} />}
            Watch Online
          </button>
        </div>
      </div>

      {/* Source Repository */}
      <div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
          Preservation Source:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['All', 'Internet Archive', 'Wikimedia Commons', 'Blender'].map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => handleSourceChange(src)}
              style={pillStyle((filters.source || 'All') === src)}
            >
              {(filters.source || 'All') === src && <Check size={12} />}
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      <div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
          Genres:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenreChange(g)}
              style={pillStyle((filters.genre || 'All') === g)}
            >
              {(filters.genre || 'All') === g && <Check size={12} />}
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
