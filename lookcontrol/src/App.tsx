import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';

import LandingPage       from './pages/LandingPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import RegisterOwnerPage from './pages/RegisterOwnerPage';
import RegisterEmployeePage from './pages/RegisterEmployeePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NosotrosPage      from './pages/NosotrosPage';
import ContactoPage      from './pages/ContactoPage';
import FAQPage           from './pages/FAQPage';

const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const ProductosPage   = lazy(() => import('./pages/ProductosPage'));
const ComprasPage     = lazy(() => import('./pages/ComprasPage'));
const ProveedoresPage = lazy(() => import('./pages/ProveedoresPage'));
const StockPage       = lazy(() => import('./pages/StockPage'));
const ServiciosPage   = lazy(() => import('./pages/ServiciosPage'));
const ProfilePage     = lazy(() => import('./pages/ProfilePage'));
const AdminPage       = lazy(() => import('./pages/AdminPage'));
const OwnerCodePage   = lazy(() => import('./pages/OwnerCodePage'));

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function PrivateLayout() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { perfil } = useAuthStore();
  return perfil?.rol === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function RoleGuard({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { perfil } = useAuthStore();
  return perfil?.rol && roles.includes(perfil.rol) ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

const PageLoader = () => (
  <div className="page-loader">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-spin page-loader-icon">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

export default function App() {
  const { initSession, loading } = useAuthStore();
  useEffect(() => { initSession(); }, [initSession]);
  if (loading) return <PageLoader />;

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas publicas: comparten Header + Footer via PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/"               element={<LandingPage />} />
            <Route path="/login"          element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register"       element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/register/owner"    element={<PublicRoute><RegisterOwnerPage /></PublicRoute>} />
            <Route path="/register/employee" element={<PublicRoute><RegisterEmployeePage /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/nosotros"       element={<NosotrosPage />} />
            <Route path="/contacto"       element={<ContactoPage />} />
            <Route path="/faq"            element={<FAQPage />} />
          </Route>

          {/* Rutas privadas: sidebar AppLayout */}
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/productos"   element={<ProductosPage />} />
            <Route path="/compras"     element={<ComprasPage />} />
            <Route path="/proveedores" element={<RoleGuard roles={['admin', 'user']}><ProveedoresPage /></RoleGuard>} />
            <Route path="/stock"       element={<StockPage />} />
            <Route path="/servicios"   element={<ServiciosPage />} />
            <Route path="/profile"     element={<ProfilePage />} />
            <Route path="/owner-code"  element={<OwnerCodePage />} />
            <Route path="/admin"       element={<AdminGuard><AdminPage /></AdminGuard>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
