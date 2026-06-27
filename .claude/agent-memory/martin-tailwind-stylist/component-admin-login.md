---
name: component-admin-login
description: Decisiones visuales tomadas para AdminLogin.tsx — página de acceso restringido del frigorífico
metadata:
  type: project
---

Concepto: antesala privada — fondo chamber→negro absoluto (sin rojo en el bg), tarjeta apenas emergente con sello carmín en borde izquierdo, tipografía tracked uppercase en labels, botón pesado y confiado.

**Decisiones clave:**

- `<main>` usa `bg-gradient-to-b from-[#1C1714] to-[#010101]` — gradiente vertical cálido a negro, sin rojo en el fondo (diferencia intencional de otras páginas)
- Eyebrow label: `text-[#9B2335] text-[10px] tracking-[0.3em] uppercase font-medium` — carmine muy pequeño y trackeado, evoca "zona restringida"
- Heading: `text-[#F2EDE6] text-2xl tracking-[0.05em] font-bold` — bone con leve tracking
- Tarjeta form: `bg-[#1C1714]/60 border border-[#9B2335]/20 border-l-2 border-l-[#9B2335] shadow-[0_24px_64px_rgba(0,0,0,0.85)]` — fondo translúcido chamber, whisper border, SELLO CARMÍN en borde izquierdo (firma visual central del componente)
- Error box: `border-l-2 border-l-[#9B2335] pl-4 py-3 bg-[#9B2335]/10` — mismo patrón de sello carmín, texto bone
- Labels: `text-[#C9BFB5] text-[10px] tracking-[0.2em] uppercase font-medium` — parchment, tracked uppercase
- Inputs: `bg-[#010101] border border-[#9B2335]/20 text-[#F2EDE6] ... focus:border-[#9B2335]` — negro absoluto "empotrado", foco en carmine pleno
- Placeholder: `placeholder:text-[#B8A898]/40` — ash muy suave
- Botón submit: `bg-[#8B1A2F] text-[#F2EDE6] tracking-[0.15em] uppercase ... hover:bg-[#A82640]` — mismo patrón que botón Admin del Header (admin-deep → ember)
- Footer: `text-[#B8A898]/40 text-xs tracking-[0.15em]` — ash casi invisible

**Diferenciación intencional respecto a páginas customer-facing:**
- Sin `#F7EA79` — ese dorado quedó descartado en este componente porque se sentía genérico
- Sin rojo en el fondo — el bg rojo era el problema más visible de la versión anterior
- Sin rounded en ningún elemento — bordes rectos, sobriedad premium

Ver [[project-color-palette]] para tokens. Ver [[component-header]] para consistencia del botón Admin.
