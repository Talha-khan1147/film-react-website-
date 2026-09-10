import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

export function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '55vh',
      gap: '1.5rem',
      padding: '2rem'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Film size={36} />
      </div>

      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '0.5rem' }}>
          Movie or page not found.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto', lineHeight: '1.5' }}>
          The link you followed may be broken or the public domain film has been moved.
        </p>
      </div>

      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="lg" icon={Home}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
