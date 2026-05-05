import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import { useAuthStore } from '../store/authStore';
import { Alert, Btn, Field, Input, PasswordInput } from '../components/ui/index';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const { initSession } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const validate = (): string => {
    if (!email.trim())          return 'El email es obligatorio.';
    if (!EMAIL_RE.test(email))  return 'Introduce un email válido.';
    if (!password)              return 'La contraseña es obligatoria.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }

    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      setLoading(false);
      return;
    }

    await initSession();
    const perfil = useAuthStore.getState().perfil;
    if (perfil?.rol === 'empleado' && !perfil.id_peluqueria) {
      navigate('/owner-code');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-logo">
          <div className="login-logo-icon"><Scissors size={18} /></div>
          <span className="login-logo-text">LookControl</span>
        </div>
        <div className="login-card">
          <h1 className="login-title">Bienvenido de vuelta</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
          {error && <div style={{ marginBottom: '1rem' }}><Alert type="error" message={error} /></div>}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <Field label="Email">
              <Input type="text" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </Field>
            <Field label="Contraseña">
              <PasswordInput placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            </Field>
            <div className="login-forgot-link">
              <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
            </div>
            <Btn type="submit" loading={loading}>Iniciar sesión</Btn>
          </form>
        </div>
        <p className="login-footer">
          ¿No tienes cuenta? <Link to="/register" className="login-footer-link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
