# Reglas del núcleo Unimar — unimar-arch-vendors

Vinculantes en toda sesión de este repositorio, para agentes y humanos.

Este repositorio es un **satélite** de [`unimar_arch`](https://github.com/unimar-peru/unimar_arch). No define el estándar: lo **consume**, versionado, desde el plugin `unimar-core`. Los subagentes del plugin llevan sus reglas incrustadas; este archivo existe para que también la **sesión principal** las vea, porque el satélite no tiene `.harness/` ni el generador que las expondría de otro modo.

* Este repositorio **no contiene `.harness/`** (S-16). El estándar —reglas, scripts, subagentes— lo provee el plugin `unimar-core`, no una copia local. No puedes editarlo desde aquí: un hook `PreToolUse` deniega la escritura y el CI la rechaza. Para cambiar una regla o añadir un validador, **propón el cambio en `unimar_arch`** (ver [CONTRIBUTING.md](./CONTRIBUTING.md), sección «Contribuir al núcleo»).
* La evidencia precede a la afirmación (SD-05). Si no puedes enlazar la prueba, registra el pendiente en [`GAPS.md`](./GAPS.md) en vez de afirmarlo.
* Fail fast documental (SD-06): si un enlace relativo, un ancla o un bloque Mermaid no resuelve, falla la tarea y reporta la anomalía. No la asumas resuelta.
* Todo hallazgo — gap, oportunidad, riesgo o deuda — se registra en [`GAPS.md`](./GAPS.md) con su dimensión de madurez, criticidad y complejidad (SD-07).
* Toda la documentación se mantiene exclusivamente en español (SD-08). No generes pares bilingües ni archivos `.en.md`.
* Toda decisión técnica referencia un ADR **aceptado** de `unimar_arch`. Si no existe, créalo allí primero (S-06). Nunca se resuelve inventando la decisión aquí.

## Dónde está la regulación completa

La regulación la provee el plugin. Desde una sesión de Claude Code, `${CLAUDE_PLUGIN_ROOT}` apunta a la versión instalada:

* [`${CLAUDE_PLUGIN_ROOT}/rules/global-rules.md`](${CLAUDE_PLUGIN_ROOT}/rules/global-rules.md)
* [`${CLAUDE_PLUGIN_ROOT}/rules/spec-driven-rules.md`](${CLAUDE_PLUGIN_ROOT}/rules/spec-driven-rules.md)
* [`${CLAUDE_PLUGIN_ROOT}/rules/agent-rulesets.md`](${CLAUDE_PLUGIN_ROOT}/rules/agent-rulesets.md)
* [`${CLAUDE_PLUGIN_ROOT}/rules/satellite-repo-rules.md`](${CLAUDE_PLUGIN_ROOT}/rules/satellite-repo-rules.md)
* [`${CLAUDE_PLUGIN_ROOT}/rules/terminology-glossary.md`](${CLAUDE_PLUGIN_ROOT}/rules/terminology-glossary.md)

La gobernanza viva de **este** satélite:

* [`DECISIONS.md`](./DECISIONS.md)
* [`GAPS.md`](./GAPS.md)
* [`MADUREZ.md`](./MADUREZ.md)
* [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## Validadores disponibles

Los validadores viven en el plugin, no en este repositorio. Localiza la versión instalada más reciente y ejecútalos desde la raíz del satélite:

```bash
UNIMAR_CORE=$(ls -d "$HOME"/.claude/plugins/cache/unimar/unimar-core/*/ | sort -V | tail -1)

node "$UNIMAR_CORE/scripts/validate-estructura-satelite.mjs"   # .harness/ no existe; taxonomía y base intactas
node "$UNIMAR_CORE/scripts/validate-satellite-base.mjs"        # artefactos base del satélite
node "$UNIMAR_CORE/scripts/validate-docs.mjs"                  # encoding, enlaces, trazabilidad
node "$UNIMAR_CORE/scripts/validate-gaps.mjs" --fix            # registro de gaps (S-20)
node "$UNIMAR_CORE/scripts/validate-madurez.mjs"              # medición de madurez (S-19)
node "$UNIMAR_CORE/scripts/validate-correspondencia.mjs"      # cada casilla < 5 tiene su gap
node "$UNIMAR_CORE/scripts/validate-trazabilidad.mjs"        # decisiones ↔ ADRs de unimar_arch
node "$UNIMAR_CORE/scripts/validate-triaje.mjs"             # el triaje de herencia no miente
```

Con Claude Code, el barrido completo en un paso: `/unimar-core:validar-gobernanza`.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
