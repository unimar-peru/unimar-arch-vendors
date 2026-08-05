#!/usr/bin/env node
/**
 * validate-trazabilidad.mjs — trazabilidad SD-02 (gap G-021). v1 parcial.
 *
 * SD-02 exige que la cadena historia -> ADR -> commit se recorra en ambos
 * sentidos. Verificar la cadena semántica completa —que un commit REALMENTE
 * implemente la historia que cita— es revisión humana. Esta v1 comprueba lo que
 * sí es determinista: que ningún eslabón de referencia cuelgue (SD-06).
 *
 *   Adelante:  un commit que cita G-NNN o ADR-NNNN debe apuntar a uno real.
 *   Atrás:     un gap Cerrado cuya evidencia cita un hash de commit -> el
 *              commit debe existir en el historial.
 *
 * Alcance declarado: NO verifica la intención, solo la resolución. Un commit
 * puede citar G-017 sin cerrarlo; eso lo juzga un humano.
 *
 * ALCANCE TEMPORAL (2026-07-16, cierra G-074). El barrido «adelante» mira solo
 * los commits que AÚN NO ESTÁN en la rama base: tu trabajo, no la historia ajena.
 *
 * Antes barría los últimos 300 commits en cada ejecución, y eso hacía el gate
 * insostenible por construcción: la historia de git es inmutable, así que el
 * primer defecto que entrara la dejaba roja PARA SIEMPRE. Ocurrió — ADR-0070 se
 * renumeró a ADR-0087 por una colisión (commit 21a0e889), un `fix` legítimo y
 * correcto. Los cuatro commits que ya citaban ADR-0070 eran exactos cuando se
 * escribieron, y no hay forma de corregirlos sin reescribir la historia. Desde
 * entonces el único camino para commitear era `--no-verify`, es decir: la puerta
 * no protegía de nada y además estorbaba.
 *
 * Una puerta debe juzgar lo que el autor puede cambiar. Los commits ya en `main`
 * no lo son.
 *
 * CITAS A OTRO REPOSITORIO (2026-08-02, cierra G-293). Un satélite que descubre
 * un hallazgo del núcleo lo registra ALLÍ y lo cita desde aquí. Escrito en prosa
 * —«Registrado como G-287 en unimar_arch»— el patrón local lo leía como una cita
 * propia, exigía ese gap en el `GAPS.md` del satélite, donde no debe estar, y
 * dejaba la puerta roja. Ocurrió: `unimar-ums@8f5cf73` bloqueó todo commit
 * posterior del repositorio.
 *
 * Se acepta la forma CALIFICADA `<repositorio>#<id>` —`unimar_arch#G-287`,
 * `unimar_arch#ADR-0156`— y se excluye del barrido local: por construcción, un id
 * calificado no vive en este corpus. No se comprueba que exista en el otro
 * repositorio: este validador no lo tiene delante, y afirmar lo que no se puede
 * verificar es justo lo que SD-05 prohíbe. Lo que sí se gana es que la cita deje
 * de ser ambigua y de bloquear a quien no la escribió.
 *
 * EL MOMENTO EN QUE MUERDE (2026-08-02, cierra G-294). `pre-commit` juzga
 * `main..HEAD`, que todavía NO contiene el mensaje que se está escribiendo. Una
 * cita colgante pasaba la puerta al escribirse y bloqueaba al SIGUIENTE commit,
 * cuando el mensaje ya estaba publicado y corregirlo exigía reescribir historia.
 * Es decir: la puerta detectaba el defecto exactamente cuando dejaba de ser
 * corregible. `--mensaje <ruta>` juzga un mensaje suelto para que un hook
 * `commit-msg` lo cace mientras aún se puede editar.
 *
 * Uso:
 *   node <estandar>/scripts/validate-trazabilidad.mjs              # main..HEAD
 *   node <estandar>/scripts/validate-trazabilidad.mjs --desde REF  # REF..HEAD
 *   node <estandar>/scripts/validate-trazabilidad.mjs --historia [--depth N]
 *   node <estandar>/scripts/validate-trazabilidad.mjs --mensaje RUTA
 *
 * `--historia` recupera el barrido completo: útil para auditar el pasado a
 * propósito, nunca como puerta.
 *
 * Salida: 0 si toda referencia resuelve; 1 si algún eslabón cuelga.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { celdas } from './lib/tabla.mjs';

const RAIZ = process.cwd();

/*
 * La raiz del estandar tal como este script la ve: el plugin cuando esta
 * empaquetado, `.harness/` cuando corre desde la fuente. Solo se usa para
 * localizar el corpus de ADRs empaquetado; en la fuente ese directorio no existe
 * y el escaneo simplemente no encuentra nada.
 */
const ESTANDAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const depthArg = process.argv.indexOf('--depth');
const DEPTH = depthArg !== -1 ? Number(process.argv[depthArg + 1]) : 300;
const desdeArg = process.argv.indexOf('--desde');
const DESDE = desdeArg !== -1 ? process.argv[desdeArg + 1] : null;
const HISTORIA = process.argv.includes('--historia');
const mensajeArg = process.argv.indexOf('--mensaje');
const MENSAJE = mensajeArg !== -1 ? process.argv[mensajeArg + 1] : null;
const errores = [];
const fail = (m) => errores.push(m);

/*
 * Cita CALIFICADA a otro repositorio: `unimar_arch#G-287`, `unimar_tms#ADR-TMS-004`.
 * Se consume entera —no solo el prefijo— porque dejar el id suelto haría que el
 * barrido local volviera a reclamarlo, que es el defecto que esto corrige.
 */
const CITA_AJENA = /\b[A-Za-z][A-Za-z0-9_.-]*#(?:G-\d{3}|ADR-(?:\d{4}|[A-Z][A-Z0-9]*-\d{3}))\b/g;

/** Deja solo las citas que ESTE repositorio debe poder resolver. */
const soloCitasLocales = (texto) => texto.replace(CITA_AJENA, ' ');

function filasTabla(lines, re) {
  const h = lines.findIndex((l) => re.test(l));
  if (h === -1) return [];
  const filas = [];
  for (let i = h + 2; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    if (lines[i].trim()) filas.push(celdas(lines[i]));
  }
  return filas;
}

// --- IDs reales de gaps ---
const gapLines = existsSync(join(RAIZ, 'GAPS.md')) ? readFileSync(join(RAIZ, 'GAPS.md'), 'utf-8').split('\n') : [];
const gaps = new Map(); // id -> fila
for (const c of filasTabla(gapLines, /^\|\s*ID\s*\|/)) {
  if (/^G-\d{3}$/.test(c[0])) gaps.set(c[0], c);
}

/*
 * IDs reales de ADRs (por fichero NNNN-*.md), de dos corpus:
 *
 *   1. El del propio repositorio, con sus decisiones locales.
 *   2. El que viaja empaquetado en el plugin, fijado a su version.
 *
 * Un satelite hereda las decisiones del corpus canonico. Si solo se mirara el
 * corpus local -- vacio en un satelite joven -- un commit que cita ADR-0042 se
 * reportaria como referencia colgante, cuando la decision existe y le aplica.
 * En la fuente, el segundo escaneo no encuentra nada y el primero lo es todo.
 */
const adrs = new Set();

/**
 * Satelite o fuente, sin preguntarselo a nadie.
 *
 * El corpus de ADRs solo viaja empaquetado en el plugin. Si existe bajo
 * ESTANDAR, este script corre desde el plugin y RAIZ es un satelite. Si no
 * existe, ESTANDAR es el `.harness/` de la propia fuente. Es el mismo hecho que
 * el comentario de arriba describe -- «en la fuente, el segundo escaneo no
 * encuentra nada» -- leido como discriminante en vez de como anecdota.
 */
const EN_SATELITE = existsSync(join(ESTANDAR, 'reference', 'architecture', 'adrs'));

function scan(dir, esLocal = false) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) scan(join(dir, e.name), esLocal);
    else {
      // S-15: las cuatro cifras son el espacio de identidad del nucleo. Un ADR
      // local de satelite que las use produce una colision -- `ADR-0053` seria
      // dos decisiones distintas segun el repositorio -- y el corpus ya la pago
      // una vez (ADR-0070 renumerado a ADR-0087, commit 21a0e889). La norma sin
      // esta puerta seria un deseo: se acepto la forma nueva y se seguia
      // aceptando la que provoca el dano.
      if (esLocal && EN_SATELITE && /^\d{4}-.*\.md$/.test(e.name)) {
        fail(`${e.name} usa el espacio de identidad del nucleo (cuatro cifras). S-15 exige ADR-<SIGLA>-NNN para un ADR local de satelite: el fichero se nombra <SIGLA>-NNN-<titulo>.es.md.`);
      }
      // Dos identidades, una simetria. El nucleo numera con cuatro cifras
      // (`0053-titulo.es.md` -> ADR-0053). El satelite numera con prefijo de
      // sigla (`UMS-001-titulo.es.md` -> ADR-UMS-001), porque las cuatro cifras
      // son el espacio del nucleo: `ADR-0053` ya significa dos decisiones
      // distintas segun el repositorio, y el corpus ya pago esa colision una vez
      // (ADR-0070 se renumero a ADR-0087, commit 21a0e889). S-15 lo norma.
      const m = e.name.match(/^(\d{4}|[A-Z][A-Z0-9]*-\d{3})-/);
      if (m) adrs.add(`ADR-${m[1]}`);
    }
  }
}
scan(join(RAIZ, 'reference', 'architecture', 'adrs'), true);
scan(join(ESTANDAR, 'reference', 'architecture', 'adrs'), false);

function gitOk() {
  try { execSync('git rev-parse --git-dir', { cwd: RAIZ, stdio: 'ignore' }); return true; }
  catch { return false; }
}

/** ¿Tiene este repositorio alguna referencia remota publicada? */
function hayRemotas() {
  try {
    return execSync('git for-each-ref --count=1 --format=1 refs/remotes', { cwd: RAIZ, encoding: 'utf-8' })
      .trim().length > 0;
  } catch { return false; }
}

/**
 * Rango a juzgar: los commits que TODAVÍA NO ESTÁN PUBLICADOS. Es la doctrina que
 * G-074 fijó —«una puerta debe juzgar lo que el autor puede cambiar»— aplicada al
 * hecho que de verdad la determina, que es la PUBLICACIÓN y no la rama.
 *
 * Antes el rango era `origin/main..HEAD`, con la premisa implícita de que todo lo
 * que no está en `main` sigue siendo tuyo. En un repositorio con `develop` esa
 * premisa es falsa: `develop` está publicada, la comparten todos, y sus commits
 * son tan inmutables como los de `main`. La consecuencia se midió el 2026-08-02 en
 * `unimar-ums`: el mensaje de `8f5cf73` —ya en `origin/develop`— dejó la puerta
 * roja y bloqueó TODO commit posterior del repositorio, sin más salida que
 * `--no-verify`. Exactamente el fallo que G-074 creyó cerrar, reaparecido un nivel
 * más abajo.
 *
 * `HEAD --not --remotes` es la pregunta correcta: qué commits no alcanza ninguna
 * referencia remota. Eso es, literalmente, lo que aún se puede reescribir sin
 * romperle la historia a nadie.
 *
 * Y no abre un agujero: con `--mensaje` (hook `commit-msg`) TODO commit se juzga
 * al escribirse, antes de existir. Este barrido es la segunda red, no la única.
 *
 * `--desde REF` sigue mandando cuando se pasa: es una petición explícita. Sin
 * remotas —un clon recién iniciado— se degrada a los últimos DEPTH commits en vez
 * de fallar: una puerta que revienta porque no encuentra una referencia de git no
 * está protegiendo, está estorbando.
 */
function rango() {
  if (HISTORIA) return { args: `-n ${DEPTH}`, desc: `los últimos ${DEPTH} commits (historia completa)` };
  if (DESDE) return { args: `${DESDE}..HEAD`, desc: `los commits de esta rama sobre ${DESDE}` };
  if (hayRemotas()) return { args: 'HEAD --not --remotes', desc: 'tus commits aún sin publicar' };
  return { args: `-n ${DEPTH}`, desc: `los últimos ${DEPTH} commits (sin remotas)` };
}

/**
 * Comprueba las citas de un texto. `donde` describe la procedencia para el
 * mensaje de error: un hash cuando viene del historial, «el mensaje» cuando lo
 * trae `--mensaje` y aún no hay commit al que apuntar.
 */
function revisarCitas(texto, donde) {
  const local = soloCitasLocales(texto);
  for (const m of local.matchAll(/\bG-(\d{3})\b/g)) {
    const id = `G-${m[1]}`;
    if (!gaps.has(id)) {
      fail(`${donde} cita ${id}, que no existe en GAPS.md. Si el gap es de OTRO repositorio, `
         + `califícalo: \`<repositorio>#${id}\`.`);
    }
  }
  for (const m of local.matchAll(/\bADR-(\d{4}|[A-Z][A-Z0-9]*-\d{3})\b/g)) {
    const id = `ADR-${m[1]}`;
    if (!adrs.has(id)) {
      fail(`${donde} cita ${id}, que no existe ni en reference/architecture/adrs/ ni en el corpus `
         + `del estandar. Si el ADR es de OTRO repositorio, califícalo: \`<repositorio>#${id}\`.`);
    }
  }
}

// --- Mensaje suelto: la puerta de `commit-msg`, mientras aún se puede editar ---
if (MENSAJE) {
  if (!existsSync(MENSAJE)) {
    console.error(`━━━ Trazabilidad SD-02 (S-06, referencias) ━━━`);
    console.error(`  ✘ no existe el fichero de mensaje ${MENSAJE}.`);
    process.exit(1);
  }
  // Se descartan los comentarios de git: lo que empieza por `#` no viaja al
  // mensaje, y una cita ahí es una plantilla, no una afirmación del autor.
  const texto = readFileSync(MENSAJE, 'utf-8')
    .split('\n').filter((l) => !l.startsWith('#')).join('\n');
  revisarCitas(texto, 'el mensaje de commit');

  console.log('━━━ Trazabilidad SD-02 (S-06, referencias) ━━━');
  if (errores.length) {
    for (const e of errores) console.error(`  ✘ ${e}`);
    console.error('\n  Ámbito: el mensaje que estás escribiendo. Corrígelo ahora: una vez publicado, '
                + 'no se puede sin reescribir historia.');
    process.exit(1);
  }
  console.log('  ✔ el mensaje de commit: todas las referencias resuelven.');
  process.exit(0);
}

// --- Adelante: commits que citan G-NNN / ADR-NNNN deben resolver ---
let commitsRevisados = 0;
const AMBITO = rango();
if (gitOk()) {
  let log = '';
  try { log = execSync(`git log --pretty=format:%H%x1f%s%x1f%b%x1e ${AMBITO.args}`, { cwd: RAIZ, encoding: 'utf-8' }); } catch {}
  for (const bloque of log.split('\x1e')) {
    if (!bloque.trim()) continue;
    commitsRevisados++;
    const [hash, subject = '', body = ''] = bloque.split('\x1f');
    revisarCitas(`${subject} ${body}`, `commit ${hash.trim().slice(0, 8)}`);
  }
}

// --- Atrás: gap Cerrado cuya evidencia cita un hash -> el commit debe existir ---
let hashesRevisados = 0;
if (gitOk()) {
  for (const [id, c] of gaps) {
    if (c[4] !== 'Cerrado') continue;
    const evidencia = c[6] ?? '';
    for (const m of evidencia.matchAll(/`([0-9a-f]{7,40})`/g)) {
      hashesRevisados++;
      try { execSync(`git cat-file -e ${m[1]}^{commit}`, { cwd: RAIZ, stdio: 'ignore' }); }
      catch { fail(`gap ${id} cita el commit ${m[1]} como evidencia, pero no existe en el historial.`); }
    }
  }
}

console.log('━━━ Trazabilidad SD-02 (S-06, referencias) ━━━');
if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  if (!HISTORIA) console.error(`\n  Ámbito: ${AMBITO.desc}. Estos commits son tuyos y aún puedes corregirlos.`);
  process.exit(1);
}
console.log(`  ✔ ${commitsRevisados} commits (${AMBITO.desc}) y ${hashesRevisados} hashes de evidencia: todas las referencias resuelven.`);
process.exit(0);
