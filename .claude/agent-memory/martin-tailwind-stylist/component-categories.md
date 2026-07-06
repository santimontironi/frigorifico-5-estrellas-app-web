---
name: component-categories
description: Decisiones visuales para Categories.tsx (vista admin) y CategoryCard.tsx (tarjeta de categoría)
metadata:
  type: project
---

Concepto: `Categories` adopta el chrome estándar de las vistas del panel admin (mismo patrón que `WelcomeAdmin.tsx` / `ImportProducts.tsx`), no el header público de `Home.tsx`. `CategoryCard` reutiliza el lenguaje tipográfico sin imagen de `ProductCard`/`ProductList`.

**Chrome de vista admin (confirmado en 3 componentes — es el patrón real, no el de Home.tsx):**
- Wrapper: `w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col` (+ `relative overflow-hidden` si lleva `<DiagonalLines />`)
- Header block: `px-6 py-7 md:px-10 md:py-9 border-b border-white/8` — kicker `text-white text-xs font-mono uppercase tracking-[0.2em]` + ícono `text-[#9B2335] text-xs`, título `text-white text-2xl md:text-4xl font-bold tracking-tight` (h1 en la mayoría, h2 en Categories porque la estructura ya venía con h2)
- Contenido: `flex-1 p-6 md:p-10`
- Nota: NO agregué `<DiagonalLines />` a Categories porque hubiera requerido un import nuevo, fuera de mi alcance (solo className + wrappers/íconos presentacionales, sin tocar imports).

**Categories.tsx (`frontend/src/components/admin/Categories.tsx`):**
- Contador de categorías: `text-white/50 text-sm font-mono` (mismo patrón que contador de productos en Home)
- Estado vacío: `border border-dashed border-white/10 rounded-2xl py-24`, ícono `bi-inbox text-white/25 text-4xl`, texto `text-white/50 text-sm font-mono`
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6` (3 columnas máx en xl porque las cards de categoría son más chicas que las de producto — no hace falta 2xl:grid-cols-4)

**CategoryCard.tsx (`frontend/src/components/products/CategoryCard.tsx`):**
- Mismo patrón `ProductList`: `<article>` con línea "corte" superior (`h-px w-0 bg-[#9B2335] group-hover:w-full`), fondo `#0F0507`, borde `white/8` → `#9B2335]/50` en hover
- Badge circular de ícono agregado como wrapper presentacional: `h-11 w-11 rounded-xl bg-[#9B2335]/12 border border-[#9B2335]/20` con `bi-tag-fill`
- Nombre: `text-[#F2EDE6] text-lg font-bold` (más chico que ProductCard porque no hay precio que compita por atención)
- Fecha (única metadata secundaria, no hay precio): `text-[#C9BFB5]/50 text-[11px] font-mono uppercase tracking-wide` con ícono `bi-calendar3` agregado

**Contexto del encargo — separación lógica/estilo:**
En esta tarea el coordinador primero pidió construir los componentes completos (lógica + JSX + estilos) desde placeholders (`<div>Categories</div>`). Se rechazó esa parte por exceder el rol (solo className, nunca agregar JSX ni lógica/imports). El coordinador volvió con la lógica y estructura JSX ya escritas, y ahí sí se aplicó el estilizado completo. Precedente útil: si un placeholder llega sin JSX real ni hooks, no es tarea de estilizado — hay que pedir que se escriba el esqueleto primero.

Ver [[project-color-palette]] para tokens. Ver [[component-product-list]] para el patrón de línea "corte" y card tipográfica que se reutilizó acá.
