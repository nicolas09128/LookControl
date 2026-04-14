export interface Proveedor {
  id_proveedor: number;
  id_peluqueria: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  notas: string | null;
  activo: boolean;
  fecha_alta: string;
}

export type ProveedorInput = Omit<Proveedor, 'id_proveedor' | 'fecha_alta'>;
