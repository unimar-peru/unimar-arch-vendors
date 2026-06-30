# Ejemplo Q-Track — Módulo 6: Soporte y Retrospectiva

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 6](../hubs/modulo-6.md) → [Plantilla](./modulo-6-template.md) → Ejemplo Q-Track

Sesión real completamente diligenciada usando el proyecto **Q-Track (Gestor de Colas de Camiones)** como caso de referencia.

---

# Sesión: Módulo 6 — Soporte y Retrospectiva (Loki + Simulacro + Radar SDLC)

**Fecha:** 2025-04-07 al 2025-04-30   **Duración:** 4 semanas (1 sesión teórica + 4 talleres + Simulacro + certificación)
**Facilitador:** Alberto Arroyo   **Participantes:** Equipo completo UNIMAR

---

## Propósito de la Sesión

Completar el ciclo SDLC con Q-Track operativo en staging y transferir el conocimiento a la operación real de UNIMAR. Al finalizar, el equipo contará con un Runbook de 5 escenarios probado en un Simulacro real de 30 minutos, una suite E2E del flujo completo de Q-Track en verde, y un Radar de Madurez SDLC que muestra objetivamente cuánto creció el equipo y cuál es la hoja de ruta de mejora continua para el trimestre siguiente.

---

## Pre-work Obligatorio

- [x] Stack de observabilidad listo: Loki + Grafana + Promtail con Docker Compose
- [x] Revisar Release Notes v1.0 y RC Sellado del Módulo 5
- [x] Leer sobre LogQL: [https://grafana.com/docs/loki/latest/query/](https://grafana.com/docs/loki/latest/query/)
- [x] Leer sobre Runbooks: [https://sre.google/sre-book/table-of-contents/](https://sre.google/sre-book/table-of-contents/) (capítulo Runbooks)

---

## Agenda

| Bloque | Actividad | Duración | Prompt IA |
| :--- | :--- | :--- | :--- |
| 1 | Apertura: "El incidente de las 2 AM sin Runbook" (caso real UNIMAR) | 15 min | — |
| 2 | Loki en 20 min: arquitectura, Promtail, queries LogQL básicas | 20 min | [Prompt 1: Explicar Stack](../prompts/modulo-6-prompts.md#prompt-1-explicar-stack) |
| 3 | Tests E2E: cuándo y cuáles (completar la Pirámide de Testing) | 15 min | — |
| 4 | Radar de Madurez SDLC: los 8 ejes y cómo se evalúan | 20 min | — |
| 5 | Reglas del Simulacro: tiempo límite, herramientas permitidas, rol del facilitador | 10 min | — |
| — | BREAK | 10 min | — |
| 6 | Levantar Loki + Grafana + Q-Track con Docker Compose | 30 min | [Prompt 2: Configurar Promtail](../prompts/modulo-6-prompts.md#prompt-2-configurar-promtail) |
| 7 | Queries LogQL en vivo: filtrar por servicio, nivel error, ventana de tiempo | 30 min | [Prompt 3: Generar LogQL](../prompts/modulo-6-prompts.md#prompt-3-generar-logql) |
| 8 | Facilitador inyecta error → equipo lo detecta con Loki | 30 min | — |
| — | BREAK 15 min | 15 min | — |
| 9 | Estructura del Runbook + documentar Escenario 1 juntos | 45 min | [Prompt 4: Generar Runbook](../prompts/modulo-6-prompts.md#prompt-4-generar-runbook) |
| 10 | Documentar Escenarios 2-5 (trabajo en paralelo por subgrupos) | 90 min | — |
| 11 | Revisión y consolidación del Runbook completo | 30 min | — |
| 12 | Escribir suite E2E del flujo completo Q-Track (Supertest) | 90 min | — |
| 13 | **SIMULACRO E2E** (evento especial, 4 horas) | 240 min | [Prompt 5: Facilitar Simulacro](../prompts/modulo-6-prompts.md#prompt-5-facilitar-simulacro) |
| 14 | Debriefing post-simulacro + actualización del Runbook | 30 min | — |
| 15 | Auto-evaluación del Radar de Madurez (individual → consolidación) | 60 min | [Prompt 7: Generar Radar](../prompts/modulo-6-prompts.md#prompt-7-generar-radar) |
| 16 | Retrospectiva del programa completo | 45 min | [Prompt 6: Facilitar Retrospectiva](../prompts/modulo-6-prompts.md#prompt-6-facilitar-retrospectiva) |
| 17 | Cierre y acto de graduación | 30 min | — |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. Runbook en `docs/planning-artifacts/runbook-q-track.md` con 5 escenarios
  2. Auditoría de Simulacro en `docs/planning-artifacts/auditoria-simulacro-q-track.md`
  3. Suite E2E en `tests/e2e/` en verde
  4. Radar de Madurez en `docs/planning-artifacts/radar-madurez-sdlc.md`
  5. Retrospectiva en `docs/planning-artifacts/retrospectiva-programa.md`
- **Criterios de aceptación (los 5 deben cumplirse):**
  - [x] Runbook: 5 escenarios con síntoma, diagnóstico, resolución y escalado
  - [x] Simulacro aprobado: incidente resuelto en ≤ 30 minutos
  - [x] Suite E2E: flujo completo (conductor → cola → turno → notificación) en verde
  - [x] Radar con puntuación en 8 ejes + plan de mejora para ejes con brecha > 2
  - [x] Retrospectiva con 3+ lecciones aprendidas y 3+ acciones con responsable y fecha
- **Forma de entrega:** Pull Request: `feature/soporte-retro-q-track` → `develop`

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Loki | Agregación y consulta de logs | [grafana.com/oss/loki](https://grafana.com/oss/loki/) |
| Grafana | Visualización de logs y métricas | [grafana.com/grafana](https://grafana.com/grafana/) |
| Promtail | Agente de recolección de logs | [grafana.com/docs/loki/promtail](https://grafana.com/docs/loki/latest/send-data/promtail/) |
| LogQL | Lenguaje de consultas de Loki | [grafana.com/docs/loki/query](https://grafana.com/docs/loki/latest/query/) |
| Playwright / Supertest | Tests E2E del API | [playwright.dev](https://playwright.dev/) |
| OpenCode (skill bmad-retrospective) | Generación de la Retrospectiva | `bmad-retrospective` en OpenCode |

---

## Runbook — 5 Escenarios Q-Track

### Escenario 1: API Q-Track no responde

| Campo | Contenido |
| :--- | :--- |
| **Síntomas** | `curl` devuelve "Connection refused" o timeout en todos los endpoints |
| **Consulta Loki** | `{service="q-track-api"} \|= "error" \| json \| line_format "{{.level}} {{.message}}"` |
| **Diagnóstico** | 1. `docker ps \| grep q-track` → verificar si el contenedor está corriendo. 2. Si no: `docker logs q-track-api --tail 50`. 3. Verificar disponibilidad de PostgreSQL con health check |
| **Resolución** | 1. Si error de BD: `docker restart postgres-q-track && sleep 10 && docker restart q-track-api`. 2. Si OOM: `docker stats` → aumentar límite de memoria |
| **Escalado** | Si no se resuelve en 15 min → Slack @aarroyo (Alberto Arroyo) |

### Escenario 2: Los turnos no avanzan de estado

| Campo | Contenido |
| :--- | :--- |
| **Síntomas** | `PATCH /turnos/{id}/avanzar` devuelve 200 pero el estado no cambia en BD |
| **Consulta Loki** | `{service="q-track-api"} \|= "avanzar" \| json \| line_format "{{.turnoId}} {{.estadoAnterior}} {{.estadoNuevo}}"` |
| **Diagnóstico** | 1. Buscar "commit" o "rollback" en logs de transacción. 2. `SELECT id, estado FROM turnos WHERE id = '[id]'`. 3. Verificar bloqueos: `SELECT * FROM pg_locks WHERE granted = false` |
| **Resolución** | 1. Si hay lock: identificar con `pg_blocking_pids()` y terminar la transacción bloqueante. 2. Si bug de código: revisar `AvanzarTurno.ts` |
| **Escalado** | Si persiste > 20 min en horario operativo → escalar a Desarrollo |

### Escenario 3: Notificaciones detenidas

| Campo | Contenido |
| :--- | :--- |
| **Síntomas** | Conductores reportan que no reciben alertas de sus turnos |
| **Consulta Loki** | `{service="q-track-api"} \|= "notificacion" \|= "error"` |
| **Diagnóstico** | 1. `docker ps \| grep xms` → verificar Message Broker. 2. Consultar cola de mensajes fallidos en XMS. 3. Revisar logs del servicio de notificaciones |
| **Resolución** | 1. Si XMS caído: `docker restart xms-broker && sleep 5`. Las notificaciones pendientes se reenvían automáticamente. 2. Si error de config: verificar variables de entorno de conexión al broker |
| **Escalado** | Si XMS no reinicia en 10 min → escalar a Infraestructura |

### Escenario 4: Base de datos saturada (demasiadas conexiones)

| Campo | Contenido |
| :--- | :--- |
| **Síntomas** | Errores 500 en todos los endpoints + logs con "too many connections" |
| **Consulta Loki** | `{service="q-track-api"} \|= "connection" \|= "pool"` |
| **Diagnóstico** | 1. `SELECT count(*) FROM pg_stat_activity WHERE datname = 'q_track'`. 2. Verificar límite del pool: variable `DB_POOL_MAX` en el entorno |
| **Resolución** | 1. `docker restart q-track-api` para liberar conexiones colgadas. 2. Si persiste: aumentar `max_connections` en PostgreSQL (requiere reinicio de BD) |
| **Escalado** | Si se reinicia > 2 veces en 1 hora → escalar a DBA |

### Escenario 5: Pipeline CI fallando en docker build

| Campo | Contenido |
| :--- | :--- |
| **Síntomas** | GitHub Actions marca en rojo la etapa "build" |
| **Consulta Loki** | N/A — revisar directamente el log del pipeline en GitHub Actions |
| **Diagnóstico** | 1. Revisar log del pipeline en la sección "docker build". 2. Reproducir localmente: `docker build -t q-track:debug .`. 3. Verificar si el error es de dependencias (npm install) o de compilación TypeScript |
| **Resolución** | 1. Si es dependencia: actualizar `package-lock.json` y volver a commitear. 2. Si es error TypeScript: `npm run build` localmente para ver el error exacto |
| **Escalado** | Si no es reproducible localmente → escalar a Desarrollo |

---

## Radar de Madurez SDLC — Q-Track Team (Post-programa)

| Eje | Puntuación | Objetivo | Brecha | Acción de mejora |
| :--- | :--- | :--- | :--- | :--- |
| Versionado GitFlow | 4 | 5 | -1 | Adoptar GitFlow también en proyectos legacy |
| Testing Unitario | 4 | 5 | -1 | Elevar cobertura al 90% en el próximo sprint |
| Tests de Integración | 3 | 4 | -1 | Añadir 3 escenarios adicionales de borde |
| Documentación | 4 | 5 | -1 | Completar ADRs de componentes legacy |
| CI/CD Automatizado | 3 | 5 | -2 | Añadir etapa de deploy automático a staging |
| Observabilidad OTel | 2 | 4 | -2 | Implementar dashboards Grafana + alertas |
| Tests E2E | 2 | 4 | -2 | Ampliar suite al flujo de documentación aduanera |
| Cultura de ADRs | 3 | 5 | -2 | Exigir ADR en cada decisión técnica relevante |

---

## Notas del Facilitador

- El Simulacro es el evento de mayor adrenalina del programa. Mantener un ambiente de tensión controlada (no hostil). El objetivo es aprender, no culpar. Si el equipo resuelve en < 20 min, el Runbook es excelente; si tarda > 30 min, hay vacíos que deben llenarse en el debriefing.
- El Radar de Madurez puede generar debate sobre las puntuaciones. No forzar consenso; registrar puntuaciones individuales y promediar. Los desacuerdos son información valiosa.
- La Retrospectiva del programa es el momento de mayor emoción colectiva. Dar espacio para que el equipo comparta cómo se sintió al inicio vs. al final. Este momento cementa la transformación cultural.

---

## Evidencias de Certificación

- [x] Runbook con 5 escenarios completos en `docs/planning-artifacts/runbook-q-track.md`
- [x] Auditoría de Simulacro: tiempo de resolución ≤ 30 min, pasos documentados
- [x] Suite E2E: flujo completo Q-Track en verde (conductor → cola → turno → notificación)
- [x] Radar de Madurez con puntuación en 8 ejes + plan de mejora para brecha > 2
- [x] Retrospectiva con 3+ lecciones y 3+ acciones con responsable y fecha
- [x] PR: `feature/soporte-retro-q-track` → `develop`, estado: **Merged**
- [x] 🏆 Certificados de finalización del programa emitidos para todos los participantes

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
