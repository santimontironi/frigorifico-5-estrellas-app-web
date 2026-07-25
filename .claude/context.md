## Contexto del proyecto

Aplicación web para un frigorífico llamado **5 Estrellas**. El sistema requiere que los clientes
se registren e inicien sesión para poder realizar pedidos. El registro solicita: nombre, apellido,
DNI, teléfono, correo electrónico y domicilio completo (calle, número, piso, departamento,
localidad y provincia). El panel de administración tiene su propia autenticación separada y
permite gestionar productos, categorías, ofertas y el estado de los pedidos.

Las ofertas son descuentos porcentuales sobre productos existentes.
Los productos tienen precio **por kilo** o **por unidad** según el tipo de corte o presentación,
y están organizados en las siguientes categorías: Achuras, Carne vacuna, Cerdo, Pollo,
Fiambrería, Quesería, Envasados, Envasados al vacío y Varios.

El flujo principal es: el usuario se registra o inicia sesión, navega el catálogo filtrado por
categoría, agrega productos al carrito y confirma el pedido. El pedido queda en estado `pendiente`
hasta que el admin lo revisa desde su panel. El admin puede aceptarlo —cargando el monto final
real tras el pesaje y la **fecha de entrega**, con lo que pasa a `en preparación`— o rechazarlo.
La fecha de entrega es obligatoria al aceptar: se le informa al cliente por mail y la ve en su
panel de pedidos.

La modalidad vigente es **pago y retiro en el local**: no hay pagos online. El cliente pasa por el
frigorífico a buscar su pedido y lo abona en el mostrador; el admin/empleado registra el cobro
desde el panel (`pagado`) y luego lo marca como `entregado`. El domicilio del cliente se sigue
pidiendo en el registro y se guarda como snapshot en el pedido, pero no se usa para la entrega:
queda disponible para cuando se habilite el envío a domicilio.

> La integración con **Mercado Pago Checkout Pro** (Preference + webhook + páginas de retorno)
> estuvo implementada y se retiró a pedido del cliente. Si vuelve el pago online, hay que reponer
> el SDK, el endpoint de pago, el webhook y las rutas `/pago/*` del frontend.

El flujo de estados completo es:
`pendiente → en preparación → pagado (cobro en el local) → entregado`
`pendiente → rechazado`
`pendiente → cancelado` (por el cliente)

Como el precio de los productos **por kilo** es estimado hasta que se pesa, el total del pedido
se considera aproximado. El precio de cada ítem se guarda como snapshot en el pedido para
preservar el historial ante futuros cambios de precio.

**Stack:** React con TypeScript en el frontend, Tailwind CSS para los estilos, Node.js/Express
en el backend, MongoDB con Mongoose como base de datos.

## Proxy del frontend (fix de cookies en iPhone/Safari)

El frontend y el backend están desplegados en dominios distintos de Vercel. Safari (iPhone)
bloquea las **cookies cross-site**, por lo que el login respondía OK pero la cookie de sesión
no se guardaba y el usuario no quedaba autenticado.

**Solución:** hacer que las llamadas a la API parezcan del **mismo origen** que el frontend,
usando un proxy vía *rewrites* de Vercel. El navegador cree que la API vive en el propio dominio
del frontend; Vercel reescribe el request al backend de forma invisible, convirtiendo la
comunicación en *same-site* y permitiendo que la cookie se acepte.

Tres piezas deben estar alineadas, todas con el prefijo `/api`:

1. **`frontend/.env`** → `VITE_BACKEND_URL=/api` (ruta **relativa**, no una URL absoluta al
   backend). Así el cliente HTTP del front usa URLs relativas que el proxy puede interceptar.
2. **`frontend/vercel.json`** → regla de rewrite que intercepta `/api/:path*` y lo redirige al
   backend real, preservando el path con el wildcard `:path*`:
   ```json
   { "source": "/api/:path*", "destination": "https://<backend>.vercel.app/api/:path*" }
   ```
   (La segunda rewrite `/(.*) → /index.html` es el fallback de SPA para React Router.)
3. **Backend** → todas las rutas se sirven bajo el namespace `/api`.

El prefijo `/api` no es mágico ni obligatorio: es simplemente el punto de acuerdo entre las tres
piezas. Lo importante es que `VITE_BACKEND_URL`, el `source` del rewrite y las rutas del backend
usen el **mismo** prefijo. Si cambia una, deben cambiar las tres.