# 09 — Factores Críticos de Éxito

Este archivo captura el **"entre líneas"** del RFP: lo que no está como requerimiento formal pero va a pesar en la decisión. Es la lectura estratégica que debe guiar la diferenciación de la propuesta.

---

## 1. Experiencia demostrable en Beauty Premium / Lujo

**Evidencia en el RFP:**
- La nota final al proveedor menciona textualmente: *"se valorará especialmente la capacidad de demostrar experiencia con marcas de belleza premium / lujo y con operaciones de retail en México o Latinoamérica."*
- Criterio de evaluación con **20% de peso**: "Experiencia y referencias en Beauty / Retail de Lujo".

**Qué aterrizar en la propuesta:**
- Casos de éxito con marcas de lujo (idealmente beauty, alternativamente moda premium, joyería o retail de experiencia).
- Referencias verificables de operaciones similares en México o LatAm.
- Entendimiento del código de servicio del retail de lujo: el mostrador no es un canal transaccional, es un canal relacional.

---

## 2. Usabilidad del BA en contexto de alta rotación

**Evidencia en el RFP:**
- *"El BA es el corazón de la experiencia — la usabilidad de la plataforma en el contexto de alta rotación y bajo tiempo de consulta es un factor crítico de éxito."*
- Requerimiento explícito de materiales de entrenamiento adaptados a **distintos niveles de alfabetización digital** (RI-03).
- Tiempo de respuesta ≤ 2 segundos (RNF-02) — porque la clienta no puede esperar.

**Qué aterrizar en la propuesta:**
- Flujo de registro y consulta de clienta en **menos de X clicks / segundos**, medido y demostrable.
- Diseño de UX pensado para una sola mano, con una clienta al frente, con el iPad a medias.
- Soporte offline (requerido en el alcance) que no interrumpa la consulta si se cae la señal.
- Idealmente: demo en vivo del flujo end-to-end del BA durante la presentación.

---

## 3. IA real, no marketing de IA

**Evidencia en el RFP:**
- Criterio de evaluación con **15% de peso**: "Capacidades de IA y personalización".
- RF-15 (motor de recomendación), RF-16 (lógica de reposición), RF-11 (segmentación automática), RF-63 (virtual try-on).

**Qué aterrizar en la propuesta:**
- Cómo funciona el motor de recomendación: qué features usa, qué modelos, cómo se entrena, cómo se mide.
- Cómo se calcula la lógica de reposición (timing de producto agotándose).
- Cómo se define el segmento "en riesgo de abandono" (RF-11, RF-48).
- Evitar promesas vagas tipo "usamos IA avanzada". Entrar al detalle técnico.

---

## 4. Cumplimiento LFPDPPP con datos residentes en México

**Evidencia en el RFP:**
- RNF-04: cumplimiento LFPDPPP.
- RNF-05: derecho al olvido.
- RNF-06: **residencia de datos en México** o jurisdicciones aprobadas por L'Oréal.
- RF-02: aviso de privacidad versionado.
- RNF-07: consentimientos diferenciados por canal.

**Qué aterrizar en la propuesta:**
- Dónde específicamente residen los datos (región cloud, centro de datos).
- Certificaciones de seguridad (ISO 27001, SOC 2, etc.).
- Proceso documentado de atención a solicitudes ARCO y derecho al olvido.
- Este es un **go / no-go**: si la propuesta no puede garantizar residencia en México o aprobada por L'Oréal, queda fuera.

---

## 5. Continuidad operativa durante la migración desde Beauty Connect

**Evidencia en el RFP:**
- La introducción indica explícitamente: *"manteniendo la continuidad operativa"* durante el reemplazo de Beauty Connect.
- RI-01: plan de migración con mapeo y validación.
- RI-10: plan de implementación por fases (piloto → rollout).

**Qué aterrizar en la propuesta:**
- Plan de migración con coexistencia de ambos sistemas durante un periodo definido.
- Estrategia de sincronización de datos mientras ambos sistemas están activos.
- Criterios de "done" para cerrar Beauty Connect.
- Rollback plan si el piloto falla.

---

## 6. Operación offline real

**Evidencia en el RFP:**
- Alcance (sección 2): **"Operación híbrida: online y offline (modo sin conexión)"**.

**Qué aterrizar en la propuesta:**
- Qué funciones están disponibles offline y cuáles no.
- Estrategia de sincronización al reconectar (manejo de conflictos).
- Límites de almacenamiento local en iPad.
- Este requerimiento prácticamente obliga a una app nativa iOS o a una PWA robusta con IndexedDB / service workers bien implementados.

---

## 7. Multi-marca y multi-tienda como arquitectura, no como configuración

**Evidencia en el RFP:**
- RNF-13 (multi-marca con interfaces independientes).
- RNF-14 (multi-tienda con configuraciones independientes, "cientos de puntos de venta").
- RNF-16 (configuración gestionable por L'Oréal sin depender del proveedor).

**Qué aterrizar en la propuesta:**
- Demostrar que la multi-tenancy está en la arquitectura de base, no parchada encima.
- Panel de administración donde el equipo de L'Oréal pueda onboardear una nueva marca o tienda sin tickets de desarrollo.
- Separación de datos por marca (relevante para evitar contaminación cruzada entre marcas competidoras dentro del mismo portafolio).

---

## Resumen: los 3 diferenciadores que más mueven la aguja

Si hubiera que elegir en qué invertir el mayor esfuerzo de la propuesta:

1. **Casos de éxito en beauty/lujo** con métricas reales (mueve el 20% + credibilidad general).
2. **Demo en vivo del flujo BA** con énfasis en velocidad y simplicidad (mueve el 30% de cobertura funcional + factor crítico declarado).
3. **Deep-dive técnico de IA + arquitectura + LFPDPPP** (mueve el 15% + 15% = 30% de los criterios).

Esos tres bloques suman aproximadamente **80% de la evaluación explícita** más los factores implícitos más pesados.
