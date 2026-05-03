import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Clock, Euro } from 'lucide-react';
import { createServicioRepository } from '../database/repositories';
import type { Servicio, ServicioInput } from '../interfaces/Stock';
import { useAuthStore } from '../store/authStore';
import { Modal, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input, ConfirmDialog } from '../components/ui/index';

const BLANK_SERV: ServicioInput = { id_peluqueria: 0, nombre: '', precio: null, duracion_min: null, activo: true };

export default function ServiciosPage() {
  const { perfil } = useAuthStore();
  const isAdmin = perfil?.rol === 'admin';
  const [servicios, setServicios]         = useState<Servicio[]>([]);
  const [loading, setLoading]             = useState(true);
  const [showServModal, setShowServModal] = useState(false);
  const [editingServ, setEditingServ]     = useState<Servicio | null>(null);
  const [formServ, setFormServ]           = useState<ServicioInput>(BLANK_SERV);
  const [saving, setSaving]               = useState(false);
  const [alertMsg, setAlertMsg]           = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Servicio | null>(null);

  const sRepo = useMemo(() => createServicioRepository(), []);

  const loadServicios = async () => {
    setLoading(true);
    const { data } = await sRepo.getAll();
    setServicios(data ?? []);
    setLoading(false);
  };
  useEffect(() => { loadServicios(); }, []);

  const openCreateServ = () => {
    setEditingServ(null);
    setFormServ({ ...BLANK_SERV, id_peluqueria: perfil?.id_peluqueria ?? 0 });
    setAlertMsg(null);
    setShowServModal(true);
  };

  const openEditServ = (s: Servicio) => {
    setEditingServ(s);
    setFormServ({ id_peluqueria: s.id_peluqueria, nombre: s.nombre, precio: s.precio, duracion_min: s.duracion_min, activo: s.activo });
    setAlertMsg(null);
    setShowServModal(true);
  };

  const handleSaveServ = async (e: React.FormEvent) => {
    e.preventDefault();
    const precioTexto = formServ.precio == null ? '' : String(formServ.precio);
    const duracionTexto = formServ.duracion_min == null ? '' : String(formServ.duracion_min);
    const precio = precioTexto.trim() === '' ? null : Number(precioTexto);
    const duracion = duracionTexto.trim() === '' ? null : Number(duracionTexto);
    if (!formServ.nombre.trim()) { setAlertMsg({ type: 'error', msg: 'El nombre es obligatorio.' }); return; }
    if (precio === null || Number.isNaN(precio) || precio <= 0) { setAlertMsg({ type: 'error', msg: 'El precio debe ser mayor que 0.' }); return; }
    if (duracion === null || Number.isNaN(duracion) || duracion <= 0) { setAlertMsg({ type: 'error', msg: 'La duración debe ser mayor que 0 minutos.' }); return; }
    setSaving(true);
    const payload: ServicioInput = {
      ...formServ,
      nombre: formServ.nombre.trim(),
      precio,
      duracion_min: duracion,
    };
    const result = editingServ
      ? await sRepo.update(editingServ.id_servicio, payload)
      : await sRepo.create(payload);
    setSaving(false);
    if (result.error) { setAlertMsg({ type: 'error', msg: result.error.message ?? 'Error al guardar el servicio.' }); return; }
    setShowServModal(false);
    loadServicios();
  };

  const confirmDeleteServ = async () => {
    if (!pendingDelete) return;
    const s = pendingDelete;
    setPendingDelete(null);
    await sRepo.delete(s.id_servicio);
    loadServicios();
  };

  const setFS = (k: keyof ServicioInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormServ(f => ({ ...f, [k]: e.target.value === '' ? null : e.target.value }));

  return (
    <div>
      <PageHeader
        title="Servicios"
        subtitle="Catálogo de servicios"
        action={isAdmin && <Btn onClick={openCreateServ}><Plus size={16} />Nuevo servicio</Btn>}
      />

      {loading ? <Spinner /> : servicios.filter(s => s.activo).length === 0
        ? <EmptyState message="No hay servicios." />
        : <div className="servicios-list">
            {servicios.filter(s => s.activo).map(s => (
              <div key={s.id_servicio} className="servicio-item">
                <div className="servicio-item-content">
                  <div className="servicio-item-info">
                    <p className="servicio-item-name">{s.nombre}</p>
                    <div className="servicio-item-meta">
                      {s.precio       != null && <span><Euro size={11} />{s.precio}€</span>}
                      {s.duracion_min != null && <span><Clock size={11} />{s.duracion_min} min</span>}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="servicio-item-actions">
                      <span className="servicio-item-action"        onClick={() => openEditServ(s)}><Pencil size={13} /></span>
                      <span className="servicio-item-action delete" onClick={() => setPendingDelete(s)}><Trash2 size={13} /></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
      }

      {showServModal && (
        <Modal title={editingServ ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => setShowServModal(false)}>
          {alertMsg && <Alert type={alertMsg.type} message={alertMsg.msg} />}
          <form onSubmit={handleSaveServ}>
            <Field label="Nombre *"><Input value={formServ.nombre} onChange={setFS('nombre')} placeholder="Corte + peinado..." /></Field>
            <div className="compra-form-row">
              <Field label="Precio (€)"><Input type="number" step="0.01" min="0" value={formServ.precio ?? ''} onChange={setFS('precio')} placeholder="0.00" /></Field>
              <Field label="Duración (min)"><Input type="number" min="0" value={formServ.duracion_min ?? ''} onChange={setFS('duracion_min')} placeholder="60" /></Field>
            </div>
            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowServModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>{editingServ ? 'Guardar' : 'Crear'}</Btn>
            </div>
          </form>
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Eliminar servicio"
          message={`¿Seguro que quieres eliminar el servicio "${pendingDelete.nombre}"?`}
          confirmText="Eliminar"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDeleteServ}
        />
      )}
    </div>
  );
}
