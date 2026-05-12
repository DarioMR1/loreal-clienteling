# 07 — Guía de UX/UI para Clienteling de Beauty/Lujo

Documento de referencia para el diseño de todas las interfaces del sistema. Basado en las mejores prácticas de la industria de clienteling (Tulip, BSPK, Endear, Clientbook, XY Retail), los patrones de Apple HIG para iPadOS, las guías de offline UX de Google/Material Design, y los códigos visuales del retail de lujo (Dior, Chanel, Tom Ford, YSL, Sephora).

Este documento define **cómo se ve, cómo se siente y cómo se interactúa** con la plataforma. Es la fuente de verdad para cualquier decisión de diseño en mobile y web.

---

## Principios fundamentales

Cinco principios que gobiernan todas las decisiones de diseño:

1. **Velocidad sobre features.** El diferenciador es qué tan rápido completa una tarea el BA, no cuántos botones tiene la app. Cada interacción se mide en taps y segundos.
2. **El perfil 360° es sagrado.** La pantalla de perfil de la clienta es donde el BA pasa el 70%+ de su tiempo. Todo el diseño orbita alrededor de este centro de gravedad.
3. **Offline invisible.** La sincronización es transparente. Nunca se bloquea contenido por falta de red. El BA no debe pensar en conectividad.
4. **Lujo es restricción.** Menos colores, más whitespace, menos decoración, más precisión tipográfica. La elegancia está en lo que se quita, no en lo que se agrega.
5. **Guiar, no abrumar.** El sistema sugiere el siguiente paso lógico después de cada acción. Reduce la carga cognitiva del BA, especialmente en perfiles con bajo nivel digital.

---

## Arquitectura de información

### App mobile (iPad) — Beauty Advisor

Navegación principal via sidebar persistente:

| Posición | Item | Descripción |
|---|---|---|
| 1 | Home / Dashboard | Resumen del día: citas, alertas, pendientes |
| 2 | Clientas | Client Book: búsqueda + perfiles 360° |
| 3 | Citas | Calendario + creación de citas |
| 4 | Seguimientos | Tareas de follow-up pendientes por tipo |
| 5 | Productos | Catálogo con escaneo SKU |
| 6 | Stats | Métricas personales del BA (opcional) |
| 7 | Configuración | Perfil, tienda, logout |

### Panel web — Gerente / Supervisor / Admin

Navegación principal via sidebar persistente, items condicionados por rol:

| Item | Gerente | Supervisor | Admin |
|---|---|---|---|
| Dashboard ejecutivo | Su tienda | Su zona | Nacional |
| Desempeño por BA | Sus BAs | BAs de zona | Todos |
| Clientes | Listado de su tienda | Agregados de zona | Todo |
| Citas / Agenda | Su tienda | Agregados | Todo |
| Reportes / Exportación | Su tienda | Su zona | Nacional |
| Marcas | — | — | CRUD |
| Tiendas | — | — | CRUD |
| Usuarios | — | — | CRUD |
| Plantillas de mensajes | — | — | CRUD |
| Configuración | — | — | Todo |
| Audit logs | — | — | Lectura |

---

## Layout: three-column split view (iPad)

El estándar de la industria para clienteling en tablet. Apple HIG lo recomienda como `NavigationSplitView` con tres columnas tiled.

```
┌──────────┬────────────────────┬──────────────────────────────────────┐
│ Sidebar  │  Lista / Feed      │  Detalle                             │
│ (~250pt) │  (~320pt)          │  (resto del espacio)                 │
│          │                    │                                      │
│  Home    │  María López  VIP  │  ┌──────────────────────────────┐   │
│  Clientas│  Ana García   NEW  │  │  María López                 │   │
│  Citas   │  Rosa Hdz  AT_RISK │  │  VIP · Lancôme · $45,200 LTV │   │
│  Follow  │  Carmen Ruiz  RET  │  │                              │   │
│  Products│                    │  │  [tabs de contenido]         │   │
│  Stats   │  Buscar...         │  │                              │   │
│  Config  │                    │  │  [contenido del tab activo]  │   │
└──────────┴────────────────────┴──────────────────────────────────────┘
```

### Reglas del layout

- **Sidebar (columna 1, ~250pt):** navegación principal. Items con icono + label. Nunca solo iconos para BAs con bajo nivel digital. Indicador de item activo con barra lateral o fondo sutil.
- **Lista (columna 2, ~320pt):** lista contextual según el item del sidebar. Clientas, citas, tareas, productos. Con campo de búsqueda arriba. Cada item muestra: nombre + badge de segmento + metadata secundaria (última visita, próxima cita).
- **Detalle (columna 3, espacio restante):** contenido completo del item seleccionado. Perfil 360°, detalle de cita, ficha de producto. Es donde ocurre el trabajo real.

### Por qué tres columnas

- El BA nunca pierde contexto: puede ver la lista de clientas mientras consulta un perfil.
- Navegación persistente sin "volver atrás" — el sidebar siempre está visible.
- El 60% de usuarios esperan que las apps se adapten al espacio del iPad (Nielsen Norman Group).
- No estirar un layout de iPhone a 13 pulgadas — desperdicia espacio y se ve amateur.

---

## Perfil 360° de la clienta

La pantalla más importante del sistema. Donde el BA pasa la mayor parte del tiempo.

### Header sticky

El header permanece visible al hacer scroll. Contiene la información más crítica y las acciones más frecuentes.

```
┌─────────────────────────────────────────────────────────────────┐
│  [foto]  María López García                                    │
│          VIP · Lancôme · Clienta desde Mar 2023                │
│          Último contacto: hace 3 días                          │
│          LTV: $45,200 MXN · 12 compras                         │
│                                                                 │
│          [Mensaje]  [Agendar cita]  [Recomendar]  [Editar]     │
└─────────────────────────────────────────────────────────────────┘
```

**Elementos del header:**

- **Foto** de la clienta (opcional, placeholder elegante si no hay).
- **Nombre prominente** — el dato más importante, tamaño H2 o mayor.
- **Badge de segmento**: VIP (dorado), Returning (neutro), New (verde sutil), At Risk (ámbar sutil). No usar rojo agresivo para at_risk — es información, no alarma.
- **Marca y tienda** donde fue registrada.
- **Métricas headline**: LTV (Lifetime Value), total de compras, última interacción.
- **Quick actions**: botones de acción siempre accesibles sin scroll. Son las 3-4 acciones que el BA ejecuta más frecuentemente desde el perfil.

### Tabs horizontales

Debajo del header, tabs para navegar las secciones del perfil. La industria usa tabs, no scroll infinito, porque el BA necesita acceso directo.

| Tab | Contenido | Patrón visual |
|---|---|---|
| **Overview** | Summary cards con KPIs de la clienta + timeline de actividad reciente | Cards en grid + timeline vertical |
| **Beauty** | Tipo de piel, tono, subtono, shades, rutina AM/PM, alergias, ingredientes | Formulario visual con swatches de color |
| **Compras** | Historial visual con imágenes de productos (patrón "Closet" de Tulip) | Grid de cards con imagen + precio + fecha |
| **Recomendaciones** | Qué se recomendó, si convirtió, razonamiento IA | Lista con indicador de conversión |
| **Citas** | Pasadas y futuras | Mini calendario inline + lista |
| **Comunicaciones** | Timeline unificada de todos los canales | Chat-style timeline |
| **Notas** | Notas libres del BA con timestamps | Texto libre, auto-guardado |

### El "Closet" — historial visual de compras

Patrón establecido por Tulip. En lugar de una tabla plana de transacciones, se muestra una cuadrícula visual tipo mood board:

```
┌────────────────────────────────────────────────────┐
│  COMPRAS · 12 transacciones · $45,200 MXN          │
│                                                    │
│  Categorías: [Skincare 60%] [Makeup 30%] [Frag 10%]│
│  Gasto promedio: $3,767 MXN / visita               │
│                                                    │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ img  │  │ img  │  │ img  │  │ img  │          │
│  │      │  │      │  │      │  │      │          │
│  │Génifi│  │Advanc│  │Teint │  │La Vie│          │
│  │$2,890│  │$3,450│  │$1,250│  │$4,200│          │
│  │Mar 26│  │Feb 26│  │Ene 26│  │Dic 25│          │
│  └──────┘  └──────┘  └──────┘  └──────┘          │
└────────────────────────────────────────────────────┘
```

De un vistazo, la BA ve: "esta clienta es de skincare, tono medio cálido, gasta fuerte en anti-edad". Esto es infinitamente más útil que una tabla con columnas de SKU y fechas.

### Perfil de belleza — swatches visuales

Sephora con Color IQ estableció el estándar: los shades no son campos de texto, son **swatches de color visual** asociados al producto exacto.

```
┌─────────────────────────────────────────┐
│  TIPO DE PIEL      TONO         SUBTONO │
│  [Mixta]           [Medium]     [Warm]  │
│                                         │
│  PREOCUPACIONES                         │
│  [Aging] [Pigmentación] [Poros]         │
│                                         │
│  INGREDIENTES EVITADOS                  │
│  [Retinol] [Fragancias sintéticas]      │
│                                         │
│  SHADES                                 │
│  Base:      ████ Lancôme Teint Idole    │
│             320N Bisque                  │
│  Corrector: ████ YSL Touche Éclat       │
│             3 Light Peach               │
│  Labial:    ████ Lancôme L'Absolu       │
│             274 French Tea              │
│                                         │
│  RUTINA                                 │
│  AM: Limpiador > Sérum Vitamina C > SPF │
│  PM: Doble limpieza > Retinol > Crema   │
└─────────────────────────────────────────┘
```

Los swatches de color reales junto a los nombres de shade son un diferenciador enorme en beauty. No es "shade 320N" — es un cuadro del color real + el nombre del producto + la marca.

---

## Velocidad y flujos de alta rotación

### Regla de los 3 taps

Toda tarea repetitiva del BA debe completarse en 3 taps o menos. Benchmarks de la industria (BSPK, Tulip):

| Tarea | Máximo aceptable | Cómo lograrlo |
|---|---|---|
| Buscar clienta | < 3 segundos | Search-first con auto-suggest conforme escribe |
| Registrar clienta nueva | < 60 segundos | Formulario mínimo obligatorio: nombre + teléfono + consentimiento de privacidad. El resto se llena después |
| Registrar recomendación | < 30 segundos | Escaneo SKU con cámara > confirmar > listo |
| Agendar cita | 3 taps | Desde perfil: tap icono calendario > seleccionar tipo + hora > confirmar |
| Enviar seguimiento | 3 taps | Tap icono mensaje > template pre-llenado > enviar |
| Agregar nota | 2 taps | Tap "+" > escribir > auto-guarda |
| Registrar compra | < 30 segundos | Escaneo SKU > confirmar clienta > listo |
| Ver perfil desde búsqueda | 1 tap | Tap en resultado de búsqueda > perfil en columna 3 |

### Post-action prompts

Después de cada acción completada, el sistema sugiere proactivamente el siguiente paso lógico. Este patrón (Tulip, Clientbook) reduce la carga cognitiva y entrena al BA a seguir el flujo completo de clienteling.

```
┌──────────────────────────────────────┐
│  Compra registrada                   │
│                                      │
│  ¿Qué sigue?                        │
│  [Agendar seguimiento]              │
│  [Enviar agradecimiento]            │
│  [Agregar nota]                     │
│  [Cerrar]                           │
└──────────────────────────────────────┘
```

Ejemplos de prompts por acción:

| Acción completada | Sugerencias |
|---|---|
| Clienta registrada | Capturar perfil de belleza, Agendar cita |
| Compra registrada | Agendar seguimiento, Enviar agradecimiento |
| Recomendación hecha | Generar lookbook, Agregar a wishlist |
| Cita completada | Registrar compra, Enviar seguimiento |
| Seguimiento enviado | Agendar próximo contacto |

### Creación de clienta: tres opciones

Patrón establecido por Tulip que responde a la realidad del piso de venta:

1. **BA ingresa datos** — formulario rápido en el iPad. El caso más común.
2. **Clienta ingresa sus datos** — el BA le pasa el iPad con un formulario simplificado y más grande. Útil para clientas que prefieren escribir su propio nombre/email.
3. **Enviar link a la clienta** — se envía un link por WhatsApp/SMS, la clienta llena el formulario en su celular. Útil cuando hay fila o la clienta tiene prisa.

### Search-first navigation

La búsqueda global es el punto de entrada #1 del BA. Un solo campo que busca en clientas, productos y citas. Auto-suggest conforme se escribe, resultados agrupados por tipo.

```
┌──────────────────────────────────────┐
│  Buscar clientas, productos, citas...│
│                                      │
│  CLIENTAS                            │
│  María López García · VIP · Lancôme  │
│  María Fernández · New · Kiehl's     │
│                                      │
│  PRODUCTOS                           │
│  Génifique Sérum · Lancôme · $2,890  │
│                                      │
│  CITAS                               │
│  María López · Facial · Mañana 3pm  │
└──────────────────────────────────────┘
```

---

## Offline-first UX

### Indicador de estado de conexión

Nunca usar banners agresivos. La industria (Google Design, Material Design) recomienda indicadores sutiles y no intrusivos:

**En el header de la app:**

| Estado | Indicador visual |
|---|---|
| Online | Punto verde discreto + "Online" (o sin texto si el espacio es limitado) |
| Offline | Punto gris + icono cloud-off + "Sin conexión · 3 pendientes" |
| Sincronizando | Icono animado brevemente + "Sincronizando..." |
| Error de sync | Punto ámbar + "1 cambio requiere atención" |

### Reglas de offline UX

1. **Optimistic UI siempre**: el cambio se refleja al instante en la pantalla, sin esperar al servidor. La clienta creada aparece inmediatamente en la lista.
2. **Badge numérico** en el icono de sync: "3 cambios pendientes". No interrumpir el flujo.
3. **Snackbar temporal** (3-4 segundos, no permanente) al cambiar de estado: "De vuelta online — sincronizando 5 cambios".
4. **Timestamp de última sync** en un lugar discreto: "Última sincronización: hace 2 min". No prominente, pero accesible.
5. **Nunca bloquear contenido**: mostrar datos cacheados. Si llevan mucho offline, marcar sutilmente "puede no estar actualizado".
6. **Funciones que requieren red** (IA, WhatsApp, virtual try-on): botón deshabilitado con texto "Disponible con conexión". No ocultar el botón — el BA debe saber que la función existe.
7. **Outbox pattern**: pantalla accesible (desde settings o icono de sync) donde el BA puede ver los cambios pendientes con descripción legible:

```
┌──────────────────────────────────────┐
│  Cambios pendientes (3)              │
│                                      │
│  Clienta María López creada          │
│  Queued · hace 5 min                 │
│                                      │
│  Cita agendada para Mar 15, 3pm     │
│  Queued · hace 3 min                 │
│                                      │
│  Nota agregada a Ana García          │
│  Queued · hace 1 min                 │
└──────────────────────────────────────┘
```

### Indicadores por registro

Para items que el BA acaba de crear/editar offline, mostrar un icono sutil junto al registro:

- Icono de nube con flecha arriba: "pendiente de enviar"
- Icono de check: "sincronizado"
- Icono de advertencia (ámbar): "requiere atención"

Estos indicadores desaparecen automáticamente cuando el cambio se sincroniza exitosamente.

---

## Dashboards gerenciales (panel web)

### Layout para managers y supervisores

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard · Liverpool Polanco · Mayo 2026    [Este mes v]     │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────┤
│  Ventas  │ % Avance │  Trans.  │ Registros│ Seguim.  │  Citas  │
│ $284,500 │   73%    │   142    │    28    │    89    │   34    │
│  +12%    │ -------  │  +8%     │  -3%     │  +15%    │  =0%    │
│ vs mes   │ obj $390K│ vs mes   │ vs mes   │ vs mes   │ vs mes  │
│ anterior │          │ anterior │ anterior │ anterior │ anterior│
├──────────┴──────────┴─────────┴──────────┴──────────┴─────────┤
│                                                                │
│  [Tendencia de ventas - gráfico de línea]                     │
│                                 [Ventas por categoría - barras]│
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Desempeño por BA                                    [Export]  │
│  ┌──────────┬────────┬───────┬────────┬────────┬──────────┐   │
│  │ BA       │ Ventas │ Trans │ Regist │ Seguim │ Conversión│  │
│  │ V. Rojas │$52,300 │  28   │   8    │   22   │   34%    │   │
│  │ L. Méndez│$48,100 │  25   │   6    │   18   │   28%    │   │
│  │ ...      │        │       │        │        │          │   │
│  └──────────┴────────┴───────┴────────┴────────┴──────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Mejores prácticas de dashboards

- **Top row: 4-6 KPI cards** con número grande, flecha de tendencia (arriba/abajo/igual), comparación vs objetivo y vs período anterior. Nunca más de 6 en la primera vista — más es ruido.
- **Middle row: 2 gráficos** lado a lado. Uno de tendencia temporal (línea) y uno de composición (barras por categoría, dona por segmento). Recharts para la implementación.
- **Bottom: tabla de performance** sorteable por cualquier columna, con sparklines de tendencia si aplica. Drill-down: click en un BA revela su actividad detallada.
- **Date range picker prominente**: Hoy, Esta Semana, Este Mes, Personalizado. Siempre visible, no escondido en filtros.
- **Drill-down en todo**: cualquier métrica al hacer click revela el desglose (por producto, por BA, por día, por categoría).
- **Exportación accesible**: botón "Exportar" visible en cada tabla y reporte. Formatos: Excel y CSV.
- **Role-specific views**: el gerente ve su tienda, el supervisor ve su zona con comparativo entre tiendas, el admin ve todo con filtros nacionales.

### KPIs por rol

**Gerente de tienda:**
- Ventas totales vs objetivo
- Transacciones
- Registros nuevos de clientas
- Seguimientos realizados vs pendientes
- Citas agendadas / completadas / no-show
- Tasa de conversión (recomendación a compra)
- Retención (clientas activas vs en riesgo)

**Supervisor de zona:**
- Todo lo anterior agregado por zona
- Comparativo entre tiendas (ranking)
- Top marcas y categorías por tienda
- Tendencias temporales

**Admin:**
- Todo lo anterior a nivel nacional
- Gestión de usuarios, marcas, tiendas
- Audit logs
- Estado de sincronización de dispositivos

---

## Sistema visual

### Paleta de colores

La industria de lujo converge en restricción cromática. Dior opera con esencialmente dos colores. Si la paleta tiene más de 4-5 colores activos, se diluye la señal de lujo.

#### Tokens de color

**Core:**

| Token | Valor hex | Uso |
|---|---|---|
| `color.primary` | `#0A0A0A` | Texto principal, headers, sidebar activo |
| `color.surface.base` | `#FFFFFF` | Fondo principal |
| `color.surface.subtle` | `#FAFAFA` | Fondo de cards, alternancia de filas en tablas |
| `color.surface.warm` | `#F5F0EB` | Fondo de secciones de belleza, acentos cálidos |
| `color.border` | `#E5E5E5` | Bordes de cards, separadores, divisores |

**Texto:**

| Token | Valor hex | Uso |
|---|---|---|
| `color.text.primary` | `#1A1A1A` | Texto body, labels |
| `color.text.secondary` | `#6B6B6B` | Captions, metadata, timestamps |
| `color.text.tertiary` | `#9B9B9B` | Placeholders, texto deshabilitado |
| `color.text.inverse` | `#FFFFFF` | Texto sobre fondos oscuros |

**Acento:**

| Token | Valor hex | Uso |
|---|---|---|
| `color.accent.gold` | `#C9A96E` | Badge VIP, indicadores premium. Usar con extrema moderación |

**Semánticos:**

| Token | Valor hex | Uso |
|---|---|---|
| `color.success` | `#4A7C59` | Confirmaciones, conversiones, "sincronizado" |
| `color.warning` | `#D4A017` | Alertas, segmento "at_risk", "requiere atención" |
| `color.error` | `#C44536` | Errores de validación. Contenido, nunca agresivo |
| `color.info` | `#5B7FA5` | Links, acciones secundarias, badges informativos |

**Segmentos de clienta:**

| Segmento | Color | Estilo |
|---|---|---|
| VIP | `#C9A96E` (gold) | Badge sólido |
| Returning | `#6B6B6B` (neutral) | Badge outline |
| New | `#4A7C59` (green) | Badge sutil |
| At Risk | `#D4A017` (amber) | Badge sutil |

#### Regla de oro

Negro + blanco hacen el 90% del trabajo. El gold aparece solo para VIP. Los colores semánticos aparecen solo cuando hay algo que comunicar (éxito, error, alerta). Todo lo demás es neutro.

### Tipografía

#### Escala tipográfica

Ratio 1.2 (Minor Third). Cada tamaño se multiplica/divide por 1.2 desde la base, redondeado a múltiplos de 4px.

| Nivel | Tamaño | Peso | Line height | Uso |
|---|---|---|---|---|
| Display | 40px | Light (300) | 48px | Números de KPI en dashboards |
| H1 | 32px | Regular (400) | 40px | Títulos de página |
| H2 | 24px | Semibold (600) | 32px | Títulos de sección, nombre de clienta en header |
| H3 | 20px | Semibold (600) | 28px | Headers de cards, tabs |
| Body | 16px | Regular (400) | 24px | Texto general, contenido de formularios |
| Caption | 14px | Medium (500) | 20px | Labels de formularios, metadata |
| Small | 12px | Medium (500) | 16px | Timestamps, badges, indicadores de sync |

#### Pairing recomendado

- **Opción A (serif + sans):** Playfair Display para headings + Inter para body. Comunica herencia + modernidad.
- **Opción B (sans premium):** SF Pro en iPad (nativo iOS), Inter en web. Comunica limpieza + contemporaneidad.
- **Opción C (serif + sans alternativa):** Cormorant Garamond para headings + Work Sans para body. Más editorial.

El heading serif funciona bien para el branding general, pero en la app operativa del BA, la legibilidad del sans-serif es prioritaria. Considerar serif solo para el panel web gerencial o para elementos de marca.

### Espaciado

Base unit: 4px. Toda medida de espaciado es múltiplo de 4.

| Token | Valor | Uso |
|---|---|---|
| `spacing.2xs` | 4px | Espacio entre icono y label, padding interno mínimo |
| `spacing.xs` | 8px | Espacio entre elementos compactos, gap en badges |
| `spacing.sm` | 12px | Padding interno de botones pequeños |
| `spacing.md` | 16px | Padding estándar de cards, gap entre campos de form |
| `spacing.lg` | 24px | Separación entre secciones, padding de contenedores |
| `spacing.xl` | 32px | Margen entre bloques principales |
| `spacing.2xl` | 48px | Separación entre secciones mayores de página |
| `spacing.3xl` | 64px | Margen superior/inferior de página |

### Border radius

Mínimo para lujo. Esquinas muy redondeadas se leen como "playful", no como premium.

| Token | Valor | Uso |
|---|---|---|
| `radius.none` | 0px | Imágenes de producto, elementos de marca |
| `radius.sm` | 4px | Botones, inputs, badges |
| `radius.md` | 8px | Cards, contenedores |
| `radius.lg` | 12px | Modales, sheets |
| `radius.full` | 9999px | Avatares circulares, pills |

Dior, Chanel y Tom Ford operan en 0-4px. Evitar border-radius mayores a 12px excepto para avatares.

### Sombras

Lujo prefiere separación por whitespace o bordes sutiles, no drop shadows.

| Token | Valor | Uso |
|---|---|---|
| `shadow.none` | none | Default para la mayoría de elementos |
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards elevadas al hover |
| `shadow.md` | `0 2px 8px rgba(0,0,0,0.08)` | Modales, popovers |

Preferir `border: 1px solid #E5E5E5` sobre sombras para separación visual. El whitespace generoso es la herramienta principal de separación.

### Touch targets

| Plataforma | Mínimo | Recomendado |
|---|---|---|
| iPad (BA en piso de venta) | 44 x 44pt (Apple HIG) | 48 x 48pt |
| Web (mouse) | 32 x 32px | 40 x 40px |

Todos los CTAs primarios del mobile deben estar en la **zona inferior 2/3 de la pantalla** (thumb zone para uso con una mano).

---

## Patrones de interacción

### Swipe actions (iPad, patrón nativo iOS)

Para acciones rápidas sin navegar fuera de la lista:

| Dirección | Acciones reveladas |
|---|---|
| Swipe izquierda | Enviar mensaje, Agendar cita |
| Swipe derecha | Marcar como favorita, Completar tarea |

### Long-press

Menú contextual con todas las acciones disponibles para el item. Útil como alternativa a los swipes para usuarios que no conocen los gestos.

### Pull-to-refresh

Trigger manual de sincronización. Disponible en listas principales (clientas, citas, seguimientos).

### Template messages con merge fields

Mensajes de seguimiento pre-escritos con campos que se resuelven automáticamente:

```
Hola {{customer.first_name}}, fue un gusto atenderte hoy
en {{store.name}}. Tu nuevo {{product.name}} te va a encantar.
¡Nos vemos pronto! — {{ba.first_name}}
```

El BA solo selecciona template y toca "Enviar". Personalización sin esfuerzo.

### Lookbook / Ideabook (patrón BSPK)

El BA arma una selección curada de productos recomendados. Se genera un URL privado con branding de la marca. La clienta recibe el link por WhatsApp, puede ver los productos, dar feedback y agendar cita desde ahí.

---

## Pantallas por rol

### Beauty Advisor (iPad)

| Pantalla | Función principal | RF que cubre |
|---|---|---|
| Dashboard / Home | Resumen del día: citas próximas, alertas activas, pendientes | RF-09, RF-30 |
| Búsqueda de clienta | Search-first por nombre, email, teléfono | RF-03 |
| Registro de clienta | Formulario mínimo + consentimiento de privacidad | RF-01, RF-02 |
| Perfil 360° | Vista unificada con tabs (overview, beauty, compras, recomendaciones, citas, comunicaciones, notas) | RF-04, RF-05, RF-19, RF-21 |
| Perfil de belleza | Tipo de piel, tono, subtono, shades con swatches, rutina, preocupaciones | RF-05, RF-07, RF-58, RF-60 |
| Escaneo de SKU | Cámara para código de barras/QR + ficha de producto | RF-14, RF-24 |
| Motor de recomendación IA | Describir contexto > recibir sugerencia de Claude con razonamiento | RF-15 |
| Lookbook | Selección curada compartible | RF-18 |
| Calendario de citas | Vista semanal/mensual con citas del BA | RF-27 |
| Crear cita | Tipo + clienta + fecha/hora + comentarios | RF-26, RF-29 |
| Lista de seguimientos | Pendientes por tipo (3m, 6m, cumple, reposición) | RF-34, RF-38 |
| Enviar seguimiento | Selector de canal + template + enviar | RF-35, RF-36, RF-37 |
| Registrar compra | Escaneo SKU o selección manual + atribución | RF-20, RF-23, RF-25 |
| Registrar muestra | Producto entregado como muestra | RF-08, RF-61 |

### Gerente de Tienda (Web)

| Pantalla | Función principal | RF que cubre |
|---|---|---|
| Dashboard ejecutivo | KPIs de tienda: ventas, avance, transacciones, registros, seguimientos | RF-40 |
| Métricas de citas | Objetivo semanal, total, nuevas, reagendadas | RF-41 |
| Desempeño por BA | Tabla con métricas por BA: transacciones, registros, seguimientos, conversión | RF-45 |
| Listado de clientes | Tabla exportable con filtros por segmento, fecha, BA | RF-43 |
| Reporte de agenda | Exportable con nombre, teléfono, fecha, evento, comentario | RF-46 |
| Reportes con filtros | Filtros por fecha, tienda, marca, BA | RF-42 |
| Exportación | Excel/CSV desde cualquier tabla | RF-49 |

### Supervisor de Zona (Web)

| Pantalla | Función principal | RF que cubre |
|---|---|---|
| Overview de zona | KPIs consolidados de todas las tiendas de su zona | RF-54 |
| Comparativo de tiendas | Ranking por ventas, registros, conversión, seguimientos | RF-54 |
| Tendencias | Gráficos: top marcas, ventas por categoría, evolución temporal | RF-44 |

### Administrador Central (Web)

| Pantalla | Función principal | RF/RNF que cubre |
|---|---|---|
| Gestión de marcas | CRUD + configuración por marca (colores, logo, reglas) | RNF-13, RNF-16 |
| Gestión de tiendas | CRUD + asignación a zonas | RNF-14, RNF-16 |
| Gestión de usuarios | CRUD + asignación de rol, tienda, zona, marca + invitación | RF-51 a RF-55 |
| Plantillas de mensajes | CRUD de templates por marca y tipo | RF-36 |
| Configuración | Tipos de evento, umbrales, reglas de reposición | RNF-16 |
| Audit logs | Tabla append-only con filtros | RNF-04 |
| Derecho al olvido | Flujo de eliminación ARCO con constancia PDF | RNF-05 |
| Detección de duplicados | Clientas con mismo email/teléfono en distintas tiendas | — |
| Estado de sync | Conexión de cada iPad, última sync, cola de operaciones | — |

---

## Componentes UI clave

### KPI Card (dashboard)

```
┌──────────────────────┐
│  Ventas              │  ← label (Caption, text.secondary)
│  $284,500            │  ← valor (Display, text.primary)
│  +12% vs mes ant.    │  ← comparación (Small, color.success si positivo)
│  Obj: $390,000       │  ← objetivo (Small, text.tertiary)
└──────────────────────┘
```

- Fondo: `surface.subtle`
- Border: `1px solid border`
- Radius: `radius.md`
- Padding: `spacing.lg`

### Badge de segmento

```
[VIP]       → fondo gold/10%, texto gold, border gold
[Returning] → fondo transparent, texto text.secondary, border border
[New]       → fondo success/10%, texto success, border success
[At Risk]   → fondo warning/10%, texto warning, border warning
```

- Radius: `radius.sm`
- Padding: `spacing.2xs` horizontal, `spacing.xs` vertical
- Font: Small, weight Medium

### Quick Action Button (header del perfil)

```
[icono] Label
```

- Estilo: ghost/outline (no filled) para acciones secundarias
- Estilo: filled (primary) para la acción principal
- Tamaño mínimo: 44x44pt en mobile
- Padding: `spacing.sm` `spacing.md`

### Timeline de actividad

```
│  Hoy
│  ● Seguimiento WhatsApp enviado — "Hola María..."
│  
│  Hace 3 días
│  ● Compra registrada — Génifique Sérum · $2,890
│  ● Recomendación IA — "Basado en su tipo de piel..."
│  
│  Hace 1 semana
│  ● Cita completada — Facial · 45 min
```

- Línea vertical continua (`border` color)
- Puntos en cada evento (`8px` círculo)
- Agrupación por fecha relativa
- Cada item es tappable para ver detalle

---

## Anti-patrones: qué NO hacer

| Anti-patrón | Por qué es malo | Qué hacer en cambio |
|---|---|---|
| Tablas planas de datos para el historial de compras | No comunica visualmente las preferencias de la clienta | Usar grid visual tipo "Closet" con imágenes de producto |
| Banner rojo permanente "SIN CONEXIÓN" | Genera ansiedad, distrae del trabajo | Indicador sutil en header, snackbar temporal |
| Formularios de registro con 15+ campos obligatorios | El BA tiene 2 minutos por clienta, no 10 | Solo nombre + teléfono + consentimiento obligatorio. El resto se llena después |
| Navegación tipo hamburger menu en iPad | Desperdicia el 80% de la pantalla | Three-column split view |
| Colores brillantes y saturados | Rompe el código visual de lujo | Paleta restringida: near-black + white + gold puntual |
| Border-radius > 16px en botones/cards | Se lee como playful/consumer, no como premium | 4-8px máximo |
| Drop shadows prominentes | Estética de 2018, no de lujo | Separar con whitespace y bordes sutiles |
| Scroll infinito en el perfil | El BA no puede encontrar la sección que busca | Tabs horizontales con acceso directo |
| Iconos sin label de texto | BAs con bajo nivel digital no reconocen iconos | Siempre icono + texto |
| Confirmaciones/modales para cada acción | Lentifican cada tarea | Optimistic UI + undo si se necesita |
| Ocultar funciones offline | El BA cree que la app está rota | Mostrar botón deshabilitado con explicación |

---

## Referencias

### Apps de clienteling analizadas

- **Tulip** (tulip.com) — líder en clienteling para retail, fusionado con Salesfloor en 2026. Referencia principal para patrón "Closet", profile layout y follow-up management.
- **BSPK** (bspk.com) — #1 en rankings 2026. Referencia para Ideabook, unified client profiles y framework Capture-Unify-Activate.
- **Endear** (endearhq.com) — referencia para segmentación dinámica y trackable messaging.
- **Clientbook** (clientbook.com) — referencia para AI-powered suggestions y at-risk detection.
- **XY Retail** (xyretail.com) — usado por Giorgio Armani, Golden Goose. Referencia para unified commerce + clienteling.
- **Proximity Insight** — referencia para retail super-app (clienteling + POS + tasks).
- **Hero by Klarna** (usehero.com) — referencia para virtual clienteling y sales attribution.

### Guías de diseño

- **Apple HIG** — Split Views, Designing for iPadOS, WWDC25 "Elevate iPad App Design".
- **Google Design** — Offline UX guidelines.
- **Material Design** — Offline states, communication patterns.
- **Nielsen Norman Group** — Tablet app design, responsive design expectations.

### Estándares de beauty tech

- **Sephora Color IQ** — estándar para shade matching y perfil de belleza digital.
- **L'Oréal ModiFace** — referencia para virtual try-on integration.
- **Estée Lauder AR** — referencia para AR try-on con condiciones de iluminación.

### Trazabilidad con el RFP

Este documento soporta directamente los siguientes requerimientos:

- **RNF-02** (tiempo de respuesta ≤ 2s) — los patrones de velocidad y offline-first garantizan percepción de rapidez.
- **RNF-08** (compatibilidad iPad iOS 15+) — el layout three-column sigue Apple HIG para iPadOS.
- **RI-03** (materiales adaptados a distintos niveles digitales) — iconos con labels, post-action prompts y search-first reducen la curva de aprendizaje.
- **Factor crítico de éxito** declarado en el RFP: "El BA es el corazón de la experiencia — la usabilidad de la plataforma en el contexto de alta rotación y bajo tiempo de consulta es un factor crítico de éxito."
