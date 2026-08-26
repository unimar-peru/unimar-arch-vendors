# Convenciones para agentes — NOMBRE_DEL_SATELITE

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Reglas:** S-16, S-21, SD-07, SD-08

Este repositorio es un **satélite** de [`unimar_arch`](https://github.com/unimar-peru/unimar_arch). Todo agente que opere aquí acata estas convenciones. La regulación completa está en [CLAUDE.md](./CLAUDE.md) y en las reglas que provee el plugin `unimar-core`.

- **Idioma español (SD-08).** Toda la documentación y los comentarios de código en español. Sin pares bilingües ni archivos `.en.md`.
- **`.harness/` no existe aquí (S-16).** El estándar lo provee el plugin `unimar-core`, versionado. No lo copies ni lo edites desde este repositorio. Para cambiarlo, propón el cambio en `unimar_arch` (ver [CONTRIBUTING.md](./CONTRIBUTING.md)).
- **Zona protegida.** No edites `.claude/agents/` ni `.claude/settings.json`: los provee y gobierna el plugin (S-21). Un hook `PreToolUse` deniega la escritura.
- **Todo hallazgo a [`GAPS.md`](./GAPS.md) (SD-07).** Gap, oportunidad, riesgo o deuda que descubras, con su dimensión de madurez, criticidad y complejidad. Nunca solo en el cuerpo del PR.
- **Toda decisión técnica referencia un ADR aceptado de `unimar_arch` (S-06).** Si no existe, se crea allí primero. No se inventa la decisión aquí.

Ante cualquier duda de gobernanza, remite a [CLAUDE.md](./CLAUDE.md) y a `${CLAUDE_PLUGIN_ROOT}/rules/*.md`.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
