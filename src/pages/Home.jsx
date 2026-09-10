import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Film, Download, ArrowRight, Award, Compass, Play } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import MovieGrid from '../components/movies/MovieGrid';
import { movieService } from '../services/movieService';
import { ROUTES } from '../constants/routes';
import { GENRES } from '../constants/sources';
import Button from '../components/common/Button';

export function Home() {
  const navigate = useNavigate();

  const featuredMovies = movieService.getFeaturedMovies();
  const popularMovies = movieService.getPopularMovies();
  const classics = movieService.getPublicDomainClassics().slice(0, 6);
  const openFilms = movieService.getOpenlyLicensedFilms();
  const recentFilms = movieService.getRecentlyAdded().slice(0, 6);

  const heroFilm = featuredMovies[0] || popularMovies[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '4rem 2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)',
        textAlign: 'center'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Trust Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '999px',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <ShieldCheck size={16} />
            <span>100% Legal Public Domain & Open Cinema</span>
          </div>

          <h1 className="hero-title" style={{
            fontSize: '3.2rem',
            fontWeight: '900',
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            color: '#ffffff'
          }}>
            Discover Movies You Can <br />
            <span className="text-gradient-gold">Watch for Free</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            maxWidth: '640px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            Explore public-domain and openly licensed films from trusted legal sources. Stream online or download when legally authorized.
          </p>

          {/* Global Search Bar with Live Overlay */}
          <div style={{ marginBottom: '2rem' }}>
            <SearchBar autoFocus={false} />
          </div>

          {/* Quick Genre Tags */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.5rem' }}>Popular Genres:</span>
            {['Horror', 'Comedy', 'Sci-Fi', 'Drama', 'Animation'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => navigate(`${ROUTES.SEARCH}?genre=${encodeURIComponent(g)}`)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                  e.currentTarget.style.color = '#f59e0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spotlight Banner */}
      {heroFilm && (
        <section style={{
          backgroundColor: '#111827',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem'
        }}>
          <div style={{
            width: '180px',
            flexShrink: 0,
            borderRadius: '10px',
            overflow: 'hidden',
            aspectRatio: '2/3',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            <img
              src={heroFilm.posterUrl}
              alt={heroFilm.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-public-domain">Featured Masterpiece</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>• {heroFilm.source}</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>
              {heroFilm.title} ({heroFilm.year})
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: '1.6', maxWidth: '700px' }}>
              {heroFilm.description}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="primary"
                icon={Play}
                onClick={() => navigate(ROUTES.WATCH.replace(':id', heroFilm.id))}
              >
                Watch Online Now
              </Button>
              <Button
                variant="secondary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(ROUTES.MOVIE_DETAILS.replace(':id', heroFilm.id))}
              >
                View Film Details
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Section 1: Featured Movies */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
              Featured Movies
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Hand-picked historical and open cinema milestones
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(ROUTES.SEARCH)}
          >
            See All
          </Button>
        </div>
        <MovieGrid movies={featuredMovies} />
      </section>

      {/* Section 2: Popular in the Library */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
              Popular in the Library
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              The most celebrated public-domain films of all time
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(ROUTES.SEARCH)}
          >
            Explore More
          </Button>
        </div>
        <MovieGrid movies={popularMovies} />
      </section>

      {/* Section 3: Public Domain Classics */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
              Public Domain Classics
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Freely accessible cultural heritage films whose copyrights have expired or dedicated to the public
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(`${ROUTES.SEARCH}?license=Public+Domain`)}
          >
            View All Classics
          </Button>
        </div>
        <MovieGrid movies={classics} />
      </section>

      {/* Section 4: Openly Licensed Films */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
              Openly Licensed Films
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Modern open-source cinematic projects under Creative Commons licenses
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(`${ROUTES.SEARCH}?license=Creative+Commons`)}
          >
            View Open Projects
          </Button>
        </div>
        <MovieGrid movies={openFilms} />
      </section>

      {/* Section 5: Recently Added */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
              Recently Added
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Recently verified and restored additions to the catalog
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(ROUTES.SEARCH)}
          >
            Browse All
          </Button>
        </div>
        <MovieGrid movies={recentFilms} />
      </section>
    </div>
  );
}

export default Home;
