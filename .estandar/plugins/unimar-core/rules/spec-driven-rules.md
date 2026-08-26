# Reglas Spec-Driven (SD-01 … SD-08)

<!-- vigencia: revisar-antes-de=2027-02-09 -->

> Vigencia: revisar antes del 2027-02-09 — norma publicada, repaso semestral (S-35, [ADR-0196](../reference/architecture/adrs/core/0196-la-vigencia-se-declara-donde-puede-sostenerse-verdadera.es.md), `Aceptado`: es la decisión que crea S-35).
> **Propietario:** Architecture Board
> **Alcance:** `unimar_arch` y todo repositorio satélite. Vinculante para agentes BMAD y contribuidores humanos.
> **Regla de herencia:** S-22

El glosario corporativo define **Spec-driven AI-DD** como «flujo de desarrollo impulsado por especificaciones generadas y validadas por IA». Este documento convierte esa definición en reglas ejecutables.

La idea central: **la especificación precede al código, y la evidencia precede a la afirmación.**

## SD-01 — La especificación precede a la implementación

Todo cambio de producto arranca de un artefacto SDLC de su fase, instanciado desde la plantilla canónica (S-01). No se escribe código para satisfacer una intención que no está escrita.

Excepción: correcciones triviales sin cambio de comportamiento observable (formato, typo, enlace roto).

## SD-02 — Trazabilidad bidireccional

Toda cadena `historia → ADR → commit` debe poder recorrerse en ambos sentidos:

- La historia referencia el ADR que la habilita.
- El commit referencia la historia o el gap que cierra.
- El ADR enumera las consecuencias que otros artefactos deben absorber.

Un eslabón que no resuelve es una anomalía: falla la tarea y repórtala (SD-06).

**Una cita a otro repositorio se califica: `<repositorio>#<id>`.** `unimar_arch#G-287`,
`unimar_tms#ADR-TMS-004`. Un `G-287` a secas afirma que ese gap está en el registro de ESTE
repositorio; si no lo está, el eslabón cuelga y la puerta lo rechaza, con razón. Escribirlo en prosa
—«registrado como G-287 en unimar_arch»— no basta: para un humano es claro, para el validador es
indistinguible de una cita propia. La forma calificada se excluye del barrido local por
construcción; **no se comprueba que exista en el otro repositorio**, porque este validador no lo
tiene delante y afirmar lo que no se puede verificar es lo que SD-05 prohíbe.

**El momento importa tanto como la forma.** La referencia se comprueba **antes de publicar** y solo
sobre lo que se publica: el hook `pre-push` invoca `validate-trazabilidad.mjs` sin banderas, y su
rango por defecto —`HEAD --not --remotes`, los commits que ninguna referencia remota alcanza— es
justo la carga del push. Esa definición del rango es la que garantiza el remedio: la puerta nunca
puede morder un mensaje ya publicado —que no se corrige sin reescribir historia ajena y de paso
bloquearía a quien no lo escribió—, y sí muerde el que todavía es tuyo, reescribible con
`git rebase -i` y `reword` sin conflicto posible. El modo `--mensaje` sigue existiendo para juzgar
un mensaje suelto, pero ya no hay un hook del estándar que lo invoque (ADR-0170).

## SD-03 — La decisión precede a la implementación

Ninguna decisión técnica se toma en el código. Se toma en un ADR con `Status: Accepted` en `unimar_arch`. Si el ADR no existe, se crea allí **primero** (S-06).

Elegir una librería, un motor de base de datos, un patrón de mensajería o una topología de despliegue son decisiones técnicas. Nombrar una variable no lo es.

## SD-04 — Criterios de aceptación verificables

Un criterio de aceptación que no se puede ejecutar no es un criterio: es un deseo. Cada criterio debe ser comprobable por una prueba, un validador o una inspección con resultado binario.

«El sistema debe ser rápido» no es un criterio. «p95 < 200 ms bajo 500 rps» sí.

## SD-05 — La evidencia precede a la afirmación

Esta es la regla que sostiene a las demás.

- Un nivel de madurez ≥ 2 exige evidencia enlazada (S-19).
- Un gap `Cerrado` exige commit, PR o ADR (S-20).
- Una operación `Adopt` en `DECISIONS.md` exige que el control exista en el repositorio.

Afirmar sin evidencia no es un error de estilo: es un dato falso que otros heredarán. Si no puedes enlazar la prueba, declara el pendiente en `GAPS.md` en lugar de afirmar.

## SD-06 — Fail fast documental

Si un enlace relativo, un ancla Markdown o un bloque Mermaid no resuelve, **falla la tarea y reporta la anomalía**. No la asumas resuelta, no la silencies, no la dejes para después.

Un validador que devuelve `OK` sobre un repositorio roto es peor que no tener validador: crea confianza falsa.

## SD-07 — Todo hallazgo se registra

Cualquier gap, oportunidad, riesgo o deuda detectado durante el trabajo se registra en `GAPS.md` con su dimensión de madurez, su criticidad y su complejidad (S-20). No se guarda en la cabeza de nadie ni en el cuerpo de un PR.

Cerrar un hallazgo también es un registro: se actualiza su estado y se enlaza la evidencia.

## SD-08 — Idioma único

Toda la documentación se mantiene exclusivamente en español (S-09). Las únicas excepciones son las declaradas en [`terminology-glossary.md`](./terminology-glossary.md): acrónimos, identificadores de código, nombres propios y marcas.

---

## Cómo lo aplica un agente

Los agentes BMAD cargan estas reglas como contexto permanente. Ver [`agent-rulesets.md`](./agent-rulesets.md) para el ruleset concreto de cada agente y los validadores que debe ejecutar.

| Regla | Validador que la hace cumplir |
| :--- | :--- |
| SD-05 | `validate-madurez.mjs`, `validate-gaps.mjs` |
| SD-06 | `validate-docs.mjs`, `validate-trazabilidad.mjs` |
| SD-07 | `validate-gaps.mjs` |
| SD-08 | `validate-docs.mjs`, `markdownlint` |

SD-01 a SD-04 no son verificables por script: las hace cumplir la revisión humana y el ruleset del agente.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
