# Matriz de Decisiones Arquitectónicas

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Matriz%20de%20ADRs-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase SDLC:** 2 — Diseño y Arquitectura (requerido)
> **Puerta de salida:** Baseline de Diseño Aprobado
> **Padre:** [Hub de ADRs](./README.md)
> **Audiencia:** Architecture Board, Tech Leads, Desarrolladores

---

## Propósito

La Matriz de ADRs es el catálogo de estado de todas las decisiones arquitectónicas vigentes del corpus Unimar Arch. Su función es **prevenir decisiones duplicadas o contradictorias**: antes de redactar una nueva ADR, el autor debe consultar esta matriz para verificar que la decisión no existe, no fue supersedida por otra, y no entra en conflicto con decisiones activas.

**Regla de uso:** Si la decisión que buscas ya existe en estado `Aceptado`, aplícala. Si está `Supersedida`, usa la ADR que la reemplaza. Si está `Deprecada`, registra en `DECISIONS.md` la razón de su remoción.

---

## Leyenda de Estados

| Estado | Significado |
|---|---|
| `Aceptado` | Decisión vigente y aplicable. Debe seguirse. |
| `Borrador` | En revisión por el Architecture Board. No aplicar hasta aprobación. |
| `Pendiente de Importación` | Referencia anticipada o stub local. No aplicar como decisión vinculante hasta completar y aprobar la ADR. |
| `Supersedido` | Reemplazado por otra ADR indicada. Seguir la ADR de reemplazo. |
| `Deprecado` | Retirado sin reemplazo directo. Ver contexto en `DECISIONS.md`. |

---

## Vista por Dominio

### Infraestructura y Plataforma

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0001](core/0001-orquestacion-monorepo-nx.es.md) | Monorepo Orchestration — Nx | `Aceptado` | Agnóstico |
| [ADR-0005](core/0005-ci-cd-calidad-codeql.es.md) | CI/CD Quality — CodeQL — superseído por ADR-0106 | `Supersedido` | Agnóstico |
| [ADR-0013](core/0013-topologia-infraestructura-cloud-dr.es.md) | Cloud Infrastructure Topology — DR | `Aceptado` | Agnóstico |
| [ADR-0028](core/0028-infraestructura-hibrida-autogestionada.es.md) | Self-Hosted Hybrid Infrastructure | `Aceptado` | Agnóstico |
| [ADR-0039](core/0039-switcher-abstraccion-topologia-despliegue.es.md) | Deployment Topology Abstraction Switcher | `Aceptado` | Agnóstico |

### Arquitectura de Aplicación

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0002](nodejs/0002-arquitectura-limpia-nestjs.es.md) | Clean Architecture — NestJS | `Aceptado` | Node.js |
| [ADR-0006](core/0006-transicion-futura-microservicios-dapr.es.md) | Future Microservices Transition — Dapr | `Aceptado` | Agnóstico |
| [ADR-0008](nodejs/0008-evolucion-multimodulo-progresiva-gateway-bff.es.md) | Progressive Multimodule Evolution — Gateway/BFF | `Aceptado` | Node.js |
| [ADR-0019](core/0019-patrones-diseno-tactico-escalabilidad-futura.es.md) | Tactical Design Patterns — Future-Proofing | `Aceptado` | Agnóstico |
| [ADR-0029](nodejs/0029-libreria-primitivas-ddd-tactico.es.md) | Tactical DDD Primitives Library | `Aceptado` | Node.js |
| [ADR-0040](core/0040-contratos-seleccion-multiruntime.es.md) | Multi-Runtime Selection Contracts | `Aceptado` | Agnóstico |
| [ADR-0041](dotnet/0041-arquitectura-backend-canonica-dotnet.es.md) | Canonical .NET Backend Architecture | `Aceptado` | .NET |
| [ADR-0042](android/0042-arquitectura-movil-canonica-android.es.md) | Canonical Android Mobile Architecture | `Aceptado` | Android |
| [ADR-0045](core/0045-criterios-extraccion-microservicios.es.md) | Microservice Extraction Readiness Criteria | `Aceptado` | Agnóstico |
| [ADR-0047](core/0047-patrones-arquitectonicos-monolito-soa-microservicios.es.md) | Architectural Patterns — Monolith / SOA / Microservices | `Aceptado` | Agnóstico |
| [ADR-0055](core/0055-estrategia-arquitectura-microfrontends.es.md) | Estrategia de Arquitectura de Microfrontends | `Borrador` | Agnóstico |

### APIs y Protocolos

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0027](nodejs/0027-api-gateway-dual-protocolo-rest-grpc.es.md) | Dual-Protocol REST/gRPC API Gateway | `Aceptado` | Node.js |
| [ADR-0030](core/0030-api-gateway-ingress-vs-nestjs.es.md) | API Gateway — Ingress vs NestJS | `Aceptado` | Agnóstico |
| [ADR-0032](core/0032-matriz-decision-protocolos-api-rest-grpc-graphql.es.md) | API Protocol Decision Matrix — REST/gRPC/GraphQL | `Aceptado` | Agnóstico |

### Seguridad e Identidad

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0009](core/0009-gestion-vulnerabilidades-dependencias-estrictas.es.md) | Strict Dependency Pinning & Vulnerability Management | `Aceptado` | Agnóstico |
| [ADR-0106](core/0106-seguridad-calidad-local-first.es.md) | Seguridad y Calidad Local-First — supersede ADR-0005 | `Aceptado` | Agnóstico |
| [ADR-0012](nodejs/0012-autorizacion-avanzada-rbac-abac.es.md) | Advanced Authorization — RBAC/ABAC | `Aceptado` | Node.js |
| [ADR-0020](core/0020-estrategia-abstraccion-proveedor-identidad.es.md) | Identity Provider Abstraction Strategy | `Aceptado` | Agnóstico |
| [ADR-0021](nodejs/0021-compilacion-graph-auth-alto-rendimiento.es.md) | High-Performance Auth & Graph Compilation | `Aceptado` | Node.js |
| [ADR-0022](nodejs/0022-auth-contextual-proyecciones-plugables.es.md) | Contextual Auth & Pluggable Projections | `Aceptado` | Node.js |
| [ADR-0026](nodejs/0026-autenticacion-adaptativa-mfa-passwordless.es.md) | MFA, Passwordless & Adaptive Authentication | `Aceptado` | Node.js |
| [ADR-0044](core/0044-estrategia-persistencia-seguridad-configurable.es.md) | Configurable Security Persistence Strategy | `Deprecado` | Agnóstico |

### Persistencia y Base de Datos

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0031](core/0031-esquema-por-contexto-catalogo-eventos-dominio.es.md) | Schema per Context — Domain Event Catalog | `Aceptado` | Agnóstico |
| [ADR-0043](nodejs/0043-estrategia-acceso-datos-orm.es.md) | Data Access — ORM Strategy | `Aceptado` | Node.js |
| [ADR-0051](core/0051-estrategia-motor-base-datos-empresarial.es.md) | Estrategia de Motor de Base de Datos Empresarial | `Aceptado` | Agnóstico |
| [ADR-0054](core/0054-estandares-diseno-normalizacion-base-datos.es.md) | Estándares de Diseño y Normalización de Base de Datos | `Aceptado` | Agnóstico |

### Multi-Tenancy

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0010](core/0010-estrategia-arquitectura-multitenant.es.md) | Sucursal como Dimensión de Negocio y Contexto de Autorización | `Aceptado` | Agnóstico |

### Eventos y Mensajería

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0015](core/0015-arquitectura-eventos-intradominio.es.md) | Event-Driven Architecture (Intra-Domain) | `Aceptado` | Agnóstico |
| [ADR-0033](core/0033-patron-transactional-outbox.es.md) | Transactional Outbox Pattern — catálogo del patrón | `Aceptado` | Agnóstico |
| [ADR-0034](core/0034-matriz-aplicabilidad-patron-cqrs.es.md) | CQRS Pattern Applicability Matrix | `Pendiente de Importación` | Agnóstico |
| [ADR-0035](core/0035-estrategia-sagas-distribuidas.es.md) | Distributed Saga Pattern Strategy | `Pendiente de Importación` | Agnóstico |
| [ADR-0036](core/0036-estrategia-entrega-bus-mensajes-fifo-dlq.es.md) | Message Bus Delivery Strategy — FIFO/DLQ | `Aceptado` | Agnóstico |

### Caché y Rendimiento

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0014](core/0014-estrategia-cache-distribuido-redis.es.md) | Distributed Caching Strategy — Redis | `Aceptado` | Agnóstico |
| [ADR-0037](core/0037-estrategia-rendimiento-concurrencia-caos.es.md) | Performance, Concurrency & Chaos Strategy | `Pendiente de Importación` | Agnóstico |

### Resiliencia

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0004](nodejs/0004-resiliencia-frontend-offline.es.md) | Frontend Offline Resilience | `Aceptado` | Node.js |
| [ADR-0011](core/0011-patrones-resiliencia-tolerancia-fallos.es.md) | Fault Tolerance & Resiliency Patterns | `Aceptado` | Agnóstico |

### Observabilidad

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0007](nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md) | Observability & Telemetry — Loki/OpenTelemetry | `Aceptado` | Node.js |
| [ADR-0046](core/0046-dapr-observabilidad-unificada.es.md) | Dapr — Observabilidad Unificada | `Aceptado` | Agnóstico |
| [ADR-0064](dotnet/0064-contexto-observabilidad-scope-request-dotnet.es.md) | .NET Request Scope — Observability Context | `Aceptado` | .NET |
| [ADR-0065](dotnet/0065-pipeline-serilog-seguro-pii-dotnet.es.md) | .NET PII-Safe Serilog Pipeline | `Aceptado` | .NET |

### Auditoría

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0016](core/0016-pista-auditoria-inmutable-negocio.es.md) | Immutable Business Audit Trail | `Aceptado` | Agnóstico |

### Feature Flags y Configuración

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0017](core/0017-estrategia-feature-flags.es.md) | Feature Flagging Strategy | `Aceptado` | Agnóstico |
| [ADR-0024](core/0024-plataforma-gestion-configuracion-features.es.md) | Configuration & Feature Management Platform | `Aceptado` | Agnóstico |
| [ADR-0025](core/0025-abstraccion-proveedor-feature-flags.es.md) | Feature Flag Provider Abstraction | `Aceptado` | Agnóstico |
| ADR-0060 | Feature Flags — Gestión Centralizada en UMS | `Aceptado` | Agnóstico |

### Calidad y Testing

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0018](core/0018-piramide-pruebas-gates-calidad.es.md) | Testing Pyramid & Quality Gates | `Aceptado` | Agnóstico |
| [ADR-0052](core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) | Estrategia de Aislamiento de Pruebas Unitarias | `Aceptado` | Agnóstico |
| [ADR-0053](core/0053-estrategia-pruebas-integracion-e2e.es.md) | Estrategia de Pruebas de Integración y E2E | `Aceptado` | Agnóstico |
| [ADR-0105](core/0105-definition-of-release-puertas-verificables.es.md) | Definition of Release — Puertas Verificables | `Borrador` | Agnóstico |

### Estándares de Código y Nomenclatura

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0003](nodejs/0003-estandares-estrictos-typescript.es.md) | Strict TypeScript Standards | `Aceptado` | Node.js |
| [ADR-0038](nodejs/0038-estrategia-manejo-errores-patron-result.es.md) | Error Handling — Result Pattern Strategy | `Aceptado` | Node.js |
| [ADR-0049](core/0049-politica-naming-semantica-codigo-limpio.es.md) | Naming Semantics & Clean Code Policy — superseído por ADR-0056 | `Supersedido` | Agnóstico |
| [ADR-0056](core/0056-convenciones-nombre-diseno-empresarial.es.md) | Clean Code como Base de Ingeniería de la Suite | `Aceptado` | Agnóstico |

### Flujo de Trabajo y Branching

| ADR | Título | Estado | Runtime |
|---|---|---|---|
| [ADR-0050](core/0050-estrategia-ramificacion-gitflow.es.md) | GitFlow Branching Strategy | `Aceptado` | Agnóstico |

---

## Vista por Runtime

### Agnóstico (Core)

| ADR | Título | Estado | Dominio |
|---|---|---|---|
| ADR-0001 | Monorepo Orchestration — Nx | `Aceptado` | Infraestructura |
| ADR-0005 | CI/CD Quality — CodeQL — superseído por ADR-0106 | `Supersedido` | Infraestructura |
| ADR-0006 | Future Microservices Transition — Dapr | `Aceptado` | Arquitectura |
| ADR-0009 | Strict Dependency Pinning | `Aceptado` | Seguridad |
| ADR-0010 | Sucursal como Dimensión de Negocio y Contexto de Autorización | `Aceptado` | Multi-Tenancy |
| ADR-0011 | Fault Tolerance & Resiliency Patterns | `Aceptado` | Resiliencia |
| ADR-0013 | Cloud Infrastructure Topology — DR | `Aceptado` | Infraestructura |
| ADR-0014 | Distributed Caching — Redis | `Aceptado` | Rendimiento |
| ADR-0015 | Event-Driven Architecture | `Aceptado` | Mensajería |
| ADR-0016 | Immutable Business Audit Trail | `Aceptado` | Auditoría |
| ADR-0017 | Feature Flagging Strategy | `Aceptado` | Configuración |
| ADR-0018 | Testing Pyramid & Quality Gates | `Aceptado` | Calidad |
| ADR-0019 | Tactical Design Patterns | `Aceptado` | Arquitectura |
| ADR-0020 | Identity Provider Abstraction | `Aceptado` | Seguridad |
| ADR-0024 | Configuration & Feature Management | `Aceptado` | Configuración |
| ADR-0025 | Feature Flag Provider Abstraction | `Aceptado` | Configuración |
| ADR-0060 | Feature Flags — Gestión Centralizada en UMS | `Aceptado` | Configuración |
| ADR-0028 | Self-Hosted Hybrid Infrastructure | `Aceptado` | Infraestructura |
| ADR-0030 | API Gateway — Ingress vs NestJS | `Aceptado` | APIs |
| ADR-0031 | Schema per Context | `Aceptado` | Persistencia |
| ADR-0032 | API Protocol Decision Matrix | `Aceptado` | APIs |
| ADR-0033 | Transactional Outbox Pattern — catálogo del patrón | `Aceptado` | Mensajería |
| ADR-0034 | CQRS Applicability Matrix | `Pendiente de Importación` | Mensajería |
| ADR-0035 | Distributed Saga Strategy | `Pendiente de Importación` | Mensajería |
| ADR-0036 | Message Bus Delivery — FIFO/DLQ | `Aceptado` | Mensajería |
| ADR-0037 | Performance, Concurrency & Chaos | `Pendiente de Importación` | Rendimiento |
| ADR-0039 | Deployment Topology Switcher | `Aceptado` | Infraestructura |
| ADR-0040 | Multi-Runtime Selection Contracts | `Aceptado` | Arquitectura |
| ADR-0044 | Configurable Security Persistence | `Deprecado` | Seguridad |
| ADR-0045 | Microservice Extraction Criteria | `Aceptado` | Arquitectura |
| ADR-0046 | Dapr Unified Observability | `Aceptado` | Observabilidad |
| ADR-0047 | Architectural Patterns Selection | `Aceptado` | Arquitectura |
| ADR-0049 | Naming Semantics & Clean Code — superseído por ADR-0056 | `Supersedido` | Estándares |
| ADR-0050 | GitFlow Branching Strategy | `Aceptado` | Flujo de trabajo |
| ADR-0051 | Database Engine Strategy | `Aceptado` | Persistencia |
| ADR-0052 | Unit Testing Isolation Strategy | `Aceptado` | Calidad |
| ADR-0053 | Integration & E2E Testing Strategy | `Aceptado` | Calidad |
| ADR-0054 | DB Design & Normalization Standards | `Aceptado` | Persistencia |
| ADR-0055 | Microfrontends Architecture | `Borrador` | Arquitectura |
| ADR-0056 | Clean Code como Base de Ingeniería de la Suite | `Aceptado` | Estándares |
| ADR-0105 | Definition of Release — Puertas Verificables | `Borrador` | Calidad |
| ADR-0106 | Seguridad y Calidad Local-First — supersede ADR-0005 | `Aceptado` | Seguridad |

### Node.js / TypeScript

| ADR | Título | Estado | Dominio |
|---|---|---|---|
| ADR-0002 | Clean Architecture — NestJS | `Aceptado` | Arquitectura |
| ADR-0003 | Strict TypeScript Standards | `Aceptado` | Estándares |
| ADR-0004 | Frontend Offline Resilience | `Aceptado` | Resiliencia |
| ADR-0007 | Observability — Loki/OpenTelemetry | `Aceptado` | Observabilidad |
| ADR-0008 | Progressive Multimodule Evolution | `Aceptado` | Arquitectura |
| ADR-0012 | Advanced Authorization — RBAC/ABAC | `Aceptado` | Seguridad |
| ADR-0021 | High-Performance Auth Graph | `Aceptado` | Seguridad |
| ADR-0022 | Contextual Auth & Pluggable Projections | `Aceptado` | Seguridad |
| ADR-0026 | MFA & Adaptive Authentication | `Aceptado` | Seguridad |
| ADR-0027 | Dual-Protocol REST/gRPC Gateway | `Aceptado` | APIs |
| ADR-0029 | Tactical DDD Primitives Library | `Aceptado` | Arquitectura |
| ADR-0038 | Error Handling — Result Pattern | `Aceptado` | Estándares |
| ADR-0043 | Data Access — ORM Strategy | `Aceptado` | Persistencia |

### .NET / C#

| ADR | Título | Estado | Dominio |
|---|---|---|---|
| ADR-0041 | Canonical .NET Backend Architecture | `Aceptado` | Arquitectura |
| ADR-0064 | .NET Request Scope — Observability | `Aceptado` | Observabilidad |
| ADR-0065 | .NET PII-Safe Serilog Pipeline | `Aceptado` | Observabilidad |

### Android / Kotlin

| ADR | Título | Estado | Dominio |
|---|---|---|---|
| ADR-0042 | Canonical Android Mobile Architecture | `Aceptado` | Arquitectura |

---

## Procedimiento para Agregar una Nueva ADR

1. Consultar esta matriz para confirmar que no existe una ADR equivalente en estado `Aceptado`.
2. Si existe una ADR similar pero no aplica exactamente, documentar la diferencia en el contexto de la nueva ADR.
3. Asignar el siguiente número disponible en la secuencia (no reutilizar IDs de ADRs deprecadas).
4. Usar la [Plantilla de ADR](../../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md).
5. Someter al Architecture Board para revisión antes de cambiar el estado a `Aceptado`.
6. Actualizar esta matriz con la nueva entrada al momento de la aprobación.
7. Registrar en [`DECISIONS.md`](../../../DECISIONS.md) si la nueva ADR supersede una anterior.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [Hub de ADRs](./README.md) | Índice completo de ADRs con enlaces por runtime. |
| [Plantilla de ADR](../../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md) | Cómo redactar una nueva ADR. |
| [DECISIONS.md](../../../DECISIONS.md) | Triage local de patrones upstream. |
| [Directivas Arquitectónicas](../../governance/standards/vision/directivas-arquitectonicas.es.md) | Restricciones no negociables que acota las ADRs. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-24
</p>
