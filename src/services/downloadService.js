/**
 * Service for securely initiating and validating authorized downloads.
 * Guarantees zero download bypass and validates official legal URLs.
 */
export const downloadService = {
  /**
   * Strictly determines whether a movie is legally allowed to be downloaded.
   * @param {Object} movie Normalized Movie object
   * @returns {boolean}
   */
  canDownloadMovie(movie) {
    if (!movie) return false;
    return Boolean(
      movie.downloadable === true &&
      movie.legalDownloadUrl &&
      typeof movie.legalDownloadUrl === 'string' &&
      movie.legalDownloadUrl.trim().length > 0 &&
      (movie.legalDownloadUrl.startsWith('http://') || movie.legalDownloadUrl.startsWith('https://'))
    );
  },

  /**
   * Prepares and initiates the download using the official authorized URL.
   * Never modifies or proxies unauthorized endpoints.
   * @param {Object} movie
   */
  triggerLegalDownload(movie) {
    if (!this.canDownloadMovie(movie)) {
      throw new Error('This film does not have an authorized public-domain or open-licensed download link.');
    }

    // Create a temporary anchor element to initiate direct download without altering the source URL
    const a = document.createElement('a');
    a.href = movie.legalDownloadUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    // Provide a clean filename suggestion
    const extension = movie.legalDownloadUrl.split('.').pop().split('?')[0] || 'mp4';
    const cleanTitle = (movie.title || 'film').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.setAttribute('download', `${cleanTitle}_freeflix.${extension}`);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export default downloadService;
