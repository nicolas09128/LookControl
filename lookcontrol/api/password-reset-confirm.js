import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.');
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const hashCode = (email, code) =>
  crypto
    .createHmac('sha256', process.env.PASSWORD_RESET_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update(`${email.toLowerCase()}:${code}`)
    .digest('hex');

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code ?? '').replace(/\s/g, '');
  const password = String(req.body?.password ?? '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Introduce un email valido.' });
  }

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Introduce el codigo de 6 digitos.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'La contrasena debe tener al menos 8 caracteres.' });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();
    const { data: resetCode, error: codeError } = await supabaseAdmin
      .from('password_reset_codes')
      .select('id, code_hash, attempts, expires_at')
      .eq('email', email)
      .is('used_at', null)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (codeError) {
      throw codeError;
    }

    if (!resetCode) {
      return res.status(400).json({ error: 'El codigo ha caducado. Solicita uno nuevo.' });
    }

    const expectedHash = hashCode(email, code);
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedHash, 'hex'),
      Buffer.from(resetCode.code_hash, 'hex'),
    );

    if (!isValid) {
      const attempts = Number(resetCode.attempts ?? 0) + 1;
      await supabaseAdmin
        .from('password_reset_codes')
        .update({ attempts, used_at: attempts >= 5 ? now : null })
        .eq('id', resetCode.id);

      return res.status(400).json({ error: 'Codigo incorrecto.' });
    }

    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (perfilError) {
      throw perfilError;
    }

    if (!perfil?.user_id) {
      return res.status(400).json({ error: 'No existe una cuenta con ese email.' });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(perfil.user_id, {
      password,
    });

    if (updateError) {
      throw updateError;
    }

    await supabaseAdmin
      .from('password_reset_codes')
      .update({ used_at: now })
      .eq('id', resetCode.id);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        error instanceof Error && error.message.includes('SUPABASE_SERVICE_ROLE_KEY')
          ? error.message
          : 'No se pudo cambiar la contrasena.',
    });
  }
}
