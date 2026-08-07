#!/usr/bin/env node
/**
 * validate-satellite-base.mjs
 *
 * Validador de cumplimiento para repositorios satélite de unimar_arch.
 * Verifica que los artefactos SDLC cumplan las reglas de herencia definidas
 * en .harness/rules/satellite-repo-rules.md
 *
 * Uso:
 *   node <estandar>/scripts/validate-satellite-base.mjs [--base <url>] [--verbose]
 *
 * Options:
 *   --base <url>  URL base de unimar_arch para validación de referencias (default: local)
 *   --verbose     Muestra detalle de cada verificación
 *   --fix         Intenta corregir automáticamente los problemas encontrados
 *   --report      Genera reporte JSON de compliance
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import { parse } from 'url';

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : null;

const VERBOSE = process.argv.includes('--verbose');
const FIX = process.argv.includes('--fix');
const REPORT = process.argv.includes('--report');

const RULES = {
  S02: { name: 'Formato Canónico', pattern: /##\s+\d+\.\s+\w+/, required: true },
  S03: { name: 'Diagrama Mermaid', pattern: /```mermaid/, required: true },
  S04: { name: 'Requisitos Técnicos', sections: ['3.', 'Bounded Context', 'Dependencias', 'Restricciones'], required: true },
  S05: { name: 'Actores y Stakeholders', sections: ['2.', 'Actor Principal', 'Actores Secundarios', 'Diagrama de Interacción'], required: true },
  S09: { name: 'Idioma Español', pattern: /^[^\n]*[à-ÿÀ-ÿ]+[^\n]*$/m, required: false },
  S10: { name: 'Referencias Relativas', patronProhibido: /\]\(\/[^)]*\.md[^)]*\)/, required: true },
  S11: { name: 'Badges Uniformados', pattern: /img\.shields\.io/, required: false },
  S13: { name: 'Historial de Cambios', sections: ['Historial de Cambios', 'Versión', 'Fecha', 'Autor'], required: false }
};

/*
 * S-04 y S-05 NO son reglas de todo artefacto. Su propio enunciado las acota:
 * «la seccion 3 de toda HISTORIA DE USUARIO» y «la seccion 2 de toda HISTORIA
 * DE USUARIO». Aplicarlas a un PRD le exigia «Bounded Context» y «Actor
 * Principal», secciones que su plantilla canonica no tiene ni debe tener -- y
 * eso ponia en rojo a las cinco plantillas del estandar contra su propio
 * validador, ademas de a los PRD reales del tablero (G-300).
 *
 * Verificado sobre las plantillas fuente: solo `historia-usuario` y `epica`
 * declaran las seis secciones; `prd` declara Restricciones, `historia-funcional`
 * Dependencias y `historia-tecnica` Bounded Context. La regla se aplica donde su
 * texto dice, no donde el nombre del fichero se parece.
 */
const ALCANCE_POR_REGLA = {
  S03: ['historia-funcional', 'epica'],
  S04: ['historia-usuario'],
  S05: ['historia-usuario'],
};
const rigeEn = (ruleId, tipo) => !ALCANCE_POR_REGLA[ruleId] || ALCANCE_POR_REGLA[ruleId].includes(tipo);

const ARTEFACT_TYPES = ['historia-funcional', 'historia-usuario', 'historia-tecnica', 'epica', 'prd'];

let totalFiles = 0;
let passedFiles = 0;
let failedFiles = 0;
let issues = [];

function log(message, type = 'info') {
  const prefix = {
    info: '  ℹ',
    ok: '  ✔',
    warn: '  ⚠',
    error: '  ✘',
    section: '━━━━━━━━━━━━━━━━'
  };
  console.log(`${prefix[type] || '  ·'} ${message}`);
}

/*
 * Directorios que no son autoria del repositorio que se valida. `_bmad` y
 * `_bmad-output` los genera BMAD, y `license` no contiene artefactos SDLC.
 * Exigirle a un PRD generado la tabla de navegacion de la plantilla canonica es
 * reportar un problema que su autor no escribio y no puede arreglar.
 */
const IGNORAR = new Set(['node_modules', '_bmad', '_bmad-output', 'license']);

/**
 * Un artefacto pre-creado por el alta del satelite y aun sin redactar.
 *
 * Se reconoce por los dos rastros que deja el andamiaje y que desaparecen en cuanto
 * alguien escribe el documento. Se exigen LOS DOS para no eximir a un documento real
 * que solo cite ADR-0149.
 */
function esAndamioDelAlta(contenido) {
  return contenido.includes('Generado por el alta:') && /B[oó]rrame y redact/i.test(contenido);
}

function getAllMdFiles(dir, baseDir = dir) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && !IGNORAR.has(entry.name)) {
          files.push(...getAllMdFiles(fullPath, baseDir));
        }
      } else if (extname(entry.name) === '.md') {
        files.push({
          path: fullPath,
          relative: relative(baseDir, fullPath)
        });
      }
    }
  } catch (e) {
    // Ignore permission errors
  }
  return files;
}

/*
 * El tipo debe aparecer como segmento del nombre, delimitado por guiones -- que
 * es como los nombra la taxonomia canonica: `prd-<slug>.es.md`,
 * `historia-usuario-<slug>.es.md`.
 *
 * Antes se buscaba como subcadena, y sobre la ruta completa. Asi,
 * `PREGUNTAS_PRD_PENDIENTES.md` -- unas notas de trabajo -- se validaba como si
 * fuera un PRD, y se le exigian actores, bounded context y diagrama Mermaid. Un
 * gate que acusa a quien no es reo termina desactivado (SD-06).
 */
function tipoDeArtefacto(filepath) {
  const nombre = basename(filepath).toLowerCase();
  return ARTEFACT_TYPES.find(type => new RegExp(`(^|-)${type}(-|\\.)`).test(nombre)) ?? null;
}

/*
 * Un ADR no es un artefacto SDLC, aunque su titulo hable de uno. `ADR-0151`
 * -- «...condicion-de-aprobacion-del-prd.es.md» -- se clasificaba como PRD por
 * terminar en `-prd.`, y se le exigian actores y bounded context. El corpus de
 * ADRs declara su naturaleza en front-matter (`adr:`), asi que se pregunta al
 * documento en vez de adivinar por el nombre.
 */
function declaraSerAdr(content) {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  return fm !== null && /^\s*adr\s*:/m.test(fm[1]);
}

function isPortadaFile(filepath) {
  const name = basename(filepath, '.md').toLowerCase();
  return name.startsWith('plantilla-') && !name.includes('fuente');
}

function isSourceOrExample(filepath) {
  const rel = filepath.toLowerCase();
  return rel.includes('/fuente/') || rel.includes('/ejemplos/');
}

function extractSections(content) {
  const sections = [];
  const regex = /^#{1,6}\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    sections.push(match[1].toLowerCase());
  }
  return sections;
}

function validateFile(file) {
  const content = readFileSync(file.path, 'utf-8');
  const fileIssues = [];

  if (!content || content.length === 0) {
    fileIssues.push({ rule: 'EMPTY', severity: 'high', message: 'Archivo vacío' });
    return fileIssues;
  }

  const bomCheck = content.charCodeAt(0) === 0xFEFF;
  if (bomCheck) {
    fileIssues.push({ rule: 'R-03', severity: 'high', message: 'BOM detectado en archivo' });
  }

  if (content.includes('\r\n')) {
    fileIssues.push({ rule: 'R-03', severity: 'medium', message: 'CRLF detectado (debe ser LF)' });
  }

  const sections = extractSections(content);
  const filename = basename(file.path, '.md');

  const isPortada = isPortadaFile(file.path);
  const isSourceEx = isSourceOrExample(file.path);

  const tipo = declaraSerAdr(content) ? null : tipoDeArtefacto(file.path);

  if (tipo) {
    if (VERBOSE) log(`${file.relative}`, 'section');

    for (const [ruleId, rule] of Object.entries(RULES)) {
      if (['S02', 'S03', 'S04', 'S05'].includes(ruleId) && isPortada) {
        continue;
      }

      /*
       * Andamio del alta (ADR-0149): el propio estandar pre-crea el artefacto en su ruta
       * canonica con un «borrame y redacta» y sin secciones numeradas, y luego este
       * validador se las exige. Es el mismo caso que la cabecera ya declara para `_bmad`
       * —«reportar un problema que su autor no escribio y no puede arreglar»—, salvo que
       * aqui el autor es el estandar. Se salta hasta que se redacte: en cuanto alguien
       * escriba dentro, los marcadores desaparecen con el y las reglas vuelven a regir.
       */
      if (['S02', 'S13'].includes(ruleId) && esAndamioDelAlta(content)) {
        continue;
      }
      if (!rigeEn(ruleId, tipo)) {
        continue;
      }

      /*
       * S-10 dice «los enlaces internos entre artefactos DEBEN SER rutas
       * relativas»: restringe como son los enlaces que hay, no exige que los
       * haya. El ejecutor pedia la PRESENCIA de un `](../`, asi que un ejemplo
       * autocontenido -- sin ningun enlace -- incumplia por no enlazar a nada.
       * Ahora se acusa lo que la regla prohibe: una ruta absoluta a un `.md`.
       *
       * LIMITE declarado: no detecta un enlace absoluto por URL de GitHub al
       * MISMO repositorio, que tambien deberia ser relativo. Distinguirlo exige
       * conocer el remoto, que este validador no lee.
       */
      if (rule.patronProhibido && rule.patronProhibido.test(content)) {
        if (rule.required) {
          fileIssues.push({
            rule: ruleId,
            severity: 'high',
            message: `${rule.name}: enlace absoluto a un documento del repositorio; debe ser ruta relativa`
          });
        }
      }

      if (rule.pattern && !rule.pattern.test(content)) {
        if (rule.required) {
          fileIssues.push({
            rule: ruleId,
            severity: 'high',
            message: `Falta: ${rule.name} (patrón no encontrado)`
          });
        }
      }

      if (rule.sections) {
        const missing = rule.sections.filter(s =>
          !content.toLowerCase().includes(s.toLowerCase())
        );
        if (missing.length > 0 && rule.required) {
          fileIssues.push({
            rule: ruleId,
            severity: 'high',
            message: `Falta sección: ${missing.join(', ')}`
          });
        }
      }
    }

    if (isSourceEx && ['historia-usuario', 'historia-funcional', 'historia-tecnica', 'epica'].includes(tipo) && !content.includes('```mermaid')) {
      fileIssues.push({
        rule: 'S03',
        severity: 'high',
        message: 'Falta diagrama Mermaid (obligatorio en historias y épicas)'
      });
    }

    const reqTechSection = content.toLowerCase().includes('requisitos técnicos');
    const boundedContext = content.toLowerCase().includes('bounded context');
    const dependencias = content.toLowerCase().includes('dependencias');

    if (isSourceEx && rigeEn('S04', tipo) && reqTechSection && (!boundedContext || !dependencias)) {
      fileIssues.push({
        rule: 'S04',
        severity: 'high',
        message: 'Sección 3 (Requisitos Técnicos) incompleta: falta Bounded Context o Dependencias'
      });
    }

    const actoresSection = content.toLowerCase().includes('actor principal');
    const actoresSec = content.toLowerCase().includes('actores secundarios');
    const diagramaInter = content.toLowerCase().includes('diagrama de interacción');

    if (isSourceEx && rigeEn('S05', tipo) && (!actoresSection || !actoresSec || !diagramaInter)) {
      fileIssues.push({
        rule: 'S05',
        severity: 'high',
        message: 'Falta sección 2 (Actores) incompleta: falta Actor Principal, Actores Secundarios o Diagrama de Interacción'
      });
    }

    const tableNav = content.includes('[Volver a tabla');
    const navigacion = content.toLowerCase().includes('tabla de navegación');

    if (!tableNav && !navigacion && !isPortada && !esAndamioDelAlta(content)) {
      fileIssues.push({
        rule: 'S02',
        severity: 'medium',
        message: 'Falta tabla de navegación'
      });
    }

    if (!content.includes('Historial de Cambios') && !esAndamioDelAlta(content)) {
      fileIssues.push({
        rule: 'S13',
        severity: 'low',
        message: 'Falta tabla de Historial de Cambios'
      });
    }
  }

  /*
   * `[^)]` incluye el salto de linea, asi que un `](../` sin cerrar en su
   * renglon --al citar el literal en documentacion, por ejemplo-- hacia que la
   * captura se comiera parrafos enteros hasta el siguiente parentesis; el
   * `.match(...)[1]` de dentro usa `.`, que NO cruza renglon, devolvia null y
   * el validador entero moria con un TypeError. Un gate que se cae no reporta
   * nada, que es peor que reportar mal (SD-06). Se acota la captura al renglon
   * y se guarda el nulo.
   */
  const relativeLinks = content.match(/\]\(\.\.\/[^)\n]+\)/g) || [];
  for (const link of relativeLinks) {
    const captura = link.match(/\]\(\.\.\/(.+)\)/);
    if (!captura) continue;
    const target = captura[1];
    const resolvedPath = join(file.path, '..', target);

    if (target.includes('unimar_arch') && BASE_URL) {
      const fullUrl = `${BASE_URL}/reference/governance/sdlc/04-plantillas-artefactos/${target.split('unimar_arch/')[1] || target}`;
      // Skip external validation for now
    }
  }

  return fileIssues;
}

function validateDirectory(dir) {
  log(`Validando directorio: ${dir}`, 'section');
  const files = getAllMdFiles(dir);

  log(`Archivos Markdown encontrados: ${files.length}`, 'info');

  for (const file of files) {
    totalFiles++;
    const fileIssues = validateFile(file);

    if (fileIssues.length === 0) {
      passedFiles++;
      if (VERBOSE) log(`${file.relative}`, 'ok');
    } else {
      failedFiles++;
      log(`${file.relative}`, 'error');
      for (const issue of fileIssues) {
        const severityIcon = issue.severity === 'high' ? '✘' : issue.severity === 'medium' ? '⚠' : '·';
        log(`  ${severityIcon} [${issue.rule}] ${issue.message}`, issue.severity === 'high' ? 'error' : 'warn');
        issues.push({
          file: file.relative,
          rule: issue.rule,
          severity: issue.severity,
          message: issue.message
        });
      }
    }
  }
}

function printSummary() {
  log('━━━━━━━━━━━━━━━━', 'section');
  log('RESUMEN DE VALIDACIÓN', 'section');
  log(`Total archivos: ${totalFiles}`, 'info');
  log(`Aprobados: ${passedFiles}`, passedFiles === totalFiles ? 'ok' : 'warn');
  log(`Con problemas: ${failedFiles}`, failedFiles > 0 ? 'error' : 'ok');

  if (issues.length > 0) {
    log('━━━━━━━━━━━━━━━━', 'section');
    log('PROBLEMAS DETECTADOS', 'error');

    const bySeverity = { high: [], medium: [], low: [] };
    for (const issue of issues) {
      bySeverity[issue.severity].push(issue);
    }

    for (const severity of ['high', 'medium', 'low']) {
      if (bySeverity[severity].length > 0) {
        log(`\n[${severity.toUpperCase()}] ${bySeverity[severity].length} problema(s)`, severity === 'high' ? 'error' : 'warn');
        for (const issue of bySeverity[severity]) {
          log(`  • ${issue.file}: [${issue.rule}] ${issue.message}`, 'info');
        }
      }
    }
  }

  log('━━━━━━━━━━━━━━━━', 'section');

  if (REPORT) {
    const reportPath = join(process.cwd(), 'validation-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      total: totalFiles,
      passed: passedFiles,
      failed: failedFiles,
      issues: issues
    };
    console.log(`\nReporte JSON: ${reportPath}`);
  }

  return failedFiles === 0;
}

const directory = process.cwd();
validateDirectory(directory);

const success = printSummary();
process.exit(success ? 0 : 1);