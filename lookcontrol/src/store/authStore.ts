import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Perfil, RegisterData } from '../interfaces/Perfil';
import { supabase } from '../database/supabase/Client';
import { createUserRepository } from '../database/repositories';
import { getAvatarDisplayUrl, type DefaultAvatarPath } from '../database/supabase/avatarStorage';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ─── State interface ──────────────────────────────────────────────────────────

interface AuthState {
  perfil: Perfil | null;
  isAuthenticated: boolean;
  loading: boolean;

  setPerfil: (perfil: Perfil) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
  initSession: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  updateNombre: (nombre: string) => Promise<{ error?: string }>;
  sendPasswordRecovery: () => Promise<{ error?: string }>;
  uploadAvatar: (file: File) => Promise<{ error?: string }>;
  selectDefaultAvatar: (path: DefaultAvatarPath) => Promise<{ error?: string }>;
  setupOwnerPeluqueria: () => Promise<{ error?: string }>;
  linkEmployeePeluqueria: (code: string) => Promise<{ error?: string }>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      perfil: null,
      isAuthenticated: false,
      loading: true,

      setPerfil: (perfil) => set({ perfil, isAuthenticated: true, loading: false }),

      clearSession: () => set({ perfil: null, isAuthenticated: false, loading: false }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ perfil: null, isAuthenticated: false, loading: false });
      },

      initSession: async () => {
        set({ loading: true });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          set({ perfil: null, isAuthenticated: false, loading: false });
          return;
        }

        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select('*, peluqueria:peluquerias(nombre, codigo_invitacion)')
          .eq('user_id', session.user.id)
          .single();

        if (error || !perfil) {
          set({ perfil: null, isAuthenticated: false, loading: false });
          return;
        }

        const perfilData = perfil as Perfil & {
          peluqueria?: { nombre?: string; codigo_invitacion?: string };
        };

        const avatarPath = typeof session.user.user_metadata?.avatar_path === 'string'
          ? session.user.user_metadata.avatar_path
          : null;
        const metadataAvatarUrl = typeof session.user.user_metadata?.avatar_url === 'string'
          && !session.user.user_metadata.avatar_url.startsWith('data:image/')
          ? session.user.user_metadata.avatar_url
          : null;
        const avatarUrl = avatarPath
          ? await getAvatarDisplayUrl(avatarPath)
          : metadataAvatarUrl;

        const perfilFinal: Perfil = {
          ...perfilData,
          nombre_peluqueria: perfilData.peluqueria?.nombre ?? perfilData.nombre_peluqueria,
          codigo_invitacion: perfilData.peluqueria?.codigo_invitacion ?? perfilData.codigo_invitacion,
          avatar_url: avatarUrl,
          avatar_path: avatarPath,
        };

        set({ perfil: perfilFinal, isAuthenticated: true, loading: false });

        // Auto-setup para dueños sin peluquería enlazada
        if (perfilFinal.rol === 'admin' && !perfilFinal.id_peluqueria) {
          await get().setupOwnerPeluqueria();
        }
      },

      register: async (data: RegisterData) => {
        const repo = createUserRepository();
        const { error } = await repo.register(data);
        if (error) return { error: error.message ?? 'Error al registrar' };
        return {};
      },

      setupOwnerPeluqueria: async () => {
        const { perfil } = get();
        if (!perfil) return { error: 'No hay sesión activa' };
        if (perfil.rol !== 'admin') return { error: 'Solo los dueños pueden usar esta acción' };
        if (perfil.id_peluqueria) return {}; // Idempotente

        const nombrePeluqueria = perfil.nombre_peluqueria?.trim();
        if (!nombrePeluqueria) return { error: 'El perfil no tiene nombre de peluquería guardado' };

        // Generar código único (reintento si colisiona)
        let codigoInvitacion = generateInviteCode();
        const { data: existing } = await supabase
          .from('peluquerias')
          .select('id_peluqueria')
          .eq('codigo_invitacion', codigoInvitacion)
          .maybeSingle();
        if (existing) codigoInvitacion = generateInviteCode();

        const { data: nuevaPeluqueria, error: insertError } = await supabase
          .from('peluquerias')
          .insert({ nombre: nombrePeluqueria, codigo_invitacion: codigoInvitacion, activo: true })
          .select('id_peluqueria, nombre, codigo_invitacion')
          .single();

        if (insertError || !nuevaPeluqueria) {
          return { error: insertError?.message ?? 'Error al crear la peluquería' };
        }

        const { error: updateError } = await supabase
          .from('perfiles')
          .update({ id_peluqueria: nuevaPeluqueria.id_peluqueria })
          .eq('user_id', perfil.user_id);

        if (updateError) return { error: updateError.message };

        set({
          perfil: {
            ...perfil,
            id_peluqueria: nuevaPeluqueria.id_peluqueria,
            nombre_peluqueria: nuevaPeluqueria.nombre,
            codigo_invitacion: nuevaPeluqueria.codigo_invitacion,
          },
        });

        return {};
      },

      linkEmployeePeluqueria: async (code: string) => {
        const { perfil } = get();
        if (!perfil) return { error: 'No hay sesión activa' };

        const trimmedCode = code.trim().toUpperCase();
        if (!trimmedCode) return { error: 'Introduce un código válido' };

        const { data: salon, error: salonError } = await supabase
          .from('peluquerias')
          .select('id_peluqueria, nombre, codigo_invitacion')
          .eq('codigo_invitacion', trimmedCode)
          .eq('activo', true)
          .single();

        if (salonError || !salon) {
          return { error: 'Código inválido o peluquería no encontrada' };
        }

        const { error: updateError } = await supabase
          .from('perfiles')
          .update({ id_peluqueria: salon.id_peluqueria, rol: 'empleado' })
          .eq('user_id', perfil.user_id);

        if (updateError) {
          return { error: 'No se pudo vincular la cuenta. Inténtalo de nuevo' };
        }

        set({
          perfil: {
            ...perfil,
            id_peluqueria: salon.id_peluqueria,
            nombre_peluqueria: salon.nombre,
            codigo_invitacion: salon.codigo_invitacion,
            rol: 'empleado',
          },
        });

        return {};
      },

      updateNombre: async (nombre: string) => {
        const { perfil } = get();
        if (!perfil) return { error: 'No hay sesión activa' };

        const repo = createUserRepository();
        const { error } = await repo.updateProfile(perfil.user_id, { nombre_completo: nombre });
        if (error) return { error: error.message };

        set({ perfil: { ...perfil, nombre_completo: nombre } });
        return {};
      },

      sendPasswordRecovery: async () => {
        const { perfil } = get();
        if (!perfil) return { error: 'No hay sesión activa' };

        const { error } = await supabase.auth.resetPasswordForEmail(perfil.email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) return { error: error.message };
        return {};
      },

      uploadAvatar: async (file: File) => {
        const { perfil } = get();
        if (!perfil) return { error: 'No hay sesión activa' };

        const repo = createUserRepository();
        const { data: avatarUrl, error } = await repo.uploadAvatar(perfil.user_id, file);
        if (error) return { error: error.message };

        set({ perfil: { ...perfil, avatar_url: avatarUrl! } });
        return {};
      },

      selectDefaultAvatar: async (path: DefaultAvatarPath) => {
        const { perfil } = get();
        if (!perfil) return { error: 'No hay sesión activa' };

        const repo = createUserRepository();
        const { data: avatarUrl, error } = await repo.selectDefaultAvatar(perfil.user_id, path);
        if (error) return { error: error.message };

        set({ perfil: { ...perfil, avatar_url: avatarUrl!, avatar_path: path } });
        return {};
      },
    }),
    {
      name: 'lookcontrol-auth-v1',
      version: 1,
      partialize: (state) => ({
        perfil: state.perfil,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
