/**
 * lib/kb.mjs — definiciones ÚNICAS de la Base de Conocimiento de Arquitectura.
 *
 * Existe por G-158. `parseValor`, `parseEntrada` y `coleccionarEntradas` vivían
 * duplicadas byte a byte entre `validate-kb.mjs` y `validate-kb-refs.mjs`, y el
 * enum de dominios (K4, ADR-0101) vivía además en tres sitios de código:
 * `validate-kb.mjs`, `validate-kb-refs.mjs` y `propose-kb.mjs`. Añadir un
 * dominio obligaba a tocar tres ficheros, y el día que uno cambiara y otro no,
 * dos puertas contarían la misma KB con criterios distintos y discreparían sin
 * que nadie supiera cuál miente. Es la misma clase que G-023 (Cerrado), que ya
 * creó `lib/` para evitarlo; aquí se aplica a la clase, no solo a dos scripts.
 *
 * Extender `DOMINIOS_KB` exige PR al ADR-0101 (K4): un prefijo fuera de aquí es
 * un error, no un dominio nuevo silencioso.
 */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Dominios vigentes (K4). El orden de esta lista fija el orden de las secciones
 * del índice generado por validate-kb.mjs.
 */
export const DOMINIOS_KB = [
  { carpeta: 'dominio-transacciones', nombre: 'Transacciones / consistencia', prefijo: 'TXN' },
  { carpeta: 'dominio-eventos-integracion', nombre: 'Eventos / integración', prefijo: 'EVT' },
  { carpeta: 'dominio-persistencia', nombre: 'Persistencia', prefijo: 'PER' },
  { carpeta: 'dominio-autorizacion', nombre: 'Autorización', prefijo: 'AUT' },
  { carpeta: 'dominio-observabilidad', nombre: 'Observabilidad', prefijo: 'OBS' },
  { carpeta: 'dominio-seguridad', nombre: 'Seguridad', prefijo: 'SEC' },
];

/** Prefijos de dominio vigentes, derivados de `DOMINIOS_KB` (no se teclean aparte). */
export const PREFIJOS_KB = DOMINIOS_KB.map((d) => d.prefijo);

/** Parsea el escalar del front-matter: lista `[a, b]`, `null`, o texto plano. */
export function parseValor(raw) {
  const v = raw.trim();
  if (v === 'null') return null;
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  return v.replace(/^["']|["']$/g, '');
}

/** Separa front-matter (entre `---`) y cuerpo. `null` si no hay front-matter. */
export function parseEntrada(texto) {
  const lineas = texto.split('\n');
  if (lineas[0].trim() !== '---') return null;
  let fin = -1;
  for (let i = 1; i < lineas.length; i++) {
    if (lineas[i].trim() === '---') { fin = i; break; }
  }
  if (fin === -1) return null;
  const data = {};
  for (let i = 1; i < fin; i++) {
    if (!lineas[i].trim()) continue;
    const m = lineas[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    data[m[1]] = parseValor(m[2]);
  }
  return { data, cuerpo: lineas.slice(fin + 1).join('\n') };
}

/** Recorre recursivamente `base-conocimiento` y devuelve las rutas de entrada. */
export function coleccionarEntradas(dir) {
  const out = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    const st = statSync(ruta);
    if (st.isDirectory()) {
      if (nombre === '_plantilla') continue;
      out.push(...coleccionarEntradas(ruta));
      continue;
    }
    if (!nombre.endsWith('.es.md')) continue;
    if (nombre === 'indice.es.md') continue;
    out.push(ruta);
  }
  return out;
}
