import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import { Alert, Btn, Field, Input } from '../components/ui/index';

export default function ResetPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <div className="reset-container">
      <div className="reset-wrapper">
        <div className="reset-logo">
          <div className="reset-logo-icon"><Scissors size={18} /></div>
          <span className="reset-logo-text">LookControl</span>
        </div>
        <div className="reset-card">
          <h1 className="reset-title">Recuperar contraseña</h1>
          <p className="reset-subtitle">Te enviaremos un enlace de recuperación.</p>
          {sent
            ? <Alert type="success" message="Email enviado. Revisa tu bandeja de entrada." />
            : <>
                {error && <div><Alert type="error" message={error} /></div>}
                <form className="reset-form" onSubmit={handleSubmit}>
                  <Field label="Email">
                    <Input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                  </Field>
                  <Btn type="submit" loading={loading}>Enviar enlace</Btn>
                </form>
              </>
          }
        </div>
        <p className="reset-back-link">
          <Link to="/login">← Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
