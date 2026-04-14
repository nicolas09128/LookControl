import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import { useAuthStore } from '../store/authStore';
import { Alert, Btn, Field, Input } from '../components/ui/index';

export default function LoginPage() {
  const navigate = useNavigate();
  const { initSession } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          {error && <div><Alert type="error" message={error} /></div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <Field label="Email">
              <Input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </Field>
            <Field label="Contraseña">
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
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
