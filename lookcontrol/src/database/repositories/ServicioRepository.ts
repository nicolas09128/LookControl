import type { Servicio, ServicioInput, ConsumoServicio, ConsumoInput } from '../../interfaces/Stock';

export interface ServicioRepository {
  getAll(): Promise<{ data?: Servicio[]; error?: any }>;
  getById(id: number): Promise<{ data?: Servicio; error?: any }>;
  create(data: ServicioInput): Promise<{ data?: Servicio; error?: any }>;
  update(id: number, data: Partial<ServicioInput>): Promise<{ data?: Servicio; error?: any }>;
  delete(id: number): Promise<{ error?: any }>;
  getConsumos(idServicio: number): Promise<{ data?: ConsumoServicio[]; error?: any }>;
  registrarConsumo(data: ConsumoInput): Promise<{ data?: ConsumoServicio; error?: any }>;
}
