# 05 — Requerimientos de Implementación y Soporte

Estos requerimientos cubren **cómo se entrega, mantiene y opera** la plataforma después de su construcción: migración desde el sistema actual, capacitación, soporte continuo, SLAs operativos y plan de rollout.

---

## Tabla de requerimientos

| # | Requerimiento | Prioridad |
|---|---|---|
| RI-01 | Plan de migración de datos desde el sistema actual (Beauty Connect) con mapeo de campos y validación | Obligatorio |
| RI-02 | Programa de capacitación para BAs, Gerentes, Supervisores y Administradores | Obligatorio |
| RI-03 | Materiales de entrenamiento en español, adaptados a perfiles con distintos niveles de alfabetización digital | Obligatorio |
| RI-04 | Soporte técnico en español, disponible de lunes a domingo en horario comercial (mínimo 11:00–21:00 CST) | Obligatorio |
| RI-05 | Canal de soporte de urgencia (P1) con tiempo de respuesta ≤ 2 horas en días hábiles | Obligatorio |
| RI-06 | Entorno de pruebas (sandbox / staging) para validación previa a cada release | Obligatorio |
| RI-07 | Actualizaciones de la plataforma sin interrupción del servicio productivo (zero-downtime deployments) | Obligatorio |
| RI-08 | SLA de corrección de bugs críticos: ≤ 24 horas; bugs mayores: ≤ 5 días hábiles | Obligatorio |
| RI-09 | Documentación técnica y manual de usuario actualizados con cada nueva versión | Obligatorio |
| RI-10 | Propuesta de plan de implementación por fases (piloto → rollout nacional) con hitos y entregables claros | Obligatorio |

---

## Resumen cuantitativo

- **Total de RI:** 10 requerimientos.
- **Obligatorios:** 10 (todos).
- **Deseables:** 0.

## Lectura clave

Todos los RI son **obligatorios**. No hay margen para omitir ninguno en la propuesta. Esto incluye compromisos contractuales duros:

- **Migración auditable** desde Beauty Connect con mapeo de campos y validación (RI-01).
- **Soporte 7 días a la semana** en español, con al menos 10 horas de cobertura diaria (RI-04).
- **Respuesta a incidentes P1 en ≤ 2 horas** (RI-05).
- **Zero-downtime deployments** (RI-07) — exige arquitectura con estrategias como blue-green, canary, o rolling updates.
- **Fix de bugs críticos en ≤ 24h, mayores en ≤ 5 días hábiles** (RI-08).
- **Plan por fases con piloto antes del rollout nacional** (RI-10) — también está alineado con la sección 6.5 del RFP que pide disponibilidad para piloto previo a la adjudicación.

## Relación con otras secciones

- El **plan por fases** (RI-10) se conecta con la **propuesta económica** (`06-estructura-propuesta.md` §6.4): el cliente espera precios diferenciados o escalonados entre piloto y rollout.
- **Capacitación en español adaptada a diferentes niveles digitales** (RI-03) refuerza el factor crítico de usabilidad documentado en `09-factores-criticos-exito.md`.
- **SLAs de soporte** (RI-04, RI-05, RI-08) se complementan con el SLA de disponibilidad del sistema (RNF-01: 99.5%).
