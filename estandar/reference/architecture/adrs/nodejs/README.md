# ADRs · nodejs

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-ADRs%20%C2%B7%20nodejs-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

Catálogo runtime-específico de ADRs de Unimar Arch para `nodejs`. Hub padre: [`../README.md`](../README.md).

## ADRs

| ADR | Título | Propósito |
|---|---|---|
| [ADR-0002](0002-arquitectura-limpia-nestjs.es.md) | Arquitectura Hexagonal Limpia con NestJS | Define la arquitectura hexagonal con Ports and Adapters para servicios NestJS. |
| [ADR-0003](0003-estandares-estrictos-typescript.es.md) | Estándares Estrictos de TypeScript | Establece configuración `strict`, reglas de linting y convenciones de tipado. |
| [ADR-0004](0004-resiliencia-frontend-offline.es.md) | Resiliencia Offline del Frontend | Estrategia de cache-first, Service Workers y cola de sincronización offline. |
| [ADR-0007](0007-observabilidad-telemetria-loki-opentelemetry.es.md) | Observabilidad con OpenTelemetry, Loki y Jaeger | Stack de observabilidad: tracing distribuido, logging estructurado y métricas. |
| [ADR-0008](0008-evolucion-multimodulo-progresiva-gateway-bff.es.md) | Evolución Multi-Módulo con API Gateway y BFF | Patrón de evolución progresiva desde monolito modular hacia módulos distribuidos con BFF. |
| [ADR-0012](0012-autorizacion-avanzada-rbac-abac.es.md) | Estrategia de Autorización Avanzada RBAC/ABAC | Modelo de autorización con roles y atributos; JWT claims y motor de políticas. |
| [ADR-0021](0021-compilacion-graph-auth-alto-rendimiento.es.md) | Compilación de Grafos de Autorización de Alto Rendimiento | Pre-compilación de grafos de permisos para evaluación O(1) en rutas críticas. |
| [ADR-0022](0022-auth-contextual-proyecciones-plugables.es.md) | Autenticación Contextual y Proyecciones Enchufables | Extensión del modelo de autenticación con proyecciones de salida configurables por contexto. |
| [ADR-0026](0026-autenticacion-adaptativa-mfa-passwordless.es.md) | Plataforma Adaptativa de MFA y Passwordless | Estrategia de autenticación adaptativa con MFA por riesgo y soporte passwordless. |
| [ADR-0027](0027-api-gateway-dual-protocolo-rest-grpc.es.md) | API Gateway de Protocolo Dual REST y gRPC | Decisión de exponer servicios vía REST (externo) y gRPC (interno) desde un único gateway. |
| [ADR-0029](0029-libreria-primitivas-ddd-tactico.es.md) | Librería de Primitivas DDD Tácticas | Adopción de librería compartida de Aggregates, Value Objects y Domain Events para Node.js. |
| [ADR-0038](0038-estrategia-manejo-errores-patron-result.es.md) | Estrategia de Manejo de Errores y Patrón Result | Uso del patrón `Result<T, E>` con `neverthrow` para control de errores sin excepciones. |
| [ADR-0043](0043-estrategia-acceso-datos-orm.es.md) | Estrategia de Acceso a Datos y ORM para Node.js | Selección y configuración del ORM para acceso a datos en servicios NestJS. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
