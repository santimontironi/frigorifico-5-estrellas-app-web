---
name: project-frigorifico
description: Contexto central del proyecto Frigorifico 5 Estrellas — nombre, stack confirmado, estado de implementación y decisiones de documentación
metadata:
  type: project
---

Proyecto: **Frigorífico 5 Estrellas** — app web de pedidos online para un frigorífico.

**Stack confirmado en package.json:**
- Frontend: React 19, TypeScript ~6.0, Tailwind CSS 4, Vite 8, React Router DOM 7, Axios 1.x
- Backend: Node.js + Express 5.x, MongoDB + Mongoose 9.x, JWT 9.x, bcrypt 6.x, Nodemon 3.x, Cloudinary 2.x, Nodemailer 9.x
- Pagos: Mercado Pago Checkout Pro (SDK pendiente de instalar)
- Auth: JWT en cookie httpOnly; token unificado con payload `{ id, role: 'user' | 'admin' }`

**Estado al 2026-06-25:**
- Implementado: modelos completos (User, Admin, Category, Product, Offer, OrderItem, Order), auth dual (usuarios y admins), middlewares verifyAuth/verifyRole, AuthContext, hooks UseAuth/UseDashboardUser/UseDashboardAdmin, auth.service.ts, tipos TypeScript de auth
- Pendiente: todo lo relacionado a productos, categorías, ofertas, pedidos y pagos (controllers, routes, repositories, contextos de frontend, páginas, React Router en App.tsx)

**Fuentes de verdad:**
- `.claude/spec.md` — spec técnico completo con modelos, endpoints, middlewares y reglas de negocio
- `.claude/context.md` — contexto de negocio breve

**Decisiones de documentación tomadas:**
- README en español (idioma del proyecto)
- Sección de API solo incluye endpoints ya implementados; los pendientes no se listan en esa tabla
- Flujo de negocio representado como diagrama de texto ASCII para claridad visual
- No se incluyeron secciones de contribución ni licencia (proyecto personal/portafolio)
- Autor: Santiago Montironi — santiimontironi@gmail.com

**Why:** El README debe servir como presentación para reclutadores y documentación de avance del proyecto.
**How to apply:** En futuras actualizaciones, verificar qué nuevos módulos pasaron de "pendiente" a "implementado" consultando el código real antes de actualizar las secciones de estado.
