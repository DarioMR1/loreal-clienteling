# Plataforma de Clienteling — L'Oréal México

Documentación técnica del proyecto que reemplaza a **Beauty Connect México** con una plataforma moderna de clienteling multi-marca, multi-tienda, con operación híbrida online/offline.

## Qué es este proyecto

L'Oréal México opera hoy un sistema de clienteling llamado Beauty Connect México que atiende a Beauty Advisors (BAs) en Liverpool, El Palacio de Hierro y canales propios. Esta plataforma lo reemplaza manteniendo continuidad operativa y elevando capacidades en personalización, análisis de datos, omnicanalidad y experiencia del BA.

El sistema se compone de:

- Una **app mobile en iPad** para BAs en piso de venta, con operación offline-first.
- Un **panel web** para gerentes de tienda, supervisores de zona y administradores centrales.
- Un **API central** que orquesta datos, permisos y comunicación con sistemas externos (POS, e-commerce, WhatsApp).
- Un **servicio de IA** dedicado a recomendaciones personalizadas y segmentación automática.

Todo corre en infraestructura ubicada en México para cumplir con la Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP).

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Mobile | Expo + React Native (iPad iOS 15+) |
| Web | Next.js 15 (App Router) |
| Backend | NestJS (TypeScript) |
| Motor de IA | FastAPI (Python) |
| Base de datos | PostgreSQL 16 con pgvector |
| ORM | Drizzle |
| Autenticación | Better Auth (self-hosted) |
| Sincronización offline | PowerSync (self-hosted, Open Edition) |
| Monorepo | Turborepo + pnpm workspaces |
| Hosting producción | AWS México (región us-east-mex-1) |

Justificación de cada elección técnica en `01-architecture.md`.

## Navegación de la documentación

| Si buscas... | Abre |
|---|---|
| Quick start de desarrollo local y orientación general | Este archivo |
| Decisiones de stack, infraestructura y deployment | `01-architecture.md` |
| Entidades, relaciones y reglas de negocio del dominio | `02-domain-model.md` |
| Organización del código, convenciones, estructura de carpetas | `03-monorepo-structure.md` |
| Auth, RBAC, residencia de datos, LFPDPPP, derecho al olvido | `04-security-compliance.md` |
| Cómo funciona offline, Sync Rules, resolución de conflictos | `05-offline-sync.md` |
| Trazabilidad de los 59 requerimientos obligatorios del RFP | `06-rfp-compliance-matrix.md` |

El RFP original y la documentación de producto viven en `/rfp/` como referencia histórica.

## Quick start

### Prerequisitos

- Node.js 22+
- pnpm 9+
- Docker (para Postgres y PowerSync local)
- Python 3.11+ (solo para el servicio de IA)
- Expo CLI: `npm install -g expo-cli`

### Setup inicial

```bash
# Clonar el repo
git clone <repo-url> loreal-clienteling
cd loreal-clienteling

# Instalar dependencias del monorepo
pnpm install

# Levantar servicios de infraestructura local (Postgres + PowerSync)
docker compose -f infra/docker/docker-compose.yml up -d

# Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/ai-service/.env.example apps/ai-service/.env

# Generar cliente de base de datos y correr migraciones
pnpm db:generate
pnpm db:migrate

# Seed de datos de desarrollo (marcas, tiendas, productos de muestra)
pnpm db:seed
```

### Comandos diarios

```bash
# Levantar todo en paralelo (web + mobile + api + ai-service)
pnpm dev

# Levantar solo una app
pnpm dev --filter=api
pnpm dev --filter=web
pnpm dev --filter=mobile

# Typecheck de todo el monorepo
pnpm typecheck

# Linting
pnpm lint

# Tests
pnpm test

# Ver el schema de la base de datos en Drizzle Studio
pnpm db:studio
```

### Puertos por defecto en desarrollo

| Servicio | Puerto |
|---|---|
| API (NestJS) | 3001 |
| Web (Next.js) | 3000 |
| Mobile (Expo Metro) | 8081 |
| AI Service (FastAPI) | 8000 |
| Postgres local | 5432 |
| PowerSync local | 8080 |

## Convenciones del repositorio

### Commits

Formato Conventional Commits:

```
feat(customers): agregar búsqueda por teléfono (RF-03)
fix(sync): resolver conflicto de timestamps en citas
docs(compliance): actualizar matriz RNF-06
refactor(api): mover lógica de segmentación a /packages/domain
```

Cuando un commit cierra o avanza un requerimiento del RFP, citar el ID (RF-XX, RNF-XX, RI-XX) en la descripción.

### Branching

- `main` → producción
- `staging` → ambiente de pruebas previo a release
- `feat/<nombre>` → features nuevas
- `fix/<nombre>` → correcciones

### Pull requests

Cada PR debe actualizar `06-rfp-compliance-matrix.md` si afecta el estado de algún requerimiento.

## Glosario

- **BA** — Beauty Advisor. Asesora de belleza en mostrador. Usuario principal del sistema mobile.
- **Beauty Connect** — Sistema actual de L'Oréal México que será reemplazado por esta plataforma.
- **Clienteling** — Disciplina de retail para construir relaciones personalizadas de largo plazo con la clienta final.
- **LFPDPPP** — Ley Federal de Protección de Datos Personales en Posesión de Particulares (México).
- **PowerSync** — Motor de sincronización bidireccional entre PostgreSQL y SQLite local en dispositivos.
- **RF / RNF / RI** — Requerimientos Funcionales, No Funcionales e de Implementación del RFP. IDs estables.
- **SKU** — Código único de producto.
- **Shade** — Tono exacto de un producto de maquillaje (base, corrector, labial) asociado a una clienta.
- **WhatsApp Business API** — API oficial de Meta para comunicación empresarial vía WhatsApp.

## Contexto del proyecto

- **Cliente:** L'Oréal México
- **Modalidad:** Proyecto universitario con CIO de L'Oréal como stakeholder principal
- **Idioma de la propuesta final:** español
- **Restricción crítica:** sin acceso a POS, CRM o ERP productivos del cliente. Todas las integraciones externas se mockean con datos realistas.
- **Criterio de evaluación con mayor peso:** cobertura funcional de los 59 requerimientos obligatorios (30%). Ver `06-rfp-compliance-matrix.md`.
