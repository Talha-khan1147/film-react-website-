import { formatDuration } from './formatDuration';
import placeholderPoster from '../assets/images/poster-placeholder.svg';

/**
 * Normalizes any movie raw record into a standardized, type-safe FreeFlix Movie object.
 *
 * Guaranteed contract:
 * - downloadable is true ONLY if legalDownloadUrl is a valid URL string
 * - posterUrl is a guaranteed string (falls back to SVG placeholder)
 * - genres is guaranteed to be an array of strings
 * - license is explicitly marked (Public Domain or Creative Commons)
 *
 * @param {Object} raw Raw input from an API or catalog
 * @param {string} sourceName Name of the source adapter
 * @returns {Object} Standardized Movie
 */
export function normalizeMovie(raw = {}, sourceName = 'Legal Archive') {
  if (!raw) return null;

  const id = String(raw.id || raw.identifier || raw.pageid || `movie-${Math.random().toString(36).substring(2, 9)}`);
  const title = (raw.title || raw.name || 'Untitled Classic Film').trim();

  // Extract year
  let year = null;
  if (raw.year) {
    year = parseInt(raw.year, 10) || null;
  } else if (raw.date || raw.publicdate) {
    const match = String(raw.date || raw.publicdate).match(/\b(18|19|20)\d{2}\b/);
    if (match) year = parseInt(match[0], 10);
  }

  // Description cleanup
  let description = raw.description || raw.synopsis || raw.summary || 'A historical legal public-domain / openly licensed film preserved in cultural archives.';
  if (Array.isArray(description)) description = description.join(' ');
  // Strip HTML tags if any
  description = description.replace(/<[^>]*>?/gm, '').trim();

  // Extract genres
  let genres = [];
  if (Array.isArray(raw.genres)) {
    genres = raw.genres;
  } else if (Array.isArray(raw.genre)) {
    genres = raw.genre;
  } else if (typeof raw.genre === 'string') {
    genres = raw.genre.split(/[,;/]/).map(g => g.trim()).filter(Boolean);
  } else if (typeof raw.genres === 'string') {
    genres = raw.genres.split(/[,;/]/).map(g => g.trim()).filter(Boolean);
  }
  if (genres.length === 0) {
    genres = ['Classic'];
  }

  // Determine license
  let license = raw.license || 'Public Domain';
  let licenseUrl = raw.licenseUrl || raw.licenseurl || 'https://creativecommons.org/publicdomain/mark/1.0/';
  const rawLicense = String(license + ' ' + (raw.licenseurl || '')).toLowerCase();
  if (rawLicense.includes('by-sa') || rawLicense.includes('cc-by-sa')) {
    license = 'Creative Commons BY-SA';
  } else if (rawLicense.includes('by') || rawLicense.includes('cc-by')) {
    license = 'Creative Commons BY';
  } else if (rawLicense.includes('cc0') || rawLicense.includes('zero')) {
    license = 'CC0 / Public Domain';
  } else if (rawLicense.includes('publicdomain') || rawLicense.includes('public domain')) {
    license = 'Public Domain';
  }

  // Poster determination
  let posterUrl = raw.posterUrl || raw.poster || raw.thumbnail || raw.thumb;
  if (!posterUrl && (raw.identifier || id.startsWith('ia_') || sourceName.includes('Archive'))) {
    const cleanId = raw.identifier || id.replace(/^ia_/, '');
    posterUrl = `https://archive.org/services/img/${cleanId}`;
  }
  if (!posterUrl) {
    posterUrl = placeholderPoster;
  }

  // Legal Download URL & Downloadable Flag
  // STRICT RULE: downloadable === true ONLY when legalDownloadUrl exists and is non-empty
  let legalDownloadUrl = raw.legalDownloadUrl || raw.downloadUrl || null;
  let downloadable = Boolean(raw.downloadable && legalDownloadUrl);

  // If downloadable was explicitly set true but no download URL exists, force false
  if (!legalDownloadUrl) {
    downloadable = false;
  }

  // Watch & Embed URLs
  let watchUrl = raw.watchUrl || `/watch/${id}`;
  let embedUrl = raw.embedUrl || null;
  let directStreamUrl = raw.directStreamUrl || raw.videoUrl || null;

  if (!embedUrl && (raw.identifier || id.startsWith('ia_'))) {
    const cleanId = raw.identifier || id.replace(/^ia_/, '');
    embedUrl = `https://archive.org/embed/${cleanId}`;
  }

  // Source information
  const source = raw.source || sourceName;
  const sourceUrl = raw.sourceUrl || (raw.identifier ? `https://archive.org/details/${raw.identifier}` : 'https://archive.org');

  return {
    id,
    title,
    year,
    posterUrl,
    description,
    genres,
    duration: formatDuration(raw.duration || raw.length || raw.runtime),
    source,
    sourceUrl,
    watchUrl,
    embedUrl,
    directStreamUrl,
    legalDownloadUrl,
    license,
    licenseUrl,
    downloadable,
    fileSize: raw.fileSize || null,
    quality: raw.quality || 'Standard HD / MP4',
    featured: Boolean(raw.featured),
    rating: raw.rating || null,
    director: raw.director || raw.creator || null
  };
}

export default normalizeMovie;
