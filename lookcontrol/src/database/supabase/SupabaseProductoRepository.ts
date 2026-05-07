import type { Producto, ProductoInput } from '../../interfaces/Producto';
import type { ProductoRepository } from '../repositories/ProductoRepository';
import { supabase } from './Client';

const SELECT_PRODUCTO = `
  *,
  categoria:categorias ( nombre ),
  proveedor:proveedores ( nombre )
`;

export class SupabaseProductoRepository implements ProductoRepository {

  async getAll(): Promise<{ data?: Producto[]; error?: any }> {
    const { data, error } = await supabase
      .from('productos')
      .select(SELECT_PRODUCTO)
      .eq('activo', true)
      .order('nombre', { ascending: true });
    if (error) return { error };
    return { data: data as Producto[] };
  }

  async getById(id: number): Promise<{ data?: Producto; error?: any }> {
    const { data, error } = await supabase
      .from('productos')
      .select(SELECT_PRODUCTO)
      .eq('id_producto', id)
      .single();
    if (error) return { error };
    return { data: data as Producto };
  }

  async getBajoStock(): Promise<{ data?: Producto[]; error?: any }> {
    const { data: all, error: allErr } = await supabase
      .from('productos')
      .select(SELECT_PRODUCTO)
      .eq('activo', true);

    if (allErr) return { error: allErr };
    const bajoStock = (all as Producto[]).filter(p => p.stock_actual <= p.stock_minimo);
    return { data: bajoStock };
  }

  async create(input: ProductoInput): Promise<{ data?: Producto; error?: any }> {
    const { data, error } = await supabase
      .from('productos')
      .insert(input)
      .select(SELECT_PRODUCTO)
      .single();
    if (error) return { error };
    return { data: data as Producto };
  }

  async update(id: number, input: Partial<ProductoInput>): Promise<{ data?: Producto; error?: any }> {
    const { data, error } = await supabase
      .from('productos')
      .update(input)
      .eq('id_producto', id)
      .select(SELECT_PRODUCTO)
      .single();
    if (error) return { error };
    return { data: data as Producto };
  }

  async updateStock(id: number, nuevoStock: number): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('productos')
      .update({ stock_actual: nuevoStock })
      .eq('id_producto', id);
    return { error: error ?? null };
  }

  async delete(id: number): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('id_producto', id);
    return { error: error ?? null };
  }
}
