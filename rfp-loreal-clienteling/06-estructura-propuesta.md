# 06 — Estructura de la Propuesta a Entregar

> **Importante:** este archivo describe **qué bloques debe tener el documento de propuesta** que vamos a entregarle a L'Oréal, no los requerimientos del sistema. Es el molde de nuestra respuesta.

La sección 6 del RFP define cinco bloques obligatorios.

---

## 6.1 Empresa y Producto

Debe incluir:

- **Descripción del producto propuesto:**
  - Arquitectura general.
  - Tecnologías utilizadas.
  - Modelo de hosting.
- **Roadmap de producto** para los próximos 12–24 meses.

---

## 6.2 Capacidades Técnicas

Debe incluir:

- **Integraciones disponibles:**
  - POS (Point of Sale).
  - CRM.
  - E-commerce.
  - WhatsApp (Business API).
- **Política de datos:**
  - Dónde se almacenan.
  - Tiempo de retención.
  - Proceso de eliminación (vinculado a derecho al olvido, RNF-05).
- **Arquitectura de seguridad y certificaciones vigentes.**

---

## 6.3 Implementación y Soporte

Debe incluir:

- **Metodología de implementación** y plan de proyecto propuesto.
- **Tiempo estimado de implementación:**
  - Fase de piloto.
  - Fase de rollout nacional.

Relación directa con los requerimientos de `05-requerimientos-implementacion.md` (RI-01 a RI-10).

---

## 6.4 Propuesta Económica

Debe incluir:

- **Modelo de precios:** por usuario, tienda, transacción o consumo (a definir).
- **Costos de implementación y migración.**
- **Costos de capacitación.**
- **Costos de soporte anual.**
- **Condiciones de ajuste de precios** en contratos plurianuales, considerando:
  - Inflación en México.
  - Tipo de cambio.

---

## 6.5 Demo y Prueba de Concepto

Debe incluir:

- **Disponibilidad para presentar una demo personalizada** con escenarios reales de L'Oréal México.
- **Disponibilidad para participar en un piloto** en una o dos tiendas seleccionadas **previo a la adjudicación**.

---

## Cómo se conecta con el resto de la documentación

| Sección de la propuesta | Se apoya en |
|---|---|
| 6.1 Empresa y Producto | `00-contexto.md`, `01-alcance.md` |
| 6.2 Capacidades Técnicas | `03-requerimientos-funcionales.md`, `04-requerimientos-no-funcionales.md` |
| 6.3 Implementación y Soporte | `05-requerimientos-implementacion.md` |
| 6.4 Propuesta Económica | `07-criterios-evaluacion.md` (TCO a 3 años pesa 10%) |
| 6.5 Demo y PoC | `09-factores-criticos-exito.md` |

## Forma del entregable

- **Idioma:** español obligatorio (ver `08-condiciones-y-restricciones.md`).
- **Confidencialidad:** NDA firmado antes del acceso a información adicional.
- La propuesta debe estar directamente trazada a los IDs de requerimientos (RF/RNF/RI) para facilitar la evaluación de cobertura (criterio con mayor peso: 30% según `07-criterios-evaluacion.md`).
