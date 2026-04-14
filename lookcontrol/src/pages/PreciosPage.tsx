import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, ArrowRight, Bot, Send, X, Loader2, CreditCard, Banknote } from 'lucide-react';

// ─── tipos ──────────────────────────────────────────────────
type ChatMsg = { role: 'user' | 'assistant'; content: string };

// ─── datos de planes ────────────────────────────────────────
const PLANS = [
  {
    id: 'gratis',
    name: 'Gratis',
    monthly: 0,
    unique: null,
    badge: null,
    desc: 'Para empezar sin compromiso',
    accent: '#64748B',
    features: [
      '1 usuario',
      'Hasta 50 productos',
      'Dashboard básico',
      'Inventario simple',
      'Historial 30 días',
    ],
    notIncluded: ['Gestión de compras', 'Módulo de servicios', 'Multi-usuario', 'Soporte prioritario'],
    cta: 'Empezar gratis',
    ctaTo: '/register',
  },
  {
    id: 'emprendedor',
    name: 'Emprendedor',
    monthly: 12,
    unique: 149,
    badge: null,
    desc: 'Para peluquerías que crecen',
    accent: '#38BDF8',
    features: [
      '3 usuarios',
      'Hasta 200 productos',
      'Gestión de compras y proveedores',
      'Historial de movimientos completo',
      'Alertas de bajo stock',
      'Soporte por email',
    ],
    notIncluded: ['Módulo de servicios', 'Usuarios ilimitados'],
    cta: 'Elegir Emprendedor',
    ctaTo: '/register',
  },
  {
    id: 'popular',
    name: 'Popular',
    monthly: 22,
    unique: 299,
    badge: 'Más popular',
    desc: 'La opción completa para tu salón',
    accent: '#A78BFA',
    features: [
      '5 usuarios',
      'Productos ilimitados',
      'Gestión de compras y proveedores',
      'Módulo de servicios con consumos',
      'Historial ilimitado',
      'Caducidades y gestión de lotes',
      'Soporte prioritario por email',
    ],
    notIncluded: ['Usuarios ilimitados'],
    cta: 'Elegir Popular',
    ctaTo: '/register',
  },
  {
    id: 'completo',
    name: 'Completo',
    monthly: 35,
    unique: 499,
    badge: null,
    desc: 'Sin límites, con soporte total',
    accent: '#F59E0B',
    features: [
      'Usuarios ilimitados',
      'Productos ilimitados',
      'Todos los módulos incluidos',
      'Chat IA integrado',
      'Análisis avanzados',
      'Formación personalizada',
      'Soporte 24/7',
      'Actualizaciones de por vida',
    ],
    notIncluded: [],
    cta: 'Elegir Completo',
    ctaTo: '/register',
  },
];

// ─── estilos base ───────────────────────────────────────────
const page: React.CSSProperties = {
  background: '#0F172A', minHeight: '100vh', color: '#F1F5F9',
  fontFamily: 'system-ui, sans-serif',
};

// ─── componente ─────────────────────────────────────────────
export default function PreciosPage() {
  const [billing, setBilling] = useState<'monthly' | 'unique'>('monthly');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente de LookControl. Pregúntame lo que quieras sobre los planes, funciones o cómo funciona la app.' },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    const updated: ChatMsg[] = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Eres el asistente de LookControl, un software de gestión para peluquerías. Responde de forma concisa y amable SOLO sobre LookControl y sus planes.

Planes disponibles:
- Gratis: €0, 1 usuario, 50 productos, inventario básico, sin compras ni servicios.
- Emprendedor: €12/mes o €149 pago único. 3 usuarios, 200 productos, compras y proveedores, soporte email.
- Popular (más popular): €22/mes o €299 pago único. 5 usuarios, ilimitados productos, todos los módulos salvo usuarios ilimitados, soporte prioritario.
- Completo: €35/mes o €499 pago único. Usuarios ilimitados, todo incluido, IA, formación personalizada, soporte 24/7.

Pago único incluye gestión vitalicia del plan contratado. Si preguntan algo fuera de LookControl, redirige amablemente a hablar del producto.`,
          messages: updated.filter(m => m.role !== 'assistant' || updated.indexOf(m) > 0).map(m => ({
            role: m.role, content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? 'No pude procesar tu pregunta. Inténtalo de nuevo.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Error de conexión. Inténtalo de nuevo.' }]);
    }
    setChatLoading(false);
  };

  return (
    <div style={page}>

      {/* ── HERO ── */}
      <section style={{
        padding: '80px 24px 60px', textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(56,189,248,0.1) 0%, transparent 70%)',
      }}>
        <p style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: '999px',
          background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
          fontSize: '12px', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.05em',
          textTransform: 'uppercase', marginBottom: '20px',
        }}>Planes y Precios</p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800,
          letterSpacing: '-0.03em', margin: '0 0 16px', color: '#F8FAFC',
        }}>
          El plan que se adapta a tu peluquería
        </h1>
        <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Desde una sola butaca hasta varios locales. Sin permanencia, sin letra pequeña.
        </p>

        {/* Billing toggle */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0',
          background: '#1E293B', border: '1px solid #334155',
          borderRadius: '12px', padding: '4px',
        }}>
          {(['monthly', 'unique'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              background: billing === b ? '#38BDF8' : 'transparent',
              color: billing === b ? '#0F172A' : '#94A3B8',
            }}>
              {b === 'monthly' ? 'Mensual' : 'Pago único'}
            </button>
          ))}
        </div>
        {billing === 'unique' && (
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '10px' }}>
            Pago único incluye gestión y actualizaciones de por vida
          </p>
        )}
      </section>

      {/* ── PLAN CARDS ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
        }}>
          {PLANS.map(plan => {
            const isPopular = plan.badge === 'Más popular';
            const price = billing === 'monthly' ? plan.monthly : plan.unique;

            return (
              <div key={plan.id} style={{
                borderRadius: '20px', padding: '32px 28px',
                border: isPopular ? `2px solid ${plan.accent}` : '1px solid #1E293B',
                background: isPopular
                  ? 'linear-gradient(160deg, rgba(167,139,250,0.08) 0%, rgba(30,41,59,0.9) 100%)'
                  : 'rgba(15,23,42,0.8)',
                display: 'flex', flexDirection: 'column', position: 'relative',
                boxShadow: isPopular ? `0 0 40px rgba(167,139,250,0.15)` : 'none',
              }}>

                {/* Badge más popular */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: '999px',
                    background: `linear-gradient(135deg, ${plan.accent}, #38BDF8)`,
                    fontSize: '11px', fontWeight: 700, color: '#0F172A',
                    whiteSpace: 'nowrap', letterSpacing: '0.05em',
                  }}>
                    ⭐ {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{plan.desc}</p>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '28px' }}>
                  {price === null ? (
                    <p style={{ fontSize: '36px', fontWeight: 800, color: plan.accent, margin: 0 }}>Gratis</p>
                  ) : billing === 'monthly' ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '40px', fontWeight: 800, color: plan.accent, lineHeight: 1 }}>{price}€</span>
                      <span style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>/mes</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{ fontSize: '40px', fontWeight: 800, color: plan.accent, lineHeight: 1 }}>{price}€</span>
                        <span style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>único</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#475569', margin: '4px 0 0' }}>+ gestión incluida de por vida</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Check size={15} color={plan.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', color: '#CBD5E1' }}>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <X size={15} color="#334155" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', color: '#334155' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={plan.ctaTo} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '13px 20px', borderRadius: '12px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: 700,
                  background: isPopular
                    ? `linear-gradient(135deg, ${plan.accent}, #38BDF8)`
                    : price === null
                    ? '#1E293B'
                    : `rgba(${plan.id === 'emprendedor' ? '56,189,248' : plan.id === 'completo' ? '245,158,11' : '167,139,250'},0.12)`,
                  color: isPopular ? '#0F172A' : price === null ? '#94A3B8' : plan.accent,
                  border: isPopular ? 'none' : `1px solid ${price === null ? '#334155' : plan.accent + '40'}`,
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {plan.cta} {price !== null && <ArrowRight size={15} />}
                </Link>

                {/* Payment options row */}
                {price !== null && (
                  <div style={{
                    display: 'flex', gap: '8px', marginTop: '12px',
                  }}>
                    <button style={{
                      flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #1E293B',
                      background: 'transparent', color: '#64748B', fontSize: '11px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}>
                      <CreditCard size={12} /> Tarjeta
                    </button>
                    <button style={{
                      flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #1E293B',
                      background: 'transparent', color: '#64748B', fontSize: '11px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}>
                      <Banknote size={12} /> Transferencia
                    </button>
                    <button style={{
                      flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #1E293B',
                      background: 'transparent', color: '#64748B', fontSize: '11px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}>
                      <Zap size={12} /> Bizum
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ CTA ── */}
      <section style={{
        textAlign: 'center', padding: '0 24px 80px',
        maxWidth: '600px', margin: '0 auto',
      }}>
        <div style={{
          padding: '36px', borderRadius: '20px',
          background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)',
        }}>
          <Bot size={32} color="#38BDF8" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', margin: '0 0 10px' }}>
            ¿Tienes dudas sobre los planes?
          </h3>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 24px', lineHeight: 1.6 }}>
            Pregúntale a nuestro asistente IA. Resuelve cualquier duda sobre funciones, precios o diferencias entre planes en segundos.
          </p>
          <button onClick={() => setChatOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
            color: '#0F172A', fontWeight: 700, fontSize: '14px',
          }}>
            <Bot size={16} /> Preguntar al asistente
          </button>
        </div>
      </section>

      {/* ── CHAT WIDGET ── */}
      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: 'min(380px, calc(100vw - 32px))',
          height: '520px', borderRadius: '20px',
          background: '#111827', border: '1px solid #1E293B',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden',
        }}>
          {/* Chat header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid #1E293B',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(30,41,59,0.8))',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={18} color="#0F172A" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#F1F5F9' }}>Asistente LookControl</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#38BDF8' }}>● En línea</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px',
              borderRadius: '8px', display: 'flex',
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #38BDF8, #7DD3FC)'
                    : '#1E293B',
                  color: msg.role === 'user' ? '#0F172A' : '#CBD5E1',
                  fontSize: '13px', lineHeight: 1.5,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
                  background: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Loader2 size={14} color="#38BDF8" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #1E293B',
            display: 'flex', gap: '8px', alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Pregunta sobre los planes..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '10px',
                background: '#1E293B', border: '1px solid #334155',
                color: '#F1F5F9', fontSize: '13px', outline: 'none',
              }}
            />
            <button onClick={sendMessage} disabled={chatLoading || !input.trim()} style={{
              padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: input.trim() ? 'linear-gradient(135deg, #38BDF8, #7DD3FC)' : '#1E293B',
              color: input.trim() ? '#0F172A' : '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante chat si está cerrado */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
          color: '#0F172A', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(56,189,248,0.4)',
          zIndex: 1000,
        }}>
          <Bot size={22} />
        </button>
      )}
    </div>
  );
}
