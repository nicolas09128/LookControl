import { Link } from 'react-router-dom';
import { ArrowRight, CircleHelp } from 'lucide-react';

const FAQS = [
  {
    question: '¿Para quién está pensado LookControl?',
    answer: 'Para peluquerías y salones que necesitan controlar stock, compras, proveedores y consumo de productos sin depender de hojas de cálculo.',
  },
  {
    question: '¿Qué diferencia hay entre propietario y empleado?',
    answer: 'El propietario crea el salón, administra permisos y genera el código de invitación. El empleado se registra y se vincula con ese código para trabajar dentro del salón.',
  },
  {
    question: '¿Puedo empezar gratis?',
    answer: 'Sí. El plan es gratuito permite usar el flujo principal con inventario, compras, proveedores y dashboard básico.',
  },
  {
    question: '¿El módulo de servicios está incluido en todos los planes?',
    answer: 'El módulo de servicios está pensado para salones que quieren calcular el coste real de cada trabajo registrando el consumo de productos.',
  },
  {
    question: '¿Qué pasa si elimino un producto?',
    answer: 'LookControl prioriza la trazabilidad. Las acciones importantes piden confirmación y la información relevante se conserva cuando es necesario para el historial.',
  },
  {
    question: '¿Dónde puedo pedir ayuda?',
    answer: 'Puedes escribir desde la página de contacto o, si ya has iniciado sesión, usar el asistente integrado en la aplicación.',
  },
];

export default function FAQPage() {
  return (
    <div className="info-page">
      <section className="info-hero">
        <p className="info-kicker">Preguntas frecuentes</p>
        <h1>Respuestas rápidas antes de empezar</h1>
        <p>
          Lo esencial sobre planes, roles, registro y funcionamiento de LookControl.
        </p>
      </section>

      <section className="faq-list">
        {FAQS.map(item => (
          <details className="faq-item" key={item.question}>
            <summary>
              <CircleHelp size={18} />
              <span>{item.question}</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      <section className="faq-cta">
        <h2>¿No encuentras lo que buscas?</h2>
        <p>Contacta con nosotros y te ayudamos de forma directa.</p>
        <Link to="/contacto">
          Ir a contacto <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
