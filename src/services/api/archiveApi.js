import { normalizeMovie } from '../../utils/normalizeMovie';

const ARCHIVE_BASE = 'https://archive.org';

/**
 * Adapter for Internet Archive Public Domain & Open Video Collections
 */
export const archiveApi = {
  /**
   * Search Internet Archive films
   * @param {string} query Search terms
   * @param {Object} options Options like page, rows, signal
   */
  async searchMovies(query = '', { page = 1, rows = 24, signal } = {}) {
    try {
      let qStr = 'mediatype:(movies) AND (collection:(feature_films) OR collection:(silent_films) OR collection:(classic_tv_and_movies))';
      if (query.trim()) {
        const cleanQuery = query.replace(/[^\w\s]/gi, '').trim();
        qStr = `(${cleanQuery}* OR title:(${cleanQuery}*)) AND ${qStr}`;
      }

      const params = new URLSearchParams({
        q: qStr,
        'fl[]': 'identifier,title,description,year,genre,publicdate,downloads,licenseurl',
        'sort[]': 'downloads desc',
        rows: String(rows),
        page: String(page),
        output: 'json'
      });

      const response = await fetch(`${ARCHIVE_BASE}/advancedsearch.php?${params.toString()}`, {
        signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Internet Archive search failed with status ${response.status}`);
      }

      const data = await response.json();
      const docs = data?.response?.docs || [];

      return docs.map(doc => {
        // Internet Archive items with standard identifiers can be viewed at archive.org/embed/{id}
        // and direct details at archive.org/details/{id}
        return normalizeMovie({
          id: `ia_${doc.identifier}`,
          identifier: doc.identifier,
          title: doc.title || doc.identifier,
          year: doc.year,
          description: doc.description,
          genre: doc.genre,
          source: 'Internet Archive',
          sourceUrl: `${ARCHIVE_BASE}/details/${doc.identifier}`,
          posterUrl: `${ARCHIVE_BASE}/services/img/${doc.identifier}`,
          embedUrl: `${ARCHIVE_BASE}/embed/${doc.identifier}`,
          license: doc.licenseurl ? 'Creative Commons / Public Domain' : 'Public Domain Mark 1.0',
          licenseUrl: doc.licenseurl || 'https://creativecommons.org/publicdomain/mark/1.0/',
          // Conservative default until specific metadata is loaded:
          // Download is verified on details/play, or directly if standard stream format exists
          downloadable: false,
          legalDownloadUrl: null
        }, 'Internet Archive');
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn('[Archive API] Search error:', err.message);
      return [];
    }
  },

  /**
   * Fetch detailed metadata including real verified downloadable files for an item
   * @param {string} rawId Internet Archive identifier
   * @param {Object} options
   */
  async getMovieMetadata(rawId, { signal } = {}) {
    try {
      const identifier = rawId.replace(/^ia_/, '');
      const res = await fetch(`${ARCHIVE_BASE}/metadata/${encodeURIComponent(identifier)}`, {
        signal,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`Archive metadata fetch failed with status ${res.status}`);
      }

      const data = await res.json();
      if (!data || !data.metadata) return null;

      const meta = data.metadata;
      const files = Array.isArray(data.files) ? data.files : [];

      // Find the best legal MP4 video file
      // Criteria: .mp4 extension and format h.264 / 512Kb MPEG4 / MPEG4
      const mp4File = files.find(f => 
        f.name && f.name.toLowerCase().endsWith('.mp4') && 
        (f.format === 'h.264' || f.format === '512Kb MPEG4' || f.format === 'MPEG4' || !f.format)
      ) || files.find(f => f.name && f.name.toLowerCase().endsWith('.mp4'))
        || files.find(f => f.name && (f.name.toLowerCase().endsWith('.ogv') || f.name.toLowerCase().endsWith('.webm')));

      let legalDownloadUrl = null;
      let directStreamUrl = null;
      let fileSize = null;
      let quality = 'Standard Definition';
      let duration = meta.length || meta.runtime || null;

      if (mp4File) {
        legalDownloadUrl = `${ARCHIVE_BASE}/download/${identifier}/${encodeURIComponent(mp4File.name)}`;
        directStreamUrl = legalDownloadUrl;
        if (mp4File.size) {
          const mb = (parseInt(mp4File.size, 10) / (1024 * 1024)).toFixed(1);
          fileSize = `${mb} MB`;
        }
        if (mp4File.height) {
          quality = `${mp4File.height}p (${mp4File.format || 'MP4'})`;
        }
        if (mp4File.length) {
          duration = mp4File.length;
        }
      }

      return normalizeMovie({
        id: `ia_${identifier}`,
        identifier,
        title: meta.title || identifier,
        year: meta.year || meta.date,
        description: meta.description,
        genre: meta.genre || meta.subject,
        duration: duration,
        director: meta.creator || meta.director,
        source: 'Internet Archive',
        sourceUrl: `${ARCHIVE_BASE}/details/${identifier}`,
        posterUrl: `${ARCHIVE_BASE}/services/img/${identifier}`,
        embedUrl: `${ARCHIVE_BASE}/embed/${identifier}`,
        directStreamUrl: directStreamUrl,
        legalDownloadUrl: legalDownloadUrl,
        // STRICT DOWNLOAD VERIFICATION:
        downloadable: Boolean(legalDownloadUrl),
        fileSize: fileSize,
        quality: quality,
        license: meta.licenseurl ? 'Creative Commons / Public Domain' : 'Public Domain Mark 1.0',
        licenseUrl: meta.licenseurl || 'https://creativecommons.org/publicdomain/mark/1.0/'
      }, 'Internet Archive');
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn(`[Archive API] Metadata error for ${rawId}:`, err.message);
      return null;
    }
  }
};

export default archiveApi;
