# 💇‍♂️ LookControl

> **La aplicación web para la gestión integral de peluquerías.**
> Centraliza tu agenda, stock y proveedores en un solo lugar.

---

## 🌍 ¿Qué es LookControl?

LookControl nace para resolver la ineficiencia de la gestión manual en peluquerías — el papel, las hojas de cálculo, los olvidos. Es una herramienta sencilla y accesible que permite a los profesionales **enfocarse en su arte**, no en la administración.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React (SPA) + Vite + Bootstrap 5 |
| **Backend y Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **Lenguajes** | JavaScript, TypeScript, HTML5, CSS3 |
| **Otras herramientas** | jsPDF / html2canvas · Cypress (E2E) |

---

## 👥 Roles y Permisos

**👤 Admin / Creador**
Acceso total: gestión de productos, stock, compras, proveedores, categorías, reportes generales y administración de usuarios.

**✂️ Usuario Regular**
Personal operativo: consulta de inventario, registro de consumos en servicios, visualización de proveedores y reportes básicos.

---

## 🗄️ Estructura de Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Datos del personal y registro de acciones realizadas |
| `productos` | Inventario detallado, precios, stock actual y mínimo |
| `proveedores` | Información de contacto para suministros y pedidos |
| `compras` / `detalle_compras` | Pedidos, facturas, costos y fechas de caducidad |
| `movimientos_stock` | Trazabilidad de entradas, salidas y ajustes |
| `servicios` / `consumos_servicio` | Catálogo de servicios y productos usados en cada uno |

---

## ✨ Funcionalidades Implementadas

- 📦 **Gestión de inventario** — Control en tiempo real con alertas de stock bajo.
- 📅 **Agenda y reservas** — Reserva online 24/7 con recordatorios automáticos.
- 📊 **Trazabilidad** — Historial completo de movimientos por usuario.
- 📄 **Informes en PDF** — Exportación de reportes de inventario y ventas.

---

## 💻 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar entorno de desarrollo
npm run dev

# Ejecutar tests E2E con Cypress
npm run test
```

---

## 🗺️ Roadmap

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Definición funcional y prioridades | ✅ Completada |
| **Fase 2** | Diseño de BD relacional y arquitectura React | 🔲 Pendiente |
| **Fase 3** | Desarrollo de módulos core (Inventario, Compras, Usuarios) | 🔲 Pendiente |
| **Fase 4** | Pruebas de calidad y despliegue en producción | 🔲 Pendiente |

# 🎓 Tutorías y Seguimiento

**Tutor:** `Francisco José Mera Calderón`

> [!IMPORTANT]
> **Nota de Seguimiento:** Las sesiones se desarrollaron bajo un marco de trabajo **ágil**, centradas en la validación de entregables, resolución de bloqueos técnicos y planificación de *sprints* semanales para garantizar el cumplimiento del cronograma.

---

## 📑 Cronograma de Hitos

### 🗓️ Septiembre: Conceptualización e Identidad
| Fecha | Hito | Descripción |
| :--- | :--- | :--- |
| **12-SEP** | 🚀 Lanzamiento | Presentación de asignatura y visión del proyecto. |
| **19-SEP** | 💎 Branding | Diseño y consolidación de la imagen corporativa. |
| **26-SEP** | ⚖️ Legal | Formalización del contrato de prestación de servicios. |

### 🏗️ Octubre: Arquitectura y Diseño
| Fecha | Hito | Descripción |
| :--- | :--- | :--- |
| **03-OCT** | 📝 Requisitos | Especificación de historias de usuario y requerimientos. |
| **10-OCT** | 🎨 UI/UX | Prototipado y diseño de interfaces gráficas. |
| **17-OCT** | 💾 Data Entry | Diseño del esquema lógico de la base de datos. |
| **24-OCT** | 🕸️ Modelado | Definición y normalización del modelo relacional. |
| **31-OCT** | 🤝 Review | Presentación de avances a los stakeholders. |

### 📂 Noviembre: Definición Técnica
| Fecha | Hito | Descripción |
| :--- | :--- | :--- |
| **07-NOV** | 🛠️ Stack | Selección estratégica del ecosistema tecnológico. |
| **14-NOV** | 📖 Doc Core | Estructuración y organización del repositorio documental. |
| **21-NOV** | ✍️ Manuales | Definición del índice y puntos clave técnicos. |

### 🚀 Diciembre & Enero: Implementación y Deployment
| Fecha | Hito | Descripción |
| :--- | :--- | :--- |
| **05-DIC** | 📘 Documentación | Redacción final de manuales de usuario y técnicos. |
| **12-DIC** | ☁️ DevOps | Análisis de alternativas para el despliegue. |
| **19-DIC** | 💻 Local Host | Pruebas de despliegue en entorno local (Apache Tomcat). |
| **09-ENE** | ⚡ Producción | Despliegue exitoso en entorno Cloud (Vercel). |

---

## 👤 Autoría

| Campo | Detalle |
|-------|---------|
| 🖋️ **Autor** | Nicolás Casablanca |
| 🎓 **Estudios** | 2.º DAW — Desarrollo de Aplicaciones Web |
| 🏫 **Centro** | IES Albarregas, Mérida |
| 📅 **Año** | 2025 – 2026 |

---

*LookControl — Tu aliado para una peluquería más eficiente y moderna.*
