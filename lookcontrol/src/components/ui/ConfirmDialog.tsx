import { X } from 'lucide-react';
import Btn from './Button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onCancel} />
      <div className="modal-panel sm">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onCancel} className="modal-close">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
          <div className="productos-modal-actions modal-actions-spaced">
            <Btn type="button" variant="ghost" onClick={onCancel}>{cancelText}</Btn>
            <Btn type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
