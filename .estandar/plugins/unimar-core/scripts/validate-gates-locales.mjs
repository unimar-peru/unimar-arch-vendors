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
 *   5. Formato de commits (commitlint), por configuración o por invocación real.
 *
 * El cableado se busca en los hooks **y en los scripts a los que delegan**: un
 * hook fino que llama a un orquestador (`scripts/verify-local.sh`) cablea el
 * gate igual que si lo escribiera en línea. Se busca en lo que esos scripts
 * **ejecutan**, no en lo que mencionan: un comentario no cablea nada, y darlo por
 * bueno convierte el aviso en un gate que miente (SD-05).
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

/*
 * Contenido de los hooks de `.husky/` **y de los scripts a los que delegan**.
 *
 * Un hook fino que invoca a un orquestador —`bash scripts/verify-local.sh
 * prepush`— es la forma que el propio ADR-0106 §2.1 describe, no una excepción.
 * Buscar el cableado solo dentro de `.husky/` daba en rojo a satélites que sí
 * ejecutan el gate, un nivel más abajo: el caso que lo levantó fue `unimar-ums`,
 * cuyo `npm audit` y `dotnet list --vulnerable` viven en `verify-local.sh`
 * (G-242 de ese satélite). Se sigue la delegación dos saltos —cuanto anida un
 * orquestador real— con un conjunto de visitados que corta los ciclos.
 */
function hooks() {
  const dir = join(RAIZ, '.husky');
  if (!existsSync(dir)) return '';
  const vistos = new Set();
  const leer = (p) => { try { return statSync(p).isFile() ? readFileSync(p, 'utf-8') : ''; } catch { return ''; } };
  // Rutas de script invocables citadas en el texto; `\b` evita que `.js` muerda `package.json`.
  const RUTA_RE = /(?:^|[\s"'(=])\.?\/?((?:[\w.-]+\/)*[\w.-]+\.(?:sh|bash|mjs|cjs|js)\b)/g;
  let out = '';
  const seguir = (texto, prof) => {
    if (prof > 2) return;
    for (const m of texto.matchAll(RUTA_RE)) {
      const rel = m[1];
      if (vistos.has(rel)) continue;
      vistos.add(rel);
      const contenido = existsSync(join(RAIZ, rel)) ? leer(join(RAIZ, rel)) : '';
      if (!contenido) continue;
      detalle(`hook → ${rel}`);
      out += contenido + '\n';
      seguir(contenido, prof + 1);
    }
  };
  for (const e of readdirSync(dir)) {
    const contenido = leer(join(dir, e));
    if (!contenido) continue;
    out += contenido + '\n';
    seguir(contenido, 1);
  }
  return out;
}
const HOOKS = hooks();

/*
 * Lo que los hooks EJECUTAN, sin lo que solo mencionan.
 *
 * Los gates se detectaban buscando el nombre de la herramienta en el texto
 * completo de los hooks, comentarios incluidos. Un comentario no ejecuta nada:
 * `# Ejemplo: npx commitlint --edit "$1"` daba el gate por cableado, y la
 * plantilla `husky-commit-msg.sh` que este mismo estandar reparte lleva
 * exactamente esa linea. El resultado era que todo satelite que materializaba la
 * plantilla pasaba el gate de formato de commits sin tener commitlint: el
 * validador leia su propia sugerencia y la tomaba por evidencia (SD-05).
 *
 * Se eliminan los comentarios de shell --un `#` a principio de linea o precedido
 * de espacio-- antes de buscar cualquier cableado. Es la regla del interprete, no
 * un analisis lexico completo: un `#` dentro de una cadena entrecomillada tambien
 * se corta. La asimetria es deliberada, porque los dos errores no cuestan igual:
 * perder un cableado real escrito dentro de una cadena degrada el gate a un aviso
 * ruidoso, mientras que aceptar un comentario lo convierte en un gate que miente.
 */
const HOOKS_EJEC = HOOKS
  .split('\n')
  .map((l) => l.replace(/(^|\s)#.*$/, '$1'))
  .join('\n');

/*
 * Búsqueda acotada de un archivo que cumpla `test`.
 *
 * La profundidad era 3, y con eso un monorepo real quedaba fuera de alcance:
 * `src/apps/<app>/<Proyecto>.Test/<Proyecto>.Test.csproj` está a cuatro, de modo
 * que en `unimar-ums` el gate de coverage salía «sin pruebas detectadas» —
 * infravalorar un gate presente es la misma ceguera que G-242, medida por la
 * forma del árbol en vez de por el hecho. Se sube a 6, que cubre la raíz de
 * fuente (ADR-0107) más tres niveles de proyecto, y se acota por dos vías que no
 * dependen del tamaño del repositorio: la lista de directorios que nunca
 * contienen fuente y un presupuesto de directorios visitados. La búsqueda corta
 * en cuanto acierta; el presupuesto solo lo consume la respuesta negativa.
 */
function existeArchivo(test, maxDepth = 6) {
  const IGNORAR = new Set([
    'node_modules', '.git', '_bmad', '_bmad-output', 'dist', 'build', 'coverage', '.estandar',
    'bin', 'obj', 'out', 'target', 'vendor', 'TestResults', '.next', '.nx', '.turbo',
    '.venv', 'venv', '__pycache__', '.gradle', 'Pods',
  ]);
  let presupuesto = 20000;
  const pila = [[RAIZ, 0]];
  while (pila.length && presupuesto-- > 0) {
    const [dir, prof] = pila.pop();
    let entradas;
    try { entradas = readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entradas) {
      if (e.isDirectory()) {
        if (prof < maxDepth && !IGNORAR.has(e.name) && !e.name.startsWith('.')) pila.push([join(dir, e.name), prof + 1]);
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
if (gitleaksConfig || /gitleaks/i.test(HOOKS_EJEC)) {
  pass('Escáner de secretos (gitleaks) configurado o cableado.');
} else {
  warn('Sin escáner de secretos local. Configura gitleaks (baseline `.gitleaks.toml`) y cablealo en un hook (ADR-0106 §2.1).');
}

// 3. Auditoría de dependencias, si hay manifiesto de paquetes.
const tienePackageJson = existeArchivo((n) => n === 'package.json');
const tieneDotnet = existeArchivo((n) => n.endsWith('.csproj') || n.endsWith('.sln') || n.endsWith('.slnx'));
if (tienePackageJson || tieneDotnet) {
  const auditCableado = /npm audit|pnpm audit|yarn audit|dotnet list .*--vulnerable|osv-scanner/i.test(HOOKS_EJEC);
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
  const umbral = /coverageThreshold|--collect-coverage|coverlet|Threshold|--coverage/i.test(HOOKS_EJEC)
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
/*
 * La mera existencia de `.husky/commit-msg` NO cuenta. El hook `commit-msg` que
 * reparte este estandar comprueba las referencias del mensaje (SD-02), que es
 * otra cosa que su formato: un satelite podia tenerlo y aceptar igualmente
 * cualquier mensaje. Se exige la evidencia real: un archivo de configuracion de
 * commitlint, o una invocacion suya en lo que los hooks ejecutan.
 */
if (commitlintConfig || /commitlint/i.test(HOOKS_EJEC)) {
  pass('Formato de commits validado en local (commitlint).');
} else if (hay(join('.husky', 'commit-msg'))) {
  warn('Hay `.husky/commit-msg`, pero no valida el FORMATO del mensaje: el hook del estandar comprueba las referencias (SD-02), no Conventional Commits. Cablea commitlint en el (ADR-0106 §2.1).');
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
