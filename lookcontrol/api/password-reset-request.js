import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { sendMail } from './contact.js';

const CONTACT_EMAIL = 'contactolookcontrol@gmail.com';
const DEFAULT_RESEND_FROM = 'LookControl <onboarding@resend.dev>';

const getJwtRole = (token) => {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
    return decoded.role;
  } catch {
    return null;
  }
};

const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.');
  }

  if (getJwtRole(serviceRoleKey) !== 'service_role') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no es valida: has puesto la anon key en vez de la service_role key.');
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

async function sendRecoveryCodeEmail({ to, code }) {
  const subject = 'Codigo de recuperacion LookControl';
  const text = [
    'Has solicitado cambiar tu contrasena de LookControl.',
    '',
    `Tu codigo de recuperacion es: ${code}`,
    '',
    'Este codigo caduca en 15 minutos.',
    'Si no has pedido este cambio, puedes ignorar este correo.',
  ].join('\n');

  if (process.env.RESEND_API_KEY) {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_RESEND_FROM,
        to,
        subject,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      throw new Error(`RESEND_ERROR ${resendResponse.status}: ${details.slice(0, 500)}`);
    }

    return;
  }

  await sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? CONTACT_EMAIL,
    to,
    replyTo: CONTACT_EMAIL,
    subject,
    text,
  });
}

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
      .ilike('email', email)
      .maybeSingle();

    if (perfilError) {
      throw perfilError;
    }

    if (!perfil) {
      console.warn(`Solicitud de restablecimiento de contraseña: no se encontró el email ${email} en perfiles`);
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

    await sendRecoveryCodeEmail({ to: email, code });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: getPublicErrorMessage(error),
    });
  }
}

function getPublicErrorMessage(error) {
  const message = error instanceof Error ? error.message : '';

  if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    return message;
  }

  if (message.includes('password_reset_codes')) {
    return 'No existe la tabla password_reset_codes en Supabase o no esta accesible.';
  }

  if (message.includes('SMTP_PASS') || message.includes('SMTP_USER')) {
    return message;
  }

  if (message.includes('535-5.7.8') || message.includes('BadCredentials')) {
    return 'Gmail no acepta SMTP_USER o SMTP_PASS. Revisa la contrasena de aplicacion.';
  }

  if (message.includes('SMTP error') || message.includes('SMTP connection')) {
    return 'No se pudo enviar el email por SMTP. Revisa SMTP_HOST, SMTP_PORT, SMTP_USER y SMTP_PASS.';
  }

  if (message.includes('RESEND_ERROR')) {
    return message;
  }

  return 'No se pudo enviar el codigo de recuperacion.';
}
