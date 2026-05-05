import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import { Alert, Btn, Field, Input, PasswordInput } from '../components/ui/index';

type ResetMode = 'request' | 'update';

const getPasswordResetRedirectUrl = () => {
  const configuredUrl = import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL;
  return configuredUrl || `${window.location.origin}/reset-password`;
};

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<ResetMode>('request');

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const recoveryCode = params.get('code');
    const hasRecoveryToken =
      Boolean(recoveryCode) ||
      hashParams.get('type') === 'recovery' ||
      hashParams.has('access_token');

    const prepareRecoverySession = async () => {
      if (recoveryCode) {
        const { error: codeError } = await supabase.auth.exchangeCodeForSession(recoveryCode);
        if (!mounted) return;

        if (codeError) {
          setError('El enlace de recuperacion no es valido o ha caducado. Solicita uno nuevo.');
          return;
        }

        window.history.replaceState({}, document.title, '/reset-password');
        setMode('update');
        return;
      }

      if (hasRecoveryToken) {
        setMode('update');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setMode('update');
      }
    };

    prepareRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update');
        window.history.replaceState({}, document.title, '/reset-password');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(),
    });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSent(true);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (!err) await supabase.auth.signOut();
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setUpdated(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  const title = mode === 'update' ? 'Cambiar contrasena' : 'Recuperar contrasena';
  const subtitle = mode === 'update'
    ? 'Introduce tu nueva contrasena para terminar el cambio.'
    : 'Te enviaremos un enlace para cambiar tu contrasena.';

  return (
    <div className="reset-container">
      <div className="reset-wrapper">
        <div className="reset-logo">
          <div className="reset-logo-icon"><Scissors size={18} /></div>
          <span className="reset-logo-text">LookControl</span>
        </div>
        <div className="reset-card">
          <h1 className="reset-title">{title}</h1>
          <p className="reset-subtitle">{subtitle}</p>

          {error && <div><Alert type="error" message={error} /></div>}
          {updated && <Alert type="success" message="Contrasena actualizada. Ya puedes iniciar sesion con la nueva contrasena." />}

          {mode === 'request' && (
            sent
              ? <Alert type="success" message="Email enviado. Revisa tu bandeja de entrada." />
              : <form className="reset-form" onSubmit={handleSubmit}>
                  <Field label="Email">
                    <Input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                  </Field>
                  <Btn type="submit" loading={loading}>Enviar enlace</Btn>
                </form>
          )}

          {mode === 'update' && !updated && (
            <form className="reset-form" onSubmit={handleUpdatePassword}>
              <Field label="Nueva contrasena">
                <PasswordInput
                  placeholder="Nueva contrasena"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                />
              </Field>
              <Field label="Repetir contrasena">
                <PasswordInput
                  placeholder="Repetir contrasena"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </Field>
              <Btn type="submit" loading={loading}>Cambiar contrasena</Btn>
            </form>
          )}
        </div>
        <p className="reset-back-link">
          <Link to="/login">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
