/**
 * tabla.mjs — parseo compartido de tablas Markdown.
 *
 * Extraído de validate-gaps.mjs y validate-madurez.mjs, que reimplementaban el
 * mismo split de celdas por separado (gap G-023). Un solo parser evita que las
 * dos copias deriven.
 */

/**
 * Parte una fila de tabla Markdown en sus celdas, ya sin el pipe inicial ni el
 * final, con los espacios recortados. `| a | b |` -> ['a', 'b'].
 */
export function celdas(linea) {
  return linea
    .replace(/^\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());
}
