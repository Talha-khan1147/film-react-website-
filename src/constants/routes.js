export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE_DETAILS: '/movie/:id',
  WATCH: '/watch/:id',
  FAVORITES: '/favorites',
  ABOUT: '/about',
};

export const getMovieDetailsRoute = (id) => `/movie/${encodeURIComponent(id)}`;
export const getWatchRoute = (id) => `/watch/${encodeURIComponent(id)}`;
