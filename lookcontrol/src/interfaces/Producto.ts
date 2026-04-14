export type UnidadMedida = 'ud' | 'ml' | 'g' | 'l' | 'kg';

export interface Producto {
  id_producto: number;
  id_categoria: number;
  id_proveedor: number | null;
  id_peluqueria: number;
  nombre: string;
  descripcion: string | null;
  precio_coste: number | null;
  precio_venta: number | null;
  stock_actual: number;
  stock_minimo: number;
  unidad: UnidadMedida;
  activo: boolean;
  fecha_alta: string;
  // joins opcionales
  categoria?: { nombre: string };
  proveedor?: { nombre: string };
}

export type ProductoInput = Omit<Producto, 'id_producto' | 'fecha_alta' | 'categoria' | 'proveedor'>;

/** Producto con stock bajo: stock_actual <= stock_minimo */
export type ProductoBajoStock = Producto & { dias_sin_reposicion?: number };
