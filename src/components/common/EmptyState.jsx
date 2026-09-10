import React from 'react';
import { Film, Heart, Search, HelpCircle } from 'lucide-react';
import Button from './Button';

/**
 * Reusable EmptyState component with icons and actions.
 */
export function EmptyState({
  title = 'No movies found',
  description = 'Try adjusting your search terms or filters to discover more legal public-domain films.',
  iconType = 'search', // 'search' | 'favorites' | 'movie' | 'info'
  actionText = null,
  onAction = null,
  actionIcon = null
}) {
  const getIcon = () => {
    switch (iconType) {
      case 'favorites':
        return <Heart size={36} color="#f43f5e" />;
      case 'movie':
        return <Film size={36} color="#f59e0b" />;
      case 'info':
        return <HelpCircle size={36} color="#06b6d4" />;
      default:
        return <Search size={36} color="#94a3b8" />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      backgroundColor: 'rgba(17, 24, 39, 0.45)',
      borderRadius: '16px',
      border: '1px dashed rgba(255, 255, 255, 0.1)',
      margin: '2rem auto',
      maxWidth: '560px',
      width: '100%'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        {getIcon()}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#f8fafc' }}>
        {title}
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginBottom: actionText ? '1.5rem' : '0', maxWidth: '420px', lineHeight: '1.5' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
