#!/usr/bin/env node
/**
 * validate-madurez.mjs
 *
 * Valida y puntúa `MADUREZ.md`, regla S-19. Sustituye a
 * generate-maturity-radar.mjs, que imprimía cifras escritas a mano, no leía
 * ningún archivo y fallaba al arrancar (`require` en un módulo ESM).
 *
 * Dos dimensiones, ambas en escala TOGAF ACMM 1..5:
 *   1. Madurez Arquitectónica — los 5 pilares Well-Architected
 *   2. Madurez SDLC           — adopción de artefactos por fase 1..5
 *
 * Reglas duras:
 *   - Nivel entero entre 1 y 5
 *   - Un nivel >= 2 exige evidencia. Afirmar madurez sin prueba no cuenta.
 *   - Un nivel < 5 exige declarar el camino al siguiente nivel.
 *
 * Uso:
 *   node <estandar>/scripts/validate-madurez.mjs            # valida y puntúa
 *   node <estandar>/scripts/validate-madurez.mjs --fix      # reescribe la puntuación
 *   node <estandar>/scripts/validate-madurez.mjs --render   # imprime el radar
 *
 * Salida: 0 si la medición es válida; 1 si no.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { celdas } from './lib/tabla.mjs';
import { leerTipo } from './lib/tipo.mjs';

/*
 * El mismo archivo corre desde dos sitios: `.harness/scripts/` en el repositorio
 * que autora el estandar, y el cache del plugin en un satelite. Una ruta escrita
 * a mano en el mensaje de ayuda acierta en uno y miente en el otro; esta se
 * deriva de donde el script esta realmente.
 */
const YO = relative(process.cwd(), fileURLToPath(import.meta.url));

const FIX = process.argv.includes('--fix');
const RENDER = process.argv.includes('--render');
const PATH = join(process.cwd(), 'MADUREZ.md');

const NIVELES = {
  1: 'Inicial (Ad-Hoc)',
  2: 'En Desarrollo',
  3: 'Definido',
  4: 'Gestionado',
  5: 'Optimizando',
};

const SIN_DATO = new Set(['', '—', '-', 'N/A', 'n/a']);
const errors = [];
const fail = (m) => errors.push(m);

/*
 * Qué cuenta como prueba (G-109).
 *
 * Hasta 2026-07-16 este validador solo comprobaba que la celda de evidencia NO
 * ESTUVIERA VACÍA. Con eso, «40 ADRs core» pasaba la puerta mientras el disco
 * tenía 57, y el registro anunciaba «✔ Madurez válida y puntuada: 3.4 / 5.0»
 * con evidencia falsa dentro: el validador comprobaba el continente y nadie el
 * contenido. La cifra se rompió tres veces en dos días sin que nadie lo notara.
 *
 * Una afirmación de madurez ya no vale por estar escrita. Tiene que apoyarse en
 * algo que otro pueda ir a comprobar:
 *   - un enlace, que `validate-docs.mjs` obliga a resolver (SD-06); o
 *   - una cifra computada del disco, marcada con <!--censo:clave--> y
 *     recomputada por `validate-conteos.mjs` (G-109).
 *
 * Sigue sin poder juzgar si la prueba SOSTIENE lo que afirma —eso es lectura
 * humana—, pero ya no acepta una afirmación que no apunte a ninguna parte. Es
 * el mínimo exigible por SD-05: la evidencia precede a la afirmación.
 */
const RE_ENLACE = /\[[^\]]+\]\([^)]+\)/;
const RE_CENSO = /<!--\s*censo:/;
const hayPrueba = (celda) => RE_ENLACE.test(celda) || RE_CENSO.test(celda);

function parseTable(lines, headerRe) {
  const h = lines.findIndex((l) => headerRe.test(l));
  if (h === -1) return null;
  let end = h + 2;
  while (end < lines.length && lines[end].trim().startsWith('|')) end++;
  return lines.slice(h + 2, end).filter((l) => l.trim()).map((l) => {
    const c = celdas(l);
    return { nombre: c[0], nivel: c[1], evidencia: c[2], camino: c[3] };
  });
}

function validar(filas, etiqueta) {
  if (!filas || filas.length === 0) {
    fail(`${etiqueta}: no se encontró la tabla o está vacía.`);
    return [];
  }
  const niveles = [];
  for (const f of filas) {
    const n = Number(f.nivel);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      fail(`${etiqueta} · ${f.nombre}: nivel "${f.nivel}" inválido. Debe ser un entero de 1 a 5.`);
      continue;
    }
    if (n >= 2 && SIN_DATO.has(f.evidencia)) {
      fail(`${etiqueta} · ${f.nombre}: nivel ${n} sin evidencia. Un nivel ≥ 2 exige prueba enlazada.`);
    } else if (n >= 2 && !hayPrueba(f.evidencia)) {
      fail(`${etiqueta} · ${f.nombre}: nivel ${n} con evidencia que no apunta a nada comprobable. `
        + 'Una celda escrita no es una prueba: exige un enlace que resuelva, o una cifra '
        + 'computada del disco (<!--censo:clave-->). Afirmar madurez sin prueba no cuenta (SD-05, G-109).');
    }
    if (n < 5 && SIN_DATO.has(f.camino)) {
      fail(`${etiqueta} · ${f.nombre}: nivel ${n} sin camino declarado al nivel ${n + 1}.`);
    }
    niveles.push(n);
  }
  return niveles;
}

function media(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function barra(n) {
  const llenos = Math.round(n);
  return '█'.repeat(llenos) + '░'.repeat(5 - llenos);
}

if (!existsSync(PATH)) {
  console.error('  ✘ No existe MADUREZ.md en la raíz del repositorio (regla S-19).');
  process.exit(1);
}

/*
 * Eje `tipo` (ADR-0069). Las dos dimensiones y la escala 1..5 son las mismas para
 * un producto y para una librería; lo que cambia es qué cuenta como evidencia. El
 * validador nunca exigió términos de producto —la evidencia y el camino son texto
 * libre enlazado—, así que una librería ya puede expresar su rendimiento como
 * overhead por llamada o su entrega como cadencia de release. Se anuncia el marco
 * para que la interpretación sea explícita, no un supuesto tácito.
 */
const clas = leerTipo();
if (!RENDER && clas.tipo === 'libreria') {
  console.log('  ℹ Tipo de repositorio: `libreria` (ADR-0069). La madurez se lee en términos de librería: rendimiento = overhead por llamada, confiabilidad = corrección de la propia librería, entrega = cadencia de publicación de paquetes (no DORA), concepción/diseño = corpus de ADRs.');
}

const lines = readFileSync(PATH, 'utf-8').split('\n');
const arq = parseTable(lines, /^\|\s*Pilar\s*\|/);
const sdlc = parseTable(lines, /^\|\s*Fase\s*\|/);

const nArq = validar(arq, 'Arquitectónica');
const nSdlc = validar(sdlc, 'SDLC');

if (errors.length) {
  console.error('━━━ Medición de Madurez (S-19) ━━━');
  for (const e of errors) console.error(`  ✘ ${e}`);
  process.exit(1);
}

const puntArq = media(nArq);
const puntSdlc = media(nSdlc);
const global = media([...nArq, ...nSdlc]);
const fmt = (x) => x.toFixed(1);
const nivelDe = (x) => NIVELES[Math.round(x)] ?? '—';

if (RENDER) {
  console.log('## Radar de Madurez\n');
  console.log('| Dimensión | Nivel | Escala |');
  console.log('| :--- | ---: | :--- |');
  for (let i = 0; i < arq.length; i++) console.log(`| Arq · ${arq[i].nombre} | ${nArq[i]} | \`${barra(nArq[i])}\` |`);
  for (let i = 0; i < sdlc.length; i++) console.log(`| SDLC · ${sdlc[i].nombre} | ${nSdlc[i]} | \`${barra(nSdlc[i])}\` |`);
  console.log(`\n**Global: ${fmt(global)} / 5.0 — ${nivelDe(global)}**`);
  process.exit(0);
}

const bloque = [
  `> **Arquitectónica:** ${fmt(puntArq)} / 5.0 · **SDLC:** ${fmt(puntSdlc)} / 5.0 · **Global:** ${fmt(global)} / 5.0 — ${nivelDe(global)}`,
];

const idx = lines.findIndex((l) => l.startsWith('> **Arquitectónica:**'));
if (idx === -1) {
  console.error('  ✘ MADUREZ.md no contiene la línea de puntuación "> **Arquitectónica:** ...".');
  process.exit(1);
}

if (lines[idx] === bloque[0]) {
  console.log(`  ✔ Madurez válida y puntuada: ${fmt(global)} / 5.0 (${nivelDe(global)}).`);
  process.exit(0);
}

if (!FIX) {
  console.error('━━━ Medición de Madurez (S-19) ━━━');
  console.error('  ✘ La puntuación de MADUREZ.md no cuadra con las tablas.');
  console.error(`  · Esperada: ${bloque[0]}`);
  console.error(`  · Ejecuta: node ${YO} --fix`);
  process.exit(1);
}

lines[idx] = bloque[0];
writeFileSync(PATH, lines.join('\n'));
console.log(`  ✔ MADUREZ.md repuntuado: ${fmt(global)} / 5.0 (${nivelDe(global)}).`);
process.exit(0);
