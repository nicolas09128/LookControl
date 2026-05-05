import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Alert, Btn, Field, Input, PasswordInput } from '../components/ui/index';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterOwnerPage() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '', nombrePeluqueria: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = (): string => {
    if (!form.nombre.trim())               return 'El nombre completo es obligatorio.';
    if (!form.email.trim())                return 'El email es obligatorio.';
    if (!EMAIL_RE.test(form.email))        return 'Introduce un email válido.';
    if (!form.nombrePeluqueria.trim())     return 'El nombre de la peluquería es obligatorio.';
    if (!form.password)                    return 'La contraseña es obligatoria.';
    if (form.password.length < 6)          return 'La contraseña debe tener al menos 6 caracteres.';
    if (form.password !== form.confirm)    return 'Las contraseñas no coinciden.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }

    setError('');
    setLoading(true);
    const result = await register({
      email: form.email,
      password: form.password,
      nombre_completo: form.nombre,
      tipo: 'admin',
      nombre_peluqueria: form.nombrePeluqueria.trim(),
    });
    setLoading(false);

    if (result.error) { setError(result.error); return; }

    setSuccess(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  if (success) return (
    <div className="register-container">
      <div className="register-success">
        <div className="register-success-icon">✓</div>
        <h2 className="register-success-title">¡Cuenta de dueño creada!</h2>
        <p className="register-success-message">Revisa tu email y luego inicia sesión con tu cuenta.</p>
      </div>
    </div>
  );

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-logo">
          <div className="register-logo-icon"><Scissors size={18} /></div>
          <span className="register-logo-text">LookControl</span>
        </div>
        <div className="register-card">
          <h1 className="register-title">Registro de dueño</h1>
          <p className="register-subtitle">Crea tu cuenta y registra tu peluquería.</p>
          {error && <div style={{ marginBottom: '1rem' }}><Alert type="error" message={error} /></div>}
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <Field label="Nombre completo">
              <Input type="text" placeholder="Ana García" value={form.nombre} onChange={set('nombre')} autoFocus />
            </Field>
            <Field label="Email">
              <Input type="text" placeholder="tu@email.com" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Nombre de la peluquería">
              <Input type="text" placeholder="Peluquería Bella" value={form.nombrePeluqueria} onChange={set('nombrePeluqueria')} />
            </Field>
            <Field label="Contraseña">
              <PasswordInput placeholder="Mín. 6 caracteres" value={form.password} onChange={set('password')} />
            </Field>
            <Field label="Confirmar contraseña">
              <PasswordInput placeholder="Repite la contraseña" value={form.confirm} onChange={set('confirm')} />
            </Field>
            <Btn type="submit" loading={loading}>Crear cuenta de dueño</Btn>
          </form>
        </div>
        <p className="register-footer">
          ¿Prefieres otra cuenta? <Link to="/register" className="register-footer-link">Volver a elegir</Link>
        </p>
      </div>
    </div>
  );
}
