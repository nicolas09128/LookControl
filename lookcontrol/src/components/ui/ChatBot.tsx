import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Eres el asistente virtual de LookControl. Responde de forma concisa, amable y directa unicamente sobre LookControl.

LookControl es un software de gestion integral para peluquerias. Centraliza inventario, compras, proveedores, servicios, usuarios y dashboard en una sola herramienta.

Modulos:
- Inventario en tiempo real con alertas de stock minimo.
- Trazabilidad de movimientos: quien, que, cuando y por que.
- Gestion de compras, facturas y proveedores.
- Consumo por servicio para saber el coste real de cada trabajo.
- Multiusuario con roles de admin y empleado.
- Dashboard con alertas, compras recientes y metricas clave.

Planes:
- Gratis: 1 usuario, hasta 50 productos, inventario simple.
- Emprendedor: 12 EUR/mes o 149 EUR pago unico, hasta 3 usuarios, 200 productos, compras y proveedores.
- Popular: 22 EUR/mes o 299 EUR pago unico, hasta 5 usuarios, productos ilimitados, compras, proveedores y servicios.
- Completo: 35 EUR/mes o 499 EUR pago unico, usuarios ilimitados, todos los modulos, soporte 24/7 y formacion.

Recomienda siempre el plan minimo que cubra la necesidad:
1 usuario: Gratis. 2 o 3: Emprendedor. 4 o 5: Popular. 6 o mas: Completo. Si necesita servicios o productos ilimitados, minimo Popular.

Registro:
- Dueno: crea el salon, tiene permisos de administrador y genera codigo de invitacion.
- Empleado: se registra y se vincula con el codigo del dueno.

Contacto: contacto@lookcontrol.app. Ubicacion: IES Albarregas, Merida. Desarrollado por Nicolas Casablanca, 2 DAW.`;

export default function ChatBot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: 'Hola, soy el asistente de LookControl. Preguntame sobre planes, funciones o como usar la app.' },
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
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updated
              .filter((m, i) => !(m.role === 'assistant' && i === 0))
              .map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!res.ok) throw new Error('Chat unavailable');

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? 'No pude procesar tu pregunta. Intentalo de nuevo.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'El asistente no esta disponible en este momento.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {chatOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title-group">
              <div className="chatbot-icon">
                <Bot size={18} />
              </div>
              <div>
                <p className="chatbot-title">Asistente LookControl</p>
                <p className="chatbot-status">En linea</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setChatOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={`${msg.role}-${i}`} className={`chatbot-row ${msg.role === 'user' ? 'is-user' : ''}`}>
                <div className={`chatbot-bubble ${msg.role === 'user' ? 'is-user' : ''}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="chatbot-row">
                <div className="chatbot-bubble chatbot-loading">
                  <Loader2 size={14} />
                  <span>Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-input-bar">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Pregunta a LookControl..."
              className="chatbot-input"
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={chatLoading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {!chatOpen && (
        <button className="chatbot-floating-button" onClick={() => setChatOpen(true)} aria-label="Abrir chat">
          <Bot size={22} />
        </button>
      )}
    </>
  );
}
