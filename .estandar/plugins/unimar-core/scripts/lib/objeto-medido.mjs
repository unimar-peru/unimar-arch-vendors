import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

/* ── El objeto medido: dos métricas de madurez que no se pueden confundir (G-169, ADR-0179)
 *
 * `MADUREZ.md` mide ESTE repositorio. `matriz-madurez.es.md` mide la arquitectura
 * OBJETIVO del Esqueleto de Referencia. Hasta el 2026-07-18 la primera transcribia
 * la puntuacion de la segunda: dos objetos distintos bajo un mismo numero, y la
 * razon por la que los cuatro pilares en nivel 4 cayeron todos a la vez al pedirles
 * evidencia --ninguno media lo construido--.
 *
 * Se corrigio dos veces por escrito --G-101 y la curacion del 2026-07-22-- y las dos
 * volvio, porque la advertencia no la ejercia nadie: al 2026-08-08 la celda de
 * `Arq-Confiabilidad` seguia enlazando la fuente objetivo DENTRO de su columna de
 * Evidencia, en una frase que la negaba.
 *
 * Lo que esta puerta hace, y solo eso: abre cada enlace de la columna Evidencia y
 * se niega si el destino mide otro objeto, o si publica su propia puntuacion sin
 * decir cual mide. No juzga si la evidencia SOSTIENE el nivel --ese limite lo
 * declara `validate-madurez.mjs` desde G-109 y sigue en pie--: estrecha una clase
 * concreta, que es lo unico que puede hacerse desde un script sin fingir mas.
 */

/*
 * Declaracion del objeto medido, en el documento que puntua y no en quien lo cita.
 * Cuenta SOLO si el marcador ocupa su propia linea entera. No es purismo: la
 * primera ejecucion de esta puerta contra el corpus marco a `GAPS.md`, que NOMBRA
 * el marcador entre comillas invertidas al narrar este mismo cierre. Nombrar no es
 * declarar, y una puerta que no distingue las dos cosas bloquea el trabajo de
 * documentar la propia puerta.
 */
const RE_DECLARACION = /^\s*<!--\s*madurez-mide:(objetivo|real)\s*-->\s*$/;

/** Enlaces markdown de una celda. */
const RE_ENLACE = /\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;

/*
 * Que cuenta como «publica su propia puntuacion»: un ENCABEZADO que asigna nivel o
 * nota de madurez. La deteccion por linea suelta --cualquier linea que hable de
 * madurez y lleve una cifra sobre 5-- se probo contra el corpus y marca `GAPS.md`,
 * que NARRA cifras al describir sus hallazgos y es evidencia legitima de una casilla
 * SDLC. Restringida a encabezados devuelve un solo documento en todo el repositorio.
 * Una puerta con falsos positivos se acaba evadiendo (ADR-0179 §2.3).
 */
const RE_ENCABEZADO = /^\s{0,3}#{1,6}\s+(.+?)\s*$/;
const RE_NIVEL = /nivel\s+de\s+madurez\b[^\n]*?\b[1-5]\b/i;
const RE_NOTA = /madurez\b[^\n]*?\b[0-5](?:[.,]\d+)?\s*\/\s*5(?:[.,]\d+)?\b/i;

/** `objetivo`, `real` o `null` si el documento no lo declara. */
export function objetoDeclarado(texto) {
  for (const linea of String(texto).split('\n')) {
    const m = RE_DECLARACION.exec(linea);
    if (m) return m[1];
  }
  return null;
}

/** ¿El documento publica una puntuacion de madurez propia, en un encabezado? */
export function publicaPuntuacion(texto) {
  return String(texto).split('\n').some((linea) => {
    const enc = RE_ENCABEZADO.exec(linea);
    if (!enc) return false;
    return RE_NIVEL.test(enc[1]) || RE_NOTA.test(enc[1]);
  });
}

/**
 * Rutas locales `.md` citadas por una celda. Se descartan las URL externas, los
 * anclajes internos y todo destino que no sea un documento: un directorio, un
 * `.mjs` o una plantilla no publican puntuaciones de madurez.
 */
export function destinosDe(celda) {
  const rutas = [];
  for (const [, destino] of String(celda ?? '').matchAll(RE_ENLACE)) {
    if (/^(https?:|mailto:|#)/i.test(destino)) continue;
    const limpia = destino.split('#')[0].trim();
    if (!limpia.toLowerCase().endsWith('.md')) continue;
    rutas.push(limpia);
  }
  return rutas;
}

/**
 * Juicio sobre un destino ya resuelto en disco. Devuelve `null` si sirve como
 * evidencia de una casilla de estado, o el motivo si no.
 */
export function porQueNoSirveComoEvidencia(ruta, raiz = process.cwd()) {
  const abs = resolve(raiz, ruta);
  if (!existsSync(abs) || !statSync(abs).isFile()) return null; // el enlace roto lo juzga validate-docs (SD-06)
  const texto = readFileSync(abs, 'utf-8');
  const declarado = objetoDeclarado(texto);

  if (declarado === 'objetivo') {
    return `«${ruta}» declara <!--madurez-mide:objetivo-->: puntúa una arquitectura objetivo, `
      + 'no el estado construido, y no puede sostener una casilla de estado (G-169, ADR-0179 §2.2). '
      + 'Si la mención es histórica, sácala de la columna Evidencia y déjala en la nota al pie';
  }
  if (!declarado && publicaPuntuacion(texto)) {
    return `«${ruta}» publica su propia puntuación de madurez y no declara qué objeto mide. `
      + 'Añádele <!--madurez-mide:real--> si puntúa el estado construido de este repositorio, '
      + 'o <!--madurez-mide:objetivo--> si puntúa una arquitectura de referencia (ADR-0179 §2.1)';
  }
  return null;
}

/**
 * La puerta. Recorre la columna Evidencia de las filas ya parseadas de
 * `MADUREZ.md` y falla por cada destino que mida otro objeto.
 */
export function validarObjetoMedido(filas, { fail, raiz = process.cwd() }) {
  let revisados = 0;
  for (const fila of filas ?? []) {
    for (const ruta of destinosDe(fila.evidencia)) {
      revisados++;
      const motivo = porQueNoSirveComoEvidencia(ruta, raiz);
      if (motivo) fail(`${fila.nombre}: ${motivo}.`);
    }
  }
  return { revisados };
}
