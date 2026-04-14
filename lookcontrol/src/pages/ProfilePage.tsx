import { useState, useRef } from 'react';
import { Camera, User, Mail, Shield, Calendar, Building, Key } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { PageHeader, Alert, Btn, Field, Input } from '../components/ui/index';

export default function ProfilePage() {
  const { perfil, updateNombre, sendPasswordRecovery, uploadAvatar } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre]               = useState(perfil?.nombre_completo ?? '');
  const [savingNombre, setSavingNombre]   = useState(false);
  const [savingPwd, setSavingPwd]         = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [alertNombre, setAlertNombre]     = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [alertPwd, setAlertPwd]           = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [alertAvatar, setAlertAvatar]     = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  const handleNombre = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNombre(true);
    const r = await updateNombre(nombre);
    setSavingNombre(false);
    setAlertNombre(r.error ? { type: 'error', msg: r.error } : { type: 'success', msg: 'Nombre actualizado.' });
  };

  const handlePwd = async () => {
    setSavingPwd(true);
    const r = await sendPasswordRecovery();
    setSavingPwd(false);
    setAlertPwd(r.error ? { type: 'error', msg: r.error } : { type: 'success', msg: 'Email de recuperación enviado. Revisa tu bandeja.' });
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAlertAvatar({ type: 'error', msg: 'Solo se permiten imágenes JPG, PNG o WEBP.' });
      return;
    }
    setUploadingAvatar(true);
    const r = await uploadAvatar(file);
    setUploadingAvatar(false);
    setAlertAvatar(r.error ? { type: 'error', msg: r.error } : { type: 'success', msg: 'Avatar actualizado.' });
  };

  if (!perfil) return null;

  return (
    <div className="profile-container">
      <PageHeader title="Mi perfil" subtitle="Gestiona tu información personal" />

      {/* Avatar */}
      <div className="profile-avatar-section">
        <h2 className="profile-avatar-title">Foto de perfil</h2>
        <div className="profile-avatar-content">
          <div className="profile-avatar-wrapper">
            {perfil.avatar_url
              ? <img className="profile-avatar-image" src={perfil.avatar_url} alt="Avatar" />
              : <div className="profile-avatar-placeholder"><User size={32} /></div>
            }
            <button className="profile-avatar-button" onClick={() => fileRef.current?.click()}>
              {uploadingAvatar
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                : <Camera size={13} />
              }
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatar} style={{ display: 'none' }} />
          </div>
          <div className="profile-info">
            <h3>{perfil.nombre_completo ?? 'Sin nombre'}</h3>
            <p className="profile-info-email">{perfil.email}</p>
            <span className={`profile-role-badge${perfil.rol === 'admin' ? ' admin' : ' user'}`}>
              {perfil.rol === 'admin' ? '⚡ Administrador' : perfil.rol === 'empleado' ? '👤 Empleado' : '👤 Usuario'}
            </span>
          </div>
        </div>
        {alertAvatar && <div><Alert type={alertAvatar.type} message={alertAvatar.msg} /></div>}
      </div>

      {/* Info */}
      <div className="profile-info-section">
        <h2 className="profile-info-title">Información de cuenta</h2>
        <div className="profile-info-list">
          <div className="profile-info-item">
            <span className="profile-info-icon"><Mail size={15} /></span>
            <span>{perfil.email}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-icon"><Shield size={15} /></span>
            <span>{perfil.rol}</span>
          </div>
          {perfil.nombre_peluqueria && (
            <div className="profile-info-item">
              <span className="profile-info-icon"><Building size={15} /></span>
              <span>{perfil.nombre_peluqueria}</span>
            </div>
          )}
          {perfil.rol === 'admin' && perfil.codigo_invitacion && (
            <div className="profile-info-item">
              <span className="profile-info-icon"><Key size={15} /></span>
              <span>{perfil.codigo_invitacion}</span>
            </div>
          )}
          <div className="profile-info-item">
            <span className="profile-info-icon"><Calendar size={15} /></span>
            <span>Registrado el {new Date(perfil.fecha_registro).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Nombre */}
      <div className="profile-form-section">
        <h2 className="profile-form-title">Nombre completo</h2>
        {alertNombre && <div><Alert type={alertNombre.type} message={alertNombre.msg} /></div>}
        <form className="profile-form" onSubmit={handleNombre}>
          <div className="profile-form-field">
            <Field label="">
              <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo..." />
            </Field>
          </div>
          <div className="profile-form-button">
            <Btn type="submit" loading={savingNombre}>Guardar</Btn>
          </div>
        </form>
      </div>

      {/* Contraseña */}
      <div className="profile-password-section">
        <h2 className="profile-password-title">Contraseña</h2>
        <p className="profile-password-description">Te enviaremos un email con un enlace para cambiar tu contraseña.</p>
        {alertPwd && <div><Alert type={alertPwd.type} message={alertPwd.msg} /></div>}
        <Btn variant="ghost" loading={savingPwd} onClick={handlePwd}>Enviar enlace de recuperación</Btn>
      </div>
    </div>
  );
}
