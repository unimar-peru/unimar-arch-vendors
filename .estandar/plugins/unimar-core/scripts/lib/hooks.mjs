/**
 * hooks.mjs — quiénes son los hooks del estándar, derivado y no recordado.
 *
 * Existe porque la misma lista escrita a mano ya envejeció tres veces. En
 * [G-349] `install-hooks.mjs` cableaba `pre-commit` en tres literales y se
 * quedó certificando como activa una puerta que [ADR-0170] había retirado; en
 * [G-353] la skill de alta seguía mandando copiar una plantilla que ya no
 * viajaba; en [G-354] `validate-gates-locales.mjs` exigía a todo satélite el
 * `.husky/pre-commit` que la norma acababa de retirar — y acusaba, por tanto,
 * exactamente a quien obedecía.
 *
 * El remedio no es acordarse mejor: es que nadie escriba la lista. El paquete
 * reparte una plantilla `templates/husky-<hook>.sh` por cada hook que el
 * estándar define, así que **el disco ya lo dice**. Este módulo lo lee y punto.
 *
 * DÓNDE LEE, Y POR QUÉ NO EN EL CWD. Las plantillas se buscan JUNTO A ESTE
 * FICHERO —`import.meta.url`—, no en el árbol de trabajo: los scripts corren
 * desde `.harness/scripts/` en la fuente y desde `<plugin>/scripts/` en el
 * satélite, y en ambos casos `templates/` es el directorio hermano del que
 * contiene a `scripts/`. Preguntarle al cwd haría que el estándar leyera las
 * plantillas del repositorio que está juzgando.
 *
 * QUÉ ES UN «RETIRADO», Y POR QUÉ TAMPOCO SE ESCRIBE. Un hook de git que puede
 * ABORTAR la operación que lo invoca y cuya plantilla el paquete ya no reparte
 * es una puerta que el estándar dejó de definir y que git seguiría ejecutando:
 * un segundo punto de control, que [ADR-0170] §2.3 prohíbe. Esa resta
 * —bloqueantes menos repartidos— es la lista de retirados, y por eso
 * `post-commit` no aparece nunca: corre en segundo plano y sale 0 siempre.
 *
 * [G-349]: ../../../GAPS.md
 * [G-353]: ../../../GAPS.md
 * [G-354]: ../../../GAPS.md
 * [ADR-0170]: ../../../reference/architecture/adrs/core/0170-punto-unico-de-control-local-pre-push.es.md
 */

import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Hooks de git que pueden ABORTAR la operación que los invoca. Es la lista de
 * git —githooks(5)—, no la del estándar: lo que el estándar aporta es el
 * criterio de ADR-0170 §2.3, y el criterio aplicado a esta lista da la de
 * retirados sin que nadie la escriba. Los `post-*`, `push-to-checkout` y
 * `fsmonitor-watchman` no están porque no gobiernan un acto que produzca o
 * publique historia.
 */
export const BLOQUEANTES = [
  'applypatch-msg',
  'pre-applypatch',
  'pre-commit',
  'pre-merge-commit',
  'prepare-commit-msg',
  'commit-msg',
  'pre-rebase',
  'pre-push',
];

/** El contrato del nombre: `templates/husky-<hook>.sh`. */
export const ES_PLANTILLA_DE_HOOK = /^husky-(.+)\.sh$/;

/** El `templates/` hermano del `scripts/` que contiene a este módulo. */
export const PLANTILLAS = fileURLToPath(new URL('../../templates/', import.meta.url));

/**
 * Sufijo con el que `install-hooks.mjs` NEUTRALIZA un hook retirado. Git no
 * invoca jamás un fichero con este nombre, de modo que su contenido no ejecuta
 * nada: quien lo lea buscando cableado estaría leyendo letra muerta (SD-05).
 */
export const SUFIJO_RETIRADO = '.retirado';

/**
 * Los hooks que el estándar define hoy, leídos de las plantillas que el paquete
 * reparte.
 *
 * Devuelve siempre un objeto, nunca lanza: quien llama decide si un paquete sin
 * plantillas es motivo de salir 1 —lo es para el instalador y para el
 * validador— o de otra cosa. `error` es `null` cuando la derivación es válida.
 *
 * @param {string} [dir] directorio de plantillas; por defecto el hermano real.
 * @returns {{error: null|'SIN_DIRECTORIO'|'SIN_PLANTILLAS'|'NO_BLOQUEAN',
 *            dir: string, activos: string[], retirados: string[], noBloquean: string[]}}
 */
export function hooksDelEstandar(dir = PLANTILLAS) {
  let activos;
  try {
    activos = readdirSync(dir)
      .map((n) => ES_PLANTILLA_DE_HOOK.exec(n)?.[1])
      .filter(Boolean)
      .sort();
  } catch {
    return { error: 'SIN_DIRECTORIO', dir, activos: [], retirados: [], noBloquean: [] };
  }

  if (activos.length === 0) return { error: 'SIN_PLANTILLAS', dir, activos, retirados: [], noBloquean: [] };

  const noBloquean = activos.filter((h) => !BLOQUEANTES.includes(h));
  if (noBloquean.length) return { error: 'NO_BLOQUEAN', dir, activos, retirados: [], noBloquean };

  return { error: null, dir, activos, retirados: BLOQUEANTES.filter((h) => !activos.includes(h)), noBloquean };
}

/** `pre-push` → `` `pre-push` ``; para los mensajes, sin repetir el join. */
export const lista = (hs) => hs.map((h) => `\`${h}\``).join(', ');
