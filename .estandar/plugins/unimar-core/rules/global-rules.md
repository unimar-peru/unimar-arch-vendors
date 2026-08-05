# Global Rules (Context-Optimized)

Directivas vinculantes para el repositorio satélite Unimar Arch, inspiradas en el upstream open source Evolith (<https://github.com/beyondnetcode/evolith_arch32>) y adaptadas al contexto del producto Unimar.

| ID | Regla | Restricción |
|---|---|---|
| **R-01** | (retirada) | Identificador reservado. La regla original fue retirada; se conserva la lápida para no reasignar el número. |
| **R-02** | Context7 | _(Condicional)_ Cuando `context7` esté disponible en la sesión, consultarlo para límites de arquitectura en vivo. No es vinculante si el MCP no está presente. |
| **R-03** | UTF-8 Limpio | Las salidas documentales deben ser UTF-8 puro; no se permite BOM, CRLF, caracteres de reemplazo, mojibake ni artefactos de encoding. |
| **R-04** | Idioma Único | Toda la documentación debe estar en español. No se generan pares bilingües ni contrapartes en otros idiomas. Excepciones: acrónimos, identificadores de código, marcas, citas bibliográficas. |
| **R-05** | Etiquetas en Español | Las etiquetas de los diagramas deben estar en español. Excepción: identificadores de código. |
| **R-06** | Stack Tecnológico | Validar todas las menciones técnicas solo contra el stack tecnológico aprobado. |
| **R-07** | Separar Historias | Separar FUNCTIONAL, TECHNICAL y ENABLER. Nunca mezclar negocio con detalles de implementación. |
| **R-08** | Trazabilidad | Cuando un UC cambie, actualizar todos los diagramas relevantes y registrar: [Doc, Tipo, Cambio, UC ID]. |
| **R-09** | Camino de Auth | Los diseños de autenticación deben mostrar explícitamente ambos flujos IDP e Interno. |
| **R-10** | Legibilidad | Los documentos funcionales usan lenguaje plano; sin jerga técnica. |
| **R-11** | Formato de Auditoría | Las auditorías emiten: [Documento, Ubicación, Tipo de Issue, Severidad, Fix Recomendado]. |
| **R-12** | Orden | Las tareas duales se ejecutan: 1. PO (funcional) -> 2. Arquitecto (técnico). Sin ejecución en paralelo. |
| **R-13** | Convenciones | Aplicar estrictamente prefijos de nomenclatura, taxonomías, enlaces relativos y anclas Markdown antes de merges. |
| **R-14** | Estructura Funcional | Las historias funcionales y artefactos equivalentes deben mantener la narrativa de negocio legible y aislar el detalle técnico en una sección dedicada `Requisitos Técnicos`. |
| **R-15** | Autoridad de Runtime | Las referencias técnicas deben citar el perfil runtime autoritativo y mantenerse alineadas con el stack objetivo real. |
| **R-16** | Capas Multi-Tenancy | Los estándares de multi-tenancy deben definir el aislamiento a nivel de aplicación como primario y la aplicación nativa de base de datos como failsafe secundario. |
| **R-17** | Contrato de Catálogo | Las entidades paramétricas y de configuración deben definir `code`, `value` y `description` con expectativas de trazabilidad, unicidad, auditabilidad y extensibilidad. |
| **R-18** | Extracción Modular | La lógica compartida y los límites de módulo deben preservar la preparación para extracción para la evolución de monolito modular a distribuido. |
| **R-19** | Gobernanza de API Híbrida | Si REST y GraphQL coexisten, los comandos se quedan en REST-first y el comportamiento de queries debe permanecer consistente en ambas superficies. |
| **R-20** | (retirada) | Identificador reservado. La regla original fue retirada; se conserva la lápida para no reasignar el número. |
| **R-21** | Registro de Decisiones Arquitectónicas | Cada decisión arquitectónica se registra en `DECISIONS.md` con la operación correspondiente. |
| **R-22** | Shells Transversales | La lógica de infraestructura (workflows, configuración, integración) debe estar encapsulada en Shells compartidos. No contaminar los Bounded Contexts. |
| **R-23** | Agregados Pequeños | Usar listas de UUID (`List<UUID>`) para relaciones 1:N masivas para preservar rendimiento O(1) y prevenir deadlocks de concurrencia optimista. |
| **R-24** | Gates de Dominio Dinámico | Los workflows dinámicos del tenant deben asegurarse a nivel de dominio mediante un `RequirementChecklist` interno evaluado antes de las transiciones de estado. |
| **R-25** | Ergonomía de Diagramas | Los modelos complejos de Domain-Driven Design (DDD) no deben renderizarse como un único diagrama monolítico. Deben dividirse en al menos tres vistas (Business Core, Workflow/Audit y Cross-Cutting Shells) con una leyenda visual. |
| **R-26** | Base de Satélite | Todo repositorio satélite debe usar `unimar_arch` como fuente autoritativa de plantillas, ADRs y estándares. Ver [satellite-repo-rules.md](./satellite-repo-rules.md). |
| **R-27** | Herencia de Plantillas | Los satélites deben adoptar las plantillas de `reference/governance/sdlc/04-plantillas-artefactos/` sin modificar la estructura canónica (se permite Extend con aprobación). |
| **R-28** | Diagramas Obligatorios | Toda historia funcional y épica debe incluir al menos un diagrama Mermaid (flowchart o sequence) en el artefacto. |
| **R-29** | Requisitos Técnicos Completos | La sección 3 de toda historia de usuario debe tener: Bounded Context, Dependencias, Restricciones Técnicas, ADRs Relevantes, Notas Técnicas. |
| **R-30** | Actores Documentados | La sección 2 de toda historia de usuario debe incluir: Actor Principal (tabla), Actores Secundarios (tabla), Diagrama de Interacción (Mermaid), Interacciones del Actor (tabla). |

## Gates de Validación Obligatorios

Antes de considerar completo cualquier cambio documental o de reglas de agentes:

Los validadores se invocan desde la raíz del repositorio. En la fuente del estándar viven en `.harness/scripts/`; en un satélite los provee el plugin `unimar-core`. En ambos casos el objetivo es el repositorio desde el que se ejecutan, no la ubicación del script.

1. Ejecutar `validate-docs.mjs`.
2. Si el cambio abre, avanza o cierra un gap, ejecutar `validate-gaps.mjs --fix` y `validate-madurez.mjs --fix`, y comprobar el cruce con `validate-correspondencia.mjs`.
3. Si el cambio cita un gap o un ADR, `validate-trazabilidad.mjs` comprueba que la referencia resuelva.
4. Corregir enlaces relativos rotos, anclas Markdown faltantes, bloques Mermaid malformados, violaciones de UTF-8 o terminaciones de línea antes del merge.
5. Reportar cualquier anomalía restante explícitamente si no puede corregirse en el mismo cambio.

Con Claude Code, la skill `validar-gobernanza` corre el barrido entero en un paso.

> **Qué comprueba `validate-docs.mjs`, exactamente.** Enlaces relativos y anclas: el destino existe y el `#fragmento` corresponde a un encabezado real. Encoding UTF-8, y además **texto mutilado** — prosa a la que se le han caído las tildes o la eñe, que sigue siendo UTF-8 válido y que ninguna comprobación de encoding delata. Trazabilidad TS↔ADR.
>
> De Mermaid comprueba la **estructura**: que el bloque declare un tipo de diagrama conocido y que sus `subgraph`/`alt`/`loop` cierren con `end`. **No renderiza**: haría falta un motor Mermaid y este harness no lleva dependencias. Un diagrama puede pasar el gate y aun así dibujar algo incorrecto — una flecha a un nodo inexistente, por ejemplo. Ese resto sigue siendo revisión humana.
>
> `--fix` repara los enlaces cuya ruta resuelve a un único destino; los ambiguos los reporta para que decida una persona.
>
> Hasta el 2026-07-16 nada de esto era cierto: el script no validaba enlaces, anclas ni Mermaid, pese a que este documento y otros cuatro afirmaban lo contrario. El repositorio tenía **210 enlaces rotos** y el gate respondía `OK` sobre todos. Si vuelves a leer aquí una capacidad, compruébala antes de confiar en ella: un validador que aprueba un repositorio roto es peor que no tener validador (SD-06).

## Autoridad Heredada

Estas reglas están inspiradas en el corpus de gobernanza upstream de Evolith (<https://github.com/beyondnetcode/evolith_arch32>) y adaptadas para Unimar Arch bajo el modelo open source (no vinculante, voluntario). No son contractuales; Unimar es libre de sobrescribir, simplificar o reemplazar cualquier regla. Diverge deliberadamente, y registra la operación en [`../../DECISIONS.md`](https://github.com/unimar-peru/unimar_arch/blob/main/DECISIONS.md).
