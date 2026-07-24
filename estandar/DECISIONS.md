# DECISIONS.md — Unimar Arch

Propietario del repositorio: **Unimar** (<https://www.unimar.com.pe/>)

Este documento registra las **decisiones arquitectónicas** de Unimar Arch, el triaje de patrones y las convenciones de registro. Las operaciones (Adoptar / Extender / Sobrescribir / N/A) son una **convención de registro** que Unimar usa para gestionar qué patrones sigue, adapta o descarta. Son ayudas de registro, no obligaciones contractuales.

## Estado del Triage

| ID    | Título | Operación | Referencia | ADR Local | Notas |
| :---- | :---- | :-------- | :--------- | :-------- | :---- |
| C-001 | Repository Taxonomy (kebab-case, corpus `reference/`) | Adopt | [Repository Taxonomy](./reference/governance/standards/taxonomia-repositorio.md) | — | Sin divergencia |
| C-002 | Documentación en español único (sin pares bilingües) | Adopt | [AGENTS.md](./AGENTS.md) § Idioma de la Documentación | — | Decisión local de Unimar Arch |
| C-003 | Validación en CI vía plugin `unimar-core` | Adopt | Validador `validate-docs.mjs` provisto por el plugin `unimar-core` (`$UNIMAR_CORE/scripts/validate-docs.mjs`) | — | Obligatorio en CI |
| C-004 | BMAD Method para desarrollo dirigido por IA | Extend | [BMAD Method](https://docs.bmad-method.org/) | (local) | BMAD v6.8.0 instalado; agentes configurados para opencode |
| C-005 | Documentos legales consolidados en `license/` | Extend | [LICENSE](./license/LICENSE) | [license/NOTICE.md](./license/NOTICE.md), [license/DISCLAIMER.md](./license/DISCLAIMER.md) | Convención local: LICENSE, NOTICE y DISCLAIMER viven en `license/`, no en la raíz |
| C-006 | Conocimiento de dominio bajo `reference/knowledge/dominio/` | Adopt | [Guía de Herencia](./reference/governance/standards/onboarding/guia-herencia-repositorio-hijo.md) | — | El contenido de dominio local vive aquí |

## Convención para ADRs Locales

Los ADRs locales siguen el formato estándar corporativo, con dos campos adicionales en la cabecera:

- `Extends: ADR-NNNN` — cuando se construye sobre un ADR de referencia sin contradecirlo
- `Overrides: ADR-NNNN` — cuando se diverge explícitamente (requiere sección `Divergence Justification`)

Los ADRs se almacenan bajo `reference/architecture/adrs/` usando el patrón `NNNN-descriptive-title.md`.
