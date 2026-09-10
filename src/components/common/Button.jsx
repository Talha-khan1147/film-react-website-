import React from 'react';

/**
 * Reusable Button component with accessible states, icons, and variants.
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  title = '',
  'aria-label': ariaLabel,
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm, 6px)',
    transition: 'all var(--transition-normal, 0.25s cubic-bezier(0.4, 0, 0.2, 1))',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    border: 'none',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    userSelect: 'none',
  };

  const sizeStyles = {
    sm: { padding: '0.35rem 0.75rem', fontSize: '0.8125rem' },
    md: { padding: '0.55rem 1.15rem', fontSize: '0.9rem' },
    lg: { padding: '0.75rem 1.6rem', fontSize: '1rem' }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#0a0e17',
      boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)',
    },
    secondary: {
      backgroundColor: '#1f2937',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#f59e0b',
      border: '1px solid rgba(245, 158, 11, 0.5)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#cbd5e1',
    },
    danger: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    success: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...(sizeStyles[size] || sizeStyles.md),
    ...(variantStyles[variant] || variantStyles.primary)
  };

  return (
    <button
      type={type}
      onClick={disabled || isLoading ? undefined : onClick}
      disabled={disabled || isLoading}
      style={combinedStyles}
      className={`freeflix-btn freeflix-btn-${variant} ${className}`}
      title={title}
      aria-label={ariaLabel || (typeof children === 'string' ? children : title)}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            display: 'inline-block'
          }}
          aria-hidden="true"
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />}
        </>
      )}
    </button>
  );
}

export default Button;
