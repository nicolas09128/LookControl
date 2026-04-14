import { Link } from 'react-router-dom';
import { Scissors, Github, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Servicios',     to: '/nosotros'  },
  { label: 'Precios',       to: '/precios'   },
  { label: 'Registrarse',   to: '/register'  },
  { label: 'Iniciar sesión', to: '/login'    },
];

const APP_LINKS = [
  { label: 'Dashboard',   to: '/dashboard'   },
  { label: 'Productos',   to: '/productos'   },
  { label: 'Compras',     to: '/compras'     },
  { label: 'Proveedores', to: '/proveedores' },
  { label: 'Stock',       to: '/stock'       },
];

export default function Footer() {
  return (
    <footer style={{ background: '#080F1C', borderTop: '1px solid #1E293B' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 0' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '40px', paddingBottom: '48px' }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Scissors size={16} color="#0F172A" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '17px', color: '#F1F5F9', letterSpacing: '-0.02em' }}>
                LookControl
              </span>
            </Link>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.7', maxWidth: '210px', margin: '0 0 16px' }}>
              Gestión integral para peluquerías. Stock, compras y proveedores en un solo lugar.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '12px' }}>
              <MapPin size={12} />
              <span>IES Albarregas · Mérida</span>
            </div>
          </div>

          {/* Producto */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: '16px', margin: '0 0 16px' }}>
              Producto
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PRODUCT_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Módulos */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', margin: '0 0 16px' }}>
              Módulos
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {APP_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', margin: '0 0 16px' }}>
              Contacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="mailto:contacto@lookcontrol.app"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <Mail size={14} /> contacto@lookcontrol.app
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <Github size={14} /> GitHub <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1E293B', padding: '20px 0',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
            © 2026 LookControl · Desarrollado por{' '}
            <span style={{ color: '#64748B', fontWeight: 500 }}>Nicolás Casablanca</span>
            {' '}· 2.º DAW
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: '#475569' }}>Todos los sistemas operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
