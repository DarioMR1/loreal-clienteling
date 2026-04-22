# 05 — Estrategia Offline con PowerSync

La operación offline no es un nice-to-have en este sistema. Es un **requerimiento explícito del alcance** y un **factor crítico de éxito** declarado por el cliente: los BAs trabajan en piso de venta de tiendas departamentales donde la señal de Wi-Fi y datos móviles es inestable.

Este documento describe cómo PowerSync resuelve la sincronización bidireccional entre el iPad del BA y la base de datos central, cómo se definen las Sync Rules por rol, y cómo se manejan los casos problemáticos.

## Principios rectores

Antes de entrar en detalles técnicos, las decisiones fundacionales:

1. **Postgres es la fuente de verdad.** Nunca SQLite local. Si hay conflicto, gana Postgres.
2. **El BA debe poder trabajar el 100% del tiempo sin red**, excepto en operaciones que intrínsecamente requieren red (IA, envío de WhatsApp, virtual try-on).
3. **La sincronización es invisible para el BA**. No hay botón de "sync". Pasa en background.
4. **Los conflictos son excepcionales pero se manejan determinísticamente**. Nada de "el último gana" sin registro — todo conflicto queda en audit log.
5. **El scope por rol se aplica en la capa de sync**, no en la UI. Un BA no puede ver datos de otra tienda ni siquiera cacheados.

## Arquitectura de sincronización

```
┌──────────────────────────────────────────────────────────────────┐
│                      iPad del BA                                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  App Expo + React Native                                   │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  PowerSync Client SDK                                │ │ │
│  │  │  - Abstrae CRUD sobre SQLite local                  │ │ │
│  │  │  - Encola mutaciones pendientes                     │ │ │
│  │  │  - Recibe streams de cambios del servidor           │ │ │
│  │  │  - Maneja reconexión automática                     │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                        │                                   │ │
│  │                        ▼                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  SQLite local (gestionado por PowerSync)             │ │ │
│  │  │  - Tablas replicadas del Postgres central            │ │ │
│  │  │  - Solo filas que corresponden al scope del BA       │ │ │
│  │  │  - Mutaciones pendientes en cola                     │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ WebSocket persistente
                            │ (HTTP fallback si WS falla)
                            │ TLS 1.3
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    AWS México                                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  PowerSync Service (self-hosted en ECS Fargate)            │ │
│  │                                                            │ │
│  │  - Autentica clientes con JWT (Better Auth)                │ │
│  │  - Aplica Sync Rules por usuario                           │ │
│  │  - Convierte cambios de Postgres en streams por bucket     │ │
│  │  - Recibe mutaciones del cliente, las aplica a Postgres   │ │
│  │  - Gestiona resolución de conflictos                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                        │                   ▲                     │
│                        │                   │                     │
│                        ▼                   │                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL 16 (RDS Multi-AZ)                              │ │
│  │                                                            │ │
│  │  - Replicación lógica habilitada (wal_level=logical)       │ │
│  │  - Publicación `powersync` con tablas sincronizables       │ │
│  │  - RLS habilitado para defensa en profundidad              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                        ▲                                         │
│                        │                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  NestJS API                                                │ │
│  │  - Web (managers) escribe directo aquí                     │ │
│  │  - El API valida reglas de negocio, aplica audit logs     │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

**Punto clave**: el panel web de los managers **no usa PowerSync**. Managers siempre están online y hablan directamente con el API NestJS. PowerSync existe específicamente para la experiencia mobile del BA.

## Edición: PowerSync Open Edition (self-hosted)

### Por qué self-hosted y no PowerSync Cloud

PowerSync Cloud es un servicio managed que simplifica operaciones, pero los datos de sincronización pasan por sus servidores (posiblemente fuera de México). Esto viola RNF-06.

PowerSync Open Edition es source-available bajo licencia FSL. Se despliega en AWS México, mantiene los datos siempre en territorio nacional. Cumple residencia de datos sin concesiones.

### Despliegue

El PowerSync Service corre en ECS Fargate junto al API y el AI service:

- Imagen Docker oficial de PowerSync.
- Configuración vía `config.yaml` montado desde Secrets Manager.
- Se conecta a la misma instancia RDS que usa el API.
- Expone WebSocket en puerto 8080 detrás del Application Load Balancer.

Configuración de Postgres requerida:

```sql
-- wal_level debe ser logical
ALTER SYSTEM SET wal_level = logical;

-- Crear publicación para PowerSync
CREATE PUBLICATION powersync FOR TABLE
  customers,
  beauty_profiles,
  beauty_profile_shades,
  products,
  product_availability,
  recommendations,
  purchases,
  purchase_items,
  samples,
  appointments,
  message_templates,
  brands,
  brand_configs,
  stores;

-- Las tablas sensibles (users, consents, audit_logs) NO están en la publicación.
-- Se acceden via API tradicional, no se sincronizan al device.
```

## Qué se sincroniza y qué no

### Tablas sincronizadas al iPad del BA

| Tabla | Razón |
|---|---|
| `customers` (scope: su tienda) | BA necesita búsqueda y consulta offline (RF-03, RF-04) |
| `beauty_profiles` | Perfil de belleza de las clientas (RF-05, RF-58) |
| `beauty_profile_shades` | Historial de shades |
| `products` (scope: su marca) | Catálogo para recomendación (RF-17) |
| `product_availability` (scope: su tienda) | Consulta de disponibilidad |
| `recommendations` (scope: su tienda) | Historial de recomendaciones (RF-19) |
| `purchases` (scope: su tienda) | Historial transaccional (RF-21) |
| `purchase_items` | Detalle de compras |
| `samples` | Historial de muestras (RF-08) |
| `appointments` (scope: sus citas) | Agenda (RF-27, RF-28) |
| `message_templates` (scope: su marca) | Plantillas para seguimiento (RF-36) |
| `brand_configs` (scope: su marca) | Configuración UI de la marca |
| `stores` (solo la suya) | Info de su tienda |

### Tablas que NO se sincronizan

| Tabla | Razón |
|---|---|
| `users` | Solo ve su propio user, lo obtiene en login. Los demás usuarios son info sensible. |
| `consents` | Sensible. Se consulta vía API cuando se necesita. |
| `audit_logs` | Solo para admins. BA no los ve. |
| `zones` | No relevante para el BA. |
| `communications` (contenido de mensajes) | Se replica **sin el body del mensaje** para no saturar el device. El BA ve el registro pero no el contenido completo offline. |

### Operaciones que requieren red

Algunas operaciones del BA intrínsecamente necesitan conexión:

1. **Solicitar recomendación de IA (RF-15)** — llama al AI service que habla con Claude.
2. **Enviar mensaje de WhatsApp (RF-35)** — va a Meta. Si no hay red, se encola y se envía cuando vuelva.
3. **Virtual Try-On (RF-63)** — procesamiento en servidor.
4. **Escanear SKU y consultar disponibilidad en tiempo real en otras tiendas (RF-17 extendido)** — la disponibilidad local se sincroniza, pero otras tiendas requieren consulta live.

Para cada una, la UI del BA muestra claramente el estado:

- **Online**: operación normal.
- **Offline**: botón deshabilitado con mensaje "Se completará cuando haya conexión". La operación se encola.

## Sync Rules: aplicación del scope por rol

PowerSync usa un archivo declarativo `sync-rules.yaml` para definir qué datos recibe cada usuario según su rol. Esta es la capa que implementa RF-52 a RF-55 en la sincronización.

### Estructura general

```yaml
bucket_definitions:
  
  # Bucket para BAs — datos de su tienda y marca
  ba_workspace:
    parameters: |
      SELECT id AS user_id, store_id, brand_id 
      FROM users 
      WHERE id = request.user_id() 
        AND role = 'ba' 
        AND active = true
    data:
      - SELECT * FROM customers 
        WHERE store_id = bucket.store_id
      
      - SELECT * FROM beauty_profiles 
        WHERE customer_id IN (
          SELECT id FROM customers WHERE store_id = bucket.store_id
        )
      
      - SELECT * FROM beauty_profile_shades
        WHERE beauty_profile_id IN (
          SELECT id FROM beauty_profiles WHERE customer_id IN (
            SELECT id FROM customers WHERE store_id = bucket.store_id
          )
        )
      
      - SELECT * FROM products 
        WHERE brand_id = bucket.brand_id 
          AND active = true
      
      - SELECT * FROM product_availability 
        WHERE store_id = bucket.store_id
      
      - SELECT * FROM recommendations 
        WHERE store_id = bucket.store_id
      
      - SELECT * FROM purchases 
        WHERE store_id = bucket.store_id
      
      - SELECT pi.* FROM purchase_items pi
        INNER JOIN purchases p ON pi.purchase_id = p.id
        WHERE p.store_id = bucket.store_id
      
      - SELECT * FROM samples 
        WHERE store_id = bucket.store_id
      
      - SELECT * FROM appointments 
        WHERE ba_user_id = bucket.user_id 
           OR store_id = bucket.store_id
      
      - SELECT * FROM message_templates
        WHERE brand_id = bucket.brand_id OR brand_id IS NULL
      
      - SELECT * FROM brand_configs
        WHERE brand_id = bucket.brand_id
      
      - SELECT * FROM stores
        WHERE id = bucket.store_id

  # Bucket global — tablas de referencia pequeñas que todos los usuarios ven
  global_reference:
    parameters: |
      SELECT 1 AS always
    data:
      - SELECT * FROM brands WHERE active = true
```

### Comportamiento en runtime

Cuando un BA se autentica, PowerSync:

1. Recibe su JWT del cliente.
2. Extrae `user_id` del JWT.
3. Ejecuta la query de `parameters` de `ba_workspace` para obtener `store_id` y `brand_id` de ese usuario.
4. Aplica los `data` queries con esos parámetros.
5. Streamea los resultados al iPad.
6. A partir de ese momento, escucha cambios en Postgres. Cada cambio se evalúa contra las Sync Rules y se propaga solo a los usuarios cuyo bucket lo incluya.

### Cambios de scope (BA cambia de tienda)

Si un admin cambia el `store_id` de un BA (ej: transferencia a otra tienda):

1. La próxima vez que el BA sincroniza, sus parámetros cambian.
2. PowerSync detecta que el bucket ahora tiene parámetros distintos.
3. Envía un comando de "flush bucket" al cliente: se borran los datos del bucket anterior.
4. Sincroniza el nuevo scope desde cero.

Esta operación puede ser costosa (puede requerir descargar miles de clientes nuevos). Se recomienda forzar que ocurra cuando el BA tiene red estable.

## Escritura desde el cliente: mutations

Cuando el BA modifica datos en el iPad (crea una clienta, registra una recomendación, agenda una cita), el flujo es:

### Flujo con conexión

1. BA toca "Guardar" en la UI.
2. PowerSync SDK escribe inmediatamente al SQLite local. La UI refleja el cambio al instante (optimistic UI).
3. PowerSync marca el cambio como `pending_upload`.
4. En background, envía el cambio al PowerSync Service.
5. PowerSync Service valida, aplica al Postgres central via una Write Checkpoint.
6. Postgres confirma.
7. PowerSync marca el cambio como `uploaded` en el cliente.

### Flujo sin conexión

1. BA toca "Guardar".
2. PowerSync SDK escribe al SQLite local, marca como `pending_upload`.
3. No hay conexión, no se puede subir. El cambio permanece en cola.
4. Cuando vuelve la conexión, PowerSync detecta automáticamente y sube todos los `pending_upload` en orden.
5. Se aplican al Postgres central.

### Write Checkpoints

El protocolo de PowerSync usa "checkpoints" para garantizar consistencia:

- Cada upload del cliente incluye un `client_id` y un `sequence_number`.
- Postgres aplica los cambios en orden secuencial por cliente.
- Si una validación falla (ej: clienta ya existe con ese email), PowerSync reporta el error al cliente.
- El cliente debe manejar el error (mostrar mensaje al BA, permitir corrección).

## Resolución de conflictos

Los conflictos ocurren cuando dos usuarios modifican el mismo dato antes de que el primero haya sincronizado. Casos posibles:

### Caso 1: dos BAs editan la misma clienta

Escenario: BA A edita el teléfono de la clienta offline. Al mismo tiempo, BA B edita el email en otro iPad (también offline). Ambos sincronizan después.

**Estrategia**: last-write-wins **a nivel de campo**, no a nivel de fila.

- Cada campo tiene un timestamp de última modificación (`updated_at` por campo vía Drizzle + trigger).
- Al aplicar un upload, PowerSync comparara el `updated_at` del cliente con el del server.
- Si el del cliente es más reciente: se aplica.
- Si el del server es más reciente: se descarta el cambio del cliente.

**Audit log**: cada conflicto se registra en `AuditLog` con `action = 'sync_conflict_resolved'` para que el admin pueda revisar patrones.

### Caso 2: creación con ID duplicado

Escenario: BA A registra una clienta nueva offline. El iPad genera un UUID v4 para la clienta. La probabilidad de colisión con otro UUID es astronómicamente baja, pero más probable es que la misma clienta se registre en dos tiendas simultáneamente por distintos BAs.

**Estrategia**:

1. Los UUIDs se generan en el cliente. No hay colisión técnica.
2. Pero a nivel de negocio, dos `Customer` rows pueden terminar con el mismo email/teléfono.
3. El API detecta esto y crea una `DuplicateCustomerReview` pendiente de resolución por un admin.
4. El admin revisa en `/admin/duplicates/` y decide: ¿merger? ¿mantener ambos como distintos?
5. Se notifica al BA de origen con el resultado.

### Caso 3: eliminación vs modificación

Escenario: admin ejecuta derecho al olvido mientras BA estaba editando el perfil offline.

**Estrategia**:

- Cuando el BA sincroniza, encuentra que su modificación afecta a una fila eliminada.
- PowerSync lo reporta como error: "registro no existe".
- El SDK mobile presenta un aviso: "Los cambios no pudieron guardarse porque la clienta fue eliminada. Contacta al administrador."
- El intento de escritura queda en audit log.

### Caso 4: dos BAs agendan cita en el mismo slot

Escenario: BA A agenda cita con Clienta X a las 3pm. BA B (offline) agenda otra cita a las 3pm con otra clienta en la misma cabina.

**Estrategia**: las citas a nivel de entidad de base de datos no tienen constraint de unicidad estricta (una cabina puede tener dos BAs en horarios traslapados). La UI gerencial alerta al manager sobre potenciales conflictos de recursos. No es un error de sincronización sino de negocio.

## Background sync en iOS

Para que el iPad del BA sincronice incluso cuando la app está cerrada (ej: BA cierra app para ir a comer y vuelve, quiere que los datos ya estén actualizados):

### Configuración en `app.json` de Expo

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["processing", "fetch"]
      }
    },
    "plugins": [
      [
        "expo-background-task",
        {
          "minimumInterval": 900
        }
      ]
    ]
  }
}
```

### Implementación

```typescript
// apps/mobile/lib/offline/background-sync.ts

import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { powersync } from '../powersync/client';

const BACKGROUND_SYNC_TASK = 'powersync-background-sync';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    await powersync.connect();
    await powersync.waitForFirstSync({ timeout: 30000 });
    await powersync.disconnect();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundSync() {
  await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: 15 * 60, // 15 minutos
  });
}
```

### Limitaciones de iOS

- iOS decide cuándo ejecutar los background tasks. No es determinístico.
- Apple prioriza apps que el usuario usa frecuentemente. Las apps poco usadas reciben menos ejecuciones.
- El intervalo mínimo es sugerencia, no garantía.

**Conclusión**: background sync es optimización, no reemplaza al foreground sync. Cuando el BA abre la app, la sincronización foreground actualiza todo rápidamente.

## Tamaño de la base local y performance

### Estimaciones

Para una tienda activa con 500 clientas recurrentes y 2 años de historial:

- 500 `customers` × 2KB = 1 MB
- 500 `beauty_profiles` × 3KB = 1.5 MB
- 5,000 `purchases` × 1KB = 5 MB
- 10,000 `purchase_items` × 500B = 5 MB
- 3,000 `recommendations` × 1KB = 3 MB
- 2,000 `appointments` × 1KB = 2 MB
- 10,000 productos del catálogo de la marca × 5KB = 50 MB (incluyendo imágenes)

**Total estimado**: 70-80 MB por BA. Sobrado para un iPad con 64GB+.

### Estrategia de imágenes

Las imágenes de productos **no** se sincronizan crudas a SQLite. Se sincroniza la URL en S3 y el cliente descarga la imagen bajo demanda, con caché local.

Para operación offline de imágenes:

1. Al sincronizar el catálogo, el cliente pre-descarga imágenes de productos "destacados" (definidos por BrandConfig).
2. Las imágenes se guardan en cache del dispositivo (hasta 200 MB).
3. Cuando el BA busca un producto sin imagen cacheada y está offline, se muestra un placeholder.

### Índices en SQLite

PowerSync gestiona SQLite pero podemos agregar índices adicionales para queries del BA:

```typescript
// apps/mobile/lib/powersync/schema.ts
new Table(
  {
    first_name: column.text,
    last_name: column.text,
    email: column.text,
    phone: column.text,
    store_id: column.text,
  },
  {
    indexes: {
      customers_search: ['first_name', 'last_name'],
      customers_phone: ['phone'],
      customers_email: ['email'],
    },
  },
);
```

Estos índices aceleran la búsqueda de clientas en piso de venta (RF-03), que es la operación más frecuente.

## Monitoreo y debugging

### Métricas a monitorear

- **Sync lag**: cuánto tardan los cambios en propagarse (objetivo: < 2s en condiciones normales).
- **Cola de uploads**: si un cliente tiene uploads pendientes por más de 1 hora con red, es señal de problema.
- **Tamaño de bucket por usuario**: alertas si crece desmedidamente.
- **Conflictos**: frecuencia y tipo de conflictos resueltos.

### Herramientas

- PowerSync Service expone métricas en formato Prometheus.
- Se integran con CloudWatch Dashboards.
- Sentry captura errores de sincronización del lado del cliente.

### Debugging del BA

Si un BA reporta problemas:

1. El admin puede ver en `/admin/sync-status/[user_id]` el estado de la conexión del cliente, última sync exitosa, operaciones en cola.
2. Se puede forzar un "full resync" desde el admin (borra SQLite local y vuelve a sincronizar todo).
3. Los logs del cliente se pueden exportar vía un comando oculto en la app para debugging.

## Casos edge y su manejo

### Cambio de modelo de datos (migración)

Cuando se modifica el schema en Postgres (ej: agregar columna nueva a `customers`):

1. La migración se aplica en Postgres (reversible).
2. El schema cliente de PowerSync se actualiza en la siguiente release de la app mobile.
3. PowerSync maneja schemas divergentes gracefully: columnas nuevas se ignoran en clientes viejos, columnas removidas se toleran.
4. Para migraciones destructivas (ej: renombrar columna), se usa el patrón "expand-migrate-contract": agregar nueva, migrar datos, después de unas semanas remover vieja.

### BA con muchos dispositivos

Un BA puede tener más de un iPad (ej: uno en el mostrador, uno portátil). PowerSync maneja esto:

- Cada dispositivo tiene un `client_id` único.
- Todos reciben los mismos datos (mismo usuario, mismo scope).
- Los uploads se serializan por `client_id` + `sequence_number`.
- Conflictos entre dispositivos del mismo BA se resuelven con last-write-wins a nivel de campo.

### Desactivación de un BA

Cuando un admin desactiva un BA (`active = false`):

1. El JWT del BA sigue funcionando hasta que expire (máximo 1 hora).
2. Al intentar refresh, el token es rechazado.
3. El BA es expulsado de la app.
4. El admin puede forzar logout inmediato revocando el refresh token.

Si se temía acceso malicioso, el admin debe:

1. Desactivar al usuario.
2. Forzar revocación de tokens.
3. Opcionalmente, remotamente wipe el SQLite local (feature planeada para v2).

## Referencias cruzadas

- Modelo de datos y entidades sincronizadas: ver `02-domain-model.md`.
- Autenticación y JWT usados por PowerSync: ver `04-security-compliance.md` sección "Autenticación".
- Infraestructura de hosting del PowerSync Service: ver `01-architecture.md` sección "Infraestructura de producción".
- Requerimientos del RFP que se cumplen aquí (alcance offline, RF-52 a RF-55): ver `06-rfp-compliance-matrix.md`.
