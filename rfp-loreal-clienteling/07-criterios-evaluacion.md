# 07 — Criterios de Evaluación

L'Oréal México evaluará las propuestas con base en seis criterios ponderados. El total suma 100%.

---

## Tabla de criterios y pesos

| Criterio | Peso |
|---|---|
| Cobertura funcional de requerimientos obligatorios | **30%** |
| Experiencia y referencias en Beauty / Retail de Lujo | **20%** |
| Capacidades de IA y personalización | **15%** |
| Arquitectura técnica, integraciones y seguridad | **15%** |
| Propuesta económica (TCO a 3 años) | **10%** |
| Plan de implementación y soporte | **10%** |
| **Total** | **100%** |

---

## Lectura estratégica de los pesos

### El 30% manda: cobertura funcional de obligatorios

El criterio con mayor peso es cubrir todos los requerimientos **obligatorios**. Entre RF, RNF y RI suman:

- **33 RF obligatorios** (de 50 totales).
- **10 RNF obligatorios** (de 16 totales).
- **10 RI obligatorios** (de 10 totales — todos).

→ **53 requerimientos obligatorios** que deben quedar explícitamente cubiertos en la propuesta, preferiblemente con una matriz de cumplimiento que cite los IDs.

### El 50% combinado de "fit" con la industria

Sumando **experiencia en beauty/lujo (20%) + capacidades de IA (15%) + arquitectura e integraciones (15%) = 50%**. La mitad de la evaluación es demostrar que somos el proveedor adecuado para **este tipo de cliente**, no un vendor genérico.

### Solo 10% es precio

La propuesta económica pesa **10%**, y el RFP aclara explícitamente en las condiciones generales: **"L'Oréal México no se compromete a adjudicar el contrato al proveedor con el menor precio"**. No es una licitación de precio, es una evaluación de valor.

Además, el precio se mide como **TCO a 3 años**, no como costo inicial. Esto penaliza modelos con costos ocultos en soporte, customización o migración.

### Implementación y soporte pesa 10%

Es el mismo peso que el precio. A pesar de tener 10 requerimientos obligatorios en `05-requerimientos-implementacion.md`, el criterio vale solo 10%. Conclusión operativa: cumplir con los RI es el **piso**, no el diferenciador.

---

## Implicaciones para el armado de la propuesta

Prioridad de esfuerzo según impacto en la evaluación:

1. **Matriz de cumplimiento exhaustiva** de los 53 obligatorios (30%).
2. **Casos de éxito en beauty premium / lujo y en México o LatAm** (20%).
3. **Demostración real de IA** (no marketing): motor de recomendación, lógica de reposición, segmentación automática, virtual try-on (15%).
4. **Arquitectura con certificaciones, integraciones demostrables y cumplimiento LFPDPPP** (15%).
5. **Modelo económico claro con TCO a 3 años y cláusulas de ajuste por inflación/FX** (10%).
6. **Plan de implementación por fases con hitos claros y compromisos de SLA** (10%).

## Qué NO está en los criterios (pero se valora de manera implícita)

Ver `09-factores-criticos-exito.md` para el análisis del "entre líneas" del RFP — especialmente la **usabilidad para el BA** y la **continuidad durante la migración**.
