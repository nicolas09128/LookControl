import type { Proveedor, ProveedorInput } from '../../interfaces/Proveedor';
import type { ProveedorRepository } from '../repositories/ProveedorRepository';
import type { CategoriaRepository } from '../repositories/CategoriaRepository';
import type { Categoria } from '../../interfaces/Categoria';
import type { StockRepository } from '../repositories/StockRepository';
import type { MovimientoStock, MovimientoInput } from '../../interfaces/Stock';
import type { CompraRepository } from '../repositories/CompraRepository';
import type { Compra, CompraInput, DetalleCompraInput } from '../../interfaces/Compra';
import { supabase } from './Client';

export class SupabaseProveedorRepository implements ProveedorRepository {

  async getAll(): Promise<{ data?: Proveedor[]; error?: any }> {
    const { data, error } = await supabase
      .from('proveedores').select('*').order('nombre');
    if (error) return { error };
    return { data: data as Proveedor[] };
  }

  async getById(id: number): Promise<{ data?: Proveedor; error?: any }> {
    const { data, error } = await supabase
      .from('proveedores').select('*').eq('id_proveedor', id).single();
    if (error) return { error };
    return { data: data as Proveedor };
  }

  async create(input: ProveedorInput): Promise<{ data?: Proveedor; error?: any }> {
    const { data, error } = await supabase
      .from('proveedores').insert(input).select('*').single();
    if (error) return { error };
    return { data: data as Proveedor };
  }

  async update(id: number, input: Partial<ProveedorInput>): Promise<{ data?: Proveedor; error?: any }> {
    const { data, error } = await supabase
      .from('proveedores').update(input).eq('id_proveedor', id).select('*').single();
    if (error) return { error };
    return { data: data as Proveedor };
  }

  async delete(id: number): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('proveedores').update({ activo: false }).eq('id_proveedor', id);
    return { error: error ?? null };
  }

  async hardDelete(id: number): Promise<{ error?: any }> {
    await supabase.from('productos').update({ id_proveedor: null }).eq('id_proveedor', id);
    const { error } = await supabase.from('proveedores').delete().eq('id_proveedor', id);
    return { error: error ?? null };
  }

  async reactivate(id: number): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('proveedores').update({ activo: true }).eq('id_proveedor', id);
    return { error: error ?? null };
  }
}

export class SupabaseCategoriaRepository implements CategoriaRepository {

  async getAll(): Promise<{ data?: Categoria[]; error?: any }> {
    const { data, error } = await supabase
      .from('categorias').select('*').order('nombre');
    if (error) return { error };
    return { data: data as Categoria[] };
  }
}

export class SupabaseStockRepository implements StockRepository {

  async getMovimientos(
    filters?: { id_producto?: number; tipo?: string }
  ): Promise<{ data?: MovimientoStock[]; error?: any }> {
    let query = supabase
      .from('movimientos_stock')
      .select(`*, producto:productos(nombre, unidad), perfil:perfiles(nombre_completo, email)`)
      .order('fecha', { ascending: false });

    if (filters?.id_producto) query = query.eq('id_producto', filters.id_producto);
    if (filters?.tipo) query = query.eq('tipo', filters.tipo);

    const { data, error } = await query;
    if (error) return { error };
    return { data: data as MovimientoStock[] };
  }

  async registrarMovimiento(input: MovimientoInput): Promise<{ data?: MovimientoStock; error?: any }> {
    const { data, error } = await supabase
      .from('movimientos_stock').insert(input).select('*').single();
    if (error) return { error };
    return { data: data as MovimientoStock };
  }
}

export class SupabaseCompraRepository implements CompraRepository {

  async getAll(): Promise<{ data?: Compra[]; error?: any }> {
    const { data, error } = await supabase
      .from('compras')
      .select(`
        *,
        proveedor:proveedores(nombre),
        detalle_compras(*, producto:productos(nombre, unidad))
      `)
      .order('fecha_compra', { ascending: false });
    if (error) return { error };
    return { data: data as Compra[] };
  }

  async getById(id: number): Promise<{ data?: Compra; error?: any }> {
    const { data, error } = await supabase
      .from('compras')
      .select(`
        *,
        proveedor:proveedores(nombre),
        detalle_compras(*, producto:productos(nombre, unidad))
      `)
      .eq('id_compra', id)
      .single();
    if (error) return { error };
    return { data: data as Compra };
  }

  async create(
    cabecera: CompraInput,
    detalles: DetalleCompraInput[]
  ): Promise<{ data?: Compra; error?: any }> {
    const dbPayload = {
      id_peluqueria: cabecera.id_peluqueria,
      id_perfil: cabecera.id_perfil,
      id_proveedor: cabecera.id_proveedor,
      numero_factura: cabecera.numero_factura,
      notas: cabecera.notas,
      total: cabecera.total,
      fecha_compra: cabecera.fecha_compra,
    };

    const { data: compra, error: errCabecera } = await supabase
      .from('compras').insert(dbPayload).select('*').single();
    if (errCabecera || !compra) return { error: errCabecera };

    const lineas = detalles.map(d => ({ ...d, id_compra: compra.id_compra }));
    const { error: errDetalles } = await supabase.from('detalle_compras').insert(lineas);
    if (errDetalles) return { error: errDetalles };

    return this.getById(compra.id_compra);
  }

  async updateEstado(id: number, estado: Compra['estado']): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('compras').update({ estado }).eq('id_compra', id);
    return { error: error ?? null };
  }

  async delete(id: number): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('compras').delete().eq('id_compra', id);
    return { error: error ?? null };
  }
}
