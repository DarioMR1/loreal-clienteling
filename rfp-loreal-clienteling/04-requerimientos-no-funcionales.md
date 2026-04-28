# 04 — Requerimientos No Funcionales

Los requerimientos no funcionales describen **cómo se comporta** el sistema: rendimiento, seguridad, compatibilidad y escalabilidad. No son features, son propiedades de calidad.

---

## 4.1 Disponibilidad y Rendimiento

| # | Requerimiento | Prioridad |
|---|---|---|
| RNF-01 | Disponibilidad mínima del sistema: 99.5% SLA mensual | Obligatorio |
| RNF-02 | Tiempo de respuesta de la aplicación en operaciones comunes (búsqueda, carga de perfil): ≤ 2 segundos | Obligatorio |
| RNF-03 | Capacidad de soportar carga simultánea de todos los BAs activos a nivel nacional sin degradación del servicio | Obligatorio |

---

## 4.2 Seguridad y Privacidad

| # | Requerimiento | Prioridad |
|---|---|---|
| RNF-04 | Cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP) de México | Obligatorio |
| RNF-05 | Funcionalidad de "derecho al olvido": eliminación completa de datos personales de un consumidor a solicitud | Obligatorio |
| RNF-06 | Los datos personales de consumidores mexicanos deben residir en servidores ubicados en México o en jurisdicciones aprobadas por L'Oréal | Obligatorio |
| RNF-07 | Gestión de consentimientos de marketing diferenciada por canal (SMS, email, WhatsApp) | Obligatorio |

---

## 4.3 Compatibilidad e Integración

| # | Requerimiento | Prioridad |
|---|---|---|
| RNF-08 | Compatibilidad con iPad (iOS 15 o superior) como dispositivo principal | Obligatorio |
| RNF-09 | Compatibilidad con Android (versión 12 o superior) como dispositivo alternativo | Deseable |
| RNF-10 | Integración con plataformas de e-commerce de marcas L'Oréal México para enriquecer perfil omnicanal | Deseable |
| RNF-11 | Integración con WhatsApp Business API (Meta) para comunicación oficial con consumidores | Deseable |
| RNF-12 | Capacidad de integración con herramientas de diagnóstico de piel físico/digital | Deseable |

---

## 4.4 Configurabilidad y Escalabilidad

| # | Requerimiento | Prioridad |
|---|---|---|
| RNF-13 | La plataforma debe ser multi-marca: soportar la operación de distintas marcas del portafolio L'Oréal con interfaces y configuraciones independientes por marca | Obligatorio |
| RNF-14 | La plataforma debe ser multi-tienda: gestionar cientos de puntos de venta con configuraciones independientes | Obligatorio |
| RNF-15 | Arquitectura escalable que soporte el crecimiento del número de usuarios, tiendas y volumen de datos sin rediseño | Obligatorio |
| RNF-16 | Proceso de configuración de nuevas tiendas / marcas gestionable por el equipo L'Oréal sin dependencia total del proveedor | Deseable |

---

## Resumen cuantitativo

- **Total de RNF:** 16 requerimientos no funcionales.
- **Obligatorios:** 10.
- **Deseables:** 6.
- **Categorías:** 4 (disponibilidad/rendimiento, seguridad/privacidad, compatibilidad/integración, configurabilidad/escalabilidad).

## Notas relevantes

- **Residencia de datos (RNF-06):** es una restricción legal, no preferencial. Condiciona la elección de hosting (AWS México, Azure México, o centros de datos locales).
- **iPad iOS 15+ (RNF-08):** confirma que el cliente está pensando en una app nativa o una web app optimizada. La apuesta segura es nativa dado el requerimiento de operación offline.
- **LFPDPPP (RNF-04):** incluye obligaciones de aviso de privacidad, consentimiento explícito, derecho ARCO (Acceso, Rectificación, Cancelación, Oposición), y el derecho al olvido que se expresa en RNF-05.
