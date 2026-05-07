import type { Producto } from './Producto';
import type { Perfil } from './Perfil';

export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste';

export interface MovimientoStock {
  id_movimiento: number;
  id_peluqueria: number;
  id_producto: number;
  id_perfil: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string | null;
  referencia_id: number | null;
  fecha: string;
  producto?: Pick<Producto, 'nombre' | 'unidad'>;
  perfil?: Pick<Perfil, 'nombre_completo' | 'email'>;
}

export type MovimientoInput = Omit<MovimientoStock, 'id_movimiento' | 'fecha' | 'producto' | 'perfil' | 'referencia_id'>;

export interface Servicio {
  id_servicio: number;
  id_peluqueria: number;
  nombre: string;
  precio: number | null;
  duracion_min: number | null;
  activo: boolean;
}

export type ServicioInput = Omit<Servicio, 'id_servicio'>;

export interface ConsumoServicio {
  id_consumo: number;
  id_servicio: number;
  id_producto: number;
  id_perfil: number;
  cantidad_usada: number;
  fecha: string;
  notas: string | null;
  servicio?: Pick<Servicio, 'nombre'>;
  producto?: Pick<Producto, 'nombre' | 'unidad'>;
}

export type ConsumoInput = Omit<ConsumoServicio, 'id_consumo' | 'fecha' | 'servicio' | 'producto'>;
