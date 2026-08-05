#!/usr/bin/env node
/**
 * validate-estructura-satelite.mjs — la materialización del satélite no puede
 * quedar librada a la memoria del operador.
 *
 * Cierra el gap G-054. La regla S-18 se amplió y hoy exige tres cosas que ningún
 * validador comprobaba: un `CONTRIBUTING.md` con el bucle de retorno al núcleo,
 * el esqueleto de directorios de la taxonomía, y una raíz de fuente. Todo eso
 * caía en un punto ciego: `validate-satellite-base.mjs` solo inspecciona
 * artefactos SDLC por nombre (`prd-*`, `historia-*`, `epica-*`), y nunca mira la
 * estructura del repositorio. Un satélite podía quedarse sin `CONTRIBUTING.md`,
 * sin `docs/`, o con un `src/` inexistente, y el barrido pasaba en verde.
 *
 * El fallo real que esto previene: un satélite «dado de alta» al que le falta la
 * única puerta legítima para cambiar el estándar —el `CONTRIBUTING.md` con el
 * camino `propose-upstream`— o cuya taxonomía nunca se materializó. Una regla que
 * depende de que el operador la recuerde no es una regla; es un consejo (S-21).
 * Este validador la convierte en puerta.
 *
 * Comprueba (cwd = raíz del repositorio a validar):
 *   1. No es el padre. Si publica `.harness/catalog.json`, autora el estándar:
 *      no aplica, sale 0. Mismo criterio que `validate-triaje.mjs`.
 *   2. S-16: falla si existe `.harness/` o `inherited.lock` (el estándar viaja
 *      como plugin, no se copia).
 *   3. S-18 raíz de fuente: `src/` es la raíz única en todo arquetipo (ADR-0107).
 *      Un monorepo anida sus sub-raíces dentro de src/ (`src/libs`, `src/apps`,
 *      `src/packages`); `libs/`/`apps/`/`packages/` en el nivel superior se
 *      rechaza con mensaje de migración. Sin código ejecutable, S-18 es `N/A`.
 *   4. S-18 CONTRIBUTING.md: existe y documenta el bucle de retorno al núcleo.
 *   5. S-18 esqueleto: `docs/` (fallo) y `reference/governance/gaps/` (aviso).
 *   6. S-19/S-20 raíz: MADUREZ.md, GAPS.md, DECISIONS.md.
 *   7. S-21 zona protegida: aviso si existe `.claude/agents/` (deriva del plugin).
 *   8. Marcadores de plantilla sin sustituir en los archivos de raíz.
 *
 * Deriva las rutas de `process.cwd()`, no de su ubicación: corre igual desde
 * `.harness/scripts/` que desde el caché del plugin.
 *
 * Uso: node <estandar>/scripts/validate-estructura-satelite.mjs [--verbose]
 * Salida: 0 si la estructura del satélite está materializada; 1 si no.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { celdas } from './lib/tabla.mjs';
import { leerTipo, TIPOS } from './lib/tipo.mjs';

const RAIZ = process.cwd();
const VERBOSE = process.argv.includes('--verbose');

const OPERACIONES = new Set(['Adopt', 'Extend', 'Override', 'N/A']);
const RAICES_MONOREPO = ['libs', 'apps', 'packages'];

/*
 * Marcadores de las plantillas del plugin. Si sobreviven a la sustitución, el
 * satélite tiene un registro sin llenar que aparenta estar lleno: un README que
 * saluda a `NOMBRE_DEL_SATELITE`, un gap que dice `DESCRIBIR_EL_GAP`. Se buscan
 * como token en mayúsculas y con límite de palabra para no confundirlos con
 * prosa legítima.
 */
const MARCADORES = [
  'NOMBRE_DEL_SATELITE', 'FECHA_DE_HOY', 'RAIZ_DE_FUENTE', 'COMANDO_BUILD',
  'COMANDO_PRUEBAS', 'TRIAJE', 'JUSTIFICAR', 'DESCRIBIR_EL_GAP', 'DECLARAR_EL_CAMINO',
];
const ARCHIVOS_RAIZ = ['README.md', 'CONTRIBUTING.md', 'DECISIONS.md', 'GAPS.md', 'MADUREZ.md'];

const errores = [];
const avisos = [];
const fail = (m) => errores.push(m);
const warn = (m) => avisos.push(m);
const detalle = (m) => { if (VERBOSE) console.log(`    · ${m}`); };

const hay = (rel) => existsSync(join(RAIZ, rel));

console.log('━━━ Estructura del satélite (S-16, S-18, S-19, S-20, S-21 / G-054) ━━━');

// 1. La fuente no se materializa: autora. Mismo criterio que validate-triaje.
if (existsSync(join(RAIZ, '.harness', 'catalog.json'))) {
  console.log('  ✔ Este repositorio autora el estándar; no es un satélite. No aplica.');
  process.exit(0);
}

// 1.b Eje `tipo` (ADR-0069): producto | libreria, declarado en DECISIONS.md.
// El defecto es `producto`; un valor no canónico se rechaza, no se asume.
const clas = leerTipo(RAIZ);
if (clas.invalido) {
  fail(`ADR-0069: DECISIONS.md declara \`Tipo de repositorio: ${clas.invalido}\`, que no es canónico. Los valores válidos son: ${TIPOS.join(', ')}.`);
} else if (clas.explicito) {
  detalle(`ADR-0069: tipo de repositorio \`${clas.tipo}\` declarado en DECISIONS.md.`);
} else {
  detalle('ADR-0069: sin declaración de tipo en DECISIONS.md; se asume `producto` (defecto).');
}

// 2. S-16: el estándar viaja como plugin, nunca copiado en el satélite.
if (hay('.harness')) {
  fail('S-16: existe `.harness/` en el satélite. El estándar se instala como plugin, no se copia (ADR-0062).');
} else {
  detalle('S-16: no existe `.harness/`.');
}
if (hay('inherited.lock')) {
  fail('S-16: existe `inherited.lock`. Es un artefacto del modelo de copia, prohibido en el satélite.');
} else {
  detalle('S-16: no existe `inherited.lock`.');
}

/*
 * Se lee la fila de triaje de S-18 en DECISIONS.md una sola vez: de ella salen la
 * operación declarada y su justificación, que gobiernan la desviación de raíz.
 * Se identifica por contenido igual que en validate-triaje: la operación es la
 * celda que dice una de las cuatro canónicas; la justificación, la última.
 */
function triajeS18() {
  if (!hay('DECISIONS.md')) return null;
  const limpia = (s) => (s ?? '').replace(/[`*]/g, '').trim();
  for (const linea of readFileSync(join(RAIZ, 'DECISIONS.md'), 'utf-8').split('\n')) {
    if (!/^\|\s*(\*\*)?S-18\b/.test(linea)) continue;
    const c = celdas(linea);
    const operacion = c.slice(1).map(limpia).find((v) => OPERACIONES.has(v)) ?? limpia(c[c.length - 2]);
    return { operacion, texto: linea };
  }
  return null;
}
const s18 = triajeS18();

// 3. S-18 raíz de fuente: `src/` es la raíz única en todo arquetipo (ADR-0107).
if (hay('src')) {
  detalle('S-18: raíz de fuente `src/` presente.');
} else {
  // src/ ausente. Una raíz de monorepo en el nivel superior ya no se admite:
  // ADR-0107 la reubica dentro de src/ (src/libs, src/apps, src/packages).
  const topMonorepo = RAICES_MONOREPO.find((r) => hay(r));
  if (topMonorepo) {
    fail(`S-18: \`${topMonorepo}/\` está en el nivel superior del repositorio. Desde ADR-0107 la raíz de fuente es \`src/\` en TODO arquetipo: un monorepo anida sus sub-raíces dentro de src/ (\`src/${topMonorepo}\`). Muévela con \`git mv ${topMonorepo} src/${topMonorepo}\` y triaja S-18 como \`Adopt\`.`);
  } else {
    // Sin src/ ni raíz de nivel superior. Solo válido si no hay código ejecutable.
    if (s18 && s18.operacion === 'N/A') {
      detalle('S-18: sin raíz de fuente; DECISIONS.md declara S-18 como N/A (satélite sin código ejecutable).');
    } else {
      fail('S-18: no existe `src/`, la raíz de fuente única (ADR-0107). Créala vacía con `.gitkeep`, o declara S-18 como `N/A` en DECISIONS.md si el satélite no tiene código ejecutable.');
    }
  }
}

// 4. S-18 CONTRIBUTING.md con el bucle de retorno al núcleo.
if (!hay('CONTRIBUTING.md')) {
  fail('S-18: falta CONTRIBUTING.md en la raíz. Es donde el satélite aprende su único camino para cambiar el estándar.');
} else {
  const contrib = readFileSync(join(RAIZ, 'CONTRIBUTING.md'), 'utf-8');
  const bucle = /##.*Contribuir al/i.test(contrib)
    || contrib.includes('propose-upstream')
    || /PR en `?unimar_arch`?/.test(contrib);
  if (!bucle) {
    fail('S-18: CONTRIBUTING.md no documenta el bucle de retorno al núcleo (sección "Contribuir al…", `propose-upstream` o "PR en `unimar_arch`"). Sin él, el satélite tiene la puerta cerrada y ninguna llave.');
  } else {
    detalle('S-18: CONTRIBUTING.md documenta el bucle de retorno al núcleo.');
  }
}

// 5. S-18 esqueleto de la taxonomía.
if (!hay('docs')) {
  fail('S-18: falta el directorio `docs/`. Es parte del esqueleto que prescribe la taxonomía de satélite.');
} else {
  detalle('S-18: `docs/` presente.');
}
if (!hay(join('reference', 'governance', 'gaps'))) {
  warn('S-18: falta `reference/governance/gaps/`. La taxonomía lo prescribe; materialízalo con `.gitkeep`.');
} else {
  detalle('S-18: `reference/governance/gaps/` presente.');
}

// 6. S-19 / S-20: los registros de raíz del satélite.
for (const archivo of ['MADUREZ.md', 'GAPS.md', 'DECISIONS.md']) {
  if (!hay(archivo)) {
    fail(`S-19/S-20: falta ${archivo} en la raíz. Todo satélite lo mantiene.`);
  } else {
    detalle(`S-19/S-20: ${archivo} presente.`);
  }
}

// 7. S-21: zona protegida. Los subagentes los provee el plugin; materializarlos es deriva.
if (hay(join('.claude', 'agents'))) {
  warn('S-21: existe `.claude/agents/`. Los subagentes los provee el plugin; materializarlos localmente es deriva del estándar.');
} else {
  detalle('S-21: no existe `.claude/agents/`.');
}

// 8. Marcadores de plantilla sin sustituir. Un registro sin llenar no pasa por lleno.
for (const archivo of ARCHIVOS_RAIZ) {
  if (!hay(archivo)) continue;
  const contenido = readFileSync(join(RAIZ, archivo), 'utf-8');
  const presentes = MARCADORES.filter((m) => new RegExp(`\\b${m}\\b`).test(contenido));
  if (presentes.length) {
    fail(`Marcadores sin sustituir en ${archivo}: ${presentes.join(', ')}. La plantilla no se rellenó.`);
  } else {
    detalle(`Sin marcadores de plantilla en ${archivo}.`);
  }
}

// Resumen.
if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  for (const a of avisos) console.warn(`  ⚠ ${a}`);
  console.error(`\n  ${errores.length} fallo(s), ${avisos.length} aviso(s). Materializa la estructura antes de seguir.`);
  process.exit(1);
}

for (const a of avisos) console.warn(`  ⚠ ${a}`);
console.log(`  ✔ Estructura del satélite materializada${avisos.length ? ` (${avisos.length} aviso(s))` : ''}.`);
process.exit(0);
