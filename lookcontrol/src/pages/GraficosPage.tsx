import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, Package, Scissors, TrendingUp } from 'lucide-react';
import { createProductoRepository, createStockRepository } from '../database/repositories';
import type { Producto } from '../interfaces/Producto';
import type { MovimientoStock } from '../interfaces/Stock';
import { useAuthStore } from '../store/authStore';
import { Alert, EmptyState, PageHeader, Spinner } from '../components/ui/index';

type ChartDatum = {
  name: string;
  value: number;
  detail?: string;
};

const chartColors = ['#38bdf8', '#22c55e', '#a78bfa', '#f59e0b', '#f97316', '#14b8a6', '#ef4444'];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: ChartDatum }>; label?: string }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="graficos-tooltip">
      <p className="graficos-tooltip-title">{label}</p>
      <p className="graficos-tooltip-value">{item.value ?? 0}</p>
      {item.payload?.detail && <p className="graficos-tooltip-detail">{item.payload.detail}</p>}
    </div>
  );
}

function ProductsChart({ title, subtitle, data, emptyMessage }: { title: string; subtitle: string; data: ChartDatum[]; emptyMessage: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <section className="graficos-chart-card">
      <div className="graficos-chart-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="graficos-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 14, right: 10, left: -10, bottom: 18 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" strokeOpacity={0.42} />
              <XAxis
                dataKey="name"
                stroke="var(--text-muted)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                interval={0}
                angle={data.length > 5 ? -28 : 0}
                textAnchor={data.length > 5 ? 'end' : 'middle'}
                height={data.length > 5 ? 58 : 34}
              />
              <YAxis
                stroke="var(--text-muted)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                allowDecimals={false}
                domain={[0, Math.max(maxValue + 1, 5)]}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={52}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} fillOpacity={entry.value > 0 ? 0.9 : 0.35} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default function GraficosPage() {
  const { perfil } = useAuthStore();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const productoRepo = useMemo(() => createProductoRepository(), []);
  const stockRepo = useMemo(() => createStockRepository(), []);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError('');

      const [productosResult, movimientosResult] = await Promise.all([
        productoRepo.getAll(),
        stockRepo.getMovimientos({ tipo: 'salida' }),
      ]);

      if (cancelled) return;

      if (productosResult.error || movimientosResult.error) {
        setError(productosResult.error?.message ?? movimientosResult.error?.message ?? 'No se pudieron cargar los gráficos.');
      }

      const peluqueriaId = perfil?.id_peluqueria;
      const productosData = productosResult.data ?? [];
      const movimientosData = movimientosResult.data ?? [];

      setProductos(peluqueriaId ? productosData.filter(producto => producto.id_peluqueria === peluqueriaId) : productosData);
      setMovimientos(peluqueriaId ? movimientosData.filter(movimiento => movimiento.id_peluqueria === peluqueriaId) : movimientosData);
      setLoading(false);
    }

    loadData();

    return () => { cancelled = true; };
  }, [perfil?.id_peluqueria, productoRepo, stockRepo]);

  const productosPorCategoria = useMemo<ChartDatum[]>(() => {
    const grouped = new Map<string, number>();

    productos.forEach(producto => {
      const categoria = producto.categoria?.nombre ?? 'Sin categoria';
      grouped.set(categoria, (grouped.get(categoria) ?? 0) + 1);
    });

    return Array.from(grouped.entries())
      .map(([name, value]) => ({ name, value, detail: `${value} producto${value === 1 ? '' : 's'} activos` }))
      .sort((a, b) => b.value - a.value);
  }, [productos]);

  const productosMasUsados = useMemo<ChartDatum[]>(() => {
    const grouped = new Map<string, { value: number; unidad?: string }>();

    movimientos.forEach(movimiento => {
      const name = movimiento.producto?.nombre ?? `Producto ${movimiento.id_producto}`;
      const previous = grouped.get(name) ?? { value: 0, unidad: movimiento.producto?.unidad };
      grouped.set(name, {
        value: previous.value + Math.abs(Number(movimiento.cantidad) || 0),
        unidad: previous.unidad ?? movimiento.producto?.unidad,
      });
    });

    return Array.from(grouped.entries())
      .map(([name, info]) => ({
        name,
        value: info.value,
        detail: `${info.value} ${info.unidad ?? 'uds'} usadas`,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [movimientos]);

  const stats = useMemo(() => {
    const bajoStock = productos.filter(producto => producto.stock_actual <= producto.stock_minimo).length;
    const unidadesUsadas = productosMasUsados.reduce((total, item) => total + item.value, 0);

    return {
      productos: productos.length,
      categorias: productosPorCategoria.length,
      bajoStock,
      unidadesUsadas,
    };
  }, [productos, productosMasUsados, productosPorCategoria]);

  return (
    <div className="graficos-page">
      <PageHeader
        title="Gráficos"
        subtitle="Lectura visual del catálogo y consumo de productos de tu peluquería"
      />

      {error && <div className="graficos-alert"><Alert type="error" message={error} /></div>}

      {loading ? (
        <div className="graficos-loading"><Spinner size={32} /></div>
      ) : (
        <>
          <div className="graficos-stats">
            <div className="graficos-stat-card">
              <Package size={20} />
              <span>{stats.productos}</span>
              <p>Productos activos</p>
            </div>
            <div className="graficos-stat-card">
              <BarChart3 size={20} />
              <span>{stats.categorias}</span>
              <p>Categorías con stock</p>
            </div>
            <div className="graficos-stat-card warning">
              <TrendingUp size={20} />
              <span>{stats.bajoStock}</span>
              <p>Productos bajo minimo</p>
            </div>
            <div className="graficos-stat-card success">
              <Scissors size={20} />
              <span>{stats.unidadesUsadas}</span>
              <p>Unidades usadas</p>
            </div>
          </div>

          <div className="graficos-grid">
            <ProductsChart
              title="Productos por categoría"
              subtitle="Distribución del catálogo activo"
              data={productosPorCategoria}
              emptyMessage="No hay productos activos para graficar."
            />
            <ProductsChart
              title="Productos mas usados"
              subtitle="Top de salidas registradas en stock"
              data={productosMasUsados}
              emptyMessage="Aun no hay salidas de stock para calcular productos usados."
            />
          </div>
        </>
      )}
    </div>
  );
}
