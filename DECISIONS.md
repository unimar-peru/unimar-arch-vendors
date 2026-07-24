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

## Decisiones locales

| ID | Decisión | Fecha | Justificación |
| :--- | :--- | :--- | :--- |
| D-001 | Adoptar el plugin unimar-core como fuente del estándar y demoler la copia `estandar/.harness/` | 2026-07-24 | Migración de satélite antiguo por copia a consumo por plugin (S-16, ADR-0062). |
| D-002 | Raíz de contenido en `estandar/` en lugar de `src/` | 2026-07-24 | Repositorio documental provider-facing; se triaja S-18 como Extend. |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
