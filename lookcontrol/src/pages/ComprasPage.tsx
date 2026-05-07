import { useState, useEffect, useMemo } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { createCompraRepository, createProveedorRepository, createProductoRepository } from '../database/repositories';
import type { Compra, CompraInput, DetalleCompraInput, EstadoCompra } from '../interfaces/Compra';
import type { Proveedor } from '../interfaces/Proveedor';
import type { Producto } from '../interfaces/Producto';
import { useAuthStore } from '../store/authStore';
import { Modal, Badge, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input, Select, Textarea, ConfirmDialog } from '../components/ui/index';

type LineaForm = { id_producto: number; cantidad: number; precio_unitario: number; fecha_caducidad: string; lote: string };
const LINEA_BLANK: LineaForm = { id_producto: 0, cantidad: 1, precio_unitario: 0, fecha_caducidad: '', lote: '' };
const todayISO = () => new Date().toISOString().split('T')[0];
const generateInvoiceNumber = () => `FAC-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`;

export default function ComprasPage() {
  const { perfil } = useAuthStore();
  const isAdmin = perfil?.rol === 'admin';
  const [compras, setCompras]         = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos]     = useState<Producto[]>([]);
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState<number | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [alertMsg, setAlertMsg]       = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Compra | null>(null);
  const [cabecera, setCabecera] = useState({ id_proveedor: '', numero_factura: generateInvoiceNumber(), fecha_compra: todayISO(), notas: '' });
  const [lineas, setLineas]           = useState<LineaForm[]>([{ ...LINEA_BLANK }]);

  const cRepo = useMemo(() => createCompraRepository(), []);
  const pvRepo = useMemo(() => createProveedorRepository(), []);
  const pRepo  = useMemo(() => createProductoRepository(), []);

  const load = async () => {
    setLoading(true);
    const [c, pv, p] = await Promise.all([cRepo.getAll(), pvRepo.getAll(), pRepo.getAll()]);
    setCompras(c.data ?? []);
    setProveedores((pv.data ?? []).filter(x => x.activo));
    setProductos(p.data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addLinea    = () => setLineas(l => [...l, { ...LINEA_BLANK }]);
  const removeLinea = (i: number) => setLineas(l => l.filter((_, idx) => idx !== i));
  const setLinea    = (i: number, k: keyof LineaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setLineas(l => l.map((ln, idx) => idx === i ? { ...ln, [k]: k === 'id_producto' ? +e.target.value : k === 'cantidad' || k === 'precio_unitario' ? +e.target.value : e.target.value } : ln));

  const total = lineas.reduce((sum, l) => sum + (l.cantidad * l.precio_unitario), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil || !perfil.id_peluqueria) return;
    if (!cabecera.id_proveedor) { setAlertMsg({ type: 'error', msg: 'Selecciona un proveedor.' }); return; }
    if (!cabecera.fecha_compra) { setAlertMsg({ type: 'error', msg: 'Selecciona la fecha de la compra.' }); return; }
    if (lineas.some(l => !l.id_producto)) { setAlertMsg({ type: 'error', msg: 'Selecciona un producto en cada linea.' }); return; }
    if (lineas.some(l => l.cantidad <= 0)) { setAlertMsg({ type: 'error', msg: 'La cantidad debe ser mayor que 0.' }); return; }
    if (lineas.some(l => l.precio_unitario <= 0)) { setAlertMsg({ type: 'error', msg: 'El precio por unidad debe ser mayor que 0.' }); return; }
    setSaving(true);
    const cab: CompraInput = {
      id_peluqueria:  perfil.id_peluqueria,
      id_proveedor:   +cabecera.id_proveedor,
      id_perfil:      perfil.id_perfil,
      numero_factura: cabecera.numero_factura,
      fecha_compra:   cabecera.fecha_compra,
      total:          total,
      notas:          cabecera.notas || null,
    };
    const det: DetalleCompraInput[] = lineas.map(l => ({
      id_producto:     l.id_producto,
      cantidad:        l.cantidad,
      precio_unitario: l.precio_unitario,
      fecha_caducidad: l.fecha_caducidad || null,
      lote:            l.lote || null,
    }));
    const result = await cRepo.create(cab, det);
    setSaving(false);
    if (result.error) { setAlertMsg({ type: 'error', msg: result.error.message ?? 'Error al guardar.' }); return; }
    setShowModal(false);
    load();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const compra = pendingDelete;
    setPendingDelete(null);
    const result = await cRepo.delete(compra.id_compra);
    if (result.error) {
      setAlertMsg({ type: 'error', msg: result.error.message ?? 'No se pudo borrar la compra.' });
      return;
    }
    load();
  };

  const estadoBadge = (estado: EstadoCompra) => {
    const map: Record<EstadoCompra, 'success' | 'warning' | 'neutral'> = { recibido: 'success', pendiente: 'warning', cancelado: 'neutral' };
    return <Badge variant={map[estado]}>{estado}</Badge>;
  };

  return (
    <div>
      <PageHeader
        title="Compras"
        subtitle="Registro de pedidos y facturas"
        action={isAdmin && <Btn onClick={() => { setAlertMsg(null); setCabecera({ id_proveedor: '', numero_factura: generateInvoiceNumber(), fecha_compra: todayISO(), notas: '' }); setLineas([{ ...LINEA_BLANK }]); setShowModal(true); }}><Plus size={16} />Nueva compra</Btn>}
      />

      {loading ? <div><Spinner size={32} /></div>
        : compras.length === 0 ? <EmptyState message="No hay compras registradas." />
        : <div className="compras-list">
            {compras.map(c => (
              <div key={c.id_compra} className="compra-card">
                <button className="compra-header" onClick={() => setExpanded(expanded === c.id_compra ? null : c.id_compra)}>
                  <div className="compra-info">
                    <p className="compra-proveedor">{c.proveedor?.nombre ?? 'Sin proveedor'}</p>
                    <p className="compra-fecha">{new Date(c.fecha_compra).toLocaleDateString('es-ES')} {c.numero_factura ? `· Factura: ${c.numero_factura}` : ''}</p>
                  </div>
                  <div className="compra-meta">
                    {estadoBadge(c.estado)}
                    {c.total != null && <span className="compra-total">{c.total.toFixed(2)}€</span>}
                    {isAdmin && (
                      <button
                        type="button"
                        className="compra-delete-btn"
                        title="Borrar compra"
                        onClick={event => {
                          event.stopPropagation();
                          setPendingDelete(c);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <span className="compra-expand-icon">
                      {expanded === c.id_compra ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                </button>

                {expanded === c.id_compra && c.detalle_compras && (
                  <div className="compra-details">
                    <div className="compra-table-container">
                      <table className="compra-table">
                        <thead>
                          <tr>
                            <th>Producto</th><th>Cant.</th><th>P.Unit.</th><th>Subtotal</th><th>Caduca</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.detalle_compras.map(d => (
                            <tr key={d.id_detalle}>
                              <td>{d.producto?.nombre ?? d.id_producto}</td>
                              <td>{d.cantidad} {d.producto?.unidad}</td>
                              <td>{d.precio_unitario}€</td>
                              <td>{(d.cantidad * d.precio_unitario).toFixed(2)}€</td>
                              <td>{d.fecha_caducidad ? new Date(d.fecha_caducidad).toLocaleDateString('es-ES') : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {c.notas && <p className="compra-notas">Notas: {c.notas}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
      }

      {showModal && (
        <Modal title="Nueva compra" onClose={() => setShowModal(false)} size="lg">
          {alertMsg && <div><Alert type={alertMsg.type} message={alertMsg.msg} /></div>}
          <form className="compra-modal-form" onSubmit={handleSave}>
            <div className="compra-form-row">
              <Field label="Proveedor">
                <Select value={cabecera.id_proveedor} onChange={e => setCabecera(c => ({ ...c, id_proveedor: e.target.value }))}>
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.map(pv => <option key={pv.id_proveedor} value={pv.id_proveedor}>{pv.nombre}</option>)}
                </Select>
              </Field>
              <Field label="Fecha">
                <Input type="date" value={cabecera.fecha_compra} onChange={e => setCabecera(c => ({ ...c, fecha_compra: e.target.value }))} />
              </Field>
              <Field label="Factura generada">
                <Input value={cabecera.numero_factura} readOnly />
              </Field>
            </div>
            <Field label="Notas"><Textarea value={cabecera.notas} onChange={e => setCabecera(c => ({ ...c, notas: e.target.value }))} rows={2} /></Field>

            <div>
              <div className="compra-lineas-header">
                <p className="compra-lineas-title">Líneas de compra</p>
                <Btn type="button" variant="ghost" size="sm" onClick={addLinea}><Plus size={13} />Añadir línea</Btn>
              </div>
              <div className="compra-lineas-list">
                {lineas.map((l, i) => (
                  <div key={i} className="compra-linea-item">
                    <div>
                      <Select value={l.id_producto} onChange={setLinea(i, 'id_producto')}>
                        <option value="">Producto...</option>
                        {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
                      </Select>
                    </div>
                    <div><Input type="number" min="1" value={l.cantidad} onChange={setLinea(i, 'cantidad')} placeholder="Cant." /></div>
                    <div><Input type="number" step="0.01" min="0" value={l.precio_unitario || ''} onChange={setLinea(i, 'precio_unitario')} placeholder="€/ud" /></div>
                    <div><Input type="date" value={l.fecha_caducidad} onChange={setLinea(i, 'fecha_caducidad')} /></div>
                    <div>
                      {lineas.length > 1 && (
                        <button type="button" className="compra-linea-remove" onClick={() => removeLinea(i)}><Trash2 size={14} /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="compra-total">Total: {total.toFixed(2)}€</p>
            </div>

            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>Registrar compra</Btn>
            </div>
          </form>
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Borrar compra"
          message={`¿Seguro que quieres borrar ${pendingDelete.numero_factura ? `la factura ${pendingDelete.numero_factura}` : 'esta compra'}?`}
          confirmText="Borrar"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
