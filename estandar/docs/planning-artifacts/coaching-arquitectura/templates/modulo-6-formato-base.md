# Formato Base — Plantilla Vacía de Sesión

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 6](../hubs/modulo-6.md) → [Plantilla](./modulo-6-template.md) → Formato Base

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

- [ ] Stack de observabilidad listo (Loki + Grafana + Promtail)
- [ ] RC Sellado y Release Notes del módulo anterior disponibles
- [ ] [Referencia de Runbooks y LogQL que deben revisar]

---

## Agenda

| Bloque | Actividad | Duración |
| :--- | :--- | :--- |
| 1 | [Apertura: "El incidente de las 2 AM sin Runbook"] | [X min] |
| 2 | [Loki en 20 min: arquitectura, Promtail, queries LogQL] | [X min] |
| 3 | [Tests E2E: cuándo y cuáles (completar la Pirámide)] | [X min] |
| 4 | [Radar de Madurez SDLC: los 8 ejes y cómo se evalúan] | [X min] |
| 5 | [Reglas del Simulacro: tiempo límite, herramientas permitidas] | [X min] |
| — | BREAK | 15 min |
| 6 | [Levantar stack de observabilidad + consultas LogQL en vivo] | [X min] |
| 7 | [Facilitador inyecta error → equipo lo detecta con Loki] | [X min] |
| 8 | [Documentar los [N] escenarios del Runbook] | [X min] |
| 9 | [Escribir suite E2E del flujo crítico del producto] | [X min] |
| 10 | [SIMULACRO E2E: facilitador inyecta incidente, equipo resuelve] | [X min] |
| 11 | [Debriefing + actualización del Runbook] | [X min] |
| 12 | [Auto-evaluación del Radar de Madurez + consolidación] | [X min] |
| 13 | [Retrospectiva del programa + cierre y certificación] | [X min] |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. Runbook con [N] escenarios de incidentes commiteado
  2. Auditoría de Simulacro con resultado documentado
  3. Suite E2E del flujo crítico en verde
  4. Radar de Madurez SDLC con puntuación en 8 ejes
  5. Retrospectiva con lecciones aprendidas y acciones concretas
- **Criterios de aceptación:**
  - [ ] Runbook: síntoma, diagnóstico, resolución y escalado por cada escenario
  - [ ] Simulacro: incidente resuelto en ≤ 30 minutos
  - [ ] Suite E2E del flujo completo en verde
  - [ ] Radar con puntuación en 8 ejes + plan de mejora para brecha > 2
  - [ ] Retrospectiva con 3+ lecciones y 3+ acciones con responsable y fecha

---

## Runbook — Estructura de Escenario

| Campo | Contenido |
| :--- | :--- |
| **Nombre del incidente** | [Nombre descriptivo] |
| **Síntomas** | [Qué observa el equipo de guardia] |
| **Consulta Loki** | `{service="[servicio]"} \|= "[término]"` |
| **Diagnóstico (pasos)** | 1. [...] 2. [...] 3. [...] |
| **Resolución (pasos)** | 1. [...] 2. [...] |
| **Escalado** | [Cuándo y a quién escalar si no se resuelve en X min] |

---

## Radar de Madurez SDLC — Ejes de Evaluación

| Eje | Puntuación actual (1-5) | Objetivo | Brecha | Acción de mejora |
| :--- | :--- | :--- | :--- | :--- |
| Versionado GitFlow | | | | |
| Testing Unitario | | | | |
| Tests de Integración | | | | |
| Documentación | | | | |
| CI/CD Automatizado | | | | |
| Observabilidad OTel | | | | |
| Tests E2E | | | | |
| Cultura de ADRs | | | | |

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Loki | Agregación de logs | [grafana.com/oss/loki](https://grafana.com/oss/loki/) |
| Grafana | Visualización de logs y métricas | [grafana.com/grafana](https://grafana.com/grafana/) |
| LogQL | Lenguaje de consultas de Loki | [grafana.com/docs/loki/query](https://grafana.com/docs/loki/latest/query/) |
| Playwright / Supertest | Tests E2E del API | [playwright.dev](https://playwright.dev/) |
| OpenCode | Generación del Runbook y Retro | Intranet UNIMAR |

---

## Notas del Facilitador

[Notas privadas, advertencias o puntos críticos sobre el Simulacro y la Retrospectiva. No visible para participantes.]

---

## Evidencias de Certificación

- [ ] Runbook con [N] escenarios commiteado en el repositorio
- [ ] Auditoría de Simulacro: tiempo de resolución documentado (objetivo ≤ 30 min)
- [ ] Suite E2E del flujo crítico en verde
- [ ] Radar de Madurez con puntuación en 8 ejes y plan de mejora
- [ ] Retrospectiva con 3+ lecciones y 3+ acciones con responsable y fecha
- [ ] PR aprobado + merge a `develop` — programa completado

---

*Formato base generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 2 | [Explicar Stack](../prompts/modulo-6-prompts.md#prompt-1-explicar-stack) | Generar explicación de Loki + Grafana |
| 6 | [Configurar Promtail](../prompts/modulo-6-prompts.md#prompt-2-configurar-promtail) | Generar configuración de Promtail |
| 7 | [Generar LogQL](../prompts/modulo-6-prompts.md#prompt-3-generar-logql) | Generar 10 consultas LogQL |
| 9 | [Generar Runbook](../prompts/modulo-6-prompts.md#prompt-4-generar-runbook) | Generar Runbook con 5 escenarios |
| 13 | [Facilitar Simulacro](../prompts/modulo-6-prompts.md#prompt-5-facilitar-simulacro) | Generar guía de simulacro |
| 15 | [Generar Radar](../prompts/modulo-6-prompts.md#prompt-7-generar-radar) | Generar Radar de Madurez |
| 16 | [Facilitar Retrospectiva](../prompts/modulo-6-prompts.md#prompt-6-facilitar-retrospectiva) | Generar guía de retrospectiva |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
