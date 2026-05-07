import type { Servicio, ServicioInput, ConsumoServicio, ConsumoInput } from '../../interfaces/Stock';
import type { ServicioRepository } from '../repositories/ServicioRepository';
import { supabase } from './Client';

const SELECT_CONSUMO = `
  *,
  servicio:servicios ( nombre ),
  producto:productos ( nombre, unidad )
`;

function limpiarServicioPayload(input: Partial<ServicioInput>, quitarPeluqueria = false) {
  const dbPayload = { ...input };
  delete dbPayload.duracion_min;
  if (quitarPeluqueria) delete dbPayload.id_peluqueria;
  return dbPayload;
}

export class SupabaseServicioRepository implements ServicioRepository {

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
    const dbPayload = limpiarServicioPayload(input);
    const { data, error } = await supabase
      .from('servicios')
      .insert(dbPayload)
      .select('*')
      .single();
    if (error) return { error };
    return { data: data as Servicio };
  }

  async update(id: number, input: Partial<ServicioInput>): Promise<{ data?: Servicio; error?: any }> {
    const dbPayload = limpiarServicioPayload(input, true);
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
