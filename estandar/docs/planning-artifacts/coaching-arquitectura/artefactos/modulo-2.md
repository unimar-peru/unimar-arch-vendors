# Artefactos — Módulo 2: Diseño y Arquitectura

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Plantilla](../templates/modulo-2-template.md) → Artefactos

---

## Plantillas y Ejemplos de Referencia

| Tipo | Artefacto | Enlace |
| :--- | :--- | :--- |
| 📄 **Plantilla vacía** | ADR (Architecture Decision Record) | [adr-plantilla.md](../templates/artefactos/adr-plantilla.md) |
| ✅ **Ejemplo Q-Track** | ADR-001 Persistencia (llenado) | [adr-ejemplo-q-track.md](../templates/artefactos/adr-ejemplo-q-track.md) |
| 📄 **Plantilla vacía** | Diagramas C4 (Contexto y Contenedores) | [c4-plantilla.md](../templates/artefactos/c4-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Diagramas C4 (llenado) | [c4-ejemplo-q-track.md](../templates/artefactos/c4-ejemplo-q-track.md) |

> **Instrucción:** Copia las plantillas vacías, usa los ejemplos como guía de llenado y adapta a tu proyecto.

---

## Prompts Recomendados para este Módulo

| Prompt | Propósito | Enlace |
| :--- | :--- | :--- |
| **Explicar ADRs** | Generar explicación clara de Architecture Decision Records | [modulo-2-prompts.md#prompt-1-explicar-adrs](../prompts/modulo-2-prompts.md#prompt-1-explicar-adrs) |
| **Explicar C4** | Generar explicación del modelo C4 con ejemplos | [modulo-2-prompts.md#prompt-2-explicar-c4](../prompts/modulo-2-prompts.md#prompt-2-explicar-c4) |
| **Explicar Hexagonal** | Generar explicación de Arquitectura Hexagonal | [modulo-2-prompts.md#prompt-3-explicar-hexagonal](../prompts/modulo-2-prompts.md#prompt-3-explicar-hexagonal) |
| **Winston Propuesta** | Generar propuesta de arquitectura (perspectiva arquitecto) | [modulo-2-prompts.md#prompt-4-winston-propuesta](../prompts/modulo-2-prompts.md#prompt-4-winston-propuesta) |
| **Amelia Crítica** | Generar crítica a propuesta (perspectiva desarrollador) | [modulo-2-prompts.md#prompt-5-amelia-crítica](../prompts/modulo-2-prompts.md#prompt-5-amelia-crítica) |
| **Generar ADR** | Generar ADR completo basado en debate | [modulo-2-prompts.md#prompt-6-generar-adr](../prompts/modulo-2-prompts.md#prompt-6-generar-adr) |
| **Generar C4 N1** | Generar diagrama C4 Nivel 1 (Contexto) | [modulo-2-prompts.md#prompt-7-generar-c4-n1](../prompts/modulo-2-prompts.md#prompt-7-generar-c4-n1) |
| **Generar C4 N2** | Generar diagrama C4 Nivel 2 (Contenedores) | [modulo-2-prompts.md#prompt-8-generar-c4-n2](../prompts/modulo-2-prompts.md#prompt-8-generar-c4-n2) |

> **Tip:** Usa estos prompts en OpenCode o tu asistente de IA preferido. Copia y pega el prompt exacto desde el enlace.

---

## Artefactos Entregables

| Artefacto | Descripción | Ruta en el repositorio | Estado |
| :--- | :--- | :--- | :--- |
| **ADR-001 Persistencia Q-Track** | Architecture Decision Record con Contexto, Decisión, Consecuencias y Alternativas Rechazadas. | `reference/architecture/adrs/adr-001-persistencia-q-track.md` | ⬜ Pendiente |
| **Diagrama C4 Nivel 1** | Diagrama de Contexto del Sistema Q-Track (actores, sistema y sistemas externos) en Mermaid. | `docs/planning-artifacts/arquitectura-q-track.md` | ⬜ Pendiente |
| **Diagrama C4 Nivel 2** | Diagrama de Contenedores (API, BD PostgreSQL, Broker XMS, Frontend) en Mermaid. | `docs/planning-artifacts/arquitectura-q-track.md` | ⬜ Pendiente |

---

## Criterios de Certificación del Módulo

- [ ] ADR en `reference/architecture/adrs/` con número secuencial
- [ ] Al menos 1 alternativa rechazada con justificación de negocio
- [ ] C4 N1 y N2 renderizables en GitHub sin errores de sintaxis
- [ ] Pull Request: `feature/arquitectura-q-track` → `develop`, estado: Merged

---

*Artefactos del Módulo 2 · Corpus arquitectónico UNIMAR · Versión: 1.0*
