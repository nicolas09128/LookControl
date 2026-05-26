import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Mail, Scissors, X } from 'lucide-react';

const productLinks = [
  { label: 'Servicios', to: '/nosotros' },
  { label: 'Preguntas frecuentes', to: '/faq' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Registrarse', to: '/register' },
  { label: 'Iniciar sesion', to: '/login' },
];

const appLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Productos', to: '/productos' },
  { label: 'Compras', to: '/compras' },
  { label: 'Proveedores', to: '/proveedores' },
  { label: 'Stock', to: '/stock' },
];

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div>
            <Link to="/" className="site-footer-brand">
              <div className="site-footer-logo">
                <Scissors size={16} color="#0F172A" />
              </div>
              <span className="site-footer-brand-text">LookControl</span>
            </Link>
            <p className="site-footer-description">
              Gestion integral para peluquerias. Stock, compras y proveedores en un solo lugar.
            </p>
          </div>

          <FooterColumn title="Producto" links={productLinks} />
          <FooterColumn title="Modulos" links={appLinks} />

          <div>
            <p className="site-footer-title">Contacto</p>
            <div className="site-footer-contact">
              <a href="mailto:contactolookcontrol@gmail.com" className="site-footer-link site-footer-link-icon">
                <Mail size={14} /> contactolookcontrol@gmail.com
              </a>
              <a
                href="https://github.com/nicolas09128/LookControl"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-link site-footer-link-icon"
              >
                <Github size={14} /> GitHub <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-copy">
            2026 LookControl - Desarrollado por <span>Nicolas Casablanca</span> - 2 DAW
          </p>
          <div className="site-footer-legal">
            <button type="button" onClick={() => setShowPrivacy(true)} className="site-footer-privacy-btn">
              Politica de privacidad
            </button>
            <button type="button" onClick={() => setShowCookies(true)} className="site-footer-privacy-btn">
              Cookies
            </button>
            <span className="site-footer-status-dot" />
            <span className="site-footer-status-text">Todos los sistemas operativos</span>
          </div>
        </div>
      </div>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showCookies && <CookiesModal onClose={() => setShowCookies(false)} />}
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="site-footer-title">{title}</p>
      <ul className="site-footer-list">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className="site-footer-link">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="privacy-title" className="privacy-modal">
      <div onClick={onClose} className="privacy-modal-backdrop" />
      <div className="privacy-modal-panel">
        <button type="button" aria-label="Cerrar politica de privacidad" onClick={onClose} className="privacy-modal-close">
          <X size={16} />
        </button>
        <h2 id="privacy-title" className="privacy-modal-title">Politica de privacidad</h2>
        <div className="privacy-modal-content">
          <p>
            LookControl utiliza los datos que introduces solo para prestar el servicio: gestionar usuarios,
            peluquerias, productos, compras, proveedores, stock y servicios.
          </p>
          <p>
            No vendemos tus datos ni los cedemos a terceros con fines comerciales. El acceso queda limitado a las
            funcionalidades necesarias de la aplicacion y a los proveedores tecnicos imprescindibles para alojarla y
            mantenerla.
          </p>
          <p>
            Puedes solicitar la revision, correccion o eliminacion de tus datos escribiendo a contactolookcontrol@gmail.com.
            Conservaremos la informacion necesaria para mantener la trazabilidad del negocio y cumplir obligaciones
            legales cuando aplique.
          </p>
          <p>Recomendamos no introducir datos sensibles que no sean necesarios para la gestion diaria del salon.</p>
        </div>
      </div>
    </div>
  );
}

function CookiesModal({ onClose }: { onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cookies-title" className="privacy-modal">
      <div onClick={onClose} className="privacy-modal-backdrop" />
      <div className="privacy-modal-panel">
        <button type="button" aria-label="Cerrar politica de cookies" onClick={onClose} className="privacy-modal-close">
          <X size={16} />
        </button>
        <h2 id="cookies-title" className="privacy-modal-title">Cookies</h2>
        <div className="privacy-modal-content">
          <p>
            Este sitio web puede utilizar cookies técnicas (pequeños archivos de información que el servidor envía al
            ordenador de quien accede a la página) para llevar a cabo determinadas funciones que son consideradas
            imprescindibles para el correcto funcionamiento y visualización del sitio. Las cookies utilizadas tienen, en
            todo caso, carácter temporal, con la única finalidad de hacer más eficaz la navegación, y desaparecen al
            terminar la sesión del usuario. En ningún caso, estas cookies proporcionan por sí mismas datos de carácter
            personal y no se utilizarán para la recogida de los mismos.
          </p>
          <p>
            Mediante el uso de cookies también es posible que el servidor donde se encuentra la web reconozca el
            navegador utilizado por el usuario con la finalidad de que la navegación sea más sencilla, permitiendo, por
            ejemplo, el acceso de los usuarios que se hayan registrado previamente a las áreas, servicios, promociones o
            concursos reservados exclusivamente a ellos sin tener que registrarse en cada visita.
          </p>
          <p>
            También se pueden utilizar para medir la audiencia, parámetros de tráfico, controlar el progreso y número de
            entradas, etc., siendo en estos casos cookies prescindibles técnicamente, pero beneficiosas para el usuario.
            Este sitio web no instalará cookies prescindibles sin el consentimiento previo del usuario.
          </p>
          <p>
            El usuario tiene la posibilidad de configurar su navegador para ser alertado de la recepción de cookies y
            para impedir su instalación en su equipo. Por favor, consulte las instrucciones de su navegador para ampliar
            esta información.
          </p>
        </div>
      </div>
    </div>
  );
}
