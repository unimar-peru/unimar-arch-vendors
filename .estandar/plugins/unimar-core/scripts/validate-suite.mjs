#!/usr/bin/env node
/**
 * validate-suite.mjs — el modelo Suite → Sistema → PRD no puede quedar librado a
 * la memoria del operador.
 *
 * Hace aplicable a [ADR-0120]: un repositorio que aloja varios sistemas del
 * catálogo (p. ej. `unimar-scm` = DT+TMS+WMS) declara su Suite y sus Sistemas en
 * `suite.yaml`/`sistema.yaml`, y sus PRDs pertenecen a un sistema. Sin un gate,
 * ese modelo es una convención que cada satélite recuerda a su manera.
 *
 * Es un AVISO por diseño (ADR-0120 §5: gate-able cuando la adopción madure): sin
 * `--strict` sale 0 aunque falten piezas; su salida se lee en el log. No todo
 * satélite es una suite: si no hay `suite.yaml` ni `sistema.yaml`, no aplica.
 *
 * Comprueba (cwd = raíz del satélite):
 *   1. La fuente autora el estándar (`.harness/catalog.json`): no aplica.
 *   2. Si no hay `suite.yaml` ni ningún `sistema.yaml`: el satélite no es una
 *      suite multi-sistema; no aplica (sale 0).
 *   3. `suite.yaml`: `id`, `nombre`, y `sistemas` que sean siglas `Ratificada`
 *      del catálogo. Una sigla `Propuesta` en `sistemas` es una infracción de la
 *      regla 2 del catálogo.
 *   4. Cada `sistema.yaml`: `sigla` `Ratificada`, `suite` coincide con la Suite,
 *      y la sigla está listada en `suite.yaml.sistemas`.
 *   5. Coherencia: cada sistema de `suite.yaml.sistemas` tiene su `sistema.yaml`.
 *
 * `suite.yaml` se lee con `lib/suite.mjs`, el lector unico que comparte con
 * `scaffold-artefactos-fase.mjs`: mientras cada uno traia el suyo, uno aceptaba
 * `sistemas` solo en flujo y el otro solo en bloque, y ninguna forma servia a los
 * dos.
 *
 * Las siglas `Ratificada` se **derivan** del catálogo empaquetado
 * (`reference/architecture/catalogo-sistemas-suite.es.md`), no se cablean. Si el
 * catálogo no viaja en esta copia, la verificación de ratificación se omite con
 * un aviso.
 *
 * Uso: node <estandar>/scripts/validate-suite.mjs [--strict] [--verbose]
 * Salida: 0 (aviso) salvo con --strict y alguna incoherencia.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { yamlPlano, leerSuite, ARCHIVOS_SUITE } from './lib/suite.mjs';
import { fileURLToPath } from 'node:url';

const RAIZ = process.cwd();
const ESTANDAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const VERBOSE = process.argv.includes('--verbose');

const errores = [];
const avisos = [];
const fail = (m) => errores.push(m);
const warn = (m) => avisos.push(m);
const detalle = (m) => { if (VERBOSE) console.log(`    · ${m}`); };
const hay = (rel) => existsSync(join(RAIZ, rel));

console.log('━━━ Modelo Suite → Sistema → PRD (S-?? / ADR-0120) ━━━');

// 1. La fuente autora el estándar; no es un satélite.
if (existsSync(join(RAIZ, '.harness', 'catalog.json'))) {
  console.log('  ✔ Este repositorio autora el estándar; no es un satélite. No aplica.');
  process.exit(0);
}

/** Siglas `Ratificada` derivadas del catálogo empaquetado, si viaja en esta copia. */
function siglasRatificadas() {
  const candidatos = [
    join(ESTANDAR, 'reference', 'architecture', 'catalogo-sistemas-suite.es.md'),
    join(ESTANDAR, '..', 'reference', 'architecture', 'catalogo-sistemas-suite.es.md'),
  ];
  const cat = candidatos.find(existsSync);
  if (!cat) return null;
  const set = new Set();
  for (const linea of readFileSync(cat, 'utf-8').split('\n')) {
    const m = linea.match(/^\|\s*\*\*([A-Z]{2,4})\*\*\s*\|\s*`?Ratificada`?/);
    if (m) set.add(m[1]);
  }
  return set.size ? set : null;
}

/** Busca archivos por nombre exacto, con profundidad acotada. */
function buscar(nombre, maxDepth = 5) {
  const IGNORAR = new Set(['node_modules', '.git', '_bmad', '_bmad-output', 'dist', 'build', 'bin', 'obj', '.nx', '.estandar', '.claude']);
  const hallados = [];
  const pila = [[RAIZ, 0]];
  while (pila.length) {
    const [dir, prof] = pila.pop();
    let entradas;
    try { entradas = readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entradas) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (prof < maxDepth && !IGNORAR.has(e.name)) pila.push([p, prof + 1]); }
      else if (e.name === nombre) hallados.push(p);
    }
  }
  return hallados;
}

// 2. ¿Es una suite multi-sistema?
const suitePath = ARCHIVOS_SUITE.map((f) => join(RAIZ, f)).find(existsSync);
const sistemaPaths = [...buscar('sistema.yaml'), ...buscar('sistema.yml')];
if (!suitePath && sistemaPaths.length === 0) {
  console.log('  ✔ El satélite no declara Suite ni Sistemas (`suite.yaml`/`sistema.yaml`). No aplica.');
  process.exit(0);
}

const RATIFICADAS = siglasRatificadas();
if (!RATIFICADAS) warn('El catálogo de sistemas no viaja en esta copia del estándar; no se verifica la ratificación de siglas.');
const esRatificada = (s) => !RATIFICADAS || RATIFICADAS.has(s);

// 3. suite.yaml
let suite = null;
if (!suitePath) {
  warn('Hay `sistema.yaml` pero no `suite.yaml` en la raíz. Una suite se declara con ambos.');
} else {
  suite = leerSuite(RAIZ) ?? {};
  if (!suite.id) fail('`suite.yaml`: falta `id` (la sigla de la Suite, p. ej. SCM).');
  if (!suite.nombre) warn('`suite.yaml`: falta `nombre`.');
  const sistemas = suite.sistemas ?? [];
  if (!sistemas.length) warn('`suite.yaml`: `sistemas` vacío. Una suite sin sistemas no consolida nada.');
  for (const s of sistemas) {
    if (!esRatificada(s)) fail(`\`suite.yaml\`: el sistema \`${s}\` no es una sigla \`Ratificada\` del catálogo (regla 2: no citable en artefactos normativos).`);
  }
  detalle(`suite \`${suite.id}\` con sistemas [${sistemas.join(', ')}].`);
}

// 4. sistema.yaml
const declarados = new Set();
for (const sp of sistemaPaths) {
  const s = yamlPlano(readFileSync(sp, 'utf-8')).sistema ?? {};
  const rel = sp.slice(RAIZ.length + 1);
  if (!s.sigla) { fail(`\`${rel}\`: falta \`sigla\`.`); continue; }
  declarados.add(s.sigla);
  if (!esRatificada(s.sigla)) fail(`\`${rel}\`: la sigla \`${s.sigla}\` no es \`Ratificada\` (regla 2).`);
  if (suite && s.suite && suite.id && s.suite !== suite.id) fail(`\`${rel}\`: \`suite: ${s.suite}\` no coincide con la Suite declarada \`${suite.id}\`.`);
  if (suite && Array.isArray(suite.sistemas) && !suite.sistemas.includes(s.sigla)) warn(`\`${rel}\`: la sigla \`${s.sigla}\` no está listada en \`suite.yaml.sistemas\`.`);
  detalle(`sistema \`${s.sigla}\` en ${rel}.`);
}

// 5. Coherencia: cada sistema de la suite tiene su sistema.yaml.
if (suite && Array.isArray(suite.sistemas)) {
  for (const s of suite.sistemas) {
    if (!declarados.has(s)) warn(`El sistema \`${s}\` está en \`suite.yaml\` pero no tiene su \`sistema.yaml\`.`);
  }
}

// Resumen.
if (errores.length) {
  // El simbolo sigue al efecto, no a la gravedad. Sin `--strict` esto NO bloquea
  // —ADR-0120 §5— y marcarlo con ✘ hacia leer como fallo lo que es un aviso: quien
  // ve un ✘ en la salida de un commit que paso, o deja de creer al validador o
  // pierde el tiempo buscando que rompio.
  for (const e of errores) {
    if (STRICT) console.error(`  ✘ ${e}`);
    else console.warn(`  ⚠ ${e}`);
  }
  for (const a of avisos) console.warn(`  ⚠ ${a}`);
  if (STRICT) { console.error(`\n  ${errores.length} incoherencia(s). --strict activo: bloquea.`); process.exit(1); }
  console.log(`\n  ${errores.length} incoherencia(s), ${avisos.length} aviso(s) (aviso; ADR-0120 §5: gate-able cuando la adopción madure).`);
  process.exit(0);
}
for (const a of avisos) console.warn(`  ⚠ ${a}`);
console.log(`  ✔ Modelo Suite → Sistema coherente${avisos.length ? ` (${avisos.length} aviso(s))` : ''}: suite \`${suite?.id ?? '—'}\`, sistemas [${[...declarados].join(', ')}].`);
process.exit(0);
