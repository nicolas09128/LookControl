import type { Compra, CompraInput, DetalleCompraInput } from '../../interfaces/Compra';

export interface CompraRepository {
  getAll(): Promise<{ data?: Compra[]; error?: any }>;
  getById(id: number): Promise<{ data?: Compra; error?: any }>;
  create(
    cabecera: CompraInput,
    detalles: DetalleCompraInput[]
  ): Promise<{ data?: Compra; error?: any }>;
  updateEstado(id: number, estado: Compra['estado']): Promise<{ error?: any }>;
  delete(id: number): Promise<{ error?: any }>;
}
