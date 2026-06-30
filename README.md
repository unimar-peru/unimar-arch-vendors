<div align="center">

# Estándar para Proveedores de Software

> **Documentación del Ciclo de Vida de Desarrollo de Software (SDLC) aplicable a proveedores externos**

[![Unimar](https://img.shields.io/badge/Unimar_Arch-003c6b?style=for-the-badge)]()
[![Estado](https://img.shields.io/badge/Estado-Activo-27ae60?style=for-the-badge)]()
[![Versión](https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=for-the-badge)]()

<br/>

**Este documento establece los estándares, artefactos y requerimientos mínimos que los proveedores externos deben cumplir durante el SDLC, de acuerdo con la arquitectura corporativa de Unimar S.A.**

</div>

---

## Obligatorios Mínimos
| Artefacto                       | Descripción                                                                                                            | Fase   | URL                                                                                                                                                                                                                                                                                                            | Descubrimiento   | Diseño   | Construcción   | Calidad   | Despliegue   |
|:--------------------------------|:-----------------------------------------------------------------------------------------------------------------------|:-------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------|:---------|:---------------|:----------|:-------------|
| PRD                             | Definición de producto                                                                                                 | F1     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-prd.es.md)                                         | ✓                |          |                |           |              |
| Historia de Usuario (US)        | Descripción de tarea funcional                                                                                         | F1     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-historia-usuario.es.md)               | ✓                |          |                |           |              |
| Backlog Ágil                    | Lista de tareas priorizadas y ordenadas por MVP y fases                                                                | F1     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-backlog-agil.es.md)                       | ✓                |          |                |           |              |
| Plan de Proyecto                | Estimación de Costos, Modelod e Equipos, Fases, Entreables y Roadmap                                                   | F1     | Libre Propuesto por el proveedor                                                                                                                                                                                                                                                                               | ✓                |          |                |           |              |
| Blueprint de Referencia         | Explicación de la idea conceptual y sustento técnico de el siseño estandar de los sistemas monolitos progresivos       | F2     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-blueprint-arquitectura.es.md)                                                                                                                                                   | ✓                |          |                |           |              |
| ADR                             | Documento de definición y sustento arquitectónico                                                                      | F2     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md)                                         |                  | ✓        |                |           |              |
| Historia Técnica (TS)           | Documento técnico obligatorio para describir las tareas técnicas que componen una historia funcional durante el sprint | F3     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-historia-tecnica.es.md)               |                  |          | ✓              |           |              |
| Gates / cobertura               | Pilares de control y calidad requeridos por producto                                                                   | F3     | [Enlace](estandar/reference/governance/sdlc/gates-calidad.es.md)                                                                                           |                  |          | ✓              |           |              |
| Pipeline CI/CD                  | Controles de calidad para los pipelines                                                                                | F3     | [Enlace](estandar/reference/architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md)                                                     |                  | ✓        |                |           |              |
| Reporte de Resultado de Pruebas | Reporte de control de resultado de pruebas                                                                             | F4     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md) |                  |          |                | ✓         |              |
| Notas de Lanzamiento (RN)       | Reporte de plan de despliegue                                                                                          | F5     | [Enlace](estandar/reference/governance/sdlc/04-plantillas-artefactos/plantilla-notas-lanzamiento.es.md)             |                  |          |                |           | ✓            |

## Transversales
| Documento                                    | Descripción                                              | URL                                                                                                                                                                                                                                                                                                  |
|:---------------------------------------------|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Transversal: Manifiesto de Ingeniería        | Documneto de principios arquitectónicos que sigue Unimar | [Enlace](estandar/reference/governance/standards/engineering/manifiesto-ingenieria.md)                                     |
| Transversal: Taxonomía de Repositorio        | Estructura y definición de la arquitectura               | [Enlace](estandar/reference/governance/standards/taxonomia-repositorio.md)                                                             |
| Transversal: Estrategia de Monitoreo         | Estrategia de referencia de monitoeo y observabilidad    | [Enlace](estandar/reference/architecture/flujo-arquitectura-observabilidad.es.md)                                               |
| Transversal: Estrategia de Gestión de Código | Estrategia d econtrol de código fuente                   | [Enlace](estandar/reference/governance/sdlc/estrategia-ramificacion.es.md)                                                             |
| Transversal: Estrategia de Herramientas AOP  | Bibliotecas de Referencia por Runtime                    | [Enlace](estandar/reference/architecture/canonical-patterns/README.md)                                                                     |
| Transversal: Estrategia de Pruebas           | Estandares de estrategia de pruebas                      | [Enlace](estandar/reference/governance/sdlc/estrategia-pruebas.es.md)                                                                     |
| Transversal: Estrategia de Despliegues       | Estandares de estrategia de despliegues                  | [Enlace](estandar/reference/navigation/indices/fase-5-entrega-operaciones.md)                                                       |
| Transversal: ADR (matriz)                    | Listo de ADRs base de referencia estándar                | [Enlace](estandar/reference/architecture/adrs/matriz-adr.es.md)                                                                                   |
| Transversal: Estandar Arquitectónico         | Descripción de la arquitectura                           | [Enlace](estandar/reference/architecture/estandar-arquitectonico-suite-unimar.es.md)                                         |
| Transversal: Stack Autorizado                | Plataformas disponibles a elegir para la construcción    | [Enlace](estandar/reference/architecture/stack-tecnologico-autorizado-agnostico.es.md)                                     |
| Transversal: Estrategia de documentación     | Practicas dictadas para el estandar de documentación     | [Enlace](estandar/reference/governance/sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) |

## hubs
> **Meta:** Centralizar las disciplinas que aplican en todas las fases del SDLC.
> **Objetivo:** Un solo punto de entrada por área transversal, sin enlaces dispersos a documentos individuales. Esta sección es la referencia detallada de los dominios transversales y el punto de consulta general del estándar.
>
> **Documento vivo:** Esta documentación está en constante evolución para reflejar las mejores prácticas y decisiones del equipo. Cualquier observación, sugerencia o duda es bienvenida y debe ser coordinada con el equipo UNIMAR.

| Categoría       | Hub                                                                                                                       | ¿Qué contiene?                                                                                                                                                                                                    | Para quién / Cuándo                                                                         | Meta                                                 |
|:----------------|:--------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------|:-----------------------------------------------------|
| Arquitectura    | [Hub de Arquitectura →](estandar/reference/architecture/README.md)      | Estándar corporativo de suite, ADRs, blueprints C4, stacks por runtime (.NET/Node.js/Android), NFRs, patrones canónicos                                                                                           | Arquitectos al definir topología y decisiones técnicas; equipos al adoptar stack autorizado | Centralizar activos arquitectónicos reutilizables    |
| Gobernanza      | [Hub de Gobernanza →](estandar/reference/governance/README.md)          | SDLC con gates y trazabilidad, estándares de ingeniería (API, frontend, integraciones, BD, monitoreo), glosario (550+ términos), taxonomía, plantillas por fase, informes ejecutivos (análisis SCM, licencias IA) | Todos los roles: establece las reglas del ciclo de vida que cada proyecto debe seguir       | Centralizar políticas y estándares del ciclo de vida |
| Infraestructura | [Hub de Infraestructura →](estandar/reference/infrastructure/README.md) | Topología multi-AZ, DR por escenario, componentes (K8s, Ingress, Vault, RabbitMQ, Redis, MinIO), herramientas con instalación/uso/licencia                                                                           | DevOps al aprovisionar entornos; arquitectos al diseñar topología                           | Centralizar activos de infraestructura cloud         |

---

<div align="center">
  <sub><strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978</sub>
</div>
