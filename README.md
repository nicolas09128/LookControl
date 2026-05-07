# 💇‍♂️ LookControl

> **La aplicación web para la gestión integral de peluquerías.**  
> Centraliza productos, stock, compras, proveedores, empleados y analíticas en una única plataforma moderna.

---

## 🌍 ¿Qué es LookControl?

LookControl nace para resolver la ineficiencia de la gestión manual en peluquerías — el papel, las hojas de cálculo, los olvidos y la falta de control centralizado. La aplicación permite administrar de forma sencilla el negocio completo desde una sola herramienta.

La plataforma está diseñada para que los profesionales puedan **centrarse en su trabajo**, automatizando la gestión de inventario, empleados, servicios, compras y estadísticas del negocio.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 (SPA) + Vite + TypeScript |
| **Routing** | React Router |
| **Estado Global** | Zustand |
| **Backend y Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **Gráficos** | Recharts |
| **Iconos** | lucide-react |
| **Estilos** | CSS modular + Variables CSS + Modo claro/oscuro |
| **Lenguajes** | JavaScript, TypeScript, HTML5, CSS3 |
| **Deploy** | Vercel |

---

## 👥 Roles y Permisos

### 👑 Admin
Acceso completo al sistema: gestión de productos, stock, compras, proveedores, servicios, empleados, gráficos analíticos y administración general de la peluquería.

### ✂️ Usuario
Acceso operativo para gestión diaria: productos, movimientos de stock, compras, proveedores y servicios.

### 👨‍💼 Empleado
Acceso limitado al sistema mediante vinculación con código de invitación proporcionado por una peluquería registrada.

---

## ✨ Funcionalidades Implementadas

- 📦 **Gestión de inventario** — Control de productos, categorías y stock mínimo.
- 📊 **Movimientos de stock** — Entradas, salidas y ajustes con trazabilidad.
- 🛒 **Sistema de compras** — Gestión de cabecera y detalle de compras.
- 🧾 **Gestión de proveedores** — Información y administración de suministros.
- 💇 **Servicios de peluquería** — Asociación de productos consumidos por servicio.
- 👥 **Administración de empleados** — Gestión exclusiva para administradores.
- 📈 **Panel de gráficos** — Estadísticas visuales para administradores.
- 🌙 **Modo claro/oscuro** — Disponible en zona pública y privada.
- 🔐 **Sistema de autenticación** — Login, registro y recuperación de contraseña por código.
- 🖼️ **Perfil de usuario** — Cambio de nombre, contraseña y avatar.
- 🤖 **Chatbot integrado** — Asistente dentro del panel privado.
- 🌐 **Landing pública** — FAQ, Nosotros, Contacto y navegación completa.
- ⚖️ **Cumplimiento legal** — Política de privacidad y cookies integradas.

---

## 🧭 Rutas Principales

### 🌍 Públicas

| Ruta | Vista |
|------|-------|
| `/` | Landing principal |
| `/nosotros` | Información del proyecto |
| `/faq` | Preguntas frecuentes |
| `/contacto` | Formulario de contacto |
| `/login` | Inicio de sesión |
| `/register` | Selección de registro |
| `/register/owner` | Registro de propietario |
| `/register/employee` | Registro de empleado |
| `/reset-password` | Recuperación de contraseña |

---

### 🔒 Privadas

| Ruta | Vista |
|------|-------|
| `/dashboard` | Panel principal |
| `/productos` | Gestión de productos |
| `/stock` | Movimientos de stock |
| `/compras` | Compras y detalle |
| `/proveedores` | Gestión de proveedores |
| `/servicios` | Servicios y consumos |
| `/profile` | Perfil de usuario |
| `/owner-code` | Vinculación de empleados |
| `/admin` | Administración de empleados |
| `/graficos` | Panel de gráficos |

---

## 🗄️ Estructura de Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `perfiles` | Datos de usuarios, roles y peluquerías |
| `peluquerias` | Negocios registrados |
| `productos` | Inventario, precios y stock |
| `categorias` | Clasificación de productos |
| `proveedores` | Información de proveedores |
| `compras` / `detalle_compras` | Facturas y líneas de compra |
| `movimientos_stock` | Entradas, salidas y ajustes |
| `servicios` | Servicios ofrecidos |
| `consumos_servicio` | Productos consumidos por servicio |
| `password_reset_codes` | Códigos temporales de recuperación |

---

## 📂 Estructura del Proyecto

```text
LookControl/
├─ README.md
├─ vercel.json
├─ api/
└─ lookcontrol/
   ├─ api/
   ├─ public/
   ├─ src/
   │  ├─ components/
   │  ├─ database/
   │  ├─ interfaces/
   │  ├─ pages/
   │  ├─ store/
   │  └─ styles/
   ├─ supabase/
   ├─ package.json
   └─ vite.config.ts
````

---

## 💻 Instalación y Uso

```bash
# Entrar en el proyecto
cd lookcontrol

# Instalar dependencias
npm install

# Iniciar entorno de desarrollo
npm run dev
```

Servidor local por defecto:

```text
http://127.0.0.1:5173
```

---

## 📜 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo Vite
npm run build    # Build de producción
npm run preview  # Previsualización del build
npm run lint     # Ejecutar ESLint
```

---

## 🔐 Variables de Entorno

Crear el archivo:

```text
lookcontrol/.env
```

Variables necesarias:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PASSWORD_RESET_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
GROQ_API_KEY=
```

---

## ☁️ Despliegue

El proyecto está preparado para despliegue en **Vercel**.

Archivos de configuración:

* `vercel.json`
* `lookcontrol/vercel.json`

Antes del despliegue es necesario:

* Configurar las variables de entorno en Vercel.
* Verificar el esquema actualizado de Supabase.
* Ejecutar correctamente las migraciones de base de datos.

---

## 🗺️ Roadmap

| Fase       | Descripción                                  | Estado           |
| ---------- | -------------------------------------------- | ---------------- |
| **Fase 1** | Definición funcional y branding del proyecto | ✅ Completada     |
| **Fase 2** | Diseño de arquitectura React + Supabase      | ✅ Completada     |
| **Fase 3** | Desarrollo de autenticación y panel privado  | ✅ Completada     |
| **Fase 4** | Desarrollo de módulos de negocio             | ✅ Completada     |
| **Fase 5** | Sistema de gráficos y chatbot                | ✅ Completada     |
| **Fase 6** | Optimización, testing y despliegue final     | 🔄 En desarrollo |

---

# 🎓 Tutorías y Seguimiento

**Tutor:** `Francisco José Mera Calderón`

> [!IMPORTANT]
> **Nota de Seguimiento:** El desarrollo del proyecto se realizó siguiendo una metodología ágil basada en iteraciones semanales, validación continua y resolución progresiva de incidencias técnicas.

---

## 📑 Cronograma de Hitos

### 🗓️ Septiembre: Conceptualización e Identidad

| Fecha      | Hito           | Descripción                                          |
| :--------- | :------------- | :--------------------------------------------------- |
| **12-SEP** | 🚀 Lanzamiento | Presentación inicial del proyecto y objetivos.       |
| **19-SEP** | 💎 Branding    | Diseño de identidad visual y concepto de plataforma. |
| **26-SEP** | ⚖️ Legal       | Formalización y documentación inicial.               |

---

### 🏗️ Octubre: Arquitectura y Diseño

| Fecha      | Hito             | Descripción                                           |
| :--------- | :--------------- | :---------------------------------------------------- |
| **03-OCT** | 📝 Requisitos    | Definición de historias de usuario y funcionalidades. |
| **10-OCT** | 🎨 UI/UX         | Diseño de interfaces y experiencia de usuario.        |
| **17-OCT** | 💾 Base de Datos | Diseño lógico y estructura relacional.                |
| **24-OCT** | 🕸️ Modelado     | Relaciones, normalización y migraciones.              |
| **31-OCT** | 🤝 Revisión      | Presentación de avances funcionales.                  |

---

### ⚙️ Noviembre: Desarrollo Core

| Fecha      | Hito          | Descripción                                 |
| :--------- | :------------ | :------------------------------------------ |
| **07-NOV** | 🛠️ Stack     | Integración React + Supabase + Vite.        |
| **14-NOV** | 🔐 Auth       | Sistema de autenticación y recuperación.    |
| **21-NOV** | 📦 Inventario | Desarrollo del módulo de productos y stock. |

---

### 🚀 Diciembre & Enero: Implementación y Deployment

| Fecha      | Hito             | Descripción                                |
| :--------- | :--------------- | :----------------------------------------- |
| **05-DIC** | 📘 Documentación | Manual técnico y documentación funcional.  |
| **12-DIC** | 📊 Analytics     | Implementación de gráficos y estadísticas. |
| **19-DIC** | 🤖 Chatbot       | Integración del asistente inteligente.     |
| **09-ENE** | ☁️ Producción    | Despliegue final en Vercel.                |

---

## 👤 Autoría

| Campo           | Detalle                                  |
| --------------- | ---------------------------------------- |
| 🖋️ **Autor**   | Nicolás Casablanca                       |
| 🎓 **Estudios** | 2.º DAW — Desarrollo de Aplicaciones Web |
| 🏫 **Centro**   | IES Albarregas, Mérida                   |
| 📅 **Curso**    | 2025 – 2026                              |

---

*LookControl — Tu aliado para una peluquería más eficiente y moderna.*

```
```
