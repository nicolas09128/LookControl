import { Link } from 'react-router-dom';
import { Package, TrendingUp, ShoppingCart, Scissors, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const FEATURES = [
  { icon: Package,      title: 'Inventario en tiempo real',  desc: 'Control total del stock con alertas automáticas de productos bajo mínimo.' },
  { icon: TrendingUp,   title: 'Trazabilidad completa',      desc: 'Historial de cada movimiento: quién, qué cantidad y cuándo.' },
  { icon: ShoppingCart, title: 'Gestión de compras',         desc: 'Registra pedidos, productos y proveedores en un solo flujo.' },
  { icon: Scissors,     title: 'Registro de servicios',      desc: 'Vincula los productos consumidos a cada servicio realizado.' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const ctaTo   = isAuthenticated ? '/dashboard' : '/register';
  const ctaText = isAuthenticated ? 'Ir al panel' : 'Empezar gratis';

  return (
    <div>
      {/* ── Hero ── */}
<section 
        className="landing-hero" 
        style={{ 
          position: 'relative', 
          backgroundColor: '#0F172A' // Aplicamos el color base aquí
        }}
      >
        {/* Contenedor de la animación con z-index negativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0, // Encima del background pero debajo del contenido
          opacity: 0.8
        }}>
          <DotLottieReact
            src="https://lottie.host/c634b193-5adb-42ef-b1eb-c7bc466b1066/sq8NAkmeoz.lottie"
            loop
            autoplay
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>

        {/* El contenido con z-index mayor para estar al frente */}
        <div className="landing-hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <span className="landing-badge">Gestión integral para peluquerías</span>
          <h1 className="landing-title">
            Deja de gestionar con{' '}
            <span className="landing-title-highlight">papel y hojas de cálculo</span>
          </h1>
          <p className="landing-description">
            LookControl centraliza tu inventario, compras y proveedores en una sola herramienta.
            Enfócate en tu trabajo, no en la administración.
          </p>
          <div className="landing-buttons">
            <Link to={ctaTo} className="landing-btn-primary">{ctaText} <ArrowRight size={18} /></Link>
            {!isAuthenticated && <Link to="/login" className="landing-btn-ghost">Ya tengo cuenta</Link>}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <div className="landing-features-container">
          <div className="landing-features-header">
            <p className="landing-section-title">Características</p>
            <h2 className="landing-section-heading">Todo lo que necesitas, nada de lo que no</h2>
          </div>
          <div className="landing-features-grid">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="landing-feature-card">
                <div className="landing-feature-icon"><Icon size={24} /></div>
                <h3 className="landing-feature-title">{title}</h3>
                <p className="landing-feature-description">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="landing-cta">
        <div className="landing-cta-container">
          <h2 className="landing-cta-title">¿Listo para tomar el control?</h2>
          <p className="landing-cta-description">
            Únete a LookControl y empieza a gestionar tu peluquería de forma profesional hoy mismo.
          </p>
          <Link to={ctaTo} className="landing-cta-button">{ctaText} <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
