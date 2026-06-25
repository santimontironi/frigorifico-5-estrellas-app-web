# Spec técnico — Frigorífico 5 Estrellas

## Índice
1. [Descripción general](#descripción-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura de directorios](#estructura-de-directorios)
4. [Modelos de base de datos](#modelos-de-base-de-datos)
5. [API — Rutas y endpoints](#api--rutas-y-endpoints)
6. [Middlewares](#middlewares)
7. [Autenticación y autorización](#autenticación-y-autorización)
8. [Estado global en el frontend (UseContext)](#estado-global-en-el-frontend-usecontext)
9. [Flujo principal de negocio](#flujo-principal-de-negocio)
10. [Reglas de negocio](#reglas-de-negocio)
11. [Variables de entorno](#variables-de-entorno)

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
| Lenguaje front | TypeScript | 6 |
| Estilos | Tailwind CSS | 4 |
| Build tool | Vite | 8 |
| HTTP client | Axios | 1.x |
| Backend | Node.js + Express | 5.x |
| Base de datos | MongoDB + Mongoose | 9.x |
| Autenticación | JWT (jsonwebtoken) | 9.x |
| Cookies | cookie-parser | 1.x |
| Email | Nodemailer | 9.x |
| Pagos | Mercado Pago SDK (Node) | 2.x |
| Dev server | Nodemon | 3.x |

---

## Estructura de directorios

```
frigorifico-5-estrellas/
├── backend/
│   ├── index.js               # entry point: conecta DB y llama app.listen()
│   ├── app.js                 # configura Express: middlewares globales + monta rutas
│   ├── .env
│   ├── models/
│   │   ├── user.model.js
│   │   ├── admin.model.js
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── offer.model.js
│   │   ├── orderItem.model.js
│   │   └── order.model.js
│   ├── controllers/
│   │   ├── auth.controller.js     # GET /auth/me
│   │   ├── user.controller.js     # register, login, logout, dashboard
│   │   ├── admin.controller.js    # register, login, logout, dashboard
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── offer.controller.js
│   │   ├── order.controller.js
│   │   └── payment.controller.js
│   ├── repository/
│   │   ├── user.repository.js
│   │   ├── admin.repository.js
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
│   │   ├── order.routes.js
│   │   └── payment.routes.js
│   └── middlewares/
│       ├── verifyAuth.js      # valida JWT e inyecta req.auth con { id, role }
│       └── verifyRole.js      # factory: verifyRole('admin') | verifyRole('user')
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── context/
        │   ├── AuthContext.tsx
        │   ├── CartContext.tsx
        │   ├── ProductsContext.tsx
        │   ├── OffersContext.tsx
        │   └── OrderContext.tsx
        ├── pages/
        │   ├── Home.tsx
        │   ├── Register.tsx
        │   ├── Login.tsx
        │   ├── Catalog.tsx
        │   ├── ProductDetail.tsx
        │   ├── Cart.tsx
        │   ├── Orders.tsx
        │   └── admin/
        │       ├── AdminLogin.tsx
        │       ├── AdminDashboard.tsx
        │       ├── AdminProducts.tsx
        │       ├── AdminCategories.tsx
        │       ├── AdminOffers.tsx
        │       └── AdminOrders.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   ├── ProductCard.tsx
        │   ├── CartItem.tsx
        │   └── ProtectedRoute.tsx
        ├── services/
        │   ├── api.ts
        │   ├── authService.ts
        │   ├── productService.ts
        │   └── orderService.ts
        └── types/
            └── auth.types.ts
```

---

## Modelos de base de datos

### User

Representa a un cliente registrado.

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
    floor:     { type: String, default: '' },
    apartment: { type: String, default: '' },
    city:      { type: String, required: true },
    province:  { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
}
```

---

### Admin

Autenticación separada para el panel de administración.

```js
// models/admin.model.js
{
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}
```

> Los admins se crean mediante el endpoint `POST /admin/register`. No hay registro público.

---

### Category

Categorías que agrupan productos.

```js
// models/category.model.js
{
  name:   { type: String, required: true, unique: true, trim: true },
  active: { type: Boolean, default: true }
}
```

---

### Product

Ítem del catálogo. El precio es por kilo o por unidad.

```js
// models/product.model.js
{
  name:      { type: String, required: true, trim: true },
  category:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price:     { type: Number, required: true, min: 0 },
  unit:      { type: String, enum: ['kg', 'unit'], required: true },
  image:     { type: String, default: '' },
  active:    { type: Boolean, default: true },
  // timestamps: true → agrega createdAt y updatedAt automáticamente
}
```

> `unit: 'kg'` indica que el precio es estimado hasta que se pesa el corte.

---

### Offer

Precio especial sobre un producto.

```js
// models/offer.model.js
{
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  newPrice: { type: Number, required: true },
  active:   { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

> `newPrice` reemplaza al precio base del producto cuando la oferta está activa. El frontend muestra el precio original tachado y `newPrice` como precio vigente.

---

### OrderItem

Ítem de un pedido. Colección separada con referencia a Product y snapshots de precio.

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

> Los snapshots preservan el historial ante futuros cambios de precio o eliminación del producto.

---

### Order

Pedido realizado por un usuario. Los ítems son referencias a documentos `OrderItem`.

```js
// models/order.model.js
{
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],

  approximateTotal: { type: Number, required: true },  // suma de subtotales (aprox. para ítems por kg)
  finalAmount:      { type: Number, default: null },   // cargado por el admin al aceptar (tras el pesaje)

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

  deliveryAddress: {   // snapshot del domicilio al momento del pedido
    street:    String,
    number:    String,
    floor:     String,
    apartment: String,
    city:      String,
    province:  String
  },

  notes: { type: String, default: '' },
  // timestamps: true → agrega createdAt y updatedAt automáticamente
}
```

> Al consultar un pedido se debe usar `.populate('items')` para obtener los ítems completos.

---

## API — Rutas y endpoints

Base URL: `http://localhost:3001/api`

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/auth/me` | token | Devuelve `{ id, role }` del JWT activo — no consulta la BD |

### Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/register/user` | — | Registrar nuevo usuario |
| POST | `/api/login/user` | — | Login; devuelve `{ id, role }` y cookie httpOnly |
| POST | `/api/logout/user` | — | Elimina la cookie |
| GET | `/api/dashboard/user` | user | Perfil completo del usuario autenticado |

### Administración

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/register/admin` | — | Crear admin |
| POST | `/api/login/admin` | — | Login; devuelve `{ id, role }` y cookie httpOnly |
| POST | `/api/logout/admin` | — | Elimina la cookie |
| GET | `/api/dashboard/admin` | admin | Datos del admin autenticado |

### Productos (`/api/products`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/products` | — | Listar productos activos (con oferta vigente si existe) |
| GET | `/products/:id` | — | Detalle de un producto |
| GET | `/products?categoria=:id` | — | Filtrar por categoría |
| POST | `/products` | admin | Crear producto |
| PUT | `/products/:id` | admin | Editar producto |
| DELETE | `/products/:id` | admin | Desactivar producto (`activo: false`) |

### Categorías (`/api/categories`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/categories` | — | Listar categorías activas |
| POST | `/categories` | admin | Crear categoría |
| PUT | `/categories/:id` | admin | Editar categoría |
| DELETE | `/categories/:id` | admin | Desactivar categoría |

### Ofertas (`/api/offers`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/offers` | — | Listar ofertas vigentes |
| POST | `/offers` | admin | Crear oferta |
| PUT | `/offers/:id` | admin | Editar oferta |
| DELETE | `/offers/:id` | admin | Desactivar oferta |

### Pedidos (`/api/orders`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/orders` | usuario | Crear pedido desde el carrito |
| GET | `/orders/my` | usuario | Historial de pedidos del usuario autenticado |
| GET | `/orders` | admin | Listar todos los pedidos |
| GET | `/orders/:id` | admin | Detalle de un pedido |
| PUT | `/orders/:id/accept` | admin | Aceptar pedido; body: `{ finalAmount: number }` |
| PUT | `/orders/:id/reject` | admin | Rechazar pedido; body: `{ rejectionReason?: string }` |
| PUT | `/orders/:id/status` | admin | Avanzar estado: `paid → in_preparation → delivered` |

### Pagos (`/api/payments`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/payments/create-preference/:orderId` | usuario | Crea una Preference en MP con `montoFinal`; devuelve `{ init_point }` |
| POST | `/payments/webhook` | — (pública) | Webhook de MP; verifica firma y actualiza el pedido a `pagado` |

---

## Middlewares

### `verifyAuth.js`

Extrae el JWT de la cookie httpOnly, lo verifica con `jsonwebtoken` e inyecta el payload en `req.auth = { id, role }`. Retorna `401` si el token no existe o es inválido.

### `verifyRole.js`

Factory que recibe el rol esperado y retorna un middleware. Comprueba que `req.auth.role` coincida. Retorna `403` si no.

```js
// uso en rutas
router.put('/orders/:id/accept', verifyAuth, verifyRole('admin'), ...)
router.get('/orders/my',         verifyAuth, verifyRole('user'),  ...)
```

---

## Autenticación y autorización

- **Mecanismo:** JWT almacenado en cookie `httpOnly`, `secure` en producción, `sameSite: none` en producción / `lax` en desarrollo. Duración: 3 días.
- **Token unificado:** una sola cookie `token`. El payload es `{ id, role: 'user' | 'admin' }`.
- **Endpoint de verificación de sesión:** `GET /auth/me` — devuelve `{ id, role }` sin consultar la BD; usado por `AuthContext` al montar la app.
- **Flujo login usuario:**
  1. `POST /api/login/user` con `{ email, password }`.
  2. Backend busca en colección `User` por email, verifica hash con bcrypt.
  3. Genera JWT `{ id, role: 'user' }` y envía cookie httpOnly.
  4. Respuesta: `{ id, role }`.
- **Flujo login admin:**
  1. `POST /api/login/admin` con `{ username, password }`.
  2. Backend busca en colección `Admin` por username, verifica hash con bcrypt.
  3. Genera JWT `{ id, role: 'admin' }` y envía cookie httpOnly.
  4. Respuesta: `{ id, role }`.
- **Logout:** `POST /api/logout/user` o `POST /api/logout/admin` — ambos limpian la misma cookie.
- **Sesiones simultáneas:** no soportadas — una sola cookie `token` por navegador.

---

## Estado global en el frontend (UseContext)

Se usan seis contextos React para manejar el estado global de la aplicación sin librerías externas.

### `AuthContext`

Sesión unificada para usuarios y administradores. El estado guarda solo `{ id, role }` — los datos de perfil se fetchean en cada página con `GET /users/dashboard` o `GET /admin/dashboard`.

```ts
// context/AuthContext.tsx — tipos en src/types/auth.types.ts
interface AuthContextType {
  auth: AuthInterface | null   // { id, role }
  isAuthenticated: boolean
  isAdmin: boolean             // auth?.role === 'admin'
  loading: boolean
  loginUser:  (credentials: UserLoginCredentials)  => Promise<void>
  loginAdmin: (credentials: AdminLoginCredentials) => Promise<void>
  logout: () => Promise<void>
}
```

- Al montar la app llama a `GET /auth/me` para restaurar la sesión desde la cookie.
- `loginUser()` llama a `POST /api/login/user`; `loginAdmin()` llama a `POST /api/login/admin`.
- Ambos setean `auth` con la respuesta `{ id, role }` (tipo `LoginResponse`).
- `logoutUser()` llama a `POST /api/logout/user`; `logoutAdmin()` llama a `POST /api/logout/admin`.
- `isAdmin` es un shorthand derivado usado por `ProtectedRoute`.

### `CartContext`

Carrito de compras en memoria. No persiste en BD hasta que el usuario confirma el pedido.

```ts
// context/CartContext.tsx
interface CartItem {
  product: Product
  cantidad: number
  subtotal: number   // precioEfectivo * cantidad
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, cantidad: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, cantidad: number) => void
  clearCart: () => void
  totalAproximado: number
  itemCount: number
}
```

- Se persiste en `localStorage` para sobrevivir recargas de página.
- Al confirmar pedido (`POST /orders`) se llama `clearCart()`.

### `ProductsContext`

Catálogo de productos. Centraliza la carga y el filtrado por categoría.

```ts
// context/ProductsContext.tsx
interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  selectedCategory: string | null
  setSelectedCategory: (categoryId: string | null) => void
  fetchProducts: () => Promise<void>
  // para el panel admin:
  createProduct: (data: ProductFormData) => Promise<void>
  updateProduct: (id: string, data: ProductFormData) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}
```

- Al montar hace `GET /products` (opcionalmente con `?categoria=:id`).
- Cuando `selectedCategory` cambia, re-fetcha con el filtro correspondiente.
- Las funciones de mutación solo las usan los componentes del panel admin.

### `OffersContext`

Ofertas vigentes. El frontend las cruza con los productos para mostrar precios con descuento.

```ts
// context/OffersContext.tsx
interface OffersContextType {
  offers: Offer[]
  loading: boolean
  error: string | null
  fetchOffers: () => Promise<void>
  // para el panel admin:
  createOffer: (data: OfferFormData) => Promise<void>
  updateOffer: (id: string, data: OfferFormData) => Promise<void>
  deleteOffer: (id: string) => Promise<void>
}
```

- Al montar hace `GET /offers` para traer las ofertas activas.
- Los componentes del catálogo buscan la oferta de un producto con `offers.find(o => o.producto === product._id)`.

### `OrderContext`

Pedidos del usuario autenticado (y todos los pedidos para el admin).

```ts
// context/OrderContext.tsx
interface OrderContextType {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchMyOrders: () => Promise<void>                                        // GET /orders/my
  fetchAllOrders: () => Promise<void>                                       // GET /orders (admin)
  createOrder: (items: CartItem[]) => Promise<void>
  acceptOrder: (id: string, montoFinal: number) => Promise<void>           // admin
  rejectOrder: (id: string, motivoRechazo?: string) => Promise<void>       // admin
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>   // admin: pagado→en preparación→entregado
  initPayment: (orderId: string) => Promise<string>                        // usuario: devuelve init_point de MP
}

type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'paid' | 'in_preparation' | 'delivered'
```

- `fetchMyOrders` solo funciona con `auth.role === 'user'`.
- `fetchAllOrders` y `updateOrderStatus` solo los usan los componentes del panel admin.

### Árbol de providers en `main.tsx`

```tsx
<AuthContextProvider>
  <ProductsContextProvider>
    <OffersContextProvider>
      <CartContextProvider>
        <OrderContextProvider>
          <App />
        </OrderContextProvider>
      </CartContextProvider>
    </OffersContextProvider>
  </ProductsContextProvider>
</AuthContextProvider>
```

---

## Flujo principal de negocio

```
1. Usuario accede a la app
      ↓
2. Se verifica sesión existente (GET /auth/me via AuthContext)
      ↓
3. Navega el catálogo (GET /products?categoria=:id)
      ↓
4. Agrega productos al carrito (CartContext — local)
      ↓
5. Inicia sesión si no está autenticado (POST /users/login)
      ↓
6. Confirma pedido (POST /orders → genera Order en BD con status "pending", vacía el carrito)
      ↓
7. Admin ve el pedido en su panel (AdminOrders)
      ↓
8a. Admin RECHAZA → PUT /orders/:id/reject → status: "rejected"
      (el usuario ve el rechazo y rejectionReason opcional en su historial)
8b. Admin ACEPTA → carga finalAmount → PUT /orders/:id/accept → status: "accepted"
      ↓
9. Cliente ve el pedido con status "accepted" y el finalAmount; aparece botón "Pagar"
      ↓
10. Cliente hace click en "Pagar"
      → POST /payments/create-preference/:orderId
      → Backend crea Preference en MP con finalAmount
      → Devuelve init_point
      → Frontend redirige al usuario a la página de pago de Mercado Pago
      ↓
11. Cliente paga en Mercado Pago
      → MP envía webhook a POST /payments/webhook
      → Backend verifica firma, actualiza status: "paid" y guarda paymentId
      ↓
12. Admin ve en su panel el pedido con status "paid" (pago confirmado)
      ↓
13. Admin avanza: "paid" → "in_preparation" → "delivered"
      (PUT /orders/:id/status)
```

---

## Reglas de negocio

- **Precio por kilo es estimado.** El `approximateTotal` del pedido puede diferir del total real porque los cortes se pesan físicamente. El admin carga el `finalAmount` real al aceptar el pedido; ese es el monto que se cobra en Mercado Pago.
- **El pago usa `finalAmount`, no `approximateTotal`.** La Preference de Mercado Pago se crea con `finalAmount`. Si el admin no cargó `finalAmount`, el endpoint de creación de preferencia rechaza la petición con `400`.
- **Transiciones de estado permitidas:**
  - `pending` → `accepted` (admin acepta con finalAmount) o `rejected` (admin rechaza)
  - `accepted` → `paid` (webhook de MP confirma el pago; no lo puede cambiar el admin manualmente)
  - `paid` → `in_preparation` → `delivered` (admin via `PUT /orders/:id/status`)
- **Webhook de Mercado Pago.** El endpoint `POST /payments/webhook` es público (sin JWT). Verifica la firma con `MP_WEBHOOK_SECRET` antes de procesar. Solo actualiza el pedido si el `status` del pago es `approved`.
- **Un pago por pedido.** Si ya existe un `paymentId` en el pedido, la ruta `create-preference` rechaza una nueva solicitud con `409`.
- **Snapshot de precios.** Al crear un Order, se copian `price`, `name` y `unit` de cada Product en el subdocumento `items`. Así el historial no se altera si el admin cambia los precios luego.
- **Snapshot de domicilio.** El `deliveryAddress` se copia del perfil del usuario al crear el pedido; si el usuario modifica su domicilio después, el pedido existente no cambia.
- **Ofertas activas.** Al listar productos (`GET /products`), el backend inyecta la oferta vigente en cada producto (si existe). El frontend muestra el precio con descuento y el precio original tachado. El `priceSnapshot` del pedido usa el precio con descuento aplicado.
- **Soft delete.** Productos y categorías no se eliminan físicamente; se marcan con `active: false` para preservar el historial de pedidos.
- **Acceso al catálogo sin login.** Cualquier visitante puede ver el catálogo. Solo se requiere autenticación para confirmar un pedido.

---

## Variables de entorno

```env
# backend/.env
PORT=3001
MONGO_URI=mongodb://localhost:27017/frigorifico5estrellas
JWT_SECRET=supersecretkey
NODE_ENV=development
NODEMAILER_USER=correo@ejemplo.com
NODEMAILER_PASS=password_de_correo
CLIENT_URL=http://localhost:5173
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxx   # token de Mercado Pago (productivo o test)
MP_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx      # clave para verificar firma del webhook de MP
```

```env
# frontend — vite usa VITE_ como prefijo
VITE_API_URL=http://localhost:3001/api
```
