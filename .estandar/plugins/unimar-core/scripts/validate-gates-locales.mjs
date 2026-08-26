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
 *   1. La puerta local del estándar instalada y ACTIVA, verificada delegando en
 *      `install-hooks.mjs --check`.
 *   2. Escáner de secretos (gitleaks) configurado o cableado en un hook.
 *   3. Auditoría de dependencias del stack (`npm audit` / `dotnet list
 *      --vulnerable`), cuando el repositorio declara un manifiesto de paquetes.
 *   4. Umbral de coverage, cuando hay pruebas.
 *   5. Formato de commits (commitlint), por configuración o por invocación real.
 *
 * NINGÚN NOMBRE DE HOOK SE ESCRIBE AQUÍ (G-354). El gate 1 comprobaba
 * `.husky/pre-commit` y el gate 5 mandaba «cablea commitlint en un hook
 * `commit-msg`»: dos hooks que ADR-0170 retiró, de modo que el satélite que
 * obedecía la norma vigente recibía dos avisos y, con `--strict`, quedaba
 * bloqueado. Una puerta que acusa a quien cumple termina desactivada
 * (ADR-0160 §1.4), y con ella se apagan los avisos verdaderos. Los nombres se
 * derivan hoy de las plantillas que el paquete reparte, vía `lib/hooks.mjs`,
 * que es la misma pieza que usa `install-hooks.mjs` desde G-349.
 *
 * Y EL GATE 1 NO SE REESCRIBE, SE DELEGA. Comprobar que existe un fichero es
 * justo lo que no prueba nada: `unimar_tms` tenía sus dos hooks en disco y
 * `core.hooksPath` sin configurar, así que git no ejecutaba ninguno (SD-05).
 * Quien sabe responder «¿corre la puerta en este clon?» es `install-hooks.mjs
 * --check`, que se lo pregunta a git. Se invoca y se adopta su veredicto: una
 * segunda implementación del mismo juicio sería la tercera lista que envejece.
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
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hooksDelEstandar, lista, SUFIJO_RETIRADO } from './lib/hooks.mjs';

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
 * Los hooks que el estándar define HOY, y los que retiró. No es un dato de este
 * fichero: sale de las plantillas que el paquete reparte (lib/hooks.mjs).
 *
 * Si no se puede derivar, este validador NO emite veredicto sobre el satélite y
 * sale 1 (SD-06). El defecto sería del paquete instalado, no del repositorio
 * juzgado, y convertirlo en un aviso contra el satélite repetiría el error que
 * G-354 corrige: acusar a quien no tiene nada que arreglar. Es además el mismo
 * trato que da `install-hooks.mjs`, que es el otro consumidor de la pieza.
 */
const ESTANDAR = hooksDelEstandar();
if (ESTANDAR.error) {
  console.error(`  ✘ No se puede saber qué hooks define el estándar: ${ESTANDAR.error} en ${ESTANDAR.dir}.`);
  console.error('    Esto es un defecto del paquete instalado, no de este repositorio, y por eso');
  console.error('    no se emite ningún veredicto sobre sus gates. Reinstala el estándar:');
  console.error('      claude plugin enable unimar-core@unimar');
  process.exit(1);
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
    /*
     * Un hook NEUTRALIZADO no cablea nada. `install-hooks.mjs` renombra a
     * `<hook>.retirado` los hooks que el estándar dejó de definir, y git no
     * invoca jamás ese nombre: su contenido es letra muerta. Leerlo como
     * cableado daría por presente un gate que no se ejecuta, que es la clase
     * de mentira que este validador ya corrigió para los comentarios (SD-05).
     */
    if (e.endsWith(SUFIJO_RETIRADO)) { detalle(`hook neutralizado, no cuenta: ${e}`); continue; }
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

/*
 * 1. La puerta local del estándar, instalada y ACTIVA.
 *
 * El veredicto no se calcula aquí: se le pide a `install-hooks.mjs --check`,
 * que es su ejecutor (S-12, ADR-0170) y el único que comprueba lo que importa
 * —que git ejecute de verdad ese directorio de hooks, y que ningún hook
 * retirado siga vivo—. Se adopta su salida tal cual, y sus líneas `✘` se
 * repiten como detalle para que el satélite lea el diagnóstico y no un
 * dictamen. Si el instalador no está junto a este validador, el defecto es del
 * paquete y se dice así, sin cargárselo al repositorio juzgado.
 */
const INSTALADOR = fileURLToPath(new URL('./install-hooks.mjs', import.meta.url));
if (!existsSync(INSTALADOR)) {
  warn(`El paquete del estándar no trae \`install-hooks.mjs\` junto a este validador (${INSTALADOR}), así que no se puede comprobar si la puerta local ${lista(ESTANDAR.activos)} corre. Es un defecto del paquete instalado, no de este repositorio.`);
} else {
  const r = spawnSync(process.execPath, [INSTALADOR, '--check'], { cwd: RAIZ, encoding: 'utf-8' });
  const salida = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  if (r.status === 0) {
    pass(`Puerta local ${lista(ESTANDAR.activos)} instalada y activa (verificado con \`install-hooks.mjs --check\`).`);
  } else {
    // Las rutas absolutas del instalador se acortan contra la raíz: el aviso lo
    // lee alguien que ya sabe en qué repositorio está.
    const motivos = salida.split('\n')
      .filter((l) => l.includes('✘'))
      .map((l) => l.replace(/^\s*✘\s*/, '').trim().split(RAIZ).join('.'));
    for (const m of motivos) detalle(`install-hooks --check: ${m}`);
    warn(
      `La puerta local ${lista(ESTANDAR.activos)} no corre en este clon: \`install-hooks.mjs --check\` sale ${r.status}`
      + `${motivos.length ? ` — ${motivos[0]}` : ''}`
      + `${motivos.length > 1 ? ` (y ${motivos.length - 1} motivo(s) más; ejecútalo para verlos)` : ''} `
      + 'Actívala con `node "$UNIMAR_CORE/scripts/install-hooks.mjs"` (S-12, ADR-0170). '
      + 'Un hook en disco no es evidencia de que la puerta corra: sin `core.hooksPath` git no ejecuta ninguno.',
    );
  }
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
 * La mera existencia de un hook de mensaje NO cuenta. El `commit-msg` que este
 * estandar repartia comprobaba las referencias del mensaje (SD-02), que es otra
 * cosa que su formato: un satelite podia tenerlo y aceptar igualmente cualquier
 * mensaje. Se exige la evidencia real: un archivo de configuracion de
 * commitlint, o una invocacion suya en lo que los hooks ejecutan.
 *
 * EL REMEDIO NOMBRA EL HOOK VIGENTE, NO UNO RETIRADO (G-354). Este aviso
 * mandaba «cablea commitlint en un hook `commit-msg`», y ADR-0170 retiro ese
 * hook: la unica forma de obedecer al validador era desobedecer a la norma.
 * El domicilio de commitlint es hoy el punto unico de control, sobre el rango
 * que el push publica, tal como lo declara la tabla de S-23.
 */
const HOOK_DEL_FORMATO = lista(ESTANDAR.activos);
const REMEDIO_COMMITLINT = `Cablealo en ${HOOK_DEL_FORMATO}, sobre el rango que el push publica `
  + '--`npx commitlint --from "$(git rev-parse @{push})" --to HEAD`-- y no en un hook por commit: '
  + 'el estandar tiene una sola puerta local (S-12, ADR-0170).';

const retiradosVivos = ESTANDAR.retirados.filter((h) => hay(join('.husky', h)));

if (commitlintConfig || /commitlint/i.test(HOOKS_EJEC)) {
  pass('Formato de commits validado en local (commitlint).');
} else if (retiradosVivos.length) {
  warn(
    `Hay ${lista(retiradosVivos)} en \`.husky/\`, y el estandar ya no define ese hook: ADR-0170 lo retiro en favor de ${HOOK_DEL_FORMATO}. `
    + 'Tampoco valida el FORMATO del mensaje --el hook que se repartia comprobaba las referencias (SD-02), no Conventional Commits--. '
    + `Sin commitlint no hay gate de formato. ${REMEDIO_COMMITLINT} `
    + 'Y neutraliza el hook retirado con `install-hooks.mjs`: git lo sigue ejecutando como segunda puerta.',
  );
} else {
  warn(`Sin validación de formato de commits (Conventional Commits, ADR-0106 §2.1). ${REMEDIO_COMMITLINT}`);
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
