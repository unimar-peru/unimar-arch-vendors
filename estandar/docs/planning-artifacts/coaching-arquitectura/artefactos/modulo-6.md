# Artefactos — Módulo 6: Soporte y Retrospectiva

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Plantilla](../templates/modulo-6-template.md) → Artefactos

---

## Plantillas y Ejemplos de Referencia

| Tipo | Artefacto | Enlace |
| :--- | :--- | :--- |
| 📄 **Plantilla vacía** | Runbook de Operaciones | [runbook-plantilla.md](../templates/artefactos/runbook-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Runbook de Operaciones (llenado) | [runbook-ejemplo-q-track.md](../templates/artefactos/runbook-ejemplo-q-track.md) |
| 📄 **Plantilla vacía** | Retrospectiva del Programa | [retrospectiva-plantilla.md](../templates/artefactos/retrospectiva-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Retrospectiva (llenado) | [retrospectiva-ejemplo-q-track.md](../templates/artefactos/retrospectiva-ejemplo-q-track.md) |
| 📄 **Plantilla vacía** | Auditoría de Simulacro E2E | [auditoria-simulacro-plantilla.md](../templates/artefactos/auditoria-simulacro-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Auditoría de Simulacro (llenado) | [auditoria-simulacro-ejemplo-q-track.md](../templates/artefactos/auditoria-simulacro-ejemplo-q-track.md) |

> **Instrucción:** Copia las plantillas vacías, usa los ejemplos como guía de llenado y adapta a tu proyecto.

---

## Artefactos Entregables

| Artefacto | Descripción | Ruta en el repositorio | Estado |
| :--- | :--- | :--- | :--- |
| **Runbook de Q-Track** | Manual de 5 escenarios de incidentes con síntoma, consulta Loki, diagnóstico, resolución y escalado. | `docs/planning-artifacts/runbook-q-track.md` | ⬜ Pendiente |
| **Auditoría de Simulacro** | Registro formal del Simulacro E2E: incidente inyectado, pasos del equipo, tiempo de resolución y resultado. | `docs/planning-artifacts/auditoria-simulacro-q-track.md` | ⬜ Pendiente |
| **Suite E2E** | Tests del flujo completo de Q-Track (conductor → cola → turno → notificación) en verde. | `tests/e2e/` en el repositorio Q-Track | ⬜ Pendiente |
| **Radar de Madurez SDLC** | Puntuación del equipo en 8 ejes (1-5) con brecha vs. objetivo y plan de mejora para brechas > 2. | `docs/planning-artifacts/radar-madurez-sdlc.md` | ⬜ Pendiente |
| **Retrospectiva del Programa** | Documento con 3+ lecciones aprendidas y 3+ acciones concretas con responsable y fecha. | `docs/planning-artifacts/retrospectiva-programa.md` | ⬜ Pendiente |

---

## Criterios de Certificación del Módulo

- [ ] Runbook con 5 escenarios completos
- [ ] Simulacro aprobado: incidente resuelto en ≤ 30 minutos
- [ ] Suite E2E del flujo completo en verde
- [ ] Radar de Madurez con plan de mejora para ejes con brecha > 2
- [ ] Retrospectiva con 3+ lecciones y 3+ acciones con responsable y fecha
- [ ] Pull Request: `feature/soporte-retro-q-track` → `develop`, estado: Merged

---

*Artefactos del Módulo 6 · Corpus arquitectónico UNIMAR · Versión: 1.0*

---

## Prompts Recomendados para este Módulo

| Prompt | Propósito | Enlace |
| :--- | :--- | :--- |
| **Explicar Stack** | Generar explicación de Loki + Grafana + Promtail | [modulo-6-prompts.md#prompt-1-explicar-stack](../prompts/modulo-6-prompts.md#prompt-1-explicar-stack) |
| **Configurar Promtail** | Generar configuración de Promtail | [modulo-6-prompts.md#prompt-2-configurar-promtail](../prompts/modulo-6-prompts.md#prompt-2-configurar-promtail) |
| **Generar LogQL** | Generar 10 consultas LogQL para troubleshooting | [modulo-6-prompts.md#prompt-3-generar-logql](../prompts/modulo-6-prompts.md#prompt-3-generar-logql) |
| **Generar Runbook** | Generar Runbook con 5 escenarios de incidente | [modulo-6-prompts.md#prompt-4-generar-runbook](../prompts/modulo-6-prompts.md#prompt-4-generar-runbook) |
| **Facilitar Simulacro** | Generar guía de simulacro de incidente E2E | [modulo-6-prompts.md#prompt-5-facilitar-simulacro](../prompts/modulo-6-prompts.md#prompt-5-facilitar-simulacro) |
| **Facilitar Retrospectiva** | Generar guía de retrospectiva de programa | [modulo-6-prompts.md#prompt-6-facilitar-retrospectiva](../prompts/modulo-6-prompts.md#prompt-6-facilitar-retrospectiva) |
| **Generar Radar** | Generar Radar de Madurez SDLC | [modulo-6-prompts.md#prompt-7-generar-radar](../prompts/modulo-6-prompts.md#prompt-7-generar-radar) |

> **Tip:** Usa estos prompts en OpenCode o tu asistente de IA preferido.
