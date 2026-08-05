#!/usr/bin/env node
/**
 * validate-correspondencia.mjs
 *
 * Cruza MADUREZ.md ↔ GAPS.md (gap G-019, reglas S-19 y S-20).
 *
 * MADUREZ.md declara, en su nota rectora, que «cada casilla por debajo de 5
 * debería tener su gap correspondiente en GAPS.md». Ese «debería» no tenía
 * control: este validador lo convierte en regla.
 *
 * Comprueba el sentido MADUREZ -> GAPS: cada casilla de madurez con nivel < 5
 * debe tener al menos un gap en su dimensión. El sentido inverso —que la
 * dimensión de un gap exista en MADUREZ— ya lo garantiza validate-gaps.mjs,
 * que deriva sus dimensiones válidas de la columna Dim. de MADUREZ.md.
 *
 * Uso: node <estandar>/scripts/validate-correspondencia.mjs
 * Salida: 0 si la correspondencia es completa; 1 si no.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { celdas } from './lib/tabla.mjs';

const RAIZ = process.cwd();
const errores = [];
const fail = (m) => errores.push(m);

function filasTabla(lines, re) {
  const h = lines.findIndex((l) => re.test(l));
  if (h === -1) return [];
  const filas = [];
  for (let i = h + 2; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    if (lines[i].trim()) filas.push(celdas(lines[i]));
  }
  return filas;
}

function leer(path, nombre) {
  if (!existsSync(join(RAIZ, path))) {
    console.error(`  ✘ No existe ${nombre} en la raíz del repositorio.`);
    process.exit(1);
  }
  return readFileSync(join(RAIZ, path), 'utf-8').split('\n');
}

// Casillas de MADUREZ con nivel < 5, y su dimensión (columna Dim.).
const madLines = leer('MADUREZ.md', 'MADUREZ.md');
const casillas = [];
for (const re of [/^\|\s*Pilar\s*\|/, /^\|\s*Fase\s*\|/]) {
  for (const c of filasTabla(madLines, re)) {
    const nivel = Number(c[1]);
    const dim = (c[c.length - 1] ?? '').replace(/`/g, '').trim();
    if (dim && Number.isInteger(nivel) && nivel < 5) casillas.push({ nombre: c[0], nivel, dim });
  }
}

// Dimensiones que tienen al menos un gap registrado.
const gapLines = leer('GAPS.md', 'GAPS.md');
const conGap = new Set();
for (const c of filasTabla(gapLines, /^\|\s*ID\s*\|/)) {
  if (/^G-\d{3}$/.test(c[0])) conGap.add(c[5]);
}

for (const k of casillas) {
  if (!conGap.has(k.dim)) {
    fail(`la casilla "${k.nombre}" (${k.dim}, nivel ${k.nivel}) no tiene ningún gap en su dimensión.`);
  }
}

console.log('━━━ Correspondencia MADUREZ ↔ GAPS (S-19, S-20) ━━━');
if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  console.error('\n  Registra el gap del camino al siguiente nivel, o sube la casilla si ya se alcanzó.');
  process.exit(1);
}
console.log(`  ✔ ${casillas.length} casillas < 5, todas con gap. La correspondencia es completa.`);
process.exit(0);
