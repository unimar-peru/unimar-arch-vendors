# Formato Base — Plantilla Vacía de Sesión

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 5](../hubs/modulo-5.md) → [Plantilla](./modulo-5-template.md) → Formato Base

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

- [ ] Docker Desktop instalado y funcionando
- [ ] RC Sellado del módulo anterior disponible como insumo
- [ ] [Referencias de Docker multi-stage y OpenTelemetry que deben revisar]

---

## Agenda

| Bloque | Actividad | Duración |
| :--- | :--- | :--- |
| 1 | [Apertura: "El costo de un despliegue manual fallido"] | [X min] |
| 2 | [Docker multi-stage: Stage Build → Stage Runtime] | [X min] |
| 3 | [Pipelines CI/CD: las 3 etapas clave] | [X min] |
| 4 | [OpenTelemetry: los 3 pilares de observabilidad] | [X min] |
| 5 | [Release Notes como comunicación ejecutiva] | [X min] |
| — | BREAK | 15 min |
| 6 | [Facilitador escribe Dockerfile multi-stage en vivo] | [X min] |
| 7 | [`docker build` y `docker run` — verificar endpoints] | [X min] |
| — | BREAK 15 min | 15 min |
| 8 | [Cada participante crea su Dockerfile en su rama] | [X min] |
| 9 | [Configurar pipeline CI/CD con 3 etapas] | [X min] |
| 10 | [Instalar OpenTelemetry SDK y verificar trazas] | [X min] |
| 11 | [Redactar Release Notes con OpenCode + commit + PR] | [X min] |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. `Dockerfile` multi-stage en la raíz del proyecto
  2. Configuración del pipeline CI/CD con 3 etapas
  3. `src/tracing.ts` con instrumentación OpenTelemetry básica
  4. Notas de Lanzamiento v[X] commiteadas
- **Criterios de aceptación:**
  - [ ] `docker build` sin errores (log adjunto)
  - [ ] Endpoints respondiendo desde el contenedor (`curl` o Postman)
  - [ ] Pipeline: lint ✓, test ✓, docker build ✓
  - [ ] Traza OTel visible en logs al hacer un request
  - [ ] Release Notes con versión, cambios, calidad y firma
- **Forma de entrega:** Pull Request: `feature/infraestructura-deploy-[producto]` → `develop`
- **Regla de oro:** Una imagen Docker que no pasa el `docker run` no es un entregable. El despliegue debe ser reproducible en cualquier máquina del equipo.

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Docker Desktop | Motor de contenedores | [docker.com](https://www.docker.com/products/docker-desktop/) |
| OpenTelemetry Node.js SDK | Instrumentación de trazas y métricas | [opentelemetry.io](https://opentelemetry.io/docs/languages/js/) |
| GitHub Actions / Pipelines | Plataforma de CI/CD | [docs.github.com/actions](https://docs.github.com/en/actions) |
| OpenCode | Generación de Release Notes | Intranet UNIMAR |
| RC Sellado (Módulo 4) | Insumo para las Release Notes | `docs/planning-artifacts/rc-sellado-[producto].md` |

---

## Notas del Facilitador

[Notas privadas, advertencias o puntos críticos. No visible para participantes.]

---

## Evidencias de Certificación

- [ ] Log de `docker build` sin errores
- [ ] Captura de `curl` o Postman respondiendo desde el contenedor
- [ ] Traza OTel en logs al hacer un request al API
- [ ] Release Notes con todos los campos y firma del responsable
- [ ] PR aprobado + merge a `develop` exitoso

---

*Formato base generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 2 | [Explicar Multi-Stage](../prompts/modulo-5-prompts.md#prompt-1-explicar-multi-stage) | Generar explicación de Docker multi-stage |
| 6 | [Generar Dockerfile](../prompts/modulo-5-prompts.md#prompt-2-generar-dockerfile) | Generar Dockerfile optimizado |
| 10 | [Generar Pipeline](../prompts/modulo-5-prompts.md#prompt-3-generar-pipeline) | Generar pipeline CI/CD |
| 11 | [Instrumentar OTel](../prompts/modulo-5-prompts.md#prompt-4-instrumentar-otel) | Generar configuración OpenTelemetry |
| 13 | [Generar Release Notes](../prompts/modulo-5-prompts.md#prompt-5-generar-release-notes) | Generar Release Notes completas |
| 14 | [Checklist Despliegue](../prompts/modulo-5-prompts.md#prompt-6-checklist-despliegue) | Generar checklist de despliegue |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
