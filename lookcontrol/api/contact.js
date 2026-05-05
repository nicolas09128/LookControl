import net from 'node:net';
import tls from 'node:tls';

const CONTACT_REASONS = {
  support: 'Soporte',
  other: 'Otro',
};

const CONTACT_EMAIL = 'contactolookcontrol@gmail.com';

const escapeHeader = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();

const normalizeBody = (value) =>
  String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => (line.startsWith('.') ? `.${line}` : line))
    .join('\r\n');

const makeMessageId = () => `<${Date.now()}.${Math.random().toString(36).slice(2)}@lookcontrol.local>`;

function createSmtpClient(socket) {
  let buffer = '';

  socket.setEncoding('utf8');

  const readResponse = () =>
    new Promise((resolve, reject) => {
      const onData = (chunk) => {
        buffer += chunk;
        const lines = buffer.split(/\r?\n/);
        const completeIndex = lines.findIndex((line) => /^\d{3} /.test(line));

        if (completeIndex === -1) {
          return;
        }

        const responseLines = lines.slice(0, completeIndex + 1);
        buffer = lines.slice(completeIndex + 1).join('\n');
        socket.off('data', onData);
        socket.off('error', onError);
        resolve(responseLines.join('\n'));
      };

      const onError = (error) => {
        socket.off('data', onData);
        reject(error);
      };

      socket.on('data', onData);
      socket.once('error', onError);
    });

  const command = async (line, expectedCode, label = line.split(' ')[0]) => {
    socket.write(`${line}\r\n`);
    const response = await readResponse();

    if (!response.startsWith(String(expectedCode))) {
      throw new Error(`SMTP error after ${label}: ${response}`);
    }

    return response;
  };

  return { command, readResponse };
}

const connectSmtp = ({ host, port, secure }) =>
  new Promise((resolve, reject) => {
    const socket = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });

    socket.setTimeout(15000);
    socket.once(secure ? 'secureConnect' : 'connect', () => resolve(socket));
    socket.once('timeout', () => reject(new Error('SMTP connection timed out')));
    socket.once('error', reject);
  });

export async function sendMail({ from, to, replyTo, subject, text }) {
  const host = process.env.SMTP_HOST ?? 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER ?? CONTACT_EMAIL;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE ?? 'true') !== 'false';

  if (!pass) {
    throw new Error('Falta configurar SMTP_PASS con la contrasena de aplicacion de Gmail.');
  }

  let socket = await connectSmtp({ host, port, secure });
  let client = createSmtpClient(socket);

  await client.readResponse();
  await client.command(`EHLO ${process.env.SMTP_HELO ?? 'lookcontrol.app'}`, 250);

  if (!secure) {
    await client.command('STARTTLS', 220);
    socket = tls.connect({ socket, servername: host });
    client = createSmtpClient(socket);
    await client.command(`EHLO ${process.env.SMTP_HELO ?? 'lookcontrol.app'}`, 250);
  }

  await client.command('AUTH LOGIN', 334);
  await client.command(Buffer.from(user).toString('base64'), 334, 'SMTP_USER');
  await client.command(Buffer.from(pass.replace(/\s/g, '')).toString('base64'), 235, 'SMTP_PASS');
  await client.command(`MAIL FROM:<${from}>`, 250);
  await client.command(`RCPT TO:<${to}>`, 250);
  await client.command('DATA', 354);

  socket.write(
    [
      `From: LookControl <${from}>`,
      `To: ${to}`,
      `Reply-To: ${escapeHeader(replyTo)}`,
      `Subject: ${escapeHeader(subject)}`,
      `Message-ID: ${makeMessageId()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      normalizeBody(text),
      '.',
      '',
    ].join('\r\n'),
  );

  const dataResponse = await client.readResponse();
  if (!dataResponse.startsWith('250')) {
    throw new Error(`SMTP error after DATA: ${dataResponse}`);
  }

  await client.command('QUIT', 221).catch(() => undefined);
  socket.end();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = escapeHeader(req.body?.name);
  const email = escapeHeader(req.body?.email);
  const reason = escapeHeader(req.body?.reason);
  const message = String(req.body?.message ?? '').trim();
  const reasonLabel = CONTACT_REASONS[reason] ?? CONTACT_REASONS.other;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Rellena nombre, email y mensaje.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Introduce un email valido.' });
  }

  try {
    const to = process.env.CONTACT_TO_EMAIL ?? CONTACT_EMAIL;
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? CONTACT_EMAIL;
    const subject = `Nuevo contacto LookControl: ${reasonLabel}`;
    const text = [
      'Nuevo mensaje desde el formulario de LookControl.',
      '',
      `Nombre: ${name}`,
      `Email: ${email}`,
      `Motivo: ${reasonLabel}`,
      '',
      'Mensaje:',
      message,
    ].join('\n');

    await sendMail({ from, to, replyTo: email, subject, text });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : '';

    return res.status(500).json({
      error:
        errorMessage.includes('535-5.7.8') || errorMessage.includes('BadCredentials')
          ? 'Gmail no acepta el usuario o la contrasena de aplicacion. Revisa que SMTP_PASS sea una contrasena de aplicacion de 16 caracteres.'
          : errorMessage.includes('SMTP_PASS')
          ? errorMessage
          : errorMessage.includes('configurado')
          ? errorMessage
          : 'No se pudo enviar el mensaje. Intentalo de nuevo mas tarde.',
    });
  }
}
