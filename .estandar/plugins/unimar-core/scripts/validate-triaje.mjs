#!/usr/bin/env node
/**
 * validate-triaje.mjs — el triaje de las reglas de herencia no puede tener huecos.
 *
 * Cierra el gap G-026. S-15 y el Inicio Rapido exigen que cada satelite triaje en
 * su `DECISIONS.md` TODAS las reglas de herencia, declarando la operacion
 * (`Adopt` / `Extend` / `Override` / `N/A`) y su justificacion. Nadie lo
 * comprobaba: un satelite podia omitir una regla, o inventarse una operacion, y
 * ningun validador se enteraba. Una obligacion sin control es una sugerencia.
 *
 * La lista canonica de reglas NO se cablea aqui: se deriva de la tabla
 * «Reglas de Herencia» de `satellite-repo-rules.md`, que viaja con el estandar.
 * Añadir una regla S-23 la vuelve obligatoria en el triaje sin tocar este script.
 *
 * Comprueba:
 *   1. Toda regla canonica aparece en DECISIONS.md, exactamente una vez.
 *   2. Ninguna fila triaja una regla que no existe.
 *   3. La operacion es una de las cuatro canonicas.
 *   4. La justificacion no esta vacia ni es un marcador de plantilla.
 *   5. `Override` exige un enlace: reemplazar una regla sin ADR que lo respalde
 *      es una afirmacion sin evidencia (SD-05).
 *
 * En el repositorio que autora el estandar no hay nada que triajar: no es un
 * satelite. Se reconoce porque publica `.harness/catalog.json`, y el validador
 * sale con 0 sin comprobar nada.
 *
 * Uso: node <estandar>/scripts/validate-triaje.mjs
 * Salida: 0 si el triaje es completo y honesto; 1 si no.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { celdas } from './lib/tabla.mjs';

const RAIZ = process.cwd();
const ESTANDAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const OPERACIONES = new Set(['Adopt', 'Extend', 'Override', 'N/A']);
const MARCADORES = /^(TRIAJE|JUSTIFICAR|TBD|TODO|—|-|\.\.\.)$/i;

const errores = [];
const fail = (m) => errores.push(m);

console.log('━━━ Triaje de las reglas de herencia (S-15, G-026) ━━━');

// La fuente no triaja: autora. Mismo criterio que hook-guard-standard.
if (existsSync(join(RAIZ, '.harness', 'catalog.json'))) {
  console.log('  ✔ Este repositorio autora el estándar; no es un satélite. Nada que triajar.');
  process.exit(0);
}

const reglasDoc = join(ESTANDAR, 'rules', 'satellite-repo-rules.md');
if (!existsSync(reglasDoc)) {
  console.error(`  ✘ No se encuentra la fuente canónica de reglas: ${reglasDoc}`);
  process.exit(1);
}

/*
 * IDs canónicos, de las filas `| **S-NN** | ...` de la tabla de reglas.
 *
 * Se acumulan TODAS las filas de cada número, no la última. Aquí el `Map` no
 * colapsaba: SOBREESCRIBÍA. Una segunda fila `**S-34**` con contenido distinto
 * desalojaba a la legítima, el satélite pasaba a triajar el nombre de la
 * impostora y la regla real desaparecía de todos los mensajes —sin que ninguna
 * salida dijera jamás que había dos— (G-398). Y esta tabla llega DENTRO del
 * paquete: el satélite no puede corregirla, solo obedecerla, así que la
 * ambigüedad tiene que detener el triaje en vez de resolverse en silencio a
 * favor de la que llegó última.
 */
const canonicas = new Map();
readFileSync(reglasDoc, 'utf-8').split('\n').forEach((linea, i) => {
  const m = linea.match(/^\|\s*\*\*(S-\d{2})\*\*\s*\|\s*([^|]+)\|/);
  if (!m) return;
  if (!canonicas.has(m[1])) canonicas.set(m[1], []);
  canonicas.get(m[1]).push({ nombre: m[2].trim(), linea: i + 1 });
});
if (canonicas.size === 0) {
  console.error('  ✘ No se pudo derivar ninguna regla de satellite-repo-rules.md. ¿Cambió el formato de la tabla?');
  process.exit(1);
}

const ambiguas = [...canonicas].filter(([, filas]) => filas.length > 1);
if (ambiguas.length) {
  for (const [id, filas] of ambiguas) {
    console.error(`  ✘ ${id} está declarada ${filas.length} veces en la tabla canónica del estándar:`);
    for (const f of filas) console.error(`      línea ${f.linea}: ${f.nombre}`);
  }
  console.error(
    '\n  Dos reglas distintas bajo el mismo número no son una: la segunda desplazaba a la\n'
    + '  primera y este satélite habría triajado el nombre equivocado, en verde (G-398).\n'
    + '  Esto no se arregla aquí: la tabla viene del estándar. Repórtalo en su repositorio.',
  );
  process.exit(1);
}

const decisiones = join(RAIZ, 'DECISIONS.md');
if (!existsSync(decisiones)) {
  console.error('  ✘ No existe DECISIONS.md en la raíz. S-15 lo exige en todo satélite.');
  process.exit(1);
}

/*
 * Se recorre el archivo entero en vez de acotar a una tabla: una fila de triaje
 * fuera de la tabla —porque alguien la partió con una línea en blanco— se
 * perdería en silencio, que es justo el fallo que G-023 corrigió en los gaps.
 */
const limpia = (s) => (s ?? '').replace(/[`*]/g, '').trim();

/*
 * La tabla de triaje no tiene una forma unica en la practica: unos satelites
 * escriben `| ID | Nombre | Operacion | Justificacion |`, otros añaden una
 * columna de divergencia, y la plantilla del estandar funde el ID y el nombre en
 * una sola celda. Imponer una forma obligaria a reescribir tablas correctas.
 *
 * Se identifica por contenido, no por posicion: el ID es el token `S-NN` de la
 * primera celda, la operacion es la celda que dice una de las cuatro operaciones
 * canonicas, y la justificacion es la ultima.
 */
const triajadas = new Map();
for (const [i, linea] of readFileSync(decisiones, 'utf-8').split('\n').entries()) {
  if (!/^\|\s*(\*\*)?S-\d{2}\b/.test(linea)) continue;
  const c = celdas(linea);
  const id = (limpia(c[0]).match(/^(S-\d{2})/) ?? [])[1];
  if (!id) continue;

  if (triajadas.has(id)) {
    fail(`${id}: triajada dos veces (líneas ${triajadas.get(id).linea} y ${i + 1}).`);
    continue;
  }

  // Si ninguna celda dice una operación canónica, se señala la que ocupa su
  // lugar —la anterior a la justificación—, para que el error apunte al sitio.
  const operacion = c.slice(1).map(limpia).find((v) => OPERACIONES.has(v)) ?? limpia(c[c.length - 2]);
  const justificacion = limpia(c[c.length - 1]);
  triajadas.set(id, { operacion, justificacion, linea: i + 1 });
}

for (const [id, filas] of canonicas) {
  const t = triajadas.get(id);
  if (!t) {
    fail(`${id} (${filas[0].nombre}) no está triajada en DECISIONS.md.`);
    continue;
  }
  if (!OPERACIONES.has(t.operacion)) {
    fail(`${id}: operación "${t.operacion || '(vacía)'}" no es canónica. Use Adopt, Extend, Override o N/A.`);
  }
  if (!t.justificacion || MARCADORES.test(t.justificacion)) {
    fail(`${id}: sin justificación. Un triaje sin razón no es una decisión.`);
  }
  if (t.operacion === 'Override' && !/\[.+\]\(.+\)/.test(t.justificacion)) {
    fail(`${id}: un Override exige enlazar el ADR local que lo justifica (SD-05).`);
  }
}

for (const id of triajadas.keys()) {
  if (!canonicas.has(id)) fail(`${id} se triaja en DECISIONS.md, pero no es una regla del estándar.`);
}

if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  console.error(`\n  ${canonicas.size} reglas canónicas en satellite-repo-rules.md. El triaje debe cubrirlas todas.`);
  process.exit(1);
}

console.log(`  ✔ ${canonicas.size} reglas canónicas, todas triajadas con operación válida y justificación.`);
process.exit(0);
