# Plantilla de Sesión — Módulo 5: Infraestructura y Despliegue

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 5](../hubs/modulo-5.md) → Plantilla

---

## Acerca de esta Plantilla

Este módulo lleva Q-Track del estado "funciona en mi máquina" a "funciona en cualquier máquina de forma predecible y observable". El Dockerfile multi-stage, el pipeline CI/CD con 3 etapas y la instrumentación OpenTelemetry son los tres pilares técnicos del módulo. Las Notas de Lanzamiento (Release Notes) son la comunicación ejecutiva formal que acompaña el primer despliegue certificado.

---

## Recursos del Módulo

| Recurso | Tipo | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| 📄 **Formato Base** | Plantilla vacía | Estructura oficial vacía para que el facilitador complete los datos de cada sesión antes de ejecutarla. | [Abrir formato base](./modulo-5-formato-base.md) |
| ✅ **Ejemplo Q-Track** | Ejemplo diligenciado | Sesión completa de 1 semana: Dockerfile multi-stage de Q-Track, pipeline CI/CD con lint + test + docker build, configuración de OpenTelemetry con trazas automáticas y Release Notes v1.0 completas. | [Abrir ejemplo Q-Track](./modulo-5-ejemplo-q-track.md) |

---

## Entregable Certificado

Al completar este módulo, el equipo debe haber producido:
- Dockerfile de Q-Track construido sin errores (`docker build`)
- Contenedor ejecutándose localmente con endpoints respondiendo (`docker run`)
- Pipeline CI/CD con 3 etapas (lint, test, docker build)
- Instrumentación OpenTelemetry activa con trazas visibles en logs
- Notas de Lanzamiento v1.0 commiteadas y firmadas

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

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
