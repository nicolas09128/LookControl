import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { Alert, Btn, Field, Input, PasswordInput } from '../components/ui/index';

type ResetMode = 'request' | 'verify';

const getErrorMessage = (message: string) => {
  if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    return 'Falta configurar correctamente la clave service_role de Supabase en el servidor.';
  }

  return message;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<ResetMode>('request');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailValue = email.trim();

    if (!emailValue) {
      setError('Introduce tu email.');
      return;
    }

    if (!isValidEmail(emailValue)) {
      setError('Introduce un email valido.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/password-reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo enviar el codigo.');
      }

      setSent(true);
      setMode('verify');
    } catch (requestError) {
      setError(getErrorMessage(requestError instanceof Error ? requestError.message : 'No se pudo enviar el codigo.'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailValue = email.trim();
    const codeValue = recoveryCode.trim();

    if (!emailValue) {
      setError('Introduce tu email.');
      return;
    }

    if (!isValidEmail(emailValue)) {
      setError('Introduce un email valido.');
      return;
    }

    if (!codeValue) {
      setError('Introduce el codigo de recuperacion.');
      return;
    }

    if (!newPassword) {
      setError('Introduce la nueva contrasena.');
      return;
    }

    if (!confirmPassword) {
      setError('Repite la nueva contrasena.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/password-reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          code: codeValue,
          password: newPassword,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo cambiar la contrasena.');
      }

      setUpdated(true);
      setRecoveryCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (confirmError) {
      setError(getErrorMessage(confirmError instanceof Error ? confirmError.message : 'No se pudo cambiar la contrasena.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-wrapper">
        <div className="reset-logo">
          <div className="reset-logo-icon"><Scissors size={18} /></div>
          <span className="reset-logo-text">LookControl</span>
        </div>
        <div className="reset-card">
          <h1 className="reset-title">{mode === 'request' ? 'Recuperar contrasena' : 'Cambiar contrasena'}</h1>
          <p className="reset-subtitle">
            {mode === 'request'
              ? 'Te enviaremos un codigo de recuperacion por email.'
              : 'Introduce el codigo recibido y tu nueva contrasena.'}
          </p>

          {error && <div><Alert type="error" message={error} /></div>}
          {updated && <Alert type="success" message="Contrasena actualizada. Ya puedes iniciar sesion con la nueva contrasena." />}

          {mode === 'request' && !updated && (
            <form className="reset-form" onSubmit={handleRequestCode} noValidate>
              <Field label="Email">
                <Input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              </Field>
              <Btn type="submit" loading={loading}>Enviar codigo</Btn>
            </form>
          )}

          {mode === 'verify' && !updated && (
            <>
              {sent && <Alert type="success" message="Codigo enviado. Revisa tu email." />}
              <form className="reset-form" onSubmit={handleConfirmCode} noValidate>
                <Field label="Email">
                  <Input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field label="Codigo de recuperacion">
                  <Input
                    type="text"
                    placeholder="6 digitos"
                    value={recoveryCode}
                    onChange={e => setRecoveryCode(e.target.value)}
                    autoFocus
                  />
                </Field>
                <Field label="Nueva contrasena">
                  <PasswordInput
                    placeholder="Nueva contrasena"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </Field>
                <Field label="Repetir contrasena">
                  <PasswordInput
                    placeholder="Repetir contrasena"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </Field>
                <Btn type="submit" loading={loading}>Cambiar contrasena</Btn>
              </form>
            </>
          )}
        </div>
        <p className="reset-back-link">
          <Link to="/login">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
