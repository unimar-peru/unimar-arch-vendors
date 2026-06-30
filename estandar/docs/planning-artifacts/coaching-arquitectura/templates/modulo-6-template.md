# Plantilla de Sesión — Módulo 6: Soporte y Retrospectiva

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 6](../hubs/modulo-6.md) → Plantilla

---

## Acerca de esta Plantilla

Este módulo es el cierre del ciclo completo. El equipo enfrenta la operación real de UNIMAR: mantener, diagnosticar y mejorar un sistema vivo. El Runbook es el manual que cualquier ingeniero de guardia puede usar a las 2 AM. El Simulacro E2E demuestra que el equipo puede operar bajo presión. El Radar de Madurez cierra el programa con una medición honesta del crecimiento del equipo.

---

## Recursos del Módulo

| Recurso | Tipo | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| 📄 **Formato Base** | Plantilla vacía | Estructura oficial vacía para que el facilitador complete los datos de cada sesión antes de ejecutarla. Incluye la estructura del Runbook y del Radar de Madurez SDLC. | [Abrir formato base](./modulo-6-formato-base.md) |
| ✅ **Ejemplo Q-Track** | Ejemplo diligenciado | Sesión completa de 4 semanas: troubleshooting con Loki, Runbook de Q-Track con 5 escenarios de incidentes, Simulacro E2E de 30 minutos, Radar de Madurez post-programa y Retrospectiva con lecciones aprendidas. | [Abrir ejemplo Q-Track](./modulo-6-ejemplo-q-track.md) |

---

## Entregable Certificado

Al completar este módulo, el equipo debe haber producido:
- Runbook de Q-Track con 5 escenarios de incidentes completos
- Auditoría de Simulacro: incidente resuelto en ≤ 30 minutos
- Suite E2E del flujo completo Q-Track en verde
- Radar de Madurez SDLC con puntuación en 8 ejes y plan de mejora
- Retrospectiva con 3+ lecciones aprendidas y 3+ acciones concretas

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

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
