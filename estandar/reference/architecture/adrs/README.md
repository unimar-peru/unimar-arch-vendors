# Registro de ADRs

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Registro%20de%20ADRs-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../README.md) / [Arquitectura](../README.md) / Registro de ADRs**

Architecture Decision Records de Unimar Arch. La [matriz de ADRs](matriz-adr.es.md) cataloga el estado y dominio de cada decisión.

## ADRs Core (agnósticas de runtime)

<details>
<summary><strong>40+ ADRs transversales: resiliencia, identidad, despliegue, auditoría, calidad</strong></summary>

| ID | Título |
|---|---|
| 0001 | [Orquestación de Monorepo con Nx](core/0001-orquestacion-monorepo-nx.es.md) |
| 0005 | [Calidad CI/CD con CodeQL](core/0005-ci-cd-calidad-codeql.es.md) |
| 0006 | [Transición Futura a Microservicios con Dapr](core/0006-transicion-futura-microservicios-dapr.es.md) |
| 0009 | [Gestión de Vulnerabilidades y Anclaje Estricto de Dependencias](core/0009-gestion-vulnerabilidades-dependencias-estrictas.es.md) |
| 0010 | [Sucursal como Dimensión de Negocio y Contexto de Autorización](core/0010-estrategia-arquitectura-multitenant.es.md) |
| 0011 | [Patrones de Resiliencia y Tolerancia a Fallos](core/0011-patrones-resiliencia-tolerancia-fallos.es.md) |
| 0013 | [Topología de Infraestructura Cloud y Recuperación ante Desastres](core/0013-topologia-infraestructura-cloud-dr.es.md) |
| 0014 | [Estrategia de Caché Distribuido con Redis](core/0014-estrategia-cache-distribuido-redis.es.md) |
| 0015 | [Arquitectura de Eventos Intradominio](core/0015-arquitectura-eventos-intradominio.es.md) |
| 0016 | [Pista de Auditoría de Negocio Inmutable](core/0016-pista-auditoria-inmutable-negocio.es.md) |
| 0017 | [Estrategia de Feature Flags](core/0017-estrategia-feature-flags.es.md) |
| 0018 | [Pirámide de Pruebas y Gates de Calidad](core/0018-piramide-pruebas-gates-calidad.es.md) |
| 0019 | [Patrones de Diseño Táctico para Escalabilidad Futura](core/0019-patrones-diseno-tactico-escalabilidad-futura.es.md) |
| 0020 | [Estrategia de Abstracción de Proveedor de Identidad](core/0020-estrategia-abstraccion-proveedor-identidad.es.md) |
| 0024 | [Plataforma de Gestión de Configuración y Features](core/0024-plataforma-gestion-configuracion-features.es.md) |
| 0025 | [Abstracción de Proveedor de Feature Flags](core/0025-abstraccion-proveedor-feature-flags.es.md) |
| 0028 | [Infraestructura Híbrida Autogestionada (On-Premise)](core/0028-infraestructura-hibrida-autogestionada.es.md) |
| 0030 | [API Gateway: Ingress vs NestJS](core/0030-api-gateway-ingress-vs-nestjs.es.md) |
| 0031 | [Esquema por Contexto y Catálogo de Eventos de Dominio](core/0031-esquema-por-contexto-catalogo-eventos-dominio.es.md) |
| 0032 | [Matriz de Decisión de Protocolos API: REST / gRPC / GraphQL](core/0032-matriz-decision-protocolos-api-rest-grpc-graphql.es.md) |
| 0033 | [Patrón Transactional Outbox](core/0033-patron-transactional-outbox.es.md) |
| 0034 | [Matriz de Aplicabilidad del Patrón CQRS](core/0034-matriz-aplicabilidad-patron-cqrs.es.md) |
| 0035 | [Estrategia de Sagas Distribuidas](core/0035-estrategia-sagas-distribuidas.es.md) |
| 0036 | [Estrategia de Entrega de Bus de Mensajes: FIFO y DLQ](core/0036-estrategia-entrega-bus-mensajes-fifo-dlq.es.md) |
| 0037 | [Estrategia de Rendimiento, Concurrencia y Chaos](core/0037-estrategia-rendimiento-concurrencia-caos.es.md) |
| 0039 | [Switcher de Abstracción de Topología de Despliegue](core/0039-switcher-abstraccion-topologia-despliegue.es.md) |
| 0040 | [Contratos de Selección Multi-Runtime](core/0040-contratos-seleccion-multiruntime.es.md) |
| 0044 | [Estrategia de Persistencia de Seguridad Configurable](core/0044-estrategia-persistencia-seguridad-configurable.es.md) |
| 0045 | [Criterios de Extracción a Microservicios](core/0045-criterios-extraccion-microservicios.es.md) |
| 0046 | [Dapr: Observabilidad Unificada](core/0046-dapr-observabilidad-unificada.es.md) |
| 0047 | [Patrones Arquitectónicos: Monolito / SOA / Microservicios](core/0047-patrones-arquitectonicos-monolito-soa-microservicios.es.md) |
| 0049 | [Política de Naming Semántico y Código Limpio](core/0049-politica-naming-semantica-codigo-limpio.es.md) |
| 0050 | [Estrategia de Ramificación GitFlow](core/0050-estrategia-ramificacion-gitflow.es.md) |
| 0051 | [Estrategia de Motor de Base de Datos Empresarial](core/0051-estrategia-motor-base-datos-empresarial.es.md) |
| 0052 | [Estrategia de Aislamiento de Pruebas Unitarias](core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) |
| 0053 | [Estrategia de Pruebas de Integración y E2E](core/0053-estrategia-pruebas-integracion-e2e.es.md) |
| 0054 | Estándares de Diseño y Normalización de Base de Datos |
| 0055 | [Estrategia de Arquitectura de Microfrontends](core/0055-estrategia-arquitectura-microfrontends.es.md) |
| 0056 | [Convenciones de Naming y Diseño Empresarial](core/0056-convenciones-nombre-diseno-empresarial.es.md) |
| 0060 | Feature Flags — Gestión Centralizada en UMS |

</details>

## ADRs Node.js / TypeScript

<details>
<summary><strong>13 ADRs: NestJS, TypeScript estricto, autorización, observabilidad, Result pattern</strong></summary>

| ID | Título |
|---|---|
| 0002 | [Arquitectura Hexagonal Limpia con NestJS](nodejs/0002-arquitectura-limpia-nestjs.es.md) |
| 0003 | [Estándares Estrictos de TypeScript](nodejs/0003-estandares-estrictos-typescript.es.md) |
| 0004 | [Resiliencia Offline del Frontend](nodejs/0004-resiliencia-frontend-offline.es.md) |
| 0007 | [Observabilidad y Telemetría con Loki y OpenTelemetry](nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md) |
| 0008 | [Evolución Multi-Módulo Progresiva con Gateway y BFF](nodejs/0008-evolucion-multimodulo-progresiva-gateway-bff.es.md) |
| 0012 | [Autorización Avanzada con RBAC/ABAC](nodejs/0012-autorizacion-avanzada-rbac-abac.es.md) |
| 0021 | [Compilación de Grafos de Autorización de Alto Rendimiento](nodejs/0021-compilacion-graph-auth-alto-rendimiento.es.md) |
| 0022 | [Autenticación Contextual y Proyecciones Enchufables](nodejs/0022-auth-contextual-proyecciones-plugables.es.md) |
| 0026 | [Autenticación Adaptativa con MFA y Passwordless](nodejs/0026-autenticacion-adaptativa-mfa-passwordless.es.md) |
| 0027 | [API Gateway de Protocolo Dual: REST y gRPC](nodejs/0027-api-gateway-dual-protocolo-rest-grpc.es.md) |
| 0029 | [Librería de Primitivas DDD Tácticas](nodejs/0029-libreria-primitivas-ddd-tactico.es.md) |
| 0038 | [Estrategia de Manejo de Errores con Patrón Result](nodejs/0038-estrategia-manejo-errores-patron-result.es.md) |
| 0043 | [Estrategia de Acceso a Datos y ORM](nodejs/0043-estrategia-acceso-datos-orm.es.md) |

</details>

## ADRs .NET / C&#35;

<details>
<summary><strong>3 ADRs: backend canónico, observabilidad, logging seguro</strong></summary>

| ID | Título |
|---|---|
| 0041 | [Arquitectura de Backend Canónica para .NET](dotnet/0041-arquitectura-backend-canonica-dotnet.es.md) |
| 0064 | [Contexto de Observabilidad con Scope de Request en .NET](dotnet/0064-contexto-observabilidad-scope-request-dotnet.es.md) |
| 0065 | [Pipeline de Logging Seguro de PII con Serilog en .NET](dotnet/0065-pipeline-serilog-seguro-pii-dotnet.es.md) |

</details>

## ADRs Android / Kotlin

<details>
<summary><strong>1 ADR: arquitectura móvil canónica</strong></summary>

| ID | Título |
|---|---|
| 0042 | [Arquitectura Móvil Canónica para Android](android/0042-arquitectura-movil-canonica-android.es.md) |

</details>

## Documentos Relacionados

<details>
<summary><strong>Matriz, plantilla, ejemplo y registro de decisiones</strong></summary>

- [Matriz de ADRs (estado, dominio, impacto)](matriz-adr.es.md)
- [Plantilla de ADR](../../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md)
- Ejemplo de ADR
- [DECISIONS.md](../../../DECISIONS.md) — triage de patrones de arquitectura

</details>

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-09
</p>
