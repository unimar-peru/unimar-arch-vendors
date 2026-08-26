# DECISIONS.md — unimar-arch-vendors

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Reglas:** S-15, R-21
> **Tipo de repositorio:** producto

Decisiones locales de este satélite y **triaje de las veintidós reglas de herencia** (S-01 … S-22). Una decisión local nunca contradice un ADR de `unimar_arch`.

El **tipo de repositorio** (ADR-0069) es `producto` o `libreria`. El defecto es `producto`; cámbielo a `libreria` si este satélite publica un paquete que otros consumen en vez de un sistema que se despliega. El tipo condiciona las ramas (ADR-0050), los artefactos SDLC (S-01 … S-05), el README y la lectura de la madurez. Un satélite `libreria` triaja S-01 … S-05 como `N/A` por su tipo.

## Operaciones

| Operación | Significado |
| :--- | :--- |
| `Adopt` | Se toma la regla tal cual, sin modificaciones. |
| `Extend` | Se toma y se añaden extensiones locales que no la contradicen. |
| `Override` | Se reemplaza localmente. Solo donde está permitido, y **exige ADR local** que lo justifique. |
| `N/A` | No aplica por contexto. **Se declara por qué**, no se deja en blanco. |

> `N/A` por decisión y `N/A` por ausencia no son lo mismo. Si la regla no se cumple porque el artefacto todavía no existe, eso es un **gap**, no una exención: regístrelo en [GAPS.md](./GAPS.md).

## Triaje de las reglas de herencia

| Regla | Operación | Justificación |
| :--- | :--- | :--- |
| S-01 Plantillas Base | Adopt | Sigue y distribuye las plantillas canónicas de artefactos del plugin. |
| S-02 Formato Canónico | Adopt | Formato canónico aplicado en toda la documentación. |
| S-03 Diagramas Mermaid | Adopt | Diagramas Mermaid en los docs. |
| S-04 Requisitos Técnicos Aislados | Adopt | Requisitos técnicos aislados en las plantillas provistas. |
| S-05 Actores y Stakeholders | Adopt | Actores y stakeholders en las plantillas de historia. |
| S-06 Trazabilidad a ADRs | Adopt | Toda decisión referencia ADRs aceptados de unimar_arch. |
| S-07 Stack Tecnológico Autorizado | Adopt | Solo se referencia el stack tecnológico autorizado. |
| S-08 Versión SemVer en Plantillas | Adopt | Versionado SemVer en plantillas y documentos. |
| S-09 Idioma Único | Adopt | Español único (SD-08). |
| S-10 Referencias Relativas | Adopt | Enlaces relativos que resuelven. |
| S-11 Badges Uniformados | Adopt | Badges uniformados. |
| S-12 Validación Pre-Commit | Adopt | Validación pre-commit provista por el plugin. |
| S-13 Historial de Cambios | Adopt | Historial en estandar/DOCUMENTATION_VERSIONS.md. |
| S-14 Guía de Estilo | Adopt | Guía de estilo heredada. |
| S-15 Decisiones Locales | Adopt | Decisiones locales en este DECISIONS.md. |
| S-16 Estándar Provisto, no Copiado | Adopt | El estándar lo provee el plugin `unimar-core`. Este repositorio no contiene `.harness/`. La versión se fija en `STANDARD_REF`. |
| S-17 Agentes BMAD | Adopt | BMAD instalado en la versión heredada de unimar_arch. |
| S-18 Taxonomía y Configuración Base | N/A | Paquete documental para proveedores sin código ejecutable: no hay raíz de fuente (`src/`). El contenido canónico vive bajo `estandar/` (portal en el README raíz). Ver D-002. |
| S-19 Medición de Madurez | Adopt | [MADUREZ.md](./MADUREZ.md) |
| S-20 Registro Único de Gaps | Adopt | [GAPS.md](./GAPS.md) |
| S-21 Rulesets de Agentes | Adopt | Los subagentes los provee el plugin. `.claude/agents/` es zona protegida. |
| S-22 Reglas Spec-Driven | Adopt | Reglas spec-driven aplicadas a la documentación distribuida. |
| S-23 Gates de Calidad y Seguridad Local-First | Adopt | Gates de calidad y seguridad local-first, alineados con ADR-0106 incorporado a este repo. |
| S-24 Fase 1 Define, el Tablero Planifica | Adopt | Se adopta completa ([ADR-0134](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0134-fase-1-define-el-backlog-el-tablero-posee-el-tiempo.es.md)): los artefactos de Fase 1 definen y ordenan; el tiempo de calendario lo posee el tablero SDLC. **Hoy la regla no tiene sujeto en este repositorio**, que publica el estándar SDLC aplicable a proveedores externos y no autora artefactos de Fase 1 propios —no hay PRD, backlog ni épicas—. Se adopta y no se exime: `N/A` está reservado a la exención **por tipo** (`libreria`), y el tipo declarado aquí es `producto`. En cuanto este repositorio autore su primer artefacto de Fase 1, la prohibición de fechas, quarters y `gantt` le vincula sin necesidad de retriajar. |
| S-25 Índice de Iniciativas Publicado | Adopt | Se adopta por el mismo motivo, y hoy está vacía de contenido, no exenta. Verificado el 2026-08-03 con `validate-prd-index.mjs`: «El repositorio no declara ningún PRD (`PRD-<SIGLA>-<n>`). Sin PRDs no hay índice que exigir. No aplica». Con el primer PRD que este repositorio autore nace el deber de publicar `reporting/data/initiatives-index.json` y de listarlo allí ([ADR-0140](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0140-publicacion-obligatoria-indice-iniciativas-satelite.es.md)). |
| S-26 Numeración de Identificadores entre Ramas | Adopt | Aplica: este repositorio declara gaps `G-NNN` en su `GAPS.md`. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: `validate-identificadores.mjs` y `validate-adr-numeracion.mjs` salen en verde —«esta rama no añade ningún ADR»—. Los dos preguntan al remoto, y en un clon sin `origin/main` no juzgan y lo dicen; no juzgar no es aprobar. |
| S-27 Aceptación de un ADR | Adopt | Se adopta aunque este repositorio **no autore ADRs propios**: los 41 que hay bajo `estandar/` son la copia curada del corpus de Unimar. La regla vincularía a un ADR local el día que exista. Su ejecutor se encadena como **aviso** y no como puerta, y la razón está en [G-016](./GAPS.md): el índice del espejo es un **subconjunto deliberado**, así que medir omisiones contra el disco denuncia cinco que no son un índice que miente sino una curaduría que no se declara como tal. |
| S-28 Vinculación al Estándar Declarada | Adopt | Se adopta **en el domicilio que la propia regla le asigna**, y no por excepción. S-28 contempla exactamente este caso: un repositorio que **no puede** obtener el estándar del marketplace —por ser público, y los secretos de organización tienen visibilidad `private`— lleva el estándar commiteado y su pin vive en la cabecera `Etiqueta:` de `.estandar/PROCEDENCIA.txt` ([ADR-0202](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0202-el-domicilio-del-pin-del-estandar-tiene-una-sola-definicion.es.md)). Ese es el domicilio de este repositorio y hoy dice `unimar-core-1.90.0`. `validate-vinculacion-estandar.mjs` en verde. |
| S-29 Reciprocidad de la Supersesión | Adopt | Se adopta por lo mismo que S-27: sin ADRs propios no hay supersesión que reciprocar hoy, y eso es **cierto, no una omisión**. Vincula en cuanto este repositorio retire una decisión suya. Sobre el espejo se comprueba como aviso. |
| S-30 Una Ruta de Lectura no Encamina a una Decisión Retirada | Adopt | Aplica de lleno, y aquí más que en otros: este repositorio **es** material de lectura para proveedores externos. Encaminar a un proveedor hacia una decisión retirada es el daño exacto que la regla evita. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: `validate-docs.mjs` en verde sobre todo el corpus. |
| S-31 La Retirada de un ADR Consta con su Razón | Adopt | Aplica: si el espejo llegara a portar un ADR retirado, un proveedor tiene que poder leer por qué dejó de regir. Comprobada en verde por `validate-docs.mjs`. |
| S-32 Un Contrato Aceptado Nombra lo que Aún no lo Sostiene | Adopt | Aplica: este paquete **es** un contrato con proveedores, y lo que aún no lo sostiene tiene que estar nombrado y no callado. Verde por `validate-docs.mjs`. |
| S-33 Una Regla Vigente se Funda en una Decisión Vigente | Adopt | Aplica: el paquete reparte reglas y las decisiones que las fundan. Una regla que un proveedor obedezca apoyada en un ADR en `Borrador` le exigiría lo que no vincula. Verde por `validate-docs.mjs`. |
| S-34 El Dato Personal no Llega al Log | Adopt | **Se adopta aunque la puerta se abstenga**, no `N/A`. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: `validate-redaccion-log.mjs` responde «nada que juzgar: la puerta se abstiene sin veredicto». Este repositorio no tiene código propio bajo `src/`, así que no emite logs; el día que tenga uno, la regla vincula sin retriaje. `N/A` afirmaría que a este repositorio no se le pide, y no es eso: es que aún no hay objeto. |
| S-35 La Vigencia se Declara Donde Puede Sostenerse Verdadera | Adopt | Aplica en su mitad de **prohibición**, y aquí importa especialmente: un proveedor que lea un pie fechado creerá que el material está revisado a esa fecha. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: `validate-vigencia.mjs` en verde —«8 documentos revisados y ninguno fecha su pie de copyright»—. La vigencia de este paquete se declara donde puede sostenerse: `estandar/PROCEDENCIA.md`, con la fecha de comparación contra la fuente. |
| S-36 La Señal Declara Cuánto Dura y Quién Puede Alterarla | Adopt | Se adopta aunque hoy la puerta se abstenga —«nada exigible que juzgar»—: este repositorio no emite señales de observabilidad porque no ejecuta nada. Mismo criterio que S-34. |
| S-37 El Analizador Estático se Declara por Runtime y su Invocación está Cableada | Adopt | Se adopta con la puerta abstenida por la misma razón: sin código propio no hay runtime que analizar. `validate-analisis-estatico.mjs` lo dice con esas palabras en vez de dar el visto. |
| S-38 El Ámbito de Runtime de un ADR se Declara | Adopt | Aplica al día que este repositorio autore un ADR propio. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: `validate-ambito-runtime.mjs` en verde —«Los 0 ADR que declaran ámbito de runtime dicen la verdad sobre el disco»—: hoy ninguno lo declara y eso es cierto. |
| S-39 El PRD y la Historia Técnica Declaran las Secciones de su Plantilla Canónica | Adopt | Se adopta, y **no** `N/A` como haría un satélite de tipo librería: este repositorio reparte a proveedores las **plantillas** de PRD e historia técnica, de modo que la regla es parte de lo que entrega. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: `validate-secciones-prd-historia-tecnica.mjs` **se abstiene** —no hay PRD ni historia técnica propios en este árbol— y no emite visto de conformidad. |
| S-40 El Censo Desmiente al Sujeto no Observado | Adopt | Aplica: este repositorio figura en el censo de la organización, y es el único público. Comprobada en verde por `validate-docs.mjs`. |
| S-42 El Consumidor Declara Qué Hace Cuando su Dependencia No Responde | Adopt | Se adopta previendo, no midiendo, y se dice: Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado, `validate-comportamiento-degradado.mjs` **se abstiene** —«este satélite no autora ningún Blueprint de Arquitectura, que es `Cond` y no `Req`»— sin emitir visto. Este repositorio reparte la **plantilla** de Blueprint a proveedores, así que la regla viaja en lo que entrega aunque no tenga Blueprint propio. |
| S-43 Ningún Artefacto del Estándar Sale con una Credencial Dentro | Adopt | Aplica sin matices, y con un motivo que ningún otro satélite tiene: **este es el único repositorio PÚBLICO de la organización**. Una credencial escrita aquí no queda entre miembros de la organización, queda en internet. Medido el 2026-08-26 con `unimar-core-1.90.0` ya vendorizado: la puerta corrió de verdad y su censo de la ola 2 dio **0 hallazgos**. Se adopta con el límite que la regla declara —caza la forma, no el secreto— y mirando el árbol de hoy, nunca el historial. |

## Decisiones locales

| ID | Decisión | Fecha | Justificación |
| :--- | :--- | :--- | :--- |
| D-001 | Adoptar el plugin unimar-core como fuente del estándar y demoler la copia `estandar/.harness/` | 2026-07-24 | Migración de satélite antiguo por copia a consumo por plugin (S-16, ADR-0062). |
| D-002 | Raíz de contenido en `estandar/` en lugar de `src/` | 2026-07-24 | Repositorio documental provider-facing sin código ejecutable; se triaja S-18 como N/A. |
| D-003 | `validate-satellite-base` es aviso (no puerta) en pre-commit y CI | 2026-07-24 | Este repo es un paquete documental: su contenido son plantillas y ejemplos con placeholders, no artefactos SDLC reales. El validador los juzga como artefactos y produce falsos positivos — el propio plugin `unimar-core` falla igual sobre sus plantillas. Se ejecuta por visibilidad, no bloquea. Fix de raíz: proponer upstream que el validador omita `fuente/` y `ejemplos/`. |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
