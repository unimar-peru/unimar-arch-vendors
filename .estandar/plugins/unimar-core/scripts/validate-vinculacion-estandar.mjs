#!/usr/bin/env node
/**
 * validate-vinculacion-estandar.mjs — qué estándar consume este satélite se lee
 * del repositorio, no de la máquina de quien lo configuró (S-28, ADR-0180).
 *
 * EL DEFECTO QUE CIERRA (G-173)
 * -----------------------------
 * El 2026-07-18 se midió que la referencia a `unimar-core` vivía únicamente en
 * `.claude/settings.local.json`, que git ignora POR DISEÑO. Remedido el
 * 2026-08-08 el corpus ya no es ese: `unimar-shells` y `unimar-scm` fijan
 * `STANDARD_REF` en `.github/workflows/gobernanza.yml`, que sí es un fichero
 * versionado y revisable en un diff. El hallazgo que QUEDA es más estrecho, y son
 * tres formas de lo mismo:
 *
 *   1. AUSENCIA — `unimar-ums` no tiene `gobernanza.yml`: su `.github/` contiene
 *      solo `CODEOWNERS`. Su vinculación al estándar no está escrita en ninguna
 *      parte del repositorio, y ninguna puerta lo decía.
 *   2. PIN DECORATIVO — el propio `gobernanza.yml` de `unimar-scm` lleva anotado
 *      su arreglo: «STANDARD_REF y dejaba el checkout sin `ref` — el pin existia
 *      en el comentario». Declarar la versión y no usarla en el `ref:` del
 *      checkout deja el CI trayéndose la rama por defecto del marketplace,
 *      mientras el diff enseña una versión fijada que no gobierna nada.
 *   3. REFERENCIA MÓVIL — apuntar a `main` renuncia a builds reproducibles: el
 *      veredicto del CI cambia porque alguien publicó, sin ningún commit aquí.
 *
 * EL SEGUNDO DEFECTO QUE CIERRA (G-403): ACUSABA A QUIEN CUMPLÍA
 * -------------------------------------------------------------
 * Hasta el 2026-08-09 esta puerta miraba UN solo domicilio y declaraba
 * incumplidor a `unimar-arch-vendors`, mientras `validate-deriva-estandar.mjs`
 * medía su pin en `unimar-core-1.58.0` leyéndolo de `.estandar/PROCEDENCIA.txt`,
 * domicilio que ADR-0195 D2 admite expresamente. El estándar se contradecía
 * sobre el mismo repositorio, y es la acusación a quien cumple que ADR-0160 §1.4
 * identifica como el origen de las puertas que acaban desactivadas.
 *
 * La lista de domicilios ya no vive aquí: vive en `lib/domicilios-pin.mjs`, de
 * donde beben ESTA puerta y la de la deriva (ADR-0202). Un valor duplicado en
 * dos ficheros vuelve a divergir, que es exactamente lo que pasó.
 *
 * UN REPOSITORIO, UN DOMICILIO. Admitir dos no es admitir dos declaraciones del
 * mismo hecho: si un repositorio declara en los dos y NO coinciden, esta puerta
 * bloquea, porque ese es el defecto de G-098 que ADR-0180 §4 rechazó y sigue
 * rechazando.
 *
 * LO QUE NO SE PIDE, Y NO ES OLVIDO
 * ---------------------------------
 * No se pide versionar `.claude/agents/`: S-21 manda que el satélite RECIBA los
 * subagentes del plugin y no los materialice, y `hook-guard-standard.mjs` deniega
 * la escritura ahí. Con qué agentes trabaja un repositorio es FUNCIÓN de la
 * versión que declara, no un segundo hecho que declarar (ADR-0180 §2.3).
 *
 * Tampoco se pide versionar `.claude/settings.local.json`: git lo ignora por
 * diseño y puede llevar datos personales. La vinculación se muda a un fichero que
 * ya es público, en vez de hacer público uno que no debe serlo (§2.4).
 *
 * SOLO LEE. No crea el workflow que falta, no lo repara y no escribe una versión
 * por nadie: el núcleo exige y verifica, no autora en el repositorio ajeno
 * (ADR-0088 §2.3). Un satélite al que le generan su conformidad no la tiene.
 *
 * RUTAS LITERALES, jamás barrido del árbol (ADR-0174, G-347): el CI monta el
 * paquete publicado dentro del árbol, y recorrerlo lo leería como corpus propio.
 * Las rutas que se leen son las que `lib/domicilios-pin.mjs` nombra, y ninguna
 * más.
 *
 * NO APLICA (sale 0) en el repositorio que autora el estándar, reconocido por
 * publicar `.harness/catalog.json`: la fuente no consume el plugin, lo produce.
 *
 * LÍMITES DECLARADOS
 *   · No juzga QUÉ versión. Que un satélite esté catorce versiones por detrás es
 *     cierto y es de G-176 / `check-upstream.mjs`. Mezclar las dos preguntas haría
 *     que cada publicación pusiera rojo a todo satélite conforme.
 *   · Una etiqueta puede reescribirse. «Fijado a etiqueta» garantiza intención y
 *     revisabilidad, no inmutabilidad criptográfica (ADR-0180 §3).
 *   · No comprueba que la copia commiteada bajo `.estandar/` sea de verdad la de
 *     la etiqueta que declara: comprueba que ESTÉ y que el CI la invoque. Cotejar
 *     copia y etiqueta exige la red y está registrado como gap (G-410).
 *   · Donde el workflow falta, el CI del satélite no puede invocar esta puerta:
 *     la alcanzan el `pre-push` (S-12) y la ejecución desde el núcleo contra un
 *     clon. Se declara en vez de fingir cobertura.
 *
 * Uso:  node <estandar>/scripts/validate-vinculacion-estandar.mjs [--verbose]
 * Salida: 0 si la vinculación está declarada y es efectiva; 1 si no (SD-06).
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { DOMICILIOS, ETIQUETA, CANONICO } from './lib/domicilios-pin.mjs';

const RAIZ = process.cwd();
const VERBOSE = process.argv.includes('--verbose');

const errores = [];
const avisos = [];
const fail = (m) => errores.push(m);
const warn = (m) => avisos.push(m);
const detalle = (m) => { if (VERBOSE) console.log(`    · ${m}`); };

console.log('━━━ Vinculación al estándar, declarada en el repositorio (S-28 / ADR-0180, ADR-0202) ━━━');

// 0. La fuente no consume el plugin: lo produce. Mismo criterio que el resto de
//    puertas de satélite (validate-triaje, validate-estructura-satelite).
if (existsSync(join(RAIZ, '.harness', 'catalog.json'))) {
  console.log('  ✔ Este repositorio autora el estándar; no consume el plugin. No aplica.');
  process.exit(0);
}

/** Lee una ruta literal del árbol. `null` si no está: «no está» y «no se pudo
 *  leer» no se confunden con «no lo declara» (SD-05). */
const leer = (ruta) => {
  const abs = join(RAIZ, ruta);
  if (!existsSync(abs)) return null;
  try { return readFileSync(abs, 'utf-8'); } catch { return null; }
};

/** ¿Git sigue esta ruta? Se le pregunta A GIT, no al sistema de ficheros: un
 *  fichero en disco que git ignora no aparece en ningún diff, y ser revisable en
 *  un diff es TODO lo que G-173 pide. `null` = no se pudo preguntar. */
const versionado = (ruta) => {
  const r = spawnSync('git', ['ls-files', '--error-unmatch', '--', ruta], {
    cwd: RAIZ, encoding: 'utf-8',
  });
  if (r.error) return null;
  return r.status === 0;
};

/* ── 1. Se observa el árbol una vez, por rutas literales ───────────────────── */

const ficheros = {};
const presentes = {};
for (const d of DOMICILIOS) {
  ficheros[d.ruta] = leer(d.ruta);
  for (const extra of d.observa) {
    if (!(extra in ficheros)) ficheros[extra] = leer(extra);
    presentes[extra] = existsSync(join(RAIZ, extra));
  }
}

const lecturas = DOMICILIOS.map((d) => ({
  d,
  existe: ficheros[d.ruta] !== null,
  ref: ficheros[d.ruta] === null ? null : d.extraer(ficheros[d.ruta]),
}));

const declarados = lecturas.filter((l) => l.ref !== null);

/* ── 2. Ningún domicilio declara el pin ────────────────────────────────────── */

if (declarados.length === 0) {
  const porQue = lecturas
    .map((l) => (l.existe
      ? `      · \`${l.d.ruta}\` no declara \`${l.d.campo}\``
      : `      · no existe \`${l.d.ruta}\``))
    .join('\n');
  fail(
    'S-28: ningún domicilio admitido declara qué versión del estándar consume este repositorio,\n'
    + '    así que su conformidad no es una propiedad del repositorio sino de la máquina que lo\n'
    + '    configuró (G-173). Medido:\n'
    + `${porQue}\n`
    + `    El domicilio canónico es \`${CANONICO.ruta}\`. Materialízalo desde la plantilla del plugin:\n`
    + '      mkdir -p .github/workflows\n'
    + '      cp "$UNIMAR_CORE/templates/gobernanza.yml" .github/workflows/gobernanza.yml\n'
    + '    y fija en él la versión del estándar que este repositorio consume. El segundo\n'
    + `    domicilio, \`${DOMICILIOS[1].ruta}\`, es para ${DOMICILIOS[1].porQue}.`,
  );
} else {
  /* ── 3. Dos declaraciones del mismo hecho que no coinciden: G-098 ───────── */

  if (declarados.length > 1) {
    const distintos = new Set(declarados.map((l) => l.ref));
    if (distintos.size > 1) {
      fail(
        'S-28: este repositorio declara el pin en DOS domicilios y con valores distintos:\n'
        + declarados.map((l) => `      · \`${l.d.ruta}\` (${l.d.campo}): «${l.ref}»`).join('\n')
        + '\n    Admitir dos domicilios no es admitir dos declaraciones del mismo hecho: cuál de las\n'
        + '    dos miente no lo sabe nadie, que es el defecto de G-098 (ADR-0180 §4). Un repositorio,\n'
        + `    un domicilio: deja el que corresponde a cómo obtiene el estándar y retira el otro.`,
      );
    } else {
      warn(
        `el pin se declara en los ${declarados.length} domicilios admitidos con el mismo valor `
        + `(«${declarados[0].ref}»). No es incumplimiento hoy, pero son dos ficheros que hay que `
        + 'mover a la vez: en cuanto se muevan por separado, divergen (G-098).',
      );
    }
  }

  /* ── 4. El domicilio que rige: el primero declarado, en orden de preferencia ─ */

  const { d, ref } = declarados[0];
  detalle(`\`${d.ruta}\` declara el pin en \`${d.campo}\`: es ${d.porQue}.`);

  // 4.1 Git lo sigue. Una vinculación que no está versionada no se puede revisar
  //     en un diff ni reconstruir desde un clon limpio.
  const seguido = versionado(d.ruta);
  if (seguido === null) {
    warn(`no se pudo preguntar a git si \`${d.ruta}\` está versionado. Sin respuesta de git no se afirma nada (SD-05).`);
  } else if (!seguido) {
    fail(
      `S-28: \`${d.ruta}\` existe en disco pero git NO lo sigue. Una vinculación que no está\n`
      + '    versionada no se puede revisar en un diff ni reconstruir desde un clon limpio: es\n'
      + '    exactamente el defecto de G-173 con otro nombre de fichero. Añádelo:\n'
      + `      git add ${d.ruta}`,
    );
  } else {
    detalle('git sigue el fichero: la declaración es revisable en un diff.');
  }

  // 4.2 Fijado a una etiqueta, no a una referencia móvil.
  if (!ETIQUETA.test(ref)) {
    fail(
      `S-28: el pin de \`${d.ruta}\` vale «${ref}», que no es una etiqueta del marketplace\n`
      + '    (`unimar-core-<x.y.z>`). Una rama o una expresión es una referencia MÓVIL: el\n'
      + '    veredicto del CI cambiaría porque alguien publicó, sin ningún commit en este\n'
      + '    repositorio, y eso renuncia a builds reproducibles (ADR-0180 §2.2).',
    );
  } else {
    detalle(`pin fijado a la etiqueta \`${ref}\`.`);
  }

  // 4.3 El pin GOBIERNA. Cada domicilio trae su propia prueba de efectividad: en
  //     el workflow, que un `ref:` lo resuelva; en la procedencia, que la copia
  //     que describe esté y que el CI la invoque. Un pin que nada consume es un
  //     comentario con dos puntos, viva donde viva.
  if (!d.efectivo({ texto: ficheros[d.ruta], ficheros, presentes })) {
    fail(`S-28: ${d.remedioEfectividad}`);
  } else {
    detalle(`el pin gobierna: ${d.comoGobierna}.`);
  }
}

// Resumen.
if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  for (const a of avisos) console.warn(`  ⚠ ${a}`);
  console.error(
    `\n  ${errores.length} incumplimiento(s) de S-28. La vinculación al estándar se lee del`
    + '\n  repositorio o no se lee: el núcleo la exige y la verifica, no la escribe por ti'
    + '\n  (ADR-0088 §2.3, ADR-0180).',
  );
  process.exit(1);
}

for (const a of avisos) console.warn(`  ⚠ ${a}`);
const regente = declarados[0].d;
console.log(`  ✔ Vinculación declarada en \`${regente.ruta}\`, versionada y efectiva${avisos.length ? ` (${avisos.length} aviso(s))` : ''}.`);
process.exit(0);
