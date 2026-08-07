/**
 * suite.mjs — `suite.yaml` se lee desde un solo sitio.
 *
 * ADR-0120 declara la Suite y sus Sistemas en `suite.yaml`/`sistema.yaml`, y dos
 * piezas del estandar los consumen: `validate-suite.mjs`, que comprueba el modelo,
 * y `scaffold-artefactos-fase.mjs`, que decide con el si el satelite es
 * `single-product` o `multi-product` y construye el arbol documental.
 *
 * Cada una traia su propio lector, y no leian lo mismo:
 *
 *   · `validate-suite` aceptaba `sistemas` SOLO en flujo -- `sistemas: [DT, TMS]`,
 *     que es la forma del ejemplo del ADR.
 *   · `scaffold` lo aceptaba SOLO en bloque -- `sistemas:` y una linea `- DT` por
 *     sistema.
 *
 * Ninguna de las dos formas satisfacia a los dos, y el fallo no era simetrico. Un
 * satelite que escribe la forma canonica del ADR pasa la validacion, pero el
 * scaffolder no ve ningun sistema, decide que el repositorio es `single-product` y
 * materializa los artefactos PLANOS en la raiz de cada fase, sin la particion por
 * sigla ni la carpeta `suite/`. No avisa: construye, en silencio, un arbol que no
 * es el que el perfil prescribe. Escribir la otra forma invierte el problema: el
 * arbol sale bien y el validador reporta «`sistemas` vacio. Una suite sin sistemas
 * no consolida nada» sobre una suite que si los declara.
 *
 * El arreglo no es ensenarle a cada lector la forma que le faltaba --eso deja dos
 * lectores que volveran a divergir-- sino que haya uno. Mismo criterio que
 * `tipo.mjs`: un solo lector evita que cada consumidor reimplemente el parseo y
 * derive.
 *
 * Este parser NO es un YAML completo, y no pretende serlo: cubre el subconjunto
 * que los esquemas del ADR-0120 §2.5 usan --mapa de un nivel, escalares, y
 * secuencias en flujo o en bloque--. Lo que exceda eso pertenece a una dependencia
 * de YAML, no a un regex.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Nombres admitidos del archivo de Suite, en orden de preferencia. */
export const ARCHIVOS_SUITE = ['suite.yaml', 'suite.yml'];

/** `[a, b]` → `['a','b']`; `"x"` → `x`. */
function escalarOFlujo(v) {
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  return v.replace(/^["']|["']$/g, '');
}

/**
 * Parser minimo del subconjunto de YAML que usan `suite.yaml` y `sistema.yaml`:
 * mapa de un nivel de anidamiento, valores escalares, y secuencias en **flujo**
 * (`clave: [a, b]`) o en **bloque** (`clave:` + lineas `- a`).
 *
 * Una clave sin valor abre un mapa anidado, salvo que la siguiente linea util sea
 * un elemento de secuencia: entonces es una secuencia en bloque. Esa desambiguacion
 * mirando adelante es la unica razon por la que el recorrido lleva indice.
 */
export function yamlPlano(texto) {
  const raiz = {};
  let actual = raiz;
  const lineas = texto.split('\n');

  /** Primera linea util a partir de `i`, ya sin comentario ni espacios finales. */
  const siguienteUtil = (i) => {
    for (let j = i + 1; j < lineas.length; j++) {
      const l = lineas[j].replace(/#.*$/, '').replace(/\s+$/, '');
      if (l.trim()) return l;
    }
    return null;
  };

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].replace(/#.*$/, '').replace(/\s+$/, '');
    if (!linea.trim()) continue;

    const m = linea.match(/^(\s*)([\w.-]+):\s*(.*)$/);
    if (!m) continue; // Las lineas `- x` las consume la rama de secuencia en bloque.
    const [, sangria, clave, valorCrudo] = m;
    const valor = valorCrudo.trim();
    const destino = sangria.length === 0 ? raiz : actual;

    if (valor !== '') {
      destino[clave] = escalarOFlujo(valor);
      if (sangria.length === 0) actual = raiz;
      continue;
    }

    // Clave sin valor: ¿secuencia en bloque, o mapa anidado?
    const siguiente = siguienteUtil(i);
    if (siguiente && /^\s*-\s+\S/.test(siguiente)) {
      const items = [];
      for (let j = i + 1; j < lineas.length; j++) {
        const l = lineas[j].replace(/#.*$/, '').replace(/\s+$/, '');
        if (!l.trim()) continue;
        const it = l.match(/^\s*-\s+(.+)$/);
        if (!it) break; // Se acabo la secuencia; la linea la procesa el bucle exterior.
        items.push(it[1].trim().replace(/^["']|["']$/g, ''));
        i = j;
      }
      destino[clave] = items;
      continue;
    }

    if (sangria.length === 0) {
      actual = raiz[clave] = {};
    } else {
      destino[clave] = {};
    }
  }
  return raiz;
}

/**
 * Lee el `suite.yaml` de `raiz`, en cualquiera de las dos formas.
 *
 * Devuelve `null` si el satelite no declara Suite --que no es un error: la mayoria
 * de los satelites son `single-product`--. Si la declara, devuelve siempre
 * `sistemas` como array, aunque este vacio, para que quien la consuma no tenga que
 * distinguir «ausente» de «vacia».
 *
 * Acepta el bloque envuelto en `suite:`, que es la forma del ADR, y tambien las
 * claves al nivel superior: hay satelites escritos asi y rechazarlos no aporta
 * nada.
 */
export function leerSuite(raiz = process.cwd()) {
  const ruta = ARCHIVOS_SUITE.map((f) => join(raiz, f)).find(existsSync);
  if (!ruta) return null;

  const doc = yamlPlano(readFileSync(ruta, 'utf-8'));
  const bloque = (doc.suite && typeof doc.suite === 'object' && !Array.isArray(doc.suite)) ? doc.suite : doc;

  return {
    ruta,
    id: typeof bloque.id === 'string' ? bloque.id : '',
    nombre: typeof bloque.nombre === 'string' ? bloque.nombre : '',
    sistemas: Array.isArray(bloque.sistemas) ? bloque.sistemas : [],
  };
}
