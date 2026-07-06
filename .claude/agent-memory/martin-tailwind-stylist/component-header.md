---
name: component-header
description: Decisiones visuales tomadas para Header.tsx — Frigorífico 5 Estrellas
metadata:
  type: project
---

Componente Header ya estilizado. Concepto: header premium oscuro con firma carmín en borde inferior, logo tipográfico con estrella como símbolo de identidad, nav con subrayado que crece de izquierda a derecha en hover, botones de esquinas rectas.

**Decisiones clave:**

- `<header>` usa `bg-[#1C1714] border-b border-[#9B2335] sticky top-0 z-50`
- `<nav>` usa `max-w-7xl mx-auto px-6 h-16 flex items-center justify-between`
- Logo: `flex items-center gap-2` — estrella `text-[#9B2335] text-2xl leading-none` + div `flex flex-col`
- "Frigorífico": `text-[#B8A898] text-[9px] tracking-[0.3em] uppercase font-light leading-none`
- "5 Estrellas": `text-[#F2EDE6] text-sm tracking-[0.2em] uppercase font-bold leading-tight`
- `<ul>` nav: `hidden md:flex items-center gap-8`
- Nav links: técnica `after:` pseudo-elemento para subrayado carmín — `relative ... after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[#9B2335] after:transition-[width] after:duration-300 hover:after:w-full`
- Botón "Mi panel": ghost — `border border-[#C9BFB5]/40` sin rounded, hover fondo translúcido
- Botón "Admin": filled carmín — `bg-[#8B1A2F]` sin rounded, hover `bg-[#A82640]`

**Patrón hover de nav link completo:**
`relative text-[#C9BFB5] text-xs tracking-[0.15em] uppercase font-medium hover:text-[#F2EDE6] transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[#9B2335] after:transition-[width] after:duration-300 hover:after:w-full`

**Ícono de carrito (agregado 2026-07-06):**
- El bloque derecho del `nav` (auth-div + hamburguesa) se envolvió en un único `div flex items-center gap-4` para poder insertar el ícono de carrito como hijo siempre visible entre ambos, sin romper el `justify-between` del `nav` en ningún breakpoint.
- Botón: `Link to="/carrito"` (ruta placeholder, no existe la página todavía) con clase `cartBtnClass` = `relative flex items-center justify-center w-9 h-9 shrink-0 text-[#C9BFB5] border border-[#C9BFB5]/25 hover:border-[#9B2335] hover:text-[#F2EDE6] transition-colors duration-200` — misma familia visual que `ghostBtnClass` pero cuadrado, para ícono.
- Ícono: `<i className="bi bi-cart3 text-base" aria-hidden="true" />`
- Badge de cantidad: `rounded-full bg-[#8B1A2F] text-[#F2EDE6] text-[10px] border border-[#F7EA79]/50`, posicionado `absolute -top-1.5 -right-1.5`, condicional a `itemCount > 0`. Es la única excepción a "esquinas rectas" del proyecto — se aceptó `rounded-full` porque es una burbuja numérica, no un botón/CTA.
- `aria-label` dinámico en el `Link` (ícono funcional) con cantidad de artículos; el `<i>` queda `aria-hidden`.
- Fuente de datos: hook `useCart` (`frontend/src/hooks/useCart.tsx`), `itemCount = items.reduce((acc, item) => acc + item.quantity, 0)`.

**Why:** Diseño aprobado por el cliente para el lanzamiento del sitio web del frigorífico.

**How to apply:** Si se necesita reutilizar el patrón de subrayado "corte de cuchillo" en otros nav links del proyecto, copiar el patrón `after:` de arriba. Si se modifica el Header, preservar el borde carmín como firma visual inamovible. Ver [[project-color-palette]] para los tokens.
