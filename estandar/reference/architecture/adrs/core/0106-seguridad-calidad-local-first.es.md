---
adr: 0106
estado: Aceptado
supersede: [0005]
deprecia_reglas: []
---
# [ADR 0106](0106-seguridad-calidad-local-first.es.md): Seguridad y calidad local-first — los controles se ejecutan en local, no en servicios del proveedor

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Estado-Aceptado-2ecc71?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> Estado: Aceptado
> Fecha: 2026-07-21
> Owner: Architecture Board Unimar
> Fase relacionada: Construcción · Entrega y Operaciones
> Supersede: [ADR-0005](0005-ci-cd-calidad-codeql.es.md) (puertas de seguridad CI/CD con CodeQL)
> Amplía: [ADR-0009](0009-gestion-vulnerabilidades-dependencias-estrictas.es.md) (gestión de vulnerabilidades de dependencias), [ADR-0018](0018-piramide-pruebas-gates-calidad.es.md) (pirámide de pruebas y gates de calidad)
> Origen: satélite `unimar-ums`, gap G-079
> Motivado por: el agotamiento de la cuota de GitHub Actions (Teams, 3.000 min/mes) dejó a un satélite **sin poder validar seguridad**, porque las puertas dependían de servicios administrados por GitHub. La seguridad no puede depender de la disponibilidad ni de la cuota de un proveedor

---

## 1. Contexto

[ADR-0005](0005-ci-cd-calidad-codeql.es.md) fijó las puertas de seguridad **sobre
servicios administrados por GitHub**: CodeQL como análisis estático obligatorio en CI,
el Secret Scanning integrado de GitHub, y `npm audit` en la pipeline. Su intención es
correcta e **irrenunciable**: «la seguridad debe imponerse mecánicamente, no dejarse a
la revisión humana».

Pero el **mecanismo** acopló la seguridad a un proveedor y a la disponibilidad del CI.
El caso que lo destapó en `unimar-ums`: al agotarse la cuota de GitHub Actions, **ninguna
puerta de seguridad podía ejecutarse** — no por un fallo de código, sino porque el
proveedor cortó el servicio. Una postura de seguridad que se apaga cuando se acaba un
saldo mensual no es una postura de seguridad.

## 2. Decisión

Se adopta **seguridad y calidad local-first**: todos los controles de calidad y
seguridad se ejecutan en la **máquina del desarrollador y en los git hooks**, sin
depender de servicios de seguridad administrados por GitHub. Se **preserva la intención
de ADR-0005** (imposición mecánica) y se **cambia el mecanismo** a ejecución local.

**No se depende de** GitHub Advanced Security, CodeQL como servicio, Dependabot para
seguridad, Secret/Code Scanning de GitHub, ni de GitHub Actions como mecanismo
**obligatorio** de seguridad. GitHub se usa para alojar, versionar y colaborar.

### 2.1 Gates locales exigidos (por satélite, con herramientas del stack)

| Gate | Mecanismo local (ejemplo) |
| --- | --- |
| Secret scanning | escáner local (p. ej. **gitleaks**) con baseline versionado |
| SAST | analizadores del compilador (Roslyn/SonarAnalyzer) + linters de seguridad (eslint-plugin-security) — **no** CodeQL-servicio |
| Dependencias / vulnerabilidades | `npm audit`, `dotnet list --vulnerable` u equivalente del stack (conserva ADR-0009) |
| Linters / formato | linters y formateadores del stack |
| Tests + coverage | pruebas del stack, con **umbral de coverage configurable** que falla por debajo |
| Formato de commits | validación local (p. ej. commitlint / Conventional Commits) |

### 2.2 Principios vinculantes (RFC-2119)

- **P-LOCAL-01 — Local-first, siempre y por defecto.** En **todos** los satélites el modo
  local es el prioritario y el que rige por defecto. Los controles de seguridad **DEBEN**
  poder ejecutarse y fallar en local (dev + git hooks), sin contratar ni configurar ningún
  servicio de seguridad del proveedor. No es un fallback ni depende de la cuota, el saldo
  ni la disponibilidad del CI: el local cubre la postura de seguridad por sí solo.
- **P-LOCAL-02 — El proveedor no es la seguridad; reintroducirlo exige ADR explícito.**
  Ningún control de seguridad **DEBE** depender de un servicio administrado por GitHub para
  ejecutarse. El CI/proveedor **NO** es una red de respaldo por defecto: reintroducirlo como
  puerta de seguridad **DEBE** declararse explícitamente en un ADR que **amplíe** (extends)
  este ADR-0106. Sin esa declaración explícita, el proveedor no participa como puerta.
- **P-LOCAL-03 — Publicación opcional.** La publicación de resultados/evidencias hacia
  el proveedor, si se define, **DEBE** ser una capa opcional desacoplada del proceso de
  seguridad, nunca un prerequisito.

## 3. Relación con ADR-0005

Este ADR **supersede a ADR-0005**. Conserva `npm audit` (y lo generaliza al análisis de
dependencias del stack, alineado con ADR-0009) y la exigencia de gates mecánicos.
**Retira** CodeQL-como-servicio y el Secret Scanning de GitHub como mecanismos
obligatorios, sustituidos por equivalentes locales (analizadores del compilador,
linters de seguridad, escáner de secretos local). El SLA de resolución de hallazgos de
ADR-0005 se conserva.

## 4. Consecuencias

- **Positivas:** la seguridad es independiente del proveedor y de su cuota; se valida
  gratis y rápido en local, antes del push; el desarrollador corrige antes de publicar.
- **Coste:** cada satélite instala y mantiene su tooling local (escáner de secretos,
  linters de seguridad) y sus hooks; la puesta en marcha por clon exige unos pasos
  (activar hooks, instalar el escáner).
- **Neutral:** no impide una capa futura de publicación de evidencias hacia GitHub,
  mientras siga siendo opcional (P-LOCAL-03).

## 5. Implementación de referencia

`unimar-ums` (gap G-079, decisión local D-018): orquestador `scripts/verify-local.sh`
(modos rápido/pre-push/completo), gitleaks con baseline, eslint-plugin-security,
`dotnet list --vulnerable` + `npm audit`, coverage con umbral, commitlint, y hooks
`pre-commit`/`commit-msg`/`pre-push`. Verificado en local sin ejecutar CI.

## 6. Validador propuesto (harness, incremental)

Un validador que compruebe que el satélite declara y cablea sus gates locales (hooks
presentes, escáner de secretos configurado, análisis de dependencias disponible), como
aviso al inicio y gateable cuando la adopción madure.
