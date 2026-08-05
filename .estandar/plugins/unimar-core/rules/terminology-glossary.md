# Glosario de Terminología

Terminología controlada para el corpus Unimar Arch, en español. Al añadir un nuevo término, mantenerlo en español, salvo las excepciones explícitas (acrónimos, identificadores de código, marcas).

## Términos Técnicos

| Término | Definición | Notas |
|---|---|---|
| Agregado | Grupo de entidades y objetos de valor tratado como una unidad de consistencia transaccional, con una raíz que gobierna el acceso al conjunto (DDD). Es la frontera de **una transacción por agregado**. | Más estrecho que el contexto delimitado —un contexto agrupa varios agregados— y que el servicio —un servicio despliega uno o más contextos—. Sujeto de ADR-0098 |
| Architecture Decision Record (ADR) | Registro formal de una decisión arquitectónica | Acrónimo conservado verbatim |
| Bounded Context | Unidad de modelo con límites explícitos (DDD) | Término DDD; no traducir individualmente |
| Patrón Canónico | Patrón de implementación reutilizable mapeado a un ADR aceptado | |
| Shell Transversal | Encapsulación de lógica de infraestructura que no contamina Bounded Contexts | |
| Domain-Driven Design (DDD) | Enfoque de diseño orientado al dominio | Acrónimo conservado verbatim |
| Estándar de Ingeniería | Conjunto de normas técnicas y de proceso | |
| Operación de Herencia (Adopt / Extend / Override / N/A) | Etiqueta de registro para triage local de patrones | Verbos conservados en inglés por consistencia |
| Quality Gate | Criterio objetivo de paso para una fase o release | Conservado verbatim |
| Perfil de Runtime | Conjunto de decisiones técnicas específicas para un runtime declarado | |
| SDLC | Software Development Life Cycle | Acrónimo conservado verbatim |
| Gate de Validación | Punto de control automatizado en CI o pre-commit | |

## Términos de Producto

| Término | Definición |
|---|---|
| Unimar Arch | El repositorio de arquitectura de producto de Unimar, propiedad y mantenido por Unimar |
| Repositorio Satélite | Repositorio que deriva de `unimar_arch` como base autoritativa de plantillas, ADRs y estándares (ej: `unimar-sil`, `unimar-ops`) |
| Herencia (Adopt/Extend/Override) | Operaciones de triage local para patrones de `unimar_arch`: Adopt = tomar tal cual, Extend = añadir sin contradecir, Override = reemplazar con justificación ADR local |
| Base Autoritativa | `unimar_arch` como fuente única de verdad para plantillas y estándares corporativos |

## Términos de Gobernanza

| Término | Definición |
|---|---|
| Operation `Adopt` | Tomar regla/plantilla de `unimar_arch` sin modificaciones |
| Operation `Extend` | Tomar regla/plantilla y añadir extensiones locales que no contradigan el original |
| Operation `Override` | Reemplazar regla/plantilla localmente solo cuando está explícitamente permitido y con ADR local que lo justifique |
| Operation `N/A` | La regla no aplica al satélite por contexto específico |

## Excepciones Explícitas

Los siguientes elementos **no** requieren traducción al español:

- **Acrónimos técnicos:** ADR, API, BMAD, CI, CLI, DDD, IaC, Mermaid, N/A, REST, RLS, SDK, SDLC, SRE, UC, UUID, WAF, XML, YAML, JSON.
- **Identificadores de código:** nombres de archivos, variables, funciones, clases, comandos CLI, endpoints, headers HTTP.
- **Marcas y nombres propios de terceros:** Unimar, Node.js, NestJS, GitHub, BMAD Method.
- **Citas bibliográficas:** títulos de libros, papers, RFCs.
- **URLs y rutas técnicas.**
