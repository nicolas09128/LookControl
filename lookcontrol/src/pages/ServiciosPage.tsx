import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Scissors, Clock, Euro } from 'lucide-react';
import { supabase } from '../database/supabase/Client';
import { createProductoRepository } from '../database/repositories';
import type { Servicio, ServicioInput, ConsumoServicio, ConsumoInput } from '../interfaces/Stock';
import type { Producto } from '../interfaces/Producto';
import { useAuthStore } from '../store/authStore';
import { Modal, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input, Select, Textarea } from '../components/ui/index';

const BLANK_SERV: ServicioInput = { nombre: '', descripcion: null, precio: null, duracion_min: null, activo: true };

export default function ServiciosPage() {
  const { perfil } = useAuthStore();
  const isAdmin = perfil?.rol === 'admin';
  const [servicios, setServicios]           = useState<Servicio[]>([]);
  const [productos, setProductos]           = useState<Producto[]>([]);
  const [consumos, setConsumos]             = useState<ConsumoServicio[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [showServModal, setShowServModal]   = useState(false);
  const [showConsumoModal, setShowConsumoModal] = useState(false);
  const [editingServ, setEditingServ]       = useState<Servicio | null>(null);
  const [formServ, setFormServ]             = useState<ServicioInput>(BLANK_SERV);
  const [formConsumo, setFormConsumo]       = useState({ id_producto: '', cantidad_usada: 1, notas: '' });
  const [saving, setSaving]                 = useState(false);
  const [alertMsg, setAlertMsg]             = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  const pRepo = useMemo(() => createProductoRepository(), []);

  const loadServicios = async () => {
    const { data } = await supabase.from('servicios').select('*').order('nombre');
    setServicios(data ?? []);
  };
  const loadConsumos = async (idServicio: number) => {
    const { data } = await supabase
      .from('consumos_servicio')
      .select('*, servicio:servicios(nombre), producto:productos(nombre, unidad)')
      .eq('id_servicio', idServicio)
      .order('fecha', { ascending: false });
    setConsumos(data ?? []);
  };
  const load = async () => {
    setLoading(true);
    const [_, p] = await Promise.all([loadServicios(), pRepo.getAll()]);
    setProductos(p.data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (selectedServicio) loadConsumos(selectedServicio.id_servicio); }, [selectedServicio]);

  const openCreateServ = () => { setEditingServ(null); setFormServ(BLANK_SERV); setAlertMsg(null); setShowServModal(true); };
  const openEditServ   = (s: Servicio) => {
    setEditingServ(s);
    setFormServ({ nombre: s.nombre, descripcion: s.descripcion, precio: s.precio, duracion_min: s.duracion_min, activo: s.activo });
    setAlertMsg(null); setShowServModal(true);
  };

  const handleSaveServ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formServ.nombre.trim()) { setAlertMsg({ type: 'error', msg: 'El nombre es obligatorio.' }); return; }
    setSaving(true);
    if (editingServ) {
      await supabase.from('servicios').update(formServ).eq('id_servicio', editingServ.id_servicio);
    } else {
      await supabase.from('servicios').insert(formServ);
    }
    setSaving(false);
    setShowServModal(false);
    loadServicios();
  };

  const handleDeleteServ = async (s: Servicio) => {
    if (!confirm(`¿Eliminar "${s.nombre}"?`)) return;
    await supabase.from('servicios').update({ activo: false }).eq('id_servicio', s.id_servicio);
    if (selectedServicio?.id_servicio === s.id_servicio) setSelectedServicio(null);
    loadServicios();
  };

  const handleSaveConsumo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil || !selectedServicio || !formConsumo.id_producto) { setAlertMsg({ type: 'error', msg: 'Selecciona un producto.' }); return; }
    setSaving(true);
    const input: ConsumoInput = {
      id_servicio:   selectedServicio.id_servicio,
      id_producto:   +formConsumo.id_producto,
      id_perfil:     perfil.id_perfil,
      cantidad_usada: formConsumo.cantidad_usada,
      notas:         formConsumo.notas || null,
    };
    await supabase.from('consumos_servicio').insert(input);
    setSaving(false);
    setShowConsumoModal(false);
    setFormConsumo({ id_producto: '', cantidad_usada: 1, notas: '' });
    loadConsumos(selectedServicio.id_servicio);
  };

  const setFS = (k: keyof ServicioInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormServ(f => ({ ...f, [k]: e.target.value === '' ? null : e.target.value }));

  return (
    <div>
      <PageHeader
        title="Servicios"
        subtitle="Catálogo de servicios y registro de consumos"
        action={isAdmin && <Btn onClick={openCreateServ}><Plus size={16} />Nuevo servicio</Btn>}
      />

      <div className="servicios-layout">
        {/* Lista servicios */}
        <div>
          <p className="servicios-list-header">Servicios</p>
          {loading ? <Spinner /> : servicios.filter(s => s.activo).length === 0
            ? <EmptyState message="No hay servicios." />
            : <div className="servicios-list">
                {servicios.filter(s => s.activo).map(s => (
                  <button
                    key={s.id_servicio}
                    className={`servicio-item${selectedServicio?.id_servicio === s.id_servicio ? ' selected' : ''}`}
                    onClick={() => setSelectedServicio(selectedServicio?.id_servicio === s.id_servicio ? null : s)}
                  >
                    <div className="servicio-item-content">
                      <div className="servicio-item-info">
                        <p className="servicio-item-name">{s.nombre}</p>
                        <div className="servicio-item-meta">
                          {s.precio      != null && <span><Euro size={11} />{s.precio}€</span>}
                          {s.duracion_min != null && <span><Clock size={11} />{s.duracion_min} min</span>}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="servicio-item-actions">
                          <span className="servicio-item-action"        onClick={e => { e.stopPropagation(); openEditServ(s); }}><Pencil size={13} /></span>
                          <span className="servicio-item-action delete" onClick={e => { e.stopPropagation(); handleDeleteServ(s); }}><Trash2 size={13} /></span>
                        </div>
                      )}
                    </div>
                    {s.descripcion && <p className="servicio-item-description">{s.descripcion}</p>}
                  </button>
                ))}
              </div>
          }
        </div>

        {/* Panel consumos */}
        <div className="consumos-panel">
          {!selectedServicio
            ? <div className="consumos-empty">
                <div>
                  <div className="consumos-empty-icon"><Scissors size={32} /></div>
                  <p>Selecciona un servicio para ver sus consumos</p>
                </div>
              </div>
            : <>
                <div className="consumos-header">
                  <p className="consumos-title">Consumos — {selectedServicio.nombre}</p>
                  <Btn size="sm" onClick={() => { setAlertMsg(null); setShowConsumoModal(true); }}><Plus size={13} />Registrar consumo</Btn>
                </div>
                {consumos.length === 0
                  ? <EmptyState message="No hay consumos registrados para este servicio." />
                  : <div className="consumos-table-container">
                      <table className="consumos-table">
                        <thead>
                          <tr>
                            {['Producto', 'Cantidad', 'Notas', 'Fecha'].map(h => (
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {consumos.map(c => (
                            <tr key={c.id_consumo}>
                              <td>{c.producto?.nombre ?? c.id_producto}</td>
                              <td>{c.cantidad_usada} {c.producto?.unidad}</td>
                              <td>{c.notas ?? '—'}</td>
                              <td>{new Date(c.fecha).toLocaleDateString('es-ES')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                }
              </>
          }
        </div>
      </div>

      {/* Modal servicio */}
      {showServModal && (
        <Modal title={editingServ ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => setShowServModal(false)}>
          {alertMsg && <div><Alert type={alertMsg.type} message={alertMsg.msg} /></div>}
          <form onSubmit={handleSaveServ}>
            <Field label="Nombre *"><Input value={formServ.nombre} onChange={setFS('nombre')} placeholder="Corte + peinado..." required /></Field>
            <div className="compra-form-row">
              <Field label="Precio (€)"><Input type="number" step="0.01" min="0" value={formServ.precio ?? ''} onChange={setFS('precio')} placeholder="0.00" /></Field>
              <Field label="Duración (min)"><Input type="number" min="0" value={formServ.duracion_min ?? ''} onChange={setFS('duracion_min')} placeholder="60" /></Field>
            </div>
            <Field label="Descripción"><Textarea value={formServ.descripcion ?? ''} onChange={setFS('descripcion')} rows={2} /></Field>
            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowServModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>{editingServ ? 'Guardar' : 'Crear'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal consumo */}
      {showConsumoModal && (
        <Modal title={`Consumo — ${selectedServicio?.nombre}`} onClose={() => setShowConsumoModal(false)}>
          {alertMsg && <div><Alert type={alertMsg.type} message={alertMsg.msg} /></div>}
          <form onSubmit={handleSaveConsumo}>
            <Field label="Producto *">
              <Select value={formConsumo.id_producto} onChange={e => setFormConsumo(f => ({ ...f, id_producto: e.target.value }))} required>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} (stock: {p.stock_actual} {p.unidad})</option>)}
              </Select>
            </Field>
            <Field label="Cantidad usada">
              <Input type="number" step="0.01" min="0.01" value={formConsumo.cantidad_usada} onChange={e => setFormConsumo(f => ({ ...f, cantidad_usada: +e.target.value }))} required />
            </Field>
            <Field label="Notas">
              <Textarea value={formConsumo.notas} onChange={e => setFormConsumo(f => ({ ...f, notas: e.target.value }))} rows={2} placeholder="Observaciones del servicio..." />
            </Field>
            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowConsumoModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>Registrar</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
