# Deployment Architecture Hub

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment_Hub-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../README.md) / [Hub de Arquitectura](../../README.md) / Deployment Architecture Hub**

> **Meta:** Punto único de entrada para consultar, comparar y seleccionar todas las arquitecturas de despliegue oficiales de la suite UNIMAR (DT, TMS, WMS, MMS, SIL, **UMS**, XMS).
> **Objetivos:** (1) consolidar en un índice gobernado las alternativas de despliegue existentes y sus decisiones, (2) permitir que un arquitecto o director seleccione conscientemente una arquitectura por ambiente/producto, (3) mantener trazabilidad entre arquitectura lógica, física, de despliegue, de infraestructura y de operación.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## 1. Objetivo del Hub

El **Deployment Architecture Hub** es el catálogo central y gobernado de las **alternativas oficiales de despliegue** de los sistemas de la suite UNIMAR. No es una colección de diagramas: es una **estrategia de arquitectura de despliegue gobernada** donde cada propuesta responde de forma verificable *dónde*, *cómo*, *con qué*, *cuánto cuesta*, *quién la opera*, *cómo se monitorea/protege/escala/recupera* y *cuándo conviene usarla*.

El Hub **consolida** (no reemplaza) el material de despliegue ya decidido en el core:

| Insumo existente | Rol en el Hub |
| :-- | :-- |
| [Escenarios de despliegue multinube](../../escenarios-despliegue-multinube.es.md) | Base de las propuestas de producción (Azure/AWS/On-Prem/Híbrido) |
| [ADR-0013 — Topología de Infraestructura Cloud y DR](../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) | Orquestación por fase, Multi-AZ activo-activo, entrada de red global |
| [ADR-0028 — Infraestructura Híbrida Autogestionada](../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) | 100% open-source, autohospedable, *Infraestructura como Puerto* |
| [ADR-0039 — Switcher / Abstracción de Topología de Despliegue](../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) | `DEPLOYMENT_TOPOLOGY` (`SAAS_CLOUD` \| `ON_PREMISE_ISOLATED`) por factoría DI |
| [Hub de Infraestructura](../../../infrastructure/README.md) | Topología de referencia, componentes, estrategia de DR |
| [Stack tecnológico autorizado — agnóstico §6](../../stack-tecnologico-autorizado-agnostico.es.md) | Contenerización, orquestación, Helm, S3-API, secretos, observabilidad autorizados |
| [Matriz NFR de la suite](../../matriz-nfr-suite.es.md) | Umbrales de Disponibilidad, RTO/RPO, Portabilidad por criticidad C1–C4 |
| Arquetipos | Monolito modular / microservicios / serverless-event-driven |

## 2. Alcance

- **Aplica a:** todos los sistemas ratificados de la suite (catálogo de sistemas): DT, TMS, WMS, MMS, SIL, UMS, XMS. Los sistemas en `Propuesta` (CMS, BMS, CRM, YMS, NMS, DAP) heredarán estas alternativas al ratificarse.
- **Ambientes soportados:** Desarrollo, QA, Staging, Producción, Disaster Recovery.
- **No cubre:** el detalle de red/gateway/pipeline por sistema (eso vive en cada satélite y en [`reference/infrastructure/`](../../../infrastructure/README.md)); ni la arquitectura lógica de cada dominio (eso vive en los blueprints C4 y arquetipos).

## 3. Principios de despliegue

Derivados de los ADRs de plataforma y del stack autorizado:

1. **Cloud-neutral por diseño** — ningún SDK de nube cruza a Dominio/Aplicación; toda dependencia de infraestructura vive tras un **Puerto** ([ADR-0028](../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)). Cambiar de proveedor = editar un adaptador.
2. **Un binario, muchas topologías** — el mismo contenedor corre en cloud o en datacenter aislado; la topología se selecciona con `DEPLOYMENT_TOPOLOGY` en el contenedor DI de arranque ([ADR-0039](../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)).
3. **Orquestación progresiva** — Fase 1: contenedores OCI sobre cómputo simple / Compose; **Kubernetes v1.28+ desde Fase 3+** ([ADR-0013](../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [stack agnóstico §6](../../stack-tecnologico-autorizado-agnostico.es.md)). No se adopta K8s antes de necesitarlo.
4. **Charts agnósticos al sabor** — un único Helm chart parametrizado debe funcionar igual en EKS, AKS, RKE2, MicroK8s o Kind.
5. **Secretos nunca en claro** — prohibido en charts/Git/ConfigMaps; inyección vía sidecar (Vault) como único patrón aprobado.
6. **Observabilidad vendor-neutral** — OpenTelemetry Collector; Prometheus/Grafana/Loki/Tempo como decisiones de despliegue.
7. **Aislamiento multi-tenant en aplicación** — el control por sucursal/tenant se resuelve SIEMPRE en capa de aplicación ([ADR-0010](../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)); RLS nativa de BD prohibida — idéntico en los tres proveedores.
8. **Verificación local-first** — las puertas de release corren en local (husky/gates), no dependen de CI de servidor ([ADR-0106](../../adrs/core/0106-seguridad-calidad-local-first.es.md)).

## 4. Catálogo de alternativas

<details open>
<summary><strong>Deployment Architecture Hub — índice visual</strong></summary>

```text
┌──────────────────────────────────────────────────────────┐
│ Deployment Architecture Hub                              │
├──────────────────────────────────────────────────────────┤
│ Local Development                                        │
│  ├── Docker              → ../local/docker/              │
│  ├── Kind                → ../local/kind/                │
│  └── Kubernetes Local    → ../local/kubernetes/          │
│                                                          │
│ Production — Kubernetes                                  │
│  ├── Azure AKS           → ../production/azure-aks/      │
│  ├── AWS EKS             → ../production/aws-eks/        │
│  └── On-Premise K8s      → ../production/on-prem-kubernetes/ │
│                                                          │
│ Production — Serverless                                  │
│  ├── Azure Serverless    → ../production/azure-serverless/ │
│  └── AWS Serverless      → ../production/aws-serverless/ │
│                                                          │
│ Comparison                                               │
│  └── Cost / Complexity / Scalability / Operations       │
│                          → ../comparison/deployment-options-matrix.md │
└──────────────────────────────────────────────────────────┘
```

</details>

Cada alternativa registra, como mínimo: **nombre · tipo · ambiente · descripción corta · nivel de complejidad · costos estimados · estado (Proposed/Approved/Deprecated) · fecha de actualización · responsable · enlace al documento · enlace al diagrama**.

| Alternativa | Tipo | Ambiente | Complejidad | Costo est./mes | Estado | Actualizado | Documento |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [Docker](../local/docker/README.md) | Contenedores / Compose | Desarrollo | 🟢 Baja | ~USD 0 (local) | Approved | 2026-07-22 | [doc](../local/docker/README.md) · [diagrama](../local/docker/deployment-diagram.md) |
| [Kind](../local/kind/README.md) | K8s-in-Docker | Desarrollo / QA local | 🟡 Media | ~USD 0 (local) | Approved | 2026-07-22 | [doc](../local/kind/README.md) · [diagrama](../local/kind/deployment-diagram.md) |
| [Kubernetes Local](../local/kubernetes/README.md) | K8s local (k3d/Rancher) | Desarrollo / pre-prod | 🟡 Media | ~USD 0 (local) | Proposed | 2026-07-22 | [doc](../local/kubernetes/README.md) · [diagrama](../local/kubernetes/deployment-diagram.md) |
| [Azure AKS](../production/azure-aks/README.md) | K8s gestionado (cloud) | Producción / DR | 🟠 Alta | rango medio-alto | Proposed | 2026-07-22 | [doc](../production/azure-aks/README.md) · [diagrama](../production/azure-aks/deployment-diagram.md) |
| [AWS EKS](../production/aws-eks/README.md) | K8s gestionado (cloud) | Producción / DR | 🟠 Alta | rango medio-alto | Proposed | 2026-07-22 | [doc](../production/aws-eks/README.md) · [diagrama](../production/aws-eks/deployment-diagram.md) |
| [On-Premise K8s](../production/on-prem-kubernetes/README.md) | K8s autogestionado | Producción soberana / DR | 🔴 Muy alta | CAPEX + OPEX | Proposed | 2026-07-22 | [doc](../production/on-prem-kubernetes/README.md) · [diagrama](../production/on-prem-kubernetes/deployment-diagram.md) |
| [Azure Serverless](../production/azure-serverless/README.md) | Serverless / PaaS | Producción elástica | 🟡 Media | pago por uso | Proposed | 2026-07-22 | [doc](../production/azure-serverless/README.md) · [diagrama](../production/azure-serverless/deployment-diagram.md) |
| [AWS Serverless](../production/aws-serverless/README.md) | Serverless / PaaS | Producción elástica | 🟡 Media | pago por uso | Proposed | 2026-07-22 | [doc](../production/aws-serverless/README.md) · [diagrama](../production/aws-serverless/deployment-diagram.md) |

> **Responsable de todas las alternativas:** Architecture Board. El estado `Approved` se reserva para alternativas con ADR aceptado y al menos un despliegue verificado; el resto queda `Proposed` hasta su ratificación.

## 5. Convención de diagramas de despliegue

Todos los *Deployment Diagram* del Hub usan **Mermaid** y diferencian explícitamente las capas, de arriba hacia abajo:

```text
Internet / Usuarios
        ↓
Edge / Security      (DNS · CDN · WAF · Load Balancer)
        ↓
Application Layer    (Frontend Web · BFF · Mobile Backend · API Gateway)
        ↓
Service Layer        (Servicios · Workers · Background/Scheduled Jobs)
        ↓
Messaging            (Message Broker · Event Bus)
        ↓
Data Layer           (Bases de datos · Cache · Object Storage)
        ↓
External Systems     (MMS · UMS · XMS · IdP/IAM · otros satélites)
```

Cada diagrama representa, cuando aplica: usuarios, DNS, CDN, WAF, Load Balancer, API Gateway, Frontend, BFF, servicios, workers, broker, BD, cache, object storage, observabilidad (logs/métricas/tracing), secret management, identity/IAM, CI/CD, container registry, redes/subnets/firewalls y sistemas externos de la suite.

## 6. Criterios de selección

| Criterio | Pregunta que responde | Referencia |
| :-- | :-- | :-- |
| Ambiente | ¿Desarrollo, QA, Staging, Producción o DR? | §4 catálogo |
| Fase del sistema | ¿Fase 1–2 (Compose) o Fase 3+ (Kubernetes)? | [ADR-0013](../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) |
| Soberanía de datos | ¿PII debe permanecer on-premise / air-gapped? | [Escenarios multinube §4-5](../../escenarios-despliegue-multinube.es.md) |
| Elasticidad | ¿Carga event-driven / picos impredecibles? | Arquetipo serverless |
| Compliance | ¿RGPD / ISO 27001 estricto? | [Escenarios multinube](../../escenarios-despliegue-multinube.es.md) |
| Costo | ¿CAPEX (on-prem) vs OPEX (cloud/serverless)? | §7 + [matriz](../comparison/deployment-options-matrix.md) |
| Operación | ¿Hay equipo SRE/plataforma o se prefiere gestionado? | §12 requisitos técnicos |

## 7. Costos estimados

Cada alternativa incluye su sección **Estimated Infrastructure Cost** con: costo mensual estimado, costo anual, costo de implementación inicial y costo operativo. Para On-Premise se desglosa **CAPEX / OPEX / licenciamiento / energía / soporte / hardware / renovación / personal**. Los costos se expresan como **estimaciones con rangos**, declarando siempre: región, supuestos de carga, número de usuarios, requests, storage, tráfico, número de servicios y ambientes considerados. **No se inventan precios exactos** cuando no hay datos suficientes: se usan rangos y se explican las variables que los afectan.

## 8. Requerimientos técnicos, complejidad, escalabilidad, HA, observabilidad, seguridad y operación

Cada alternativa documenta de forma homogénea:

- **Infraestructura:** CPU, RAM, Storage, Networking.
- **Software:** Kubernetes/runtime, contenedores, bases de datos, messaging.
- **Seguridad:** IAM, secretos, cifrado, WAF, seguridad de red — contra la [matriz NFR §Seguridad/Privacidad](../../matriz-nfr-suite.es.md).
- **Observabilidad:** logs, métricas, trazas, alertas (OpenTelemetry).
- **DevOps:** CI/CD, container registry, IaC (Helm/Terraform), GitOps.
- **Operación:** SRE, backup, disaster recovery, monitoreo, gestión de incidentes.
- **Escalabilidad / Alta disponibilidad:** modelo de escalado (HPA/serverless) y objetivos de disponibilidad, RTO y RPO contra la [matriz NFR §Recuperación](../../matriz-nfr-suite.es.md).

## 9. Matriz comparativa

La comparación completa (complejidad · escalabilidad · HA · costo · operación · time-to-market) y la **recomendación por ambiente** (Desarrollo / QA / Staging / Producción / DR) viven en:

**→ [Matriz de opciones de despliegue](../comparison/deployment-options-matrix.md)**

## 10. Relación con UNIMAR-ARCH y trazabilidad de capas

El Hub mantiene separación explícita y trazabilidad entre capas:

| Capa | Dónde vive | Enlace |
| :-- | :-- | :-- |
| Arquitectura **lógica** | Blueprints C4 (niveles 1–3), arquetipos | [C4](../../blueprints/especificacion-topologia-c4.es.md) · arquetipos |
| Arquitectura **física** | Topología de referencia de infraestructura | [Hub de Infraestructura](../../../infrastructure/README.md) |
| Arquitectura **de despliegue** | **Este Hub** (8 alternativas) | [catálogo §4](#4-catálogo-de-alternativas) |
| Arquitectura **de infraestructura** | IaC (Terraform/Bicep/Helm) por alternativa + satélite | cada `README` de alternativa |
| Arquitectura **de operación** | Runbooks, DR, observabilidad, SRE | §8 de cada alternativa + [ADR-0013](../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) |

Cada alternativa registra sus metadatos de gobierno: `Architecture ID · Name · Environment · Status · Owner · Version · Created/Updated · Applicable Products · Applicable Suites · Decision Records · Diagram · Cost Model · Technical Requirements`. El estado gobernado es uno de **Proposed · Approved · Active · Deprecated** y se publica en este catálogo; los ADRs asociados se registran en la [matriz de ADRs](../../adrs/matriz-adr.es.md).

## 11. Cómo usar el Hub

1. Identifica el **ambiente** (desarrollo / QA / staging / producción / DR).
2. Aplica los **criterios de selección** (§6) y consulta la **matriz comparativa** (§9).
3. Abre el **documento de la alternativa** elegida y su **diagrama de despliegue**.
4. Verifica sus **requerimientos técnicos, costos y objetivos NFR** (§7-8).
5. Registra la decisión de adopción por producto en el `DECISIONS.md` del satélite (o del core si es transversal) y cualquier hallazgo en `GAPS.md`.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
