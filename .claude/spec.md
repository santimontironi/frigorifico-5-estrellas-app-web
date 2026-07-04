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

Aplicación web de pedidos online para el frigorífico **5 Estrellas**. Los clientes se registran, navegan el catálogo filtrado por categoría, agregan productos al carrito y confirman un pedido. El administrador revisa cada pedido, carga el monto final real (tras el pesaje) y lo acepta o rechaza. Si es aceptado, el cliente paga online mediante **Mercado Pago Checkout Pro**. El pago se confirma automáticamente vía webhook.

El sistema tiene **dos áreas con autenticación independiente**:
- **Área de clientes** — registro + login de usuarios.
- **Panel de administración** — login separado, gestión de productos, categorías, ofertas y pedidos.

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
| Backend | Node.js + Express | 5.x |
| Base de datos | MongoDB + Mongoose | 9.x |
| Autenticación | JWT (jsonwebtoken) | 9.x |
| Hashing | bcrypt | 6.x |
| Cookies | cookie-parser | 1.x |
| Email | Nodemailer | 9.x (pendiente) |
| Imágenes | Cloudinary | 2.x (pendiente) |
| Pagos | Mercado Pago SDK (Node) | — (pendiente) |
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
│   │   ├── cookie.js          # objeto cookieOptions (httpOnly, secure, sameSite, maxAge)
│   │   ├── db.config.js       # función connectDB()
│   │   ├── mail.config.js     # (pendiente)
│   │   └── cloudinary.config.js # (pendiente)
│   ├── models/
│   │   ├── user.model.js
│   │   ├── admin.model.js
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── offer.model.js
│   │   ├── orderItem.model.js
│   │   └── order.model.js
│   ├── controllers/
│   │   ├── auth.controller.js     # me(), logout()
│   │   ├── user.controller.js     # register(), login(), dashboard()
│   │   ├── admin.controller.js    # registerAdmin(), loginAdmin(), dashboard()
│   │   ├── product.controller.js  # (pendiente)
│   │   ├── category.controller.js # (pendiente)
│   │   ├── offer.controller.js    # (pendiente)
│   │   ├── order.controller.js    # (pendiente)
│   │   └── payment.controller.js  # (pendiente)
│   ├── repository/
│   │   ├── user.repository.js     # createUser, findByEmail, findById
│   │   ├── admin.repository.js    # createAdmin, findByUsername, findById
│   │   ├── product.repository.js  # (pendiente)
│   │   ├── category.repository.js # (pendiente)
│   │   ├── offer.repository.js    # (pendiente)
│   │   └── order.repository.js    # (pendiente)
│   ├── routes/
│   │   ├── auth.routes.js         # GET /me, POST /logout (unificado)
│   │   ├── user.routes.js         # POST /register/user, POST /login/user, GET /dashboard/user
│   │   ├── admin.routes.js        # POST /register/admin, POST /login/admin, GET /dashboard/admin
│   │   ├── product.routes.js      # (pendiente)
│   │   ├── category.routes.js     # (pendiente)
│   │   ├── offer.routes.js        # (pendiente)
│   │   ├── order.routes.js        # (pendiente)
│   │   └── payment.routes.js      # (pendiente)
│   └── middlewares/
│       ├── verifyAuth.js      # valida JWT e inyecta req.auth con { id, role }
│       ├── verifyRole.js      # factory: verifyRole('admin') | verifyRole('user')
│       ├── validate.js        # validate(schema): valida req.body con un schema de Zod (shared)
│       ├── rateLimiters.js    # rate limiting: authLimiter (estricto) + limitador general
│       └── multer.js          # (pendiente — upload de imágenes)
│
├── shared/                    # schemas de Zod compartidos back ↔ front (standalone, sin workspaces)
│   ├── package.json           # "type": module + dep zod; node_modules propio
│   ├── index.js               # re-exporta todos los schemas
│   └── schemas/
│       ├── auth.schema.js     # loginSchema, userRegisterSchema, adminRegisterSchema, authResponseSchema
│       └── contact.schema.js  # contactSchema
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx           # ReactDOM root — solo renderiza <App />
        ├── App.tsx            # Árbol de providers + React Router
        ├── index.css
        ├── context/
        │   ├── AuthContext.tsx       # sesión unificada user/admin
        │   ├── CartContext.tsx       # (pendiente)
        │   ├── CategoryContext.tsx   # (pendiente)
        │   ├── ProductContext.tsx    # (pendiente)
        │   └── OrderContext.tsx      # (pendiente)
        ├── hooks/
        │   ├── UseAuth.tsx            # consume AuthContext; lanza error si no hay provider
        │   ├── UseDashboardUser.tsx   # fetch + estado del perfil de usuario
        │   └── UseDashboardAdmin.tsx  # fetch + estado del perfil de admin
        ├── pages/
        │   ├── (pendiente)
        │   └── admin/
        │       └── (pendiente)
        ├── components/
        │   └── VerifyAuth.tsx   # guarda rutas privadas; redirige si no hay sesión
        ├── services/
        │   ├── api.ts           # instancia Axios con baseURL y withCredentials
        │   └── auth.service.ts  # todas las llamadas HTTP de autenticación y dashboards
        └── types/
            └── auth.types.ts    # interfaces TypeScript de auth
```

---

## Modelos de base de datos

### User

```js
// models/user.model.js
{
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  dni:        { type: String, required: true, unique: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true },
  address: {
    street:    { type: String, required: true },
    number:    { type: String, required: true },
    floor:     { type: String, default: '' },     // opcional
    apartment: { type: String, default: '' },     // opcional
    city:      { type: String, required: true },
    province:  { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
}
```

---

### Admin

```js
// models/admin.model.js
{
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}
```

> Los admins se crean mediante `POST /api/register/admin`. No hay registro público.

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
  image:     { type: String, default: '' },
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
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  newPrice: { type: Number, required: true },
  active:   { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

> `newPrice` reemplaza al precio base cuando la oferta está activa. El `priceSnapshot` del pedido usa el precio con descuento.

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
    enum: ['pending', 'accepted', 'rejected', 'paid', 'in_preparation', 'delivered'],
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

  notes: { type: String, default: '' },
  // timestamps: true
}
```

---

## API — Rutas y endpoints

Base URL: `http://localhost:3001/api`  
Montaje en `app.js`:
```js
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', adminRouter)
// rutas pendientes: products, categories, offers, orders, payments
```

### Auth (`/api`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/me` | token | Devuelve `{ id, role }` del JWT activo — no consulta BD |
| POST | `/api/logout` | — | Limpia la cookie `token` (unificado para user y admin) |

### Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/register/user` | — | Registrar nuevo usuario |
| POST | `/api/login/user` | — | Login; devuelve `{ id, role }` y cookie httpOnly |
| GET | `/api/dashboard/user` | user | Perfil completo del usuario autenticado |

### Administración

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/register/admin` | — | Crear admin |
| POST | `/api/login/admin` | — | Login; devuelve `{ id, role }` y cookie httpOnly |
| GET | `/api/dashboard/admin` | admin | Datos del admin autenticado |

### Productos — pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/products` | — | Listar productos activos (con oferta vigente si existe) |
| GET | `/api/products/:id` | — | Detalle de un producto |
| GET | `/api/products?categoria=:id` | — | Filtrar por categoría |
| POST | `/api/products` | admin | Crear producto |
| PUT | `/api/products/:id` | admin | Editar producto |
| DELETE | `/api/products/:id` | admin | Desactivar producto (`active: false`) |

### Categorías — pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/categories` | — | Listar categorías activas |
| POST | `/api/categories` | admin | Crear categoría |
| PUT | `/api/categories/:id` | admin | Editar categoría |
| DELETE | `/api/categories/:id` | admin | Desactivar categoría |

### Ofertas — pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/offers` | — | Listar ofertas vigentes |
| POST | `/api/offers` | admin | Crear oferta |
| PUT | `/api/offers/:id` | admin | Editar oferta |
| DELETE | `/api/offers/:id` | admin | Desactivar oferta |

### Pedidos — pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/orders` | user | Crear pedido desde el carrito |
| GET | `/api/orders/my` | user | Historial de pedidos del usuario |
| GET | `/api/orders` | admin | Listar todos los pedidos |
| GET | `/api/orders/:id` | admin | Detalle de un pedido |
| PUT | `/api/orders/:id/accept` | admin | Aceptar pedido; body: `{ finalAmount: number }` |
| PUT | `/api/orders/:id/reject` | admin | Rechazar pedido; body: `{ rejectionReason?: string }` |
| PUT | `/api/orders/:id/status` | admin | Avanzar estado: `paid → in_preparation → delivered` |

### Pagos — pendiente

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/payments/create-preference/:orderId` | user | Crea Preference en MP; devuelve `{ init_point }` |
| POST | `/api/payments/webhook` | — (pública) | Webhook de MP; verifica firma y actualiza pedido a `paid` |

---

## Middlewares

### `verifyAuth.js`

Extrae el JWT de la cookie httpOnly, lo verifica con `JWT_SECRET` e inyecta `req.auth = { id, role }`. Retorna `401` si el token no existe o es inválido.

### `verifyRole.js`

Factory que recibe el rol esperado y retorna un middleware. Valida `req.auth.role`. Retorna `403` si no coincide.

```js
router.get('/dashboard/admin', verifyAuth, verifyRole('admin'), ...)
router.get('/dashboard/user',  verifyAuth, verifyRole('user'),  ...)
```

### `validate.js`

Middleware genérico `validate(schema)`. Ejecuta `schema.safeParse(req.body)`; si falla responde `400` con `error.flatten().fieldErrors` y **no llega al controller**; si pasa, reemplaza `req.body` con los datos parseados. Solo aplica a requests con body (POST). Ver [Validación (Zod + schemas compartidos)](#validación-zod--schemas-compartidos).

### `rateLimiters.js`

Rate limiting de dos niveles (`express-rate-limit`): `authLimiter` estricto para endpoints de autenticación (anti brute-force / spam de registro) y un limitador general aplicado en `app.js`. Requiere `trust proxy` configurado.

### `multer.js` (pendiente)

Upload de imágenes de productos hacia Cloudinary.

---

## Validación (Zod + schemas compartidos)

La validación se centraliza en **schemas de Zod** compartidos entre backend y frontend, en una carpeta `shared/` **standalone** (sin npm workspaces).

### Estructura de `shared/`

- `shared/package.json` (`"type": "module"`, dep `zod` 4.x) con su propio `node_modules`.
- `shared/schemas/*.schema.js` — schemas en **JS plano (ESM)**, re-exportados desde `shared/index.js`.
- Se importa con **ruta relativa**: en el back `'../../shared/index.js'`; en el front `'../../../shared/index.js'` (un nivel más por el `src/`).

### Schemas definidos

| Schema | Archivo | Uso |
|---|---|---|
| `loginSchema` | `auth.schema.js` | request `POST /login` |
| `userRegisterSchema` | `auth.schema.js` | request `POST /register/user` (incluye `address` anidado) |
| `adminRegisterSchema` | `auth.schema.js` | request `POST /register/admin` |
| `authResponseSchema` | `auth.schema.js` | **response** de `/login` y `/me` (`{ id, role }`) |
| `contactSchema` | `contact.schema.js` | request `POST /contact` |

### Backend — validación de requests

`validate(schema)` se cablea en las rutas antes del controller:

```js
router.post('/login',         authLimiter, validate(loginSchema),         authController.login)
router.post('/register/user', authLimiter, validate(userRegisterSchema),  authController.register)
router.post('/register/admin',authLimiter, validate(adminRegisterSchema), authController.registerAdmin)
router.post('/contact',                    validate(contactSchema),       contactController.sendContactEmail)
```

Valida `req.body`, por lo que **solo aplica a POST**. Los GET (`/me`, `/profile`) no llevan body y no lo usan; su "input" es la cookie JWT (la valida `verifyAuth`).

### Frontend — forms y responses

- **Forms:** react-hook-form + `zodResolver`. `useForm({ resolver: zodResolver(schema) })` y `register('campo')` sin reglas inline. Aplicado en `Login.tsx` (`loginSchema`) y `Contact.tsx` (`contactSchema`). Para campos anidados: `register('address.street')`.
- **Tipos:** derivados con `z.infer<typeof schema>` — única fuente de verdad; reemplazan las interfaces manuales de request/response de auth.
- **Responses:** validados en la capa de service con `schema.parse(data)`; el service devuelve el dato ya parseado (no el `AxiosResponse`). Ej.: `authMeService` / `loginService` con `authResponseSchema`.
- **Config:** `zod` (4.4.3, igual que `shared`) y `@hookform/resolvers` como deps del front; `"allowJs": true` en `tsconfig.app.json` para que TS lea los schemas `.js` e infiera tipos. **No requiere config de Vite** (el `.git` de la raíz hace que Vite considere `shared/` dentro del workspace root).

### Decisiones

- **`shared/` en `.js`, no `.ts`:** el back corre con Node plano (`nodemon index.js`, Node 22.17); el type-stripping nativo recién es default en Node ≥22.18. Mantener `.js` evita depender de flags experimentales en el back.
- **Sin npm workspaces:** estructura mínima con imports relativos; no hay `package.json`/`node_modules` en la raíz.
- **Responses de dashboard/profile sin schema (por ahora):** son GET de solo-display y el panel aún no está construido; el `z.infer` + `.parse()` se agregarán al construirlo.

---

## Autenticación y autorización

- **Mecanismo:** JWT en cookie `token` (httpOnly). Configuración en `config/cookie.js`:
  - `secure: true` en producción
  - `sameSite: 'none'` en producción / `'lax'` en desarrollo
  - `maxAge`: 3 días en ms
- **Token unificado:** un solo nombre de cookie `token`. Payload: `{ id, role: 'user' | 'admin' }`.
- **Verificación de sesión:** `GET /api/me` — devuelve `{ id, role }` sin consultar BD; usado por `AuthContext` al montar la app.
- **Logout unificado:** `POST /api/logout` limpia la cookie independientemente del rol. No hay endpoints separados `/logout/user` y `/logout/admin`.
- **Flujo login usuario:**
  1. `POST /api/login/user` con `{ email, password }`.
  2. Backend busca en `User` por email, verifica hash con bcrypt.
  3. Genera JWT y envía cookie httpOnly.
  4. Respuesta: `{ id, role: 'user' }`.
- **Flujo login admin:**
  1. `POST /api/login/admin` con `{ username, password }`.
  2. Backend busca en `Admin` por username, verifica hash con bcrypt.
  3. Genera JWT y envía cookie httpOnly.
  4. Respuesta: `{ id, role: 'admin' }`.
- **Sesiones simultáneas:** no soportadas — una sola cookie por navegador.

---

## Estado global en el frontend (Context + Hooks)

### `AuthContext.tsx`

Sesión unificada para usuarios y administradores.

```ts
// src/types/auth.types.ts — interfaces relevantes
interface AuthInterface { id: string; role: 'user' | 'admin' }
interface LoginResponse  { id: string; role: 'user' | 'admin' }
interface AuthLoadingState {
  me: boolean
  loginUser: boolean
  loginAdmin: boolean
  logout: boolean
  registerUser: boolean
}
interface UserAddress    { street: string; number: string; floor?: string; apartment?: string; city: string; province: string }
interface UserLoginCredentials    { email: string; password: string }
interface AdminLoginCredentials   { username: string; password: string }
interface UserRegisterCredentials { firstName: string; lastName: string; dni: string; phone: string; email: string; password: string; address: UserAddress }
interface AdminRegisterCredentials { username: string; password: string }
interface UserDashboardResponse  { _id: string; firstName: string; lastName: string; email: string; phone: string; dni: string; address: UserAddress; createdAt: string }
interface AdminDashboardResponse { _id: string; username: string }
```

```ts
// context/AuthContext.tsx
interface AuthContextType {
  loading: AuthLoadingState        // estado granular por operación
  auth: AuthInterface | null       // { id, role } — null si no hay sesión
  isAdmin: boolean                 // auth?.role === 'admin'
  loginUser:    (credentials: UserLoginCredentials)    => Promise<LoginResponse>
  loginAdmin:   (credentials: AdminLoginCredentials)   => Promise<LoginResponse>
  logout:       ()                                     => Promise<void>
  registerUser: (credentials: UserRegisterCredentials) => Promise<void>
}
```

- Al montar llama a `GET /api/me` (via `authMeService`) para restaurar sesión desde la cookie.
- `loading` es un objeto con un booleano por operación; permite mostrar spinners granulares.
- `loginUser` / `loginAdmin` setean `auth` con la respuesta `{ id, role }`.
- `logout` limpia `auth` a `null`.
- `registerUser` no actualiza `auth` — el usuario debe hacer login después de registrarse.

### `UseAuth.tsx`

```ts
// hooks/UseAuth.tsx
const UseAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('UseAuth debe usarse dentro de AuthContextProvider')
  return ctx
}
```

### `UseDashboardUser.tsx`

```ts
// hooks/UseDashboardUser.tsx
interface UseDashboardUserReturn {
  user: UserDashboardResponse | null
  loading: boolean
  error: string | null
  fetchUser: () => Promise<void>
}
```

Llama a `getUserDashboardService()` (`GET /api/dashboard/user`). Se usa desde las páginas que necesiten mostrar el perfil del usuario.

### `UseDashboardAdmin.tsx`

```ts
// hooks/UseDashboardAdmin.tsx
interface UseDashboardAdminReturn {
  admin: AdminDashboardResponse | null
  loading: boolean
  error: string | null
  fetchAdmin: () => Promise<void>
}
```

Llama a `getAdminDashboardService()` (`GET /api/dashboard/admin`).

### `VerifyAuth.tsx`

Guarda rutas privadas. Si `loading.me` es `true` muestra loading. Si no hay `auth`, redirige a `/ingreso-usuario`. Si hay sesión, renderiza `children`.

### Contextos pendientes

- **`CartContext.tsx`** — carrito en memoria + `localStorage`. Ítems: `{ product, cantidad, subtotal }`. Al confirmar pedido llama `clearCart()`.
- **`ProductContext.tsx`** — catálogo con filtro por categoría. Funciones de mutación solo para el panel admin.
- **`CategoryContext.tsx`** — categorías activas.
- **`OrderContext.tsx`** — pedidos del usuario y (para admin) todos los pedidos. Incluye `createOrder`, `acceptOrder`, `rejectOrder`, `updateOrderStatus`, `initPayment`.

### `auth.service.ts`

```ts
// services/auth.service.ts
authMeService()                                  // GET /api/me
loginUserService(credentials)                    // POST /api/login/user
loginAdminService(credentials)                   // POST /api/login/admin
logoutService()                                  // POST /api/logout
registerUserService(credentials)                 // POST /api/register/user
getUserDashboardService()                        // GET /api/dashboard/user
getAdminDashboardService()                       // GET /api/dashboard/admin
```

---

## Flujo principal de negocio

```
1. Usuario accede a la app
      ↓
2. AuthContext llama GET /api/me → restaura sesión si hay cookie
      ↓
3. Navega el catálogo (GET /api/products?categoria=:id)
      ↓
4. Agrega productos al carrito (CartContext — local + localStorage)
      ↓
5. Inicia sesión si no está autenticado (POST /api/login/user)
      ↓
6. Confirma pedido → POST /api/orders (genera Order con status "pending", vacía carrito)
      ↓
7. Admin ve el pedido en su panel
      ↓
8a. Admin RECHAZA → PUT /api/orders/:id/reject → status: "rejected"
8b. Admin ACEPTA + carga finalAmount → PUT /api/orders/:id/accept → status: "accepted"
      ↓
9. Usuario ve status "accepted" y finalAmount; aparece botón "Pagar"
      ↓
10. Usuario hace click en "Pagar"
      → POST /api/payments/create-preference/:orderId
      → Backend crea Preference en MP con finalAmount
      → Devuelve init_point
      → Frontend redirige al usuario a Mercado Pago
      ↓
11. Usuario paga en Mercado Pago
      → MP envía webhook a POST /api/payments/webhook
      → Backend verifica firma, actualiza status: "paid" y guarda paymentId
      ↓
12. Admin ve pedido con status "paid"
      ↓
13. Admin avanza: "paid" → "in_preparation" → "delivered" (PUT /api/orders/:id/status)
```

---

## Reglas de negocio

- **Precio por kilo es estimado.** El `approximateTotal` puede diferir del total real porque los cortes se pesan físicamente. El admin carga `finalAmount` al aceptar; ese monto se cobra en MP.
- **El pago usa `finalAmount`.** La Preference de MP se crea con `finalAmount`. Si no fue cargado, el endpoint rechaza con `400`.
- **Transiciones de estado permitidas:**
  - `pending` → `accepted` (admin acepta con finalAmount) | `rejected`
  - `accepted` → `paid` (webhook MP; no lo puede cambiar el admin manualmente)
  - `paid` → `in_preparation` → `delivered` (admin via `PUT /orders/:id/status`)
- **Webhook público.** `POST /api/payments/webhook` no requiere JWT. Verifica firma con `MP_WEBHOOK_SECRET` antes de procesar. Solo actualiza si el pago tiene status `approved`.
- **Un pago por pedido.** Si ya existe `paymentId`, `create-preference` rechaza con `409`.
- **Snapshot de precios.** Al crear un Order se copia `name`, `price` y `unit` de cada Product en `OrderItem`. El historial no cambia si el admin modifica precios luego.
- **Snapshot de domicilio.** `deliveryAddress` se copia del perfil del usuario al crear el pedido.
- **Ofertas activas.** Al listar productos el backend inyecta la oferta vigente en cada producto. El `priceSnapshot` del pedido usa el precio con descuento.
- **Soft delete.** Productos, categorías y ofertas no se eliminan físicamente; se marcan con `active: false`.
- **Acceso al catálogo sin login.** Solo se requiere autenticación para confirmar un pedido.
- **floor y apartment son opcionales.** En el modelo User y en `UserAddress` estos campos tienen `default: ''`; el formulario de registro los envía vacíos si no se completan.

---

## Variables de entorno

```env
# backend/.env
PORT=3001
MONGO_URL=mongodb://localhost:27017/frigorifico5estrellas
JWT_SECRET=supersecretkey
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
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
VITE_API_URL=http://localhost:3001/api
```

> Nota: la variable de entorno para la URI de Mongo es `MONGO_URL` (no `MONGO_URI`).  
> La variable para la URL del frontend desde el backend es `FRONTEND_URL` (no `CLIENT_URL`).

---

## Estado de implementación

### Implementado ✅

**Backend:**
- Modelos completos: User, Admin, Category, Product, Offer, OrderItem, Order
- Auth: `GET /api/me`, `POST /api/logout` (unificado)
- Usuarios: registro, login, dashboard
- Admin: registro, login, dashboard
- Middlewares: `verifyAuth`, `verifyRole`, `validate` (Zod), `rateLimiters`
- Validación con Zod: schemas compartidos en `shared/` aplicados en auth (login, register user/admin) y contact
- Config: `cookie.js`, `db.config.js`

**Frontend:**
- `AuthContext` con estado granular de loading (`AuthLoadingState`)
- Hooks: `UseAuth`, `UseDashboardUser`, `UseDashboardAdmin`
- Componente `VerifyAuth` para proteger rutas
- `auth.service.ts` con todas las llamadas HTTP de auth y dashboards
- Tipos TypeScript completos en `auth.types.ts` (request/response de auth derivados de Zod con `z.infer`)
- Validación de forms con react-hook-form + `zodResolver` (`Login`, `Contact`) y de responses con `schema.parse()` en los services
- Instancia Axios en `api.ts`

### Pendiente ❌

**Backend:** controllers, repositories y routes de products, categories, offers, orders, payments. Configuración de multer (upload), Cloudinary, Nodemailer y Mercado Pago SDK.

**Frontend:** contextos (Cart, Product, Category, Order), pages (Home, Catalog, Cart, Orders, admin/*), React Router configurado en `App.tsx`, resto de services.
