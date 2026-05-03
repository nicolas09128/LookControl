import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Github, Mail, ArrowUpRight, X } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Servicios', to: '/nosotros' },
  { label: 'Preguntas frecuentes', to: '/faq' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Registrarse', to: '/register' },
  { label: 'Iniciar sesión', to: '/login' },
];

const APP_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Productos', to: '/productos' },
  { label: 'Compras', to: '/compras' },
  { label: 'Proveedores', to: '/proveedores' },
  { label: 'Stock', to: '/stock' },
];

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer style={{ background: '#080F1C', borderTop: '1px solid #1E293B' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '40px', paddingBottom: '48px' }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Scissors size={16} color="#0F172A" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '17px', color: '#F1F5F9', letterSpacing: 0 }}>
                LookControl
              </span>
            </Link>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.7', maxWidth: '210px', margin: '0 0 16px' }}>
              Gestión integral para peluquerías. Stock, compras y proveedores en un solo lugar.
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', margin: '0 0 16px' }}>
              Producto
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PRODUCT_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', margin: '0 0 16px' }}>
              Módulos
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {APP_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', margin: '0 0 16px' }}>
              Contacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="mailto:contacto@lookcontrol.app"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <Mail size={14} /> contacto@lookcontrol.app
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <Github size={14} /> GitHub <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1E293B', padding: '20px 0',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
            © 2026 LookControl - Desarrollado por{' '}
            <span style={{ color: '#64748B', fontWeight: 500 }}>Nicolás Casablanca</span>
            {' '}- 2.º DAW
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              style={{ border: 0, background: 'transparent', color: '#94A3B8', cursor: 'pointer', fontSize: '12px', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
            >
              Política de privacidad
            </button>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: '#475569' }}>Todos los sistemas operativos</span>
          </div>
        </div>
      </div>

      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'rgba(2, 6, 23, 0.72)',
          }}
        >
          <div onClick={() => setShowPrivacy(false)} style={{ position: 'absolute', inset: 0 }} />
          <div
            style={{
              position: 'relative',
              width: 'min(560px, 100%)',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: '16px',
              border: '1px solid #1E293B',
              background: '#0F172A',
              color: '#CBD5E1',
              padding: '28px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
            }}
          >
            <button
              type="button"
              aria-label="Cerrar política de privacidad"
              onClick={() => setShowPrivacy(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: 'transparent',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
            <h2 id="privacy-title" style={{ margin: '0 40px 14px 0', color: '#F8FAFC', fontSize: '22px' }}>
              Política de privacidad
            </h2>
            <div style={{ display: 'grid', gap: '14px', fontSize: '14px', lineHeight: 1.7 }}>
              <p style={{ margin: 0 }}>
                LookControl utiliza los datos que introduces solo para prestar el servicio: gestionar usuarios, peluquerías, productos, compras, proveedores, stock y servicios.
              </p>
              <p style={{ margin: 0 }}>
                No vendemos tus datos ni los cedemos a terceros con fines comerciales. El acceso queda limitado a las funcionalidades necesarias de la aplicación y a los proveedores técnicos imprescindibles para alojarla y mantenerla.
              </p>
              <p style={{ margin: 0 }}>
                Puedes solicitar la revisión, corrección o eliminación de tus datos escribiendo a contacto@lookcontrol.app. Conservaremos la información necesaria para mantener la trazabilidad del negocio y cumplir obligaciones legales cuando aplique.
              </p>
              <p style={{ margin: 0 }}>
                Recomendamos no introducir datos sensibles que no sean necesarios para la gestión diaria del salón.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
