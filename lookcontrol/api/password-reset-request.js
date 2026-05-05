import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { sendMail } from './contact.js';

const CONTACT_EMAIL = 'contactolookcontrol@gmail.com';

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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Introduce un email valido.' });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .select('user_id, email')
      .eq('email', email)
      .maybeSingle();

    if (perfilError) {
      throw perfilError;
    }

    if (!perfil) {
      return res.status(200).json({ ok: true });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from('password_reset_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('email', email)
      .is('used_at', null);

    const { error: insertError } = await supabaseAdmin.from('password_reset_codes').insert({
      email,
      code_hash: hashCode(email, code),
      expires_at: expiresAt,
    });

    if (insertError) {
      throw insertError;
    }

    await sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? CONTACT_EMAIL,
      to: email,
      replyTo: CONTACT_EMAIL,
      subject: 'Codigo de recuperacion LookControl',
      text: [
        'Has solicitado cambiar tu contrasena de LookControl.',
        '',
        `Tu codigo de recuperacion es: ${code}`,
        '',
        'Este codigo caduca en 15 minutos.',
        'Si no has pedido este cambio, puedes ignorar este correo.',
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        error instanceof Error && error.message.includes('SUPABASE_SERVICE_ROLE_KEY')
          ? error.message
          : 'No se pudo enviar el codigo de recuperacion.',
    });
  }
}
