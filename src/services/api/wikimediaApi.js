import { normalizeMovie } from '../../utils/normalizeMovie';

const WIKIMEDIA_BASE = 'https://commons.wikimedia.org/w/api.php';

/**
 * Adapter for Wikimedia Commons public domain and Creative Commons video archive
 */
export const wikimediaApi = {
  /**
   * Search video media on Wikimedia Commons
   * @param {string} query Search keyword
   * @param {Object} options
   */
  async searchMovies(query = '', { limit = 12, signal } = {}) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const searchTerms = `${query.trim()} filetype:video`;
      const url = `${WIKIMEDIA_BASE}?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerms)}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|mime|extmetadata`;

      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`Wikimedia API responded with status ${res.status}`);
      }

      const data = await res.json();
      const pages = data?.query?.pages || {};

      const results = [];
      for (const pageId of Object.keys(pages)) {
        const item = pages[pageId];
        const info = item.imageinfo && item.imageinfo[0];
        if (!info || !info.url) continue;

        // Verify video mime type
        const mime = info.mime || '';
        if (!mime.includes('video') && !info.url.match(/\.(webm|ogv|mp4)$/i)) {
          continue;
        }

        const extMeta = info.extmetadata || {};
        const titleClean = (item.title || '')
          .replace(/^File:/i, '')
          .replace(/\.(webm|ogv|mp4)$/i, '')
          .replace(/_/g, ' ');

        const licenseName = extMeta.LicenseShortName?.value || 'Creative Commons Attribution-ShareAlike';
        const licenseUrl = extMeta.LicenseUrl?.value || 'https://creativecommons.org/licenses/';
        const desc = extMeta.ImageDescription?.value || 'Freely licensed educational/historical moving picture from Wikimedia Commons.';
        const artist = extMeta.Artist?.value || 'Wikimedia Commons Contributor';

        let sizeFormatted = null;
        if (info.size) {
          sizeFormatted = `${(info.size / (1024 * 1024)).toFixed(1)} MB`;
        }

        results.push(normalizeMovie({
          id: `wiki_${pageId}`,
          title: titleClean,
          year: null,
          description: desc,
          genres: ['Historical', 'Open Cinema'],
          source: 'Wikimedia Commons',
          sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(item.title)}`,
          posterUrl: null, // will fall back to SVG placeholder
          watchUrl: info.url,
          directStreamUrl: info.url,
          legalDownloadUrl: info.url,
          downloadable: true, // Wikimedia Commons video files are direct legal downloads under their open license
          license: licenseName,
          licenseUrl: licenseUrl,
          fileSize: sizeFormatted,
          quality: 'Open Media'
        }, 'Wikimedia Commons'));
      }

      return results;
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn('[Wikimedia API] Query failed:', err.message);
      return [];
    }
  }
};

export default wikimediaApi;
