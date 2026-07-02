---
name: component-welcomeadmin
description: Decisiones visuales para WelcomeAdmin.tsx — vista de bienvenida del panel admin (default view del dashboard)
metadata:
  type: project
---

Concepto: portada editorial del panel admin — mismo lenguaje visual que `ImportProducts.tsx` (gradiente de fondo + `DiagonalLines` + header con eyebrow), seguido de una grilla de "accesos rápidos" puramente presentacional que refleja las secciones de `SideNavAdmin` (sin lógica ni onClick).

**Estructura (`frontend/src/components/admin/WelcomeAdmin.tsx`):**
- Contenedor raíz: `bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]` + `<DiagonalLines />` (mismo patrón que ImportProducts)
- Header: eyebrow `bi bi-shop` + "Panel admin", `h1` "Hola, administrador" `text-2xl md:text-4xl font-bold`
- Accesos rápidos: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6` — 3 cards reales (Productos, Agregar producto, Importar productos) generadas desde un array local `quickActions` (solo para no repetir JSX, sin estado/props) + 1 card hardcodeada "Pedidos" con estado atenuado (`opacity-60`, `border-dashed`) y badge dorado "Próximamente", coherente con el `orders` disabled en `AdminPanel.tsx`
- Cards reales: `border-l` que crece en hover (`scale-y-0` → `scale-y-100` en `group-hover`), mismo motivo que `ProductList.tsx`. **Decisión:** sin `cursor-pointer` — son puramente presentacionales sin navegación real, así que se evitó dar una afordancia de clic engañosa
- Nota de tip al final: `border-l-4 border-[#F7EA79]/50 bg-[#F7EA79]/5` — dorado en vez de carmesí/vino, para no leerse como error (ver [[project-color-palette]])

Ver [[project-color-palette]] para tokens de color reales del proyecto (distintos de la paleta genérica del prompt de sistema). Ver [[component-importproducts-concept]] (memoria de backend) para el patrón de gradiente + DiagonalLines reutilizado acá.
