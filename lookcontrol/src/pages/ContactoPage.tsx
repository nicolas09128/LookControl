import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSent(false);
    setError('');
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          reason: formData.get('reason'),
          message: formData.get('message'),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? 'No se pudo enviar el mensaje.');
      }

      setSent(true);
      form.reset();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'No se pudo enviar el mensaje.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="info-page">
      <section className="info-hero">
        <p className="info-kicker">Contacto</p>
        <h1>Hablemos de tu peluquería</h1>
        <p>
          Cuéntanos qué necesitas y te ayudamos a elegir el flujo de trabajo que mejor encaja con tu salón.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-panel">
          <h2>Escríbenos</h2>
          <p className="contact-muted">
            El formulario deja preparado el mensaje en la página. Para contacto directo también puedes usar el email.
          </p>

          {sent && (
            <div className="contact-success">
              <CheckCircle2 size={18} />
              Mensaje enviado correctamente. Te responderemos lo antes posible.
            </div>
          )}

          {error && (
            <div className="contact-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input name="name" type="text" placeholder="Tu nombre" required />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="tu@email.com" required />
            </label>
            <label>
              Motivo
              <select name="reason" defaultValue="support">
                <option value="support">Soporte</option>
                <option value="other">Otro</option>
              </select>
            </label>
            <label>
              Mensaje
              <textarea name="message" rows={5} placeholder="Cuéntanos brevemente qué necesitas..." required />
            </label>
            <button type="submit" disabled={isSending}>
              <Send size={16} />
              {isSending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>

        <aside className="contact-side">
          <div className="contact-card">
            <Mail size={20} />
            <div>
              <span>Email</span>
              <a href="mailto:contactolookcontrol@gmail.com">contactolookcontrol@gmail.com</a>
            </div>
          </div>
          <div className="contact-card">
            <MessageSquare size={20} />
            <div>
              <span>Respuesta</span>
              <p>Normalmente contestamos en menos de 24 horas laborables.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
