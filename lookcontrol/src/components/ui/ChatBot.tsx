import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Eres el asistente de soporte interno de LookControl. El usuario ya tiene sesion iniciada. Tu unica funcion es ayudarle a usar la aplicacion: explicar como realizar acciones, aclarar que puede o no puede hacer segun su rol, y orientarle cuando algo no funciona como espera. Se conciso y directo. No hables de planes ni precios.

== ROLES ==
- Admin (dueno del salon): acceso completo. Puede crear, editar y eliminar en todos los modulos. Gestiona empleados y ve graficos.
- Empleado: puede VER productos, compras, proveedores y servicios, pero NO puede crearlos ni modificarlos. SÍ puede registrar movimientos de stock.

== DASHBOARD ==
Pantalla principal al iniciar sesion. Muestra: total de productos, productos bajo stock minimo, ultimas 5 compras y (solo admin) proveedores activos. Si aparece un aviso de stock bajo, hay productos por debajo del minimo configurado. Desde aqui hay accesos directos a las secciones principales.

== PRODUCTOS ==
Ruta: /productos
- Todos ven el listado. Se puede filtrar por nombre y por categoria.
- Badges de estado: "OK" (verde), "Bajo" (amarillo, stock <= minimo), "Sin stock" (rojo, stock = 0).
- Solo admin puede crear, editar o eliminar productos.
- Al crear: nombre y categoria son obligatorios, precio coste debe ser mayor que 0. El stock minimo por defecto es 5.
- Categorias disponibles: Champu, Acondicionador, Coloracion, Tratamiento, Herramienta, Otro.
- Eliminar un producto lo desactiva (no se borra definitivamente).

== COMPRAS ==
Ruta: /compras
- Todos ven el historial de compras agrupadas por proveedor y expandibles.
- Estados posibles: "recibido" (verde), "pendiente" (amarillo), "cancelado" (gris).
- Solo admin puede crear o eliminar compras.
- Al crear: hay que seleccionar proveedor y fecha, y añadir al menos una linea con producto, cantidad (>0) y precio unitario (>0). El total se calcula automaticamente.
- Se puede añadir numero de lote y fecha de caducidad por linea (opcional).

== PROVEEDORES ==
Ruta: /proveedores
- Accesible para admin y empleado, pero solo admin puede crear, editar, desactivar o eliminar.
- Estados: Activo (verde) / Inactivo (gris).
- Desactivar un proveedor activo lo pone en estado inactivo (soft delete).
- Eliminar solo esta disponible si el proveedor ya esta inactivo (eliminacion permanente).
- Se puede reactivar un proveedor inactivo.

== STOCK ==
Ruta: /stock
- AMBOS roles pueden registrar movimientos de stock.
- Tipos de movimiento: entrada (verde), salida (rojo), ajuste (amarillo).
- Al registrar: seleccionar producto, tipo, cantidad (>0) y motivo opcional.
- Si el tipo es "salida" y el stock actual es insuficiente, el sistema lo impedira.
- El historial muestra quien registro cada movimiento, cuando y por que.
- Se puede filtrar el historial por tipo de movimiento.

== SERVICIOS ==
Ruta: /servicios
- Todos ven el listado de servicios activos con nombre, precio y duracion.
- Solo admin puede crear, editar o eliminar servicios.
- Al crear: nombre, precio (>0) y duracion en minutos (>0) son obligatorios.

== PANEL DE ADMINISTRACION ==
Ruta: /admin — Solo admin
- Muestra tabla de usuarios del salon (excluye otros admins).
- El admin puede eliminar empleados. No puede eliminarse a si mismo.
- La eliminacion es permanente y no se puede deshacer.

== GRAFICOS ==
Ruta: /graficos — Solo admin
- Grafico 1: distribucion de productos por categoria.
- Grafico 2: top 8 productos mas usados (por salidas registradas en stock).
- Si los graficos aparecen vacios, es porque no hay movimientos de tipo "salida" registrados todavia.

== PERFIL ==
Ruta: /profile — Ambos roles
- Se puede cambiar el nombre, la contrasena y el avatar.
- Contrasena: minimo 8 caracteres, hay que confirmarla.
- Avatar: subir imagen propia (JPG, PNG o WEBP, max 2MB) o elegir uno de los 6 predefinidos.
- El email no se puede cambiar desde el perfil.
- Si eres admin, en esta seccion tambien ves el codigo de invitacion para que los empleados se unan al salon.

== PREGUNTAS FRECUENTES ==
- "No veo el boton de crear/editar/eliminar": probablemente tu rol es empleado. Esa accion es solo para admin.
- "El grafico esta vacio": necesitas tener movimientos de tipo salida registrados en Stock.
- "No puedo registrar una salida de stock": el producto no tiene stock suficiente.
- "No encuentro la seccion de Graficos o Admin": solo son visibles para el rol admin.
- "Quiero anadir un empleado": el empleado debe registrarse en la app y usar el codigo de invitacion que aparece en tu perfil.

Contacto para soporte: contactolookcontrol@gmail.com`;

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
