import rateLimit from 'express-rate-limit'

// Estricto: para login y register. Frena fuerza bruta de contraseñas y spam de registros.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos que son para que se cuente el límite de intentos
  max: 10,                  // 10 intentos por IP en esa ventana
  message: { message: 'Demasiados intentos. Intentá de nuevo en unos minutos.' },
  standardHeaders: true, // significa que se enviarán los encabezados `RateLimit-*` en la respuesta
  legacyHeaders: false,  // significa que se enviarán los encabezados `X-RateLimit-*`
})

// General: para el resto de la API. Frena abuso general sin molestar el uso normal.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos que son para que se cuente el límite de solicitudes
  max: 200,                  // 200 solicitudes por IP en esa ventana
  message: { message: 'Demasiadas solicitudes. Probá más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})
