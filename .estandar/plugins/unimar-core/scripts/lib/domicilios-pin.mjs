/**
 * domicilios-pin.mjs — DÓNDE se declara la versión del estándar que un
 * repositorio consume. Definición única (G-403, ADR-0202).
 *
 * POR QUÉ ESTE FICHERO EXISTE
 * ---------------------------
 * El 2026-08-09 se midió que el estándar se contradecía a sí mismo sobre el
 * mismo repositorio: `validate-vinculacion-estandar.mjs` (S-28, ADR-0180) daba a
 * `unimar-arch-vendors` por «no declara qué estándar consume», mientras
 * `validate-deriva-estandar.mjs` (ADR-0195 D2) lo medía en `unimar-core-1.58.0`
 * leyéndolo de `.estandar/PROCEDENCIA.txt`. Las dos puertas eran fieles a su
 * norma; lo que fallaba era que la lista de domicilios admitidos vivía en DOS
 * sitios —la prosa de ADR-0180 §2.1 y la tabla de ADR-0195 D2— y ninguno era el
 * otro. Un valor duplicado en dos documentos vuelve a divergir; por eso aquí hay
 * uno solo del que beben ambos ejecutores, igual que `lib/identificadores.mjs`
 * acabó siendo la definición única de «regla declarada» (G-398).
 *
 * UN REPOSITORIO, UN DOMICILIO
 * ----------------------------
 * Admitir dos domicilios NO es admitir dos declaraciones del mismo hecho: eso es
 * el defecto de G-098 que ADR-0180 §4 rechazó, y sigue rechazado. Lo que decide
 * cuál rige es un hecho del repositorio, no una preferencia de quien lo escribe:
 * si su CI puede obtener el estándar del marketplace, el domicilio es el pin del
 * checkout; si no puede —porque es público y los secretos de organización tienen
 * visibilidad `private`—, lleva el estándar commiteado y el domicilio es la
 * procedencia de esa copia. Quien declare en los dos y con valores distintos
 * incurre en G-098, y quien lo juzgue debe bloquearlo.
 *
 * NO HACE E/S, A PROPÓSITO
 * ------------------------
 * Misma razón que `lib/deriva.mjs` y `lib/version-publicada.mjs`: aquí dentro no
 * hay `readFileSync` ni `existsSync`. Quien llama observa el árbol y pasa lo
 * observado; así el juicio se prueba sin montar un repositorio, y `deriva.mjs`
 * —que solo necesita EXTRAER el pin de un texto que ya trajo de la red— puede
 * importarlo sin arrastrar el sistema de ficheros.
 *
 * VIAJA AL SATÉLITE. Lo importa `validate-vinculacion-estandar.mjs`, que viaja:
 * una regla que el satélite debe cumplir y cuyo verificador no le llega es una
 * regla inaplicable (S-16, ADR-0180 §2.5).
 */

/**
 * La forma canónica de una etiqueta del marketplace. La identidad del estándar
 * es su versión (ADR-0068), y aquí solo se comprueba la FORMA: qué número sea el
 * vigente lo decide ADR-0169 y lo comparan `check-upstream.mjs` y
 * `validate-deriva-estandar.mjs`.
 */
export const ETIQUETA = /^unimar-core-\d+\.\d+\.\d+$/;

/**
 * La raíz bajo la que vive la copia commiteada del estándar en el repositorio
 * que no puede obtenerlo del marketplace. Se nombra UNA vez: es a la vez lo que
 * `PROCEDENCIA.txt` describe y lo que el CI de ese repositorio invoca.
 */
export const RAIZ_VENDORIZADA = '.estandar/plugins/unimar-core';

/** El domicilio canónico: el pin del checkout del marketplace. */
const WORKFLOW = '.github/workflows/gobernanza.yml';

/** Una línea de YAML que no es un comentario. Un pin nombrado solo en un
 *  comentario es exactamente el pin decorativo de ADR-0180 §1.2.3. */
const lineasVivas = (texto) => String(texto ?? '')
  .split('\n')
  .filter((l) => !l.trimStart().startsWith('#'));

/**
 * Los domicilios admitidos, en orden de preferencia (ADR-0180 §2.1 enmendado por
 * ADR-0202 §2.1; ADR-0195 D2 los enumeraba por su cuenta y ahora los lee de aquí).
 *
 * Cada uno declara:
 *   · `ruta`       dónde vive, literal. Nunca se busca «algún fichero que
 *                  mencione unimar-core»: eso devolvería la vinculación a
 *                  depender de dónde alguien la puso (ADR-0174, G-347).
 *   · `campo`      cómo se llama el dato, para poder nombrarlo en un mensaje.
 *   · `extraer`    del texto del fichero al pin crudo, o `null`.
 *   · `observa`    qué MÁS necesita quien juzgue la efectividad. Se declara aquí
 *                  para que el ejecutor no tenga que saber de antemano qué leer.
 *   · `efectivo`   si el pin GOBIERNA de verdad, a partir de lo observado.
 *   · `porQue`     quién usa este domicilio y por qué, en una frase.
 */
export const DOMICILIOS = [
  {
    id: 'workflow',
    ruta: WORKFLOW,
    campo: 'STANDARD_REF',
    extraer: (texto) => /^[^\S\n]*STANDARD_REF:[^\S\n]*(\S+)/m.exec(String(texto ?? ''))?.[1] ?? null,
    observa: [],
    // Algún `ref:` resuelve la etiqueta. Sin esto el checkout se trae la rama por
    // defecto del marketplace y la versión del diff no gobierna nada; le pasó a
    // `unimar-scm` (ADR-0180 §1.2.3).
    efectivo: (obs) => /^[^\S\n]*ref:[^\S\n]*\$\{\{[^\S\n]*env\.STANDARD_REF[^\S\n]*\}\}/m.test(String(obs?.texto ?? '')),
    comoGobierna: 'algún `ref:` del propio workflow resuelve `${{ env.STANDARD_REF }}`',
    remedioEfectividad: '`STANDARD_REF` se declara pero ningún `ref:` lo usa. El pin es decorativo: el\n'
      + '    checkout del estándar se trae la rama por defecto y la versión del diff no gobierna\n'
      + '    nada. Cablea el paso que obtiene el estándar:\n'
      + '      - uses: actions/checkout@<sha>\n'
      + '        with:\n'
      + '          repository: unimar-peru/unimar-marketplace\n'
      + '          ref: ${{ env.STANDARD_REF }}',
    porQue: 'el canónico de S-28: todo repositorio cuyo CI puede obtener el estándar del marketplace',
  },
  {
    id: 'procedencia',
    ruta: '.estandar/PROCEDENCIA.txt',
    campo: 'Etiqueta:',
    extraer: (texto) => /^Etiqueta[^\S\n]*:[^\S\n]*(\S+)/m.exec(String(texto ?? ''))?.[1] ?? null,
    observa: [RAIZ_VENDORIZADA, WORKFLOW],
    // Aquí el pin no gobierna un checkout: gobierna una copia. Dos condiciones,
    // y la segunda es la que impide que esto se vuelva una puerta de salida:
    //   1. la copia que la etiqueta describe ESTÁ en el árbol — una
    //      `PROCEDENCIA.txt` sin copia detrás es un pin decorativo con otro
    //      nombre de fichero;
    //   2. el workflow de gobernanza la INVOCA por su raíz, fuera de comentario.
    //      Si nadie la invoca, el estándar declarado no rige el CI de nadie.
    efectivo: (obs) => Boolean(obs?.presentes?.[RAIZ_VENDORIZADA])
      && lineasVivas(obs?.ficheros?.[WORKFLOW]).some((l) => l.includes(RAIZ_VENDORIZADA)),
    comoGobierna: `la copia en \`${RAIZ_VENDORIZADA}\` existe y \`${WORKFLOW}\` la invoca por su raíz`,
    remedioEfectividad: `la \`Etiqueta:\` se declara pero la copia que describe no gobierna nada: o \`${RAIZ_VENDORIZADA}\`\n`
      + `    no está en el árbol, o \`${WORKFLOW}\` no la invoca fuera de un comentario. Una\n`
      + '    procedencia sin copia detrás, o una copia que ningún paso ejecuta, es el mismo pin\n'
      + '    decorativo de ADR-0180 §1.2.3 con otro nombre de fichero. Declara la raíz y úsala:\n'
      + '      env:\n'
      + `        UNIMAR_CORE_PATH: ${RAIZ_VENDORIZADA}`,
    porQue: 'el repositorio que NO puede recibir los secretos de organización por ser público '
      + '(tienen visibilidad `private`) y por eso lleva el estándar commiteado. Hoy, `unimar-arch-vendors`',
  },
];

/** El domicilio canónico, para quien deba nombrarlo en un remedio. */
export const CANONICO = DOMICILIOS[0];

/**
 * Qué domicilios declaran pin, a partir de lo observado. No decide nada sobre la
 * forma ni sobre la efectividad: solo reparte el hecho.
 *
 * @param {Record<string, string|null>} ficheros  texto de cada ruta observada, `null` si no está
 * @returns {{id: string, ruta: string, campo: string, ref: string|null, existe: boolean}[]}
 */
export function leerDomicilios(ficheros = {}) {
  return DOMICILIOS.map((d) => {
    const texto = ficheros[d.ruta] ?? null;
    return {
      id: d.id,
      ruta: d.ruta,
      campo: d.campo,
      existe: texto !== null,
      ref: texto === null ? null : d.extraer(texto),
    };
  });
}
