#!/usr/bin/env node
/**
 * validate-criterios.mjs — gate SD-04 (gap G-020). v1 parcial y heurístico.
 *
 * SD-04: «un criterio de aceptación que no se puede ejecutar no es un criterio:
 * es un deseo». De las cuatro reglas Spec-Driven, SD-04 es la más automatizable;
 * SD-01..SD-03 dependen de contexto (código, ADRs, intención) y quedan a la
 * revisión humana y al ruleset del agente.
 *
 * Heurística: bajo un encabezado de «Criterios de Aceptación», marca los
 * criterios que usan un adjetivo vago (rápido, fácil, intuitivo...) SIN un ancla
 * medible (una cifra, un porcentaje, un operador <, >, ≤, ≥). «El sistema debe
 * ser rápido» se marca; «p95 < 200 ms bajo 500 rps» no.
 *
 * Es un AVISO por defecto (sale 0): una heurística tiene falsos positivos y un
 * gate ruidoso que bloquea es peor que no tenerlo (SD-06). Con `--strict` sale 1
 * si encuentra candidatos, para usarlo como puerta dura donde el corpus ya esté
 * limpio (p. ej. un satélite con historias reales).
 *
 * Uso: node <estandar>/scripts/validate-criterios.mjs [--strict]
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const STRICT = process.argv.includes('--strict');
/*
 * Directorios que no son autoria del repositorio que se valida: el estandar
 * empaquetado (`.estandar/`, el checkout efimero que hace el CI de un satelite),
 * las skills y agentes generados (`.claude/`, `_bmad*`), y la fuente del propio
 * estandar (`.harness/`), cuyos ejemplos no son criterios de nadie.
 *
 * `.marketplace` es el mismo caso visto desde la otra punta (G-347): el CI de la
 * FUENTE hace checkout del marketplace ahi —`path: .marketplace` en el paso
 * «Obtener el marketplace» de `.github/workflows/docs.yml`— y dentro esta el
 * plugin publicado, que es un instante anterior de esta misma fuente. Juzgar sus
 * criterios de aceptacion como si fueran del repositorio de hoy es contradictorio
 * por construccion: son los criterios de ayer, ya juzgados cuando eran de hoy.
 * Hoy este validador no reportaba nada de ahi dentro por casualidad —no habia
 * adjetivo vago que pescar—, no por diseno: entraba en el arbol y lo recorria.
 * Con `--strict` esa casualidad era la unica diferencia entre verde y rojo.
 */
const IGNORAR = new Set([
  '.git', '.harness', '.estandar', '.marketplace', 'node_modules', '.claude',
  '_bmad', '_bmad-output', '.opencode', '.agents', 'license',
]);
const ENCABEZADO = /^#{1,6}\s.*criterios?\s+de\s+aceptaci|^#{1,6}\s.*acceptance\s+criteria/i;
const VAGOS = /\b(r[áa]pid[oa]s?|lent[oa]s?|f[áa]cil(es)?|intuitiv[oa]s?|eficiente|escalable|robust[oa]s?|[óo]ptim[oa]s?|amigable|sencill[oa]s?|usable|c[óo]mod[oa]s?|[áa]gil(es)?|flexible|adecuad[oa]s?)\b/i;
const ANCLA = /\d|[<>]=?|≤|≥|%/;

const candidatos = [];

function esCriterio(l) {
  const t = l.trim();
  return /^[-*+]\s/.test(t) || /^\d+[.)]\s/.test(t) || /^\|\s/.test(t);
}

function revisar(archivo) {
  const lineas = readFileSync(archivo, 'utf-8').split('\n');
  let dentro = false;
  for (const l of lineas) {
    if (/^#{1,6}\s/.test(l)) { dentro = ENCABEZADO.test(l); continue; }
    if (!dentro || !esCriterio(l)) continue;
    if (VAGOS.test(l) && !ANCLA.test(l)) {
      candidatos.push({ archivo: archivo.replace(RAIZ + '/', ''), texto: l.trim().slice(0, 100) });
    }
  }
}

function caminar(dir) {
  for (const e of readdirSync(dir)) {
    if (IGNORAR.has(e)) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) caminar(p);
    else if (e.endsWith('.md')) revisar(p);
  }
}

caminar(RAIZ);

console.log('━━━ Criterios de aceptación verificables SD-04 (S-04) ━━━');
if (candidatos.length === 0) {
  console.log('  ✔ Ningún criterio con adjetivo vago sin ancla medible.');
  process.exit(0);
}
console.log(`  ${STRICT ? '✘' : '⚠'} ${candidatos.length} criterio(s) candidato(s) a no verificable:`);
for (const c of candidatos) console.log(`     ${c.archivo}: ${c.texto}`);
console.log('\n  Un criterio verificable declara una medida: «p95 < 200 ms», no «debe ser rápido».');
process.exit(STRICT ? 1 : 0);
