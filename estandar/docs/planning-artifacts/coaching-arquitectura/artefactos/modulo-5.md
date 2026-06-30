# Artefactos — Módulo 5: Infraestructura y Despliegue

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Plantilla](../templates/modulo-5-template.md) → Artefactos

---

## Plantillas y Ejemplos de Referencia

| Tipo | Artefacto | Enlace |
| :--- | :--- | :--- |
| 📄 **Plantilla vacía** | Release Notes | [release-notes-plantilla.md](../templates/artefactos/release-notes-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Release Notes v1.0.0 (llenado) | [release-notes-ejemplo-q-track.md](../templates/artefactos/release-notes-ejemplo-q-track.md) |

> **Instrucción:** Copia la plantilla vacía, usa el ejemplo como guía de llenado y adapta a tu proyecto.

---

## Artefactos Entregables

| Artefacto | Descripción | Ruta en el repositorio | Estado |
| :--- | :--- | :--- | :--- |
| **Dockerfile multi-stage** | Imagen optimizada de Q-Track con Stage Build (TypeScript) y Stage Runtime (JS, ~80 MB). | `Dockerfile` en la raíz del proyecto Q-Track | ⬜ Pendiente |
| **Configuración Pipeline CI/CD** | Pipeline con 3 etapas: lint ✓, test + cobertura ✓, docker build ✓. | `.github/workflows/` en el repositorio Q-Track | ⬜ Pendiente |
| **Instrumentación OpenTelemetry** | `src/tracing.ts` con trazas HTTP automáticas visibles en logs al hacer un request. | `src/tracing.ts` en el repositorio Q-Track | ⬜ Pendiente |
| **Notas de Lanzamiento v1.0** | Documento ejecutivo con versión, cambios incluidos, calidad certificada e instrucciones de despliegue. | `docs/planning-artifacts/release-notes-q-track-v1.md` | ⬜ Pendiente |

---

## Criterios de Certificación del Módulo

- [ ] `docker build -t q-track:v1.0 .` sin errores (log adjunto)
- [ ] Endpoints respondiendo desde el contenedor (`curl` o Postman)
- [ ] Traza OTel visible en logs al hacer un request al API
- [ ] Release Notes completas y firmadas
- [ ] Pull Request: `feature/infraestructura-deploy-q-track` → `develop`, estado: Merged

---

*Artefactos del Módulo 5 · Corpus arquitectónico UNIMAR · Versión: 1.0*

---

## Prompts Recomendados para este Módulo

| Prompt | Propósito | Enlace |
| :--- | :--- | :--- |
| **Explicar Multi-Stage** | Generar explicación de Docker multi-stage builds | [modulo-5-prompts.md#prompt-1-explicar-multi-stage](../prompts/modulo-5-prompts.md#prompt-1-explicar-multi-stage) |
| **Generar Dockerfile** | Generar Dockerfile multi-stage optimizado | [modulo-5-prompts.md#prompt-2-generar-dockerfile](../prompts/modulo-5-prompts.md#prompt-2-generar-dockerfile) |
| **Generar Pipeline** | Generar pipeline CI/CD con GitHub Actions | [modulo-5-prompts.md#prompt-3-generar-pipeline](../prompts/modulo-5-prompts.md#prompt-3-generar-pipeline) |
| **Instrumentar OTel** | Generar configuración de OpenTelemetry | [modulo-5-prompts.md#prompt-4-instrumentar-otel](../prompts/modulo-5-prompts.md#prompt-4-instrumentar-otel) |
| **Generar Release Notes** | Generar Release Notes completas | [modulo-5-prompts.md#prompt-5-generar-release-notes](../prompts/modulo-5-prompts.md#prompt-5-generar-release-notes) |
| **Checklist Despliegue** | Generar checklist de despliegue a producción | [modulo-5-prompts.md#prompt-6-checklist-despliegue](../prompts/modulo-5-prompts.md#prompt-6-checklist-despliegue) |

> **Tip:** Usa estos prompts en OpenCode o tu asistente de IA preferido.
