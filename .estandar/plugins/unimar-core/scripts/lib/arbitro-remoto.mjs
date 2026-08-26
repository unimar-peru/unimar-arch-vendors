/**
 * arbitro-remoto.mjs — quien empuja primero se queda el número.
 *
 * POR QUE EXISTE (G-397, ADR-0199). S-26 resolvió una clase entera de defecto
 * para UNA sola clase de identificador: el número de un ADR se reclama
 * empujando, no eligiendo, y el árbitro es el remoto porque la colisión no vive
 * dentro de una rama —ahí cada una es internamente coherente— sino ENTRE ramas,
 * donde ninguna ve a la otra. El estándar emite al menos dos identificadores más
 * con exactamente las mismas propiedades —numeración densa, elección por «el
 * primer libre», autoría concurrente—: el número de regla `S-NN` y el de ficha
 * `G-NNN`. Ninguno tenía árbitro, y la diferencia se midió: en la tanda del
 * 2026-08-09, cuatro colisiones de ADR se resolvieron solas con coste humano
 * cero mientras seis de ficha y una de regla se arbitraron a mano.
 *
 * Este módulo es el mecanismo compartido. Lo que cambia de una clase a otra no
 * es cómo se pregunta al remoto: es QUÉ es el artefacto que se reclama.
 *
 * DOS POLITICAS, Y LA RAZON DE QUE SEAN DOS
 * -----------------------------------------
 * · POR FICHERO (`arbitrarPorFichero`). El artefacto del ADR es un fichero
 *   entero. Reutilizar un número de `main` con otro fichero ES la colisión, y
 *   contarlo por número la dejaba pasar — lo destapó una prueba en su día
 *   (ADR-0175). Por eso la comparación es por FICHERO y la base es `main`.
 *
 * · POR FILA (`arbitrarPorFila`). El artefacto de una regla o de una ficha es
 *   una FILA dentro de un documento compartido que todas las ramas tocan a la
 *   vez. Aquí «el número ya está en la base» no significa que se esté
 *   reclamando: significa que se está manteniendo. Editar la fila de una regla
 *   que ya existe es el trabajo normal del corpus, y tratarlo como reclamo
 *   acusaría a quien cumple — que es como una puerta acaba desactivada
 *   (ADR-0160 §1.4). Así que la base no es `main` sino el ANCESTRO COMUN con
 *   cada rama rival: lo que ya existía cuando nos separamos no lo reclama
 *   ninguna de las dos, y solo lo que aparece después de la bifurcación en las
 *   dos a la vez, con contenido distinto, es una colisión.
 *
 * El ancestro común resuelve de paso dos casos que de otro modo serían falsas
 * acusaciones: una rama que ya está fusionada en la mía (su ancestro común es
 * ella misma, así que no aporta nada nuevo) y `develop`, que lleva fichas que mi
 * rama heredó y no reclamó.
 *
 * LO QUE NO PUEDE. Compara contra el remoto en el instante en que corre: dos
 * pushes dentro de la misma ventana pueden cruzarse. El remedio no es más lógica
 * aquí, es que corra en CI en cada push — el segundo llega después y lo ve.
 */

import { execFileSync } from 'node:child_process';

/* `main` es la referencia contra la que se mide «nuevo» en la política por
 * fichero. Las ramas de entorno llevan corpus congelados de hace meses y
 * compararse con ellas produciría colisiones de mentira: lo que ya está
 * fusionado vive en `main`. */
export const BASE = 'origin/main';
const IGNORADAS = new Set(['origin/HEAD', BASE, 'origin/qa', 'origin/uat']);

export function git(...args) {
  try { return execFileSync('git', args, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { return null; }
}

/** El contenido de un fichero en una referencia, o null si allí no existe. */
export const leerEn = (ref, ruta) => git('show', `${ref}:${ruta}`);

/** Las rutas que una referencia publica bajo un directorio. */
export const arbolDe = (ref, raiz) => git('ls-tree', '-r', '--name-only', ref, '--', raiz);

/**
 * Las ramas remotas contra las que se arbitra: todas menos la base, las de
 * entorno y LA PROPIA. La propia se excluye porque, si ya está empujada,
 * reclamó su número al empujar y volver a verlo ahí sería acusarla de su propio
 * reclamo.
 */
export function ramasAjenas() {
  const yo = (git('rev-parse', '--abbrev-ref', 'HEAD') ?? '').trim();
  return (git('for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin') ?? '')
    .split('\n')
    .filter((r) => r && !IGNORADAS.has(r) && r !== `origin/${yo}`);
}

/** Una referencia que existe en este clon. Distingue «no hay corpus» de «el
 *  corpus está vacío», que no son lo mismo: lo primero no se juzga. */
const existeRef = (ref) => git('rev-parse', '--verify', '--quiet', `${ref}^{commit}`) !== null;

/** Normaliza una identidad para compararla: adorno de markdown fuera. */
const identidad = (s) => s.replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * LAS TRES CLASES DE IDENTIFICADOR DENSO QUE EL ESTANDAR EMITE.
 *
 * Cada una declara dónde vive, qué es su artefacto y cuántos dígitos tiene. El
 * resto —preguntar al remoto, arbitrar por orden de empuje, proponer el
 * siguiente libre— es común, y esa es justamente la tesis de ADR-0199.
 */
export const CLASES = {
  ADR: {
    id: 'ADR',
    etiqueta: 'ADR',
    articulo: 'el',
    anchura: 4,
    politica: 'fichero',
    donde: 'reference/architecture/adrs',
    formato: (n) => `ADR-${n}`,
    /** `0173` -> conjunto de RUTAS. Es un conjunto y no una ruta a proposito: si
     *  dos ficheros comparten numero en la misma referencia, quedarse con el
     *  ultimo ocultaria justo la colision que se busca. Lo destapo una prueba. */
    leer(ref) {
      const salida = arbolDe(ref, this.donde);
      if (salida === null) return null;
      const mapa = new Map();
      for (const ruta of salida.split('\n').filter(Boolean)) {
        const m = /\/(\d{4})-[^/]+\.md$/.exec(ruta);
        if (!m) continue;
        if (!mapa.has(m[1])) mapa.set(m[1], new Set());
        mapa.get(m[1]).add(ruta);
      }
      return mapa;
    },
  },
  S: {
    id: 'S',
    etiqueta: 'regla',
    articulo: 'la',
    anchura: 2,
    politica: 'fila',
    donde: '.harness/rules/satellite-repo-rules.md',
    formato: (n) => `S-${n}`,
    /** `S-34` -> nombre de la regla, que es lo que distingue una declaración de
     *  otra. Dos ramas con `S-34` y el mismo nombre ven la misma regla. */
    leer(ref) {
      if (!existeRef(ref)) return null;
      const mapa = new Map();
      for (const linea of (leerEn(ref, this.donde) ?? '').split('\n')) {
        const m = linea.match(/^\|\s*\*\*(S-\d{2})\*\*\s*\|\s*([^|]+)\|/);
        if (!m) continue;
        if (!mapa.has(m[1])) mapa.set(m[1], new Set());
        mapa.get(m[1]).add(identidad(m[2]));
      }
      return mapa;
    },
  },
  G: {
    id: 'G',
    etiqueta: 'ficha',
    articulo: 'la',
    anchura: 3,
    politica: 'fila',
    donde: 'GAPS.md',
    formato: (n) => `G-${n}`,
    /** `G-398` -> titulo de la ficha. Solo las filas del REGISTRO canónico
     *  (`| G-398 | …`); el tablero de arriba enlaza el código (`| [G-398](…)`) y
     *  contarlo daría cada ficha dos veces. */
    leer(ref) {
      if (!existeRef(ref)) return null;
      const mapa = new Map();
      for (const linea of (leerEn(ref, this.donde) ?? '').split('\n')) {
        const m = linea.match(/^\|\s*(G-\d{3})\s*\|\s*(.+?)\s*\|/);
        if (!m) continue;
        const titulo = (/\*\*(.+?)\*\*/.exec(m[2]) ?? [null, m[2]])[1];
        if (!mapa.has(m[1])) mapa.set(m[1], new Set());
        mapa.get(m[1]).add(identidad(titulo).slice(0, 120));
      }
      return mapa;
    },
  },
};

/** Memoriza la lectura de una referencia: se consulta una vez por rama. */
function memo(leer) {
  const cache = new Map();
  return (ref) => {
    if (!cache.has(ref)) cache.set(ref, leer(ref));
    return cache.get(ref);
  };
}

/**
 * Política POR FICHERO. `leer(ref)` devuelve `Map<id, Set<ruta>>`.
 *
 * @returns {{sinBase: boolean, nuevos: {id, identidad}[], colisiones: {id, identidad, donde, otra}[], ramas: string[]}}
 */
export function arbitrarPorFichero(leer) {
  const leerRef = memo(leer);
  const base = leerRef(BASE);
  if (!base) return { sinBase: true, nuevos: [], colisiones: [], ramas: [] };

  const mios = leerRef('HEAD') ?? new Map();
  const nuevos = [];
  for (const [id, identidades] of mios) {
    const suyas = base.get(id) ?? new Set();
    for (const identidad of identidades) if (!suyas.has(identidad)) nuevos.push({ id, identidad });
  }

  const ramas = ramasAjenas();
  const colisiones = [];
  for (const { id, identidad } of nuevos) {
    const enBase = [...(base.get(id) ?? [])].filter((x) => x !== identidad);
    if (enBase.length) {
      colisiones.push({ id, identidad, donde: BASE, otra: enBase.join(', ') });
      continue;
    }
    for (const rama of ramas) {
      const suyas = [...(leerRef(rama)?.get(id) ?? [])].filter((x) => x !== identidad);
      if (suyas.length) colisiones.push({ id, identidad, donde: rama, otra: suyas.join(', ') });
    }
  }
  return { sinBase: false, nuevos, colisiones, ramas };
}

/**
 * Política POR FILA. `leer(ref)` devuelve `Map<id, Set<identidad>>`, donde la
 * identidad es lo que distingue una declaración de otra —el nombre de la regla,
 * el título de la ficha—: dos ramas que declaran el mismo número con la MISMA
 * identidad no colisionan, están viendo la misma fila.
 *
 * @returns {{sinBase: boolean, nuevos: {id, identidad}[], colisiones: {id, identidad, donde, otra}[], ramas: string[]}}
 */
export function arbitrarPorFila(leer) {
  const leerRef = memo(leer);
  const mios = leerRef('HEAD');
  if (!mios) return { sinBase: true, nuevos: [], colisiones: [], ramas: [] };

  /* CANDIDATOS: solo lo que esta rama añade respecto de `main`. Un número que ya
   * está publicado no lo reclama nadie —se mantiene—, y esto cubre además el
   * caso del aplastado: una rama rival cuyo PR se fusionó con `squash` no es
   * ancestro de la mía, y sin este filtro su fila reaparecería como rival de la
   * copia que yo heredé, acusándome de un identificador que ya está en `main`. */
  const base = leerRef(BASE);
  const nuevos = [...mios]
    .filter(([id]) => !base?.has(id))
    .map(([id, ids]) => ({ id, identidad: [...ids][0] }));

  const ramas = ramasAjenas();
  const colisiones = [];
  for (const rama of ramas) {
    const suyos = leerRef(rama);
    if (!suyos) continue;
    const ancestro = (git('merge-base', 'HEAD', rama) ?? '').trim();
    // Sin historia común no hay bifurcación que arbitrar: comparar sería inventar
    // un conflicto entre dos corpus que nunca fueron el mismo.
    if (!ancestro) continue;
    const antes = leerRef(ancestro) ?? new Map();
    for (const { id, identidad: mia } of nuevos) {
      if (antes.has(id)) continue; // ya existía cuando nos separamos: nadie lo reclama, se mantiene
      const suyas = [...(suyos.get(id) ?? [])].filter((x) => !mios.get(id).has(x));
      if (suyas.length) colisiones.push({ id, identidad: mia, donde: rama, otra: suyas.join(' · ') });
    }
  }
  return { sinBase: false, nuevos, colisiones, ramas };
}

/**
 * El primer número que no aparece ni en la base, ni en ninguna rama remota, ni
 * aquí. PREVENIR, no solo detectar: lo más valioso que hizo S-26 la noche del
 * 2026-08-09 no fue cazar colisiones, fue que dos ramas preguntaran ANTES de
 * escribir y nacieran ya sin colisión. Preguntar tiene que ser barato.
 *
 * No propone el hueco más bajo: propone el siguiente al máximo. Un hueco es la
 * prueba de que hubo algo ahí y no se reutiliza (ADR-0175 §2.4).
 */
/** Arbitra una clase con la política que ella misma declara. */
export function arbitrar(clase) {
  const leer = (ref) => clase.leer(ref);
  return clase.politica === 'fichero' ? arbitrarPorFichero(leer) : arbitrarPorFila(leer);
}

/** El siguiente identificador libre de una clase, ya formateado. */
export const siguienteDe = (clase) => clase.formato(siguienteLibre((ref) => clase.leer(ref), clase.anchura));

export function siguienteLibre(leer, anchura) {
  const leerRef = memo(leer);
  let max = 0;
  for (const ref of ['HEAD', BASE, ...ramasAjenas()]) {
    for (const id of leerRef(ref)?.keys() ?? []) {
      const n = Number.parseInt(String(id).replace(/\D+/g, ''), 10);
      if (Number.isInteger(n) && n > max) max = n;
    }
  }
  return String(max + 1).padStart(anchura, '0');
}
