/**
 * Deduplicate an array of normalized movie objects.
 * Detects duplicate titles, years, and identifiers across sources,
 * keeping the movie with richer metadata and active download capability.
 *
 * @param {Array<Object>} movies 
 * @returns {Array<Object>} Deduplicated movies array
 */
export function deduplicateMovies(movies = []) {
  if (!Array.isArray(movies)) return [];

  const seenKeys = new Map();

  for (const movie of movies) {
    if (!movie || !movie.title) continue;

    // Generate normalization signature: alphanumeric title + release year
    const cleanedTitle = movie.title
      .toLowerCase()
      .replace(/\(.*?\)/g, '') // remove parenthetical notes
      .replace(/[^a-z0-9]/g, '')
      .trim();

    const yearKey = movie.year || 'unknown';
    const primaryKey = `${cleanedTitle}_${yearKey}`;
    const idKey = movie.id;

    const existingMatch = seenKeys.get(primaryKey) || seenKeys.get(idKey);

    if (!existingMatch) {
      seenKeys.set(primaryKey, movie);
      seenKeys.set(idKey, movie);
    } else {
      // Compare richness of metadata: preference given to item with download link, description length, and valid poster
      const score = (m) => {
        let s = 0;
        if (m.legalDownloadUrl && m.downloadable) s += 10;
        if (m.embedUrl || m.directStreamUrl) s += 5;
        if (m.posterUrl && !m.posterUrl.includes('placeholder')) s += 4;
        if (m.description && m.description.length > 50) s += 3;
        if (m.year) s += 2;
        if (m.genres && m.genres.length > 0) s += 1;
        return s;
      };

      if (score(movie) > score(existingMatch)) {
        seenKeys.set(primaryKey, movie);
        seenKeys.set(idKey, movie);
      }
    }
  }

  // Extract unique movie references
  return Array.from(new Set(seenKeys.values()));
}

export default deduplicateMovies;
