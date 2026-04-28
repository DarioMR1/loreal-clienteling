# 03 — Requerimientos Funcionales

Los requerimientos funcionales describen **qué debe hacer** el sistema. Están agrupados en 8 módulos según el RFP original. Cada requerimiento tiene un ID estable (RF-XX) que debe usarse al razonar sobre cumplimiento.

> **Nota:** El RFP salta del RF-56 al RF-58 y del RF-58 al RF-60 (no existen RF-57 ni RF-59 en el documento original). Se respeta la numeración original.

---

## 3.1 Gestión de Perfiles de Consumidor (360°)

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Registro de consumidor con datos básicos: nombre(s), apellido(s), género (incluyendo opción "prefiero no decir"), fecha de nacimiento, rango de edad, teléfono celular y correo electrónico | Obligatorio |
| RF-02 | Captura y almacenamiento del aviso de privacidad con fecha, versión y aceptación explícita del consumidor (cumplimiento LFPDPPP México) | Obligatorio |
| RF-03 | Búsqueda de consumidor existente por correo electrónico, número de celular o nombre | Obligatorio |
| RF-04 | Vista unificada del perfil del consumidor: historial de compras, historial de recomendaciones, citas previas e intereses capturados | Obligatorio |
| RF-05 | Captura de intereses de belleza: categorías (Fragancia, Skincare, Makeup), rutina (día/noche/ambos), preocupaciones de piel, preferencias de maquillaje y fragancia | Obligatorio |
| RF-06 | Registro de motivo de visita del consumidor (nueva compra, recompra, regalo, preocupación, promoción, conocer productos) | Obligatorio |
| RF-07 | Historial de tipo de piel, tono, subtono e ingredientes preferidos / no preferidos | Deseable |
| RF-08 | Registro de muestras entregadas al consumidor y seguimiento de conversión a compra | Deseable |
| RF-09 | Alertas automáticas de eventos de vida: cumpleaños, aniversario como cliente, período de reposición estimado de producto | Obligatorio |
| RF-10 | Capacidad de enriquecer el perfil con datos de comportamiento digital (si existe integración con e-commerce de la marca) | Deseable |
| RF-11 | Segmentación automática del consumidor (VIP, recurrente, nuevo, en riesgo de abandono) | Deseable |
| RF-12 | Soporte multilingüe en la interfaz (español como idioma primario en México) | Obligatorio |

---

## 3.2 Recomendación de Productos

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-13 | Registro manual de productos recomendados con fecha, SKU, marca, nombre del producto y notas adicionales | Obligatorio |
| RF-14 | Escaneo de SKU mediante cámara del dispositivo (código de barras / QR) para agilizar el registro | Obligatorio |
| RF-15 | Motor de recomendación inteligente basado en perfil del consumidor (intereses, historial de compras, tipo de piel) | Obligatorio |
| RF-16 | El motor de recomendación debe soportar lógica de reposición: estimar cuándo el consumidor estará agotando un producto comprado previamente | Deseable |
| RF-17 | Acceso a catálogo de productos en tiempo real con descripción, precio, disponibilidad en tienda y atributos clave | Obligatorio |
| RF-18 | Generación de lookbooks o rutinas personalizadas compartibles con el consumidor (digital) | Deseable |
| RF-19 | Registro de historial completo de recomendaciones por consumidor, consultable por el BA | Obligatorio |

---

## 3.3 Registro de Compras

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-20 | Registro de compras realizadas: fecha, SKU, nombre del producto, marca, precio de compra y cantidad | Obligatorio |
| RF-21 | Consulta del historial transaccional completo del consumidor | Obligatorio |
| RF-22 | Integración bidireccional con el sistema de punto de venta (POS) para captura automática de transacciones | Deseable |
| RF-23 | Capacidad de registrar compras manuales cuando no existe integración automática con POS | Obligatorio |
| RF-24 | Escaneo de SKU para registro de compras mediante cámara del dispositivo | Deseable |
| RF-25 | Atribución de venta al BA que realizó la consulta / recomendación | Obligatorio |

---

## 3.4 Gestión de Citas

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-26 | Creación de citas con consumidores: tipo de evento, fecha, hora, comentarios y BA asignado | Obligatorio |
| RF-27 | Vista de calendario por BA y por tienda (semanal y mensual) | Obligatorio |
| RF-28 | Reporte de agenda con columnas: nombre, apellido, teléfono, fecha, tipo de evento y comentario | Obligatorio |
| RF-29 | Tipos de evento configurables: Servicio de Cabina, Facial, Evento Aniversario, Cabina VIP, Seguimiento de productos, entre otros | Obligatorio |
| RF-30 | Sistema de recordatorios automáticos al BA previo a la cita | Obligatorio |
| RF-31 | Envío de confirmación / recordatorio de cita al consumidor vía SMS o WhatsApp | Deseable |
| RF-32 | Control de citas reagendadas y citas canceladas para métricas de gestión | Obligatorio |
| RF-33 | Posibilidad de programar citas virtuales / videoconsultas con el consumidor | Deseable |

---

## 3.5 Seguimiento y Comunicación con el Consumidor

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-34 | Módulo de seguimiento post-visita: el BA puede registrar acciones realizadas y resultado de la interacción | Obligatorio |
| RF-35 | Comunicación con el consumidor integrada en la plataforma vía WhatsApp Business API (sin usar teléfonos personales del BA) | Deseable |
| RF-36 | Plantillas de mensajes personalizables por marca y tipo de comunicación (seguimiento, cumpleaños, promoción, reposición) | Obligatorio |
| RF-37 | Registro de todas las comunicaciones enviadas al consumidor en su perfil (trazabilidad completa) | Obligatorio |
| RF-38 | Clasificación del tipo de seguimiento: 3 meses, 6 meses, cumpleaños, reposición, evento especial | Obligatorio |
| RF-39 | Atribución de ventas online generadas como resultado de la comunicación de un BA (link tracking) | Deseable |

---

## 3.6 Reportes y Analytics

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-40 | Dashboard ejecutivo de tienda con KPIs: objetivo de venta, avance ($), % avance, total sell-out, total transacciones, registros nuevos, seguimientos | Obligatorio |
| RF-41 | Métricas de citas: objetivo semanal, total citas, nuevas citas, citas reagendadas | Obligatorio |
| RF-42 | Reportes filtrables por rango de fechas, tienda, franquicia / marca, BA | Obligatorio |
| RF-43 | Reporte de clientes (listado exportable) con columnas: nombre, apellido, teléfono, fecha de nacimiento, último BA, cliente desde, fecha último contacto, fecha última transacción, tipo de seguimiento | Obligatorio |
| RF-44 | Visualización gráfica del desempeño: Top Franquicias / Marcas y ventas por Categoría | Obligatorio |
| RF-45 | Reporte de desempeño por BA: transacciones, registros, seguimientos, recomendaciones | Obligatorio |
| RF-46 | Reporte de agenda (Agenda Report) exportable | Obligatorio |
| RF-47 | Indicadores de tasa de conversión: recomendación → compra, seguimiento → revisita | Deseable |
| RF-48 | Dashboard de retención: clientes activos vs. en riesgo de abandono | Deseable |
| RF-49 | Exportación de reportes en formato Excel / CSV | Obligatorio |
| RF-50 | Acceso a reportes en tiempo real desde dispositivos móviles y escritorio | Obligatorio |

---

## 3.7 Gestión de Usuarios y Seguridad de Acceso

Ver `02-stakeholders-y-roles.md` para el detalle de qué hace cada rol.

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-51 | Roles diferenciados con permisos específicos: BA, Gerente de Tienda, Supervisor de Zona, Administrador Central | Obligatorio |
| RF-52 | El BA solo puede ver y gestionar los clientes y datos de su tienda/franquicia asignada | Obligatorio |
| RF-53 | El Gerente tiene acceso a los reportes de todos los BAs de su tienda | Obligatorio |
| RF-54 | El Supervisor de Zona puede visualizar resultados de múltiples tiendas bajo su responsabilidad | Obligatorio |
| RF-55 | El Administrador Central puede gestionar configuraciones, marcas, tiendas y usuarios a nivel nacional | Obligatorio |
| RF-56 | Autenticación segura por usuario (login individual por BA, no compartido) | Obligatorio |

---

## 3.8 Funcionalidades Específicas para Belleza

| # | Requerimiento | Prioridad |
|---|---|---|
| RF-58 | Captura de atributos de piel en el perfil del consumidor: tipo de piel, preocupaciones específicas, tono y subtono | Obligatorio |
| RF-60 | Capacidad de asociar al perfil del consumidor su shade / tono exacto por categoría (fondo de maquillaje, corrector, labiales) | Deseable |
| RF-61 | Registro de historial de muestras entregadas y seguimiento de conversión | Deseable |
| RF-62 | Acceso desde la plataforma a fichas técnicas de producto, tutoriales y argumentarios de venta para apoyo al BA durante la consulta | Deseable |
| RF-63 | Integración con herramientas de Virtual Try-On (prueba virtual de maquillaje en tiempo real) | Deseable |

---

## Resumen cuantitativo

- **Total de RF:** 50 requerimientos funcionales numerados.
- **Obligatorios:** 33.
- **Deseables:** 17.
- **Módulos:** 8.
