---
adr: 0105
estado: Borrador
supersede: []
deprecia_reglas: []
---
# [ADR 0105](0105-definition-of-release-puertas-verificables.es.md): Definition of Release — un release se corta por puertas verificables, no por opinión

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Estado-Borrador-c07a12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> Estado: Borrador
> Fecha: 2026-07-21
> Owner: Architecture Board Unimar
> Fase relacionada: Entrega y Operaciones
> Amplía: [ADR-0050](0050-estrategia-ramificacion-gitflow.es.md) (modelo de ramas / flujo de entrega), [ADR-0018](0018-piramide-pruebas-gates-calidad.es.md) (pirámide de pruebas y gates de calidad)
> Origen: satélite `unimar-ums`, gap G-074 — el piloto interno no tenía un criterio común de «listo para cortar release»
> Motivado por: en `unimar-ums` la percepción de preparación divergía de la realidad del código (la madurez documental afirmaba «nivel 1 / sin suite» mientras el código tenía 1408 pruebas verdes), y defectos llegaban a producción interna por ramas que el CI no vigilaba

---

## 1. Contexto

El estándar Unimar mide el **estado** de un satélite (madurez TOGAF ACMM) y define el
**flujo** de ramas (ADR-0050), pero no fija **la puerta de corte de un release**: qué
debe ser cierto, y **verificado**, para etiquetar una versión.

El vacío se manifestó en `unimar-ums` de tres formas concretas y medidas:

1. **Readiness por opinión.** La medición de madurez afirmaba «Validación nivel 1 / sin
   suite» y «Operación nivel 1 / sin runbook»; el código tenía 1408 pruebas unitarias
   verdes, 4 runbooks y observabilidad instrumentada. La documentación **mentía respecto
   a la fuente** y nadie lo detectaba porque no había una puerta que lo forzara.
2. **CI ciego a las ramas de trabajo.** El CI solo disparaba en `main`. Un saneamiento
   automatizado entró por otra rama e introdujo un fallo de disponibilidad (recursión
   infinita en el login) y un build roto, sin que ninguna puerta lo frenara.
3. **Artefacto no reproducible.** Las imágenes se referenciaban como `latest` y el
   despliegue vivo derivaba de parches manuales, no del chart.

Ninguno era un bug de código: los tres eran ausencia de **puerta**.

## 2. Decisión

Se adopta el **Definition of Release** como concepto del estándar. **Un release se
corta solo cuando todas sus puertas están verde-verificadas contra código o CI**, nunca
afirmadas por documento u opinión.

Cada satélite materializa su Definition of Release (por ejemplo, como *technical
enabler*) con puertas agrupadas en cuatro dimensiones, cada una con su verificación
ejecutable:

| Dimensión | Qué asegura | Verificación (ejemplo) |
| --- | --- | --- |
| **Validación** | las pruebas ejercitan los caminos críticos | jobs de CI verdes |
| **Entrega** | artefacto reproducible y versionado | imágenes semver (nunca `latest`), CI en toda rama de trabajo, despliegue desde el chart |
| **Operación** | se puede desplegar, observar y recuperar | runbook + break-glass, alertas sobre métricas reales |
| **Gobernanza** | trazabilidad y verdad documental | decisiones ↔ ADRs, documentación reconciliada con la fuente |

### 2.1 Principios vinculantes (RFC-2119)

- **P-READINESS-01 — Se prueba, no se afirma.** Cada puerta **DEBE** tener un comando o
  job de CI que la verde-verifique. Ninguna puerta se marca lista por opinión.
- **P-READINESS-02 — La fuente manda.** Donde la documentación de estado contradiga el
  código verificado, la documentación **DEBE** reconciliarse con la fuente, no al revés.
- **P-READINESS-03 — Reproducible o no es release.** Los artefactos **DEBEN** versionarse
  por semver; el despliegue **DEBE** salir del artefacto de release, no de parches.

## 3. Alcance

Este ADR fija el **modelo**. El **detalle** de las puertas (umbrales, jobs concretos)
es de cada satélite, que lo materializa y mantiene. `unimar-ums` lo materializa en su
`TE-09` para el piloto interno controlado (referencia de implementación, no normativa).

## 4. Consecuencias

- **Positivas:** criterio de corte común y auditable entre satélites; la preparación
  deja de ser opinión; el CI cubre por dónde entra el trabajo; los releases son
  reproducibles y los defectos se atrapan en la puerta, no en producción.
- **Coste:** cada satélite debe materializar y mantener sus puertas; el CI se amplía;
  cortar un release exige el scorecard completo (más lento, deliberadamente).
- **Neutrales:** no impone tecnología de CI ni de despliegue concretas — solo exige que
  las puertas existan y se verifiquen.

## 5. Validador propuesto (harness, incremental)

Un validador que compruebe que el satélite **declara** su Definition of Release y que
cada puerta **referencia una verificación** (comando o job), análogo a
`validate-correspondencia` (madurez ↔ gaps). No bloqueante al inicio (aviso), gateable
cuando la adopción madure.
