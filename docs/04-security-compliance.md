# 04 — Seguridad, Autenticación y Compliance

Documento de referencia para todo lo relativo a seguridad, control de acceso y cumplimiento regulatorio.

Este documento es particularmente importante porque:

- **RNF-06 (residencia de datos en México) es un criterio go/no-go**. Si la propuesta no lo cumple, queda fuera.
- **El 15% de la evaluación** se define en "Arquitectura técnica, integraciones y seguridad".
- **LFPDPPP** es ley federal. El incumplimiento no es solo riesgo contractual, es riesgo legal.

## Autenticación

### Herramienta: Better Auth (self-hosted)

La justificación de elegir Better Auth está en `01-architecture.md`. El resumen: es la única opción que garantiza residencia de datos en México sin excepciones.

Better Auth corre como parte del API NestJS, usando la misma base de datos PostgreSQL. No hay servicios externos de auth. No hay datos de usuarios saliendo del perímetro de AWS México.

### Flujo de login

**En web**:

1. Usuario llega a `/login` en el panel.
2. Ingresa email + password.
3. Cliente llama a `POST /api/auth/sign-in` del API.
4. API valida credenciales, genera JWT + refresh token, los retorna en cookies httpOnly secure.
5. Cliente redirige al dashboard apropiado según `role`.

**En mobile**:

1. BA llega a `/login` en la app.
2. Ingresa email + password.
3. Cliente llama a `POST /api/auth/sign-in`.
4. API valida y retorna JWT + refresh token en el body.
5. Cliente guarda tokens en secure storage nativo:
   - iOS: Keychain (via `expo-secure-store`)
   - Android: Keystore (via `expo-secure-store`)
6. Inicia sesión en PowerSync con el JWT para establecer el canal de sync.

### Tokens

- **JWT (access token)**: vida de 1 hora. Contiene `user_id`, `role`, `brand_id`, `store_id`, `zone_id`.
- **Refresh token**: vida de 30 días. Guardado en secure storage mobile, cookie httpOnly en web.
- **Rotación**: cada refresh genera un nuevo refresh token. El anterior se invalida (detección de reuso).

### Autenticación offline en mobile

Caso de uso crítico: el BA llega a la tienda, abre la app, el Wi-Fi del centro comercial está lento o caído.

**Estrategia**:

1. Si el JWT en secure storage **no ha expirado** y el refresh token tampoco: la app abre normalmente, trabaja contra el SQLite local vía PowerSync.
2. Si el JWT expiró pero el refresh token es válido y hay red: se refresca silenciosamente.
3. Si el JWT expiró y no hay red: la app muestra banner "Trabajando sin conexión" pero permite operación. Todos los datos locales siguen accesibles. Los cambios se encolan.
4. Si el refresh token expiró (30 días sin conectarse): la app requiere re-login. Este caso se considera excepcional.

**Configuración de TTL extendido para mobile**: el refresh token de mobile vive 30 días vs 7 días en web. El trade-off de seguridad se justifica por la necesidad operativa.

### MFA

Better Auth soporta TOTP y Passkeys. En v1 del sistema:

- **BA**: MFA opcional (no forzado para no fricción en piso de venta). TOTP disponible para BAs que quieran activarlo.
- **Gerente y Supervisor**: MFA fuertemente recomendado.
- **Administrador Central**: MFA obligatorio.

En v2 se puede endurecer según política de L'Oréal.

### Reset de password

Flujo estándar: email con token temporal de 1 hora que permite establecer nueva password. El email se envía vía Resend desde un dominio de L'Oréal México.

### Invitación de usuarios

Los administradores crean usuarios desde el panel `/admin/users/`. El sistema:

1. Crea la fila en `users` con `password_hash = null`.
2. Genera un token de primer login con TTL de 7 días.
3. Envía email al usuario con link de setup.
4. Usuario abre el link, establece password, completa perfil.
5. Se registra en `AuditLog` el evento `user_activated`.

## Autorización (RBAC)

### Herramienta: CASL

CASL (Ability composition) se usa en el API para definir permisos declarativos y verificarlos en guards de NestJS.

### Definición de roles

Los cuatro roles del sistema, definidos en `02-domain-model.md`:

- `ba` — Beauty Advisor
- `manager` — Gerente de Tienda
- `supervisor` — Supervisor de Zona
- `admin` — Administrador Central

### Abilities por rol

Ejemplo simplificado de las abilities declaradas con CASL:

```typescript
// apps/api/src/common/abilities/define-abilities.ts (pseudo-código)

function defineAbilitiesFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);

  if (user.role === 'ba') {
    // BA solo ve datos de su tienda
    can('read', 'Customer', { store_id: user.store_id });
    can('create', 'Customer', { store_id: user.store_id });
    can('update', 'Customer', { store_id: user.store_id });
    cannot('delete', 'Customer'); // BA no puede borrar clientes

    can('read', 'Product', { brand_id: user.brand_id });
    can('create', 'Recommendation', { ba_user_id: user.id });
    can('create', 'Appointment', { store_id: user.store_id });
    can('read', 'Appointment', { ba_user_id: user.id });
    can('create', 'Communication', { sent_by_user_id: user.id });

    cannot('read', 'Analytics'); // BA no ve reportes gerenciales
  }

  if (user.role === 'manager') {
    can('read', 'Customer', { store_id: user.store_id });
    can('read', 'User', { store_id: user.store_id, role: 'ba' });
    can('read', 'Analytics', { store_id: user.store_id });
    can('read', 'Appointment', { store_id: user.store_id });
    // No puede modificar datos operativos del BA
    cannot(['create', 'update', 'delete'], 'Recommendation');
  }

  if (user.role === 'supervisor') {
    // Supervisor ve agregados de su zona, no datos granulares de clientes
    can('read', 'Store', { zone_id: user.zone_id });
    can('read', 'Analytics', { zone_id: user.zone_id });
    can('read', 'User', { zone_id: user.zone_id });
    // Acceso limitado a PII de clientes
    can('read', 'Customer', { store_id: { $in: getStoreIdsInZone(user.zone_id) } }, [
      'id', 'lifecycle_segment', 'customer_since', 'last_transaction_at' // solo campos agregables
    ]);
  }

  if (user.role === 'admin') {
    can('manage', 'all'); // Admin puede todo
  }

  return build();
}
```

### Guards en NestJS

Cada controller usa el guard `AbilitiesGuard` con decoradores declarativos:

```typescript
@Controller('customers')
@UseGuards(AuthGuard, AbilitiesGuard)
export class CustomersController {
  
  @Get(':id')
  @CheckAbility({ action: 'read', subject: 'Customer' })
  getCustomer(@Param('id') id: string, @CurrentUser() user: User) {
    // El guard ya validó que user puede leer este customer específico
    return this.customersService.findOne(id);
  }
}
```

### Doble defensa: RLS en Postgres

Más allá de los guards del API, Postgres aplica Row Level Security para defensa en profundidad.

```sql
-- Ejemplo de policy en tabla customers
CREATE POLICY customers_scope ON customers
  USING (
    current_setting('app.user_role')::text = 'admin'
    OR (
      current_setting('app.user_role')::text IN ('ba', 'manager')
      AND store_id = current_setting('app.user_store_id')::uuid
    )
    OR (
      current_setting('app.user_role')::text = 'supervisor'
      AND store_id IN (
        SELECT id FROM stores WHERE zone_id = current_setting('app.user_zone_id')::uuid
      )
    )
  );
```

El API establece los session settings antes de cada query:

```typescript
await db.execute(sql`SET app.user_id = ${user.id}`);
await db.execute(sql`SET app.user_role = ${user.role}`);
await db.execute(sql`SET app.user_store_id = ${user.store_id}`);
```

**Por qué doble defensa**: si un bug en el API olvida aplicar un guard, RLS bloquea la query. Es una práctica de defense-in-depth.

### Sincronización del scope a PowerSync

El filtrado por rol también se aplica en PowerSync vía Sync Rules. Detalle en `05-offline-sync.md`.

## Residencia de datos (RNF-06)

### Región de hosting

**Toda la infraestructura productiva reside en AWS región México (us-east-mex-1)**:

- RDS PostgreSQL (datos principales)
- ECS Fargate (API, AI service, PowerSync)
- S3 (assets, imágenes)
- Secrets Manager (credenciales)
- CloudWatch logs

### Datos que NO pasan por México (y cómo se mitigan)

Algunos servicios externos por naturaleza procesan datos fuera de México. Se documentan aquí explícitamente.

#### Anthropic Claude API

**Qué**: prompts para el motor de recomendación.

**Mitigación**:

1. Antes de enviar el prompt a Claude, un servicio `anonymizer` (en `/apps/ai-service/app/services/anonymizer.py`) remueve PII:
   - Nombre completo → "la clienta"
   - Email → removido
   - Teléfono → removido
   - Fecha de nacimiento exacta → se envía solo el rango de edad
2. Solo se envían datos de perfil de belleza (tipo de piel, tono, preocupaciones, historial de compras en términos genéricos).
3. Se usa la versión empresarial de la API de Anthropic con Zero Data Retention: los datos enviados no se almacenan ni se usan para entrenamiento.
4. Se audita cada llamada en `AuditLog` con `action = 'ai_recommendation_requested'`.

#### WhatsApp Business API (Meta)

**Qué**: envío de mensajes a clientas.

**Mitigación**:

1. Los mensajes contienen PII por naturaleza (nombre de la clienta, contenido del mensaje). Esto es inherente al canal.
2. La clienta ha otorgado consentimiento específico para WhatsApp (RNF-07, `Consent` con `type = 'marketing_whatsapp'`).
3. Meta procesa datos bajo sus propios términos. L'Oréal ha aceptado este trade-off como parte de la estrategia digital.
4. Se registra cada envío en `Communication` con trazabilidad completa.

#### Sentry

**Qué**: captura de errores.

**Mitigación**:

1. Se configura Sentry para **no capturar PII** automáticamente: se aplica data scrubbing en el SDK.
2. Se filtran campos sensibles (emails, teléfonos, IDs de clientas) antes de que salgan al sistema de Sentry.
3. Si el negocio lo requiere, se puede migrar a Sentry self-hosted en AWS México en una fase futura.

#### Resend

**Qué**: envío de correos internos (notificaciones al admin).

**Mitigación**: solo se envían correos entre usuarios internos de L'Oréal. No se envían correos a clientas finales por este canal.

### Backups

- Backups automáticos de RDS: diarios, retención 35 días, **almacenados en AWS México**.
- Backups manuales (snapshots): antes de cada migración importante.
- Los backups nunca salen de la región mexicana.
- Prueba de restauración: mensual en entorno staging.

## Cumplimiento LFPDPPP

La Ley Federal de Protección de Datos Personales en Posesión de Particulares impone obligaciones específicas que se implementan en el sistema:

### Aviso de privacidad (RF-02)

- El aviso de privacidad es un documento versionado. Cada versión tiene `version_number`, `effective_date`, `content`.
- Cuando una clienta se registra, debe aceptar explícitamente la versión vigente. Se guarda en `Consent` con `type = 'privacy_notice'` y `version`.
- Si L'Oréal actualiza el aviso (cambio legal, nuevo uso de datos), se marca a las clientas existentes como "pendiente de re-consentimiento" en el próximo login/visita.
- El BA ve en el perfil de la clienta si tiene una versión vigente aceptada o si debe capturar nuevo consentimiento.

### Consentimientos por canal (RNF-07)

Cuatro tipos de consentimiento independientes:

- `privacy_notice` — aceptación del aviso de privacidad (obligatorio para registrar clienta)
- `marketing_sms`
- `marketing_email`
- `marketing_whatsapp`

Al enviar una comunicación, el sistema **verifica que el canal específico tenga consentimiento vigente**. Sin consentimiento → no se envía, se bloquea, se registra en audit.

### Derechos ARCO

La ley da a la clienta derecho a:

- **Acceso**: solicitar qué datos tiene L'Oréal sobre ella.
- **Rectificación**: corregir datos inexactos.
- **Cancelación**: eliminar sus datos (ejerce el "derecho al olvido").
- **Oposición**: oponerse al uso para fines específicos (ej: marketing).

El sistema provee flujos para cada derecho:

**Acceso**: el admin puede generar un **reporte ARCO** desde `/admin/customers/[id]/export`. Se genera un PDF con todos los datos personales de la clienta, firmado digitalmente, con folio.

**Rectificación**: cualquier BA puede editar el perfil de una clienta con sus correcciones. Cada edición queda en `AuditLog`.

**Cancelación**: flujo detallado más adelante.

**Oposición**: la clienta puede revocar consentimientos específicos (ej: "ya no quiero WhatsApp"). Se marca en `Consent.revoked_at`. A partir de ese momento, el sistema no envía por ese canal.

### Derecho al olvido (RNF-05)

Flujo técnico completo cuando una clienta solicita eliminación:

**Paso 1: Recepción y validación**

- La solicitud llega por canal formal (correo, llamada, presencial).
- L'Oréal México valida identidad (documento oficial, firma).
- Admin registra la solicitud en el sistema con folio.

**Paso 2: Ejecución técnica**

El admin activa el flujo desde `/admin/customers/[id]/delete-gdpr`. El sistema ejecuta una transacción:

```typescript
async function executeRightToBeForgotten(customerId: string, requestFolio: string, executedByAdminId: string) {
  await db.transaction(async (tx) => {
    // 1. Snapshot para el audit log (datos antes de borrar)
    const snapshot = await tx.select().from(customers).where(eq(customers.id, customerId));
    
    // 2. Hard delete en tablas con PII directa
    await tx.delete(beautyProfileShades).where(eq(beautyProfileShades.beautyProfileId, 
      sql`(SELECT id FROM beauty_profiles WHERE customer_id = ${customerId})`));
    await tx.delete(beautyProfiles).where(eq(beautyProfiles.customerId, customerId));
    await tx.delete(consents).where(eq(consents.customerId, customerId));
    await tx.delete(customers).where(eq(customers.id, customerId));
    
    // 3. Anonimización en tablas con referencias (preservar métricas)
    const anonymizedId = 'deleted_customer_' + requestFolio;
    
    await tx.update(purchases)
      .set({ customerId: anonymizedId })
      .where(eq(purchases.customerId, customerId));
    
    await tx.update(recommendations)
      .set({ customerId: anonymizedId })
      .where(eq(recommendations.customerId, customerId));
    
    await tx.update(samples)
      .set({ customerId: anonymizedId })
      .where(eq(samples.customerId, customerId));
    
    await tx.update(communications)
      .set({ customerId: anonymizedId, body: '[REDACTED]', subject: null })
      .where(eq(communications.customerId, customerId));
    
    await tx.update(appointments)
      .set({ customerId: anonymizedId, comments: null })
      .where(eq(appointments.customerId, customerId));
    
    // 4. Audit log del evento
    await tx.insert(auditLogs).values({
      actorUserId: executedByAdminId,
      action: 'customer_deleted_arco_request',
      entityType: 'customer',
      entityId: customerId,
      changes: { request_folio: requestFolio, fields_deleted: Object.keys(snapshot[0] || {}) },
      timestamp: new Date(),
    });
  });
}
```

**Paso 3: Propagación a mobile**

Los iPads que tenían datos de esta clienta (vía PowerSync) reciben la eliminación en su próxima sincronización. La clienta desaparece de la DB local de los BAs relevantes.

**Paso 4: Constancia**

El sistema genera un PDF de constancia con:
- Folio de la solicitud.
- Fecha de ejecución.
- Admin que ejecutó.
- Confirmación de los sistemas afectados.
- Firma digital.

Este PDF se entrega a la clienta como comprobante.

### Audit logs

Toda acción sensible se registra en `AuditLog`:

**Acciones auditadas**:

- Acceso a perfil de clienta (`customer_viewed`)
- Exportación de datos (`customer_exported`)
- Eliminación de clienta (`customer_deleted_arco_request`)
- Otorgamiento de consentimiento (`consent_granted`)
- Revocación de consentimiento (`consent_revoked`)
- Login, logout, fallos de login
- Cambios de rol de usuario
- Creación/edición/eliminación de usuarios
- Acceso a reportes analíticos con PII

**Características del audit log**:

- **Append-only**: no se borran registros, nunca.
- **Accesible solo por role `admin`**.
- **Retención**: mínimo 5 años según política de L'Oréal.
- **Inmutable**: se puede hashear cada registro con el hash del anterior para detectar manipulación (blockchain-style), aunque para v1 no es obligatorio.

## Secretos y variables de entorno

### Manejo de secretos

- **Nunca** en código, nunca en git.
- **Desarrollo local**: `.env` en cada app, nunca comiteado (está en `.gitignore`).
- **Staging y producción**: AWS Secrets Manager. Las aplicaciones leen secretos al arrancar vía IAM roles.
- **Rotación**: credenciales de base de datos se rotan cada 90 días.

### Secretos críticos

- Credenciales de RDS
- JWT signing keys (rotables)
- API keys de Anthropic
- Tokens de WhatsApp Business API
- API keys de Resend y Sentry
- Secretos de Better Auth

Ninguno de estos debe aparecer en logs, en errores de Sentry, ni en respuestas del API.

## Seguridad de red

### Perímetro

- **WAF en CloudFront** bloquea ataques web comunes (OWASP Top 10).
- **Rate limiting** en el API: 100 req/min por usuario autenticado, 20 req/min para rutas no autenticadas.
- **CORS estricto**: solo dominios de L'Oréal en allowlist.

### Comunicación

- **Todo HTTPS/TLS 1.3**. HTTP redirige a HTTPS siempre.
- **Certificados**: AWS Certificate Manager, renovación automática.
- **HSTS** habilitado con preload.

### Base de datos

- Postgres no es accesible desde internet. Solo desde el VPC privado.
- Las credenciales se inyectan vía Secrets Manager.
- Conexión siempre con TLS entre API y RDS.

## Protección contra vulnerabilidades comunes

### Inyección SQL

Mitigada por Drizzle (prepared statements nativos). No se concatenan strings de SQL en ningún lugar del código.

### XSS

Mitigada por React (escape automático) + Content Security Policy headers estrictos.

### CSRF

Mitigada por cookies httpOnly + SameSite=Strict + CSRF tokens en endpoints mutables.

### Ataques de fuerza bruta

Better Auth bloquea tras 5 intentos fallidos por 15 minutos. Rate limiting adicional en el endpoint de login.

### Man-in-the-middle

Mitigada por TLS obligatorio + HSTS + certificate pinning en mobile.

## Certificaciones objetivo

Para la propuesta enterprise (producción real), se listan certificaciones alcanzables:

- **ISO 27001**: sistema de gestión de seguridad de la información. Objetivo año 2.
- **SOC 2 Type II**: controles de seguridad operacional. Objetivo año 1.
- **LFPDPPP compliance certification**: autoauditoría documentada desde el día 1.
- **PCI-DSS**: **no aplica** porque el sistema no procesa tarjetas de crédito (el POS lo hace).

En el proyecto universitario se documentan las prácticas que conducen a estas certificaciones, aunque no se persigan activamente durante la fase piloto.

## Referencias cruzadas

- Infraestructura de AWS México: ver `01-architecture.md` sección "Infraestructura de producción".
- Roles y scope de datos: ver `02-domain-model.md` sección "User" y "Configuración multi-tenant".
- Sync Rules de PowerSync (cómo se aplica el scope en mobile): ver `05-offline-sync.md`.
- Trazabilidad con requerimientos RNF-04 a RNF-07: ver `06-rfp-compliance-matrix.md`.
