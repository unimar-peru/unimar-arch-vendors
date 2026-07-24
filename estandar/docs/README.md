# docs/ — Artefactos de Planificación e Implementación BMAD

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch--%20Artefactos%20de%20Planificaci%C3%B3n%20e%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../README.md) / Artefactos de Planificación**

> **Estado:** Activo | **Propietario:** Unimar (<https://www.unimar.com.pe/>) | **Driver:** BMAD Method

Este directorio contiene los **artefactos de planificación e implementación específicos del producto** generados por el workflow de BMAD Method. Es distinto del corpus `reference/`, que contiene la referencia arquitectónica.

> Las dos capas no se solapan. Las decisiones arquitectónicas viven en `reference/architecture/adrs/`. Los planes de producto viven aquí. Ver [`../AGENTS.md`](../AGENTS.md) § Frontera de Carpetas para la regla completa.

## Áreas

<details>
<summary><strong>Planificación e implementación: briefs, PRDs, épicas, sprints, retrospectivas</strong></summary>

| Área | Propósito |
| :--- | :--- |
| `planning-artifacts/` | Briefs de producto, research, PRDs, diseños UX, épicas, historias, briefs de arquitectura generados por BMAD |
| `implementation-artifacts/` | Estado de sprint, reviews de historias, retrospectivas, salidas de Quick-Flow |

</details>

## Configuración BMAD

<details>
<summary><strong>Parámetros por defecto del método BMAD en <code>_bmad/config.toml</code></strong></summary>

La configuración por defecto de BMAD (de `_bmad/config.toml`) es:

- `document_output_language = "spanish"`
- `output_folder = "docs"`
- `bmm.planning_artifacts = "{project-root}/docs/planning-artifacts"`
- `bmm.implementation_artifacts = "{project-root}/docs/implementation-artifacts"`
- `bmm.project_knowledge = "docs"`

</details>

## Skills de BMAD (opencode)

<details>
<summary><strong>59 skills CLI: help, brief, PRD, epics, dev-story, retro, document-project</strong></summary>

BMAD provee 59 skills/comandos bajo `.opencode/commands/`. Puntos de entrada clave:

- `/bmad-help` — guía interactiva
- `/bmad-product-brief` o `/bmad-brainstorming` — ideación
- `/bmad-prd` o `/bmad-spec` — PRDs y specs
- `/bmad-create-architecture` — briefs de arquitectura
- `/bmad-create-epics-and-stories` — épicas e historias
- `/bmad-dev-story` — implementación de historia
- `/bmad-retrospective` — retrospectiva
- `/bmad-document-project` — documentar un codebase existente
- `/bmad-generate-project-context` — generar contexto del proyecto

</details>

## Separación de Capas Documentales

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
