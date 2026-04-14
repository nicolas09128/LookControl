import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Package, ShoppingCart, Truck, ArrowRight } from 'lucide-react';
import { createProductoRepository, createCompraRepository, createProveedorRepository } from '../database/repositories';
import type { Producto } from '../interfaces/Producto';
import type { Compra } from '../interfaces/Compra';
import { useAuthStore } from '../store/authStore';
import { StatCard, Badge, PageHeader, Spinner } from '../components/ui/index';

export default function DashboardPage() {
  const { perfil } = useAuthStore();
  const [productos, setProductos]           = useState<Producto[]>([]);
  const [compras, setCompras]               = useState<Compra[]>([]);
  const [totalProveedores, setTotalProveedores] = useState(0);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    (async () => {
      const [pRepo, cRepo, pvRepo] = [createProductoRepository(), createCompraRepository(), createProveedorRepository()];
      const [p, c, pv] = await Promise.all([pRepo.getAll(), cRepo.getAll(), pvRepo.getAll()]);
      setProductos(p.data ?? []);
      setCompras((c.data ?? []).slice(0, 5));
      setTotalProveedores((pv.data ?? []).filter(x => x.activo).length);
      setLoading(false);
    })();
  }, []);

  const bajoStock = productos.filter(p => p.stock_actual <= p.stock_minimo);

  if (loading) return <div><Spinner size={32} /></div>;

  return (
    <div>
      <PageHeader
        title={`Hola, ${perfil?.nombre_completo ?? perfil?.email?.split('@')[0]} 👋`}
        subtitle="Resumen del día"
      />

      {/* Stats */}
      <div className="dashboard-stats">
        <StatCard label="Total productos"    value={productos.length}  color="primary" />
        <StatCard label="Bajo stock"         value={bajoStock.length}  color={bajoStock.length > 0 ? 'danger' : 'success'} sub={bajoStock.length > 0 ? 'Requieren atención' : 'Todo en orden'} />
        <StatCard label="Últimas compras"    value={compras.length}    color="warning" />
        <StatCard label="Proveedores activos" value={totalProveedores} color="primary" />
      </div>

      <div className="dashboard-grid">
        {/* Bajo stock */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">
              <AlertTriangle size={16} />
              <h2>Productos bajo stock mínimo</h2>
            </div>
            <Link to="/productos" className="dashboard-section-link">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {bajoStock.length === 0
            ? <p className="dashboard-empty">✓ Todo el stock está dentro de los mínimos</p>
            : <div className="dashboard-bajo-stock-list">
                {bajoStock.slice(0, 6).map(p => (
                  <div key={p.id_producto} className="dashboard-bajo-stock-item">
                    <div className="dashboard-bajo-stock-info">
                      <p className="dashboard-bajo-stock-name">{p.nombre}</p>
                      <p className="dashboard-bajo-stock-categoria">{p.categoria?.nombre}</p>
                    </div>
                    <span className="dashboard-bajo-stock-badge">
                      {p.stock_actual} / {p.stock_minimo} {p.unidad}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Últimas compras */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">
              <ShoppingCart size={16} />
              <h2>Últimas compras</h2>
            </div>
            <Link to="/compras" className="dashboard-section-link">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          {compras.length === 0
            ? <p className="dashboard-empty">No hay compras registradas aún</p>
            : <div className="dashboard-ultimas-compras-list">
                {compras.map(c => (
                  <div key={c.id_compra} className="dashboard-ultimas-compras-item">
                    <div>
                      <p className="dashboard-ultimas-compras-proveedor">{c.proveedor?.nombre ?? 'Sin proveedor'}</p>
                      <p className="dashboard-ultimas-compras-fecha">{new Date(c.fecha_compra).toLocaleDateString('es-ES')}</p>
                    </div>
                    <Badge variant={c.estado === 'recibido' ? 'success' : c.estado === 'pendiente' ? 'warning' : 'neutral'}>
                      {c.estado}
                    </Badge>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Quick links */}
      <div className="dashboard-quick-links">
        {[
          { to: '/productos',   icon: Package,      label: 'Añadir producto' },
          { to: '/compras',     icon: ShoppingCart, label: 'Nueva compra'    },
          { to: '/proveedores', icon: Truck,         label: 'Proveedores'    },
          { to: '/stock',       icon: Package,      label: 'Ver movimientos' },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="dashboard-quick-link">
            <span className="dashboard-quick-link-icon"><Icon size={18} /></span>
            <span className="dashboard-quick-link-label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
