# 03 — Estructura del Monorepo

Este documento define dónde vive cada pieza del código. El objetivo es que Claude Code (y cualquier desarrollador) sepa sin ambigüedad dónde crear un archivo nuevo y dónde buscar uno existente.

La decisión de usar Turborepo + pnpm está justificada en `01-architecture.md`. Este documento cubre la estructura concreta y las reglas de ubicación.

## Árbol completo

```
loreal-clienteling/
│
├── apps/
│   ├── api/                      # Backend principal (NestJS)
│   ├── web/                      # Panel gerencial (Next.js 15)
│   ├── mobile/                   # App del BA (Expo + React Native)
│   └── ai-service/               # Motor de recomendación (FastAPI)
│
├── packages/
│   ├── database/                 # Schemas Drizzle + PowerSync
│   ├── domain/                   # Lógica de negocio pura
│   ├── contracts/                # Tipos y validadores compartidos
│   ├── api-client/               # Cliente tipado del API
│   ├── brand-config/             # Configuración multi-marca
│   ├── i18n/                     # Traducciones (español primario)
│   └── utils/                    # Utilidades puras compartidas
│
├── tooling/
│   ├── eslint-config/
│   ├── typescript-config/
│   ├── tailwind-config/
│   └── jest-config/
│
├── infra/
│   ├── terraform/                # AWS México (IaC)
│   └── docker/                   # docker-compose para dev local
│
├── docs/                         # Esta documentación
│   ├── README.md
│   ├── 01-architecture.md
│   ├── 02-domain-model.md
│   ├── 03-monorepo-structure.md
│   ├── 04-security-compliance.md
│   ├── 05-offline-sync.md
│   └── 06-rfp-compliance-matrix.md
│
├── rfp/                          # Documentos originales del RFP del cliente
│
├── package.json                  # Root package.json con scripts top-level
├── pnpm-workspace.yaml           # Definición de workspaces
├── turbo.json                    # Configuración de Turborepo
└── .gitignore
```

## Detalle por carpeta

### `/apps` — aplicaciones ejecutables

Cada carpeta dentro de `/apps` es una aplicación que se despliega independientemente.

#### `/apps/api` (NestJS)

Backend principal. Expone REST para web y mobile, coordina sincronización con PowerSync, orquesta integraciones externas.

```
apps/api/
├── src/
│   ├── modules/                  # Un módulo NestJS por sección del RFP
│   │   ├── auth/                 # Autenticación con Better Auth
│   │   ├── users/                # RF-51 a RF-56 (gestión de usuarios internos)
│   │   ├── customers/            # RF-01 a RF-12 (gestión de clientes 360°)
│   │   ├── beauty/               # RF-58 a RF-63 (perfiles de belleza, shades)
│   │   ├── products/             # RF-17, RF-62 (catálogo de productos)
│   │   ├── recommendations/      # RF-13 a RF-19 (recomendaciones)
│   │   ├── purchases/            # RF-20 a RF-25 (compras y atribución)
│   │   ├── samples/              # RF-08, RF-61 (muestras)
│   │   ├── appointments/         # RF-26 a RF-33 (citas)
│   │   ├── communications/       # RF-34 a RF-39 (seguimiento, WhatsApp)
│   │   ├── analytics/            # RF-40 a RF-50 (dashboards, reportes)
│   │   ├── brands/               # RNF-13 (multi-marca)
│   │   ├── stores/               # RNF-14 (multi-tienda)
│   │   ├── zones/                # Zonas (scope de supervisor)
│   │   ├── consents/             # RF-02, RNF-07 (consentimientos)
│   │   ├── audit/                # RNF-04 (audit logs LFPDPPP)
│   │   └── integrations/         # Adaptadores para POS, CRM, e-commerce
│   │       ├── pos/              # Mockeado en universitario
│   │       ├── crm/              # Mockeado en universitario
│   │       ├── ecommerce/        # Mockeado en universitario
│   │       └── whatsapp/         # WhatsApp Business API
│   │
│   ├── common/                   # Utilidades cross-cutting
│   │   ├── guards/               # RBAC guards (CASL)
│   │   ├── interceptors/         # Audit logging, timing
│   │   ├── decorators/           # @RequireRole, @BrandScope, @StoreScope
│   │   ├── filters/              # Exception filters
│   │   ├── middleware/           # CORS, rate limiting
│   │   └── pipes/                # Validación con Zod
│   │
│   ├── config/                   # Configuración con @nestjs/config
│   ├── app.module.ts             # Root module
│   └── main.ts                   # Bootstrap
│
├── test/                         # Tests e2e
├── .env.example
├── package.json
└── tsconfig.json
```

**Regla clave**: cada módulo es autónomo con su propio `controller`, `service`, `dto/`, `entities/` (si aplica). La lógica de negocio pura no vive aquí — vive en `/packages/domain/` y se importa.

#### `/apps/web` (Next.js 15)

Panel web para Gerentes, Supervisores y Administradores.

```
apps/web/
├── app/                          # App Router de Next.js 15
│   ├── (auth)/                   # Grupo de rutas sin layout de dashboard
│   │   ├── login/
│   │   └── reset-password/
│   │
│   ├── (dashboard)/              # Grupo de rutas con layout de dashboard
│   │   ├── layout.tsx            # Sidebar, header, auth check
│   │   │
│   │   ├── manager/              # Rutas accesibles solo por role=manager
│   │   │   ├── overview/         # RF-40 (dashboard ejecutivo de tienda)
│   │   │   ├── bas/              # RF-45 (desempeño por BA)
│   │   │   ├── customers/        # RF-43 (listado de clientes)
│   │   │   └── appointments/     # RF-41, RF-46 (métricas de citas)
│   │   │
│   │   ├── supervisor/           # Rutas accesibles solo por role=supervisor
│   │   │   ├── overview/         # Resultados por zona
│   │   │   ├── stores/           # Comparativo entre tiendas
│   │   │   └── trends/           # RF-44 (gráficos de desempeño)
│   │   │
│   │   └── admin/                # Rutas accesibles solo por role=admin
│   │       ├── brands/           # Gestión de marcas (RNF-13)
│   │       ├── stores/           # Gestión de tiendas (RNF-14)
│   │       ├── users/            # Gestión de usuarios internos
│   │       ├── templates/        # RF-36 (plantillas de mensajes)
│   │       ├── configurations/   # RNF-16 (configuración por marca)
│   │       └── audit/            # Revisión de audit logs (LFPDPPP)
│   │
│   ├── api/                      # API routes mínimos (solo lo que no puede ir a NestJS)
│   └── layout.tsx                # Root layout
│
├── components/                   # Componentes React del panel
│   ├── ui/                       # Shadcn/ui base components
│   ├── charts/                   # Recharts para visualizaciones
│   ├── tables/                   # Tables con filtros y exportación (RF-49)
│   └── forms/                    # Forms con React Hook Form + Zod
│
├── lib/                          # Helpers client-side
│   ├── auth.ts                   # Cliente de Better Auth
│   ├── api.ts                    # Usa @loreal/api-client
│   └── hooks/                    # Custom hooks
│
├── public/                       # Assets estáticos
├── .env.example
├── next.config.js                # Configurado con transpilePackages para monorepo
├── package.json
└── tsconfig.json
```

**Regla clave**: las rutas se agrupan por rol de usuario. El check de permisos se hace en el `layout.tsx` de cada grupo (manager, supervisor, admin).

#### `/apps/mobile` (Expo + React Native)

App del Beauty Advisor. iPad-first pero compatible con otros tamaños.

```
apps/mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── _layout.tsx
│   │
│   ├── (ba)/                     # Rutas autenticadas del BA
│   │   ├── _layout.tsx           # Tab navigation
│   │   ├── index.tsx             # Dashboard del BA (eventos del día, alertas)
│   │   │
│   │   ├── customer/
│   │   │   ├── search.tsx        # RF-03 búsqueda
│   │   │   ├── register.tsx      # RF-01 registro nuevo
│   │   │   ├── [id].tsx          # RF-04 vista unificada
│   │   │   ├── [id]/
│   │   │   │   ├── history.tsx   # Historial de compras y recomendaciones
│   │   │   │   ├── beauty.tsx    # Perfil de belleza (RF-05, RF-58)
│   │   │   │   ├── consents.tsx  # Consentimientos
│   │   │   │   └── communications.tsx
│   │   │   └── privacy-notice.tsx # RF-02
│   │   │
│   │   ├── recommend/
│   │   │   ├── scan.tsx          # RF-14 escaneo de SKU
│   │   │   ├── suggest.tsx       # RF-15 motor de recomendación (IA)
│   │   │   └── lookbook.tsx      # RF-18 lookbook compartible
│   │   │
│   │   ├── appointment/
│   │   │   ├── calendar.tsx      # RF-27 vista de calendario
│   │   │   ├── create.tsx        # RF-26 crear cita
│   │   │   └── [id].tsx
│   │   │
│   │   ├── followup/
│   │   │   ├── index.tsx         # RF-34 lista de seguimientos
│   │   │   └── [customerId].tsx  # Enviar seguimiento
│   │   │
│   │   └── profile/              # Configuración del propio BA
│   │
│   └── _layout.tsx               # Root layout con providers (PowerSync, Auth, i18n)
│
├── components/                   # Componentes UI específicos de mobile
│   ├── customer/
│   ├── recommendation/
│   ├── appointment/
│   └── common/                   # Botones, inputs adaptados a iPad
│
├── lib/
│   ├── powersync/                # Cliente PowerSync + schema local
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── connector.ts
│   ├── auth/                     # Cliente Better Auth con secure storage
│   ├── offline/                  # Queue de operaciones offline
│   └── hooks/                    # Custom hooks
│
├── assets/                       # Imágenes, fuentes
├── app.json                      # Expo config
├── .env.example
├── package.json
└── tsconfig.json
```

**Regla clave**: Expo Router es file-based. La estructura de carpetas dentro de `/app` ES la estructura de navegación.

#### `/apps/ai-service` (FastAPI)

Microservicio de IA. Solo se llama desde el API principal, no directamente desde frontends.

```
apps/ai-service/
├── app/
│   ├── main.py                   # FastAPI entry point
│   │
│   ├── routers/                  # Endpoints HTTP
│   │   ├── recommendations.py    # RF-15 recomendaciones
│   │   ├── segmentation.py       # RF-11 segmentación
│   │   └── replenishment.py      # RF-16 reposición
│   │
│   ├── services/                 # Lógica de negocio
│   │   ├── claude_client.py      # Cliente Anthropic API
│   │   ├── embeddings.py         # Generar embeddings con pgvector
│   │   ├── similarity.py         # Búsqueda semántica de productos
│   │   └── anonymizer.py         # Remueve PII antes de enviar a Claude
│   │
│   ├── schemas/                  # Pydantic models (DTOs)
│   ├── db/                       # SQLAlchemy para leer desde Postgres
│   └── config.py
│
├── tests/
├── requirements.txt
├── .env.example
└── Dockerfile
```

**Nota**: como se explica en `01-architecture.md`, si el equipo no tiene capacidad de Python, este servicio puede consolidarse dentro de NestJS. La arquitectura actual mantiene la opción abierta.

### `/packages` — código compartido entre apps

Regla fundamental: un paquete se justifica **solo si dos o más apps lo consumen**. Si solo lo usa una app, es una carpeta interna, no un package.

#### `/packages/database`

Schemas de Drizzle, migraciones, y schema cliente de PowerSync. Consumido por `api`, `ai-service` (vía SQLAlchemy que lee las mismas tablas) y referenciado por `mobile` para el schema local.

```
packages/database/
├── schema/                       # Drizzle schemas
│   ├── brands.ts
│   ├── stores.ts
│   ├── zones.ts
│   ├── users.ts
│   ├── customers.ts
│   ├── beauty-profiles.ts
│   ├── products.ts
│   ├── recommendations.ts
│   ├── purchases.ts
│   ├── samples.ts
│   ├── appointments.ts
│   ├── communications.ts
│   ├── consents.ts
│   ├── audit-logs.ts
│   ├── message-templates.ts
│   └── index.ts                  # Re-exports
│
├── migrations/                   # Migraciones generadas por Drizzle
├── seed/                         # Seed data para desarrollo
│   ├── brands.ts                 # Lancôme, Kiehl's, YSL, Maybelline, etc.
│   ├── stores.ts                 # Tiendas de Liverpool y Palacio
│   ├── products.ts               # Catálogo realista
│   └── index.ts
│
├── powersync-schema/             # Schema equivalente para SQLite local
│   └── index.ts                  # Ver 05-offline-sync.md para detalle
│
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

#### `/packages/domain`

Lógica de negocio pura, sin dependencias de frameworks. Son funciones puras testables en aislamiento.

```
packages/domain/
├── src/
│   ├── customer-segmentation/    # Lógica de RF-11
│   │   ├── calculate-segment.ts
│   │   └── calculate-segment.test.ts
│   │
│   ├── replenishment/            # Lógica de RF-16
│   │   ├── calculate-next-purchase.ts
│   │   └── calculate-next-purchase.test.ts
│   │
│   ├── attribution/              # Lógica de RF-25
│   │   ├── attribute-purchase-to-ba.ts
│   │   └── attribute-purchase-to-ba.test.ts
│   │
│   ├── lifecycle-events/         # Lógica de RF-09
│   │   ├── generate-life-event-alerts.ts
│   │   └── generate-life-event-alerts.test.ts
│   │
│   ├── shade-matching/           # Lógica de RF-58, RF-60
│   │   └── find-matching-shades.ts
│   │
│   ├── search/                   # Lógica de RF-03
│   │   └── rank-customer-search-results.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

**Regla crítica**: este paquete **no debe importar** NestJS, React, React Native ni ninguna librería de framework. Solo TypeScript, Zod y librerías puras.

#### `/packages/contracts`

Tipos TypeScript y validadores Zod compartidos entre todas las apps. Fuente única de verdad para formas de datos que cruzan fronteras de app.

```
packages/contracts/
├── src/
│   ├── api/                      # DTOs del API REST
│   │   ├── customers.ts
│   │   ├── recommendations.ts
│   │   ├── appointments.ts
│   │   └── ...
│   │
│   ├── events/                   # Eventos de dominio
│   ├── zod-schemas/              # Validadores reutilizables
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

#### `/packages/api-client`

Cliente tipado para consumir el API desde web y mobile. Se genera automáticamente desde los DTOs de `/contracts`.

```
packages/api-client/
├── src/
│   ├── queries/                  # Funciones de lectura (useQuery compatibles)
│   ├── mutations/                # Funciones de escritura
│   ├── hooks/                    # React hooks con React Query
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

#### `/packages/brand-config`

Configuración por marca (colores, logo, tono, plantillas por defecto). Cumple RNF-13.

```
packages/brand-config/
├── src/
│   ├── brands/
│   │   ├── lancome.ts
│   │   ├── kiehls.ts
│   │   ├── ysl-beauty.ts
│   │   ├── maybelline.ts
│   │   ├── loreal-paris.ts
│   │   └── ...
│   │
│   ├── types.ts                  # Interface BrandConfig
│   ├── loader.ts                 # Función para cargar config por brand_id
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

#### `/packages/i18n`

Traducciones. Español como primario (RF-12).

```
packages/i18n/
├── src/
│   ├── locales/
│   │   ├── es-MX/
│   │   │   ├── common.json
│   │   │   ├── ba.json           # Strings de la app mobile
│   │   │   ├── manager.json      # Strings del panel web
│   │   │   ├── errors.json
│   │   │   └── ...
│   │   └── en/                   # Inglés como backup (tests, debugging)
│   │
│   ├── index.ts
│   └── types.ts
│
├── package.json
└── tsconfig.json
```

#### `/packages/utils`

Utilidades genuinamente compartidas (formatters, validators básicos, helpers de fecha).

```
packages/utils/
├── src/
│   ├── formatters/
│   │   ├── currency.ts           # Formato MXN
│   │   ├── phone.ts              # Formato teléfono mexicano
│   │   ├── date.ts
│   │   └── shade.ts              # Formato shade code
│   │
│   ├── validators/
│   │   ├── email.ts
│   │   ├── phone-mx.ts           # Validación de celular mexicano
│   │   └── rfc.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

### `/tooling` — configuraciones compartidas

Configs reutilizables para ESLint, TypeScript, Tailwind, Jest. Cada app importa desde aquí en lugar de duplicar configs.

```
tooling/
├── eslint-config/                # Configs compartidas de ESLint
│   ├── base.js
│   ├── nextjs.js
│   ├── expo.js
│   ├── node.js
│   └── package.json
│
├── typescript-config/            # tsconfig.json compartidos
│   ├── base.json
│   ├── nextjs.json
│   ├── expo.json
│   ├── node.json
│   └── package.json
│
├── tailwind-config/              # Config de Tailwind compartido (web)
│   ├── tailwind.config.js
│   └── package.json
│
└── jest-config/                  # Config de Jest compartido
    ├── base.js
    └── package.json
```

### `/infra` — infraestructura como código

```
infra/
├── terraform/                    # Provisión de AWS México
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   ├── modules/
│   │   ├── networking/
│   │   ├── rds/
│   │   ├── ecs/
│   │   ├── s3/
│   │   └── secrets/
│   └── README.md
│
└── docker/                       # Docker Compose para dev local
    ├── docker-compose.yml
    ├── postgres/
    │   └── init.sql
    └── powersync/
        └── config.yaml
```

### `/docs`

Esta documentación. Vive con el código, versionada.

### `/rfp`

Documentos originales del RFP del cliente. Solo lectura histórica.

## Reglas de ubicación

Cuando el equipo o Claude Code va a crear un archivo nuevo, estas reglas determinan dónde:

### ¿Es lógica de negocio pura?

**Sí**: va a `/packages/domain/<dominio>/<archivo>.ts` con su test correspondiente.

**Ejemplos**: calcular segmento de lifecycle, calcular fecha de reposición, determinar atribución de venta.

### ¿Es un tipo o schema de datos compartido entre apps?

**Sí**: va a `/packages/contracts/src/<categoría>/<archivo>.ts`.

**Ejemplos**: DTO de creación de cliente, schema Zod de registro de cita.

### ¿Es un endpoint del API?

Va a `/apps/api/src/modules/<módulo>/`. Nunca va al frontend.

### ¿Es una página web?

Va a `/apps/web/app/<grupo>/<ruta>/page.tsx` según Next.js App Router.

### ¿Es una pantalla mobile?

Va a `/apps/mobile/app/<grupo>/<ruta>.tsx` según Expo Router.

### ¿Es un componente UI reutilizable?

- **Si solo lo usa web**: `/apps/web/components/<categoría>/`.
- **Si solo lo usa mobile**: `/apps/mobile/components/<categoría>/`.
- **Si lo usan ambos**: no se comparte. Se duplica. React Native y React web tienen primitivas distintas. Compartir UI introduce complejidad que no vale la pena para este caso.

### ¿Es un componente UI base sin lógica (botón, input, card)?

En web: instalar de Shadcn/ui en `/apps/web/components/ui/`.
En mobile: usar primitivas de React Native directamente o Tamagui (decisión diferida).

### ¿Es una utilidad genérica?

**Si la usa una sola app**: va adentro de esa app en `lib/utils/`.

**Si la usan dos o más apps**: va a `/packages/utils/`.

### ¿Es una migración de base de datos?

Se genera con `pnpm db:generate` desde `/packages/database/`. Nunca se escriben a mano.

### ¿Es configuración de infraestructura?

Terraform en `/infra/terraform/`. Docker local en `/infra/docker/`.

### ¿Es documentación?

- **Documentación técnica del sistema**: `/docs/`.
- **README de un package o app específico**: `README.md` dentro de esa carpeta.
- **Decisiones arquitectónicas puntuales (ADR)**: `/docs/adr/<ADR-XXX-titulo>.md` (crear carpeta cuando aparezca la primera).

## Comandos del monorepo

El `package.json` del root expone los comandos orquestados por Turborepo:

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "db:generate": "pnpm --filter @loreal/database generate",
    "db:migrate": "pnpm --filter @loreal/database migrate",
    "db:studio": "pnpm --filter @loreal/database studio",
    "db:seed": "pnpm --filter @loreal/database seed"
  }
}
```

## Cómo añadir una nueva app

```bash
# Crear la carpeta
mkdir -p apps/nueva-app

# Dentro de apps/nueva-app crear package.json con nombre @loreal/nueva-app
# Extender el tsconfig.json desde tooling/typescript-config
# Agregar al pnpm-workspace.yaml (ya incluye apps/* por glob)

# Instalar dependencias workspace
pnpm add @loreal/contracts @loreal/domain --filter @loreal/nueva-app

# Añadir targets en turbo.json si tiene tareas específicas
```

## Cómo añadir un nuevo package

```bash
# Crear la carpeta
mkdir -p packages/nuevo-package

# package.json con nombre @loreal/nuevo-package
# tsconfig.json extendiendo tooling/typescript-config/base.json

# Los workspaces lo detectan automáticamente por el glob packages/*
```

## Convenciones de naming

- **Archivos TypeScript/JavaScript**: `kebab-case.ts` (ej: `calculate-segment.ts`).
- **Componentes React**: `PascalCase.tsx` (ej: `CustomerCard.tsx`).
- **Hooks**: `use-<nombre>.ts` (ej: `use-customer-search.ts`).
- **Tests**: `<archivo>.test.ts` junto al archivo que testean.
- **Schemas Drizzle**: sustantivo plural (ej: `customers.ts`, no `customer.ts`).
- **Módulos NestJS**: nombre del módulo en plural (ej: `/modules/customers/`).
- **Branches de git**: `feat/<tema>`, `fix/<tema>`, `docs/<tema>`.
- **Commits**: Conventional Commits con ID de RFP cuando aplique.

## Dependencias entre packages

Diagrama de dependencias permitidas (flecha = "puede importar de"):

```
apps/api        ──► packages/database
                ──► packages/domain
                ──► packages/contracts
                ──► packages/brand-config
                ──► packages/i18n
                ──► packages/utils

apps/web        ──► packages/contracts
                ──► packages/api-client
                ──► packages/brand-config
                ──► packages/i18n
                ──► packages/utils

apps/mobile     ──► packages/contracts
                ──► packages/api-client
                ──► packages/brand-config
                ──► packages/i18n
                ──► packages/utils
                ──► packages/database (solo para powersync-schema)

apps/ai-service ──► (consume Postgres directamente; no importa de packages TS)

packages/domain     ──► packages/contracts
                    ──► packages/utils

packages/api-client ──► packages/contracts

packages/database   ──► packages/contracts (para tipos usados en schemas)
```

**Reglas críticas**:

- `packages/domain` **no puede importar** nada de `/apps/*`.
- `packages/contracts` **no puede importar** nada de `/apps/*` ni de otros packages (es la base).
- Un app **nunca importa** de otro app. Si dos apps necesitan lo mismo, se extrae a un package.
- Dependencias circulares entre packages están prohibidas y Turborepo las detecta.
