# Frigorífico 5 Estrellas — Pedidos Online

Aplicación web de pedidos para el frigorífico **5 Estrellas**. Los clientes navegan el catálogo, arman su carrito y confirman un pedido. El administrador revisa el pedido, carga el monto final real (tras el pesaje) y lo acepta o rechaza. Si se acepta, el cliente paga online mediante **Mercado Pago Checkout Pro**. El pago se confirma automáticamente por webhook.

---

## ✨ Características principales

- Catálogo de productos filtrado por categoría (Achuras, Carne vacuna, Cerdo, Pollo, Fiambrería, Quesería, Envasados y más)
- Precios por kilo o por unidad; precio estimado hasta el pesaje físico
- Sistema de ofertas con descuento aplicado automáticamente al snapshot del pedido
- Flujo de estados: `pendiente → aceptado → pagado → en preparación → entregado`
- Autenticación dual e independiente: área de clientes y panel de administración
- Pago con Mercado Pago Checkout Pro (redirect) confirmado por webhook
- Sesión persistente con JWT en cookie httpOnly
- Historial de pedidos con precios y domicilio guardados como snapshot
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
| Backend | Node.js + Express | 5.x |
| Base de datos | MongoDB + Mongoose | 9.x |
| Autenticación | JWT + bcrypt | 9.x / 6.x |
| Validación | Zod (schemas compartidos en `shared/`) | 4.x |
| Dev server | Nodemon | 3.x |
| Imágenes | Cloudinary | 2.x |
| Email | Nodemailer | 9.x |
| Pagos | Mercado Pago SDK | — |

---

## 📁 Estructura del proyecto

```
frigorifico-5-estrellas/
├── backend/
│   ├── index.js               # Entry point
│   ├── server.js              # Conexión a BD y app.listen()
│   ├── app.js                 # Express: middlewares globales + rutas
│   ├── config/                # cookie.js, db.config.js, mail, cloudinary
│   ├── models/                # User, Admin, Category, Product, Offer, OrderItem, Order
│   ├── controllers/           # auth, user, admin (+ pendientes: product, order, payment...)
│   ├── repository/            # user, admin (+ pendientes: product, order...)
│   ├── routes/                # auth, user, admin (+ pendientes)
│   └── middlewares/           # verifyAuth.js, verifyRole.js, validate.js (Zod), rateLimiters.js, multer.js
│
├── shared/                    # Schemas de Zod compartidos entre backend y frontend (standalone)
│   ├── package.json
│   ├── index.js               # Re-exporta todos los schemas
│   └── schemas/                # auth.schema.js, contact.schema.js
│
└── frontend/
    └── src/
        ├── context/           # AuthContext (+ pendientes: Cart, Product, Category, Order)
        ├── hooks/             # UseAuth, UseDashboardUser, UseDashboardAdmin
        ├── components/        # VerifyAuth (guarda rutas privadas)
        ├── services/          # api.ts (Axios), auth.service.ts
        └── types/             # auth.types.ts
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
VITE_API_URL=http://localhost:3001/api
```

> La variable de Mongo es `MONGO_URL` (no `MONGO_URI`). La URL del frontend desde el backend es `FRONTEND_URL` (no `CLIENT_URL`).

---

## 🧪 Validación de datos

Los schemas de validación viven en `shared/`, una carpeta standalone (con su propio `package.json` y sin npm workspaces) compartida entre backend y frontend mediante rutas relativas.

- **Backend:** middleware genérico `validate(schema)` que corre `safeParse` sobre `req.body` antes del controller. Si falla, corta con `400` y los errores por campo. Aplicado en login, registro de usuarios/admins y en `POST /contact`.
- **Frontend:** los formularios (`Login`, `Contact`) usan react-hook-form con `zodResolver`, y los tipos se derivan de los schemas con `z.infer` en vez de interfaces manuales. Las respuestas de la API también se validan con `schema.parse()` en la capa de servicios.
- **Por qué:** la validación del frontend es una mejora de UX (feedback inmediato); la seguridad real siempre la garantiza el backend, que valida en todos los casos.

---

## 🔐 Autenticación

La sesión se maneja con un JWT almacenado en cookie httpOnly. Hay dos flujos independientes:

- **Usuario:** `POST /api/login/user` con `{ email, password }`
- **Admin:** `POST /api/login/admin` con `{ username, password }`

Ambos devuelven `{ id, role }` y setean la misma cookie `token`. El endpoint `GET /api/me` restaura la sesión al montar la app sin consultar la base de datos. El logout unificado `POST /api/logout` limpia la cookie en ambos casos.

---

## 📦 API — Endpoints implementados

Base URL: `http://localhost:3001/api`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/me` | token | Devuelve `{ id, role }` del JWT activo |
| POST | `/api/logout` | — | Limpia la cookie de sesión |
| POST | `/api/register/user` | — | Registrar nuevo usuario |
| POST | `/api/login/user` | — | Login de usuario |
| GET | `/api/dashboard/user` | user | Perfil del usuario autenticado |
| POST | `/api/register/admin` | — | Crear admin |
| POST | `/api/login/admin` | — | Login de admin |
| GET | `/api/dashboard/admin` | admin | Datos del admin autenticado |

---

## 📌 Estado de implementación

### Listo

- Todos los modelos de MongoDB: `User`, `Admin`, `Category`, `Product`, `Offer`, `OrderItem`, `Order`
- Auth completa: registro, login y dashboard para usuarios y admins
- Middlewares `verifyAuth` y `verifyRole`
- `AuthContext` con estado granular de loading por operación
- Hooks `UseAuth`, `UseDashboardUser`, `UseDashboardAdmin`
- Componente `VerifyAuth` para proteger rutas privadas
- `auth.service.ts` con todas las llamadas HTTP de autenticación
- Instancia Axios configurada con `baseURL` y `withCredentials`
- Tipos TypeScript completos para el módulo de auth
- Validación con Zod (schemas compartidos en `shared/`) en auth, registro y contacto

### Pendiente

- Controllers, repositories y routes de: productos, categorías, ofertas, pedidos y pagos
- Configuración de Cloudinary (upload de imágenes), Nodemailer y Mercado Pago SDK
- Contextos de frontend: `CartContext`, `ProductContext`, `CategoryContext`, `OrderContext`
- Páginas: Home, Catálogo, Carrito, Pedidos del usuario, panel de admin
- Configuración del router en `App.tsx`

---

## 💼 Flujo de negocio

```
Usuario navega el catálogo sin login
  → Agrega productos al carrito
  → Inicia sesión (o se registra)
  → Confirma pedido → status: "pending"
        ↓
Admin revisa el pedido desde su panel
  → Rechaza → status: "rejected"
  → Acepta con monto final → status: "accepted"
        ↓
Usuario ve el pedido aceptado y el monto real
  → Hace clic en "Pagar" → Mercado Pago Checkout Pro
        ↓
Webhook de MP confirma el pago → status: "paid"
        ↓
Admin avanza: "paid" → "in_preparation" → "delivered"
```
