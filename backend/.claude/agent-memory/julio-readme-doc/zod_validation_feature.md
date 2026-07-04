---
name: zod-validation-feature
description: Cómo está implementada y documentada la capa de validación con Zod (shared/)
metadata:
  type: project
---

**Qué es:** capa de validación con Zod mediante schemas compartidos entre backend y frontend, en una carpeta `shared/` standalone (propio `package.json` + `node_modules`, sin npm workspaces). Se importa con ruta relativa: `../../shared/index.js` desde el back, `../../../shared/index.js` desde el front.

**Schemas:** `loginSchema`, `userRegisterSchema`, `adminRegisterSchema`, `authResponseSchema` (`shared/schemas/auth.schema.js`) y `contactSchema` (`shared/schemas/contact.schema.js`), re-exportados desde `shared/index.js`.

**Backend:** middleware genérico `validate(schema)` en `backend/middlewares/validate.js` (`safeParse` sobre `req.body`, 400 + fieldErrors si falla). Aplicado en login, register user/admin y `POST /contact`.

**Frontend:** react-hook-form + `@hookform/resolvers` (zodResolver) en `Login.tsx` y `Contact.tsx`. Tipos derivados con `z.infer`. Responses validados en la capa de service con `schema.parse()`. Deps nuevas: `zod` 4.4.3, `@hookform/resolvers`. Requiere `"allowJs": true` en `tsconfig.app.json`.

**Decisiones documentadas:**
- `shared/` queda en `.js` (no `.ts`) porque el back corre con Node plano y el type-stripping nativo recién es default en Node ≥22.18.
- La validación del front es UX; la seguridad la garantiza siempre el backend.

**Dónde está el detalle completo:** `.claude/spec.md`, sección "Validación (Zod + schemas compartidos)". El README solo tiene el resumen (sección 🧪 Validación de datos + entradas en Características, Tecnologías, Estructura y Estado de implementación).

Ver [[project-overview]] y [[readme-style]].
