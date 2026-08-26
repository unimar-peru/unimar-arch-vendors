#!/usr/bin/env node
/**
 * validate-ambito-runtime.mjs — el ambito de runtime de un ADR se declara, y la
 * concrecion que promete existe (S-38, ADR-0213, G-412).
 *
 * EL DEFECTO QUE ESTO CIERRA
 * --------------------------
 * El runtime de un ADR se DERIVABA de su directorio y nadie comprobaba jamas
 * que lo prescrito se pudiera ejecutar alli. `validate-adr-status.mjs` dice de
 * ese runtime que si lo valida «contra la verdad», y la verdad que valida es el
 * DOMICILIO: que un ADR de `core/` figure `Agnostico` en las tres vistas. Que su
 * texto obligue a `EventEmitter2` no lo mira nadie, ni puede.
 *
 * El caso que lo enseno fue ADR-0015 (G-124): publicado `Agnostico`, prescribia
 * en cuatro puntos —y en el contrato del puerto— un mecanismo que solo Node.js
 * ejecuta. Se arreglo uno y se midio que el defecto es de CLASE, y en las dos
 * direcciones (G-412 §2).
 *
 * POR QUE ESTO NO ES LA PUERTA LEXICA, QUE YA SE DESCARTO
 * ------------------------------------------------------
 * La puerta obvia —«un ADR de core/ que nombra marcas de un solo runtime es
 * sospechoso»— se formulo, se implemento y se EJECUTO contra el corpus el
 * 2026-08-09: acuso a 33 de 153 y como mucho 10 eran ciertos. `Compose` senalo a
 * tres ADR que hablaban de DOCKER Compose; con un lexico razonable, ADR-0054 y
 * ADR-0193 salieron acusados «solo .NET» TENIENDO una tabla de dos columnas por
 * runtime, es decir: la puerta senalo exactamente a los dos que documentan la
 * simetria. Y ADR-0129, que nombra NestJS cinco veces, ES el ADR que arregla el
 * defecto. Nombrar no es prescribir, y ningun lexico separa la norma del
 * ejemplo: esa distincion es semantica.
 *
 * La medicion se reprodujo el 2026-08-10 sobre `develop` a `1d6786d`, ya con 181
 * ADR: 109 de los 160 de `core/` sin marca alguna, 36 con exactamente una y 15
 * con dos o mas — misma forma, mismo veredicto. Una puerta que acusa a quien
 * cumple acaba desactivada (ADR-0160 §1.4), asi que aqui NO SE ADIVINA NADA:
 * se juzga lo DECLARADO, y lo no declarado se CENSA sin acusarlo.
 *
 * LO QUE SE JUZGA
 * ---------------
 *   `ambito_runtime:`  en el front-matter. Vocabulario cerrado: `agnostico`, o
 *                      uno o varios de los runtimes autorizados. Su AUSENCIA es
 *                      «sin declarar» y NO es `agnostico`: confundirlas
 *                      convertiria 179 silencios en 179 afirmaciones falsas, que
 *                      es el riesgo principal de esta forma.
 *   `concreciones:`    donde vive el mecanismo de cada runtime en alcance.
 *                      Destino: un ADR que EXISTE y VINCULA, un `G-NNN` que
 *                      existe y sigue ABIERTO —el hueco declarado como hueco—,
 *                      o `no-aplica`.
 *
 * Y la CONCORDANCIA entre el domicilio (el directorio, que ya declara runtime en
 * los tres indices) y el ambito declarado. Discordar es legitimo —es justo el
 * defecto de G-412 dicho en voz alta— y CUESTA UNA FICHA ABIERTA en la misma
 * linea: la mecanica de S-32, donde la declaracion de incumplimiento caduca con
 * su pendiente. Concordar no cuesta nada.
 *
 * DOS OLAS
 * --------
 *   · OLA 1 — los ADR NUEVOS del nucleo, los de numero >= 213. Bloqueante: sin
 *     campo, rojo. Y CUALQUIER ADR que declare el campo se juzga entero, viva
 *     donde viva y sea cual sea su numero: quien declara responde de lo que
 *     declara desde el primer dia.
 *   · OLA 2 — los 181 ADR existentes y los de satelite. Se CENSAN en cada
 *     ejecucion y su silencio NO puede poner la puerta roja. Armarla es un acto
 *     explicito del propietario —un PR que cambie `OLA_2_ARMADA`—, no una fecha
 *     que se dispara sola (ADR-0188). El pendiente es G-441.
 *
 * El corte es el NUMERO y no una fecha porque en numeracion densa el numero ES
 * la marca de tiempo: S-26 lo reclama empujando y nadie puede obtener hoy uno
 * menor que el ultimo publicado. Asi ningun ADR existente puede caer en la ola 1
 * por sorpresa, y ninguno nuevo puede escaparse de ella.
 *
 * LIMITES DECLARADOS (ADR-0213 §3)
 * --------------------------------
 *   · NO lee la prosa normativa de ningun ADR y NO deduce el ambito de nadie.
 *     Deducirlo es la adivinacion lexica ya descartada.
 *   · NO juzga si el ambito declarado es CIERTO. Que ADR-0009 sea de verdad
 *     agnostico lo decide quien lo lee, no un lector de Markdown; lo que esta
 *     puerta impide es que la declaracion se contradiga con el disco.
 *   · `no-aplica` no cuesta prueba, y es deliberado: un cliente movil no aloja
 *     contextos delimitados de servidor, y exigir ficha por decirlo convertiria
 *     la forma en un peaje. Mismo limite que ADR-0210 §2.8.3 con `estandar`.
 *   · Donde el ADR no vive en un directorio de runtime conocido —un satelite que
 *     los agrupa de otro modo— la concordancia SE ABSTIENE y lo dice: no hay
 *     domicilio contra el que contrastar, y fingir el juicio seria peor.
 *
 * Uso:
 *   node .harness/scripts/validate-ambito-runtime.mjs
 *   node .harness/scripts/validate-ambito-runtime.mjs --verbose
 *   node .harness/scripts/validate-ambito-runtime.mjs --raiz <dir>
 *
 * Salida: 0 si lo exigible esta y lo declarado es cierto; 1 si falta o miente
 *         (SD-06).
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { celdas } from './lib/tabla.mjs';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const iRaiz = args.indexOf('--raiz');
const RAIZ = resolve(iRaiz === -1 ? process.cwd() : args[iRaiz + 1]);

/* Domicilio literal, en la raiz del repositorio (ADR-0174). Es donde se resuelve
 * el `G-NNN` de un hueco declarado y el de una discordancia asumida. */
const REGISTRO_DE_GAPS = 'GAPS.md';

/** La marca de que este arbol es el que AUTORA el estandar (S-16). */
const SENA_DEL_NUCLEO = join('.harness', 'rules');

/**
 * LA OLA 1: EL PRIMER NUMERO OBLIGADO.
 *
 * 213 es el numero de ADR-0213, la decision que crea esta forma. Todo ADR del
 * nucleo con numero igual o mayor nace obligado a declarar su ambito; ninguno
 * anterior puede caer aqui, porque el numero se reclama empujando (S-26) y no
 * existe forma de obtener hoy uno menor.
 */
const PRIMER_ADR_OBLIGADO = 213;

/**
 * LA OLA 2 NO ESTA ARMADA, Y SE ARMA AQUI.
 *
 * Cambiar esta constante a `true` es el acto explicito del propietario que
 * ADR-0213 §2.6 exige, y cierra G-441. No hay fecha, no hay disparo automatico
 * y no hay variable de entorno: un PR, con su revision. Armarla el dia uno
 * pondria en rojo 179 ADR que nadie ha podido tocar todavia, y la unica via
 * rapida a verde seria rellenar 179 campos sin leer un solo ADR — que es
 * exactamente la mentira que esta forma existe para impedir.
 */
const OLA_2_ARMADA = false;

/**
 * Los runtimes sobre los que «ambito» significa algo, y el directorio que los
 * domicilia. Es la MISMA tabla que `validate-adr-status.mjs` cablea para cruzar
 * los indices, y se repite aqui a proposito: aquel recibe un directorio de ADR y
 * este arranca en la raiz del repositorio, de modo que no comparten contrato ni
 * pueden compartir modulo sin que uno de los dos mienta sobre su alcance.
 *
 * `core` NO es un runtime: es el domicilio de lo agnostico, y por eso su ambito
 * esperado es la palabra `agnostico` y no un identificador de runtime.
 */
const RUNTIMES = ['nodejs', 'dotnet', 'android'];
const DOMICILIOS = new Map([
  ['core', 'agnostico'],
  ['nodejs', 'nodejs'],
  ['dotnet', 'dotnet'],
  ['android', 'android'],
]);

/** El vocabulario cerrado del campo. Cualquier otra palabra es un hallazgo. */
const VOCABULARIO = new Set(['agnostico', ...RUNTIMES]);

/** Los destinos de una concrecion que no son una referencia. */
const SIN_CONCRECION = 'no-aplica';

/** Los estados en que un ADR VINCULA (SD-03). Un `Borrador` no cubre nada. */
const VINCULANTES = new Set(['Aceptado', 'Aprobado']);

/** Un gap que sigue sosteniendo algo. `Cerrado` no esta aqui, y ese es el punto. */
const ESTADOS_GAP_ABIERTO = new Set(['Pendiente', 'En curso']);

/**
 * Lo que no es corpus de este repositorio, y los DOS montajes no son ruido en
 * esta lista: son la razon de ser de la linea (ADR-0174, G-347).
 *
 * `.marketplace` es el checkout del marketplace que el CI deja DENTRO del arbol
 * para compararlo, y `.estandar` el nombre con que un satelite monta el paquete
 * publicado. Los dos traen un corpus de ADR ajeno y COMPLETO: censarlos haria
 * que este repositorio contara como suyos los 182 del espejo, y que todo
 * satelite naciera con 182 ADR sin declarar ambito por el mero hecho de tener el
 * estandar instalado. Lo detecto `validate-ceguera-al-paquete.mjs` en la primera
 * ejecucion de CI de esta puerta: la sonda planta un ADR-9999 con
 * `estado: Inventado` dentro del montaje, y sin esta exclusion caia en la ola 1
 * y ponia la puerta roja por un fichero que no es de nadie.
 */
const EXCLUIDOS = new Set([
  '.git', '.estandar', '.marketplace', 'node_modules', 'dist', 'bin', 'obj', '_bmad', '.venv', 'vendor',
]);

/** Las dos identidades de ADR que el estandar admite (S-15). */
const RE_ARCHIVO_ADR = /^(\d{4}|[A-Z][A-Z0-9]*-\d{3})-.*\.md$/;

const errores = [];
const avisos = [];

/* ---------------------------------------------------------------- *
 * Censo del arbol: donde estan los ADR de ESTE repositorio.
 * ---------------------------------------------------------------- */
function censarAdrs() {
  const hallados = [];
  let presupuesto = 60000;
  const pila = [['', 0]];
  while (pila.length && presupuesto > 0) {
    const [rel, prof] = pila.pop();
    if (prof > 8) continue;
    let entradas;
    try { entradas = readdirSync(join(RAIZ, rel), { withFileTypes: true }); } catch { continue; }
    for (const e of entradas) {
      if (presupuesto-- <= 0) break;
      const hijo = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (EXCLUIDOS.has(e.name)) continue;
        pila.push([hijo, prof + 1]);
        continue;
      }
      if (!e.isFile()) continue;
      const m = e.name.match(RE_ARCHIVO_ADR);
      if (!m) continue;
      hallados.push({ ruta: hijo, id: m[1], dir: basename(dirname(hijo)) });
    }
  }
  return hallados.sort((a, b) => a.ruta.localeCompare(b.ruta));
}

/* ---------------------------------------------------------------- *
 * El front-matter, leido linea a linea y nunca como YAML completo.
 *
 * El corpus escribe el front-matter plano a proposito —`supersede: [0005]` en
 * una linea— y toda puerta que lo lee usa la misma forma. Meter aqui un lector
 * de YAML anidado obligaria a los otros seis a entenderlo.
 * ---------------------------------------------------------------- */
function frontMatter(texto) {
  const fm = texto.match(/^---\n([\s\S]*?)\n---/);
  return fm ? fm[1] : null;
}

function campo(fm, nombre) {
  if (fm === null) return undefined;
  const m = fm.match(new RegExp(`^${nombre}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim() : undefined;
}

/** Quita comillas y comas de un elemento de lista plana. */
const pelar = (s) => s.trim().replace(/^["']|["']$/g, '').trim();

/**
 * Lee un valor que puede venir suelto o entre corchetes, con un `(G-NNN)` opcional
 * detras. Devuelve `{ valores, pendiente, crudo }`.
 *
 *   `agnostico`                     -> valores: ['agnostico'],        pendiente: null
 *   `[nodejs, dotnet]`              -> valores: ['nodejs','dotnet'],  pendiente: null
 *   `nodejs (G-441)`                -> valores: ['nodejs'],           pendiente: 'G-441'
 */
function listaPlana(crudo) {
  let resto = crudo;
  let pendiente = null;
  const p = resto.match(/\((G-\d{3,})\)\s*$/);
  if (p) { pendiente = p[1]; resto = resto.slice(0, p.index).trim(); }
  const corchetes = resto.match(/^\[([\s\S]*)\]$/);
  const cuerpo = corchetes ? corchetes[1] : resto;
  const valores = cuerpo.split(',').map(pelar).filter(Boolean);
  return { valores, pendiente, crudo };
}

/* ---------------------------------------------------------------- *
 * El registro de gaps. Se lee del `## Registro` de GAPS.md, que es la unica
 * fuente de estado (S-20). Devuelve null si este arbol no lo tiene legible.
 * ---------------------------------------------------------------- */
function estadosDeGaps() {
  const ruta = join(RAIZ, REGISTRO_DE_GAPS);
  if (!existsSync(ruta)) return null;
  const estados = new Map();
  let dentro = false;
  let vista = false;
  let columnas = null;
  for (const linea of readFileSync(ruta, 'utf-8').split('\n')) {
    if (/^##\s+/.test(linea)) {
      dentro = /^##\s+Registro\s*$/i.test(linea.trim());
      vista ||= dentro;
      if (!dentro) columnas = null;
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
    estados.set(m[0], pelar(c[columnas.estado]).replace(/[^\p{L}\s]/gu, '').trim());
  }
  return vista ? estados : null;
}

/* ---------------------------------------------------------------- *
 * El juicio.
 * ---------------------------------------------------------------- */

/** Comprueba que un `G-NNN` exista y siga abierto. Mecanica de S-32. */
function juzgarPendiente(donde, gap, estados) {
  if (estados === null) {
    errores.push(`${donde} nombra ${gap} y este arbol no tiene un \`## Registro\` legible en \`${REGISTRO_DE_GAPS}\`. El pendiente tiene que poder comprobarse.`);
    return;
  }
  const estado = estados.get(gap);
  if (estado === undefined) {
    errores.push(`${donde} nombra ${gap}, que no existe en el \`## Registro\` de \`${REGISTRO_DE_GAPS}\`.`);
    return;
  }
  if (!ESTADOS_GAP_ABIERTO.has(estado)) {
    errores.push(
      `${donde} nombra ${gap}, que esta \`${estado}\`. La declaracion caduca con su pendiente: `
      + 'o el gap sigue abierto, o la declaracion ya no puede apoyarse en el (S-38, mecanica de S-32).',
    );
  }
}

/** Comprueba el destino de una concrecion contra el disco. */
function juzgarDestino(donde, runtime, destino, porId, estados) {
  if (destino === SIN_CONCRECION) return;

  const gap = destino.match(/^G-\d{3,}$/);
  if (gap) { juzgarPendiente(`${donde}: la concrecion de \`${runtime}\``, destino, estados); return; }

  const adr = destino.match(/^ADR-(\d{4}|[A-Z][A-Z0-9]*-\d{3})$/);
  if (!adr) {
    errores.push(
      `${donde}: la concrecion de \`${runtime}\` apunta a "${destino}", que no es un destino admitido. `
      + `Se admite un ADR (\`ADR-0203\`), un pendiente abierto (\`G-413\`) o \`${SIN_CONCRECION}\` (S-38, ADR-0213 §2.3).`,
    );
    return;
  }
  const objetivo = porId.get(adr[1]);
  if (!objetivo) {
    errores.push(
      `${donde}: la concrecion de \`${runtime}\` apunta a ${destino}, que NO EXISTE en este arbol. `
      + 'Una concrecion prometida y ausente es peor que un hueco declarado: el hueco se ve.',
    );
    return;
  }
  if (!VINCULANTES.has(objetivo.estado ?? '')) {
    errores.push(
      `${donde}: la concrecion de \`${runtime}\` apunta a ${destino}, que esta "${objetivo.estado ?? 'sin estado legible'}" (${objetivo.ruta}). `
      + 'Un ADR que no vincula no concreta nada (SD-03): o se acepta, o el runtime declara su hueco con un `G-NNN` abierto.',
    );
  }
}

function juzgarAdr(adr, porId, estados) {
  const donde = adr.ruta;
  const ambito = listaPlana(adr.ambitoCrudo);

  // 1. Vocabulario cerrado.
  const fuera = ambito.valores.filter((v) => !VOCABULARIO.has(v));
  if (fuera.length) {
    errores.push(
      `${donde}: \`ambito_runtime\` dice "${adr.ambitoCrudo}" y ${fuera.map((f) => `"${f}"`).join(', ')} no esta en el vocabulario. `
      + `Se admite \`agnostico\` o uno o varios de ${RUNTIMES.map((r) => `\`${r}\``).join(', ')} (S-38, ADR-0213 §2.2).`,
    );
    return;
  }
  if (ambito.valores.length === 0) {
    errores.push(`${donde}: \`ambito_runtime\` esta vacio. La ausencia del campo se censa; un campo vacio afirma nada y ocupa el sitio de la afirmacion.`);
    return;
  }
  if (ambito.valores.includes('agnostico') && ambito.valores.length > 1) {
    errores.push(
      `${donde}: \`ambito_runtime\` dice "${adr.ambitoCrudo}". \`agnostico\` no se combina con un runtime: `
      + 'o la norma se puede obedecer en cualquiera, o nombra en cuales obliga.',
    );
    return;
  }
  const duplicados = ambito.valores.filter((v, i) => ambito.valores.indexOf(v) !== i);
  if (duplicados.length) {
    errores.push(`${donde}: \`ambito_runtime\` repite ${duplicados.map((d) => `\`${d}\``).join(', ')}.`);
    return;
  }

  // 2. Concordancia domicilio <-> ambito.
  const esperado = DOMICILIOS.get(adr.dir);
  if (esperado === undefined) {
    avisos.push(`${donde}: vive en \`${adr.dir}/\`, que no es un domicilio de runtime conocido. La concordancia se abstiene: no hay contra que contrastar.`);
  } else {
    const concuerda = esperado === 'agnostico'
      ? ambito.valores.length === 1 && ambito.valores[0] === 'agnostico'
      : ambito.valores.includes(esperado);
    if (!concuerda) {
      if (ambito.pendiente === null) {
        errores.push(
          `${donde}: vive en \`${adr.dir}/\` —que los tres indices publican como "${esperado === 'agnostico' ? 'Agnostico' : esperado}"— y declara \`ambito_runtime: ${ambito.valores.join(', ')}\`. `
          + 'Discordar es legitimo y es el defecto de G-412 dicho en voz alta, pero CUESTA una ficha abierta en la misma linea '
          + `(\`ambito_runtime: ${ambito.valores.join(', ')} (G-NNN)\`): sin ella, la contradiccion entre el domicilio y la norma no caduca nunca (S-38, ADR-0213 §2.4).`,
        );
      } else {
        juzgarPendiente(`${donde}: la discordancia entre \`${adr.dir}/\` y el ambito declarado`, ambito.pendiente, estados);
      }
    } else if (ambito.pendiente !== null) {
      errores.push(
        `${donde}: declara \`ambito_runtime: ${adr.ambitoCrudo}\` y el ambito CONCUERDA con su domicilio \`${adr.dir}/\`. `
        + 'Un pendiente detras de una declaracion conforme no dice nada y envejece sin dueno: retiralo o corrige el ambito.',
      );
    }
  }

  // 3. Las concreciones.
  if (adr.concrecionesCrudo === undefined) return;
  const enAlcance = ambito.valores[0] === 'agnostico' ? RUNTIMES : ambito.valores;
  const entradas = listaPlana(adr.concrecionesCrudo).valores;
  if (entradas.length === 0) {
    errores.push(`${donde}: \`concreciones\` esta vacio. Se declara con destinos o no se declara.`);
    return;
  }
  const vistos = new Map();
  let malFormada = false;
  for (const e of entradas) {
    const m = e.match(/^([a-z0-9_-]+)\s*=\s*(.+)$/i);
    if (!m) {
      errores.push(`${donde}: la concrecion "${e}" no tiene la forma \`runtime=destino\` (S-38, ADR-0213 §2.3).`);
      malFormada = true;
      continue;
    }
    const [, runtime, destino] = [m[0], m[1].trim(), m[2].trim()];
    if (vistos.has(runtime)) {
      errores.push(`${donde}: \`concreciones\` nombra \`${runtime}\` dos veces.`);
      malFormada = true;
      continue;
    }
    vistos.set(runtime, destino);
    if (!RUNTIMES.includes(runtime)) {
      errores.push(`${donde}: \`concreciones\` nombra \`${runtime}\`, que no es un runtime autorizado (${RUNTIMES.join(', ')}).`);
      malFormada = true;
      continue;
    }
    if (!enAlcance.includes(runtime)) {
      errores.push(
        `${donde}: \`concreciones\` reparte \`${runtime}\` y \`ambito_runtime\` no lo tiene en alcance (${enAlcance.join(', ')}). `
        + 'Una concrecion para un runtime que la norma no obliga es una regla que nadie tiene que cumplir.',
      );
      malFormada = true;
      continue;
    }
    juzgarDestino(donde, runtime, destino, porId, estados);
  }
  if (malFormada) return;

  // El silencio no es una respuesta: quien reparte concreciones las reparte
  // TODAS. Callar un runtime es como se cubre un hueco sin declararlo, que es
  // el defecto que S-36 cerro en la observabilidad y S-37 en el analisis.
  const callados = enAlcance.filter((r) => !vistos.has(r));
  if (callados.length) {
    errores.push(
      `${donde}: \`concreciones\` calla ${callados.map((c) => `\`${c}\``).join(', ')}, que su \`ambito_runtime\` si obliga. `
      + `Quien reparte concreciones las reparte todas: \`${SIN_CONCRECION}\` y un \`G-NNN\` abierto son respuestas; el silencio no (S-38, ADR-0213 §2.3).`,
    );
  }
}

/* ---------------------------------------------------------------- *
 * Ejecucion.
 * ---------------------------------------------------------------- */
const esNucleo = existsSync(join(RAIZ, SENA_DEL_NUCLEO));
const inventario = censarAdrs();

for (const a of inventario) {
  const texto = readFileSync(join(RAIZ, a.ruta), 'utf-8');
  const fm = frontMatter(texto);
  a.estado = campo(fm, 'estado');
  a.ambitoCrudo = campo(fm, 'ambito_runtime');
  a.concrecionesCrudo = campo(fm, 'concreciones');
  a.numero = /^\d{4}$/.test(a.id) ? Number(a.id) : null;
}

const porId = new Map(inventario.map((a) => [a.id, a]));
const estados = estadosDeGaps();

/* La ola 1: los ADR nuevos del nucleo declaran, o rojo. */
const obligados = inventario.filter((a) => esNucleo && a.numero !== null && a.numero >= PRIMER_ADR_OBLIGADO);
for (const a of obligados) {
  if (a.ambitoCrudo === undefined) {
    errores.push(
      `${a.ruta}: ADR-${a.id} nace bajo la ola 1 (numero >= ${PRIMER_ADR_OBLIGADO}) y no declara \`ambito_runtime\` en su front-matter. `
      + 'El ambito de runtime dejo de derivarse del directorio: se declara (S-38, ADR-0213 §2.6).',
    );
  }
}

/* Quien declara responde de lo que declara, este o no en la ola 1. */
const declarantes = inventario.filter((a) => a.ambitoCrudo !== undefined);
for (const a of declarantes) juzgarAdr(a, porId, estados);

/* Y quien reparte concreciones sin declarar ambito no ha declarado nada. */
for (const a of inventario) {
  if (a.concrecionesCrudo !== undefined && a.ambitoCrudo === undefined) {
    errores.push(
      `${a.ruta}: declara \`concreciones\` y no declara \`ambito_runtime\`. `
      + 'Repartir el mecanismo por runtime sin decir a quien obliga la norma deja la concrecion sin sujeto.',
    );
  }
}

/* ---------------------------------------------------------------- *
 * Salida.
 * ---------------------------------------------------------------- */
console.log('━━━ El ambito de runtime de un ADR se declara (S-38, ADR-0213) ━━━\n');

if (inventario.length === 0) {
  console.log(`  ℹ No hay ningun ADR en \`${RAIZ}\`. No hay objeto que juzgar.\n`);
  process.exit(0);
}

console.log(`  Repositorio: ${esNucleo ? 'nucleo (autora el estandar, S-16)' : 'satelite'} · ADR censados: ${inventario.length}`);
console.log(`  Ola 1 (numero >= ${PRIMER_ADR_OBLIGADO}, declaracion obligatoria): ${obligados.length}`);
console.log(`  Declaran \`ambito_runtime\`: ${declarantes.length}\n`);

for (const e of errores) console.error(`  ✘ ${e}`);
for (const w of avisos) console.warn(`  ⚠ ${w}`);
if (errores.length || avisos.length) console.log('');

/* El censo de la ola 2. Se publica SIEMPRE, no acusa a nadie y NO PUEDE ponerse
 * rojo: los 181 ADR del corpus nacieron antes de que esta forma existiera, y
 * exigirsela hoy seria la puerta que ADR-0160 §1.4 prohibe. «Sin declarar» NO
 * es «agnostico», y por eso se cuenta aparte en vez de suponerse. */
const ola2 = inventario.filter((a) => !obligados.includes(a));
if (ola2.length) {
  const sinDeclarar = ola2.filter((a) => a.ambitoCrudo === undefined);
  const porDir = new Map();
  for (const a of sinDeclarar) porDir.set(a.dir, (porDir.get(a.dir) ?? 0) + 1);
  console.log(`━━━ Censo de la ola 2 — informativo, NO puede ponerse rojo (ADR-0213 §2.6) ━━━\n`);
  console.log(`  ${sinDeclarar.length} de ${ola2.length} ADR fuera de la ola 1 no declaran ambito de runtime.`);
  if (porDir.size) {
    console.log(`  Por domicilio: ${[...porDir].sort((a, b) => b[1] - a[1]).map(([d, n]) => `${d}=${n}`).join(' · ')}`);
  }
  console.log('  Su silencio se CENSA y no se lee como `agnostico`: son dos cosas distintas, y');
  console.log('  confundirlas convertiria cada silencio en una afirmacion que nadie hizo (SD-05).');
  console.log(`  Armar esta ola es un acto explicito del propietario —un PR que cambie \`OLA_2_ARMADA\`—,`);
  console.log(`  no una fecha que se dispara sola (ADR-0188). El pendiente es G-441.\n`);
  if (VERBOSE && sinDeclarar.length) {
    console.log('  Sin declarar: ' + sinDeclarar.map((a) => `ADR-${a.id}`).join(', ') + '\n');
  }
}

if (errores.length === 0) {
  console.log(`  ✔ Los ${declarantes.length} ADR que declaran ambito de runtime dicen la verdad sobre el disco:`);
  console.log('    vocabulario cerrado, concordancia con su domicilio, y toda concrecion prometida');
  console.log('    existe y vincula o declara su hueco con un pendiente abierto.');
  console.log('  ⚠ LIMITE: se juzga lo DECLARADO. Que el ambito declarado sea CIERTO —que ADR-0009 sea');
  console.log('    de verdad agnostico— es lectura humana, y deducirlo del lexico ya se midio y se');
  console.log('    descarto: acusaba a 33 de 153 con diez ciertos como mucho (ADR-0160 §1.4, G-412).\n');
} else {
  console.error(`  ${errores.length} hallazgo(s) sobre lo DECLARADO. Un ADR que promete una concrecion`);
  console.error('  inexistente deja al satelite sin norma y con la apariencia de tenerla; uno que');
  console.error('  nace sin declarar su ambito deja la pregunta donde estaba (S-38, ADR-0213).\n');
}

process.exit(errores.length > 0 ? 1 : 0);
