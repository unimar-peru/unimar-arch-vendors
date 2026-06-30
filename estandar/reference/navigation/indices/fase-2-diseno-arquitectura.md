# Fase 2 — Diseño y Arquitectura

> **Gate de salida:** Baseline de Diseño Aprobado

## Objetivo

Producir el diseño arquitectónico detallado del producto: definir topología, registrar decisiones (ADRs), especificar contratos y alinear el equipo técnico con el blueprint corporativo antes de construir.

<details>
<summary><strong>Documentos Guía</strong></summary>

Estos documentos definen el contexto arquitectónico global de UNIMAR y deben consultarse antes de cualquier decisión de diseño:

| Documento | Propósito |
| :-------- | :-------- |
| Visión de la Suite de Sistemas de Soporte Operativo | Landscape completo de sistemas, capas funcionales y principios arquitectónicos |
| Hoja de Ruta de la Suite de Sistemas | Fases, dependencias y orden de construcción incremental de la suite |

</details>

<details>
<summary><strong>Modelo y Topología</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Blueprint de Referencia Corporativa](../../architecture/blueprints/blueprint-referencia.es.md) | Estándar | **R** | Modelo C4 canónico |
| [Stack Tecnológico Autorizado](../../architecture/stack-tecnologico-autorizado-agnostico.es.md) | Estándar | **R** | Tecnologías aprobadas por runtime |
| [Especificación de Topología C4](../../architecture/blueprints/especificacion-topologia-c4.es.md) | Blueprint | O | Topología de referencia C4 |
| [Análisis Estratégico CAP](../../architecture/analisis-estrategico-cap.es.md) | Blueprint | O | Compensaciones consistencia vs disponibilidad |
| [Flujo de Arquitectura de Observabilidad](../../architecture/flujo-arquitectura-observabilidad.es.md) | Blueprint | O | Tracing distribuido y agregación de logs |
| [Lista de Verificación de Simplicidad](../../architecture/blueprints/lista-verificacion-simplicidad-fase-01.es.md) | Estándar | **R** | Bloquea sobre-ingeniería antes de aprobar Baseline |

</details>

<details>
<summary><strong>Estándares de Ingeniería</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Estándar de Diseño de API](../../governance/standards/engineering/estandar-diseno-api.es.md) | Estándar | **R** | Formato de respuesta, códigos de error, paginación, versionado, idempotencia, OpenAPI |
| [Estrategia de Frontend Web](../../governance/standards/engineering/estrategia-frontend-web.es.md) | Guía | **R** | React + Vite + TypeScript, Atomic Design, pruebas, rendimiento, seguridad |
| [Estrategia de Integraciones Corporativas](../../governance/standards/engineering/estrategia-integraciones.es.md) | Guía | **R** | Integración con SUNAT, SAP, clientes B2B, proveedores; ACL, seguridad, monitoreo |
| [Estrategia de Monitoreo](../../governance/standards/engineering/estrategia-monitoreo.es.md) | Guía | **R** | Stack LGTM + Prometheus, métricas RED/USE, dashboards, alertas, SLIs/SLOs |
| [Estrategia de Ramificación GitFlow](../../governance/sdlc/estrategia-ramificacion.es.md) | Guía | **R** | Modelo de ramas, flujo de promoción, PRs, estándar de commits, branch protection |

</details>

<details>
<summary><strong>Decisiones Arquitectónicas (ADRs)</strong></summary>

Consulta el [Hub de ADRs](../../architecture/adrs/README.md) para el catálogo completo de decisiones arquitectónicas organizadas por dominio y estado.

</details>

<details>
<summary><strong>Historias y Documentación</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Plantilla de Historia Funcional](../../governance/sdlc/04-plantillas-artefactos/plantilla-historia-funcional.es.md) | Plantilla | **R** | Especificación de comportamiento de negocio |
| [Estándar de Redacción de Historias Funcionales](../../governance/sdlc/03-documentacion/estandar-redaccion-historias-funcionales.es.md) | Estándar | **R** | Anatomía, criterios de aceptación y ejemplos de redacción de FS |
| [Mejores Prácticas de Documentación SDLC](../../governance/sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) | Estándar | **R** | Convenciones transversales: metadatos, identificadores, codificación UTF-8, versionado |

</details>

<details>
<summary><strong>Opcionales / Condicionales</strong></summary>

> Los ADRs condicionales (multi-tenant, microservicios, etc.) se consultan directamente en el [Hub de ADRs](../../architecture/adrs/README.md), donde cada decisión está organizada por dominio con su contexto y estado. Esta sección solo incluye documentos no-ADR.

| Documento | Tipo | Propósito | Cuándo usarlo |
| :-------- | :--- | :-------- | :------------ |
| [Patrones Canónicos de Implementación](../../architecture/canonical-patterns/README.md) | Referencia | Implementaciones por runtime | Al adoptar patrones de referencia |

</details>

---

[Volver al README principal](../../../README.md)
