# AGENTS.md — Unimar Arch

> **Estado:** Aceptado | **Alcance:** Todos los agentes de IA y contribuidores humanos que trabajen en este repositorio

## Proyecto

`unimar_arch` es el **repositorio de arquitectura de producto de Unimar** (<https://www.unimar.com.pe/>), propiedad y mantenido por Unimar.

Este repositorio es **orientado a documentación** y **gestionado por agentes** por defecto. La instalación completa de BMAD Method v6.8.0 provee agentes especializados y workflows para planificación, arquitectura, desarrollo y redacción técnica. Ver `_bmad/` para el framework y `.opencode/commands/` para la integración con opencode.

## Idioma de la Documentación

**Toda la documentación de este repositorio se mantiene exclusivamente en español.** No se generan pares bilingües. Los nombres de archivos, títulos, encabezados, diagramas y código embebido deben estar en español. Las excepciones explícitas (acrónimos, identificadores de código, nombres propios de proyectos externos, marcas, referencias bibliográficas) son las únicas admisibles.

## Build & Run

- Revisión de documentación: empezar en [`README.md`](./README.md) → [`reference/README.md`](./reference/README.md) → [`MASTER_INDEX.md`](./MASTER_INDEX.md).
- Workflows de BMAD: ver `.opencode/commands/` (59 skills) o invocar `/bmad-help` desde el runner de agentes.
- Contenido de dominio: `reference/knowledge/dominio/`.

## Scripts de Validación

| Script | Propósito |
| :--- | :--- |
| `node .harness/scripts/validate-docs.mjs` | Validación completa de documentación (enlaces, anclas, encoding, Mermaid) |
| `npx markdownlint .` | Aplica las reglas de `.markdownlint.json` |
| `npx bmad-method install --action quick-update` | Refresca los módulos BMAD al último patch/minor estable |

### Hook de Pre-commit

El hook de pre-commit (`.husky/pre-commit`) se ejecuta automáticamente en cada commit:

1. `lint-staged` — linting de archivos en stage (markdownlint sobre `*.md`)
2. `validate-docs.mjs` — validación completa de documentación

### Glosario de Terminología

Ver `.harness/rules/terminology-glosario.md` para el glosario controlado de términos. Al añadir nuevos términos, mantenerlos en español.

## Arquitectura

- Rol del repositorio: corpus arquitectónico corporativo de Unimar
- Entrada principal: estándares, ADRs, gobernanza corporativos
- Salida principal: documentación de dominio Unimar, ADRs locales, patrones específicos del producto
- BMAD Method v6.8.0: capa de planificación y orquestación con IA
- Áreas clave:
  - `reference/architecture/`
  - `reference/governance/`
  - `reference/knowledge/dominio/` — específico de Unimar
  - `.harness/`
  - `_bmad/`
  - `docs/` — artefactos de planificación BMAD

## Convenciones

- Tratar las lecciones aprendidas aquí como **mejores prácticas** para el ecosistema de Unimar.
- Usar enlaces relativos al repositorio para referencias internas en Markdown.
- Mantener anclas Markdown estables al renombrar encabezados; actualizar todos los enlaces entrantes en el mismo cambio.
- **Convención de Nomenclatura:** usar `kebab-case` para archivos y directorios base. Sin directorios sin scope (`utils`, `misc`, `temp`, `common`, `shared`).
- **Idioma único:** español para todo el contenido. Sin archivos `.en.md` ni pares bilingües.

## Frontera de Carpetas — `reference/` vs `docs/`

Este repositorio tiene **dos capas documentales distintas** por diseño:

| Capa | Carpeta | Owner | Propósito |
| :--- | :--- | :--- | :--- |
| Corpus de referencia arquitectónico | `reference/` | Arquitectura / Gobernanza | Reutilizable, normativo, cross-product |
| Artefactos de planificación e implementación | `docs/` | BMAD Method | PRDs, épicas, historias, retrospectivas específicas del producto |

Las dos capas no se solapan. Las decisiones arquitectónicas van en `reference/architecture/adrs/`. Los planes de producto van en `docs/planning-artifacts/`. No crear contenido en `docs/` que deba vivir en `reference/`, ni viceversa.

## Reglas para Agentes

- Leer [`.harness/rules/global-rules.md`](./.harness/rules/global-rules.md) antes de responder o editar.
- Usar el playbook relevante de `.harness/playbooks/` para auditorías, revisiones de arquitectura y tareas de ingeniería repetitivas.
- Verificación Obligatoria de Enlaces: verificar todos los enlaces internos y anclas antes de completar cualquier tarea de documentación.
- Idioma Único: todo el contenido nuevo debe estar en español. No generar pares bilingües ni contrapartes en otros idiomas.
- Validación de Diagramas: cualquier bloque Mermaid modificado debe pasar validación sintáctica; usar validación de render para cambios materiales.
- Calidad de Actualización de Agentes: cualquier actualización de persona de agente debe declarar alcance, entradas, salidas, restricciones, handoff, checklist de validación y formato de salida de auditoría.
- Cobertura de Reglas: al añadir o cambiar reglas de validación, actualizar la regla de referencia, la tabla de reglas globales y el comportamiento del script de validación juntos.
- Fail Fast en Documentación: si se encuentran enlaces sin resolver, referencias faltantes, anclas inválidas o diagramas inválidos, fallar la tarea y reportar las anomalías en lugar de asumir la finalización.
- **Registro de Decisiones:** cada decisión arquitectónica se registra en `DECISIONS.md`.

## Quality Gates de Documentación

- Los enlaces relativos internos deben resolver desde la ubicación del archivo donde aparecen.
- Las anclas Markdown deben existir en el objetivo Markdown referenciado.
- Los bloques Mermaid deben usar declaraciones soportadas y node IDs estables para las aristas.
- La salida UTF-8 no debe incluir marcadores BOM, caracteres de reemplazo, mojibake ni símbolos del rango emoji.
- Las terminaciones de línea CRLF no están permitidas en la documentación Markdown.
- Todo el contenido debe estar en español, salvo las excepciones explícitas (acrónimos, identificadores de código, marcas).

## Fuera de Alcance

- No debilitar ni eliminar la regla de idioma único (español).
- No crear pares bilingües, archivos `.en.md` ni contrapartes en otros idiomas.
- No sobrescribir perfiles runtime-específicos con suposiciones de otro runtime.
- No crear jerarquías paralelas `docs/` para contenido arquitectónico — eso pertenece a `reference/`.
- No introducir política corporativa que no haya sido aprobada por el Architecture Board de Unimar.

## Documentos Relacionados

- [README.md](./README.md) — Portal público
- [MASTER_INDEX.md](./MASTER_INDEX.md) — Ruteo exhaustivo
- [DECISIONS.md](./DECISIONS.md) — Registro de decisiones arquitectónicas
- [NOTICE.md](./license/NOTICE.md) — Atribución
- [DISCLAIMER.md](./license/DISCLAIMER.md) — Garantía y responsabilidad
- [`.harness/rules/global-rules.md`](./.harness/rules/global-rules.md) — Directivas vinculantes
