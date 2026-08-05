/**
 * tipo.mjs — el eje de clasificación de satélite, leído desde una sola fuente.
 *
 * ADR-0069 introduce `tipo` ∈ {`producto`, `libreria`}: un satélite es un sistema
 * que se despliega y opera, o una librería que otros repositorios consumen. El
 * estándar condiciona a este eje las ramas (ADR-0050), los artefactos SDLC
 * (S-01…S-05), el bloque de metadatos de documentación y la interpretación de la
 * madurez ACMM. Que la distinción viva en el estándar —y no en un `Override`
 * local, que S-15 prohíbe— es lo que mantiene una sola fuente de verdad.
 *
 * El satélite lo declara en la cabecera de gobernanza de su `DECISIONS.md`:
 *
 *   > **Tipo de repositorio:** libreria
 *
 * Por defecto es `producto`, de modo que ningún satélite existente cambia de
 * comportamiento sin declararlo. Un valor presente pero no canónico no se asume
 * bueno: se marca `invalido` para que el validador falle en vez de medir con la
 * vara equivocada (el riesgo asumido en el ADR).
 *
 * Un solo lector evita que cada validador reimplemente el parseo y derive.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const TIPOS = ['producto', 'libreria'];
export const TIPO_POR_DEFECTO = 'producto';

/*
 * Reconoce la declaración con tolerancia a la tipografía del satélite: cita de
 * bloque o no, énfasis Markdown, dos puntos, y la eñe de "librería" con o sin
 * tilde. No juzga nada más de la línea: solo extrae el token del tipo.
 */
const DECLARACION = /tipo\s+de\s+repositorio[\s:*`]*([a-záéíóúñ]+)/i;

/** Normaliza `librería`/`Librería` al token canónico `libreria`. */
function canonizar(bruto) {
  const t = bruto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return t === 'libreria' ? 'libreria' : t;
}

/**
 * Lee el tipo declarado del `DECISIONS.md` en `raiz` (por defecto, el cwd).
 * Devuelve:
 *   { tipo, explicito, invalido, bruto }
 * - `tipo`: el valor canónico ('producto' | 'libreria'). Si no se declara o el
 *   valor no es canónico, cae a `TIPO_POR_DEFECTO`.
 * - `explicito`: true si `DECISIONS.md` declaró el campo.
 * - `invalido`: el texto crudo cuando se declaró un valor no canónico; null si no.
 * - `bruto`: el token tal cual apareció, para los mensajes.
 */
export function leerTipo(raiz = process.cwd()) {
  const decisiones = join(raiz, 'DECISIONS.md');
  if (!existsSync(decisiones)) {
    return { tipo: TIPO_POR_DEFECTO, explicito: false, invalido: null, bruto: null };
  }

  for (const linea of readFileSync(decisiones, 'utf-8').split('\n')) {
    const m = linea.match(DECLARACION);
    if (!m) continue;
    const canon = canonizar(m[1]);
    if (TIPOS.includes(canon)) {
      return { tipo: canon, explicito: true, invalido: null, bruto: m[1] };
    }
    return { tipo: TIPO_POR_DEFECTO, explicito: true, invalido: m[1], bruto: m[1] };
  }

  return { tipo: TIPO_POR_DEFECTO, explicito: false, invalido: null, bruto: null };
}
