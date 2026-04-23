// src/database/repositories/ProveedorRepository.ts
import type { Proveedor, ProveedorInput } from '../../interfaces/Proveedor';

export interface ProveedorRepository {
  getAll(): Promise<{ data?: Proveedor[]; error?: any }>;
  getById(id: number): Promise<{ data?: Proveedor; error?: any }>;
  create(data: ProveedorInput): Promise<{ data?: Proveedor; error?: any }>;
  update(id: number, data: Partial<ProveedorInput>): Promise<{ data?: Proveedor; error?: any }>;
  delete(id: number): Promise<{ error?: any }>;
  hardDelete(id: number): Promise<{ error?: any }>;
  reactivate(id: number): Promise<{ error?: any }>;
}
