import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { celdas } from './tabla.mjs';

const SIN_DATO = new Set(['', '—', '-', 'N/A', 'n/a']);

/* ── La puerta de controles ejecutables (§1.1, G-360) ───────────────────────
 *
 * `MADUREZ.md` §1.1 declaraba por escrito que esta puerta existia, que la ejercia
 * este script «con fallo duro» y que «la columna Resuelve no se cree: la puerta
 * la recomputa y falla si miente». Ninguna de las tres frases era cierta contra
 * el disco: el marcador que delimita la tabla no aparecia una sola vez en este
 * fichero. Una afirmacion sin respaldo, dentro del documento que mide el
 * cumplimiento de SD-05 — que es precisamente lo que SD-05 prohibe.
 *
 * Dos formas de evidencia, y las dos tienen que existir de verdad:
 *   · `ci:<ruta-workflow>#<job>` — el fichero existe y declara ese job.
 *   · `validador:<ruta-script>`  — el `.mjs` existe Y algun workflow lo invoca.
 *     Un validador huerfano que nadie ejecuta no es un control: es un fichero.
 */
const RE_MARCADOR = /<!--\s*puerta-controles-ejecutables:([A-Za-z-]+)\s*-->/;
const RE_CI = /^ci:(\S+?)#(\S+)$/;
const RE_VALIDADOR = /^validador:(\S+)$/;

/** Los EJECUTORES del repositorio, leidos una sola vez. Rutas literales: nunca un
 *  barrido del arbol, que en CI incluiria el paquete publicado (G-347).
 *
 *  Incluye el `pre-push` desde ADR-0232, y no por comodidad: hasta entonces esta
 *  funcion codificaba que «un control es lo que corre en un workflow», que era
 *  cierto mientras existia CI de servidor. La validacion de este estandar es
 *  local por decision del propietario, asi que el hook ES el ejecutor y no
 *  mirarlo declararia huerfano a todo validador que si corre. El nombre de la
 *  funcion se conserva porque lo importan otros modulos por el. */
export function workflows(raiz = process.cwd()) {
  const salida = [];
  const dir = join(raiz, '.github', 'workflows');
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))) {
      salida.push({ rel: `.github/workflows/${f}`, texto: readFileSync(join(dir, f), 'utf-8') });
    }
  }
  const hook = join(raiz, '.husky', 'pre-push');
  if (existsSync(hook)) salida.push({ rel: '.husky/pre-push', texto: readFileSync(hook, 'utf-8') });
  return salida;
}

/** Resuelve una celda de evidencia. Devuelve null si resuelve, o el motivo si no. */
export function porQueNoResuelve(evidencia, wfs, raiz = process.cwd()) {
  const crudo = String(evidencia).replace(/`/g, '').trim();
  if (SIN_DATO.has(crudo)) return null; // sin declarar: no resuelve, pero tampoco miente

  const ci = RE_CI.exec(crudo);
  if (ci) {
    const [, ruta, job] = ci;
    const wf = wfs.find((w) => w.rel === ruta);
    if (!wf) return `el workflow «${ruta}» no existe`;
    // Un job es una clave de dos espacios bajo `jobs:`. Basta para no aceptar
    // un nombre que solo aparece dentro de un comentario o de un `run:`.
    if (!new RegExp(`^  ${job}:`, 'm').test(wf.texto)) return `«${ruta}» no declara el job «${job}»`;
    return null;
  }

  const val = RE_VALIDADOR.exec(crudo);
  if (val) {
    const [, ruta] = val;
    if (!existsSync(join(raiz, ruta))) return `el validador «${ruta}» no existe`;
    const base = ruta.split('/').pop();
    const invocado = wfs.some((w) => new RegExp(`^[^#\\n]*node .*${base.replace('.', '\\.')}`, 'm').test(w.texto));
    if (!invocado) return `«${ruta}» existe y ningun workflow lo invoca: un validador huerfano no es un control`;
    return null;
  }

  return `«${crudo}» no es evidencia ejecutable. Solo cuentan \`ci:<workflow>#<job>\` y \`validador:<ruta>\``;
}

export function validarPuertaControles(lines, filas, { fail, raiz = process.cwd() }) {
  const i = lines.findIndex((l) => RE_MARCADOR.test(l));
  if (i === -1) return; // sin marcador no hay puerta que ejercer, y eso es legitimo
  const dim = RE_MARCADOR.exec(lines[i])[1];

  /*
   * Tabla propia: Control | Evidencia ejecutable | Resuelve. NO se reusa
   * `parseTable`, que nombra las cuatro columnas de la tabla de pilares y aqui
   * desplazaria cada celda un puesto — leyendo la columna «Resuelve» como si
   * fuera la evidencia. Tres columnas distintas merecen su propio lector.
   */
  const resto = lines.slice(i);
  const h = resto.findIndex((l) => /^\|\s*Control\s*\|/.test(l));
  let fin = h === -1 ? -1 : h + 2;
  while (fin > 0 && fin < resto.length && resto[fin].trim().startsWith('|')) fin++;
  const tabla = h === -1 ? [] : resto.slice(h + 2, fin).filter((l) => l.trim()).map((l) => {
    const c = celdas(l);
    return { control: c[0], evidencia: c[1], declara: String(c[2] ?? '').trim().toLowerCase() };
  });
  if (!tabla.length) {
    fail(`§1.1 · ${dim}: el marcador está pero no le sigue la tabla de controles.`);
    return;
  }

  const wfs = workflows(raiz);
  let resueltos = 0;
  for (const { control, evidencia, declara } of tabla) {
    const motivo = porQueNoResuelve(evidencia, wfs, raiz);
    const resuelve = motivo === null && !SIN_DATO.has(String(evidencia).replace(/`/g, '').trim());
    if (motivo) fail(`§1.1 · ${dim} · ${control}: ${motivo}.`);
    if (resuelve) resueltos++;
    // La columna se RECOMPUTA. Que el documento diga «sí» sobre un control que
    // no resuelve es exactamente la mentira que esta puerta existe para atrapar.
    const esperado = resuelve ? 'sí' : 'no';
    if (declara && declara !== esperado) {
      fail(`§1.1 · ${dim} · ${control}: la columna «Resuelve» dice «${declara}» y el disco dice «${esperado}».`);
    }
  }

  const casilla = (filas ?? []).find((f) => String(f.camino ?? '').includes(dim) || String(f.nombre ?? '').includes(dim));
  const nivel = casilla ? Number(casilla.nivel) : null;
  if (Number.isInteger(nivel) && nivel >= 3 && resueltos === 0) {
    fail(
      `§1.1 · ${dim}: acredita nivel ${nivel} y no resuelve NINGUN control ejecutable. `
      + 'Los niveles 1 y 2 se sostienen sobre norma documentada; el 3 en adelante exige '
      + 'al menos un control que se ejecute (SD-05, S-19).',
    );
  }
  return { dim, resueltos, total: tabla.length };
}
