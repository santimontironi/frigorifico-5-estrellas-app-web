---
name: project-color-palette
description: Paleta real usada en el proyecto (frigorífico), distinta de la paleta genérica del prompt de sistema del agente
metadata:
  type: project
---

El prompt de sistema del agente define una paleta genérica (`#010101`, `#872F31`, `#CFAE68`, `#F7EA79`), pero el proyecto real ya evolucionó a una paleta propia de "frigorífico/carnicería" que es la que hay que seguir en la práctica:

- Fondo base: `#0A0A0A`, y gradientes de panel `from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]` (`bg-linear-to-br`)
- Carmín primario (interactivo, activo, íconos, acentos): `#9B2335`
- Rojo vino más oscuro (secundario, usado para estados de error / hover secundario): `#872F31`
- Dorado (detalles, precios, texto destacado, badges "próximamente"): `#F7EA79`
- Bone/parchment (texto sobre superficies claras o para jerarquía): `#F2EDE6`, `#C9BFB5`
- Superficie de sidebar: `#121212`
- Bordes neutros: `white/8`, `white/10`, `white/5` (no usar grises de Tailwind, siempre `white/opacidad`)

**Por qué:** `#872F31` se reserva para estados de error/secundarios (ver `ImportProducts.tsx`), nunca para texto de cuerpo ni para "tips" positivos — para evitar que un tip se lea como advertencia. `#F7EA79` es el color correcto para notas de ayuda/destacados no urgentes.

**Cómo aplicar:** cuando el prompt de sistema y el estado real del código difieran, priorizar el código real (grep en `admin/`, `ProductList.tsx`, `Home.tsx`) sobre la paleta genérica del system prompt. Ver [[component-welcomeadmin]], [[component-product-list]], y memoria de backend `component-importproducts-concept.md` para casos de uso concretos.
