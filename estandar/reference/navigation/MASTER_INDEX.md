# Unimar Arch — Master Index Global

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Master%20Index%20Global-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Meta:** Índice maestro del corpus Unimar Arch. Las 11 secciones colapsables permiten localizar cualquier documento en ≤2 clics, navegando por fase SDLC o por área transversal.
> **Objetivos:** (1) Navegar todo el repositorio desde una sola página, (2) distinguir documentos Core (agnósticos) de Platform-specific (.NET, Node.js, Android), (3) mantener una secuencia de lectura coherente por fase.

Este es el ruteo exhaustivo. Para el punto de entrada público, ver el [README de raíz](../../README.md).

---

## 1. Portal y Orientación

<details>
<summary><strong>Expandir documentos</strong></summary>

| Documento | Propósito |
| :--- | :--- |
| [README.md](../../README.md) | Portal público del repositorio |
| [AGENTS.md](../../AGENTS.md) | Reglas y convenciones para agentes IA |
| [DECISIONS.md](../../DECISIONS.md) | Triage local de decisiones arquitectónicas |
| [Getting Started](../getting-started/README.md) | Rutas de incorporación por rol |
| [Glosario](../governance/glosario.md) | Terminología controlada |
| [MASTER_INDEX.md](../../MASTER_INDEX.md) | Stub de raíz (preservado por compatibilidad) |
| [DOCUMENTATION_VERSIONS.md](../../DOCUMENTATION_VERSIONS.md) | Changelog del corpus documental |

</details>

---

## 2. Fase 1 — Concepción y Descubrimiento

<details>
<summary><strong>Expandir documentos</strong></summary>

**Gate de salida:** Aprobación de Negocio — Alcance Congelado

### Core (Agnóstico)

Secuencia de lectura: restricciones → lenguaje → descubrimiento → requisitos → descomposición → estimación → baseline técnica.

| Documento | Tipo | Req | Ubicación |
| :-------- | :--- | :-: | :-------- |
| Directivas Arquitectónicas | Estándar | **R** | [directivas-arquitectonicas.es.md](../governance/standards/vision/directivas-arquitectonicas.es.md) |
| Glosario Corporativo | Referencia | **R** | [glosario.md](../governance/glosario.md) |
| Taxonomía de Repositorio | Estándar | O | [taxonomia-repositorio.md](../governance/standards/taxonomia-repositorio.md) |
| Lienzo de Descubrimiento | Plantilla | O | [plantilla-lienzo-descubrimiento.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-lienzo-descubrimiento.es.md) |
| Caso de Negocio ROI | Plantilla | O | [plantilla-caso-negocio-roi.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-caso-negocio-roi.es.md) |
| PRD | Plantilla | **R** | [plantilla-prd.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-prd.es.md) |
| Épica | Plantilla | O | [plantilla-epica.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-epica.es.md) |
| Historia de Usuario | Plantilla | **R** | [plantilla-historia-usuario.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-historia-usuario.es.md) |
| Backlog Ágil | Plantilla | **R** | [plantilla-backlog-agil.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-backlog-agil.es.md) |
| Estimación Preliminar | Plantilla | O | [plantilla-estimacion-preliminar.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-estimacion-preliminar.es.md) |
| Baseline Agnóstica | Estándar | **R** | [stack-tecnologico-autorizado-agnostico.es.md](../architecture/stack-tecnologico-autorizado-agnostico.es.md) |

</details>

---

## 3. Fase 2 — Diseño y Arquitectura

<details>
<summary><strong>Expandir documentos</strong></summary>

**Gate de salida:** Baseline de Diseño Aprobado

### Core (Agnóstico)

Secuencia de lectura: visión → estándares → modelo → stack → decisiones → especificaciones → dominio.

| Documento | Tipo | Req | Ubicación |
| :-------- | :--- | :-: | :-------- |
| Visión de la Suite | Visión | **R** | vision-suite-sistemas-soporte-operativo.es.md |
| Hoja de Ruta de la Suite | Visión | **R** | hoja-ruta-suite-sistemas.es.md |
| Estándar Arquitectónico Corporativo | Estándar | **R** | [estandar-arquitectonico-suite-unimar.es.md](../architecture/estandar-arquitectonico-suite-unimar.es.md) |
| Matriz NFR de la Suite | Estándar | **R** | [matriz-nfr-suite.es.md](../architecture/matriz-nfr-suite.es.md) |
| Blueprint de Referencia Corporativa | Blueprint | **R** | [blueprints/blueprint-referencia.es.md](../architecture/blueprints/blueprint-referencia.es.md) |
| Especificación de Topología C4 | Blueprint | O | [blueprints/especificacion-topologia-c4.es.md](../architecture/blueprints/especificacion-topologia-c4.es.md) |
| Checklist de Simplicidad Fase 1 | Estándar | **R** | [blueprints/lista-verificacion-simplicidad-fase-01.es.md](../architecture/blueprints/lista-verificacion-simplicidad-fase-01.es.md) |
| Estándar de Diseño de API | Estándar | **R** | [estandar-diseno-api.es.md](../governance/standards/engineering/estandar-diseno-api.es.md) |
| Estrategia de Frontend Web | Guía | **R** | [estrategia-frontend-web.es.md](../governance/standards/engineering/estrategia-frontend-web.es.md) |
| Estrategia de Integraciones Corporativas | Guía | **R** | [estrategia-integraciones.es.md](../governance/standards/engineering/estrategia-integraciones.es.md) |
| Estrategia de Monitoreo | Guía | **R** | [estrategia-monitoreo.es.md](../governance/standards/engineering/estrategia-monitoreo.es.md) |
| Análisis Estratégico CAP | Blueprint | O | [analisis-estrategico-cap.es.md](../architecture/analisis-estrategico-cap.es.md) |
| Flujo de Arquitectura de Observabilidad | Blueprint | O | [flujo-arquitectura-observabilidad.es.md](../architecture/flujo-arquitectura-observabilidad.es.md) |
| Escenarios de Despliegue Multi-Cloud | Estándar | O | [escenarios-despliegue-multinube.es.md](../architecture/escenarios-despliegue-multinube.es.md) |
| Baseline Agnóstica | Estándar | **R** | [stack-tecnologico-autorizado-agnostico.es.md](../architecture/stack-tecnologico-autorizado-agnostico.es.md) |
| Stack Tecnológico Autorizado (Índice) | Estándar | **R** | [stack-tecnologico-autorizado.es.md](../architecture/stack-tecnologico-autorizado.es.md) |
| ADR (Plantilla) | Plantilla | **R** | [plantilla-adr.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md) |
| ADRs (Core + runtime) | Decisión | Varía | [Hub de ADRs](../architecture/adrs/README.md) |
| Historia Funcional | Plantilla | **R** | [plantilla-historia-funcional.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-historia-funcional.es.md) |
| Estándar de Redacción HF | Estándar | **R** | [estandar-redaccion-historias-funcionales.es.md](../governance/sdlc/03-documentacion/estandar-redaccion-historias-funcionales.es.md) |
| Mejores Prácticas de Documentación SDLC | Estándar | **R** | [mejores-practicas-documentacion-sdlc.es.md](../governance/sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) |
| Mapa de Contextos Acotados | Dominio | **R** | [contextos-acotados.md](../knowledge/dominio/contextos-acotados.md) |
| Glosario de Negocio | Dominio | **R** | [glosario-negocio.md](../knowledge/dominio/glosario-negocio.md) |

### Platform-specific

Agrupado por runtime: Stack → ADRs → Patrones Canónicos.

| Documento | Runtime | Req | Ubicación |
| :-------- | :------ | :-: | :-------- |
| Stack Tecnológico .NET | .NET | **R** | [stack-tecnologico-autorizado-dotnet.es.md](../architecture/stack-tecnologico-autorizado-dotnet.es.md) |
| Resumen Stack .NET | .NET | O | [resumen-stack-tecnologico-dotnet.es.md](../architecture/resumen-stack-tecnologico-dotnet.es.md) |
| ADRs .NET (3) | .NET | Varía | [adrs/dotnet/README.md](../architecture/adrs/dotnet/README.md) |
| Patrones Canónicos .NET (4) | .NET | O | [canonical-patterns/dotnet/README.md](../architecture/canonical-patterns/dotnet/README.md) |
| Stack Tecnológico Node.js | Node.js | **R** | [stack-tecnologico-autorizado-nodejs.es.md](../architecture/stack-tecnologico-autorizado-nodejs.es.md) |
| ADRs Node.js (13) | Node.js | Varía | [adrs/nodejs/README.md](../architecture/adrs/nodejs/README.md) |
| Patrones Canónicos Node.js (4) | Node.js | O | [canonical-patterns/nodejs/README.md](../architecture/canonical-patterns/nodejs/README.md) |
| Stack Tecnológico Android | Android | **R** | [stack-tecnologico-autorizado-android.es.md](../architecture/stack-tecnologico-autorizado-android.es.md) |
| Resumen Stack Android | Android | O | [resumen-stack-tecnologico-android.es.md](../architecture/resumen-stack-tecnologico-android.es.md) |
| ADRs Android (1) | Android | Varía | [adrs/android/README.md](../architecture/adrs/android/README.md) |
| Patrones Canónicos Android (4) | Android | O | [canonical-patterns/android/README.md](../architecture/canonical-patterns/android/README.md) |

</details>

---

## 4. Fase 3 — Construcción

<details>
<summary><strong>Expandir documentos</strong></summary>

**Gate de salida:** Build Exitoso — Merge de PR Autorizado

### Core (Agnóstico)

Secuencia de lectura: plantilla → flujo de trabajo → principios → estándares de código → calidad → CI/CD → documentación → opcionales.

| Documento | Tipo | Req | Ubicación |
| :-------- | :--- | :-: | :-------- |
| Historia Técnica | Plantilla | **R** | [plantilla-historia-tecnica.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-historia-tecnica.es.md) |
| Framework SDLC Orientado a Construcción | Estándar | **R** | [framework-sdlc-enfoque-construccion.es.md](../governance/sdlc/02-ingenieria/framework-sdlc-enfoque-construccion.es.md) |
| Manifiesto de Ingeniería | Estándar | **R** | [manifiesto-ingenieria.md](../governance/standards/engineering/manifiesto-ingenieria.md) |
| Estándar de Diseño de API | Estándar | **R** | [estandar-diseno-api.es.md](../governance/standards/engineering/estandar-diseno-api.es.md) |
| Estrategia de Frontend Web | Guía | **R** | [estrategia-frontend-web.es.md](../governance/standards/engineering/estrategia-frontend-web.es.md) |
| Estrategia de Integraciones Corporativas | Guía | **R** | [estrategia-integraciones.es.md](../governance/standards/engineering/estrategia-integraciones.es.md) |
| Estrategia de Monitoreo | Guía | **R** | [estrategia-monitoreo.es.md](../governance/standards/engineering/estrategia-monitoreo.es.md) |
| ADR-0049 — Política de Naming y Código Limpio | Decisión | **R** | [adrs/core/0049-politica-naming-semantica-codigo-limpio.es.md](../architecture/adrs/core/0049-politica-naming-semantica-codigo-limpio.es.md) |
| ADR-0056 — Convenciones de Nombre y Diseño Empresarial | Decisión | **R** | [adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md](../architecture/adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md) |
| Estrategia de Base de Datos | Guía | **R** | [estrategia-base-datos.es.md](../governance/standards/engineering/estrategia-base-datos.es.md) |
| Estrategia de Ramificación GitFlow | Guía | **R** | [estrategia-ramificacion.es.md](../governance/sdlc/estrategia-ramificacion.es.md) |
| ADR-0050 — GitFlow Extendido (ref.) | Decisión | O | [adrs/core/0050-estrategia-ramificacion-gitflow.es.md](../architecture/adrs/core/0050-estrategia-ramificacion-gitflow.es.md) |
| ADR-0018 — Pirámide de Pruebas | Decisión | **R** | [adrs/core/0018-piramide-pruebas-gates-calidad.es.md](../architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md) |
| ADR-0005 — Pipeline CI/CD con CodeQL | Decisión | **R** | [adrs/core/0005-ci-cd-calidad-codeql.es.md](../architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md) |
| Gates de Calidad SDLC | Estándar | **R** | [gates-calidad.es.md](../governance/sdlc/gates-calidad.es.md) |
| Buenas Prácticas de Documentación SDLC | Estándar | **R** | [mejores-practicas-documentacion-sdlc.es.md](../governance/sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) |
| Guía de Pruebas de Contrato | Estándar | C | [guia-pruebas-contrato.es.md](../governance/standards/engineering/guia-pruebas-contrato.es.md) |
| Evaluación de Riesgo de Proveedor | Estándar | O | [evaluacion-riesgo-proveedor.es.md](../governance/standards/engineering/evaluacion-riesgo-proveedor.es.md) |

### Platform-specific

| Documento | Runtime | Req | Ubicación |
| :-------- | :------ | :-: | :-------- |
| Patrones Canónicos Node.js (3) | Node.js | O | [canonical-patterns/nodejs/README.md](../architecture/canonical-patterns/nodejs/README.md) |
| Patrones Canónicos .NET (3) | .NET | O | [canonical-patterns/dotnet/README.md](../architecture/canonical-patterns/dotnet/README.md) |
| Patrones Canónicos Android (2) | Android | O | [canonical-patterns/android/README.md](../architecture/canonical-patterns/android/README.md) |

</details>

---

## 5. Fase 4 — Validación y QA

<details>
<summary><strong>Expandir documentos</strong></summary>

**Gate de salida:** RC Sellado

### Core (Agnóstico)

Secuencia de lectura: reporte → gates → seguridad → estrategia de pruebas → opcionales. Seguridad: leer primero la [Estrategia](../governance/sdlc/estrategia-seguridad.es.md) (flujo paso a paso), luego el [Plan](../governance/standards/testing/plan-seguridad.es.md) (herramientas y controles).

| Documento | Tipo | Req | Ubicación |
| :-------- | :--- | :-: | :-------- |
| Reporte Resumen de Pruebas | Plantilla | **R** | [plantilla-reporte-resumen-pruebas.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md) |
| Gates de Calidad SDLC | Estándar | **R** | [gates-calidad.es.md](../governance/sdlc/gates-calidad.es.md) |
| Estrategia de Pruebas de Seguridad | Guía | **R** | [estrategia-seguridad.es.md](../governance/sdlc/estrategia-seguridad.es.md) |
| Plan de Pruebas de Seguridad | Plantilla | **R** | [plan-seguridad.es.md](../governance/standards/testing/plan-seguridad.es.md) |
| ADR-0009 — Gestión de Vulnerabilidades en Dependencias | Decisión | R* | [adrs/core/0009-gestion-vulnerabilidades-dependencias-estrictas.es.md](../architecture/adrs/core/0009-gestion-vulnerabilidades-dependencias-estrictas.es.md) |
| ADR-0005 — Pipeline CI/CD con CodeQL | Decisión | R* | [adrs/core/0005-ci-cd-calidad-codeql.es.md](../architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md) |
| ADR-0018 — Pirámide de Pruebas | Decisión | **R** | [adrs/core/0018-piramide-pruebas-gates-calidad.es.md](../architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md) |
| ADR-0052 — Aislamiento de Pruebas Unitarias | Decisión | **R** | [adrs/core/0052-estrategia-aislamiento-pruebas-unitarias.es.md](../architecture/adrs/core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) |
| ADR-0053 — Pruebas de Integración y E2E | Decisión | **R** | [adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md](../architecture/adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md) |
| Guía de Pruebas de Contrato | Estándar | C | [guia-pruebas-contrato.es.md](../governance/standards/engineering/guia-pruebas-contrato.es.md) |
| ADR-0037 — Estrategia de Rendimiento y Caos | Decisión | O | [adrs/core/0037-estrategia-rendimiento-concurrencia-caos.es.md](../architecture/adrs/core/0037-estrategia-rendimiento-concurrencia-caos.es.md) |
| Evaluación de Riesgo de Proveedor | Estándar | O | [evaluacion-riesgo-proveedor.es.md](../governance/standards/engineering/evaluacion-riesgo-proveedor.es.md) |

</details>

---

## 6. Fase 5 — Entrega y Operaciones

<details>
<summary><strong>Expandir documentos</strong></summary>

**Gate de salida:** Producción Activa — Monitoreo Nominal

### Core (Agnóstico)

Secuencia de lectura: release → operaciones → infraestructura → observabilidad → resiliencia → opcionales.

| Documento | Tipo | Req | Ubicación |
| :-------- | :--- | :-: | :-------- |
| Notas de Lanzamiento | Plantilla | **R** | [plantilla-notas-lanzamiento.es.md](../governance/sdlc/04-plantillas-artefactos/plantilla-notas-lanzamiento.es.md) |
| Plan de Despliegue | Plantilla | **R** | [plantilla-plan-despliegue.es.md](../governance/standards/engineering/plantilla-plan-despliegue.es.md) |
| Guía Post-Despliegue | Guía | **R** | [guia-post-despliegue.es.md](../governance/standards/engineering/guia-post-despliegue.es.md) |
| Buenas Prácticas de Documentación SDLC | Estándar | **R** | [mejores-practicas-documentacion-sdlc.es.md](../governance/sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) |
| ADR-0005 — Pipeline CI/CD | Decisión | **R** | [adrs/core/0005-ci-cd-calidad-codeql.es.md](../architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md) |
| Hub de Operaciones | Estándar | **R** | [operations/README.md](../operations/README.md) |
| Hub de Infraestructura | Estándar | **R** | [infrastructure/README.md](../infrastructure/README.md) |
| Estrategia de Monitoreo | Guía | **R** | [estrategia-monitoreo.es.md](../governance/standards/engineering/estrategia-monitoreo.es.md) |
| ADR-0013 — Topología Cloud y DR | Decisión | **R** | [adrs/core/0013-topologia-infraestructura-cloud-dr.es.md](../architecture/adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) |
| Flujo de Arquitectura de Observabilidad | Blueprint | O | [flujo-arquitectura-observabilidad.es.md](../architecture/flujo-arquitectura-observabilidad.es.md) |
| ADR-0007 — Observabilidad con OTel y Loki | Decisión | **R** | [adrs/nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md](../architecture/adrs/nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md) |
| Playbook de Observabilidad | Estándar | O | [playbook-observabilidad.es.md](../governance/standards/engineering/playbook-observabilidad.es.md) |
| Escenarios de Despliegue Multi-Cloud | Estándar | O | [escenarios-despliegue-multinube.es.md](../architecture/escenarios-despliegue-multinube.es.md) |
| Estrategia de Base de Datos | Guía | O | [estrategia-base-datos.es.md](../governance/standards/engineering/estrategia-base-datos.es.md) |

</details>

---

## 7. Transversales

<details>
<summary><strong>Expandir documentos</strong></summary>

Documentos que aplican a todo el ciclo de vida, sin fase específica.

| Documento | Tipo | Ubicación |
| :-------- | :--- | :-------- |
| Modelo de Trazabilidad SDLC | Estándar | [modelo-trazabilidad.es.md](../governance/sdlc/modelo-trazabilidad.es.md) |
| Taxonomía de Repositorio | Estándar | [taxonomia-repositorio.md](../governance/standards/taxonomia-repositorio.md) |
| Guía de Herencia para Repositorios Satélite | Estándar | [guia-herencia-repositorio-hijo.md](../governance/standards/onboarding/guia-herencia-repositorio-hijo.md) |
| Estrategia de Auditoría y Versionado | Estándar | [estrategia-auditoria-release.es.md](../governance/standards/estrategia-auditoria-release.es.md) |
| Flujo Asistido por Agentes de IA | Guía | [README.md](../flujo-asistido-ai/README.md) |
| Informe SCM y DevSecOps | Informe ejecutivo | [informe-analisis-scm-devsecops.es.md](../governance/informes-ejecutivos/informe-analisis-scm-devsecops.es.md) |
| Plan de Adquisición de Licencias de IA | Informe ejecutivo | [informe-adquisicion-licencias-ia.es.md](../governance/informes-ejecutivos/informe-adquisicion-licencias-ia.es.md) |
| Resumen de Inversión 2026-2029 | Informe ejecutivo | [resumen-ejecutivo-inversion.es.md](../governance/informes-ejecutivos/resumen-ejecutivo-inversion.es.md) |

</details>

---

## 8. Conocimiento del Dominio

<details>
<summary><strong>Expandir documentos</strong></summary>

| Área | Punto de Entrada | Propósito |
| :--- | :--- | :--- |
| Hub de Conocimiento | [README.md](../knowledge/README.md) | Portal del conocimiento de dominio |
| Dominio (contextos, glosario, stakeholders) | [README.md](../knowledge/dominio/README.md) | Modelos y lenguaje ubicuo |
| Casos de Adopción | [README.md](../knowledge/adoption-cases/README.md) | Lecciones aprendidas |
| Investigación | [README.md](../knowledge/research/README.md) | Research técnico y de dominio |

</details>

---

## 9. Artefactos de Planificación

<details>
<summary><strong>Expandir documentos</strong></summary>

| Área | Propósito |
| :--- | :--- |
| [`docs/planning-artifacts/`](../../docs/README.md) | PRDs, épicas, historias, research de BMAD |

</details>

---

## 10. Herramientas, CI y Reglas Automatizadas

<details>
<summary><strong>Expandir documentos</strong></summary>

| Área | Punto de Entrada |
| :--- | :--- |
| Reglas globales del estándar | Provistas por el plugin `unimar-core` (`${CLAUDE_PLUGIN_ROOT}/rules/global-rules.md`) |
| Glosario de terminología | Provisto por el plugin `unimar-core` (`${CLAUDE_PLUGIN_ROOT}/rules/terminology-glossary.md`) |
| Validador de documentación | `node "$UNIMAR_CORE/scripts/validate-docs.mjs"` (provisto por el plugin `unimar-core`) |
| Workflows CI | [`.github/workflows/docs.yml`](../../.github/workflows/docs.yml) |
| Hook de pre-commit | [`.husky/pre-commit`](../../.husky/pre-commit) |

</details>

---

## 11. Licencias y Referencias

<details>
<summary><strong>Expandir documentos</strong></summary>

| Documento | Propósito |
| :--- | :--- |
| [LICENSE](../../license/LICENSE) | Licencia MIT (Copyright Unimar) |
| [NOTICE.md](../../license/NOTICE.md) | Atribución open source |
| [DISCLAIMER.md](../../license/DISCLAIMER.md) | Garantía y responsabilidad |
| BMAD Method | <https://docs.bmad-method.org/> |

</details>

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-11
</p>
