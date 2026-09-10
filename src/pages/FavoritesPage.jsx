import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Compass } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import MovieGrid from '../components/movies/MovieGrid';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { ROUTES } from '../constants/routes';

export function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClearAll = () => {
    clearFavorites();
    setConfirmModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={26} color="#f43f5e" fill="#f43f5e" />
            <span>My Favorite Films</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {favorites.length} {favorites.length === 1 ? 'film' : 'films'} saved to your personal library (persisted locally)
          </p>
        </div>

        {favorites.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setConfirmModalOpen(true)}
          >
            Clear All Favorites
          </Button>
        )}
      </div>

      {/* Grid of Favorites */}
      <MovieGrid
        movies={favorites}
        emptyTitle="No favorites yet"
        emptyDescription="You haven't added any public domain or open films to your library. Browse our collection and click the heart icon on any movie to save it."
        emptyActionText="Discover Free Films"
        onEmptyAction={() => navigate(ROUTES.SEARCH)}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Clear All Favorites?"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Are you sure you want to remove all {favorites.length} saved films from your local library? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={Trash2} onClick={handleClearAll}>
              Yes, Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FavoritesPage;
