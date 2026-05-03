import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Phone, Mail } from 'lucide-react';
import { createProveedorRepository } from '../database/repositories';
import type { Proveedor, ProveedorInput } from '../interfaces/Proveedor';
import { useAuthStore } from '../store/authStore';
import { Modal, Badge, PageHeader, Spinner, EmptyState, Alert, Btn, Field, Input, Textarea, ConfirmDialog } from '../components/ui/index';

const BLANK: ProveedorInput = { id_peluqueria: 0, nombre: '', telefono: null, email: null, direccion: null, notas: null, activo: true };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export default function ProveedoresPage() {
  const { perfil } = useAuthStore();
  const isAdmin = perfil?.rol === 'admin';
  const id_peluqueria = perfil?.id_peluqueria ?? 0;
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState<Proveedor | null>(null);
  const [form, setForm]               = useState<ProveedorInput>(BLANK);
  const [saving, setSaving]           = useState(false);
  const [alertMsg, setAlertMsg]       = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [pendingAction, setPendingAction] = useState<{ proveedor: Proveedor; action: 'deactivate' | 'delete' } | null>(null);

  const repo = useMemo(() => createProveedorRepository(), []);
  const load = async () => { setLoading(true); const r = await repo.getAll(); setProveedores(r.data ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK, id_peluqueria }); setAlertMsg(null); setShowModal(true); };
  const openEdit   = (p: Proveedor) => {
    setEditing(p);
    setForm({ id_peluqueria: p.id_peluqueria, nombre: p.nombre, telefono: p.telefono, email: p.email, direccion: p.direccion, notas: p.notas, activo: p.activo });
    setAlertMsg(null); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email?.trim() ?? '';
    const telefono = form.telefono?.trim() ?? '';
    if (!form.nombre.trim()) { setAlertMsg({ type: 'error', msg: 'El nombre es obligatorio.' }); return; }
    if (email && !EMAIL_RE.test(email)) { setAlertMsg({ type: 'error', msg: 'Introduce un email valido.' }); return; }
    if (telefono && !PHONE_RE.test(telefono)) { setAlertMsg({ type: 'error', msg: 'Introduce un telefono valido.' }); return; }
    setSaving(true);
    const payload = { ...form, email: email || null, telefono: telefono || null };
    const result = editing ? await repo.update(editing.id_proveedor, payload) : await repo.create(payload);
    setSaving(false);
    if (result.error) { setAlertMsg({ type: 'error', msg: result.error.message ?? 'Error al guardar.' }); return; }
    setShowModal(false); load();
  };

  const confirmProviderAction = async () => {
    if (!pendingAction) return;
    const p = pendingAction.proveedor;
    const action = pendingAction.action;
    setPendingAction(null);
    if (action === 'deactivate') {
      await repo.delete(p.id_proveedor);
    } else {
      const result = await repo.hardDelete(p.id_proveedor);
      if (result.error) {
        setAlertMsg({ type: 'error', msg: result.error.message ?? 'No se pudo eliminar el proveedor.' });
        return;
      }
    }
    load();
  };

  const handleReactivate = async (p: Proveedor) => {
    await repo.reactivate(p.id_proveedor);
    load();
  };

  const setF = (k: keyof ProveedorInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value || null }));

  return (
    <div>
      <PageHeader
        title="Proveedores"
        subtitle="Gestión de proveedores de suministros"
        action={isAdmin && <Btn onClick={openCreate}><Plus size={16} />Nuevo proveedor</Btn>}
      />

      {loading ? <div><Spinner size={32} /></div>
        : proveedores.length === 0 ? <EmptyState message="No hay proveedores registrados." />
        : <div className="proveedores-grid">
            {proveedores.map(p => (
              <div key={p.id_proveedor} className="proveedor-card">
                <div className="proveedor-card-header">
                  <div>
                    <h3 className="proveedor-card-name">{p.nombre}</h3>
                    <Badge variant={p.activo ? 'success' : 'neutral'}>{p.activo ? 'Activo' : 'Inactivo'}</Badge>
                  </div>
                  {isAdmin && (
                    <div className="proveedor-card-actions">
                      <button className="proveedor-card-action" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                      {!p.activo && (
                        <button
                          className="proveedor-card-action"
                          title="Reactivar proveedor"
                          onClick={() => handleReactivate(p)}
                          style={{ color: 'var(--brand-success, #22c55e)' }}
                        >
                          ↩
                        </button>
                      )}
                      <button
                        className="proveedor-card-action delete"
                        title={p.activo ? 'Desactivar' : 'Eliminar definitivamente'}
                        onClick={() => setPendingAction({ proveedor: p, action: p.activo ? 'deactivate' : 'delete' })}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="proveedor-card-details">
                  {p.telefono  && <p className="proveedor-card-detail"><Phone size={13} />{p.telefono}</p>}
                  {p.email     && <p className="proveedor-card-detail"><Mail size={13} />{p.email}</p>}
                  {p.direccion && <p className="proveedor-card-detail">{p.direccion}</p>}
                  {p.notas     && <p className="proveedor-card-notes">{p.notas}</p>}
                </div>
              </div>
            ))}
          </div>
      }

      {showModal && (
        <Modal title={editing ? 'Editar proveedor' : 'Nuevo proveedor'} onClose={() => setShowModal(false)}>
          {alertMsg && <div><Alert type={alertMsg.type} message={alertMsg.msg} /></div>}
          <form onSubmit={handleSave}>
            <Field label="Nombre *"><Input value={form.nombre} onChange={setF('nombre')} placeholder="Distribuidora XYZ" /></Field>
            <Field label="Teléfono"><Input value={form.telefono ?? ''} onChange={setF('telefono')} placeholder="+34 600 000 000" /></Field>
            <Field label="Email"><Input type="text" value={form.email ?? ''} onChange={setF('email')} placeholder="contacto@proveedor.com" /></Field>
            <Field label="Dirección"><Input value={form.direccion ?? ''} onChange={setF('direccion')} placeholder="Calle, ciudad..." /></Field>
            <Field label="Notas"><Textarea value={form.notas ?? ''} onChange={setF('notas')} rows={2} placeholder="Condiciones de pago, horarios..." /></Field>
            <div className="productos-modal-actions">
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Btn>
              <Btn type="submit" loading={saving}>{editing ? 'Guardar' : 'Crear proveedor'}</Btn>
            </div>
          </form>
        </Modal>
      )}
      {pendingAction && (
        <ConfirmDialog
          title={pendingAction.action === 'deactivate' ? 'Desactivar proveedor' : 'Eliminar proveedor'}
          message={
            pendingAction.action === 'deactivate'
              ? `¿Seguro que quieres desactivar a "${pendingAction.proveedor.nombre}"?`
              : `¿Seguro que quieres eliminar definitivamente a "${pendingAction.proveedor.nombre}"?`
          }
          confirmText={pendingAction.action === 'deactivate' ? 'Desactivar' : 'Eliminar'}
          danger
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmProviderAction}
        />
      )}
    </div>
  );
}
