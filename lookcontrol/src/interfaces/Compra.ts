import type { Proveedor } from './Proveedor';
import type { Producto } from './Producto';

export type EstadoCompra = 'pendiente' | 'recibido' | 'cancelado';

export interface Compra {
  id_compra: number;
  id_peluqueria: number;
  id_proveedor: number | null;
  id_perfil: number;
  numero_factura: string | null;
  fecha_compra: string;
  total: number | null;
  notas: string | null;
  estado: EstadoCompra;
  fecha_creacion: string;
  // joins
  proveedor?: Pick<Proveedor, 'nombre'>;
  detalle_compras?: DetalleCompra[];
}

export interface DetalleCompra {
  id_detalle: number;
  id_compra: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  fecha_caducidad: string | null;
  lote: string | null;
  // join
  producto?: Pick<Producto, 'nombre' | 'unidad'>;
}

export type CompraInput = Omit<Compra, 'id_compra' | 'fecha_creacion' | 'proveedor' | 'detalle_compras' | 'estado'>;
export type DetalleCompraInput = Omit<DetalleCompra, 'id_detalle' | 'id_compra' | 'producto'>;