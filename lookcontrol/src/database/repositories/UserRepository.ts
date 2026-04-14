// src/database/repositories/UserRepository.ts
import type { Perfil, RegisterData } from '../../interfaces/Perfil';

export interface UserRepository {
  getProfile(userId: string): Promise<{ data?: Perfil; error?: any }>;
  updateProfile(userId: string, data: Partial<Pick<Perfil, 'nombre_completo' | 'avatar_url' | 'rol' | 'id_peluqueria' | 'permisos'>>): Promise<{ error?: any }>;
  uploadAvatar(userId: string, file: File): Promise<{ data?: string; error?: any }>;
  isEmailTaken(email: string): Promise<boolean>;
  register(data: RegisterData): Promise<{ error?: any }>;
}
