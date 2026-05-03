import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import '../../styles/modal.css';

// ─── MODAL ───────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
export function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal-panel ${size}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close"><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── BADGE ───────────────────────────────────────────────
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';
const badgeClass: Record<BadgeVariant, string> = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  danger:  'badge badge-danger',
  info:    'badge badge-primary',
  accent:  'badge badge-accent',
  neutral: 'badge badge-neutral',
};
export function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return <span className={badgeClass[variant]}>{children}</span>;
}

// ─── ALERT ───────────────────────────────────────────────
export function Alert({ type, message }: { type: 'error' | 'success'; message: string }) {
  return <div className={`modal-alert ${type}`}>{message}</div>;
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onCancel} />
      <div className="modal-panel sm">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onCancel} className="modal-close"><X size={16} /></button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
          <div className="productos-modal-actions" style={{ paddingTop: '1.25rem' }}>
            <Btn type="button" variant="ghost" onClick={onCancel}>{cancelText}</Btn>
            <Btn type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SPINNER ─────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ color: 'var(--brand-primary)' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── PAGE HEADER ─────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'primary' }: {
  label: string; value: string | number; sub?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}) {
  const colorMap = { primary: 'primary', success: 'success', warning: 'accent', danger: 'danger', accent: 'accent' };
  return (
    <div className={`stat-card ${colorMap[color]}`}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
      {sub && <p className="stat-card-sub">{sub}</p>}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return <div className="dash-empty"><p className="dash-empty-text">{message}</p></div>;
}

// ─── FORM FIELD ──────────────────────────────────────────
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      {children}
      {error && <p style={{ fontSize: '0.78rem', color: 'var(--brand-danger)', marginTop: '0.2rem' }}>{error}</p>}
    </div>
  );
}

// ─── INPUT ───────────────────────────────────────────────
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export function Input({ className = '', ...props }: InputProps) {
  return <input {...props} className={`form-input ${className}`} />;
}

// ─── SELECT ──────────────────────────────────────────────
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export function Select({ className = '', children, ...props }: SelectProps) {
  return <select {...props} className={`form-select ${className}`}>{children}</select>;
}

// ─── TEXTAREA ────────────────────────────────────────────
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea {...props} className={`form-textarea ${className}`} />;
}

// ─── BUTTON ──────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
}
export function Btn({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: BtnProps) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-ghost',
    size === 'sm' ? 'btn-sm' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button {...props} disabled={disabled || loading} className={cls}>
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}
