#!/usr/bin/env node
/**
 * validate-adr-status.mjs  ·  unimar-core@0.1.0
 *
 * Responde la unica pregunta que S-06 necesita y que hoy nadie puede contestar:
 * "?este ADR existe y esta Aceptado?"
 *
 * Hallazgo H-4: el estado de un ADR vive en al menos seis sintaxis distintas,
 * una de ellas dentro de un bloque HTML. Ningun script puede leerlo.
 *
 * Este validador clasifica cada ADR:
 *   MAQUINA  -- front-matter YAML con `estado:` (enum cerrado)
 *   LEGADO   -- estado presente pero en prosa/encabezado, no parseable de forma fiable
 *   OPACO    -- no se encuentra estado por ningun medio
 *
 * CUARTA PUERTA -- la reciprocidad de la supersesion (S-29, ADR-0181)
 * -------------------------------------------------------------------
 * El campo `supersede:` del front-matter existia desde el front-matter tipado
 * y NADIE lo leia: `grep -c supersede` sobre este fichero daba 0. Un ADR podia
 * declarar `supersede: [0005]` --en el campo y en su prosa-- mientras ADR-0005
 * seguia diciendo `Aceptado` en los cuatro indices, y las tres puertas de
 * arriba salian verdes porque ninguna miraba el campo. Una supersesion que
 * solo un lado declara deja al otro dando ordenes: el corpus llego a prescribir
 * como camino de madurez los controles que ADR-0106 habia retirado, porque el
 * ADR que los mandaba seguia figurando vigente (G-324).
 *
 * La regla es una sola: si un ADR VINCULANTE declara `supersede: [N]`, N tiene
 * que estar `Supersedido` o `Deprecado`. Se comprueba contra el front-matter de
 * N, y eso alcanza a los cuatro indices sin duplicar nada: la SEGUNDA PUERTA ya
 * prohibe que matriz y hub digan sobre N algo distinto de su front-matter.
 *
 * Tres limites, y los tres son deliberados:
 *   - `supersede: []` NO SE JUZGA NUNCA. La supersesion PARCIAL existe, se
 *     registra en prosa en DECISIONS.md y varios ADR llevan el campo vacio A
 *     PROPOSITO porque su granularidad es de ADR completo (ADR-0168, ADR-0169).
 *     Esta puerta juzga lo que el campo AFIRMA, jamas lo que la prosa dice.
 *   - Un `Borrador` que declara supersede NO obliga a nada. No vincula (SD-03),
 *     y proponer una supersesion no puede retirar un ADR vigente por si solo.
 *   - Lo que no esta en el corpus escaneado no se juzga: se avisa y no rompe.
 *     Un satelite que nombra un ADR del nucleo no puede cambiarle el estado.
 *
 * TERCERA PUERTA -- el cruce del ADR CONSIGO MISMO (ADR-0176 §2.4)
 * ----------------------------------------------------------------
 * El cruce de abajo mira cuatro indices, y los cuatro son EXTERNOS al
 * documento. Dentro del propio ADR el estado vive ademas en dos sitios que
 * nadie miraba: el badge de la cabecera y la linea de prosa `> Estado:`. Un
 * ADR podia declarar `estado: Aceptado` en su front-matter y decir `Borrador`
 * en el badge que un humano lee, y las cuatro comprobaciones salian verdes.
 *
 * Hasta ADR-0176 eso era una asimetria tolerable, porque aceptar era un acto
 * cuidadoso y raro. Deja de serlo cuando la ACEPTACION ES UN DIFF (ADR-0176
 * §2.2): quien acepta y solo toca el front-matter publica un documento que
 * dice dos cosas a la vez, y el corpus no tiene forma de saber cual vale.
 *
 * Dos limites, medidos sobre el corpus y no elegidos por gusto:
 *   - Lo AUSENTE no se inventa. 54 de los 147 ADR no tienen badge y 56 no
 *     tienen linea de prosa: son de legado, anteriores a la plantilla actual.
 *     Exigirles lo que su plantilla no tenia convertiria la puerta en una
 *     campana de reescritura que nadie ha decidido.
 *   - La FECHA detras del estado informa, no contradice. `Aceptado (2026-07-16)`
 *     concuerda con `Aceptado`: se compara la palabra de estado, no la linea.
 *
 * SEGUNDA PUERTA -- el cruce de indices (G-098)
 * ---------------------------------------------
 * Clasificar la sintaxis no basta: hasta 2026-07-16 este validador solo abria el
 * propio ADR y NUNCA la matriz ni el hub, asi que los tres indices podian decir
 * lo que quisieran y la puerta salia verde. Que hoy coincidan era merito de un
 * arreglo a mano, no de un control. Aqui se cruzan las CUATRO fuentes:
 *
 *   inventario del disco  <->  front-matter  <->  matriz (2 vistas)  <->  hub
 *
 * Lo que este cruce SI comprueba:
 *   - omision  : todo ADR del disco aparece en las tres vistas de indice
 *   - fantasma : todo ADR citado por un indice existe en el disco
 *   - estado   : el estado de cada indice coincide con el front-matter
 *   - runtime  : el runtime declarado se deriva del directorio del ADR
 *   - dominio  : las dos vistas de la matriz NO se contradicen entre si
 *
 * LIMITE DECLARADO -- lo que este cruce NO comprueba, y no puede:
 *   Comprueba que las dos vistas DIGAN LO MISMO sobre el dominio, no que lo que
 *   dicen sea CORRECTO. Que ADR-0087 deba ser "Observabilidad" y no
 *   "Gobernanza" es un juicio editorial que no se deriva de ningun hecho del
 *   disco: si las dos vistas coinciden en un dominio equivocado, esta puerta
 *   sale verde y hace bien. El runtime si se deriva (del directorio del ADR) y
 *   por eso si se valida contra la verdad; el dominio solo se valida contra si
 *   mismo. La revision de que cada dominio sea el acertado es humana y queda
 *   registrada como gap: esta puerta en verde NO significa que los dominios
 *   sean correctos, solo que la matriz no se contradice.
 *
 * Uso:
 *   node validate-adr-status.mjs <dir-de-adrs>
 *   node validate-adr-status.mjs <dir> --json
 *
 * Salida: 0 si todos son MAQUINA y el cruce cuadra. 1 en cuanto algo falle
 * (SD-06, fail fast).
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { celdas } from './lib/tabla.mjs';

// Enum cerrado de estados legibles por maquina. NO incluye «Propuesto» a
// proposito: `Borrador` es el estado canonico previo a la aceptacion, y admitir
// un sinonimo seria dos palabras para un mismo estado —el defecto de
// duplicacion que el estandar combate—. Un ADR con `estado: Propuesto` en prosa
// cae a LEGADO: su equivalente canonico es `Borrador` (issue #25, desajuste 2).
const ESTADOS = ['Aceptado', 'Aprobado', 'Borrador', 'Deprecado', 'Supersedido', 'Retirado', 'Pendiente de Importación'];

/** Los estados que VINCULAN. Solo un ADR vinculante puede retirar a otro (SD-03). */
const VINCULANTES = ['Aceptado', 'Aprobado'];

/** Los estados en que un ADR ha dejado de mandar. Son los dos que S-29 admite. */
const RETIRADOS = ['Supersedido', 'Deprecado'];

const args = process.argv.slice(2);
const raiz = args.find(a => !a.startsWith('--'));
const json = args.includes('--json');

if (!raiz) {
  console.error('uso: validate-adr-status.mjs <dir-de-adrs> [--json]');
  process.exit(2);
}

/**
 * Recorre el arbol buscando ADRs. Reconoce las DOS identidades que el estandar
 * admite, alineado con `validate-trazabilidad.mjs` (misma regex, linea ~127):
 *   - Nucleo: cuatro cifras            `0001-lo-que-sea.es.md`  -> ADR-0001
 *   - Satelite (S-15): SIGLA + 3 cifras `UMS-072-lo-que-sea.es.md` -> ADR-UMS-072
 *
 * Antes solo reconocia las cuatro cifras (`^\d{4}-`). Un satelite que adoptaba
 * la identidad S-15 correcta para sus ADR locales veia esta puerta reportar
 * 0 MAQUINA mientras `validate-trazabilidad` exigia justo ese formato: dos
 * validadores del mismo plugin se contradecian (issue #25, G-063 en unimar-ums).
 */
function adrs(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) adrs(p, acc);
    else if (/^(\d{4}|[A-Z][A-Z0-9]*-\d{3})-.*\.md$/.test(e)) acc.push(p);

  }
  return acc;
}

/** Las seis formas observadas en el corpus real de unimar_arch. */
const FORMAS_LEGADO = [
  { id: 'h2-estado',        re: /^## Estado\s*$\n+(.+)$/m },
  { id: 'h3-num-estado',    re: /^## \d+\. Estado\s*$\n+(.+)$/m },
  { id: 'h2-estatus',       re: /^## Estatus\s*$\n+(.+)$/m },
  { id: 'h3-num-status',    re: /^## \d+\. Status\s*$\n+(.+)$/m },
  { id: 'bullet-metadata',  re: /^\*\s+\*\*Estado:\*\*\s*(.+)$/m },
  { id: 'blockquote',       re: /^>\s+\*\*Estado:\*\*\s*(.+)$/m },
  { id: 'html-badge',       re: /<p align="right">[\s\S]{0,400}?Estado[^<]*/m },
];

/**
 * Extrae el estado que ENCABEZA un valor, admitiendo un sufijo que no sea otra
 * palabra: `Aceptado (2026-07-16)` -> `Aceptado`. Se prueban los estados de mas
 * largo a mas corto para que «Pendiente de Importación» gane a cualquier
 * prefijo suyo. Devuelve null si nada del enum encabeza el valor, que es un
 * hallazgo y no un silencio.
 */
function estadoLider(valor) {
  const v = (valor ?? '').trim();
  for (const e of [...ESTADOS].sort((a, b) => b.length - a.length)) {
    if (v === e) return e;
    if (v.startsWith(e) && /^[^\p{L}\p{N}]/u.test(v.slice(e.length))) return e;
  }
  return null;
}

/**
 * Los dos sitios INTERNOS donde el estado se repite. `undefined` significa «no
 * esta y no se reclama» (ADR-0176 §2.4); un valor presente si se compara.
 *
 * El badge de shields codifica el espacio como `_` y el texto como URI, de modo
 * que «Pendiente de Importación» viaja como `Pendiente_de_Importaci%C3%B3n`.
 */
function estadosInternos(texto) {
  const badge = texto.match(/img\.shields\.io\/badge\/Estado-([^-]+)-/);
  const prosa = texto.match(/^>\s*Estado:\s*(.+?)\s*$/m);
  let valorBadge;
  if (badge) {
    try { valorBadge = decodeURIComponent(badge[1]).replace(/_/g, ' ').trim(); }
    catch { valorBadge = badge[1]; } // secuencia %.. invalida: se reporta tal cual
  }
  return { badge: valorBadge, prosa: prosa ? prosa[1].trim() : undefined };
}

/** Las dos identidades de ADR que el estandar admite, sueltas y sin el prefijo. */
const RE_ID_SUELTO = /^(\d{4}|[A-Z][A-Z0-9]*-\d{3})$/;

/**
 * Lee el campo `supersede:` del front-matter (S-29). Devuelve:
 *   - `undefined`              -- el campo NO esta: un ADR de legado sin front-matter tipado
 *   - `{ crudo, ids: [] }`     -- esta y esta vacio: NUNCA se juzga (supersesion parcial)
 *   - `{ crudo, ids: [...] }`  -- los identificadores que el campo afirma
 *   - `{ crudo, malformado }`  -- esta y no es una lista: es un hallazgo, no un silencio
 *
 * Se admite `[0005]` y `[ADR-0005]`, y varias entradas separadas por coma. El
 * prefijo se normaliza porque el corpus escribe el identificador de las dos
 * formas segun el sitio, y discutir eso aqui no aporta nada a la regla.
 */
function superseeDeclarado(texto) {
  const fm = texto.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return undefined;
  const m = fm[1].match(/^supersede:\s*(.*)$/m);
  if (!m) return undefined;
  const crudo = m[1].trim();
  const lista = crudo.match(/^\[([\s\S]*)\]$/);
  if (!lista) return { crudo, malformado: true };
  const ids = lista[1]
    .split(',')
    .map((t) => t.trim().replace(/^["']|["']$/g, '').replace(/^ADR-/, ''))
    .filter(Boolean);
  return { crudo, ids };
}

/**
 * Lee el campo `adr:` del front-matter. Devuelve `undefined` si no esta —un ADR
 * de legado sin front-matter tipado no tiene campo que juzgar— y el valor
 * normalizado si esta: sin comillas y sin el prefijo `ADR-`, que el corpus
 * escribe de las dos formas segun el sitio.
 *
 * POR QUE ESTE CAMPO NECESITA PUERTA. Es el unico dato del front-matter que
 * REPITE una informacion que ya vive en otro sitio —el nombre del fichero—, y
 * todo dato repetido diverge. `validate-adr-numeracion.mjs` arbitra la
 * numeracion entre ramas COMPARANDO FICHEROS, y por eso no lo ve; los cuatro
 * indices que cruza este validador se atan por el id del NOMBRE (linea 251), y
 * tampoco. El campo quedaba sin arbitro: ADR-0219 nacio declarando `adr: 0211`
 * —numero de otra decision real, ya publicada— y paso las diecisiete puertas.
 */
function adrDeclarado(texto) {
  const fm = texto.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return undefined;
  const m = fm[1].match(/^adr:\s*(.+)$/m);
  if (!m) return undefined;
  return m[1].trim().replace(/^["']|["']$/g, '').replace(/^ADR-/, '');
}

function clasificar(texto) {
  // 1. Front-matter YAML: la unica forma legible por maquina.
  const fm = texto.match(/^---\n([\s\S]*?)\n---/);
  if (fm) {
    const m = fm[1].match(/^estado:\s*(.+)$/m);
    if (m) {
      const valor = m[1].trim().replace(/^["']|["']$/g, '');
      return ESTADOS.includes(valor)
        ? { clase: 'MAQUINA', valor }
        : { clase: 'LEGADO', forma: 'front-matter-fuera-de-enum', valor };
    }
  }
  // 2. Formas de legado.
  for (const f of FORMAS_LEGADO) {
    const m = texto.match(f.re);
    if (m) return { clase: 'LEGADO', forma: f.id, valor: (m[1] ?? '').trim().slice(0, 48) };
  }
  return { clase: 'OPACO' };
}

const archivos = adrs(raiz);
const filas = archivos.map((f) => {
  const texto = readFileSync(f, 'utf-8');
  return {
  archivo: relative(raiz, f),
  interno: estadosInternos(texto),
  supersede: superseeDeclarado(texto),
  declarado: adrDeclarado(texto),
  // El identificador es el prefijo del nombre de archivo hasta el guion que lo
  // separa del titulo: `0001-...` -> `0001`, `SCM-002-...` -> `SCM-002`. Cortar
  // cuatro caracteres a ciegas funcionaba para el nucleo y dejaba `SCM-` en un
  // satelite, de modo que el ADR se comparaba contra el indice con un id que no
  // existe y siempre salia «no esta listado».
  id: (basename(f).match(/^(\d{4}|[A-Z][A-Z0-9]*-\d{3})-/) ?? [, basename(f).slice(0, 4)])[1],
  dir: basename(dirname(f)),
  ...clasificar(texto),
  };
});

/* ───────────────────── El cruce de indices (G-098) ─────────────────────
 *
 * Los runtimes se declaran UNA vez y se usan en los tres indices. Cada entrada
 * ata un directorio del disco a como ese runtime se escribe en la columna de la
 * matriz y a como se titula su seccion. `reSeccion` es deliberadamente laxa: el
 * titulo exacto ("Node.js / TypeScript") es prosa y puede reescribirse, pero el
 * runtime que nombra no. Si una seccion con ADRs no casa con exactamente un
 * runtime, se reporta como anomalia en vez de adivinar (SD-06).
 */
const RUNTIMES = [
  { dir: 'core',    columna: 'Agnóstico', reSeccion: /agn[oó]stico|core/i },
  { dir: 'nodejs',  columna: 'Node.js',   reSeccion: /node\.?js/i },
  { dir: 'dotnet',  columna: '.NET',      reSeccion: /\.NET|C#|C&#35;/i },
  { dir: 'android', columna: 'Android',   reSeccion: /android/i },
];

const cruce = [];
const romper = (m) => cruce.push(m);

/* ───── El cruce del ADR consigo mismo (ADR-0176 §2.4) ─────
 *
 * Va ANTES del cruce de indices y NO depende de que haya matriz ni hub: un ADR
 * suelto en un satelite tambien puede contradecirse a si mismo, y ahi el cruce
 * de indices no aplica. Solo compara lo que esta; lo que falta no se reclama.
 */
const interno = [];
for (const f of filas) {
  /* El campo `adr:` se juzga en TODO ADR que lo declare, tenga o no el `estado:`
   * dentro del enum: un documento de legado que declara su numero responde de
   * el igual, y la comprobacion no necesita nada mas que el nombre del fichero.
   * Lo ausente no se reclama —ADR-0176 §2.4—, y por eso el silencio no acusa. */
  if (f.declarado !== undefined && f.declarado !== f.id) {
    interno.push(
      `${f.archivo}: el front-matter declara \`adr: ${f.declarado}\` y el fichero es ${f.id}. `
      + 'El numero es identidad (S-26): quien lo lea por el campo y quien lo lea por el nombre '
      + `estan leyendo dos decisiones distintas. Escribe \`adr: ${f.id}\` —o \`ADR-${f.id}\`, `
      + 'que es la misma identidad con prefijo. En un satelite la identidad LLEVA la sigla '
      + '(`SCM-002`), porque las cuatro cifras a secas son el espacio del nucleo (S-15).',
    );
  }
  if (f.clase !== 'MAQUINA') continue; // sin front-matter fiable no hay contra que cruzar
  for (const [donde, valor] of [['el badge', f.interno.badge], ['la linea de prosa `> Estado:`', f.interno.prosa]]) {
    if (valor === undefined) continue;
    const lider = estadoLider(valor);
    if (lider === null) {
      interno.push(`${f.archivo}: ${donde} dice "${valor}", que no empieza por ningun estado del enum. El front-matter dice "${f.valor}".`);
    } else if (lider !== f.valor) {
      interno.push(`${f.archivo}: el front-matter dice "${f.valor}" y ${donde} dice "${lider}". Aceptar es un diff (ADR-0176 §2.2) y este diff quedo a medias.`);
    }
  }
}
// `interno` NO se vuelca en `cruce`: el cruce de indices solo se imprime cuando
// hay indices, y un ADR suelto que se contradice tiene que verse igual.

/** Quita el backtick con que los indices envuelven el estado: `Aceptado` -> Aceptado */
const limpiar = (s) => (s ?? '').replace(/`/g, '').trim();

/** Deriva el runtime de una seccion por su titulo. Exige coincidencia unica. */
function runtimeDeSeccion(titulo, donde) {
  const casan = RUNTIMES.filter((r) => r.reSeccion.test(titulo));
  if (casan.length === 1) return casan[0];
  romper(`${donde}: la seccion "${titulo}" contiene ADRs pero ${casan.length === 0 ? 'no corresponde a ningun runtime conocido' : 'es ambigua entre ' + casan.map((c) => c.dir).join(', ')}. No se adivina: declarala en RUNTIMES.`);
  return null;
}

/**
 * Identificador de un ADR, en las dos formas que existen.
 *
 * El nucleo numera con cuatro cifras (`ADR-0001`); un satelite antepone su sigla
 * (`ADR-SCM-001`, `ADR-MMS-014`). El inventario de disco ya reconocia ambas —ver
 * el filtro de arriba—, pero los lectores del indice solo aceptaban las cuatro
 * cifras. El efecto no era un falso negativo sino algo peor: contra un satelite no
 * casaba NINGUNA fila, de modo que el validador declaraba que faltaban del indice
 * todos sus ADR. Ocho discrepancias inventadas hacian el gate inservible, y el
 * satelite acababa por no cablearlo — que es tanto como no tenerlo.
 */
const RE_ID_ADR = /ADR-(\d{4}|[A-Z][A-Z0-9]*-\d{3})/;

/**
 * Matriz: dos vistas en un solo archivo.
 *   Vista por Dominio  -> `| [ADR-0001](core/...) | Titulo | `Estado` | Runtime |`
 *   Vista por Runtime  -> `| ADR-0001 | Titulo | `Estado` | Dominio |`, agrupada en secciones h3
 * La 4a columna cambia de significado entre vistas: en la de dominio es el
 * runtime (derivable, se valida); en la de runtime es el dominio (editorial, no
 * se valida — ver LIMITE DECLARADO en la cabecera).
 */
function leerMatriz(texto) {
  const filas = [];
  let vista = null;
  let seccion = null;
  for (const linea of texto.split('\n')) {
    const h2 = linea.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      vista = /^Vista por Dominio/i.test(h2[1]) ? 'dominio'
        : /^Vista por Runtime/i.test(h2[1]) ? 'runtime'
        : null;
      seccion = null;
      continue;
    }
    const h3 = linea.match(/^###\s+(.+?)\s*$/);
    if (h3) { seccion = h3[1]; continue; }
    if (!vista || !linea.startsWith('|')) continue;
    const c = celdas(linea);
    const m = (c[0] ?? '').match(RE_ID_ADR);
    if (!m) continue;
    filas.push({ vista, seccion, id: m[1], estado: limpiar(c[2]), cuarta: limpiar(c[3]) });
  }
  return filas;
}

/** Hub: `| 0001 | [Titulo](core/...) | `Estado` |`, agrupado en secciones h2 por runtime. */
function leerHub(texto) {
  const filas = [];
  let seccion = null;
  for (const linea of texto.split('\n')) {
    const h2 = linea.match(/^##\s+(.+?)\s*$/);
    if (h2) { seccion = h2[1]; continue; }
    if (!seccion || !linea.startsWith('|')) continue;
    const c = celdas(linea);
    if (!/^(\d{4}|[A-Z][A-Z0-9]*-\d{3})$/.test(c[0] ?? '')) continue;
    filas.push({ seccion, id: c[0], estado: limpiar(c[2]) });
  }
  return filas;
}

/** Contrasta un indice contra el inventario del disco: omisiones, fantasmas, estados. */
function contrastar(indice, etiqueta, porId) {
  const vistos = new Map();
  for (const f of indice) {
    if (vistos.has(f.id)) romper(`${etiqueta}: ADR-${f.id} aparece dos veces.`);
    vistos.set(f.id, f);
    const disco = porId.get(f.id);
    if (!disco) {
      romper(`${etiqueta}: ADR-${f.id} esta listado pero NO existe en el disco (fantasma).`);
      continue;
    }
    if (disco.clase === 'MAQUINA' && f.estado !== disco.valor) {
      romper(`${etiqueta}: ADR-${f.id} dice "${f.estado}" y su front-matter dice "${disco.valor}" (${disco.archivo}).`);
    }
  }
  for (const [id, disco] of porId) {
    if (!vistos.has(id)) romper(`${etiqueta}: ADR-${id} existe en el disco (${disco.archivo}) y NO esta listado (omision).`);
  }
  return vistos;
}

const porId = new Map(filas.map((f) => [f.id, f]));

/* ───── La reciprocidad de la supersesion (S-29, ADR-0181) ─────
 *
 * Va aqui porque necesita el inventario completo por identificador y NO
 * necesita los indices: un ADR suelto en un satelite tambien puede declarar una
 * supersesion, y ahi el cruce de indices no aplica. Se juzga contra el
 * front-matter del ADR nombrado; los otros tres indices vienen atados por la
 * SEGUNDA PUERTA, que ya prohibe que digan otra cosa.
 */
const reciprocidad = [];
const fueraDeCorpus = [];
let paresJuzgados = 0;
for (const f of filas) {
  const decl = f.supersede;
  if (!decl) continue;                       // sin front-matter tipado no hay campo que leer
  if (decl.malformado) {
    reciprocidad.push(`${f.archivo}: el campo declara \`supersede: ${decl.crudo}\`, que no es una lista. Se espera \`[]\` o \`[0005]\`; sin lista no se puede saber que afirma.`);
    continue;
  }
  if (decl.ids.length === 0) continue;       // `[]` NO se juzga jamas: es la supersesion parcial
  // Un ADR que no vincula no retira a nadie (SD-03): proponer una supersesion
  // en un `Borrador` no puede tumbar por si solo un ADR vigente.
  if (f.clase !== 'MAQUINA' || !VINCULANTES.includes(f.valor)) continue;

  for (const id of decl.ids) {
    if (!RE_ID_SUELTO.test(id)) {
      reciprocidad.push(`${f.archivo}: \`supersede:\` nombra "${id}", que no es un identificador de ADR (\`0005\` o \`UMS-072\`).`);
      continue;
    }
    if (id === f.id) {
      reciprocidad.push(`${f.archivo}: se declara superseido por si mismo (\`supersede: [${id}]\`). Un ADR no se retira a si mismo declarandolo.`);
      continue;
    }
    const objetivo = porId.get(id);
    if (!objetivo) { fueraDeCorpus.push(`${f.archivo} nombra a ADR-${id}, que no esta en este corpus`); continue; }
    if (objetivo.clase !== 'MAQUINA') {
      reciprocidad.push(`${f.archivo} declara \`supersede: [${id}]\` y el estado de ADR-${id} (${objetivo.archivo}) no es legible por maquina: no hay contra que comprobar la reciprocidad.`);
      continue;
    }
    paresJuzgados++;
    if (!RETIRADOS.includes(objetivo.valor)) {
      reciprocidad.push(
        `${f.archivo} declara \`supersede: [${id}]\` y ADR-${id} sigue en "${objetivo.valor}" (${objetivo.archivo}). ` +
        `Una supersesion que solo un lado declara deja al otro dando ordenes. O ADR-${id} pasa a "Supersedido"/"Deprecado" ` +
        `--con su fila en «ADRs Retirados» de DECISIONS.md-- o la supersesion es PARCIAL, y entonces el campo va en \`[]\` ` +
        `con la derogacion registrada en prosa: el campo tiene granularidad de ADR completo.`,
      );
    }
  }
}

const rutaMatriz = join(raiz, 'matriz-adr.es.md');
const rutaHub = join(raiz, 'README.md');
const hayIndices = existsSync(rutaMatriz) || existsSync(rutaHub);

if (hayIndices) {
  if (!existsSync(rutaMatriz)) romper(`No existe la matriz (${relative(process.cwd(), rutaMatriz)}) pero si el hub: un indice sin el otro no se puede cruzar.`);
  if (!existsSync(rutaHub)) romper(`No existe el hub (${relative(process.cwd(), rutaHub)}) pero si la matriz: un indice sin el otro no se puede cruzar.`);

  if (existsSync(rutaMatriz)) {
    const matriz = leerMatriz(readFileSync(rutaMatriz, 'utf-8'));
    const porDominio = matriz.filter((f) => f.vista === 'dominio');
    const porRuntime = matriz.filter((f) => f.vista === 'runtime');

    if (porDominio.length === 0) romper('matriz · vista por dominio: no se encontro ninguna fila de ADR. ¿Cambio el titulo "## Vista por Dominio" o el formato de la tabla?');
    if (porRuntime.length === 0) romper('matriz · vista por runtime: no se encontro ninguna fila de ADR. ¿Cambio el titulo "## Vista por Runtime" o el formato de la tabla?');

    contrastar(porDominio, 'matriz · vista por dominio', porId);
    contrastar(porRuntime, 'matriz · vista por runtime', porId);

    // Las dos vistas del MISMO archivo tienen que coincidir entre si en el estado.
    const estadoPorId = new Map(porDominio.map((f) => [f.id, f.estado]));
    for (const f of porRuntime) {
      const otro = estadoPorId.get(f.id);
      if (otro !== undefined && otro !== f.estado) {
        romper(`matriz: ADR-${f.id} figura como "${otro}" en la vista por dominio y como "${f.estado}" en la vista por runtime.`);
      }
    }

    /* ── Coherencia de DOMINIO entre las dos vistas ──
     *
     * Ninguna maquina decide si ADR-0087 es "Observabilidad" o "Gobernanza":
     * eso es juicio editorial y sigue siendo el limite declarado. Pero las dos
     * vistas de la matriz clasifican POR SEPARADO —la de dominio con secciones,
     * la de runtime con una columna— y no tienen derecho a contradecirse: son
     * dos proyecciones del mismo hecho.
     *
     * La correspondencia seccion <-> etiqueta NO se cablea aqui: se DERIVA del
     * propio corpus por consenso. Cablearla seria otro literal escrito a mano
     * dentro de la norma que lo cuenta, la misma enfermedad que G-109. Asi, si
     * nace un dominio nuevo, este cruce lo aprende solo; y quien se sale del
     * consenso de su seccion queda señalado.
     */
    const seccionDe = new Map(porDominio.map((f) => [f.id, f.seccion]));
    const etiquetas = new Map(); // seccion -> Map(etiqueta -> [ids])
    for (const f of porRuntime) {
      const sec = seccionDe.get(f.id);
      if (!sec || !f.cuarta) continue;
      if (!etiquetas.has(sec)) etiquetas.set(sec, new Map());
      const m = etiquetas.get(sec);
      if (!m.has(f.cuarta)) m.set(f.cuarta, []);
      m.get(f.cuarta).push(f.id);
    }
    for (const [sec, m] of etiquetas) {
      if (m.size <= 1) continue;
      const orden = [...m].sort((a, b) => b[1].length - a[1].length);
      const [mayor, idsMayor] = orden[0];
      const empate = orden[1][1].length === idsMayor.length;
      for (const [etq, ids] of orden.slice(1)) {
        romper(
          empate
            ? `matriz: la seccion "${sec}" de la vista por dominio se reparte a partes iguales entre "${mayor}" y "${etq}" en la vista por runtime. Las dos vistas no dicen lo mismo y no hay consenso que desempate: decide cual es el dominio.`
            : `matriz: ADR-${ids.join(', ADR-')} figura${ids.length > 1 ? 'n' : ''} bajo la seccion "${sec}" de la vista por dominio, pero la vista por runtime ${ids.length > 1 ? 'los' : 'lo'} clasifica como "${etq}" mientras que sus ${idsMayor.length} compañeros de seccion son "${mayor}". Una de las dos vistas miente.`,
        );
      }
    }

    // El runtime SI se deriva del disco: es el directorio del ADR.
    for (const f of porDominio) {
      const disco = porId.get(f.id);
      if (!disco) continue;
      const esperado = RUNTIMES.find((r) => r.dir === disco.dir);
      if (!esperado) { romper(`ADR-${f.id} vive en el directorio "${disco.dir}", que no corresponde a ningun runtime declarado.`); continue; }
      if (f.cuarta !== esperado.columna) {
        romper(`matriz · vista por dominio: ADR-${f.id} declara runtime "${f.cuarta}" y su archivo esta en "${disco.dir}/" (deberia ser "${esperado.columna}").`);
      }
    }
    for (const f of porRuntime) {
      const disco = porId.get(f.id);
      if (!disco || !f.seccion) continue;
      const rt = runtimeDeSeccion(f.seccion, 'matriz · vista por runtime');
      if (rt && rt.dir !== disco.dir) {
        romper(`matriz · vista por runtime: ADR-${f.id} esta bajo la seccion "${f.seccion}" (${rt.dir}) y su archivo vive en "${disco.dir}/".`);
      }
    }
  }

  if (existsSync(rutaHub)) {
    const hub = leerHub(readFileSync(rutaHub, 'utf-8'));
    if (hub.length === 0) romper('hub: no se encontro ninguna fila de ADR. ¿Cambio el formato de las tablas del hub?');
    contrastar(hub, 'hub', porId);
    for (const f of hub) {
      const disco = porId.get(f.id);
      if (!disco) continue;
      const rt = runtimeDeSeccion(f.seccion, 'hub');
      if (rt && rt.dir !== disco.dir) {
        romper(`hub: ADR-${f.id} esta bajo la seccion "${f.seccion}" (${rt.dir}) y su archivo vive en "${disco.dir}/".`);
      }
    }
  }
}

const maquina = filas.filter(r => r.clase === 'MAQUINA');
const legado = filas.filter(r => r.clase === 'LEGADO');
const opaco = filas.filter(r => r.clase === 'OPACO');
const borradores = maquina.filter(r => r.valor === 'Borrador');

if (json) {
  console.log(JSON.stringify({ total: filas.length, maquina: maquina.length, legado: legado.length, opaco: opaco.length, cruce, interno, reciprocidad, fueraDeCorpus, paresJuzgados, borradores: borradores.map((b) => b.id), filas }, null, 2));
} else {
  console.log('━━━ Estado de ADRs legible por maquina (S-06, H-4) ━━━\n');
  console.log(`  ADRs encontrados: ${filas.length}`);
  console.log(`  ✔ MAQUINA (front-matter, enum cerrado): ${maquina.length}`);
  console.log(`  ✘ LEGADO  (estado en prosa, no fiable):  ${legado.length}`);
  console.log(`  ✘ OPACO   (sin estado detectable):       ${opaco.length}\n`);

  if (legado.length) {
    const porForma = {};
    for (const r of legado) porForma[r.forma] = (porForma[r.forma] ?? 0) + 1;
    console.log('  Sintaxis de legado halladas:');
    for (const [forma, n] of Object.entries(porForma).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${String(n).padStart(3)}  ${forma}`);
    }
    console.log();
  }
  if (opaco.length) {
    console.log('  Opacos:');
    for (const r of opaco.slice(0, 10)) console.log(`    - ${r.archivo}`);
    console.log();
  }

  const vinculantes = maquina.filter(r => r.valor === 'Aceptado' || r.valor === 'Aprobado').length;
  console.log(`  Decisiones que un script puede afirmar como vinculantes: ${vinculantes} de ${filas.length}`);
  if (vinculantes === 0) {
    console.log('\n  ✘ S-06 exige que toda decision tecnica referencie un ADR aceptado.');
    console.log('    Ningun script puede verificar eso hoy. La regla es inaplicable.');
  }

  console.log('\n━━━ El ADR contra si mismo: front-matter ↔ badge ↔ prosa ↔ nombre (ADR-0176 §2.4) ━━━\n');
  if (interno.length === 0) {
    const conBadge = maquina.filter((r) => r.interno.badge !== undefined).length;
    const conProsa = maquina.filter((r) => r.interno.prosa !== undefined).length;
    const conNumero = filas.filter((r) => r.declarado !== undefined).length;
    console.log(`  ✔ Ningun ADR se contradice a si mismo: ${conBadge} con badge, ${conProsa} con linea de prosa`);
    console.log(`    y ${conNumero} que declaran \`adr:\`, todos de acuerdo con el nombre de su fichero.`);
    console.log(`  ⚠ LIMITE: lo ausente no se reclama. ${maquina.length - conBadge} sin badge y ${maquina.length - conProsa} sin prosa`);
    console.log('    son de legado y pasan con solo su front-matter (ADR-0176 §2.4).\n');
  } else {
    for (const e of interno) console.error(`  ✘ ${e}`);
    console.error(`\n  ${interno.length} contradiccion(es) dentro del propio documento. La aceptacion de un`);
    console.error('  ADR es un diff (ADR-0176 §2.2): si el diff queda a medias, el documento dice');
    console.error('  dos cosas y el corpus no tiene forma de saber cual vale.\n');
  }

  // INSTRUMENTACION, NO PUERTA (ADR-0176 §2.5). Un borrador no caduca y nada le
  // pasa por envejecer: esto no cambia el codigo de salida y no puede ponerse
  // rojo. Existe para que «llevan meses asi» deje de ser una sospecha y sea un
  // dato que cualquiera puede leer.
  if (borradores.length) {
    console.log(`━━━ Censo de borradores: ${borradores.length} (informativo — un borrador no caduca, ADR-0176 §2.5) ━━━\n`);
    console.log(`  ${borradores.map((b) => b.id).join(', ')}`);
    console.log('  Ninguno vincula (SD-03) y ninguno bloquea esta puerta.\n');
  }

  console.log('━━━ Reciprocidad de la supersesion: `supersede:` ↔ estado del superseido (S-29) ━━━\n');
  const conCampo = filas.filter((f) => f.supersede && !f.supersede.malformado).length;
  const vacios = filas.filter((f) => f.supersede && !f.supersede.malformado && f.supersede.ids.length === 0).length;
  if (reciprocidad.length === 0) {
    console.log(`  ✔ ${paresJuzgados} par(es) de supersesion declarada, y en todos el superseido ya no manda.`);
    console.log(`  ⚠ LIMITE: los ${vacios} \`supersede: []\` de ${conCampo} ADR con el campo NO se juzgan. La supersesion`);
    console.log('    PARCIAL vive en la prosa de DECISIONS.md y el campo se deja vacio a proposito.\n');
  } else {
    for (const e of reciprocidad) console.error(`  ✘ ${e}`);
    console.error(`\n  ${reciprocidad.length} supersesion(es) declarada(s) por un solo lado. El campo \`supersede:\` es`);
    console.error('  una afirmacion sobre OTRO documento, y ese documento tiene que confirmarla.\n');
  }
  if (fueraDeCorpus.length) {
    console.log('  ℹ Fuera de alcance (se avisa, no rompe): ' + fueraDeCorpus.join('; ') + '.\n');
  }

  console.log('━━━ Cruce de indices: disco ↔ front-matter ↔ matriz ↔ hub (G-098) ━━━\n');
  if (!hayIndices) {
    console.log('  ℹ No hay matriz-adr.es.md ni README.md en este directorio: no hay indices que cruzar.');
    console.log('    El cruce no aplica aqui. Los ADRs sueltos se validan solo por su front-matter.\n');
  } else if (cruce.length === 0) {
    console.log(`  ✔ Los tres indices coinciden con el disco y con el front-matter en los ${filas.length} ADRs.`);
    console.log('    Comprobado: omisiones, fantasmas, estados, runtime y coherencia de dominio.');
    console.log('  ⚠ LIMITE: del DOMINIO solo se comprueba que las dos vistas digan lo mismo, no');
    console.log('    que acierten. Si ambas coinciden en un dominio equivocado, esto sale verde.\n');
  } else {
    for (const e of cruce) console.error(`  ✘ ${e}`);
    console.error(`\n  ${cruce.length} discrepancia(s). Un indice que miente es peor que no tenerlo:`);
    console.error('  se consulta para decidir. Corrige el indice o el front-matter, no este validador.\n');
  }
}

process.exit(legado.length + opaco.length + cruce.length + interno.length + reciprocidad.length > 0 ? 1 : 0);
