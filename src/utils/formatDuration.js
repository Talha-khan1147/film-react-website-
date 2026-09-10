/**
 * Format duration from various input formats (seconds, minutes, or string) to a standard 'Xh Ym' or 'Y min' format.
 * @param {number|string} duration 
 * @returns {string} Formatted duration string
 */
export function formatDuration(duration) {
  if (!duration) return 'Duration unknown';

  if (typeof duration === 'string') {
    // If it already contains 'h' or 'min', return cleaned string
    if (duration.includes('h') || duration.includes('min')) {
      return duration.trim();
    }
    // If it's a numeric string in seconds or minutes
    const num = parseFloat(duration);
    if (!isNaN(num)) {
      return formatNumericSeconds(num);
    }
    return duration;
  }

  if (typeof duration === 'number') {
    return formatNumericSeconds(duration);
  }

  return 'Duration unknown';
}

function formatNumericSeconds(val) {
  // If val is greater than 300, it's likely in seconds; if smaller than 300, it could be minutes
  const totalSeconds = val > 300 ? Math.round(val) : Math.round(val * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

export default formatDuration;
