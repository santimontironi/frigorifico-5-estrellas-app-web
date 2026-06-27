---
name: project-color-palette
description: Tokens de color reales del proyecto Frigorífico 5 Estrellas — difieren de la paleta genérica del sistema
metadata:
  type: project
---

El proyecto usa su propia paleta aprobada por el cliente, que tiene precedencia sobre la paleta genérica definida en el system prompt del agente. Cuando el usuario provee un plan de diseño con tokens específicos, esos tokens son los autoritativos.

**Tokens de color del proyecto:**

| Nombre | Hex | Uso |
|---|---|---|
| chamber | `#1C1714` | Fondo del header |
| carmine | `#9B2335` | Acento principal — borde header, estrella, subrayado nav, botón admin bg base |
| ember | `#A82640` | Hover del botón Admin (versión más brillante de carmine) |
| admin-deep | `#8B1A2F` | Fondo resting del botón Admin (más oscuro que carmine para profundidad) |
| bone | `#F2EDE6` | Texto primario sobre fondos oscuros |
| parchment | `#C9BFB5` | Nav links, texto secundario |
| ash | `#B8A898` | Subtexto, etiqueta "Frigorífico" en el logo |

**Why:** El cliente aprobó esta paleta específica para la marca "Frigorífico 5 Estrellas" — tonos tierra/carmín que evocan carne premium y tradición carnicera.

**How to apply:** Cuando el usuario dé un plan de diseño con estos tokens, usarlos exactamente. Si el usuario no especifica tokens, preferir estos sobre los colores del system prompt genérico. Nunca sustituir por colores Tailwind semánticos (gray, red, etc.).
