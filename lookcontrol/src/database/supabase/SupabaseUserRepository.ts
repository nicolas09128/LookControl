import type { Perfil, RegisterData } from '../../interfaces/Perfil';
import type { UserRepository } from '../repositories/UserRepository';
import { supabase } from './Client';
import {
  AVATAR_BUCKET,
  DEFAULT_AVATARS,
  MAX_AVATAR_UPLOAD_SIZE,
  getAvatarDisplayUrl,
  type DefaultAvatarPath,
} from './avatarStorage';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'User already registered': 'El email ya está registrado.',
  'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión.',
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Email rate limit exceeded': 'Demasiados intentos. Inténtalo más tarde.',
  'Signup requires a valid password': 'La contraseña no es válida.',
};

function parseAuthError(message: string): string {
  for (const [key, translation] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (message.includes(key)) return translation;
  }
  return message;
}

export class SupabaseUserRepository implements UserRepository {

  async getProfile(userId: string): Promise<{ data?: Perfil; error?: any }> {
    const { data, error } = await supabase
      .from('perfiles').select('*').eq('user_id', userId).single();
    if (error) return { error };
    return { data: data as Perfil };
  }

  async updateProfile(
    userId: string,
    data: Partial<Pick<Perfil, 'nombre_completo' | 'avatar_url'>>
  ): Promise<{ error?: any }> {
    const { error } = await supabase
      .from('perfiles').update(data).eq('user_id', userId);
    return { error: error ?? null };
  }

  async uploadAvatar(userId: string, file: File): Promise<{ data?: string; error?: any }> {
    if (file.size > MAX_AVATAR_UPLOAD_SIZE) {
      return { error: { message: 'La imagen no puede superar los 2 MB.' } };
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return { error: { message: 'Solo se permiten imágenes JPG, PNG o WEBP.' } };
    }

    const extensionByType: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const ext = extensionByType[file.type] ?? file.name.split('.').pop() ?? 'png';
    const path = `avatars/${userId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { error: uploadError };
    }

    const avatarUrl = await getAvatarDisplayUrl(path);

    await supabase.auth.updateUser({
      data: { avatar_url: null, avatar_path: path },
    });

    return { data: avatarUrl };
  }

  async selectDefaultAvatar(userId: string, path: DefaultAvatarPath): Promise<{ data?: string; error?: any }> {
    void userId;
    const exists = DEFAULT_AVATARS.some((avatar) => avatar.path === path);
    if (!exists) return { error: { message: 'Imagen de perfil no válida.' } };

    const avatarUrl = await getAvatarDisplayUrl(path);
    const { error } = await supabase.auth.updateUser({ data: { avatar_url: null, avatar_path: path } });
    if (error) return { error };

    return { data: avatarUrl };
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('perfiles').select('id_perfil').eq('email', email).maybeSingle();
    return !!data;
  }

  async register(input: RegisterData): Promise<{ error?: any }> {
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          nombre_completo: input.nombre_completo ?? '',
          tipo: input.tipo,
          nombre_peluqueria: input.nombre_peluqueria,
        },
      },
    });

    if (error) {
      return { error: { ...error, message: parseAuthError(error.message) } };
    }
    return {};
  }
}
