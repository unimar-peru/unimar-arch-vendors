#!/usr/bin/env node
/**
 * validate-adr-numeracion.mjs — dos ADR no pueden llevar el mismo número (S-26).
 *
 * EL DEFECTO QUE ESTO IMPIDE, Y POR QUÉ NINGUNA PUERTA LO VEÍA. El corpus ya
 * cruza cuatro índices (`validate-adr-status.mjs`) y todos coinciden dentro de
 * UNA rama. La colisión no vive ahí: vive ENTRE ramas. Dos autores en paralelo
 * miran el mismo disco y los mismos PR abiertos, cada uno elige «el primer
 * número libre», y los dos eligen el mismo — porque el trabajo del otro todavía
 * no existe en ninguna parte que se pueda consultar. Pasó el 22 de julio con
 * ADR-0107 y volvió a pasar el 2026-08-08 con ADR-0173, esta vez entre dos
 * agentes lanzados a la vez.
 *
 * LA REGLA QUE EJERCE (S-26, ADR-0175). El número se RECLAMA EMPUJANDO, no
 * eligiendo: queda reclamado cuando la rama que lo contiene está en el remoto.
 * El trabajo local no reserva nada, y no puede — nadie más lo ve. Quien empuja
 * segundo renumera, y el árbitro es el orden de push, no la antigüedad del
 * trabajo ni quién lo hizo.
 *
 * Por eso este validador pregunta AL REMOTO y no al disco. Un ADR nuevo de esta
 * rama colisiona si su número ya está en `main`, o si otra rama remota publica
 * ese número en un fichero distinto.
 *
 * EL MECANISMO YA NO ES SUYO (ADR-0199, G-397). S-26 nombraba una sola clase de
 * identificador y el estándar emite dos más con las mismas propiedades: la regla
 * `S-NN` y la ficha `G-NNN`. El árbitro vive ahora en `lib/arbitro-remoto.mjs`,
 * compartido con `validate-identificadores.mjs`, y este script es la puerta de
 * la clase ADR. Su política —comparar por FICHERO y no por número, contra
 * `main`— se conserva intacta: fue una prueba la que destapó en su día que
 * contarlo por número dejaba pasar justo la colisión que se buscaba.
 *
 * LO QUE NO PUEDE. Compara contra el remoto en el instante en que corre: dos
 * pushes dentro de la misma ventana pueden cruzarse. El remedio no es más
 * lógica aquí, es que corra en CI en cada push — el segundo llega después y lo
 * ve. Y no juzga si el número es «el siguiente»: un hueco deliberado no es un
 * defecto, y ADR-0175 §2.4 prohíbe reutilizar, no saltar.
 *
 * Uso:
 *   node <estandar>/scripts/validate-adr-numeracion.mjs [--json]
 *   node <estandar>/scripts/validate-adr-numeracion.mjs --siguiente
 *
 * Salida: 0 si no hay colisión o si no se pudo mirar el remoto; 1 si la hay.
 */

import { BASE, CLASES, arbitrar, siguienteDe } from './lib/arbitro-remoto.mjs';

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');

/* PREGUNTAR ANTES DE ESCRIBIR es lo que más valor dio esta regla: de las cuatro
 * ramas en paralelo del 2026-08-09, las dos que consultaron el remoto antes de
 * crear el fichero nacieron ya sin colisión y no tuvieron que ceder nada. */
if (args.includes('--siguiente')) {
  console.log(siguienteDe(CLASES.ADR));
  process.exit(0);
}

const { sinBase, nuevos, colisiones, ramas } = arbitrar(CLASES.ADR);

if (sinBase) {
  // No juzgar no es aprobar, pero tampoco es bloquear a quien clona en plano.
  console.log(`  ⚠ ADR sin juzgar: no existe «${BASE}» en este clon. Ejecuta \`git fetch origin main\`.`);
  process.exit(0);
}

if (JSON_OUT) {
  console.log(JSON.stringify({
    nuevos: nuevos.map((n) => ({ numero: n.id, ruta: n.identidad })),
    colisiones: colisiones.map((c) => ({ numero: c.id, ruta: c.identidad, donde: c.donde, otra: c.otra })),
    avisos: [],
  }, null, 2));
  process.exit(colisiones.length ? 1 : 0);
}

console.log('━━━ Numeración de ADR entre ramas (S-26) ━━━');

if (!colisiones.length) {
  const detalle = nuevos.length
    ? `${nuevos.length} ADR nuevo(s) —${nuevos.map((n) => n.id).join(', ')}— sin colisión`
    : 'esta rama no añade ningún ADR';
  console.log(`  ✔ ${detalle}, contra ${BASE} y ${ramas.length} rama(s) remota(s).`);
  process.exit(0);
}

for (const c of colisiones) {
  console.error(`  ✘ ADR-${c.id} ya está reclamado en «${c.donde}».`);
  console.error(`      esta rama: ${c.identidad}`);
  console.error(`      allí:      ${c.otra}`);
}
console.error(
  '\n  El número se reclama EMPUJANDO, no eligiendo (S-26). Quien empuja segundo\n'
  + '  renumera: el árbitro es el orden de push, no la antigüedad del trabajo.\n'
  + '  Pregunta el siguiente libre con `--siguiente` y renumera.',
);
process.exit(1);
