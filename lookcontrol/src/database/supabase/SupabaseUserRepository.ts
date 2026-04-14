import type { Perfil, RegisterData } from '../../interfaces/Perfil';
import type { UserRepository } from '../repositories/UserRepository';
import { supabase } from './Client';

// Mapa de mensajes de error de Supabase Auth → español
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'User already registered':           'El email ya está registrado.',
  'Email not confirmed':               'Debes confirmar tu email antes de iniciar sesión.',
  'Invalid login credentials':         'Email o contraseña incorrectos.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Email rate limit exceeded':         'Demasiados intentos. Inténtalo más tarde.',
  'Signup requires a valid password':  'La contraseña no es válida.',
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
    const ext = file.name.split('.').pop();
    const path = `avatars/${userId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) return { error: uploadError };

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

    await this.updateProfile(userId, { avatar_url: avatarUrl });
    return { data: avatarUrl };
  }

  /**
   * isEmailTaken NO se usa en el flujo de registro.
   * Un usuario anónimo no tiene policy SELECT sobre perfiles (RLS),
   * así que este método solo es válido para llamadas autenticadas (admin).
   */
  async isEmailTaken(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('perfiles').select('id_perfil').eq('email', email).maybeSingle();
    return !!data;
  }

  async register(input: RegisterData): Promise<{ error?: any }> {
    const { error } = await supabase.auth.signUp({
      email:    input.email,
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
