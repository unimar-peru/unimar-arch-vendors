#!/usr/bin/env node
/**
 * validate-retencion-senal.mjs — la señal de observabilidad declara cuánto dura
 * y quién puede alterarla (S-36, ADR-0197).
 *
 * EL DEFECTO QUE CIERRA
 * ---------------------
 * ADR-0096 §2.7.4 exigió, bajo ISO/IEC 27001:2022 A.8.15 y NIST SP 800-92, que
 * «cada producto DEBE declarar retención por señal y protección contra
 * manipulación». Dos líneas que no fijan ninguna de las tres cosas que hacen
 * falta para obedecerlas, y no puso ejecutor:
 *
 *   1. NO ENUMERA LAS SEÑALES. «Por señal» no dice cuántas hay: quien declare
 *      la de trazas y calle las otras tres ha obedecido la letra.
 *   2. NO FIJA PISO. Sin mínimo, «declarar» se satisface con `24h`.
 *   3. NO DICE DÓNDE. Una declaración sin domicilio no es localizable, y lo que
 *      no es localizable no es comprobable.
 *
 * Medido el 2026-08-09 sobre la organización real con `gh api search/code`:
 * `retention_period` (Loki) → 0 apariciones; `storage.tsdb.retention`
 * (Prometheus) → 0; `block_retention` (Tempo) → 2, ambas en `unimar-ums` y
 * ambas `24h`; `retencion` en cualquier `DECISIONS.md` → 0. Y la mitad de
 * integridad NO estaba entera vacía: ADR-0016 (`Aceptado`) ya decide el destino
 * de solo adición de la pista de auditoría — lo que nadie ha decidido es la
 * protección de las señales OPERATIVAS (G-389).
 *
 * QUÉ COMPRUEBA
 * -------------
 * Sobre el bloque delimitado por `<!--retencion-senal:inicio-->` …
 * `<!--retencion-senal:fin-->` de `DECISIONS.md`:
 *
 *   1. Que el bloque exista y esté cerrado.
 *   2. Que declare UNA fila por CADA clase del piso
 *      `.harness/data/senales-observabilidad.json`, ninguna de más y ninguna
 *      repetida. Callar una clase es el defecto que §2.7.4 permitía.
 *   3. Que la retención use el vocabulario cerrado y no baje del piso numérico
 *      allí donde el piso existe.
 *   4. Que el destino y la base estén escritos. La base NUNCA puede faltar,
 *      tampoco en `no-emite`: una señal que no se emite tiene una razón.
 *   5. Que la protección use el vocabulario cerrado y no quede por debajo de lo
 *      que una decisión ACEPTADA ya ordenó (ADR-0016 para `pista_auditoria`).
 *   6. Que las dos salidas honestas —`ninguna` y `no-gobernada`— nombren en su
 *      celda un `G-NNN` que EXISTA en el «Registro» de `GAPS.md` y siga
 *      ABIERTO. Es la mecánica de S-32: la declaración de ausencia CADUCA con
 *      su pendiente. Sin ella, `ninguna` es la casilla que todos rellenan el
 *      primer día y nadie vuelve a mirar.
 *   7. Coherencia: una clase `no-emite` en retención lo es en protección. No
 *      hay integridad que declarar sobre una señal que no se produce.
 *
 * DOS OLAS, Y LA SEGUNDA NO SE ARMA SOLA (ADR-0197 §2.5)
 * ------------------------------------------------------
 *   · OLA 1 — el núcleo. Bloqueante: sin bloque, rojo.
 *   · OLA 2 — los cinco satélites. El bloque se juzga con el MISMO rigor SI
 *     está; su AUSENCIA se censa y NO puede poner la puerta roja. Armarla es un
 *     acto explícito del propietario —un PR que cambie `OLA_2_ARMADA`—, no una
 *     fecha que se dispara sola y explota en manos de quien pase ese día
 *     (ADR-0188). El pendiente es G-400, y el censo se publica SIEMPRE: una
 *     puerta apagada que nadie nombra es peor que una puerta que no existe.
 *
 * Se distingue núcleo de satélite por la presencia de `.harness/rules/`, que
 * S-16 prohíbe copiar: allí no está por mandato, no por descuido. Es el mismo
 * criterio con que `validate-vigencia.mjs` se abstiene de su ola 1.
 *
 * DOMICILIOS LITERALES, NUNCA UN BARRIDO DEL ÁRBOL, porque el CI monta el
 * paquete publicado dentro de la fuente (ADR-0174, G-347): `DECISIONS.md` y
 * `GAPS.md` en la raíz donde el validador arranca. Los dos existen por mandato
 * en el núcleo (S-15, S-20) y en todo satélite.
 *
 * LÍMITE DECLARADO (ADR-0197 §2.7): esta puerta juzga la DECLARACIÓN, no la
 * configuración. Que Loki borre a los 90 días lo sabe Loki, no este
 * repositorio. Prescribir el interior de un destino que este repositorio no
 * gobierna, no despliega y no puede consultar sería una norma incomprobable
 * desde su propia orilla, y una norma incomprobable se lee como cumplida.
 * Tampoco juzga si la base escrita es buena — igual que S-31 con la razón de
 * una retirada: fingir aquí un juicio de contenido sería confianza falsa.
 *
 * Uso:
 *   node .harness/scripts/validate-retencion-senal.mjs
 *   node .harness/scripts/validate-retencion-senal.mjs --verbose
 *   node .harness/scripts/validate-retencion-senal.mjs --raiz <dir>
 *
 * Salida: 0 si la declaración exigible está y es conforme; 1 si falta o miente
 *         (SD-06).
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { celdas } from './lib/tabla.mjs';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const iRaiz = args.indexOf('--raiz');
const RAIZ = resolve(iRaiz === -1 ? process.cwd() : args[iRaiz + 1]);

/* El piso viaja con el script: se lee junto a él y no desde el cwd, para que
 * funcione igual desde `.harness/` y desde la caché del plugin en un satélite. */
const AQUI = dirname(fileURLToPath(import.meta.url));
const RUTA_PISO = join(AQUI, '..', 'data', 'senales-observabilidad.json');

const MARCA_INICIO = '<!--retencion-senal:inicio-->';
const MARCA_FIN = '<!--retencion-senal:fin-->';

/* Domicilios. Literales, y los dos en la raíz del repositorio. */
const DECISIONES = 'DECISIONS.md';
const REGISTRO_DE_GAPS = 'GAPS.md';
/* La marca de que este árbol es el que AUTORA el estándar (S-16). */
const SENA_DEL_NUCLEO = join('.harness', 'rules');

/**
 * LA OLA 2 NO ESTÁ ARMADA, Y SE ARMA AQUÍ.
 *
 * Cambiar esta constante a `true` es el acto explícito del propietario que
 * ADR-0197 §2.5 exige, y cierra G-400. No hay fecha, no hay disparo automático
 * y no hay variable de entorno: un PR, con su revisión.
 */
const OLA_2_ARMADA = false;

/** Un gap que sigue sosteniendo algo. `Cerrado` no está aquí, y ese es el punto. */
const ESTADOS_GAP_ABIERTO = new Set(['Pendiente', 'En curso']);

/** Vocabulario cerrado de retención, más la duración `Nd` / `Nm` / `Na`. */
const RETENCION_LITERAL = new Set(['indefinida', 'no-emite', 'no-gobernada']);
const RE_DURACION = /^(\d+)\s*([dma])$/i;
/** Conversión declarada en el propio piso para que sea la misma en toda la suite. */
const DIAS_POR_UNIDAD = { d: 1, m: 30, a: 365 };

/** Las dos salidas honestas: legítimas, y con precio. */
const EXIGEN_PENDIENTE = new Set(['ninguna', 'no-gobernada']);

const errores = [];
const avisos = [];

/* ---------------------------------------------------------------- *
 * Piso normativo.
 * ---------------------------------------------------------------- */
function cargarPiso() {
  if (!existsSync(RUTA_PISO)) {
    errores.push(`Piso normativo inexistente: ${RUTA_PISO}. Sin él no hay contra qué medir.`);
    return null;
  }
  let json;
  try {
    json = JSON.parse(readFileSync(RUTA_PISO, 'utf-8'));
  } catch (e) {
    errores.push(`El piso normativo no es JSON válido: ${e.message}`);
    return null;
  }
  const clases = json.clases;
  if (!Array.isArray(clases) || clases.length === 0) {
    errores.push('El piso normativo no declara ninguna clase de señal: `clases` vacío o ausente.');
    return null;
  }
  const protecciones = json.vocabularioProteccion;
  if (!Array.isArray(protecciones) || protecciones.length === 0) {
    errores.push('El piso normativo no declara `vocabularioProteccion`. Sin vocabulario, cualquier palabra pasaría.');
    return null;
  }
  for (const c of clases) {
    if (!c.id || !c.titulo || !c.proteccionMinima) {
      errores.push(`Clase mal formada en el piso: ${JSON.stringify(c.id ?? c)}. Toda clase declara \`id\`, \`titulo\` y \`proteccionMinima\`.`);
      return null;
    }
  }
  return { clases, protecciones: new Set(protecciones) };
}

/* ---------------------------------------------------------------- *
 * El bloque declarado. Se lee SOLO lo que va entre marcas: sin ventana, la
 * prosa que EXPLICA la retención absolvería a quien no la DECLARA, y
 * `DECISIONS.md` es un fichero de prosa densa donde eso ocurriría el primer día
 * (mismo criterio que ADR-0193 §2.3).
 * ---------------------------------------------------------------- */
function bloqueDeclarado(texto) {
  const i = texto.indexOf(MARCA_INICIO);
  if (i === -1) return { bloque: null, abierto: false };
  const j = texto.indexOf(MARCA_FIN, i + MARCA_INICIO.length);
  if (j === -1) return { bloque: null, abierto: true };
  return { bloque: texto.slice(i + MARCA_INICIO.length, j), abierto: false };
}

/**
 * Quita comillas invertidas, negritas y espacios: adorno, no semántica. El
 * guion bajo NO se retira, y es deliberado: `log_aplicacion` y
 * `pista_auditoria` lo llevan en el identificador, y pelarlo convertiría la
 * puerta en un acusador de quien escribe bien el `id` que ella misma exige.
 */
function pelar(celda) {
  return (celda ?? '').replace(/[`*]/g, '').trim();
}

/**
 * Lee el estado de cada gap del `## Registro` de `GAPS.md`. Los índices de
 * columna se DERIVAN del encabezado —la tabla la reordena `validate-gaps.mjs
 * --fix`— para que una columna que se mueva no convierta la puerta en un
 * generador de acusaciones falsas. Mismo criterio que S-31 en `validate-docs`.
 */
function leerEstadosDeGaps(contenido) {
  let dentro = false;
  let vista = false;
  let columnas = null;
  const estados = new Map();
  for (const linea of contenido.split('\n')) {
    if (/^##\s/.test(linea)) {
      if (dentro) break;
      dentro = /^##\s+Registro\s*$/i.test(linea.trim());
      vista ||= dentro;
      continue;
    }
    if (!dentro || !linea.trim().startsWith('|')) continue;
    const c = celdas(linea);
    if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue;
    if (columnas === null) {
      const busca = (re) => c.findIndex((x) => re.test(x.trim()));
      columnas = { id: busca(/^id$/i), estado: busca(/^estado$/i) };
      if (columnas.id === -1 || columnas.estado === -1) return null;
      continue;
    }
    const m = (c[columnas.id] ?? '').match(/G-\d{3,}/);
    if (!m) continue;
    estados.set(m[0], pelar(c[columnas.estado]));
  }
  return vista ? estados : null;
}

/* ---------------------------------------------------------------- *
 * El juicio.
 * ---------------------------------------------------------------- */
function aDias(valor) {
  const m = valor.match(RE_DURACION);
  if (!m) return null;
  return Number(m[1]) * DIAS_POR_UNIDAD[m[2].toLowerCase()];
}

function juzgarPendiente(donde, columna, celda, estados) {
  const m = celda.match(/G-\d{3,}/);
  if (!m) {
    errores.push(
      `${donde}: la columna \`${columna}\` declara una ausencia y no nombra pendiente. `
      + '`ninguna` y `no-gobernada` son legítimas y exigen un `G-NNN` en la misma celda (S-36, ADR-0197 §2.3): '
      + 'sin él, la declaración de ausencia no caduca nunca.',
    );
    return;
  }
  if (estados === null) {
    errores.push(`${donde}: nombra ${m[0]} y este árbol no tiene un \`## Registro\` legible en \`${REGISTRO_DE_GAPS}\`. El pendiente tiene que poder comprobarse.`);
    return;
  }
  const estado = estados.get(m[0]);
  if (estado === undefined) {
    errores.push(`${donde}: nombra ${m[0]}, que no existe en el \`## Registro\` de \`${REGISTRO_DE_GAPS}\`.`);
    return;
  }
  if (!ESTADOS_GAP_ABIERTO.has(estado)) {
    errores.push(
      `${donde}: nombra ${m[0]}, que está \`${estado}\`. La declaración de ausencia CADUCA con su pendiente: `
      + 'o el gap sigue abierto, o la celda ya no puede declarar ausencia (S-36, mecánica de S-32).',
    );
  }
}

function juzgarBloque(bloque, piso, estados) {
  const filas = [];
  for (const linea of bloque.split('\n')) {
    const t = linea.trim();
    if (!t.startsWith('|')) continue;
    const c = celdas(t);
    if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue;
    filas.push(c);
  }
  if (filas.length === 0) {
    errores.push(`${DECISIONES}: el bloque \`retencion-senal\` no contiene ninguna tabla. Una declaración vacía no declara nada.`);
    return;
  }

  const cabecera = filas[0].map((x) => pelar(x).toLowerCase());
  const esperada = ['señal', 'retención', 'destino', 'base', 'protección'];
  if (cabecera.length !== esperada.length || esperada.some((e, k) => cabecera[k] !== e)) {
    errores.push(
      `${DECISIONES}: la cabecera del bloque es \`${cabecera.join(' | ')}\` y debe ser exactamente `
      + `\`${esperada.join(' | ')}\` (S-36, ADR-0197 §2.3).`,
    );
    return;
  }

  const porId = new Map();
  for (const c of filas.slice(1)) {
    if (c.length !== esperada.length) {
      errores.push(`${DECISIONES}: la fila \`${c.join(' | ')}\` tiene ${c.length} celdas y la tabla declara ${esperada.length}.`);
      continue;
    }
    const id = pelar(c[0]);
    if (porId.has(id)) {
      errores.push(`${DECISIONES}: la clase \`${id}\` se declara dos veces. Dos filas para una señal son dos políticas, y la puerta no elige entre ellas.`);
      continue;
    }
    porId.set(id, c);
  }

  const idsPiso = new Set(piso.clases.map((c) => c.id));
  for (const id of porId.keys()) {
    if (!idsPiso.has(id)) {
      errores.push(
        `${DECISIONES}: la fila \`${id}\` no es una clase del piso. Las clases están en `
        + '`.harness/data/senales-observabilidad.json`; inventar una aquí declara una política que nadie mide.',
      );
    }
  }

  for (const clase of piso.clases) {
    const fila = porId.get(clase.id);
    if (!fila) {
      errores.push(
        `${DECISIONES}: no declara la clase \`${clase.id}\` (${clase.titulo}). `
        + 'Callar una señal es exactamente lo que ADR-0096 §2.7.4 permitía y S-36 cierra.',
      );
      continue;
    }
    const donde = `${DECISIONES} · \`${clase.id}\``;
    const retencion = pelar(fila[1]);
    const destino = pelar(fila[2]);
    const base = pelar(fila[3]);
    const proteccion = pelar(fila[4]);

    /* --- Retención ------------------------------------------------ */
    const literal = RETENCION_LITERAL.has(retencion.split(/\s/)[0]);
    const clave = retencion.split(/\s/)[0];
    const dias = aDias(retencion);
    if (!literal && dias === null) {
      errores.push(
        `${donde}: retención \`${retencion || '(vacía)'}\` fuera del vocabulario. `
        + 'Admitidos: `Nd` / `Nm` / `Na`, `indefinida`, `no-emite`, `no-gobernada`.',
      );
    } else if (dias !== null && clase.retencionMinimaDias && dias < clase.retencionMinimaDias) {
      errores.push(
        `${donde}: declara \`${retencion}\` (${dias} días) y el piso es ${clase.retencionMinimaDias} días `
        + `(\`${clase.retencionMinimaTexto ?? ''}\`). Fundamento: ${clase.fundamento}. Es piso, no techo: se puede declarar más, no menos.`,
      );
    } else if (EXIGEN_PENDIENTE.has(clave)) {
      juzgarPendiente(donde, 'Retención', retencion, estados);
    }

    /* --- Destino y base ------------------------------------------- */
    if (!destino || (destino === '—' && clave !== 'no-emite')) {
      errores.push(`${donde}: sin destino escrito. Una retención sin destino no dice dónde vive la señal, y \`—\` solo se admite cuando la retención es \`no-emite\`.`);
    }
    if (!base || base === '—') {
      errores.push(
        `${donde}: sin base escrita. La base NUNCA falta, tampoco en \`no-emite\`: `
        + 'una señal que no se emite tiene una razón, y esa razón es lo que se lee dentro de seis meses.',
      );
    }

    /* --- Protección ----------------------------------------------- */
    const claveProt = proteccion.split(/\s/)[0];
    if (!piso.protecciones.has(claveProt)) {
      errores.push(
        `${donde}: protección \`${proteccion || '(vacía)'}\` fuera del vocabulario. `
        + `Admitidas: ${[...piso.protecciones].join(', ')}.`,
      );
    } else {
      if (clase.proteccionMinima !== 'declarada'
        && !['no-emite', 'no-gobernada', clase.proteccionMinima].includes(claveProt)) {
        errores.push(
          `${donde}: declara \`${claveProt}\` y el piso de esta clase es \`${clase.proteccionMinima}\`. `
          + `No lo decide S-36: lo decidió una decisión ya aceptada — ${clase.fundamento}. `
          + 'Por debajo de eso no cabe ni siquiera con pendiente abierto: no se registra como pendiente lo que ya está ordenado.',
        );
      }
      if (EXIGEN_PENDIENTE.has(claveProt)) juzgarPendiente(donde, 'Protección', proteccion, estados);
    }

    /* --- Coherencia ------------------------------------------------ */
    if ((clave === 'no-emite') !== (claveProt === 'no-emite')) {
      errores.push(
        `${donde}: retención \`${clave}\` y protección \`${claveProt}\` se contradicen. `
        + 'No hay integridad que declarar sobre una señal que no se produce, ni señal sin producir que necesite protegerse.',
      );
    }

    if (VERBOSE && errores.length === 0) {
      console.log(`      ${clase.id}: ${retencion} · ${proteccion}`);
    }
  }
}

/* ================================================================ */

console.log('━━━ La señal declara cuánto dura y quién puede alterarla (S-36, ADR-0197) ━━━');

const piso = cargarPiso();
const esNucleo = existsSync(join(RAIZ, SENA_DEL_NUCLEO));
const ola = esNucleo ? 1 : 2;
const exigeDeclaracion = esNucleo || OLA_2_ARMADA;

let juzgado = false;

if (piso) {
  const rutaDecisiones = join(RAIZ, DECISIONES);
  if (!existsSync(rutaDecisiones)) {
    const falta = `no existe \`${DECISIONES}\` en la raíz. Es el domicilio de la declaración (S-15, ADR-0197 §2.2).`;
    if (exigeDeclaracion) errores.push(falta); else avisos.push(falta);
  } else {
    const texto = readFileSync(rutaDecisiones, 'utf-8');
    const { bloque, abierto } = bloqueDeclarado(texto);
    if (abierto) {
      errores.push(`${DECISIONES}: bloque \`${MARCA_INICIO}\` sin \`${MARCA_FIN}\`. Una declaración sin cierre no delimita nada.`);
    } else if (bloque === null) {
      const falta = `${DECISIONES}: sin bloque \`retencion-senal\`. Envuelve la tabla entre \`${MARCA_INICIO}\` y \`${MARCA_FIN}\` (S-36, ADR-0197 §2.2).`;
      if (exigeDeclaracion) errores.push(falta); else avisos.push(falta);
    } else {
      const rutaGaps = join(RAIZ, REGISTRO_DE_GAPS);
      const estados = existsSync(rutaGaps) ? leerEstadosDeGaps(readFileSync(rutaGaps, 'utf-8')) : null;
      juzgarBloque(bloque, piso, estados);
      juzgado = true;
    }
  }
}

for (const w of avisos) console.warn(`  ⚠ ${w}`);

/* El censo de la ola no armada. Se publica SIEMPRE y NO puede ponerse rojo:
 * armarla es un acto explícito del propietario (ADR-0197 §2.5, G-400). */
if (ola === 2 && !OLA_2_ARMADA) {
  console.log(
    `  · ola 2 declarada y NO armada: este repositorio ${juzgado ? 'declara su bloque y se juzga entero' : 'no declara bloque `retencion-senal`'}. `
    + 'Esto es INSTRUMENTACIÓN y no puede ponerse rojo (G-400).',
  );
}

if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  console.error('');
  console.error('  · El piso de clases de señal vive en `.harness/data/senales-observabilidad.json`.');
  console.error('    Es PISO, no techo: un producto declara más, pero no menos, y no puede callar una clase (ADR-0197 §2.1).');
  console.error('  · Lo que se juzga es la DECLARACIÓN, no la configuración del destino. Que Loki borre a los 90 días');
  console.error('    lo sabe Loki, no este repositorio (ADR-0197 §2.7).');
  process.exit(1);
}

if (juzgado) {
  console.log(`  ✔ ola ${ola}: la declaración cubre las ${piso.clases.length} clases de señal del piso.`);
} else {
  console.log('  ✔ nada exigible que juzgar: la puerta se abstiene sin veredicto (SD-05).');
}
process.exit(0);
