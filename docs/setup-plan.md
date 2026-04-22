# Plan de Setup — Backend completo

Plan de implementación del backend de la plataforma, de abajo hacia arriba. Cada fase se completa al 100% antes de avanzar a la siguiente. No incluye frontend (ni web ni mobile).

## Resultado esperado

Al finalizar las 8 fases:

```bash
docker compose -f infra/docker/docker-compose.yml up -d   # Postgres + PowerSync
pnpm db:migrate                                            # Schema en la DB
pnpm db:seed                                               # Datos de desarrollo
pnpm dev --filter=api --filter=ai-service                  # Backend corriendo
```

Backend funcional con auth, RBAC, todas las entidades del dominio, lógica de negocio, servicio de IA y seed de datos realistas.

---

## Fase 1: Monorepo base

**Objetivo**: estructura raíz del proyecto lista para que cualquier package o app se agregue sin fricción.

**Archivos a crear**:

- `package.json` — root con scripts top-level (`dev`, `build`, `lint`, `typecheck`, `test`, `db:*`)
- `pnpm-workspace.yaml` — define `apps/*`, `packages/*`, `tooling/*`
- `turbo.json` — pipelines de build, dev, lint, typecheck, test
- `.gitignore` — node_modules, .env, dist, .turbo, .expo, __pycache__, etc.
- `.npmrc` — configuración de pnpm para monorepo
- `tooling/typescript-config/` — tsconfigs base: `base.json`, `node.json`, `nextjs.json`, `expo.json`
- `tooling/eslint-config/` — configs: `base.js`, `node.js`
- `tooling/jest-config/` — config base de Jest

**Criterio de completado**:

- [x] `pnpm install` corre sin errores
- [x] `pnpm typecheck` corre (aunque no haya nada que checkear aún)
- [x] Git inicializado con primer commit

**Estado**: COMPLETADA

**Notas de implementación**:

- Root devDependencies: `turbo@^2.9.6`, `typescript@^6.0.3`
- TypeScript 6 deprecó `moduleResolution: node10` — se maneja con `ignoreDeprecations: "6.0"` en la config de ts-jest (`tooling/jest-config/base.js`), no en los tsconfigs de los packages
- `tooling/typescript-config/node.json` usa `emitDecoratorMetadata` y `experimentalDecorators` (necesario para NestJS en Fase 7)
- ESLint usa flat config (ESLint 9+)
- esbuild quedó en `ignoredBuiltDependencies` en `pnpm-workspace.yaml` (pnpm lo agrega automáticamente al no aprobar builds)

---

## Fase 2: `packages/contracts`

**Objetivo**: tipos TypeScript y schemas Zod compartidos entre todas las apps. Fuente única de verdad para formas de datos que cruzan fronteras.

**Contenido**:

- Enums del dominio: roles (`ba`, `manager`, `supervisor`, `admin`), lifecycle segments, skin types, skin tones, subtones, product categories, appointment statuses, communication channels, consent types, followup types, visit reasons, attribution reasons, etc.
- Schemas Zod para DTOs del API: crear/actualizar customer, recommendation, appointment, purchase, communication, etc.
- Tipos inferidos de los schemas Zod (`z.infer<>`)
- `package.json` con nombre `@loreal/contracts`

**Dependencias**: solo `zod`.

**Criterio de completado**:

- [x] `pnpm typecheck --filter=@loreal/contracts` pasa
- [x] Todos los enums del modelo de dominio (`02-domain-model.md`) están representados
- [x] Los DTOs principales tienen schema Zod con validación

**Estado**: COMPLETADA

**Notas de implementación**:

- 12 archivos de enums en `src/enums/`: roles, brand, store, customer, beauty, product, recommendation, purchase, appointment, communication, consent, audit
- 10 archivos de Zod schemas en `src/zod-schemas/`: common (pagination, dateRange), customers, beauty-profiles, recommendations, purchases, appointments, communications, consents, samples, users
- Cada enum exporta el objeto const, el tipo inferido, y un array de valores (ej: `UserRole`, `type UserRole`, `USER_ROLES`)
- Dependencia: solo `zod@^3.25.0`

---

## Fase 3: `packages/utils`

**Objetivo**: utilidades puras compartidas con tests.

**Contenido**:

- `formatters/currency.ts` — formato MXN ($1,234.56)
- `formatters/phone.ts` — formato teléfono mexicano (+52 55 1234 5678)
- `formatters/date.ts` — fechas en español México
- `validators/email.ts` — validación de email
- `validators/phone-mx.ts` — validación de celular mexicano (10 dígitos)
- Tests para cada formatter y validator
- `package.json` con nombre `@loreal/utils`

**Dependencias**: `@loreal/contracts` (para tipos si aplica), `date-fns` para fechas.

**Criterio de completado**:

- [x] `pnpm test --filter=@loreal/utils` pasa con todos los tests verdes (21 tests)
- [x] `pnpm typecheck --filter=@loreal/utils` pasa

**Estado**: COMPLETADA

**Notas de implementación**:

- `tsconfig.json` necesita `"types": ["jest"]` para que el typecheck reconozca `describe`, `it`, `expect`
- `jest.config.js` usa `require("@loreal/jest-config/base")` (CommonJS, porque Jest aún no soporta ESM config nativamente)
- `date-fns@^4.0.0` con locale `es` para formato de fechas en español
- 5 archivos de test, 21 tests totales

---

## Fase 4: `packages/database`

**Objetivo**: schemas Drizzle para todas las tablas del dominio, listos para generar migraciones.

**Tablas** (según `02-domain-model.md`):

1. `brands`
2. `brand_configs`
3. `stores`
4. `zones`
5. `users`
6. `customers`
7. `beauty_profiles`
8. `beauty_profile_shades`
9. `products`
10. `product_availability`
11. `recommendations`
12. `purchases`
13. `purchase_items`
14. `samples`
15. `appointments`
16. `communications`
17. `message_templates`
18. `consents`
19. `audit_logs`

**Archivos a crear**:

- `packages/database/schema/` — un archivo por tabla + `index.ts` que re-exporta todo
- `packages/database/drizzle.config.ts` — configuración apuntando a Postgres local
- `packages/database/package.json` con nombre `@loreal/database`
- Scripts: `generate` (genera migraciones), `migrate` (aplica migraciones), `studio` (abre Drizzle Studio)

**Dependencias**: `drizzle-orm`, `drizzle-kit`, `pg`, `@loreal/contracts`.

**Criterio de completado**:

- [x] `pnpm db:generate` genera migraciones sin error
- [x] Todos los campos documentados en `02-domain-model.md` están en los schemas
- [x] Relaciones entre tablas definidas (FKs, indices)
- [x] pgvector configurado para el campo `embedding` en `products` (1536 dimensions)
- [x] `pnpm typecheck --filter=@loreal/database` pasa

**Estado**: COMPLETADA

**Notas de implementación**:

- 19 tablas en 16 archivos de schema (beauty-profiles y products tienen tablas secundarias en el mismo archivo)
- `tsconfig.json` necesita `"types": ["node"]` para que `process.env` compile
- Migración generada: `migrations/0000_free_kree.sql` (regenerada en Fase 7a al agregar tablas de Better Auth)
- `drizzle.config.ts` URL por defecto apunta a `localhost:5433` (puerto mapeado, ver Fase 5)
- `beauty_profile_shades.product_id` no tiene FK explícita para evitar imports circulares — se puede agregar después con una migración manual si se necesita
- Dependencias: `drizzle-orm@^0.45.2` (actualizado en Fase 7a por peer dep de Better Auth), `pg@^8.13.0`, `drizzle-kit@^0.31.0`, `tsx@^4.19.0`

---

## Fase 5: Docker Compose + migraciones

**Objetivo**: infraestructura local que levanta en un comando y acepta migraciones.

**Archivos a crear**:

- `infra/docker/docker-compose.yml` — servicios:
  - **postgres**: imagen `pgvector/pgvector:pg16`, puerto **5433:5432** (5433 externo porque 5432 puede estar ocupado), volumen persistente
  - **powersync**: imagen oficial de PowerSync (`journeyapps/powersync-service:latest`), puerto 8080, config montada
- `infra/docker/postgres/init.sql` — configuración inicial:
  - `ALTER SYSTEM SET wal_level = logical`
  - `CREATE PUBLICATION powersync FOR TABLE ...` (las tablas sincronizables)
  - Extensión pgvector
- `infra/docker/powersync/config.yaml` — configuración de PowerSync apuntando a Postgres local
- `.env.example` en root con variables necesarias (DB_URL, etc.)

**Criterio de completado**:

- [x] `docker compose -f infra/docker/docker-compose.yml up -d` levanta Postgres
- [x] `pnpm db:migrate` aplica todas las migraciones (19 tablas creadas)
- [ ] `pnpm db:studio` abre Drizzle Studio y muestra las tablas vacías (no verificado pero listo)
- [x] Publicación de PowerSync creada (14 tablas sincronizables, verificadas con `pg_publication_tables`)
- [ ] PowerSync service no se verificó porque requiere sync-rules.yaml completo (se puede hacer en Fase 7)

**Estado**: COMPLETADA

**Notas de implementación**:

- Puerto externo de Postgres es **5433** (no 5432) porque el host puede tener Postgres local corriendo
- `init.sql` crea la extensión pgvector, setea `wal_level = logical`, y define una función `create_powersync_publication()` que se ejecuta manualmente después de que las migraciones crean las tablas
- Para crear la publicación después de migrar: `docker exec loreal-postgres psql -U loreal -d loreal_clienteling -c "SELECT create_powersync_publication();"`
- PowerSync config usa HMAC auth con secret `local-dev-secret-change-in-production` para desarrollo local
- `.env.example` creado en root con todas las variables necesarias
- Si el volumen de Postgres da error de versión incompatible, hacer `docker compose down -v` para borrar el volumen y recrear

---

## Fase 6: `packages/domain`

**Objetivo**: lógica de negocio pura en funciones testables sin dependencias de framework.

**Módulos** (según `02-domain-model.md`):

- `customer-segmentation/calculate-segment.ts` — RF-11: reglas de segmentación (new, returning, vip, at_risk) basadas en transacciones y tiempos
- `replenishment/calculate-next-purchase.ts` — RF-16: fecha estimada de agotamiento, ventana de recompra, promedios por clienta
- `attribution/attribute-purchase-to-ba.ts` — RF-25: reglas de atribución (recomendación activa 30d > última consulta 24h > sin atribución)
- `lifecycle-events/generate-life-event-alerts.ts` — RF-09: alertas de cumpleaños (7d), aniversario (7d), reposición (ventana)
- `shade-matching/find-matching-shades.ts` — RF-58, RF-60: búsqueda de shades compatibles
- `search/rank-customer-search-results.ts` — RF-03: ranking de resultados de búsqueda

Cada módulo tiene su `.test.ts` al lado.

**Dependencias**: `@loreal/contracts`, `@loreal/utils`. Nada de NestJS, React, Drizzle.

**Criterio de completado**:

- [x] `pnpm test --filter=@loreal/domain` pasa con todos los tests verdes (69 tests)
- [x] Cobertura alta en las funciones de segmentación, reposición y atribución (son las más críticas)
- [x] Ningún import de frameworks o librerías de infraestructura

**Estado**: COMPLETADA

**Notas de implementación**:

- 6 módulos en `src/`: customer-segmentation, replenishment, attribution, lifecycle-events, shade-matching, search
- 6 archivos de lógica + 6 archivos de test = 12 archivos en total
- 69 tests cubriendo: segmentación (14), reposición (8), atribución (10), eventos de vida (14), shade matching (9), ranking de búsqueda (9) y casos edge
- Dependencias: solo `@loreal/contracts` (para tipos de enums). No se necesitó `@loreal/utils` ni `date-fns`
- Todas las funciones son puras: reciben datos, retornan resultado. Sin side effects, sin I/O
- Cada función acepta `now?: Date` opcional para facilitar testing determinístico
- `tsconfig.json` necesita `"types": ["jest"]` para el typecheck (mismo patrón que utils)
- `jest.config.js` usa `require("@loreal/jest-config/base")` (CommonJS, mismo patrón que utils)
- Shade matching usa scoring compuesto: exact (100), tone_match (70), adjacent+subtone (50), adjacent (30)
- Search ranking combina: textMatchScore + recency bonus + BA affinity + segment weight

---

## Fase 7: `apps/api` (NestJS)

La fase más grande. Se subdivide en pasos internos.

### 7a: Bootstrap + Auth (Better Auth)

- Scaffold de NestJS: `app.module.ts`, `main.ts`, `health.controller.ts`, `database.module.ts`, `database.provider.ts`
- Conexión a Postgres via Drizzle (provider custom, módulo global `DATABASE_TOKEN`)
- `tsconfig.json` extendiendo `tooling/typescript-config/node.json` con `ignoreDeprecations: "6.0"`, `declaration: false`
- Health check endpoint (`GET /health`) con `@AllowAnonymous()`
- Dev script usa `tsx watch` (no `nest start`) para resolver imports de workspace packages `.ts`
- Integración de Better Auth siguiendo la implementación oficial (`better-auth.com/docs/integrations/nestjs`)
- Paquete `@thallesp/nestjs-better-auth` v2.6.0 — `AuthModule.forRoot({ auth })` registra guard global
- `bodyParser: false` en `NestFactory.create()` (requerido por Better Auth)
- Adapter: `drizzleAdapter(db, { provider: "pg", usePlural: true })` de `better-auth/adapters/drizzle`
- Plugins configurados:
  - `expo()` — soporte React Native con `trustedOrigins` para scheme `lorealclienteling://`
  - `jwt()` — tokens JWT para PowerSync, payload custom con `sub`, `email`, `role`, `storeId`, `brandId`, `zoneId`, expiración 1h
  - `admin({ defaultRole: "ba" })` — gestión de usuarios, `defaultRole` sobrescrito de `"user"` a `"ba"`
  - `twoFactor({ issuer: "L'Oréal Clienteling" })` — MFA con TOTP
  - `customSession()` — inyecta `role`, `storeId`, `brandId`, `zoneId`, `active`, `fullName` en la sesión
- `user.additionalFields`: `role`, `storeId`, `zoneId`, `brandId`, `active`, `fullName`
- Schema de auth generado con `npx @better-auth/cli generate` → `packages/database/schema/auth.ts`
  - Tablas: `users` (con campos de negocio), `sessions`, `accounts`, `verifications`, `jwks`, `twoFactors`
  - Relaciones Drizzle definidas
  - `users.storeId/zoneId/brandId` son `text` sin FK a nivel de DB (tablas de dominio usan UUID, Better Auth usa text IDs); referencia lógica enforced en app
- Eliminado `schema/users.ts` — reemplazado por `schema/auth.ts`
- Todas las FKs de tablas de dominio a `users.id` cambiadas de `uuid()` a `text()` (7 archivos)
- Migración regenerada desde cero (24 tablas), publicación PowerSync recreada

**Criterio de completado**:

- [x] `pnpm --filter=@loreal/api typecheck` pasa
- [x] `pnpm typecheck` (monorepo completo) pasa — 5/5 packages
- [x] `pnpm test` (monorepo completo) pasa — 90 tests (69 domain + 21 utils)
- [x] `GET /health` → `{ status: "ok" }`
- [x] `GET /api/auth/ok` → `{ ok: true }`
- [x] `POST /api/auth/sign-up/email` crea usuario con campos custom
- [x] `POST /api/auth/sign-in/email` retorna sesión + token
- [x] Guard global protege rutas por defecto, `@AllowAnonymous()` las exceptúa
- [x] 24 tablas en Postgres (19 dominio + 5 auth: sessions, accounts, verifications, jwks, two_factors)

**Estado**: COMPLETADA

**Notas de implementación**:

- Better Auth v1.6.6, `@thallesp/nestjs-better-auth` v2.6.0
- `drizzle-orm` actualizado de `^0.44.0` a `^0.45.2` (peer dependency de Better Auth)
- Peer warning de `better-call` pidiendo `zod@^4.0.0` es inocuo — `zod@3.25` es bridge version compatible
- `@nestjs/core` build scripts ignorados en `pnpm-workspace.yaml` (no necesarios)
- CORS configurado para `localhost:3000` (Next.js) y `localhost:8081` (Expo Metro)
- Puerto del API: 3001

### 7b: RBAC — ScopeService + infraestructura cross-cutting

**Decisión arquitectónica: NO usar CASL.** Better Auth ya provee `@Roles()`, `@Session()` y `@AllowAnonymous()` como decoradores globales. CASL agregaría una tercera capa de autorización innecesaria. En su lugar:

- **Filtrado por scope** → `ScopeService` inyectable que construye cláusulas `where` de Drizzle según `session.user.role/storeId/brandId/zoneId`
- **Restricción por rol** → `@Roles(['ba', 'manager'])` de Better Auth (ya integrado en 7a)
- **Defensa en profundidad** → RLS en Postgres se agrega como fase de hardening futura

**Archivos creados en `apps/api/src/common/`**:

- `types/session.ts` — interfaces `SessionUser` y `UserSession` con campos de negocio tipados
- `pipes/zod-validation.pipe.ts` — `ZodValidationPipe` que valida con schemas Zod de `@loreal/contracts`, lanza `BadRequestException` con errores formateados
- `services/scope.service.ts` — `ScopeService` injectable global:
  - `scopeByStore(user, column)` → condición Drizzle: BA/manager filtra por storeId, supervisor por stores de su zona, admin sin filtro
  - `scopeByBrand(user, column)` → condición Drizzle por brandId
  - `getAccessibleStoreIds(user)` → array de UUIDs de tiendas accesibles
  - `assertStore(user)` / `assertBrand(user)` → valida y retorna o lanza ForbiddenException
- `services/audit.service.ts` — `AuditService` injectable global: `log(actor, action, entityType, entityId, changes?, meta?)` inserta en `auditLogs`. Parámetro `action` es `string` (no restringido al enum `AuditAction`) para flexibilidad de acciones por módulo.
- `common.module.ts` — módulo `@Global()` que provee `ScopeService` y `AuditService`

**Criterio de completado**:

- [x] `pnpm --filter=@loreal/api typecheck` pasa
- [x] `CommonModule` registrado en `app.module.ts`
- [x] `ScopeService` y `AuditService` inyectables en cualquier módulo

**Estado**: COMPLETADA

### 7c: Módulos funcionales del API

14 módulos NestJS implementados, cada uno con 3 archivos (module, controller, service). Todos registrados en `app.module.ts`.

**Patrón consistente por módulo**:

```
modules/<name>/
  <name>.module.ts      — @Module con controller + service, exports service
  <name>.controller.ts  — REST endpoints, @Roles(), ZodValidationPipe, @Session()
  <name>.service.ts     — Queries Drizzle, scope filtering via ScopeService, audit logging
```

**Módulos Tier 0 — Fundacionales (sin FKs de dominio)**:

| Módulo | Endpoints | RF/RNF |
|---|---|---|
| `zones` | GET /zones, GET /:id, POST, PATCH /:id | RF-54 |
| `brands` | GET /brands, GET /:id, POST, PATCH /:id, PUT /:id/config | RNF-13 |

**Módulos Tier 1 — Dependen de Tier 0**:

| Módulo | Endpoints | RF/RNF |
|---|---|---|
| `stores` | GET /stores, GET /:id, POST, PATCH /:id | RNF-14 |
| `products` | GET /products, GET /:id, POST, PATCH /:id, GET /:id/availability, PATCH /:id/availability/:storeId | RF-17 |

**Módulos Tier 2 — Entidad principal**:

| Módulo | Endpoints | RF/RNF |
|---|---|---|
| `customers` | GET /customers, GET /customers/search, GET /:id, POST, PATCH /:id, DELETE /:id/arco | RF-01 a RF-04, RF-11, RNF-05 |

Customers es el módulo más complejo:
- Búsqueda usa `rankCustomerSearchResults()` de `@loreal/domain`
- Vista 360° en GET /:id
- Derecho al olvido ARCO: transaccional con hard delete + anonimización según `04-security-compliance.md`
- Audit logging de `customer_viewed` en cada lectura

**Módulos Tier 3 — Dependen de Customers**:

| Módulo | Endpoints | RF/RNF |
|---|---|---|
| `beauty` | GET/PUT /customers/:id/beauty-profile, POST /customers/:id/shades, GET /customers/:id/shade-matches | RF-05, RF-58, RF-60 |
| `consents` | GET/POST /customers/:id/consents, DELETE /customers/:id/consents/:type | RF-02, RNF-07 |
| `recommendations` | GET /customers/:id/recommendations, POST /recommendations, POST /recommendations/ai, PATCH /:id/convert | RF-13, RF-15, RF-19 |
| `purchases` | GET /customers/:id/purchases, POST /purchases, GET /:id | RF-20 a RF-25 |
| `samples` | GET /customers/:id/samples, POST /samples, PATCH /:id/convert | RF-08, RF-61 |
| `appointments` | GET /appointments, GET /appointments/calendar, GET /:id, POST, PATCH /:id | RF-26 a RF-33 |
| `communications` | GET /customers/:id/communications, POST /communications, GET/POST/PATCH /communications/templates, PATCH /:id/tracking | RF-34 a RF-39 |

Notas de implementación por módulo:
- **purchases**: llama `attributePurchaseToBa()` de `@loreal/domain` en cada compra creada. Actualiza `lastTransactionAt` en customer. Marca recommendations convertidas automáticamente.
- **beauty**: `getShadeMatches` usa `findMatchingShades()` de `@loreal/domain`
- **consents**: exporta `hasActiveConsent(customerId, channel)` usado por `CommunicationsService` antes de enviar
- **communications**: importa `ConsentsModule`, verifica consent antes de crear. Templates filtrados por marca.
- **appointments**: reschedule crea cita nueva con `rescheduledFromAppointmentId` vinculado a la original
- **recommendations**: `POST /recommendations/ai` es placeholder, retorna mensaje de servicio no disponible hasta Fase 8

**Módulos Tier 4 — Solo lectura / agregación**:

| Módulo | Endpoints | RF/RNF |
|---|---|---|
| `audit` | GET /audit-logs (admin only), GET /:id | RNF-04 |
| `analytics` | GET /analytics/dashboard, /conversion, /customers, /export | RF-40 a RF-50 |

Analytics soporta scope filtering: BA ve sus métricas, manager ve tienda, supervisor ve zona, admin ve todo.

**Criterio de completado**:

- [x] `pnpm --filter=@loreal/api typecheck` pasa — 0 errores con 14 módulos
- [x] `pnpm test` pasa — 90 tests existentes (69 domain + 21 utils) siguen verdes
- [x] 14 módulos × 3 archivos = 42 archivos de módulos + 5 archivos cross-cutting = 47 archivos nuevos
- [x] Todos los módulos registrados en `app.module.ts`

**Estado**: COMPLETADA

### 7d: Seed de desarrollo

**Archivo**: `packages/database/seed/index.ts`

Script idempotente (trunca todas las tablas con CASCADE antes de insertar). Se ejecuta con `pnpm db:seed`. Orden de inserción respeta FKs.

**Datos insertados**:

| Dato | Cantidad | Detalle |
|---|---|---|
| Zones | 3 | Centro (CDMX), Norte (MTY), Occidente (GDL) |
| Brands | 5 | Lancôme, Kiehl's, YSL Beauty, Maybelline, L'Oréal Paris |
| Brand Configs | 5 | Colores, logo, font por marca |
| Stores | 10 | 4 Liverpool, 3 Palacio de Hierro, 3 boutiques propias |
| Users | 19 | 1 admin, 3 supervisors (1/zona), 5 managers (1/tienda), 10 BAs (2/tienda) |
| Products | 250 | 50/marca: 20 skincare, 20 makeup, 10 fragancias — con SKUs, precios MXN, duración estimada |
| Product Availability | ~1,000 | Cada producto en 3-5 tiendas random, stock available/low/out_of_stock |
| Message Templates | 17 | 3/marca (3 meses, cumpleaños, reposición) + 2 globales |
| Customers | 120 | Nombres mexicanos, emails, teléfonos, segmentos variados (new/returning/vip/at_risk) |
| Beauty Profiles | 95 | ~80% de clientas, con tipo de piel, tono, subtono, preocupaciones |
| Beauty Profile Shades | ~150 | 1-3 shades por perfil (foundation, concealer, lipstick) |
| Consents | ~250 | Privacy notice 100%, marketing_whatsapp ~70%, marketing_email ~50% |
| Purchases | ~305 | ~609 items. VIPs 4-10 compras, returning 2-5, new 0-1. Con atribución a BA |
| Recommendations | ~162 | 40% convertidas a compra |
| Samples | ~60 | 30% convertidas |
| Appointments | ~140 | Mix completed/scheduled/confirmed/cancelled/no_show |
| Communications | ~148 | WhatsApp/email/SMS con timestamps delivered/read |

**Usuarios de Better Auth**: cada usuario tiene una fila en `users` + una en `accounts` (providerId: "credential", password hasheado con scrypt). El hash usa `node:crypto.scrypt` directamente (formato `salt:hash` hex), compatible con Better Auth.

**Credenciales de login** (todos los usuarios): `Password123!`

| Rol | Email ejemplo |
|---|---|
| Admin | `admin@loreal.mx` |
| Supervisor | `g.torres@loreal.mx` |
| Manager | `a.martinez@loreal.mx` |
| BA | `v.rojas@loreal.mx` |

**Criterio de completado**:

- [x] `pnpm db:seed` ejecuta sin errores
- [x] ~2,500+ registros insertados en 19 tablas
- [x] Login funcional con credenciales del seed vía Better Auth

**Estado**: COMPLETADA

### 7e: Cron jobs

- Segmentación nocturna (RF-11) — usa `calculateSegment()` de `@loreal/domain`
- Alertas de eventos de vida (RF-09) — usa `generateLifeEventAlerts()` de `@loreal/domain`
- Recordatorios de citas (RF-30)
- Dependencia: `@nestjs/schedule`

**Estado**: PENDIENTE

---

## Fase 8: `apps/ai-service` (FastAPI)

### 8a: Bootstrap

- FastAPI con estructura de `apps/ai-service/app/`
- Conexión a Postgres (SQLAlchemy, read-only)
- Health check (`GET /health`)
- `Dockerfile` + agregar al `docker-compose.yml`

### 8b: Routers

- `recommendations.py` — RF-15: recibe perfil de clienta + contexto, llama a Claude, retorna recomendación con razonamiento
- `segmentation.py` — RF-11: endpoint alternativo de segmentación con IA
- `replenishment.py` — RF-16: predicción de reposición con IA

### 8c: Servicios core

- `claude_client.py` — cliente de Anthropic API con prompt caching, retry, timeout
- `anonymizer.py` — remueve PII antes de enviar a Claude (nombre, email, teléfono, fecha exacta)
- `embeddings.py` — genera embeddings de productos con pgvector
- `similarity.py` — búsqueda semántica de productos

### 8d: Integración con NestJS

- El módulo `recommendations` de NestJS llama al AI service via HTTP
- Configurar URL del AI service como variable de entorno
- Fallback: si el AI service no responde, la recomendación se marca como `manual`

**Criterio de completado**:

- [ ] `pnpm dev --filter=ai-service` (o `uvicorn`) levanta sin errores
- [ ] `POST /recommendations` recibe un perfil y retorna recomendación de Claude
- [ ] El anonymizer remueve PII correctamente (test)
- [ ] NestJS llama al AI service y persiste la recomendación en Postgres
- [ ] Embeddings se generan y se guardan en pgvector

**Estado**: PENDIENTE

---

## Orden de ejecución

```
Fase 1 ─► Fase 2 ─► Fase 3 ─► Fase 4 ─► Fase 5 ─► Fase 6 ─► Fase 7 ─► Fase 8
monorepo   contracts  utils     database   docker     domain     api       ai-service
```

Cada fase depende de la anterior. No se salta ninguna.

---

## Resumen de estado actual

| Fase | Descripción | Estado |
|---|---|---|
| 1 | Monorepo base | ✅ COMPLETADA |
| 2 | `packages/contracts` | ✅ COMPLETADA |
| 3 | `packages/utils` | ✅ COMPLETADA |
| 4 | `packages/database` | ✅ COMPLETADA |
| 5 | Docker Compose + migraciones | ✅ COMPLETADA |
| 6 | `packages/domain` | ✅ COMPLETADA |
| 7a | API Bootstrap + Better Auth | ✅ COMPLETADA |
| 7b | RBAC — ScopeService + cross-cutting | ✅ COMPLETADA |
| 7c | 14 módulos funcionales del API | ✅ COMPLETADA |
| 7d | Seed de desarrollo | ✅ COMPLETADA |
| 7e | Cron jobs | ⏳ PENDIENTE |
| 8 | AI Service (FastAPI) | ⏳ PENDIENTE |
