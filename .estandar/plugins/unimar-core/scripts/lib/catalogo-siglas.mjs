/**
 * catalogo-siglas.mjs — el catálogo de sistemas se lee una sola vez.
 *
 * ¿POR QUÉ EXISTE (G-090, ADR-0192)
 * ---------------------------------
 * El [catálogo de sistemas](../../../reference/architecture/catalogo-sistemas-suite.es.md)
 * es la fuente única que dice cómo se llama cada sistema de la suite, y su
 * regla 2 prohíbe usar una sigla no ratificada donde el nombre es carga. Esa
 * prohibición ya tenía dos lectores, y cada uno traía su propia expresión
 * regular:
 *
 *   - `validate-suite.mjs`            → `/^\|\s*\*\*([A-Z]{2,4})\*\*\s*\|\s*`?Ratificada`?/`
 *   - `validate-censo-repositorios.mjs` → `/^\|\s*\*\*([A-Z]{2,4})\*\*\s*\|\s*`(Ratificada|Propuesta)`/`
 *
 * Las dos funcionaban y las dos eran frágiles por la misma razón: **cablean el
 * vocabulario de estados**. La segunda ni siquiera reconoce una fila cuyo estado
 * no sea uno de los dos que enumera, así que el día que el catálogo estrene un
 * estado nuevo esa fila desaparece del cruce **en silencio** — no falla, deja de
 * mirar. Es el peor modo de fallo que puede tener una puerta.
 *
 * ADR-0192 estrena exactamente eso: el tercer estado, `Retirada`. Así que el
 * vocabulario deja de estar cableado en cada lector y pasa a vivir aquí, una
 * vez, junto al parser. Es la misma lección de `lib/tabla.mjs` (G-023) y de
 * `lib/censo.mjs` (G-109): dos cuentas separadas derivan.
 *
 * QUÉ ES CADA COSA
 * ----------------
 * `Estado` responde a **qué está decidido sobre el nombre**, no a si el sistema
 * está construido. `YMS` es `Ratificada` y no tiene código; `WMS` es `Ratificada`
 * y no lo escribe Unimar. Quién tiene repositorio se lee del censo de
 * repositorios (ADR-0186), nunca de aquí.
 *
 * ESTE MÓDULO VIAJA AL SATÉLITE, y su ejecutor no. `validate-suite.mjs` corre en
 * el satélite y necesita saber qué siglas son citables; `validate-siglas.mjs`
 * gobierna la AUTORÍA del catálogo y esa sólo ocurre en la fuente.
 */

import { celdas } from './tabla.mjs';

/**
 * El vocabulario de estados, cerrado. Un estado fuera de esta lista es un
 * hallazgo, no una fila que se ignora.
 *
 * `Ratificada` — el sistema existe como decisión de la suite y su sigla es
 *                canónica. Citable en todo artefacto. No promete código.
 * `Propuesta`  — no hay decisión: la sigla existe para que el sistema sea
 *                nombrable, no para que sea citable. CADUCA (ADR-0192 §2.2).
 * `Retirada`   — hay decisión, y es que la sigla NO designa un sistema de la
 *                suite. Prohibida en artefactos nuevos; la fila permanece para
 *                que quien la recuerde encuentre por qué ya no está.
 */
export const ESTADOS = Object.freeze(['Ratificada', 'Propuesta', 'Retirada']);

/** Los estados que NO habilitan el uso normativo de la sigla (regla 2). */
export const ESTADOS_NO_CITABLES = Object.freeze(['Propuesta', 'Retirada']);

/** Vocabulario cerrado de la columna `Procedencia` (ADR-0163 §2.2, regla 7). */
export const PROCEDENCIAS = Object.freeze(['Propio', 'Terceros', 'Por decidir']);

/** Domicilio del catálogo, relativo a la raíz del repositorio que lo aloje. */
export const RUTA_CATALOGO = 'reference/architecture/catalogo-sistemas-suite.es.md';

/** Marca de celda vacía del corpus: una raya, nunca el blanco. */
const VACIO = /^[—-]$/;

const limpiar = (c) => String(c ?? '').replace(/^\*\*|\*\*$/g, '').replace(/^`|`$/g, '').trim();

/**
 * Localiza una tabla por los encabezados que declara. Devuelve sus filas de
 * datos ya partidas en celdas.
 *
 * Se busca por ENCABEZADO y no por número de sección: una tabla que se mueva de
 * §4 a §4.3 sigue siendo la misma tabla, y un parser que dependa del número se
 * rompe con una renumeración que no cambió ningún dato.
 */
function tablaPorEncabezados(texto, requeridos) {
  const lineas = String(texto).split('\n');
  for (let i = 0; i < lineas.length; i += 1) {
    if (!lineas[i].trimStart().startsWith('|')) continue;
    const cab = celdas(lineas[i]).map(limpiar);
    if (!requeridos.every((r) => cab.includes(r))) continue;
    if (!/^\|[\s:|-]+\|?\s*$/.test(lineas[i + 1] ?? '')) continue;

    const filas = [];
    for (let j = i + 2; j < lineas.length; j += 1) {
      if (!lineas[j].trimStart().startsWith('|')) break;
      filas.push({ celdas: celdas(lineas[j]), linea: j + 1 });
    }
    return { cabecera: cab, filas };
  }
  return null;
}

/**
 * Lee la tabla de la §4 del catálogo.
 *
 * Devuelve SIEMPRE todas las filas, incluidas las de estado desconocido, y las
 * señala aparte en `estadosDesconocidos`. Callar una fila que no se entiende es
 * lo que hacía el lector anterior.
 */
export function leerSiglas(texto) {
  /* Se prefiere la tabla completa —la que declara `Procedencia`— y se acepta la
   * mínima, que es la forma que usan las pruebas y la que tendría un catálogo
   * anterior a ADR-0163. Exigir la columna completa haría que un catálogo viejo
   * no se leyera EN ABSOLUTO, y un lector que no lee es un lector que calla. */
  const t = tablaPorEncabezados(texto, ['Sigla', 'Estado', 'Procedencia'])
    ?? tablaPorEncabezados(texto, ['Sigla', 'Estado']);
  if (!t) return null;

  const idx = Object.fromEntries(t.cabecera.map((c, i) => [c, i]));
  const filas = t.filas.map(({ celdas: c, linea }) => ({
    sigla: limpiar(c[idx.Sigla]),
    estado: limpiar(c[idx.Estado]),
    sistema: limpiar(c[idx['Sistema (nombre canónico)']] ?? c[2]),
    capa: limpiar(c[idx.Capa] ?? ''),
    tipo: limpiar(c[idx.Tipo] ?? ''),
    procedencia: limpiar(c[idx.Procedencia]),
    repositorio: (c[idx.Repositorio] ?? '').trim(),
    fase: limpiar(c[idx.Fase] ?? ''),
    evidencia: (c[idx['Evidencia de la sigla']] ?? '').trim(),
    linea,
  })).filter((f) => /^[A-Z]{2,4}$/.test(f.sigla));

  const porEstado = new Map(ESTADOS.map((e) => [e, filas.filter((f) => f.estado === e)]));

  return {
    filas,
    porEstado,
    estadosDesconocidos: filas.filter((f) => !ESTADOS.includes(f.estado)),
    ratificadas: new Set(filas.filter((f) => f.estado === 'Ratificada').map((f) => f.sigla)),
    /* Citable == Ratificada. Se expone con su propio nombre porque es el
     * concepto que la regla 2 usa, y porque si mañana un cuarto estado fuera
     * citable, el cambio ocurre aquí y no en cada llamador. */
    citables: new Set(filas.filter((f) => f.estado === 'Ratificada').map((f) => f.sigla)),
    /* Los sistemas de la suite son las filas que designan uno: una `Retirada`
     * ya no designa nada, y contarla inflaría el «trece sistemas» del corpus. */
    sistemas: filas.filter((f) => f.estado !== 'Retirada'),
  };
}

/**
 * Lee la tabla de decisión pendiente (§4.2): una fila por sigla `Propuesta`, con
 * lo que implica ratificarla, lo que implica retirarla y la fecha en que vence
 * la espera.
 *
 * Esa tabla es a la vez el instrumento y el entregable: es lo que el propietario
 * lee para decidir, y es de donde la puerta saca la caducidad.
 */
export function leerDecisionesPendientes(texto) {
  const t = tablaPorEncabezados(texto, ['Sigla', 'Si se ratifica', 'Si se retira', 'Revisión']);
  if (!t) return null;

  const idx = Object.fromEntries(t.cabecera.map((c, i) => [c, i]));
  return t.filas.map(({ celdas: c, linea }) => ({
    sigla: limpiar(c[idx.Sigla]),
    sostiene: (c[idx['Qué la sostiene hoy']] ?? '').trim(),
    siRatifica: (c[idx['Si se ratifica']] ?? '').trim(),
    siRetira: (c[idx['Si se retira']] ?? '').trim(),
    revision: limpiar(c[idx['Revisión']]),
    linea,
  })).filter((f) => /^[A-Z]{2,4}$/.test(f.sigla));
}

/** ¿La celda está declarada vacía con una raya? */
export const esVacia = (c) => VACIO.test(String(c ?? '').trim());

/**
 * Cómo se escribe una lista de siglas allí donde otro documento la transcribe.
 *
 * Existe para que la puerta pueda REGENERAR la lista en vez de limitarse a
 * quejarse: `--fix` reescribe, igual que hace `validate-conteos.mjs` con las
 * cifras. Una puerta que sólo acusa deja el trabajo donde estaba.
 */
export function renderLista(filas, { conNombre = false, conMarca = false } = {}) {
  return filas
    .map((f) => {
      /* El asterisco es la convención del Estándar Arquitectónico para «no
       * citable»; sólo se pone donde la lista MEZCLA estados. En una lista que
       * ya es de un solo estado sería ruido, porque la frase que la rodea ya lo
       * dice. */
      const marca = conMarca && f.estado !== 'Ratificada' ? '\\*' : '';
      return conNombre ? `${f.sigla}${marca} (${f.sistema})` : `${f.sigla}${marca}`;
    })
    .join(', ');
}

/** Slug estable de una capa, para nombrar el marcador `siglas:capa:<slug>`. */
export function slugCapa(capa) {
  return String(capa)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
