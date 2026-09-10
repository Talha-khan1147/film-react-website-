import { archiveApi } from './api/archiveApi';
import { wikimediaApi } from './api/wikimediaApi';
import { getVerifiedLegalMovies } from './api/movieSources';
import { deduplicateMovies } from '../utils/deduplicateMovies';

// Keep track of source health across requests
let lastSourceErrors = {
  archive: null,
  wikimedia: null
};

export const movieService = {
  /**
   * Returns current source error status for user warnings
   */
  getSourceErrors() {
    return { ...lastSourceErrors };
  },

  /**
   * Searches across all legal movie sources and combines results
   * @param {string} query Search terms
   * @param {Object} filters Filter options
   * @param {AbortSignal} signal
   */
  async searchMovies(query = '', filters = {}, signal) {
    const trimmedQuery = query.trim().toLowerCase();
    const verifiedCatalog = getVerifiedLegalMovies();

    // 1. Filter local verified catalog matching query
    let localMatches = [];
    if (trimmedQuery) {
      localMatches = verifiedCatalog.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(trimmedQuery);
        const descMatch = m.description.toLowerCase().includes(trimmedQuery);
        const directorMatch = m.director && m.director.toLowerCase().includes(trimmedQuery);
        const genreMatch = m.genres.some(g => g.toLowerCase().includes(trimmedQuery));
        return titleMatch || descMatch || directorMatch || genreMatch;
      });
    } else {
      localMatches = verifiedCatalog;
    }

    // 2. Fetch external APIs concurrently using Promise.allSettled
    const sourcePromises = [];

    // Archive API search
    sourcePromises.push(
      archiveApi.searchMovies(query, { rows: 24, signal })
        .then(res => {
          lastSourceErrors.archive = null;
          return { source: 'archive', data: res };
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            lastSourceErrors.archive = 'Internet Archive search is temporarily experiencing connection delays.';
            console.warn('[movieService] Archive API error:', err.message);
          }
          return { source: 'archive', data: [] };
        })
    );

    // Wikimedia Commons search (only if query provided)
    if (trimmedQuery.length >= 2) {
      sourcePromises.push(
        wikimediaApi.searchMovies(query, { limit: 12, signal })
          .then(res => {
            lastSourceErrors.wikimedia = null;
            return { source: 'wikimedia', data: res };
          })
          .catch(err => {
            if (err.name !== 'AbortError') {
              lastSourceErrors.wikimedia = 'Wikimedia Commons is temporarily unavailable.';
              console.warn('[movieService] Wikimedia API error:', err.message);
            }
            return { source: 'wikimedia', data: [] };
          })
      );
    }

    const settled = await Promise.allSettled(sourcePromises);
    let externalMovies = [];

    for (const item of settled) {
      if (item.status === 'fulfilled' && Array.isArray(item.value?.data)) {
        externalMovies.push(...item.value.data);
      }
    }

    // 3. Combine verified catalog + external sources
    const combined = [...localMatches, ...externalMovies];

    // 4. Deduplicate across sources
    const deduplicated = deduplicateMovies(combined);

    // 5. Apply filters
    return this.applyFilters(deduplicated, filters);
  },

  /**
   * Retrieve a movie by its ID across verified catalog or Archive.org metadata
   */
  async getMovieById(id, signal) {
    if (!id) return null;

    // First check verified catalog
    const verified = getVerifiedLegalMovies().find(m => m.id === id);
    if (verified) {
      return verified;
    }

    // If identifier is from Internet Archive (ia_*)
    if (id.startsWith('ia_') || !id.includes('_')) {
      const archiveMeta = await archiveApi.getMovieMetadata(id, { signal });
      if (archiveMeta) return archiveMeta;
    }

    return null;
  },

  /**
   * Get featured movies for Hero / spotlight
   */
  getFeaturedMovies() {
    const verified = getVerifiedLegalMovies();
    return verified.filter(m => m.featured);
  },

  /**
   * Get recently added / curated shelf
   */
  getRecentlyAdded() {
    const verified = getVerifiedLegalMovies();
    return verified.slice(0, 8);
  },

  /**
   * Get popular in library
   */
  getPopularMovies() {
    const verified = getVerifiedLegalMovies();
    return verified.filter(m => ['Night of the Living Dead', 'His Girl Friday', 'The General', 'Nosferatu', 'Metropolis', 'Charade', 'The Kid'].includes(m.title));
  },

  /**
   * Get public domain classics
   */
  getPublicDomainClassics() {
    const verified = getVerifiedLegalMovies();
    return verified.filter(m => m.license.includes('Public Domain'));
  },

  /**
   * Get openly licensed (Creative Commons) films
   */
  getOpenlyLicensedFilms() {
    const verified = getVerifiedLegalMovies();
    return verified.filter(m => m.license.includes('Creative Commons') || m.license.includes('CC'));
  },

  /**
   * Get movies by genre
   */
  getMoviesByGenre(genre) {
    if (!genre || genre === 'All') return getVerifiedLegalMovies();
    const verified = getVerifiedLegalMovies();
    return verified.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
  },

  /**
   * Filter helper
   */
  applyFilters(movies, filters = {}) {
    let result = [...movies];

    // Filter by Genre
    if (filters.genre && filters.genre !== 'All') {
      const targetGenre = filters.genre.toLowerCase();
      result = result.filter(m => m.genres.some(g => g.toLowerCase().includes(targetGenre)));
    }

    // Filter by License
    if (filters.license && filters.license !== 'All') {
      if (filters.license === 'Public Domain') {
        result = result.filter(m => m.license.toLowerCase().includes('public domain'));
      } else if (filters.license === 'Creative Commons') {
        result = result.filter(m => m.license.toLowerCase().includes('creative commons') || m.license.toLowerCase().includes('cc'));
      }
    }

    // Filter by Source
    if (filters.source && filters.source !== 'All') {
      const src = filters.source.toLowerCase();
      result = result.filter(m => m.source.toLowerCase().includes(src));
    }

    // Filter by Downloadable Availability
    if (filters.downloadableOnly) {
      result = result.filter(m => m.downloadable === true && Boolean(m.legalDownloadUrl));
    }

    // Filter by Watch Online Availability
    if (filters.watchOnlineOnly) {
      result = result.filter(m => Boolean(m.embedUrl || m.directStreamUrl || m.watchUrl));
    }

    // Filter by Release Year Range
    if (filters.yearMin) {
      result = result.filter(m => m.year && m.year >= filters.yearMin);
    }
    if (filters.yearMax) {
      result = result.filter(m => m.year && m.year <= filters.yearMax);
    }

    return result;
  }
};

export default movieService;
