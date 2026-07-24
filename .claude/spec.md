# Spec técnico — Frigorífico 5 Estrellas

## Índice
1. [Descripción general](#descripción-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura de directorios](#estructura-de-directorios)
4. [Modelos de base de datos](#modelos-de-base-de-datos)
5. [API — Rutas y endpoints](#api--rutas-y-endpoints)
6. [Middlewares](#middlewares)
7. [Validación (Zod + schemas compartidos)](#validación-zod--schemas-compartidos)
8. [Autenticación y autorización](#autenticación-y-autorización)
9. [Estado global en el frontend (Context + Hooks)](#estado-global-en-el-frontend-context--hooks)
10. [Flujo principal de negocio](#flujo-principal-de-negocio)
11. [Reglas de negocio](#reglas-de-negocio)
12. [Variables de entorno](#variables-de-entorno)
13. [Estado de implementación](#estado-de-implementación)

---

## Descripción general

Aplicación web de pedidos online para el frigorífico **5 Estrellas**. Los clientes se registran (con confirmación de cuenta por email), navegan el catálogo filtrado por categoría, buscan productos en tiempo real, agregan al carrito y confirman un pedido. El administrador (o un empleado) revisa cada pedido, carga el monto final real (tras el pesaje) y lo pasa a preparación o lo rechaza. Cuando el pedido está en preparación, el cliente paga online mediante **Mercado Pago Checkout Pro**. El pago se confirma vía webhook y, como respaldo (útil en desarrollo sin URL pública), también al volver del checkout con el `payment_id`.

El sistema tiene **una sola autenticación unificada** con tres roles:
- **`user`** (cliente) — registro público + confirmación por email.
- **`admin`** — gestión de productos, categorías, ofertas, empleados, clientes y pedidos.
- **`employee`** — dado de alta por un admin; gestiona pedidos (no tiene acceso a la gestión del catálogo/usuarios).

Toda la sesión usa la misma cookie JWT; el rol viaja en el payload del token.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React | 19 |
| Lenguaje front | TypeScript | ~6.0 |
| Estilos | Tailwind CSS | 4 |
| Build tool | Vite | 8 |
| Router | React Router DOM | 7 |
| HTTP client | Axios | 1.x |
| Forms | react-hook-form + @hookform/resolvers | 7.x / 5.x |
| Notificaciones UI | SweetAlert2 | 11.x |
| Iconos | Bootstrap Icons | 1.x |
| Backend | Node.js + Express | 5.x |
| Base de datos | MongoDB + Mongoose | 9.x |
| Autenticación | JWT (jsonwebtoken) | 9.x |
| Hashing | bcrypt | 6.x |
| Cookies | cookie-parser | 1.x |
| Validación | Zod (schemas compartidos en `shared/`) | 4.x |
| Rate limiting | express-rate-limit | 8.x |
| Importación de datos | xlsx (lectura de Excel) | 0.18.x |
| Subida de archivos | Multer (memoryStorage) | 2.x |
| Imágenes | Cloudinary | 2.x |
| Email | Nodemailer | 9.x |
| Pagos | SDK de Mercado Pago (Node) | 3.x |
| Dev server | Nodemon | 3.x |

---

## Estructura de directorios

```
frigorifico-5-estrellas/
├── backend/
│   ├── index.js               # entry point: importa y llama startServer()
│   ├── server.js              # connectDB() + app.listen()
│   ├── app.js                 # configura Express: middlewares globales + monta rutas
│   ├── .env
│   ├── config/
│   │   ├── cookie.js              # objeto cookieOptions (httpOnly, secure, sameSite, maxAge)
│   │   ├── db.config.js           # función connectDB()
│   │   ├── mail.config.js         # transporter de Nodemailer
│   │   ├── cloudinary.config.js   # cliente de Cloudinary
│   │   └── mercadopago.config.js  # cliente del SDK de Mercado Pago
│   ├── models/
│   │   ├── user.model.js          # colección única con role: user | admin | employee
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── offer.model.js
│   │   ├── orderItem.model.js
│   │   └── order.model.js
│   ├── controllers/
│   │   ├── auth.controller.js     # register, registerAdmin, registerEmployee, login, logout, confirmUser, me, profile
│   │   ├── user.controller.js     # changePassword, changePasswordConfirm, editProfile
│   │   ├── admin.controller.js    # getEmployees, deleteEmployee, getCustomers, deleteCustomer
│   │   ├── product.controller.js  # getAllProducts, getProductById, updateProductById, deleteProductById, importFromExcel
│   │   ├── category.controller.js # createCategory, getAllCategories, deleteCategoryById
│   │   ├── offer.controller.js    # createOffer, getAllOffers, deleteOffer
│   │   └── order.controller.js    # createOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus, createPayment, confirmPayment, paymentWebhook
│   ├── repository/
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   ├── category.repository.js
│   │   ├── offer.repository.js
│   │   └── order.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── admin.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── offer.routes.js
│   │   ├── contact.routes.js
│   │   └── order.routes.js
│   ├── middlewares/
│   │   ├── verifyAuth.js      # valida JWT e inyecta req.auth con { id, role }
│   │   ├── verifyRole.js      # factory: verifyRole('admin', 'employee') — acepta múltiples roles
│   │   ├── validate.js        # validate(schema): valida req.body con un schema de Zod (shared)
│   │   ├── rateLimiters.js    # apiLimiter (general) + authLimiter (estricto para auth)
│   │   └── multer.js          # uploadImage (memoryStorage) + uploadExcel — hacia Cloudinary / xlsx
│   └── utils/
│       └── order.mail.js      # sendOrderCreatedMail, sendOrderCanceledMail, sendOrderStatusChangedMail, sendOrderPaidMail
│
├── shared/                    # schemas de Zod compartidos back ↔ front (standalone, sin workspaces)
│   ├── package.json           # "type": module + dep zod; node_modules propio
│   ├── index.js               # re-exporta todos los schemas
│   └── schemas/
│       ├── auth.schema.js
│       ├── admin.schema.js
│       ├── contact.schema.js
│       ├── category.schema.js
│       ├── product.schema.js
│       ├── user.schemas.js
│       ├── offer.schemas.js
│       └── order.schema.js
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx           # ReactDOM root — solo renderiza <App />
        ├── App.tsx            # Árbol de providers + React Router
        ├── index.css
        ├── context/
        │   ├── AuthContext.tsx       # sesión unificada user/admin/employee
        │   ├── AdminContext.tsx      # empleados y clientes (panel admin)
        │   ├── UserContext.tsx       # perfil y edición del usuario
        │   ├── ProductContext.tsx    # catálogo + filtro por categoría
        │   ├── CategoryContext.tsx   # categorías
        │   ├── OfferContext.tsx      # ofertas
        │   ├── CartContext.tsx       # carrito (memoria + localStorage)
        │   └── OrderContext.tsx      # pedidos: crear, listar, cancelar, pagar, confirmar pago
        ├── hooks/
        │   ├── UseAuth.tsx
        │   ├── UseAdmin.tsx
        │   ├── UseUser.tsx
        │   ├── useProducts.tsx
        │   ├── useCategory.tsx
        │   ├── useOffer.tsx
        │   ├── useCart.tsx
        │   └── useOrder.tsx
        ├── pages/
        │   ├── public/       # Home, Cart, Contact, AboutUs, PaymentSuccess, PaymentFailure, PaymentPending
        │   ├── auth/         # Login, Register, Confirm, ChangePassword
        │   ├── user/         # UserPanel
        │   └── admin/        # AdminPanel
        ├── components/
        │   ├── admin/        # products, categories, offers, employees, customers, orders, layout
        │   ├── auth/         # VerifyAuth
        │   ├── cart/         # CheckoutModal
        │   ├── category/     # CategoryCard
        │   ├── payment/      # PaymentResultLayout
        │   ├── products/     # ProductCard, ProductInCart, Features
        │   ├── user/
        │   └── ui/           # Header, FormSearch, OfferCard, OffersHome, Loader, ImageCarousel, etc.
        ├── services/         # api.ts (Axios) + auth, user, admin, product, categories, offer, order, contact
        └── types/            # auth, user, admin, product, category, offer, cart, order, general
```

---

## Modelos de base de datos

### User (colección unificada con roles)

```js
// models/user.model.js
{
  role: { type: String, enum: ['user', 'admin', 'employee'], default: 'user' },

  // Comunes a todos los roles
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, min: 8 },

  // Requeridos solo cuando role === 'user' (validador condicional onlyUser)
  firstName: { type: String, trim: true, required: onlyUser },
  lastName:  { type: String, trim: true, required: onlyUser },
  dni:       { type: String, unique: true, sparse: true, trim: true, required: onlyUser },
  phone:     { type: String, trim: true, required: onlyUser },
  address: {
    street:    { type: String, required: onlyUser },
    number:    { type: String, required: onlyUser },
    floor:     { type: String, default: '' },     // opcional
    apartment: { type: String, default: '' },     // opcional
    city:      { type: String, required: onlyUser },
    province:  { type: String, required: onlyUser }
  },

  confirmed: { type: Boolean, default: false },   // cuenta confirmada por email
  active:    { type: Boolean, default: true },    // baja lógica de clientes/empleados
  createdAt: { type: Date, default: Date.now }
}
```

> No hay un modelo `Admin` separado: admins y empleados son documentos de la misma colección `User` con `role` distinto. Los campos personales (`firstName`, `dni`, `address`, etc.) solo son obligatorios para clientes (`onlyUser`). `dni` es `unique` + `sparse` para que admins/empleados sin DNI no colisionen.

---

### Category

```js
// models/category.model.js
{
  name:   { type: String, required: true, unique: true, trim: true },
  active: { type: Boolean, default: true }
}
```

---

### Product

```js
// models/product.model.js
{
  name:      { type: String, required: true, trim: true },
  category:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price:     { type: Number, required: true, min: 0 },
  unit:      { type: String, enum: ['kg', 'unit'], required: true },
  image:     { type: String, default: null },   // URL de Cloudinary — opcional
  active:    { type: Boolean, default: true },
  // timestamps: true → createdAt y updatedAt
}
```

> `unit: 'kg'` → precio estimado hasta que se pesa el corte.

---

### Offer

```js
// models/offer.model.js
{
  image:     { type: String, required: false },   // imagen propia de la oferta (Cloudinary)
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  newPrice:  { type: Number, required: true },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

> `newPrice` reemplaza al precio base cuando la oferta está activa. Las ofertas se muestran destacadas en el home.

---

### OrderItem

```js
// models/orderItem.model.js
{
  product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nameSnapshot:  { type: String, required: true },
  priceSnapshot: { type: Number, required: true },
  unitSnapshot:  { type: String, enum: ['kg', 'unit'], required: true },
  quantity:      { type: Number, required: true, min: 0.1 },
  subtotal:      { type: Number, required: true }
}
```

---

### Order

```js
// models/order.model.js
{
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],

  approximateTotal: { type: Number, required: true },
  finalAmount:      { type: Number, default: null },

  status: {
    type: String,
    enum: ['pending', 'rejected', 'paid', 'in_preparation', 'delivered', 'canceled'],
    default: 'pending'
  },

  rejectionReason: { type: String, default: '' },

  mercadoPagoPayment: {
    preferenceId: { type: String, default: '' },
    paymentId:    { type: String, default: '' },
    status:       { type: String, default: '' }   // 'approved' | 'pending' | 'rejected'
  },

  deliveryAddress: {
    street:    String,
    number:    String,
    floor:     String,
    apartment: String,
    city:      String,
    province:  String
  },

  notesUser:  { type: String, default: '' },   // nota que deja el cliente al comprar
  notesAdmin: { type: String, default: '' },   // nota del admin al gestionar el pedido
  // timestamps: true
}
```

> No hay estado `accepted`: al aceptar, el admin pasa el pedido directo a `in_preparation` (cargando `finalAmount`). El pago se habilita en ese estado.

---

## API — Rutas y endpoints

Base URL: `http://localhost:3001/api`
Montaje en `app.js` (todas bajo el namespace `/api`, con `apiLimiter` general):
```js
app.use('/api', apiLimiter)
app.use('/api', authRouter)
app.use('/api', adminRouter)
app.use('/api', userRouter)
app.use('/api', productRouter)
app.use('/api', categoryRouter)
app.use('/api', contactRouter)
app.use('/api', offerRouter)
app.use('/api', orderRouter)
```

### Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/register/user` | — | Registrar nuevo cliente (envía email de confirmación) |
| POST | `/api/register/admin` | — | Crear admin |
| POST | `/api/register/employee` | admin | Crear empleado |
| POST | `/api/login` | — | Login unificado (cliente/admin/empleado); cookie httpOnly + `{ id, role }` |
| POST | `/api/logout` | — | Limpia la cookie `token` |
| GET | `/api/confirm/:token` | — | Confirma la cuenta de un cliente recién registrado |
| GET | `/api/me` | token | Devuelve `{ id, role }` del JWT activo — no consulta BD |
| GET | `/api/profile` | token | Perfil completo del usuario autenticado |

### Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/change-password` | — | Solicita el email de recuperación de contraseña |
| POST | `/api/change-password/:token` | — | Confirma el cambio de contraseña |
| PATCH | `/api/profile` | user | Edita el perfil del cliente autenticado |

### Administración (empleados y clientes)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/admin/employees` | admin | Lista los empleados |
| DELETE | `/api/admin/employees/:id` | admin | Da de baja a un empleado |
| GET | `/api/admin/customers` | admin | Lista los clientes registrados |
| DELETE | `/api/admin/customers/:id` | admin | Da de baja a un cliente |

### Productos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/products` | — | Listar todos los productos |
| GET | `/api/products/:id` | — | Detalle de un producto |
| PATCH | `/api/products/:id` | admin | Editar producto (imagen opcional vía multer/Cloudinary) |
| DELETE | `/api/products/:id` | admin | Eliminar producto |
| POST | `/api/products/import` | admin | Importar productos en lote desde un Excel (crea categorías faltantes) |

### Categorías

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/categories` | admin | Listar todas las categorías |
| POST | `/api/categories` | admin | Crear categoría |
| DELETE | `/api/categories/:id` | admin | Eliminar categoría |

### Ofertas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/offers` | — | Listar ofertas activas |
| POST | `/api/offers` | admin | Crear oferta sobre un producto (imagen opcional) |
| DELETE | `/api/offers/:id` | admin | Eliminar oferta |

### Contacto

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/contact` | — | Envía un mensaje desde el formulario de contacto |

### Pedidos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/orders` | user | Crear pedido desde el carrito (snapshots de precio y domicilio) |
| GET | `/api/orders` | user | Historial de pedidos del usuario |
| PATCH | `/api/orders/:id/cancel` | user | Cancelar un pedido propio (solo si está `pending`) |
| GET | `/api/orders/all` | admin, employee | Listar todos los pedidos |
| PATCH | `/api/orders/:id/status` | admin, employee | Cambiar estado del pedido (con `finalAmount`, `rejectionReason`, `notesAdmin`) |
| POST | `/api/orders/:id/pay` | user | Crear Preference en MP; devuelve `{ init_point, preferenceId }` |
| POST | `/api/orders/payment/confirm` | user | Confirmar el pago al volver del checkout (respaldo del webhook); body `{ paymentId }` |
| POST | `/api/orders/payment/webhook` | — (pública) | Webhook de MP; consulta el pago y marca el pedido como `paid` |

---

## Middlewares

### `verifyAuth.js`

Extrae el JWT de la cookie httpOnly, lo verifica con `JWT_SECRET` e inyecta `req.auth = { id, role }`. Retorna `401` si el token no existe o es inválido.

### `verifyRole.js`

Factory que recibe **uno o varios** roles esperados y retorna un middleware. Valida `req.auth.role` contra la lista. Retorna `403` si no coincide.

```js
router.get('/orders/all', verifyAuth, verifyRole('admin', 'employee'), ...)
router.patch('/profile',  verifyAuth, verifyRole('user'),  ...)
```

### `validate.js`

Middleware genérico `validate(schema)`. Ejecuta `schema.safeParse(req.body)`; si falla responde `400` con `error.flatten().fieldErrors` y **no llega al controller**; si pasa, reemplaza `req.body` con los datos parseados. Solo aplica a requests con body. Ver [Validación (Zod + schemas compartidos)](#validación-zod--schemas-compartidos).

### `rateLimiters.js`

Rate limiting de dos niveles (`express-rate-limit`): `apiLimiter` general aplicado a toda la API en `app.js`, y `authLimiter` estricto para los endpoints de autenticación (anti brute-force / spam de registro). Requiere `trust proxy` configurado (`app.set('trust proxy', 1)`).

### `multer.js`

Dos uploaders sobre `memoryStorage`:
- `uploadImage` — imágenes de productos y ofertas; el buffer se sube a Cloudinary.
- `uploadExcel` — archivo `.xlsx` para la importación masiva de productos (se parsea con `xlsx`).

---

## Validación (Zod + schemas compartidos)

La validación se centraliza en **schemas de Zod** compartidos entre backend y frontend, en una carpeta `shared/` **standalone** (sin npm workspaces).

### Estructura de `shared/`

- `shared/package.json` (`"type": "module"`, dep `zod` 4.x) con su propio `node_modules`.
- `shared/schemas/*.schema.js` — schemas en **JS plano (ESM)**, re-exportados desde `shared/index.js`.
- Se importa con **ruta relativa**: en el back `'../../shared/index.js'`; en el front `'../../../shared/index.js'` (un nivel más por el `src/`).

### Schemas definidos (por dominio)

| Archivo | Schemas principales |
|---|---|
| `auth.schema.js` | `loginSchema`, `userRegisterSchema`, `adminRegisterSchema`, `authResponseSchema` |
| `admin.schema.js` | schemas del panel admin |
| `user.schemas.js` | `ChangePasswordSchema`, `ResetPasswordSchema`, `EditProfileSchema` |
| `product.schema.js` | `updateProductSchema` y schemas de producto |
| `category.schema.js` | `createCategorySchema` |
| `offer.schemas.js` | `createOfferSchema` |
| `order.schema.js` | `createOrderSchema`, `updateOrderStatusSchema`, `orderSchema`, `orderAdminSchema`, y responses (`createOrderResponse`, `getOrdersResponse`, `payOrderResponse`, etc.) |
| `contact.schema.js` | `contactSchema` |

### Backend — validación de requests

`validate(schema)` se cablea en las rutas antes del controller. Valida `req.body`, por lo que solo aplica a requests con body (POST/PATCH). Los GET no llevan body; su "input" es la cookie JWT (la valida `verifyAuth`).

### Frontend — forms y responses

- **Forms:** react-hook-form + `zodResolver`. `useForm({ resolver: zodResolver(schema) })` y `register('campo')` sin reglas inline. Para campos anidados: `register('address.street')`.
- **Tipos:** derivados con `z.infer<typeof schema>` — única fuente de verdad; reemplazan interfaces manuales.
- **Responses:** validados en la capa de service con `schema.parse(data)`; el service devuelve el dato ya parseado.
- **Config:** `zod` (misma versión que `shared`) y `@hookform/resolvers` como deps del front; `"allowJs": true` en `tsconfig.app.json` para que TS lea los schemas `.js` e infiera tipos.

### Decisiones

- **`shared/` en `.js`, no `.ts`:** el back corre con Node plano (`nodemon index.js`); mantener `.js` evita depender del type-stripping experimental.
- **Sin npm workspaces:** estructura mínima con imports relativos; no hay `package.json`/`node_modules` en la raíz.
- **Cuidado en deploys a Vercel:** el `shared/node_modules` puede no subirse; ver memoria del proyecto.

---

## Autenticación y autorización

- **Mecanismo:** JWT en cookie `token` (httpOnly). Configuración en `config/cookie.js`:
  - `secure: true` en producción
  - `sameSite: 'none'` en producción / `'lax'` en desarrollo
  - `maxAge`: 3 días en ms
- **Token unificado:** un solo nombre de cookie `token`. Payload: `{ id, role: 'user' | 'admin' | 'employee' }`.
- **Login unificado:** `POST /api/login` con `{ email, password }`. El back busca el usuario por email, verifica el hash con bcrypt, genera el JWT y envía la cookie. Responde `{ id, role }`. Un cliente sin `confirmed: true` no puede iniciar sesión.
- **Confirmación de cuenta:** al registrarse un cliente se envía un email con un token; `GET /api/confirm/:token` marca `confirmed: true`.
- **Empleados:** los crea un admin con `POST /api/register/employee` (requiere sesión admin). No hay registro público de empleados.
- **Recuperación de contraseña:** `POST /api/change-password` envía el email; `POST /api/change-password/:token` confirma el cambio.
- **Verificación de sesión:** `GET /api/me` devuelve `{ id, role }` sin consultar BD; usado por `AuthContext` al montar la app.
- **Logout unificado:** `POST /api/logout` limpia la cookie independientemente del rol.
- **Baja lógica:** clientes y empleados se dan de baja con `active: false` (no se borran físicamente).
- **Sesiones simultáneas:** no soportadas — una sola cookie por navegador.

---

## Estado global en el frontend (Context + Hooks)

El árbol de providers vive en `App.tsx`. Cada dominio tiene su Context + hook consumidor (que lanza error si se usa fuera del provider).

| Context | Hook | Responsabilidad |
|---|---|---|
| `AuthContext` | `UseAuth` | Sesión unificada; `auth: { id, role } \| null`, `isAdmin`, login/logout/register, restaura sesión con `GET /me` al montar |
| `AdminContext` | `UseAdmin` | Empleados y clientes del panel admin (listar, dar de baja) |
| `UserContext` | `UseUser` | Perfil del cliente y edición |
| `ProductContext` | `useProducts` | Catálogo, filtro por categoría, mutaciones para el panel admin |
| `CategoryContext` | `useCategory` | Categorías |
| `OfferContext` | `useOffer` | Ofertas |
| `CartContext` | `useCart` | Carrito en memoria + `localStorage` (agregar, quitar, actualizar cantidad, vaciar) |
| `OrderContext` | `useOrder` | Pedidos: `getOrders`, `createOrder`, `cancelOrder`, `payOrder`, `confirmPayment`; `loading` granular por operación |

### `AuthContext.tsx`

```ts
interface AuthContextType {
  loading: AuthLoadingState        // estado granular por operación
  auth: { id: string; role: 'user' | 'admin' | 'employee' } | null
  isAdmin: boolean
  loginUser:    (credentials) => Promise<LoginResponse>
  loginAdmin:   (credentials) => Promise<LoginResponse>
  logout:       () => Promise<void>
  registerUser: (credentials) => Promise<void>
}
```

- Al montar llama a `GET /api/me` para restaurar sesión desde la cookie.
- `loading` es un objeto con un booleano por operación; permite spinners granulares.
- `registerUser` no actualiza `auth` — el cliente debe confirmar su cuenta y luego iniciar sesión.

### `OrderContext.tsx`

```ts
type OrderContextType = {
  orders: Order[]
  loading: { get, create, cancel, pay, confirm: boolean }
  getOrders:      () => Promise<void>
  createOrder:    (data: CreateOrderInput) => Promise<Order>
  cancelOrder:    (id: string) => Promise<void>
  payOrder:       (id: string) => Promise<string>          // devuelve init_point de MP
  confirmPayment: (paymentId: string) => Promise<void>
}
```

- `createOrder` hace *prepend* del pedido nuevo (mismo orden que el back: `createdAt` desc).
- `cancelOrder` quita el pedido de la lista (el back excluye cancelados de los listados).
- `payOrder` devuelve el `init_point` para redirigir al checkout de MP.
- Las vistas `PaymentSuccess/Failure/Pending` manejan el retorno del checkout; `PaymentSuccess` llama a `confirmPayment` con el `payment_id` de la URL.

### `VerifyAuth.tsx`

Guarda rutas privadas. Si `loading.me` es `true` muestra loading. Si no hay `auth`, redirige al login. Acepta múltiples roles (p. ej. `/panel-admin` para `admin` y `employee`, con vistas distintas para cada uno).

### Servicios (`services/*.ts`)

`api.ts` expone la instancia de Axios (`baseURL: VITE_BACKEND_URL`, `withCredentials: true`). Hay un service por dominio: `auth`, `user`, `admin`, `product`, `categories`, `offer`, `order`, `contact`. Los responses se validan con los schemas de Zod compartidos.

---

## Flujo principal de negocio

```
1. Cliente accede a la app
      ↓
2. AuthContext llama GET /api/me → restaura sesión si hay cookie
      ↓
3. Navega el catálogo (GET /api/products) — filtra por categoría y busca por nombre
      ↓
4. Agrega productos al carrito (CartContext — memoria + localStorage)
      ↓
5. Inicia sesión si no está autenticado (POST /api/login) — cuenta confirmada por email
      ↓
6. Confirma pedido → POST /api/orders (Order status "pending", snapshots de precio y domicilio, vacía carrito)
      ↓
7. Admin/empleado ve el pedido en su panel (GET /api/orders/all)
      ↓
8a. RECHAZA → PATCH /api/orders/:id/status { status: "rejected", rejectionReason } → status: "rejected"
8b. ACEPTA + carga finalAmount → PATCH /api/orders/:id/status { status: "in_preparation", finalAmount } → status: "in_preparation"
      ↓
9. Cliente ve el pedido "en preparación" con el monto final; aparece el botón "Pagar"
      ↓
10. Click en "Pagar"
      → POST /api/orders/:id/pay
      → Backend crea Preference en MP con finalAmount (o approximateTotal si no hay peso confirmado)
      → Devuelve init_point → el front redirige al checkout de MP
      ↓
11. Cliente paga en Mercado Pago
      → Webhook: POST /api/orders/payment/webhook → consulta el pago y marca status: "paid"
      → Respaldo: al volver, PaymentSuccess llama POST /api/orders/payment/confirm { paymentId }
        (útil en desarrollo, donde el back local no recibe webhooks)
      ↓
12. Admin/empleado ve el pedido con status "paid"
      ↓
13. Admin/empleado marca entregado → PATCH /api/orders/:id/status { status: "delivered" }

El cliente puede cancelar su pedido (PATCH /api/orders/:id/cancel) solo mientras está "pending".
```

Cada transición dispara un email al cliente (creación, cancelación, cambio de estado, pago confirmado) vía `utils/order.mail.js`. Los mails son efectos secundarios: si fallan, no cortan el flujo del pedido.

---

## Reglas de negocio

- **Precio por kilo es estimado.** El `approximateTotal` puede diferir del total real porque los cortes se pesan físicamente. El admin carga `finalAmount` al pasar el pedido a preparación; ese monto se cobra en MP.
- **El pago usa `finalAmount` (o `approximateTotal` como respaldo).** La Preference de MP cobra el pedido como un único ítem con `finalAmount ?? approximateTotal`.
- **El pago se habilita en `in_preparation`.** `createPayment` rechaza con `400` si el pedido no está en ese estado.
- **Transiciones de estado permitidas (admin/empleado):**
  - `pending` → `in_preparation` (acepta, con `finalAmount`) | `rejected`
  - `paid` → `delivered`
  - `paid` no lo pone el admin: lo pone el pago de Mercado Pago (webhook o confirmación del front).
- **Cancelación por el cliente.** Solo mientras el pedido está `pending`; una vez tomado por el admin hay que coordinarlo aparte.
- **Webhook público e idempotente.** `POST /api/orders/payment/webhook` no requiere JWT y siempre responde `200` (si devolviera error, MP reintentaría en bucle). Solo marca `paid` si el pago está `approved`. `markOrderAsPaid` devuelve `null` si el pedido ya estaba pagado, evitando reenviar el mail (deduplicación webhook ↔ confirmación del front).
- **Confirmación por el front como respaldo.** El estado del pago siempre lo resuelve MP (`Payment.get`), nunca el front; el front solo aporta el `payment_id` de la URL de retorno.
- **Snapshot de precios.** Al crear un Order se copia `name`, `price` y `unit` de cada Product en `OrderItem`. El historial no cambia si el admin modifica precios luego.
- **Snapshot de domicilio.** `deliveryAddress` se copia del perfil del usuario al crear el pedido (dato de confianza resuelto por el back, no viene del body).
- **Importación de productos.** El Excel se sube con multer y se parsea con `xlsx`; si una categoría del archivo no existe, se crea automáticamente.
- **Soft delete / baja lógica.** Productos, categorías y ofertas se eliminan (según el controller); clientes y empleados se dan de baja con `active: false`.
- **Acceso al catálogo sin login.** Solo se requiere autenticación (y cuenta confirmada) para confirmar un pedido.
- **`floor` y `apartment` son opcionales.** Tienen `default: ''` en el modelo y el schema.

---

## Variables de entorno

```env
# backend/.env
PORT=3001
MONGO_URL=mongodb://localhost:27017/frigorifico5estrellas
JWT_SECRET=supersecretkey
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=                      # URL pública del back (para notification_url del webhook de MP); vacío en dev
NODEMAILER_USER=correo@ejemplo.com
NODEMAILER_PASS=password_de_correo
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxx
MP_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

```env
# frontend/.env
VITE_BACKEND_URL=http://localhost:3001/api   # en dev; en prod se usa "/api" (proxy de Vercel, ver context.md)
```

> Notas:
> - La URI de Mongo es `MONGO_URL` (no `MONGO_URI`); la URL del frontend desde el back es `FRONTEND_URL` (no `CLIENT_URL`).
> - El cliente Axios usa `VITE_BACKEND_URL` (no `VITE_API_URL`).
> - `BACKEND_URL` solo se usa para armar el `notification_url` del webhook de MP; en desarrollo (localhost) queda vacío y el pago se confirma con el respaldo del front.

---

## Estado de implementación

### Implementado ✅

**Backend:**
- Modelo `User` unificado con roles (`user`/`admin`/`employee`), `confirmed` y `active` (baja lógica).
- Modelos: Category, Product (imagen Cloudinary), Offer (con imagen), OrderItem, Order (estados completos + notas + snapshot MP).
- Auth completa: registro cliente con confirmación por email, alta de admin/empleado, login unificado, logout, `me`, `profile`, recuperación de contraseña.
- CRUD de productos (edición con imagen), importación masiva vía Excel, CRUD de categorías, CRUD de ofertas.
- Gestión de empleados y clientes (listar + baja lógica).
- Flujo de pedidos completo: crear, listar (usuario/admin), cancelar, cambiar estado.
- Pagos con Mercado Pago: creación de Preference, webhook público idempotente y confirmación de respaldo desde el front; mails transaccionales por cada evento del pedido.
- Middlewares: `verifyAuth`, `verifyRole` (multi-rol), `validate` (Zod), `rateLimiters` (api + auth), `multer` (imagen + excel).
- Config: cookie, db, mail (Nodemailer), cloudinary, mercadopago.
- Validación con Zod: schemas compartidos en `shared/` aplicados en todos los endpoints con body.

**Frontend:**
- Todos los contextos implementados: Auth, Admin, User, Product, Category, Offer, Cart, Order.
- Hooks consumidores por dominio.
- Pages: Home (catálogo + búsqueda + ofertas + carrusel), Cart, Contact, AboutUs, Login, Register, Confirm, ChangePassword, UserPanel, AdminPanel, y vistas de resultado de pago (Success/Failure/Pending).
- Panel admin con secciones: productos, importación, categorías, ofertas, empleados, clientes, pedidos.
- Rutas protegidas por rol con `VerifyAuth` (empleados con vista reducida enfocada en pedidos).
- Carrito persistente en `localStorage` + checkout que crea el pedido.
- Servicios Axios por dominio con validación de responses vía Zod.
- Notificaciones con SweetAlert2; iconografía con Bootstrap Icons.

### Pendiente / en curso ❌

- Pruebas end-to-end del pago real de Mercado Pago en producción (con `BACKEND_URL` pública y webhook efectivo).
- Ajustes finos de UX en el panel de pedidos (filtros, polling de estado ya presentes).
