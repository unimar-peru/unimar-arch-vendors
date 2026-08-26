#!/usr/bin/env node
/**
 * validate-analisis-estatico.mjs — el analizador estatico se declara por runtime
 * y la invocacion declarada esta cableada (S-37, ADR-0210).
 *
 * EL DEFECTO QUE CIERRA
 * ---------------------
 * Tres normas del corpus mandan analisis estatico y ninguna tenia lector:
 *
 *   1. S-23 ordena al satelite cablear en local «linters/SAST del stack». Su
 *      unico ejecutor, `validate-gates-locales.mjs`, implementa CINCO gates
 *      --puerta local, gitleaks, auditoria de dependencias, coverage y
 *      commitlint-- y NINGUNO de ellos es el linter.
 *   2. ADR-0056 D2/D3/D4 fija seis reglas de Clean Code y cuatro umbrales para
 *      R4, y su propio CA-6 se declara «no ejecutable».
 *   3. Las directivas arquitectonicas y seis ADR prometen una compuerta de
 *      fronteras en CI.
 *
 * LO QUE SE MIDIO ANTES DE ESCRIBIR ESTO (2026-08-10, `gh api search/code`)
 * ------------------------------------------------------------------------
 * Las tres fichas que originan la decision describian mal su defecto, y en las
 * tres el real era distinto:
 *
 *   · G-142 («no existen como configuracion en ningun repositorio») es FALSA:
 *     `unimar-shells/eslint.config.mjs` fija `complexity: ['error', 19]` --uno
 *     de los cuatro umbrales de D4-- como ERROR, y su CI lo invoca. Lo cierto es
 *     UNO de cuatro, y a 19 en vez de a 10. `max-lines-per-function`,
 *     `max-params`, `max-depth` y `no-magic-numbers` dan CERO configuraciones en
 *     toda la organizacion: sus unicas apariciones son ADR-0056 y su espejo.
 *   · G-178 («no existe en ningun repositorio de la suite») es FALSA:
 *     `unimar-scm/eslint.config.mjs` impone `@nx/enforce-module-boundaries` como
 *     ERROR y `.github/workflows/gobernanza.yml` lo invoca con `npx nx run-many
 *     -t lint`. Lo que si da CERO es el paquete literal que el corpus nombra,
 *     `eslint-plugin-boundaries`: sus 30 apariciones son PROSA (13 en
 *     `unimar_arch`, 9 en el espejo, 7 en `unimar-arch-vendors`, 1 en un
 *     documento de `unimar-ums`), ni una sola configuracion (G-434).
 *   · G-141 («nadie puede fallar» en C#) es FALSA en su consecuencia:
 *     `unimar-shells/Directory.Build.props` declara `EnableNETAnalyzers`,
 *     `AnalysisLevel latest`, `Nullable enable` y `TreatWarningsAsErrors`.
 *     Lo que SI se sostiene es la mitad que mira al corpus: el stack .NET da
 *     cero en los ocho terminos de analisis estatico.
 *
 * EL DEFECTO REAL es que TRES satelites eligieron TRES configuraciones distintas
 * sin que el estandar lo sepa, lo pueda contrastar ni lo pueda citar. No falta
 * la herramienta: falta saber cual usa cada uno.
 *
 * QUE COMPRUEBA
 * -------------
 * Sobre el bloque delimitado por `<!--analisis-estatico:inicio-->` …
 * `<!--analisis-estatico:fin-->` de `DECISIONS.md`:
 *
 *   1. Que el bloque exista y este cerrado.
 *   2. Que declare UNA fila por CADA runtime autorizado de
 *      `.harness/data/analisis-estatico.json`, ninguna de mas y ninguna
 *      repetida. Callar un runtime seria el defecto que ADR-0197 cerro en la
 *      observabilidad, repetido aqui.
 *   3. Que `Severidad` y `Umbrales` usen su vocabulario cerrado.
 *   4. Que `no-presente` NO sea mentira: se contrasta con el censo del arbol.
 *      Es la unica celda que la puerta puede falsar por si misma, y por eso la
 *      falsa.
 *   5. Que con `bloquea` o `avisa` el analizador tenga NOMBRE, que la
 *      `Configuracion` sea una ruta que EXISTE y que la `Invocacion` aparezca en
 *      lo que el repositorio EJECUTA --workflows y hooks, y los scripts a los
 *      que delegan--, no en lo que menciona. Un comentario no cablea nada
 *      (ADR-0184: existir no es ejecutarse).
 *   6. Que `avisa`, `sin-analizador` y `propios` nombren un `G-NNN` que EXISTA
 *      en el «Registro» de `GAPS.md` y siga ABIERTO. Mecanica de S-32: la
 *      declaracion de incumplimiento CADUCA con su pendiente.
 *
 * DOS OLAS, Y LA SEGUNDA NO SE ARMA SOLA (ADR-0210 §2.6)
 * ------------------------------------------------------
 *   · OLA 1 — el nucleo. Bloqueante: sin bloque, rojo. Y no es vacua: el nucleo
 *     tiene 118 ficheros Node y cero analizadores sobre ellos (G-433).
 *   · OLA 2 — los cinco satelites. El bloque se juzga con el MISMO rigor SI
 *     esta; su AUSENCIA se censa y NO puede poner la puerta roja. Armarla es un
 *     acto explicito del propietario --un PR que cambie `OLA_2_ARMADA`--, no una
 *     fecha que se dispara sola (ADR-0188). El pendiente es G-435.
 *
 * Se distingue nucleo de satelite por la presencia de `.harness/rules/`, que
 * S-16 prohibe copiar: alli no esta por mandato, no por descuido. Es el mismo
 * criterio de `validate-retencion-senal.mjs` y de `validate-vigencia.mjs`.
 *
 * LIMITES DECLARADOS (ADR-0210 §3)
 * --------------------------------
 *   · NO juzga el CONTENIDO de la configuracion. Que `eslint.config.mjs`
 *     encienda las nueve reglas de D3 lo sabe ESLint al correr, no un lector de
 *     Markdown, y parsear una configuracion plana de ESLint --que es codigo
 *     JavaScript ejecutable-- desde aqui seria una lectura que se equivoca en
 *     silencio. Se juzga que la declaracion exista, que la ruta exista y que la
 *     invocacion este cableada.
 *   · NO elige analizador para ningun runtime. Elegirlo es decision de stack,
 *     exige comparar opciones y tiene ADR propio (S-07). G-141 sigue abierta.
 *   · NO comprueba que `estandar` sea cierto. Nadie puede leer los umbrales
 *     efectivos de un `.editorconfig` mas un `Directory.Build.props` mas un
 *     preset transitivo sin ejecutar el analizador. Fingir ese juicio seria
 *     confianza falsa, igual que S-31 con la razon de una retirada.
 *
 * Uso:
 *   node .harness/scripts/validate-analisis-estatico.mjs
 *   node .harness/scripts/validate-analisis-estatico.mjs --verbose
 *   node .harness/scripts/validate-analisis-estatico.mjs --raiz <dir>
 *
 * Salida: 0 si la declaracion exigible esta y es conforme; 1 si falta o miente
 *         (SD-06).
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { celdas } from './lib/tabla.mjs';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const iRaiz = args.indexOf('--raiz');
const RAIZ = resolve(iRaiz === -1 ? process.cwd() : args[iRaiz + 1]);

/* El piso viaja con el script: se lee junto a el y no desde el cwd, para que
 * funcione igual desde `.harness/` y desde la cache del plugin en un satelite. */
const AQUI = dirname(fileURLToPath(import.meta.url));
const RUTA_PISO = join(AQUI, '..', 'data', 'analisis-estatico.json');

const MARCA_INICIO = '<!--analisis-estatico:inicio-->';
const MARCA_FIN = '<!--analisis-estatico:fin-->';

/* Domicilios. Literales, y los dos en la raiz del repositorio (ADR-0174). */
const DECISIONES = 'DECISIONS.md';
const REGISTRO_DE_GAPS = 'GAPS.md';
/* La marca de que este arbol es el que AUTORA el estandar (S-16). */
const SENA_DEL_NUCLEO = join('.harness', 'rules');

/**
 * LA OLA 2 NO ESTA ARMADA, Y SE ARMA AQUI.
 *
 * Cambiar esta constante a `true` es el acto explicito del propietario que
 * ADR-0210 §2.6 exige, y cierra G-435. No hay fecha, no hay disparo automatico
 * y no hay variable de entorno: un PR, con su revision.
 */
const OLA_2_ARMADA = false;

/** Un gap que sigue sosteniendo algo. `Cerrado` no esta aqui, y ese es el punto. */
const ESTADOS_GAP_ABIERTO = new Set(['Pendiente', 'En curso']);

/** El guion largo es la unica forma de «no aplica» que la tabla admite. */
const VACIO = '—';

const errores = [];
const avisos = [];

/* ---------------------------------------------------------------- *
 * Piso normativo.
 * ---------------------------------------------------------------- */
function cargarPiso() {
  if (!existsSync(RUTA_PISO)) {
    errores.push(`Piso normativo inexistente: ${RUTA_PISO}. Sin el no hay contra que medir.`);
    return null;
  }
  let json;
  try {
    json = JSON.parse(readFileSync(RUTA_PISO, 'utf-8'));
  } catch (e) {
    errores.push(`El piso normativo no es JSON valido: ${e.message}`);
    return null;
  }
  if (!Array.isArray(json.runtimes) || json.runtimes.length === 0) {
    errores.push('El piso normativo no declara ningun runtime: `runtimes` vacio o ausente.');
    return null;
  }
  for (const r of json.runtimes) {
    if (!r.id || !r.titulo || !Array.isArray(r.extensiones) || r.extensiones.length === 0) {
      errores.push(`Runtime mal formado en el piso: ${JSON.stringify(r.id ?? r)}. Todo runtime declara \`id\`, \`titulo\` y \`extensiones\`.`);
      return null;
    }
  }
  for (const clave of ['vocabularioSeveridad', 'vocabularioUmbrales']) {
    if (!json[clave] || Object.keys(json[clave]).length === 0) {
      errores.push(`El piso normativo no declara \`${clave}\`. Sin vocabulario cerrado, cualquier palabra pasaria.`);
      return null;
    }
  }
  return json;
}

/* ---------------------------------------------------------------- *
 * Censo del arbol: que runtimes tiene REALMENTE este repositorio.
 *
 * Es lo unico de esta puerta que no se cree la declaracion. `no-presente` es la
 * respuesta mas barata de escribir y la unica que la maquina puede desmentir
 * sola, asi que la desmiente.
 * ---------------------------------------------------------------- */
function censarRuntimes(piso) {
  const excluidos = new Set(piso.directoriosExcluidos ?? []);
  const porExtension = new Map();
  for (const r of piso.runtimes) {
    for (const ext of r.extensiones) porExtension.set(ext.toLowerCase(), r.id);
  }
  const hallados = new Map(); // id -> primera ruta relativa encontrada
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
        if (excluidos.has(e.name)) continue;
        pila.push([hijo, prof + 1]);
        continue;
      }
      if (!e.isFile()) continue;
      const id = porExtension.get(extname(e.name).toLowerCase());
      if (id && !hallados.has(id)) hallados.set(id, hijo);
    }
    if (hallados.size === piso.runtimes.length) break;
  }
  return hallados;
}

/* ---------------------------------------------------------------- *
 * Lo que el repositorio EJECUTA, sin lo que solo menciona.
 *
 * Dos fuentes, y las dos existen en el nucleo y en todo satelite: los workflows
 * de `.github/workflows/` y los hooks de `.husky/` mas los scripts a los que
 * delegan --un hook fino que llama a `scripts/verify-local.sh` cablea igual que
 * si lo escribiera en linea, que es la forma que ADR-0106 §2.1 describe--.
 *
 * Se eliminan los comentarios --un `#` a principio de linea o precedido de
 * espacio-- ANTES de buscar nada. La asimetria es deliberada y es la misma
 * leccion que `validate-gates-locales.mjs` aprendio: perder un cableado real
 * escrito dentro de una cadena entrecomillada degrada la puerta a un aviso
 * ruidoso, mientras que aceptar un comentario la convierte en una puerta que
 * miente (SD-05). El error caro es el segundo.
 * ---------------------------------------------------------------- */
function textoEjecutado() {
  const vistos = new Set();
  const leer = (abs) => { try { return statSync(abs).isFile() ? readFileSync(abs, 'utf-8') : ''; } catch { return ''; } };
  const RUTA_RE = /(?:^|[\s"'(=])\.?\/?((?:[\w.-]+\/)*[\w.-]+\.(?:sh|bash|mjs|cjs|js)\b)/g;
  let out = '';

  const seguir = (texto, prof) => {
    if (prof > 2) return;
    for (const m of texto.matchAll(RUTA_RE)) {
      const rel = m[1];
      if (vistos.has(rel)) continue;
      vistos.add(rel);
      const contenido = existsSync(join(RAIZ, rel)) ? leer(join(RAIZ, rel)) : '';
      if (!contenido) continue;
      if (VERBOSE) console.log(`      delega -> ${rel}`);
      out += `${contenido}\n`;
      seguir(contenido, prof + 1);
    }
  };

  const dirWorkflows = join(RAIZ, '.github', 'workflows');
  if (existsSync(dirWorkflows)) {
    for (const e of readdirSync(dirWorkflows)) {
      if (!/\.ya?ml$/i.test(e)) continue;
      const contenido = leer(join(dirWorkflows, e));
      if (!contenido) continue;
      out += `${contenido}\n`;
      seguir(contenido, 1);
    }
  }

  const dirHooks = join(RAIZ, '.husky');
  if (existsSync(dirHooks)) {
    for (const e of readdirSync(dirHooks)) {
      /* Un hook neutralizado no cablea nada: `install-hooks.mjs` renombra a
       * `<hook>.retirado` los que el estandar dejo de definir, y git no invoca
       * jamas ese nombre. Su contenido es letra muerta (G-354). */
      if (e.endsWith('.retirado')) continue;
      const contenido = leer(join(dirHooks, e));
      if (!contenido) continue;
      out += `${contenido}\n`;
      seguir(contenido, 1);
    }
  }

  return out
    .split('\n')
    .map((l) => l.replace(/(^|\s)#.*$/, '$1'))
    .join('\n');
}

/* ---------------------------------------------------------------- *
 * El bloque declarado. Se lee SOLO lo que va entre marcas: sin ventana, la prosa
 * que EXPLICA el analisis estatico absolveria a quien no lo DECLARA, y
 * `DECISIONS.md` es un fichero de prosa densa (mismo criterio que ADR-0193 §2.3
 * y ADR-0197 §2.2).
 * ---------------------------------------------------------------- */
function bloqueDeclarado(texto) {
  const i = texto.indexOf(MARCA_INICIO);
  if (i === -1) return { bloque: null, abierto: false };
  const j = texto.indexOf(MARCA_FIN, i + MARCA_INICIO.length);
  if (j === -1) return { bloque: null, abierto: true };
  return { bloque: texto.slice(i + MARCA_INICIO.length, j), abierto: false };
}

/** Quita comillas invertidas, negritas y espacios: adorno, no semantica. */
function pelar(celda) {
  return (celda ?? '').replace(/[`*]/g, '').trim();
}

/**
 * Lee el estado de cada gap del `## Registro` de `GAPS.md`. Los indices de
 * columna se DERIVAN del encabezado --la tabla la reordena `validate-gaps.mjs
 * --fix`-- para que una columna que se mueva no convierta la puerta en un
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
function juzgarPendiente(donde, columna, celda, estados) {
  const m = celda.match(/G-\d{3,}/);
  if (!m) {
    errores.push(
      `${donde}: la columna \`${columna}\` declara un incumplimiento y no nombra pendiente. `
      + '`avisa`, `sin-analizador` y `propios` son legitimos y exigen un `G-NNN` en la misma celda '
      + '(S-37, ADR-0210 §2.4): sin el, la declaracion no caduca nunca.',
    );
    return;
  }
  if (estados === null) {
    errores.push(`${donde}: nombra ${m[0]} y este arbol no tiene un \`## Registro\` legible en \`${REGISTRO_DE_GAPS}\`. El pendiente tiene que poder comprobarse.`);
    return;
  }
  const estado = estados.get(m[0]);
  if (estado === undefined) {
    errores.push(`${donde}: nombra ${m[0]}, que no existe en el \`## Registro\` de \`${REGISTRO_DE_GAPS}\`.`);
    return;
  }
  if (!ESTADOS_GAP_ABIERTO.has(estado)) {
    errores.push(
      `${donde}: nombra ${m[0]}, que esta \`${estado}\`. La declaracion de incumplimiento CADUCA con su pendiente: `
      + 'o el gap sigue abierto, o la celda ya no puede declarar incumplimiento (S-37, mecanica de S-32).',
    );
  }
}

function juzgarBloque(bloque, piso, estados, censo, ejecutado) {
  const filas = [];
  for (const linea of bloque.split('\n')) {
    const t = linea.trim();
    if (!t.startsWith('|')) continue;
    const c = celdas(t);
    if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue;
    filas.push(c);
  }
  if (filas.length === 0) {
    errores.push(`${DECISIONES}: el bloque \`analisis-estatico\` no contiene ninguna tabla. Una declaracion vacia no declara nada.`);
    return;
  }

  const cabecera = filas[0].map((x) => pelar(x).toLowerCase());
  const esperada = ['runtime', 'analizador', 'severidad', 'configuración', 'invocación', 'umbrales'];
  if (cabecera.length !== esperada.length || esperada.some((e, k) => cabecera[k] !== e)) {
    errores.push(
      `${DECISIONES}: la cabecera del bloque es \`${cabecera.join(' | ')}\` y debe ser exactamente `
      + `\`${esperada.join(' | ')}\` (S-37, ADR-0210 §2.3).`,
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
      errores.push(`${DECISIONES}: el runtime \`${id}\` se declara dos veces. Dos filas para un runtime son dos politicas, y la puerta no elige entre ellas.`);
      continue;
    }
    porId.set(id, c);
  }

  const idsPiso = new Set(piso.runtimes.map((r) => r.id));
  for (const id of porId.keys()) {
    if (!idsPiso.has(id)) {
      errores.push(
        `${DECISIONES}: la fila \`${id}\` no es un runtime autorizado. Los runtimes estan en `
        + '`.harness/data/analisis-estatico.json` y los fija ADR-0040 §A; inventar uno aqui declara una politica que nadie mide.',
      );
    }
  }

  const conHerramienta = new Set(piso.severidadConHerramienta ?? []);
  const severidadPide = new Set(piso.severidadExigePendiente ?? []);
  const umbralesPide = new Set(piso.umbralesExigePendiente ?? []);
  const vocSeveridad = new Set(Object.keys(piso.vocabularioSeveridad));
  const vocUmbrales = new Set(Object.keys(piso.vocabularioUmbrales));

  for (const runtime of piso.runtimes) {
    const fila = porId.get(runtime.id);
    if (!fila) {
      errores.push(
        `${DECISIONES}: no declara el runtime \`${runtime.id}\` (${runtime.titulo}). `
        + 'Las tres filas son fijas: `no-presente` es una respuesta, el silencio no.',
      );
      continue;
    }
    const donde = `${DECISIONES} · \`${runtime.id}\``;
    const analizador = pelar(fila[1]);
    const severidad = pelar(fila[2]);
    const configuracion = pelar(fila[3]);
    const invocacion = pelar(fila[4]);
    const umbrales = pelar(fila[5]);

    const claveSev = severidad.split(/\s/)[0];
    const claveUmb = umbrales.split(/\s/)[0];

    /* --- Severidad ------------------------------------------------ */
    if (!vocSeveridad.has(claveSev)) {
      errores.push(
        `${donde}: severidad \`${severidad || '(vacia)'}\` fuera del vocabulario. `
        + `Admitidas: ${[...vocSeveridad].join(', ')}.`,
      );
      continue;
    }
    if (severidadPide.has(claveSev)) juzgarPendiente(donde, 'Severidad', severidad, estados);

    /* --- `no-presente` se CONTRASTA con el arbol ------------------ */
    if (claveSev === 'no-presente') {
      const prueba = censo.get(runtime.id);
      if (prueba) {
        errores.push(
          `${donde}: declara \`no-presente\` y este arbol tiene codigo de ese runtime — \`${prueba}\`. `
          + 'Es la unica celda que la puerta puede desmentir sola, y la desmiente: '
          + `si hay codigo, la respuesta es \`bloquea\`, \`avisa\` o \`sin-analizador\` con su pendiente (S-37, ADR-0210 §2.5).`,
        );
      }
    }

    /* --- Analizador, configuracion e invocacion ------------------- */
    if (conHerramienta.has(claveSev)) {
      if (!analizador || analizador === VACIO) {
        errores.push(`${donde}: severidad \`${claveSev}\` sin analizador nombrado. Una puerta sin herramienta no es una puerta.`);
      }
      if (!configuracion || configuracion === VACIO) {
        errores.push(`${donde}: severidad \`${claveSev}\` sin \`Configuracion\`. Se declara la ruta del fichero que lleva las reglas, no el guion largo.`);
      } else {
        for (const ruta of configuracion.split('·').map((x) => x.trim()).filter(Boolean)) {
          if (!existsSync(join(RAIZ, ruta))) {
            errores.push(
              `${donde}: la configuracion declarada \`${ruta}\` no existe en este repositorio. `
              + 'Una ruta que no resuelve es una configuracion que nadie puede leer (SD-06).',
            );
          }
        }
      }
      if (!invocacion || invocacion === VACIO) {
        errores.push(`${donde}: severidad \`${claveSev}\` sin \`Invocacion\`. Se declara el comando que corre el analizador.`);
      } else if (!ejecutado.includes(invocacion)) {
        errores.push(
          `${donde}: la invocacion declarada \`${invocacion}\` no aparece en nada que este repositorio ejecute. `
          + 'Se busco en `.github/workflows/`, en `.husky/` y en los scripts a los que delegan, con los comentarios ya retirados: '
          + 'existir no es ejecutarse (ADR-0184), y un comentario no cablea nada.',
        );
      }
    } else {
      for (const [columna, valor] of [['Analizador', analizador], ['Configuración', configuracion], ['Invocación', invocacion]]) {
        if (valor && valor !== VACIO) {
          errores.push(
            `${donde}: severidad \`${claveSev}\` y la columna \`${columna}\` dice \`${valor}\`. `
            + 'Sin analizador que corra no hay nada que nombrar ahi: se escribe `—`, y la contradiccion se resuelve subiendo la severidad.',
          );
        }
      }
    }

    /* --- Umbrales de R4 (ADR-0056 D4) ----------------------------- */
    if (!vocUmbrales.has(claveUmb)) {
      errores.push(
        `${donde}: umbrales \`${umbrales || '(vacios)'}\` fuera del vocabulario. `
        + `Admitidos: ${[...vocUmbrales].join(', ')}.`,
      );
    } else {
      if (umbralesPide.has(claveUmb)) juzgarPendiente(donde, 'Umbrales', umbrales, estados);
      if (claveUmb === 'estandar' && !conHerramienta.has(claveSev)) {
        errores.push(
          `${donde}: declara umbrales \`estandar\` con severidad \`${claveSev}\`. `
          + 'Los cuatro umbrales de ADR-0056 D4 los aplica un analizador; sin analizador que corra no rige ninguno, '
          + 'y decir que si rigen es la afirmacion sin evidencia que SD-05 prohibe.',
        );
      }
      if ((claveUmb === 'no-presente') !== (claveSev === 'no-presente')) {
        errores.push(
          `${donde}: severidad \`${claveSev}\` y umbrales \`${claveUmb}\` se contradicen. `
          + '`no-presente` en umbrales solo cabe si el runtime no esta, y si el runtime no esta no hay umbral que declarar.',
        );
      }
    }

    if (VERBOSE) console.log(`      ${runtime.id}: ${severidad} · umbrales ${umbrales}`);
  }
}

/* ================================================================ */

console.log('━━━ El analizador estatico se declara y su invocacion esta cableada (S-37, ADR-0210) ━━━');

const piso = cargarPiso();
const esNucleo = existsSync(join(RAIZ, SENA_DEL_NUCLEO));
const ola = esNucleo ? 1 : 2;
const exigeDeclaracion = esNucleo || OLA_2_ARMADA;

let juzgado = false;

if (piso) {
  const rutaDecisiones = join(RAIZ, DECISIONES);
  if (!existsSync(rutaDecisiones)) {
    const falta = `no existe \`${DECISIONES}\` en la raiz. Es el domicilio de la declaracion (S-15, ADR-0210 §2.2).`;
    if (exigeDeclaracion) errores.push(falta); else avisos.push(falta);
  } else {
    const texto = readFileSync(rutaDecisiones, 'utf-8');
    const { bloque, abierto } = bloqueDeclarado(texto);
    if (abierto) {
      errores.push(`${DECISIONES}: bloque \`${MARCA_INICIO}\` sin \`${MARCA_FIN}\`. Una declaracion sin cierre no delimita nada.`);
    } else if (bloque === null) {
      const falta = `${DECISIONES}: sin bloque \`analisis-estatico\`. Envuelve la tabla entre \`${MARCA_INICIO}\` y \`${MARCA_FIN}\` (S-37, ADR-0210 §2.2).`;
      if (exigeDeclaracion) errores.push(falta); else avisos.push(falta);
    } else {
      const rutaGaps = join(RAIZ, REGISTRO_DE_GAPS);
      const estados = existsSync(rutaGaps) ? leerEstadosDeGaps(readFileSync(rutaGaps, 'utf-8')) : null;
      juzgarBloque(bloque, piso, estados, censarRuntimes(piso), textoEjecutado());
      juzgado = true;
    }
  }
}

for (const w of avisos) console.warn(`  ⚠ ${w}`);

/* El censo de la ola no armada. Se publica SIEMPRE y NO puede ponerse rojo:
 * armarla es un acto explicito del propietario (ADR-0210 §2.6, G-435). */
if (ola === 2 && !OLA_2_ARMADA) {
  console.log(
    `  · ola 2 declarada y NO armada: este repositorio ${juzgado ? 'declara su bloque y se juzga entero' : 'no declara bloque `analisis-estatico`'}. `
    + 'Esto es INSTRUMENTACION y no puede ponerse rojo (G-435).',
  );
}

if (errores.length) {
  for (const e of errores) console.error(`  ✘ ${e}`);
  console.error('');
  console.error('  · Los runtimes autorizados viven en `.harness/data/analisis-estatico.json` y los fija ADR-0040 §A.');
  console.error('    Las tres filas son fijas: `no-presente` es una respuesta, el silencio no (ADR-0210 §2.3).');
  console.error('  · Lo que se juzga es la DECLARACION y su CABLEADO, no el contenido de la configuracion:');
  console.error('    que `eslint.config.mjs` encienda las nueve reglas de ADR-0056 D3 lo sabe ESLint al correr (ADR-0210 §3).');
  process.exit(1);
}

if (juzgado) {
  console.log(`  ✔ ola ${ola}: la declaracion cubre los ${piso.runtimes.length} runtimes autorizados y las invocaciones declaradas estan cableadas.`);
} else {
  console.log('  ✔ nada exigible que juzgar: la puerta se abstiene sin veredicto (SD-05).');
}
process.exit(0);
