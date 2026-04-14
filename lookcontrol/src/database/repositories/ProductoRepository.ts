import type { Producto, ProductoInput } from '../../interfaces/Producto';

export interface ProductoRepository {
  getAll(): Promise<{ data?: Producto[]; error?: any }>;
  getById(id: number): Promise<{ data?: Producto; error?: any }>;
  getBajoStock(): Promise<{ data?: Producto[]; error?: any }>;
  create(data: ProductoInput): Promise<{ data?: Producto; error?: any }>;
  update(id: number, data: Partial<ProductoInput>): Promise<{ data?: Producto; error?: any }>;
  updateStock(id: number, nuevoStock: number): Promise<{ error?: any }>;
  delete(id: number): Promise<{ error?: any }>;
}
