import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Alert, Btn, Field, Input } from '../components/ui/index';

export default function OwnerCodePage() {
  const navigate = useNavigate();
  const { perfil, linkEmployeePeluqueria } = useAuthStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!perfil) return;
    if (perfil.rol !== 'empleado' || perfil.id_peluqueria) {
      navigate('/dashboard');
    }
  }, [perfil, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setError('Ingresa el código del dueño.'); return; }

    setError('');
    setLoading(true);
    const result = await linkEmployeePeluqueria(code);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-logo">
          <div className="register-logo-icon"><Scissors size={18} /></div>
          <span className="register-logo-text">LookControl</span>
        </div>
        <div className="register-card">
          <h1 className="register-title">Vincula tu cuenta de empleado</h1>
          <p className="register-subtitle">Introduce el código de la peluquería del dueño para acceder.</p>
          {error && <div><Alert type="error" message={error} /></div>}
          {success && <div><Alert type="success" message="Código aceptado. Redirigiendo..." /></div>}
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <Field label="Código del dueño">
              <Input
                placeholder="AB3X9K2M"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                autoFocus
              />
            </Field>
            <Btn type="submit" loading={loading}>Vincular cuenta</Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
