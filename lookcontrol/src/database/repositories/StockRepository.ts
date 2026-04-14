// src/database/repositories/StockRepository.ts
import type { MovimientoStock, MovimientoInput } from '../../interfaces/Stock';

export interface StockRepository {
  getMovimientos(filters?: { id_producto?: number; tipo?: string }): Promise<{ data?: MovimientoStock[]; error?: any }>;
  registrarMovimiento(data: MovimientoInput): Promise<{ data?: MovimientoStock; error?: any }>;
}
