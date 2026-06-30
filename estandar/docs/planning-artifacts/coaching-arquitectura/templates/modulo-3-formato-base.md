# Formato Base — Plantilla Vacía de Sesión

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 3](../hubs/modulo-3.md) → [Plantilla](./modulo-3-template.md) → Formato Base

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

- [ ] [ADR y diagramas C4 aprobados del módulo anterior]
- [ ] [Referencia de Arquitectura Hexagonal]
- [ ] [Herramienta de testing configurada]

---

## Agenda

| Bloque | Actividad | Duración |
| :--- | :--- | :--- |
| 1 | [Apertura: "Construir bajo estándar vs. construir rápido"] | [X min] |
| 2 | [Arquitectura Hexagonal: cómo se mapean las capas del producto] | [X min] |
| 3 | [TDD: ciclo Red-Green-Refactor demostrado en vivo] | [X min] |
| 4 | [Code Review: qué se busca y cómo comunicar feedback constructivo] | [X min] |
| — | BREAK | 15 min |
| 5 | [Mob Programming: estructura hexagonal del proyecto] | [X min] |
| 6 | [Primer test unitario + implementación en mob] | [X min] |
| — | BREAK 15 min | 15 min |
| 7 | [Práctica independiente: implementar endpoints con TDD] | [X min] |
| 8 | [Abrir PR + Code Review cruzado] | [X min] |
| 9 | [Correcciones + pipeline CI verde + merge] | [X min] |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el participante:** Código del API con [N] endpoints, tests con cobertura ≥ 80%.
- **Criterios de aceptación:**
  - [ ] [N] endpoints operativos (verificados con curl o Postman)
  - [ ] Arquitectura Hexagonal respetada (entidades sin imports de framework)
  - [ ] Cobertura de tests unitarios ≥ 80% en capa de dominio (reporte adjunto)
  - [ ] PR aprobado con al menos 2 comentarios de Code Review resueltos
  - [ ] Pipeline CI local en verde (log adjunto al PR)
- **Forma de entrega:** Pull Request: `feature/modulo3-endpoints-[nombre]` → `develop`
- **Regla de oro:** Ningún código llega a `develop` con cobertura inferior al 80% o sin revisión de PR.

---

## Checklist de Code Review

- [ ] La lógica de negocio vive en la capa de dominio (sin imports de framework en entidades)
- [ ] Tests escritos antes de la implementación (TDD)
- [ ] Cobertura ≥ 80% en archivos de `domain/`
- [ ] Nombres descriptivos y consistentes con el dominio de negocio
- [ ] Sin `console.log` de depuración en el código commiteado
- [ ] Sin código comentado ni TODOs sin issue asociado

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Agente Amelia (Dev) | Asistencia en implementación | `bmad-agent-dev` en OpenCode |
| Jest | Runner de tests con cobertura | [jestjs.io](https://jestjs.io/) |
| Postman / curl | Verificación de endpoints | [postman.com](https://www.postman.com/) |
| ESLint | Linting estático del código | [eslint.org](https://eslint.org/) |

---

## Notas del Facilitador

[Notas privadas, advertencias o puntos críticos. No visible para participantes.]

---

## Evidencias de Certificación

- [ ] Reporte de cobertura Jest ≥ 80% en `domain/` (adjunto como comentario en el PR)
- [ ] Log del pipeline CI: lint ✓, test ✓, sin errores
- [ ] PR con mínimo 2 comentarios de Code Review con estado "Resolved"
- [ ] Captura de curl/Postman mostrando endpoints respondiendo 200 OK
- [ ] PR aprobado + merge a `develop` exitoso

---

*Formato base generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 2 | [Repasar Hexagonal](../prompts/modulo-3-prompts.md#prompt-1-repasar-hexagonal) | Generar repaso de Arquitectura Hexagonal |
| 6 | [Generar Estructura](../prompts/modulo-3-prompts.md#prompt-2-generar-estructura) | Generar estructura NestJS hexagonal |
| 7 | [Generar Tests](../prompts/modulo-3-prompts.md#prompt-5-generar-tests) | Generar tests unitarios con Jest |
| 10 | [Generar Entidad](../prompts/modulo-3-prompts.md#prompt-3-generar-entidad) | Generar entidad de dominio pura |
| 10 | [Generar Caso de Uso](../prompts/modulo-3-prompts.md#prompt-4-generar-caso-de-uso) | Generar caso de uso con inyección |
| 13 | [Revisar Código](../prompts/modulo-3-prompts.md#prompt-6-revisar-código) | Generar code review con checklist |
| 11 | [Mejorar Cobertura](../prompts/modulo-3-prompts.md#prompt-7-mejorar-cobertura) | Identificar código sin tests |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
