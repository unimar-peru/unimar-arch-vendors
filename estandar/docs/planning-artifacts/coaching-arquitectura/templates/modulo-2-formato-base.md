# Formato Base — Plantilla Vacía de Sesión

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 2](../hubs/modulo-2.md) → [Plantilla](./modulo-2-template.md) → Formato Base

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

- [ ] [ADRs existentes en el repositorio que deben leer]
- [ ] [PRD y Backlog del módulo anterior que deben tener aprobados]
- [ ] [Referencia técnica de arquitectura que deben revisar]

---

## Agenda

| Bloque | Actividad | Duración |
| :--- | :--- | :--- |
| 1 | [Teoría: ADRs, modelo C4 y Arquitectura Hexagonal] | [X min] |
| 2 | [Introducción al debate de Agentes (Winston vs. Amelia)] | [X min] |
| — | BREAK | 15 min |
| 3 | [Winston propone arquitectura (OpenCode en vivo)] | [X min] |
| 4 | [Amelia critica la propuesta (OpenCode en vivo)] | [X min] |
| 5 | [Debate colectivo y votación de la decisión] | [X min] |
| 6 | [Redacción del ADR por secciones] | [X min] |
| — | BREAK 15 min | 15 min |
| 7 | [Construcción del C4 Nivel 1 en Mermaid] | [X min] |
| 8 | [Construcción del C4 Nivel 2 en Mermaid] | [X min] |
| 9 | [Revisión cruzada + commit + PR] | [X min] |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. [ADR con número secuencial — ruta en `reference/architecture/adrs/`]
  2. [Diagramas C4 N1 y N2 — ruta en `docs/planning-artifacts/`]
- **Criterios de aceptación:**
  - [ ] ADR con secciones: Contexto, Decisión, Consecuencias, Alternativas Rechazadas
  - [ ] Al menos 1 alternativa rechazada con justificación de negocio
  - [ ] Diagrama C4 Nivel 1 renderizable en GitHub
  - [ ] Diagrama C4 Nivel 2 renderizable en GitHub
  - [ ] PR aprobado por el facilitador
- **Forma de entrega:** Pull Request: `feature/arquitectura-[producto]` → `develop`
- **Regla de oro:** No se escribe código en el Módulo 3 de componentes sin ADR o C4 aprobado.

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Agente Winston (Arquitecto) | Propuesta de arquitectura | `bmad-agent-architect` en OpenCode |
| Agente Amelia (Dev) | Crítica de implementación | `bmad-agent-dev` en OpenCode |
| ADRs existentes en unimar_arch | Referencia de ADRs aprobados | `reference/architecture/adrs/` |
| Modelo C4 | Referencia del framework | [c4model.com](https://c4model.com/) |
| Mermaid.js | Renderizado de diagramas | [mermaid.js.org](https://mermaid.js.org/) |

---

## Notas del Facilitador

[Notas privadas, advertencias o puntos críticos. No visible para participantes.]

---

## Evidencias de Certificación

- [ ] ADR en `reference/architecture/adrs/` con número secuencial
- [ ] C4 N1 y N2 renderizables en GitHub sin errores de sintaxis
- [ ] Al menos 1 alternativa rechazada con justificación de negocio
- [ ] PR aprobado + merge a `develop` exitoso

---

*Formato base generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 1 | [Explicar ADRs](../prompts/modulo-2-prompts.md#prompt-1-explicar-adrs) | Generar explicación de Architecture Decision Records |
| 2 | [Explicar C4](../prompts/modulo-2-prompts.md#prompt-2-explicar-c4) | Generar explicación del modelo C4 |
| 3 | [Explicar Hexagonal](../prompts/modulo-2-prompts.md#prompt-3-explicar-hexagonal) | Generar explicación de Arquitectura Hexagonal |
| 5 | [Winston Propuesta](../prompts/modulo-2-prompts.md#prompt-4-winston-propuesta) | Generar propuesta de arquitectura |
| 6 | [Amelia Crítica](../prompts/modulo-2-prompts.md#prompt-5-amelia-crítica) | Generar crítica a propuesta |
| 9 | [Generar ADR](../prompts/modulo-2-prompts.md#prompt-6-generar-adr) | Generar ADR completo basado en debate |
| 10 | [Generar C4 N1](../prompts/modulo-2-prompts.md#prompt-7-generar-c4-n1) | Generar diagrama C4 Nivel 1 |
| 11 | [Generar C4 N2](../prompts/modulo-2-prompts.md#prompt-8-generar-c4-n2) | Generar diagrama C4 Nivel 2 |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
