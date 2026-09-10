import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Film } from 'lucide-react';
import { movieService } from '../services/movieService';
import MovieDetails from '../components/movies/MovieDetails';
import MovieGrid from '../components/movies/MovieGrid';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

export function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    window.scrollTo(0, 0);

    movieService.getMovieById(id)
      .then((data) => {
        if (!isMounted) return;
        setMovie(data);
        setIsLoading(false);

        if (data && data.genres && data.genres.length > 0) {
          const related = movieService.getMoviesByGenre(data.genres[0])
            .filter((m) => m.id !== id)
            .slice(0, 6);
          setRelatedMovies(related);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[MovieDetailsPage] Error:', err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <Loader type="fullscreen" text="Loading legal movie details..." />;
  }

  if (!movie) {
    return (
      <EmptyState
        title="Film Not Found"
        description="This movie may not be available in the public domain archive or the link may be invalid."
        iconType="movie"
        actionText="Back to Movie Catalog"
        onAction={() => navigate(ROUTES.SEARCH)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Back button */}
      <div>
        <Link
          to={ROUTES.SEARCH}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Browse</span>
        </Link>
      </div>

      {/* Main Details Presentation */}
      <MovieDetails movie={movie} />

      {/* Related Legal Films */}
      {relatedMovies.length > 0 && (
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem' }}>
            More Legal Films in {movie.genres?.[0] || 'Classic Cinema'}
          </h2>
          <MovieGrid movies={relatedMovies} />
        </section>
      )}
    </div>
  );
}

export default MovieDetailsPage;
