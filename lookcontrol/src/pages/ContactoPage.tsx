import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
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
              Mensaje preparado correctamente. Te responderemos lo antes posible.
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
              <select name="reason" defaultValue="demo">
                <option value="demo">Quiero una demo</option>
                <option value="plan">Dudas sobre planes</option>
                <option value="support">Soporte</option>
                <option value="other">Otro</option>
              </select>
            </label>
            <label>
              Mensaje
              <textarea name="message" rows={5} placeholder="Cuéntanos brevemente qué necesitas..." required />
            </label>
            <button type="submit">
              <Send size={16} />
              Enviar mensaje
            </button>
          </form>
        </div>

        <aside className="contact-side">
          <div className="contact-card">
            <Mail size={20} />
            <div>
              <span>Email</span>
              <a href="mailto:contacto@lookcontrol.app">contacto@lookcontrol.app</a>
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
