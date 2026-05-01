import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Truck,
  TrendingUp, Scissors, Users, User, LogOut, Menu, X, ChevronRight, Link2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Panel de Control', icon: LayoutDashboard, roles: ['admin', 'user', 'empleado'] },
  { to: '/productos',   label: 'Productos',    icon: Package,         roles: ['admin', 'user', 'empleado'] },
  { to: '/stock',       label: 'Stock',        icon: TrendingUp,      roles: ['admin', 'user', 'empleado'] },
  { to: '/compras',     label: 'Compras',      icon: ShoppingCart,    roles: ['admin', 'user', 'empleado'] },
  { to: '/proveedores', label: 'Proveedores',  icon: Truck,           roles: ['admin', 'user', 'empleado'] },
  { to: '/servicios',   label: 'Servicios',    icon: Scissors,        roles: ['admin', 'user', 'empleado'] },
  { to: '/admin',       label: 'Administrar',  icon: Users,           roles: ['admin'] },
];

// ─── Modal de vinculación para empleados ──────────────────────────────────────

function EmployeeLinkModal() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setError('Introduce el código del dueño.'); return; }

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
    // Overlay bloqueante — el empleado no puede usar la app sin vincular
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-base)',
          borderRadius: '1rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
              background: 'var(--brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Link2 size={18} color="black" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Vincula tu cuenta
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Pídele el código de invitación a tu dueño
            </p>
          </div>
        </div>

        {success ? (
          <div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.75rem', padding: '1rem 0',
            }}
          >
            <div
              style={{
                width: '3rem', height: '3rem', borderRadius: '50%',
                background: 'var(--brand-success, #22c55e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}
            >
              ✓
            </div>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600 }}>
              ¡Cuenta vinculada correctamente!
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Ya puedes acceder a todos los datos de tu peluquería.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'color-mix(in srgb, var(--brand-danger, #ef4444) 12%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--brand-danger, #ef4444) 30%, transparent)',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--brand-danger, #ef4444)',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label
                htmlFor="invite-code"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Código de la peluquería
              </label>
              <input
                id="invite-code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: AB3X9K2M"
                autoFocus
                required
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-base)',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  letterSpacing: '0.15em',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.7rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: loading ? 'var(--bg-elevated)' : 'var(--brand-primary)',
                color: loading ? 'var(--text-muted)' : 'black',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Verificando...' : 'Vincular cuenta'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid color-mix(in srgb, var(--brand-danger, #ef4444) 40%, transparent)',
                background: 'transparent',
                color: 'var(--brand-danger, #ef4444)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              Cerrar sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { perfil, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(item =>
    perfil?.rol && item.roles.includes(perfil.rol)
  );

  // Empleado sin peluquería vinculada → bloquear con modal
  const needsLink = perfil?.rol === 'empleado' && !perfil?.id_peluqueria;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-(--border-base)">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-(--brand-primary) flex items-center justify-center">
            <Scissors size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg text-(--text-primary) tracking-tight">LookControl</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'nav-active'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated)'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-(--border-base) flex flex-col gap-2">
        <NavLink
          to="/profile"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'nav-active'
                : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated)'
            }`
          }
        >
          {perfil?.avatar_url
            ? <img src={perfil.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
            : <User size={18} />
          }
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-(--text-primary)">
              {perfil?.nombre_completo ?? perfil?.email}
            </p>
            <p className="truncate text-[10px] text-(--text-muted) capitalize">{perfil?.rol}</p>
          </div>
          <ChevronRight size={14} />
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-logout-btn"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-(--bg-base) overflow-hidden">
      {/* Modal de vinculación para empleados pendientes */}
      {needsLink && <EmployeeLinkModal />}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-(--bg-surface) border-r border-(--border-base)">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-(--bg-surface) border-r border-(--border-base) flex flex-col z-10">
            <button
              className="absolute top-4 right-4 text-(--text-secondary)"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar mobile */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-(--border-base) bg-(--bg-surface)">
          <button onClick={() => setSidebarOpen(true)} className="text-(--text-secondary)">
            <Menu size={22} />
          </button>
          <span className="font-bold text-(--text-primary)">LookControl</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
