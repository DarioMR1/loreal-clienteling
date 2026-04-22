# 06 — Matriz de Cumplimiento del RFP

Este documento es la fuente única de verdad sobre el estado de cumplimiento de cada requerimiento del RFP de L'Oréal México. **Es el documento con mayor peso en la evaluación** (30% del criterio total).

Cada requerimiento está mapeado a un componente técnico del sistema, con referencia al archivo de documentación donde se elabora la implementación.

## Resumen cuantitativo

| Categoría | Total | Obligatorios | Deseables |
|---|---|---|---|
| Requerimientos Funcionales (RF) | 50 | 33 | 17 |
| Requerimientos No Funcionales (RNF) | 16 | 10 | 6 |
| Requerimientos de Implementación (RI) | 10 | 10 | 0 |
| **Total** | **76** | **53** | **23** |

**Obligatorios totales**: 53. Cumplir con los 53 es el piso no negociable de la propuesta.

## Convenciones de la matriz

- **Estado**: `planeado` / `en progreso` / `implementado` / `validado`
- **Módulo/Componente**: ruta concreta en el monorepo donde vive la implementación
- **Doc ref**: archivo donde se elabora el tema
- **Nota**: aclaración cuando el cumplimiento requiere contexto

Al momento del diseño inicial, todos los ítems están en estado `planeado`. La matriz se actualiza en cada PR que avanza el estado de un requerimiento.

---

## 3.1 Gestión de Perfiles de Consumidor (360°)

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-01 | Registro de consumidor con datos básicos (nombre, apellido, género, fecha nac., teléfono, email) | Obligatorio | `apps/api/src/modules/customers/` + `apps/mobile/app/(ba)/customer/register.tsx` | planeado | 02 |
| RF-02 | Aviso de privacidad versionado y con aceptación explícita (LFPDPPP) | Obligatorio | `apps/api/src/modules/consents/` + `apps/mobile/app/(ba)/customer/privacy-notice.tsx` | planeado | 04 |
| RF-03 | Búsqueda de consumidor por email, celular o nombre | Obligatorio | `apps/api/src/modules/customers/search.service.ts` + `packages/domain/search/` | planeado | 02 |
| RF-04 | Vista unificada del perfil (historial, recomendaciones, citas, intereses) | Obligatorio | `apps/mobile/app/(ba)/customer/[id].tsx` | planeado | 02 |
| RF-05 | Captura de intereses de belleza (categorías, rutina, preocupaciones) | Obligatorio | `apps/api/src/modules/beauty/` | planeado | 02 |
| RF-06 | Registro del motivo de visita | Obligatorio | `apps/api/src/modules/recommendations/` (campo `visit_reason`) | planeado | 02 |
| RF-07 | Historial de tipo de piel, tono, subtono, ingredientes | Deseable | `apps/api/src/modules/beauty/beauty-profiles.service.ts` | planeado | 02 |
| RF-08 | Registro de muestras y seguimiento de conversión a compra | Deseable | `apps/api/src/modules/samples/` | planeado | 02 |
| RF-09 | Alertas automáticas de eventos de vida (cumpleaños, aniversario, reposición) | Obligatorio | `packages/domain/lifecycle-events/` + cron job en `apps/api` | planeado | 02 |
| RF-10 | Enriquecimiento con datos de comportamiento digital (e-commerce) | Deseable | `apps/api/src/modules/integrations/ecommerce/` (mockeado en universitario) | planeado | 01 |
| RF-11 | Segmentación automática (VIP, recurrente, nuevo, en riesgo) | Deseable | `packages/domain/customer-segmentation/` | planeado | 02 |
| RF-12 | Soporte multilingüe con español primario | Obligatorio | `packages/i18n/locales/es-MX/` | planeado | 03 |

---

## 3.2 Recomendación de Productos

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-13 | Registro manual de productos recomendados | Obligatorio | `apps/api/src/modules/recommendations/` | planeado | 02 |
| RF-14 | Escaneo de SKU con cámara (código de barras/QR) | Obligatorio | `apps/mobile/app/(ba)/recommend/scan.tsx` (expo-barcode-scanner) | planeado | 02 |
| RF-15 | Motor de recomendación inteligente basado en perfil | Obligatorio | `apps/ai-service/app/routers/recommendations.py` + Claude API | planeado | 01, 02 |
| RF-16 | Lógica de reposición (estimar cuándo se agota un producto) | Deseable | `packages/domain/replenishment/` | planeado | 02 |
| RF-17 | Catálogo de productos en tiempo real con precio y disponibilidad | Obligatorio | `apps/api/src/modules/products/` + `apps/mobile/app/(ba)/recommend/` | planeado | 02 |
| RF-18 | Generación de lookbooks/rutinas personalizadas compartibles | Deseable | `apps/ai-service/app/routers/lookbooks.py` + `apps/mobile/app/(ba)/recommend/lookbook.tsx` | planeado | 02 |
| RF-19 | Historial completo de recomendaciones por consumidor | Obligatorio | `apps/api/src/modules/recommendations/` (GET /customers/:id/recommendations) | planeado | 02 |

---

## 3.3 Registro de Compras

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-20 | Registro de compras (fecha, SKU, producto, marca, precio, cantidad) | Obligatorio | `apps/api/src/modules/purchases/` | planeado | 02 |
| RF-21 | Consulta del historial transaccional del consumidor | Obligatorio | `apps/api/src/modules/purchases/` (GET /customers/:id/purchases) | planeado | 02 |
| RF-22 | Integración bidireccional con POS para captura automática | Deseable | `apps/api/src/modules/integrations/pos/` (mockeado en universitario) | planeado | 01 |
| RF-23 | Registro manual de compras cuando no hay integración POS | Obligatorio | `apps/api/src/modules/purchases/purchases.service.ts` (método `createManual`) | planeado | 02 |
| RF-24 | Escaneo de SKU para registro de compras | Deseable | `apps/mobile/app/(ba)/purchase/scan.tsx` | planeado | 02 |
| RF-25 | Atribución de venta al BA que realizó la consulta/recomendación | Obligatorio | `packages/domain/attribution/` | planeado | 02 |

---

## 3.4 Gestión de Citas

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-26 | Creación de citas (tipo, fecha, hora, comentarios, BA asignado) | Obligatorio | `apps/api/src/modules/appointments/` + `apps/mobile/app/(ba)/appointment/create.tsx` | planeado | 02 |
| RF-27 | Vista de calendario por BA y por tienda (semanal y mensual) | Obligatorio | `apps/mobile/app/(ba)/appointment/calendar.tsx` + `apps/web/app/(dashboard)/manager/appointments/` | planeado | 03 |
| RF-28 | Reporte de agenda (nombre, teléfono, fecha, evento, comentario) | Obligatorio | `apps/api/src/modules/analytics/reports.service.ts` (método `getAgendaReport`) | planeado | 02 |
| RF-29 | Tipos de evento configurables (cabina, facial, aniversario, VIP, etc.) | Obligatorio | Tabla `appointment_event_types` gestionable desde admin | planeado | 02 |
| RF-30 | Recordatorios automáticos al BA previo a la cita | Obligatorio | Cron job en `apps/api` + Expo Push Notifications | planeado | 01 |
| RF-31 | Confirmación/recordatorio al consumidor vía SMS/WhatsApp | Deseable | `apps/api/src/modules/integrations/whatsapp/` | planeado | 01 |
| RF-32 | Control de citas reagendadas y canceladas para métricas | Obligatorio | Tabla `appointments` con campos `status` y `rescheduled_from_appointment_id` | planeado | 02 |
| RF-33 | Citas virtuales/videoconsultas con el consumidor | Deseable | Campo `is_virtual` + `video_link` en `appointments` | planeado | 02 |

---

## 3.5 Seguimiento y Comunicación con el Consumidor

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-34 | Módulo de seguimiento post-visita | Obligatorio | `apps/api/src/modules/communications/` + `apps/mobile/app/(ba)/followup/` | planeado | 02 |
| RF-35 | Comunicación integrada vía WhatsApp Business API (sin teléfonos personales) | Deseable | `apps/api/src/modules/integrations/whatsapp/whatsapp.service.ts` | planeado | 01 |
| RF-36 | Plantillas de mensajes personalizables por marca y tipo | Obligatorio | Tabla `message_templates` + admin UI en `apps/web/app/(dashboard)/admin/templates/` | planeado | 02 |
| RF-37 | Registro de todas las comunicaciones en el perfil (trazabilidad) | Obligatorio | Tabla `communications` | planeado | 02 |
| RF-38 | Clasificación de tipos de seguimiento (3m, 6m, cumple, reposición, evento) | Obligatorio | Campo `followup_type` en `communications` | planeado | 02 |
| RF-39 | Atribución de ventas online del BA por link tracking | Deseable | `apps/api/src/modules/communications/tracking.service.ts` | planeado | 02 |

---

## 3.6 Reportes y Analytics

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-40 | Dashboard ejecutivo de tienda (KPIs: objetivo, avance, sell-out, registros, seguimientos) | Obligatorio | `apps/web/app/(dashboard)/manager/overview/page.tsx` | planeado | 03 |
| RF-41 | Métricas de citas (objetivo semanal, total, nuevas, reagendadas) | Obligatorio | `apps/web/app/(dashboard)/manager/appointments/page.tsx` | planeado | 03 |
| RF-42 | Reportes filtrables por fecha, tienda, marca, BA | Obligatorio | `apps/api/src/modules/analytics/` | planeado | 02 |
| RF-43 | Reporte de clientes exportable (listado con columnas definidas) | Obligatorio | `apps/api/src/modules/analytics/reports.service.ts` (método `getCustomersReport`) | planeado | 02 |
| RF-44 | Visualización gráfica: top franquicias/marcas y ventas por categoría | Obligatorio | `apps/web/app/(dashboard)/supervisor/trends/` con Recharts | planeado | 03 |
| RF-45 | Reporte de desempeño por BA (transacciones, registros, seguimientos, recomendaciones) | Obligatorio | `apps/web/app/(dashboard)/manager/bas/page.tsx` | planeado | 03 |
| RF-46 | Reporte de agenda exportable | Obligatorio | `apps/api/src/modules/analytics/exports.service.ts` | planeado | 02 |
| RF-47 | Indicadores de conversión (recomendación → compra, seguimiento → revisita) | Deseable | `packages/domain/attribution/` + dashboards | planeado | 02 |
| RF-48 | Dashboard de retención (clientes activos vs. en riesgo) | Deseable | `apps/web/app/(dashboard)/manager/overview/` (sección retención) | planeado | 02 |
| RF-49 | Exportación de reportes en Excel/CSV | Obligatorio | `apps/api/src/modules/analytics/exports.service.ts` (librerías: exceljs, csv-stringify) | planeado | — |
| RF-50 | Acceso a reportes en tiempo real desde móvil y escritorio | Obligatorio | Los reportes gerenciales viven en web (Next.js) accesible desde cualquier dispositivo con navegador | planeado | 01 |

---

## 3.7 Gestión de Usuarios y Seguridad de Acceso

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-51 | Roles diferenciados (BA, Gerente, Supervisor, Administrador) con permisos específicos | Obligatorio | `apps/api/src/modules/auth/` + CASL abilities | planeado | 04 |
| RF-52 | BA solo ve clientes y datos de su tienda/franquicia | Obligatorio | CASL + RLS Postgres + Sync Rules PowerSync | planeado | 04, 05 |
| RF-53 | Gerente accede a reportes de todos los BAs de su tienda | Obligatorio | CASL abilities para `role = manager` | planeado | 04 |
| RF-54 | Supervisor visualiza resultados de múltiples tiendas bajo su responsabilidad | Obligatorio | CASL abilities + queries con scope de `zone_id` | planeado | 04 |
| RF-55 | Administrador Central gestiona configuraciones, marcas, tiendas y usuarios a nivel nacional | Obligatorio | `apps/web/app/(dashboard)/admin/` | planeado | 03, 04 |
| RF-56 | Autenticación segura por usuario (login individual, no compartido) | Obligatorio | Better Auth con email + password + MFA opcional | planeado | 04 |

---

## 3.8 Funcionalidades Específicas para Belleza

| ID | Descripción | Prioridad | Módulo/Componente | Estado | Doc ref |
|---|---|---|---|---|---|
| RF-58 | Captura de atributos de piel (tipo, preocupaciones, tono, subtono) | Obligatorio | `apps/api/src/modules/beauty/beauty-profiles.service.ts` | planeado | 02 |
| RF-60 | Asociación de shade por categoría (base, corrector, labiales) | Deseable | Tabla `beauty_profile_shades` | planeado | 02 |
| RF-61 | Historial de muestras y seguimiento de conversión | Deseable | `apps/api/src/modules/samples/` | planeado | 02 |
| RF-62 | Fichas técnicas, tutoriales y argumentarios desde la plataforma | Deseable | Campos `technical_sheet_url`, `tutorial_url`, `sales_argument` en `products` | planeado | 02 |
| RF-63 | Integración con Virtual Try-On | Deseable | `apps/ai-service` + SDK de ModiFace (L'Oréal) | planeado | 01 |

Nota: el RFP salta del RF-56 al RF-58 y del RF-58 al RF-60 (no existen RF-57 ni RF-59 en el documento original).

---

## 4. Requerimientos No Funcionales

### 4.1 Disponibilidad y Rendimiento

| ID | Descripción | Prioridad | Cómo se cumple | Estado | Doc ref |
|---|---|---|---|---|---|
| RNF-01 | Disponibilidad mínima 99.5% SLA mensual | Obligatorio | RDS Multi-AZ, ECS Fargate con múltiples tasks, ALB con health checks, blue-green deployments | planeado | 01 |
| RNF-02 | Tiempo de respuesta ≤ 2s en operaciones comunes | Obligatorio | Queries optimizadas con índices, caché de React Query, SQLite local en mobile | planeado | 01, 05 |
| RNF-03 | Soporte de carga simultánea de todos los BAs nacionales | Obligatorio | Autoscaling en ECS Fargate + RDS con instance size adecuada | planeado | 01 |

### 4.2 Seguridad y Privacidad

| ID | Descripción | Prioridad | Cómo se cumple | Estado | Doc ref |
|---|---|---|---|---|---|
| RNF-04 | Cumplimiento LFPDPPP | Obligatorio | Aviso de privacidad versionado, consentimientos por canal, audit logs, derechos ARCO | planeado | 04 |
| RNF-05 | Funcionalidad de derecho al olvido | Obligatorio | Flujo técnico documentado con hard delete + anonimización + constancia PDF | planeado | 04 |
| RNF-06 | Datos residen en México o jurisdicciones aprobadas por L'Oréal | Obligatorio | AWS región México (us-east-mex-1) para todo el stack principal. Servicios externos mitigados con anonimización. | planeado | 04 |
| RNF-07 | Gestión de consentimientos diferenciada por canal (SMS, email, WhatsApp) | Obligatorio | Tabla `consents` con `type` por canal + validación en cada envío | planeado | 04 |

### 4.3 Compatibilidad e Integración

| ID | Descripción | Prioridad | Cómo se cumple | Estado | Doc ref |
|---|---|---|---|---|---|
| RNF-08 | Compatibilidad con iPad iOS 15+ | Obligatorio | Expo SDK 54+ soporta iOS 15+ nativamente | planeado | 01 |
| RNF-09 | Compatibilidad con Android 12+ | Deseable | Expo + React Native compilan a ambos targets | planeado | 01 |
| RNF-10 | Integración con plataformas de e-commerce de marcas L'Oréal | Deseable | `apps/api/src/modules/integrations/ecommerce/` (mockeado en universitario) | planeado | 01 |
| RNF-11 | Integración con WhatsApp Business API (Meta) | Deseable | `apps/api/src/modules/integrations/whatsapp/` | planeado | 01 |
| RNF-12 | Integración con herramientas de diagnóstico de piel | Deseable | Arquitectura abierta vía adaptadores en `/integrations/` | planeado | 01 |

### 4.4 Configurabilidad y Escalabilidad

| ID | Descripción | Prioridad | Cómo se cumple | Estado | Doc ref |
|---|---|---|---|---|---|
| RNF-13 | Multi-marca con interfaces y configuraciones independientes | Obligatorio | `packages/brand-config/` + tabla `brand_configs` + theming dinámico | planeado | 02, 03 |
| RNF-14 | Multi-tienda (cientos de puntos de venta) con configuraciones independientes | Obligatorio | Tabla `stores` + RLS + Sync Rules por `store_id` | planeado | 02, 05 |
| RNF-15 | Arquitectura escalable sin rediseño | Obligatorio | ECS Fargate autoscaling, RDS read replicas disponibles, pgvector nativo | planeado | 01 |
| RNF-16 | Configuración de nuevas tiendas/marcas gestionable por L'Oréal sin proveedor | Deseable | `apps/web/app/(dashboard)/admin/brands/` y `/admin/stores/` permiten CRUD completo | planeado | 03 |

---

## 5. Requerimientos de Implementación y Soporte

Todos los RI son **obligatorios** (no hay "deseables" en esta categoría).

| ID | Descripción | Cómo se cumple | Estado | Doc ref |
|---|---|---|---|---|
| RI-01 | Plan de migración desde Beauty Connect con mapeo y validación | Documento separado `/docs/migration-plan.md` (a generar cuando se tenga acceso al schema de Beauty Connect) | planeado | — |
| RI-02 | Programa de capacitación para BAs, Gerentes, Supervisores, Admins | Entregable de fase de implementación con materiales por rol | planeado | — |
| RI-03 | Materiales de entrenamiento en español adaptados a distintos niveles digitales | Videos cortos, guías ilustradas, quick references en español | planeado | — |
| RI-04 | Soporte técnico en español 7 días, mínimo 11:00–21:00 CST | Servicio de soporte propuesto como parte del contrato operativo | planeado | — |
| RI-05 | Canal de soporte P1 con respuesta ≤ 2 horas en días hábiles | SLA contractual con canal dedicado (Slack/Teams + teléfono de guardia) | planeado | — |
| RI-06 | Entorno de pruebas (sandbox/staging) para validación previa | Entorno staging en AWS México replica de producción con datos anonimizados | planeado | 01 |
| RI-07 | Actualizaciones zero-downtime (sin interrupción del servicio productivo) | Blue-green deployments en ECS Fargate, migraciones backward-compatible | planeado | 01 |
| RI-08 | SLA de bugs: P1 ≤ 24h, mayores ≤ 5 días hábiles | Compromiso contractual con equipo de soporte 24/7 para P1 | planeado | — |
| RI-09 | Documentación técnica y manual de usuario con cada versión | Docs técnicas en `/docs/`, manual de usuario separado por rol, versionado con el código | planeado | — |
| RI-10 | Plan de implementación por fases (piloto → rollout nacional) con hitos | Fase 1: piloto en 2 tiendas (1 Liverpool + 1 Palacio) por 3 meses. Fase 2: rollout a marca completa. Fase 3: rollout nacional. | planeado | — |

---

## Seguimiento de cobertura

Al finalizar el desarrollo, la propuesta presentada a L'Oréal incluirá esta misma matriz con todos los ítems en estado `implementado` o `validado`. Los ítems `deseables` se marcarán explícitamente como tal, mostrando cuántos se cubrieron más allá del mínimo obligatorio.

**Métrica de éxito para la licitación**: 53/53 obligatorios cubiertos (100%) + al menos 15/23 deseables cubiertos (65%).

### Checklist de validación antes de presentar propuesta

- [ ] Los 33 RF obligatorios tienen módulo implementado
- [ ] Los 10 RNF obligatorios tienen arquitectura justificada  
- [ ] Los 10 RI obligatorios tienen compromiso contractual documentado
- [ ] La matriz está actualizada al commit de HEAD
- [ ] Cada ítem tiene doc ref válida
- [ ] El estado refleja lo realmente implementado (no se marca "implementado" si no está validado)

## Referencias cruzadas

- Contexto del RFP y criterios de evaluación: archivos originales en `/rfp/` (07-criterios-evaluacion.md especialmente).
- Arquitectura que cumple los RNF: `01-architecture.md`.
- Modelo de datos que cumple los RF de entidades: `02-domain-model.md`.
- Estructura de código que permite trazabilidad de RF a módulo: `03-monorepo-structure.md`.
- Detalles de seguridad que cumplen RNF-04 a RNF-07: `04-security-compliance.md`.
- Detalles de offline que cumplen operación híbrida: `05-offline-sync.md`.
