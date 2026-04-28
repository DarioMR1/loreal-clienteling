# RFP Clienteling — L'Oréal México

Documentación estructurada del RFP para la nueva plataforma de Clienteling de L'Oréal México, en reemplazo del sistema actual Beauty Connect.

## De qué trata el proyecto

L'Oréal México busca un proveedor que implemente una plataforma de clienteling para sus Beauty Advisors (BAs) en tiendas departamentales (Liverpool, El Palacio de Hierro). La plataforma debe correr principalmente en iPad, operar online/offline, soportar múltiples marcas y tiendas, y cumplir con la ley mexicana de datos personales (LFPDPPP). Reemplaza al sistema actual Beauty Connect México.

## Cómo navegar esta documentación

| Si buscas... | Abre |
|---|---|
| Contexto de negocio y por qué existe el proyecto | `00-contexto.md` |
| Qué cubre el proyecto (canales, dispositivos, geografía) | `01-alcance.md` |
| Quién usa el sistema y con qué permisos | `02-stakeholders-y-roles.md` |
| Los 50 requerimientos funcionales (RF-01 a RF-63) | `03-requerimientos-funcionales.md` |
| Los 16 requerimientos no funcionales (RNF-01 a RNF-16) | `04-requerimientos-no-funcionales.md` |
| Los 10 requerimientos de implementación y soporte (RI-01 a RI-10) | `05-requerimientos-implementacion.md` |
| Qué secciones debe tener la propuesta a entregar | `06-estructura-propuesta.md` |
| Criterios con los que nos van a evaluar y sus pesos | `07-criterios-evaluacion.md` |
| Reglas del proceso: NDA, idioma, confidencialidad | `08-condiciones-y-restricciones.md` |
| Lectura estratégica: qué valoran de verdad | `09-factores-criticos-exito.md` |

## Glosario

- **BA (Beauty Advisor):** asesora de belleza en mostrador de tienda departamental. Es el usuario principal del sistema.
- **Beauty Connect:** sistema actual de clienteling de L'Oréal México que será reemplazado.
- **Clienteling:** disciplina de retail enfocada en construir relaciones personalizadas de largo plazo con la clienta, usando su historial y preferencias.
- **LFPDPPP:** Ley Federal de Protección de Datos Personales en Posesión de Particulares (México).
- **POS (Point of Sale):** sistema de punto de venta de la tienda.
- **SKU:** código único de producto.
- **SLA:** Service Level Agreement — nivel de servicio comprometido.
- **Virtual Try-On:** prueba virtual de maquillaje en tiempo real mediante cámara.
- **WhatsApp Business API:** API oficial de Meta para comunicación empresarial vía WhatsApp.

## Convenciones

- Los requerimientos usan IDs estables: **RF-XX** (funcionales), **RNF-XX** (no funcionales), **RI-XX** (implementación). Cita los IDs directamente al razonar sobre cumplimiento.
- Cada requerimiento tiene prioridad **Obligatorio** o **Deseable**. Los obligatorios no se pueden omitir de la propuesta.
