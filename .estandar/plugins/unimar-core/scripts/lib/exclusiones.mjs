/**
 * lib/exclusiones.mjs — la ÚNICA respuesta a «qué directorios no son autoría de
 * este repositorio».
 *
 * Existe por G-159. Los walkers que recorren el repositorio entero llevaban cada
 * uno su propia lista, y las tres discrepaban: `validate-satellite-base.mjs`
 * saltaba TODO directorio que empezara por punto —el mismo bug que
 * `validate-docs.mjs` documentó y corrigió (dejó `.harness/`, `.github/` y
 * `.claude/` sin validar durante meses)—, mientras `validate-conteos.mjs` sí
 * entraba en `.harness/` y `validate-criterios.mjs` lo excluía. No había una
 * respuesta única, sino tres, y la corrección de un fichero no dejaba rastro que
 * impidiera reproducir el defecto en el siguiente.
 *
 * Aquí se declara una sola vez. Un directorio oculto NO es, por el hecho de
 * empezar por punto, ajeno al repositorio: `.harness/`, `.github/` y
 * `.claude/agents|rules/` son autoría propia. Lo que se excluye es lo GENERADO
 * por herramientas, lo de TERCEROS y lo EFÍMERO; nunca por la mera inicial.
 *
 * Nota para quien mantenga esto: si un walker necesita excluir un directorio que
 * SÍ es autoría propia (p. ej. `validate-criterios.mjs` excluye `.harness/`
 * porque sus ejemplos no son criterios de nadie), esa es una decisión propia de
 * ese validador y se declara junto a él, con su razón. No pertenece a este
 * conjunto: aquí solo vive la respuesta a la autoría, no a la relevancia.
 */

export const DIRS_NO_AUTORIA = new Set([
  'node_modules', // dependencias de terceros
  '.git', // control de versiones
  '_bmad', '_bmad-output', // generado por BMAD
  '.agents', '.opencode', '.claude', // agentes y skills generados por herramientas
  '.estandar', // checkout efímero del estándar que hace el CI de un satélite
  'license', // textos legales, no artefactos SDLC ni del corpus
]);

/** True si `nombre` (basename de un directorio) no es autoría de este repositorio. */
export function esDirNoAutoria(nombre) {
  return DIRS_NO_AUTORIA.has(nombre);
}
