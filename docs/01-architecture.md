# 01 — Arquitectura Técnica

Documento de referencia de las decisiones técnicas del sistema. Cada tecnología elegida está justificada contra el RFP y contra las alternativas consideradas.

## Vista general

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENTES                                │
│                                                                  │
│  ┌─────────────────────┐       ┌───────────────────────────┐   │
│  │  Mobile (iPad)      │       │  Web (Desktop / Laptop)    │   │
│  │  Expo + RN          │       │  Next.js 15                │   │
│  │  Usuario: BA        │       │  Usuarios: Gerente,        │   │
│  │  Offline-first      │       │  Supervisor, Admin         │   │
│  └──────────┬──────────┘       └────────────┬──────────────┘   │
│             │                                │                  │
└─────────────┼────────────────────────────────┼──────────────────┘
              │                                │
              │ PowerSync                      │ HTTPS
              │ (WebSocket)                    │ (REST + JWT)
              │                                │
┌─────────────▼────────────────────────────────▼──────────────────┐
│                      INFRAESTRUCTURA (AWS México)                │
│                                                                  │
│  ┌────────────────────┐      ┌──────────────────────────────┐  │
│  │  PowerSync Service │◄────►│  PostgreSQL 16 (RDS)         │  │
│  │  (self-hosted)     │      │  - pgvector                  │  │
│  │                    │      │  - Row Level Security        │  │
│  └────────────────────┘      │  - Replicación lógica        │  │
│                              └────────┬─────────────────────┘  │
│                                       │                         │
│  ┌────────────────────┐               │                         │
│  │  NestJS API        │◄──────────────┘                         │
│  │  (ECS Fargate)     │                                         │
│  │  - Auth            │      ┌──────────────────────────────┐  │
│  │  - Business logic  │◄────►│  FastAPI AI Service          │  │
│  │  - RBAC            │      │  - Recomendaciones           │  │
│  └─────────┬──────────┘      │  - Segmentación              │  │
│            │                  │  - Embeddings                │  │
│            │                  └──────────────────────────────┘  │
│            │                                                    │
│            ▼                                                    │
│  ┌────────────────────┐      ┌──────────────────────────────┐  │
│  │  S3 México         │      │  Audit Logs (LFPDPPP)        │  │
│  │  (imágenes, docs)  │      │                              │  │
│  └────────────────────┘      └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTPS
                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                     SERVICIOS EXTERNOS                           │
│                                                                  │
│  - Anthropic Claude API (motor de recomendación conversacional)  │
│  - WhatsApp Business API (RF-35, RF-36)                          │
│  - Resend (notificaciones internas)                              │
│  - Sentry (observabilidad)                                       │
│  - POS / CRM / E-commerce (mockeados en proyecto universitario)  │
└──────────────────────────────────────────────────────────────────┘
```

## Decisiones tecnológicas

Las decisiones se justifican contra tres ejes: (1) requerimientos del RFP, (2) características del caso de uso (BA en piso de venta), (3) alternativas consideradas.

### Mobile: Expo + React Native

**Por qué Expo + React Native**:

- Una sola codebase para iOS (requerido por RNF-08) y Android (deseable por RNF-09).
- Expo SDK 54+ detecta automáticamente estructura de monorepo, reduciendo fricción de setup.
- EAS Build maneja builds de producción sin requerir equipo dedicado a iOS/Android.
- Expo Notifications cubre RF-30 (recordatorios de citas) sin configuración compleja.
- Ecosistema maduro con PowerSync y Better Auth oficialmente soportados.

**Alternativas descartadas**:

- **Nativo real (Swift + Kotlin)**: dos codebases, dos equipos, dos tiempos de desarrollo. Injustificable para el tiempo de un proyecto universitario cuando el performance de RN es suficiente para clienteling.
- **Flutter**: ecosistema más débil para integración con PowerSync y Better Auth. Dart introduce lenguaje adicional al stack.
- **PWA**: descartada por RF-14 (escaneo de cámara), RF-63 (virtual try-on) y por el requerimiento explícito de operación offline confiable que excede lo que IndexedDB + Service Workers ofrecen en producción.

### Web: Next.js 15 (App Router)

**Por qué Next.js 15**:

- App Router + React Server Components permite dashboards con server-side rendering real, crítico para reportes pesados (RF-40 a RF-50).
- Server Actions eliminan boilerplate de API routes para operaciones de administración.
- Deploy simple en Vercel (o en AWS con Next.js standalone para cumplir residencia de datos).
- Streaming y Suspense mejoran la percepción de velocidad en dashboards de analítica.

**Alternativas descartadas**:

- **Vite + React SPA**: requiere hacer todo el trabajo de SSR manual. Para dashboards pesados, SSR vale la pena.
- **Remix**: válido técnicamente pero ecosistema más pequeño que Next.js.
- **SvelteKit**: excelente pero el equipo es React-first. No justifica la curva de aprendizaje.

### Backend: NestJS

**Por qué NestJS**:

- Los 8 módulos funcionales del RFP (perfiles, recomendaciones, compras, citas, comunicaciones, analítica, usuarios, belleza) mapean directamente a módulos de NestJS.
- Arquitectura opinionada con módulos, providers, controllers e inyección de dependencias fuerza estructura consistente en un equipo universitario heterogéneo.
- Guards + Interceptors hacen natural implementar RBAC complejo (RF-51 a RF-56) y audit logs (RNF-04).
- TypeScript end-to-end con el frontend usando tipos compartidos en `/packages/contracts`.
- Built-in para WebSockets, cron jobs (RF-30 recordatorios), queues (envío de WhatsApp).
- Ecosistema para testing (Jest integrado), validación (class-validator o Zod), OpenAPI auto-generado.

**Alternativas descartadas**:

- **Hono**: excelente para edge/serverless pero insuficiente para un backend con reglas de negocio densas. Faltan patrones para DI, guards estructurados, módulos.
- **Express**: demasiado desestructurado para un equipo no-senior. Reinventar patrones que NestJS ya resuelve.
- **FastAPI sin NestJS**: considerado. Python es excelente para IA pero para el API principal con integraciones a PowerSync, WhatsApp, POS es más natural TypeScript. Se adopta FastAPI solo para el servicio de IA.
- **Rails 8 o Laravel 11**: válidos pero introducen Ruby/PHP al stack y pierden la ventaja de TypeScript compartido entre capas.

### Motor de IA: FastAPI separado

**Por qué FastAPI como microservicio dedicado**:

- El ecosistema de ML en Python es superior al de Node.js. Si en el futuro se entrenan modelos custom de segmentación o recomendación, Python es el camino natural.
- Aisla el workload de inferencia del API principal. Si una recomendación tarda 3 segundos, no bloquea el resto del sistema.
- Permite escalamiento independiente: el API principal puede correr en instancias pequeñas mientras el servicio de IA usa instancias con GPU si fuera necesario.
- Pydantic para validación + async nativo = excelente DX.

**Cuándo consolidar en NestJS**:

Si el equipo no tiene capacidad de mantener Python, toda la lógica de IA puede vivir en NestJS llamando a Claude API directamente. Es perfectamente válido y más simple operacionalmente. La arquitectura del monorepo permite esta decisión tardía.

### Base de datos: PostgreSQL 16 + pgvector

**Por qué PostgreSQL**:

- Relaciones complejas entre entidades (Customer → Purchases → Products → Shades → Recommendations) son el pan de cada día de clienteling. NoSQL obligaría a denormalizar perdiendo integridad.
- Row Level Security nativa soporta multi-tenancy lógico (aislamiento por marca y tienda).
- Full-text search built-in para búsqueda de clientes (RF-03).
- pgvector para embeddings de productos y clientes habilita búsqueda semántica sin base de datos vectorial adicional.
- Replicación lógica es lo que PowerSync consume para sincronización.
- Maduro, battle-tested, con hosting en AWS México vía RDS.

**Alternativas descartadas**:

- **MongoDB**: para clienteling introduce más dolor que valor. Las relaciones son fuertes, no queremos duplicación de datos.
- **DynamoDB**: modelo de acceso rígido, difícil hacer reportes ad-hoc que los managers van a pedir.
- **MySQL**: sin RLS nativa, sin pgvector. Postgres es estrictamente superior para este caso.

### ORM: Drizzle

**Por qué Drizzle**:

- TypeScript-first con inferencia de tipos excepcional.
- SQL-first: los queries se leen como SQL, facilita debugging.
- Overhead mínimo, builds más rápidos que Prisma.
- Compatible con PowerSync (hay plugin oficial).
- Schema como código TypeScript vive en `/packages/database/` y se importa desde cualquier app.

**Alternativas descartadas**:

- **Prisma**: excelente DX pero schema en DSL propio, generación de cliente más lenta, bundle más grande. Para este caso, Drizzle es estrictamente más ligero.
- **TypeORM**: decorators obsoletos, problemas de tipos. No lo recomendaría para proyecto nuevo en 2026.

### Autenticación: Better Auth (self-hosted)

**Por qué Better Auth self-hosted**:

- **Cumple RNF-06 (residencia de datos en México) sin excepciones**. Los datos de auth residen donde despliegamos el backend.
- Open-source, sin vendor lock-in.
- TypeScript-first, integra limpio con NestJS.
- Soporta Organizations, RBAC, MFA, Passkeys.
- SDK oficial para Expo/React Native.
- Sin costos por MAU, sin preocuparse por pricing al escalar.

**Alternativas descartadas**:

- **Clerk**: DX superior, pero **almacena datos de usuarios en servidores en EE.UU.**, lo que viola RNF-06. Descartado por compliance, no por técnica.
- **Auth0**: permite elegir región pero no tiene México. Costoso y pesado para este caso.
- **Supabase Auth**: tiene sentido si usamos Supabase como BaaS completo. No es nuestro caso (usamos Postgres directo).
- **AWS Cognito**: válido como backup si Better Auth se vuelve un problema. Peor DX pero cumple residencia.
- **WorkOS**: favorito B2B enterprise, pero pricing por SSO connection no justifica para este caso (una sola organización cliente).

Detalle completo de autenticación y RBAC en `04-security-compliance.md`.

### Sincronización offline: PowerSync (Open Edition, self-hosted)

**Por qué PowerSync self-hosted**:

- **Cumple RNF-06**: todo el pipeline de sincronización corre en AWS México.
- Mantiene PostgreSQL como fuente de verdad, sin migración forzada.
- Sync Rules declarativas mapean naturalmente a los scopes por rol (RF-52, RF-53, RF-54, RF-55).
- Resolución de conflictos built-in.
- Background sync nativo en Expo (sincroniza cuando la app está cerrada).
- SDK oficial para React Native.
- Open Edition gratuito y source-available.

**Alternativas descartadas**:

- **WatermelonDB**: requiere escribir toda la capa de sync manualmente. Semanas de trabajo extra que un proyecto universitario no puede permitirse.
- **PowerSync Cloud**: datos pasan por servidores de PowerSync (posiblemente EE.UU.), viola RNF-06.
- **TanStack DB**: demasiado nuevo, ecosistema no maduro para producción.
- **Replicache**: código fuente no-abierto, menos aplicable para clienteling.
- **RxDB**: válido pero Sync Rules de PowerSync son más declarativas y encajan mejor con el modelo de roles.

Detalle completo de la estrategia offline en `05-offline-sync.md`.

### Monorepo: Turborepo + pnpm

**Por qué Turborepo + pnpm**:

- Turborepo reescrito en Rust (2025) eliminó los problemas de performance pasados.
- Caching remoto acelera CI/CD dramáticamente.
- pnpm usa menos disco y es más rápido que npm/yarn para monorepos.
- Expo SDK 54+ detecta monorepos automáticamente, sin hacks de Metro.
- Standard de facto en 2026 para proyectos TS monorepo.

**Alternativas consideradas**:

- **Nx**: más features pero también más complejidad. Turborepo es suficiente.
- **Lerna**: obsoleto.
- **Yarn workspaces sin Turborepo**: pierdes caching inteligente.
- **Dos repos separados (backend / clients)**: pierdes type-safety end-to-end automática. Más overhead de mantenimiento.

Estructura detallada del monorepo en `03-monorepo-structure.md`.

## Infraestructura de producción

### Región: AWS México (us-east-mex-1)

**Razón principal**: RNF-06 requiere que los datos personales de consumidores mexicanos residan en servidores ubicados en México. AWS México tiene región disponible desde 2025.

### Servicios AWS específicos

| Servicio | Uso |
|---|---|
| **RDS PostgreSQL 16** | Base de datos principal. Multi-AZ para alta disponibilidad (RNF-01 99.5% SLA). |
| **ECS Fargate** | Contenedores de NestJS API, FastAPI AI Service, PowerSync Service. Sin gestión de servidores. |
| **Application Load Balancer** | Distribución de tráfico al API, con SSL termination. |
| **S3 (región México)** | Imágenes de clientes (foto opcional de perfil), shade images, lookbooks generados (RF-18). |
| **CloudFront** | CDN para assets estáticos del panel web. Restricción geográfica para contenido sensible. |
| **Secrets Manager** | Manejo de secretos (API keys, DB credentials). |
| **WAF** | Protección contra ataques web comunes. |
| **CloudWatch + X-Ray** | Observabilidad complementaria a Sentry. |

### Alternativa considerada: Azure México

Azure tiene región en Querétaro. Es válida técnicamente. Se elige AWS por mayor experiencia probable del equipo, ecosistema más rico para los servicios específicos (ECS Fargate, RDS, pgvector en RDS).

### Deployment: zero-downtime (RI-07)

Estrategia blue-green en ECS Fargate:

1. Nueva versión del API se despliega en un nuevo target group.
2. Load balancer redirige tráfico gradualmente (10% → 50% → 100%).
3. Health checks confirman estabilidad antes de mover tráfico.
4. Si hay errores, rollback automático al target group anterior.

Migraciones de base de datos se ejecutan con Drizzle en una fase previa al deploy, siguiendo el principio de **migraciones backward-compatible** (nunca romper la versión anterior del código).

### Entornos

| Entorno | Propósito | Datos |
|---|---|---|
| **local** | Desarrollo individual | Docker Compose con Postgres + PowerSync local. Seed data ficticia. |
| **dev** | Integración continua del equipo | AWS México (tier reducido). Datos de prueba. |
| **staging** | Validación previa a release (RI-06) | Mirror de producción. Datos anonimizados. |
| **production** | Sistema en vivo | AWS México. Datos reales. |

## Servicios externos

### Anthropic Claude API

Uso: motor de recomendación conversacional (RF-15). El BA describe la clienta y Claude genera recomendaciones razonadas en lenguaje natural.

Implicación de compliance: los prompts incluyen datos de perfil de la clienta. Se anonimizan (remover nombre, teléfono, email) antes de enviar. La API de Anthropic no almacena los datos enviados por default en la API empresarial.

### WhatsApp Business API (Meta)

Uso: RF-35 (comunicación oficial), RF-36 (plantillas por marca), RF-31 (confirmación de citas).

Implicación: requiere aprobación de Meta del tenant de WhatsApp Business. Este proceso lo inicia L'Oréal, no el equipo de desarrollo. Durante el piloto universitario se mockea.

### Resend

Uso: notificaciones internas por correo (ej: alertas de sistema al admin, no comunicación con clienta final).

### Sentry

Uso: captura de errores en mobile, web y backend. Dashboards unificados.

### POS / CRM / E-commerce

**En el proyecto universitario se mockean con datos realistas.** Se implementan adaptadores tipados en `/apps/api/src/modules/integrations/` que en producción apuntarían a los sistemas reales de L'Oréal México. El patrón Adapter permite cambiar el mock por el real sin afectar la lógica de negocio.

## Observabilidad

- **Errores**: Sentry en las 3 apps + backend.
- **Analítica de producto**: PostHog (uso del BA, flujos más usados, drop-offs).
- **Logs técnicos**: CloudWatch + Axiom para logs estructurados.
- **Métricas de negocio**: dashboards custom en el panel web (RF-40 a RF-50).
- **Audit logs de compliance**: tabla dedicada en Postgres, accesible solo por admins.

## Testing

Estrategia por capa:

- **Unit tests**: lógica de negocio en `/packages/domain/` con Jest. Cobertura alta porque son funciones puras.
- **Integration tests**: endpoints del API con supertest. Base de datos de prueba dockerizada.
- **E2E tests mobile**: Maestro o Detox para flujos críticos del BA.
- **E2E tests web**: Playwright para dashboards gerenciales.

Todo se corre en CI antes de cada merge a `main`.

## Qué NO está en la arquitectura

Para evitar ambigüedad, dejar explícito lo que el sistema **no hace**:

- No es un POS. Se integra con el POS del cliente, no lo reemplaza.
- No gestiona inventario. Consulta disponibilidad al POS, no la administra.
- No es un CRM genérico. Es específico para clienteling de belleza.
- No opera fuera de México en esta versión.
- No integra con redes sociales más allá de WhatsApp.
