# eCommerceKume

Plataforma de venta de activos digitales (ebooks, PDFs, cursos). Monorepo con backend Express + frontend Next.js, pagos con Mercado Pago y entrega automática por email.

## Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 15, React 19, Tailwind CSS v4, Zustand, TanStack Query |
| **Backend** | Node.js, Express, TypeScript |
| **Base de datos** | PostgreSQL (Railway) + Prisma ORM |
| **Pagos** | Mercado Pago (SDK React + API) |
| **Email** | Resend |
| **Storage** | Railway Volume / local |
| **Package manager** | pnpm (workspace monorepo) |

## Estructura

```
eCommerceKume/
├── apps/
│   ├── api/          # Backend Express (puerto 3001)
│   │   ├── prisma/   # Schema y migraciones
│   │   └── src/
│   │       ├── lib/          # Prisma, JWT, Resend, MercadoPago, storage
│   │       ├── middleware/   # Auth, upload
│   │       └── routes/
│   │           ├── admin/    # auth, products, orders, reviews, stats
│   │           ├── checkout.ts
│   │           ├── download.ts
│   │           ├── products.ts
│   │           ├── reviews.ts
│   │           └── webhook.ts
│   └── web/          # Frontend Next.js (puerto 3000)
│       └── src/
│           ├── app/
│           │   ├── admin/     # Panel de administración
│           │   ├── productos/ # Catálogo y detalle de producto
│           │   ├── checkout/  # Flujo de pago
│           │   ├── download/  # Descarga de producto
│           │   └── success/   # Confirmación de compra
│           ├── components/
│           └── lib/
├── Activos/          # PDFs y recursos del proyecto
├── .env.example      # Variables de entorno de referencia
└── package.json      # Scripts raíz del monorepo
```

## Requisitos

- Node.js >= 20
- pnpm >= 9
- PostgreSQL (Railway recomendado)

## Setup local

### 1. Clonar el repo

```bash
git clone https://github.com/guillena/eCommerceKume.git
cd eCommerceKume
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example apps/api/.env
```

Editar `apps/api/.env` con tus valores:

```env
DATABASE_URL="postgresql://usuario:password@host:puerto/ecommerce_dev"
RESEND_API_KEY=re_xxxxxxxxxxxx
JWT_SECRET=tu_secreto_largo_aqui
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=tu_password
MP_ACCESS_TOKEN=tu_access_token_mp
MP_PUBLIC_KEY=tu_public_key_mp
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Configurar la base de datos

```bash
# Generar cliente Prisma
pnpm db:generate

# Primera vez: crear tablas
pnpm --filter api exec prisma db push

# O con migraciones:
pnpm db:migrate
```

### 5. (Opcional) Seed inicial

```bash
pnpm db:seed
```

### 6. Correr en desarrollo

```bash
pnpm dev
```

- 🌐 Web: http://localhost:3000
- ⚙️ API: http://localhost:3001
- 🏥 Health check: http://localhost:3001/api/health

## Scripts

```bash
pnpm dev               # API + Web en modo desarrollo
pnpm build             # Build de producción
pnpm start             # Iniciar en modo producción

pnpm db:generate       # Generar cliente Prisma
pnpm db:migrate        # Crear nueva migración (dev)
pnpm db:migrate:deploy # Aplicar migraciones (prod)
pnpm db:studio         # Abrir Prisma Studio
pnpm db:seed           # Poblar BD con datos de ejemplo

pnpm lint              # Linter en todos los paquetes
```

## API — Endpoints principales

### Públicos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/products` | Listado de productos |
| `GET` | `/api/products/:slug` | Detalle de producto |
| `GET` | `/api/categories` | Categorías |
| `GET` | `/api/preview/:slug` | Preview del PDF |
| `POST` | `/api/checkout` | Crear preferencia de pago MP |
| `GET` | `/api/download` | Descarga con token |
| `GET/POST` | `/api/reviews` | Reseñas de productos |
| `GET` | `/api/exchange-rate` | Cotización USD/ARS |
| `POST` | `/api/webhook` | Webhook de Mercado Pago |

### Admin (requieren JWT)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/admin/login` | Login de administrador |
| `GET/POST/PUT/DELETE` | `/api/admin/products` | CRUD de productos |
| `GET` | `/api/admin/orders` | Listado de órdenes |
| `GET` | `/api/admin/orders/:id` | Detalle de orden |
| `POST` | `/api/admin/orders/:id/resend-email` | Reenviar email de descarga |
| `GET` | `/api/admin/reviews` | Moderación de reseñas |
| `GET` | `/api/admin/stats` | Dashboard estadísticas |

## Flujo de compra

```
Cliente selecciona producto
        ↓
POST /api/checkout → crea preferencia en Mercado Pago
        ↓
Redirect a checkout de MP
        ↓
MP procesa el pago → POST /api/webhook
        ↓
API genera token de descarga + envía email (Resend)
        ↓
Cliente descarga el producto con el link del email
```

## Deploy (Railway)

El proyecto incluye `Dockerfile` y `railway.toml` en `apps/api/` para deploy automático.

Variables de entorno en Railway (usar URLs internas):

```env
DATABASE_URL=postgresql://postgres:password@postgres.railway.internal:5432/railway
NODE_ENV=production
```

## Variables de entorno — referencia completa

Ver [`.env.example`](.env.example) para la lista completa con descripción de cada variable.
