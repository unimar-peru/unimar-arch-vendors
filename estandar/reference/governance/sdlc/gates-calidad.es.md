# Gates de Calidad SDLC

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Gates%20de%20Calidad%20SDLC-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Owner:** Architecture Board  
> **Estado:** Estándar corporativo activo  
> **Padre:** [Centro de Gobernanza SDLC Corporativa](./README.md)  
> **Audiencia:** Equipos de Desarrollo, QA, Infraestructura, Procesos y Gerencia

---

## Propósito y Contexto

Este documento define los **Gates de Calidad** (Puntos de Control de Calidad) que Unimar utiliza para garantizar que cada fase del ciclo de desarrollo de software (SDLC) cumpla con estándares mínimos antes de avanzar a la siguiente etapa.

### ¿Qué es un Gate de Calidad?

Un Gate de Calidad es un **punto de control basado en evidencia objetiva** que verifica si un producto de software está listo para avanzar a la siguiente fase de desarrollo. No es una recomendación ni una sugerencia: es un criterio medible que debe cumplirse para continuar.

> **Analogía:** Piense en los Gates como los controles de seguridad en un aeropuerto. No puede abordar un vuelo sin pasar por seguridad, sin importar cuán importante sea su viaje. De la misma forma, un release no puede llegar a producción sin pasar sus Gates de Calidad.

### ¿Por qué son importantes?

Los Gates de Calidad protegen a la organización de:

- **Lanzamientos inseguros:** Código con vulnerabilidades conocidas o bugs críticos
- **Deuda técnica acumulada:** Atajos que generan costos futuros exponenciales
- **Documentación desactualizada:** Sistemas que nadie entiende completamente
- **Incidentes evitables:** Problemas en producción que pudieron detectarse antes

---

## Principio Fundamental

**Una fase solo puede avanzar cuando su evidencia requerida existe y sus criterios bloqueantes pasan.**

La confianza manual, la aprobación verbal o el acuerdo informal **no pueden reemplazar** un Gate de Calidad obligatorio fallido. Las excepciones requieren un **Waiver** (excepción formal) de gobernanza con:

- Owner responsable
- Fecha de expiración definida
- Plan de mitigación documentado

---

## Baseline Canónica de Umbrales

La siguiente tabla define los umbrales numéricos objetivos que aplican transversalmente a todas las fases del SDLC:

| Métrica | Umbral Canónico | Aplica a | Impacto en Gate | Explicación |
| :--- | :--- | :--- | :--- | :--- |
| **Cobertura de código sobre lógica de negocio** | ≥ 80% | Construcción, Validación | Bloquea Build Exitoso o RC Sellado si está por debajo del umbral | El 80% del código que implementa reglas de negocio debe tener tests automatizados que verifiquen su comportamiento |
| **Complejidad ciclomática** | ≤ 15 por método/función | Construcción, Validación | Bloquea merge o RC si se excede sin refactorización o waiver | Mide cuántos caminos independientes tiene una función. Más de 15 indica que la función hace demasiado y es difícil de testear |
| **CVEs High/Critical** | 0 tolerados | Construcción, Validación, Entrega | Bloquea merge, RC y release productivo | Vulnerabilidades de seguridad graves conocidas no pueden llegar a producción bajo ninguna circunstancia |
| **Ratio de deuda técnica** | < 5% | Validación | Bloquea RC Sellado si se excede sin plan de remediación aprobado | El código marcado como "por mejorar" no debe superar el 5% del total del sistema |
| **Distribución de pirámide de testing** | 70% unitarias / 20% integración / 10% E2E | Diseño, Validación | Requiere explicación cuando la distribución del release se desvía materialmente | Las pruebas unitarias son rápidas y baratas; las E2E son lentas y costosas. Esta proporción optimiza velocidad y confianza |
| **Delta documental** | Requerido cuando cambia comportamiento, arquitectura, API u operación | Construcción, Entrega | Bloquea merge o Producción Activa cuando falta | Si el código cambió, la documentación que lo describe también debe actualizarse |
| **Evidencia de observabilidad** | Requerida para rutas productivas | Entrega | Bloquea Producción Activa cuando telemetría o logs no son verificables | Sin monitoreo, no podemos detectar incidentes. Sin logs, no podemos diagnosticarlos |

---

## Detalle de Gates por Fase

### Fase 1 — Concepción y Descubrimiento

**Gate:** Aprobación de Negocio

**Propósito:** Validar que el producto resuelve un problema real de negocio antes de invertir en diseño o construcción.

| Elemento | Detalle |
| :--- | :--- |
| **Evidencia Obligatoria** | <ul><li>PRD (Product Requirements Document) aprobado y versionado</li><li>Alcance del producto definido (incluido/excluido)</li><li>Personas y roles de usuarios identificados</li><li>Objetivos de negocio con métricas medibles</li><li>Restricciones técnicas y de presupuesto documentadas</li></ul> |
| **Criterios Bloqueantes** | <ul><li>❌ Alcance ambiguo o no acotado</li><li>❌ Resultado de inversión (ROI) poco claro o no cuantificable</li><li>❌ Restricciones arquitectónicas corporativas ignoradas</li><li>❌ Stakeholders clave no identificados o no consultados</li></ul> |
| **Ejemplo de Aprobación** | ✅ PRD de Q-Track con KPIs claros: "Reducir tiempo de espera de camiones de 87 min a 50 min" |
| **Ejemplo de Rechazo** | ❌ PRD dice "mejorar la experiencia del usuario" sin métrica específica de cómo se medirá esa mejora |

---

### Fase 2 — Diseño y Arquitectura

**Gate:** Baseline de Diseño Aprobado

**Propósito:** Garantizar que las decisiones arquitectónicas están documentadas, son coherentes con los estándares corporativos y han sido revisadas por el Architecture Board.

| Elemento | Detalle |
| :--- | :--- |
| **Evidencia Obligatoria** | <ul><li>ADRs (Architecture Decision Records) para decisiones significativas</li><li>Historias Funcionales aprobadas por el área de negocio</li><li>Alineamiento con blueprint arquitectónico corporativo</li><li>Estándares de diseño aplicables identificados</li><li>Diagramas C4 Nivel 1 (Contexto) y Nivel 2 (Contenedores)</li></ul> |
| **Criterios Bloqueantes** | <ul><li>❌ Decisiones arquitectónicas significativas no documentadas en ADRs</li><li>❌ Decisiones contradictorias entre ADRs (ej: dos bases de datos para el mismo propósito)</li><li>❌ Alternativas rechazadas sin justificación de negocio</li><li>❌ Violación de estándares corporativos sin waiver aprobado</li></ul> |
| **Ejemplo de Aprobación** | ✅ ADR-001 de Q-Track documenta: contexto, decisión (PostgreSQL), 3 alternativas rechazadas con justificación, consecuencias |
| **Ejemplo de Rechazo** | ❌ ADR dice "usamos MongoDB" pero no explica por qué se rechazó PostgreSQL ni qué consecuencias tiene esa decisión |

---

### Fase 3 — Construcción

**Gate:** Build Exitoso

**Propósito:** Verificar que el código está funcionando, probado y documentado antes de pasar a QA.

| Elemento | Detalle |
| :--- | :--- |
| **Evidencia Obligatoria** | <ul><li>Historias Técnicas implementadas y trazables a Historias Funcionales</li><li>Pipeline de CI ejecutado exitosamente (lint ✓, test ✓, build ✓)</li><li>Definición de Terminado (DoD) cumplida para cada historia</li><li>Delta documental actualizado (README, ADRs, guías de uso)</li><li>Reporte de cobertura de tests (≥ 80% en lógica de negocio)</li></ul> |
| **Criterios Bloqueantes** | <ul><li>❌ Pipeline de CI falla (tests rojos, lint errors, build errors)</li><li>❌ Cobertura de código bajo el umbral de 80%</li><li>❌ Vulnerabilidades CVE High/Critical detectadas en escaneo de seguridad</li><li>❌ Code Review faltante o con comentarios bloqueantes sin resolver</li><li>❌ Documentación desactualizada respecto al código implementado</li></ul> |
| **Ejemplo de Aprobación** | ✅ CI en verde: 94 tests pass, 87% cobertura, 0 CVEs, PR aprobado por 2 reviewers |
| **Ejemplo de Rechazo** | ❌ Pipeline falla: 3 tests rojos en `TurnoService.test.ts`, cobertura en 72%, 1 CVE High en dependencia `lodash@4.17.20` |

---

### Fase 4 — Validación y QA

**Gate:** RC (Release Candidate) Sellado

**Propósito:** Confirmar que el sistema cumple con todos los criterios de calidad y está listo para producción.

| Elemento | Detalle |
| :--- | :--- |
| **Evidencia Obligatoria** | <ul><li>Test Summary Report con estado **SELLADO**</li><li>Validación de aceptación de negocio firmada</li><li>Métricas de calidad dentro de umbrales aceptables</li><li>Pruebas de integración ejecutadas contra entorno similar a producción</li><li>Pruebas E2E del flujo completo en verde</li></ul> |
| **Criterios Bloqueantes** | <ul><li>❌ Cualquier métrica obligatoria fuera de umbral (cobertura, CVEs, complejidad)</li><li>❌ Criterios de aceptación de negocio sin verificar</li><li>❌ Tests de integración fallidos</li><li>❌ Performance fuera de SLA acordado (ej: p95 > 300ms)</li><li>❌ Defectos de severidad Alta o Crítica abiertos</li></ul> |
| **Ejemplo de Aprobación** | ✅ RC v1.0.0 SELLADO: 64/64 tests pass, 89% cobertura, 0 CVEs, p95=142ms, negocio aprueba |
| **Ejemplo de Rechazo** | ❌ Test Summary Report en estado "EN EJECUCIÓN": faltan 3 tests de integración, 1 defecto crítico abierto (BUG-042) |

---

### Fase 5 — Entrega y Operaciones

**Gate:** Producción Activa

**Propósito:** Asegurar que el despliegue a producción es seguro, reversible y monitoreado.

| Elemento | Detalle |
| :--- | :--- |
| **Evidencia Obligatoria** | <ul><li>Release Notes completas y aprobadas</li><li>Plan de rollback documentado y probado</li><li>Checklist de observabilidad verificado (logs, métricas, alertas)</li><li>Evidencia de despliegue exitoso (capturas, logs del pipeline)</li><li>Runbook de operaciones disponible para el equipo de soporte</li></ul> |
| **Criterios Bloqueantes** | <ul><li>❌ Monitoreo no nominal (alertas configuradas pero no probadas)</li><li>❌ Rollback indefinido o no probado en staging</li><li>❌ Release no trazable al RC Sellado (commit hash no coincide)</li><li>❌ Runbook de operaciones faltante o incompleto</li><li>❌ Variables de entorno de producción no validadas</li></ul> |
| **Ejemplo de Aprobación** | ✅ v1.0.0 en producción: health check OK, Loki con logs, Grafana con dashboard, rollback probado en staging |
| **Ejemplo de Rechazo** | ❌ Dashboard de Grafana no tiene alertas configuradas, plan de rollback dice "restaurar backup" pero no especifica cómo ni tiempo estimado |

---

## Regla de Cobertura de Tests

Se usa un único estándar de cobertura bloqueante para release:

| Regla | Detalle |
| :--- | :--- |
| **Gate mínimo de release** | Cobertura de lógica de negocio **≥ 80%** |
| **Distribución objetivo** | **70% unitarias / 20% integración / 10% E2E** (según ADR-0018) |
| **Importante** | La distribución de pirámide **no reemplaza** la cobertura. Un release puede tener la distribución correcta y aun así fallar cobertura. |

### Ejemplo de Cálculo de Cobertura

```
Archivos en src/domain/: 15 archivos
Líneas de código ejecutable: 1,200 líneas
Líneas cubiertas por tests: 1,050 líneas

Cobertura = (1,050 / 1,200) × 100 = 87.5% ✅ APROBADO (≥ 80%)
```

### Ejemplo de Distribución de Pirámide

```
Total de tests: 100

- Tests unitarios: 70 tests (70%) ✅
- Tests de integración: 20 tests (20%) ✅
- Tests E2E: 10 tests (10%) ✅

Distribución: 70/20/10 ✅ APROBADO
```

---

## Política de Waiver (Excepciones)

Un **Waiver** es una excepción formal que permite avanzar a la siguiente fase a pesar de no cumplir un Gate de Calidad. Solo puede usarse cuando la organización acepta deliberadamente una desviación temporal.

### Requisitos de un Waiver

Todo waiver debe incluir **obligatoriamente**:

| Campo | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Criterio de gate faltante o fallido** | ¿Qué regla no se cumplió? | "Cobertura de tests en 75% (umbral: 80%)" |
| **Justificación de negocio** | ¿Por qué es necesario avanzar a pesar del incumplimiento? | "Ventana de aduana no renovable: si no desplegamos antes del 30/06, perdemos certificación por 6 meses" |
| **Declaración de riesgo** | ¿Qué puede salir mal si avanzamos? | "Riesgo de regresión en módulo de colas: 15% de probabilidad, impacto medio" |
| **Owner responsable** | ¿Quién asume la responsabilidad? | "Jorge Salas, Gerente de Procesos" |
| **Fecha de expiración** | ¿Hasta cuándo es válida esta excepción? | "2025-07-15 (2 semanas post-release)" |
| **Plan de mitigación** | ¿Cómo se reducirá el riesgo? | "Monitoreo reforzado las primeras 48h, equipo de guardia disponible, rollback automático si error rate > 5%" |
| **Autoridad aprobadora** | ¿Quién autoriza la excepción? | "Architecture Board + Gerencia de Operaciones" |

### Restricciones de Waivers

**❌ NUNCA se puede usar waiver para:**

- Vulnerabilidades High/Critical sin resolver en releases productivos
- Documentación de seguridad omitida
- Rollback no definido para sistemas críticos

**✅ Se puede considerar waiver para:**

- Cobertura ligeramente por debajo del umbral (ej: 78% vs 80%) con plan de cierre
- Deuda técnica entre 5-7% con roadmap de remediación aprobado
- Desviación menor de la pirámide de testing (ej: 65/25/10) con justificación técnica

---

## Expectativas de Evidencia

| Tipo de Evidencia | Expectativa Mínima | ¿Cómo se verifica? |
| :--- | :--- | :--- |
| **PRD** | Aprobado y versionado antes de iniciar arquitectura | Commit en repositorio con approval de Product Owner |
| **ADR** | Una decisión por ADR con contexto, opciones, decisión, compensaciones y consecuencias | Revisado y mergeado en `reference/architecture/adrs/` |
| **Historia Funcional** | Legible para negocio y conforme al Estándar de Escritura de Historias Funcionales | Validada por área de negocio en sesión de refinamiento |
| **Historia Técnica** | Trazable a una Historia Funcional y verificable en CI | ID de historia en commit message y tests en green |
| **Test Summary Report** | Incluye métricas de umbral, resumen de pirámide, escaneo de seguridad y validación de historias | Estado **SELLADO** con firma de QA Lead |
| **Notas de Lanzamiento** | Incluye alcance de lanzamiento, pasos de despliegue, rollback, lista de verificación de observabilidad y enlaces a evidencia RC | Aprobada por Tech Lead y Operations |

---

## Glosario de Términos

| Término | Definición |
| :--- | :--- |
| **Gate** | Punto de control basado en evidencia que bloquea o permite avance de fase |
| **Waiver** | Excepción formal aprobada por gobernanza para avanzar con un gate fallido |
| **RC Sellado** | Release Candidate con Test Summary Report en estado SELLADO (aprobado para producción) |
| **Producción Activa** | Sistema desplegado en producción con monitoreo nominal y users reales |
| **CVE** | Common Vulnerabilities and Exposures: identificador estándar de vulnerabilidades de seguridad |
| **Cobertura** | Porcentaje de código ejecutado por tests automatizados |
| **Complejidad Ciclomática** | Métrica que cuenta cuántos caminos independientes tiene una función |

---

## Documentos Relacionados

| Documento | Propósito |
| :--- | :--- |
| [Framework SDLC Orientado a Construcción](./02-ingenieria/framework-sdlc-enfoque-construccion.es.md) | Define bucle de construcción, DoD y métricas centrales de umbral |
| [Mapeo SDLC–Artefactos](./mapeo-artefactos-sdlc.es.md) | Muestra qué artefactos son requeridos por fase |
| Manifiesto de Ingeniería | Principios de ingeniería que guían estos gates |
| [Estándar de Escritura de Historias Funcionales](./03-documentacion/estandar-redaccion-historias-funcionales.es.md) | Formato requerido para historias de usuario |

---

<div align="center">
  <sub>Unimar Arch | Gates de Calidad SDLC | Versión 1.0.0</sub>
</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-16
</p>
