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
hasta que el admin lo revisa desde su panel. El admin puede aceptarlo (cargando el monto final
real tras el pesaje) o rechazarlo. Si se acepta, el cliente recibe la notificación y puede pagar
desde su panel de pedidos mediante **Mercado Pago Checkout Pro** (redirect). Una vez confirmado el
pago por webhook de Mercado Pago, el pedido avanza a `pagado` y el admin lo ve reflejado en el
panel para continuar con `en preparación → entregado`.

El flujo de estados completo es:
`pendiente → aceptado → pagado → en preparación → entregado`
`pendiente → rechazado`

Como el precio de los productos **por kilo** es estimado hasta que se pesa, el total del pedido
se considera aproximado. El precio de cada ítem se guarda como snapshot en el pedido para
preservar el historial ante futuros cambios de precio.

**Stack:** React con TypeScript en el frontend, Tailwind CSS para los estilos, Node.js/Express
en el backend, MongoDB con Mongoose como base de datos.