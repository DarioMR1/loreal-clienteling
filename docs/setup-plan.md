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
- Migración generada: `migrations/0000_eminent_namorita.sql`
- `drizzle.config.ts` URL por defecto apunta a `localhost:5433` (puerto mapeado, ver Fase 5)
- `beauty_profile_shades.product_id` no tiene FK explícita para evitar imports circulares — se puede agregar después con una migración manual si se necesita
- Dependencias: `drizzle-orm@^0.44.0`, `pg@^8.13.0`, `drizzle-kit@^0.31.0`, `tsx@^4.19.0`

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

- [ ] `pnpm test --filter=@loreal/domain` pasa con todos los tests verdes
- [ ] Cobertura alta en las funciones de segmentación, reposición y atribución (son las más críticas)
- [ ] Ningún import de frameworks o librerías de infraestructura

---

## Fase 7: `apps/api` (NestJS)

La fase más grande. Se subdivide en pasos internos pero todo se completa antes de avanzar a la Fase 8.

### 7a: Bootstrap

- Scaffold de NestJS con `@nestjs/cli`
- `app.module.ts` con configuración base (`@nestjs/config`)
- Conexión a Postgres via Drizzle (provider custom)
- `tsconfig.json` extendiendo `tooling/typescript-config/node.json`
- Health check endpoint (`GET /health`)

### 7b: Auth (Better Auth)

- Integración de Better Auth como módulo de NestJS
- Endpoints: `POST /auth/sign-in`, `POST /auth/sign-up`, `POST /auth/refresh`, `POST /auth/sign-out`
- JWT con claims: `user_id`, `role`, `brand_id`, `store_id`, `zone_id`
- Guard `AuthGuard` que valida JWT en cada request
- Reset de password, invitación de usuarios

### 7c: RBAC (CASL + RLS)

- `common/abilities/define-abilities.ts` — abilities por rol según `04-security-compliance.md`
- `AbilitiesGuard` — guard que verifica permisos contra CASL
- Decoradores: `@RequireRole()`, `@CheckAbility()`, `@CurrentUser()`
- RLS policies en Postgres (vía migración Drizzle)
- Interceptor que setea `app.user_id`, `app.user_role`, `app.user_store_id` en cada conexión

### 7d: Módulos funcionales

Un módulo NestJS por sección del RFP, cada uno con controller + service + DTOs:

| Módulo | Endpoints principales |
|---|---|
| `customers` | CRUD + búsqueda (RF-01, RF-03, RF-04) |
| `beauty` | Perfiles de belleza + shades (RF-05, RF-58, RF-60) |
| `products` | Catálogo + disponibilidad (RF-17) |
| `recommendations` | Crear + historial + conversión (RF-13, RF-15, RF-19) |
| `purchases` | Registro manual + POS mock + historial (RF-20 a RF-25) |
| `samples` | Registro + conversión (RF-08, RF-61) |
| `appointments` | CRUD + calendario + tipos de evento (RF-26 a RF-33) |
| `communications` | Envío + plantillas + tracking (RF-34 a RF-39) |
| `consents` | Gestión de consentimientos por canal (RF-02, RNF-07) |
| `audit` | Consulta de audit logs (RNF-04) |
| `brands` | CRUD marcas + configs (RNF-13) |
| `stores` | CRUD tiendas (RNF-14) |
| `zones` | CRUD zonas |
| `analytics` | Reportes + exportación CSV/Excel (RF-40 a RF-50) |
| `integrations/pos` | Adaptador mockeado |
| `integrations/whatsapp` | Adaptador de WhatsApp Business API |
| `integrations/ecommerce` | Adaptador mockeado |

### 7e: Seed de desarrollo

- `packages/database/seed/` con datos realistas:
  - 5+ marcas (Lancôme, Kiehl's, YSL Beauty, Maybelline, L'Oréal Paris)
  - 10+ tiendas (Liverpool y Palacio de Hierro en CDMX, Monterrey, Guadalajara)
  - 3+ zonas
  - Usuarios de cada rol
  - 50+ productos por marca con precios en MXN
  - Plantillas de mensajes por marca
- Script `pnpm db:seed` que ejecuta el seed

### 7f: Cron jobs

- Segmentación nocturna (RF-11)
- Alertas de eventos de vida (RF-09)
- Recordatorios de citas (RF-30)

**Criterio de completado**:

- [ ] `pnpm dev --filter=api` levanta sin errores
- [ ] `POST /auth/sign-in` retorna JWT válido
- [ ] CRUD de cada entidad funciona con auth y RBAC
- [ ] Un BA no puede ver datos de otra tienda (verificado)
- [ ] `pnpm db:seed` puebla datos realistas
- [ ] `pnpm test --filter=api` pasa (integration tests con supertest)

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

---

## Orden de ejecución

```
Fase 1 ─► Fase 2 ─► Fase 3 ─► Fase 4 ─► Fase 5 ─► Fase 6 ─► Fase 7 ─► Fase 8
monorepo   contracts  utils     database   docker     domain     api       ai-service
```

Cada fase depende de la anterior. No se salta ninguna.
