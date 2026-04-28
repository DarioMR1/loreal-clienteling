# 01 — Alcance del Proyecto

La plataforma debe dar soporte a las siguientes dimensiones de operación.

## Geografía

- **Territorio:** nacional mexicano.
- **Volumen:** múltiples puntos de venta a lo largo del país.

## Canales físicos

- **Cadenas departamentales:** Liverpool, El Palacio de Hierro.
- **Canales propios** de L'Oréal México.

## Perfiles de usuario a soportar

El sistema debe distinguir y dar funcionalidad diferenciada a:

- **BA (Beauty Advisor)** — asesora de mostrador.
- **Gerente de Tienda** — responsable de una tienda específica.
- **Supervisor de Zona** — responsable de varias tiendas.
- **Administrador Central** — gestión nacional de la plataforma.
- Otros perfiles adicionales según configuración.

El detalle de qué hace cada rol y qué permisos tiene se documenta en `02-stakeholders-y-roles.md`.

## Marcas

La plataforma debe ser **multi-marca**: operar simultáneamente distintas marcas del portafolio L'Oréal, cada una con su propia interfaz y configuración independiente.

## Dispositivos

- **Dispositivo principal:** iPad (tablet).
- **Compatibilidad extendida:** el RFP abre la puerta a otros dispositivos como opción.

El detalle de versiones de sistema operativo exigidas se documenta en `04-requerimientos-no-funcionales.md` (sección de compatibilidad).

## Modo de operación

- **Híbrido online/offline:** el sistema debe funcionar con y sin conexión a internet. Esto responde a la realidad de conectividad en piso de venta de tiendas departamentales, donde la señal puede ser inestable.

## Qué NO está explícitamente en el alcance

El RFP no menciona (por lo tanto, cualquiera de estos elementos requiere aclaración con el cliente antes de asumirlo):

- Integración con canales de redes sociales más allá de WhatsApp.
- Gestión de inventario o logística de tienda.
- Punto de venta (POS) como tal — la plataforma se **integra** con POS, no lo sustituye.
- Operación fuera de México.
