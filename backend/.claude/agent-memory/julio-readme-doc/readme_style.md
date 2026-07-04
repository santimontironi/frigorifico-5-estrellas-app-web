---
name: readme-style
description: Estilo y estructura de secciones aprobados para el README de Frigorífico 5 Estrellas
metadata:
  type: feedback
---

El README de este proyecto sigue un estilo ya establecido que debo preservar al editar (no reescribir desde cero salvo que se pida explícitamente):

- Header con emoji por sección (✨, 🛠️, 📁, 🚀, 🔑, 🔐, 📦, 📌, 💼, y ahora 🧪 para validación).
- Separadores `---` entre cada sección.
- Tabla de Tecnologías en formato `| Capa | Tecnología | Versión |`.
- Sección "Estructura del proyecto" con árbol de directorios en bloque de código, comentarios inline con `#` indicando qué contiene cada carpeta, y marcando explícitamente lo pendiente con "(+ pendientes: ...)".
- Sección "Estado de implementación" dividida en "### Listo" y "### Pendiente", listas simples sin sub-bullets.
- Tono: directo, sin relleno, orientado a que un reclutador entienda el proyecto en 30 segundos.

**Por qué:** el usuario (Santiago) ya tiene un README pulido y espera que las actualizaciones se integren respetando ese formato, no que se reestructure. Confirmado implícitamente al no recibir corrección tras integrar la sección de Zod siguiendo este mismo patrón.

**Cómo aplicar:** al agregar una feature nueva, insertar bullets/filas en las secciones existentes que correspondan (Características, Tecnologías, Estructura, Estado de implementación) y solo crear una sección nueva propia si la feature es transversal y merece explicación propia (como pasó con 🧪 Validación de datos, ubicada entre "Variables de entorno" y "Autenticación", mismo orden que en `.claude/spec.md`).

Ver [[project-overview]] y [[zod-validation-feature]].
