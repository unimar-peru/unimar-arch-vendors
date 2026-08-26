#!/usr/bin/env node
/**
 * validate-docs.mjs — validación documental de Unimar Arch.
 *
 * Comprueba:
 *   1. Limpieza UTF-8 (sin BOM, sin carácter de reemplazo, sin CRLF) y texto mutilado.
 *   2. SD-06 — enlaces relativos: el destino de cada `[texto](ruta)` existe.
 *   3. SD-06 — anclas: el `#fragmento` de un enlace corresponde a un encabezado real.
 *   4. SD-06 — Mermaid: los bloques ```mermaid tienen un tipo de diagrama conocido
 *      y su estructura cierra. NO se renderiza: ver la nota en `checkMermaid`.
 *   5. S-30 — rutas de lectura: ninguna fila que declara obligatoriedad de lectura
 *      encamina a un ADR retirado. Ver la nota larga en `checkRutasDeLectura`.
 *   6. S-31 — todo ADR retirado tiene su razón escrita en el registro de la raíz.
 *   7. S-32 — la marca `sujeto_no_observado:` de un ADR está bien formada, la
 *      lee un humano y caduca con el gap que la sostiene. Ver la nota larga en
 *      `checkSujetoNoObservado`.
 *   8. S-40 — esa misma marca declara el hecho del censo en que se apoya, y el
 *      censo la desmiente cuando el sujeto aparece. Ver la nota larga sobre
 *      `checkSujetoContraCenso`. Se abstiene donde no hay censo.
 *   9. Integración CI: código de salida 1 si falla (pre-commit y GitHub Actions).
 *
 * Uso:
 *   node .harness/scripts/validate-docs.mjs
 *   node .harness/scripts/validate-docs.mjs --fix   (repara enlaces de ruta inequívoca)
 *
 * Nota histórica (2026-07-16): los chequeos 2–4 no existían. Cinco documentos
 * —`catalog.json`, `AGENTS.md`, `unimar-core.md`, `satellite-repo-rules.md` y la
 * skill— afirmaban que este script validaba enlaces y anclas. No lo hacía: no
 * contenía un solo `existsSync`. El repositorio tenía 210 enlaces rotos y el gate
 * respondía OK sobre todos ellos — exactamente la "confianza falsa" que SD-06
 * nombra. La regla existía sin ejecutor.
 *
 * Segunda nota histórica (2026-08-08, G-172, ADR-0178): aquí vivían cuatro
 * chequeos de la cadena de trazabilidad —TS↔ADR, TSR↔TS, FS huérfana, US
 * huérfana— y los cuatro corrían sobre CONJUNTO VACÍO. Filtraban por prefijo
 * leído de un campo `> **ID:**` que ningún artefacto del corpus usa, y dos de
 * ellos empujaban a `warnings`, que no encienden el código de salida. Es la
 * misma «confianza falsa» del párrafo anterior, agravada: aquí sí había código,
 * y por eso nadie buscó el ejecutor que faltaba. Se retiran en vez de afinarse
 * porque el defecto no era el filtro sino el contrato de metadato al que
 * obedecían (ADR-0178 §1.2). La cadena tiene ahora puerta propia:
 * `validate-cadena-artefactos.mjs`.
 */

import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { resolve, relative, dirname, basename } from "node:path";
/*
 * Que es un enlace, y cual de ellos se puede juzgar, vive en `lib/enlaces.mjs`
 * y no aqui. Tres consumidores necesitan la MISMA respuesta -- este validador,
 * `validate-paquete.mjs` y el reanclaje de `package-plugin.mjs` --, y si cada
 * uno la respondiera por su cuenta, el empaquetado reescribiria un conjunto de
 * enlaces y la puerta juzgaria otro: un marcador de plantilla seria «roto» para
 * uno e invisible para el otro.
 */
import { destinosDe } from "./lib/enlaces.mjs";
import { celdas } from "./lib/tabla.mjs";

/*
 * El objetivo del validador es el repositorio que se valida -- el cwd desde el
 * que se invoca --, no la ubicacion del script. Derivar la raiz de su propia
 * ruta funcionaba mientras el script vivia dentro del repositorio; empaquetado
 * en el plugin, esa suposicion apunta al plugin y validaria el estandar en vez
 * del satelite.
 */
const REPO_ROOT = process.cwd();

const UTF8_BOM = "\uFEFF";
const REPLACEMENT_CHAR = "\uFFFD";

const issues = [];
const warnings = [];

/**
 * El glob de Node no entra en directorios ocultos. Durante meses eso dejó
 * `.harness/`, `.github/` y `.claude/` sin validar, mientras el script
 * anunciaba "scanned all .md files". La corrupción de satellite-repo-rules.md
 * sobrevivió ahí dentro sin que nadie la viera.
 *
 * Se enumeran explícitamente las raíces ocultas que SÍ son autoría del
 * repositorio. Las generadas (`.agents/skills`, `.claude/skills`, `.opencode`,
 * `_bmad`) quedan fuera: no las escribimos nosotros y están en inglés.
 */
const HIDDEN_ROOTS = [
  ".harness/**/*.md",
  ".github/**/*.md",
  ".claude/agents/*.md",
  ".claude/rules/*.md",
];

async function* walkMarkdown(dir) {
  const vistos = new Set();
  for await (const entry of glob(["**/*.md", ...HIDDEN_ROOTS], { cwd: dir })) {
    if (vistos.has(entry)) continue;
    vistos.add(entry);
    yield entry;
  }
}

/**
 * Formas mutiladas: la palabra original perdió sus vocales acentuadas o su eñe.
 * El archivo resultante es UTF-8 perfectamente válido, así que ni el BOM ni el
 * carácter de reemplazo lo delatan. Solo un diccionario o una regla lo hacen.
 */
/*
 * Solo entran formas que NO son palabras válidas en español. Un primer intento
 * incluyó "estar" y "ser" — que sí lo son — y produjo 143 falsos positivos.
 * Mínimo cuatro letras: "ms", "as", "aqu" o "est" son demasiado ambiguas.
 * Las terminadas en "cin"/"sin" las cubre además la regla de sufijo.
 */
const MUTILADAS = new Set([
  "satlite", "satlites", "tcnica", "tcnico", "tcnicos", "tcnicas",
  "tecnologa", "tecnologas", "espaol", "espaola", "espaoles",
  "estndar", "estndares", "smbolo", "smbolos", "aadir", "explcitamente",
  "catlogo", "catlogos", "automticamente", "estn", "nico", "nica", "nicos",
  "diseo", "diseos", "maana", "pequeo", "pequea", "seor", "seora",
  "nmero", "nmeros", "mtodo", "mtodos", "ltimo", "ltima", "prximo", "prxima",
  "adems", "mnimo", "mximo", "bsico", "bsica", "prctica", "prctico",
  "anlisis", "crtico", "crtica", "mtrica", "mtricas", "poltica", "polticas",
  "trmino", "trminos", "prrafo", "captulo", "artculo", "artculos",
  "categora", "categoras", "jerarqua", "auditora", "garanta", "energa",
]);

/** Palabras válidas (español o inglés) que la regla de sufijo marcaría en falso. */
const PERMITIDAS = new Set([
  "sin", "basin", "resin", "cousin", "raisin", "casein", "asin", "toxin",
  "lignin", "sasin", "assassin",
]);

/** Quita bloques de código, código en línea, URLs y etiquetas HTML. */
function soloProsa(content) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\]\([^)]*\)/g, " ");
}

const TIENE_ESPANOL = /\b(el|la|los|las|de|que|para|con|una|debe|cada)\b/i;

function checkMutilacion(rel, content) {
  const prosa = soloProsa(content);
  // Solo aplica a documentos en español: las skills en inglés tienen "basin",
  // "cousin" y compañía, y no queremos falsos positivos.
  if (!TIENE_ESPANOL.test(prosa)) return;

  const encontradas = new Set();
  for (const m of prosa.matchAll(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,}/g)) {
    const palabra = m[0];
    const lower = palabra.toLowerCase();
    if (PERMITIDAS.has(lower)) continue;
    // Regla de diccionario, y regla de sufijo para las que no estén listadas:
    // "ción" y "sión" pierden la tilde y terminan en "cin" / "sin".
    if (MUTILADAS.has(lower) || (lower.length >= 6 && /(cin|sin)$/.test(lower))) {
      encontradas.add(palabra);
    }
  }
  if (encontradas.size > 0) {
    issues.push({
      file: rel,
      kind: `TEXTO_MUTILADO (${[...encontradas].slice(0, 6).join(", ")}${encontradas.size > 6 ? ", …" : ""})`,
    });
  }
}

function checkEncoding(rel, content) {
  let stripped = content;
  if (stripped.startsWith(UTF8_BOM)) {
    issues.push({ file: rel, kind: "BOM" });
    stripped = stripped.slice(1);
  }
  if (stripped.includes(REPLACEMENT_CHAR)) {
    issues.push({ file: rel, kind: "REPLACEMENT_CHAR" });
  }
  if (/\r\n/.test(stripped)) {
    issues.push({ file: rel, kind: "CRLF" });
  }
  checkMutilacion(rel, stripped);
}

// --- SD-06: enlaces, anclas y Mermaid ---------------------------------------

/*
 * Solo se comprueba lo que el repositorio controla. Una URL http puede caerse
 * mañana y no es culpa de este commit; un ancla propia, en cambio, o resuelve o
 * el documento está roto hoy. Las reglas de extracción —el destino con espacios,
 * los marcadores de plantilla, la interpolación `${…}`— están en
 * `lib/enlaces.mjs` con su porqué.
 */

/**
 * Slug al estilo GitHub: se parte del texto RENDERIZADO del encabezado, así que
 * primero caen el código en línea, los enlaces y el énfasis. Se conservan las
 * tildes y la eñe: GitHub no las transcribe, y el corpus es en español (SD-08).
 *
 * Dos detalles que parecen menores y no lo son — los dos producían falsos
 * positivos sobre enlaces que estaban bien:
 *
 *  · Solo se quitan etiquetas HTML DE VERDAD (nombre en minúscula: `<br/>`,
 *    `<a name="x">`). Un `<Nombre de la Épica>` dentro de comillas invertidas es
 *    un marcador de plantilla, no una etiqueta, y GitHub lo cuenta en el ancla.
 *  · Los espacios se sustituyen UNO A UNO, sin colapsar. `Inicio Rápido — Crear`
 *    pierde la raya pero conserva sus dos espacios, y GitHub genera
 *    `inicio-rápido--crear` con doble guion. Colapsar rompía el enlace correcto.
 */
function slug(texto) {
  return texto
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[a-z][a-z0-9]*(\s[^>]*)?\/?>/g, "")
    .replace(/[*_~]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");
}

/** Anclas que un documento ofrece: sus encabezados, más las explícitas en HTML. */
function anclasDe(content) {
  const anclas = new Set();
  const cuerpo = content.replace(/```[\s\S]*?```/g, " ");
  const cuenta = new Map();
  for (const m of cuerpo.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
    const s = slug(m[1]);
    if (!s) continue;
    // GitHub desambigua los encabezados repetidos con -1, -2, …
    const n = cuenta.get(s) || 0;
    anclas.add(n === 0 ? s : `${s}-${n}`);
    cuenta.set(s, n + 1);
  }
  for (const m of content.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) anclas.add(m[1]);
  for (const m of content.matchAll(/\bid="([^"]+)"/g)) anclas.add(m[1]);
  return anclas;
}

/**
 * Las plantillas de `.harness/templates/` no son documentación de ESTE
 * repositorio: son la carga útil que el satélite materializa en su raíz. Sus
 * enlaces relativos (`./src`, `./CLAUDE.md`) están escritos para resolver ALLÍ,
 * y exigirlos aquí es un error de categoría que produce falsos positivos a
 * perpetuidad. Se les levanta la resolución de enlaces, y solo esa: encoding,
 * idioma, mutilaciones y terminología las siguen atravesando enteras.
 *
 * `reference/governance/herencia/preparado/` es la misma categoría con otro
 * domicilio (ADR-0201, G-404): plantillas YA materializadas para un satélite
 * concreto, que esperan a que su propietario las copie. Sus `./GAPS.md` y
 * `./DECISIONS.md` resuelven en la raíz de AQUEL repositorio, no aquí, y el
 * `README.md` del propio directorio —que sí es autoría de este repositorio y
 * cuyos enlaces sí deben resolver— queda deliberadamente fuera de la exención.
 */
const esPlantilla = (rel) => rel.startsWith(".harness/templates/")
  || (rel.startsWith("reference/governance/herencia/preparado/") && !rel.endsWith("/README.md"));

function checkEnlaces(rel, content, anclasPorArchivo) {
  if (esPlantilla(rel)) return;
  const dir = dirname(resolve(REPO_ROOT, rel));
  for (const crudo of destinosDe(content)) {
    const [rutaCruda, ancla] = crudo.split("#");

    // Enlace puramente interno: `#seccion` apunta al propio documento.
    if (rutaCruda === "") {
      if (ancla && !anclasDe(content).has(decodeURIComponent(ancla).toLowerCase())) {
        issues.push({ file: rel, kind: "ANCLA_ROTA", detail: `#${ancla} no existe en este documento` });
      }
      continue;
    }

    let destino;
    try {
      destino = resolve(dir, decodeURIComponent(rutaCruda));
    } catch {
      issues.push({ file: rel, kind: "ENLACE_ILEGIBLE", detail: crudo });
      continue;
    }

    if (!existsSync(destino)) {
      issues.push({ file: rel, kind: "ENLACE_ROTO", detail: `${crudo} → no existe` });
      continue;
    }

    // El destino existe: si además se pide un ancla, tiene que estar dentro.
    if (ancla && destino.endsWith(".md")) {
      const destRel = relative(REPO_ROOT, destino);
      const anclas = anclasPorArchivo.get(destRel);
      // Solo se juzga lo que se ha leído: un .md fuera del barrido no se inventa.
      if (anclas && !anclas.has(decodeURIComponent(ancla).toLowerCase())) {
        issues.push({ file: rel, kind: "ANCLA_ROTA", detail: `${crudo} → el destino existe, pero no tiene el ancla #${ancla}` });
      }
    }
  }
}

/*
 * Mermaid: se valida ESTRUCTURA, no render. Renderizar exigiría el motor de
 * Mermaid (un navegador headless) y este harness no tiene dependencias. Lo que
 * sí se puede afirmar sin mentir: que el bloque declara un tipo de diagrama
 * conocido y que sus bloques abren y cierran. Un `subgraph` sin `end` no
 * renderiza en ningún visor, y eso se detecta leyendo.
 *
 * Lo que NO detecta, y por eso `catalog.json` no debe prometerlo: errores
 * semánticos (un nodo que se enlaza a sí mismo, una flecha a un id inexistente).
 */
const TIPOS_MERMAID = [
  "graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram",
  "stateDiagram-v2", "erDiagram", "journey", "gantt", "pie", "gitGraph",
  "mindmap", "timeline", "quadrantChart", "requirementDiagram", "C4Context",
  "C4Container", "C4Component", "C4Dynamic", "C4Deployment", "sankey-beta",
  "block-beta", "packet-beta", "xychart-beta", "architecture-beta",
];

function checkMermaid(rel, content) {
  const bloques = content.matchAll(/```mermaid\r?\n([\s\S]*?)```/g);
  let n = 0;
  for (const b of bloques) {
    n += 1;
    const cuerpo = b[1];
    const lineas = cuerpo.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("%%"));

    if (lineas.length === 0) {
      issues.push({ file: rel, kind: "MERMAID_VACIO", detail: `bloque #${n} no tiene contenido` });
      continue;
    }

    const primera = lineas[0];
    if (!TIPOS_MERMAID.some((t) => primera === t || primera.startsWith(t + " ") || primera.startsWith(t + "\t"))) {
      issues.push({ file: rel, kind: "MERMAID_TIPO_DESCONOCIDO", detail: `bloque #${n} empieza por "${primera.slice(0, 40)}" — no es un tipo de diagrama Mermaid` });
      continue;
    }

    // `subgraph` siempre cierra con `end`. En sequenceDiagram, `end` también
    // cierra alt/else/opt/loop/par/critical/rect/box, así que se cuentan todos
    // los que abren, no solo subgraph.
    const abren = (cuerpo.match(/^\s*(subgraph|alt|opt|loop|par|critical|rect|box)\b/gm) || []).length;
    const cierran = (cuerpo.match(/^\s*end\b/gm) || []).length;
    if (abren !== cierran) {
      issues.push({ file: rel, kind: "MERMAID_SIN_CERRAR", detail: `bloque #${n}: ${abren} bloque(s) abren y ${cierran} \`end\` cierran` });
    }
  }
}

// --- S-30: una ruta de lectura no encamina a una decisión retirada ----------

/*
 * Retirar un ADR no corrige a quien lo citaba. Cuando ADR-0005 pasó a
 * `Supersedido` (G-324), su estado quedó bien en las cuatro fuentes que lo
 * declaran y NINGÚN documento que lo citaba se enteró: `MASTER_INDEX` seguía
 * dándolo como lectura **R** —«requerido, el documento es vinculante»— en tres
 * fases, y el mapeo de artefactos SDLC como `Req` en dos. Quien llega por la
 * cita no pasa por el estado (G-379).
 *
 * LA PUERTA NO PUEDE SER «NADIE CITA UN ADR RETIRADO», y ese es el punto:
 * las lápidas los citan, el ADR que los supersede los cita, la matriz, el hub,
 * `DECISIONS.md` y las fichas de gap los citan, y todas hacen bien. Medido
 * sobre este corpus: 6 ADR retirados y 282 líneas que los nombran, la inmensa
 * mayoría legítimas. Una puerta por presencia del token acusaría a 282 y
 * moriría desactivada (ADR-0160 §1.4).
 *
 * El criterio es más fino, y no lo inventa este validador: lo declaran las
 * propias leyendas del corpus. Una fila que lleva `R` afirma «lectura
 * obligatoria: el documento es vinculante»; una que lleva `C` afirma «está en
 * `Borrador` o `Pendiente de Importación`»; `Req` afirma que su ausencia
 * bloquea el gate de fase. Las tres son FALSAS sobre un ADR retirado, que no
 * vincula (SD-03). En prosa, en cambio, nombrar un ADR retirado no afirma
 * nada sobre su vigencia — y por eso la prosa no se juzga aquí.
 *
 * Se juzga, entonces, la fila de tabla que reúne las dos cosas: una celda que
 * es EXACTAMENTE una marca de obligatoriedad y un enlace a un documento cuyo
 * front-matter dice `Supersedido` o `Deprecado`. La marca `Hist` es la salida:
 * declara que la fila encamina a una decisión retirada a propósito.
 *
 * Se juzga contra el front-matter del DESTINO del enlace, no contra un
 * inventario de ADR: así la puerta no necesita saber dónde vive el corpus y
 * funciona igual en un satélite que enlaza a otro documento cualquiera.
 *
 * LÍMITES DECLARADOS, los tres deliberados:
 *   - Solo la fila con MARCA. Una tabla de decisiones sin columna de
 *     obligatoriedad —el blueprint de referencia, por ejemplo— no se juzga:
 *     sus celdas no afirman vigencia, y adivinar cuáles sí sería interpretar
 *     castellano.
 *   - Solo el ENLACE. `- ADR-0064 (Observabilidad)` sin enlace no se juzga: el
 *     defecto que esta puerta ataca es el del lector que LLEGA por la cita, y
 *     se llega por el enlace. Lo que se nombra sin encaminar lo sostiene la
 *     revisión humana.
 *   - Solo lo LEÍDO. Si el destino no está en el barrido, no se inventa su
 *     estado: se calla, igual que hace el cruce de anclas.
 */

/**
 * Las marcas con que el corpus declara obligatoriedad de lectura: `R`/`C`/`O`
 * en `MASTER_INDEX`, `Req`/`Opc`/`Cond` en el mapeo de artefactos SDLC. Se
 * enumeran en vez de deducirse porque son un vocabulario cerrado que las
 * leyendas de esos documentos definen, y aprenderlo por inferencia convertiría
 * cualquier celda de una letra en una marca.
 */
const MARCAS_OBLIGATORIEDAD = new Set(["R", "C", "O", "Req", "Opc", "Cond"]);

/** La salida declarada: la fila encamina a una decisión retirada a propósito. */
const MARCA_HISTORICA = "Hist";

/** Los dos estados en que un ADR ha dejado de mandar (S-29, ADR-0182 §2.1). */
const ESTADOS_RETIRADOS = new Set(["Supersedido", "Deprecado"]);

/**
 * Normaliza una celda a la marca que declara, o a `null` si no declara ninguna.
 * Se le quitan los adornos con que el corpus la escribe —negritas, comillas
 * invertidas, el asterisco de `R*` y el paréntesis de `Req (satélite)`— porque
 * son tipografía, no semántica.
 */
function marcaDeCelda(celda) {
  const limpio = celda
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s*\((?:satélite|ref\.)\)\s*/g, "")
    .trim()
    .replace(/\*$/, "")
    .trim();
  if (limpio === MARCA_HISTORICA) return MARCA_HISTORICA;
  return MARCAS_OBLIGATORIEDAD.has(limpio) ? limpio : null;
}

/** El `estado:` del front-matter tipado, o `null` si el documento no lo declara. */
function estadoDeFrontMatter(contenido) {
  const fm = contenido.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const m = fm[1].match(/^estado:\s*(.+)$/m);
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
}

function checkRutasDeLectura(rel, content, contenidoPorArchivo) {
  // Misma exención que los enlaces: una plantilla se resuelve en el satélite.
  if (esPlantilla(rel)) return;
  const dir = dirname(resolve(REPO_ROOT, rel));

  for (const linea of content.split("\n")) {
    if (!linea.trim().startsWith("|")) continue;
    const marcas = celdas(linea).map(marcaDeCelda).filter(Boolean);
    if (marcas.length === 0) continue;
    if (marcas.includes(MARCA_HISTORICA)) continue;

    for (const m of linea.matchAll(/\]\(([^)\s#]+\.md)(?:#[^)]*)?\)/g)) {
      let destino;
      try { destino = resolve(dir, decodeURIComponent(m[1])); } catch { continue; }
      const destRel = relative(REPO_ROOT, destino).split("\\").join("/");
      const contenidoDestino = contenidoPorArchivo.get(destRel);
      if (contenidoDestino === undefined) continue; // fuera del barrido: no se inventa
      const estado = estadoDeFrontMatter(contenidoDestino);
      if (estado === null || !ESTADOS_RETIRADOS.has(estado)) continue;
      issues.push({
        file: rel,
        kind: "RUTA_DE_LECTURA_RETIRADA",
        detail: `la fila marcada \`${marcas[0]}\` encamina a ${destRel}, que declara \`estado: ${estado}\` y ya no vincula (SD-03). `
          + `Apunta a la decisión vigente o marca la fila \`${MARCA_HISTORICA}\` para declarar que cita una decisión retirada a propósito (S-30)`,
      });
    }
  }
}

// --- S-33: una regla vigente no se funda en silencio en una decisión que no vincula ---

/*
 * UNA REGLA `S-xx` ES NORMA VIGENTE EL DÍA QUE SE PUBLICA EN EL PLUGIN. El ADR
 * que la funda, si está en `Borrador`, NO OBLIGA (SD-03). Cuando la regla cita a
 * ese ADR como su fundamento, el corpus produce una norma que vincula apoyada en
 * una decisión que no vincula: quien pregunte «¿por qué esta regla?» llega a un
 * documento que el propio estándar declara no vinculante (G-375).
 *
 * No es hipotético y se midió: el 2026-08-08, ocho ADR en `Borrador` estaban
 * citados desde `.harness/rules/` —0120, 0128, 0132, 0134, 0165, 0178, 0179 y
 * 0180— y cinco de ellos fundaban una regla ya publicada y ya cableada.
 *
 * LO QUE SE JUZGA ES LA CITA SILENCIOSA, NO LA CITA. Prohibir citar un ADR que
 * no vincula sería falso y además destruiría documentación legítima: la lápida,
 * el relato del caso que originó una regla, el antecedente de una práctica y el
 * ADR que supersede a otro nombran decisiones no vigentes, y todos hacen bien.
 * Una puerta por presencia del identificador acusaría a quien mejor documenta y
 * terminaría desactivada (ADR-0160 §1.4). Lo que la regla exige es que la cita
 * DIGA lo que cita: si el destino no está `Aceptado` ni `Aprobado`, su estado se
 * declara junto al enlace. Así la norma no puede fundarse en un borrador sin que
 * el propio texto lo confiese, y confesarlo es incompatible con fundarse en él.
 *
 * LA VENTANA ES MEDIDA, NO ELEGIDA. La declaración vale si el estado aparece en
 * los 160 caracteres siguientes al enlace y antes de la siguiente cita de ADR.
 * Las dos citas honestas que el corpus ya tenía escritas —«[ADR-0044] está
 * `Deprecado` sin superseder» y «[ADR-0155] llevaba seis días `Supersedido` sin
 * fila», ambas en S-31— caen a 6 y 20 caracteres del enlace y pasan SIN TOCARLAS.
 * Sin la ventana, cualquier «Borrador» suelto en una fila de mil palabras habría
 * absuelto una cita que está a párrafos de distancia: la fila de S-27 explica que
 * «un `Borrador` no caduca» y cita a ADR-0128 en otro punto, y las dos cosas no
 * tienen nada que ver. La declaración vale pegada a lo que declara.
 *
 * TRES LÍMITES DECLARADOS:
 *   - SOLO `.harness/rules/`. El objeto de la regla es la NORMA, no el corpus.
 *     Un ADR que cita a otro `Borrador` como antecedente es asunto de su autor y
 *     ya tiene su costumbre —la «Nota de vigencia (SD-03)» de ADR-0165, 0185,
 *     0187 y 0188—; convertirla en puerta es otra decisión y otro ADR. En un
 *     satélite este directorio no existe (S-16) y la puerta se abstiene: no es
 *     indulgencia, es que el objeto no está ahí.
 *   - SOLO EL ENLACE, el mismo criterio que S-30 (ADR-0185 §2.4). Se llega por
 *     el enlace; lo que se nombra sin encaminar no manda a nadie a leerlo. En
 *     este corpus hay 6 citas sueltas a ADR no vigentes dentro de las reglas
 *     —ADR-0005 ×2, ADR-0044, ADR-0064, ADR-0155 y el ejemplo de formato
 *     `ADR-TMS-004`, que ni siquiera es un ADR de aquí— y las 6 son narración.
 *   - SOLO LO LEÍDO. Si el destino no está en el barrido, no se inventa su
 *     estado. Un satélite que nombra un ADR del núcleo no puede cambiarlo.
 */

/** Los estados que VINCULAN (SD-03). Los demás no obligan y hay que decirlo. */
const ESTADOS_VINCULANTES = new Set(["Aceptado", "Aprobado"]);

/** El domicilio de la norma. Fuera de aquí no hay regla que fundar. */
const RAIZ_DE_REGLAS = ".harness/rules/";

/** Cuán pegada al enlace tiene que ir la declaración de vigencia. Ver cabecera. */
const VENTANA_DECLARACION = 160;

function checkVigenciaDeCitas(rel, content, contenidoPorArchivo) {
  if (!rel.startsWith(RAIZ_DE_REGLAS)) return;
  const dir = dirname(resolve(REPO_ROOT, rel));

  for (const linea of content.split("\n")) {
    for (const m of linea.matchAll(/\[ADR-(?:\d{4}|[A-Z][A-Z0-9]*-\d{3})\]\(([^)\s#]+\.md)(?:#[^)]*)?\)/g)) {
      let destino;
      try { destino = resolve(dir, decodeURIComponent(m[1])); } catch { continue; }
      const destRel = relative(REPO_ROOT, destino).split("\\").join("/");
      const contenidoDestino = contenidoPorArchivo.get(destRel);
      if (contenidoDestino === undefined) continue; // fuera del barrido: no se inventa
      const estado = estadoDeFrontMatter(contenidoDestino);
      if (estado === null || ESTADOS_VINCULANTES.has(estado)) continue;

      const desde = m.index + m[0].length;
      const segmento = linea.slice(desde, desde + VENTANA_DECLARACION).split("[ADR-")[0];
      if (segmento.includes(estado)) continue; // la cita declara su propia vigencia

      issues.push({
        file: rel,
        kind: "CITA_SIN_VIGENCIA_DECLARADA",
        detail: `cita enlazada a ${destRel}, que declara \`estado: ${estado}\` y por tanto NO VINCULA (SD-03), `
          + `sin decirlo junto al enlace. Una regla del estándar es norma vigente el día que se publica: si su cita calla `
          + `el estado, la norma se funda en silencio en una decisión que no obliga. O el ADR se acepta —el acto es la fusión `
          + `del PR cuyo diff mueve el estado (ADR-0176 §2.2)— o la cita declara \`${estado}\` en los `
          + `${VENTANA_DECLARACION} caracteres siguientes al enlace, diciendo qué papel cumple (S-33)`,
      });
    }
  }
}

// --- S-31: la retirada de un ADR consta con su razón ------------------------

/*
 * Un ADR podía pasar a `Supersedido` sin que nadie escribiera POR QUÉ, y ya
 * había ocurrido: ADR-0155 estaba retirado desde el 2026-08-02 y no tenía fila
 * en «ADRs Retirados» de `DECISIONS.md`, que la matriz declara obligatoria
 * (G-378). Su propia lápida decía «Registrado en DECISIONS.md» y era falso.
 *
 * LA REGLA YA EXISTÍA Y NO TENÍA EJECUTOR, y el motivo estaba declarado, no
 * escondido: la cuarta puerta de `validate-adr-status.mjs` (S-29, ADR-0182 §5)
 * recibe un DIRECTORIO DE ADR y corre en satélites donde `DECISIONS.md` vive en
 * otra raíz, así que comprueba la reciprocidad del estado y no la fila del
 * registro. ADR-0182 §4 descartó ampliarla por ahí — «rompe el contrato del
 * validador»— y tenía razón. Lo que faltaba no era ampliar aquella puerta: era
 * ponerla donde la raíz del repositorio es un dato, y aquí lo es
 * (`REPO_ROOT = process.cwd()`, ver la nota de arriba). Es el mismo movimiento
 * con que S-30 resolvió el mismo estorbo un día antes (ADR-0188 §2.3).
 *
 * EL DISPARADOR ES EL ESTADO, NO LA DECLARACIÓN AJENA, y por eso alcanza más
 * que S-29: la reciprocidad solo se activa cuando ALGUIEN declara `supersede:
 * [N]`. ADR-0044 está `Deprecado` **sin superseder** —nadie lo nombra en un
 * campo `supersede:`— y por tanto S-29 no lo mira nunca; su razón de retirada
 * es exactamente igual de obligatoria. Los dos conjuntos no coinciden.
 *
 * DÓNDE **NO** SE ABSTIENE, que es la mitad que hace de esto una puerta:
 *   - En cuanto el árbol contiene UN ADR con `estado: Supersedido`/`Deprecado`,
 *     se exige la fila. Sin `DECISIONS.md`, sin sección o sin razón, ROMPE.
 *     No hay «no encontré el registro, luego paso»: la ausencia del registro es
 *     precisamente el defecto, y tratarla como exención sería construir la
 *     puerta que se abstiene siempre — que es no tener puerta.
 *   - Vale igual en un satélite: `DECISIONS.md` es obligatorio ahí (S-15) y la
 *     plantilla lo reparte ya con su sección. Un `ADR-UMS-072` retirado se juzga
 *     con la misma regla, contra el `DECISIONS.md` del propio satélite.
 * Lo único que no juzga es el árbol donde NO HAY ningún ADR retirado, y eso no
 * es abstenerse: es que no existe el objeto.
 *
 * LO QUE NO ACUSA, medido y deliberado:
 *   - La SUPERSESIÓN PARCIAL. Un ADR parcialmente superseído conserva su estado
 *     `Aceptado` —así lo fija el encabezado de «Supersesiones parciales»— y esta
 *     puerta solo mira el front-matter: nunca entra en el conjunto juzgado. Son
 *     seis casos vivos en este corpus (ADR-0138, ADR-0068 ×2, ADR-0158,
 *     ADR-0103, ADR-0089) y ninguno debe llevar fila en «ADRs Retirados».
 *   - Y por lo mismo, la fila se busca DENTRO de la sección «ADRs Retirados» y
 *     no en todo el fichero: un ADR retirado del que solo se habla en la tabla
 *     de parciales NO está registrado, y un `grep` sobre el fichero entero lo
 *     daría por bueno.
 *
 * LÍMITE DECLARADO: se comprueba que la casilla de la razón tenga texto, no que
 * la razón sea buena. Juzgar la calidad de una explicación en castellano es
 * lectura humana, y fingirla aquí sería la «confianza falsa» de la cabecera.
 */

/** El registro donde consta la razón de cada retirada (ADR-0182 §2.1). */
const REGISTRO_DE_RETIRADAS = "DECISIONS.md";

/** El encabezado de la sección que lo aloja. */
const RE_SECCION_RETIRADAS = /^##\s+ADRs\s+Retirados\s*$/i;

/**
 * Las dos identidades de ADR que el estándar admite, sobre el nombre de fichero:
 * cuatro cifras en el núcleo (`0155-...es.md`) y `SIGLA-NNN` en un satélite
 * (`UMS-072-...es.md`, S-15). Misma forma que usan `validate-adr-status.mjs` y
 * `validate-trazabilidad.mjs`, para que las tres puertas cuenten los mismos ADR.
 */
const RE_ADR_ARCHIVO = /^(\d{4}|[A-Z][A-Z0-9]*-\d{3})-.+\.md$/;

/** Quita el backtick con que los índices envuelven el estado: `Aceptado` → Aceptado */
const sinBacktick = (s) => (s ?? "").replace(/`/g, "").trim();

/**
 * Lee la tabla de «ADRs Retirados». Devuelve `null` si la sección no existe o no
 * tiene tabla —que es un hallazgo, no un silencio—, y un `Map` id → fila si sí.
 *
 * Los índices de columna se DERIVAN del encabezado en vez de cablearse: la tabla
 * es prosa editable y una columna que se mueva no debe convertir la puerta en un
 * generador de acusaciones falsas.
 */
function leerRegistroDeRetiradas(contenido) {
  let dentro = false;
  let vistaLaSeccion = false;
  let columnas = null;
  const filas = new Map();

  for (const linea of contenido.split("\n")) {
    if (/^##\s/.test(linea)) {
      if (dentro) break; // la sección terminó donde empieza la siguiente
      dentro = RE_SECCION_RETIRADAS.test(linea.trim());
      vistaLaSeccion ||= dentro;
      continue;
    }
    if (!dentro || !linea.trim().startsWith("|")) continue;
    const c = celdas(linea);
    if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue; // fila separadora
    if (columnas === null) {
      const busca = (re) => c.findIndex((x) => re.test(x.trim()));
      columnas = { estado: busca(/^estado$/i), razon: busca(/^raz[oó]n/i) };
      if (columnas.razon === -1) return { seccion: true, columnas: null, filas };
      continue;
    }
    const m = (c[0] ?? "").match(/ADR-(\d{4}|[A-Z][A-Z0-9]*-\d{3})/);
    if (!m) continue;
    filas.set(m[1], {
      estado: columnas.estado === -1 ? null : sinBacktick(c[columnas.estado]),
      razon: (c[columnas.razon] ?? "").trim(),
    });
  }
  if (!vistaLaSeccion) return null;
  return { seccion: true, columnas, filas };
}

function checkRegistroDeRetiradas(contenidoPorArchivo) {
  const retirados = [];
  for (const [rel, contenido] of contenidoPorArchivo) {
    // Misma exención que el resto: una plantilla se materializa en el satélite.
    if (esPlantilla(rel)) continue;
    if (!RE_ADR_ARCHIVO.test(basename(rel))) continue;
    const estado = estadoDeFrontMatter(contenido);
    if (estado === null || !ESTADOS_RETIRADOS.has(estado)) continue;
    retirados.push({ rel, id: basename(rel).match(RE_ADR_ARCHIVO)[1], estado });
  }
  // Sin ningún ADR retirado no hay nada que registrar. No es abstenerse: es que
  // el objeto de la regla no existe en este árbol.
  if (retirados.length === 0) return;

  const nombres = retirados.map((r) => `ADR-${r.id} (${r.estado})`).join(", ");
  const registro = contenidoPorArchivo.get(REGISTRO_DE_RETIRADAS);
  if (registro === undefined) {
    issues.push({
      file: REGISTRO_DE_RETIRADAS,
      kind: "REGISTRO_DE_RETIRADAS_AUSENTE",
      detail: `el árbol tiene ${retirados.length} ADR retirado(s) —${nombres}— y no hay \`${REGISTRO_DE_RETIRADAS}\` en la raíz donde conste su razón (S-31)`,
    });
    return;
  }

  const tabla = leerRegistroDeRetiradas(registro);
  if (tabla === null || tabla.columnas === null) {
    issues.push({
      file: REGISTRO_DE_RETIRADAS,
      kind: "REGISTRO_DE_RETIRADAS_SIN_TABLA",
      detail: tabla === null
        ? `no existe la sección «ADRs Retirados», y el árbol tiene ${retirados.length} ADR retirado(s): ${nombres} (S-31)`
        : "la sección «ADRs Retirados» no tiene una columna de razón que leer: su tabla no registra nada (S-31)",
    });
    return;
  }

  for (const r of retirados) {
    const fila = tabla.filas.get(r.id);
    if (!fila) {
      issues.push({
        file: r.rel,
        kind: "RETIRADA_SIN_REGISTRO",
        detail: `declara \`estado: ${r.estado}\` y no tiene fila en «ADRs Retirados» de \`${REGISTRO_DE_RETIRADAS}\`. `
          + "Quien consulte por qué dejó de regir no tiene dónde leerlo: retirar un ADR obliga a escribir la razón (S-31)",
      });
      continue;
    }
    if (!/\p{L}/u.test(fila.razon)) {
      issues.push({
        file: REGISTRO_DE_RETIRADAS,
        kind: "RETIRADA_SIN_RAZON",
        detail: `la fila de ADR-${r.id} está en «ADRs Retirados» con la casilla de razón vacía. Una fila sin razón registra el hecho y calla el porqué (S-31)`,
      });
      continue;
    }
    if (fila.estado && fila.estado !== r.estado) {
      issues.push({
        file: REGISTRO_DE_RETIRADAS,
        kind: "RETIRADA_CON_ESTADO_DISCREPANTE",
        detail: `«ADRs Retirados» dice que ADR-${r.id} está \`${fila.estado}\` y su front-matter dice \`${r.estado}\` (${r.rel}). El registro de la retirada no puede contradecir a la fuente del estado (S-31)`,
      });
    }
  }
}

// --- S-32: un contrato aceptado nombra lo que aún no lo sostiene ------------

/*
 * Diseñar el contrato ANTES que el servidor es legítimo y deliberado en este
 * estándar, y esta puerta no lo toca. El defecto no es que el ADR llegue antes
 * que el código: es que NADA OBLIGABA A DECIR QUE LLEGA ANTES, de modo que el
 * lector no distinguía «esto existe» de «esto se decidió y aún no existe».
 *
 * Ocurrió: ADR-0155 §2.3 fijó `Aceptado` que el servidor del Tablero rehidrata
 * el grafo desde el token, se escribió sin UMS desplegado contra el que
 * contrastarlo, y el consumidor se construyó obedeciendo esa descripción hasta
 * el 502 de G-279. Ese caso ya no vincula —ADR-0155 está `Supersedido`— pero la
 * clase sigue viva y medida: ADR-0157 está `Aceptado` y su §4.1 dice «UMS expone
 * `GET /.well-known/jwks.json`» en presente de indicativo, mientras G-278
 * —`Pendiente`, en este mismo árbol— registra que UMS firma HS256 y que publicar
 * el JWKS es la etapa E0 sin ejecutar (G-286).
 *
 * QUÉ DISPARA LA PUERTA: la MARCA, no el ADR. `sujeto_no_observado` ausente o
 * vacío NO SE JUZGA JAMÁS, exactamente igual que `supersede: []` en S-29, y por
 * la misma razón: son 162 ADR, 123 `Aceptado`, y desde este repositorio NO SE
 * PUEDE COMPROBAR si un servidor de otro repositorio existe. Una puerta que
 * exigiera la marca a todo ADR con un endpoint dentro acusaría a los 13 que hay
 * —GitHub existe, el Tablero está desplegado— y moriría desactivada
 * (ADR-0160 §1.4). La marca es VOLUNTARIA EN SU DISPARO y OBLIGATORIA EN SU
 * FORMA: quien la usa queda atado; quien no la usa no es acusado.
 *
 * Y por eso mismo se declara lo que la ausencia NO acredita: que un ADR no lleve
 * marca no prueba que su sujeto exista, solo que nadie ha declarado lo
 * contrario. Fingir lo primero sería afirmar sin medir sobre 123 ADR (SD-05).
 *
 * QUÉ SÍ SE COMPRUEBA, y las cuatro cosas están en el árbol:
 *   1. FORMA. Cada entrada nombra `sistema`, `afirmacion` y `verificacion`. Una
 *      marca que dice «esto no está verificado» sin decir QUÉ ni CONTRA QUÉ es
 *      una nota al margen, no una declaración.
 *   2. DOMICILIO. `verificacion` es exactamente una referencia `G-NNN`, nunca
 *      prosa libre — mismo criterio que `excepcionDeCableado` en el catálogo:
 *      un pendiente sin referencia es como se pierden los pendientes.
 *   3. CADUCIDAD. Ese gap existe en el `## Registro` de `GAPS.md` y sigue
 *      abierto. Si está `Cerrado`, la marca miente: o la verificación ocurrió
 *      —y entonces se retira la marca o se corrige la afirmación— o el gap se
 *      cerró sin cerrar lo que sostenía. Es lo que impide que la declaración se
 *      vuelva decorativa, que es como mueren las marcas.
 *   4. EL LECTOR. Si la marca no está vacía, el cuerpo lleva una línea
 *      `> Sujeto no observado:`. Toda la regla existe para quien lee el ADR, y
 *      quien lee un ADR no lee YAML. Es el mismo motivo por el que
 *      `validate-adr-status.mjs` cruza el front-matter con el badge y la prosa.
 *
 * LÍMITE DECLARADO, y es el central: esta puerta NO detecta al ADR que DEBIÓ
 * declarar y no declaró. No puede: su sujeto vive en otro repositorio y desde
 * aquí no es observable. Eso lo sostiene la revisión humana del pull request, y
 * se dice en vez de fingirlo (G-286 §3).
 */

/** El registro donde vive el pendiente que sostiene cada afirmación no observada. */
const REGISTRO_DE_GAPS = "GAPS.md";

/** El encabezado de la sección que aloja la tabla canónica de gaps (S-20). */
const RE_SECCION_REGISTRO_GAPS = /^##\s+Registro\s*$/i;

/** La forma de una referencia a gap. Cerrada a propósito: nunca prosa libre. */
const RE_REFERENCIA_GAP = /^G-\d{3,}$/;

/** Un gap que sigue sosteniendo algo. `Cerrado` no está aquí, y ese es el punto. */
const ESTADOS_GAP_ABIERTO = new Set(["Pendiente", "En curso"]);

/** Las tres claves que hacen de la marca una declaración y no una nota al margen. */
const CLAVES_SUJETO = ["sistema", "afirmacion", "verificacion"];

/*
 * ─────────────── S-40 — el censo desmiente al sujeto no observado ───────────────
 *
 * POR QUÉ EXISTE (G-286, ADR-0224)
 * --------------------------------
 * S-32 hace que la marca CADUQUE CON SU PENDIENTE: el `G-NNN` de `verificacion`
 * tiene que seguir abierto. Eso es lo que impide que la marca sobreviva a su
 * gap. Lo que NO comprueba —y se midió— es lo contrario: que la marca sobreviva
 * a su SUJETO. Si `unimar-xms` recibe código mañana, ADR-0097 sigue diciendo
 * «hoy está vacío» y nada lo desmiente, porque el único disparador es que una
 * persona cierre G-437. La marca no miente hacia el futuro: miente al revés.
 *
 * La asimetría medida el 2026-08-10, con las dos mitades y su cifra: se PUEDE
 * declarar que el sujeto no existe —2 ADR de 191 lo hacen, ADR-0157 desde el
 * 2026-08-08 y ADR-0097 desde el 2026-08-10—, pero NADA OBLIGA A DECLARARLO y
 * NADA AVISA CUANDO EL SUJETO APARECE. Esta regla cierra la segunda mitad. La
 * primera se midió y no se sostiene: ver el límite declarado al final.
 *
 * DE DÓNDE SALE EL HECHO, Y POR QUÉ ESTE Y NO OTRO
 * -----------------------------------------------
 * Del censo de repositorios (ADR-0186), que ya es normativo, ya declara `vacio`
 * como campo MEDIDO —`--censar` lo recalcula con `size === 0`— y ya CADUCA a los
 * 45 días con el CI en rojo. La cadena que hace que el aviso llegue solo está
 * cableada de antes y no la inventa esta regla: el censo vence, `docs.yml`
 * rompe, alguien recensa, `vacio` cambia, y esta puerta se entera. Es el mismo
 * argumento con que ADR-0196 hizo caducar la vigencia declarada.
 *
 * LA CUARTA CLAVE: `hecho`, VOCABULARIO CERRADO Y DESMENTIBLE
 * ----------------------------------------------------------
 * La marca declara EN QUÉ HECHO DEL CENSO se apoya, y los tres valores son los
 * únicos que el censo puede desmentir sin red y sin adivinar:
 *
 *   · `repositorio-vacio`       el censo lista ese repositorio con `vacio: true`.
 *                               Es el caso de ADR-0097 / `unimar-xms`. El día que
 *                               el censo lo dé por no vacío, ROMPE: el sujeto
 *                               apareció y la afirmación hay que remedirla.
 *   · `repositorio-inexistente` el `sistema` NO figura en el censo. Es el caso
 *                               de `unimar-mms` y `unimar-sil`, que responden 404
 *                               (G-381). Si aparece en el censo, ROMPE.
 *   · `conducta-del-sistema`    el repositorio existe y tiene código; lo no
 *                               observado es una CONDUCTA suya. Es el caso de
 *                               ADR-0157: `unimar-ums` existe y no publica su
 *                               JWKS. El censo NO ve conductas y se dice en vez
 *                               de fingirlo: esta marca la vigila solo su gap.
 *
 * Y esa tercera salida no es gratis ni es la casilla que todos marcan: si el
 * censo declara VACÍO al repositorio que ella dice tener código, ROMPE — eligió
 * la opción ciega teniendo una censable. Mismo precio con que S-36 evitó que
 * `ninguna` fuera la casilla por defecto.
 *
 * QUÉ NO SE PUDO HACER, Y SE MIDIÓ ANTES DE DESCARTARLO (G-462)
 * ------------------------------------------------------------
 * La mitad simétrica —OBLIGAR a declarar, es decir detectar al ADR que nombra un
 * sistema que no existe y calla— se implementó como puerta léxica y se ejecutó
 * el 2026-08-10 sobre los 191 ADR del árbol: cruzando las diez siglas sin sujeto
 * del censo con verbos normativos, acusó a 5 de los 136 `Aceptado`, de los cuales
 * UNO ya declaraba (ADR-0097, que cumple), UNO era cierto (ADR-0163) y TRES eran
 * falsos —ADR-0098 narra en una celda de trazabilidad, ADR-0099 habla del tren de
 * release de DT/TMS/WMS y ADR-0132 reparte un RACI—. Precisión 1 de 5. No entra:
 * es la misma adivinación que S-38 ya descartó con 33 acusados y 10 ciertos, y
 * una puerta que acusa a quien cumple termina desactivada (ADR-0160 §1.4).
 *
 * DÓNDE SE ABSTIENE, Y POR QUÉ NO ES INDULGENCIA
 * ---------------------------------------------
 * El censo vive en `reference/governance/censo-repositorios.json` y el manifiesto
 * lo declara `externo`: NO VIAJA al satélite. Sin censo no hay hecho que
 * contrastar, así que en un satélite esta regla se abstiene ENTERA y la marca se
 * sigue juzgando por S-32, que sí vale allí. Es la misma abstención con que S-35
 * exime su ola 1 donde no existe `.harness/rules/` (S-16): sin objeto no hay
 * regla, y fingir la puerta allí sería confianza falsa.
 *
 * LÍMITES DECLARADOS
 * ------------------
 *   1. `vacio` no es «el sujeto sostiene la afirmación»: es «hay ficheros». Un
 *      repositorio con un README pasa a no vacío sin implementar nada. Por eso
 *      lo que la puerta exige al romper es REMEDIR, no retirar la marca.
 *   2. El aviso tarda lo que tarde el recenso. `--censar` necesita credencial de
 *      organización y es acto del autor (ADR-0186 §3); la caducidad de 45 días es
 *      la cota superior de ese retraso, no cero.
 *   3. `conducta-del-sistema` no se puede comprobar, solo desmentir en un caso.
 *      Igual que S-37 no puede desmentir `estandar`.
 */

/** El censo que dice qué existe. `externo` en el manifiesto: no viaja al satélite. */
const CENSO_DE_REPOSITORIOS = "reference/governance/censo-repositorios.json";

/**
 * Los tres hechos que el censo puede desmentir. Cerrado a propósito, como el
 * `G-NNN` de `verificacion`: un hecho en prosa libre no lo desmiente nadie.
 */
const HECHOS_DEL_CENSO = new Set(["repositorio-vacio", "repositorio-inexistente", "conducta-del-sistema"]);

/**
 * Lee el censo desde la raíz del repositorio validado.
 *
 * Devuelve `null` cuando no existe —el caso de todo satélite, donde la regla se
 * abstiene entera— y `{ error }` cuando existe y no se puede leer, que no es lo
 * mismo y no se confunde: un censo ilegible no absuelve a nadie.
 */
function leerCensoDeRepositorios() {
  const ruta = resolve(REPO_ROOT, CENSO_DE_REPOSITORIOS);
  if (!existsSync(ruta)) return null;
  try {
    const datos = JSON.parse(readFileSync(ruta, "utf-8"));
    const repos = new Map();
    for (const r of datos.repositorios ?? []) {
      if (typeof r?.repositorio === "string") repos.set(r.repositorio, r);
    }
    return { repos };
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Contrasta cada marca contra el censo (S-40). Recibe las marcas ya leídas por
 * `checkSujetoNoObservado`, porque el front-matter se parsea UNA vez: dos
 * lectores del mismo campo derivan, y es el defecto que `lib/suite.mjs` existe
 * para no repetir.
 */
function checkSujetoContraCenso(marcados) {
  // La FORMA del `hecho` se juzga siempre que esté escrito, haya censo o no: un
  // valor fuera del vocabulario no declara nada en ningún árbol.
  for (const m of marcados) {
    for (const [n, e] of m.entradas.entries()) {
      const hecho = (e.hecho ?? "").trim();
      if (hecho !== "" && !HECHOS_DEL_CENSO.has(hecho)) {
        issues.push({
          file: m.rel,
          kind: "SUJETO_NO_OBSERVADO_HECHO_DESCONOCIDO",
          detail: `la entrada #${n + 1} declara \`hecho: ${hecho}\`, que no es ninguno de `
            + `${[...HECHOS_DEL_CENSO].map((h) => `\`${h}\``).join(", ")}. `
            + "El hecho se elige de un vocabulario cerrado porque el censo tiene que poder desmentirlo (S-40)",
        });
      }
    }
  }

  const censo = leerCensoDeRepositorios();
  // Sin censo no hay hecho que contrastar: la regla se abstiene ENTERA, y la
  // marca la sigue juzgando S-32. Es el caso de todo satélite (ADR-0224 §4).
  if (censo === null) return;
  if (censo.error !== undefined) {
    issues.push({
      file: CENSO_DE_REPOSITORIOS,
      kind: "CENSO_DE_REPOSITORIOS_ILEGIBLE",
      detail: `${marcados.length} ADR domicilian su sujeto no observado en este censo y no se puede leer: ${censo.error} (S-40)`,
    });
    return;
  }

  for (const m of marcados) {
    for (const [n, e] of m.entradas.entries()) {
      const hecho = (e.hecho ?? "").trim();
      if (hecho === "") {
        issues.push({
          file: m.rel,
          kind: "SUJETO_NO_OBSERVADO_SIN_HECHO",
          detail: `la entrada #${n + 1} no declara \`hecho:\`. Con censo en el árbol, la marca dice en qué hecho `
            + "medible se apoya, o nadie se entera el día que el sujeto aparezca (S-40)",
        });
        continue;
      }
      if (!HECHOS_DEL_CENSO.has(hecho)) continue; // ya acusado por forma
      const sistema = (e.sistema ?? "").trim();
      const ficha = censo.repos.get(sistema);

      if (hecho === "repositorio-vacio") {
        if (ficha === undefined) {
          issues.push({
            file: m.rel,
            kind: "SUJETO_NO_OBSERVADO_SIN_CENSO",
            detail: `la entrada #${n + 1} declara \`hecho: repositorio-vacio\` sobre \`${sistema}\`, que no figura en `
              + `\`${CENSO_DE_REPOSITORIOS}\`. O el nombre no es el del repositorio, o el hecho es `
              + "`repositorio-inexistente` y hay que decirlo (S-40, ADR-0186)",
          });
        } else if (ficha.vacio !== true) {
          issues.push({
            file: m.rel,
            kind: "SUJETO_NO_OBSERVADO_APARECIO",
            detail: `declara que \`${sistema}\` está vacío y \`${CENSO_DE_REPOSITORIOS}\` lo da por NO vacío. `
              + "El sujeto apareció: hay que remedir la afirmación —si ya se observa, se retira la marca y se cierra su gap; "
              + "si sigue sin observarse, la marca dice por qué con otro `hecho` (S-40)",
          });
        }
        continue;
      }

      if (hecho === "repositorio-inexistente") {
        if (ficha !== undefined) {
          issues.push({
            file: m.rel,
            kind: "SUJETO_NO_OBSERVADO_CENSADO",
            detail: `declara que \`${sistema}\` no existe y el censo lo lista${ficha.vacio === true ? " (vacío)" : ""}. `
              + "El sujeto apareció: o el hecho es `repositorio-vacio`, o el repositorio ya tiene código y la afirmación se remide (S-40)",
          });
        }
        continue;
      }

      // `conducta-del-sistema`: el censo no ve conductas, y solo puede
      // desmentir la premisa de que el sujeto tiene código.
      if (ficha !== undefined && ficha.vacio === true) {
        issues.push({
          file: m.rel,
          kind: "SUJETO_NO_OBSERVADO_CENSABLE",
          detail: `declara \`hecho: conducta-del-sistema\` sobre \`${sistema}\`, y el censo lo da por VACÍO. `
            + "La opción que el censo no puede vigilar se reserva a los sujetos que sí tienen código: aquí el hecho es "
            + "`repositorio-vacio` y sí se puede vigilar (S-40)",
        });
      }
    }
  }
}

/**
 * La línea de prosa con que la marca llega a quien no lee front-matter. Se
 * juzga sobre la línea SIN tipografía —negritas, cursivas, el paréntesis con
 * que se cita la regla—, porque eso es adorno y no semántica: mismo criterio
 * que `marcaDeCelda` usa con las marcas de obligatoriedad en S-30.
 */
const RE_PROSA_SUJETO = /^Sujeto no observado\s*(?:\([^)\n]*\))?\s*:\s*\S/u;

function declaraSujetoEnProsa(contenido) {
  return contenido.split("\n").some((linea) => {
    if (!linea.trimStart().startsWith(">")) return false;
    const limpia = linea.trimStart().replace(/^>+/, "").replace(/[*_]/g, "").trim();
    return RE_PROSA_SUJETO.test(limpia);
  });
}

/**
 * Lee `sujeto_no_observado:` del front-matter.
 *
 * Devuelve `null` si el campo no está —que no es un hallazgo: es el caso normal
 * de 123 ADR `Aceptado`—, y si está, la lista de entradas más los defectos de
 * forma que encontró. NO es un YAML completo y no pretende serlo: cubre la
 * secuencia en bloque de mapas de un nivel, que es la única forma que la regla
 * admite. Mismo criterio que `lib/suite.mjs`: lo que exceda el subconjunto
 * pertenece a una dependencia de YAML, no a un regex.
 */
function leerSujetoNoObservado(contenido) {
  const fm = contenido.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const lineas = fm[1].split(/\r?\n/);
  const i = lineas.findIndex((l) => /^sujeto_no_observado:/.test(l));
  if (i === -1) return null;

  // Forma en flujo: la única admitida es la lista vacía, que no se juzga.
  const enLinea = lineas[i].slice("sujeto_no_observado:".length).trim();
  if (enLinea === "[]" || enLinea === "") {
    if (enLinea === "[]") return { entradas: [], defectos: [] };
  } else {
    return { entradas: [], defectos: [`el campo se declara en línea (\`${enLinea}\`) y la única forma admitida es \`[]\` o una secuencia en bloque`] };
  }

  const entradas = [];
  const defectos = [];
  for (let j = i + 1; j < lineas.length; j += 1) {
    const linea = lineas[j];
    if (/^\S/.test(linea)) break; // otra clave de primer nivel: la lista terminó
    if (!linea.trim()) continue;
    const abre = linea.match(/^\s*-\s+(\w+):\s*(.*)$/);
    if (abre) {
      entradas.push({ [abre[1]]: abre[2].trim().replace(/^["']|["']$/g, "") });
      continue;
    }
    const sigue = linea.match(/^\s+(\w+):\s*(.*)$/);
    if (sigue && entradas.length > 0) {
      entradas[entradas.length - 1][sigue[1]] = sigue[2].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    defectos.push(`la línea \`${linea.trim()}\` no es una entrada \`- clave: valor\` de la secuencia`);
  }
  if (entradas.length === 0 && defectos.length === 0) {
    defectos.push("el campo se declara y no lleva ninguna entrada: o se enumera lo no observado, o se escribe `[]`");
  }
  return { entradas, defectos };
}

/**
 * Lee el estado de cada gap del `## Registro` de `GAPS.md`. Devuelve `null` si la
 * sección o su tabla no existen —que es un hallazgo cuando alguien domicilia ahí
 * un pendiente— y un `Map` id → estado si sí.
 *
 * Los índices de columna se DERIVAN del encabezado, igual que en S-31: la tabla
 * la reordena `validate-gaps.mjs --fix` y una columna que se mueva no debe
 * convertir la puerta en un generador de acusaciones falsas.
 */
function leerEstadosDeGaps(contenido) {
  let dentro = false;
  let vistaLaSeccion = false;
  let columnas = null;
  const estados = new Map();

  for (const linea of contenido.split("\n")) {
    if (/^##\s/.test(linea)) {
      if (dentro) break;
      dentro = RE_SECCION_REGISTRO_GAPS.test(linea.trim());
      vistaLaSeccion ||= dentro;
      continue;
    }
    if (!dentro || !linea.trim().startsWith("|")) continue;
    const c = celdas(linea);
    if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue;
    if (columnas === null) {
      const busca = (re) => c.findIndex((x) => re.test(x.trim()));
      columnas = { id: busca(/^id$/i), estado: busca(/^estado$/i) };
      if (columnas.id === -1 || columnas.estado === -1) return { columnas: null, estados };
      continue;
    }
    const m = (c[columnas.id] ?? "").match(/G-\d{3,}/);
    if (!m) continue;
    estados.set(m[0], sinBacktick(c[columnas.estado]));
  }
  if (!vistaLaSeccion) return null;
  return { columnas, estados };
}

function checkSujetoNoObservado(contenidoPorArchivo) {
  const marcados = [];
  for (const [rel, contenido] of contenidoPorArchivo) {
    // Misma exención que el resto: una plantilla se materializa en el satélite.
    if (esPlantilla(rel)) continue;
    if (!RE_ADR_ARCHIVO.test(basename(rel))) continue;
    const marca = leerSujetoNoObservado(contenido);
    if (marca === null) continue; // el campo no está: el caso normal, no se juzga
    for (const d of marca.defectos) {
      issues.push({ file: rel, kind: "SUJETO_NO_OBSERVADO_MAL_FORMADO", detail: `${d} (S-32)` });
    }
    if (marca.entradas.length === 0) continue; // `[]` no se juzga jamás, como `supersede: []`
    marcados.push({ rel, entradas: marca.entradas, contenido });
  }
  if (marcados.length === 0) return;

  // S-40 va aquí y no en un script aparte: el objeto es EL MISMO front-matter ya
  // leído. Dos lectores de `sujeto_no_observado` derivarían, y entonces una
  // puerta juzgaría una marca que la otra no ve — que es el defecto que
  // `lib/suite.mjs` existe para no repetir (ADR-0224 §4.4).
  checkSujetoContraCenso(marcados);

  for (const m of marcados) {
    if (!declaraSujetoEnProsa(m.contenido)) {
      issues.push({
        file: m.rel,
        kind: "SUJETO_NO_OBSERVADO_SIN_PROSA",
        detail: "declara `sujeto_no_observado` en el front-matter y no lo dice donde un humano lo lee: "
          + "falta la línea `> Sujeto no observado: …` en el cuerpo. Quien consulta el ADR no lee YAML (S-32)",
      });
    }
    for (const [n, e] of m.entradas.entries()) {
      const faltan = CLAVES_SUJETO.filter((k) => !/\p{L}|\d/u.test(e[k] ?? ""));
      if (faltan.length > 0) {
        issues.push({
          file: m.rel,
          kind: "SUJETO_NO_OBSERVADO_INCOMPLETO",
          detail: `la entrada #${n + 1} de \`sujeto_no_observado\` no declara ${faltan.map((k) => `\`${k}\``).join(", ")}. `
            + "Una marca que no dice qué sistema, qué afirmación y qué pendiente la sostiene no declara nada (S-32)",
        });
        continue;
      }
      if (!RE_REFERENCIA_GAP.test(e.verificacion)) {
        issues.push({
          file: m.rel,
          kind: "SUJETO_NO_OBSERVADO_SIN_DOMICILIO",
          detail: `la entrada #${n + 1} pone \`verificacion: ${e.verificacion}\`, que no es una referencia \`G-NNN\`. `
            + "El pendiente se domicilia en el registro con su identificador, nunca en prosa libre (S-32)",
        });
      }
    }
  }

  // Las referencias bien formadas se cruzan contra el registro. Va aparte porque
  // su unidad no es el ADR sino el ÁRBOL: hace falta `GAPS.md` de la raíz.
  const referencias = marcados.flatMap((m) =>
    m.entradas.filter((e) => RE_REFERENCIA_GAP.test(e.verificacion ?? "")).map((e) => ({ rel: m.rel, gap: e.verificacion })));
  if (referencias.length === 0) return;

  const registro = contenidoPorArchivo.get(REGISTRO_DE_GAPS);
  if (registro === undefined) {
    issues.push({
      file: REGISTRO_DE_GAPS,
      kind: "REGISTRO_DE_GAPS_AUSENTE",
      detail: `${referencias.length} afirmación(es) no observada(s) domicilian su verificación en \`${REGISTRO_DE_GAPS}\` y no hay registro en la raíz donde leerlas (S-32)`,
    });
    return;
  }
  const tabla = leerEstadosDeGaps(registro);
  if (tabla === null || tabla.columnas === null) {
    issues.push({
      file: REGISTRO_DE_GAPS,
      kind: "REGISTRO_DE_GAPS_SIN_TABLA",
      detail: tabla === null
        ? `no existe la sección «Registro», y ${referencias.length} afirmación(es) no observada(s) domicilian ahí su verificación (S-32)`
        : "la tabla de «Registro» no tiene columnas de ID y estado que leer: no registra ningún pendiente (S-32)",
    });
    return;
  }

  for (const r of referencias) {
    const estado = tabla.estados.get(r.gap);
    if (estado === undefined) {
      issues.push({
        file: r.rel,
        kind: "SUJETO_NO_OBSERVADO_SIN_PENDIENTE",
        detail: `domicilia su verificación en \`${r.gap}\` y ese gap no está en el «Registro» de \`${REGISTRO_DE_GAPS}\`. `
          + "Un pendiente sin ficha en el registro no lo sostiene nadie (S-32, S-20)",
      });
      continue;
    }
    if (!ESTADOS_GAP_ABIERTO.has(estado)) {
      issues.push({
        file: r.rel,
        kind: "SUJETO_NO_OBSERVADO_CADUCADO",
        detail: `declara una afirmación no observada sostenida por \`${r.gap}\`, que el registro da como \`${estado}\`. `
          + "O la verificación ocurrió —y entonces se retira la marca o se corrige la afirmación— o el gap se cerró "
          + "sin cerrar lo que sostenía. Una marca que sobrevive a su pendiente es decorativa (S-32)",
      });
    }
  }
}

/*
 * Repara los enlaces cuya ruta está mal pero cuyo destino existe en otro sitio.
 *
 * Se empareja por SUFIJO DE RUTA, no por nombre de archivo. La diferencia
 * importa: `../canonical-patterns/dotnet/README.md` es ambiguo por nombre —hay
 * docenas de README— pero su sufijo `canonical-patterns/dotnet/README.md`
 * identifica exactamente un archivo. Emparejar por nombre dejaba sin arreglar
 * justo los enlaces de directorio equivocado, que son la mayoría.
 *
 * Y SOLO se toca cuando el sufijo resuelve a UN único candidato. Si hay dos, no
 * se adivina: se reporta y lo arregla una persona. Un autofix que acierta el 90%
 * deja un 10% de enlaces apuntando al sitio equivocado con aspecto de correctos,
 * que es peor que estar roto: roto se ve, mal apuntado no.
 */
async function repararEnlaces(allFiles, todasLasRutas) {
  let reparados = 0;
  for (const { rel, content } of allFiles) {
    const dir = dirname(resolve(REPO_ROOT, rel));
    let nuevo = content;
    for (const crudo of new Set(destinosDe(content))) {
      const [rutaCruda, ancla] = crudo.split("#");
      if (!rutaCruda) continue;
      let ruta;
      try { ruta = decodeURIComponent(rutaCruda); } catch { continue; }
      if (existsSync(resolve(dir, ruta))) continue;

      // Sufijo significativo: sin `../`, `./` ni la barra inicial de una ruta
      // absoluta (que en Markdown de GitHub no resuelve al repo, y por eso falla).
      const sufijo = ruta.replace(/^(\.\.\/|\.\/)+/, "").replace(/^\/+/, "").replace(/\/+$/, "");
      if (!sufijo || !sufijo.includes(".")) continue;

      const candidatos = todasLasRutas.filter((f) => f === sufijo || f.endsWith("/" + sufijo));
      if (candidatos.length !== 1) continue;

      let correcta = relative(dir, resolve(REPO_ROOT, candidatos[0])).split("\\").join("/");
      if (!correcta.startsWith(".")) correcta = "./" + correcta;
      const destinoNuevo = ancla ? `${correcta}#${ancla}` : correcta;

      nuevo = nuevo.split(`](${crudo})`).join(`](${destinoNuevo})`);
      reparados += 1;
    }
    if (nuevo !== content) await writeFile(resolve(REPO_ROOT, rel), nuevo, "utf8");
  }
  return reparados;
}

async function main() {
  const arreglar = process.argv.includes("--fix");
  const allFiles = [];

  for await (const rel of walkMarkdown(REPO_ROOT)) {
    // Generado por terceros o por el propio estandar: no es autoria del repo que
    // se valida. `_bmad-output/` lo produce BMAD; `.estandar/` es el checkout
    // efimero del plugin que hace el CI de un satelite.
    //
    // `04-plantillas-artefactos/fuente/` ESTABA aqui, y no debia: son las
    // plantillas canonicas, las mas copiadas del corpus. La exclusion escondia
    // 49 palabras mutiladas ("Descripcin", "Aceptacin") que cada artefacto
    // heredaba al copiarlas. Lo que mas se copia es lo que mas hay que validar.
    if (
      rel.includes("node_modules/") ||
      rel.startsWith("_bmad/") ||
      rel.startsWith("_bmad-output/") ||
      rel.startsWith(".estandar/") ||
      rel.startsWith(".git/")
    ) {
      continue;
    }
    const fullPath = resolve(REPO_ROOT, rel);
    const content = await readFile(fullPath, "utf8");
    allFiles.push({ rel, content });

    checkEncoding(rel, content);
  }

  /*
   * SD-06 en dos pasadas: primero se sabe qué anclas ofrece cada documento y qué
   * nombres de archivo existen; solo entonces se puede juzgar un enlace. Una sola
   * pasada obligaría a leer el destino en cada enlace — 3.000 lecturas repetidas.
   */
  const anclasPorArchivo = new Map();
  for (const { rel, content } of allFiles) anclasPorArchivo.set(rel, anclasDe(content));

  if (arreglar) {
    /*
     * El índice de reparación incluye TODO el repositorio, no solo Markdown: los
     * documentos enlazan esquemas `.json`, prototipos `.html` e imágenes, y esos
     * enlaces se rompen igual. Indexar solo `.md` dejaba fuera precisamente los
     * destinos que nadie revisa.
     */
    const todasLasRutas = [];
    for await (const f of glob("**/*", { cwd: REPO_ROOT, withFileTypes: true })) {
      if (!f.isFile()) continue;
      const p = relative(REPO_ROOT, resolve(f.parentPath ?? f.path, f.name)).split("\\").join("/");
      if (p.includes("node_modules/") || p.startsWith(".git/") || p.startsWith("_bmad")
        || p.startsWith(".estandar/")) continue;
      todasLasRutas.push(p);
    }
    const n = await repararEnlaces(allFiles, todasLasRutas);
    console.log(`[validate-docs] --fix: ${n} enlace(s) reparado(s). Reejecuta sin --fix para verificar.`);
    process.exit(0);
  }

  const contenidoPorArchivo = new Map(allFiles.map(({ rel, content }) => [rel, content]));

  for (const { rel, content } of allFiles) {
    checkEnlaces(rel, content, anclasPorArchivo);
    checkMermaid(rel, content);
    checkRutasDeLectura(rel, content, contenidoPorArchivo);
    checkVigenciaDeCitas(rel, content, contenidoPorArchivo);
  }

  // Va fuera del bucle: su unidad no es el documento sino el ÁRBOL. La pregunta
  // —«¿todo ADR retirado tiene su razón escrita?»— necesita el inventario
  // completo y el registro de la raíz a la vez, y ninguno de los dos existe
  // dentro de una iteración por fichero.
  checkRegistroDeRetiradas(contenidoPorArchivo);

  // Misma razón: la marca vive en el ADR y el pendiente que la sostiene vive en
  // `GAPS.md`. Las dos mitades de la pregunta no coinciden en ningún fichero.
  checkSujetoNoObservado(contenidoPorArchivo);

  /*
   * Aquí estaba la detección de FS y US huérfanas. Se retiró con el resto de los
   * chequeos de cadena (G-172, ADR-0178): recorría `artifacts`, que se llenaba
   * solo con documentos que declararan `> **ID:**`, y ninguno lo hace. La
   * cadena la juzga ahora `validate-cadena-artefactos.mjs`, sobre el contrato
   * de metadato que los artefactos sí usan.
   */

  // Report
  if (issues.length === 0 && warnings.length === 0) {
    /*
     * La frase decía dos veces «toda retirada consta con su razón (S-31)» —una
     * en su sitio y otra pegada al final, de una fusión— y omitía S-40. Se
     * corrige aquí porque una línea de OK que enumera mal lo comprobado es la
     * misma confianza falsa que este script existe para no dar.
     */
    console.log("[validate-docs] OK — barrido de todos los .md: sin defectos de encoding, enlaces, anclas ni Mermaid, ninguna ruta de lectura encamina a una decisión retirada (S-30), toda retirada consta con su razón (S-31), toda marca `sujeto_no_observado` está bien formada y sigue viva frente a su pendiente (S-32) y frente al censo (S-40), y ninguna regla cita en silencio una decisión que no vincula (S-33).");
    process.exit(0);
  }

  let exitCode = 0;

  if (issues.length > 0) {
    exitCode = 1;
    console.error("[validate-docs] FAILED —", issues.length, "blocking issue(s):");
    for (const i of issues) {
      const detail = i.detail ? ` — ${i.detail}` : "";
      console.error(`  \u2716 ${i.file}: ${i.kind}${detail}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`[validate-docs] ${warnings.length} warning(s):`);
    for (const w of warnings) {
      const detail = w.detail ? ` — ${w.detail}` : "";
      console.log(`  \u26A0 ${w.file}: ${w.kind}${detail}`);
    }
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error("[validate-docs] error:", err);
  process.exit(1);
});
