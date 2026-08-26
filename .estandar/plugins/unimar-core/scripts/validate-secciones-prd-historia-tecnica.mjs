#!/usr/bin/env node
/**
 * validate-secciones-prd-historia-tecnica.mjs — los dos extremos de la cadena
 * dejan de ser los unicos artefactos sin comprobacion estructural
 * (S-39, ADR-0223, G-303).
 *
 * EL DEFECTO QUE CIERRA
 * ---------------------
 * [ADR-0160](.../0160-...) acoto S-03, S-04 y S-05 a los tipos que su propio
 * texto nombra —«toda historia funcional y epica», «toda historia de usuario»—
 * y con eso el PRD y la historia tecnica se quedaron con TRES comprobaciones
 * genericas: formato canonico (S-02: al menos un `## N. Titulo` en alguna
 * parte), enlaces relativos (S-10) e historial de cambios (S-13). Ninguna mira
 * la estructura del artefacto. El propio ADR-0160 §3 lo registro como
 * desventaja y G-303 lo recogio.
 *
 * No es una regresion: es la cobertura que SIEMPRE hubo. Lo que antes parecia
 * cubrir al PRD eran secciones de historia de usuario que no le corresponden
 * —a un PRD se le pedia «Actor Principal»—, es decir cobertura aparente
 * sostenida por falsos positivos. La prueba de que ese falso positivo tuvo
 * efecto esta en el corpus: `unimar-ums/docs/01-concepcion/PRD-UMS-001.es.md`
 * declara «Actores y Stakeholders», «Bounded Context», «Dependencias» y
 * «Restricciones» —la forma de una historia de usuario— y NO declara ni
 * «Resumen Ejecutivo» ni «Metadatos» ni «Glosario». Se escribio para el
 * medidor, no para la plantilla.
 *
 * QUE SE COMPRUEBA — ESTRUCTURA, NO CALIDAD
 * -----------------------------------------
 * Que un PRD declare las TRECE secciones de su plantilla canonica y una
 * historia tecnica las QUINCE de la suya. Que sea un BUEN PRD no es
 * comprobable y aqui no se intenta: no se lee una sola linea del cuerpo de
 * ninguna seccion.
 *
 * Una seccion se reconoce por sus PALABRAS DE CONTENIDO, no por igualdad de
 * cadena. «8. Restricciones, Supuestos y Dependencias» satisface «Restricciones
 * y Supuestos» porque contiene sus dos palabras; «3. Contexto y Requisitos
 * Tecnicos» NO satisface «Contexto y Problema», porque le falta «problema».
 * Exigir la cadena exacta habria puesto en rojo a dos PRD que declaran la
 * seccion y le anaden alcance, que es justo el gate que ADR-0160 §1.4 manda no
 * escribir. Los numeros NO se exigen: un PRD que intercala una seccion propia
 * desplaza la numeracion de las demas, y renumerar no es un defecto de
 * estructura. El ORDEN canonico se reporta y NO bloquea.
 *
 * LA PLANTILLA SE VERIFICA CONTRA LA REGLA, NO LA REGLA CONTRA LA PLANTILLA
 * ------------------------------------------------------------------------
 * G-303 avisaba del riesgo: derivar la exigencia de lo que la plantilla
 * contiene hace que la plantilla sea conformante por construccion y la puerta
 * no pueda decir nada de ella. Aqui la lista canonica es DATO de este fichero,
 * escrito desde el texto de S-39, y las dos plantillas de `fuente/` se juzgan
 * como un objeto mas. Si alguien edita la plantilla y le quita una seccion, la
 * puerta se pone roja hasta que la REGLA se modifique. El circulo queda abierto
 * por diseno.
 *
 * DONDE VIVE LA PUERTA, Y POR QUE SE ABSTIENE EN VEZ DE SALIR VERDE
 * ----------------------------------------------------------------
 * El nucleo NO tiene PRD de producto: sus unicos PRD e historias tecnicas son
 * los `ejemplos/` que publica y las plantillas que reparte. Los satelites SI
 * los tienen. Un validador que no encuentra objeto y sale verde es peor que no
 * tenerlo —es el argumento de `validate-ceguera-al-paquete.mjs`—, asi que aqui:
 *
 *   · en la FUENTE (publica `.harness/catalog.json`) las dos plantillas
 *     canonicas DEBEN existir. Su ausencia es roja: sin ellas esta puerta no
 *     tendria objeto y saldria verde por vacio, que es el modo de fallo que se
 *     quiere impedir.
 *   · en un SATELITE sin ningun PRD ni historia tecnica en su arbol de fases,
 *     el validador se ABSTIENE y lo dice con esas palabras. No dice «conforme».
 *
 * DOS OLAS, Y EL CORTE ES EL REPOSITORIO (ADR-0160 §1.4)
 * -----------------------------------------------------
 * Una puerta estructural sobre artefactos que YA EXISTEN acusa a todos el
 * primer dia. Medido el 2026-08-10 antes de escribir una linea:
 *
 *   · OLA 1 — la FUENTE: las 2 plantillas canonicas y los 4 ejemplos
 *     (`ejemplo-prd-qtrack`, `ejemplo-prd-ums`, `ejemplo-historia-tecnica-qtrack`,
 *     `ejemplo-historia-tecnica-ums`). Los seis CONFORMAN hoy, asi que la ola 1
 *     bloquea desde el primer dia sin acusar a nadie. Es la leccion de
 *     ADR-0160 §1.1: el estandar pasa su propio validador antes de pedirselo a
 *     otro.
 *   · OLA 2 — los SATELITES: su arbol `docs/0N-fase/`. Se CENSA y no puede
 *     poner la puerta roja. Armarla es un acto explicito del propietario —un PR
 *     que cambie `OLA_2_ARMADA`—, no una fecha que se dispara sola (ADR-0188).
 *     El pendiente es G-460.
 *
 * El corte es el repositorio y no una fecha porque es MECANICO y verificable en
 * una linea: `.harness/catalog.json` existe o no existe, el mismo criterio con
 * que `validate-ubicacion-artefactos.mjs` distingue al padre del hijo.
 *
 * LO QUE NO ALCANZA, Y SE DECLARA PARA QUE NO SE LEA COMO COBERTURA
 * ----------------------------------------------------------------
 *   · Un documento que agrupa VARIAS historias tecnicas —`historias-tecnicas-
 *     sprint-1-mdm-001.md` de `unimar-scm`, con seis `HT-MDM-NNN` dentro— NO se
 *     clasifica: el token del nombre esta en plural y ninguno de los cuatro
 *     clasificadores del estandar lo reconoce. Este validador NO lo arregla
 *     —hacerlo sin decidir antes que exige la norma de una coleccion seria
 *     acusar a nueve documentos por una convencion que nadie escribio— y lo
 *     deja registrado en G-461.
 *   · El andamio del alta (ADR-0149) se salta, con el mismo criterio de
 *     `validate-satellite-base.mjs`: el estandar pre-crea el artefacto vacio y
 *     luego se lo exige.
 *   · Que la seccion tenga CONTENIDO util es revision humana. Aqui solo consta
 *     que este declarada.
 *
 * NO BARRE EL ARBOL: nombra las raices literalmente, para seguir siendo ciego
 * al paquete que el CI monta en `.marketplace/` y al que un satelite monta en
 * `.estandar/` (G-347, ADR-0174).
 *
 * Uso:
 *   node <estandar>/scripts/validate-secciones-prd-historia-tecnica.mjs [--verbose]
 *   node <estandar>/scripts/validate-secciones-prd-historia-tecnica.mjs --raiz <dir>
 *
 * Salida: 0 si todo lo de la ola 1 declara sus secciones; 1 si alguno no.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const iRaiz = args.indexOf('--raiz');
const RAIZ = resolve(iRaiz === -1 ? process.cwd() : args[iRaiz + 1]);

/*
 * La ola 2 —los artefactos que los satelites YA escribieron— se censa y no
 * bloquea. Cambiar esto a `true` es armar la puerta sobre ellos, y es un acto
 * explicito del propietario con su ficha (G-460), no una fecha que se dispara
 * sola en manos de quien pase ese dia (ADR-0188).
 */
const OLA_2_ARMADA = false;

// ── La regla, como dato ─────────────────────────────────────────────────────

/*
 * Las secciones que S-39 exige. Se escriben AQUI desde el texto de la regla, y
 * las plantillas de `fuente/` se comprueban contra esta lista —no al reves—.
 * Ese es el orden que G-303 pedia explicitamente.
 */
const CANONICAS = {
  PRD: [
    'Metadatos',
    'Resumen Ejecutivo',
    'Contexto y Problema',
    'Objetivos y Métricas de Éxito',
    'Alcance',
    'Actores y Casos de Uso de Alto Nivel',
    'Reglas de Negocio Explícitas',
    'Restricciones y Supuestos',
    'Riesgos de Negocio',
    'Criterios de Aceptación del PRD',
    'Trazabilidad',
    'Glosario',
    'Historial de Cambios',
  ],
  TS: [
    'Metadatos',
    'Resumen Técnico',
    'Diagrama de Arquitectura',
    'Diagrama de Componentes',
    'Componentes Afectados',
    'Contratos de API',
    'Modelo de Datos',
    'Seguridad',
    'Observabilidad',
    'Pruebas',
    'Riesgos Técnicos',
    'ADRs Aplicables',
    'Lista de Verificación de Hecho',
    'Referencias y Trazabilidad',
    'Historial de Cambios',
  ],
};

const NOMBRE_TIPO = { PRD: 'PRD', TS: 'historia técnica' };

/*
 * Las plantillas canonicas de cada tipo. Son el MOLDE, no un artefacto, asi que
 * no se juzgan con el corpus; pero SI se juzgan contra la regla, que es lo que
 * impide que la plantilla sea conformante por construccion.
 */
const PLANTILLAS = {
  PRD: join('reference', 'governance', 'sdlc', '04-plantillas-artefactos', 'fuente', 'plantilla-prd-fuente.es.md'),
  TS: join('reference', 'governance', 'sdlc', '04-plantillas-artefactos', 'fuente', 'plantilla-historia-tecnica-fuente.es.md'),
};

/*
 * Palabras que no distinguen una seccion de otra. Quitarlas es lo que permite
 * que «Restricciones, Supuestos y Dependencias» satisfaga «Restricciones y
 * Supuestos» sin que «Contexto y Requisitos Tecnicos» satisfaga «Contexto y
 * Problema»: se exigen todas las palabras de CONTENIDO, ni una menos.
 */
const VACIAS = new Set([
  'a', 'al', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'lo', 'los',
  'o', 'para', 'por', 'su', 'sus', 'un', 'una', 'unos', 'unas', 'y',
]);

const sinTildes = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Palabras de contenido de un titulo, normalizadas y sin el ordinal de cabeza. */
function palabras(titulo) {
  return sinTildes(titulo.toLowerCase())
    .replace(/^\s*\d+(\.\d+)*\s*[.)-]?\s*/, '')
    .split(/[^a-z0-9]+/)
    .filter((p) => p && !VACIAS.has(p));
}

// ── Corpus ──────────────────────────────────────────────────────────────────

const FASES = ['01-concepcion', '02-diseno', '03-construccion', '04-validacion', '05-entrega'];

/*
 * Raices LITERALES, nunca un barrido del arbol: el CI monta el paquete
 * publicado en `.marketplace/` y un satelite monta el estandar en `.estandar/`,
 * y los dos traen el corpus de ejemplos de la fuente (G-347, ADR-0174).
 */
const RAICES_SATELITE = FASES.map((f) => join('docs', f));
const RAIZ_EJEMPLOS = join('reference', 'governance', 'sdlc', '04-plantillas-artefactos', 'ejemplos');

/* Mismo criterio de clasificacion que ADR-0160 §2: token COMPLETO del nombre
 * base, delimitado por guiones. `PREGUNTAS_PRD_PENDIENTES.md` no es un PRD. */
const TIPOS = [
  ['historia-tecnica', 'TS'],
  ['prd', 'PRD'],
];

const rel = (p) => relative(RAIZ, p).split('\\').join('/');

function ficherosDe(dir) {
  const salida = [];
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return salida;
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...ficherosDe(p));
    else if (entrada.name.endsWith('.md')) salida.push(p);
  }
  return salida;
}

const tipoDe = (ruta) => {
  const nombre = basename(ruta).toLowerCase();
  const hit = TIPOS.find(([token]) => new RegExp(`(^|-)${token}(-|\\.)`).test(nombre));
  return hit ? hit[1] : null;
};

/* Un ADR declara su naturaleza en front-matter y no es artefacto SDLC aunque su
 * titulo hable de uno: ADR-0151 termina en `-del-prd.es.md` (ADR-0160 §2.4). */
const declaraSerAdr = (txt) => {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(txt);
  return fm !== null && /^\s*adr\s*:/m.test(fm[1]);
};

/* La plantilla es la FORMA del artefacto. Se juzga aparte, contra la regla. */
const esPlantilla = (ruta) => basename(ruta).toLowerCase().startsWith('plantilla-')
  || rel(ruta).includes('/fuente/');

/*
 * Artefacto pre-creado por el alta del satelite y aun sin redactar (ADR-0149).
 * Mismo reconocimiento que `validate-satellite-base.mjs`, y por la misma razon:
 * el estandar lo escribe vacio y luego se lo exige. Se exigen las DOS senas
 * para no eximir a un documento real que solo cite ADR-0149.
 */
const esAndamioDelAlta = (txt) =>
  txt.includes('Generado por el alta:') && /B[oó]rrame y redact/i.test(txt);

/** Los encabezados de nivel >= 2 del documento, con su texto crudo. */
function encabezados(texto) {
  const salida = [];
  const re = /^#{2,6}\s+(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(texto)) !== null) salida.push(m[1]);
  return salida;
}

/**
 * Juzga un documento contra la lista canonica de su tipo.
 * Devuelve las secciones ausentes y si el orden de las presentes es el canonico.
 */
function juzgar(texto, tipo) {
  const titulos = encabezados(texto).map((t) => ({ crudo: t, palabras: new Set(palabras(t)) }));
  const ausentes = [];
  const posiciones = [];
  for (const canonica of CANONICAS[tipo]) {
    const exigidas = palabras(canonica);
    const i = titulos.findIndex((t) => exigidas.every((p) => t.palabras.has(p)));
    if (i === -1) ausentes.push(canonica);
    else posiciones.push({ canonica, i });
  }
  const desordenada = posiciones.find((p, k) => k > 0 && p.i < posiciones[k - 1].i);
  return { ausentes, desordenada: desordenada ? desordenada.canonica : null };
}

// ── Barrido ─────────────────────────────────────────────────────────────────

const esFuente = existsSync(join(RAIZ, '.harness', 'catalog.json'));

const bloqueantes = [];
const censados = [];
const avisos = [];

/* Ola 1, mitad A: las plantillas canonicas contra la regla. Solo la fuente las
 * tiene —el satelite las consume del plugin, no las copia (S-16)—. */
const plantillasJuzgadas = [];
if (esFuente) {
  for (const [tipo, ruta] of Object.entries(PLANTILLAS)) {
    const abs = join(RAIZ, ruta);
    if (!existsSync(abs)) {
      bloqueantes.push({
        ruta,
        detalle: `la plantilla canónica de ${NOMBRE_TIPO[tipo]} no existe. Sin ella esta puerta`
          + ' se quedaría sin objeto y saldría verde por vacío, que es el modo de fallo que'
          + ' S-39 existe para impedir',
      });
      continue;
    }
    const { ausentes, desordenada } = juzgar(readFileSync(abs, 'utf-8'), tipo);
    plantillasJuzgadas.push({ tipo, ruta, ausentes });
    if (ausentes.length) {
      bloqueantes.push({
        ruta,
        detalle: `la plantilla canónica de ${NOMBRE_TIPO[tipo]} no declara ${ausentes.length}`
          + ` sección(es) que S-39 exige: ${ausentes.join(', ')}. La plantilla se verifica`
          + ' CONTRA la regla: si la sección debe desaparecer, se cambia S-39 primero',
      });
    }
    if (desordenada) {
      avisos.push({ ruta, detalle: `«${desordenada}» aparece fuera del orden canónico` });
    }
  }
}

/* El corpus: los ejemplos de la fuente y el arbol de fases del satelite. */
const documentos = [];
for (const raiz of [RAIZ_EJEMPLOS, ...RAICES_SATELITE]) {
  const enFuente = raiz === RAIZ_EJEMPLOS;
  for (const ruta of ficherosDe(join(RAIZ, raiz))) {
    if (esPlantilla(ruta)) continue;
    const tipo = tipoDe(ruta);
    if (!tipo) continue;
    const texto = readFileSync(ruta, 'utf-8');
    if (declaraSerAdr(texto)) continue;
    documentos.push({ ruta: rel(ruta), tipo, texto, ola: enFuente ? 1 : 2 });
  }
}

for (const doc of documentos) {
  if (esAndamioDelAlta(doc.texto)) {
    censados.push({ ...doc, andamio: true, ausentes: [] });
    continue;
  }
  const { ausentes, desordenada } = juzgar(doc.texto, doc.tipo);
  const registro = { ...doc, ausentes, desordenada };
  if (!ausentes.length) {
    censados.push(registro);
    if (desordenada) avisos.push({ ruta: doc.ruta, detalle: `«${desordenada}» aparece fuera del orden canónico` });
    continue;
  }
  const detalle = `${NOMBRE_TIPO[doc.tipo]} sin ${ausentes.length} de las`
    + ` ${CANONICAS[doc.tipo].length} secciones de su plantilla canónica: ${ausentes.join(', ')}`;
  if (doc.ola === 1 || OLA_2_ARMADA) bloqueantes.push({ ruta: doc.ruta, detalle });
  else censados.push(registro);
}

// ── Reporte ─────────────────────────────────────────────────────────────────

console.log('━━━ El PRD y la historia técnica declaran sus secciones (S-39, ADR-0223, G-303) ━━━\n');

const sinObjeto = !documentos.length && !plantillasJuzgadas.length;
if (sinObjeto) {
  console.log('  · SE ABSTIENE: no hay ningún PRD ni ninguna historia técnica en este árbol,');
  console.log('    y tampoco las plantillas canónicas. No hay objeto que juzgar, y decirlo no');
  console.log('    es lo mismo que decir «conforme» (SD-05).');
  console.log(`    (se miran ${[RAIZ_EJEMPLOS, ...RAICES_SATELITE].join(', ')})`);
  process.exit(0);
}

console.log(`  · ${esFuente ? 'FUENTE del estándar' : 'repositorio satélite'}: `
  + `${plantillasJuzgadas.length} plantilla(s) canónica(s) y ${documentos.length} artefacto(s).`);
console.log(`  · ola 1 (la fuente) BLOQUEA; ola 2 (los satélites) se censa y `
  + `${OLA_2_ARMADA ? 'BLOQUEA (armada)' : 'no puede ponerse roja (G-460)'}.\n`);

if (VERBOSE) {
  for (const p of plantillasJuzgadas) {
    console.log(`    ${p.ruta} [plantilla ${p.tipo}] → ${p.ausentes.length ? `faltan ${p.ausentes.length}` : 'las declara todas'}`);
  }
  for (const d of [...documentos].sort((a, b) => a.ruta.localeCompare(b.ruta))) {
    const c = censados.find((x) => x.ruta === d.ruta);
    const estado = c?.andamio ? 'andamio del alta (ADR-0149): no se juzga'
      : c ? (c.ausentes.length ? `censado: faltan ${c.ausentes.length}` : 'declara todas sus secciones')
        : 'ACUSADO';
    console.log(`    ${d.ruta} [${d.tipo}, ola ${d.ola}] → ${estado}`);
  }
  console.log('');
}

const censadosConDefecto = censados.filter((c) => c.ausentes.length);
for (const c of censadosConDefecto) {
  console.log(`  · censado (ola 2, no bloquea): ${c.ruta} — falta(n) ${c.ausentes.join(', ')}`);
}
for (const a of avisos) console.log(`  ⚠ ${a.ruta}: ${a.detalle} (se reporta, no bloquea)`);

if (!bloqueantes.length) {
  console.log(`\n  ✔ ola 1 conforme: cada PRD y cada historia técnica de la fuente declara las`
    + ` secciones de su plantilla${censadosConDefecto.length ? `; ${censadosConDefecto.length} censado(s) arriba` : ''}.`);
  process.exit(0);
}

console.error('');
for (const b of bloqueantes) console.error(`  ✘ ${b.ruta}: ${b.detalle}`);
console.error('');
console.error('  S-39 comprueba ESTRUCTURA, no calidad: que la sección esté declarada, no que');
console.error('  esté bien escrita. La lista canónica está en el texto de S-39 y en la');
console.error('  constante CANONICAS de este fichero; las plantillas de');
console.error('  reference/governance/sdlc/04-plantillas-artefactos/fuente/ se juzgan contra');
console.error('  ella, y no al revés (G-303).');
process.exit(1);
