---
name: component-product-list
description: Decisiones visuales para ProductList.tsx (tarjeta de producto) y grid de Home.tsx — vidriera de productos sin imagen
metadata:
  type: project
---

Concepto: tarjeta de lista de precios tipográfica (sin foto de producto) — eyebrow de categoría con ícono, nombre como elemento dominante, precio como ancla visual dorada formateada en pesos argentinos.

**ProductList.tsx (`frontend/src/components/ProductList.tsx`):**
- `<article>`: `group relative bg-[#0F0507] border border-white/8 p-6 md:p-8 transition-all duration-300 hover:border-[#9B2335]/50 hover:shadow-[0_0_28px_-8px_rgba(155,35,53,0.35)] hover:-translate-y-0.5`
- Línea "corte" superior (mismo motivo del subrayado de nav en Header): `span absolute top-0 left-0 h-px w-0 bg-[#9B2335] transition-[width] duration-300 group-hover:w-full`
- Eyebrow categoría: ícono `bi bi-tag-fill text-[#9B2335] text-[11px]` + `span text-[#C9BFB5] text-[10px] tracking-[0.25em] uppercase font-mono`
- Nombre: `text-[#F2EDE6] text-xl md:text-2xl font-bold tracking-tight leading-snug mb-6 md:mb-8`
- Precio (ancla visual): `text-[#F7EA79] text-3xl md:text-4xl font-bold font-mono tracking-tight` — formateado con `${price.toLocaleString('es-AR')}` (cambio de formato display-only, no lógica)
- Unidad: `text-[#C9BFB5]/50 text-xs font-mono uppercase tracking-wide`

**Home.tsx grid (`frontend/src/pages/Home.tsx`):**
- `<section>`: `min-h-screen bg-[#0A0A0A]`
- Contenedor: `max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-16` (mismo max-w-7xl que Header)
- Eyebrow de sección: ícono `bi bi-shop text-[#9B2335] text-sm` + `h2 text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono` — "Nuestros productos"
- Grid: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8`

**Nota sobre breakpoints — conflicto resuelto:**
El usuario pidió explícitamente en el prompt de la tarea "2 columnas en sm/md, 3-4 en lg" y mencionó `lg:` como breakpoint válido. Esto choca con la restricción absoluta del agente (solo base/md/xl/2xl, nunca `sm:`/`lg:`/`3xl:`). Se priorizó la restricción de breakpoints del agente y se tradujo la intención del usuario a la escala permitida: 1 col base, 2 en `md:`, 3 en `xl:`, 4 en `2xl:`. Documentado explícitamente en la respuesta al usuario para que pueda corregir si prefería literalmente `lg:`.

**Colores usados:** `#0F0507`, `#0A0A0A` (fondos), `#9B2335` (carmine — borde hover, ícono, línea corte), `#F2EDE6` (bone — nombre), `#C9BFB5` (parchment — categoría/unidad), `#F7EA79` (gold — precio, uso destacado pero justificado como ancla visual principal).

Ver [[project-color-palette]] para tokens. Ver [[component-header]] para el patrón de línea/subrayado que se reutilizó acá.
