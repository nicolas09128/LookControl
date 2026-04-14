import type { Producto } from './Producto';
import type { Perfil } from './Perfil';

// ─── MOVIMIENTO DE STOCK ──────────────────────────────────
export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste';

export interface MovimientoStock {
  id_movimiento: number;
  id_producto: number;
  id_perfil: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string | null;
  referencia_id: number | null;
  fecha: string;
  // joins
  producto?: Pick<Producto, 'nombre' | 'unidad'>;
  perfil?: Pick<Perfil, 'nombre_completo' | 'email'>;
}

export type MovimientoInput = Omit<MovimientoStock, 'id_movimiento' | 'fecha' | 'producto' | 'perfil'>;

// ─── SERVICIO ─────────────────────────────────────────────
export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  duracion_min: number | null;
  activo: boolean;
}

export type ServicioInput = Omit<Servicio, 'id_servicio'>;

// ─── CONSUMO DE SERVICIO ──────────────────────────────────
export interface ConsumoServicio {
  id_consumo: number;
  id_servicio: number;
  id_producto: number;
  id_perfil: number;
  cantidad_usada: number;
  fecha: string;
  notas: string | null;
  // joins
  servicio?: Pick<Servicio, 'nombre'>;
  producto?: Pick<Producto, 'nombre' | 'unidad'>;
}

export type ConsumoInput = Omit<ConsumoServicio, 'id_consumo' | 'fecha' | 'servicio' | 'producto'>;
