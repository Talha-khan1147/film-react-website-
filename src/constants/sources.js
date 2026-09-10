export const LEGAL_SOURCES = {
  INTERNET_ARCHIVE: {
    id: 'archive',
    name: 'Internet Archive',
    description: 'Non-profit digital library offering millions of free public-domain and openly licensed feature films and shorts.',
    homepage: 'https://archive.org/details/feature_films',
    licenseStandard: 'Public Domain / Creative Commons',
    supportsDownload: true,
  },
  WIKIMEDIA_COMMONS: {
    id: 'wikimedia',
    name: 'Wikimedia Commons',
    description: 'Database of freely usable media files containing historic public-domain videos and Creative Commons cinema projects.',
    homepage: 'https://commons.wikimedia.org',
    licenseStandard: 'CC-BY-SA / CC-BY / Public Domain',
    supportsDownload: true,
  },
  BLENDER_OPEN_PROJECTS: {
    id: 'blender',
    name: 'Blender Open Movie Project',
    description: 'Open-source cinematic productions produced with open licenses (Creative Commons Attribution).',
    homepage: 'https://studio.blender.org/films/',
    licenseStandard: 'Creative Commons CC-BY',
    supportsDownload: true,
  }
};

export const LICENSES = {
  PUBLIC_DOMAIN: 'Public Domain',
  CREATIVE_COMMONS: 'Creative Commons',
  CC_BY: 'CC-BY',
  CC0: 'CC0 / Public Domain Dedication'
};

export const GENRES = [
  'All',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Mystery',
  'Romance',
  'Animation',
  'Action & Adventure',
  'Documentary'
];
