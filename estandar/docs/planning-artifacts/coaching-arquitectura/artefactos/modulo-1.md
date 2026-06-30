# Artefactos — Módulo 1: Requisitos y Producto

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Plantilla](../templates/modulo-1-template.md) → Artefactos

---

## Plantillas y Ejemplos de Referencia

| Tipo | Artefacto | Enlace |
| :--- | :--- | :--- |
| 📄 **Plantilla vacía** | PRD (Product Requirements Document) | [prd-plantilla.md](../templates/artefactos/prd-plantilla.md) |
| ✅ **Ejemplo Q-Track** | PRD (llenado) | [prd-ejemplo-q-track.md](../templates/artefactos/prd-ejemplo-q-track.md) |
| 📄 **Plantilla vacía** | Backlog Ágil BDD | [backlog-bdd-plantilla.md](../templates/artefactos/backlog-bdd-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Backlog Ágil BDD (llenado) | [backlog-bdd-ejemplo-q-track.md](../templates/artefactos/backlog-bdd-ejemplo-q-track.md) |

> **Instrucción:** Copia las plantillas vacías, usa los ejemplos como guía de llenado y adapta a tu proyecto.

---

## Prompts Recomendados para este Módulo

| Prompt | Propósito | Enlace |
| :--- | :--- | :--- |
| **Explicar Bounded Contexts** | Generar explicación clara de DDD para equipo mixto | [modulo-1-prompts.md#prompt-1-explicar-bounded-contexts](../prompts/modulo-1-prompts.md#prompt-1-explicar-bounded-contexts) |
| **Identificar Contextos** | Identificar Bounded Contexts específicos para tu producto | [modulo-1-prompts.md#prompt-2-identificar-contextos](../prompts/modulo-1-prompts.md#prompt-2-identificar-contextos) |
| **Generar PRD** | Generar borrador completo de PRD | [modulo-1-prompts.md#prompt-3-generar-prd](../prompts/modulo-1-prompts.md#prompt-3-generar-prd) |
| **Generar Historias BDD** | Generar backlog de 10-15 historias en formato BDD | [modulo-1-prompts.md#prompt-4-generar-historias-bdd](../prompts/modulo-1-prompts.md#prompt-4-generar-historias-bdd) |
| **Priorizar MoSCoW** | Facilitar sesión de priorización con el equipo | [modulo-1-prompts.md#prompt-5-priorizar-moscow](../prompts/modulo-1-prompts.md#prompt-5-priorizar-moscow) |
| **Validar PRD** | Checklist de validación antes de aprobar | [modulo-1-prompts.md#prompt-6-validar-prd](../prompts/modulo-1-prompts.md#prompt-6-validar-prd) |

> **Tip:** Usa estos prompts en OpenCode o tu asistente de IA preferido. Copia y pega el prompt exacto desde el enlace.

---

## Artefactos Entregables

| Artefacto | Descripción | Ruta en el repositorio | Estado |
| :--- | :--- | :--- | :--- |
| **PRD de Q-Track** | Product Requirements Document con Visión, Problema, Objetivos, Usuarios, Alcance y Fuera de Alcance. | `docs/planning-artifacts/prd-q-track.md` | ⬜ Pendiente |
| **Backlog Ágil BDD** | Lista de 10+ historias de usuario en formato `Given / When / Then`, priorizadas con MoSCoW. | `docs/planning-artifacts/backlog-q-track.md` | ⬜ Pendiente |
| **Diagrama de Bounded Contexts** | Mapa Mermaid con al menos 3 contextos del dominio logístico aduanero de Q-Track. | Sección del PRD o documento independiente | ⬜ Pendiente |

---

## Criterios de Certificación del Módulo

- [ ] PRD con todas las secciones completas
- [ ] Backlog con 10+ historias BDD y priorización MoSCoW documentada
- [ ] Diagrama Mermaid de Bounded Contexts renderizable en GitHub
- [ ] Pull Request: `feature/prd-backlog-q-track` → `develop`, estado: Merged

---

*Artefactos del Módulo 1 · Corpus arquitectónico UNIMAR · Versión: 1.0*
