---
name: project-overview
description: Frigorífico 5 Estrellas — proyecto, stack y ubicación del README
metadata:
  type: project
---

**Proyecto:** "Frigorífico 5 Estrellas — Pedidos Online". App de pedidos: clientes navegan catálogo, arman carrito, confirman pedido; admin revisa, carga monto final tras pesaje, acepta/rechaza; pago con Mercado Pago Checkout Pro confirmado por webhook.

**Ubicación del README que mantengo:** el README que documento está en la RAÍZ del repo (`frigorifico 5 estrellas/README.md`), un nivel arriba de donde corre este agente (cuyo cwd es `backend/`). También existe `frontend/README.md` (boilerplate de Vite, no lo toco) y `.claude/spec.md` en la raíz con el detalle técnico completo (ya mantenido aparte, más extenso que el README).

**Estructura de carpetas (a nivel raíz):**
```
frigorifico-5-estrellas/
├── backend/     (Node + Express, ESM implícito, corre con nodemon)
├── frontend/    (React 19 + TS + Vite + Tailwind 4)
└── shared/      (schemas de Zod, standalone: package.json + node_modules propios, sin npm workspaces)
```

**Stack confirmado (ver tabla de Tecnologías en el README):** React 19, TS ~6.0, Tailwind 4, Vite 8, React Router 7, Axios, react-hook-form + @hookform/resolvers, Node/Express 5.x, MongoDB/Mongoose 9.x, JWT+bcrypt, Zod 4.x, Nodemon, Cloudinary, Nodemailer, Mercado Pago SDK.

**Fuente de verdad técnica:** `.claude/spec.md` (raíz) tiene el detalle exhaustivo (modelos, endpoints, middlewares, decisiones de arquitectura). El README debe ser el resumen conciso derivado de ahí — cuando spec.md se actualiza con una feature nueva, reviso esa sección primero para extraer solo lo esencial para el README.

**Última actualización del README:** 2026-07-04 — agregada la capa de validación con Zod (schemas compartidos en `shared/`, middleware `validate()` en backend, react-hook-form + zodResolver en frontend). Ver [[readme-style]] y [[zod-validation-feature]].
