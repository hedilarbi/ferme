# Ferme — Multi-tenant Blog Network

A single Next.js 16 (App Router) application that serves an unlimited number of blog/content sites from one codebase, routing tenants by hostname.

## How it works

```
deco-salon.localhost:3000  ──►  proxy.ts reads hostname
guide-canape.localhost:3000 ──►  sets x-tenant-hostname header
                                    │
                            app/(site)/layout.tsx
                                    │
                            getCurrentSite()
                                    │
                            prisma.domain.findUnique({ hostname })
                                    │
                            renders site-specific layout + content
```

`proxy.ts` runs before every request, normalizes the hostname, and injects it as `x-tenant-hostname`. All server components read this header through `getCurrentSite()`, which is deduped per request via React's `cache()`.

## Local setup

### Prerequisites

- Node.js ≥ 20
- No external database is required. The project uses SQLite through Prisma.

### 1. Clone and install

```bash
git clone <repo>
cd ferme
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Default SQLite database: prisma/dev.db
```

### 3. Sync the SQLite schema and seed

```bash
npm run db:push      # create/update the SQLite tables from prisma/schema.prisma
npm run db:seed      # seed 2 demo tenants
```

### 4. Start dev server

```bash
npm run dev
```

### 5. Open in browser

| URL | Tenant |
|-----|--------|
| `http://deco-salon.localhost:3000` | Déco Salon (amber theme) |
| `http://guide-canape.localhost:3000` | Guide Canapé (blue theme) |

> **Note:** `*.localhost` subdomains resolve to `127.0.0.1` on macOS and modern Linux without any `/etc/hosts` changes. On Windows, you may need to add entries manually.

## Adding a new tenant

### Via seed / script

Edit `prisma/seed.ts` and re-run `npm run db:seed`.

### Via internal API

```bash
curl -X POST http://localhost:3000/api/internal/sites \
  -H "Content-Type: application/json" \
  -H "x-internal-secret: change-me-in-production" \
  -d '{
    "slug": "mon-site",
    "name": "Mon Site",
    "brandName": "Mon Site",
    "hostname": "mon-site.localhost",
    "primaryColor": "#7c3aed",
    "designKey": "default"
  }'
```

### Custom domains in production

Add a `Domain` record pointing `my-custom-domain.com` to the right `Site`. Your reverse proxy (nginx/Caddy) handles TLS; Next.js sees only the hostname.

## Project structure

```
ferme/
├── app/
│   ├── (site)/            # Tenant route group — all public pages
│   │   ├── layout.tsx     # Loads site, injects theme CSS vars
│   │   ├── page.tsx       # Homepage
│   │   ├── about/
│   │   ├── articles/
│   │   │   └── [slug]/
│   │   └── categories/
│   │       └── [slug]/
│   ├── api/
│   │   ├── health/        # GET /api/health — liveness probe
│   │   └── internal/
│   │       └── sites/     # POST — create site record
│   ├── robots.ts          # Per-tenant robots.txt
│   ├── sitemap.ts         # Per-tenant sitemap.xml
│   ├── layout.tsx         # Root HTML shell (minimal)
│   └── not-found.tsx      # "Site not found" page
├── components/
│   ├── designs/          # Per-tenant design registry + implementations
│   │   ├── deco/         # Editorial warm design for deco-salon
│   │   ├── guide/        # Practical guide design for guide-canape
│   │   ├── registry.ts   # designKey -> design components
│   │   └── types.ts
│   └── *.tsx             # Legacy/shared components kept for reuse
├── lib/
│   ├── db.ts              # Prisma singleton
│   ├── tenant/
│   │   ├── types.ts       # SiteContext, SiteWithRelations types
│   │   ├── resolve-tenant.ts  # hostname → Site DB query
│   │   ├── get-current-site.ts # Request-scoped tenant loader
│   │   └── cache.ts       # Cache tags + shape transformer
│   └── utils/
│       └── hostname.ts    # Normalization helpers
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── proxy.ts               # Next.js 16 proxy (replaces middleware.ts)
├── next.config.ts
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Docker deployment

```bash
# Build and run the app with a persistent SQLite volume
docker compose up --build -d

# Initialize the SQLite database inside the container
docker compose exec app npm run db:push
docker compose exec app npm run db:seed
```

`docker-compose.yml` stores the SQLite database in the `sqlite_data` Docker
volume at `/data/ferme.db`.

### Environment variables for production

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | SQLite file URL, e.g. `file:./dev.db` locally or `file:/data/ferme.db` in Docker |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Multi-instance | 32-byte base64 key |
| `DEPLOYMENT_VERSION` | Rolling deploys | Git SHA for version-skew protection |
| `INTERNAL_API_SECRET` | ✅ | Shared secret for `/api/internal/*` |

## Available npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:migrate` | Create + run migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset SQLite database and re-seed |

## Data model overview

```
Site (1) ──── (n) Domain         (one site, many hostnames)
Site (1) ──── (n) Article
Site (1) ──── (n) Category
Site (1) ──── (n) Author
Site (1) ──── (n) NavigationItem
Site (1) ──── (1) ThemeSettings
Site (1) ──── (1) SeoSettings
Article (n) ── (n) Category      (join via ArticleCategories)
Article (n) ── (1) Author
```

`ThemeSettings.designKey` selects the visual implementation for each tenant.
Current seeded values:

| Tenant | `designKey` |
|--------|-------------|
| `deco-salon.localhost` | `deco` |
| `guide-canape.localhost` | `guide` |

## Future extensions

- **Admin panel** — add `app/admin/` behind auth, operates on Site/Article records
- **Article generation jobs** — add a queue worker that calls an AI API and creates Article records
- **Persistent cache** — wire `lib/tenant/cache.ts` tags to a cache handler when needed
- **Per-tenant analytics** — add `siteId` to analytics events via the proxy header
- **Custom domains management UI** — CRUD for Domain records with DNS verification flow
