import { useEffect, useState, useRef } from 'react';
import { Camera, User, Mail, Shield, Calendar, Building, Key, Upload } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { PageHeader, Alert, Btn, Field, Input, PasswordInput } from '../components/ui/index';
import {
  DEFAULT_AVATARS,
  MAX_AVATAR_UPLOAD_SIZE,
  getAvatarDisplayUrl,
  getAvatarPublicUrl,
  type DefaultAvatarPath,
} from '../database/supabase/avatarStorage';

export default function ProfilePage() {
  const { perfil, updateNombre, updatePassword, uploadAvatar, selectDefaultAvatar } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [nombre, setNombre] = useState(perfil?.nombre_completo ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingNombre, setSavingNombre] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [savingDefaultAvatar, setSavingDefaultAvatar] = useState<DefaultAvatarPath | null>(null);
  const [defaultAvatarUrls, setDefaultAvatarUrls] = useState<Record<string, string>>({});
  const [alertNombre, setAlertNombre] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [alertPwd, setAlertPwd] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [alertAvatar, setAlertAvatar] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      DEFAULT_AVATARS.map(async (avatar) => [avatar.path, await getAvatarDisplayUrl(avatar.path)] as const)
    ).then((entries) => {
      if (!cancelled) setDefaultAvatarUrls(Object.fromEntries(entries));
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!avatarPickerOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setAvatarPickerOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAvatarPickerOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [avatarPickerOpen]);

  const handleNombre = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNombre(true);
    const r = await updateNombre(nombre);
    setSavingNombre(false);
    setAlertNombre(r.error ? { type: 'error', msg: r.error } : { type: 'success', msg: 'Nombre actualizado.' });
  };

  const handlePwd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setAlertPwd({ type: 'error', msg: 'Introduce la nueva contrasena.' });
      return;
    }

    if (!confirmPassword) {
      setAlertPwd({ type: 'error', msg: 'Repite la nueva contrasena.' });
      return;
    }

    if (newPassword.length < 8) {
      setAlertPwd({ type: 'error', msg: 'La contraseña debe tener al menos 8 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertPwd({ type: 'error', msg: 'Las contraseñas no coinciden.' });
      return;
    }

    setSavingPwd(true);
    const r = await updatePassword(newPassword);
    setSavingPwd(false);

    if (r.error) {
      setAlertPwd({ type: 'error', msg: r.error });
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setAlertPwd({ type: 'success', msg: 'Contraseña actualizada correctamente.' });
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAlertAvatar({ type: 'error', msg: 'Solo se permiten imágenes JPG, PNG o WEBP.' });
      e.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_UPLOAD_SIZE) {
      setAlertAvatar({ type: 'error', msg: 'La imagen no puede superar los 2 MB.' });
      e.target.value = '';
      return;
    }

    setUploadingAvatar(true);
    const r = await uploadAvatar(file);
    setUploadingAvatar(false);
    e.target.value = '';
    if (!r.error) setAvatarPickerOpen(false);
    setAlertAvatar(r.error ? { type: 'error', msg: r.error } : { type: 'success', msg: 'Avatar actualizado.' });
  };

  const handleDefaultAvatar = async (path: DefaultAvatarPath) => {
    setSavingDefaultAvatar(path);
    const r = await selectDefaultAvatar(path);
    setSavingDefaultAvatar(null);
    if (!r.error) setAvatarPickerOpen(false);
    setAlertAvatar(r.error ? { type: 'error', msg: r.error } : { type: 'success', msg: 'Avatar actualizado.' });
  };

  if (!perfil) return null;

  const currentAvatarUrl = perfil.avatar_path
    ? defaultAvatarUrls[perfil.avatar_path] ?? perfil.avatar_url
    : perfil.avatar_url;

  return (
    <div className="profile-container">
      <PageHeader title="Mi perfil" subtitle="Gestiona tu información personal" />

      <div className="profile-avatar-section">
        <h2 className="profile-avatar-title">Foto de perfil</h2>
        <div className="profile-avatar-content">
          <div className="profile-avatar-wrapper" ref={pickerRef}>
            {currentAvatarUrl
              ? <img className="profile-avatar-image" src={currentAvatarUrl} alt="Avatar" />
              : <div className="profile-avatar-placeholder"><User size={32} /></div>
            }
            <button
              className="profile-avatar-button"
              onClick={() => setAvatarPickerOpen((open) => !open)}
              title="Cambiar foto"
              aria-haspopup="menu"
              aria-expanded={avatarPickerOpen}
            >
              {uploadingAvatar
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                : <Camera size={13} />
              }
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatar} style={{ display: 'none' }} />
            {avatarPickerOpen && (
              <div className="profile-avatar-menu" role="menu" aria-label="Cambiar foto de perfil">
                {DEFAULT_AVATARS.map((avatar) => {
                  const avatarUrl = defaultAvatarUrls[avatar.path] ?? getAvatarPublicUrl(avatar.path);
                  const selected = perfil.avatar_path === avatar.path;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      className={`profile-avatar-menu-option${selected ? ' selected' : ''}`}
                      onClick={() => handleDefaultAvatar(avatar.path)}
                      disabled={savingDefaultAvatar !== null || uploadingAvatar}
                      title={`Usar ${avatar.name}`}
                      role="menuitem"
                    >
                      <img src={avatarUrl} alt={avatar.name} />
                      <span>{savingDefaultAvatar === avatar.path ? 'Guardando...' : avatar.name}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="profile-avatar-menu-upload"
                  onClick={() => fileRef.current?.click()}
                  disabled={savingDefaultAvatar !== null || uploadingAvatar}
                  role="menuitem"
                >
                  <Upload size={16} />
                  <span>{uploadingAvatar ? 'Subiendo...' : 'Subir imagen'}</span>
                </button>
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3>{perfil.nombre_completo ?? 'Sin nombre'}</h3>
            <p className="profile-info-email">{perfil.email}</p>
            <span className={`profile-role-badge${perfil.rol === 'admin' ? ' admin' : ' user'}`}>
              {perfil.rol === 'admin' ? 'Administrador' : perfil.rol === 'empleado' ? 'Empleado' : 'Usuario'}
            </span>
          </div>
        </div>

        {alertAvatar && <div><Alert type={alertAvatar.type} message={alertAvatar.msg} /></div>}
      </div>

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

      <div className="profile-password-section">
        <h2 className="profile-password-title">Contraseña</h2>
        <p className="profile-password-description">Cambia tu contraseña directamente desde tu cuenta.</p>
        {alertPwd && <div><Alert type={alertPwd.type} message={alertPwd.msg} /></div>}
        <form className="profile-password-form" onSubmit={handlePwd} noValidate>
          <Field label="Nueva contraseña">
            <PasswordInput
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </Field>
          <Field label="Repetir contraseña">
            <PasswordInput
              placeholder="Repetir contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </Field>
          <Btn type="submit" loading={savingPwd}>Cambiar contraseña</Btn>
        </form>
      </div>
    </div>
  );
}
