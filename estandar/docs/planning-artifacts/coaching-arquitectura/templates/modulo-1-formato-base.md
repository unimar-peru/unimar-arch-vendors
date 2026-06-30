# Formato Base — Plantilla Vacía de Sesión

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 1](../hubs/modulo-1.md) → [Plantilla](./modulo-1-template.md) → Formato Base

Copia esta plantilla y completa cada campo antes de ejecutar la sesión.

---

# Sesión: [Nombre del módulo]

**Fecha:** ___________   **Hora:** ___________   **Duración:** ___________
**Facilitador:** ___________   **Participantes:** ___________

---

## Propósito de la Sesión

[Describir en 2-3 oraciones qué se logrará al final de esta sesión y su valor de negocio para UNIMAR.]

---

## Pre-work Obligatorio

- [ ] [Documento de requisitos fuente que deben leer]
- [ ] [Conceptos de dominio que deben comprender]
- [ ] [Herramienta o metodología que deben revisar]

---

## Agenda

| Bloque | Actividad | Duración |
| :--- | :--- | :--- |
| 1 | [Apertura: el costo de construir sin PRD] | [X min] |
| 2 | [Teoría: PRD, Bounded Contexts y BDD] | [X min] |
| 3 | [Demostración: Agente PM genera borrador del PRD en vivo] | [X min] |
| 4 | [Q&A y distribución de plantillas] | [X min] |
| — | BREAK | 15 min |
| 5 | [Mapeo de Bounded Contexts (facilitador en vivo)] | [X min] |
| 6 | [Práctica guiada: equipos mapean sus contextos] | [X min] |
| — | BREAK 15 min | 15 min |
| 7 | [Práctica independiente: redacción del PRD y Backlog BDD] | [X min] |
| 8 | [Commit + PR + revisión cruzada] | [X min] |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. [PRD del producto — ruta en el repositorio]
  2. [Backlog Ágil con historias BDD — ruta en el repositorio]
- **Criterios de aceptación:**
  - [ ] PRD con secciones completas: Visión, Problema, Objetivos, Usuarios, Alcance
  - [ ] Al menos [N] Bounded Contexts documentados con diagrama Mermaid
  - [ ] Backlog con mínimo [N] historias en formato `Given / When / Then`
  - [ ] Historias priorizadas con MoSCoW con justificación documentada
  - [ ] PR aprobado por el facilitador
- **Forma de entrega:** Pull Request: `feature/prd-backlog-[producto]` → `develop`
- **Regla de oro:** No se inicia el diseño técnico sin PRD aprobado. No se diseña lo que no está definido.

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Agente John (PM) — BMAD | Generación del borrador de PRD | `bmad-agent-pm` en OpenCode |
| DDD Reference | Referencia de Bounded Contexts | [domainlanguage.com](https://www.domainlanguage.com/ddd/reference/) |
| BDD Gherkin | Referencia de Given/When/Then | [cucumber.io](https://cucumber.io/docs/gherkin/) |
| Excalidraw | Mapeo visual de contextos | [excalidraw.com](https://excalidraw.com/) |

---

## Notas del Facilitador

[Notas privadas, advertencias o puntos críticos. No visible para participantes.]

---

## Evidencias de Certificación

- [ ] PRD commiteado con todas las secciones
- [ ] Backlog con [N]+ historias BDD y priorización MoSCoW
- [ ] Diagrama Mermaid de Bounded Contexts renderizable en GitHub
- [ ] PR aprobado + merge a `develop` exitoso

---

*Formato base generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 2 | [Explicar Bounded Contexts](../prompts/modulo-1-prompts.md#prompt-1-explicar-bounded-contexts) | Generar explicación de DDD para equipo mixto |
| 3 | [Generar PRD](../prompts/modulo-1-prompts.md#prompt-3-generar-prd) | Generar borrador completo de PRD |
| 5 | [Identificar Contextos](../prompts/modulo-1-prompts.md#prompt-2-identificar-contextos) | Identificar Bounded Contexts del dominio |
| 10 | [Generar Historias BDD](../prompts/modulo-1-prompts.md#prompt-4-generar-historias-bdd) | Generar backlog de 10-15 historias BDD |
| 11 | [Priorizar MoSCoW](../prompts/modulo-1-prompts.md#prompt-5-priorizar-moscow) | Facilitar sesión de priorización |
| 12 | [Validar PRD](../prompts/modulo-1-prompts.md#prompt-6-validar-prd) | Checklist de validación del PRD |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
