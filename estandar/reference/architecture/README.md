# Hub de Arquitectura

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Arquitectura-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../README.md) / Hub de Arquitectura**

> **Meta:** Autoridad arquitectónica corporativa: estándares, ADRs, blueprints y patrones canónicos.
> **Objetivos:** (1) Definir el estándar corporativo de suite, (2) registrar y mantener las decisiones arquitectónicas, (3) proveer blueprints reutilizables por runtime, (4) catalogar patrones de implementación canónicos.

---

<details>
<summary><strong>Visión y Estándar Corporativo</strong></summary>

Define el landscape de sistemas, la hoja de ruta evolutiva y la matriz de NFRs que gobiernan toda la suite Unimar.

| Documento | Propósito | Cuándo consultarlo |
| :-------- | :-------- | :----------------- |
| [Estándar Arquitectónico Corporativo](./estandar-arquitectonico-suite-unimar.es.md) | Baseline reusable de la suite: directivas, baseline agnóstica, ADRs core, SDLC y patrones | Antes de iniciar cualquier nuevo proyecto o plataforma |
| Visión de la Suite de Sistemas de Soporte Operativo | Landscape completo de sistemas, capas funcionales y principios arquitectónicos | Al diseñar la topología de la suite o al integrar un nuevo sistema |
| Hoja de Ruta de la Suite de Sistemas | Fases, dependencias y orden de construcción incremental | Al planificar releases mayores o al decidir el orden de implementación |
| [Matriz NFR de la Suite UNIMAR](./matriz-nfr-suite.es.md) | Requisitos no funcionales: rendimiento, seguridad, disponibilidad, escalabilidad | Durante F2 (diseño) al validar que el diseño cumple los NFRs |

> **Métrica:** Porcentaje de proyectos que cumplen los NFRs definidos en la matriz antes de pasar a producción. Objetivo: 100%.

</details>

---

<details>
<summary><strong>Stack Tecnológico Autorizado</strong></summary>

Stacks aprobados por runtime. Cada stack define tecnologías, versiones y alternativas con ADR. No se permite usar una tecnología no listada sin ADR de excepción.

| Stack | Documento principal | Resumen | Patrones | Para quién |
| :---- | :------------------ | :------ | :------- | :---------- |
| Agnóstico | [Línea Base Universal](./stack-tecnologico-autorizado-agnostico.es.md) | — | — | Todos los stacks |
| .NET / C# | [Stack Tecnológico .NET](./stack-tecnologico-autorizado-dotnet.es.md) | [Cheat Sheet .NET](./resumen-stack-tecnologico-dotnet.es.md) | [Patrones .NET](./canonical-patterns/dotnet/README.md) | Equipos .NET |
| Node.js / TS | [Stack Tecnológico Node.js](./stack-tecnologico-autorizado-nodejs.es.md) | [Cheat Sheet Node.js](./resumen-stack-tecnologico.es.md) | [Patrones Node.js](./canonical-patterns/nodejs/README.md) | Equipos Node.js |
| Android / Kotlin | [Stack Tecnológico Android](./stack-tecnologico-autorizado-android.es.md) | [Cheat Sheet Android](./resumen-stack-tecnologico-android.es.md) | [Patrones Android](./canonical-patterns/android/README.md) | Equipos Android |

> **Regla:** Cualquier tecnología no listada requiere un ADR que justifique la excepción. Ver [ADRs →](./adrs/README.md).

</details>

---

<details>
<summary><strong>Blueprints de Referencia</strong></summary>

Modelos arquitectónicos canónicos: topología C4, compensaciones CAP, simplicidad y observabilidad.

| Documento | Propósito | Cuándo usarlo |
| :-------- | :-------- | :------------ |
| [Blueprint de Referencia Corporativa](./blueprints/blueprint-referencia.es.md) | Modelo C4 canónico con contexto, contenedores, componentes y código | Durante F2 (diseño) al modelar la arquitectura del producto |
| [Especificación de Topología C4](./blueprints/especificacion-topologia-c4.es.md) | Topología de referencia con diagramas de despliegue | Al diseñar la infraestructura de red y despliegue |
| [Lista de Verificación de Simplicidad](./blueprints/lista-verificacion-simplicidad-fase-01.es.md) | Bloquea sobre-ingeniería antes de aprobar la baseline de diseño | Gate obligatorio al final de F2 antes de aprobar la baseline |
| [Análisis Estratégico CAP](./analisis-estrategico-cap.es.md) | Compensaciones entre consistencia, disponibilidad y tolerancia a partición | Al elegir entre una BD relacional y una NoSQL, o al diseñar sistemas distribuidos |

</details>

---

<details>
<summary><strong>Despliegue y Multi-Cloud</strong></summary>

Estrategias de despliegue multi-nube y cumplimiento normativo.

| Documento | Propósito | Cuándo usarlo |
| :-------- | :-------- | :------------ |
| [Deployment Architecture Hub](./deployment/hub/deployment-architecture-hub.md) | Catálogo gobernado de alternativas de despliegue (local y producción) con matriz de comparación | Al elegir la topología de despliegue concreta del sistema |
| [Escenarios de Despliegue Multi-Nube](./escenarios-despliegue-multinube.es.md) | Estrategias multi-cloud con cumplimiento y topología | Al definir la estrategia de cloud o al expandir a una nueva región |

</details>

---

<details>
<summary><strong>Observabilidad</strong></summary>

Flujo de telemetría desde la instrumentación hasta la visualización.

| Documento | Propósito | Cuándo usarlo |
| :-------- | :-------- | :------------ |
| [Flujo de Arquitectura de Observabilidad](./flujo-arquitectura-observabilidad.es.md) | Pipelines de tracing, logs y métricas con OpenTelemetry, Loki, Tempo y Grafana | Durante F2 (diseño) al definir la estrategia de observabilidad del producto |

</details>

---

<details>
<summary><strong>Sub-hubs</strong></summary>

| Hub | Contenido | Para quién |
| :-- | :-------- | :---------- |
| [Registro de ADRs](./adrs/README.md) | Catálogo completo de +50 ADRs organizados por dominio (core, .NET, Node.js, Android) con estado y matriz. La estrategia de ramificación se define en el [hub de gobernanza](../governance/sdlc/estrategia-ramificacion.es.md) (ver ADR-0050 como referencia) | Arquitectos al tomar decisiones; desarrolladores al consultar decisiones previas |
| [Blueprints](./blueprints/README.md) | Diagramas C4 y topologías de referencia | Equipos de diseño |
| [Patrones Canónicos](./canonical-patterns/README.md) | Implementaciones por runtime: Repository, CQRS, Outbox, Result Pattern, etc. | Desarrolladores al implementar patrones aprobados |

</details>

---

## Navegación Rápida

| Acción | Enlace |
| :----- | :----- |
| Volver al inicio | [README principal](../../README.md) |
| Ver todos los ADRs | [ADRs →](./adrs/README.md) |
| Ver stacks autorizados | [Stack Tecnológico (índice)](./stack-tecnologico-autorizado.es.md) |
| Ver fases del SDLC | [MASTER_INDEX.md](../navigation/MASTER_INDEX.md) |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-11
</p>
