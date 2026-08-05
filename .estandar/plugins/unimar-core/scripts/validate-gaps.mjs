#!/usr/bin/env node
/**
 * validate-gaps.mjs
 *
 * Valida y normaliza el Registro Único de Control de Gaps (`GAPS.md`),
 * regla S-20. Un solo archivo, editable a mano; este script lo mantiene
 * ordenado y consistente en cada commit.
 *
 * Orden canónico (los pendientes SIEMPRE primero):
 *   1. Estado       Pendiente < En curso < Cerrado
 *   2. Criticidad   Crítica < Alta < Media < Baja
 *   3. Complejidad  Baja < Media < Alta      (a igual criticidad, primero lo barato)
 *   4. ID           desempate determinista
 *
 * Reglas duras:
 *   - IDs únicos con formato G-NNN
 *   - Criticidad, Complejidad, Estado y Dimensión dentro de sus enumerados
 *   - Un gap `Cerrado` DEBE tener evidencia: commit, PR o ADR. Cerrar sin
 *     evidencia es una afirmación sin respaldo.
 *
 * Forma de la fila: 8 columnas es el contrato base; `Tipo` (9.ª) y `Deuda`
 * (10.ª, ADR-0103 D2) son OPCIONALES. La aridad de lectura admite las tres, y
 * la de reescritura la fija la cabecera del propio fichero.
 *
 * Uso:
 *   node <estandar>/scripts/validate-gaps.mjs           # valida, no escribe
 *   node <estandar>/scripts/validate-gaps.mjs --fix     # reordena y recalcula
 *
 * Salida: 0 si el registro es válido (y, con --fix, ya normalizado); 1 si no.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { celdas } from './lib/tabla.mjs';

/*
 * El mismo archivo corre desde dos sitios: `.harness/scripts/` en el repositorio
 * que autora el estandar, y el cache del plugin en un satelite. Una ruta escrita
 * a mano en el mensaje de ayuda acierta en uno y miente en el otro; esta se
 * deriva de donde el script esta realmente.
 */
const YO = relative(process.cwd(), fileURLToPath(import.meta.url));

const FIX = process.argv.includes('--fix');
const GAPS_PATH = join(process.cwd(), 'GAPS.md');

const ESTADOS = ['Pendiente', 'En curso', 'Cerrado'];
const CRITICIDADES = ['Crítica', 'Alta', 'Media', 'Baja'];
const COMPLEJIDADES = ['Baja', 'Media', 'Alta'];
// Clasificacion del hallazgo. Opcional: la columna puede no existir, pero si
// existe y trae valor, debe ser uno de estos. Un tipo libre seria una etiqueta
// mas, y el registro ya tiene bastantes formas de decir lo mismo.
const TIPOS = ['GAP', 'Riesgo', 'Oportunidad', 'Deuda Técnica', 'Mejora Continua', 'Automatización', 'Decisión Requerida', 'Conocimiento'];
// Marca de deuda tecnica (ADR-0103 D2). Es ORTOGONAL a `Tipo`, que es monovalente:
// un hallazgo puede ser `Riesgo` y ser ademas deuda tecnica, y obligarle a elegir
// entre las dos cosas destruye informacion. Por eso es una columna y no un valor
// mas del enum `TIPOS`. La celda vacia significa `—`, es decir: no es deuda.
const DEUDAS = ['Sí', '—'];

/**
 * Las dimensiones válidas se DERIVAN de MADUREZ.md (columna `Dim.` de cada
 * tabla), más `Herencia`. Así, añadir un pilar o una fase en MADUREZ.md lo
 * reconoce este validador sin tocar el script (gap G-022).
 */
function dimensionesValidas() {
  const p = join(process.cwd(), 'MADUREZ.md');
  const dims = ['Herencia'];
  if (!existsSync(p)) return dims;
  const lines = readFileSync(p, 'utf-8').split('\n');
  for (const re of [/^\|\s*Pilar\s*\|/, /^\|\s*Fase\s*\|/]) {
    const h = lines.findIndex((l) => re.test(l));
    if (h === -1) continue;
    for (let i = h + 2; i < lines.length && lines[i].trim().startsWith('|'); i++) {
      if (!lines[i].trim()) continue;
      const c = celdas(lines[i]);
      const tok = (c[c.length - 1] ?? '').replace(/`/g, '').trim();
      if (tok) dims.push(tok);
    }
  }
  return dims;
}

const DIMENSIONES = dimensionesValidas();

const HEADER_RE = /^\|\s*ID\s*\|/;
/*
 * La forma de la fila la decide la CABECERA DEL PROPIO FICHERO, no una constante
 * ni una bandera: el mismo script normaliza el registro del nucleo, que hoy lleva
 * diez columnas, y el de un satelite que solo declare ocho o nueve. Cablear la
 * aridad de reescritura seria peor que cablear la de lectura, porque `--fix`
 * amputaria en el primer commit la columna que el fichero si declara.
 *
 * Ocho columnas son el contrato base. La novena (`Tipo`) y la decima (`Deuda`,
 * ADR-0103 D2) son opcionales y van AL FINAL a proposito: añadir al final no
 * retira ni acota ninguna regla que un satelite conforme estuviera obedeciendo
 * (ADR-0068 §3.3), luego es `minor`. Insertarlas en medio si seria `major`.
 */
const ARIDADES = [8, 9, 10];
let columnas = 8;
const conTipo = () => columnas >= 9;
const conDeuda = () => columnas >= 10;
const SIN_EVIDENCIA = new Set(['', '—', '-', 'N/A', 'n/a']);

const errors = [];

function fail(msg) { errors.push(msg); }

function parseRow(line) {
  return celdas(line);
}

function readRegistry() {
  if (!existsSync(GAPS_PATH)) {
    fail('No existe GAPS.md en la raíz del repositorio (regla S-20).');
    return null;
  }
  const lines = readFileSync(GAPS_PATH, 'utf-8').split('\n');
  const headerIdx = lines.findIndex((l) => HEADER_RE.test(l));
  if (headerIdx !== -1) columnas = celdas(lines[headerIdx]).length;
  if (headerIdx === -1) {
    fail('GAPS.md no contiene la tabla de registro (falta la cabecera "| ID |").');
    return null;
  }
  const sepIdx = headerIdx + 1;
  let end = sepIdx + 1;
  while (end < lines.length && lines[end].trim().startsWith('|')) end++;

  /*
   * Una fila `| G-NNN |` fuera del bloque contiguo de la tabla se perdía en
   * silencio: el parser se detiene en la primera línea en blanco. Una edición
   * descuidada partió la tabla en dos y el validador respondió "válido y
   * ordenado" ignorando ocho filas, incluidos IDs duplicados. Un validador que
   * calla lo que no entiende es peor que no tenerlo (SD-06).
   */
  const huerfanas = lines
    .map((l, i) => [l, i])
    .filter(([l, i]) => /^\|\s*G-\d{3}\s*\|/.test(l) && (i <= sepIdx || i >= end));
  for (const [, i] of huerfanas) {
    fail(`línea ${i + 1}: fila de gap fuera de la tabla. ¿La partiste con una línea en blanco?`);
  }

  const rows = lines
    .slice(sepIdx + 1, end)
    .filter((l) => l.trim())
    .map((l, i) => {
      const c = parseRow(l);
      // Las tres formas siguen siendo validas a la vez: un satelite que declare 8
      // o 9 columnas no se rompe por que el nucleo adopte la decima.
      if (!ARIDADES.includes(c.length)) {
        fail(`Fila ${i + 1}: se esperaban 8 columnas (9 con Tipo, 10 con Deuda), hay ${c.length}.`);
        return null;
      }
      /*
       * Una fila mas ancha que la cabecera se reescribiria truncada, y truncar en
       * silencio es destruir un dato que alguien escribio a mano. No se falla —eso
       * acotaria una regla que un satelite conforme obedece, y seria `major`— pero
       * se dice en voz alta antes de que `--fix` lo haga irreversible.
       */
      if (c.length > columnas) {
        console.error(`  ⚠ Fila ${i + 1}: trae ${c.length} columnas y la cabecera declara ${columnas}; el sobrante se perdera al normalizar. Declara la columna en la cabecera.`);
      }
      const [id, titulo, criticidad, complejidad, estado, dimension, evidencia, apertura, tipo, deuda] = c;
      return { id, titulo, criticidad, complejidad, estado, dimension, evidencia, apertura, tipo: tipo ?? '', deuda: deuda ?? '' };
    })
    .filter(Boolean);

  return { lines, headerIdx, sepIdx, end, rows };
}

function validate(rows) {
  const vistos = new Set();
  for (const r of rows) {
    if (!/^G-\d{3}$/.test(r.id)) fail(`${r.id || '(sin ID)'}: el ID debe tener el formato G-NNN.`);
    if (vistos.has(r.id)) fail(`${r.id}: ID duplicado.`);
    vistos.add(r.id);

    if (!CRITICIDADES.includes(r.criticidad)) fail(`${r.id}: criticidad "${r.criticidad}" no válida. Use: ${CRITICIDADES.join(' | ')}.`);
    if (!COMPLEJIDADES.includes(r.complejidad)) fail(`${r.id}: complejidad "${r.complejidad}" no válida. Use: ${COMPLEJIDADES.join(' | ')}.`);
    if (!ESTADOS.includes(r.estado)) fail(`${r.id}: estado "${r.estado}" no válido. Use: ${ESTADOS.join(' | ')}.`);
    if (r.tipo && !TIPOS.includes(r.tipo)) fail(`${r.id}: tipo "${r.tipo}" no válido. Use: ${TIPOS.join(' | ')}.`);
    // La celda vacía es legítima y equivale a `—`; cualquier otra cosa no lo es.
    // Un «sí» sin tilde o un «X» convertirían la columna en texto libre, y una
    // marca que no se puede contar no sirve para filtrar nada.
    if (r.deuda && !DEUDAS.includes(r.deuda)) fail(`${r.id}: deuda "${r.deuda}" no válida. Use: ${DEUDAS.join(' | ')} (o la celda vacía, que equivale a —).`);
    if (!DIMENSIONES.includes(r.dimension)) fail(`${r.id}: dimensión "${r.dimension}" no válida. Use una de: ${DIMENSIONES.join(', ')}.`);

    const sinEvidencia = SIN_EVIDENCIA.has(r.evidencia);
    if (r.estado === 'Cerrado' && sinEvidencia) {
      fail(`${r.id}: está Cerrado sin evidencia. Un cierre exige commit, PR o ADR que lo respalde.`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.apertura)) {
      fail(`${r.id}: fecha de apertura "${r.apertura}" inválida. Use AAAA-MM-DD.`);
    }
  }
}

function sortRows(rows) {
  const idx = (arr, v) => { const i = arr.indexOf(v); return i === -1 ? arr.length : i; };
  return [...rows].sort((a, b) =>
    idx(ESTADOS, a.estado) - idx(ESTADOS, b.estado) ||
    idx(CRITICIDADES, a.criticidad) - idx(CRITICIDADES, b.criticidad) ||
    idx(COMPLEJIDADES, a.complejidad) - idx(COMPLEJIDADES, b.complejidad) ||
    a.id.localeCompare(b.id)
  );
}

/*
 * Se reescribe con la aridad que declara la cabecera. `Deuda` no participa en la
 * ordenacion: el orden canonico sigue siendo estado, criticidad, complejidad, ID.
 */
function renderRow(r) {
  const campos = [r.id, r.titulo, r.criticidad, r.complejidad, r.estado, r.dimension, r.evidencia, r.apertura];
  if (conTipo()) campos.push(r.tipo || 'GAP');
  if (conDeuda()) campos.push(r.deuda || '—');
  return `| ${campos.join(' | ')} |`;
}

function renderCounters(rows) {
  const n = (e) => rows.filter((r) => r.estado === e).length;
  return `> **Pendientes:** ${n('Pendiente')} · **En curso:** ${n('En curso')} · **Cerrados:** ${n('Cerrado')} · **Total:** ${rows.length}`;
}

const reg = readRegistry();
if (!reg) {
  for (const e of errors) console.error(`  ✘ ${e}`);
  process.exit(1);
}

validate(reg.rows);
if (errors.length) {
  console.error('━━━ Registro Único de Control de Gaps (S-20) ━━━');
  for (const e of errors) console.error(`  ✘ ${e}`);
  process.exit(1);
}

const sorted = sortRows(reg.rows);
const counterIdx = reg.lines.findIndex((l) => l.startsWith('> **Pendientes:**'));
if (counterIdx === -1) {
  console.error('  ✘ GAPS.md no contiene la línea de contadores "> **Pendientes:** ...".');
  process.exit(1);
}

const out = [...reg.lines];
out[counterIdx] = renderCounters(sorted);
out.splice(reg.sepIdx + 1, reg.end - reg.sepIdx - 1, ...sorted.map(renderRow));

const current = reg.lines.join('\n');
const next = out.join('\n');

if (current === next) {
  console.log(`  ✔ Registro de gaps válido y ordenado (${sorted.length} entradas).`);
  process.exit(0);
}

if (!FIX) {
  console.error('━━━ Registro Único de Control de Gaps (S-20) ━━━');
  console.error('  ✘ GAPS.md está desordenado o sus contadores no cuadran.');
  console.error(`  · Ejecuta: node ${YO} --fix`);
  process.exit(1);
}

writeFileSync(GAPS_PATH, next);
console.log(`  ✔ GAPS.md normalizado: ${sorted.length} entradas reordenadas y contadores recalculados.`);
process.exit(0);
