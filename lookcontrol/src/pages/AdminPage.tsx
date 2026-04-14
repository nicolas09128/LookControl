import { useState, useEffect } from 'react';
import { Shield, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import type { Perfil } from '../interfaces/Perfil';
import { PageHeader, Badge, Spinner, EmptyState, Select } from '../components/ui/index';

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState<string | null>(null);

  const loadUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase.from('perfiles').select('*').order('fecha_registro', { ascending: false });
    setUsuarios(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadUsuarios(); }, []);

  const handleRolChange = async (userId: string, newRol: 'admin' | 'user') => {
    setSaving(userId);
    await supabase.from('perfiles').update({ rol: newRol }).eq('user_id', userId);
    setSaving(null);
    loadUsuarios();
  };

  const stats = {
    total:  usuarios.length,
    admins: usuarios.filter(u => u.rol === 'admin').length,
    users:  usuarios.filter(u => u.rol === 'user').length,
  };

  return (
    <div>
      <PageHeader title="Administración" subtitle="Panel de control de usuarios y sistema" />

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Users size={20} /></div>
          <p className="admin-stat-value">{stats.total}</p>
          <p className="admin-stat-label">Total usuarios</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Shield size={20} /></div>
          <p className={`admin-stat-value admin`}>{stats.admins}</p>
          <p className="admin-stat-label">Administradores</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><BarChart3 size={20} /></div>
          <p className={`admin-stat-value success`}>{stats.users}</p>
          <p className="admin-stat-label">Usuarios regulares</p>
        </div>
      </div>

      {/* Tabla usuarios */}
      <div className="admin-users-card">
        <h2 className="admin-users-title"><Users size={16} />Gestión de usuarios</h2>
        {loading ? <div><Spinner size={28} /></div>
          : usuarios.length === 0 ? <EmptyState message="No hay usuarios." />
          : <div className="admin-users-table-container">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    {['Usuario', 'Email', 'Rol', 'Registro'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.user_id}>
                      <td>
                        <div className="admin-user-info">
                          {u.avatar_url
                            ? <img className="admin-user-avatar" src={u.avatar_url} alt="" />
                            : <div className="admin-user-avatar-placeholder">
                                {(u.nombre_completo ?? u.email)[0].toUpperCase()}
                              </div>
                          }
                          <span>{u.nombre_completo ?? '—'}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <div className="admin-rol-select">
                          <Badge variant={u.rol === 'admin' ? 'info' : 'neutral'}>{u.rol}</Badge>
                          <Select
                            value={u.rol}
                            onChange={e => handleRolChange(u.user_id, e.target.value as 'admin' | 'user')}
                            disabled={saving === u.user_id}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </Select>
                          {saving === u.user_id && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="animate-spin">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
                              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                          )}
                        </div>
                      </td>
                      <td>{new Date(u.fecha_registro).toLocaleDateString('es-ES')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}
