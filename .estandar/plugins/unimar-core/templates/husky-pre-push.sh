#!/usr/bin/env sh
# UNICO punto de control local del estandar Unimar en el satelite.
#
# Se dispara UNA VEZ POR PUSH, no una vez por commit, y sustituye a los hooks
# `pre-commit` y `commit-msg` que el estandar retira (ADR-0170).
#
# POR QUE EN EL PUSH Y NO EN EL COMMIT. La razon no es el coste: es a que acto
# se ata la puerta. Un commit es privado y reversible --se enmienda, se aplasta,
# se reordena, se descarta--, y el estado que deja puede no llegar a existir
# para nadie. Un push es el primer instante en que el estado del repositorio se
# convierte en una afirmacion ante terceros. Ademas, casi ningun validador mira
# el diff: recorren el ARBOL y juzgan el ESTADO, de modo que en una rama de N
# commits solo el veredicto N-esimo predice lo que dira el CI. Aqui la puerta
# local y el servidor juzgan el mismo objeto.
#
# EL MENSAJE DE COMMIT SE CUBRE AQUI, sin hook aparte. El rango por defecto de
# validate-trazabilidad.mjs es `HEAD --not --remotes`, y en `pre-push` --antes
# de que las referencias remotas se muevan-- ese rango es EXACTAMENTE la carga
# del push: se juzga el mensaje de cada commit que se va a publicar, y solo de
# esos. La propiedad que lo hace aceptable es que la puerta nunca puede
# dispararse sobre un commit ya publicado: si falla, el remedio existe y es
# `git rebase -i <base>` con `reword`, libre de conflictos por construccion.
#
# ESTA PUERTA NO MUTA EL ARBOL. El `pre-commit` que sustituye corria madurez y
# gaps con `--fix` y volvia a ponerlos en el indice; eso es un formateador, no
# una puerta, y solo tiene sentido mientras se esta formando un commit. Aqui los
# commits ya existen: mutar el arbol dejaria lo empujado distinto de lo que hay
# en disco. Los validadores corren en SOLO LECTURA y, si el registro esta
# desordenado, la puerta dice el remedio en vez de aplicarlo. El CI los invoca
# igual, sin `--fix`, asi que este fallo no es ruido: es el veredicto que el
# servidor va a dar.
#
#   Normalizar a mano, y despues commitear el resultado:
#     node "$UNIMAR_CORE/scripts/validate-madurez.mjs" --fix
#     node "$UNIMAR_CORE/scripts/validate-gaps.mjs" --fix
#
# El estandar NO vive en una copia local (.harness/): lo provee el plugin
# unimar-core de Claude Code. Este hook localiza los validadores en el cache de
# plugins, en la version instalada, y los ejecuta contra el cwd. En una maquina
# corporativa la version la fija managed settings (enabledPlugins).
#
# ACTIVACION -- una sola vez por clon:
#   node "$UNIMAR_CORE/scripts/install-hooks.mjs"
#
# El hook local NO es la garantia: se evade con `git push --no-verify`, y sin
# core.hooksPath ni siquiera existe --el fichero en disco no es evidencia de que
# la puerta corra: preguntaselo a `install-hooks.mjs --check`--. El limite de
# merge inevadible es el CI.
#
# Todos los pasos BLOQUEAN el push si fallan (set -e), salvo donde se indique.

set -e

# Localizar el estandar (plugin unimar-core) por lo que el cliente DECLARA haber
# instalado -- installed_plugins.json, entrada unimar-core@unimar, campo
# installPath (ADR-0169). NO por el orden de version del cache: los directorios
# del cache no se recogen nunca, y en cuanto la serie deja de ser monotona el
# numero mayor gana para siempre sobre la version realmente instalada. Node 24
# es requisito del estandar (ADR-0067); jq no lo es, y por eso no aparece aqui.
#
# El registro guarda UNA ENTRADA POR AMBITO, no una sola, y coger la primera es
# coger la de otro proyecto. Medido el 2026-08-25: con `unimar_arch` (1.82.0),
# `unimar-ums` (1.82.0) y `unimar_tms` (1.84.0) declarados en local mas el
# ambito de usuario en 1.89.0, el hook de `unimar-shells` --que no tiene entrada
# propia-- resolvia 1.82.0, la de `unimar_arch`. Su CI validaba con 1.89.0 y su
# pre-push con una version de doce dias antes, de modo que rechazaba una regla
# que el CI exige. El desajuste crece con cada proyecto que el equipo instale.
#
# Se elige, en este orden: la entrada de ESTE repositorio, la de ambito
# `user`, y solo si no hay ninguna, la primera que haya. Nunca la de un
# proyecto ajeno teniendo una propia o una global.
#
# La resolucion falla ruidosa (sale 1) si no hay nada declarado. Aqui se recoge
# a proposito ese fallo: el mensaje de abajo dice como instalarlo, y bajo set -e
# la asignacion abortaria el hook antes de imprimirlo.
UNIMAR_CORE=$(node -e '
  const { resolve } = require("path");
  const registro = process.env.HOME + "/.claude/plugins/installed_plugins.json";
  let entradas = [];
  try { entradas = require(registro).plugins?.["unimar-core@unimar"] ?? []; } catch {}
  const aqui = process.cwd();
  const entrada = entradas.find((e) => e.projectPath && resolve(e.projectPath) === aqui)
    ?? entradas.find((e) => e.scope === "user")
    ?? entradas[0];
  if (!entrada?.installPath) {
    console.error("unimar-core no esta instalado; ejecuta: claude plugin enable unimar-core@unimar");
    process.exit(1);
  }
  console.log(entrada.installPath);
' 2>/dev/null) || UNIMAR_CORE=""
if [ -z "$UNIMAR_CORE" ]; then
  echo "[husky] El estandar Unimar no esta instalado (plugin unimar-core)." >&2
  echo "        Ejecuta: claude plugin marketplace add unimar-peru/unimar-marketplace" >&2
  echo "                 claude plugin enable unimar-core@unimar" >&2
  exit 1
fi
echo "[husky] estandar: ${UNIMAR_CORE}"

# 1. Madurez y gaps (S-19, S-20). SIN --fix: la puerta comprueba, no normaliza.
#    El orden importa: validate-gaps deriva las dimensiones de la columna Dim.
#    de MADUREZ.md, asi que va despues. Si alguno falla por desorden o por
#    contadores que no cuadran, el propio validador imprime el comando --fix.
node "${UNIMAR_CORE}/scripts/validate-madurez.mjs"
node "${UNIMAR_CORE}/scripts/validate-gaps.mjs"

# 2. Cada casilla de madurez < 5 tiene su gap (S-19, S-20).
node "${UNIMAR_CORE}/scripts/validate-correspondencia.mjs"

# 3. Encoding, texto mutilado, enlaces y trazabilidad (S-09, S-10, SD-06).
node "${UNIMAR_CORE}/scripts/validate-docs.mjs"

# El pie de copyright no fecha (S-35, ADR-0196). La fecha llego al satelite por
# las plantillas del estandar, y el remedio es borrar una linea por documento:
# git ya posee la fecha del ultimo cambio, con autor y con diff.
node "${UNIMAR_CORE}/scripts/validate-vigencia.mjs"

# La senal declara cuanto dura y quien puede alterarla (S-36, ADR-0197). El
# bloque `retencion-senal` de DECISIONS.md se juzga entero SI esta; mientras la
# ola 2 no se arme, su ausencia se censa y no puede poner esto rojo (G-400).
node "${UNIMAR_CORE}/scripts/validate-retencion-senal.mjs"

# El analizador estatico se declara por runtime y su invocacion esta cableada
# (S-37, ADR-0210). El bloque `analisis-estatico` de DECISIONS.md se juzga
# entero SI esta; mientras la ola 2 no se arme, su ausencia se censa y no puede
# poner esto rojo (G-435).
node "${UNIMAR_CORE}/scripts/validate-analisis-estatico.mjs"

# El ambito de runtime de un ADR local se declara en su front-matter y la
# concrecion que promete existe (S-38, ADR-0213). La ola 1 no alcanza al
# satelite: sus ADR llevan identidad `ADR-<SIGLA>-NNN` (S-15). Aqui se censa, y
# solo se pone rojo quien declara el campo y contradice al disco.
node "${UNIMAR_CORE}/scripts/validate-ambito-runtime.mjs"

# El PRD y la historia tecnica declaran las secciones de su plantilla
# canonica (S-39, ADR-0223). Aqui la ola 1 no aplica --se corta por el
# repositorio: la fuente publica `.harness/catalog.json` y este no--, asi que
# el validador CENSA los artefactos de este arbol y no puede ponerse rojo
# hasta que su propietario arme la ola 2 (G-460). Sin PRD ni historia tecnica
# se ABSTIENE y lo dice: no emite el visto de conformidad.
node "${UNIMAR_CORE}/scripts/validate-secciones-prd-historia-tecnica.mjs"

# 3b. Cada Blueprint dice que hace este sistema cuando una dependencia SALIENTE
#     no responde (S-42, ADR-0234). `denegar` es el valor por defecto y no
#     cuesta nada; `permitir` --seguir operando sin ella-- exige gap declarado
#     en GAPS.md, porque un fallo abierto sin dueno es una decision de
#     seguridad que nadie tomo. Sin Blueprints se ABSTIENE y lo dice.
node "${UNIMAR_CORE}/scripts/validate-comportamiento-degradado.mjs"

# 3c. Ningun artefacto sale con una credencial dentro (S-43, ADR-0235). Aqui la
#     ola 2 CENSA y no puede ponerse roja: un escaner sobre un repositorio que
#     ya existe encuentra el pasado el primer dia, y acusar a todos el primer
#     dia es como mueren estas puertas. Armarla es un acto del propietario.
node "${UNIMAR_CORE}/scripts/validate-credencial-en-artefacto.mjs"

# 4. Ninguna referencia G-NNN o ADR-NNNN cuelga, ni en los documentos ni en los
#    MENSAJES de los commits que este push publica (SD-02). Sin banderas a
#    proposito: el rango por defecto `HEAD --not --remotes` es, aqui y solo
#    aqui, la carga exacta del push. No se usa --historia, que revalidaria
#    historia inmutable y acabaria roja para siempre por construccion (G-074).
node "${UNIMAR_CORE}/scripts/validate-trazabilidad.mjs"

# 4.b El numero de un ADR, de una regla y de una ficha se reclama EMPUJANDO
#     (S-26, ADR-0175, ADR-0197). Estos dos son los unicos pasos que preguntan
#     AL REMOTO, y este es su sitio exacto: la colision no vive dentro de una
#     rama --ahi cada una es internamente coherente-- sino ENTRE ramas, y el
#     push es el instante en que el numero queda reclamado. En un clon sin
#     origin/main no juzgan y lo dicen; no juzgar no es aprobar, pero tampoco es
#     bloquear a quien clona en plano.
#
#     Antes de escribir, preguntar sale gratis:
#       node "$UNIMAR_CORE/scripts/validate-identificadores.mjs" --siguiente G
node "${UNIMAR_CORE}/scripts/validate-adr-numeracion.mjs"
node "${UNIMAR_CORE}/scripts/validate-identificadores.mjs"

# 5. Estructura de los artefactos SDLC (S-01..S-05, S-13).
node "${UNIMAR_CORE}/scripts/validate-satellite-base.mjs"

# 6. Las reglas de herencia estan todas triajadas en DECISIONS.md (S-15, S-16).
node "${UNIMAR_CORE}/scripts/validate-triaje.mjs"

# 6.b Estructura del satelite (S-16, S-18): CONTRIBUTING.md con el bucle de
#     retorno, raiz de fuente declarada, esqueleto de la taxonomia, ausencia de
#     .harness/, y ningun marcador de plantilla sin sustituir. Un registro sin
#     llenar no debe pasar por lleno.
node "${UNIMAR_CORE}/scripts/validate-estructura-satelite.mjs"

# 6.b.1 El runner de agente que la norma predica es el que el instalador corre
#       (S-17, G-316, ADR-0219). `ides` de _bmad/_config/manifest.yaml es lo que
#       BMAD obedece: mientras declare otro runner, cualquier install lo regenera
#       y ninguna limpieza es estable. Tambien bloquea el residuo VERSIONADO del
#       runner anterior, que el instalador no borra al migrar. Sin _bmad/ se
#       abstiene: S-17 reclama la instalacion en otro sitio.
node "${UNIMAR_CORE}/scripts/validate-runner.mjs"

# 6.b.2 Ubicacion de los artefactos SDLC (S-01..S-05, S-18, contrato de ubicacion,
#       G-017). Las cinco fases materializadas con su hub, y ningun artefacto
#       generado (PRD, backlog, epica, historia, blueprint, reporte, notas de
#       lanzamiento) suelto en docs/ raiz o bajo reference/. No aplica en libreria.
node "${UNIMAR_CORE}/scripts/validate-ubicacion-artefactos.mjs"

# 6.b.3 La cadena de trazabilidad PRD -> FS -> US -> TS + ADR -> TSR -> RN
#       (SD-02, G-172, ADR-0178). Compone con el paso anterior: aquel comprueba
#       DONDE vive el artefacto, este lo que hay dentro -- identidad declarada,
#       derivacion presente y del tipo que la cadena admite, TS que cita su ADR.
#       En un satelite el arbol docs/0N-... es el censo del producto, asi que
#       una referencia a un artefacto que nadie declara BLOQUEA.
node "${UNIMAR_CORE}/scripts/validate-cadena-artefactos.mjs"

# 6.b.4 Fichas de demanda inter-sistema (ADR-0132). Cada
#       reference/governance/demandas/DMD-*.yaml contra su esquema, su
#       consistencia interna y las reglas de gobernanza: diferir o rechazar
#       exige motivo, aceptada exige atencion.prd, y las referencias resuelven.
#       Aqui y no en el nucleo: alli el validador se abstiene por diseno --la
#       fuente autora el estandar y no recibe demanda--, de modo que este es su
#       unico domicilio local (G-361). No aplica si no hay registro de demandas.
node "${UNIMAR_CORE}/scripts/validate-demandas.mjs"

# 6.c Indice de iniciativas publicado (S-25, ADR-0140). Un satelite de producto
#     con PRDs DEBE publicar su initiatives-index.json (reporting/data/) y listar
#     en el todos sus PRDs. Solo lectura: no genera ni repara el indice. No aplica
#     en una libreria ni si el repo no declara PRDs. Ejecutor primario; el gate F1
#     del tablero cubre la continuidad y la alcanzabilidad remota.
node "${UNIMAR_CORE}/scripts/validate-prd-index.mjs"

# 6.c.2 La vinculacion al estandar se lee del repositorio (S-28, ADR-0180).
#       `.github/workflows/gobernanza.yml` existe, GIT LO SIGUE, declara
#       STANDARD_REF fijado a una etiqueta `unimar-core-<x.y.z>` y algun `ref:`
#       la usa. Aqui --y no solo en el CI-- porque es el fichero cuya ausencia
#       denuncia: donde falta, el CI del satelite no puede invocar esta puerta.
#       Solo lectura: el nucleo exige y verifica, no escribe el workflow ajeno.
node "${UNIMAR_CORE}/scripts/validate-vinculacion-estandar.mjs"

# 6.d Fase 1 define, el tablero planifica (S-24, ADR-0134). Los artefactos de
#     Fase 1 ordenan y estiman; las fechas, la linea base y el avance real son
#     del tablero SDLC. Bloquea lo exacto --gantt, eje temporal, trimestre como
#     horizonte, fechas de inicio/fin/entrega/despliegue-- y avisa de lo
#     heuristico. El historial de cambios (S-13) queda exento a proposito: un
#     gate que marcara sus fechas empujaria a falsear el historial.
node "${UNIMAR_CORE}/scripts/validate-s24-fase1.mjs"

# 7. Criterios de aceptacion verificables (SD-04). Es un AVISO: la heuristica
#    tiene falsos positivos, y un gate ruidoso que bloquea es peor que no
#    tenerlo (SD-06). Sin --strict, sale 0 aunque encuentre candidatos.
node "${UNIMAR_CORE}/scripts/validate-criterios.mjs"

# 7.b Gates locales de calidad y seguridad (S-23, ADR-0106). AVISO: comprueba
#     que el satelite cablea sus gates locales (secretos, deps, coverage,
#     commitlint) segun su stack. Sin --strict no bloquea; local-first no
#     depende de la cuota ni la disponibilidad del CI del proveedor.
node "${UNIMAR_CORE}/scripts/validate-gates-locales.mjs"

# 7.f Modelo Suite -> Sistema -> PRD (ADR-0120). AVISO: si el satelite declara
#     suite.yaml/sistema.yaml, comprueba su coherencia y que las siglas sean
#     Ratificada. No aplica si no es una suite multi-sistema.
node "${UNIMAR_CORE}/scripts/validate-suite.mjs"

# 8. Lint de Markdown sobre EL CORPUS VERSIONADO, igual que el CI.
#
#    El alcance NO es "lo que este push toca": un gate que solo mira un diff no
#    vigila un corpus. El CI lintea lo que hace checkout, o sea lo versionado, y
#    la simetria es deliberada: una violacion en un archivo que este push no
#    toca es invisible en local y fatal en remoto.
#
#    Se prefiere markdownlint directo sobre `git ls-files` a lint-staged: en
#    `pre-push` no hay indice que mirar, y lint-staged es una herramienta del
#    momento del commit.
# La puerta de Mermaid COMPILA los diagramas, y para eso necesita su motor
# (mermaid + jsdom, fijados dentro del validador). Aqui SIN `--exigir-motor`:
# si el motor no esta, avisa y sigue, igual que el lint de Markdown cuando no
# hay `npx`. El CI lo corre con `--exigir-motor` y alli si es fallo — la
# comprobacion dura vive donde no depende de la maquina de nadie (ADR-0220).
node "${UNIMAR_CORE}/scripts/validate-mermaid.mjs"

if ! command -v npx >/dev/null 2>&1; then
  echo "[husky] npx no disponible: se omite el lint de Markdown." >&2
elif [ -f .markdownlint.json ]; then
  ARCHIVOS=$(git ls-files '*.md')
  if [ -n "$ARCHIVOS" ]; then
    # shellcheck disable=SC2086
    npx -y markdownlint-cli@0.39.0 --config .markdownlint.json $ARCHIVOS
  else
    echo "[husky] No hay .md versionados: no hay nada que lintear." >&2
  fi
else
  echo "[husky] Sin .markdownlint.json: se omite el lint de Markdown." >&2
  echo "        Materializalo desde templates/ del plugin." >&2
fi

# 9. Punto de extension del satelite. Aqui --y no antes-- encadena el satelite
#    sus gates caros: build, pruebas, escaner de secretos sobre el arbol
#    completo, SAST y auditoria de dependencias (S-23, ADR-0106). En un
#    `pre-commit` no cabian; en el push si.
#    Ejemplo .NET:
#      dotnet build --nologo --verbosity quiet
#      dotnet test  --nologo --verbosity quiet --no-build
#    Ejemplo orquestador propio:
#      bash scripts/verify-local.sh prepush

echo "[husky] pre-push: madurez, gaps, correspondencia, docs, trazabilidad (mensajes incluidos), SDLC, triaje, estructura, criterios y Markdown OK (estandar via plugin)."
