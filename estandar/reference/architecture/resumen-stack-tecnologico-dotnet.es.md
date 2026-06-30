# Cheat Sheet del Stack .NET de Referencia (Específico por Runtime)

> Alcance: este documento **no** es la política universal de arquitectura.
>
> Es una referencia rápida específica para el runtime .NET / C#. Las reglas transversales viven en la [Línea Base Agnóstica Universal](stack-tecnologico-autorizado-agnostico.es.md). Las alternativas por runtime viven en los perfiles [.NET](stack-tecnologico-autorizado-dotnet.es.md), [Node.js](stack-tecnologico-autorizado-nodejs.es.md) y [Android](stack-tecnologico-autorizado-android.es.md).

Esta hoja sirve como referencia de herramientas por capa arquitectónica para desarrolladores y agentes autónomos que trabajan en la implementación .NET.

---

### 1. Runtime y Lenguaje

- **Entorno de Ejecución:** .NET 10 LTS
- **Lenguaje:** C# 13
- **Host Web:** ASP.NET Core 10.0
- **Calidad de Código:** CSharpier + analizadores Roslyn
- **Puertas de Calidad Git:** Husky + lint-staged

### 2. Capa de API

- **Protocolos Externos:** API REST (ASP.NET Core MVC / Minimal API)
- **Protocolos Internos:** gRPC (workers de cómputo pesado)
- **Estándar de Validación:** FluentValidation 11.9+
- **Documentación de API:** Swagger / OpenAPI v3 (Swashbuckle o NSwag)

### 3. Capa de Gateway

- **API Gateway:** Ingress Gateway (Edición de Código Abierto)
- **Gestión de Sesión:** JSON Web Tokens (JWT) firmados con RS256
- **Seguridad Interna:** TLS mutuo (mTLS) vía Malla de Servicios Istio

### 4. Capa de Dominio y Aplicación

- **Patrón Arquitectónico:** Arquitectura Hexagonal (Puertos y Adaptadores)
- **Patrón de Aplicación:** CQRS vía MediatR
- **Patrón de Ejecución:** Monolito Modular
- **Manejo de Errores:** Patrón Result (OneOf / Result personalizado) — prohibido lanzar excepciones para flujo de control
- **Pruebas Unitarias:** xUnit + Moq / NSubstitute
- **Mocks / Stubs:** Moq 4.x o NSubstitute

### 5. Capa de Datos

- **Base de Datos Relacional Principal:** SQL Server
- **Mapeo Relacional (ORM):** Entity Framework Core 10.0
- **Caché en Memoria:** Redis v7.2
- **Bróker de Mensajes Asíncrono:** RabbitMQ
- **Motor de Migración:** Bundles de scripts SQL via Init-Containers de Kubernetes

### 6. Estrategia de Aislamiento por Sucursal

- **Modelo de Aislamiento:** Base de Datos Compartida con Row-Level Security (RLS)
- **Contexto de Resolución de Sucursal:** Extracción de claims desde `ClaimsPrincipal` vía `TenantResolver`
- **Imposición de Aislamiento:** Filtros de consulta de EF Core + `sp_set_session_context` para RLS secundario

### 7. Infraestructura y Despliegue

- **Motor de Contenedores:** Docker v25 (Imágenes multi-etapa)
- **Plataforma Orquestadora:** Kubernetes (K8s v1.28+)
- **Gestión de Secretos:** HashiCorp Vault
- **Empaquetador de Despliegue:** Charts Helm v3

### 8. Observabilidad

- **Estándar de Instrumentación:** OpenTelemetry.Extensions.Hosting
- **Agregador de Logs:** Grafana Loki
- **Trazas Distribuidas:** Jaeger
- **Servidor de Métricas:** Prometheus

### 9. Seguridad

- **Registros de Auth:** OIDC y SAML Federados
- **Control de Acceso:** RBAC Jerárquico + ABAC
- **Auditoría de Dependencias:** dotnet audit + Snyk CLI

### 10. Experiencia del Desarrollador (DevEx)

- **Servicios Locales:** Especificación de Docker Compose
- **Pruebas de Integración:** xUnit + Testcontainers
- **Verificación de Contratos:** Pact NET
- **Inyección de Rendimiento:** k6
- **Pruebas End-to-End (E2E):** Playwright

---

[Volver al Índice](README.md)
