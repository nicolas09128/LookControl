// src/database/supabase/SupabaseServicioRepository.ts
import type { Servicio, ServicioInput, ConsumoServicio, ConsumoInput } from '../../interfaces/Stock';
import type { ServicioRepository } from '../repositories/ServicioRepository';
import { supabase } from './Client';

const SELECT_CONSUMO = `
  *,
  servicio:servicios ( nombre ),
  producto:productos ( nombre, unidad )
`;

export class SupabaseServicioRepository implements ServicioRepository {

  // ── servicios ─────────────────────────────────────────

  async getAll(): Promise<{ data?: Servicio[]; error?: any }> {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('nombre');
    if (error) return { error };
    return { data: data as Servicio[] };
  }

  async getById(id: number): Promise<{ data?: Servicio; error?: any }> {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('id_servicio', id)
      .single();
    if (error) return { error };
    return { data: data as Servicio };
  }

  async create(input: ServicioInput): Promise<{ data?: Servicio; error?: any }> {
    const { duracion_min, ...dbPayload } = input; // duracion_min no existe en la tabla
    const { data, error } = await supabase
      .from('servicios')
      .insert(dbPayload)
      .select('*')
      .single();
    if (error) return { error };
    return { data: data as Servicio };
  }

  async update(id: number, input: Partial<ServicioInput>): Promise<{ data?: Servicio; error?: any }> {
    const { duracion_min, id_peluqueria, ...dbPayload } = input; // duracion_min no existe en DB; id_peluqueria no se muta
    const { data, error } = await supabase
      .from('servicios')
      .update(dbPayload)
      .eq('id_servicio', id)
      .select('*')
      .single();
    if (error) return { error };
    return { data: data as Servicio };
  }

  async delete(id: number): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('servicios')
      .update({ activo: false })
      .eq('id_servicio', id);
    return { error: error ?? null };
  }

  // ── consumos_servicio ─────────────────────────────────
  // El trigger handle_consumo_servicio en Supabase genera automáticamente
  // el movimiento de salida en movimientos_stock al insertar aquí.

  async getConsumos(idServicio: number): Promise<{ data?: ConsumoServicio[]; error?: any }> {
    const { data, error } = await supabase
      .from('consumos_servicio')
      .select(SELECT_CONSUMO)
      .eq('id_servicio', idServicio)
      .order('fecha', { ascending: false });
    if (error) return { error };
    return { data: data as ConsumoServicio[] };
  }

  async registrarConsumo(input: ConsumoInput): Promise<{ data?: ConsumoServicio; error?: any }> {
    const { data, error } = await supabase
      .from('consumos_servicio')
      .insert(input)
      .select(SELECT_CONSUMO)
      .single();
    if (error) return { error };
    return { data: data as ConsumoServicio };
  }
}