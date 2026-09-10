import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Heart, Info, Menu, X, Search, Compass } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useFavorites } from '../../hooks/useFavorites';
import Button from '../common/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: isActive ? '#f59e0b' : '#cbd5e1',
    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(10, 14, 23, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      height: 'var(--navbar-height, 72px)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 'var(--container-max-width, 1440px)',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
          }}>
            <Film size={22} color="#0a0e17" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block',
              lineHeight: 1.1
            }}>
              FreeFlix <span style={{ color: '#f59e0b', WebkitTextFillColor: '#f59e0b' }}>Library</span>
            </span>
            <span style={{
              fontSize: '0.675rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#34d399',
              fontWeight: '700',
              display: 'block'
            }}>
              100% Legal & Free
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <NavLink to={ROUTES.HOME} style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to={ROUTES.SEARCH} style={navLinkStyle}>
            <Search size={16} />
            Browse & Search
          </NavLink>
          <NavLink to={ROUTES.FAVORITES} style={navLinkStyle}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={16} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#f59e0b',
                  color: '#0a0e17',
                  borderRadius: '999px',
                  padding: '1px 6px',
                  fontWeight: '800',
                  marginLeft: '2px'
                }}>
                  {favorites.length}
                </span>
              )}
            </div>
          </NavLink>
          <NavLink to={ROUTES.ABOUT} style={navLinkStyle}>
            <Info size={16} />
            Legal & About
          </NavLink>
        </nav>

        {/* Action button */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            size="sm"
            variant="outline"
            icon={Compass}
            onClick={() => navigate(ROUTES.SEARCH)}
          >
            Explore Library
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="nav-mobile-toggle" style={{ display: 'none' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{ padding: '0.5rem', color: '#f8fafc' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer" style={{
          position: 'fixed',
          top: 'var(--navbar-height, 72px)',
          left: 0,
          right: 0,
          backgroundColor: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <Link
            to={ROUTES.HOME}
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.75rem', color: '#f8fafc', fontWeight: '600', fontSize: '1rem' }}
          >
            Home
          </Link>
          <Link
            to={ROUTES.SEARCH}
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.75rem', color: '#f8fafc', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Search size={18} color="#f59e0b" />
            Browse & Search
          </Link>
          <Link
            to={ROUTES.FAVORITES}
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.75rem', color: '#f8fafc', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Heart size={18} color="#f43f5e" />
            Favorites ({favorites.length})
          </Link>
          <Link
            to={ROUTES.ABOUT}
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.75rem', color: '#f8fafc', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Info size={18} color="#06b6d4" />
            Legal & About
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
