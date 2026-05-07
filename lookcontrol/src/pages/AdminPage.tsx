import { useState, useEffect } from 'react';
import { Shield, Users, BarChart3, Trash2 } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import { useAuthStore } from '../store/authStore';
import type { Perfil } from '../interfaces/Perfil';
import { PageHeader, Badge, Spinner, EmptyState, Modal } from '../components/ui/index';

export default function AdminPage() {
  const perfil = useAuthStore(state => state.perfil);

  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);

  const loadUsuarios = async () => {
    if (!perfil?.id_peluqueria) return;

    setLoading(true);

    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id_peluqueria', perfil.id_peluqueria)
      .order('fecha_registro', { ascending: false });

    const filtrado = (data ?? []).filter(
      u => u.user_id === perfil.user_id || u.rol !== 'admin'
    );

    setUsuarios(filtrado);
    setLoading(false);
  };

  useEffect(() => { loadUsuarios(); }, [perfil?.id_peluqueria]);

  const confirmDelete = (userId: string) => setConfirmUserId(userId);
  const cancelDelete = () => setConfirmUserId(null);

  const handleDelete = async () => {
    if (!confirmUserId) return;
    setDeleting(confirmUserId);
    setConfirmUserId(null);
    await supabase.from('perfiles').delete().eq('user_id', confirmUserId);
    setDeleting(null);
    loadUsuarios();
  };

  const usuarioAEliminar = usuarios.find(u => u.user_id === confirmUserId);

  const empleados = usuarios.filter(u => u.user_id !== perfil?.user_id);

  const stats = {
    total: usuarios.length,
    empleados: empleados.length,
    activos: empleados.filter(u => u.rol === 'empleado').length,
  };

  return (
    <div>
      <PageHeader title="Administración" subtitle="Gestión de empleados de tu peluquería" />

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Users size={20} /></div>
          <p className="admin-stat-value">{stats.total}</p>
          <p className="admin-stat-label">En tu peluquería</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Shield size={20} /></div>
          <p className="admin-stat-value admin">{stats.empleados}</p>
          <p className="admin-stat-label">Empleados</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><BarChart3 size={20} /></div>
          <p className="admin-stat-value success">{stats.activos}</p>
          <p className="admin-stat-label">Vinculados</p>
        </div>
      </div>

      <div className="admin-users-card">
        <h2 className="admin-users-title"><Users size={16} />Gestión de usuarios</h2>

        {loading ? (
          <div><Spinner size={28} /></div>
        ) : usuarios.length === 0 ? (
          <EmptyState message="No hay usuarios en tu peluquería." />
        ) : (
          <div className="admin-users-table-container">
            <table className="admin-users-table">
              <thead>
                <tr>
                  {['Usuario', 'Email', 'Rol', 'Registro', ''].map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const esMiCuenta = u.user_id === perfil?.user_id;
                  const isDeleting = deleting === u.user_id;
                  const canDelete = !esMiCuenta && u.rol !== 'admin';

                  return (
                    <tr key={u.user_id}>
                      <td>
                        <div className="admin-user-info">
                          {u.avatar_url
                            ? <img className="admin-user-avatar" src={u.avatar_url} alt="" />
                            : <div className="admin-user-avatar-placeholder">
                                {(u.nombre_completo ?? u.email)[0].toUpperCase()}
                              </div>
                          }
                          <span>
                            {u.nombre_completo ?? '—'}
                            {esMiCuenta && (
                              <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                (tú)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <Badge variant={u.rol === 'admin' ? 'info' : 'neutral'}>{u.rol}</Badge>
                      </td>
                      <td>{new Date(u.fecha_registro).toLocaleDateString('es-ES')}</td>
                      <td style={{ textAlign: 'center' }}>
                        {isDeleting ? (
                          <Spinner size={16} />
                        ) : (
                          <button
                            onClick={() => canDelete && confirmDelete(u.user_id)}
                            disabled={!canDelete}
                            title={esMiCuenta ? 'No puedes eliminar tu propia cuenta' : canDelete ? 'Eliminar empleado' : 'No se puede eliminar un administrador'}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: canDelete ? 'pointer' : 'not-allowed',
                              color: canDelete ? '#ef4444' : 'var(--text-muted, #6b7280)',
                              padding: '4px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              opacity: canDelete ? 1 : 0.4,
                              transition: 'opacity 0.15s',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmUserId && usuarioAEliminar && (
        <Modal title="Eliminar empleado" onClose={cancelDelete} size="sm">
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary, #9ca3af)', lineHeight: 1.5 }}>
            ¿Estás seguro de que quieres eliminar a{' '}
            <strong style={{ color: 'var(--text-primary, #f3f4f6)' }}>
              {usuarioAEliminar.nombre_completo ?? usuarioAEliminar.email}
            </strong>{' '}
            de tu peluquería? Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={cancelDelete}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color, #374151)',
                background: 'transparent',
                color: 'var(--text-secondary, #9ca3af)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Sí, eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
