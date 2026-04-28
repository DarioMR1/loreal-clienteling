# 02 — Stakeholders y Roles

Este archivo describe los perfiles de usuario del sistema. Los requerimientos funcionales de control de acceso (RF-51 a RF-56) se apoyan en estas definiciones.

## Beauty Advisor (BA)

**Qué hace:**
- Atiende a la clienta en el mostrador.
- Registra consumidores nuevos y consulta perfiles existentes.
- Hace recomendaciones de producto.
- Registra compras y muestras entregadas.
- Agenda citas.
- Da seguimiento post-visita vía WhatsApp / SMS.

**Alcance de datos:**
- Solo puede ver y gestionar **los clientes y datos de su tienda/franquicia asignada** (RF-52).
- Autenticación individual, **no compartida** con otras BAs (RF-56).

**Atribución:**
- Las ventas realizadas tras su consulta/recomendación se le atribuyen (RF-25).

## Gerente de Tienda

**Qué hace:**
- Supervisa la operación de una tienda específica.
- Consulta el desempeño de sus BAs.
- Revisa cumplimiento de objetivos de la tienda.

**Alcance de datos:**
- Acceso a los reportes de **todos los BAs de su tienda** (RF-53).

## Supervisor de Zona

**Qué hace:**
- Supervisa múltiples tiendas bajo su responsabilidad.
- Consolida resultados a nivel zona.

**Alcance de datos:**
- Puede visualizar resultados de **múltiples tiendas** bajo su responsabilidad (RF-54).

## Administrador Central

**Qué hace:**
- Gestión operativa y de configuración a nivel nacional.
- Administra marcas, tiendas y usuarios del sistema.

**Alcance de datos:**
- Puede gestionar **configuraciones, marcas, tiendas y usuarios a nivel nacional** (RF-55).

## Consumidor Final (sujeto de los datos, no usuario del sistema)

No es un usuario de la plataforma, pero es el **sujeto principal** sobre el que se almacenan datos. Tiene derechos derivados de la LFPDPPP:

- Debe haber aceptado explícitamente un aviso de privacidad versionado y fechado (RF-02).
- Puede ejercer **derecho al olvido** (RNF-05).
- Sus **consentimientos de marketing son diferenciados por canal**: SMS, email, WhatsApp (RNF-07).

## Roles no detallados pero mencionados

El RFP indica que podrían existir perfiles adicionales según la operación ("etc."). El diseño debe permitir la creación de roles adicionales sin rediseñar la plataforma (alineado a la escalabilidad exigida en RNF-15).
