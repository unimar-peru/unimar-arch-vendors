# Modelo de Madurez Arquitectónica (AMM) del Esqueleto de Referencia

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Modelo%20de%20Madurez%20Arquitect%C3%B3nic%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

## Marco de Referencia: TOGAF ACMM y Well-Architected Framework

## Estado
Aprobado

## Fecha
2026-05-10

## Contexto y Propósito

Como Technical Manager y Enterprise Architect, es crítico medir la calidad objetiva y la evolución del Sistema de Referencia utilizando estándares reconocidos internacionalmente.

Este documento de evaluación aprovecha un marco híbrido que combina el **TOGAF Architecture Capability Maturity Model (ACMM)** (para la madurez de procesos empresariales y gobernanza) y el **Cloud Well-Architected Framework (WAF)** (para la madurez técnica y cloud-native a través de pilares como Seguridad, Confiabilidad y Excelencia Operacional).

---

## 1. Definición de Niveles de Madurez (Basado en TOGAF ACMM)

Evaluamos el Esqueleto de Referencia a través de 5 niveles estándar de madurez:

* **Nivel 1: Inicial (Ad-Hoc)** — Sin arquitectura formal. Los procesos de TI son caóticos, no documentados y reactivos.
* **Nivel 2: En Desarrollo** — Proceso de arquitectura básico en su lugar. Existen algunos estándares pero no se aplican consistentemente.
* **Nivel 3: Definido** — Arquitectura bien definida, documentada (Modelo C4, ADRs) e integrada en el SDLC.
* **Nivel 4: Gestionado** — Arquitectura medida cuantitativamente (CodeQL, Sonar, Cobertura) y gobernada automáticamente.
* **Nivel 5: Optimizando** — Mejora arquitectónica continua (evolución Dapr, desacoplamiento progresivo, auto-escalado).

---

## 2. Evaluación de Madurez Actual del Esqueleto de Referencia (Pilares Well-Architected)

Evaluamos la arquitectura del Esqueleto de Referencia contra los 5 pilares críticos del Well-Architected Framework.

### Pilar 1: Seguridad y Cumplimiento
**Nivel de Madurez Actual: 4 (Gestionado)**
* **Evidencia:**
 * Pipeline de Seguridad Zero-Cost implementado vía CodeQL ([ADR-0005](../../../architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md)).
 * Fijación Estricta de Dependencias previene ataques de Supply Chain ([ADR-0009](../../../architecture/adrs/core/0009-gestion-vulnerabilidades-dependencias-estrictas.es.md)).
 * Acceso por sucursal controlado por autorización RBAC/ABAC en la capa de aplicación, con el claim `sucursales_autorizadas` como punto de decisión auditable ([ADR-0010](../../../architecture/adrs/core/0010-estrategia-arquitectura-multitenant.es.md), [ADR-0012](../../../architecture/adrs/nodejs/0012-autorizacion-avanzada-rbac-abac.es.md)).
 * Auditoría Inmutable mediante CDC ([ADR-0016](../../../architecture/adrs/core/0016-pista-auditoria-inmutable-negocio.es.md)).
* **Camino al Nivel 5:** Implementar pruebas de penetración automatizadas en CI y rotación dinámica de secretos vía HashiCorp Vault.

### Salto a: Pilar 2: Eficiencia de Rendimiento
**Nivel de Madurez Actual: 4 (Gestionado)**
* **Evidencia:**
 * Compilación de Auth Graph de Alto Rendimiento bajo 5ms usando Redis ([ADR-0021](../../../architecture/adrs/nodejs/0021-compilacion-graph-auth-alto-rendimiento.es.md)).
 * Estrategia de Protocolo Dual (REST para público, gRPC para velocidad interna) ([ADR-0027](../../../architecture/adrs/nodejs/0027-api-gateway-dual-protocolo-rest-grpc.es.md)).
 * Payloads frontend optimizados vía BFF Gateway ([ADR-0008](../../../architecture/adrs/nodejs/0008-evolucion-multimodulo-progresiva-gateway-bff.es.md)).
* **Camino al Nivel 5:** Implementar auto-escalado serverless y algoritmos de caché predictiva.

### Pilar 3: Confiabilidad y Resiliencia
**Nivel de Madurez Actual: 3 (Definido) -> Moviéndose a 4**
* **Evidencia:**
 * Resiliencia Offline de Frontend vía React Query ([ADR-0004](../../../architecture/adrs/nodejs/0004-resiliencia-frontend-offline.es.md)).
 * Tolerancia a Fallos vía Circuit Breakers (`opossum`) y Reintentos ([ADR-0011](../../../architecture/adrs/core/0011-patrones-resiliencia-tolerancia-fallos.es.md)).
 * Límites de DR Multi-Región de Infraestructura Cloud propuestos ([ADR-0013](../../../architecture/adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).
* **Camino al Nivel 5:** Ejecutar drills regulares de Chaos Engineering (Chaos Monkey) y despliegue multi-región activo-activo completamente.

### Pilar 4: Excelencia Operacional
**Nivel de Madurez Actual: 4 (Gestionado)**
* **Evidencia:**
 * Orquestación Monorepo vía Nx asegura builds determinísticos ([ADR-0001](../../../architecture/adrs/core/0001-orquestacion-monorepo-nx.es.md)).
 * Telemetría comprensiva usando LGTM y OpenTelemetry ([ADR-0007](../../../architecture/adrs/nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md)).
 * Feature Flagging permite desacoplar despliegue de release ([ADR-0017](../../../architecture/adrs/core/0017-estrategia-feature-flags.es.md), ADR-0060).
 * Quality Gates aplican cobertura de pruebas >70% estrictamente vía CI ([ADR-0018](../../../architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md)).
* **Camino al Nivel 5:** Lograr despliegues Blue/Green completamente autónomos y zero-downtime con detección de anomalías basada en IA en logs.

### Pilar 5: Mantenibilidad y Extensibilidad (Clean Architecture)
**Nivel de Madurez Actual: 4 (Gestionado)**
* **Evidencia:**
 * Fronteras Hexagonales estrictas desacoplan núcleo de infra ([ADR-0002](../../../architecture/adrs/nodejs/0002-arquitectura-limpia-nestjs.es.md)).
 * Patrones de Diseño Táctico (Result Monad) asegurando el núcleo a futuro ([ADR-0019](../../../architecture/adrs/core/0019-patrones-diseno-tactico-escalabilidad-futura.es.md)).
 * Arquitectura Event-Driven desacoplando módulos de dominio ([ADR-0015](../../../architecture/adrs/core/0015-arquitectura-eventos-intradominio.es.md)).
 * Estrategias de mitigación de Vendor Lock-In claramente definidas (Feature Flags, IdPs).
* **Camino al Nivel 5:** Transición sin fisuras de Monolito Modular a Microservicios Dapr con cero cambios de código de dominio ([ADR-0006](../../../architecture/adrs/core/0006-transicion-futura-microservicios-dapr.es.md)).

---

## 3. Resumen Ejecutivo y Puntuación

Basado en los criterios de TOGAF ACMM aplicados a nuestra arquitectura actual evaluada con apoyo del método spec-driven AI-DD:

**Puntuación General de Madurez Arquitectónica del Esqueleto de Referencia: 3.8 / 5.0 (De Definido a Gestionado)**

La arquitectura del Esqueleto de Referencia está actualmente en transición desde un sistema perfectamente documentado (Nivel 3) hacia un sistema completamente automatizado y gobernado (Nivel 4). La aplicación estricta de ADRs, fronteras estáticas (`eslint-plugin-boundaries`) y quality gates de CI/CD asegura que el sistema no degradará en deuda técnica.

Para alcanzar el **Nivel 5 (Optimizando)**, la organización de ingeniería debe enfocarse en Chaos Engineering, despliegues Multi-Región Activo-Activo y la división eventual en microservicios Dapr según la carga operativa lo demande.

---

## Dimensión AI-Augmented (Opcional)

Para productos que adopten la sección de ingeniería AI-Augmented, existe una matriz de madurez complementaria con 3 niveles: AI-Assisted, AI-Integrated y AI-Orchestrated.

-> [Ver Matriz de Madurez AI](../ai-augmented/07-modelo-madurez/matriz-madurez-ia.es.md)

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
