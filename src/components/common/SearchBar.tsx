import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search messages, contacts...',
  onClear,
  autoFocus = false,
}) => {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.borderRadius.full,
        border: `1px solid ${theme.colors.border}`,
        padding: '0 14px',
        height: 42,
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <Search
        size={18}
        color={theme.colors.textMuted}
        style={{ flexShrink: 0, marginRight: 10 }}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: theme.typography.fontWeight.regular,
          fontFamily: theme.typography.fontFamily.sans,
          minWidth: 0,
        }}
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            background: theme.colors.surfaceHover,
            border: 'none',
            outline: 'none',
            borderRadius: theme.borderRadius.full,
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            color: theme.colors.textMuted,
            marginLeft: 8,
          }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
