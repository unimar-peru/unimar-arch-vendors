#!/usr/bin/env node
/**
 * validate-redaccion-log.mjs — ninguna superficie de logging del estándar deja
 * pasar una clase de dato personal sin declarar su redacción (S-34, ADR-0193).
 *
 * EL DEFECTO QUE CIERRA
 * ---------------------
 * ADR-0096 §2.7.1 exigió «una lista de campos prohibidos por producto, aplicada
 * en el logger y no en cada llamada» y no puso ejecutor. Dos productos la
 * escribieron y las dos listas se contradicen, medido el 2026-08-08:
 *
 *   · CP-06 (Node/Pino)   redacta `dni`, `phone`, `address` y NINGÚN token.
 *   · CP-02 (.NET/Serilog) redacta `token`, `accessToken`, `apiKey` y NO redacta
 *     `authorization`, `cookie` ni `dni`.
 *   · Ninguna de las dos redacta un solo campo de pago, que §2.7.1 nombra.
 *
 * Un satélite que copie la primera manda su token de portador al log; uno que
 * copie la segunda manda el DNI. «Por producto» sin piso significa «cada uno el
 * suyo», y eso no es una norma: es la ausencia de una.
 *
 * QUÉ COMPRUEBA
 * -------------
 * 1. Toda superficie declarada lleva su bloque `<!--redaccion-log:inicio-->` …
 *    `<!--redaccion-log:fin-->`. Sin bloque no hay lista, y sin lista no hay nada
 *    que verificar: se acusa.
 * 2. Ese bloque nombra AL MENOS UN token de CADA clase del piso
 *    `.harness/data/clases-dato-prohibidas-en-log.json`. Al menos uno, no todos:
 *    el nombre del campo es idiomático del runtime —`*.dni` en rutas de Pino,
 *    `nationalid` en propiedades de Serilog— y exigir vocabulario único acusaría
 *    a quien ya redacta la clase con otra palabra (ADR-0160 §1.4).
 * 3. Censo: ningún patrón canónico de logging escapa a la lista declarada. Un
 *    `cp-NN-logging-*.es.md` nuevo entra en la puerta por existir, no porque
 *    alguien se acuerde de apuntarlo.
 *
 * DOS DOMICILIOS, AMBOS LITERALES — nunca un barrido del árbol, porque el CI
 * monta el paquete publicado dentro de la fuente (ADR-0174, G-347):
 *
 *   A. LA FUENTE: los patrones canónicos de logging que el núcleo autora y todo
 *      satélite copia (S-01, S-07). Es la superficie sobre la que el núcleo SÍ
 *      puede ejercer la norma hoy.
 *   B. EL SATÉLITE: la raíz de fuente única `src/` (ADR-0107), y dentro de ella
 *      SOLO los ficheros que llevan el marcador. Lo que no se declara no se
 *      juzga.
 *
 * LÍMITE DECLARADO (ADR-0193 §3, G-386): en el satélite esta puerta juzga lo
 * DECLARADO, no lo existente. Un logger sin marcador no es acusado. Es
 * deliberado: detectar «esto es un logger» por regex sobre código ajeno acusaría
 * a un bundle de `dist/`, a un componente de UI que dice «redactar» y a un
 * fixture de test —los tres medidos en satélites reales el 2026-08-08— y una
 * puerta que acusa a quien cumple acaba desactivada (ADR-0160 §1.4).
 *
 * Uso:
 *   node .harness/scripts/validate-redaccion-log.mjs
 *   node .harness/scripts/validate-redaccion-log.mjs --verbose
 *   node .harness/scripts/validate-redaccion-log.mjs --raiz <dir>
 *
 * Salida: 0 si toda superficie declarada cubre el piso, o si no hay ninguna
 *         superficie que juzgar; 1 si alguna falta o queda por debajo (SD-06).
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const iRaiz = args.indexOf('--raiz');
const RAIZ = resolve(iRaiz === -1 ? process.cwd() : args[iRaiz + 1]);

/* El piso viaja con el script: se lee junto a él y no desde el cwd, para que
 * funcione igual desde `.harness/` y desde la caché del plugin en un satélite. */
const AQUI = dirname(fileURLToPath(import.meta.url));
const RUTA_PISO = join(AQUI, '..', 'data', 'clases-dato-prohibidas-en-log.json');

const MARCA_INICIO = '<!--redaccion-log:inicio-->';
const MARCA_FIN = '<!--redaccion-log:fin-->';

/* ---------------------------------------------------------------- *
 * DOMICILIO A — la fuente. Rutas literales, no un glob del árbol.
 * ---------------------------------------------------------------- */
const DIRS_PATRONES = [
  'reference/architecture/canonical-patterns/dotnet',
  'reference/architecture/canonical-patterns/nodejs',
  'reference/architecture/canonical-patterns/android',
];

const SUPERFICIES_FUENTE = [
  'reference/architecture/canonical-patterns/dotnet/cp-02-logging-serilog-seguro-pii.es.md',
  'reference/architecture/canonical-patterns/nodejs/cp-06-logging-pino-seguro-pii.es.md',
];

/*
 * Exención, con su razón al lado y nunca como prosa suelta: un patrón de logging
 * que NO tiene lista de campos porque no captura valores. Pedirle una acusaría a
 * quien resolvió el problema mejor —no filtrando— que quien lo redacta después.
 */
const SUPERFICIES_EXENTAS = [
  {
    ruta: 'reference/architecture/canonical-patterns/dotnet/cp-04-decorador-logging-aop.es.md',
    porQue: 'El decorador registra nombres y tipos CLR de los argumentos, NUNCA sus valores (§ «PII-safe: nombres + tipos CLR únicamente»). No hay valor que redactar, así que no hay lista que declarar.',
  },
];

/* ---------------------------------------------------------------- *
 * DOMICILIO B — el satélite. Una sola raíz, la que ADR-0107 declara única.
 * ---------------------------------------------------------------- */
const RAIZ_FUENTE = 'src';
const DIRS_IGNORADOS = new Set([
  'node_modules', 'dist', 'build', 'out', 'bin', 'obj', 'coverage',
  'vendor', '.git', '.next', '.turbo', '__pycache__',
]);
const EXTENSIONES = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.cs', '.kt', '.java', '.go',
  '.py', '.rb', '.json', '.yml', '.yaml', '.md', '.txt', '.config',
]);
const LIMITE_BYTES = 512 * 1024;

const errores = [];
const avisos = [];

/* ---------------------------------------------------------------- *
 * Piso normativo.
 * ---------------------------------------------------------------- */
function cargarPiso() {
  if (!existsSync(RUTA_PISO)) {
    errores.push(`Piso normativo inexistente: ${RUTA_PISO}. Sin él no hay contra qué medir.`);
    return null;
  }
  let json;
  try {
    json = JSON.parse(readFileSync(RUTA_PISO, 'utf-8'));
  } catch (e) {
    errores.push(`El piso normativo no es JSON válido: ${e.message}`);
    return null;
  }
  const clases = json.clases;
  if (!Array.isArray(clases) || clases.length === 0) {
    errores.push('El piso normativo no declara ninguna clase de dato: `clases` vacío o ausente.');
    return null;
  }
  for (const c of clases) {
    if (!c.id || !Array.isArray(c.tokens) || c.tokens.length === 0) {
      errores.push(`Clase mal formada en el piso: ${JSON.stringify(c.id ?? c)}. Toda clase declara \`id\` y al menos un token.`);
      return null;
    }
  }
  return clases;
}

/* ---------------------------------------------------------------- *
 * Extracción del bloque declarado.
 *
 * Se lee SOLO lo que va entre marcas. Sin ventana, la prosa de un documento que
 * EXPLICA la redacción absolvería a un documento que no la aplica -- y CP-02
 * enumera en prosa media docena de campos que su pipeline no toca.
 * ---------------------------------------------------------------- */
function bloquesDeclarados(texto) {
  const bloques = [];
  let desde = 0;
  for (;;) {
    const i = texto.indexOf(MARCA_INICIO, desde);
    if (i === -1) break;
    const j = texto.indexOf(MARCA_FIN, i + MARCA_INICIO.length);
    if (j === -1) return { bloques, abierto: true };
    bloques.push(texto.slice(i + MARCA_INICIO.length, j));
    desde = j + MARCA_FIN.length;
  }
  return { bloques, abierto: false };
}

/**
 * Un token está nombrado si aparece en el bloque, en minúsculas, tal cual o con
 * los separadores retirados: `card_number` y `'*.cardNumber'` son la misma
 * intención escrita con dos convenciones, y la puerta no juzga convenciones.
 *
 * La comparación sin separadores puede unir dos entradas vecinas y dar por
 * nombrado un token que nadie escribió. El error va SIEMPRE en la dirección
 * segura: absuelve de más, nunca acusa de más (ADR-0160 §1.4).
 */
function nombra(bloque, token) {
  const crudo = bloque.toLowerCase();
  const pelado = crudo.replace(/[^a-z0-9]/g, '');
  const t = token.toLowerCase();
  return crudo.includes(t) || pelado.includes(t.replace(/[^a-z0-9]/g, ''));
}

function juzgar(rutaRelativa, texto, clases, { exigeDeclaracion }) {
  const { bloques, abierto } = bloquesDeclarados(texto);
  if (abierto) {
    errores.push(`${rutaRelativa}: bloque \`${MARCA_INICIO}\` sin \`${MARCA_FIN}\`. Una declaración sin cierre no delimita nada.`);
    return false;
  }
  if (bloques.length === 0) {
    if (exigeDeclaracion) {
      errores.push(
        `${rutaRelativa}: superficie de logging sin lista de campos prohibidos declarada. `
        + `Envuelve la lista entre \`${MARCA_INICIO}\` y \`${MARCA_FIN}\` (S-34, ADR-0193 §2.3).`,
      );
    }
    return false;
  }
  const bloque = bloques.join('\n');
  const faltan = clases.filter((c) => !c.tokens.some((t) => nombra(bloque, t)));
  if (faltan.length) {
    for (const c of faltan) {
      errores.push(
        `${rutaRelativa}: no redacta la clase \`${c.id}\` (${c.titulo}). `
        + `Su declaración no nombra ninguno de: ${c.tokens.join(', ')}. Fundamento: ${c.fundamento}.`,
      );
    }
  } else if (VERBOSE) {
    console.log(`      ${rutaRelativa}: cubre las ${clases.length} clases del piso.`);
  }
  return true;
}

/* ---------------------------------------------------------------- *
 * Recorrido del domicilio B. Arranca en `src/` y solo ahí: `.marketplace/` y
 * `.estandar/` cuelgan de la raíz del repositorio, nunca de la raíz de fuente.
 * ---------------------------------------------------------------- */
function recorrerFuente(dir, encontrados) {
  let entradas;
  try {
    entradas = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of [...entradas].sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (e.name.startsWith('.') && e.name !== '.config') continue;
    const ruta = join(dir, e.name);
    if (e.isDirectory()) {
      if (DIRS_IGNORADOS.has(e.name)) continue;
      recorrerFuente(ruta, encontrados);
      continue;
    }
    if (!e.isFile()) continue;
    const punto = e.name.lastIndexOf('.');
    if (punto === -1 || !EXTENSIONES.has(e.name.slice(punto))) continue;
    let tam;
    try { tam = statSync(ruta).size; } catch { continue; }
    if (tam > LIMITE_BYTES) continue;
    let texto;
    try { texto = readFileSync(ruta, 'utf-8'); } catch { continue; }
    if (!texto.includes(MARCA_INICIO)) continue;
    encontrados.push([ruta, texto]);
  }
}

/* ================================================================ */

console.log('━━━ El dato personal no llega al log (S-34, ADR-0193) ━━━');

const clases = cargarPiso();

let juzgadas = 0;

if (clases) {
  /* --- Domicilio A: la fuente --------------------------------- */
  const patronesPresentes = SUPERFICIES_FUENTE.filter((r) => existsSync(join(RAIZ, r)));

  if (VERBOSE) {
    for (const e of SUPERFICIES_EXENTAS) console.log(`      exenta: ${e.ruta} — ${e.porQue}`);
  }

  for (const rel of patronesPresentes) {
    const texto = readFileSync(join(RAIZ, rel), 'utf-8');
    // Se cuenta como juzgada aunque falle: la ausencia de declaración ya está acusada.
    juzgar(rel, texto, clases, { exigeDeclaracion: true });
    juzgadas += 1;
  }

  /* Censo: ningún patrón de logging fuera de la lista declarada ni de la exenta. */
  const declaradas = new Set([...SUPERFICIES_FUENTE, ...SUPERFICIES_EXENTAS.map((e) => e.ruta)]);
  for (const d of DIRS_PATRONES) {
    const abs = join(RAIZ, d);
    if (!existsSync(abs)) continue;
    let ficheros;
    try {
      ficheros = readdirSync(abs).sort((a, b) => a.localeCompare(b, 'en'));
    } catch {
      continue;
    }
    for (const f of ficheros) {
      if (!/^cp-\d+-.*logging.*\.md$/.test(f)) continue;
      const rel = `${d}/${f}`;
      if (declaradas.has(rel)) continue;
      errores.push(
        `${rel}: patrón canónico de logging que esta puerta no juzga. `
        + 'Añádelo a `SUPERFICIES_FUENTE` en este mismo script: una superficie de logging fuera de la lista es la puerta apagada en silencio.',
      );
    }
  }

  /* --- Domicilio B: el satélite -------------------------------- */
  const raizFuente = join(RAIZ, RAIZ_FUENTE);
  const declaradosEnFuente = [];
  if (existsSync(raizFuente)) recorrerFuente(raizFuente, declaradosEnFuente);
  for (const [abs, texto] of declaradosEnFuente) {
    const rel = relative(RAIZ, abs).split(sep).join('/');
    if (juzgar(rel, texto, clases, { exigeDeclaracion: false })) juzgadas += 1;
  }

  if (patronesPresentes.length === 0 && declaradosEnFuente.length === 0) {
    avisos.push(
      'Ninguna superficie de logging en este repositorio: no hay patrón canónico de logging '
      + `ni fichero bajo \`${RAIZ_FUENTE}/\` con el marcador. La puerta se abstiene porque el objeto no está, no por indulgencia.`,
    );
  }
}

for (const w of avisos) console.warn(`  ⚠ ${w}`);

if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  console.error('');
  console.error('  · El piso de clases prohibidas vive en `.harness/data/clases-dato-prohibidas-en-log.json`.');
  console.error('    Es PISO, no techo: un producto añade lo suyo, pero no puede quedarse por debajo (ADR-0193 §2.2).');
  process.exit(1);
}

const n = clases ? clases.length : 0;
if (juzgadas === 0) {
  console.log('  ✔ nada que juzgar: la puerta se abstiene sin veredicto (SD-05).');
} else {
  console.log(`  ✔ ${juzgadas} superficie(s) de logging cubren las ${n} clases del piso.`);
}
process.exit(0);
