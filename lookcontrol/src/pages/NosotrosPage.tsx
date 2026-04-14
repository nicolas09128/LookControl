import { Link } from 'react-router-dom';
import {
  Zap, Shield, BarChart3, Users, Clock, Package,
  CheckCircle, ArrowRight, Scissors, TrendingUp, ShoppingCart,
} from 'lucide-react';

const FEATURES = [
  { icon: Package,    title: 'Inventario en tiempo real', desc: 'Controla cada producto, su stock mínimo y recibe alertas automáticas antes de quedarte sin existencias.' },
  { icon: TrendingUp, title: 'Trazabilidad total',        desc: 'Cada movimiento queda registrado: quién lo hizo, qué producto, cuándo y por qué. Cero opacidad.' },
  { icon: ShoppingCart,'title': 'Gestión de compras',     desc: 'Pedidos, facturas y proveedores en un solo flujo. Desde el presupuesto hasta la recepción.' },
  { icon: Scissors,   title: 'Consumo por servicio',      desc: 'Registra qué productos uses en cada servicio. Sabe exactamente cuánto te cuesta cada trabajo.' },
  { icon: Users,      title: 'Multi-usuario',             desc: 'Administradores y empleados con permisos diferenciados. Cada uno ve lo que necesita.' },
  { icon: BarChart3,  title: 'Dashboard inteligente',     desc: 'Vista general del negocio: alertas de stock bajo, últimas compras y métricas clave de un vistazo.' },
];

const WHY_US = [
  { icon: Zap,    title: 'Hecho para peluquerías', desc: 'No es un software genérico adaptado. LookControl fue diseñado desde cero pensando en cómo trabajan los salones de belleza.' },
  { icon: Shield, title: 'Sin curva de aprendizaje', desc: 'Interfaz limpia, flujos directos. Tu equipo estará operativo el primer día sin formación técnica.' },
  { icon: Clock,  title: 'Ahorra tiempo real',      desc: 'Lo que antes te llevaba 30 minutos entre hojas de cálculo, ahora son 2 clics.' },
];

const DIFFERENTIATORS = [
  'Soft-delete: nada se borra definitivamente, todo es recuperable',
  'Multipeluquería: un código de invitación por local, empleados vinculados por salon',
  'Historial inmutable de movimientos de stock para auditorías',
  'Alertas de bajo stock configurables por producto',
  'Gestión de fechas de caducidad y lotes en cada compra',
  'Roles granulares: admin ve todo, empleado solo opera',
];

const s = {
  page: { background: '#0F172A', minHeight: '100vh', color: '#F1F5F9', fontFamily: 'system-ui, sans-serif' } as React.CSSProperties,
  hero: {
    padding: '96px 24px 80px',
    textAlign: 'center' as const,
    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(56,189,248,0.12) 0%, transparent 70%)',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px', borderRadius: '999px',
    background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
    fontSize: '13px', fontWeight: 500, color: '#38BDF8', marginBottom: '24px',
  },
  h1: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px', color: '#F8FAFC' },
  accent: { color: '#38BDF8' },
  subtitle: { fontSize: '18px', color: '#94A3B8', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.6 },
  section: { maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' },
  sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#38BDF8', marginBottom: '12px' },
  sectionTitle: { fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 12px', color: '#F1F5F9' },
  sectionDesc: { fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, maxWidth: '520px', margin: '0 0 48px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: {
    padding: '28px', borderRadius: '16px',
    background: 'rgba(30,41,59,0.5)', border: '1px solid #1E293B',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,
  iconWrap: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
  },
  cardTitle: { fontSize: '15px', fontWeight: 600, color: '#F1F5F9', margin: '0 0 8px' },
  cardDesc:  { fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: 0 },
  divider: { height: '1px', background: 'linear-gradient(90deg, transparent, #1E293B 20%, #1E293B 80%, transparent)', margin: '0 auto' },
  cta: {
    textAlign: 'center' as const, padding: '80px 24px',
    background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(56,189,248,0.08) 0%, transparent 70%)',
  },
};

export default function NosotrosPage() {
  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.badge}><Scissors size={13} /> Software para peluquerías</div>
        <h1 style={s.h1}>Nacimos en una <span style={s.accent}>peluquería</span></h1>
        <p style={s.subtitle}>
          LookControl nació de la frustración real de gestionar un salón con hojas de cálculo y cuadernos.
          Lo construimos para resolver exactamente ese problema.
        </p>
        <Link to="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '14px 28px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
          color: '#0F172A', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
        }}>
          Empezar gratis <ArrowRight size={16} />
        </Link>
      </section>

      <div style={s.divider} />

      {/* ── QUÉ OFRECEMOS ── */}
      <section style={s.section}>
        <p style={s.sectionLabel}>Qué ofrecemos</p>
        <h2 style={s.sectionTitle}>Todo lo que necesita tu peluquería</h2>
        <p style={s.sectionDesc}>
          Seis módulos integrados que cubren el ciclo completo de operación de un salón de belleza.
        </p>
        <div style={s.grid3}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={s.card}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(56,189,248,0.3)')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1E293B')}
            >
              <div style={s.iconWrap}><Icon size={20} color="#38BDF8" /></div>
              <p style={s.cardTitle}>{title}</p>
              <p style={s.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section style={s.section}>
        <p style={s.sectionLabel}>Por qué elegirnos</p>
        <h2 style={s.sectionTitle}>Diseñado para tu día a día</h2>
        <p style={s.sectionDesc}>No es tecnología por tecnología. Cada decisión de diseño tiene un motivo práctico.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {WHY_US.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              padding: '32px', borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))',
              border: '1px solid #1E293B',
            }}>
              <div style={{ ...s.iconWrap, marginBottom: '20px', width: '48px', height: '48px', borderRadius: '14px' }}>
                <Icon size={22} color="#38BDF8" />
              </div>
              <p style={{ ...s.cardTitle, fontSize: '16px', marginBottom: '10px' }}>{title}</p>
              <p style={s.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* ── QUÉ NOS HACE DIFERENTES ── */}
      <section style={s.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <p style={s.sectionLabel}>Qué nos hace diferentes</p>
            <h2 style={{ ...s.sectionTitle, marginBottom: '16px' }}>Los detalles que marcan la diferencia</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>
              Cualquier software gestiona listas. LookControl gestiona tu negocio con la lógica
              específica de una peluquería: caducidades, lotes, multi-empleado y trazabilidad real.
            </p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {DIFFERENTIATORS.map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle size={16} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <h2 style={{ ...s.h1, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '16px' }}>
          ¿Listo para probarlo?
        </h2>
        <p style={{ ...s.subtitle, marginBottom: '32px' }}>
          Plan gratuito disponible. Sin tarjeta de crédito.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
            color: '#0F172A', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
          }}>
            Crear cuenta gratis <ArrowRight size={16} />
          </Link>
          <Link to="/precios" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '12px',
            border: '1px solid #334155', background: 'transparent',
            color: '#94A3B8', fontWeight: 600, fontSize: '15px', textDecoration: 'none',
          }}>
            Ver planes y precios
          </Link>
        </div>
      </section>
    </div>
  );
}
