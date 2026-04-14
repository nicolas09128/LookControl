import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const location                            = useLocation();

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);

  const headerClass = `site-header transition-all duration-300 ${
    isLandingPage && !scrolled ? 'header-transparent' : 'header-solid'
  }`;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `header-nav-link${isActive ? ' active' : ''}`;

 return (
  <>
    <header className={headerClass}>
      <div className="header-inner">
        {/* GRUPO IZQUIERDA: Logo + Enlaces */}
        <div className="header-left">
          <Link to="/" className="header-logo-container no-underline">
            <div className="logo-icon">
              <Scissors className="text-[#38BDF8]" size={20} />
            </div>
            <span className="logo-text">LookControl</span>
          </Link>

          <nav className="header-nav">
            <NavLink to="/nosotros" className={navLinkClass}>Nosotros</NavLink>
            <NavLink to="/precios" className={navLinkClass}>Precios</NavLink>
          </nav>
        </div>

        {/* GRUPO DERECHA: Botones / Hamburguesa */}
        <div className="header-actions-wrapper">
          <div className="header-actions">
            <Link to="/login" className="header-btn-ghost no-underline">Iniciar Sesión</Link>
            <Link to="/register" className="header-btn-primary no-underline">Empezar gratis</Link>
          </div>

          <button 
            className="header-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

    {/* Menú Móvil Desplegable */}
    {mobileMenuOpen && (
      <div className="mobile-menu-dropdown">
        <NavLink to="/nosotros" className="mobile-nav-link">Nosotros</NavLink>
        <NavLink to="/precios" className="mobile-nav-link">Precios</NavLink>
        <div className="mobile-divider" />
        <Link to="/login" className="mobile-nav-link">Iniciar Sesión</Link>
        <Link to="/register" className="mobile-nav-link-primary">Empezar gratis</Link>
      </div>
    )}
  </>
);
}
