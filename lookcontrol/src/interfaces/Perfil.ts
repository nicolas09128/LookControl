// src/interfaces/Perfil.ts
export interface Perfil {
  id_perfil: number;
  user_id: string;
  id_peluqueria: number | null;
  nombre_completo: string | null;
  nombre_peluqueria?: string | null;
  email: string;
  avatar_url: string | null;
  rol: 'admin' | 'empleado' | 'pendiente' | 'user';
  permisos: string[];
  codigo_invitacion?: string | null;
  fecha_registro: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre_completo?: string;
  tipo: 'admin' | 'empleado';
  nombre_peluqueria?: string;
}
