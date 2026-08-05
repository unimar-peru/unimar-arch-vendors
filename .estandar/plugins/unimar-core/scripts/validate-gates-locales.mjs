#!/usr/bin/env node
/**
 * validate-gates-locales.mjs — los gates de calidad y seguridad viven en local.
 *
 * Hace aplicable a S-23 y realiza el validador que el [ADR-0106] propuso en su
 * §6. La decisión ya es vinculante: los controles de calidad y seguridad se
 * ejecutan en la máquina del desarrollador y en los git hooks, sin depender de
 * la cuota ni la disponibilidad de GitHub Actions (P-LOCAL-01). El caso que lo
 * motivó fue un satélite que, al agotarse la cuota de Actions, se quedó sin
 * poder validar seguridad: una postura que se apaga con el saldo mensual no es
 * una postura.
 *
 * Este validador comprueba que el satélite **declara y cablea** sus gates
 * locales. Es un AVISO por diseño (ADR-0106 §6: «aviso al inicio y gateable
 * cuando la adopción madure»): sin `--strict` sale 0 aunque falten gates, y su
 * salida se lee en el log. Con `--strict`, cada gate ausente que aplique al
 * stack bloquea.
 *
 * Deriva su objetivo del cwd, no de su ubicación: corre igual desde
 * `.harness/scripts/` que desde el caché del plugin.
 *
 * Gates (según el stack del satélite):
 *   1. Git hooks presentes (`.husky/pre-commit`).
 *   2. Escáner de secretos (gitleaks) configurado o cableado en un hook.
 *   3. Auditoría de dependencias del stack (`npm audit` / `dotnet list
 *      --vulnerable`), cuando el repositorio declara un manifiesto de paquetes.
 *   4. Umbral de coverage, cuando hay pruebas.
 *   5. Formato de commits (commitlint / hook `commit-msg`).
 *
 * Uso: node <estandar>/scripts/validate-gates-locales.mjs [--strict] [--verbose]
 * Salida: 0 (aviso) salvo con --strict y algún gate aplicable ausente.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const STRICT = process.argv.includes('--strict');
const VERBOSE = process.argv.includes('--verbose');

const avisos = [];
const ok = [];
const warn = (m) => avisos.push(m);
const pass = (m) => ok.push(m);
const detalle = (m) => { if (VERBOSE) console.log(`    · ${m}`); };

const hay = (rel) => existsSync(join(RAIZ, rel));
const leer = (rel) => { try { return readFileSync(join(RAIZ, rel), 'utf-8'); } catch { return ''; } };

console.log('━━━ Gates locales de calidad y seguridad (S-23 / ADR-0106) ━━━');

// La fuente autora el estándar; no es un satélite. Mismo criterio que el resto.
if (existsSync(join(RAIZ, '.harness', 'catalog.json'))) {
  console.log('  ✔ Este repositorio autora el estándar; no es un satélite. No aplica.');
  process.exit(0);
}

/** Contenido concatenado de los hooks de `.husky/`, para buscar cableados. */
function hooks() {
  const dir = join(RAIZ, '.husky');
  if (!existsSync(dir)) return '';
  let out = '';
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    try { if (statSync(p).isFile()) out += readFileSync(p, 'utf-8') + '\n'; } catch { /* ignore */ }
  }
  return out;
}
const HOOKS = hooks();

/** Búsqueda acotada (profundidad limitada) de un archivo que cumpla `test`. */
function existeArchivo(test, maxDepth = 3) {
  const IGNORAR = new Set(['node_modules', '.git', '_bmad', '_bmad-output', 'dist', 'build', 'coverage', '.estandar']);
  const pila = [[RAIZ, 0]];
  while (pila.length) {
    const [dir, prof] = pila.pop();
    let entradas;
    try { entradas = readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entradas) {
      if (e.isDirectory()) {
        if (prof < maxDepth && !IGNORAR.has(e.name)) pila.push([join(dir, e.name), prof + 1]);
      } else if (test(e.name)) {
        return true;
      }
    }
  }
  return false;
}

// 1. Git hooks presentes.
if (hay(join('.husky', 'pre-commit'))) {
  pass('Git hooks presentes (`.husky/pre-commit`).');
} else {
  warn('No hay `.husky/pre-commit`. Los gates locales necesitan hooks; actívalos con `install-hooks.mjs` y materializa el hook desde el plugin.');
}

// 2. Escáner de secretos (gitleaks).
const gitleaksConfig = hay('.gitleaks.toml') || hay('.gitleaksignore') || hay(join('.github', 'gitleaks.toml'));
if (gitleaksConfig || /gitleaks/i.test(HOOKS)) {
  pass('Escáner de secretos (gitleaks) configurado o cableado.');
} else {
  warn('Sin escáner de secretos local. Configura gitleaks (baseline `.gitleaks.toml`) y cablealo en un hook (ADR-0106 §2.1).');
}

// 3. Auditoría de dependencias, si hay manifiesto de paquetes.
const tienePackageJson = existeArchivo((n) => n === 'package.json');
const tieneDotnet = existeArchivo((n) => n.endsWith('.csproj') || n.endsWith('.sln') || n.endsWith('.slnx'));
if (tienePackageJson || tieneDotnet) {
  const auditCableado = /npm audit|pnpm audit|yarn audit|dotnet list .*--vulnerable|osv-scanner/i.test(HOOKS);
  if (auditCableado) {
    pass('Auditoría de dependencias cableada en un hook.');
  } else {
    const cmd = tieneDotnet ? '`dotnet list <sln> package --vulnerable`' : '`npm audit`';
    warn(`Hay manifiesto de paquetes pero no se cablea la auditoría de dependencias. Añade ${cmd} a un hook (ADR-0009, ADR-0106).`);
  }
} else {
  detalle('Sin manifiesto de paquetes detectado; auditoría de dependencias N/A.');
}

// 4. Umbral de coverage, si hay pruebas.
const tienePruebas = existeArchivo((n) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(n))
  || existeArchivo((n) => n.endsWith('.Tests.csproj') || n.endsWith('.Test.csproj'));
if (tienePruebas) {
  const umbral = /coverageThreshold|--collect-coverage|coverlet|Threshold|--coverage/i.test(HOOKS)
    || hay('.nycrc') || hay('.nycrc.json')
    || /coverageThreshold|coverage/i.test(leer('package.json'));
  if (umbral) {
    pass('Pruebas con umbral de coverage.');
  } else {
    warn('Hay pruebas pero no se detecta un umbral de coverage que falle por debajo. Declara el umbral (jest coverageThreshold, coverlet, etc.) (ADR-0018, ADR-0106).');
  }
} else {
  detalle('Sin pruebas detectadas; umbral de coverage N/A.');
}

// 5. Formato de commits (commitlint).
const commitlintConfig = ['commitlint.config.js', 'commitlint.config.mjs', 'commitlint.config.cjs', '.commitlintrc', '.commitlintrc.json', '.commitlintrc.js']
  .some((f) => hay(f));
if (commitlintConfig || hay(join('.husky', 'commit-msg')) || /commitlint/i.test(HOOKS)) {
  pass('Formato de commits validado en local (commitlint / hook `commit-msg`).');
} else {
  warn('Sin validación de formato de commits. Cablea commitlint en un hook `commit-msg` (Conventional Commits) (ADR-0106 §2.1).');
}

// Resumen.
for (const m of ok) detalle(m);
if (avisos.length) {
  for (const a of avisos) console.warn(`  ⚠ ${a}`);
  if (STRICT) {
    console.error(`\n  ${avisos.length} gate(s) local(es) ausente(s). --strict activo: bloquea.`);
    process.exit(1);
  }
  console.log(`\n  ${ok.length} gate(s) presente(s), ${avisos.length} por cablear (aviso; ADR-0106 §6: gateable cuando la adopción madure).`);
  process.exit(0);
}

console.log(`  ✔ ${ok.length} gate(s) local(es) presentes. La postura de seguridad no depende del proveedor (S-23).`);
process.exit(0);
