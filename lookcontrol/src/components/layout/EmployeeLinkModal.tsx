import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function EmployeeLinkModal() {
  const { linkEmployeePeluqueria, logout } = useAuthStore();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Introduce el codigo del dueno.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await linkEmployeePeluqueria(code);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="employee-link-overlay">
      <div className="employee-link-card">
        <div className="employee-link-header">
          <div className="employee-link-icon">
            <Link2 size={18} color="black" />
          </div>
          <div>
            <h2 className="employee-link-title">Vincula tu cuenta</h2>
            <p className="employee-link-text">Pidele el codigo de invitacion a tu dueno</p>
          </div>
        </div>

        {success ? (
          <div className="employee-link-success">
            <div className="employee-link-success-icon">OK</div>
            <p className="employee-link-success-title">Cuenta vinculada correctamente.</p>
            <p className="employee-link-text employee-link-text-center">
              Ya puedes acceder a todos los datos de tu peluqueria.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="employee-link-form">
            {error && <div className="employee-link-error">{error}</div>}

            <div className="employee-link-field">
              <label htmlFor="invite-code" className="employee-link-label">Codigo de la peluqueria</label>
              <input
                id="invite-code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: AB3X9K2M"
                autoFocus
                className="employee-link-input"
              />
            </div>

            <button type="submit" disabled={loading} className="employee-link-submit">
              {loading ? 'Verificando...' : 'Vincular cuenta'}
            </button>

            <button type="button" onClick={handleLogout} className="employee-link-logout">
              Cerrar sesion
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
