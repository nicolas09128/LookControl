import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function PasswordInput({ className = '', ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-wrapper">
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`form-input password-input ${className}`}
      />
      <button
        type="button"
        className="password-toggle-button"
        onClick={() => setShowPassword(prev => !prev)}
        aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
