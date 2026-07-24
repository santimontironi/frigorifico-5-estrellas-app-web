# 🥩 Frigorífico 5 Estrellas — Pedidos Online

Aplicación web de pedidos para el frigorífico **5 Estrellas**. Los clientes navegan el catálogo, buscan productos, arman su carrito y confirman el pedido para que el administrador (o un empleado) lo revise, cargue el monto final tras el pesaje y lo pase a preparación. El cliente paga online mediante **Mercado Pago Checkout Pro** y sigue el estado del pedido desde su panel.

> El circuito completo —catálogo, búsqueda, ofertas, carrito, panel de administración, pedidos y pagos con Mercado Pago— está implementado de punta a punta. Ver [Estado de implementación](#-estado-de-implementación).

---

## ✨ Características principales

- Catálogo de productos con carga paginada ("ver más") y **búsqueda en tiempo real** por nombre
- Filtro por categoría (Achuras, Carne vacuna, Cerdo, Pollo, Fiambrería, Quesería, Envasados y más)
- Precios por kilo o por unidad
- Sistema de ofertas: el admin marca un producto con precio promocional y se muestra destacado en el home
- Carrito de compras persistente en `localStorage`, agregable desde el catálogo y desde las ofertas
- Panel de administración con secciones para productos, categorías, ofertas, **fotos del carrusel**, empleados, clientes y **pedidos**
- Importación masiva de productos desde un archivo Excel (crea categorías automáticamente si no existen)
- Carga de imágenes de productos y ofertas a Cloudinary
- **Fotos del carrusel del home gestionadas desde el panel:** el admin sube y elimina las imágenes que se muestran en el carrusel de la página de inicio
- Autenticación con tres roles (`user`, `admin`, `employee`) y rutas protegidas por rol en el frontend
- Alta de empleados desde el panel de admin, con vista inicial reducida (los empleados arrancan directo en la vista de pedidos)
- Baja de clientes y empleados desde el panel de admin
- Recuperación de contraseña por email y confirmación de cuenta por token
- **Circuito de pedidos completo:** el cliente confirma la compra, el admin/empleado carga el monto final tras el pesaje y lo pasa a preparación, y el cliente paga
- **Pago online con Mercado Pago Checkout Pro,** confirmado por webhook (con respaldo al volver del checkout para desarrollo)
- **Emails transaccionales** en cada evento del pedido (creado, cancelado, cambio de estado, pago confirmado)
- Historial de pedidos del usuario con seguimiento de estado
- Sesión persistente con JWT en cookie httpOnly
- Validación de datos con schemas de Zod compartidos entre frontend y backend

---

## 🛠️ Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React | 19 |
| Lenguaje | TypeScript | ~6.0 |
| Estilos | Tailwind CSS | 4 |
| Build | Vite | 8 |
| Router | React Router DOM | 7 |
| HTTP client | Axios | 1.x |
| Forms | react-hook-form + @hookform/resolvers | 7.x / 5.x |
| Notificaciones | SweetAlert2 | 11.x |
| Iconos | Bootstrap Icons | 1.x |
| Backend | Node.js + Express | 5.x |
| Base de datos | MongoDB + Mongoose | 9.x |
| Autenticación | JWT + bcrypt | 9.x / 6.x |
| Validación | Zod (schemas compartidos en `shared/`) | 4.x |
| Rate limiting | express-rate-limit | 8.x |
| Importación de datos | xlsx (lectura de Excel) | 0.18.x |
| Subida de archivos | Multer (memoryStorage) | 2.x |
| Imágenes | Cloudinary | 2.x |
| Email | Nodemailer | 9.x |
| Pagos | SDK de Mercado Pago (Checkout Pro) | 3.x |

---

## 📁 Estructura del proyecto

```
frigorifico-5-estrellas/
├── backend/
│   ├── index.js               # Entry point
│   ├── server.js              # Conexión a BD y app.listen()
│   ├── app.js                 # Express: middlewares globales + rutas
│   ├── config/                # cookie, db, mail (Nodemailer), cloudinary, mercadopago
│   ├── models/                # User (roles user/admin/employee), Category, Product, Offer, Photo, OrderItem, Order
│   ├── controllers/           # auth, user, admin, product, category, offer, photo, contact, order
│   ├── repository/            # user, product, category, offer, photo, order
│   ├── routes/                # auth, user, admin, product, category, offer, photo, contact, order (todas montadas)
│   ├── middlewares/           # verifyAuth.js, verifyRole.js, validate.js (Zod), rateLimiters.js, multer.js
│   └── utils/                 # order.mail.js (mails transaccionales de pedidos)
│
├── shared/                    # Schemas de Zod compartidos entre backend y frontend (standalone)
│   ├── package.json
│   ├── index.js               # Re-exporta todos los schemas
│   └── schemas/                # auth, admin, user, product, category, offer, photo, order, contact
│
└── frontend/
    └── src/
        ├── context/           # Auth, Admin, User, Product, Category, Offer, Photo, Cart, Order
        ├── hooks/              # UseAuth, UseAdmin, UseUser, useProducts, useCategory, useOffer, usePhoto, useCart, useOrder
        ├── pages/
        │   ├── admin/          # AdminPanel (productos, categorías, ofertas, fotos, empleados, clientes, pedidos)
        │   ├── auth/           # Login, Register, Confirm, ChangePassword
        │   ├── user/           # UserPanel
        │   └── public/         # Home, Cart, Contact, AboutUs, PaymentSuccess/Failure/Pending
        ├── components/         # admin/*, products/*, category/*, cart/*, payment/*, user/*, ui/*
        ├── services/           # api.ts (Axios) + servicios por dominio
        └── types/              # tipos TypeScript por dominio
```

---

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js >= 18
- MongoDB corriendo localmente o URI de MongoDB Atlas

### Backend

```bash
cd backend
npm install
# Crear el archivo .env con las variables listadas más abajo
npm run dev
# Servidor en http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
# Crear el archivo .env con las variables listadas más abajo
npm run dev
# App en http://localhost:5173
```

---

## 🔑 Variables de entorno

### `backend/.env`

```env
PORT=3001
MONGO_URL=mongodb://localhost:27017/frigorifico5estrellas
JWT_SECRET=supersecretkey
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=                      # URL pública del back para el webhook de MP; vacío en desarrollo
NODEMAILER_USER=correo@ejemplo.com
NODEMAILER_PASS=password_de_correo
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxx
MP_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:3001/api
```

> La variable de Mongo es `MONGO_URL` (no `MONGO_URI`). La URL del frontend desde el backend es `FRONTEND_URL` (no `CLIENT_URL`). El cliente Axios usa `VITE_BACKEND_URL`. En producción, `VITE_BACKEND_URL=/api` para aprovechar el proxy de Vercel (evita el bloqueo de cookies cross-site en Safari/iPhone). `BACKEND_URL` solo se usa para el `notification_url` del webhook de Mercado Pago.

---

## 🧪 Validación de datos

Los schemas de validación viven en `shared/`, una carpeta standalone (con su propio `package.json` y sin npm workspaces) compartida entre backend y frontend mediante rutas relativas.

- **Backend:** middleware genérico `validate(schema)` que corre `safeParse` sobre `req.body` antes del controller. Si falla, corta con `400` y los errores por campo.
- **Frontend:** los formularios usan react-hook-form con `zodResolver`, y los tipos se derivan de los schemas con `z.infer` en vez de interfaces manuales.
- **Por qué:** la validación del frontend es una mejora de UX (feedback inmediato); la seguridad real siempre la garantiza el backend, que valida en todos los casos.

---

## 🔐 Autenticación y roles

La sesión se maneja con un JWT almacenado en cookie httpOnly, con tres roles posibles: `user` (cliente), `employee` y `admin`.

- Login unificado: `POST /api/login` con `{ email, password }`
- El registro de clientes requiere confirmación de cuenta por email (`GET /api/confirm/:token`)
- Los empleados son dados de alta por un admin desde el panel (`POST /api/register/employee`), no se registran solos
- `GET /api/me` restaura la sesión al montar la app; `GET /api/profile` trae el perfil completo
- En el frontend, `VerifyAuth` protege rutas por rol (por ejemplo `/panel-admin` acepta `admin` y `employee`, con vistas distintas para cada uno)
- Recuperación de contraseña por token vía `POST /api/change-password` y `POST /api/change-password/:token`

---

## 📦 API — Endpoints implementados

Base URL: `http://localhost:3001/api`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/register/user` | — | Registrar nuevo cliente |
| POST | `/register/admin` | — | Crear admin |
| POST | `/register/employee` | admin | Crear empleado |
| POST | `/login` | — | Login unificado (cliente, admin o empleado) |
| POST | `/logout` | — | Limpia la cookie de sesión |
| GET | `/confirm/:token` | — | Confirma la cuenta de un cliente recién registrado |
| GET | `/me` | token | Devuelve `{ id, role }` del JWT activo |
| GET | `/profile` | token | Perfil completo del usuario autenticado |
| POST | `/change-password` | — | Solicita el email de recuperación de contraseña |
| POST | `/change-password/:token` | — | Confirma el cambio de contraseña |
| PATCH | `/profile` | user | Edita el perfil del cliente autenticado |
| GET | `/products` | — | Lista todos los productos |
| GET | `/products/:id` | — | Detalle de un producto |
| PATCH | `/products/:id` | admin | Edita un producto (con imagen opcional) |
| DELETE | `/products/:id` | admin | Elimina un producto |
| POST | `/products/import` | admin | Importa productos en lote desde un Excel |
| GET | `/categories` | admin | Lista todas las categorías |
| POST | `/categories` | admin | Crea una categoría |
| DELETE | `/categories/:id` | admin | Elimina una categoría |
| GET | `/offers` | — | Lista las ofertas activas |
| POST | `/offers` | admin | Crea una oferta sobre un producto (con imagen opcional) |
| DELETE | `/offers/:id` | admin | Elimina una oferta |
| GET | `/photos` | — | Lista las fotos del carrusel del home |
| POST | `/photos` | admin | Sube una foto al carrusel (imagen obligatoria) |
| DELETE | `/photos/:id` | admin | Elimina una foto del carrusel (también de Cloudinary) |
| GET | `/admin/customers` | admin | Lista los clientes registrados |
| DELETE | `/admin/customers/:id` | admin | Da de baja a un cliente |
| GET | `/admin/employees` | admin | Lista los empleados |
| DELETE | `/admin/employees/:id` | admin | Da de baja a un empleado |
| POST | `/orders` | user | Crea un pedido desde el carrito |
| GET | `/orders` | user | Historial de pedidos del usuario |
| PATCH | `/orders/:id/cancel` | user | Cancela un pedido propio (solo si está pendiente) |
| GET | `/orders/all` | admin, employee | Lista todos los pedidos |
| PATCH | `/orders/:id/status` | admin, employee | Cambia el estado del pedido (carga `finalAmount`, rechazo, etc.) |
| POST | `/orders/:id/pay` | user | Crea la preferencia de Mercado Pago; devuelve `init_point` |
| POST | `/orders/payment/confirm` | user | Confirma el pago al volver del checkout (respaldo del webhook) |
| POST | `/orders/payment/webhook` | — | Webhook de Mercado Pago; marca el pedido como pagado |
| POST | `/contact` | — | Envía un mensaje desde el formulario de contacto |

---

## 📌 Estado de implementación

### Listo

- Modelos de MongoDB: `User` (con roles `user`/`admin`/`employee`), `Category`, `Product`, `Offer`, `OrderItem`, `Order`
- Auth completa con 3 roles, confirmación de cuenta por email y recuperación de contraseña
- CRUD de productos (con edición de imagen) e importación masiva vía Excel
- CRUD de categorías, con creación automática al importar productos
- Sistema de ofertas: alta, listado y baja, con precio promocional aplicado en el home
- Fotos del carrusel del home: alta y baja desde el panel de admin, servidas al carrusel de la página de inicio
- Carrito de compras persistente en `localStorage` (agregar, quitar, actualizar cantidad, vaciar)
- Búsqueda de productos en tiempo real en el home
- Panel de administración con secciones de productos, importación, categorías, ofertas, fotos del carrusel, empleados, clientes y pedidos
- Baja de clientes y empleados desde el panel de admin
- Subida de imágenes a Cloudinary para productos, ofertas y fotos del carrusel
- **Flujo de pedidos completo:** creación desde el carrito, cancelación, listado del usuario y gestión de estado por admin/empleado
- **Pago con Mercado Pago Checkout Pro:** creación de preferencia, webhook de confirmación e idempotencia, con respaldo al volver del checkout (para desarrollo sin URL pública)
- **Emails transaccionales** en cada evento del pedido (creado, cancelado, cambio de estado, pago confirmado)
- Historial de pedidos del usuario con seguimiento de estado y polling
- Validación con Zod (schemas compartidos en `shared/`) en todos los endpoints que reciben datos

### Pendiente / en curso

- Pruebas end-to-end del pago real de Mercado Pago en producción (con `BACKEND_URL` pública y webhook efectivo)
- Ajustes finos de UX en el panel de pedidos

---

## 💼 Flujo de negocio

```
Usuario navega el catálogo sin login
  → Agrega productos al carrito (persistente en localStorage)
  → Inicia sesión (o se registra y confirma su cuenta por email)
  → Confirma pedido → status: "pending"
        ↓
Admin/empleado revisa el pedido desde su panel
  → Rechaza → status: "rejected"
  → Acepta con monto final (tras el pesaje) → status: "in_preparation"
        ↓
Usuario ve el pedido en preparación y el monto real
  → Hace clic en "Pagar" → Mercado Pago Checkout Pro
        ↓
Webhook de MP (o confirmación del front al volver) → status: "paid"
        ↓
Admin/empleado marca entregado → status: "delivered"

El usuario puede cancelar su pedido solo mientras está "pending".
```

---

## 👤 Autor

Santiago Montironi — santiimontironi@gmail.com
