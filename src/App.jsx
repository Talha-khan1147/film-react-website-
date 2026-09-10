import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageContainer from './components/layout/PageContainer';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WatchPage from './pages/WatchPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import { ROUTES } from './constants/routes';

// Scroll to top helper on route transitions
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <ErrorBoundary>
      <MovieProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#0a0e17'
          }}>
            <Navbar />
            <PageContainer>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.SEARCH} element={<SearchPage />} />
                <Route path={ROUTES.MOVIE_DETAILS} element={<MovieDetailsPage />} />
                <Route path={ROUTES.WATCH} element={<WatchPage />} />
                <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageContainer>
            <Footer />
          </div>
        </BrowserRouter>
      </MovieProvider>
    </ErrorBoundary>
  );
}

export default App;
