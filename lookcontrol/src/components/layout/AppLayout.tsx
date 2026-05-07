import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  BarChart3,
  Scissors,
  ShoppingCart,
  TrendingUp,
  Truck,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ChatBot from '../ui/ChatBot';
import ThemeToggle from '../ui/ThemeToggle';
import EmployeeLinkModal from './EmployeeLinkModal';

const navItems = [
  { to: '/dashboard', label: 'Panel de Control', icon: LayoutDashboard, roles: ['admin', 'user', 'empleado'] },
  { to: '/productos', label: 'Productos', icon: Package, roles: ['admin', 'user', 'empleado'] },
  { to: '/stock', label: 'Stock', icon: TrendingUp, roles: ['admin', 'user', 'empleado'] },
  { to: '/compras', label: 'Compras', icon: ShoppingCart, roles: ['admin', 'user', 'empleado'] },
  { to: '/proveedores', label: 'Proveedores', icon: Truck, roles: ['admin', 'user'] },
  { to: '/servicios', label: 'Servicios', icon: Scissors, roles: ['admin', 'user', 'empleado'] },
  { to: '/admin', label: 'Administrar', icon: Users, roles: ['admin'] },
  { to: '/graficos', label: 'Gráficos', icon: BarChart3, roles: ['admin'] },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { perfil, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter(item => perfil?.rol && item.roles.includes(perfil.rol));
  const needsLink = perfil?.rol === 'empleado' && !perfil?.id_peluqueria;

  const sidebar = (
    <div className="app-sidebar-content">
      <div className="app-sidebar-header">
        <div className="app-sidebar-brand">
          <div className="app-sidebar-logo">
            <Scissors size={16} />
          </div>
          <span className="app-sidebar-brand-text">LookControl</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="app-sidebar-nav">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `app-sidebar-link ${isActive ? 'nav-active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar-footer">
        <NavLink
          to="/profile"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) => `app-sidebar-profile ${isActive ? 'nav-active' : ''}`}
        >
          {perfil?.avatar_url ? (
            <img src={perfil.avatar_url} alt="" className="app-sidebar-avatar" />
          ) : (
            <User size={18} />
          )}
          <div className="app-sidebar-user-text">
            <p className="app-sidebar-user-name">{perfil?.nombre_completo ?? perfil?.email}</p>
            <p className="app-sidebar-user-role">{perfil?.rol}</p>
          </div>
          <ChevronRight size={14} />
        </NavLink>

        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Cerrar sesion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      {needsLink && <EmployeeLinkModal />}

      <aside className="app-sidebar app-sidebar-desktop">{sidebar}</aside>

      {sidebarOpen && (
        <div className="app-sidebar-overlay">
          <div className="app-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          <aside className="app-sidebar app-sidebar-mobile">
            <button className="app-sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="app-main">
        <header className="app-mobile-header">
          <button onClick={() => setSidebarOpen(true)} className="app-mobile-menu-button">
            <Menu size={22} />
          </button>
          <span className="app-mobile-title">LookControl</span>
          <ThemeToggle />
        </header>

        <main className="app-main-content">
          <Outlet />
        </main>
      </div>

      <ChatBot />
    </div>
  );
}
