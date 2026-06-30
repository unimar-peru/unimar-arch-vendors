# Inicio Rápido — Unimar Arch

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Inicio%20R%C3%A1pido-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../README.md) / Inicio Rápido**

Rutas de lectura mínimas por rol para orientarse en el corpus Unimar Arch en menos de 30 minutos.

> **Nota sobre BMAD:** Las 59 skills de BMAD en `.opencode/commands/` *augmentan* el SDLC — aceleran la producción de artefactos (PRD, historias, ADRs) pero no lo reemplazan. El SDLC canónico es la fuente de verdad. Usa BMAD para producir artefactos más rápido; usa este corpus para entender los estándares que esos artefactos deben cumplir.

---

## Rutas por Rol

### Nuevo en el Proyecto

<details>
<summary><strong>Objetivo:</strong> Orientarse en el corpus en los primeros 30 minutos.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [README principal](../../README.md) | Portal público — secciones de Arquitectura y Gobernanza. |
| 2 | [Manifiesto de Ingeniería](../governance/standards/engineering/manifiesto-ingenieria.md) | Los 7 principios que definen la cultura del equipo. |
| 3 | [Framework SDLC](../governance/sdlc/02-ingenieria/framework-sdlc-enfoque-construccion.es.md) | Cómo funciona el ciclo de vida de desarrollo. |
| 4 | [Stack Tecnológico Autorizado (Agnóstico)](../architecture/stack-tecnologico-autorizado-agnostico.es.md) | Baseline tecnológica que todo producto debe cumplir. |
| 5 | Volver a esta guía y seguir la ruta de tu rol. | — |

</details>

---

### Director de Tecnología / Architecture Board

<details>
<summary><strong>Objetivo:</strong> Evaluar el estado del estándar, su evolución y los mecanismos de gobernanza.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | Visión de la Suite de Sistemas | Landscape completo de sistemas UNIMAR. |
| 2 | [Directivas Arquitectónicas](../governance/standards/vision/directivas-arquitectonicas.es.md) | Restricciones y principios de largo plazo. |
| 3 | [Manifiesto de Ingeniería](../governance/standards/engineering/manifiesto-ingenieria.md) | Cultura y principios del equipo de ingeniería. |
| 4 | [Matriz de Madurez](../governance/standards/vision/matriz-madurez.es.md) | Evaluación ACMM/TOGAF de madurez arquitectónica actual. |
| 5 | [Roadmap de Estrategia Evolutiva](../governance/standards/vision/roadmap-estrategia-evolutiva.es.md) | Roadmap técnico fase a fase con KPIs medibles. |

</details>

---

### Arquitecto

<details>
<summary><strong>Objetivo:</strong> Entender la arquitectura de referencia, las decisiones vigentes y las restricciones no negociables.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [Directivas Arquitectónicas](../governance/standards/vision/directivas-arquitectonicas.es.md) | Restricciones no negociables que acotan todas las decisiones. |
| 2 | [Blueprint de Referencia](../architecture/blueprints/blueprint-referencia.es.md) | Modelo C4 canónico y topología de referencia corporativa. |
| 3 | [Registro de ADRs](../architecture/adrs/README.md) | Decisiones arquitectónicas vigentes con estado y dominio. |
| 4 | Hoja de Ruta de la Suite | Fases, dependencias y orden de construcción incremental. |
| 5 | [Mapeo SDLC–Artefactos](../governance/sdlc/mapeo-artefactos-sdlc.es.md) | Qué producir en cada fase antes de activar el gate de salida. |

</details>

---

### Product Owner

<details>
<summary><strong>Objetivo:</strong> Entender los artefactos de producto que debe producir en cada fase y los gates que los controlan.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [Framework SDLC](../governance/sdlc/02-ingenieria/framework-sdlc-enfoque-construccion.es.md) | Visión general del ciclo de vida: fases, gates y artefactos. |
| 2 | [Lienzo de Descubrimiento](../governance/sdlc/04-plantillas-artefactos/plantilla-lienzo-descubrimiento.es.md) | Explora el problema: iniciativa, dolor del cliente y valor esperado. |
| 3 | [PRD](../governance/sdlc/04-plantillas-artefactos/plantilla-prd.es.md) | Documento de requisitos de producto — requerido para gate F1. |
| 4 | [Historia de Usuario](../governance/sdlc/04-plantillas-artefactos/plantilla-historia-usuario.es.md) | Historias con criterios BDD — requeridas para gate F1. |
| 5 | [Glosario Corporativo](../governance/glosario.md) | Terminología controlada del repositorio y del dominio. |

</details>

---

### Desarrollador Backend — .NET / C#

<details>
<summary><strong>Objetivo:</strong> Implementar siguiendo el stack autorizado, los patrones canónicos y las ADRs de runtime .NET.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [Stack Tecnológico Autorizado .NET](../architecture/stack-tecnologico-autorizado-dotnet.es.md) | Solo pueden usarse tecnologías de esta lista. |
| 2 | [ADR-0041 — Arquitectura Backend Canónica .NET](../architecture/adrs/dotnet/0041-arquitectura-backend-canonica-dotnet.es.md) | Estructura de capas obligatoria para servicios .NET. |
| 3 | Patrones Canónicos .NET | CP-01 (contexto request), CP-02 (logging PII-safe), CP-04 (AOP logging). |
| 4 | [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Umbrales bloqueantes: cobertura ≥ 80%, complejidad ≤ 15, cero CVEs. |
| 5 | [Manifiesto de Ingeniería](../governance/standards/engineering/manifiesto-ingenieria.md) | Principios de ingeniería que gobiernan el código. |

</details>

---

### Desarrollador Backend — Node.js / TypeScript

<details>
<summary><strong>Objetivo:</strong> Implementar siguiendo la arquitectura hexagonal NestJS y los estándares TypeScript del corpus.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [Stack Tecnológico Autorizado Node.js](../architecture/stack-tecnologico-autorizado-nodejs.es.md) | Solo pueden usarse tecnologías de esta lista. |
| 2 | [ADR-0002 — Arquitectura Limpia con NestJS](../architecture/adrs/nodejs/0002-arquitectura-limpia-nestjs.es.md) | Arquitectura hexagonal obligatoria (Ports and Adapters). |
| 3 | [ADR-0003 — TypeScript Estricto](../architecture/adrs/nodejs/0003-estandares-estrictos-typescript.es.md) | Configuración estricta de TypeScript y ESLint. |
| 4 | [ADR-0038 — Manejo de Errores Result Pattern](../architecture/adrs/nodejs/0038-estrategia-manejo-errores-patron-result.es.md) | Patrón de errores tipados obligatorio. |
| 5 | Patrones Canónicos Node.js | CP-05 (contexto CLS), CP-06 (logging PII-safe), CP-08 (Result pattern). |
| 6 | [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Umbrales bloqueantes: cobertura ≥ 80%, complejidad ≤ 15, cero CVEs. |
| 7 | [Manifiesto de Ingeniería](../governance/standards/engineering/manifiesto-ingenieria.md) | Principios de ingeniería que gobiernan el código. |

</details>

---

### Desarrollador Mobile — Android / Kotlin

<details>
<summary><strong>Objetivo:</strong> Implementar la app móvil siguiendo la arquitectura canónica Android.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [Stack Tecnológico Autorizado Android](../architecture/stack-tecnologico-autorizado-android.es.md) | Solo pueden usarse tecnologías de esta lista. |
| 2 | [ADR-0042 — Arquitectura Móvil Canónica Android](../architecture/adrs/android/0042-arquitectura-movil-canonica-android.es.md) | Estructura de capas obligatoria para la app Android. |
| 3 | [ADR-0004 — Resiliencia Frontend Offline](../architecture/adrs/nodejs/0004-resiliencia-frontend-offline.es.md) | Estrategia de persistencia offline obligatoria. |
| 4 | Patrones Canónicos Android | CP-09 (Room offline-first), CP-10 (almacenamiento seguro de tokens). |
| 5 | [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Umbrales bloqueantes aplicables al pipeline Android. |
| 6 | [Manifiesto de Ingeniería](../governance/standards/engineering/manifiesto-ingenieria.md) | Principios de ingeniería que gobiernan el código. |

</details>

---

### QA Engineer

<details>
<summary><strong>Objetivo:</strong> Entender los gates de calidad, la pirámide de testing y los artefactos de evidencia requeridos por fase.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Umbrales canónicos y política de waivers. |
| 2 | [ADR-0018 — Pirámide de Pruebas](../architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md) | Distribución objetivo: 70% unitarias / 20% integración / 10% E2E. |
| 3 | [ADR-0052 — Aislamiento de Pruebas Unitarias](../architecture/adrs/core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) | Disciplina de mocks y stubs. |
| 4 | [ADR-0053 — Pruebas de Integración y E2E](../architecture/adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md) | Testcontainers y alcance E2E. |
| 5 | [Plantilla Test Summary Report](../governance/sdlc/04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md) | Formato del artefacto requerido para el gate RC Sellado. |

</details>

---

### DevOps / Platform Engineer

<details>
<summary><strong>Objetivo:</strong> Entender la topología de infraestructura, el pipeline CI/CD y los requisitos de observabilidad en producción.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [ADR-0005 — Pipeline CI/CD con CodeQL](../architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md) | Gates de calidad automáticos que debe soportar el pipeline. |
| 2 | [ADR-0013 — Topología Cloud y DR](../architecture/adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) | Topología de despliegue objetivo y runbook de DR. |
| 3 | [ADR-0007 — Observabilidad OTel y Loki](../architecture/adrs/nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md) | Stack de observabilidad obligatorio en producción. |
| 4 | [Hub de Infraestructura](../infrastructure/README.md) | Punto de entrada a las especificaciones de infraestructura. |
| 5 | [Hub de Operaciones](../operations/README.md) | Runbooks, SLIs/SLOs y guías de troubleshooting. |

</details>

---

### Revisor de Seguridad

<details>
<summary><strong>Objetivo:</strong> Auditar las decisiones de seguridad, gestión de vulnerabilidades y autorización del corpus.</summary>

| Paso | Documento | Por qué |
| :--: | :-------- | :------ |
| 1 | [ADR-0009 — Gestión de Vulnerabilidades](../architecture/adrs/core/0009-gestion-vulnerabilidades-dependencias-estrictas.es.md) | Política de dependencias fijadas y escaneo CVE automatizado. |
| 2 | [ADR-0020 — Abstracción de Identity Provider](../architecture/adrs/core/0020-estrategia-abstraccion-proveedor-identidad.es.md) | Estrategia de identidad enchufable. |
| 3 | [ADR-0012 — Autorización RBAC/ABAC](../architecture/adrs/nodejs/0012-autorizacion-avanzada-rbac-abac.es.md) | Modelo de autorización granular. |
| 4 | [ADR-0026 — MFA y Autenticación Adaptativa](../architecture/adrs/nodejs/0026-autenticacion-adaptativa-mfa-passwordless.es.md) | Factores de autenticación requeridos. |
| 5 | [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Política de cero CVEs high/critical en releases. |

</details>

---

## Por Objetivo

<details>
<summary><strong>10 puntos de entrada por tarea: arquitectura, ADRs, patrones, BMAD, glosario</strong></summary>

| Objetivo | Documento de inicio |
| :------- | :------------------ |
| Orientarse en el corpus (30 min) | [Inicio Rápido — Nuevo en el Proyecto](#nuevo-en-el-proyecto) |
| Entender la arquitectura global | [Blueprint de Referencia](../architecture/blueprints/blueprint-referencia.es.md) |
| Conocer las decisiones técnicas vigentes | [Registro de ADRs](../architecture/adrs/README.md) |
| Implementar siguiendo patrones canónicos | [Patrones Canónicos](../architecture/canonical-patterns/README.md) |
| Redactar una ADR | [Plantilla de ADR](../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md) |
| Planificar con BMAD | [docs/README.md](../../docs/README.md) |
| Contribuir al repositorio | [Taxonomía de Repositorio](../governance/standards/taxonomia-repositorio.md) |
| Ver qué artefactos producir en cada fase | [Mapeo SDLC–Artefactos](../governance/sdlc/mapeo-artefactos-sdlc.es.md) |
| Entender la trazabilidad entre artefactos | [Modelo de Trazabilidad](../governance/sdlc/modelo-trazabilidad.es.md) |
| Ver el glosario de términos | [Glosario Corporativo](../governance/glosario.md) |

</details>

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-08
</p>
