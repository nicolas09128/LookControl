import { useState, useEffect, useMemo } from 'react';
import { Plus, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { createStockRepository, createProductoRepository } from '../database/repositories';
import type { MovimientoStock, MovimientoInput, TipoMovimiento } from '../interfaces/Stock';
import type { Producto } from '../interfaces/Producto';
import { useAuthStore } from '../store/authStore';
import { Modal, Badge, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input, Select, Textarea } from '../components/ui/index';

export default function StockPage() {
  const { perfil } = useAuthStore();
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [productos, setProductos]     = useState<Producto[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filterTipo, setFilterTipo]   = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [alertMsg, setAlertMsg]       = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [form, setForm]               = useState({ id_producto: '', tipo: 'entrada' as TipoMovimiento, cantidad: 1, motivo: '' });

  const sRepo = useMemo(() => createStockRepository(), []);
  const pRepo = useMemo(() => createProductoRepository(), []);

  const load = async () => {
    setLoading(true);
    const [m, p] = await Promise.all([sRepo.getMovimientos(filterTipo ? { tipo: filterTipo } : undefined), pRepo.getAll()]);
    setMovimientos(m.data ?? []);
    setProductos(p.data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [filterTipo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil || !perfil.id_peluqueria || !form.id_producto) { setAlertMsg({ type: 'error', msg: 'Selecciona un producto.' }); return; }
    if (form.cantidad <= 0)           { setAlertMsg({ type: 'error', msg: 'La cantidad debe ser mayor que 0.' }); return; }

    const prod = productos.find(p => p.id_producto === +form.id_producto);
    if (form.tipo === 'salida' && prod && prod.stock_actual < form.cantidad) {
      setAlertMsg({ type: 'error', msg: `Stock insuficiente. Disponible: ${prod.stock_actual} ${prod.unidad}.` });
      return;
    }

    setSaving(true);
    const qty = form.tipo === 'salida' ? -Math.abs(form.cantidad) : Math.abs(form.cantidad);
    const input: MovimientoInput = {
      id_peluqueria: perfil.id_peluqueria,
      id_producto:   +form.id_producto,
      id_perfil:     perfil.id_perfil,
      tipo:          form.tipo,
      cantidad:      qty,
      motivo:        form.motivo || null,
    };
    const result = await sRepo.registrarMovimiento(input);
    if (!result.error) {
      if (prod) {
        const pRepo2 = createProductoRepository();
        await pRepo2.updateStock(prod.id_producto, prod.stock_actual + qty);
      }
    }
    setSaving(false);
    if (result.error) { setAlertMsg({ type: 'error', msg: result.error.message ?? 'Error.' }); return; }
    setShowModal(false); load();
  };

  const tipoIcon = (tipo: TipoMovimiento) => {
    if (tipo === 'entrada') return <ArrowUp size={14} />;
    if (tipo === 'salida')  return <ArrowDown size={14} />;
    return <RefreshCw size={14} />;
  };

  const tipoBadge = (tipo: TipoMovimiento) => {
    const map: Record<TipoMovimiento, 'success' | 'danger' | 'warning'> = { entrada: 'success', salida: 'danger', ajuste: 'warning' };
    return <Badge variant={map[tipo]}>{tipo}</Badge>;
  };

  return (
    <div>
      <PageHeader
        title="Movimientos de stock"
        subtitle="Trazabilidad completa de entradas, salidas y ajustes"
        action={<Btn onClick={() => { setAlertMsg(null); setShowModal(true); }}><Plus size={16} />Registrar movimiento</Btn>}
      />

      <div className="stock-filter">
        <Select className="stock-filter-select" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
          <option value="ajuste">Ajustes</option>
        </Select>
      </div>

      {loading ? <div><Spinner size={32} /></div>
        : movimientos.length === 0 ? <EmptyState message="No hay movimientos registrados." />
        : <div className="stock-table-container">
            <table className="stock-table">
              <thead>
                <tr>
                  {['Tipo', 'Producto', 'Cantidad', 'Motivo', 'Usuario', 'Fecha'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movimientos.map(m => (
                  <tr key={m.id_movimiento}>
                    <td>
                      <div className="stock-tipo">
                        {tipoIcon(m.tipo)}{tipoBadge(m.tipo)}
                      </div>
                    </td>
                    <td>{m.producto?.nombre ?? m.id_producto}</td>
                    <td className={m.cantidad >= 0 ? 'stock-cantidad-positive' : 'stock-cantidad-negative'}>
                      {m.cantidad >= 0 ? '+' : ''}{m.cantidad} {m.producto?.unidad}
                    </td>
                    <td>{m.motivo ?? '—'}</td>
                    <td>{m.perfil?.nombre_completo ?? m.perfil?.email ?? '—'}</td>
                    <td>{new Date(m.fecha).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }

      {showModal && (
        <Modal title="Registrar movimiento de stock" onClose={() => setShowModal(false)}>
          {alertMsg && <div><Alert type={alertMsg.type} message={alertMsg.msg} /></div>}
          <form onSubmit={handleSave}>
            <Field label="Producto *">
              <Select value={form.id_producto} onChange={e => setForm(f => ({ ...f, id_producto: e.target.value }))}>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} (stock: {p.stock_actual} {p.unidad})</option>)}
              </Select>
            </Field>
            <Field label="Tipo de movimiento">
              <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoMovimiento }))}>
                <option value="entrada">Entrada (+)</option>
                <option value="salida">Salida (-)</option>
                <option value="ajuste">Ajuste</option>
              </Select>
            </Field>
            <Field label="Cantidad">
              <Input type="number" min="1" value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: +e.target.value }))} />
            </Field>
            <Field label="Motivo">
              <Textarea value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} rows={2} placeholder="Descripción del movimiento..." />
            </Field>
            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>Registrar</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
