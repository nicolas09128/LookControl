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
            <span className="site-footer-status-dot" />
            <span className="site-footer-status-text">Todos los sistemas operativos</span>
          </div>
        </div>
      </div>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
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

function PrivacyModal({ onClose }: { onClose: () => void }) {
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
            Puedes solicitar la revision, correccion o eliminacion de tus datos escribiendo a contacto@lookcontrol.app.
            Conservaremos la informacion necesaria para mantener la trazabilidad del negocio y cumplir obligaciones
            legales cuando aplique.
          </p>
          <p>Recomendamos no introducir datos sensibles que no sean necesarios para la gestion diaria del salon.</p>
        </div>
      </div>
    </div>
  );
}
