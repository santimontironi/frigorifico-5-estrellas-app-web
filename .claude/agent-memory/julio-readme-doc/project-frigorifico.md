---
name: project-frigorifico
description: Contexto central del proyecto Frigorifico 5 Estrellas — nombre, stack confirmado, estado de implementación y decisiones de documentación
metadata:
  type: project
---

Proyecto: **Frigorífico 5 Estrellas** — app web de pedidos online para un frigorífico. Actualmente **en desarrollo activo**.

**Stack confirmado (package.json, 2026-07-12):**
- Frontend: React 19, TypeScript ~6.0, Tailwind CSS 4, Vite 8, React Router DOM 7, Axios 1.x, react-hook-form + @hookform/resolvers, SweetAlert2, Bootstrap Icons, react-loader-spinner
- Backend: Node.js + Express 5.x, MongoDB + Mongoose 9.x, JWT 9.x, bcrypt 6.x, Nodemon 3.x, Cloudinary 2.x, Nodemailer 9.x, express-rate-limit, xlsx (import Excel), multer (memoryStorage)
- Pagos: SDK `mercadopago` ^3.2.0 ya instalado en backend, pero el flujo de checkout/webhook todavía NO está conectado (order.routes.js existe pero vacío/no montado en app.js)
- Auth: JWT en cookie httpOnly; 3 roles: `user` (cliente), `admin`, `employee`. Login unificado `POST /api/login`. Empleados los da de alta un admin (`POST /api/register/employee`), no se autorregistran.

**Estado al 2026-07-12 (verificado leyendo código, no solo memoria):**
- Implementado end-to-end: auth (3 roles, confirmación por email, recuperación de contraseña), CRUD productos (+ importación masiva Excel con creación automática de categorías), CRUD categorías, sistema de ofertas (alta/listado/baja con imagen en Cloudinary), carrito persistente en localStorage (Home y Cart.tsx), búsqueda de productos en tiempo real (`ProductContext.searchProducts`, filtro client-side por nombre), panel de admin completo (productos, importación, categorías, ofertas, empleados, clientes), baja de clientes/empleados (delete real, no soft-delete `active:false` como se planeaba antes)
- Pendiente real: módulo de pedidos (`order.routes.js` vacío, no importado en `backend/app.js`), `OrderContext.tsx` del frontend vacío, botón "Finalizar compra" en Cart.tsx deshabilitado, vista de pedidos en AdminPanel es placeholder ("Pedidos — próximamente"), integración funcional de Mercado Pago y webhook de pago, historial de pedidos del usuario

**Fuentes de verdad:**
- `.claude/spec.md` — spec técnico completo con modelos, endpoints, middlewares y reglas de negocio
- `.claude/context.md` — contexto de negocio breve
- El código real siempre prevalece sobre `.claude/spec.md` si hay discrepancia (el backend puede ir adelantado respecto al spec)

**Decisiones de documentación tomadas:**
- README en español (idioma del proyecto)
- Título del README debe indicar explícitamente "En desarrollo" / 🚧 — pedido explícito del usuario (2026-07-12), mantener en futuras actualizaciones mientras el proyecto no esté productivo
- Sección de API solo incluye endpoints ya montados en `app.js` (verificar imports ahí, no solo la existencia del archivo de rutas — `order.routes.js` existe pero no está importado)
- Estado de implementación con dos listas (Listo / Pendiente) en vez de prosa
- Flujo de negocio como diagrama ASCII, marcando con ⏳ los pasos aún no conectados
- No se incluyeron secciones de contribución ni licencia (proyecto personal/portafolio)
- Autor: Santiago Montironi — santiimontironi@gmail.com

**Why:** El README debe servir como presentación para reclutadores y documentación de avance real del proyecto (no aspiracional).
**How to apply:** En futuras actualizaciones, no confiar solo en la existencia de un archivo de rutas/controller — verificar que esté importado y montado en `backend/app.js` y que el contexto del frontend tenga lógica real (no solo el archivo creado vacío) antes de mover algo de "Pendiente" a "Listo".
