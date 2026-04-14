import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { createProductoRepository, createCategoriaRepository, createProveedorRepository } from '../database/repositories';
import type { Producto, ProductoInput, UnidadMedida } from '../interfaces/Producto';
import type { Categoria } from '../interfaces/Categoria';
import type { Proveedor } from '../interfaces/Proveedor';
import { useAuthStore } from '../store/authStore';
import { Modal, Badge, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input, Select, Textarea } from '../components/ui/index';

const BLANK: ProductoInput = { id_categoria: 0, id_proveedor: null, nombre: '', descripcion: null, precio_coste: null, precio_venta: null, stock_actual: 0, stock_minimo: 5, unidad: 'ud', activo: true, id_peluqueria: 0 };

export default function ProductosPage() {
  const { perfil } = useAuthStore();
  const isAdmin = perfil?.rol === 'admin';
  const [productos, setProductos]   = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Producto | null>(null);
  const [form, setForm]             = useState<ProductoInput>(BLANK);
  const [saving, setSaving]         = useState(false);
  const [alertMsg, setAlertMsg]     = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  const prodRepo = useMemo(() => createProductoRepository(), []);
  const catRepo  = useMemo(() => createCategoriaRepository(), []);
  const pvRepo   = useMemo(() => createProveedorRepository(), []);

  const load = async () => {
    setLoading(true);
    const [p, c, pv] = await Promise.all([prodRepo.getAll(), catRepo.getAll(), pvRepo.getAll()]);
    setProductos(p.data ?? []);
    setCategorias(c.data ?? []);
    setProveedores((pv.data ?? []).filter(x => x.activo));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat || String(p.id_categoria) === filterCat;
    return matchSearch && matchCat;
  }), [productos, search, filterCat]);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK, id_peluqueria: perfil?.id_peluqueria || 0 }); setAlertMsg(null); setShowModal(true); };
  const openEdit   = (p: Producto) => {
    setEditing(p);
    setForm({ id_categoria: p.id_categoria, id_proveedor: p.id_proveedor, nombre: p.nombre, descripcion: p.descripcion, precio_coste: p.precio_coste, precio_venta: p.precio_venta, stock_actual: p.stock_actual, stock_minimo: p.stock_minimo, unidad: p.unidad, activo: p.activo, id_peluqueria: p.id_peluqueria });
    setAlertMsg(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_categoria || !form.nombre.trim()) { setAlertMsg({ type: 'error', msg: 'Nombre y categoría son obligatorios.' }); return; }
    setSaving(true);
    const payload = form;
    const result = editing ? await prodRepo.update(editing.id_producto, payload) : await prodRepo.create(payload);
    setSaving(false);
    if (result.error) { setAlertMsg({ type: 'error', msg: result.error.message ?? 'Error al guardar.' }); return; }
    setShowModal(false);
    load();
  };

  const handleDelete = async (p: Producto) => {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    await prodRepo.delete(p.id_producto);
    load();
  };

  const setF = (k: keyof ProductoInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value === '' ? null : e.target.value }));

  const stockBadge = (p: Producto) => {
    if (p.stock_actual === 0)              return <Badge variant="danger">Sin stock</Badge>;
    if (p.stock_actual <= p.stock_minimo)  return <Badge variant="warning">Bajo</Badge>;
    return <Badge variant="success">OK</Badge>;
  };

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Catálogo de productos de la peluquería"
        action={isAdmin && <Btn onClick={openCreate}><Plus size={16} />Nuevo producto</Btn>}
      />
      {/* Filters */}
      <div className="productos-filters">
        <div className="productos-search">
          <Search size={15} className="productos-search-icon" />
          <Input className="productos-search-input" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select className="productos-filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
        </Select>
      </div>

      {loading ? <div><Spinner size={32} /></div>
        : filtered.length === 0 ? <EmptyState message="No hay productos que coincidan con los filtros." />
        : <div className="productos-table-container">
            <table className="productos-table">
              <thead>
                <tr>
                  {['Nombre', 'Categoría', 'Stock', 'Mín.', 'Precio coste', 'Estado', ''].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id_producto}>
                    <td>{p.nombre}</td>
                    <td>{p.categoria?.nombre ?? '—'}</td>
                    <td>{p.stock_actual} {p.unidad}</td>
                    <td>{p.stock_minimo}</td>
                    <td>{p.precio_coste != null ? `${p.precio_coste}€` : '—'}</td>
                    <td>{stockBadge(p)}</td>
                    <td>
                      {isAdmin && (
                        <div className="productos-actions">
                          <button className="productos-action-btn"       onClick={() => openEdit(p)}><Pencil size={14} /></button>
                          <button className="productos-action-btn delete" onClick={() => handleDelete(p)}><Trash2 size={14} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }

      {showModal && (
        <Modal title={editing ? 'Editar producto' : 'Nuevo producto'} onClose={() => setShowModal(false)} size="lg">
          {alertMsg && <div><Alert type={alertMsg.type} message={alertMsg.msg} /></div>}
          <form className="productos-modal-form" onSubmit={handleSave}>
            <div className="productos-modal-form-full">
              <Field label="Nombre *">
                <Input value={form.nombre} onChange={setF('nombre')} placeholder="Tinte permanente..." required />
              </Field>
            </div>
            <Field label="Categoría *">
              <Select value={form.id_categoria} onChange={setF('id_categoria')} required>
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Proveedor">
              <Select value={form.id_proveedor ?? ''} onChange={setF('id_proveedor')}>
                <option value="">Sin proveedor</option>
                {proveedores.map(pv => <option key={pv.id_proveedor} value={pv.id_proveedor}>{pv.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Stock actual">
              <Input type="number" min="0" value={form.stock_actual} onChange={e => setForm(f => ({ ...f, stock_actual: +e.target.value }))} />
            </Field>
            <Field label="Stock mínimo">
              <Input type="number" min="0" value={form.stock_minimo} onChange={e => setForm(f => ({ ...f, stock_minimo: +e.target.value }))} />
            </Field>
            <Field label="Precio coste (€)">
              <Input type="number" step="0.01" min="0" value={form.precio_coste ?? ''} onChange={setF('precio_coste')} placeholder="0.00" />
            </Field>
            <Field label="Precio venta (€)">
              <Input type="number" step="0.01" min="0" value={form.precio_venta ?? ''} onChange={setF('precio_venta')} placeholder="0.00" />
            </Field>
            <Field label="Unidad">
              <Select value={form.unidad} onChange={setF('unidad')}>
                {(['ud','ml','g','l','kg'] as UnidadMedida[]).map(u => <option key={u} value={u}>{u}</option>)}
              </Select>
            </Field>
            <div className="productos-modal-form-full">
              <Field label="Descripción">
                <Textarea value={form.descripcion ?? ''} onChange={setF('descripcion')} rows={2} placeholder="Descripción opcional..." />
              </Field>
            </div>
            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Crear producto'}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
