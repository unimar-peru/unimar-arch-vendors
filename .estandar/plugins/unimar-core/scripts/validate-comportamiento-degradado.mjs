#!/usr/bin/env node
/**
 * validate-comportamiento-degradado.mjs — S-42, ADR-0234.
 *
 * QUE COMPRUEBA
 * -------------
 * Que todo Blueprint de Arquitectura declare, para CADA dependencia que su propia
 * seccion de sistemas externos enumera, que hace cuando esa dependencia no
 * responde. Una dependencia sin fila es la que se olvido, y es justo la que
 * importa: la respuesta que nadie escribe la acaba tomando el codigo por
 * accidente --el valor por defecto del cliente HTTP, o el `catch` que alguien
 * puso para que dejara de fallar en local--.
 *
 * LA ASIMETRIA ES EL MECANISMO, NO LA FORMA
 * ------------------------------------------
 * `denegar` se escribe y ya esta. `permitir` exige razon escrita y un `G-NNN`
 * ABIERTO, y aqui se comprueba que ese gap exista de verdad. Denegar de mas es
 * una molestia; permitir de mas es una brecha. Quien elige la respuesta insegura
 * paga por elegirla, y quien lee el Blueprint ve de un vistazo cuantas hay. Misma
 * mecanica de coste asimetrico que S-36 con `no-gobernada`.
 *
 * QUE NO COMPRUEBA, Y SE DICE AQUI PARA QUE NADIE LO SUPONGA
 * ----------------------------------------------------------
 * Que el sistema HAGA lo que declara. Eso es prueba de integracion. La columna
 * «Donde se verifica» existe para que la declaracion APUNTE a esa prueba, y su
 * ausencia se acusa; que la prueba pase, no. Mismo recorte que S-39 hizo con las
 * secciones del PRD: lo verificable es la declaracion, no la calidad.
 *
 * Tampoco descubre dependencias que el Blueprint no declare. Adivinarlas leyendo
 * codigo es la clase de heuristica que S-38 descarto con 33 acusados y 10
 * ciertos.
 *
 * DOS OLAS, CON CORTE MECANICO
 * -----------------------------
 * OLA 1 --armada--: la plantilla canonica de Blueprint y sus ejemplos, que viven
 * en el repositorio que publica `.harness/catalog.json`. NO es vacua, y esa es la
 * razon de que exista: la plantilla se juzga como un objeto mas, de modo que
 * quitarle el bloque pone esta puerta roja hasta que se modifique LA REGLA. El
 * circulo queda abierto por diseno (ADR-0223).
 *
 * OLA 2 --censada, nunca roja--: los Blueprints de producto de un satelite.
 * Armarla es un acto explicito del propietario. Una puerta estructural sobre
 * artefactos que ya existen acusa a todos el primer dia (ADR-0160 §1.4).
 *
 * LA PLANTILLA Y UNA INSTANCIA NO SE JUZGAN IGUAL
 * -----------------------------------------------
 * La plantilla lleva marcadores de posicion, no dependencias: exigirle que su
 * bloque case con su §4.2 seria comparar `<sistema>` con `<sistema>`. De ella se
 * exige que OFREZCA el bloque con su cabecera; de una instancia, que lo tenga
 * COMPLETO.
 *
 * Uso: node <estandar>/scripts/validate-comportamiento-degradado.mjs
 * Salida: 0 si conforme o si se abstiene; 1 si un Blueprint de la ola 1 incumple.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const VERBOSE = process.argv.includes('--verbose');

/** El corte de la ola 1: solo el repositorio que publica el catalogo. */
const ES_LA_FUENTE = existsSync(join(RAIZ, '.harness', 'catalog.json'));

const MARCA_INICIO = '<!--comportamiento-degradado:inicio-->';
const MARCA_FIN = '<!--comportamiento-degradado:fin-->';
const CABECERA = ['Dependencia', 'Si no responde', 'Por qué', 'Dónde se verifica'];

/**
 * El vocabulario, y lo que cada valor cuesta. `exigeGap` es la asimetria: es lo
 * unico que separa esta regla de una casilla que se marca sin pensar.
 */
const VOCABULARIO = {
  denegar: { exigeGap: false, exigeDonde: false },
  degradar: { exigeGap: false, exigeDonde: false },
  encolar: { exigeGap: false, exigeDonde: true },
  fallar: { exigeGap: false, exigeDonde: false },
  permitir: { exigeGap: true, exigeDonde: false },
};

/* ── Raices, nombradas LITERALMENTE ────────────────────────────────────────────
 *
 * No se barre el arbol: el CI monta un repositorio ajeno dentro de el
 * (`.marketplace/`, `.estandar/`) y un barrido lo juzgaria (G-347, ADR-0174).
 */
const RAICES_FUENTE = [
  join('reference', 'governance', 'sdlc', '04-plantillas-artefactos', 'fuente'),
  join('reference', 'governance', 'sdlc', '04-plantillas-artefactos', 'ejemplos'),
];
const RAICES_SATELITE = [join('docs', '02-diseno')];

const hallazgos = [];
const anota = (id, ruta, detalle) => hallazgos.push({ id, ruta, detalle });

/** Los ficheros de Blueprint bajo `dir`, por token completo del nombre. */
function blueprints(dir) {
  const abs = join(RAIZ, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  const anda = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) anda(p);
      else if (/blueprint/i.test(e) && e.endsWith('.md')) out.push(p);
    }
  };
  anda(abs);
  return out;
}

/** El bloque marcado, o `null` si no lo lleva. */
function bloqueDe(texto) {
  const i = texto.indexOf(MARCA_INICIO);
  const j = texto.indexOf(MARCA_FIN);
  if (i < 0 || j < 0 || j < i) return null;
  return texto.slice(i + MARCA_INICIO.length, j);
}

/** Las filas de una tabla markdown, ya troceadas y sin la cabecera ni el separador. */
function filas(bloque) {
  return bloque
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && !/^\|[\s:|-]+\|$/.test(l))
    .map((l) => l.slice(1, l.lastIndexOf('|')).split('|').map((c) => c.trim()));
}

/** Las dependencias que el propio Blueprint enumera en su seccion de externos. */
function dependenciasDeclaradas(texto) {
  const m = /###\s*4\.2[^\n]*\n([\s\S]*?)(?=\n###|\n##|$)/.exec(texto);
  if (!m) return null; // no declara la seccion: no hay con que comparar
  const f = filas(m[1]);
  if (f.length < 2) return [];
  /*
   * Solo lo SALIENTE es dependencia: un sistema depende de lo que LLAMA, no de lo
   * que lo llama. UMS no depende de Q-Track porque Q-Track lo consulte --UMS
   * funciona igual con Q-Track caido--, y exigirle una fila para el seria pedirle
   * que declare que hace cuando su propio consumidor no responde, que no es una
   * pregunta. Sin columna de direccion legible se juzga la fila igual, porque el
   * silencio no puede comprar la exencion.
   */
  return f.slice(1)
    .filter((c) => !/entrante/i.test(c[1] ?? ''))
    .map((c) => c[0])
    .filter(Boolean);
}

/** Los `G-NNN` que `GAPS.md` declara. Sin registro, no se puede exigir el gap. */
function gapsDelRegistro() {
  const p = join(RAIZ, 'GAPS.md');
  if (!existsSync(p)) return null;
  return new Set([...readFileSync(p, 'utf-8').matchAll(/^\|\s*(G-\d+)\s*\|/gm)].map((m) => m[1]));
}

/** Nombre desnudo de una celda: sin enlaces, sin negritas, sin comillas. */
function desnudo(celda) {
  return celda
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .trim()
    .toLowerCase();
}

function juzgar(ruta, esPlantilla, gaps) {
  const rel = ruta.slice(RAIZ.length + 1);
  const texto = readFileSync(ruta, 'utf-8');
  const bloque = bloqueDe(texto);

  if (!bloque) {
    anota('sin-bloque', rel,
      'no declara el bloque `comportamiento-degradado`. Sin el, que hace este sistema '
      + 'cuando su dependencia no responde lo decide el codigo por accidente (S-42).');
    return;
  }

  const f = filas(bloque);
  if (!f.length) {
    anota('bloque-vacio', rel, 'declara el bloque y no tiene ni una fila.');
    return;
  }

  const cabecera = f[0].map((c) => c.replace(/[`*]/g, '').trim());
  if (cabecera.join('|') !== CABECERA.join('|')) {
    anota('cabecera-ajena', rel,
      `la cabecera del bloque es \`${cabecera.join(' | ')}\` y debe ser exactamente `
      + `\`${CABECERA.join(' | ')}\` (S-42).`);
    return;
  }

  const cuerpo = f.slice(1);
  const cubiertas = new Set();

  for (const fila of cuerpo) {
    const [dep, valorCrudo, porQue, donde] = fila;
    const valor = desnudo(valorCrudo);
    cubiertas.add(desnudo(dep));

    // La plantilla lleva marcadores de posicion: se le exige la forma, no el contenido.
    if (esPlantilla) continue;

    const regla = VOCABULARIO[valor];
    if (!regla) {
      anota('valor-fuera-de-vocabulario', rel,
        `\`${dep}\` declara «${valor || '(vacio)'}», que no esta en el vocabulario: `
        + `${Object.keys(VOCABULARIO).join(', ')} (S-42).`);
      continue;
    }

    if (!porQue) {
      anota('sin-razon', rel, `\`${dep}\` declara \`${valor}\` y no dice por que.`);
    }

    if (!donde) {
      anota('sin-verificacion', rel,
        `\`${dep}\` no dice donde se verifica. La declaracion tiene que APUNTAR a la prueba `
        + 'que la comprueba; esta puerta no la ejecuta, pero exige que exista el puntero (S-42).');
    }

    if (regla.exigeDonde && !/cola|encol/i.test(porQue)) {
      anota('encolar-sin-donde', rel,
        `\`${dep}\` declara \`encolar\` y no dice donde encola ni que pasa si la cola se llena.`);
    }

    if (regla.exigeGap) {
      const cita = /\bG-\d+\b/.exec(`${porQue} ${donde}`);
      if (!cita) {
        anota('permitir-sin-gap', rel,
          `\`${dep}\` declara \`permitir\` sin \`G-NNN\` en la misma celda. Permitir de mas es `
          + 'una brecha: quien elige la respuesta insegura la registra (S-42).');
      } else if (gaps && !gaps.has(cita[0])) {
        anota('permitir-con-gap-inexistente', rel,
          `\`${dep}\` declara \`permitir\` citando ${cita[0]}, que \`GAPS.md\` no declara.`);
      }
    }
  }

  if (esPlantilla) return;

  // Toda dependencia de §4.2 tiene fila. La que falta es la que se olvido.
  const declaradas = dependenciasDeclaradas(texto);
  if (declaradas === null) {
    anota('sin-seccion-de-externos', rel,
      'declara el bloque y no tiene seccion §4.2 de sistemas externos: no hay con que contrastarlo.');
    return;
  }
  for (const dep of declaradas) {
    if (!cubiertas.has(desnudo(dep))) {
      anota('dependencia-sin-fila', rel,
        `\`${desnudo(dep)}\` figura en §4.2 y no tiene fila en el bloque. Una dependencia sin `
        + 'fila es la que se olvido, y es justo la que importa (S-42).');
    }
  }
}

// ── Ejecucion ────────────────────────────────────────────────────────────────

console.log('━━━ Comportamiento degradado ante una dependencia (S-42, ADR-0234) ━━━\n');

const gaps = gapsDelRegistro();
const raices = ES_LA_FUENTE ? RAICES_FUENTE : RAICES_SATELITE;
const ficheros = raices.flatMap(blueprints);

if (!ficheros.length) {
  console.log(ES_LA_FUENTE
    ? '  · SE ABSTIENE: no hay plantilla ni ejemplo de Blueprint en el arbol. La puerta no juzga sobre conjunto vacio.'
    : '  · SE ABSTIENE: este satelite no autora ningun Blueprint de Arquitectura, que es `Cond` y no `Req`.');
  console.log('    La abstencion se dice; no se emite visto de conformidad (SD-05).');
  process.exit(0);
}

for (const f of ficheros) {
  const esPlantilla = /plantilla-/.test(f);
  juzgar(f, esPlantilla, gaps);
  if (VERBOSE) console.log(`    ${f.slice(RAIZ.length + 1)}${esPlantilla ? ' [plantilla: solo forma]' : ''}`);
}

if (!ES_LA_FUENTE) {
  console.log(`  · CENSO de la ola 2 --informativo, NO puede ponerse rojo (ADR-0234 D4)--.`);
  console.log(`    ${ficheros.length} Blueprint(s) examinado(s), ${hallazgos.length} hallazgo(s).`);
  for (const h of hallazgos) console.log(`      · [${h.id}] ${h.ruta}: ${h.detalle}`);
  console.log('\n    Armar esta ola es un acto explicito del propietario, no una fecha que se dispara sola.');
  process.exit(0);
}

if (hallazgos.length) {
  for (const h of hallazgos) console.error(`  ✘ [${h.id}] ${h.ruta}: ${h.detalle}`);
  console.error(`\n  ${hallazgos.length} hallazgo(s) en la ola 1. Un Blueprint que no declara que hace cuando`);
  console.error('  su dependencia no responde deja esa respuesta al codigo, y nadie la revisa.');
  process.exit(1);
}

console.log(`  ✔ ${ficheros.length} Blueprint(s) declaran que hacen cuando su dependencia no responde.`);
console.log('  ⚠ LIMITE: se juzga la DECLARACION, no la conducta. Que el sistema haga lo que declara');
console.log('    lo comprueba su prueba de integracion, que esta puerta nombra y no ejecuta (ADR-0234 D3).');
process.exit(0);
