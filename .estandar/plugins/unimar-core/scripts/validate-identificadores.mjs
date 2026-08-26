#!/usr/bin/env node
/**
 * validate-identificadores.mjs — el número de una regla y el de una ficha se
 * reclaman empujando, igual que el de un ADR (S-26, ADR-0199).
 *
 * EL DEFECTO QUE ESTO IMPIDE (G-397). S-26 arbitraba contra el remoto UNA sola
 * clase de identificador. El estándar emite dos más con exactamente las mismas
 * propiedades —numeración densa, elección por «el primer libre», autoría
 * concurrente— y ninguna tenía árbitro: `S-NN` y `G-NNN` se elegían leyendo el
 * máximo del disco local. El disco local no ve el trabajo que otra rama todavía
 * no ha empujado, así que dos agentes en paralelo eligen el mismo número, LOS
 * DOS ACIERTAN en el instante en que miran, y la colisión solo aparece al
 * fusionar.
 *
 * No es hipotético y la asimetría está medida. La noche del 2026-08-09, cuatro
 * agentes en paralelo produjeron cuatro colisiones de número de ADR que S-26
 * resolvió con coste humano CERO —dos ramas cedieron solas y otras dos
 * preguntaron al remoto antes de escribir y nacieron ya sin colisión— frente a
 * seis colisiones de ficha y una de regla arbitradas A MANO. La cesión de regla
 * costó 56 apariciones en 29 ficheros. La asimetría no está en el tamaño del
 * diff: está en quién detecta y cuándo, máquina antes de escribir o persona al
 * fusionar.
 *
 * POR QUE NO ACUSA A QUIEN CUMPLE. Una regla o una ficha no son un fichero: son
 * una FILA en un documento que todas las ramas tocan a la vez, y editarla es el
 * trabajo normal del corpus. Por eso la base no es `main` sino el ancestro común
 * con cada rama rival: lo que ya existía cuando nos separamos no lo reclama
 * nadie. Una rama no se acusa por un identificador que ella misma publicó, ni
 * por uno que está en `main`, ni por uno que heredó de `develop`. El
 * razonamiento completo está en `lib/arbitro-remoto.mjs` y en ADR-0199 §2.3.
 *
 * PREVENIR ANTES QUE DETECTAR. `--siguiente` responde qué número está libre
 * ANTES de escribir nada. Es lo que hizo que dos de las cuatro ramas de aquella
 * tanda nacieran sin colisión, y preguntar tiene que ser barato.
 *
 * Uso:
 *   node <estandar>/scripts/validate-identificadores.mjs [--json]
 *   node <estandar>/scripts/validate-identificadores.mjs --siguiente [S|G|ADR]
 *
 * Salida: 0 si no hay colisión o si no se pudo mirar el remoto; 1 si la hay.
 */

import { CLASES, arbitrar, siguienteDe } from './lib/arbitro-remoto.mjs';

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const SIGUIENTE = args.includes('--siguiente');

/* Esta puerta cubre la regla y la ficha. El ADR tiene ejecutor propio desde que
 * nació S-26 —`validate-adr-numeracion.mjs`, cableado en `docs.yml` y en el
 * `pre-push`— y duplicar aquí su veredicto haría que la misma colisión se
 * contara dos veces en el resumen de puertas. Para `--siguiente` sí se ofrece,
 * porque ahí no hay veredicto que duplicar: hay una pregunta que responder. */
const ARBITRADAS = [CLASES.S, CLASES.G];

if (SIGUIENTE) {
  const pedida = args[args.indexOf('--siguiente') + 1];
  const clases = pedida && CLASES[pedida.toUpperCase()] ? [CLASES[pedida.toUpperCase()]] : [CLASES.ADR, ...ARBITRADAS];
  for (const clase of clases) console.log(siguienteDe(clase));
  process.exit(0);
}

const informe = ARBITRADAS.map((clase) => ({ clase, ...arbitrar(clase) }));
const colisiones = informe.flatMap((r) => r.colisiones.map((c) => ({ ...c, clase: r.clase.id })));

if (JSON_OUT) {
  console.log(JSON.stringify({
    clases: informe.map((r) => ({
      clase: r.clase.id,
      donde: r.clase.donde,
      nuevos: r.nuevos.map((n) => n.id),
      colisiones: r.colisiones,
    })),
  }, null, 2));
  process.exit(colisiones.length ? 1 : 0);
}

console.log('━━━ Numeración de reglas y fichas entre ramas (S-26) ━━━');

const sinJuzgar = informe.filter((r) => r.sinBase);
for (const r of sinJuzgar) {
  // No juzgar no es aprobar, pero tampoco es bloquear a quien clona en plano.
  console.log(`  ⚠ ${r.clase.etiqueta}: sin juzgar, no se pudo leer el corpus en este clon. Ejecuta \`git fetch origin\`.`);
}

if (!colisiones.length) {
  for (const r of informe.filter((x) => !x.sinBase)) {
    const detalle = r.nuevos.length
      ? `${r.nuevos.length} ${r.clase.etiqueta}(s) nueva(s) —${r.nuevos.map((n) => n.id).join(', ')}— sin colisión`
      : `esta rama no añade ninguna ${r.clase.etiqueta}`;
    console.log(`  ✔ ${detalle}, contra ${r.ramas.length} rama(s) remota(s).`);
  }
  process.exit(0);
}

for (const c of colisiones) {
  console.error(`  ✘ ${c.id} ya está reclamada en «${c.donde}».`);
  console.error(`      esta rama: ${c.identidad}`);
  console.error(`      allí:      ${c.otra}`);
}
console.error(
  '\n  El número se reclama EMPUJANDO, no eligiendo (S-26). Quien empuja segundo\n'
  + '  renumera: el árbitro es el orden de push, no la antigüedad del trabajo.\n'
  + '  Pregunta el siguiente libre con `--siguiente S` o `--siguiente G` y renumera.\n'
  + '  Ceder un número de regla es caro —toca el catálogo, los agentes y la fila que\n'
  + '  cada satélite materializa en su DECISIONS.md—: cuanto antes se vea, mejor.',
);
process.exit(1);
