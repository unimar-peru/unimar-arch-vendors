#!/usr/bin/env node
/**
 * validate-vigencia.mjs — la vigencia se declara donde puede sostenerse
 * verdadera (S-35, ADR-0196, G-082).
 *
 * EL DEFECTO, MEDIDO Y NO SUPUESTO. El 2026-08-09, sobre 1 151 documentos
 * `.md`: 185 llevaban una fecha en el pie de copyright y, de los 184 con fecha
 * ISO completa, **133 --el 72,3 %-- declaraban una fecha anterior a la del
 * ultimo commit de su propio fichero**, con un desfase mediano de 31 dias. La
 * ficha de G-082 decia que el problema era la cobertura --«aparece en el
 * 12,8 %»--; la remedicion dice que el problema es la VERACIDAD.
 *
 * Y la razon de que envejeciera esta en donde vivia. No era una cabecera de
 * gobierno: era una linea del sello de copyright, pegada al RUC, que se copiaba
 * con el bloque. Un dato alojado ahi no tiene dueno. Las 14 plantillas de
 * `04-plantillas-artefactos/` lo embarcaban como literal fijo, de modo que todo
 * artefacto nacido de ellas declaraba falso el dia que nacia --y el censo de la
 * organizacion encontro 52 apariciones ya exportadas a cuatro satelites--.
 *
 * POR QUE ESTA PUERTA NO PIDE UNA CABECERA A TODO EL CORPUS. Esa puerta naceria
 * acusando a 966 de 1 151 documentos, ninguno por defecto propio, y su unica via
 * a verde seria fabricar 966 revisiones que nadie hizo. Es el gate que ADR-0160
 * §1.4 manda no escribir. Lo que se hace en su lugar:
 *
 *   1. PROHIBIR la forma que resulto imposible de mantener verdadera --la fecha
 *      en el pie--, en todo el corpus. Acusa lo prohibido y no exige ninguna
 *      presencia (ADR-0160 §2.3): quien cumple no paga nada y quien no cumple
 *      borra una linea. No hay nada que fabricar.
 *   2. OBLIGAR a declarar vigencia solo donde el recorte lo justifica: hoy los
 *      cinco ficheros de `.harness/rules/`, que son la norma que seis satelites
 *      ejecutan y el unico cuerpo del corpus sin otra maquina de estado que lo
 *      feche (un ADR tiene `estado:`, una ficha de gap tiene su registro, un
 *      artefacto SDLC tiene historial por S-13, y lo generado se regenera).
 *   3. CADUCAR lo declarado. Y lo que caduca es una PROMESA --«revisar antes
 *      de»--, no una afirmacion sobre una revision pasada que nadie hizo: por
 *      eso se puede escribir hoy sin fingir nada (SD-05).
 *
 * ESTO NO ENMIENDA «UN BORRADOR NO CADUCA» (ADR-0191 §2.4, ADR-0188). Alli el
 * reloj cambiaria el ESTADO de un ADR sin acto ni autor. Aqui el reloj no cambia
 * ningun estado: pone el CI en rojo y obliga a que una persona commitee. La
 * caducidad no decide, exige que se decida. Es el mismo criterio que
 * `validate-siglas.mjs` ya ejerce sobre la §4.2 del catalogo de siglas.
 *
 * CUATRO AFINADOS QUE NO SON PURISMO: los cuatro vienen de un falso positivo
 * REAL, y los dos ultimos los descubrio esta misma puerta acusando al commit
 * que la introducia --que es la mejor prueba de que hacian falta--.
 *
 *   - Se ANCLA la prohibicion al bloque de copyright --la linea del RUC y las
 *     tres siguientes--. Sin ancla, la puerta acusaria al propio ADR-0196, a la
 *     ficha de G-082 y a `GAPS.md`, que NARRAN el campo para explicarlo. Es la
 *     leccion que ADR-0179 ya pago con `GAPS.md`: nombrar no es declarar.
 *   - Se SALTAN los cercos de codigo. ADR-0196 §1.3 reproduce el pie defectuoso
 *     dentro de un ```html para ensenarlo. Un ejemplo cercado no es un pie, y
 *     una puerta que no distingue las dos cosas bloquea el trabajo de documentar
 *     la propia puerta.
 *   - Se SALTAN las filas de tabla. Un sello de copyright es un BLOQUE y jamas
 *     vive dentro de una celda. Lo que aparece ahi es narracion: la ficha de
 *     G-392 cita `RUC 20100412447 … Última revisión: 2026-08-05` para probar
 *     que esa forma llego a un satelite, y sin esta condicion `GAPS.md` se
 *     acusaba a si mismo por documentar el hallazgo.
 *   - La MARCA cuenta solo si ocupa la linea ENTERA. `GAPS.md` y la ficha de
 *     G-082 escriben la marca entre comillas invertidas para explicar su forma;
 *     una deteccion por aparicion las declaraba malformadas. Es exactamente el
 *     criterio de `lib/objeto-medido.mjs`, y por el mismo motivo.
 *
 * RUTAS LITERALES, NUNCA BARRIDO DEL ARBOL (ADR-0174, G-347): el CI monta el
 * paquete publicado en `.marketplace/` DENTRO del arbol fuente, y un barrido lo
 * contaria como corpus propio. Las raices se nombran una a una.
 *
 * VIAJA AL SATELITE, y viaja porque la prohibicion le vincula: el pie fechado
 * llego alli por nuestras plantillas. La ola la marca el pin del estandar de
 * cada satelite. La obligacion de la ola 1 se ABSTIENE alli porque
 * `.harness/rules/` no existe en un satelite (S-16) -- se abstiene porque el
 * objeto no esta, no por indulgencia.
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = process.cwd();

/**
 * Las raices del corpus AUTORADO, nombradas una a una. Ninguna puede contener un
 * montaje del paquete publicado ni un checkout ajeno.
 *
 * Fuera quedan `.agents/`, `.claude/skills/` y `.opencode/`: los genera
 * `apply-agent-config.mjs` y no los escribimos nosotros. Medido: 0 de sus 326
 * ficheros lleva pie de copyright, asi que excluirlos no tapa nada.
 */
const RAICES = [
  'reference',
  'docs',
  'taxonomy',
  'license',
  '.harness',
  '.github',
  '.claude/agents',
  '.claude/rules',
];

/** Nunca se entra aqui, aparezca donde aparezca. */
const DIRECTORIOS_VETADOS = new Set([
  'node_modules', '.git', '.marketplace', '.estandar', '_bmad', 'dist', 'build', 'coverage',
]);

/** La ola 1 de S-35: los ficheros que SON la norma (ADR-0196 §2.3). */
const OLA_1 = '.harness/rules';

/** La ola 2, declarada y NO armada (ADR-0196 §2.7). Se censa, nunca acusa. */
const OLA_2 = 'reference/governance/standards';

/** El sello de copyright. Dos formas vistas en la organizacion: con RUC y sin el. */
const RE_COPYRIGHT = /RUC\s*20100412447|©\s*Unimar\s*S\.?A\.?/i;
/** Cuantas lineas despues de la del sello siguen siendo pie. */
const ALCANCE_PIE = 3;
/** La fecha de revision, en cualquiera de sus grafias. */
const RE_FECHA_REVISION = /[UÚ]ltima\s+revisi[oó]n\s*:\s*(\d{4}-\d{2}(?:-\d{2})?)/i;

/** Una fila de tabla no es un pie ni una declaracion: es narracion. */
const RE_FILA_TABLA = /^\s*\|/;

/** La marca: linea propia, un solo dato, y ese dato es una promesa. */
const RE_MARCA = /^<!--\s*vigencia:\s*revisar-antes-de=(\S+)\s*-->$/;
/**
 * Cualquier intento de marca QUE OCUPE LA LINEA ENTERA, para poder acusar la
 * forma mal escrita en vez de callar. La linea entera es la condicion: sin ella,
 * quien explica la forma de la marca --`GAPS.md`, la ficha de G-082, este mismo
 * comentario-- quedaba acusado de escribirla mal.
 */
const RE_MARCA_LAXA = /^<!--\s*vigencia\s*:[^]*-->$/i;
/** La linea que lee la persona, que no lee comentarios HTML. */
const RE_PROSA = /^>\s*Vigencia:\s*revisar antes del (\d{4}-\d{2}-\d{2})\b/;
const RE_ISO = /^\d{4}-\d{2}-\d{2}$/;

const fallos = [];
const avisos = [];

/** Ficheros `.md` de una raiz literal, sin entrar en ningun directorio vetado. */
function markdownDe(dirRelativo) {
  const abs = join(RAIZ, dirRelativo);
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return abs.endsWith('.md') ? [dirRelativo] : [];
  const salida = [];
  for (const entrada of readdirSync(abs).sort()) {
    if (DIRECTORIOS_VETADOS.has(entrada)) continue;
    const ruta = join(abs, entrada);
    const st = statSync(ruta);
    if (st.isDirectory()) salida.push(...markdownDe(relative(RAIZ, ruta)));
    else if (entrada.endsWith('.md')) salida.push(relative(RAIZ, ruta));
  }
  return salida;
}

/** Los `.md` sueltos de la raiz del repositorio: README, GAPS, DECISIONS… */
function markdownDeLaRaiz() {
  return readdirSync(RAIZ).sort()
    .filter((f) => f.endsWith('.md') && statSync(join(RAIZ, f)).isFile());
}

/**
 * Lineas del documento marcadas con si estan dentro de un cerco de codigo. Un
 * ejemplo cercado se ensena, no se declara.
 */
function lineasConCerco(texto) {
  let dentro = false;
  return texto.split(/\r?\n/).map((texto_) => {
    if (/^\s*(```|~~~)/.test(texto_)) { dentro = !dentro; return { texto: texto_, cercada: true }; }
    return { texto: texto_, cercada: dentro };
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. La prohibicion: el pie de copyright no declara vigencia. Todo el corpus.
 * ────────────────────────────────────────────────────────────────────────── */

/** @returns {{linea: number, fecha: string}[]} */
export function piesFechados(texto) {
  const ls = lineasConCerco(texto);
  const hallazgos = [];
  for (let i = 0; i < ls.length; i++) {
    if (ls[i].cercada || RE_FILA_TABLA.test(ls[i].texto) || !RE_COPYRIGHT.test(ls[i].texto)) continue;
    for (let j = i; j <= Math.min(i + ALCANCE_PIE, ls.length - 1); j++) {
      if (ls[j].cercada || RE_FILA_TABLA.test(ls[j].texto)) continue;
      const m = RE_FECHA_REVISION.exec(ls[j].texto);
      if (m) { hallazgos.push({ linea: j + 1, fecha: m[1] }); i = j; break; }
    }
  }
  return hallazgos;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. La marca: forma, prosa y caducidad.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Lee la marca de vigencia de un documento.
 * @returns {{estado: 'ausente'}
 *          |{estado: 'malformada', linea: number, texto: string}
 *          |{estado: 'presente', linea: number, fecha: string, prosa: string|null}}
 */
export function marcaDe(texto) {
  const ls = lineasConCerco(texto);
  for (let i = 0; i < ls.length; i++) {
    if (ls[i].cercada || RE_FILA_TABLA.test(ls[i].texto)) continue;
    const linea = ls[i].texto.trim();
    if (!RE_MARCA_LAXA.test(linea)) continue;
    const m = RE_MARCA.exec(linea);
    if (!m) return { estado: 'malformada', linea: i + 1, texto: linea };
    const prosa = ls.map((x) => (x.cercada ? '' : x.texto.trim()))
      .map((t) => RE_PROSA.exec(t)).find(Boolean);
    return { estado: 'presente', linea: i + 1, fecha: m[1], prosa: prosa ? prosa[1] : null };
  }
  return { estado: 'ausente' };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Ejecucion
 * ────────────────────────────────────────────────────────────────────────── */

const corpus = [...markdownDeLaRaiz(), ...RAICES.flatMap(markdownDe)];
const hoy = new Date().toISOString().slice(0, 10);

console.log('━━━ Vigencia declarada: el pie de copyright no la declara (S-35, ADR-0196) ━━━\n');

let conPie = 0;
for (const rel of corpus) {
  const hallazgos = piesFechados(readFileSync(join(RAIZ, rel), 'utf-8'));
  for (const h of hallazgos) {
    conPie++;
    fallos.push(
      `${rel}:${h.linea} — PIE_FECHADO: el sello de copyright declara «Última revisión: ${h.fecha}». `
      + 'Esa fecha no tiene dueño: se copia con el bloque y nadie la mantiene — medido, el 72,3 % de las '
      + 'que había eran falsas frente al propio git (ADR-0196 §1.2). Bórrala: git ya posee la fecha del '
      + 'último cambio, con autor y con diff. Si el documento necesita declarar vigencia, usa la marca '
      + '`<!-- vigencia: revisar-antes-de=AAAA-MM-DD -->` (ADR-0196 §2.2)',
    );
  }
}
if (!conPie) console.log(`  ✔ ${corpus.length} documentos revisados y ninguno fecha su pie de copyright.`);
else console.log(`  ✘ ${conPie} pie(s) de copyright con fecha de revisión.`);

console.log(`\n━━━ Marca de vigencia: forma, prosa y caducidad ━━━\n`);

let marcas = 0;
for (const rel of corpus) {
  const marca = marcaDe(readFileSync(join(RAIZ, rel), 'utf-8'));
  if (marca.estado === 'ausente') continue;
  if (marca.estado === 'malformada') {
    fallos.push(
      `${rel}:${marca.linea} — MARCA_MALFORMADA: «${marca.texto}». La forma es exactamente `
      + '`<!-- vigencia: revisar-antes-de=AAAA-MM-DD -->`, en línea propia y sin más datos (S-35)',
    );
    continue;
  }
  marcas++;
  if (!RE_ISO.test(marca.fecha)) {
    fallos.push(`${rel}:${marca.linea} — FECHA_NO_ISO: «${marca.fecha}». El formato es \`AAAA-MM-DD\` (S-35)`);
    continue;
  }
  if (marca.fecha < hoy) {
    fallos.push(
      `${rel}:${marca.linea} — VIGENCIA_CADUCADA: el documento se comprometió a revisarse antes del `
      + `${marca.fecha} y hoy es ${hoy}. Las salidas son dos y ninguna es dejarlo donde está: revísalo y `
      + 'mueve la fecha —constará quién y en qué commit— o retíralo. La puerta no decide por ti: exige '
      + 'que alguien decida (ADR-0196 §2.6)',
    );
  }
  if (marca.prosa === null) {
    fallos.push(
      `${rel}:${marca.linea} — MARCA_SIN_PROSA: la marca es un comentario HTML y quien lee el documento `
      + `no lee comentarios HTML. Añade la línea \`> Vigencia: revisar antes del ${marca.fecha}\` (S-35)`,
    );
  } else if (marca.prosa !== marca.fecha) {
    fallos.push(
      `${rel}:${marca.linea} — PROSA_DISCREPANTE: la marca dice ${marca.fecha} y la prosa dice `
      + `${marca.prosa}. Dos fechas para el mismo compromiso es el defecto que este ADR retira (S-35)`,
    );
  }
}
console.log(`  ${marcas} documento(s) declaran vigencia. Vencidas: `
  + `${fallos.filter((f) => f.includes('VIGENCIA_CADUCADA')).length}.`);

console.log(`\n━━━ Ola 1 — la norma que seis satélites ejecutan: \`${OLA_1}/\` ━━━\n`);

const ola1 = markdownDe(OLA_1);
if (!ola1.length) {
  console.log(`  ⚠ \`${OLA_1}/\` no existe en este repositorio: la obligación se abstiene porque el objeto`);
  console.log('    no está, no por indulgencia (S-16, ADR-0196 §2.8). La prohibición de arriba sí rige.');
} else {
  let sinMarca = 0;
  for (const rel of ola1) {
    if (marcaDe(readFileSync(join(RAIZ, rel), 'utf-8')).estado !== 'presente') {
      sinMarca++;
      fallos.push(
        `${rel} — SIN_VIGENCIA: es norma publicada y no declara hasta cuándo se sostiene. `
        + 'Añade `<!-- vigencia: revisar-antes-de=AAAA-MM-DD -->` y su línea de prosa (S-35, ADR-0196 §2.3)',
      );
    }
  }
  if (!sinMarca) console.log(`  ✔ los ${ola1.length} ficheros de regla declaran su vigencia.`);
  else console.log(`  ✘ ${sinMarca} de ${ola1.length} ficheros de regla no declaran vigencia.`);
}

console.log(`\n━━━ Ola 2 — censo, declarado y NO armado (ADR-0196 §2.7, G-391) ━━━\n`);

const ola2 = markdownDe(OLA_2);
if (!ola2.length) {
  console.log(`  · \`${OLA_2}/\` no existe aquí: nada que censar.`);
} else {
  const sin = ola2.filter((rel) => marcaDe(readFileSync(join(RAIZ, rel), 'utf-8')).estado !== 'presente');
  console.log(`  · ${sin.length} de ${ola2.length} documentos de \`${OLA_2}/\` no declaran vigencia.`);
  console.log('    Esto es INSTRUMENTACIÓN y no puede ponerse rojo. Armar la ola 2 es un acto explícito');
  console.log('    del propietario —un PR que añada el alcance aquí—, no una fecha que se dispara sola:');
  console.log('    una puerta que se enciende sola explota en las manos de quien pase ese día (ADR-0196 §2.7).');
}

console.log('');
for (const a of avisos) console.log(`  ⚠ ${a}`);
if (fallos.length) {
  console.log(`✘ ${fallos.length} incumplimiento(s) de S-35:\n`);
  for (const f of fallos) console.log(`  ✘ ${f}.`);
  console.log('');
  process.exit(1);
}
console.log(`✓ vigencia coherente: ${corpus.length} documentos sin pie fechado y ${marcas} declaración(es) en vigor.`);
