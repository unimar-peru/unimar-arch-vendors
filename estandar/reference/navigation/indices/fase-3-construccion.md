# Fase 3 — Construcción

> **Gate de salida:** Build Exitoso — Merge de PR Autorizado

## Objetivo

Implementar las historias técnicas siguiendo los estándares de ingeniería, aplicando CI/CD, gates de calidad y disciplina de código limpio. Cada merge debe cumplir las métricas bloqueantes antes de avanzar a validación.

<details>
<summary><strong>Desarrollo e Implementación</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Plantilla de Historia Técnica](../../governance/sdlc/04-plantillas-artefactos/plantilla-historia-tecnica.es.md) | Plantilla | **R** | Descomposición técnica con criterios DoD |
| [Framework SDLC Orientado a Construcción](../../governance/sdlc/02-ingenieria/framework-sdlc-enfoque-construccion.es.md) | Estándar | **R** | Ciclo de construcción, métricas y DoD |
| [Manifiesto de Ingeniería](../../governance/standards/engineering/manifiesto-ingenieria.md) | Estándar | **R** | Principios SOLID, DRY, KISS, YAGNI |
| [Estándar de Diseño de API](../../governance/standards/engineering/estandar-diseno-api.es.md) | Estándar | **R** | Formato de respuesta, errores, paginación, versionado, idempotencia, OpenAPI |
| [Estrategia de Frontend Web](../../governance/standards/engineering/estrategia-frontend-web.es.md) | Guía | **R** | React + Vite + TypeScript, Atomic Design, pruebas, rendimiento, seguridad |
| [Estrategia de Integraciones Corporativas](../../governance/standards/engineering/estrategia-integraciones.es.md) | Guía | **R** | Integración con SUNAT, SAP, clientes B2B, proveedores; ACL, seguridad, monitoreo |
| [Estrategia de Monitoreo](../../governance/standards/engineering/estrategia-monitoreo.es.md) | Guía | **R** | Stack LGTM + Prometheus, métricas RED/USE, dashboards, alertas, SLIs/SLOs |
| [Patrones Canónicos de Implementación](../../architecture/canonical-patterns/README.md) | Referencia | O | Implementaciones por runtime gobernadas por ADR |

</details>

<details>
<summary><strong>CI/CD y Calidad</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Estrategia de Pruebas](../../governance/sdlc/estrategia-pruebas.es.md) | Guía | **R** | Metodología 70/20/10, secuencia, flujos, GitFlow, tipos de prueba por stack |
| [Gates de Calidad SDLC](../../governance/sdlc/gates-calidad.es.md) | Estándar | **R** | Cobertura ≥ 80%, complejidad ≤ 15, cero CVEs |
| [Guía de Pruebas de Contrato](../../governance/standards/engineering/guia-pruebas-contrato.es.md) | Estándar | C | Contract testing entre servicios con Pact |
| [Estrategia de Ramificación GitFlow](../../governance/sdlc/estrategia-ramificacion.es.md) | Guía | **R** | Modelo de ramas, flujo de promoción, Pull Requests, estándar de commits y herramientas. Controla merges, gates de CI/CD y branch protection rules |

> Las decisiones arquitectónicas sobre estos temas se consultan en el [Hub de ADRs](../../architecture/adrs/README.md) como referencia complementaria.

</details>

<details>
<summary><strong>Base de Datos</strong></summary>

### Propósito

Seleccionar el motor de base de datos correcto según el runtime y diseñar esquemas que garanticen integridad, rendimiento y seguridad.

### ¿Por qué?

- Cada runtime tiene un motor óptimo: SQL Server para .NET, PostgreSQL para Node.js, SQLite (Room) para Android.
- Los errores de diseño de BD (desnormalización excesiva, falta de índices, arreglos infinitos en NoSQL) son la segunda causa más común de incidentes en producción.
- La seguridad en BD (RLS, cifrado, auditoría) es un gate obligatorio de Fase 4.

### ¿Cuándo?

| Momento | Acción | Responsable |
| :------ | :----- | :---------- |
| **F2 — Diseño** | Seleccionar motor BD según runtime. Diseñar esquema en 3NF | Arquitecto + DBA |
| **F3 — Construcción** | Implementar migraciones, índices, RLS policies, cifrado | Desarrollador |
| **F4 — Validación** | Verificar seguridad (CIS Benchmarks, auditoría). Ver [Plan de Seguridad](../../governance/standards/testing/plan-seguridad.es.md) | Security Lead |
| **F5 — Operaciones** | Configurar backups, monitoreo, DR. Ver [Hub de Infraestructura](../../infrastructure/README.md) | DevOps + DBA |

### Documentos

| Documento | Tipo | R/O | Propósito | Estándar |
| :-------- | :--- | :-: | :-------- | :------- |
| [Estrategia de Base de Datos](../../governance/standards/engineering/estrategia-base-datos.es.md) | Guía | **R** | Selección de motor por runtime, diseño 3NF/NoSQL, seguridad, herramientas, operaciones | ADR-0051, ADR-0054, ISO 25010 |
| [Plan de Pruebas de Seguridad](../../governance/standards/testing/plan-seguridad.es.md) | Plantilla | **R** | Seguridad en BD: CIS Benchmarks, cifrado, auditoría | CIS Benchmarks, ISO 27001 |
| [Hub de Infraestructura](../../infrastructure/README.md) | Estándar | **R** | Topología multi-AZ, backups, DR por motor BD | ADR-0013 |

### Motores de Base de Datos por Stack

| Stack | Motor Obligatorio | ORM / Driver | Alternativa | Cifrado | RLS |
| :---- | :---------------- | :----------- | :---------- | :------ | :-: |
| **.NET / C#** | Microsoft SQL Server | EF Core + Dapper | PostgreSQL (con ADR) | TDE | ✅ |
| **Node.js / TypeScript** | PostgreSQL 16+ | TypeORM / Drizzle | MongoDB (documental) | pgcrypto | ✅ |
| **Android / Kotlin** | SQLite (Room) + SQLCipher | Room | — | SQLCipher | — |

> Ver [Estrategia de Base de Datos](../../governance/standards/engineering/estrategia-base-datos.es.md) para detalles completos de diseño, operaciones y seguridad.

</details>

<details>
<summary><strong>Estándares de Código</strong></summary>

> Los estándares se organizan por stack tecnológico. Cada stack tiene un perfil autorizado con su matriz tecnológica y un resumen desglosado por capas (Frontend, Backend, Base de Datos, AOP, Monitoreo, Seguridad, etc.). Las decisiones arquitectónicas (ADRs) se consultan en el [Hub de ADRs](../../architecture/adrs/README.md).

| Stack | Perfil Autorizado | Resumen por Capas | Patrones de Implementación | ADRs Relacionados |
| :---- | :---------------- | :---------------- | :------------------------- | :---------------- |
| **Agnóstico** (todos los stacks) | [Línea Base Universal](../../architecture/stack-tecnologico-autorizado-agnostico.es.md) | — | — | [Core ADRs](../../architecture/adrs/README.md) |
| **.NET / C#** | [Stack Tecnológico .NET](../../architecture/stack-tecnologico-autorizado-dotnet.es.md) | [Cheat Sheet .NET](../../architecture/resumen-stack-tecnologico-dotnet.es.md) | [Patrones .NET](../../architecture/canonical-patterns/dotnet/README.md) | [ADRs .NET](../../architecture/adrs/dotnet/README.md) |
| **Node.js / TypeScript** | [Stack Tecnológico Node.js](../../architecture/stack-tecnologico-autorizado-nodejs.es.md) | [Cheat Sheet Node.js](../../architecture/resumen-stack-tecnologico.es.md) | [Patrones Node.js](../../architecture/canonical-patterns/nodejs/README.md) | [ADRs Node.js](../../architecture/adrs/nodejs/README.md) |
| **Android / Kotlin** | [Stack Tecnológico Android](../../architecture/stack-tecnologico-autorizado-android.es.md) | [Cheat Sheet Android](../../architecture/resumen-stack-tecnologico-android.es.md) | [Patrones Android](../../architecture/canonical-patterns/android/README.md) | [ADRs Android](../../architecture/adrs/android/README.md) |

</details>

<details>
<summary><strong>Documentación</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Mejores Prácticas de Documentación SDLC](../../governance/sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) | Estándar | **R** | El delta documental es parte del DoD |

</details>

<details>
<summary><strong>Opcionales / Condicionales</strong></summary>

> Los ADRs opcionales (CQRS, Sagas, Outbox, DDD táctico) se consultan en el [Hub de ADRs](../../architecture/adrs/README.md), donde cada decisión tiene su contexto y estado. Esta sección solo incluye documentos no-ADR.

| Documento | Tipo | R/O/C | Propósito | Cuándo usarlo |
| :-------- | :--- | :---- | :-------- | :------------ |
| [Evaluación de Riesgo de Proveedor](../../governance/standards/engineering/evaluacion-riesgo-proveedor.es.md) | Estándar | O | Evaluación de terceros | Al introducir librerías externas |

</details>

---

[Volver al README principal](../../../README.md)
