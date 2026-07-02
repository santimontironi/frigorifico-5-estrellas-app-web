---
name: component-import-products
description: Decisiones visuales para ImportProducts.tsx — panel dashboard premium con ghost table, eyebrow institucional, dropzone con badge circular, botones con íconos y paneles de feedback jerarquizados
metadata:
  type: project
---

Concepto: panel de ingesta de datos estilo dashboard premium — eyebrow con ícono de tabla + label institucional, ghost table estática decorativa tipo "data preview", dropzone con badge circular detrás del ícono, botones con Bootstrap Icons, paneles de resultado con layout icon+texto.

**Fondo e identidad — NO tocar:**
- Contenedor raíz: `bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col relative overflow-hidden`
- Overlay pinstripes: `repeating-linear-gradient(-35deg, ...)` — valor fijo en `style={{}}`
- 3 líneas diagonales carmesí absolutas: `via-[#9B2335]/15`, `/10`, `/12` — no tocar

**Cabecera (sesión 3 — elevación premium):**
- Wrapper: `relative z-10 px-6 py-7 md:px-10 md:py-9 border-b border-white/[0.07]`
- Eyebrow row: `flex items-center gap-2 mb-4`
  - Ícono `bi bi-table text-[#CFAE68] text-xs` + span `text-[#CFAE68] text-xs font-mono uppercase tracking-[0.2em]`
- h2: `text-[#F2EDE6] text-2xl md:text-3xl font-bold mb-2 tracking-tight`
- Subtítulo: `text-white/40 text-sm` — nuevo texto limpio sin chip de columnas (las columnas van en la ghost table)

**SIGNATURE — Ghost table "Formato esperado" (sesión 3 — nueva pieza estrella):**
- Label row: `flex items-center gap-2 mb-3` con `bi bi-info-circle text-[#CFAE68]/60 text-sm` + span `text-white/30 text-xs uppercase tracking-[0.18em] font-medium`
- Wrapper scroll: `overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.02]`
- Table: `w-full min-w-[360px] text-xs font-mono` — min-w garantiza scroll en mobile
- Header row: `bg-[#CFAE68]/[0.06] border-b border-white/[0.08]`
- th: `text-[#CFAE68] text-left px-4 py-3 font-medium tracking-wide`
- Filas de datos: `border-b border-white/[0.05]` (última sin border)
- td: `text-white/30 px-4 py-2.5`
- Datos: Bife de chorizo / Vacío / Pollo entero — productos reales de frigorífico argentino

**Dropzone con badge circular (sesión 3):**
- Label wrapper clases state: igual que sesión 2 pero `py-16 md:py-24` (reducido levemente para dar espacio a la table)
- Badge circular — wrapper nuevo: `w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300`
  - Sin archivo: `bg-white/[0.03] ring-1 ring-white/[0.06]`
  - Con archivo: `bg-[#CFAE68]/[0.12] ring-1 ring-[#CFAE68]/30`
- Ícono (dentro del badge): `bi bi-file-earmark-spreadsheet text-5xl md:text-6xl` (bajado de 7xl/8xl al estar en el badge)
- Texto principal + subtexto en `div flex-col items-center gap-1.5`
- Microcopy principal: `text-sm md:text-base max-w-xs` — estado binario igual que antes
- Subtexto estático: `text-white/20 text-xs text-center` — "Formatos soportados: .xlsx · .xls"

**Botones con íconos (sesión 3):**
- Botón Importar: `flex items-center gap-2 px-8 py-3 ...` + `bi bi-upload` aria-hidden
- Botón Limpiar: `flex items-center gap-2 px-6 py-3 ...` + `bi bi-arrow-counterclockwise` aria-hidden

**Paneles de feedback con layout icon+texto (sesión 3):**
- Éxito: wrapper `flex items-start gap-3` — `bi bi-check-circle-fill text-[#CFAE68] text-lg mt-0.5 shrink-0` + `div flex-1` con mensaje y sub-errores
- Error: wrapper `flex items-start gap-3` — `bi bi-exclamation-triangle-fill text-[#872F31] text-lg mt-0.5 shrink-0` + `<p>`

**Regla crítica establecida:**
- NUNCA usar comentarios `//` dentro del JSX return — solo `{/* */}` para evitar que se rendericen como texto visible

**Colores usados:**
- `#1C0A0E`, `#0F0507`, `#0A0A0A` — gradiente de fondo
- `#9B2335` — carmine, pinstripes y líneas diagonales
- `#F2EDE6` — bone, texto h2 y panel error
- `#CFAE68` — dorado, eyebrow, table header, dropzone activo, panel éxito
- `#F7EA79` — parchment, texto sobre botón carmesí
- `#872F31` — carmesí profundo, botón primario y panel error

Ver [[project-color-palette]] para tokens. Ver [[component-admin-login]] para patrón de borde izquierdo como indicador de estado.
