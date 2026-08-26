#!/usr/bin/env node
/**
 * validate-credencial-en-artefacto.mjs — S-43, ADR-0235.
 *
 * Ningun artefacto del estandar sale con una credencial dentro.
 *
 * POR QUE EXISTE. El 2026-08-25 un token `gho_` VIVO quedo escrito en
 * `ensayo-herencia.json` y se empujo a `main` (G-493). No lo tecleo nadie: lo
 * puso un script al capturar el mensaje de error de `git clone`, que incrusta
 * la URL entera --credencial incluida--. Ninguna puerta lo noto, y no por
 * descuido de una sino por DONDE MIRAN TODAS: `validate-docs` barre `.md` y
 * solo `.md`, y el corpus tiene 346 ficheros versionados que no son markdown.
 *
 * Y la asimetria que lo volvio norma: ADR-0106 §2.1 ya pedia escaner de
 * secretos, pero lo comprobaba sobre el SATELITE y solo avisaba. El
 * repositorio que autora la norma pedia a sus hijos algo que el no hacia, y su
 * propia salida era el unico sitio del corpus que nadie miraba.
 *
 * QUE HACE
 *   · Barre lo que `git ls-files` declara --el arbol VERSIONADO entero, no un
 *     subconjunto por extension-- buscando credenciales POR FORMA (ADR-0235 D1).
 *   · Nunca imprime lo que encuentra. Un validador que enseña el secreto que
 *     acaba de cazar lo copia al log del CI, al scrollback y al portapapeles de
 *     quien lo pegue en un ticket. Se dice el fichero, la linea y la familia.
 *
 * LIMITES DECLARADOS, y no son letra pequeña:
 *   · ESTO NO ES UN ESCANER DE SECRETOS. Caza lo que tiene FORMA reconocible.
 *     Una contrasena en texto plano, una cadena de conexion sin prefijo o una
 *     clave simetrica PASAN, y se dice con estas palabras. Buscar entropia
 *     sobre 346 ficheros acusaria a los SHA que fija ADR-0181 y a los hashes de
 *     evidencia de GAPS.md, y esa es la puerta que alguien apaga en una semana
 *     (ADR-0160 §1.4).
 *   · No promete que el HISTORIAL este limpio. Mira el arbol de hoy. Lo
 *     escrito, escrito esta: esta puerta impide que se escriba la proxima, y no
 *     sustituye a rotar la que ya se escapo.
 *   · No juzga si la credencial es valida. Una caducada tiene la misma forma, y
 *     comprobarlo exigiria red --que esta puerta no abre-- y usar el secreto.
 *
 * OLA 1 --bloqueante--: este repositorio, el que publica `.harness/catalog.json`.
 * OLA 2 --censada, NUNCA roja--: los satelites. Un escaner sobre un repositorio
 * que ya existe encuentra el pasado el primer dia, y acusar a todos el primer
 * dia es como mueren estas puertas. Armarla es un acto de su propietario.
 *
 * Uso: node .harness/scripts/validate-credencial-en-artefacto.mjs [--verbose]
 * Salida: 0 si conforme o si censa; 1 si hay hallazgo en la ola 1.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * El arbol juzgado es el DIRECTORIO DE TRABAJO, siempre, y nunca la ubicacion
 * del script. En un satelite este fichero vive en el cache del plugin, y hacer
 * fallback a su propia ruta cuando el cwd no es un clon significaria barrer el
 * cache en vez del repositorio --dar un veredicto sobre un arbol que nadie
 * pidio, con la etiqueta del que si--. Si aqui no hay clon, se abstiene.
 */
const ARBOL = process.cwd();
const VERBOSE = process.argv.includes('--verbose');

/** El corte de la ola 1: solo el repositorio que publica el catalogo. */
const ES_LA_FUENTE = existsSync(join(ARBOL, '.harness', 'catalog.json'));

const NUL = String.fromCharCode(0);
const TECHO_BYTES = 2_000_000;

/**
 * Las familias que se cazan. Cada una exige un CUERPO, no solo el prefijo: asi
 * el corpus puede NOMBRAR el patron --este comentario, el ADR, la ficha del
 * gap-- sin que la puerta se acuse a si misma. Nombrar no es portar.
 */
const FAMILIAS = [
  { id: 'token-github', que: 'token de GitHub', re: /gh[pousr]_[A-Za-z0-9]{16,}/g },
  { id: 'token-github-pat', que: 'token de GitHub de grano fino', re: /github_pat_[A-Za-z0-9_]{20,}/g },
  { id: 'clave-privada', que: 'clave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { id: 'clave-aws', que: 'clave de acceso de AWS', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: 'credencial-en-url', que: 'credencial embebida en una URL', re: /https?:\/\/[^/@\s:]+(?::[^/@\s]*)?@[A-Za-z0-9.-]+/g },
];

/*
 * Una plantilla NO es una credencial, y distinguirlas es lo que separa esta
 * puerta de uno de esos gates que todo el mundo silencia.
 *
 * `https://x-access-token:${token}@github.com/...` construye la URL en tiempo
 * de ejecucion: el secreto no esta en el fichero, esta en la variable. Y
 * `https://<usuario>:<clave>@host` es documentacion del propio patron --el ADR
 * que funda esta regla lo escribe asi--. Acusar a las dos obligaria a poner
 * excepciones sobre cosas que no son el problema, y una excepcion que se
 * concede a lo que no es problema ensena que las excepciones son tramite.
 *
 * Medido: sin este recorte, el barrido del 2026-08-26 daba 3 hallazgos y los 3
 * eran falsos. Con el, cero.
 */
const ES_PLANTILLA = /\$\{|<[^>]*>|\*\*\*|%[sd]\b|\{\{/;

/** Excepciones: cuestan razon escrita y un G-NNN abierto (ADR-0235 D4). */
const RUTA_EXCEPCIONES = join(ARBOL, '.harness', 'credenciales-exceptuadas.json');

function excepciones() {
  if (!existsSync(RUTA_EXCEPCIONES)) return [];
  try {
    const j = JSON.parse(readFileSync(RUTA_EXCEPCIONES, 'utf-8'));
    return Array.isArray(j.excepciones) ? j.excepciones : [];
  } catch {
    return null; // ilegible: se denuncia, no se ignora
  }
}

/** Los gaps que GAPS.md declara, para que una excepcion no cite uno inventado. */
function gapsDelRegistro() {
  const p = join(ARBOL, 'GAPS.md');
  if (!existsSync(p)) return new Set();
  return new Set([...readFileSync(p, 'utf-8').matchAll(/\bG-(\d{3,})\b/g)].map((m) => `G-${m[1]}`));
}

function versionados() {
  try {
    return execFileSync('git', ['-C', ARBOL, 'ls-files'], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
      .trim().split('\n').filter(Boolean);
  } catch {
    return null;
  }
}

const hallazgos = [];

function juzgar(rel, exentos) {
  const abs = join(ARBOL, rel);
  let texto;
  try {
    if (statSync(abs).size > TECHO_BYTES) return;
    texto = readFileSync(abs, 'utf-8');
  } catch { return; }
  if (texto.includes(NUL)) return; // binario: no se lee como texto

  const lineas = texto.split('\n');
  for (const fam of FAMILIAS) {
    for (let i = 0; i < lineas.length; i++) {
      for (const m of lineas[i].matchAll(fam.re)) {
        if (fam.id === 'credencial-en-url' && ES_PLANTILLA.test(m[0])) continue;
        const clave = `${rel}:${fam.id}`;
        if (exentos.has(clave) || exentos.has(rel)) continue;
        hallazgos.push({ ruta: rel, linea: i + 1, familia: fam.id, que: fam.que });
      }
    }
  }
}

// ── Ejecucion ────────────────────────────────────────────────────────────────

console.log('━━━ Credencial en un artefacto del estándar (S-43, ADR-0235) ━━━\n');

const ficheros = versionados();
if (ficheros === null) {
  console.log('  · SE ABSTIENE: no es un clon de git, así que no hay árbol versionado que barrer.');
  console.log('    La abstención se dice; no se emite visto de conformidad (SD-05).');
  process.exit(0);
}

const decl = excepciones();
if (decl === null) {
  console.error(`  ✘ [excepciones-ilegibles] \`${RUTA_EXCEPCIONES.slice(ARBOL.length + 1)}\` no parsea.`);
  console.error('    Un fichero de excepciones ilegible no se ignora: se denuncia. Si se ignorara,');
  console.error('    romperlo sería la forma barata de silenciar la puerta entera.');
  process.exit(1);
}

const gaps = gapsDelRegistro();
const exentos = new Set();
const malas = [];
for (const e of decl) {
  const razon = String(e.razon ?? '').trim();
  const gap = /^G-\d{3,}$/.test(String(e.gap ?? '')) ? e.gap : null;
  if (!e.ruta) { malas.push('una entrada sin `ruta`'); continue; }
  if (!razon) { malas.push(`\`${e.ruta}\` sin \`razon\` escrita`); continue; }
  if (!gap) { malas.push(`\`${e.ruta}\` sin \`gap\` en forma G-NNN`); continue; }
  if (!gaps.has(gap)) { malas.push(`\`${e.ruta}\` cita ${gap}, que GAPS.md no declara`); continue; }
  exentos.add(e.familia ? `${e.ruta}:${e.familia}` : e.ruta);
}

if (malas.length) {
  for (const m of malas) console.error(`  ✘ [excepcion-sin-sustento] ${m}.`);
  console.error('\n  Silenciar cuesta razón escrita y un gap abierto (ADR-0235 D4). Si silenciar');
  console.error('  fuera gratis, la primera acusación molesta se vuelve una línea de excepción y la');
  console.error('  puerta queda viva pero ciega, que es peor que no tenerla: parecería que alguien mira.');
  process.exit(1);
}

for (const f of ficheros) juzgar(f, exentos);

if (VERBOSE) {
  console.log(`  · ${ficheros.length} fichero(s) versionado(s) barridos, ${exentos.size} exención(es) declarada(s).`);
}

if (!ES_LA_FUENTE) {
  console.log('  · CENSO de la ola 2 --informativo, NO puede ponerse rojo (ADR-0235 D5)--.');
  console.log(`    ${ficheros.length} fichero(s) barrido(s), ${hallazgos.length} hallazgo(s).`);
  for (const h of hallazgos) console.log(`      · ${h.ruta}:${h.linea} — ${h.que}`);
  console.log('\n    Armar esta ola es un acto explícito del propietario, no una fecha que se dispara sola.');
  process.exit(0);
}

if (hallazgos.length) {
  for (const h of hallazgos) {
    console.error(`  ✘ [${h.familia}] ${h.ruta}:${h.linea} — ${h.que}.`);
  }
  console.error(`\n  ${hallazgos.length} hallazgo(s). NO se imprime lo encontrado: un validador que enseña el`);
  console.error('  secreto que acaba de cazar lo copia al log del CI y al portapapeles de quien lo pegue.');
  console.error('  Ábrelo tú en el fichero y la línea que se nombran.');
  console.error('\n  Si es un falso positivo, decláralo en `.harness/credenciales-exceptuadas.json`');
  console.error('  con su razón escrita y un G-NNN abierto. Si es real: ROTA la credencial primero.');
  console.error('  Quitarla del árbol no la revoca — sigue viva y sigue en el historial.');
  process.exit(1);
}

console.log(`  ✔ ${ficheros.length} fichero(s) versionado(s): ninguno porta una credencial con forma reconocible.`);
console.log('  ⚠ LÍMITE: se caza la FORMA, no el secreto. Una contraseña en texto plano o una cadena');
console.log('    de conexión sin prefijo reconocible PASAN por aquí (ADR-0235 D1). Y esto mira el árbol');
console.log('    de hoy, nunca el historial: lo que ya se empujó sigue ahí y solo se remedia rotándolo.');
