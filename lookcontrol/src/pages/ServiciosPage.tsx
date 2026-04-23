import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Clock, Euro } from 'lucide-react';
import { createServicioRepository } from '../database/repositories';
import type { Servicio, ServicioInput } from '../interfaces/Stock';
import { useAuthStore } from '../store/authStore';
import { Modal, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input } from '../components/ui/index';

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
    if (!formServ.nombre.trim()) { setAlertMsg({ type: 'error', msg: 'El nombre es obligatorio.' }); return; }
    setSaving(true);
    const result = editingServ
      ? await sRepo.update(editingServ.id_servicio, formServ)
      : await sRepo.create(formServ);
    setSaving(false);
    if (result.error) { setAlertMsg({ type: 'error', msg: result.error.message ?? 'Error al guardar el servicio.' }); return; }
    setShowServModal(false);
    loadServicios();
  };

  const handleDeleteServ = async (s: Servicio) => {
    if (!confirm(`¿Eliminar "${s.nombre}"?`)) return;
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
                      <span className="servicio-item-action delete" onClick={() => handleDeleteServ(s)}><Trash2 size={13} /></span>
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
            <Field label="Nombre *"><Input value={formServ.nombre} onChange={setFS('nombre')} placeholder="Corte + peinado..." required /></Field>
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
    </div>
  );
}