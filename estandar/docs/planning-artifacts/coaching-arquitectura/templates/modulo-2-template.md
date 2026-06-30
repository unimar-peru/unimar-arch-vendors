# Plantilla de Sesión — Módulo 2: Diseño y Arquitectura

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 2](../hubs/modulo-2.md) → Plantilla

---

## Acerca de esta Plantilla

Este módulo traduce los contratos de negocio (PRD y Backlog) al lenguaje técnico. El equipo construye el modelo arquitectónico que gobierna toda la implementación futura: un ADR de Persistencia debatido por los agentes Winston (Arquitecto) y Amelia (Desarrolladora) y diagramas C4 Nivel 1 y 2 en Mermaid. El resultado es el contrato técnico que todos los desarrolladores respetan durante el Módulo 3.

---

## Recursos del Módulo

| Recurso | Tipo | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| 📄 **Formato Base** | Plantilla vacía | Estructura oficial vacía para que el facilitador complete los datos de cada sesión antes de ejecutarla. | [Abrir formato base](./modulo-2-formato-base.md) |
| ✅ **Ejemplo Q-Track** | Ejemplo diligenciado | Sesión completa de 2 semanas para Q-Track: debate Winston vs. Amelia sobre persistencia, redacción del ADR con alternativas rechazadas y construcción de diagramas C4 N1 y N2 en Mermaid. | [Abrir ejemplo Q-Track](./modulo-2-ejemplo-q-track.md) |

---

## Entregable Certificado

Al completar este módulo, el equipo debe haber producido:
- ADR de Persistencia con Contexto, Decisión, Consecuencias y Alternativas Rechazadas
- Diagrama C4 Nivel 1 (Contexto del Sistema) renderizable en GitHub
- Diagrama C4 Nivel 2 (Contenedores) renderizable en GitHub
- PR mergeado a `develop` aprobado por el facilitador

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

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
