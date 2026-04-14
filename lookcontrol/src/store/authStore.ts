import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Perfil, RegisterData } from '../interfaces/Perfil';
import { supabase } from '../database/supabase/Client';
import { createUserRepository } from '../database/repositories';

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
}

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

        set({
          perfil: {
            ...perfilData,
            nombre_peluqueria: perfilData.peluqueria?.nombre ?? perfilData.nombre_peluqueria,
            codigo_invitacion: perfilData.peluqueria?.codigo_invitacion ?? perfilData.codigo_invitacion,
          } as Perfil,
          isAuthenticated: true,
          loading: false,
        });
      },

      register: async (data: RegisterData) => {
        const repo = createUserRepository();
        // isEmailTaken() NO se llama aquí: RLS bloquea SELECT en perfiles
        // para usuarios anónimos → siempre devolvía false → 400 en signUp.
        // Supabase Auth ya gestiona duplicados y devuelve el error apropiado.
        const { error } = await repo.register(data);
        if (error) return { error: error.message ?? 'Error al registrar' };
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
