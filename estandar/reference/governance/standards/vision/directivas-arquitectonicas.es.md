# Directrices Arquitectónicas Maestras y Estrategia de Evolución

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Directrices%20Arquitect%C3%B3nicas-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**Estado:** Aprobado
**Owner:** Architecture Board
**Última revisión:** 2026-05-22

Este documento establece las directrices arquitectónicas no negociables que rigen cada producto instanciado a partir de esta referencia. Define la línea base de calidad, la filosofía de evolución y las restricciones que toda decisión arquitectónica debe satisfacer.

---

## 1. Objetivos Globales del Sistema

La plataforma está diseñada para anclar todos los productos corporativos sobre estándares de entrega que aseguren la viabilidad técnica de largo plazo sin sacrificar la simplicidad de la fase temprana.

---

## 2. Requisitos Técnicos Maestros y Evolución

Todos los productos instanciados a partir de este blueprint DEBEN alinearse con las siguientes directrices:

### 2.1 Progresión Progresiva
Los sistemas se inician como un **Monolito Modular** (basado en Nx) para garantizar un time-to-market inicial rápido. Los módulos de dominio se aíslan lógicamente mediante fronteras estrictas de biblioteca desde el día uno, lo que permite la extracción quirúrgica a **Microservicios** independientes sin requerir reescrituras de la capa de dominio. Ver los disparadores cuantitativos de extracción en [ADR-0045](../../../architecture/adrs/core/0045-criterios-extraccion-microservicios.es.md) y el marco de selección en [ADR-0047](../../../architecture/adrs/core/0047-patrones-arquitectonicos-monolito-soa-microservicios.es.md).

**Etapas:**
```text
Monolito Simple -> Monolito Modular -> Módulos Distribuidos -> Microservicios
```

Ninguna etapa se salta. Ninguna etapa es obligatoria más allá de lo que el negocio, el tamaño del equipo y la complejidad operativa demanden objetivamente.

### 2.2 Preparación para Alta Concurrencia
El sistema DEBE sostener ráfagas de carga súbitas y no uniformes. Esto se logra mediante:

* Topología de contenedores con auto-escalado ([ADR-0028](../../../architecture/adrs/core/0028-infraestructura-hibrida-autogestionada.es.md))
* Estrategias de caché de 4 niveles ([ADR-0014](../../../architecture/adrs/core/0014-estrategia-cache-distribuido-redis.es.md))
* Abstracción de Bus de Eventos no bloqueante ([ADR-0015](../../../architecture/adrs/core/0015-arquitectura-eventos-intradominio.es.md))

### 2.3 Integridad Transaccional
Toda mutación de estado debe ser estrictamente atómica. Los estados de escritura inconsistentes se previenen mediante controles explícitos de Unit of Work y, donde se requiera propagación asíncrona, el patrón Transactional Outbox ([ADR-0033](../../../architecture/adrs/core/0033-patron-transactional-outbox.es.md)).

### 2.4 Seguro, Dinámico y Extensible
Los principios de arquitectura Zero-Trust aplican desde la Fase 1. Los adaptadores de infraestructura están completamente desacoplados de la lógica de dominio, permitiendo que nuevas herramientas o servicios externos se intercambien en caliente sin impactar los flujos de valor centrales. Los proveedores de identidad, buses de eventos, cachés y motores de almacenamiento son todos inyectables a través de la frontera Puerto/Adaptador.

### 2.5 Soberanía del Dominio
La capa de Dominio debe contener cero referencias a SDKs de nube, librerías ORM o frameworks HTTP. El Dominio es el centro estable; la infraestructura es el detalle reemplazable. La violación de esta regla falla automáticamente la validación de la Compuerta de Arquitectura.

---

## 3. Restricciones Gobernantes

| Restricción | Mecanismo de Aplicación | Referencia |
| :--- | :--- | :--- |
| Arquitectura Hexagonal obligatoria | Compuerta CI con `eslint-plugin-boundaries` | [ADR-0002](../../../architecture/adrs/nodejs/0002-arquitectura-limpia-nestjs.es.md) |
| Sin extracción prematura de microservicios | Regla cuantitativa "2 de 4" aplicada por el Architecture Board | [ADR-0045](../../../architecture/adrs/core/0045-criterios-extraccion-microservicios.es.md) |
| Esquema-por-Contexto desde el día uno | Las joins SQL cross-schema están prohibidas arquitectónicamente | [ADR-0031](../../../architecture/adrs/core/0031-esquema-por-contexto-catalogo-eventos-dominio.es.md) |
| Comunicación inter-servicio Contract-First | OpenAPI (público), gRPC/Protobuf (interno), AsyncAPI (asíncrono) | [ADR-0040](../../../architecture/adrs/core/0040-contratos-seleccion-multiruntime.es.md) |
| Portabilidad de infraestructura | Almacenamiento compatible con S3, selección de herramientas OSS-first | [ADR-0028](../../../architecture/adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) |
| Cobertura mínima de pruebas | 70% aplicada en CI; Testcontainers para pruebas de integración | [ADR-0018](../../../architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md) |
| Trazado distribuido unificado | OpenTelemetry W3C TraceContext, sin agentes APM propietarios | [ADR-0007](../../../architecture/adrs/nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md) |
| Estándares de nomenclatura | Lenguaje Ubicuo como fuente de verdad, lint automatizado | [ADR-0056](../../../architecture/adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md) |

---

## 4. Lectura Complementaria

* [Roadmap de Estrategia Evolutiva](./roadmap-estrategia-evolutiva.es.md) — Roadmap técnico fase a fase con KPIs medibles
* [Matriz de Madurez](./matriz-madurez.es.md) — Evaluación ACMM de TOGAF de la arquitectura de referencia actual
* [Evaluación de Madurez de Diseño](./evaluacion-madurez.es.md) — Inmunización contra anti-patrones y preparación de patrones
* [Blueprint de Referencia](../../../architecture/blueprints/blueprint-referencia.es.md) — Modelo arquitectónico C4 completo

---



<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
