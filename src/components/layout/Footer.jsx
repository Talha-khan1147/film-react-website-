import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Film, ExternalLink, Heart } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function Footer() {
  return (
    <footer style={{
      backgroundColor: '#070a10',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3.5rem 1.5rem 2rem 1.5rem',
      marginTop: 'auto',
      color: '#94a3b8',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: 'var(--container-max-width, 1440px)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Col 1: About FreeFlix */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Film size={18} color="#0a0e17" />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>
              FreeFlix <span style={{ color: '#f59e0b' }}>Library</span>
            </span>
          </div>
          <p style={{ lineHeight: '1.6', marginBottom: '1.25rem', color: '#64748b' }}>
            A curated, open-access cultural discovery engine dedicated exclusively to legally free, public domain, and Creative Commons cinema.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '6px',
            color: '#34d399',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            <ShieldCheck size={14} />
            <span>100% Legal & License Verified</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
            Explore Library
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <Link to={ROUTES.HOME} style={{ color: '#94a3b8' }}>Home</Link>
            </li>
            <li>
              <Link to={ROUTES.SEARCH} style={{ color: '#94a3b8' }}>Search & Filter Films</Link>
            </li>
            <li>
              <Link to={ROUTES.FAVORITES} style={{ color: '#94a3b8' }}>My Favorites</Link>
            </li>
            <li>
              <Link to={ROUTES.ABOUT} style={{ color: '#94a3b8' }}>Legal & Licensing Info</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Configured Legal Sources */}
        <div>
          <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
            Configured Legal Sources
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <a
                href="https://archive.org/details/feature_films"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}
              >
                <span>Internet Archive Feature Films</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a
                href="https://commons.wikimedia.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}
              >
                <span>Wikimedia Commons Video</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a
                href="https://studio.blender.org/films/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}
              >
                <span>Blender Open Movie Project</span>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Legal Statement */}
        <div>
          <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
            Legal Compliance
          </h4>
          <p style={{ lineHeight: '1.6', fontSize: '0.8rem', color: '#64748b' }}>
            FreeFlix Library indexes only materials that are confirmed in the Public Domain, published under Creative Commons licenses, or made available with explicit open distribution permissions. We do not host, scrape, mirror, or link to unauthorized copyrighted materials.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: 'var(--container-max-width, 1440px)',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <div>
          © {new Date().getFullYear()} FreeFlix Library. Preserving open cinema heritage.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to={ROUTES.ABOUT} style={{ color: '#94a3b8' }}>Terms & Licensing</Link>
          <Link to={ROUTES.ABOUT} style={{ color: '#94a3b8' }}>Source Attribution</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
