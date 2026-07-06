// Middleware genérico de validación con Zod.
// Recibe un schema y valida req.body ANTES de llegar al controller.
// Si falla, corta la cadena con 400 y devuelve los errores por campo.
// Si pasa, reemplaza req.body por los datos ya parseados (limpios y normalizados).
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: result.error.flatten().fieldErrors,
    })
  }

  req.body = result.data
  next()
}
