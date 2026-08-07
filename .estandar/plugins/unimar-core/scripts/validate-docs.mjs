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
 *   5. Trazabilidad: TS referencia un ADR con Estado: Aceptado.
 *   6. Trazabilidad: TSR lista los TS que cubre.
 *   7. Huecos de trazabilidad: FS huérfana (ninguna US la referencia), US huérfana.
 *   8. Integración CI: código de salida 1 si falla (pre-commit y GitHub Actions).
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
 */

import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { existsSync } from "node:fs";
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

const ID_RE = /> \*\*ID:\*\*\s*(\S+)/;
const ESTADO_RE = /> \*\*Estado:\*\*\s*(\S+)/;
const ADR_RE = /> \*\*ADR:\*\*\s*\[([^\]]+)\]/;
const PADRE_RE = /> \*\*Padre:\*\*\s*\[([^\]]+)\]/;
const TS_INLINE_RE = /TS-[\w-]+/g;

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
 */
const esPlantilla = (rel) => rel.startsWith(".harness/templates/");

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

function extractMetadata(content) {
  const meta = {};
  const lines = content.split("\n");
  for (const line of lines) {
    const idMatch = line.match(ID_RE);
    if (idMatch) meta.id = idMatch[1];
    const estadoMatch = line.match(ESTADO_RE);
    if (estadoMatch) meta.estado = estadoMatch[1];
    const adrMatch = line.match(ADR_RE);
    if (adrMatch) meta.adr = adrMatch[1];
    const padreMatch = line.match(PADRE_RE);
    if (padreMatch) meta.padre = padreMatch[1];
  }
  return meta;
}

function checkTSADR(rel, content, meta) {
  if (!meta.id || !meta.id.startsWith("TS-")) return;
  if (!meta.adr) {
    issues.push({ file: rel, kind: "TS_SIN_ADR", detail: `${meta.id} no declara > **ADR:**` });
    return;
  }
  if (!meta.estado || meta.estado !== "Aceptado") {
    issues.push({ file: rel, kind: "TS_ADR_NO_ACEPTADO", detail: `${meta.id} referencia ADR ${meta.adr} pero su Estado es "${meta.estado || "ausente"}"` });
  }
}

function checkTSRListaTS(rel, content, meta) {
  if (!meta.id || !meta.id.startsWith("TSR-")) return;
  const tsMatches = content.match(TS_INLINE_RE);
  if (!tsMatches || tsMatches.length === 0) {
    warnings.push({ file: rel, kind: "TSR_SIN_TS", detail: `${meta.id} no menciona ningún identificador TS-xxx en su contenido` });
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
  const artifacts = [];
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

    const meta = extractMetadata(content);
    if (meta.id) {
      artifacts.push({ rel, meta, content });
    }

    checkTSADR(rel, content, meta);
    checkTSRListaTS(rel, content, meta);
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

  for (const { rel, content } of allFiles) {
    checkEnlaces(rel, content, anclasPorArchivo);
    checkMermaid(rel, content);
  }

  // Gaps: detect orphan FS and US
  const fsIds = new Map();
  const usIds = new Map();
  const tsPadres = [];

  for (const { rel, meta, content } of artifacts) {
    if (meta.id.startsWith("FS-")) {
      fsIds.set(meta.id, rel);
    }
    if (meta.id.startsWith("US-")) {
      usIds.set(meta.id, rel);
      if (meta.padre) tsPadres.push({ child: meta.id, parent: meta.padre, type: "US" });
    }
    if (meta.id.startsWith("TS-")) {
      if (meta.padre) tsPadres.push({ child: meta.id, parent: meta.padre, type: "TS" });
    }
  }

  const usParents = new Set(tsPadres.filter(p => p.type === "US").map(p => p.parent));
  const tsParents = new Set(tsPadres.filter(p => p.type === "TS").map(p => p.parent));

  for (const [fsId, fsRel] of fsIds) {
    if (![...usParents].some(p => p === fsId)) {
      warnings.push({ file: fsRel, kind: "FS_SIN_US", detail: `${fsId} no es referenciado por ninguna US como padre` });
    }
  }
  for (const [usId, usRel] of usIds) {
    if (![...tsParents].some(p => p === usId)) {
      warnings.push({ file: usRel, kind: "US_SIN_TS", detail: `${usId} no es referenciado por ninguna TS como padre` });
    }
  }

  // Report
  if (issues.length === 0 && warnings.length === 0) {
    console.log("[validate-docs] OK — scanned all .md files, no encoding or traceability issues.");
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
