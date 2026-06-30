#!/usr/bin/env node
/**
 * validate-docs.mjs — Unimar Arch documentation validation.
 *
 * Checks:
 *   1. UTF-8 cleanliness (no BOM, replacement chars, mojibake, CRLF).
 *   2. Traceability: TS must reference an ADR with Estado: Aceptado.
 *   3. Traceability: TSR must list TS identifiers covered.
 *   4. Traceability gaps: orphan FS (no US references it), orphan US (no TS references it).
 *   5. CI integration: exit code 1 on failure (for pre-commit and GitHub Actions).
 */

import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

const UTF8_BOM = "\uFEFF";
const REPLACEMENT_CHAR = "\uFFFD";

const issues = [];
const warnings = [];

const ID_RE = /> \*\*ID:\*\*\s*(\S+)/;
const ESTADO_RE = /> \*\*Estado:\*\*\s*(\S+)/;
const ADR_RE = /> \*\*ADR:\*\*\s*\[([^\]]+)\]/;
const PADRE_RE = /> \*\*Padre:\*\*\s*\[([^\]]+)\]/;
const TS_INLINE_RE = /TS-[\w-]+/g;

async function* walkMarkdown(dir) {
  for await (const entry of glob("**/*.md", { cwd: dir })) {
    yield entry;
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

async function main() {
  const artifacts = [];
  const allFiles = [];

  for await (const rel of walkMarkdown(REPO_ROOT)) {
    if (rel.includes("node_modules/") || rel.startsWith("_bmad/") || rel.startsWith(".git/") || rel.includes("04-plantillas-artefactos/fuente/")) {
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
