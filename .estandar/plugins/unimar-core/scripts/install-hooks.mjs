#!/usr/bin/env node
/**
 * install-hooks.mjs — activa la puerta única de este clon: hoy, el hook
 * `pre-push`. Quién es «hoy» no lo decide este fichero, lo dicen las plantillas
 * que el paquete reparte (ver más abajo, G-349).
 *
 * Cierra el gap G-004. El hook vive en `.husky/`, pero git NO lo
 * ejecuta hasta que alguien apunta `core.hooksPath` ahí. Esa configuración es
 * por clon y no se versiona: git se niega, por diseño, a ejecutar nada que un
 * repositorio recién clonado traiga configurado. Es una defensa contra la
 * ejecución de código arbitrario al clonar, y no se puede ni se debe sortear.
 *
 * La consecuencia práctica es que el hook estaba inactivo en cualquier clon
 * nuevo, y la única pista era una línea en CONTRIBUTING.md que nadie lee dos
 * veces. Este script convierte esa línea en un comando.
 *
 * POR QUÉ `pre-push` Y NO `pre-commit` (ADR-0170). El estándar tiene un único
 * punto de control local y se ata al acto que tiene consecuencias. Un commit es
 * privado y reversible; un push es el primer instante en que el estado del
 * repositorio se convierte en una afirmación ante terceros. Este script pasó a
 * instalar y comprobar `pre-push`; mientras cableaba `pre-commit` habría
 * certificado como activa una puerta que el estándar ya no define.
 *
 * QUÉ COMPRUEBA `--check`, Y POR QUÉ NO BASTA CON MIRAR EL FICHERO. Un hook en
 * disco no es evidencia de que la puerta corra (SD-05): `unimar_tms` tenía sus
 * dos hooks materializados y `core.hooksPath` sin configurar, así que git no
 * ejecutaba ninguno. Un `--check` que solo mirase la existencia del archivo
 * repetiría ese engaño. Por eso la comprobación se le pregunta a git —
 * `git rev-parse --git-path hooks` devuelve el directorio de hooks EFECTIVO,
 * honrando `core.hooksPath`— y se compara por ruta real, no por cadena: una
 * ruta absoluta a `.husky` es una configuración válida y en uso, y rechazarla
 * sería un falso negativo tan mentiroso como el falso positivo que se corrige.
 *
 * DE DÓNDE SALE LA LISTA DE HOOKS, Y POR QUÉ NO DE UN LITERAL (G-349). Este
 * script no sabe cómo se llaman los hooks del estándar: lo deriva de las
 * plantillas que el paquete reparte, `templates/husky-<hook>.sh`, leídas junto
 * a este fichero. Mientras los nombres estuvieron cableados, retirar o añadir
 * una plantilla exigía acordarse de tocar el script, y acordarse no es un
 * control: así fue como el script cableaba `pre-commit` —tres literales para el
 * mismo hook— sin cubrir el `commit-msg` que la fuente ya usaba.
 *
 * La derivación vive en `lib/hooks.mjs` y no aquí desde G-354, porque el mismo
 * literal envejecido reapareció en `validate-gates-locales.mjs`, que exigía a
 * todo satélite el `pre-commit` que ADR-0170 retiraba. Dos scripts que
 * respondan por su cuenta «cuáles son los hooks del estándar» son dos listas
 * que se desincronizan: hay una sola, y los dos la leen.
 *
 * QUÉ HACE CON LOS HOOKS RETIRADOS. Un hook que el paquete NO reparte y que
 * puede hacer fallar una operación de git es un segundo punto de control, y el
 * estándar solo admite uno (ADR-0170 §2.3: «un hook que no puede hacer fallar
 * una operación de git no es un punto de control»; el criterio se enunció
 * general, para no discutirlo caso por caso). Esa resta —hooks bloqueantes de
 * git menos los que el paquete reparte— es la lista de retirados, y por eso
 * `post-commit` no aparece: corre en segundo plano y sale 0 siempre.
 *
 * Un clon que conserve un retirado lo seguiría ejecutando —está en el mismo
 * directorio y git lo invoca por nombre—, de modo que retirar la norma sin
 * retirar el fichero no retira nada. Este script los NEUTRALIZA renombrándolos
 * a `<hook>.retirado`, que git no invoca jamás.
 *
 * No los borra, y la razón es que el estándar ya no puede reconstruirlos: las
 * plantillas de las que salieron dejaron de publicarse, y un satélite pudo
 * haber encadenado su build, sus pruebas o sus gates de seguridad al final del
 * fichero. Destruir eso no es competencia de un instalador. Renombrar detiene
 * la ejecución —que es todo lo que la decisión exige— y deja el contenido a la
 * vista para fundirlo en `pre-push`, que es lo que la migración pide hacer.
 *
 * Uso:
 *   node <estandar>/scripts/install-hooks.mjs           # activa y retira lo viejo
 *   node <estandar>/scripts/install-hooks.mjs --check   # solo comprueba, no escribe
 *
 * Salida: 0 si la puerta queda (o ya estaba) activa y no hay hooks retirados
 * vivos; 1 si no.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, statSync, renameSync, chmodSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { hooksDelEstandar, lista, SUFIJO_RETIRADO } from './lib/hooks.mjs';

const CHECK = process.argv.includes('--check');
const RUTA = '.husky';

const errores = [];
const fail = (m, ...detalle) => errores.push([m, ...detalle]);

/*
 * Quiénes son los hooks del estándar y quiénes los retirados: lo dice
 * `lib/hooks.mjs` leyendo las plantillas del paquete. Aquí solo se decide qué
 * hacer cuando esa derivación no es posible, que en un instalador es salir 1:
 * certificar una puerta sin saber cuál es sería adivinar.
 */
const ESTANDAR = hooksDelEstandar();

if (ESTANDAR.error === 'SIN_DIRECTORIO') {
  console.error(`  ✘ No se encuentra el directorio de plantillas ${ESTANDAR.dir}.`);
  console.error('    Este script deriva de ahí qué hooks instala. Sin plantillas no puede saberlo,');
  console.error('    y adivinarlo sería volver al nombre cableado que G-349 retiró.');
  process.exit(1);
}

if (ESTANDAR.error === 'SIN_PLANTILLAS') {
  console.error(`  ✘ El paquete no reparte ninguna plantilla \`husky-<hook>.sh\` en ${ESTANDAR.dir}.`);
  console.error('    No hay puerta local que instalar. Si se retiró la última a propósito, la');
  console.error('    decisión debe retirar también S-12; si no, la publicación perdió la plantilla.');
  process.exit(1);
}

if (ESTANDAR.error === 'NO_BLOQUEAN') {
  console.error(`  ✘ El paquete reparte plantilla para ${ESTANDAR.noBloquean.join(', ')}, que no puede abortar ninguna operación de git.`);
  console.error('    Por ADR-0170 §2.3 eso no es un punto de control, y este instalador no lo certifica como puerta.');
  process.exit(1);
}

const ACTIVOS = ESTANDAR.activos;
const RETIRADOS = ESTANDAR.retirados;

console.log(`━━━ Punto único de control local: hook ${lista(ACTIVOS)} (S-12, G-004, ADR-0170) ━━━`);

let RAIZ = process.cwd();
const git = (args) => execFileSync('git', args, { cwd: RAIZ, encoding: 'utf-8' }).trim();

try {
  RAIZ = git(['rev-parse', '--show-toplevel']);
} catch {
  console.error('  ✘ Esto no es un repositorio git.');
  process.exit(1);
}

// --- 1. El hook existe y git puede ejecutarlo ---

for (const nombre of ACTIVOS) {
  const hook = join(RAIZ, RUTA, nombre);
  if (!existsSync(hook)) {
    fail(
      `No existe ${RUTA}/${nombre}.`,
      `Materialícelo: cp "$UNIMAR_CORE/templates/husky-${nombre}.sh" ${RUTA}/${nombre}`,
    );
  } else if (!(statSync(hook).mode & 0o111)) {
    // Un hook sin permiso de ejecución es un hook que git ignora en silencio.
    fail(`${RUTA}/${nombre} no es ejecutable.`, `Ejecute: chmod +x ${RUTA}/${nombre}`);
  }
}

// --- 2. Git ejecuta de verdad ese directorio ---
//
// La pregunta no es «¿qué dice core.hooksPath?» sino «¿qué directorio de hooks
// usa git aquí?». La segunda la responde git mismo y absorbe los tres casos:
// sin configurar (devuelve `.git/hooks`), configurado relativo, y configurado
// con ruta absoluta —que es válido y está en uso en un satélite—.

const mismaRuta = (a, b) => {
  try { return realpathSync(a) === realpathSync(b); } catch { return resolve(a) === resolve(b); }
};

let efectivo = '';
try { efectivo = resolve(RAIZ, git(['rev-parse', '--git-path', 'hooks'])); } catch { /* sin git */ }

let declarado = '';
try { declarado = git(['config', '--get', 'core.hooksPath']); } catch { /* no configurado */ }

const activo = efectivo !== '' && mismaRuta(efectivo, join(RAIZ, RUTA));

if (!activo) {
  if (CHECK) {
    fail(
      `core.hooksPath ${declarado ? `apunta a "${declarado}"` : 'no está configurado'}: git usa ${efectivo || '(desconocido)'} y ${ACTIVOS.length > 1 ? 'los hooks NO se ejecutan' : 'el hook NO se ejecuta'}.`,
      'Ejecute: node <estandar>/scripts/install-hooks.mjs',
    );
  } else if (errores.length === 0) {
    git(['config', 'core.hooksPath', RUTA]);
    console.log(`  ✔ core.hooksPath = ${RUTA}. La puerta ${lista(ACTIVOS)} queda activa en este clon.`);
    console.log('    git no puede hacerlo al clonar: ejecutar configuración versionada sería ejecutar código ajeno.');
  }
} else {
  console.log(`  ✔ git ejecuta ${RUTA}/ (core.hooksPath = "${declarado}"). La puerta ${lista(ACTIVOS)} está activa.`);
}

// --- 3. Ningún hook retirado sigue vivo ---
//
// Se miran los dos directorios que git podría estar usando: el del estándar y
// el efectivo, que en un clon sin configurar es `.git/hooks`. Un `pre-commit`
// dejado ahí seguiría corriendo aunque `.husky/` estuviera limpio.

const directorios = [join(RAIZ, RUTA)];
if (efectivo && !mismaRuta(efectivo, join(RAIZ, RUTA))) directorios.push(efectivo);

for (const dir of directorios) {
  for (const nombre of RETIRADOS) {
    const viejo = join(dir, nombre);
    if (!existsSync(viejo)) continue;

    if (CHECK) {
      fail(
        `${nombre} sigue instalado en ${dir}: el estándar ya no reparte su plantilla y git lo seguiría ejecutando como segunda puerta (ADR-0170 §2.3).`,
        'Ejecute: node <estandar>/scripts/install-hooks.mjs',
      );
      continue;
    }

    // Sin la puerta vigente en pie no se retira nada: dejar el clon sin ninguna
    // puerta sería peor que dejarlo con la puerta equivocada.
    if (errores.length) {
      console.error(`  ! ${nombre} sigue instalado en ${dir}, y no se retira: primero materialice ${ACTIVOS.map((h) => `${RUTA}/${h}`).join(' y ')}.`);
      continue;
    }

    const destino = `${viejo}${SUFIJO_RETIRADO}`;
    renameSync(viejo, destino);
    try { chmodSync(destino, 0o644); } catch { /* el permiso ya no importa: git no invoca ese nombre */ }
    console.log(`  ✔ ${nombre} neutralizado: ahora es ${nombre}${SUFIJO_RETIRADO} y git no lo invoca.`);
    console.log(`    Su contenido se conserva. Si encadenaba build, pruebas o gates propios, fúndelos en ${ACTIVOS.join(' o ')} y bórrelo.`);
  }
}

if (errores.length) {
  for (const [m, ...detalle] of errores) {
    console.error(`  ✘ ${m}`);
    for (const d of detalle) console.error(`    ${d}`);
  }
  process.exit(1);
}

if (!CHECK) console.log('    Recuerde versionar el cambio: git add -A .husky');
process.exit(0);
