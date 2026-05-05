import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
  children: ReactNode;
}

export default function Btn({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: BtnProps) {
  const classes = [
    'btn',
    variant === 'danger' ? 'btn-danger' : variant === 'ghost' ? 'btn-ghost' : 'btn-primary',
    size === 'sm' ? 'btn-sm' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button {...props} disabled={disabled || loading} className={classes}>
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}
