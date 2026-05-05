import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;
export function Input({ className = '', ...props }: InputProps) {
  return <input {...props} className={`form-input ${className}`} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;
export function Select({ className = '', children, ...props }: SelectProps) {
  return <select {...props} className={`form-select ${className}`}>{children}</select>;
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea {...props} className={`form-textarea ${className}`} />;
}
