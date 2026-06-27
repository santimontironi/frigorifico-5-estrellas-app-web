---
name: component-import-products
description: Decisiones visuales tomadas para ImportProducts.tsx — zona de importación de Excel con estados de archivo y resultado
metadata:
  type: project
---

Concepto: zona de drop con borde discontinuo dorado como invitación a soltar, que vira a carmesí en hover — los estados de archivo y resultado hablan con la misma gramática de bordes laterales del sistema (dorado para positivo, carmesí para error).

**Decisiones clave:**

- Contenedor raíz: `bg-[#010101]` — negro base del sistema (no `#1C1714` chamber)
- Header: `border-b border-white/10` — separador sutil, span de columnas en `text-[#CFAE68] font-mono`
- Drop zone normal: `border border-dashed border-[#CFAE68]/30 bg-[#CFAE68]/[0.02]` — invitación suave
- Drop zone con archivo: `border-[#CFAE68]/60 bg-[#CFAE68]/[0.04]` — más sólido, confirma selección
- Drop zone hover: `hover:border-[#872F31] hover:bg-[#872F31]/[0.05] hover:shadow-[0_0_24px_rgba(135,47,49,0.12)]` — glow carmesí sutil
- Ícono: `text-[#CFAE68]` con archivo / `text-[#CFAE68]/30` sin archivo — respuesta visual al estado
- Texto drop zone: `text-[#CFAE68] font-medium` con archivo / `text-white/50` sin archivo
- Botón Importar: `bg-[#872F31] text-white hover:ring-2 hover:ring-[#CFAE68] disabled:opacity-40` — patrón CTA primario
- Botón Limpiar: `border border-[#CFAE68]/40 text-[#CFAE68]/50 hover:border-[#CFAE68] hover:text-[#CFAE68]` — secundario dorado
- Card éxito: `border-l-2 border-[#CFAE68] bg-[#CFAE68]/[0.04]` — indicador positivo del sistema
- Errores de fila: `text-[#CFAE68]/50` label + `text-[#CFAE68]/40 font-mono` items — mono apagado, legible
- Card error: `border-l-2 border-[#872F31] bg-[#872F31]/[0.06]` — indicador de fallo del sistema

**Corrección aplicada:** el código original usaba `#9B2335` (carmine del Header/AdminLogin) — se reemplazó por `#872F31` según instrucción explícita del usuario para este componente.

**Patrón de className condicional usado:** ternarios en `className` con `fileName` existente del estado — no se tocó lógica, solo strings de clase.

Ver [[project-color-palette]] para tokens. Ver [[component-admin-login]] para patrón de borde izquierdo como indicador.
