import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <Header />
      {/*
        Espaciador que compensa el header fixed.
        Usa la misma CSS variable --header-height definida en Header.css:
        64px en móvil, 72px en md+.
      */}
      <div style={{ height: 'var(--header-height)', flexShrink: 0 }} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
