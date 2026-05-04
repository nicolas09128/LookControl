import { supabase } from './Client';

export const AVATAR_BUCKET = 'Imagenes';
export const MAX_AVATAR_UPLOAD_SIZE = 2 * 1024 * 1024;

export const DEFAULT_AVATARS = [
  {
    id: 'barber-man',
    name: 'Peluquero',
    path: 'hombre-peluquero.png',
  },
  {
    id: 'barber-woman',
    name: 'Peluquera',
    path: 'mujer-peluquera-sin-marco.png',
  },
] as const;

export type DefaultAvatarPath = (typeof DEFAULT_AVATARS)[number]['path'];

export function getAvatarPublicUrl(path: string): string {
  return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function getAvatarDisplayUrl(path: string): Promise<string> {
  const isDefaultAvatar = DEFAULT_AVATARS.some((avatar) => avatar.path === path);

  if (isDefaultAvatar) {
    const { data } = await supabase.storage.from(AVATAR_BUCKET).download(path);
    if (data) return URL.createObjectURL(data);

    return getAvatarPublicUrl(path);
  }

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (data?.signedUrl && !error) {
    const signedUrl = new URL(data.signedUrl);
    if (signedUrl.searchParams.has('token')) return data.signedUrl;
  }

  return getAvatarPublicUrl(path);
}
